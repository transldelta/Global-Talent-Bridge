import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

const TABLES = [
  'profiles',
  'candidates',
  'employers',
  'jobs',
  'matches',
  'onboarding_progress',
  'system_logs',
  'agent_departments',
  'agent_registry',
  'agent_tasks',
  'agent_reports',
  'business_metrics',
] as const

export async function GET() {
  // Admin-Prüfung
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json(
      { error: 'Zugriff verweigert. Sie sind kein Admin.' },
      { status: 403 }
    )
  }

  const supabase = createAdminClient()
  const tableStatus: Record<string, { count: number | null; error: string | null }> = {}

  // Tabellen-Status prüfen
  for (const table of TABLES) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    tableStatus[table] = {
      count: error ? null : (count ?? 0),
      error: error ? error.message : null,
    }
  }

  // RLS-Status abfragen
  let rlsStatus: Array<{ table_name: string; rls_enabled: boolean }> = []
  const { data: rlsData, error: rlsError } = await supabase.rpc('get_rls_status')
  if (!rlsError && rlsData) {
    rlsStatus = rlsData
  }

  // Letzte 20 System-Logs
  const { data: logs } = await supabase
    .from('system_logs')
    .select('id, agent_name, status, message, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json({
    ok: true,
    admin_email: admin.email,
    checked_at: new Date().toISOString(),
    tables: tableStatus,
    rls_status: rlsStatus,
    last_logs: logs ?? [],
  })
}
