import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

const TABLES = [
  'profiles', 'candidates', 'employers', 'jobs', 'matches',
  'onboarding_progress', 'system_logs', 'agent_departments',
  'agent_registry', 'agent_tasks', 'agent_reports', 'business_metrics',
] as const

type TableName = (typeof TABLES)[number]

export default async function SystemCheckPage() {
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
  const tableStatus: Record<TableName, { count: number | null; error: string | null }> =
    {} as Record<TableName, { count: number | null; error: string | null }>

  // Alle Tabellen-Counts parallel laden
  await Promise.all(
    TABLES.map(async (table) => {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      tableStatus[table] = {
        count: error ? null : (count ?? 0),
        error: error ? error.message : null,
      }
    })
  )

  const { data: rlsData } = await supabase.rpc('get_rls_status')
  const rlsMap = new Map<string, boolean>()
  if (rlsData) {
    for (const row of rlsData as { table_name: string; rls_enabled: boolean }[]) {
      rlsMap.set(row.table_name, row.rls_enabled)
    }
  }

  const { data: logs } = await supabase
    .from('system_logs')
    .select('id, agent_name, status, message, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  const allTablesOk = Object.values(tableStatus).every((t) => t.error === null)

  // KPI-Zusammenfassung aus den geladenen Counts
  const kpiItems = [
    { label: 'User-Profile', key: 'profiles' as TableName, emoji: '👤' },
    { label: 'Kandidaten', key: 'candidates' as TableName, emoji: '🎓' },
    { label: 'Arbeitgeber', key: 'employers' as TableName, emoji: '🏢' },
    { label: 'Jobs', key: 'jobs' as TableName, emoji: '💼' },
    { label: 'Matches', key: 'matches' as TableName, emoji: '🎯' },
    { label: 'System-Logs', key: 'system_logs' as TableName, emoji: '📋' },
    { label: 'Abteilungen', key: 'agent_departments' as TableName, emoji: '🏛️' },
    { label: 'Business Metrics', key: 'business_metrics' as TableName, emoji: '📊' },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Status-Header */}
        <div className="flex items-center gap-4">
          <div
            className={`w-3 h-3 rounded-full ${allTablesOk ? 'bg-green-400' : 'bg-red-400'}`}
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              System Status:{' '}
              {allTablesOk ? '✅ Alle Systeme operativ' : '⚠️ Fehler erkannt'}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {new Date().toLocaleString('de-DE')} · Admin: {admin.email}
            </p>
          </div>
        </div>

        {/* KPI-Zusammenfassung */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">KPI-Überblick</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {kpiItems.map(({ label, key, emoji }) => {
              const status = tableStatus[key]
              return (
                <div
                  key={key}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-2xl font-bold text-white">
                    {status.error ? '—' : (status.count ?? 0)}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RLS-Status aller Tabellen */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">RLS-Status</h2>
          <div className="flex flex-wrap gap-2">
            {TABLES.map((table) => {
              const rlsEnabled = rlsMap.get(table)
              return (
                <span
                  key={table}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    rlsEnabled === true
                      ? 'bg-green-900/40 text-green-300'
                      : rlsEnabled === false
                      ? 'bg-red-900/40 text-red-300'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {table} {rlsEnabled === true ? '🔒' : rlsEnabled === false ? '⚠️' : '?'}
                </span>
              )
            })}
          </div>
        </div>

        {/* Tabellen-Detail */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Datenbank-Tabellen</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {TABLES.map((table) => {
              const status = tableStatus[table]
              const rlsEnabled = rlsMap.get(table)
              return (
                <div key={table} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status.error ? 'bg-red-400' : 'bg-green-400'
                      }`}
                    />
                    <span className="text-gray-200 font-mono text-sm">{table}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    {status.error ? (
                      <span className="text-red-400">{status.error}</span>
                    ) : (
                      <span className="text-gray-400">{status.count} Einträge</span>
                    )}
                    {rlsEnabled !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          rlsEnabled
                            ? 'bg-green-900/40 text-green-300'
                            : 'bg-red-900/40 text-red-300'
                        }`}
                      >
                        RLS {rlsEnabled ? 'ON' : 'OFF'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Letzte System-Logs</h2>
          </div>
          {!logs || logs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">Keine Logs vorhanden.</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {logs.map((log) => (
                <div key={log.id} className="px-6 py-3 flex items-start gap-3">
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
                    <p className="text-gray-500 text-xs mt-0.5">
                      {log.agent_name && <span className="mr-2">[{log.agent_name}]</span>}
                      {new Date(log.created_at).toLocaleString('de-DE')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
