/**
 * lib/outreach-email-provider.ts
 *
 * E-Mail-Provider-Abstraktion für genehmigten Outreach-Versand.
 * Server-only. Wird NICHT aus Tests importiert.
 *
 * CONSTRAINTS:
 * - Bei OUTREACH_EMAIL_PROVIDER=none: NIEMALS senden
 * - Nur einzelner freigegebener Draft (kein Bulk-Send)
 * - Jeder Versuch wird geloggt (Erfolg und Fehler)
 * - Keine automatischen Nachrichten ohne Freigabe
 * - Signatur immer "CorridorWork Team"
 *
 * Status-Checking-Logik liegt in lib/email-provider-status.ts (testbar, kein server-only).
 */
import 'server-only'

import {
  detectProvider,
  getDetailedProviderStatus,
  type EmailProvider,
  type EnvSnapshot,
  type DetailedProviderStatus,
} from './email-provider-status'

// Re-export types for callers
export type { EmailProvider, DetailedProviderStatus }
export { getDetailedProviderStatus }

export interface EmailSendRequest {
  to: string
  subject: string
  body: string
  fromEmail?: string
  draftId?: string
}

export interface EmailSendResult {
  success: boolean
  provider: EmailProvider
  messageId?: string
  error?: string
  blocked?: boolean
  blockedReason?: string
}

// ── Provider helpers ──────────────────────────────────────────────────────────

export function getConfiguredProvider(): EmailProvider {
  return detectProvider(process.env as EnvSnapshot)
}

export function isEmailProviderConfigured(): boolean {
  return getConfiguredProvider() !== 'none'
}

export function getFromEmail(): string {
  return process.env.OUTREACH_FROM_EMAIL ?? ''
}

/** @deprecated Use getDetailedProviderStatus(process.env) instead */
export function getProviderStatus() {
  return getDetailedProviderStatus(process.env as EnvSnapshot)
}

// ── Send: approved outreach email ─────────────────────────────────────────────

/**
 * Sendet eine einzelne freigegebene E-Mail.
 * Bei provider=none: gibt geblockte Antwort zurück, sendet NICHTS.
 */
export async function sendApprovedEmail(req: EmailSendRequest): Promise<EmailSendResult> {
  const status = getDetailedProviderStatus(process.env as EnvSnapshot)

  if (!status.canSend) {
    if (status.provider === 'none') {
      return {
        success: false,
        provider: 'none',
        blocked: true,
        blockedReason:
          'E-Mail-Provider ist nicht konfiguriert (OUTREACH_EMAIL_PROVIDER=none). ' +
          'Setze OUTREACH_EMAIL_PROVIDER=resend oder smtp in der .env-Datei.',
      }
    }
    return {
      success: false,
      provider: status.provider,
      blocked: true,
      blockedReason:
        `Provider "${status.provider}" unvollständig konfiguriert. Fehlend: ${status.missingConfig.join(', ')}.`,
    }
  }

  if (!req.to) {
    return {
      success: false,
      provider: status.provider,
      blocked: true,
      blockedReason: 'Empfänger-E-Mail fehlt.',
    }
  }

  const fromEmail = req.fromEmail ?? process.env.OUTREACH_FROM_EMAIL ?? ''

  if (status.provider === 'resend') return sendViaResend(req, fromEmail)
  if (status.provider === 'smtp')   return sendViaSmtp(req, fromEmail)

  return { success: false, provider: status.provider, error: 'Unbekannter Provider.' }
}

// ── Send: safe test email ─────────────────────────────────────────────────────

/**
 * Sendet eine Test-E-Mail NUR an die angegebene Adresse.
 * KEIN Pilot-Arbeitgeber wird kontaktiert.
 * KEIN Draft wird als sent markiert.
 */
export async function sendTestEmail(testToEmail: string): Promise<EmailSendResult> {
  const status = getDetailedProviderStatus(process.env as EnvSnapshot)

  if (!status.canSend) {
    return {
      success: false,
      provider: status.provider,
      blocked: true,
      blockedReason:
        status.provider === 'none'
          ? 'email_provider_not_configured'
          : `Provider unvollständig. Fehlend: ${status.missingConfig.join(', ')}`,
    }
  }

  const fromEmail = process.env.OUTREACH_FROM_EMAIL ?? ''

  return sendApprovedEmail({
    to:      testToEmail,
    subject: '[TEST] CorridorWork test email — no employer outreach',
    body: [
      'Dies ist eine Test-E-Mail vom CorridorWork Operator System.',
      '',
      '⚠️  DIESE NACHRICHT IST KEIN ECHTER OUTREACH.',
      '    Kein Arbeitgeber wurde kontaktiert.',
      '    Kein Draft wurde als "gesendet" markiert.',
      '',
      `Provider:     ${status.provider}`,
      `Zeitpunkt:    ${new Date().toISOString()}`,
      '',
      'Wenn du diese Nachricht siehst, ist der E-Mail-Provider korrekt konfiguriert.',
      '',
      'Mit freundlichen Grüßen',
      'CorridorWork Team',
    ].join('\n'),
    fromEmail,
  })
}

// ── Provider Implementations ──────────────────────────────────────────────────

async function sendViaResend(req: EmailSendRequest, fromEmail: string): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      success: false,
      provider: 'resend',
      blocked: true,
      blockedReason: 'RESEND_API_KEY fehlt.',
    }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    fromEmail,
        to:      [req.to],
        subject: req.subject,
        text:    req.body,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return {
        success: false,
        provider: 'resend',
        error: `Resend API Fehler (${res.status}): ${err}`,
      }
    }

    const data = await res.json() as { id?: string }
    return { success: true, provider: 'resend', messageId: data.id }
  } catch (e) {
    return {
      success: false,
      provider: 'resend',
      error: e instanceof Error ? e.message : 'Unbekannter Fehler',
    }
  }
}

async function sendViaSmtp(req: EmailSendRequest, fromEmail: string): Promise<EmailSendResult> {
  // SMTP implementation placeholder.
  // In production: use nodemailer or similar.
  void fromEmail
  void req
  return {
    success: false,
    provider: 'smtp',
    error:
      'SMTP-Versand noch nicht implementiert. ' +
      'Bitte OUTREACH_EMAIL_PROVIDER=resend verwenden oder SMTP-Integration hinzufügen.',
  }
}
