import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Corridor Intelligence Agent
 *
 * Analysiert corridor_intelligence Einträge, aktualisiert Scores, erstellt
 * strategische CEO-Empfehlungen und Benachrichtigungen.
 *
 * ✅ analysieren  ✅ priorisieren  ✅ Empfehlungen erzeugen
 * ❌ werben  ❌ posten  ❌ E-Mails senden  ❌ WhatsApp senden  ❌ externe APIs
 *
 * Alle Aktionen werden in system_logs protokolliert.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type CorridorIntelligence = {
  id: string
  corridor_id: string
  top_professions: string[]
  language_requirements: Record<string, unknown>
  visa_pathways: unknown[]
  recognition_requirements: Record<string, unknown>
  migration_difficulty: number
  demand_level: number
  opportunity_score: number
  recommended_channels: string[]
  recommended_landingpage_slug: string | null
  notes: string | null
}

type MigrationCorridor = {
  id: string
  source_country: string
  target_country: string
  sector: string
  status: string
  opportunity_score: number
  supply_score: number
  demand_score: number
  priority_level: string | null
}

type CampaignRecommendation = {
  id: string
  corridor_id: string
  campaign_priority: string
  estimated_reach: number
  status: string
}

// ─── Priority Derivation ───────────────────────────────────────────────────────

function derivePriority(score: number): string {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

// ─── Opportunity Score Formula ────────────────────────────────────────────────
// Combines corridor demand with CI demand_level (weighted toward demand)
// Full formula: corridor_demand * 0.4 + corridor_supply * 0.2 + ci_demand * 0.4

function computeOpportunityScore(
  corridorDemand: number,
  corridorSupply: number,
  ciDemand: number
): number {
  return Math.min(100, Math.round(
    corridorDemand * 0.4 + corridorSupply * 0.2 + ciDemand * 0.4
  ))
}

// ─── Main Agent ───────────────────────────────────────────────────────────────

export async function runCorridorIntelligenceAgent(): Promise<{
  corridorsAnalyzed: number
  scoresUpdated: number
  suggestionsCreated: number
  notificationsCreated: number
  campaignsReviewed: number
}> {
  const supabase = createAdminClient()
  const agentName = 'corridor-intelligence-agent'

  let scoresUpdated = 0
  let suggestionsCreated = 0
  let notificationsCreated = 0

  // ── 1. Load corridor_intelligence with migration_corridors JOIN ──────────────
  const { data: ciRows, error: ciError } = await supabase
    .from('corridor_intelligence')
    .select('*')

  if (ciError) {
    await supabase.from('system_logs').insert({
      action: `${agentName}:error`,
      details: { error: ciError.message, step: 'load_corridor_intelligence' },
    })
    throw new Error(`CI Agent: failed to load corridor_intelligence: ${ciError.message}`)
  }

  const { data: corridors, error: corrError } = await supabase
    .from('migration_corridors')
    .select('*')
    .eq('status', 'active')

  if (corrError || !corridors) {
    await supabase.from('system_logs').insert({
      action: `${agentName}:error`,
      details: { error: corrError?.message, step: 'load_migration_corridors' },
    })
    throw new Error(`CI Agent: failed to load migration_corridors`)
  }

  const corridorMap = new Map<string, MigrationCorridor>(
    (corridors as MigrationCorridor[]).map((c) => [c.id, c])
  )

  const ciList = (ciRows ?? []) as CorridorIntelligence[]

  // ── 2. Compute + update opportunity scores ───────────────────────────────────
  const updateBatch: Array<{ id: string; opportunity_score: number; updated_at: string }> = []

  for (const ci of ciList) {
    const corridor = corridorMap.get(ci.corridor_id)
    if (!corridor) continue

    const newScore = computeOpportunityScore(
      corridor.demand_score ?? 50,
      corridor.supply_score ?? 50,
      ci.demand_level
    )

    if (newScore !== ci.opportunity_score) {
      updateBatch.push({
        id: ci.id,
        opportunity_score: newScore,
        updated_at: new Date().toISOString(),
      })
    }
  }

  for (const upd of updateBatch) {
    const { error } = await supabase
      .from('corridor_intelligence')
      .update({ opportunity_score: upd.opportunity_score, updated_at: upd.updated_at })
      .eq('id', upd.id)

    if (!error) scoresUpdated++
  }

  // ── 3. Sort corridors by opportunity_score (descending, using updated values) ─
  const enrichedCI = ciList.map((ci) => {
    const updated = updateBatch.find((u) => u.id === ci.id)
    return {
      ...ci,
      opportunity_score: updated ? updated.opportunity_score : ci.opportunity_score,
      corridor: corridorMap.get(ci.corridor_id),
    }
  }).filter((ci) => ci.corridor !== undefined)
    .sort((a, b) => b.opportunity_score - a.opportunity_score)

  // ── 4. Load existing suggestions to avoid duplicates ────────────────────────
  const { data: existingSugg } = await supabase
    .from('agent_suggestions')
    .select('title')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const existingTitles = new Set((existingSugg ?? []).map((s: { title: string }) => s.title))

  // ── 5. Generate suggestions for critical + top-3 high corridors ──────────────
  const toSuggest = enrichedCI.filter(
    (ci) => derivePriority(ci.opportunity_score) === 'critical' ||
            enrichedCI.slice(0, 3).includes(ci)
  )

  for (const ci of toSuggest) {
    const c = ci.corridor!
    const label = `${c.source_country} → ${c.target_country} (${c.sector})`
    const priority = derivePriority(ci.opportunity_score)

    const title = `[CI] ${label}: Opportunity Score ${ci.opportunity_score}/100`
    if (existingTitles.has(title)) continue

    const professions = Array.isArray(ci.top_professions)
      ? ci.top_professions.slice(0, 3).join(', ')
      : 'N/A'
    const channels = Array.isArray(ci.recommended_channels)
      ? ci.recommended_channels.slice(0, 3).join(', ')
      : 'N/A'

    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name: agentName,
      title,
      description: `Korridor ${label} hat einen Opportunity Score von ${ci.opportunity_score}/100 (Priorität: ${priority}). ` +
        `Top-Berufe: ${professions}. ` +
        `Empfohlene Kanäle: ${channels}. ` +
        (ci.notes ? `Hinweis: ${ci.notes}` : ''),
      priority,
      metadata: {
        corridor_id: ci.corridor_id,
        source_country: c.source_country,
        target_country: c.target_country,
        sector: c.sector,
        opportunity_score: ci.opportunity_score,
        migration_difficulty: ci.migration_difficulty,
        demand_level: ci.demand_level,
        landingpage_slug: ci.recommended_landingpage_slug,
      },
    })

    if (!error) {
      suggestionsCreated++
      existingTitles.add(title)
    }
  }

  // ── 6. Generate notifications for critical corridors ─────────────────────────
  const criticalCI = enrichedCI.filter(
    (ci) => derivePriority(ci.opportunity_score) === 'critical'
  )

  for (const ci of criticalCI) {
    const c = ci.corridor!
    const label = `${c.source_country} → ${c.target_country}`
    const notifTitle = `🔥 Kritischer Korridor: ${label}`

    const { data: existingNotif } = await supabase
      .from('agent_notifications')
      .select('id')
      .eq('title', notifTitle)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)

    if (existingNotif && existingNotif.length > 0) continue

    const { error } = await supabase.from('agent_notifications').insert({
      agent_name: agentName,
      title: notifTitle,
      message: `Korridor ${label} (${c.sector}) hat einen kritischen Opportunity Score von ${ci.opportunity_score}/100. ` +
        `Sofortige CEO-Aufmerksamkeit empfohlen. Landingpage-Slug: /${ci.recommended_landingpage_slug ?? 'pending'}`,
      notification_type: 'alert',
      priority: 'critical',
      metadata: {
        corridor_id: ci.corridor_id,
        opportunity_score: ci.opportunity_score,
      },
    })

    if (!error) notificationsCreated++
  }

  // ── 7. Load campaigns for review count ───────────────────────────────────────
  const { data: campaigns } = await supabase
    .from('campaign_recommendations')
    .select('id, corridor_id, campaign_priority, estimated_reach, status')

  const campaignsReviewed = (campaigns ?? []).length

  // ── 8. System log ─────────────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    action: `${agentName}:completed`,
    details: {
      corridors_analyzed: enrichedCI.length,
      scores_updated: scoresUpdated,
      suggestions_created: suggestionsCreated,
      notifications_created: notificationsCreated,
      campaigns_reviewed: campaignsReviewed,
      critical_corridors: criticalCI.length,
      top_corridor: enrichedCI[0]
        ? `${enrichedCI[0].corridor?.source_country} → ${enrichedCI[0].corridor?.target_country}: ${enrichedCI[0].opportunity_score}`
        : 'none',
    },
  })

  return {
    corridorsAnalyzed: enrichedCI.length,
    scoresUpdated,
    suggestionsCreated,
    notificationsCreated,
    campaignsReviewed,
  }
}
