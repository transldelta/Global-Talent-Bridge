import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

type Incident = {
  id: string
  type: string
  severity: string
  status: string
  title: string
  description: string | null
  source: string | null
  source_detail: string | null
  created_at: string
  resolved_at: string | null
}

type SystemLog = {
  id: string
  action: string
  details: string | null
  created_at: string
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high:     'bg-orange-100 text-orange-800 border-orange-200',
  medium:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  low:      'bg-blue-100 text-blue-800 border-blue-200',
}

const STATUS_COLOR: Record<string, string> = {
  open:         'bg-red-50 text-red-700',
  acknowledged: 'bg-yellow-50 text-yellow-700',
  resolved:     'bg-green-50 text-green-700',
  closed:       'bg-gray-100 text-gray-500',
}

const TYPE_ICON: Record<string, string> = {
  error:    '🔴',
  warning:  '🟡',
  info:     '🔵',
  critical: '🚨',
}

export default async function SystemAuditPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/admin/login')

  const supabase = createAdminClient()

  const [incidentsRes, logsRes] = await Promise.allSettled([
    supabase
      .from('system_incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('system_logs')
      .select('id, action, details, created_at')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  const incidents: Incident[] = incidentsRes.status === 'fulfilled' && incidentsRes.value.data
    ? (incidentsRes.value.data as Incident[])
    : []

  const logs: SystemLog[] = logsRes.status === 'fulfilled' && logsRes.value.data
    ? (logsRes.value.data as SystemLog[])
    : []

  const openIncidents      = incidents.filter(i => i.status === 'open')
  const criticalIncidents  = incidents.filter(i => i.severity === 'critical' || i.severity === 'high')
  const agentLogs          = logs.filter(l => l.details?.toLowerCase().includes('agent') || l.action?.toLowerCase().includes('agent'))
  const errorLogs          = logs.filter(l => l.action?.toLowerCase().includes('error') || l.details?.toLowerCase().includes('error'))

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🔍 System Audit Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Agent-Logs, Incidents, Fehler und Audit-Trail · Sprint F Enterprise Readiness</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className={`text-3xl font-bold ${openIncidents.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {openIncidents.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Offene Incidents</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className={`text-3xl font-bold ${criticalIncidents.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {criticalIncidents.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Critical/High</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{agentLogs.length}</p>
          <p className="text-xs text-gray-500 mt-1">Agent Log-Einträge</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className={`text-3xl font-bold ${errorLogs.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {errorLogs.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Fehler-Logs</p>
        </div>
      </div>

      {/* Open incidents alert */}
      {openIncidents.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-5">
          <h2 className="font-semibold text-red-800 mb-3">🚨 {openIncidents.length} offene Incident(s)</h2>
          <div className="space-y-2">
            {openIncidents.map(i => (
              <div key={i.id} className="flex items-start gap-3 text-sm text-red-700">
                <span>{TYPE_ICON[i.type] ?? '⚪'}</span>
                <div>
                  <p className="font-medium">{i.title}</p>
                  {i.description && <p className="text-red-500 text-xs">{i.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incidents table */}
      <section className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">🚨 System Incidents</h2>
          <span className="text-xs text-gray-500">letzte 50 Einträge</span>
        </div>
        {incidents.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Keine Incidents vorhanden ✅</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Titel</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Quelle</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Schwere</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {incidents.map(i => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-lg">{TYPE_ICON[i.type] ?? '⚪'}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{i.title}</p>
                    {i.description && <p className="text-gray-400 text-xs">{i.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {i.source ?? '—'}{i.source_detail ? ` / ${i.source_detail}` : ''}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${SEVERITY_COLOR[i.severity] ?? 'bg-gray-100 text-gray-600'}`}>
                      {i.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[i.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {i.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400 text-right">
                    {new Date(i.created_at).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* System logs */}
      <section className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">📋 System Logs (Audit Trail)</h2>
          <span className="text-xs text-gray-500">letzte 100 Einträge</span>
        </div>
        {logs.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Noch keine System-Logs vorhanden</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Zeitstempel</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Aktion</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-5 py-2.5 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString('de-DE')}
                    </td>
                    <td className="px-5 py-2.5 font-medium text-gray-800 text-xs whitespace-nowrap">
                      {l.action ?? '—'}
                    </td>
                    <td className="px-5 py-2.5 text-xs text-gray-500 max-w-lg truncate">
                      {l.details ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="bg-gray-50 border rounded-xl p-5 text-sm text-gray-600">
        <strong>ℹ️ Hinweis:</strong> Die Tabelle <code className="bg-gray-200 px-1 rounded">system_logs</code> wird automatisch
        von allen Agenten befüllt. Die Tabelle <code className="bg-gray-200 px-1 rounded">system_incidents</code> kann manuell
        oder per Agent-Aufruf befüllt werden. RLS ist aktiv — Zugriff nur per service_role.
      </div>
    </main>
  )
}
