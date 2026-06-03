import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

export default async function ActivityLogPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  const [
    { data: growthRuns },
    { data: agentRuns },
    { data: sentMessages },
    { data: doneTasks },
    { data: convertedLeads },
    { data: systemLogs },
  ] = await Promise.all([
    adminSupabase
      .from('growth_agent_runs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20),
    adminSupabase
      .from('agent_run_logs')
      .select('id, created_at, suggestions_created, notifications_created, summary, status')
      .order('created_at', { ascending: false })
      .limit(10),
    adminSupabase
      .from('outreach_messages')
      .select('recipient_name, recipient_email, channel, sent_at')
      .eq('status', 'sent')
      .order('sent_at', { ascending: false })
      .limit(20),
    adminSupabase
      .from('growth_tasks')
      .select('title, category, completed_at, source')
      .eq('status', 'done')
      .order('completed_at', { ascending: false })
      .limit(20),
    adminSupabase
      .from('employer_leads')
      .select('company_name, status, updated_at, source')
      .in('status', ['interested', 'qualified', 'closed_won'])
      .order('updated_at', { ascending: false })
      .limit(10),
    adminSupabase
      .from('system_logs')
      .select('event, details, created_at')
      .order('created_at', { ascending: false })
      .limit(15),
  ])

  // Merge all events into a single timeline
  type TimelineEvent = {
    time: string
    icon: string
    label: string
    detail: string
    color: string
  }

  const events: TimelineEvent[] = []

  for (const run of growthRuns ?? []) {
    events.push({
      time: run.created_at,
      icon: '🤖',
      label: 'Growth-Agent ausgeführt',
      detail: run.summary ?? `${run.leads_scored} Leads · ${run.tasks_created} Aufgaben · ${run.messages_drafted} Nachrichten`,
      color: 'text-emerald-400',
    })
  }

  for (const run of agentRuns ?? []) {
    events.push({
      time: run.created_at,
      icon: '🧠',
      label: 'CEO-Agent ausgeführt',
      detail: run.summary ?? `${run.suggestions_created ?? 0} Vorschläge · ${run.notifications_created ?? 0} Benachrichtigungen`,
      color: 'text-purple-400',
    })
  }

  for (const msg of sentMessages ?? []) {
    if (!msg.sent_at) continue
    events.push({
      time: msg.sent_at,
      icon: '📤',
      label: `Nachricht versendet: ${msg.recipient_name ?? '—'}`,
      detail: `via ${msg.channel ?? 'E-Mail'} · ${msg.recipient_email ?? ''}`,
      color: 'text-blue-400',
    })
  }

  for (const task of doneTasks ?? []) {
    if (!task.completed_at) continue
    events.push({
      time: task.completed_at,
      icon: '✅',
      label: `Aufgabe erledigt: ${task.title}`,
      detail: `Kategorie: ${task.category.replace(/_/g, ' ')} · ${task.source === 'agent_suggested' ? '🤖 Agent' : 'Manuell'}`,
      color: 'text-green-400',
    })
  }

  for (const lead of convertedLeads ?? []) {
    events.push({
      time: lead.updated_at,
      icon: '🏢',
      label: `Lead: ${lead.company_name}`,
      detail: `Status → ${lead.status} · ${lead.source}`,
      color: 'text-yellow-400',
    })
  }

  for (const log of systemLogs ?? []) {
    events.push({
      time: log.created_at,
      icon: '⚙️',
      label: log.event ?? 'System-Event',
      detail: typeof log.details === 'object' ? JSON.stringify(log.details).slice(0, 100) : String(log.details ?? ''),
      color: 'text-gray-400',
    })
  }

  // Sort by time desc
  events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Link href="/admin/growth" className="hover:text-gray-300">Growth Engine</Link>
            <span>›</span>
            <span>Aktivitätslog</span>
          </div>
          <h1 className="text-2xl font-bold text-white">📜 Aktivitätslog</h1>
          <p className="text-gray-400 mt-1 text-sm">{events.length} Ereignisse in der Chronik</p>
        </div>

        {events.length === 0 && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
            <p className="text-4xl mb-3">📜</p>
            <p className="text-gray-400">Noch keine Aktivitäten aufgezeichnet.</p>
          </div>
        )}

        <div className="space-y-2">
          {events.map((event, i) => (
            <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-start gap-3">
              <span className="text-xl shrink-0">{event.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${event.color}`}>{event.label}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{event.detail}</p>
              </div>
              <div className="text-gray-600 text-xs shrink-0 text-right">
                <p>{new Date(event.time).toLocaleDateString('de-DE')}</p>
                <p>{new Date(event.time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
