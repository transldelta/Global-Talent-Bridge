import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { RunGrowthAgentButton } from './RunGrowthAgentButton'

export default async function GrowthDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  // Load KPIs in parallel
  const [
    { count: totalLeads },
    { count: interestedLeads },
    { count: qualifiedLeads },
    { count: totalSources },
    { count: activeSources },
    { count: totalPartners },
    { count: activePartners },
    { count: draftMessages },
    { count: approvedMessages },
    { count: sentMessages },
    { count: openTasks },
    { count: criticalTasks },
    { data: lastRuns },
    { data: topLeads },
    { data: recentTasks },
  ] = await Promise.all([
    adminSupabase.from('employer_leads').select('*', { count: 'exact', head: true }),
    adminSupabase.from('employer_leads').select('*', { count: 'exact', head: true }).eq('status', 'interested'),
    adminSupabase.from('employer_leads').select('*', { count: 'exact', head: true }).eq('status', 'qualified'),
    adminSupabase.from('candidate_growth_sources').select('*', { count: 'exact', head: true }),
    adminSupabase.from('candidate_growth_sources').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    adminSupabase.from('partner_leads').select('*', { count: 'exact', head: true }),
    adminSupabase.from('partner_leads').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    adminSupabase.from('outreach_messages').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    adminSupabase.from('outreach_messages').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    adminSupabase.from('outreach_messages').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
    adminSupabase.from('growth_tasks').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    adminSupabase.from('growth_tasks').select('*', { count: 'exact', head: true }).eq('status', 'open').eq('priority', 'critical'),
    adminSupabase.from('growth_agent_runs').select('created_at, leads_scored, tasks_created, messages_drafted, signals_found, summary').order('created_at', { ascending: false }).limit(3),
    adminSupabase.from('employer_leads').select('id, company_name, sector, score, status, city').order('score', { ascending: false }).limit(5),
    adminSupabase.from('growth_tasks').select('id, title, category, priority, status, due_date').eq('status', 'open').order('priority').limit(5),
  ])

  const kpis = [
    { label: 'Arbeitgeber-Leads', value: totalLeads ?? 0, sub: `${interestedLeads ?? 0} interessiert · ${qualifiedLeads ?? 0} qualifiziert`, color: 'text-blue-400', icon: '🏢', href: '/admin/growth/employers' },
    { label: 'Kandidatenquellen', value: totalSources ?? 0, sub: `${activeSources ?? 0} aktiv`, color: 'text-cyan-400', icon: '👤', href: '/admin/growth/candidates' },
    { label: 'Partner-Leads', value: totalPartners ?? 0, sub: `${activePartners ?? 0} aktiv`, color: 'text-purple-400', icon: '🤝', href: '/admin/growth/partners' },
    { label: 'Outreach-Nachrichten', value: (draftMessages ?? 0) + (approvedMessages ?? 0) + (sentMessages ?? 0), sub: `${approvedMessages ?? 0} freigegeben · ${sentMessages ?? 0} versendet`, color: 'text-green-400', icon: '✉️', href: '/admin/growth/outreach' },
    { label: 'Offene Aufgaben', value: openTasks ?? 0, sub: criticalTasks ? `${criticalTasks} kritisch` : 'Alles im Plan', color: (criticalTasks ?? 0) > 0 ? 'text-red-400' : 'text-yellow-400', icon: '📋', href: '/admin/growth/tasks' },
  ]

  const priorityColor: Record<string, string> = {
    critical: 'bg-red-900/30 text-red-300 border border-red-800/40',
    high: 'bg-orange-900/20 text-orange-300 border border-orange-800/30',
    medium: 'bg-yellow-900/20 text-yellow-300 border border-yellow-800/30',
    low: 'bg-gray-800 text-gray-400 border border-gray-700',
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">🚀 Growth Engine</h1>
            <p className="text-gray-400 mt-1 text-sm">Kontrollierte Wachstumsstrategie · Kein Spam · Kein Auto-Send</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/growth/launch-readiness" className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm rounded-lg transition-colors">🎯 Launch-Bereitschaft</Link>
            <Link href="/admin/growth/approval-queue" className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm rounded-lg transition-colors">✅ Freigabe-Warteschlange</Link>
            <Link href="/admin/growth/activity-log" className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm rounded-lg transition-colors">📜 Aktivitätslog</Link>
          </div>
        </div>

        {/* Agent Button */}
        <div className="bg-gray-900 rounded-2xl border border-emerald-800/30 p-5">
          <h2 className="text-sm font-semibold text-emerald-300 mb-3">🤖 Growth-Agent</h2>
          <p className="text-gray-400 text-xs mb-4">
            Bewertet Leads, erkennt Signale, erstellt Aufgaben und entwirft Nachrichten.
            Sendet niemals automatisch — alle Nachrichten müssen manuell freigegeben werden.
          </p>
          <RunGrowthAgentButton />
          {lastRuns && lastRuns.length > 0 && (
            <div className="mt-4 space-y-1">
              {lastRuns.slice(0, 2).map((run, i) => (
                <p key={i} className="text-xs text-gray-500">
                  {new Date(run.created_at).toLocaleString('de-DE')} — {run.summary ?? 'Kein Summary'}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map((kpi) => (
            <Link
              key={kpi.label}
              href={kpi.href}
              className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-600 transition-colors"
            >
              <div className="text-2xl mb-1">{kpi.icon}</div>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-gray-400 text-xs mt-0.5 font-medium">{kpi.label}</div>
              <div className="text-gray-500 text-xs mt-1">{kpi.sub}</div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/admin/growth/employers', icon: '🏢', label: 'Arbeitgeber-Leads verwalten', desc: 'Leads hinzufügen, bewerten, kontaktieren' },
            { href: '/admin/growth/candidates', icon: '👤', label: 'Kandidatenquellen', desc: 'Kanäle zur Kandidatengewinnung' },
            { href: '/admin/growth/partners', icon: '🤝', label: 'Partner-Leads', desc: 'Sprachschulen, Agenturen, NGOs' },
            { href: '/admin/growth/outreach', icon: '✉️', label: 'Outreach-Nachrichten', desc: 'Entwürfe freigeben und versenden' },
            { href: '/admin/growth/tasks', icon: '📋', label: 'Aufgaben-Board', desc: 'Wachstumsaufgaben verwalten' },
            { href: '/admin/ceo-dashboard', icon: '🎯', label: 'CEO-Dashboard', desc: 'Zurück zum Gesamt-Überblick' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-600 transition-colors flex items-start gap-3"
            >
              <span className="text-2xl shrink-0">{link.icon}</span>
              <div>
                <p className="text-white text-sm font-medium">{link.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Top Leads + Open Tasks side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Leads */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">🏆 Top Arbeitgeber-Leads</h2>
              <Link href="/admin/growth/employers" className="text-xs text-blue-400 hover:text-blue-300">Alle →</Link>
            </div>
            <div className="space-y-2">
              {(topLeads ?? []).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-2 py-2 border-b border-gray-800 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{lead.company_name}</p>
                    <p className="text-gray-500 text-xs">{[lead.sector, lead.city].filter(Boolean).join(' · ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-bold ${lead.score >= 70 ? 'text-green-400' : lead.score >= 50 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {lead.score}%
                    </span>
                    <p className="text-gray-600 text-xs capitalize">{lead.status}</p>
                  </div>
                </div>
              ))}
              {(!topLeads || topLeads.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">Keine Leads vorhanden.</p>
              )}
            </div>
          </div>

          {/* Open Tasks */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">📋 Offene Aufgaben</h2>
              <Link href="/admin/growth/tasks" className="text-xs text-blue-400 hover:text-blue-300">Alle →</Link>
            </div>
            <div className="space-y-2">
              {(recentTasks ?? []).map((task) => (
                <div key={task.id} className="flex items-start gap-2 py-2 border-b border-gray-800 last:border-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${priorityColor[task.priority] ?? priorityColor.low}`}>
                    {task.priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm leading-snug truncate">{task.title}</p>
                    {task.due_date && (
                      <p className="text-gray-500 text-xs mt-0.5">
                        Fällig: {new Date(task.due_date).toLocaleDateString('de-DE')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {(!recentTasks || recentTasks.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">Keine offenen Aufgaben. ✅</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
