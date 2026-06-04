import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Global Candidate Acquisition Agent
 *
 * Analysiert candidate_acquisition_sources und landingpage_recommendations.
 * Berechnet/aktualisiert Scores, erstellt CEO-Empfehlungen und Notifications.
 *
 * ✅ analysieren  ✅ priorisieren  ✅ Empfehlungen erzeugen
 * ❌ werben  ❌ posten  ❌ E-Mails senden  ❌ WhatsApp senden  ❌ externe APIs
 *
 * Alle Aktionen werden in system_logs protokolliert.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type AcquisitionSource = {
  id: string
  source_name: string
  country: string | null
  language: string | null
  source_type: string | null
  profession_focus: string | null
  estimated_audience: number
  quality_score: number
  opportunity_score: number
  priority_level: string | null
  acquisition_difficulty: number
  notes: string | null
  status: string
}

type LandingpageRec = {
  id: string
  corridor_id: string | null
  title: string
  language: string
  slug: string
  target_audience: string | null
  priority: string
  status: string
}

// ─── Score formulas ───────────────────────────────────────────────────────────

/**
 * opportunity_score = quality * 0.4 + reach_score * 0.3 + ease * 0.3
 * reach_score: normalised log of estimated_audience (0-100)
 * ease: 100 - acquisition_difficulty
 */
function computeOpportunityScore(
  quality: number,
  estimatedAudience: number,
  difficulty: number
): number {
  // Normalise audience to 0-100 via log scale (100 = 10M+)
  const maxAudience = 10_000_000
  const reachScore = Math.min(100, Math.round(
    (Math.log10(Math.max(1, estimatedAudience)) / Math.log10(maxAudience)) * 100
  ))
  const ease = 100 - difficulty
  return Math.min(100, Math.round(quality * 0.4 + reachScore * 0.3 + ease * 0.3))
}

function derivePriority(score: number): string {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

// ─── Main Agent ───────────────────────────────────────────────────────────────

export async function runGlobalCandidateAcquisitionAgent(): Promise<{
  sourcesAnalyzed: number
  scoresUpdated: number
  landingpagesReviewed: number
  suggestionsCreated: number
  notificationsCreated: number
}> {
  const supabase = createAdminClient()
  const agentName = 'global-candidate-acquisition-agent'

  let scoresUpdated = 0
  let suggestionsCreated = 0
  let notificationsCreated = 0

  // ── 1. Load all active sources ──────────────────────────────────────────────
  const { data: sourcesRaw, error: srcError } = await supabase
    .from('candidate_acquisition_sources')
    .select('*')
    .eq('status', 'active')

  if (srcError) {
    await supabase.from('system_logs').insert({
      action: `${agentName}:error`,
      details: { error: srcError.message, step: 'load_sources' },
    })
    throw new Error(`GCA Agent: failed to load sources: ${srcError.message}`)
  }

  const sources = (sourcesRaw ?? []) as AcquisitionSource[]

  // ── 2. Recompute opportunity_score for each source ──────────────────────────
  const updates: Array<{ id: string; opportunity_score: number; priority_level: string }> = []

  for (const src of sources) {
    const newScore = computeOpportunityScore(
      src.quality_score,
      src.estimated_audience,
      src.acquisition_difficulty
    )
    const newPriority = derivePriority(newScore)

    if (newScore !== src.opportunity_score || newPriority !== src.priority_level) {
      updates.push({ id: src.id, opportunity_score: newScore, priority_level: newPriority })
    }
  }

  for (const upd of updates) {
    const { error } = await supabase
      .from('candidate_acquisition_sources')
      .update({
        opportunity_score: upd.opportunity_score,
        priority_level: upd.priority_level,
        updated_at: new Date().toISOString(),
      })
      .eq('id', upd.id)
    if (!error) scoresUpdated++
  }

  // Enrich sources with updated scores
  const enriched = sources.map((s) => {
    const upd = updates.find((u) => u.id === s.id)
    return {
      ...s,
      opportunity_score: upd ? upd.opportunity_score : s.opportunity_score,
      priority_level: upd ? upd.priority_level : s.priority_level,
    }
  }).sort((a, b) => b.opportunity_score - a.opportunity_score)

  // ── 3. Load existing suggestions (last 7 days) for deduplication ────────────
  const { data: existingSugg } = await supabase
    .from('agent_suggestions')
    .select('title')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const existingTitles = new Set((existingSugg ?? []).map((s: { title: string }) => s.title))

  // ── 4. Generate suggestions for critical + top-3 high sources ───────────────
  const toSuggest = enriched.filter(
    (s) => s.priority_level === 'critical' || enriched.slice(0, 3).includes(s)
  )

  for (const src of toSuggest) {
    const audienceFormatted =
      src.estimated_audience >= 1_000_000
        ? `${(src.estimated_audience / 1_000_000).toFixed(1)}M`
        : src.estimated_audience >= 1_000
          ? `${Math.round(src.estimated_audience / 1_000)}K`
          : String(src.estimated_audience)

    const title = `[GCA] ${src.source_name}: Opportunity ${src.opportunity_score}/100`
    if (existingTitles.has(title)) continue

    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name: agentName,
      title,
      description:
        `Kandidatenquelle "${src.source_name}" (${src.country ?? '—'}) hat einen Opportunity Score von ${src.opportunity_score}/100. ` +
        `Typ: ${src.source_type ?? '—'}. Profession: ${src.profession_focus ?? '—'}. ` +
        `Geschätzte Reichweite: ${audienceFormatted}. Schwierigkeit: ${src.acquisition_difficulty}/100. ` +
        (src.notes ? src.notes : ''),
      priority: src.priority_level ?? 'medium',
      metadata: {
        source_id: src.id,
        source_name: src.source_name,
        country: src.country,
        source_type: src.source_type,
        opportunity_score: src.opportunity_score,
        estimated_audience: src.estimated_audience,
        acquisition_difficulty: src.acquisition_difficulty,
      },
    })
    if (!error) {
      suggestionsCreated++
      existingTitles.add(title)
    }
  }

  // ── 5. Notifications for critical sources ───────────────────────────────────
  const criticalSources = enriched.filter((s) => s.priority_level === 'critical')

  for (const src of criticalSources) {
    const notifTitle = `🎯 Kritische Quelle: ${src.source_name}`

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
        `Quelle "${src.source_name}" (${src.country}) hat einen kritischen Opportunity Score von ${src.opportunity_score}/100. ` +
        `Reichweite: ${src.estimated_audience.toLocaleString('de-DE')} · Typ: ${src.source_type}.`,
      notification_type: 'alert',
      priority: 'critical',
      metadata: {
        source_id: src.id,
        opportunity_score: src.opportunity_score,
      },
    })
    if (!error) notificationsCreated++
  }

  // ── 6. Load landingpages for review count ───────────────────────────────────
  const { data: landingpages } = await supabase
    .from('landingpage_recommendations')
    .select('id, priority, status')

  const landingpagesReviewed = (landingpages ?? []).length

  // ── 7. Suggest critical landingpages not yet live ───────────────────────────
  const criticalLPs = ((landingpages ?? []) as unknown as LandingpageRec[]).filter(
    (lp) => lp.priority === 'critical' && lp.status === 'planned'
  )

  for (const lp of criticalLPs) {
    const title = `[LP] Kritische Landingpage erstellen: /${lp.slug}`
    if (existingTitles.has(title)) continue

    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name: agentName,
      title,
      description:
        `Landingpage "/${lp.slug}" hat kritische Priorität und ist noch nicht live (Status: ${lp.status}). ` +
        `Zielgruppe: ${lp.target_audience ?? '—'}. Sprache: ${lp.language}.`,
      priority: 'critical',
      metadata: { landingpage_id: lp.id, slug: lp.slug, status: lp.status },
    })
    if (!error) {
      suggestionsCreated++
      existingTitles.add(title)
    }
  }

  // ── 8. System log ─────────────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    action: `${agentName}:completed`,
    details: {
      sources_analyzed: enriched.length,
      scores_updated: scoresUpdated,
      landingpages_reviewed: landingpagesReviewed,
      suggestions_created: suggestionsCreated,
      notifications_created: notificationsCreated,
      critical_sources: criticalSources.length,
      top_source: enriched[0]
        ? `${enriched[0].source_name}: ${enriched[0].opportunity_score}`
        : 'none',
    },
  })

  return {
    sourcesAnalyzed: enriched.length,
    scoresUpdated,
    landingpagesReviewed,
    suggestionsCreated,
    notificationsCreated,
  }
}
