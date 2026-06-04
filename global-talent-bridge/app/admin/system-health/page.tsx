import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

type TrafficLight = 'green' | 'yellow' | 'red' | 'unknown'

function TrafficBadge({ status, label }: { status: TrafficLight; label: string }) {
  const cfg: Record<TrafficLight, { dot: string; bg: string; text: string }> = {
    green:   { dot: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-800' },
    yellow:  { dot: 'bg-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-800' },
    red:     { dot: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-800' },
    unknown: { dot: 'bg-gray-400',   bg: 'bg-gray-50',   text: 'text-gray-600' },
  }
  const c = cfg[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {label}
    </span>
  )
}

export default async function SystemHealthPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/admin/login')

  const supabase = createAdminClient()

  // Probe DB connectivity + counts
  const [
    corridorsRes, miRes, lpRes, incidentsRes, logsRes,
    revenueEventsRes, agentNotifRes, agentSuggestRes,
  ] = await Promise.allSettled([
    supabase.from('corridors').select('id', { count: 'exact', head: true }),
    supabase.from('migration_intelligence').select('id', { count: 'exact', head: true }),
    supabase.from('landingpages').select('id', { count: 'exact', head: true }),
    supabase.from('system_incidents').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('system_logs').select('id', { count: 'exact', head: true }),
    supabase.from('revenue_events').select('id', { count: 'exact', head: true }),
    supabase.from('agent_notifications').select('id', { count: 'exact', head: true }),
    supabase.from('agent_suggestions').select('id', { count: 'exact', head: true }),
  ])

  const dbOk     = corridorsRes.status === 'fulfilled' && !corridorsRes.value.error
  const miOk     = miRes.status === 'fulfilled' && !miRes.value.error
  const lpOk     = lpRes.status === 'fulfilled' && !lpRes.value.error
  const incOk    = incidentsRes.status === 'fulfilled' && !incidentsRes.value.error

  const openIncidents = incOk ? (incidentsRes.value as { count: number | null }).count ?? 0 : '?'
  const totalLogs     = logsRes.status === 'fulfilled' && !logsRes.value.error
    ? (logsRes.value as { count: number | null }).count ?? 0 : '?'
  const revenueEvents = revenueEventsRes.status === 'fulfilled' && !revenueEventsRes.value.error
    ? (revenueEventsRes.value as { count: number | null }).count ?? 0 : '?'

  // Last agent run from system_logs
  const { data: lastAgentLog } = await supabase
    .from('system_logs')
    .select('created_at, details')
    .ilike('details', '%orchestrator%')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const agentLastRun = lastAgentLog?.created_at
    ? new Date(lastAgentLog.created_at).toLocaleString('de-DE')
    : 'noch nicht ausgeführt'

  const corridorCount = corridorsRes.status === 'fulfilled'
    ? (corridorsRes.value as { count: number | null }).count ?? 0 : 0
  const miCount = miRes.status === 'fulfilled'
    ? (miRes.value as { count: number | null }).count ?? 0 : 0
  const lpCount = lpRes.status === 'fulfilled'
    ? (lpRes.value as { count: number | null }).count ?? 0 : 0

  // Derive health statuses
  const dbStatus:     TrafficLight = dbOk ? 'green' : 'red'
  const miStatus:     TrafficLight = miOk && miCount > 0 ? 'green' : miOk ? 'yellow' : 'red'
  const agentStatus:  TrafficLight = lastAgentLog ? 'green' : 'yellow'
  const incStatus:    TrafficLight = Number(openIncidents) === 0 ? 'green' : Number(openIncidents) <= 2 ? 'yellow' : 'red'
  const lpStatus:     TrafficLight = lpOk && lpCount > 0 ? 'green' : lpOk ? 'yellow' : 'red'
  const revenueStatus:TrafficLight = Number(revenueEvents) > 0 ? 'green' : 'yellow'

  const allStatuses = [dbStatus, miStatus, agentStatus, incStatus, lpStatus, revenueStatus]
  const overallStatus: TrafficLight =
    allStatuses.includes('red') ? 'red' :
    allStatuses.includes('yellow') ? 'yellow' : 'green'

  const SECTIONS = [
    {
      title: '🗄 Datenbank (Supabase)',
      status: dbStatus,
      items: [
        { label: 'Verbindung',       value: dbOk ? 'OK' : 'FEHLER',     status: dbStatus },
        { label: 'Korridore',        value: String(corridorCount),       status: corridorCount > 0 ? 'green' as TrafficLight : 'yellow' as TrafficLight },
        { label: 'MI-Datensätze',    value: String(miCount),             status: miCount > 0 ? 'green' as TrafficLight : 'yellow' as TrafficLight },
        { label: 'Landingpages',     value: String(lpCount),             status: lpCount > 0 ? 'green' as TrafficLight : 'yellow' as TrafficLight },
        { label: 'Revenue Events',   value: String(revenueEvents),       status: revenueStatus },
        { label: 'System Logs',      value: String(totalLogs),           status: Number(totalLogs) > 0 ? 'green' as TrafficLight : 'yellow' as TrafficLight },
      ],
    },
    {
      title: '🤖 Agent System',
      status: agentStatus,
      items: [
        { label: 'Letzter Agent-Run',   value: agentLastRun,    status: agentStatus },
        { label: 'Offene Incidents',     value: String(openIncidents), status: incStatus },
        { label: 'Agent Notifications', value: String(agentNotifRes.status === 'fulfilled' && !agentNotifRes.value.error ? (agentNotifRes.value as { count: number | null }).count ?? 0 : '?'), status: 'green' as TrafficLight },
        { label: 'Agent Suggestions',   value: String(agentSuggestRes.status === 'fulfilled' && !agentSuggestRes.value.error ? (agentSuggestRes.value as { count: number | null }).count ?? 0 : '?'), status: 'green' as TrafficLight },
      ],
    },
    {
      title: '📊 Revenue System',
      status: revenueStatus,
      items: [
        { label: 'Forecast Events',    value: String(revenueEvents),   status: revenueStatus },
        { label: 'Status',             value: Number(revenueEvents) > 0 ? 'Szenarien vorhanden' : 'Noch kein Agent-Run', status: revenueStatus },
      ],
    },
    {
      title: '🚨 Incident Tracking',
      status: incStatus,
      items: [
        { label: 'Offene Incidents',   value: String(openIncidents),   status: incStatus },
        { label: 'Tabelle',            value: incOk ? 'system_incidents OK' : 'FEHLER', status: incOk ? 'green' as TrafficLight : 'red' as TrafficLight },
      ],
    },
  ]

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🏥 System Health Center</h1>
        <p className="text-gray-500 mt-1 text-sm">Echtzeit-Statusübersicht aller Systemkomponenten · Sprint F Enterprise Readiness</p>
      </div>

      {/* Overall status */}
      <div className={`rounded-xl p-6 border-2 flex items-center gap-4 ${
        overallStatus === 'green' ? 'bg-green-50 border-green-300' :
        overallStatus === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
        'bg-red-50 border-red-300'
      }`}>
        <div className={`text-5xl ${
          overallStatus === 'green' ? '' :
          overallStatus === 'yellow' ? '' : ''
        }`}>
          {overallStatus === 'green' ? '✅' : overallStatus === 'yellow' ? '⚠️' : '🔴'}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">
            Gesamtstatus: {overallStatus === 'green' ? 'Alle Systeme operational' : overallStatus === 'yellow' ? 'Geringfügige Hinweise' : 'Kritische Probleme'}
          </p>
          <p className="text-sm text-gray-600 mt-0.5">
            {allStatuses.filter(s => s === 'green').length} von {allStatuses.length} Systemgruppen grün
          </p>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTIONS.map(section => (
          <div key={section.title} className="bg-white rounded-xl border overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm">{section.title}</h2>
              <TrafficBadge status={section.status} label={section.status} />
            </div>
            <div className="divide-y">
              {section.items.map(item => (
                <div key={item.label} className="px-5 py-2.5 flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{item.value}</span>
                    <TrafficBadge status={item.status} label="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
        <strong>ℹ️ Hinweis:</strong> Diese Seite liest live aus der Supabase-Datenbank.
        Alle Werte spiegeln den aktuellen Datenbankzustand wider.
        Für detaillierte Agent-Logs und Incidents → <a href="/admin/system-audit" className="underline font-medium">System Audit</a>.
      </div>
    </main>
  )
}
