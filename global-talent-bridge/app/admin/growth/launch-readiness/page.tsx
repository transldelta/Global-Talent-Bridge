import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

type CheckItem = {
  label: string
  value: number | string
  target: number | string
  passed: boolean
  description: string
  action?: string
  actionHref?: string
}

export default async function LaunchReadinessPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  // Load all metrics
  const [
    { count: candidates },
    { count: employers },
    { count: jobs },
    { count: matches },
    { count: employerLeads },
    { count: interestedLeads },
    { count: activeSources },
    { count: activePartners },
    { count: sentMessages },
    { count: openTasks },
  ] = await Promise.all([
    adminSupabase.from('candidates').select('*', { count: 'exact', head: true }),
    adminSupabase.from('employers').select('*', { count: 'exact', head: true }),
    adminSupabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    adminSupabase.from('matches').select('*', { count: 'exact', head: true }),
    adminSupabase.from('employer_leads').select('*', { count: 'exact', head: true }),
    adminSupabase.from('employer_leads').select('*', { count: 'exact', head: true }).in('status', ['interested', 'qualified']),
    adminSupabase.from('candidate_growth_sources').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    adminSupabase.from('partner_leads').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    adminSupabase.from('outreach_messages').select('*', { count: 'exact', head: true }).in('status', ['sent', 'replied']),
    adminSupabase.from('growth_tasks').select('*', { count: 'exact', head: true }).eq('status', 'open').eq('priority', 'critical'),
  ])

  const checks: CheckItem[] = [
    {
      label: 'Kandidatenprofile',
      value: candidates ?? 0,
      target: 10,
      passed: (candidates ?? 0) >= 10,
      description: 'Mindestens 10 echte Kandidatenprofile für sinnvolles Matching.',
      action: 'Kandidatenquellen aktivieren',
      actionHref: '/admin/growth/candidates',
    },
    {
      label: 'Registrierte Arbeitgeber',
      value: employers ?? 0,
      target: 3,
      passed: (employers ?? 0) >= 3,
      description: 'Mindestens 3 Arbeitgeber für den Produktivbetrieb.',
      action: 'Arbeitgeber-Leads konvertieren',
      actionHref: '/admin/growth/employers',
    },
    {
      label: 'Aktive Stellenangebote',
      value: jobs ?? 0,
      target: 5,
      passed: (jobs ?? 0) >= 5,
      description: 'Mindestens 5 aktive Jobs für Kandidaten sichtbar.',
      action: 'Jobs über Arbeitgeber-Onboarding anlegen',
      actionHref: '/admin/leads',
    },
    {
      label: 'Berechnete Matches',
      value: matches ?? 0,
      target: 10,
      passed: (matches ?? 0) >= 10,
      description: 'Mindestens 10 Matches zeigen Systemfunktionsfähigkeit.',
      action: 'Matching manuell auslösen',
      actionHref: '/candidate/dashboard',
    },
    {
      label: 'Arbeitgeber-Leads (Pipeline)',
      value: employerLeads ?? 0,
      target: 5,
      passed: (employerLeads ?? 0) >= 5,
      description: 'Mindestens 5 Leads in der Pipeline für kontinuierliches Wachstum.',
      action: 'Growth Agent ausführen',
      actionHref: '/admin/growth',
    },
    {
      label: 'Interessierte Leads',
      value: interestedLeads ?? 0,
      target: 1,
      passed: (interestedLeads ?? 0) >= 1,
      description: 'Mindestens 1 Lead hat echtes Interesse bekundet.',
      action: 'Outreach-Nachrichten senden',
      actionHref: '/admin/growth/outreach',
    },
    {
      label: 'Aktive Kandidatenquellen',
      value: activeSources ?? 0,
      target: 2,
      passed: (activeSources ?? 0) >= 2,
      description: 'Mindestens 2 aktive Kanäle zur Kandidatengewinnung.',
      action: 'Quellen aktivieren',
      actionHref: '/admin/growth/candidates',
    },
    {
      label: 'Aktive Partnerschaften',
      value: activePartners ?? 0,
      target: 1,
      passed: (activePartners ?? 0) >= 1,
      description: 'Mindestens 1 aktive strategische Partnerschaft.',
      action: 'Partner kontaktieren',
      actionHref: '/admin/growth/partners',
    },
    {
      label: 'Versendete Nachrichten',
      value: sentMessages ?? 0,
      target: 3,
      passed: (sentMessages ?? 0) >= 3,
      description: 'Mindestens 3 Outreach-Nachrichten versendet.',
      action: 'Nachrichten freigeben und senden',
      actionHref: '/admin/growth/outreach',
    },
    {
      label: 'Kritische offene Aufgaben',
      value: openTasks ?? 0,
      target: 0,
      passed: (openTasks ?? 0) === 0,
      description: 'Keine kritischen Aufgaben offen.',
      action: 'Aufgaben abarbeiten',
      actionHref: '/admin/growth/tasks',
    },
  ]

  const passedCount = checks.filter((c) => c.passed).length
  const readinessPercent = Math.round((passedCount / checks.length) * 100)

  const readinessLevel =
    readinessPercent >= 90 ? { label: '🚀 Launch bereit!', color: 'text-green-400', bg: 'bg-green-900/20 border-green-800/40' }
    : readinessPercent >= 60 ? { label: '⚡ Fast bereit', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/40' }
    : readinessPercent >= 30 ? { label: '🔧 In Arbeit', color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-800/40' }
    : { label: '🌱 Frühe Phase', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-800/40' }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Link href="/admin/growth" className="hover:text-gray-300">Growth Engine</Link>
            <span>›</span>
            <span>Launch-Bereitschaft</span>
          </div>
          <h1 className="text-2xl font-bold text-white">🎯 Launch-Bereitschaft</h1>
          <p className="text-gray-400 mt-1 text-sm">Prüft, ob die Plattform für den echten Betrieb bereit ist.</p>
        </div>

        {/* Readiness score */}
        <div className={`rounded-2xl border p-6 ${readinessLevel.bg}`}>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className={`text-2xl font-bold ${readinessLevel.color}`}>{readinessLevel.label}</p>
              <p className="text-gray-400 text-sm mt-1">{passedCount} von {checks.length} Kriterien erfüllt</p>
            </div>
            <div className={`text-5xl font-black ${readinessLevel.color}`}>{readinessPercent}%</div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${readinessPercent >= 90 ? 'bg-green-500' : readinessPercent >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {checks.map((check, i) => (
            <div
              key={i}
              className={`bg-gray-900 rounded-xl border p-4 flex items-start gap-4 ${check.passed ? 'border-green-900/40' : 'border-gray-800'}`}
            >
              <div className="text-xl shrink-0 mt-0.5">
                {check.passed ? '✅' : '⬜'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`font-medium ${check.passed ? 'text-green-300' : 'text-white'}`}>{check.label}</h3>
                  <span className={`text-sm font-bold ${check.passed ? 'text-green-400' : 'text-yellow-400'}`}>
                    {check.value} / {check.target}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">{check.description}</p>
                {!check.passed && check.action && check.actionHref && (
                  <Link
                    href={check.actionHref}
                    className="inline-block mt-2 text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors"
                  >
                    → {check.action}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
