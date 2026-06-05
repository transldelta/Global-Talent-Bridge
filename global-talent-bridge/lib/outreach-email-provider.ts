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
 * - Signatur immer "Global Talent Bridge Team"
 */
import 'server-only'

export type EmailProvider = 'none' | 'resend' | 'smtp'

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

// ── Provider Detection ────────────────────────────────────────────────────────

export function getConfiguredProvider(): EmailProvider {
  const raw = process.env.OUTREACH_EMAIL_PROVIDER ?? 'none'
  if (raw === 'resend') return 'resend'
  if (raw === 'smtp') return 'smtp'
  return 'none'
}

export function isEmailProviderConfigured(): boolean {
  return getConfiguredProvider() !== 'none'
}

export function getFromEmail(): string {
  return process.env.OUTREACH_FROM_EMAIL ?? ''
}

export function getProviderStatus(): {
  provider: EmailProvider
  configured: boolean
  fromEmail: string
  missingEnvVars: string[]
} {
  const provider = getConfiguredProvider()
  const fromEmail = getFromEmail()
  const missing: string[] = []

  if (!fromEmail) missing.push('OUTREACH_FROM_EMAIL')

  if (provider === 'resend') {
    if (!process.env.RESEND_API_KEY) missing.push('RESEND_API_KEY')
  }

  if (provider === 'smtp') {
    if (!process.env.SMTP_HOST) missing.push('SMTP_HOST')
    if (!process.env.SMTP_PORT) missing.push('SMTP_PORT')
    if (!process.env.SMTP_USER) missing.push('SMTP_USER')
    if (!process.env.SMTP_PASS) missing.push('SMTP_PASS')
  }

  return {
    provider,
    configured: provider !== 'none' && missing.length === 0,
    fromEmail,
    missingEnvVars: missing,
  }
}

// ── Send Function ─────────────────────────────────────────────────────────────

/**
 * Sendet eine einzelne freigegebene E-Mail.
 * Bei provider=none: gibt geblockte Antwort zurück, sendet NICHTS.
 */
export async function sendApprovedEmail(
  req: EmailSendRequest,
): Promise<EmailSendResult> {
  const provider = getConfiguredProvider()

  // Hard block: provider not configured
  if (provider === 'none') {
    return {
      success: false,
      provider: 'none',
      blocked: true,
      blockedReason:
        'E-Mail-Provider ist nicht konfiguriert (OUTREACH_EMAIL_PROVIDER=none). ' +
        'Setze OUTREACH_EMAIL_PROVIDER=resend oder smtp in der .env-Datei.',
    }
  }

  const fromEmail = getFromEmail()
  if (!fromEmail) {
    return {
      success: false,
      provider,
      blocked: true,
      blockedReason: 'OUTREACH_FROM_EMAIL ist nicht gesetzt.',
    }
  }

  if (!req.to) {
    return {
      success: false,
      provider,
      blocked: true,
      blockedReason: 'Empfänger-E-Mail fehlt.',
    }
  }

  if (provider === 'resend') {
    return await sendViaResend(req, fromEmail)
  }

  if (provider === 'smtp') {
    return await sendViaSmtp(req, fromEmail)
  }

  return {
    success: false,
    provider,
    error: 'Unbekannter Provider.',
  }
}

// ── Provider Implementations ──────────────────────────────────────────────────

async function sendViaResend(
  req: EmailSendRequest,
  fromEmail: string,
): Promise<EmailSendResult> {
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
        from: fromEmail,
        to: [req.to],
        subject: req.subject,
        text: req.body,
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
    return {
      success: true,
      provider: 'resend',
      messageId: data.id,
    }
  } catch (e) {
    return {
      success: false,
      provider: 'resend',
      error: e instanceof Error ? e.message : 'Unbekannter Fehler',
    }
  }
}

async function sendViaSmtp(
  req: EmailSendRequest,
  fromEmail: string,
): Promise<EmailSendResult> {
  // SMTP implementation placeholder.
  // In production: use nodemailer or similar.
  // For now: return structured "not yet implemented" response.
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
