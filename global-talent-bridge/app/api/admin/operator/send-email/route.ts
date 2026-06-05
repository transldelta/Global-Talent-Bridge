/**
 * POST /api/admin/operator/send-email
 *
 * Sendet eine freigegebene E-Mail über den konfigurierten Provider.
 *
 * SICHERHEITS-CONSTRAINTS:
 * - Draft muss status === 'approved' haben
 * - channel muss 'email' sein
 * - recipient_email muss vorhanden sein
 * - Provider muss konfiguriert sein (nicht 'none')
 * - from email muss vorhanden sein
 * - Body darf NICHT leer sein
 * - Betreff darf NICHT leer sein
 * - Safety-Check: keine persönlichen Namen, keine Fake-Versprechen
 * - Kein Bulk-Send (immer nur 1 Draft pro Request)
 * - Bei Providerfehler: Draft bleibt NICHT auf 'sent' — kein falsches Status-Update
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
  getDetailedProviderStatus,
} from '@/lib/outreach-email-provider'
import {
  checkDraftEmailEligibility,
  type EnvSnapshot,
  type DraftForEligibility,
} from '@/lib/email-provider-status'

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

  const providerStatus = getDetailedProviderStatus(process.env as EnvSnapshot)

  // ── LinkedIn/WhatsApp/Phone: nie automatisch senden ─────────────────────────
  if (draft.channel === 'linkedin' || draft.channel === 'whatsapp' || draft.channel === 'phone') {
    if (draft.status !== 'approved') {
      return NextResponse.json(
        { error: `Draft muss "approved" sein, ist aber "${draft.status}".` },
        { status: 422 },
      )
    }

    const { data: updated } = await db
      .from('pilot_outreach_drafts')
      .update({
        status:     'ready_for_manual_platform_send',
        provider:   draft.channel === 'linkedin' ? 'linkedin_manual' : 'manual_platform',
        updated_at: new Date().toISOString(),
      })
      .eq('id', draft_id)
      .select()
      .single()

    await db.from('system_logs').insert({
      agent_name: 'operator_autopilot',
      status:     'info',
      message:    `Draft ${draft_id} als "ready_for_manual_platform_send" markiert (Kanal: ${draft.channel}) | Admin: ${admin.email}`,
    })

    return NextResponse.json({
      message: `Als bereit für manuellen Versand markiert (${draft.channel}).`,
      draft:   updated,
    })
  }

  // ── E-Mail: vollständiger Safety-Check ──────────────────────────────────────

  // Layer 1: checkDraftEmailEligibility (neue umfassende Prüfung)
  const eligibility = checkDraftEmailEligibility(
    draft as DraftForEligibility,
    providerStatus,
  )

  if (!eligibility.canSend) {
    return NextResponse.json(
      {
        error:           'Send blocked',
        reason:          eligibility.reason,
        checks:          eligibility.checks,
        providerStatus: {
          provider:        providerStatus.provider,
          readinessStatus: providerStatus.readinessStatus,
          canSend:         providerStatus.canSend,
          missingConfig:   providerStatus.missingConfig,
        },
      },
      { status: 422 },
    )
  }

  // Layer 2: executeApprovedAction (Business-Logic-Prüfung aus operator-autopilot)
  const plan = executeApprovedAction(draft as OutreachDraft, {
    provider:  providerStatus.provider,
    fromEmail: providerStatus.fromEmailConfigured ? process.env.OUTREACH_FROM_EMAIL : undefined,
  })

  if (!plan.canExecute) {
    return NextResponse.json(
      {
        error:  'Send blocked (operator-autopilot check)',
        reason: plan.blockedReason ?? plan.reason,
      },
      { status: 422 },
    )
  }

  // ── Senden ──────────────────────────────────────────────────────────────────
  const result = await sendApprovedEmail({
    to:        draft.recipient_email!,
    subject:   draft.subject ?? '(kein Betreff)',
    body:      draft.body,
    fromEmail: providerStatus.fromEmailConfigured ? process.env.OUTREACH_FROM_EMAIL : undefined,
    draftId:   draft_id,
  })

  if (result.success) {
    // Nur bei echtem Erfolg: Status auf 'sent' setzen
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

    // Audit-Log
    const auditLog = createAuditLogForAction(
      {
        action_type: 'send_email',
        title:       `E-Mail gesendet: ${draft.recipient_email}`,
        priority:    'high',
        status:      'done',
        risk_level:  draft.risk_level ?? 'low',
      },
      draft as OutreachDraft,
    )

    // system_logs
    await db.from('system_logs').insert({
      agent_name: auditLog.agent_name,
      status:     auditLog.status,
      message:    `E-Mail gesendet: ${draft.recipient_email} | Provider: ${result.provider} | Draft: ${draft_id} | Admin: ${admin.email}`,
    })

    // pilot_employer_interactions
    await db.from('pilot_employer_interactions').insert({
      pilot_employer_id: draft.pilot_employer_id,
      interaction_type:  'email_manual',
      response_type:     'no_response',
      summary:           `E-Mail gesendet via Operator-Autopilot | Betreff: ${draft.subject ?? '—'} | Provider: ${result.provider}`,
      next_action:       'Antwort abwarten',
      next_follow_up_at: draft.next_follow_up_at ?? null,
      created_by:        admin.email,
      demo:              draft.demo ?? false,
    })

    return NextResponse.json({
      message:   'E-Mail erfolgreich gesendet.',
      messageId: result.messageId,
      draft:     updated,
    })

  } else {
    // Bei Fehler: NICHT auf 'sent' setzen — error_message speichern
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
      message:    `E-Mail-Versand fehlgeschlagen: ${result.error ?? result.blockedReason} | Draft: ${draft_id} | Admin: ${admin.email}`,
    })

    return NextResponse.json(
      {
        error:   'E-Mail-Versand fehlgeschlagen. Draft-Status: failed.',
        details: result.error ?? result.blockedReason,
        blocked: result.blocked,
      },
      { status: result.blocked ? 422 : 500 },
    )
  }
}
