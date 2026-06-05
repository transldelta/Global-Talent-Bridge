/**
 * POST /api/admin/operator/actions
 *
 * Approve / Reject / Postpone einer Operator-Aktion.
 * Schreibt in operator_actions + system_logs.
 * Kein automatischer Versand.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  approveAction,
  rejectAction,
  postponeAction,
  createAuditLogForAction,
  calculateFollowUpDate,
  type OperatorAction,
} from '@/lib/operator-autopilot'

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    action_id,
    decision,
    postpone_days,
  } = body as {
    action_id?: string
    decision?: string
    postpone_days?: number
  }

  if (!action_id) {
    return NextResponse.json({ error: 'action_id required' }, { status: 400 })
  }
  if (!decision || !['approve', 'reject', 'postpone'].includes(decision)) {
    return NextResponse.json(
      { error: 'decision must be approve | reject | postpone' },
      { status: 400 },
    )
  }

  const db = createAdminClient()

  // Load action
  const { data: row, error: loadErr } = await db
    .from('operator_actions')
    .select('*')
    .eq('id', action_id)
    .single()

  if (loadErr || !row) {
    return NextResponse.json({ error: 'Action not found' }, { status: 404 })
  }

  const action = row as OperatorAction & { id: string }

  // Apply state transition
  let updated: OperatorAction
  if (decision === 'approve') {
    updated = approveAction(action, admin.email)
  } else if (decision === 'reject') {
    updated = rejectAction(action)
  } else {
    const dueAt = calculateFollowUpDate(new Date(), postpone_days ?? 1)
    updated = postponeAction(action, dueAt)
  }

  // Persist
  const { data: saved, error: saveErr } = await db
    .from('operator_actions')
    .update({
      status:       updated.status,
      completed_at: updated.completed_at?.toISOString() ?? null,
      due_at:       updated.due_at?.toISOString() ?? null,
      updated_at:   new Date().toISOString(),
    })
    .eq('id', action_id)
    .select()
    .single()

  if (saveErr) {
    return NextResponse.json({ error: saveErr.message }, { status: 500 })
  }

  // Audit log
  const log = createAuditLogForAction(updated)
  await db.from('system_logs').insert({
    agent_name: log.agent_name,
    status:     log.status,
    message:    log.message,
    metadata:   log.metadata ?? {},
  })

  return NextResponse.json({ action: saved }, { status: 200 })
}
