/**
 * POST /api/admin/operator/email-provider/test
 *
 * Sendet eine Test-E-Mail NUR an die im Request angegebene Adresse.
 *
 * SICHERHEITS-CONSTRAINTS:
 * - Nur Admin.
 * - Nur wenn Provider konfiguriert ist (provider !== 'none', alle Vars vorhanden).
 * - test_email muss explizit im Request stehen — kein Default.
 * - Test-E-Mail ist klar markiert: "[TEST] Global Talent Bridge test email — no employer outreach"
 * - KEIN Pilot-Arbeitgeber wird kontaktiert.
 * - KEIN Draft wird als sent markiert.
 * - system_logs Eintrag wird immer geschrieben (Erfolg und Fehler).
 * - Wenn provider=none: Antwort { error: 'email_provider_not_configured' }, Status 422.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendTestEmail } from '@/lib/outreach-email-provider'
import { getDetailedProviderStatus, type EnvSnapshot } from '@/lib/email-provider-status'

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { test_email } = body as { test_email?: string }

  if (!test_email || !test_email.includes('@') || test_email.length < 5) {
    return NextResponse.json(
      { error: 'test_email (gültige E-Mail-Adresse) ist erforderlich.' },
      { status: 400 },
    )
  }

  // Status-Check vor dem Senden
  const status = getDetailedProviderStatus(process.env as EnvSnapshot)

  if (!status.canSend) {
    return NextResponse.json(
      {
        error: 'email_provider_not_configured',
        reason:
          status.provider === 'none'
            ? 'OUTREACH_EMAIL_PROVIDER=none — kein Versand möglich. Bitte auf "resend" oder "smtp" setzen.'
            : `Provider "${status.provider}" unvollständig konfiguriert. Fehlend: ${status.missingConfig.join(', ')}.`,
        readinessStatus: status.readinessStatus,
        missingConfig:   status.missingConfig,
      },
      { status: 422 },
    )
  }

  // Senden
  const result = await sendTestEmail(test_email)

  // Log — immer, Erfolg und Fehler
  const db = createAdminClient()
  await db.from('system_logs').insert({
    agent_name: 'operator_autopilot',
    status:     result.success ? 'success' : 'error',
    message:    result.success
      ? `Test-E-Mail gesendet an "${test_email}" | Provider: ${result.provider} | ID: ${result.messageId ?? '—'} | Admin: ${admin.email}`
      : `Test-E-Mail fehlgeschlagen an "${test_email}" | ${result.error ?? result.blockedReason ?? 'Unbekannt'} | Admin: ${admin.email}`,
  })

  if (!result.success) {
    return NextResponse.json(
      {
        error:   'Test-E-Mail-Versand fehlgeschlagen.',
        details: result.error ?? result.blockedReason,
        blocked: result.blocked,
      },
      { status: result.blocked ? 422 : 500 },
    )
  }

  return NextResponse.json({
    message:    `Test-E-Mail erfolgreich gesendet an "${test_email}".`,
    messageId:  result.messageId,
    provider:   result.provider,
    note:       'Kein Draft wurde als gesendet markiert. Kein Arbeitgeber wurde kontaktiert.',
    sentBy:     admin.email,
  })
}
