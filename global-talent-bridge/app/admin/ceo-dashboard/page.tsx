import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { RefreshMetricsButton } from '@/app/admin/_components/RefreshMetricsButton'
import { RunAgentsButton } from './RunAgentsButton'
import { SuggestionActions } from './SuggestionActions'
import { MarkAllReadButton } from './MarkAllReadButton'

type Department = {
  department_key: string
  name: string
  description: string | null
  mission: string | null
  active: boolean
}

type AgentTask = {
  id: string
  department_key: string | null
  agent_name: string | null
  title: string | null
  status: string
  priority: number
  requires_human_approval: boolean
  created_at: string
}

type AgentReport = {
  id: string
  department_key: string | null
  agent_name: string | null
  report_type: string | null
  title: string | null
  summary: string | null
  created_at: string
}

type BusinessMetric = {
  metric_key: string | null
  metric_name: string | null
  metric_value: number
  period: string | null
  source: string | null
  created_at: string
}

type SystemLog = {
  id: string
  agent_name: string | null
  status: string | null
  message: string | null
  created_at: string
}

function StatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-300 font-medium">
        active
      </span>
    )
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-medium">
      inactive
    </span>
  )
}

function TaskBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    planned: 'bg-gray-800 text-gray-400',
    in_progress: 'bg-blue-900/40 text-blue-300',
    completed: 'bg-green-900/40 text-green-300',
    failed: 'bg-red-900/40 text-red-300',
    blocked: 'bg-yellow-900/40 text-yellow-300',
    needs_approval: 'bg-purple-900/40 text-purple-300',
    risk_warning: 'bg-orange-900/40 text-orange-300',
  }
  const style = styles[status] ?? styles.planned
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style}`}>
      {status}
    </span>
  )
}

type LeadKpi = {
  total_contacts: number
  new_contacts: number
  contacted_contacts: number
  qualified_contacts: number
  pilot_employer_contacts: number
  followup_due: number
  total_leads: number
  new_leads: number
  qualified_leads: number
  employer_leads: number
  candidate_leads: number
}

type OutreachKpi = {
  total: number
  planned: number
  contacted: number
  interested: number
  followup_due: number
  converted: number
}

type AgentSuggestion = {
  id: string
  department_slug: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  impact_score: number
  effort_score: number
  risk_score: number
  expected_benefit: string | null
  risk_note: string | null
  action_type: string | null
  requires_approval: boolean
  created_at: string
}

type AgentNotificationRow = {
  id: string
  title: string
  message: string
  severity: string
  department_slug: string | null
  is_read: boolean
  created_at: string
}

type PricingPlanRow = {
  plan_key: string
  name: string | null
  monthly_price_eur: number
  yearly_price_eur: number
  active: boolean
  features: string[]
}

// Bekannte Metriken in der richtigen Anzeigereihenfolge + Emoji-Mapping
const METRIC_ORDER: Record<string, { emoji: string; label?: string }> = {
  total_profiles: { emoji: '👤', label: 'Profile gesamt' },
  total_candidates: { emoji: '🎓', label: 'Kandidaten' },
  total_employers: { emoji: '🏢', label: 'Arbeitgeber' },
  total_jobs: { emoji: '💼', label: 'Jobs gesamt' },
  active_jobs: { emoji: '✅', label: 'Aktive Jobs' },
  total_matches: { emoji: '🎯', label: 'Matches gesamt' },
  average_match_score: { emoji: '📈', label: 'Ø Match-Score' },
  completed_onboardings: { emoji: '🚀', label: 'Onboardings abgeschl.' },
  total_system_logs: { emoji: '📋', label: 'System-Logs' },
  total_pricing_plans: { emoji: '💰', label: 'Pricing-Pläne gesamt' },
  active_pricing_plans: { emoji: '🔓', label: 'Aktive Pläne' },
  total_employer_jobs: { emoji: '📋', label: 'Arbeitgeber-Jobs' },
  total_employer_matches: { emoji: '🤝', label: 'Arbeitgeber-Matches' },
  total_contact_requests: { emoji: '📬', label: 'Kontaktanfragen' },
  new_contact_requests: { emoji: '🆕', label: 'Neue Anfragen' },
  total_sales_leads: { emoji: '🎯', label: 'Sales Leads' },
  employer_leads: { emoji: '🏢', label: 'Arbeitgeber-Leads' },
  candidate_leads: { emoji: '👤', label: 'Kandidaten-Leads' },
  qualified_leads: { emoji: '⭐', label: 'Qualifizierte Leads' },
}

export default async function CeoDashboardPage() {
  const admin = await getCurrentAdminUser()

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-900/20 border border-red-700 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-xl font-bold text-red-300 mb-2">Zugriff verweigert</h1>
          <p className="text-red-200/70">Sie sind kein Admin.</p>
          <Link href="/" className="mt-6 inline-block text-sm text-gray-400 hover:text-white">
            ← Startseite
          </Link>
        </div>
      </div>
    )
  }

  const supabase = createAdminClient()

  const [
    deptRes,
    taskRes,
    reportRes,
    metricsRes,
    logsRes,
    candidatesCountRes,
    employersCountRes,
    activeJobsCountRes,
    totalMatchesCountRes,
    onboardingsCountRes,
    matchScoresRes,
    pricingPlansRes,
    totalContactsRes,
    newContactsRes,
    totalLeadsRes,
    newLeadsRes,
    qualifiedLeadsRes,
    employerLeadsRes,
    candidateLeadsRes,
    contactedContactsRes,
    pilotEmployerContactsRes,
    qualifiedContactsRes,
    followupDueRes,
    outreachTotalRes,
    outreachPlannedRes,
    outreachContactedRes,
    outreachInterestedRes,
    outreachConvertedRes,
    outreachFollowupRes,
    agentSuggestionsRes,
    agentNotificationsRes,
    agentRunLogsRes,
  ] = await Promise.all([
    supabase
      .from('agent_departments')
      .select('department_key, name, description, mission, active')
      .order('department_key'),
    supabase
      .from('agent_tasks')
      .select(
        'id, department_key, agent_name, title, status, priority, requires_human_approval, created_at'
      )
      .neq('status', 'completed')
      .order('priority', { ascending: false })
      .limit(10),
    supabase
      .from('agent_reports')
      .select(
        'id, department_key, agent_name, report_type, title, summary, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('business_metrics')
      .select('metric_key, metric_name, metric_value, period, source, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('system_logs')
      .select('id, agent_name, status, message, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    // Live-KPIs direkt aus den Tabellen
    supabase.from('candidates').select('*', { count: 'exact', head: true }),
    supabase.from('employers').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase
      .from('onboarding_progress')
      .select('*', { count: 'exact', head: true })
      .eq('step5_complete', true),
    supabase.from('matches').select('score'),
    supabase
      .from('pricing_plans')
      .select('plan_key, name, monthly_price_eur, yearly_price_eur, active, features')
      .order('monthly_price_eur', { ascending: true }),
    // Lead KPIs
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('sales_leads').select('*', { count: 'exact', head: true }),
    supabase.from('sales_leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('sales_leads').select('*', { count: 'exact', head: true }).eq('status', 'qualified'),
    supabase.from('sales_leads').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
    supabase.from('sales_leads').select('*', { count: 'exact', head: true }).eq('role', 'candidate'),
    // Erweiterte Lead-KPIs (Phase 2G)
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('interest', 'pilot_employer'),
    // Phase 2H: qualified contacts + follow-ups due
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'qualified'),
    supabase
      .from('contact_requests')
      .select('*', { count: 'exact', head: true })
      .not('next_follow_up_at', 'is', null)
      .lte('next_follow_up_at', new Date().toISOString()),
    // Phase 2I: Outreach KPIs
    supabase.from('outreach_targets').select('*', { count: 'exact', head: true }),
    supabase.from('outreach_targets').select('*', { count: 'exact', head: true }).eq('status', 'planned'),
    supabase.from('outreach_targets').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
    supabase.from('outreach_targets').select('*', { count: 'exact', head: true }).eq('status', 'interested'),
    supabase.from('outreach_targets').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
    supabase
      .from('outreach_targets')
      .select('*', { count: 'exact', head: true })
      .not('next_follow_up_at', 'is', null)
      .lte('next_follow_up_at', new Date().toISOString()),
    // Phase 2J: Agent System
    supabase
      .from('agent_suggestions')
      .select('id, department_slug, title, description, category, priority, status, impact_score, effort_score, risk_score, expected_benefit, risk_note, action_type, requires_approval, created_at')
      .in('status', ['suggested', 'approved'])
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('agent_notifications')
      .select('id, title, message, severity, department_slug, is_read, created_at')
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(15),
    supabase
      .from('agent_run_logs')
      .select('id, run_type, status, summary, suggestions_created, notifications_created, created_at')
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  const departments: Department[] = deptRes.data ?? []
  const tasks: AgentTask[] = taskRes.data ?? []
  const reports: AgentReport[] = reportRes.data ?? []
  const logs: SystemLog[] = logsRes.data ?? []

  // Business Metrics: deduplizieren — nur aktuellsten Eintrag je metric_key
  const rawMetrics: BusinessMetric[] = metricsRes.data ?? []
  const metricMap = new Map<string, BusinessMetric>()
  for (const m of rawMetrics) {
    const key = m.metric_key ?? '__unknown'
    if (!metricMap.has(key)) metricMap.set(key, m) // schon nach created_at desc sortiert
  }
  const metrics = [...metricMap.values()]

  // Direkte Live-KPIs
  const scores = (matchScoresRes.data ?? []).map((m: { score: number }) => m.score)
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((s: number, v: number) => s + v, 0) / scores.length)
      : 0

  const liveKpis = [
    {
      label: 'Kandida­ten',
      value: candidatesCountRes.count ?? 0,
      emoji: '🎓',
    },
    {
      label: 'Arbeit­geber',
      value: employersCountRes.count ?? 0,
      emoji: '🏢',
    },
    {
      label: 'Aktive Jobs',
      value: activeJobsCountRes.count ?? 0,
      emoji: '💼',
    },
    {
      label: 'Matches gesamt',
      value: totalMatchesCountRes.count ?? 0,
      emoji: '🎯',
    },
    {
      label: 'Ø Match-Score',
      value: `${avgScore}%`,
      emoji: '📈',
    },
    {
      label: 'Onboarding abgeschl.',
      value: onboardingsCountRes.count ?? 0,
      emoji: '🚀',
    },
  ]

  const leadKpi: LeadKpi = {
    total_contacts: totalContactsRes.count ?? 0,
    new_contacts: newContactsRes.count ?? 0,
    contacted_contacts: contactedContactsRes.count ?? 0,
    qualified_contacts: qualifiedContactsRes.count ?? 0,
    pilot_employer_contacts: pilotEmployerContactsRes.count ?? 0,
    followup_due: followupDueRes.count ?? 0,
    total_leads: totalLeadsRes.count ?? 0,
    new_leads: newLeadsRes.count ?? 0,
    qualified_leads: qualifiedLeadsRes.count ?? 0,
    employer_leads: employerLeadsRes.count ?? 0,
    candidate_leads: candidateLeadsRes.count ?? 0,
  }

  const outreachKpi: OutreachKpi = {
    total: outreachTotalRes.count ?? 0,
    planned: outreachPlannedRes.count ?? 0,
    contacted: outreachContactedRes.count ?? 0,
    interested: outreachInterestedRes.count ?? 0,
    converted: outreachConvertedRes.count ?? 0,
    followup_due: outreachFollowupRes.count ?? 0,
  }

  // Phase 2J: Agent System
  const agentSuggestions: AgentSuggestion[] = (agentSuggestionsRes.data ?? []) as AgentSuggestion[]
  const agentNotifications: AgentNotificationRow[] = (agentNotificationsRes.data ?? []) as AgentNotificationRow[]
  const lastRunLog = (agentRunLogsRes.data ?? [])[0] as {
    id: string; run_type: string; status: string; summary: string | null;
    suggestions_created: number; notifications_created: number; created_at: string
  } | undefined

  // Prioritäts-Sortierung: critical > high > medium > low
  const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  const sortedSuggestions = [...agentSuggestions].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)
  )
  const visionarySuggestions = sortedSuggestions.filter((s) => s.department_slug === 'visionary_strategy')
  const marketingSuggestions = sortedSuggestions.filter((s) => s.department_slug === 'marketing_strategy')
  const ceoCritical = sortedSuggestions.filter((s) => s.department_slug === 'ceo_control')

  const pricingPlans: PricingPlanRow[] = (pricingPlansRes.data ?? []).map((p) => ({
    ...p,
    features: Array.isArray(p.features) ? (p.features as string[]) : [],
  }))
  const activePricingCount = pricingPlans.filter((p) => p.active).length

  // Potenzieller Jahresumsatz (wenn alle Pläne gleich verteilt aktiv wären — rein informativ)
  const potentialMonthlyRevenue = pricingPlans.reduce(
    (sum, p) => sum + p.monthly_price_eur,
    0
  )

  const ceo = departments.find((d) => d.department_key === 'ceo_command')
  const subDepts = departments.filter((d) => d.department_key !== 'ceo_command')
  const activeDepts = subDepts.filter((d) => d.active).length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="CEO Dashboard" badgeColor="purple" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* CEO-Header */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800/50 rounded-2xl p-8">
          <div className="flex items-start gap-6">
            <div className="text-5xl">🎯</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">CEO / Erzdirigent</h1>
              {ceo?.mission && (
                <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                  {ceo.mission}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="text-sm text-gray-400">
                  <span className="text-white font-semibold">{subDepts.length}</span>{' '}
                  Abteilungen vorbereitet
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-semibold">{activeDepts}</span> aktiv
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-semibold">{tasks.length}</span> offene
                  Aufgaben
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-xl">
            <p className="text-yellow-300 text-sm font-medium">
              ⚠️ Phase 1 — Agenten sind vorbereitet, aber noch nicht autonom aktiv.
              Autonome Ausführung kommt kontrolliert in Phase 2.
            </p>
          </div>
        </div>

        {/* ── CEO Command Center ── */}
        <div className="bg-gray-900 border border-purple-800/40 rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-white">🤖 CEO Command Center</h2>
              <p className="text-gray-400 text-sm mt-1">
                Agenten analysieren intern und erstellen Vorschläge.{' '}
                <span className="text-green-400 font-medium">Keine externen Aktionen ohne Freigabe.</span>
              </p>
            </div>
            {lastRunLog && (
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-500">Letzter Lauf:</p>
                <p className="text-xs text-gray-400">
                  {new Date(lastRunLog.created_at).toLocaleString('de-DE')}
                </p>
                <p className="text-xs text-green-400">
                  +{lastRunLog.suggestions_created} Vorschläge
                </p>
              </div>
            )}
          </div>

          <RunAgentsButton />

          {/* Schnell-KPIs */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-purple-400">{agentSuggestions.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Offene Vorschläge</div>
            </div>
            <div className={`rounded-xl p-3 text-center ${agentNotifications.length > 0 ? 'bg-orange-900/20' : 'bg-gray-800/60'}`}>
              <div className={`text-xl font-bold ${agentNotifications.length > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
                {agentNotifications.length}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Ungelesene Alerts</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-blue-400">
                {sortedSuggestions.filter((s) => s.priority === 'critical' || s.priority === 'high').length}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Hoch-Priorität</div>
            </div>
          </div>

          <div className="p-3 bg-blue-900/10 border border-blue-800/30 rounded-xl">
            <p className="text-blue-300/70 text-xs leading-relaxed">
              💡 <strong className="text-blue-300">Was Agenten dürfen:</strong> Intern analysieren, Vorschläge erstellen, Outreach-Entwürfe vorbereiten, Notifications erzeugen. —{' '}
              <strong className="text-red-300">Was Agenten NICHT dürfen:</strong> E-Mails senden, Zahlungen aktivieren, externe APIs kostenpflichtig nutzen, RLS ändern, User-Daten löschen.
            </p>
          </div>
        </div>

        {/* ── Ungelesene Benachrichtigungen ── */}
        {agentNotifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="text-xl font-bold text-white">
                🔔 Neue Benachrichtigungen
                <span className="ml-2 text-sm font-normal text-orange-400">({agentNotifications.length})</span>
              </h2>
              <MarkAllReadButton />
            </div>
            <div className="space-y-2">
              {agentNotifications.map((n) => {
                const severityStyles: Record<string, string> = {
                  critical: 'border-red-700/50 bg-red-900/10',
                  warning: 'border-orange-700/50 bg-orange-900/10',
                  success: 'border-green-700/50 bg-green-900/10',
                  info: 'border-blue-700/50 bg-blue-900/10',
                }
                const severityText: Record<string, string> = {
                  critical: 'text-red-300',
                  warning: 'text-orange-300',
                  success: 'text-green-300',
                  info: 'text-blue-300',
                }
                const severityIcon: Record<string, string> = {
                  critical: '🚨', warning: '⚠️', success: '✅', info: 'ℹ️',
                }
                return (
                  <div
                    key={n.id}
                    className={`p-4 rounded-xl border flex items-start gap-3 ${severityStyles[n.severity] ?? 'border-gray-800 bg-gray-900'}`}
                  >
                    <span className="text-lg shrink-0">{severityIcon[n.severity] ?? 'ℹ️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${severityText[n.severity] ?? 'text-gray-300'}`}>
                        {n.title}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    <span className="text-xs text-gray-600 shrink-0">
                      {new Date(n.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Agenten-Vorschläge (CEO Control) ── */}
        {ceoCritical.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              🎯 CEO-Vorschläge
              <span className="ml-2 text-sm font-normal text-gray-400">({ceoCritical.length})</span>
            </h2>
            <div className="space-y-3">
              {ceoCritical.map((s) => {
                const priorityStyles: Record<string, string> = {
                  critical: 'border-red-700/50 bg-red-900/5',
                  high: 'border-orange-700/40 bg-orange-900/5',
                  medium: 'border-gray-700 bg-gray-900',
                  low: 'border-gray-800 bg-gray-900/50',
                }
                const priorityBadge: Record<string, string> = {
                  critical: 'bg-red-900/40 text-red-300',
                  high: 'bg-orange-900/40 text-orange-300',
                  medium: 'bg-yellow-900/40 text-yellow-300',
                  low: 'bg-gray-800 text-gray-400',
                }
                return (
                  <div key={s.id} className={`rounded-2xl border p-5 ${priorityStyles[s.priority] ?? 'border-gray-800 bg-gray-900'}`}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge[s.priority] ?? 'bg-gray-800 text-gray-400'}`}>
                            {s.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">{s.category}</span>
                        </div>
                        <p className="text-white text-sm font-semibold leading-snug">{s.title}</p>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{s.description}</p>
                        {s.expected_benefit && (
                          <p className="text-green-400/70 text-xs mt-1">✅ {s.expected_benefit}</p>
                        )}
                        {s.risk_note && (
                          <p className="text-yellow-400/70 text-xs mt-0.5">⚠️ {s.risk_note}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0 text-xs text-gray-500">
                        <span>Impact: <strong className="text-white">{s.impact_score}/10</strong></span>
                        <span>Aufwand: <strong className="text-white">{s.effort_score}/10</strong></span>
                        <span>Risiko: <strong className="text-white">{s.risk_score}/10</strong></span>
                      </div>
                    </div>
                    <SuggestionActions id={s.id} status={s.status} actionType={s.action_type} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Marketing-Strategie ── */}
        {marketingSuggestions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              📣 Marketing-Strategie
              <span className="ml-2 text-sm font-normal text-gray-400">({marketingSuggestions.length} Vorschläge)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {marketingSuggestions.slice(0, 6).map((s) => (
                <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-white text-sm font-semibold leading-snug flex-1">{s.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${s.priority === 'high' || s.priority === 'critical' ? 'bg-orange-900/40 text-orange-300' : 'bg-gray-800 text-gray-400'}`}>
                      {s.priority}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.description}</p>
                  {s.expected_benefit && (
                    <p className="text-green-400/60 text-xs mt-2">✅ {s.expected_benefit}</p>
                  )}
                  {s.action_type === 'create_outreach_draft' && (
                    <SuggestionActions id={s.id} status={s.status} actionType={s.action_type} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Visionär-Agent ── */}
        {visionarySuggestions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">🔮 Visionäre Chancen</h2>
            <div className="space-y-4">
              {visionarySuggestions.map((s) => (
                <div key={s.id} className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-purple-800/30 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-base font-semibold mb-1">{s.title}</p>
                      <p className="text-gray-300 text-xs leading-relaxed">{s.description}</p>
                      {s.expected_benefit && (
                        <p className="text-purple-300/70 text-xs mt-2">
                          💰 {s.expected_benefit}
                        </p>
                      )}
                      {s.risk_note && (
                        <p className="text-yellow-400/60 text-xs mt-1">⚠️ {s.risk_note}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 text-xs">
                      <span className="text-gray-500">Impact <strong className="text-purple-300">{s.impact_score}/10</strong></span>
                      <span className="text-gray-500">Aufwand <strong className="text-white">{s.effort_score}/10</strong></span>
                      <span className="text-gray-500">Risiko <strong className="text-yellow-300">{s.risk_score}/10</strong></span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-gray-900/50 rounded-lg">
                    <p className="text-gray-500 text-xs">
                      📌 <em>Potenzial, kein echter Umsatz. Manueller nächster Schritt: Machbarkeit prüfen, ersten Kontakt herstellen.</em>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live-KPI-Leiste */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">📊 Live Business KPIs</h2>
            <RefreshMetricsButton />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {liveKpis.map((kpi) => (
              <div
                key={kpi.label}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-1">{kpi.emoji}</div>
                <div className="text-2xl font-bold text-white">{kpi.value}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-tight">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Metrics (gespeicherte Werte) */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">📈 Gespeicherte Kennzahlen</h2>
          {metrics.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              Noch keine Kennzahlen gespeichert. Klicke &quot;Kennzahlen aktualisieren&quot; um
              Daten zu berechnen.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {metrics
                .sort((a, b) => {
                  const keyA = a.metric_key ?? ''
                  const keyB = b.metric_key ?? ''
                  const orderKeys = Object.keys(METRIC_ORDER)
                  const idxA = orderKeys.indexOf(keyA)
                  const idxB = orderKeys.indexOf(keyB)
                  return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB)
                })
                .map((m) => {
                  const key = m.metric_key ?? ''
                  const meta = METRIC_ORDER[key]
                  return (
                    <div
                      key={key}
                      className="bg-gray-900 rounded-xl border border-gray-800 p-4"
                    >
                      {meta && (
                        <div className="text-lg mb-1">{meta.emoji}</div>
                      )}
                      <p className="text-xs text-gray-500 mb-1">
                        {m.metric_name ?? meta?.label ?? m.metric_key ?? '—'}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {key === 'average_match_score' ? `${m.metric_value}%` : m.metric_value}
                      </p>
                      {m.period && (
                        <p className="text-xs text-gray-600 mt-1">{m.period}</p>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        {/* 12 Abteilungen */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🏛️ 12 Abteilungen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subDepts.map((dept) => (
              <div
                key={dept.department_key}
                className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    {dept.name}
                  </h3>
                  <StatusBadge active={dept.active} />
                </div>
                {dept.mission && (
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                    {dept.mission}
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <span className="text-xs text-gray-600 font-mono">
                    {dept.department_key}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Go-to-Market & Leads */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-white">🎯 Go-to-Market & Leads</h2>
            <div className="flex gap-3">
              <Link
                href="/admin/pilot-kit"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                🎯 Pilot-Kit →
              </Link>
              <Link
                href="/admin/leads"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Leads verwalten →
              </Link>
            </div>
          </div>

          {/* Zeile 1: Kontaktanfragen-Status */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{leadKpi.total_contacts}</div>
              <div className="text-xs text-gray-400 mt-0.5">Anfragen gesamt</div>
            </div>
            <div className="bg-gray-900 border border-blue-800/40 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{leadKpi.new_contacts}</div>
              <div className="text-xs text-gray-400 mt-0.5">Neue Leads</div>
            </div>
            <div className="bg-gray-900 border border-yellow-800/40 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{leadKpi.contacted_contacts}</div>
              <div className="text-xs text-gray-400 mt-0.5">Kontaktierte Leads</div>
            </div>
            <div className="bg-gray-900 border border-green-800/40 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{leadKpi.qualified_contacts}</div>
              <div className="text-xs text-gray-400 mt-0.5">Qualifizierte Leads</div>
            </div>
            <div className={`rounded-xl p-4 text-center ${leadKpi.followup_due > 0 ? 'bg-orange-900/20 border border-orange-700/50' : 'bg-gray-900 border border-gray-800'}`}>
              <div className={`text-2xl font-bold ${leadKpi.followup_due > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
                {leadKpi.followup_due}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">📅 Follow-ups fällig</div>
            </div>
          </div>

          {/* Zeile 2: Kategorisierung */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-900 border border-green-700/60 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-green-300">{leadKpi.pilot_employer_contacts}</div>
              <div className="text-xs text-gray-400 mt-0.5">🏢 Pilot-Arbeitgeber-Leads</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-green-400">{leadKpi.employer_leads}</div>
              <div className="text-xs text-gray-400 mt-0.5">🏢 Arbeitgeber-Leads</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-blue-400">{leadKpi.candidate_leads}</div>
              <div className="text-xs text-gray-400 mt-0.5">👤 Kandidaten-Leads</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-yellow-400">{leadKpi.new_leads}</div>
              <div className="text-xs text-gray-400 mt-0.5">Neue Sales-Leads</div>
            </div>
          </div>
        </div>

        {/* ── Outreach Command Center ── */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-white">📡 Outreach Command Center</h2>
            <Link
              href="/admin/outreach"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Outreach verwalten →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{outreachKpi.total}</div>
              <div className="text-xs text-gray-400 mt-0.5">Ziele gesamt</div>
            </div>
            <div className="bg-gray-900 border border-gray-700/40 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-400">{outreachKpi.planned}</div>
              <div className="text-xs text-gray-400 mt-0.5">📋 Geplant</div>
            </div>
            <div className="bg-gray-900 border border-yellow-800/40 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{outreachKpi.contacted}</div>
              <div className="text-xs text-gray-400 mt-0.5">✉️ Kontaktiert</div>
            </div>
            <div className="bg-gray-900 border border-blue-800/40 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{outreachKpi.interested}</div>
              <div className="text-xs text-gray-400 mt-0.5">🤝 Interessiert</div>
            </div>
            <div className={`rounded-xl p-4 text-center ${outreachKpi.followup_due > 0 ? 'bg-orange-900/20 border border-orange-700/50' : 'bg-gray-900 border border-gray-800'}`}>
              <div className={`text-2xl font-bold ${outreachKpi.followup_due > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
                {outreachKpi.followup_due}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">📅 Follow-ups fällig</div>
            </div>
            <div className="bg-gray-900 border border-green-800/40 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{outreachKpi.converted}</div>
              <div className="text-xs text-gray-400 mt-0.5">⭐ Konvertiert</div>
            </div>
          </div>
        </div>

        {/* Pricing-Pläne */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-white">💰 Pricing-Pläne</h2>
            <span className="text-xs px-2.5 py-1 bg-yellow-900/30 text-yellow-300 rounded-full font-medium">
              Zahlungen noch nicht aktiviert
            </span>
          </div>

          {/* Pricing-KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{pricingPlans.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Pläne vorbereitet</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-500">{activePricingCount}</div>
              <div className="text-xs text-gray-400 mt-0.5">Aktive Pläne</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {potentialMonthlyRevenue > 0 ? `${potentialMonthlyRevenue} €` : '—'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Pot. Umsatz/Monat</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-300">
                {potentialMonthlyRevenue > 0 ? `${potentialMonthlyRevenue * 12} €` : '—'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Pot. Umsatz/Jahr</div>
            </div>
          </div>

          {/* Plan-Tabelle */}
          {pricingPlans.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              Noch keine Pricing-Pläne in der Datenbank.
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium">
                <div className="col-span-3">Plan</div>
                <div className="col-span-2 text-right">Monatlich</div>
                <div className="col-span-2 text-right">Jährlich</div>
                <div className="col-span-3">Features</div>
                <div className="col-span-2 text-center">Status</div>
              </div>
              <div className="divide-y divide-gray-800">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.plan_key}
                    className="px-5 py-3 grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-3">
                      <p className="text-white text-sm font-medium">{plan.name ?? plan.plan_key}</p>
                      <p className="text-gray-600 text-xs font-mono">{plan.plan_key}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-white text-sm">
                        {plan.monthly_price_eur === 0 ? 'Kostenlos' : `${plan.monthly_price_eur} €`}
                      </p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-gray-400 text-sm">
                        {plan.yearly_price_eur > 0 ? `${plan.yearly_price_eur} €` : '—'}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-gray-400 text-xs">
                        {plan.features.length} Feature{plan.features.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="col-span-2 text-center">
                      {plan.active ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-300">
                          aktiv
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
                          inaktiv
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zahlungs-Hinweis */}
          <div className="mt-4 p-4 bg-yellow-900/10 border border-yellow-800/40 rounded-xl flex items-start gap-3">
            <span className="text-yellow-400 text-lg shrink-0">⚠️</span>
            <div>
              <p className="text-yellow-300 text-sm font-medium">Zahlungen noch nicht aktiviert</p>
              <p className="text-yellow-200/60 text-xs mt-0.5">
                Alle Pricing-Pläne sind vorbereitet (active=false). Stripe-Integration und echte
                Zahlungsabwicklung kommen in einer späteren Phase. Kein Umsatz wird aktuell
                generiert.
              </p>
            </div>
          </div>
        </div>

        {/* Nächste manuelle Schritte */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/40 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">🗺️ Nächste manuelle Schritte</h2>
          <p className="text-gray-400 text-sm mb-5">
            Reine Anzeige — keine autonomen Aufgaben, keine automatischen E-Mails.
            Alle Schritte werden manuell ausgeführt.
          </p>
          <div className="space-y-3">
            {[
              {
                icon: '🏢',
                step: '5 Pilot-Arbeitgeber kontaktieren',
                detail: 'Über Kontaktformular eingegangene Anfragen (Interesse: Pilot-Arbeitgeber) manuell beantworten.',
                done: false,
              },
              {
                icon: '👤',
                step: '10 Kandidatenprofile sammeln',
                detail: 'Kandidaten über Netzwerke und soziale Medien auf die Plattform einladen. Profil-Qualität prüfen.',
                done: false,
              },
              {
                icon: '💬',
                step: 'Feedback prüfen und auswerten',
                detail: 'Kontaktanfragen lesen, Feedback-Einträge im Admin-Lead-Dashboard auswerten.',
                done: false,
              },
              {
                icon: '🎯',
                step: 'Matchingqualität verbessern',
                detail: 'Scoring-Algorithmus anpassen basierend auf realem Feedback von Arbeitgebern und Kandidaten.',
                done: false,
              },
              {
                icon: '💰',
                step: 'Zahlungsfunktion aktivieren — erst danach',
                detail: 'Stripe-Integration erst nach stabilen Pilot-Daten und klarem Mehrwert für Arbeitgeber aktivieren.',
                done: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 bg-gray-900/60 border border-gray-700/50 rounded-xl"
              >
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-0.5">{item.step}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.detail}</p>
                </div>
                <div className="shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
                    ausstehend
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sicherheitsstatus */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">🔒 Sicherheitsstatus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-800/40 rounded-lg">
              <span className="text-green-400 text-lg">✅</span>
              <div>
                <p className="text-green-300 text-sm font-medium">Keine Secrets im Client</p>
                <p className="text-green-200/60 text-xs">Service Role nur serverseitig</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-800/40 rounded-lg">
              <span className="text-green-400 text-lg">✅</span>
              <div>
                <p className="text-green-300 text-sm font-medium">RLS aktiviert</p>
                <p className="text-green-200/60 text-xs">Alle 12 Kerntabellen geschützt</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-800/40 rounded-lg">
              <span className="text-green-400 text-lg">✅</span>
              <div>
                <p className="text-green-300 text-sm font-medium">Agenten inaktiv</p>
                <p className="text-green-200/60 text-xs">active=false für alle Abteilungen</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-800/40 rounded-lg">
              <span className="text-green-400 text-lg">✅</span>
              <div>
                <p className="text-green-300 text-sm font-medium">Admin über ADMIN_EMAILS</p>
                <p className="text-green-200/60 text-xs">
                  Serverseitig geprüft, kein Client-Zugriff
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Offene Aufgaben */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            📋 Offene Aufgaben
            {tasks.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">({tasks.length})</span>
            )}
          </h2>
          {tasks.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              Keine offenen Aufgaben.
            </div>
          ) : (
            <div className="grid gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {task.title || 'Unbenannte Aufgabe'}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {task.department_key ?? '—'}
                      {task.requires_human_approval && (
                        <span className="ml-2 text-yellow-500">⚠️ Freigabe erforderlich</span>
                      )}
                    </p>
                  </div>
                  <TaskBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Letzte Berichte */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">📊 Letzte Berichte</h2>
          {reports.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              Noch keine Berichte vorhanden.
            </div>
          ) : (
            <div className="grid gap-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {report.title || 'Unbenannter Bericht'}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {report.department_key ?? '—'} · {report.report_type ?? '—'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {new Date(report.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  {report.summary && (
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                      {report.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Logs */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🗒️ Letzte System-Logs</h2>
          {logs.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              Keine Logs vorhanden.
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="divide-y divide-gray-800">
                {logs.map((log) => (
                  <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                    <span
                      className={`mt-0.5 shrink-0 text-xs px-2 py-0.5 rounded-full ${
                        log.status === 'success'
                          ? 'bg-green-900/40 text-green-300'
                          : log.status === 'error'
                          ? 'bg-red-900/40 text-red-300'
                          : log.status === 'warning'
                          ? 'bg-yellow-900/40 text-yellow-300'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {log.status ?? 'info'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-sm">{log.message}</p>
                      <p className="text-gray-600 text-xs mt-0.5">
                        {log.agent_name && (
                          <span className="mr-2">[{log.agent_name}]</span>
                        )}
                        {new Date(log.created_at).toLocaleString('de-DE')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
