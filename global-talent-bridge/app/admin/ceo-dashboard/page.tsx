import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

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

  const [deptRes, taskRes, reportRes, metricsRes, logsRes] = await Promise.all([
    supabase
      .from('agent_departments')
      .select('department_key, name, description, mission, active')
      .order('department_key'),
    supabase
      .from('agent_tasks')
      .select('id, department_key, agent_name, title, status, priority, requires_human_approval, created_at')
      .neq('status', 'completed')
      .order('priority', { ascending: false })
      .limit(10),
    supabase
      .from('agent_reports')
      .select('id, department_key, agent_name, report_type, title, summary, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('business_metrics')
      .select('metric_key, metric_name, metric_value, period, source, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('system_logs')
      .select('id, agent_name, status, message, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const departments: Department[] = deptRes.data ?? []
  const tasks: AgentTask[] = taskRes.data ?? []
  const reports: AgentReport[] = reportRes.data ?? []
  const metrics: BusinessMetric[] = metricsRes.data ?? []
  const logs: SystemLog[] = logsRes.data ?? []

  const ceo = departments.find((d) => d.department_key === 'ceo_command')
  const subDepts = departments.filter((d) => d.department_key !== 'ceo_command')
  const activeDepts = subDepts.filter((d) => d.active).length

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">Global Talent Bridge</span>
            <span className="text-xs px-2 py-0.5 bg-purple-900/50 text-purple-300 rounded-full">
              CEO / Erzdirigent
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/system-check"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              System Check
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Startseite
            </Link>
            <span className="text-xs text-gray-500">{admin.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* CEO-Header */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800/50 rounded-2xl p-8">
          <div className="flex items-start gap-6">
            <div className="text-5xl">🎯</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">CEO / Erzdirigent</h1>
              {ceo?.mission && (
                <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">{ceo.mission}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="text-sm text-gray-400">
                  <span className="text-white font-semibold">{subDepts.length}</span> Abteilungen vorbereitet
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-semibold">{activeDepts}</span> aktiv
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-semibold">{tasks.length}</span> offene Aufgaben
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

        {/* 12 Abteilungen */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">12 Abteilungen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subDepts.map((dept) => (
              <div
                key={dept.department_key}
                className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm leading-tight">{dept.name}</h3>
                  <StatusBadge active={dept.active} />
                </div>
                {dept.mission && (
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                    {dept.mission}
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <span className="text-xs text-gray-600 font-mono">{dept.department_key}</span>
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
                <p className="text-green-200/60 text-xs">Serverseitig geprüft, kein Client-Zugriff</p>
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
                <div key={task.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{task.title || 'Unbenannte Aufgabe'}</p>
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
                <div key={report.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white text-sm font-medium">{report.title || 'Unbenannter Bericht'}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {report.department_key ?? '—'} · {report.report_type ?? '—'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {new Date(report.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  {report.summary && (
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">{report.summary}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Business Metrics */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">📈 Business Metrics</h2>
          {metrics.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              Noch keine Metriken vorhanden.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {metrics.map((m, i) => (
                <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                  <p className="text-xs text-gray-500 mb-1">{m.metric_name ?? m.metric_key ?? '—'}</p>
                  <p className="text-2xl font-bold text-white">{m.metric_value}</p>
                  {m.period && <p className="text-xs text-gray-600 mt-1">{m.period}</p>}
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
                        {log.agent_name && <span className="mr-2">[{log.agent_name}]</span>}
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
