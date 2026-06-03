import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/recalculate-metrics
 * Admin-only. Liest Live-Daten aus allen Tabellen, schreibt in business_metrics.
 * Verwendet Service Role Key — NUR serverseitig.
 */

const METRIC_KEYS = [
  'total_profiles',
  'total_candidates',
  'total_employers',
  'total_jobs',
  'active_jobs',
  'total_matches',
  'average_match_score',
  'completed_onboardings',
  'total_system_logs',
] as const

type MetricKey = (typeof METRIC_KEYS)[number]

export async function POST() {
  // Admin-Check — nutzt getCurrentAdminUser (Server-seitig, liest ADMIN_EMAILS)
  const adminUser = await getCurrentAdminUser()
  if (!adminUser) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 })
  }

  // Service Role Client — umgeht RLS, nur server-seitig
  const supabase = createAdminClient()

  const period = new Date().toISOString().slice(0, 7) // z.B. "2026-06"

  // Alle Counts parallel abfragen
  const [
    profilesRes,
    candidatesRes,
    employersRes,
    jobsRes,
    activeJobsRes,
    matchesRes,
    onboardingsRes,
    logsRes,
    matchScoresRes,
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('candidates').select('*', { count: 'exact', head: true }),
    supabase.from('employers').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase
      .from('onboarding_progress')
      .select('*', { count: 'exact', head: true })
      .eq('step5_complete', true),
    supabase.from('system_logs').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('score'),
  ])

  // Durchschnittlichen Match-Score berechnen
  const scores = (matchScoresRes.data ?? []).map((m: { score: number }) => m.score)
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((s: number, v: number) => s + v, 0) / scores.length)
      : 0

  const metrics: Array<{
    metric_key: MetricKey
    metric_name: string
    metric_value: number
    period: string
    source: string
  }> = [
    {
      metric_key: 'total_profiles',
      metric_name: 'Registrierte Profile',
      metric_value: profilesRes.count ?? 0,
      period,
      source: 'recalculate-metrics-api',
    },
    {
      metric_key: 'total_candidates',
      metric_name: 'Registrierte Kandidaten',
      metric_value: candidatesRes.count ?? 0,
      period,
      source: 'recalculate-metrics-api',
    },
    {
      metric_key: 'total_employers',
      metric_name: 'Registrierte Arbeitgeber',
      metric_value: employersRes.count ?? 0,
      period,
      source: 'recalculate-metrics-api',
    },
    {
      metric_key: 'total_jobs',
      metric_name: 'Jobs gesamt',
      metric_value: jobsRes.count ?? 0,
      period,
      source: 'recalculate-metrics-api',
    },
    {
      metric_key: 'active_jobs',
      metric_name: 'Aktive Jobs',
      metric_value: activeJobsRes.count ?? 0,
      period,
      source: 'recalculate-metrics-api',
    },
    {
      metric_key: 'total_matches',
      metric_name: 'Matches gesamt',
      metric_value: matchesRes.count ?? 0,
      period,
      source: 'recalculate-metrics-api',
    },
    {
      metric_key: 'average_match_score',
      metric_name: 'Ø Match-Score',
      metric_value: avgScore,
      period,
      source: 'recalculate-metrics-api',
    },
    {
      metric_key: 'completed_onboardings',
      metric_name: 'Onboardings abgeschlossen',
      metric_value: onboardingsRes.count ?? 0,
      period,
      source: 'recalculate-metrics-api',
    },
    {
      metric_key: 'total_system_logs',
      metric_name: 'System-Logs gesamt',
      metric_value: logsRes.count ?? 0,
      period,
      source: 'recalculate-metrics-api',
    },
  ]

  // Alte Metriken löschen, neue einfügen (kein UNIQUE-Constraint auf metric_key)
  await supabase.from('business_metrics').delete().in('metric_key', [...METRIC_KEYS])

  const { error: insertError } = await supabase.from('business_metrics').insert(metrics)

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // System-Log schreiben
  await supabase.from('system_logs').insert({
    agent_name: 'recalculate_metrics',
    status: 'success',
    message: `Business Metrics aktualisiert: ${metrics.length} Kennzahlen für ${period}. Admin: ${adminUser.email}`,
  })

  return NextResponse.json({
    success: true,
    metrics_updated: metrics.length,
    period,
    data: metrics,
  })
}
