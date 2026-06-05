/**
 * POST /api/admin/operator/drafts
 *   body { action: 'generate_batch' }   — Batch-1-Drafts generieren
 *   body { action: 'approve', draft_id } — Draft genehmigen
 *   body { action: 'reject',  draft_id } — Draft ablehnen
 *   body { action: 'postpone',draft_id } — Draft verschieben
 *
 * Kein automatischer Versand. Nur Status-Änderungen und DB-Writes.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  generateApprovalDraftsForBatch,
  createAuditLogForAction,
  approveAction,
  rejectAction,
  postponeAction,
  calculateFollowUpDate,
  type EmployerForDraft,
  type OutreachDraft,
} from '@/lib/operator-autopilot'

// ── Generate Batch ────────────────────────────────────────────────────────────

async function handleGenerateBatch(admin: { email: string }) {
  const db = createAdminClient()

  // Load employers that don't already have a pending draft
  const { data: employers, error: empErr } = await db
    .from('pilot_employers')
    .select('id, company_name, contact_name, contact_email, contact_phone, industry, country, status, notes')
    .in('status', ['interested', 'contacted_manual', 'identified'])
    .order('created_at', { ascending: true })
    .limit(10)

  if (empErr) return NextResponse.json({ error: empErr.message }, { status: 500 })
  if (!employers || employers.length === 0) {
    return NextResponse.json({ message: 'Keine geeigneten Arbeitgeber gefunden.', created: 0 })
  }

  // Find employers without existing open drafts
  const { data: existingDrafts } = await db
    .from('pilot_outreach_drafts')
    .select('pilot_employer_id')
    .in('status', ['generated', 'needs_review', 'approved'])

  const existingEmployerIds = new Set(
    (existingDrafts ?? []).map((d: { pilot_employer_id: string }) => d.pilot_employer_id)
  )

  const newEmployers = (employers as EmployerForDraft[]).filter(
    (e) => !existingEmployerIds.has(e.id)
  )

  if (newEmployers.length === 0) {
    return NextResponse.json({ message: 'Alle Arbeitgeber haben bereits offene Drafts.', created: 0 })
  }

  const drafts = generateApprovalDraftsForBatch(newEmployers)

  if (drafts.length === 0) {
    return NextResponse.json({ message: 'Keine Drafts generiert.', created: 0 })
  }

  const rows = drafts.map((d) => ({
    pilot_employer_id: d.pilot_employer_id,
    channel:           d.channel,
    recipient_name:    d.recipient_name ?? null,
    recipient_email:   d.recipient_email ?? null,
    recipient_phone:   d.recipient_phone ?? null,
    subject:           d.subject ?? null,
    body:              d.body,
    status:            d.status,
    approval_required: d.approval_required,
    provider:          d.provider,
    risk_level:        d.risk_level,
    risk_notes:        d.risk_notes ?? null,
    next_follow_up_at: d.next_follow_up_at?.toISOString() ?? null,
    demo:              d.demo,
  }))

  const { data: inserted, error: insErr } = await db
    .from('pilot_outreach_drafts')
    .insert(rows)
    .select()

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })

  await db.from('system_logs').insert({
    agent_name: 'operator_autopilot',
    status:     'info',
    message:    `Batch generiert: ${inserted?.length ?? 0} Drafts für ${newEmployers.length} Arbeitgeber | Generiert von: ${admin.email}`,
  })

  return NextResponse.json({
    message: `${inserted?.length ?? 0} Drafts generiert.`,
    created: inserted?.length ?? 0,
    drafts:  inserted,
  }, { status: 201 })
}

// ── Approve / Reject / Postpone Draft ────────────────────────────────────────

async function handleDraftDecision(
  decision: 'approve' | 'reject' | 'postpone',
  draftId: string,
  admin: { email: string },
) {
  const db = createAdminClient()

  const { data: draft, error: loadErr } = await db
    .from('pilot_outreach_drafts')
    .select('*')
    .eq('id', draftId)
    .single()

  if (loadErr || !draft) {
    return NextResponse.json({ error: 'Draft nicht gefunden' }, { status: 404 })
  }

  let newStatus: OutreachDraft['status']
  let approvedAt: string | null = null
  let approvedBy: string | null = null

  if (decision === 'approve') {
    newStatus = 'approved'
    approvedAt = new Date().toISOString()
    approvedBy = admin.email
  } else if (decision === 'reject') {
    newStatus = 'rejected'
  } else {
    newStatus = 'postponed'
  }

  const { data: saved, error: saveErr } = await db
    .from('pilot_outreach_drafts')
    .update({
      status:      newStatus,
      approved_at: approvedAt,
      approved_by: approvedBy,
      updated_at:  new Date().toISOString(),
    })
    .eq('id', draftId)
    .select()
    .single()

  if (saveErr) return NextResponse.json({ error: saveErr.message }, { status: 500 })

  // Audit log (reuse approveAction helper for structure)
  const mockAction = {
    action_type: 'approve_outreach' as const,
    entity_type: 'pilot_outreach_draft',
    entity_id: draftId,
    title: `Draft ${decision}: ${draft.subject ?? draft.channel}`,
    priority: 'medium' as const,
    status: decision === 'approve' ? 'approved' as const :
            decision === 'reject'  ? 'rejected' as const : 'postponed' as const,
    risk_level: draft.risk_level as 'low' | 'medium' | 'high',
  }
  const log = createAuditLogForAction(
    decision === 'approve' ? approveAction(mockAction, admin.email) :
    decision === 'reject'  ? rejectAction(mockAction) :
    postponeAction(mockAction, calculateFollowUpDate(new Date(), 1)),
    draft as OutreachDraft,
  )

  await db.from('system_logs').insert({
    agent_name: log.agent_name,
    status:     log.status,
    message:    log.message,
  })

  return NextResponse.json({ draft: saved }, { status: 200 })
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { action, draft_id } = body as { action?: string; draft_id?: string }

  if (action === 'generate_batch') {
    return handleGenerateBatch(admin)
  }

  if (action === 'approve' || action === 'reject' || action === 'postpone') {
    if (!draft_id) {
      return NextResponse.json({ error: 'draft_id required' }, { status: 400 })
    }
    return handleDraftDecision(action, draft_id, admin)
  }

  return NextResponse.json(
    { error: 'action must be generate_batch | approve | reject | postpone' },
    { status: 400 },
  )
}
