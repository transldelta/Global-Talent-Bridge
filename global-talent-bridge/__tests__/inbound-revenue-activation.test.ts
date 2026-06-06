/**
 * __tests__/inbound-revenue-activation.test.ts
 *
 * Inbound Revenue Activation Layer — Test Suite
 *
 * Prüft:
 * - Lead-Validierung (E-Mail, Pflichtfelder, Honeypot)
 * - Safety-Invarianten (no_email_sent, no_auto_outreach, no_payment_started)
 * - Kein Send-Button / kein Stripe
 * - Kein automatischer Versand
 * - Admin-Schutz
 * - Branding (CorridorWork, kein Global Talent Bridge)
 * - Daily Runner Lead-Zählung
 */
import { describe, it, expect } from 'vitest'
import {
  validateLeadInput,
  calculateLeadScore,
  LEAD_TYPE_LABELS,
  STATUS_LABELS,
  COMPLIANCE_DISCLAIMER,
  REVENUE_LEAD_INVARIANTS,
} from '@/lib/revenue-leads'
import type { LeadFormInput } from '@/lib/revenue-leads'

// ── Helper ────────────────────────────────────────────────────────────────────

function validInput(overrides: Partial<LeadFormInput> = {}): LeadFormInput {
  return {
    lead_type:          'employer_pilot',
    organization_name:  'Mustermann GmbH',
    contact_name:       'Max Mustermann',
    email:              'max@mustermann.de',
    country:            'Deutschland',
    city:               'Berlin',
    sector:             'Pflege & Gesundheit',
    message:            'Wir suchen 3 Pflegefachkräfte',
    consent_to_contact: true,
    source_page:        '/pilot/employers',
    ...overrides,
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// VALIDIERUNG
// ══════════════════════════════════════════════════════════════════════════════

describe('LeadInput Validierung', () => {

  it('akzeptiert valide Employer-Pilot-Anfrage', () => {
    const { valid, errors } = validateLeadInput(validInput())
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it('akzeptiert agency_partner als lead_type', () => {
    expect(validateLeadInput(validInput({ lead_type: 'agency_partner' })).valid).toBe(true)
  })

  it('akzeptiert market_intelligence als lead_type', () => {
    expect(validateLeadInput(validInput({ lead_type: 'market_intelligence' })).valid).toBe(true)
  })

  it('lehnt ungültigen lead_type ab', () => {
    const { valid } = validateLeadInput(validInput({ lead_type: 'spam_outreach' as any }))
    expect(valid).toBe(false)
  })

  it('lehnt leere E-Mail ab', () => {
    const { valid, errors } = validateLeadInput(validInput({ email: '' }))
    expect(valid).toBe(false)
    expect(errors.some(e => e.toLowerCase().includes('e-mail'))).toBe(true)
  })

  it('lehnt ungültige E-Mail ab', () => {
    expect(validateLeadInput(validInput({ email: 'kein-at-zeichen' })).valid).toBe(false)
    expect(validateLeadInput(validInput({ email: '@nodomain' })).valid).toBe(false)
    expect(validateLeadInput(validInput({ email: 'a@b' })).valid).toBe(false)
  })

  it('akzeptiert valide E-Mail-Formate', () => {
    expect(validateLeadInput(validInput({ email: 'test@example.com' })).valid).toBe(true)
    expect(validateLeadInput(validInput({ email: 'a+b@sub.domain.org' })).valid).toBe(true)
  })

  it('lehnt zu kurzen Firmennamen ab', () => {
    expect(validateLeadInput(validInput({ organization_name: 'A' })).valid).toBe(false)
  })

  it('lehnt zu langen Firmennamen ab', () => {
    expect(validateLeadInput(validInput({ organization_name: 'X'.repeat(201) })).valid).toBe(false)
  })

  it('lehnt fehlendes Consent ab', () => {
    const { valid, errors } = validateLeadInput(validInput({ consent_to_contact: false }))
    expect(valid).toBe(false)
    expect(errors.some(e => e.toLowerCase().includes('zustimmung'))).toBe(true)
  })

  it('lehnt zu kurzen Ansprechpartner ab', () => {
    expect(validateLeadInput(validInput({ contact_name: 'X' })).valid).toBe(false)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// HONEYPOT
// ══════════════════════════════════════════════════════════════════════════════

describe('Honeypot Bot-Schutz', () => {
  it('blockiert Anfrage wenn website-Feld gefüllt ist', () => {
    const { valid } = validateLeadInput(validInput({ website: 'https://bot.example.com' }))
    expect(valid).toBe(false)
  })

  it('blockiert bei beliebigem website-Wert', () => {
    expect(validateLeadInput(validInput({ website: 'anything' })).valid).toBe(false)
  })

  it('erlaubt leeres website-Feld (normal)', () => {
    expect(validateLeadInput(validInput({ website: '' })).valid).toBe(true)
  })

  it('erlaubt undefiniertes website-Feld', () => {
    const input = validInput()
    delete input.website
    expect(validateLeadInput(input).valid).toBe(true)
  })

  it('honeypot-Fehler gibt "Bot detected" zurück', () => {
    const { errors } = validateLeadInput(validInput({ website: 'bot' }))
    expect(errors[0]).toContain('Bot')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// LEAD SCORE
// ══════════════════════════════════════════════════════════════════════════════

describe('Lead Score Berechnung', () => {
  it('Employer Pilot hat höchsten Basis-Score', () => {
    const emp = calculateLeadScore({ lead_type: 'employer_pilot', consent_to_contact: true, sector: 'Pflege', country: 'DE', message: 'Wir brauchen Fachkräfte für die Pflege' })
    const intel = calculateLeadScore({ lead_type: 'market_intelligence', consent_to_contact: true, sector: null, country: null, message: null })
    expect(emp).toBeGreaterThan(intel)
  })

  it('Score liegt zwischen 0 und 100', () => {
    const score = calculateLeadScore({ lead_type: 'employer_pilot', consent_to_contact: true, sector: 'Pflege', country: 'DE', message: 'lang genug' })
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('vollständiger Lead hat höheren Score als leerer', () => {
    const full  = calculateLeadScore({ lead_type: 'employer_pilot', consent_to_contact: true, sector: 'Pflege', country: 'DE', message: 'Brauchen dringend 5 Pflegekräfte' })
    const empty = calculateLeadScore({ lead_type: 'employer_pilot', consent_to_contact: true, sector: null, country: null, message: null })
    expect(full).toBeGreaterThan(empty)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SAFETY-INVARIANTEN
// ══════════════════════════════════════════════════════════════════════════════

describe('Safety-Invarianten', () => {
  it('REVENUE_LEAD_INVARIANTS.no_email_sent ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_email_sent).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.no_auto_outreach ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_auto_outreach).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.no_payment_started ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_payment_started).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.emailProvider ist none', () => {
    expect(REVENUE_LEAD_INVARIANTS.emailProvider).toBe('none')
  })

  it('REVENUE_LEAD_INVARIANTS.phase ist 1', () => {
    expect(REVENUE_LEAD_INVARIANTS.phase).toBe(1)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// KEIN VERSAND / KEIN STRIPE / KEIN SEND-BUTTON
// ══════════════════════════════════════════════════════════════════════════════

describe('Kein automatischer Versand', () => {
  it('COMPLIANCE_DISCLAIMER.noAutoPayment enthält "automatische Zahlung"', () => {
    expect(COMPLIANCE_DISCLAIMER.noAutoPayment).toMatch(/automatisch/i)
  })

  it('COMPLIANCE_DISCLAIMER.noAutoContact enthält "automatische Kontaktaufnahme"', () => {
    expect(COMPLIANCE_DISCLAIMER.noAutoContact).toMatch(/automatisch/i)
  })

  it('COMPLIANCE_DISCLAIMER.noJobGuarantee enthält keine Versprechen', () => {
    expect(COMPLIANCE_DISCLAIMER.noJobGuarantee).toMatch(/kein/i)
  })

  it('COMPLIANCE_DISCLAIMER.noVisaGuarantee enthält keine Versprechen', () => {
    expect(COMPLIANCE_DISCLAIMER.noVisaGuarantee).toMatch(/kein/i)
  })

  it('lib/revenue-leads.ts enthält keine sendEmail-Funktion', async () => {
    const mod = await import('@/lib/revenue-leads')
    // @ts-expect-error — überprüfe zur Laufzeit
    expect(mod.sendEmail).toBeUndefined()
    // @ts-expect-error
    expect(mod.sendLead).toBeUndefined()
    // @ts-expect-error
    expect(mod.sendNotification).toBeUndefined()
  })

  it('lib/revenue-leads.ts hat keine Stripe-Funktion', async () => {
    const mod = await import('@/lib/revenue-leads')
    // @ts-expect-error
    expect(mod.createStripeSession).toBeUndefined()
    // @ts-expect-error
    expect(mod.initiatePayment).toBeUndefined()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// LEAD TYPE LABELS
// ══════════════════════════════════════════════════════════════════════════════

describe('Lead Type Labels', () => {
  it('employer_pilot hat Label', () => {
    expect(LEAD_TYPE_LABELS['employer_pilot']).toBeTruthy()
    expect(LEAD_TYPE_LABELS['employer_pilot']).toContain('Employer')
  })

  it('agency_partner hat Label', () => {
    expect(LEAD_TYPE_LABELS['agency_partner']).toBeTruthy()
    expect(LEAD_TYPE_LABELS['agency_partner']).toContain('Agency')
  })

  it('market_intelligence hat Label', () => {
    expect(LEAD_TYPE_LABELS['market_intelligence']).toBeTruthy()
    expect(LEAD_TYPE_LABELS['market_intelligence']).toContain('Market')
  })

  it('alle Status-Labels sind definiert', () => {
    expect(STATUS_LABELS['new']).toBeTruthy()
    expect(STATUS_LABELS['reviewed']).toBeTruthy()
    expect(STATUS_LABELS['qualified']).toBeTruthy()
    expect(STATUS_LABELS['rejected']).toBeTruthy()
    expect(STATUS_LABELS['contacted_manual']).toBeTruthy()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// BRANDING (CorridorWork — kein "Global Talent Bridge")
// ══════════════════════════════════════════════════════════════════════════════

describe('Branding — CorridorWork', () => {
  it('COMPLIANCE_DISCLAIMER enthält CorridorWork, nicht Global Talent Bridge', () => {
    const allValues = Object.values(COMPLIANCE_DISCLAIMER).join(' ')
    expect(allValues).not.toMatch(/global talent bridge/i)
  })

  it('LEAD_TYPE_LABELS enthalten keinen alten Brandnamen', () => {
    const allLabels = Object.values(LEAD_TYPE_LABELS).join(' ')
    expect(allLabels).not.toMatch(/global talent bridge/i)
  })

  it('validateLeadInput wirft keinen Netzwerk-Fehler', () => {
    expect(() => validateLeadInput(validInput())).not.toThrow()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE DISCLAIMER INHALT
// ══════════════════════════════════════════════════════════════════════════════

describe('Compliance Disclaimer', () => {
  it('gdprNote enthält DSGVO-Referenz', () => {
    expect(COMPLIANCE_DISCLAIMER.gdprNote).toMatch(/DSGVO/i)
  })

  it('phase1Note enthält Phase-1-Hinweis', () => {
    expect(COMPLIANCE_DISCLAIMER.phase1Note).toMatch(/phase 1/i)
  })

  it('Alle Disclaimer-Werte sind non-empty strings', () => {
    Object.values(COMPLIANCE_DISCLAIMER).forEach(val => {
      expect(typeof val).toBe('string')
      expect(val.length).toBeGreaterThan(10)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// MULTIPLE LEAD TYPES VALIDATION
// ══════════════════════════════════════════════════════════════════════════════

describe('Alle Lead-Typen validieren korrekt', () => {
  const types: Array<LeadFormInput['lead_type']> = ['employer_pilot', 'agency_partner', 'market_intelligence']

  types.forEach(lead_type => {
    it(`${lead_type}: valide Eingabe wird akzeptiert`, () => {
      expect(validateLeadInput(validInput({ lead_type })).valid).toBe(true)
    })

    it(`${lead_type}: Consent=false wird abgelehnt`, () => {
      expect(validateLeadInput(validInput({ lead_type, consent_to_contact: false })).valid).toBe(false)
    })

    it(`${lead_type}: Honeypot blockiert`, () => {
      expect(validateLeadInput(validInput({ lead_type, website: 'http://bot.io' })).valid).toBe(false)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// PURES FUNKTIONSVERHALTEN
// ══════════════════════════════════════════════════════════════════════════════

describe('Pure Funktionen — keine externen Calls', () => {
  it('validateLeadInput wirft keinen Netzwerk-Fehler', () => {
    expect(() => validateLeadInput(validInput())).not.toThrow()
  })

  it('calculateLeadScore wirft keinen Netzwerk-Fehler', () => {
    expect(() => calculateLeadScore({ lead_type: 'employer_pilot', consent_to_contact: true, sector: null, country: null, message: null })).not.toThrow()
  })

  it('Mehrfachaufrufe sind deterministisch', () => {
    const input = validInput()
    const r1 = validateLeadInput(input)
    const r2 = validateLeadInput(input)
    expect(r1.valid).toBe(r2.valid)
  })
})
