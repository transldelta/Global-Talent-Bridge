/**
 * /admin/pilot-execution
 *
 * Pilot Execution Center — zentrale Pilot-Steuerung.
 * Zeigt: Readiness Score, Launch Blockers, 7-Day Plan,
 *        Corridor Cards, KPI Snapshot.
 *
 * Admin-only. Server Component.
 */
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import {
  computeAllCategories,
  computeOverallReadinessScore,
  generateLaunchBlockers,
  generate7DayPlan,
  buildCorridorCards,
  buildKpiSnapshot,
  type PilotLiveData,
  type ReadinessCategory,
  type LaunchBlocker,
  type CorridorCard,
  type MigrationCorridorRow,
} from '@/lib/pilot-execution'

export const dynamic = 'force-dynamic'

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'ready' | 'warning' | 'blocked' }) {
  if (status === 'ready')
    return <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-300 border border-green-800/50 font-medium">✅ ready</span>
  if (status === 'warning')
    return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-300 border border-yellow-800/50 font-medium">⚠️ warning</span>
  return <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-800/50 font-medium">🚫 blocked</span>
}

function PriorityBadge({ p }: { p: 'critical' | 'high' | 'medium' | 'low' }) {
  const styles = {
    critical: 'bg-red-900/40 text-red-300 border-red-800/50',
    high:     'bg-orange-900/40 text-orange-300 border-orange-800/50',
    medium:   'bg-yellow-900/40 text-yellow-300 border-yellow-800/50',
    low:      'bg-gray-800 text-gray-400 border-gray-700',
  }[p]
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles}`}>{p.toUpperCase()}</span>
}

function ScoreBar({ score, status }: { score: number; status: 'ready' | 'warning' | 'blocked' }) {
  const color = status === 'ready' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  )
}

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = {
    low:    'bg-green-900/30 text-green-400 border-green-800/40',
    medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
    high:   'bg-red-900/30 text-red-400 border-red-800/40',
  }[level]
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg}`}>{level} risk</span>
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PilotExecutionPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const db = createAdminClient()

  // Parallel DB queries
  const [
    candidatesRes, candidatesCvRes, jobsRes, appsRes,
    pilotTotalRes, pilotActiveRes, pilotIntRes, pilotDemoRes,
    pilotContactedRes, pilotIdentifiedRes, pilotOnboardingRes, pilotRejectedRes,
    pilotCandRes, outreachRes, tasksRes, logsRes, profilesRes,
    corridorsRes,
  ] = await Promise.all([
    db.from('candidates').select('*', { count: 'exact', head: true }),
    db.from('candidates').select('*', { count: 'exact', head: true }).not('cv_url', 'is', null),
    db.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    db.from('application_requests').select('*', { count: 'exact', head: true }),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'active_pilot'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'interested'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'demo_scheduled'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'contacted_manual'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'identified'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'onboarding'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    db.from('pilot_candidates').select('*', { count: 'exact', head: true }),
    db.from('outreach_targets').select('*', { count: 'exact', head: true }),
    db.from('pilot_tasks').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    db.from('system_logs').select('*', { count: 'exact', head: true }),
    db.from('profiles').select('*', { count: 'exact', head: true }),
    db.from('migration_corridors')
      .select('source_country, target_country, sector, estimated_supply_score, estimated_demand_score, opportunity_score, priority_level')
      .order('opportunity_score', { ascending: false })
      .limit(6),
  ])

  const liveData: PilotLiveData = {
    candidates:           candidatesRes.count ?? 0,
    candidatesWithCv:     candidatesCvRes.count ?? 0,
    activeJobs:           jobsRes.count ?? 0,
    applications:         appsRes.count ?? 0,
    pilotEmployers:       pilotTotalRes.count ?? 0,
    pilotActive:          pilotActiveRes.count ?? 0,
    pilotInterested:      pilotIntRes.count ?? 0,
    pilotDemo:            pilotDemoRes.count ?? 0,
    pilotContacted:       pilotContactedRes.count ?? 0,
    pilotIdentified:      pilotIdentifiedRes.count ?? 0,
    pilotOnboarding:      pilotOnboardingRes.count ?? 0,
    pilotRejected:        pilotRejectedRes.count ?? 0,
    pilotCandidates:      pilotCandRes.count ?? 0,
    outreachTargets:      outreachRes.count ?? 0,
    migrationCorridors:   (corridorsRes.data ?? []).length,
    openTasks:            tasksRes.count ?? 0,
    systemLogs:           logsRes.count ?? 0,
    profiles:             profilesRes.count ?? 0,
    testsPassing:         246,
    landingpages:         null,
    dueDiligenceSections: null,
  }

  // Pure function calls
  const categories = computeAllCategories(liveData)
  const overallScore = computeOverallReadinessScore(categories)
  const blockers = generateLaunchBlockers(liveData)
  const dayPlan = generate7DayPlan()
  const kpi = buildKpiSnapshot(liveData)

  const rawCorridors = (corridorsRes.data ?? []) as {
    source_country: string
    target_country: string
    sector: string
    estimated_supply_score: number
    estimated_demand_score: number
    opportunity_score: number
    priority_level: string
  }[]

  const corridorRows: MigrationCorridorRow[] = rawCorridors.map((c) => ({
    sourceCountry:    c.source_country,
    targetCountry:    c.target_country,
    sector:           c.sector,
    supplyScore:      c.estimated_supply_score,
    demandScore:      c.estimated_demand_score,
    opportunityScore: c.opportunity_score,
    priorityLevel:    c.priority_level,
  }))
  const corridorCards = buildCorridorCards(corridorRows)

  const criticalBlockers = blockers.filter((b) => b.priority === 'critical').length
  const statusColor = overallScore >= 70 ? 'text-green-400' : overallScore >= 45 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-white">🚀 Pilot Execution Center</h1>
              <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gray-900 border border-gray-700 ${statusColor}`}>
                {overallScore}/100
              </span>
              {criticalBlockers > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-800/50">
                  {criticalBlockers} kritische Blocker
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              Zentrale Steuerung für den Pilotstart — Readiness, Blocker, Plan, Korridore.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/admin/pilot-outreach" className="text-xs text-green-400 hover:text-green-300">📤 Outreach →</Link>
            <Link href="/admin/exit-readiness" className="text-xs text-blue-400 hover:text-blue-300">📋 Exit Readiness →</Link>
            <Link href="/admin/ceo-dashboard" className="text-xs text-gray-400 hover:text-gray-300">🏠 CEO Dashboard →</Link>
          </div>
        </div>

        {/* ── A: Pilot Readiness Score ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">📊 A. Pilot Readiness Score</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat: ReadinessCategory) => (
              <div key={cat.key} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-white leading-tight">{cat.label}</p>
                  <span className={`text-lg font-bold shrink-0 ${
                    cat.status === 'ready' ? 'text-green-400' :
                    cat.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>{cat.score}</span>
                </div>
                <StatusBadge status={cat.status} />
                <ScoreBar score={cat.score} status={cat.status} />
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{cat.explanation}</p>
                <p className="text-xs text-blue-400 mt-2 leading-relaxed">
                  → {cat.nextAction}
                </p>
              </div>
            ))}
          </div>

          {/* Overall score bar */}
          <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-white">Gesamt-Readiness-Score</p>
              <span className={`text-2xl font-bold ${statusColor}`}>{overallScore}/100</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  overallScore >= 70 ? 'bg-green-500' :
                  overallScore >= 45 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {overallScore >= 70 ? '✅ Pilot kann starten.' :
               overallScore >= 45 ? '⚠️ Pilot bedingt startbereit — kritische Blocker prüfen.' :
               '🚫 Pilot noch nicht bereit — kritische Blocker zuerst beheben.'}
            </p>
          </div>
        </section>

        {/* ── B: Launch Blockers ────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">🚧 B. Launch Blockers</h2>
          <div className="space-y-3">
            {blockers.map((b: LaunchBlocker) => (
              <div
                key={b.id}
                className={`bg-gray-900 rounded-xl border p-4 ${
                  b.priority === 'critical' ? 'border-red-800/60' :
                  b.priority === 'high' ? 'border-orange-800/50' :
                  b.priority === 'medium' ? 'border-yellow-800/40' :
                  'border-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <PriorityBadge p={b.priority} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{b.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{b.description}</p>
                    <p className="text-xs text-blue-400 mt-1.5">→ {b.resolution}</p>
                  </div>
                  {b.blocksLaunch && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-900/50 text-red-300 shrink-0">Blocker</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── C: 7-Day Plan ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">📅 C. 7-Day Pilot Execution Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dayPlan.map((day) => (
              <div key={day.day} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-900/40 text-blue-300 border border-blue-800/50">
                    Tag {day.day}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white mb-2">{day.title}</p>
                <ul className="space-y-1.5">
                  {day.tasks.map((task, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                      <span className="text-blue-500 shrink-0 mt-0.5">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <Link href={day.moduleUrl} className="text-xs text-blue-400 hover:text-blue-300">
                    → {day.module}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── D: Corridor Execution Cards ───────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-1">🗺️ D. Corridor Execution Cards</h2>
          <p className="text-gray-500 text-xs mb-4">Echte Daten aus migration_corridors. Sortiert nach Opportunity-Score.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {corridorCards.map((card: CorridorCard, i) => (
              <div key={i} className={`bg-gray-900 rounded-xl border p-4 ${card.isExample ? 'border-yellow-800/40' : 'border-gray-800'}`}>
                {card.isExample && (
                  <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-800/40 mb-2 inline-block">example</span>
                )}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-sm font-semibold text-white leading-tight">{card.name}</p>
                  <RiskBadge level={card.riskLevel} />
                </div>

                {/* Scores */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">{card.supplyScore}</p>
                    <p className="text-xs text-gray-600">Supply</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-400">{card.demandScore}</p>
                    <p className="text-xs text-gray-600">Demand</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-400">{card.opportunityScore}</p>
                    <p className="text-xs text-gray-600">Opportunity</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider text-xs mb-0.5">Landingpage-Winkel</p>
                    <p className="text-gray-300 italic">{card.landingpageAngle}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider text-xs mb-0.5">Outreach-Winkel</p>
                    <p className="text-gray-400">{card.outreachAngle}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-800">
                    <p className="text-blue-400">→ {card.nextBestAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── E: KPI Snapshot ───────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">📈 E. KPI Snapshot</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {[
              { label: 'Kandidaten',     value: kpi.candidates,         sub: `${kpi.candidatesWithCv} mit CV` },
              { label: 'Aktive Jobs',    value: kpi.activeJobs,         sub: `${kpi.applications} Bewerbungen` },
              { label: 'Pilot Employer', value: kpi.pilotEmployers,     sub: `${kpi.pilotByStatus.active_pilot} aktiv` },
              { label: 'Korridore',      value: kpi.migrationCorridors, sub: 'mit Scores' },
              { label: 'Offene Aufgaben',value: kpi.openTasks,          sub: 'in pilot_tasks' },
              { label: 'System Logs',    value: kpi.systemLogs,         sub: 'Aktivitäts-Einträge' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Employer by status */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <p className="text-sm font-semibold text-white mb-3">Arbeitgeber nach Status</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(kpi.pilotByStatus).map(([status, count]) => {
                const colors: Record<string, string> = {
                  identified:       'text-gray-400',
                  contacted_manual: 'text-blue-400',
                  interested:       'text-yellow-400',
                  demo_scheduled:   'text-purple-400',
                  onboarding:       'text-orange-400',
                  active_pilot:     'text-green-400',
                  rejected:         'text-red-400',
                }
                return (
                  <div key={status} className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-2">
                    <span className={`text-sm font-bold ${colors[status] ?? 'text-gray-400'}`}>{count}</span>
                    <span className="text-xs text-gray-500">{status.replace('_', ' ')}</span>
                  </div>
                )
              })}
            </div>

            {/* Not-configured items */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Landingpages</p>
                <p className="text-sm text-yellow-400 font-medium">
                  {kpi.landingpages === 'not_configured' ? '⚠️ not configured' : kpi.landingpages}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Due Diligence Sections</p>
                <p className="text-sm text-yellow-400 font-medium">
                  {kpi.dueDiligenceSections === 'not_configured' ? '⚠️ not configured' : kpi.dueDiligenceSections}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Revenue</p>
                <p className="text-sm text-gray-400 font-medium">📊 estimated only — no real revenue</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Outreach vorbereitet</p>
                <p className="text-sm text-green-400 font-medium">✅ {kpi.outreachPrepared} Arbeitgeber</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Schnell-Zugriff</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/admin/pilot-outreach',          label: '📤 Outreach' },
              { href: '/admin/exit-readiness',          label: '📋 Exit Readiness' },
              { href: '/admin/pilot-launch',            label: '🚀 Pilot Launch' },
              { href: '/admin/e2e-pilot-test',          label: '🧪 E2E Test' },
              { href: '/admin/global/corridor-intelligence', label: '🗺️ Korridore' },
              { href: '/admin/ceo-dashboard',           label: '🏠 CEO Dashboard' },
              { href: '/admin/revenue',                 label: '💰 Revenue' },
              { href: '/admin/sale-readiness',          label: '🔍 Sale Readiness' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 rounded-lg bg-gray-800 text-xs text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
