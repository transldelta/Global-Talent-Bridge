/**
 * GET /api/admin/operator/email-provider/status
 *
 * Gibt den vollständigen Provider-Status zurück — OHNE Secrets.
 * Kein API-Key, kein SMTP-Passwort wird je zurückgegeben.
 *
 * Felder:
 *   provider           - 'none' | 'resend' | 'smtp'
 *   configured         - Provider gesetzt UND alle Pflicht-Vars vorhanden
 *   fromEmailConfigured - OUTREACH_FROM_EMAIL gesetzt
 *   canSend            - configured && fromEmailConfigured
 *   missingConfig      - Liste fehlender ENV-VAR-Namen (keine Werte)
 *   safetyNotes        - Sicherheitshinweise
 *   testMode           - OUTREACH_TEST_MODE=true
 *   readinessStatus    - 'blocked' | 'warning' | 'ready'
 */
import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { getDetailedProviderStatus, type EnvSnapshot } from '@/lib/email-provider-status'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = getDetailedProviderStatus(process.env as EnvSnapshot)

  // Gib nur sichere Felder zurück — KEIN API-Key, KEIN Passwort, KEIN SMTP-Secret
  return NextResponse.json({
    provider:             status.provider,
    configured:           status.configured,
    fromEmailConfigured:  status.fromEmailConfigured,
    canSend:              status.canSend,
    missingConfig:        status.missingConfig,   // nur VAR-Namen, keine Werte
    safetyNotes:          status.safetyNotes,
    testMode:             status.testMode,
    readinessStatus:      status.readinessStatus,
  })
}
