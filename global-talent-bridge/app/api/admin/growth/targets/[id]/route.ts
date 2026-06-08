/**
 * PATCH  /api/admin/growth/targets/[id]  — update status or notes (admin only)
 * DELETE /api/admin/growth/targets/[id]  — remove target (admin only)
 *
 * Safety: no_auto_send, no_job_guarantee, no_visa_guarantee cannot be changed.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser }       from '@/lib/admin'
import { createAdminClient }         from '@/lib/supabase/admin'

const VALID_STATUSES = [
  'target_profile', 'real_contact_needed', 'draft_prepared',
  'needs_review', 'screenshot_review', 'approved_to_send_manually',
  'sent_manually', 'replied', 'rejected',
]

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Only allow safe fields — safety invariants cannot be changed
  const allowed: Record<string, unknown> = {}
  if (typeof body.status === 'string' && VALID_STATUSES.includes(body.status)) {
    allowed.status = body.status
  }
  if (typeof body.notes === 'string') {
    allowed.notes = body.notes.trim().slice(0, 2000)
  }
  if (typeof body.fit_score === 'number') {
    allowed.fit_score = Math.min(100, Math.max(0, body.fit_score))
  }
  if (typeof body.contact_email === 'string') {
    allowed.contact_email = body.contact_email.trim()
  }
  if (typeof body.company_name === 'string') {
    allowed.company_name = body.company_name.trim().slice(0, 300)
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('growth_targets')
    .update(allowed)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[growth/targets PATCH]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ target: data })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('growth_targets')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[growth/targets DELETE]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ deleted: id })
}
