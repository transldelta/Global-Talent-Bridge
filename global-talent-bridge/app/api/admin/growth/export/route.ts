/**
 * GET /api/admin/growth/export
 *
 * Export growth pipeline as JSON — admin only.
 * Returns all targets with their messages.
 * For sale/transfer due diligence.
 *
 * No PII exported unnecessarily. No automatic sending triggered.
 */
import { NextResponse }          from 'next/server'
import { getCurrentAdminUser }   from '@/lib/admin'
import { createAdminClient }     from '@/lib/supabase/admin'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  const { data: targets, error: tErr } = await supabase
    .from('growth_targets')
    .select(`
      id, target_kind, company_name, country, source_market,
      destination_market, sector, corridor, message_type,
      fit_score, risk_level, status, notes,
      no_auto_send, no_job_guarantee, no_visa_guarantee,
      created_at, updated_at,
      growth_messages(id, channel, subject, status, no_auto_send, created_at)
    `)
    .order('created_at', { ascending: false })

  if (tErr) {
    console.error('[growth/export GET]', tErr.message)
    return NextResponse.json({ error: tErr.message }, { status: 500 })
  }

  const { count: msgCount } = await supabase
    .from('growth_messages')
    .select('*', { count: 'exact', head: true })

  const exportPayload = {
    export_metadata: {
      exported_at:       new Date().toISOString(),
      product:           'CorridorWork',
      version:           '1.0',
      purpose:           'Growth pipeline — buyer due diligence / transfer',
      no_auto_send:      true,
      no_job_guarantee:  true,
      no_visa_guarantee: true,
      note:              'All outreach is manual-approval-based. No automated sending has occurred.',
    },
    summary: {
      total_targets:    targets?.length ?? 0,
      total_messages:   msgCount ?? 0,
      by_status:        countBy(targets ?? [], 'status'),
      by_target_kind:   countBy(targets ?? [], 'target_kind'),
      by_country:       countBy(targets ?? [], 'country'),
    },
    targets: targets ?? [],
  }

  return NextResponse.json(exportPayload)
}

function countBy(arr: Record<string, unknown>[], key: string): Record<string, number> {
  return arr.reduce((acc: Record<string, number>, item) => {
    const val = String(item[key] ?? 'unknown')
    acc[val] = (acc[val] ?? 0) + 1
    return acc
  }, {})
}
