/**
 * GET /api/admin/cwo-last-run
 *
 * Liest den letzten autonomous_worklog Eintrag für das CWO Command Center.
 * Admin-only. KEIN externer Call. Nur DB-Lesen.
 */
import { NextResponse }             from 'next/server'
import { getCurrentAdminUser }      from '@/lib/admin'
import { createAdminClient }        from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('autonomous_worklog')
    .select('id, report_type, system_health, summary, completed_items, open_items, next_action, compliance_status, no_email_sent, no_auto_outreach, no_scraping, created_by, created_at')
    .eq('report_type', 'daily')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ lastRun: data ?? null })
}
