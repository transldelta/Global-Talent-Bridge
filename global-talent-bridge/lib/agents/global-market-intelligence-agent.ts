import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

type Corridor = {
  id: string
  source_country: string
  target_country: string
  sector: string
  language_requirement: string | null
  visa_pathway: string | null
  recognition_requirement: string | null
  estimated_supply_score: number
  estimated_demand_score: number
  opportunity_score: number
  priority_level: string
  status: string
  notes: string | null
}

type CandidateSource = {
  id: string
  source_name: string
  source_country: string | null
  language: string | null
  source_type: string | null
  estimated_audience: number
  priority_score: number
  status: string | null
}

/**
 * Berechnet opportunity_score aus supply + demand (0–100)
 * Formel: gewichteter Durchschnitt, Nachfrage zählt stärker (60%)
 */
function calcOpportunityScore(supply: number, demand: number): number {
  return Math.min(Math.round(supply * 0.4 + demand * 0.6), 100)
}

/**
 * Bestimmt priority_level anhand opportunity_score
 */
function derivePriorityLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

/**
 * Erzeugt einen lesbaren Alert-Text für einen Korridor
 */
function buildCorridorAlert(c: Corridor, newScore: number, oldScore: number): string {
  const arrow = `${c.source_country} → ${c.target_country}`
  const sector = c.sector
  const delta = newScore - oldScore

  if (c.priority_level === 'critical') {
    return `🔥 ${arrow} (${sector}) ist ein kritischer Korridor — Opportunity Score ${newScore}/100. Sofortige Priorisierung empfohlen.`
  }
  if (delta > 0) {
    return `📈 ${arrow} (${sector}) Score gestiegen auf ${newScore}/100 (+${delta}). Nachfrage wächst.`
  }
  return `🌍 ${arrow} (${sector}) — Opportunity Score ${newScore}/100. Priorität: ${c.priority_level}.`
}

/**
 * Global Market Intelligence Agent
 *
 * Analysiert migration_corridors + candidate_sources.
 * Berechnet opportunity_scores, setzt priority_levels.
 * Erzeugt CEO-Empfehlungen als agent_suggestions + CEO-Alerts als agent_notifications.
 *
 * ✅ Darf: analysieren, priorisieren, Empfehlungen erzeugen, Alerts erstellen
 * ❌ Darf NICHT: werben, posten, E-Mails/WhatsApp senden
 */
export async function runGlobalMarketIntelligenceAgent(): Promise<{
  corridorsAnalyzed: number
  sourcesAnalyzed: number
  scoresUpdated: number
  suggestionsCreated: number
  alertsCreated: number
}> {
  const supabase = createAdminClient()

  let corridorsAnalyzed = 0
  let sourcesAnalyzed = 0
  let scoresUpdated = 0
  let suggestionsCreated = 0
  let alertsCreated = 0

  try {
    // ── 1. Migration Corridors lesen ──────────────────────────────────────────
    const { data: corridors, error: corrErr } = await supabase
      .from('migration_corridors')
      .select('*')
      .eq('status', 'active')
      .order('opportunity_score', { ascending: false })

    if (corrErr) {
      console.error('[gmi-agent] corridors error:', corrErr.message)
      throw new Error(corrErr.message)
    }

    corridorsAnalyzed = (corridors ?? []).length

    // ── 2. Candidate Sources lesen ────────────────────────────────────────────
    const { data: sources, error: srcErr } = await supabase
      .from('candidate_sources')
      .select('*')
      .eq('status', 'active')
      .order('priority_score', { ascending: false })

    if (srcErr) {
      console.error('[gmi-agent] sources error:', srcErr.message)
    }

    sourcesAnalyzed = (sources ?? []).length

    // ── 3. Bestehende Suggestions (Deduplication) ─────────────────────────────
    const { data: existingSugg } = await supabase
      .from('agent_suggestions')
      .select('title')
      .eq('status', 'suggested')

    const existingTitles = new Set((existingSugg ?? []).map((s: { title: string }) => s.title))

    const suggestionsToInsert: Array<{
      department_slug: string
      title: string
      description: string
      category: string
      priority: string
      impact_score: number
      effort_score: number
      risk_score: number
      expected_benefit: string
      requires_approval: boolean
    }> = []

    const notificationsToInsert: Array<{
      title: string
      message: string
      severity: string
      department_slug: string
    }> = []

    // ── 4. Opportunity Scores berechnen + aktualisieren ───────────────────────
    const scoreUpdates: Array<{ id: string; opportunity_score: number; priority_level: string }> = []

    for (const corridor of corridors ?? []) {
      const c = corridor as Corridor
      const newScore = calcOpportunityScore(c.estimated_supply_score, c.estimated_demand_score)
      const newPriority = derivePriorityLevel(newScore)

      // Nur updaten wenn sich etwas geändert hat
      if (newScore !== c.opportunity_score || newPriority !== c.priority_level) {
        scoreUpdates.push({ id: c.id, opportunity_score: newScore, priority_level: newPriority })
        scoresUpdated++
      }
    }

    // Batch-Update der Scores
    for (const update of scoreUpdates) {
      await supabase
        .from('migration_corridors')
        .update({ opportunity_score: update.opportunity_score, priority_level: update.priority_level })
        .eq('id', update.id)
    }

    // ── 5. Empfehlungen + Alerts für Top-Korridore ────────────────────────────

    // Korridore neu laden (mit aktualisierten Scores)
    const { data: updatedCorridors } = await supabase
      .from('migration_corridors')
      .select('*')
      .eq('status', 'active')
      .order('opportunity_score', { ascending: false })

    const allCorridors = (updatedCorridors ?? []) as Corridor[]

    // Critical corridors → sofortige Empfehlung
    const criticalCorridors = allCorridors.filter((c) => c.priority_level === 'critical')
    const highCorridors = allCorridors.filter((c) => c.priority_level === 'high')

    for (const c of criticalCorridors) {
      const arrow = `${c.source_country} → ${c.target_country}`
      const title = `🔥 Kritischer Korridor: ${arrow} (${c.sector})`

      if (!existingTitles.has(title)) {
        suggestionsToInsert.push({
          department_slug: 'strategy_vision_department',
          title,
          description: `Korridor ${arrow} im Bereich ${c.sector} hat Opportunity Score ${c.opportunity_score}/100 (Nachfrage ${c.estimated_demand_score}, Angebot ${c.estimated_supply_score}). ${c.notes ?? ''} Empfehlung: Sofort Kandidaten aus ${c.source_country} für Jobs in ${c.target_country} priorisieren.`,
          category: 'growth',
          priority: 'critical',
          impact_score: Math.round(c.opportunity_score / 10),
          effort_score: 5,
          risk_score: 2,
          expected_benefit: `Erste Vermittlungen im Korridor ${arrow} → Beweis des globalen GTB-Werts → höherer Plattform-Wert.`,
          requires_approval: false,
        })
        existingTitles.add(title)

        notificationsToInsert.push({
          title: `🔥 Krit. Korridor: ${arrow}`,
          message: buildCorridorAlert(c, c.opportunity_score, 0),
          severity: 'critical',
          department_slug: 'strategy_vision_department',
        })
        alertsCreated++
      }
    }

    // High-Priority Korridore → Empfehlung
    for (const c of highCorridors.slice(0, 3)) {
      const arrow = `${c.source_country} → ${c.target_country}`
      const title = `📈 Hohe Priorität: ${arrow} (${c.sector})`

      if (!existingTitles.has(title)) {
        suggestionsToInsert.push({
          department_slug: 'strategy_vision_department',
          title,
          description: `Korridor ${arrow} (${c.sector}) mit Opportunity Score ${c.opportunity_score}/100. Visa: ${c.visa_pathway ?? 'zu recherchieren'}. Sprachanforderung: ${c.language_requirement ?? 'unbekannt'}. ${c.notes ?? ''}`,
          category: 'growth',
          priority: 'high',
          impact_score: Math.round(c.opportunity_score / 10),
          effort_score: 4,
          risk_score: 2,
          expected_benefit: `Ausbau GTB auf internationalen Korridor → diversifizierte Einnahmen, nicht DE-abhängig.`,
          requires_approval: false,
        })
        existingTitles.add(title)
      }
    }

    // Kandidatenquellen > 500k Reichweite → alert
    const highValueSources = (sources ?? []).filter(
      (s: CandidateSource) => s.estimated_audience > 500000 && s.priority_score >= 75
    )

    if (highValueSources.length > 0) {
      const title = `🎯 ${highValueSources.length} hochwertige Kandidatenquelle${highValueSources.length > 1 ? 'n' : ''} identifiziert`
      if (!existingTitles.has(title)) {
        suggestionsToInsert.push({
          department_slug: 'sales_employer_department',
          title,
          description: `${highValueSources.length} Kandidatenquellen mit >500k Reichweite und hohem Priority Score: ${highValueSources.slice(0, 3).map((s: CandidateSource) => s.source_name).join(', ')}. Partnerschaft oder Content-Strategie aufbauen.`,
          category: 'growth',
          priority: 'high',
          impact_score: 8,
          effort_score: 6,
          risk_score: 1,
          expected_benefit: 'Zugang zu Millionen qualifizierter Kandidaten ohne Paid Ads.',
          requires_approval: false,
        })
        existingTitles.add(title)

        notificationsToInsert.push({
          title: `🎯 ${highValueSources.length} große Kandidatenquellen bereit`,
          message: `${highValueSources.slice(0, 2).map((s: CandidateSource) => `${s.source_name} (${s.source_country ?? ''})`).join(', ')} — organische Partnerschaft möglich. /admin/global/sources`,
          severity: 'info',
          department_slug: 'sales_employer_department',
        })
        alertsCreated++
      }
    }

    // Gesamtübersicht Alert (einmalig)
    const overviewTitle = `🌍 Global Market: ${criticalCorridors.length} kritische, ${highCorridors.length} hohe Priorität Korridore`
    if (!existingTitles.has(overviewTitle) && corridorsAnalyzed > 0) {
      notificationsToInsert.push({
        title: overviewTitle,
        message: `${corridorsAnalyzed} aktive Migrations-Korridore analysiert. Top: ${allCorridors[0]?.source_country} → ${allCorridors[0]?.target_country} (${allCorridors[0]?.sector}, Score ${allCorridors[0]?.opportunity_score}). /admin/global/corridors`,
        severity: criticalCorridors.length > 0 ? 'warning' : 'info',
        department_slug: 'strategy_vision_department',
      })
      alertsCreated++
    }

    // ── 6. DB-Writes ──────────────────────────────────────────────────────────
    if (suggestionsToInsert.length > 0) {
      const { error } = await supabase.from('agent_suggestions').insert(suggestionsToInsert)
      if (!error) suggestionsCreated = suggestionsToInsert.length
      else console.error('[gmi-agent] suggestions insert error:', error.message)
    }

    if (notificationsToInsert.length > 0) {
      await supabase.from('agent_notifications').insert(notificationsToInsert)
    }

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('[gmi-agent] Error:', msg)

    await supabase.from('system_logs').insert({
      agent_name: 'global_market_intelligence_agent',
      status: 'error',
      message: `GMI-Agent Fehler: ${msg}`,
    })

    return { corridorsAnalyzed, sourcesAnalyzed, scoresUpdated, suggestionsCreated, alertsCreated }
  }

  // ── 7. System-Log ─────────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    agent_name: 'global_market_intelligence_agent',
    status: 'success',
    message: `GMI-Agent: ${corridorsAnalyzed} Korridore + ${sourcesAnalyzed} Quellen analysiert. ${scoresUpdated} Scores aktualisiert. ${suggestionsCreated} Empfehlungen + ${alertsCreated} Alerts erstellt.`,
  })

  return { corridorsAnalyzed, sourcesAnalyzed, scoresUpdated, suggestionsCreated, alertsCreated }
}
