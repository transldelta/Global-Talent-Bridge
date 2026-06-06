/**
 * PATCH /api/admin/outreach-autopilot/[id]/status
 *
 * Aktualisiert den Status eines Outreach-Autopilot-Eintrags.
 * Nur erlaubte Statusübergänge (validateStatusTransition).
 * KEIN E-Mail-Versand. KEIN automatischer Outreach.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateStatusTransition } from '@/lib/outreach-autopilot'
import type { EntryStatus } from '@/lib/outreach-autopilot/types'

type RouteParams = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  if (!id?.trim()) {
    return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 })
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let body: { status: EntryStatus }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const newStatus = body.status
  if (!newStatus) {
    return NextResponse.json({ error: 'status fehlt.' }, { status: 400 })
  }

  // ── Aktuellen Status lesen ─────────────────────────────────────────────────
  const db = createAdminClient()

  const { data: current, error: fetchError } = await db
    .from('outreach_autopilot_entries')
    .select('id, status, company_name, fit_score, compliance_status')
    .eq('id', id)
    .single()

  if (fetchError || !current) {
    return NextResponse.json({ error: 'Eintrag nicht gefunden.' }, { status: 404 })
  }

  // ── Transition validieren ─────────────────────────────────────────────────
  const transitionError = validateStatusTransition(
    current.status as EntryStatus,
    newStatus,
  )
  if (transitionError) {
    return NextResponse.json({ error: transitionError }, { status: 422 })
  }

  // ── Spezialcheck: approved_for_manual_copy nur wenn safe + score ≥ 70 ────
  if (newStatus === 'approved_for_manual_copy') {
    if (current.compliance_status === 'blocked') {
      return NextResponse.json(
        { error: 'Freigabe nicht möglich: Compliance-Status ist "blocked".' },
        { status: 422 },
      )
    }
    if ((current.fit_score ?? 0) < 70) {
      return NextResponse.json(
        { error: `Freigabe nicht möglich: Fit Score ${current.fit_score}/100 unter 70.` },
        { status: 422 },
      )
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  const { data: updated, error: updateError } = await db
    .from('outreach_autopilot_entries')
    .update({ status: newStatus })
    .eq('id', id)
    .select('id, status, company_name, updated_at')
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // ── Audit Log ─────────────────────────────────────────────────────────────
  await db.from('system_logs').insert({
    agent_name: 'outreach_autopilot',
    status:     'info',
    message:    `Status-Update: "${current.company_name}" | ${current.status} → ${newStatus} | Admin: ${admin.email}`,
  })

  return NextResponse.json({
    success:      true,
    id:           updated.id,
    company_name: updated.company_name,
    status:       updated.status,
    no_email_sent: true,
    no_auto_outreach: true,
  })
}
