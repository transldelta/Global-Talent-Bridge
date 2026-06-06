/**
 * GET  /api/admin/revenue-leads     — Liste aller Leads (mit Filter)
 * PATCH /api/admin/revenue-leads    — Status / Notiz aktualisieren
 *
 * Admin-only. Kein Send-Button. Kein automatischer Versand.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser }       from '@/lib/admin'
import { createAdminClient }         from '@/lib/supabase/admin'
import type { LeadStatus }           from '@/lib/revenue-leads'

export const dynamic = 'force-dynamic'

// ── GET: Leads laden ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = await getCurrentAdminUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const lead_type = searchParams.get('lead_type') ?? undefined
  const status    = searchParams.get('status')    ?? undefined
  const limit     = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)

  const supabase = createAdminClient()
  let query = supabase
    .from('revenue_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (lead_type) query = query.eq('lead_type', lead_type)
  if (status)    query = query.eq('status', status)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leads: data ?? [], count: data?.length ?? 0 })
}

// ── PATCH: Status / Notiz aktualisieren ──────────────────────────────────────

export async function PATCH(req: NextRequest) {
  const user = await getCurrentAdminUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { id: string; status?: LeadStatus; admin_note?: string; worklog?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id ist erforderlich' }, { status: 400 })
  }

  const VALID_STATUSES: LeadStatus[] = ['new', 'reviewed', 'qualified', 'rejected', 'contacted_manual']
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Ungültiger Status' }, { status: 400 })
  }

  const supabase  = createAdminClient()
  const updateObj: Record<string, unknown> = {}
  if (body.status)     updateObj.status     = body.status
  if (body.admin_note !== undefined) updateObj.admin_note = body.admin_note

  if (Object.keys(updateObj).length === 0) {
    return NextResponse.json({ error: 'Nichts zu aktualisieren' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('revenue_leads')
    .update(updateObj)
    .eq('id', body.id)
    .select('id, status, admin_note')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Optional: In autonomous_worklog übernehmen
  if (body.worklog) {
    await supabase.from('autonomous_worklog').insert({
      report_type:      'system_check',
      system_health:    'green',
      summary:          `Revenue Lead ${body.id} als "${body.status}" markiert von ${user.email}`,
      completed_items:  [`Lead ${body.id}: status → ${body.status}`],
      open_items:       ['Keine offenen Punkte'],
      next_action:      'Lead manuell bearbeiten',
      compliance_status: 'safe',
      no_email_sent:    true,
      no_auto_outreach: true,
      no_scraping:      true,
      created_by:       'admin_revenue_inbox',
    })
  }

  return NextResponse.json({ success: true, lead: data, noEmailSent: true })
}
