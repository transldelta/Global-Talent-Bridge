import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Global Employer Acquisition Agent
 *
 * Analysiert employer_acquisition_sources, berechnet/aktualisiert Scores,
 * erstellt CEO-Empfehlungen und Notifications.
 *
 * ✅ analysieren  ✅ priorisieren  ✅ Empfehlungen erzeugen
 * ❌ E-Mails senden  ❌ WhatsApp senden  ❌ Werbung  ❌ externe APIs
 *
 * Alle Aktionen werden in system_logs protokolliert.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type EmployerSource = {
  id: string
  source_name: string
  country: string | null
  sector: string | null
  source_type: string | null
  estimated_employers: number
  quality_score: number
  opportunity_score: number
  acquisition_difficulty: number
  priority_level: string | null
  notes: string | null
  status: string
}

type OutreachRec = {
  id: string
  source_id: string
  status: string
}

// ─── Score formulas ───────────────────────────────────────────────────────────

/**
 * opportunity_score = quality*0.45 + reach_score*0.25 + ease*0.30
 * reach_score: log-normalised employer count (100 = 15.000+)
 * ease = 100 - acquisition_difficulty
 */
function computeOpportunityScore(
  quality: number,
  estimatedEmployers: number,
  difficulty: number
): number {
  const maxEmployers = 15_000
  const reachScore = Math.min(100, Math.round(
    (Math.log10(Math.max(1, estimatedEmployers)) / Math.log10(maxEmployers)) * 100
  ))
  const ease = 100 - difficulty
  return Math.min(100, Math.round(quality * 0.45 + reachScore * 0.25 + ease * 0.30))
}

function derivePriority(score: number): string {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

// ─── Outreach channel recommendation logic ───────────────────────────────────

function recommendChannel(sourceType: string | null): string {
  const channelMap: Record<string, string> = {
    hospital_group:       'Direct HR contact / NHS Jobs portal',
    care_home_group:      'Association newsletter / LinkedIn outreach',
    it_company:           'LinkedIn / direct email to HR',
    logistics_company:    'Industry fair / LinkedIn',
    industrial_company:   'Trade association / email',
    recruiter:            'B2B partnership proposal',
    staffing_agency:      'Partnership / revenue-share proposal',
    employer_association: 'Association event / official letter',
  }
  return channelMap[sourceType ?? ''] ?? 'LinkedIn / direct email'
}

function recommendMessageType(sector: string | null): string {
  const msgMap: Record<string, string> = {
    'Pflege':                   'case_study_nursing_shortage',
    'IT / Software':            'talent_pipeline_offer',
    'Technik / Ingenieurwesen': 'engineering_talent_proposal',
    'Industrie / Produktion':   'industrial_talent_partnership',
  }
  return msgMap[sector ?? ''] ?? 'general_partnership_proposal'
}

// ─── Main Agent ───────────────────────────────────────────────────────────────

export async function runGlobalEmployerAcquisitionAgent(): Promise<{
  sourcesAnalyzed: number
  scoresUpdated: number
  outreachRecsCreated: number
  suggestionsCreated: number
  notificationsCreated: number
}> {
  const supabase = createAdminClient()
  const agentName = 'global-employer-acquisition-agent'

  let scoresUpdated = 0
  let outreachRecsCreated = 0
  let suggestionsCreated = 0
  let notificationsCreated = 0

  // ── 1. Load all active sources ──────────────────────────────────────────────
  const { data: rawSources, error: srcErr } = await supabase
    .from('employer_acquisition_sources')
    .select('*')
    .eq('status', 'active')

  if (srcErr) {
    await supabase.from('system_logs').insert({
      action: `${agentName}:error`,
      details: { error: srcErr.message, step: 'load_sources' },
    })
    throw new Error(`GEA Agent: ${srcErr.message}`)
  }

  const sources = (rawSources ?? []) as EmployerSource[]

  // ── 2. Recompute opportunity_score + priority_level ─────────────────────────
  const updates: Array<{ id: string; opportunity_score: number; priority_level: string }> = []

  for (const src of sources) {
    const newScore = computeOpportunityScore(
      src.quality_score,
      src.estimated_employers,
      src.acquisition_difficulty
    )
    const newPriority = derivePriority(newScore)
    if (newScore !== src.opportunity_score || newPriority !== src.priority_level) {
      updates.push({ id: src.id, opportunity_score: newScore, priority_level: newPriority })
    }
  }

  for (const upd of updates) {
    const { error } = await supabase
      .from('employer_acquisition_sources')
      .update({ opportunity_score: upd.opportunity_score, priority_level: upd.priority_level, updated_at: new Date().toISOString() })
      .eq('id', upd.id)
    if (!error) scoresUpdated++
  }

  // Enrich with updated scores
  const enriched = sources.map((s) => {
    const upd = updates.find((u) => u.id === s.id)
    return { ...s, opportunity_score: upd ? upd.opportunity_score : s.opportunity_score, priority_level: upd ? upd.priority_level : s.priority_level }
  }).sort((a, b) => b.opportunity_score - a.opportunity_score)

  // ── 3. Create outreach recommendations for sources without one ──────────────
  const { data: existingRecs } = await supabase
    .from('employer_outreach_recommendations')
    .select('source_id')

  const existingSourceIds = new Set((existingRecs ?? []).map((r: { source_id: string }) => r.source_id))

  for (const src of enriched) {
    if (existingSourceIds.has(src.id)) continue
    const { error } = await supabase.from('employer_outreach_recommendations').insert({
      source_id: src.id,
      recommended_message_type: recommendMessageType(src.sector),
      recommended_channel: recommendChannel(src.source_type),
      priority_level: src.priority_level ?? 'medium',
      notes: `Automatisch generiert für "${src.source_name}" (${src.country}). Score: ${src.opportunity_score}/100.`,
      status: 'draft',
    })
    if (!error) outreachRecsCreated++
  }

  // ── 4. Load existing suggestions for deduplication ──────────────────────────
  const { data: existingSugg } = await supabase
    .from('agent_suggestions')
    .select('title')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  const existingTitles = new Set((existingSugg ?? []).map((s: { title: string }) => s.title))

  // ── 5. Suggestions for critical + top-3 sources ─────────────────────────────
  const toSuggest = enriched.filter(
    (s) => s.priority_level === 'critical' || enriched.slice(0, 3).includes(s)
  )

  for (const src of toSuggest) {
    const title = `[GEA] ${src.source_name}: Opportunity ${src.opportunity_score}/100`
    if (existingTitles.has(title)) continue

    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name: agentName,
      title,
      description:
        `Arbeitgeberquelle "${src.source_name}" (${src.country ?? '—'}) · ${src.sector ?? '—'} · ` +
        `Typ: ${src.source_type ?? '—'} · ~${src.estimated_employers.toLocaleString('de-DE')} Arbeitgeber · ` +
        `Opportunity: ${src.opportunity_score}/100 · Empfohlen: ${recommendChannel(src.source_type)}. ` +
        (src.notes ? src.notes : ''),
      priority: src.priority_level ?? 'medium',
      metadata: {
        source_id: src.id,
        source_name: src.source_name,
        country: src.country,
        sector: src.sector,
        opportunity_score: src.opportunity_score,
        estimated_employers: src.estimated_employers,
      },
    })
    if (!error) {
      suggestionsCreated++
      existingTitles.add(title)
    }
  }

  // ── 6. Notifications for critical sources ───────────────────────────────────
  const criticalSources = enriched.filter((s) => s.priority_level === 'critical')

  for (const src of criticalSources) {
    const notifTitle = `🏢 Kritische Arbeitgeberquelle: ${src.source_name}`
    const { data: existing } = await supabase
      .from('agent_notifications')
      .select('id')
      .eq('title', notifTitle)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
    if (existing && existing.length > 0) continue

    const { error } = await supabase.from('agent_notifications').insert({
      agent_name: agentName,
      title: notifTitle,
      message:
        `"${src.source_name}" (${src.country} · ${src.sector}) hat Opportunity Score ${src.opportunity_score}/100. ` +
        `~${src.estimated_employers.toLocaleString('de-DE')} Arbeitgeber erreichbar. ` +
        `Empfohlen: ${recommendChannel(src.source_type)}.`,
      notification_type: 'alert',
      priority: 'critical',
      metadata: { source_id: src.id, opportunity_score: src.opportunity_score },
    })
    if (!error) notificationsCreated++
  }

  // ── 7. Load outreach rec count ────────────────────────────────────────────────
  const { data: allRecs } = await supabase
    .from('employer_outreach_recommendations')
    .select('id, status')

  // ── 8. System log ─────────────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    action: `${agentName}:completed`,
    details: {
      sources_analyzed: enriched.length,
      scores_updated: scoresUpdated,
      outreach_recs_created: outreachRecsCreated,
      suggestions_created: suggestionsCreated,
      notifications_created: notificationsCreated,
      critical_sources: criticalSources.length,
      total_outreach_recs: (allRecs ?? []).length,
      top_source: enriched[0] ? `${enriched[0].source_name}: ${enriched[0].opportunity_score}` : 'none',
    },
  })

  return { sourcesAnalyzed: enriched.length, scoresUpdated, outreachRecsCreated, suggestionsCreated, notificationsCreated }
}
