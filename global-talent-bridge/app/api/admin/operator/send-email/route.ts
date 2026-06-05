/**
 * POST /api/admin/operator/send-email
 *
 * Sendet eine freigegebene E-Mail über den konfigurierten Provider.
 *
 * SICHERHEITS-CONSTRAINTS:
 * - Draft muss status === 'approved' haben
 * - channel muss 'email' sein
 * - recipient_email muss vorhanden sein
 * - Provider darf NICHT 'none' sein
 * - Safety-Check muss bestanden sein
 * - Kein Bulk-Send (immer nur 1 Draft pro Request)
 * - Alles wird in system_logs + pilot_employer_interactions protokolliert
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  executeApprovedAction,
  createAuditLogForAction,
  type OutreachDraft,
} from '@/lib/operator-autopilot'
import {
  sendApprovedEmail,
  getProviderStatus,
} from '@/lib/outreach-email-provider'

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { draft_id } = body as { draft_id?: string }
  if (!draft_id) {
    return NextResponse.json({ error: 'draft_id required' }, { status: 400 })
  }

  const db = createAdminClient()

  // Load draft
  const { data: draft, error: loadErr } = await db
    .from('pilot_outreach_drafts')
    .select('*')
    .eq('id', draft_id)
    .single()

  if (loadErr || !draft) {
    return NextResponse.json({ error: 'Draft nicht gefunden' }, { status: 404 })
  }

  const providerStatus = getProviderStatus()

  // Execution plan (pure logic check)
  const plan = executeApprovedAction(draft as OutreachDraft, {
    provider: providerStatus.provider,
    fromEmail: providerStatus.fromEmail,
  })

  if (!plan.canExecute) {
    return NextResponse.json(
      {
        error: 'Send blocked',
        reason: plan.blockedReason ?? plan.reason,
        providerStatus,
      },
      { status: 422 },
    )
  }

  // LinkedIn/WhatsApp/Phone → mark as ready for manual platform, don't send
  if (plan.action === 'mark_manual_platform_ready') {
    const { data: updated } = await db
      .from('pilot_outreach_drafts')
      .update({ ...plan.draftUpdates, updated_at: new Date().toISOString() })
      .eq('id', draft_id)
      .select()
      .single()

    await db.from('system_logs').insert({
      agent_name: 'operator_autopilot',
      status:     'info',
      message:    `Draft ${draft_id} als "ready_for_manual_platform_send" markiert (Kanal: ${draft.channel})`,
    })

    return NextResponse.json({
      message: `Als bereit für manuellen Versand markiert (${draft.channel}).`,
      draft:   updated,
    })
  }

  // Email send
  if (plan.action === 'send_email') {
    const result = await sendApprovedEmail({
      to:      draft.recipient_email!,
      subject: draft.subject ?? '(kein Betreff)',
      body:    draft.body,
      fromEmail: providerStatus.fromEmail,
      draftId: draft_id,
    })

    if (result.success) {
      // Mark as sent
      const { data: updated } = await db
        .from('pilot_outreach_drafts')
        .update({
          status:     'sent',
          sent_at:    new Date().toISOString(),
          updated_at: new Date().toISOString(),
          provider:   result.provider,
        })
        .eq('id', draft_id)
        .select()
        .single()

      // Log to system_logs
      await db.from('system_logs').insert({
        agent_name: 'operator_autopilot',
        status:     'success',
        message:    `E-Mail gesendet: ${draft.recipient_email} | Provider: ${result.provider} | Draft: ${draft_id}`,
      })

      // Log to pilot_employer_interactions
      await db.from('pilot_employer_interactions').insert({
        pilot_employer_id: draft.pilot_employer_id,
        interaction_type:  'email_manual',
        response_type:     'no_response',
        summary:           `E-Mail gesendet via Operator-Autopilot | Betreff: ${draft.subject ?? '—'} | Provider: ${result.provider}`,
        next_action:       'Antwort abwarten',
        next_follow_up_at: draft.next_follow_up_at,
        created_by:        admin.email,
        demo:              draft.demo,
      })

      return NextResponse.json({
        message:   'E-Mail erfolgreich gesendet.',
        messageId: result.messageId,
        draft:     updated,
      })
    } else {
      // Mark as failed
      await db
        .from('pilot_outreach_drafts')
        .update({
          status:        'failed',
          error_message: result.error ?? result.blockedReason ?? 'Unbekannter Fehler',
          updated_at:    new Date().toISOString(),
        })
        .eq('id', draft_id)

      await db.from('system_logs').insert({
        agent_name: 'operator_autopilot',
        status:     'error',
        message:    `E-Mail-Versand fehlgeschlagen: ${result.error ?? result.blockedReason} | Draft: ${draft_id}`,
      })

      return NextResponse.json(
        {
          error:    'E-Mail-Versand fehlgeschlagen.',
          details:  result.error ?? result.blockedReason,
          blocked:  result.blocked,
        },
        { status: result.blocked ? 422 : 500 },
      )
    }
  }

  return NextResponse.json({ error: 'Unbekannter Ausführungsplan' }, { status: 500 })
}
