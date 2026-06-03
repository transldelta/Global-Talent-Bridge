import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const adminSupabase = createAdminClient()

    const [
      { count: totalLeads },
      { count: interestedLeads },
      { count: totalSources },
      { count: activeSources },
      { count: totalPartners },
      { count: activePartners },
      { count: totalMessages },
      { count: approvedMessages },
      { count: openTasks },
      { count: doneTasks },
      { data: lastRuns },
    ] = await Promise.all([
      adminSupabase.from('employer_leads').select('*', { count: 'exact', head: true }),
      adminSupabase.from('employer_leads').select('*', { count: 'exact', head: true }).in('status', ['interested', 'qualified']),
      adminSupabase.from('candidate_growth_sources').select('*', { count: 'exact', head: true }),
      adminSupabase.from('candidate_growth_sources').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      adminSupabase.from('partner_leads').select('*', { count: 'exact', head: true }),
      adminSupabase.from('partner_leads').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      adminSupabase.from('outreach_messages').select('*', { count: 'exact', head: true }),
      adminSupabase.from('outreach_messages').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      adminSupabase.from('growth_tasks').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      adminSupabase.from('growth_tasks').select('*', { count: 'exact', head: true }).eq('status', 'done'),
      adminSupabase.from('growth_agent_runs').select('created_at, leads_scored, tasks_created, signals_found, summary').order('created_at', { ascending: false }).limit(3),
    ])

    return NextResponse.json({
      employer_leads: { total: totalLeads ?? 0, interested: interestedLeads ?? 0 },
      candidate_sources: { total: totalSources ?? 0, active: activeSources ?? 0 },
      partners: { total: totalPartners ?? 0, active: activePartners ?? 0 },
      outreach_messages: { total: totalMessages ?? 0, approved: approvedMessages ?? 0 },
      tasks: { open: openTasks ?? 0, done: doneTasks ?? 0 },
      last_runs: lastRuns ?? [],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
