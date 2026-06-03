import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json(
      { error: 'Zugriff verweigert. Sie sind kein Admin.' },
      { status: 403 }
    )
  }

  const supabase = createAdminClient()

  const [departments, registry, tasks, reports, metrics, logs] = await Promise.all([
    supabase
      .from('agent_departments')
      .select('department_key, name, description, mission, active')
      .order('department_key'),

    supabase
      .from('agent_registry')
      .select('agent_name, department_key, description, active, risk_level, requires_human_approval'),

    supabase
      .from('agent_tasks')
      .select('id, department_key, agent_name, title, status, priority, requires_human_approval, created_at')
      .neq('status', 'completed')
      .order('priority', { ascending: false })
      .limit(20),

    supabase
      .from('agent_reports')
      .select('id, department_key, agent_name, report_type, title, summary, created_at')
      .order('created_at', { ascending: false })
      .limit(10),

    supabase
      .from('business_metrics')
      .select('metric_key, metric_name, metric_value, period, source, created_at')
      .order('created_at', { ascending: false })
      .limit(20),

    supabase
      .from('system_logs')
      .select('id, agent_name, status, message, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  return NextResponse.json({
    ok: true,
    admin_email: admin.email,
    fetched_at: new Date().toISOString(),
    departments: departments.data ?? [],
    agent_registry: registry.data ?? [],
    open_tasks: tasks.data ?? [],
    recent_reports: reports.data ?? [],
    business_metrics: metrics.data ?? [],
    recent_logs: logs.data ?? [],
  })
}
