import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Migration Intelligence Agent
 *
 * Analysiert migration_intelligence Einträge, berechnet estimated_success_score,
 * setzt risk_level, markiert veraltete Einträge, erstellt CEO-Suggestions + Notifications.
 *
 * ✅ analysieren  ✅ priorisieren  ✅ Empfehlungen erzeugen
 * ❌ Rechtsberatung  ❌ Garantien  ❌ externe APIs  ❌ E-Mails  ❌ WhatsApp  ❌ Zahlungen
 *
 * Alle Aktionen werden in system_logs protokolliert.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type MigrationIntelligenceRow = {
  id: string
  corridor_id: string | null
  source_country: string | null
  target_country: string | null
  sector: string | null
  visa_complexity: number
  recognition_complexity: number
  language_complexity: number
  document_complexity: number
  estimated_success_score: number
  risk_level: string
  status: string
  required_documents: unknown
  language_requirements: unknown
  recognition_steps: unknown
  visa_pathways: unknown
  recommended_next_steps: unknown
}

type CorridorRow = {
  id: string
  opportunity_score: number
  status: string
}

// ─── Score formula ────────────────────────────────────────────────────────────
//
// estimated_success_score =
//   100
//   - visa_complexity         * 0.25
//   - recognition_complexity  * 0.25
//   - language_complexity     * 0.20
//   - document_complexity     * 0.15
//   + opportunity_score       * 0.15
//
// Result clamped to [0, 100]

function computeSuccessScore(
  visaComplexity: number,
  recognitionComplexity: number,
  languageComplexity: number,
  documentComplexity: number,
  opportunityScore: number
): number {
  const raw =
    100
    - visaComplexity        * 0.25
    - recognitionComplexity * 0.25
    - languageComplexity    * 0.20
    - documentComplexity    * 0.15
    + opportunityScore      * 0.15
  return Math.min(100, Math.max(0, Math.round(raw)))
}

// ─── Risk level derivation ────────────────────────────────────────────────────

function deriveRiskLevel(successScore: number): string {
  if (successScore >= 80) return 'low'
  if (successScore >= 60) return 'medium'
  if (successScore >= 40) return 'high'
  return 'critical'
}

// ─── Completeness check ───────────────────────────────────────────────────────

function isIncomplete(row: MigrationIntelligenceRow): boolean {
  return (
    !row.required_documents ||
    !row.language_requirements ||
    !row.recognition_steps ||
    !row.visa_pathways ||
    !row.recommended_next_steps
  )
}

// ─── Main Agent ───────────────────────────────────────────────────────────────

export async function runMigrationIntelligenceAgent(): Promise<{
  entriesAnalyzed: number
  scoresUpdated: number
  markedOutdated: number
  suggestionsCreated: number
  notificationsCreated: number
}> {
  const supabase = createAdminClient()
  const agentName = 'migration-intelligence-agent'

  let scoresUpdated = 0
  let markedOutdated = 0
  let suggestionsCreated = 0
  let notificationsCreated = 0

  // ── 1. Load all migration_intelligence rows ──────────────────────────────────
  const { data: rawRows, error: rowErr } = await supabase
    .from('migration_intelligence')
    .select('*')
    .neq('status', 'outdated')

  if (rowErr) {
    await supabase.from('system_logs').insert({
      agent_name: agentName, status: 'error',
      message: `MI Agent: Fehler beim Laden — ${rowErr.message}`,
    })
    throw new Error(`MI Agent: ${rowErr.message}`)
  }

  const rows = (rawRows ?? []) as MigrationIntelligenceRow[]

  // ── 2. Load corridor opportunity scores ──────────────────────────────────────
  const corridorIds = rows.map((r) => r.corridor_id).filter(Boolean) as string[]
  const { data: rawCorridors } = await supabase
    .from('migration_corridors')
    .select('id, opportunity_score, status')
    .in('id', corridorIds)

  const corridorMap = new Map<string, CorridorRow>()
  for (const c of (rawCorridors ?? []) as CorridorRow[]) {
    corridorMap.set(c.id, c)
  }

  // ── 3. Load existing suggestion titles for 7-day dedup ──────────────────────
  const { data: existingSugg } = await supabase
    .from('agent_suggestions')
    .select('title')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  const existingTitles = new Set((existingSugg ?? []).map((s: { title: string }) => s.title))

  // ── 4. Recompute scores + mark outdated incomplete entries ───────────────────
  for (const row of rows) {
    const corridor = row.corridor_id ? corridorMap.get(row.corridor_id) : null
    const opportunityScore = corridor?.opportunity_score ?? 50

    // Mark as outdated if corridor is no longer active or data is missing
    if (corridor && corridor.status !== 'active') {
      if (row.status !== 'outdated') {
        await supabase
          .from('migration_intelligence')
          .update({ status: 'outdated', updated_at: new Date().toISOString() })
          .eq('id', row.id)
        markedOutdated++
      }
      continue
    }

    const newScore = computeSuccessScore(
      row.visa_complexity,
      row.recognition_complexity,
      row.language_complexity,
      row.document_complexity,
      opportunityScore
    )
    const newRisk = deriveRiskLevel(newScore)
    const incomplete = isIncomplete(row)

    const needsUpdate =
      newScore !== row.estimated_success_score ||
      newRisk  !== row.risk_level ||
      incomplete

    if (needsUpdate) {
      const { error } = await supabase
        .from('migration_intelligence')
        .update({
          estimated_success_score: newScore,
          risk_level:              newRisk,
          status:                  incomplete ? 'draft' : row.status,
          updated_at:              new Date().toISOString(),
        })
        .eq('id', row.id)
      if (!error) scoresUpdated++
    }
  }

  // ── 5. Reload enriched rows for suggestions ──────────────────────────────────
  const { data: enrichedRows } = await supabase
    .from('migration_intelligence')
    .select('id, source_country, target_country, sector, estimated_success_score, risk_level, status')
    .neq('status', 'outdated')
    .order('estimated_success_score', { ascending: false })

  const enriched = (enrichedRows ?? []) as Array<{
    id: string; source_country: string | null; target_country: string | null;
    sector: string | null; estimated_success_score: number; risk_level: string; status: string
  }>

  // ── 6. CEO suggestions for notable corridors ──────────────────────────────────
  // Top-3 (highest success) + all high/critical risk
  const topSuccess   = enriched.slice(0, 3)
  const highRiskRows = enriched.filter((r) => r.risk_level === 'high' || r.risk_level === 'critical')
  const toSuggest    = [...topSuccess, ...highRiskRows].filter(
    (r, i, arr) => arr.findIndex((x) => x.id === r.id) === i
  )

  for (const row of toSuggest) {
    const corrLabel = `${row.source_country ?? '?'} → ${row.target_country ?? '?'} (${row.sector ?? '?'})`
    const suggTitle = `[MI] ${corrLabel}: Erfolg ${row.estimated_success_score}%, Risiko ${row.risk_level}`
    if (existingTitles.has(suggTitle)) continue

    const desc = row.risk_level === 'high' || row.risk_level === 'critical'
      ? `Korridor "${corrLabel}" hat hohes Migrationsrisiko (${row.risk_level}). Erfolgswahrscheinlichkeit: ${row.estimated_success_score}/100. Empfehlung: Migration Intelligence Details überprüfen und kandidatenseitige Vorbereitung verbessern.`
      : `Korridor "${corrLabel}" hat günstige Migrationsbedingungen (Risiko: ${row.risk_level}). Erfolgswahrscheinlichkeit: ${row.estimated_success_score}/100. Empfehlung: als Prioritäts-Korridor für Kandidatenakquisition einsetzen.`

    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name:  agentName,
      title:       suggTitle,
      description: desc,
      priority:    row.risk_level === 'critical' ? 'critical' :
                   row.risk_level === 'high'     ? 'high'     :
                   row.estimated_success_score   >= 80 ? 'high' : 'medium',
      metadata: {
        corridor:       corrLabel,
        success_score:  row.estimated_success_score,
        risk_level:     row.risk_level,
        status:         row.status,
      },
    })
    if (!error) {
      suggestionsCreated++
      existingTitles.add(suggTitle)
    }
  }

  // ── 7. Notifications for critical + high risk corridors ──────────────────────
  const alertRows = enriched.filter((r) => r.risk_level === 'critical' || r.risk_level === 'high')

  for (const row of alertRows) {
    const corrLabel = `${row.source_country ?? '?'} → ${row.target_country ?? '?'}`
    const notifTitle = `🛂 ${row.risk_level === 'critical' ? 'Kritisches' : 'Hohes'} Migrationsrisiko: ${corrLabel}`

    const { data: existing } = await supabase
      .from('agent_notifications')
      .select('id')
      .eq('title', notifTitle)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
    if (existing && existing.length > 0) continue

    const { error } = await supabase.from('agent_notifications').insert({
      agent_name:        agentName,
      title:             notifTitle,
      message:           `Korridor ${corrLabel} (${row.sector}) hat Risikolevel "${row.risk_level}" mit Erfolgswahrscheinlichkeit ${row.estimated_success_score}/100. Überprüfung der Kandidatenberatung und Prozessunterstützung empfohlen.`,
      notification_type: 'alert',
      priority:          row.risk_level,
      metadata:          { success_score: row.estimated_success_score, risk_level: row.risk_level },
    })
    if (!error) notificationsCreated++
  }

  // ── 8. System log ─────────────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    agent_name: agentName,
    status:     'success',
    message:    `MI Agent abgeschlossen: ${rows.length} Einträge, ${scoresUpdated} Score-Updates, ${markedOutdated} als veraltet markiert, ${suggestionsCreated} Vorschläge, ${notificationsCreated} Benachrichtigungen.`,
  })

  return { entriesAnalyzed: rows.length, scoresUpdated, markedOutdated, suggestionsCreated, notificationsCreated }
}
