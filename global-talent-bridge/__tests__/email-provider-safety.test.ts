/**
 * __tests__/email-provider-safety.test.ts
 *
 * Tests für lib/email-provider-status.ts
 * Keine DB-Calls, keine Server-Imports, kein server-only.
 *
 * Abdeckung:
 * - Provider-Status: none / teilweise / fertig
 * - Keine Secrets in Status-Rückgabe
 * - Draft-Eligibility: alle Blocking-Rules
 * - Safety: persönliche Namen, leere Felder
 * - Signatur: Global Talent Bridge Team
 * - Kein Bulk-Send (API akzeptiert nur einzelne draft_id)
 * - testMode-Flag
 * - readinessStatus-Mapping
 */
import { describe, it, expect } from 'vitest'
import {
  detectProvider,
  getDetailedProviderStatus,
  checkDraftEmailEligibility,
  hasPersonalNameInText,
  type EnvSnapshot,
  type DetailedProviderStatus,
  type DraftForEligibility,
} from '@/lib/email-provider-status'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeEnv(overrides: Partial<EnvSnapshot> = {}): EnvSnapshot {
  return {
    OUTREACH_EMAIL_PROVIDER: 'none',
    OUTREACH_FROM_EMAIL:     '',
    RESEND_API_KEY:          '',
    SMTP_HOST:               '',
    SMTP_PORT:               '',
    SMTP_USER:               '',
    SMTP_PASS:               '',
    OUTREACH_TEST_MODE:      undefined,
    ...overrides,
  }
}

function makeResendEnv(overrides: Partial<EnvSnapshot> = {}): EnvSnapshot {
  return makeEnv({
    OUTREACH_EMAIL_PROVIDER: 'resend',
    OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
    RESEND_API_KEY:          're_test_key',
    ...overrides,
  })
}

function makeSmtpEnv(overrides: Partial<EnvSnapshot> = {}): EnvSnapshot {
  return makeEnv({
    OUTREACH_EMAIL_PROVIDER: 'smtp',
    OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
    SMTP_HOST:               'mail.example.com',
    SMTP_PORT:               '587',
    SMTP_USER:               'user',
    SMTP_PASS:               'pass',
    ...overrides,
  })
}

function makeApprovedEmailDraft(overrides: Partial<DraftForEligibility> = {}): DraftForEligibility {
  return {
    status:         'approved',
    channel:        'email',
    recipient_email: 'employer@company.de',
    subject:        'Internationales Fachkräfte-Matching',
    body:           'Sehr geehrte Damen und Herren,\n\nMit freundlichen Grüßen\nGlobal Talent Bridge Team',
    ...overrides,
  }
}

function makeReadyProviderStatus(): DetailedProviderStatus {
  return getDetailedProviderStatus(makeResendEnv())
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. detectProvider
// ═══════════════════════════════════════════════════════════════════════════════

describe('detectProvider', () => {
  it('returns "none" when env not set', () => {
    expect(detectProvider({})).toBe('none')
  })

  it('returns "none" when set to "none"', () => {
    expect(detectProvider({ OUTREACH_EMAIL_PROVIDER: 'none' })).toBe('none')
  })

  it('returns "resend" when set to "resend"', () => {
    expect(detectProvider({ OUTREACH_EMAIL_PROVIDER: 'resend' })).toBe('resend')
  })

  it('returns "smtp" when set to "smtp"', () => {
    expect(detectProvider({ OUTREACH_EMAIL_PROVIDER: 'smtp' })).toBe('smtp')
  })

  it('returns "none" for unknown values (safe default)', () => {
    expect(detectProvider({ OUTREACH_EMAIL_PROVIDER: 'sendgrid' })).toBe('none')
    expect(detectProvider({ OUTREACH_EMAIL_PROVIDER: '' })).toBe('none')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 2. getDetailedProviderStatus — provider=none
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDetailedProviderStatus — provider=none', () => {
  it('readinessStatus is "blocked" when provider=none', () => {
    const s = getDetailedProviderStatus(makeEnv())
    expect(s.readinessStatus).toBe('blocked')
  })

  it('configured=false and canSend=false when provider=none', () => {
    const s = getDetailedProviderStatus(makeEnv())
    expect(s.configured).toBe(false)
    expect(s.canSend).toBe(false)
  })

  it('provider field is "none"', () => {
    const s = getDetailedProviderStatus(makeEnv())
    expect(s.provider).toBe('none')
  })

  it('OUTREACH_FROM_EMAIL missing is listed in missingConfig', () => {
    const s = getDetailedProviderStatus(makeEnv({ OUTREACH_FROM_EMAIL: undefined }))
    expect(s.missingConfig).toContain('OUTREACH_FROM_EMAIL')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 3. getDetailedProviderStatus — provider=resend, partial config
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDetailedProviderStatus — resend partial', () => {
  it('readinessStatus is "warning" when RESEND_API_KEY missing', () => {
    const s = getDetailedProviderStatus(makeEnv({
      OUTREACH_EMAIL_PROVIDER: 'resend',
      OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
      RESEND_API_KEY:          undefined,
    }))
    expect(s.readinessStatus).toBe('warning')
  })

  it('lists RESEND_API_KEY in missingConfig', () => {
    const s = getDetailedProviderStatus(makeEnv({
      OUTREACH_EMAIL_PROVIDER: 'resend',
      OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
    }))
    expect(s.missingConfig).toContain('RESEND_API_KEY')
  })

  it('canSend=false when partially configured', () => {
    const s = getDetailedProviderStatus(makeEnv({
      OUTREACH_EMAIL_PROVIDER: 'resend',
      OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
    }))
    expect(s.canSend).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 4. getDetailedProviderStatus — fully configured
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDetailedProviderStatus — resend ready', () => {
  it('readinessStatus is "ready" when all vars present', () => {
    expect(getDetailedProviderStatus(makeResendEnv()).readinessStatus).toBe('ready')
  })

  it('configured=true and canSend=true', () => {
    const s = getDetailedProviderStatus(makeResendEnv())
    expect(s.configured).toBe(true)
    expect(s.canSend).toBe(true)
  })

  it('missingConfig is empty', () => {
    expect(getDetailedProviderStatus(makeResendEnv()).missingConfig).toHaveLength(0)
  })

  it('fromEmailConfigured=true', () => {
    expect(getDetailedProviderStatus(makeResendEnv()).fromEmailConfigured).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 5. getDetailedProviderStatus — smtp
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDetailedProviderStatus — smtp', () => {
  it('ready when all smtp vars present', () => {
    expect(getDetailedProviderStatus(makeSmtpEnv()).readinessStatus).toBe('ready')
  })

  it('warning when smtp vars partial', () => {
    const s = getDetailedProviderStatus(makeSmtpEnv({ SMTP_PASS: undefined }))
    expect(s.readinessStatus).toBe('warning')
    expect(s.missingConfig).toContain('SMTP_PASS')
  })

  it('lists all missing smtp vars', () => {
    const s = getDetailedProviderStatus(makeEnv({
      OUTREACH_EMAIL_PROVIDER: 'smtp',
      OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
    }))
    expect(s.missingConfig).toContain('SMTP_HOST')
    expect(s.missingConfig).toContain('SMTP_PORT')
    expect(s.missingConfig).toContain('SMTP_USER')
    expect(s.missingConfig).toContain('SMTP_PASS')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Keine Secrets in der Status-Rückgabe
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDetailedProviderStatus — no secrets', () => {
  it('does NOT contain RESEND_API_KEY value in missingConfig', () => {
    const s = getDetailedProviderStatus(makeResendEnv())
    const json = JSON.stringify(s)
    expect(json).not.toContain('re_test_key')
  })

  it('does NOT contain SMTP_PASS value in output', () => {
    const s = getDetailedProviderStatus(makeSmtpEnv())
    const json = JSON.stringify(s)
    expect(json).not.toContain('"pass"')
  })

  it('missingConfig contains only ENV VAR names, not values', () => {
    const s = getDetailedProviderStatus(makeEnv({
      OUTREACH_EMAIL_PROVIDER: 'resend',
      OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
    }))
    // Should contain the name 'RESEND_API_KEY', not any secret value
    expect(s.missingConfig).toContain('RESEND_API_KEY')
    s.missingConfig.forEach((item) => {
      expect(item).toMatch(/^[A-Z_]+$/) // only uppercase + underscore (env var names)
    })
  })

  it('safetyNotes do not contain any credentials', () => {
    const s = getDetailedProviderStatus(makeResendEnv())
    const notes = s.safetyNotes.join(' ')
    expect(notes).not.toContain('re_test_key')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 7. testMode
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDetailedProviderStatus — testMode', () => {
  it('testMode=false by default', () => {
    expect(getDetailedProviderStatus(makeResendEnv()).testMode).toBe(false)
  })

  it('testMode=true when OUTREACH_TEST_MODE=true', () => {
    const s = getDetailedProviderStatus(makeResendEnv({ OUTREACH_TEST_MODE: 'true' }))
    expect(s.testMode).toBe(true)
  })

  it('testMode=false for "True" (case-sensitive)', () => {
    const s = getDetailedProviderStatus(makeResendEnv({ OUTREACH_TEST_MODE: 'True' }))
    expect(s.testMode).toBe(false)
  })

  it('safetyNotes contain test-mode warning when active', () => {
    const s = getDetailedProviderStatus(makeResendEnv({ OUTREACH_TEST_MODE: 'true' }))
    expect(s.safetyNotes.some((n) => n.includes('Test-Modus'))).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8. safetyNotes — Sicherheitshinweise
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDetailedProviderStatus — safetyNotes', () => {
  it('contains "Kein automatischer Versand"', () => {
    const s = getDetailedProviderStatus(makeResendEnv())
    expect(s.safetyNotes.some((n) => n.includes('Kein automatischer Versand'))).toBe(true)
  })

  it('contains "Kein Massenversand"', () => {
    const s = getDetailedProviderStatus(makeResendEnv())
    expect(s.safetyNotes.some((n) => n.includes('Kein Massenversand'))).toBe(true)
  })

  it('contains LinkedIn/WhatsApp note', () => {
    const s = getDetailedProviderStatus(makeResendEnv())
    expect(s.safetyNotes.some((n) => n.includes('LinkedIn'))).toBe(true)
  })

  it('contains signature note', () => {
    const s = getDetailedProviderStatus(makeResendEnv())
    expect(s.safetyNotes.some((n) => n.includes('Global Talent Bridge Team'))).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 9. hasPersonalNameInText
// ═══════════════════════════════════════════════════════════════════════════════

describe('hasPersonalNameInText', () => {
  it('detects [Ihr Name]', () => {
    expect(hasPersonalNameInText('Mit freundlichen Grüßen, [Ihr Name]')).toBe(true)
  })

  it('detects [DEIN NAME]', () => {
    expect(hasPersonalNameInText('[DEIN NAME]\nGlobal Talent Bridge')).toBe(true)
  })

  it('detects Brahim Ben Abla', () => {
    expect(hasPersonalNameInText('— Brahim Ben Abla, Gründer')).toBe(true)
  })

  it('detects Gründer reference', () => {
    expect(hasPersonalNameInText('Als Gründer von Global Talent Bridge')).toBe(true)
  })

  it('does NOT flag neutral team signature', () => {
    expect(hasPersonalNameInText('Viele Grüße\nGlobal Talent Bridge Team')).toBe(false)
  })

  it('does NOT flag normal email body without personal names', () => {
    const body = 'Sehr geehrte Damen und Herren,\n\nMit freundlichen Grüßen\nGlobal Talent Bridge Team'
    expect(hasPersonalNameInText(body)).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 10. checkDraftEmailEligibility — Blocking Rules
// ═══════════════════════════════════════════════════════════════════════════════

describe('checkDraftEmailEligibility — blocked: not approved', () => {
  it('canSend=false when status=generated', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ status: 'generated' }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
    expect(result.checks.approved).toBe(false)
    expect(result.reason).toMatch(/freigegeben/)
  })

  it('canSend=false when status=needs_review', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ status: 'needs_review' }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
  })

  it('canSend=false when status=rejected', () => {
    expect(checkDraftEmailEligibility(
      makeApprovedEmailDraft({ status: 'rejected' }),
      makeReadyProviderStatus(),
    ).canSend).toBe(false)
  })
})

describe('checkDraftEmailEligibility — blocked: not email channel', () => {
  it('canSend=false for linkedin', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ channel: 'linkedin' }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
    expect(result.checks.channelIsEmail).toBe(false)
  })

  it('canSend=false for whatsapp', () => {
    expect(checkDraftEmailEligibility(
      makeApprovedEmailDraft({ channel: 'whatsapp' }),
      makeReadyProviderStatus(),
    ).canSend).toBe(false)
  })

  it('canSend=false for phone', () => {
    expect(checkDraftEmailEligibility(
      makeApprovedEmailDraft({ channel: 'phone' }),
      makeReadyProviderStatus(),
    ).canSend).toBe(false)
  })
})

describe('checkDraftEmailEligibility — blocked: no recipient email', () => {
  it('canSend=false when recipient_email is null', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ recipient_email: null }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
    expect(result.checks.hasRecipientEmail).toBe(false)
    expect(result.reason).toMatch(/E-Mail/)
  })

  it('canSend=false when recipient_email is empty string', () => {
    expect(checkDraftEmailEligibility(
      makeApprovedEmailDraft({ recipient_email: '' }),
      makeReadyProviderStatus(),
    ).canSend).toBe(false)
  })
})

describe('checkDraftEmailEligibility — blocked: provider not configured', () => {
  it('canSend=false when provider=none', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft(),
      getDetailedProviderStatus(makeEnv()),
    )
    expect(result.canSend).toBe(false)
    expect(result.checks.providerConfigured).toBe(false)
  })

  it('canSend=false when provider partially configured', () => {
    const partialStatus = getDetailedProviderStatus(makeEnv({
      OUTREACH_EMAIL_PROVIDER: 'resend',
      OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
      // RESEND_API_KEY missing
    }))
    expect(checkDraftEmailEligibility(makeApprovedEmailDraft(), partialStatus).canSend).toBe(false)
  })
})

describe('checkDraftEmailEligibility — blocked: empty body', () => {
  it('canSend=false when body is empty', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ body: '' }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
    expect(result.checks.hasBody).toBe(false)
  })

  it('canSend=false when body is whitespace only', () => {
    expect(checkDraftEmailEligibility(
      makeApprovedEmailDraft({ body: '   ' }),
      makeReadyProviderStatus(),
    ).canSend).toBe(false)
  })
})

describe('checkDraftEmailEligibility — blocked: empty subject', () => {
  it('canSend=false when subject is null', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ subject: null }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
    expect(result.checks.hasSubject).toBe(false)
  })

  it('canSend=false when subject is empty string', () => {
    expect(checkDraftEmailEligibility(
      makeApprovedEmailDraft({ subject: '' }),
      makeReadyProviderStatus(),
    ).canSend).toBe(false)
  })
})

describe('checkDraftEmailEligibility — blocked: personal names', () => {
  it('canSend=false when body contains [Ihr Name]', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ body: 'Mit freundlichen Grüßen\n[Ihr Name]' }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
    expect(result.checks.noPersonalNames).toBe(false)
    expect(result.reason).toMatch(/Name/)
  })

  it('canSend=false when subject contains [Ihr Name]', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ subject: '[Ihr Name] — Anfrage' }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
    expect(result.checks.noPersonalNames).toBe(false)
  })

  it('canSend=false when body contains "Brahim Ben Abla"', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft({ body: 'Mein Name ist Brahim Ben Abla.\nGlobal Talent Bridge Team' }),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 11. checkDraftEmailEligibility — all checks pass
// ═══════════════════════════════════════════════════════════════════════════════

describe('checkDraftEmailEligibility — all checks pass', () => {
  it('canSend=true when all conditions met', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft(),
      makeReadyProviderStatus(),
    )
    expect(result.canSend).toBe(true)
    expect(result.reason).toMatch(/Alle Checks bestanden/)
  })

  it('all individual checks are true', () => {
    const result = checkDraftEmailEligibility(
      makeApprovedEmailDraft(),
      makeReadyProviderStatus(),
    )
    const checks = result.checks
    expect(checks.approved).toBe(true)
    expect(checks.channelIsEmail).toBe(true)
    expect(checks.hasRecipientEmail).toBe(true)
    expect(checks.providerConfigured).toBe(true)
    expect(checks.hasSubject).toBe(true)
    expect(checks.hasBody).toBe(true)
    expect(checks.noPersonalNames).toBe(true)
    expect(checks.safetyPassed).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 12. Signatur — Global Talent Bridge Team
// ═══════════════════════════════════════════════════════════════════════════════

describe('Signatur — Global Talent Bridge Team', () => {
  it('body with "Global Talent Bridge Team" passes name check', () => {
    const body = 'Sehr geehrte Damen und Herren,\n\nViele Grüße\nGlobal Talent Bridge Team'
    expect(hasPersonalNameInText(body)).toBe(false)
  })

  it('body with only personal name FAILS', () => {
    expect(hasPersonalNameInText('Mit freundlichen Grüßen\n[Ihr Name]')).toBe(true)
  })

  it('draft with correct team signature passes eligibility', () => {
    const draft = makeApprovedEmailDraft({
      body: 'Sehr geehrte Damen und Herren,\n\nMit freundlichen Grüßen\nGlobal Talent Bridge Team\n[KONTAKT-E-MAIL]',
    })
    const result = checkDraftEmailEligibility(draft, makeReadyProviderStatus())
    expect(result.canSend).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 13. Kein Bulk-Send — checkDraftEmailEligibility prüft nur einzelnen Draft
// ═══════════════════════════════════════════════════════════════════════════════

describe('Kein Bulk-Send', () => {
  it('checkDraftEmailEligibility accepts exactly one draft, no array', () => {
    // The function signature only accepts a single DraftForEligibility
    // (TypeScript enforces this at compile-time; here we verify the runtime shape)
    const draft = makeApprovedEmailDraft()
    const result = checkDraftEmailEligibility(draft, makeReadyProviderStatus())
    expect(typeof result.canSend).toBe('boolean')
    expect(typeof result.reason).toBe('string')
  })

  it('provider status note mentions no bulk send', () => {
    const s = getDetailedProviderStatus(makeResendEnv())
    expect(s.safetyNotes.some((n) => n.includes('Kein Massenversand'))).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 14. Test-E-Mail darf nicht an Arbeitgeber gehen — pure logic checks
// ═══════════════════════════════════════════════════════════════════════════════

describe('Test-E-Mail Sicherheit (pure logic)', () => {
  it('provider=none blocks test email (canSend=false)', () => {
    const status = getDetailedProviderStatus(makeEnv())
    expect(status.canSend).toBe(false)
    // A test email function should return blocked when canSend=false
    // (tested at the function level in outreach-email-provider.ts — server-only)
  })

  it('provider=none readinessStatus is "blocked"', () => {
    expect(getDetailedProviderStatus(makeEnv()).readinessStatus).toBe('blocked')
  })

  it('resend ready status allows test email attempt', () => {
    const status = getDetailedProviderStatus(makeResendEnv())
    expect(status.canSend).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 15. Providerfehler setzt Draft NICHT auf 'sent' — logic check
// ═══════════════════════════════════════════════════════════════════════════════

describe('Providerfehler-Sicherheit', () => {
  it('blocked provider returns canSend=false — send-email route must not set status=sent', () => {
    // The send-email route checks eligibility first.
    // If canSend=false, it returns 422 and never calls sendApprovedEmail.
    const status = getDetailedProviderStatus(makeEnv())
    const eligibility = checkDraftEmailEligibility(
      makeApprovedEmailDraft(),
      status,
    )
    expect(eligibility.canSend).toBe(false)
    // The route MUST check eligibility.canSend before any DB write.
    // This test documents that expectation.
  })

  it('failed provider check includes missingConfig in reason', () => {
    const status = getDetailedProviderStatus(makeEnv({
      OUTREACH_EMAIL_PROVIDER: 'resend',
      OUTREACH_FROM_EMAIL:     'team@globaltalentbridge.de',
      // missing RESEND_API_KEY
    }))
    const eligibility = checkDraftEmailEligibility(makeApprovedEmailDraft(), status)
    expect(eligibility.canSend).toBe(false)
    expect(eligibility.reason).toMatch(/RESEND_API_KEY/)
  })
})
