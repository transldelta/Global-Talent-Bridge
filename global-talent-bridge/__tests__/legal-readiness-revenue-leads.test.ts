/**
 * __tests__/legal-readiness-revenue-leads.test.ts
 *
 * Legal Readiness — Revenue Lead Formulare
 *
 * Prüft:
 * - COMPLIANCE_DISCLAIMER enthält Datenschutz-URL
 * - Consent ist Pflicht (validateLeadInput)
 * - Honeypot aktiv
 * - Kein Stripe, kein Send-Button (keine Funktionen)
 * - CorridorWork Branding (kein "Global Talent Bridge")
 * - Consent-Text enthält CorridorWork
 * - Legal-Kontakt vorhanden
 * - Alle Disclaimer-Felder gesetzt
 */
import { describe, it, expect } from 'vitest'
import {
  validateLeadInput,
  COMPLIANCE_DISCLAIMER,
  REVENUE_LEAD_INVARIANTS,
  LEAD_TYPE_LABELS,
} from '@/lib/revenue-leads'
import type { LeadFormInput } from '@/lib/revenue-leads'

// ── Helper ────────────────────────────────────────────────────────────────────

function validInput(overrides: Partial<LeadFormInput> = {}): LeadFormInput {
  return {
    lead_type:          'employer_pilot',
    organization_name:  'Testfirma GmbH',
    contact_name:       'Erika Musterfrau',
    email:              'erika@testfirma.de',
    country:            'Deutschland',
    city:               'Hamburg',
    sector:             'Pflege & Gesundheit',
    message:            'Wir benötigen 2 Pflegekräfte für unser Heim',
    consent_to_contact: true,
    source_page:        '/pilot/employers',
    ...overrides,
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// DATENSCHUTZ-URL
// ══════════════════════════════════════════════════════════════════════════════

describe('Datenschutz-URL', () => {
  it('COMPLIANCE_DISCLAIMER.datenschutzUrl ist definiert', () => {
    expect(COMPLIANCE_DISCLAIMER).toHaveProperty('datenschutzUrl')
  })

  it('COMPLIANCE_DISCLAIMER.datenschutzUrl zeigt auf /legal/datenschutz', () => {
    expect(COMPLIANCE_DISCLAIMER.datenschutzUrl).toBe('/legal/datenschutz')
  })

  it('datenschutzUrl ist ein relativer Pfad (beginnt mit /)', () => {
    expect(COMPLIANCE_DISCLAIMER.datenschutzUrl).toMatch(/^\//)
  })

  it('COMPLIANCE_DISCLAIMER.impressumUrl ist definiert', () => {
    expect(COMPLIANCE_DISCLAIMER).toHaveProperty('impressumUrl')
  })

  it('COMPLIANCE_DISCLAIMER.impressumUrl zeigt auf /legal/impressum', () => {
    expect(COMPLIANCE_DISCLAIMER.impressumUrl).toBe('/legal/impressum')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// CONSENT-TEXT
// ══════════════════════════════════════════════════════════════════════════════

describe('Consent-Text', () => {
  it('COMPLIANCE_DISCLAIMER.consentText ist definiert', () => {
    expect(COMPLIANCE_DISCLAIMER).toHaveProperty('consentText')
  })

  it('consentText enthält CorridorWork', () => {
    expect(COMPLIANCE_DISCLAIMER.consentText).toMatch(/CorridorWork/i)
  })

  it('consentText enthält Hinweis auf Privacy Policy', () => {
    expect(COMPLIANCE_DISCLAIMER.consentText).toMatch(/privacy/i)
  })

  it('consentText erwähnt Freiwilligkeit (voluntary)', () => {
    expect(COMPLIANCE_DISCLAIMER.consentText).toMatch(/voluntary/i)
  })

  it('consentText erwähnt Widerrufbarkeit (revocable)', () => {
    expect(COMPLIANCE_DISCLAIMER.consentText).toMatch(/revoc/i)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// LEGAL-KONTAKT
// ══════════════════════════════════════════════════════════════════════════════

describe('Legal-Kontakt', () => {
  it('COMPLIANCE_DISCLAIMER.legalContact ist definiert', () => {
    expect(COMPLIANCE_DISCLAIMER).toHaveProperty('legalContact')
  })

  it('legalContact enthält eine E-Mail-Adresse', () => {
    expect(COMPLIANCE_DISCLAIMER.legalContact).toMatch(/@/)
  })

  it('legalContact ist nicht leer', () => {
    expect(COMPLIANCE_DISCLAIMER.legalContact.length).toBeGreaterThan(5)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// CONSENT IST PFLICHT
// ══════════════════════════════════════════════════════════════════════════════

describe('Consent ist Pflicht — Lead wird ohne Consent abgelehnt', () => {
  it('valide Eingabe mit consent=true wird akzeptiert', () => {
    expect(validateLeadInput(validInput({ consent_to_contact: true })).valid).toBe(true)
  })

  it('Eingabe mit consent=false wird abgelehnt', () => {
    expect(validateLeadInput(validInput({ consent_to_contact: false })).valid).toBe(false)
  })

  it('Fehlertext bei fehlendem Consent enthält "Zustimmung"', () => {
    const { errors } = validateLeadInput(validInput({ consent_to_contact: false }))
    expect(errors.some(e => e.toLowerCase().includes('consent'))).toBe(true)
  })

  it('Consent ist Pflicht für alle Lead-Typen', () => {
    const types: Array<LeadFormInput['lead_type']> = ['employer_pilot', 'agency_partner', 'market_intelligence']
    types.forEach(lead_type => {
      expect(validateLeadInput(validInput({ lead_type, consent_to_contact: false })).valid).toBe(false)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// HONEYPOT AKTIV
// ══════════════════════════════════════════════════════════════════════════════

describe('Honeypot-Schutz aktiv', () => {
  it('website-Feld leer → akzeptiert', () => {
    expect(validateLeadInput(validInput({ website: '' })).valid).toBe(true)
  })

  it('website-Feld gefüllt → abgelehnt', () => {
    expect(validateLeadInput(validInput({ website: 'https://spam.example.com' })).valid).toBe(false)
  })

  it('Honeypot-Fehler enthält "Bot"', () => {
    const { errors } = validateLeadInput(validInput({ website: 'bot' }))
    expect(errors[0]).toMatch(/bot/i)
  })

  it('website undefined → akzeptiert', () => {
    const input = validInput()
    delete input.website
    expect(validateLeadInput(input).valid).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// KEIN STRIPE / KEIN SEND-BUTTON / KEIN AUTOMATISCHER VERSAND
// ══════════════════════════════════════════════════════════════════════════════

describe('Kein Stripe, kein automatischer Versand', () => {
  it('lib/revenue-leads.ts exportiert keine sendEmail-Funktion', async () => {
    const mod = await import('@/lib/revenue-leads')
    // @ts-expect-error — Laufzeitcheck
    expect(mod.sendEmail).toBeUndefined()
    // @ts-expect-error
    expect(mod.sendLead).toBeUndefined()
  })

  it('lib/revenue-leads.ts exportiert keine Stripe-Funktion', async () => {
    const mod = await import('@/lib/revenue-leads')
    // @ts-expect-error
    expect(mod.createStripeSession).toBeUndefined()
    // @ts-expect-error
    expect(mod.initiatePayment).toBeUndefined()
    // @ts-expect-error
    expect(mod.stripe).toBeUndefined()
  })

  it('REVENUE_LEAD_INVARIANTS.no_email_sent ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_email_sent).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.no_payment_started ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_payment_started).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.no_auto_outreach ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_auto_outreach).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.emailProvider ist "none"', () => {
    expect(REVENUE_LEAD_INVARIANTS.emailProvider).toBe('none')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE DISCLAIMER — VOLLSTÄNDIGKEIT
// ══════════════════════════════════════════════════════════════════════════════

describe('COMPLIANCE_DISCLAIMER vollständig', () => {
  it('noJobGuarantee contains "no"', () => {
    expect(COMPLIANCE_DISCLAIMER.noJobGuarantee).toMatch(/^no /i)
  })

  it('noVisaGuarantee contains "no"', () => {
    expect(COMPLIANCE_DISCLAIMER.noVisaGuarantee).toMatch(/^no /i)
  })

  it('noAutoPayment contains "automatic"', () => {
    expect(COMPLIANCE_DISCLAIMER.noAutoPayment).toMatch(/automatic/i)
  })

  it('noAutoContact contains "automatic"', () => {
    expect(COMPLIANCE_DISCLAIMER.noAutoContact).toMatch(/automatic/i)
  })

  it('gdprNote enthält GDPR', () => {
    expect(COMPLIANCE_DISCLAIMER.gdprNote).toMatch(/GDPR/i)
  })

  it('phase1Note enthält Phase', () => {
    expect(COMPLIANCE_DISCLAIMER.phase1Note).toMatch(/phase/i)
  })

  it('Alle Disclaimer-Werte sind non-empty strings', () => {
    Object.entries(COMPLIANCE_DISCLAIMER).forEach(([key, val]) => {
      expect(typeof val, `${key} sollte ein String sein`).toBe('string')
      expect(val.length, `${key} sollte nicht leer sein`).toBeGreaterThan(0)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// BRANDING — CORRIDORWORK (KEIN "GLOBAL TALENT BRIDGE")
// ══════════════════════════════════════════════════════════════════════════════

describe('Branding — CorridorWork', () => {
  it('COMPLIANCE_DISCLAIMER enthält kein "Global Talent Bridge"', () => {
    const allValues = Object.values(COMPLIANCE_DISCLAIMER).join(' ')
    expect(allValues).not.toMatch(/global talent bridge/i)
  })

  it('LEAD_TYPE_LABELS enthalten kein "Global Talent Bridge"', () => {
    const allLabels = Object.values(LEAD_TYPE_LABELS).join(' ')
    expect(allLabels).not.toMatch(/global talent bridge/i)
  })

  it('consentText enthält kein "Global Talent Bridge"', () => {
    expect(COMPLIANCE_DISCLAIMER.consentText).not.toMatch(/global talent bridge/i)
  })

  it('legalContact enthält kein "Global Talent Bridge"', () => {
    expect(COMPLIANCE_DISCLAIMER.legalContact).not.toMatch(/global talent bridge/i)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// VALIDIERUNG VOLLSTÄNDIG
// ══════════════════════════════════════════════════════════════════════════════

describe('Vollständige Validierung für alle Lead-Typen', () => {
  const types: Array<LeadFormInput['lead_type']> = ['employer_pilot', 'agency_partner', 'market_intelligence']

  types.forEach(lead_type => {
    it(`${lead_type}: valide Eingabe akzeptiert`, () => {
      expect(validateLeadInput(validInput({ lead_type })).valid).toBe(true)
    })

    it(`${lead_type}: fehlendes Consent abgelehnt`, () => {
      expect(validateLeadInput(validInput({ lead_type, consent_to_contact: false })).valid).toBe(false)
    })

    it(`${lead_type}: Honeypot blockiert`, () => {
      expect(validateLeadInput(validInput({ lead_type, website: 'filled' })).valid).toBe(false)
    })

    it(`${lead_type}: ungültige E-Mail abgelehnt`, () => {
      expect(validateLeadInput(validInput({ lead_type, email: 'kein-at' })).valid).toBe(false)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// PURE FUNKTIONEN — KEINE EXTERNEN CALLS
// ══════════════════════════════════════════════════════════════════════════════

describe('Keine externen Calls (pure Funktionen)', () => {
  it('validateLeadInput wirft keinen Netzwerk-Fehler', () => {
    expect(() => validateLeadInput(validInput())).not.toThrow()
  })

  it('Mehrfachaufrufe sind deterministisch', () => {
    const input = validInput()
    const r1 = validateLeadInput(input)
    const r2 = validateLeadInput(input)
    expect(r1.valid).toBe(r2.valid)
    expect(r1.errors).toEqual(r2.errors)
  })
})
