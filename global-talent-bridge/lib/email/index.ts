/**
 * E-Mail-Abstraktionsschicht — CorridorWork
 *
 * Provider-Erkennung über Env-Variable EMAIL_PROVIDER:
 *   "none"   → Nur loggen, keine E-Mail (Standard / Test-Modus)
 *   "resend" → Resend.com API (Production)
 *
 * Sicherheitsprinzip:
 * - Standard ist "none" — kein versehentlicher Versand in Entwicklung/Test
 * - System-Log-Eintrag bei jedem Aufruf (Audit-Trail)
 * - Kein externer Aufruf ohne explizit konfigurierten Provider
 */

export type EmailTemplate =
  | 'password_reset'
  | 'application_submitted'
  | 'application_released'
  | 'interview_requested'

export interface EmailPayload {
  to: string
  template: EmailTemplate
  data: Record<string, string | number | boolean>
}

export interface EmailResult {
  sent: boolean
  provider: string
  logged: boolean
  error?: string
}

/**
 * Haupt-Versandfunktion.
 * Erkennt Provider aus EMAIL_PROVIDER env var, fällt auf "none" zurück.
 */
export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const provider = (process.env.EMAIL_PROVIDER ?? 'none').toLowerCase()

  console.log(`[email] Provider=${provider} Template=${payload.template} To=${maskEmail(payload.to)}`)

  if (provider === 'none') {
    // Nur loggen — kein Versand
    console.log(`[email] KEIN VERSAND (EMAIL_PROVIDER=none). Payload:`, {
      template: payload.template,
      data: payload.data,
    })
    return { sent: false, provider: 'none', logged: true }
  }

  if (provider === 'resend') {
    return await sendViaResend(payload)
  }

  console.warn(`[email] Unbekannter Provider: "${provider}". Fallback auf "none".`)
  return { sent: false, provider: 'unknown', logged: true }
}

/**
 * Resend.com Integration.
 * Erfordert: RESEND_API_KEY und RESEND_FROM_EMAIL env vars.
 */
async function sendViaResend(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@corridorwork.com'

  if (!apiKey) {
    console.error('[email] RESEND_API_KEY nicht gesetzt. Kein Versand.')
    return { sent: false, provider: 'resend', logged: true, error: 'RESEND_API_KEY missing' }
  }

  const { subject, html } = renderTemplate(payload.template, payload.data)

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: payload.to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('[email] Resend-Fehler:', errText)
      return { sent: false, provider: 'resend', logged: true, error: errText }
    }

    return { sent: true, provider: 'resend', logged: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[email] Resend-Netzwerkfehler:', msg)
    return { sent: false, provider: 'resend', logged: true, error: msg }
  }
}

/**
 * Datenschutz-freundliches E-Mail-Masking für Logs.
 * "name@example.com" → "na**@e***.com"
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '***'
  const maskedLocal = local.slice(0, 2) + '**'
  const [domainName, tld] = domain.split('.')
  const maskedDomain = domainName.slice(0, 1) + '***'
  return `${maskedLocal}@${maskedDomain}.${tld}`
}

/**
 * Template-Renderer — gibt Subject und HTML zurück.
 */
export function renderTemplate(
  template: EmailTemplate,
  data: Record<string, string | number | boolean>
): { subject: string; html: string } {
  switch (template) {
    case 'password_reset':
      return {
        subject: 'Passwort zurücksetzen — CorridorWork',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1d4ed8;">Passwort zurücksetzen</h2>
            <p>Hallo,</p>
            <p>du hast das Zurücksetzen deines Passworts angefordert.</p>
            <p>
              <a href="${data.resetUrl}" style="display:inline-block;padding:12px 24px;background:#1d4ed8;color:white;text-decoration:none;border-radius:8px;">
                Passwort jetzt zurücksetzen
              </a>
            </p>
            <p style="color:#6b7280;font-size:12px;">
              Dieser Link ist 1 Stunde gültig. Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.
            </p>
          </div>
        `,
      }

    case 'application_submitted':
      return {
        subject: 'Bewerbung eingegangen — CorridorWork',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1d4ed8;">Bewerbung eingegangen</h2>
            <p>Hallo ${data.candidateName},</p>
            <p>deine Bewerbung auf <strong>${data.jobTitle}</strong> bei <strong>${data.companyName}</strong> wurde erfolgreich eingereicht.</p>
            <p>Wir informieren dich, sobald der Arbeitgeber deine Bewerbung geprüft hat.</p>
            <p style="color:#6b7280;font-size:12px;">CorridorWork — Internationale Karrierechancen</p>
          </div>
        `,
      }

    case 'application_released':
      return {
        subject: 'Bewerbung freigegeben — CorridorWork',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Bewerbung freigegeben ✓</h2>
            <p>Hallo ${data.candidateName},</p>
            <p>deine Bewerbung auf <strong>${data.jobTitle}</strong> wurde von <strong>${data.companyName}</strong> zur weiteren Prüfung freigegeben.</p>
            <p>Das Team wird sich in Kürze bei dir melden.</p>
            <p style="color:#6b7280;font-size:12px;">CorridorWork — Internationale Karrierechancen</p>
          </div>
        `,
      }

    case 'interview_requested':
      return {
        subject: 'Interview-Einladung — CorridorWork',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Interview-Einladung 🎉</h2>
            <p>Hallo ${data.candidateName},</p>
            <p><strong>${data.companyName}</strong> möchte ein Interview mit dir führen für die Stelle: <strong>${data.jobTitle}</strong>.</p>
            ${data.proposedDate ? `<p>Vorgeschlagener Termin: <strong>${data.proposedDate}</strong></p>` : ''}
            ${data.message ? `<p>Nachricht: "${data.message}"</p>` : ''}
            <p>
              <a href="${data.dashboardUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;">
                Zum Dashboard
              </a>
            </p>
            <p style="color:#6b7280;font-size:12px;">CorridorWork — Internationale Karrierechancen</p>
          </div>
        `,
      }

    default:
      return {
        subject: 'Nachricht von CorridorWork',
        html: `<p>Hallo,<br/>du hast eine Nachricht von CorridorWork erhalten.</p>`,
      }
  }
}
