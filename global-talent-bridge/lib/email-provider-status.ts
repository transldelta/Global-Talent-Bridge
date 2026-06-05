/**
 * lib/email-provider-status.ts
 *
 * Reine Business-Logic für E-Mail-Provider-Status-Checks und Draft-Eligibility.
 * KEIN server-only, KEINE DB-Calls — vollständig testbar mit Vitest.
 *
 * Importiert von:
 *   - lib/outreach-email-provider.ts  (server-only, sendet wirklich)
 *   - app/api/admin/operator/**       (API-Routes, server-side)
 *   - app/admin/operator/page.tsx     (Server Component)
 *   - __tests__/email-provider-safety.test.ts
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type EmailProvider = 'none' | 'resend' | 'smtp'
export type ProviderReadinessStatus = 'blocked' | 'warning' | 'ready'

/**
 * ENV-Snapshot — nur Schlüssel werden in Statusantworten zurückgegeben,
 * NIEMALS die Werte (kein API-Key, kein Passwort nach außen).
 */
export interface EnvSnapshot {
  OUTREACH_EMAIL_PROVIDER?: string
  OUTREACH_FROM_EMAIL?: string
  RESEND_API_KEY?: string
  SMTP_HOST?: string
  SMTP_PORT?: string
  SMTP_USER?: string
  SMTP_PASS?: string
  OUTREACH_TEST_MODE?: string
}

export interface DetailedProviderStatus {
  provider: EmailProvider
  configured: boolean            // provider !== 'none' UND alle Pflicht-Vars vorhanden
  fromEmailConfigured: boolean   // OUTREACH_FROM_EMAIL gesetzt
  canSend: boolean               // configured && fromEmailConfigured
  missingConfig: string[]        // ENV-VAR-NAMEN — KEINE Werte, KEINE Secrets
  safetyNotes: string[]
  testMode: boolean              // OUTREACH_TEST_MODE=true
  readinessStatus: ProviderReadinessStatus
}

export interface DraftForEligibility {
  status: string
  channel: string
  recipient_email?: string | null
  subject?: string | null
  body: string
}

export interface DraftEligibilityResult {
  canSend: boolean
  reason: string
  checks: {
    approved: boolean
    channelIsEmail: boolean
    hasRecipientEmail: boolean
    providerConfigured: boolean
    hasSubject: boolean
    hasBody: boolean
    safetyPassed: boolean
    noPersonalNames: boolean
  }
}

// ── Patterns — persönliche Namen sind in generierten Texten verboten ──────────

const PERSONAL_NAME_PATTERNS = [
  /\[ihr\s+name\]/i,
  /\[dein\s+name\]/i,
  /\[dein\s+vollst[äa]ndiger\s+name\]/i,
  /\[name\]/i,
  /brahim\s+ben\s+abla/i,
  /gr[üu]nder(?:\s|,|\.)/i,
]

export function hasPersonalNameInText(text: string): boolean {
  return PERSONAL_NAME_PATTERNS.some((p) => p.test(text))
}

// ── Provider Detection ────────────────────────────────────────────────────────

export function detectProvider(env: EnvSnapshot): EmailProvider {
  const raw = env.OUTREACH_EMAIL_PROVIDER ?? 'none'
  if (raw === 'resend') return 'resend'
  if (raw === 'smtp') return 'smtp'
  return 'none'
}

// ── Detailed Status ───────────────────────────────────────────────────────────

export function getDetailedProviderStatus(env: EnvSnapshot): DetailedProviderStatus {
  const provider = detectProvider(env)
  const fromEmail = env.OUTREACH_FROM_EMAIL ?? ''
  const fromEmailConfigured = !!fromEmail
  const testMode = env.OUTREACH_TEST_MODE === 'true'

  // Collect missing ENV-VAR names — never values/secrets
  const missingConfig: string[] = []

  if (!fromEmailConfigured) missingConfig.push('OUTREACH_FROM_EMAIL')

  if (provider === 'resend') {
    if (!env.RESEND_API_KEY) missingConfig.push('RESEND_API_KEY')
  }

  if (provider === 'smtp') {
    if (!env.SMTP_HOST) missingConfig.push('SMTP_HOST')
    if (!env.SMTP_PORT) missingConfig.push('SMTP_PORT')
    if (!env.SMTP_USER) missingConfig.push('SMTP_USER')
    if (!env.SMTP_PASS) missingConfig.push('SMTP_PASS')
  }

  const configured = provider !== 'none' && missingConfig.length === 0
  const canSend = configured && fromEmailConfigured

  const safetyNotes: string[] = [
    'Kein automatischer Versand — nur nach expliziter JA-Freigabe.',
    'Kein Massenversand — immer nur ein Draft pro Anfrage.',
    'LinkedIn / WhatsApp / Phone werden nie automatisch gesendet.',
    'Signatur immer: Global Talent Bridge Team.',
    'Alle Sendeversuche werden in system_logs protokolliert.',
  ]

  if (testMode) {
    safetyNotes.unshift('⚠️ Test-Modus aktiv (OUTREACH_TEST_MODE=true) — kein echter Versand an Arbeitgeber.')
  }

  let readinessStatus: ProviderReadinessStatus
  if (provider === 'none') {
    readinessStatus = 'blocked'
  } else if (missingConfig.length > 0) {
    readinessStatus = 'warning'
  } else {
    readinessStatus = 'ready'
  }

  return {
    provider,
    configured,
    fromEmailConfigured,
    canSend,
    missingConfig,
    safetyNotes,
    testMode,
    readinessStatus,
  }
}

// ── Draft Eligibility Check ───────────────────────────────────────────────────

/**
 * Prüft vor dem Senden, ob ein Draft alle Bedingungen erfüllt.
 * Rein deterministisch — keine Seiteneffekte.
 * Wird für Dry-Run und als zusätzliche Sicherheitslage im send-email-Route genutzt.
 */
export function checkDraftEmailEligibility(
  draft: DraftForEligibility,
  providerStatus: DetailedProviderStatus,
): DraftEligibilityResult {
  const approved         = draft.status === 'approved'
  const channelIsEmail   = draft.channel === 'email'
  const hasRecipientEmail = !!(draft.recipient_email?.trim())
  const providerConfigured = providerStatus.canSend
  const hasSubject        = !!(draft.subject?.trim())
  const hasBody           = !!(draft.body?.trim())
  const noPersonalNames   =
    !hasPersonalNameInText(draft.body) &&
    (!draft.subject || !hasPersonalNameInText(draft.subject))
  const safetyPassed      = hasBody && noPersonalNames

  const checks = {
    approved,
    channelIsEmail,
    hasRecipientEmail,
    providerConfigured,
    hasSubject,
    hasBody,
    safetyPassed,
    noPersonalNames,
  }

  if (!approved) {
    return {
      canSend: false,
      reason: 'Draft ist nicht freigegeben (status ≠ approved). Bitte zuerst JA klicken.',
      checks,
    }
  }
  if (!channelIsEmail) {
    return {
      canSend: false,
      reason: `Kanal ist "${draft.channel}" — nur E-Mail kann automatisch gesendet werden. LinkedIn/WhatsApp/Phone immer manuell.`,
      checks,
    }
  }
  if (!hasRecipientEmail) {
    return {
      canSend: false,
      reason: 'Empfänger-E-Mail fehlt. Bitte Kontaktdaten in pilot_employers nachtragen.',
      checks,
    }
  }
  if (!providerConfigured) {
    return {
      canSend: false,
      reason: `E-Mail-Provider nicht einsatzbereit (${providerStatus.provider}). Fehlend: ${providerStatus.missingConfig.join(', ') || 'Provider auf "none" gesetzt'}.`,
      checks,
    }
  }
  if (!hasBody) {
    return {
      canSend: false,
      reason: 'E-Mail-Body ist leer — kein Versand möglich.',
      checks,
    }
  }
  if (!hasSubject) {
    return {
      canSend: false,
      reason: 'Betreff fehlt — E-Mail ohne Betreff wird nicht gesendet.',
      checks,
    }
  }
  if (!noPersonalNames) {
    return {
      canSend: false,
      reason: 'Persönlicher Name oder verbotener Platzhalter im Text gefunden. Signatur muss "Global Talent Bridge Team" lauten.',
      checks,
    }
  }

  return {
    canSend: true,
    reason: 'Alle Checks bestanden — E-Mail kann gesendet werden.',
    checks,
  }
}
