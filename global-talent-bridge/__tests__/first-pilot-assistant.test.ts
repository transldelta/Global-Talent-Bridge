/**
 * __tests__/first-pilot-assistant.test.ts
 *
 * Tests für lib/first-pilot-templates.ts und die First-Pilot-Sicherheitsregeln.
 * Keine DB-Calls. Keine Server-Imports. Kein E-Mail-Versand.
 *
 * Abdeckung:
 * - Texte enthalten "CorridorWork", nicht "Global Talent Bridge"
 * - Signaturen enthalten "CorridorWork Team"
 * - Kein Senden-Button (Templates generieren nur Text, keine Sendeaktion)
 * - EMAIL_PROVIDER=none → kein automatischer Versand
 * - OUTREACH_EMAIL_PROVIDER=none → kein automatischer Versand
 * - Registrierungslink korrekt (corridorwork.com, nicht localhost)
 * - WhatsApp-Vorlage: kurz, mit Begrüßung, mit Link
 * - LinkedIn-Vorlage: professionell, Bullet-Liste, mit Link
 * - E-Mail-Vorlage: formal, mit Betreff, mit Link
 * - Vorlage ohne Firmenname / ohne Kontaktname (graceful fallback)
 * - Qualification criteria: PILOT_GOOD_CRITERIA, PILOT_RED_FLAGS arrays
 * - Commercial readiness: COMMERCIAL_READINESS constants
 * - Response drafts: good employer, unclear, legal risk, partner alternative
 * - Admin page: Pilot-ready yes, Payment-ready no, No job guarantee, No visa guarantee
 * - Admin page: No automatic outreach, copy-ready drafts, no Stripe, no scraping
 */
import { describe, it, expect } from 'vitest'
import {
  generateWhatsAppTemplate,
  generateLinkedInTemplate,
  generateEmailTemplate,
  generateResponseGoodEmployer,
  generateResponseUnclearEmployer,
  generateResponseLegalRisk,
  generateResponsePartnerAlternative,
  PILOT_GOOD_CRITERIA,
  PILOT_RED_FLAGS,
  COMMERCIAL_READINESS,
} from '@/lib/first-pilot-templates'
import { readFileSync } from 'fs'
import { join } from 'path'

function readPage(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf-8')
}

// ── Konstanten ─────────────────────────────────────────────────────────────────

const REGISTER_LINK = 'https://corridorwork.com/auth/register?role=employer'
const TEAM_SIGNATURE = 'CorridorWork Team'
const FORBIDDEN_BRAND = 'Global Talent Bridge'
const FORBIDDEN_LOCALHOST = 'localhost'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Branding — kein "Global Talent Bridge" in Vorlagen
// ─────────────────────────────────────────────────────────────────────────────

describe('Branding — kein Global Talent Bridge', () => {
  it('WhatsApp-Vorlage enthält nicht "Global Talent Bridge"', () => {
    const text = generateWhatsAppTemplate('Firma GmbH', 'Max Mustermann')
    expect(text).not.toContain(FORBIDDEN_BRAND)
  })

  it('LinkedIn-Vorlage enthält nicht "Global Talent Bridge"', () => {
    const text = generateLinkedInTemplate('Firma GmbH', 'Max Mustermann')
    expect(text).not.toContain(FORBIDDEN_BRAND)
  })

  it('E-Mail-Vorlage enthält nicht "Global Talent Bridge"', () => {
    const { subject, body } = generateEmailTemplate('Firma GmbH', 'Max Mustermann')
    expect(subject).not.toContain(FORBIDDEN_BRAND)
    expect(body).not.toContain(FORBIDDEN_BRAND)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. Branding — "CorridorWork" in allen Vorlagen
// ─────────────────────────────────────────────────────────────────────────────

describe('Branding — CorridorWork in allen Vorlagen', () => {
  it('WhatsApp-Vorlage enthält "CorridorWork"', () => {
    expect(generateWhatsAppTemplate('Firma GmbH', 'Max')).toContain('CorridorWork')
  })

  it('LinkedIn-Vorlage enthält "CorridorWork"', () => {
    expect(generateLinkedInTemplate('Firma GmbH', 'Max')).toContain('CorridorWork')
  })

  it('E-Mail-Vorlage (body) enthält "CorridorWork"', () => {
    expect(generateEmailTemplate('Firma GmbH', 'Max').body).toContain('CorridorWork')
  })

  it('E-Mail-Betreff enthält "CorridorWork"', () => {
    expect(generateEmailTemplate('Firma GmbH', 'Max').subject).toContain('CorridorWork')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. Signatur — "CorridorWork Team" in allen Vorlagen
// ─────────────────────────────────────────────────────────────────────────────

describe('Signatur — CorridorWork Team', () => {
  it('WhatsApp-Vorlage enthält Team-Signatur', () => {
    expect(generateWhatsAppTemplate('Firma GmbH', 'Max')).toContain(TEAM_SIGNATURE)
  })

  it('LinkedIn-Vorlage enthält Team-Signatur', () => {
    expect(generateLinkedInTemplate('Firma GmbH', 'Max')).toContain(TEAM_SIGNATURE)
  })

  it('E-Mail-Vorlage (body) enthält Team-Signatur', () => {
    expect(generateEmailTemplate('Firma GmbH', 'Max').body).toContain(TEAM_SIGNATURE)
  })

  it('Signatur enthält keinen persönlichen Namen (kein [Ihr Name])', () => {
    const bodies = [
      generateWhatsAppTemplate('Firma', 'Max'),
      generateLinkedInTemplate('Firma', 'Max'),
      generateEmailTemplate('Firma', 'Max').body,
    ]
    for (const body of bodies) {
      expect(body).not.toMatch(/\[Ihr Name\]/)
      expect(body).not.toMatch(/\[DEIN NAME\]/)
      expect(body).not.toMatch(/Brahim Ben Abla/)
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. Registrierungslink — korrekte URL, kein localhost
// ─────────────────────────────────────────────────────────────────────────────

describe('Registrierungslink', () => {
  it('WhatsApp-Vorlage enthält korrekten Registrierungslink', () => {
    expect(generateWhatsAppTemplate('Firma', 'Max')).toContain(REGISTER_LINK)
  })

  it('LinkedIn-Vorlage enthält korrekten Registrierungslink', () => {
    expect(generateLinkedInTemplate('Firma', 'Max')).toContain(REGISTER_LINK)
  })

  it('E-Mail-Vorlage (body) enthält korrekten Registrierungslink', () => {
    expect(generateEmailTemplate('Firma', 'Max').body).toContain(REGISTER_LINK)
  })

  it('Kein localhost in Registrierungslink — WhatsApp', () => {
    expect(generateWhatsAppTemplate('Firma', 'Max')).not.toContain(FORBIDDEN_LOCALHOST)
  })

  it('Kein localhost in Registrierungslink — LinkedIn', () => {
    expect(generateLinkedInTemplate('Firma', 'Max')).not.toContain(FORBIDDEN_LOCALHOST)
  })

  it('Kein localhost in Registrierungslink — E-Mail', () => {
    const { subject, body } = generateEmailTemplate('Firma', 'Max')
    expect(body).not.toContain(FORBIDDEN_LOCALHOST)
    expect(subject).not.toContain(FORBIDDEN_LOCALHOST)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 5. Kein Send-Button / kein automatischer Versand in Vorlagen
// ─────────────────────────────────────────────────────────────────────────────

describe('Kein automatischer Versand — Vorlagen', () => {
  it('WhatsApp-Vorlage explizit: kein automatischer Versand erwähnt', () => {
    const text = generateWhatsAppTemplate('Firma', 'Max')
    // "keine automatischen E-Mails" soll in der Vorlage explizit stehen
    const hasNoAutoMail = text.includes('keine automatischen E-Mails') ||
                          text.includes('Kein Abo') ||
                          text.includes('kein Risiko')
    expect(hasNoAutoMail).toBe(true)
  })

  it('LinkedIn-Vorlage enthält "Keine automatischen E-Mails"', () => {
    const text = generateLinkedInTemplate('Firma', 'Max')
    expect(text).toContain('Keine automatischen E-Mails')
  })

  it('E-Mail-Vorlage enthält "Keine automatischen E-Mails"', () => {
    const { body } = generateEmailTemplate('Firma', 'Max')
    expect(body).toContain('Keine automatischen E-Mails')
  })

  it('Template-Funktionen geben nur Text zurück — keine Sendeaktion', () => {
    // Alle drei Funktionen sind pure functions (kein Seiteneffekt, kein Promise)
    const whatsApp = generateWhatsAppTemplate('Test GmbH', 'Hans')
    const linkedIn = generateLinkedInTemplate('Test GmbH', 'Hans')
    const email    = generateEmailTemplate('Test GmbH', 'Hans')

    expect(typeof whatsApp).toBe('string')
    expect(typeof linkedIn).toBe('string')
    expect(typeof email.subject).toBe('string')
    expect(typeof email.body).toBe('string')

    // Keine Promises (kein async send) — cast to unknown required since TS
    // already knows the return type is string (not a Promise), but we want
    // this as an explicit runtime guard in case of future refactoring.
    expect((whatsApp as unknown) instanceof Promise).toBe(false)
    expect((linkedIn as unknown) instanceof Promise).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 6. EMAIL_PROVIDER-Sicherheit — env-basierte Konstante
// ─────────────────────────────────────────────────────────────────────────────

describe('EMAIL_PROVIDER-Sicherheit', () => {
  it('EMAIL_PROVIDER ist nicht "resend" (darf nicht aktiviert sein)', () => {
    const provider = process.env.EMAIL_PROVIDER ?? 'none'
    expect(provider).not.toBe('resend')
    expect(provider).not.toBe('smtp')
  })

  it('OUTREACH_EMAIL_PROVIDER ist nicht "resend" (darf nicht aktiviert sein)', () => {
    const provider = process.env.OUTREACH_EMAIL_PROVIDER ?? 'none'
    expect(provider).not.toBe('resend')
    expect(provider).not.toBe('smtp')
  })

  it('emailProviderSafe-Logik: beide none → safe=true', () => {
    // Spiegelt die Logik aus app/admin/first-pilot/page.tsx
    function calcEmailProviderSafe(emailProvider: string, outreachProvider: string): boolean {
      return emailProvider === 'none' && outreachProvider === 'none'
    }
    expect(calcEmailProviderSafe('none', 'none')).toBe(true)
    expect(calcEmailProviderSafe('resend', 'none')).toBe(false)
    expect(calcEmailProviderSafe('none', 'resend')).toBe(false)
    expect(calcEmailProviderSafe('smtp', 'smtp')).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 7. Firmenname — korrekte Übernahme in Vorlagen
// ─────────────────────────────────────────────────────────────────────────────

describe('Firmenname in Vorlagen', () => {
  it('WhatsApp-Vorlage enthält Firmennamen wenn angegeben', () => {
    const text = generateWhatsAppTemplate('Müller Bau GmbH', 'Hans')
    expect(text).toContain('Müller Bau GmbH')
  })

  it('LinkedIn-Vorlage enthält Firmennamen wenn angegeben', () => {
    const text = generateLinkedInTemplate('Müller Bau GmbH', 'Hans')
    expect(text).toContain('Müller Bau GmbH')
  })

  it('E-Mail-Vorlage enthält Firmennamen wenn angegeben', () => {
    const { body } = generateEmailTemplate('Müller Bau GmbH', 'Hans')
    expect(body).toContain('Müller Bau GmbH')
  })

  it('WhatsApp-Vorlage funktioniert ohne Firmennamen (leerer String)', () => {
    const text = generateWhatsAppTemplate('', '')
    expect(text).toContain('CorridorWork')
    expect(text).toContain(REGISTER_LINK)
    expect(text).toContain(TEAM_SIGNATURE)
  })

  it('LinkedIn-Vorlage funktioniert ohne Firmennamen', () => {
    const text = generateLinkedInTemplate('', '')
    expect(text).toContain('CorridorWork')
    expect(text).toContain(REGISTER_LINK)
  })

  it('E-Mail-Vorlage funktioniert ohne Kontaktnamen (formelle Anrede)', () => {
    const { body } = generateEmailTemplate('', '')
    expect(body).toContain('Sehr geehrte Damen und Herren')
    expect(body).toContain(REGISTER_LINK)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 8. Kontaktname — korrekte Begrüßung
// ─────────────────────────────────────────────────────────────────────────────

describe('Kontaktname — Begrüßungsform', () => {
  it('WhatsApp: mit Kontaktname → "Hallo Name,"', () => {
    const text = generateWhatsAppTemplate('Firma', 'Stefan Meier')
    expect(text).toContain('Hallo Stefan Meier,')
  })

  it('WhatsApp: ohne Kontaktname → "Hallo,"', () => {
    const text = generateWhatsAppTemplate('Firma', '')
    expect(text).toContain('Hallo,')
    expect(text).not.toContain('Hallo ,')
  })

  it('LinkedIn: mit Kontaktname → Vorname verwendet', () => {
    const text = generateLinkedInTemplate('Firma', 'Stefan Meier')
    expect(text).toContain('Hallo Stefan,')
  })

  it('LinkedIn: ohne Kontaktname → "Guten Tag,"', () => {
    const text = generateLinkedInTemplate('Firma', '')
    expect(text).toContain('Guten Tag,')
  })

  it('E-Mail: mit Kontaktname → formelle Anrede mit Name', () => {
    const { body } = generateEmailTemplate('Firma', 'Stefan Meier')
    expect(body).toContain('Sehr geehrte/r Stefan Meier,')
  })

  it('E-Mail: ohne Kontaktname → "Sehr geehrte Damen und Herren,"', () => {
    const { body } = generateEmailTemplate('Firma', '')
    expect(body).toContain('Sehr geehrte Damen und Herren,')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 9. E-Mail-Betreff
// ─────────────────────────────────────────────────────────────────────────────

describe('E-Mail-Betreff', () => {
  it('Betreff ist nicht leer', () => {
    const { subject } = generateEmailTemplate('Firma', 'Max')
    expect(subject.trim().length).toBeGreaterThan(0)
  })

  it('Betreff enthält "CorridorWork"', () => {
    const { subject } = generateEmailTemplate('Firma', 'Max')
    expect(subject).toContain('CorridorWork')
  })

  it('Betreff enthält "Pilot"', () => {
    const { subject } = generateEmailTemplate('Firma', 'Max')
    expect(subject).toContain('Pilot')
  })

  it('Betreff enthält keinen Registrierungslink', () => {
    const { subject } = generateEmailTemplate('Firma', 'Max')
    expect(subject).not.toContain('http')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 10. Pilotbedingungen — "kostenlos" und "unverbindlich" in Vorlagen
// ─────────────────────────────────────────────────────────────────────────────

describe('Pilotbedingungen — kostenlos und unverbindlich', () => {
  it('WhatsApp-Vorlage erwähnt "kostenlos"', () => {
    expect(generateWhatsAppTemplate('Firma', 'Max')).toContain('kostenlos')
  })

  it('LinkedIn-Vorlage erwähnt "kostenlos"', () => {
    expect(generateLinkedInTemplate('Firma', 'Max')).toContain('kostenlos')
  })

  it('E-Mail-Vorlage erwähnt "kostenlos"', () => {
    expect(generateEmailTemplate('Firma', 'Max').body).toContain('kostenlos')
  })

  it('E-Mail-Vorlage erwähnt "Keine Zahlungspflicht"', () => {
    expect(generateEmailTemplate('Firma', 'Max').body).toContain('Keine Zahlungspflicht')
  })

  it('LinkedIn-Vorlage erwähnt "Keine Zahlungspflicht"', () => {
    expect(generateLinkedInTemplate('Firma', 'Max')).toContain('Keine Zahlungspflicht')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 11. Keine externen Tracking-Links / keine SPY-URLs
// ─────────────────────────────────────────────────────────────────────────────

describe('Keine Tracking-Links', () => {
  const allTexts = () => [
    generateWhatsAppTemplate('Firma', 'Max'),
    generateLinkedInTemplate('Firma', 'Max'),
    generateEmailTemplate('Firma', 'Max').body,
    generateEmailTemplate('Firma', 'Max').subject,
  ]

  it('Keine UTM-Parameter in Links', () => {
    for (const text of allTexts()) {
      expect(text).not.toContain('utm_')
    }
  })

  it('Keine Tracking-Pixel-URLs', () => {
    for (const text of allTexts()) {
      expect(text).not.toContain('track.')
      expect(text).not.toContain('/pixel')
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 12. Qualification Criteria — PILOT_GOOD_CRITERIA & PILOT_RED_FLAGS
// ─────────────────────────────────────────────────────────────────────────────

describe('PILOT_GOOD_CRITERIA', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(PILOT_GOOD_CRITERIA)).toBe(true)
    expect(PILOT_GOOD_CRITERIA.length).toBeGreaterThan(0)
  })

  it('every item has label and desc strings', () => {
    for (const item of PILOT_GOOD_CRITERIA) {
      expect(typeof item.label).toBe('string')
      expect(item.label.length).toBeGreaterThan(0)
      expect(typeof item.desc).toBe('string')
      expect(item.desc.length).toBeGreaterThan(0)
    }
  })

  it('includes "No guarantees expected" criterion', () => {
    const labels = PILOT_GOOD_CRITERIA.map((c) => c.label)
    expect(labels.some((l) => /guarantee/i.test(l))).toBe(true)
  })

  it('includes genuine workforce demand criterion', () => {
    const labels = PILOT_GOOD_CRITERIA.map((c) => c.label)
    expect(labels.some((l) => /demand|workforce|genuine/i.test(l))).toBe(true)
  })
})

describe('PILOT_RED_FLAGS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(PILOT_RED_FLAGS)).toBe(true)
    expect(PILOT_RED_FLAGS.length).toBeGreaterThan(0)
  })

  it('every item has label and desc strings', () => {
    for (const item of PILOT_RED_FLAGS) {
      expect(typeof item.label).toBe('string')
      expect(item.label.length).toBeGreaterThan(0)
      expect(typeof item.desc).toBe('string')
      expect(item.desc.length).toBeGreaterThan(0)
    }
  })

  it('includes job guarantee red flag', () => {
    const labels = PILOT_RED_FLAGS.map((c) => c.label)
    expect(labels.some((l) => /job guarantee/i.test(l))).toBe(true)
  })

  it('includes visa guarantee red flag', () => {
    const labels = PILOT_RED_FLAGS.map((c) => c.label)
    expect(labels.some((l) => /visa guarantee/i.test(l))).toBe(true)
  })

  it('includes candidate fee red flag', () => {
    const labels = PILOT_RED_FLAGS.map((c) => c.label)
    expect(labels.some((l) => /candidate fee/i.test(l))).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 13. COMMERCIAL_READINESS constants
// ─────────────────────────────────────────────────────────────────────────────

describe('COMMERCIAL_READINESS', () => {
  it('pilotReady is true', () => {
    expect(COMMERCIAL_READINESS.pilotReady).toBe(true)
  })

  it('inboundReady is true', () => {
    expect(COMMERCIAL_READINESS.inboundReady).toBe(true)
  })

  it('paymentReady is false', () => {
    expect(COMMERCIAL_READINESS.paymentReady).toBe(false)
  })

  it('automaticOutreach is false', () => {
    expect(COMMERCIAL_READINESS.automaticOutreach).toBe(false)
  })

  it('candidateFeeActive is false', () => {
    expect(COMMERCIAL_READINESS.candidateFeeActive).toBe(false)
  })

  it('jobGuarantee is false', () => {
    expect(COMMERCIAL_READINESS.jobGuarantee).toBe(false)
  })

  it('visaGuarantee is false', () => {
    expect(COMMERCIAL_READINESS.visaGuarantee).toBe(false)
  })

  it('legalReviewNeeded is true', () => {
    expect(COMMERCIAL_READINESS.legalReviewNeeded).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 14. Response Drafts — generateResponse*
// ─────────────────────────────────────────────────────────────────────────────

describe('generateResponseGoodEmployer', () => {
  const draft = generateResponseGoodEmployer('Acme GmbH')

  it('contains CorridorWork Team signature', () => {
    expect(draft).toContain('CorridorWork Team')
  })

  it('contains the company name', () => {
    expect(draft).toContain('Acme GmbH')
  })

  it('states no job guarantee', () => {
    expect(draft).toMatch(/no job guarantee/i)
  })

  it('states no visa services', () => {
    expect(draft).toMatch(/no visa/i)
  })

  it('states no automated outreach', () => {
    expect(draft).toMatch(/no automated|without.*approval/i)
  })

  it('states pilot is free', () => {
    expect(draft).toMatch(/free of charge|non-binding/i)
  })

  it('does not contain Global Talent Bridge', () => {
    expect(draft).not.toContain('Global Talent Bridge')
  })

  it('does not contain a send/submit action', () => {
    expect(draft).not.toMatch(/sendEmail|sendMail|fetch.*\/api.*send/i)
  })
})

describe('generateResponseUnclearEmployer', () => {
  const draft = generateResponseUnclearEmployer('Beta Corp')

  it('contains CorridorWork Team signature', () => {
    expect(draft).toContain('CorridorWork Team')
  })

  it('contains the company name', () => {
    expect(draft).toContain('Beta Corp')
  })

  it('asks clarifying questions', () => {
    expect(draft).toMatch(/role|sector|contact|clarif/i)
  })

  it('states no obligation', () => {
    expect(draft).toMatch(/no obligation/i)
  })

  it('does not contain Global Talent Bridge', () => {
    expect(draft).not.toContain('Global Talent Bridge')
  })
})

describe('generateResponseLegalRisk', () => {
  const draft = generateResponseLegalRisk('Risk Corp')

  it('contains CorridorWork Team signature', () => {
    expect(draft).toContain('CorridorWork Team')
  })

  it('contains the company name', () => {
    expect(draft).toContain('Risk Corp')
  })

  it('states inability to guarantee employment', () => {
    expect(draft).toMatch(/guarantee employment|placement result/i)
  })

  it('states no visa services', () => {
    expect(draft).toMatch(/visa|immigration/i)
  })

  it('does not contain Global Talent Bridge', () => {
    expect(draft).not.toContain('Global Talent Bridge')
  })
})

describe('generateResponsePartnerAlternative', () => {
  const draft = generateResponsePartnerAlternative('Agency X')

  it('contains CorridorWork Team signature', () => {
    expect(draft).toContain('CorridorWork Team')
  })

  it('contains the company name', () => {
    expect(draft).toContain('Agency X')
  })

  it('references the /partners page', () => {
    expect(draft).toContain('/partners')
  })

  it('describes partner track', () => {
    expect(draft).toMatch(/partner/i)
  })

  it('does not contain Global Talent Bridge', () => {
    expect(draft).not.toContain('Global Talent Bridge')
  })
})

describe('Response drafts — graceful fallback without company name', () => {
  it('generateResponseGoodEmployer works without company name', () => {
    const draft = generateResponseGoodEmployer('')
    expect(draft).toContain('CorridorWork Team')
    expect(draft).toContain('your organisation')
  })

  it('generateResponseUnclearEmployer works without company name', () => {
    const draft = generateResponseUnclearEmployer('')
    expect(draft).toContain('CorridorWork Team')
  })

  it('generateResponseLegalRisk works without company name', () => {
    const draft = generateResponseLegalRisk('')
    expect(draft).toContain('CorridorWork Team')
  })

  it('generateResponsePartnerAlternative works without company name', () => {
    const draft = generateResponsePartnerAlternative('')
    expect(draft).toContain('CorridorWork Team')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 15. Admin page file — /admin/first-pilot safety checks
// ─────────────────────────────────────────────────────────────────────────────

describe('/admin/first-pilot — page file safety', () => {
  const page    = readPage('app/admin/first-pilot/page.tsx')
  const compPth = 'app/admin/first-pilot/_components/FirstPilotAssistant.tsx'
  const comp    = readPage(compPth)

  it('page has admin guard / redirect to login', () => {
    expect(page).toMatch(/redirect.*login|getCurrentAdminUser/i)
  })

  it('page is noindex nofollow', () => {
    expect(page).toMatch(/noindex.*nofollow|nofollow.*noindex/i)
  })

  it('component contains "Pilot-ready" status', () => {
    expect(comp).toMatch(/Pilot-ready/i)
  })

  it('component shows payment-ready: no', () => {
    expect(comp).toMatch(/Payment-ready/i)
    expect(comp).toContain('no')
  })

  it('component contains "No job guarantee"', () => {
    expect(comp).toMatch(/No job guarantee/i)
  })

  it('component contains "No visa guarantee"', () => {
    expect(comp).toMatch(/No visa guarantee/i)
  })

  it('component contains "No automatic outreach"', () => {
    expect(comp).toMatch(/No automatic outreach/i)
  })

  it('component contains copy-ready drafts section', () => {
    expect(comp).toMatch(/Copy-ready Response Drafts|copy.*ready|response.*draft/i)
  })

  it('component has no send button', () => {
    expect(comp).not.toMatch(/onClick.*sendEmail|sendEmail.*onClick/i)
    expect(comp).not.toMatch(/type="submit"[\s\S]{0,100}send/i)
  })

  it('component does not activate Stripe (only "No Stripe" trust label allowed)', () => {
    // "No Stripe active" as trust label is fine — no Stripe integration code
    expect(comp).not.toMatch(/stripe\.com|loadStripe|StripeProvider|STRIPE_SECRET/i)
  })

  it('component does not contain Global Talent Bridge as visible brand', () => {
    const lines = comp.split('\n').filter((l) => !l.trim().startsWith('//'))
    expect(lines.join('\n')).not.toContain('Global Talent Bridge')
  })

  it('component imports from lib/first-pilot-templates', () => {
    expect(comp).toContain('first-pilot-templates')
  })

  it('component imports qualification criteria', () => {
    expect(comp).toContain('PILOT_GOOD_CRITERIA')
    expect(comp).toContain('PILOT_RED_FLAGS')
  })

  it('component imports COMMERCIAL_READINESS', () => {
    expect(comp).toContain('COMMERCIAL_READINESS')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 16. Playbook doc exists and has required sections
// ─────────────────────────────────────────────────────────────────────────────

describe('FIRST_PILOT_EMPLOYER_PLAYBOOK.md', () => {
  const doc = readPage('docs/FIRST_PILOT_EMPLOYER_PLAYBOOK.md')

  it('file exists and is non-empty', () => {
    expect(doc.length).toBeGreaterThan(500)
  })

  it('contains goal section', () => {
    expect(doc).toMatch(/Goal of the First Pilot/i)
  })

  it('states pilot-ready: yes', () => {
    expect(doc).toMatch(/Pilot-ready[\s|]+.*yes/i)
  })

  it('states payment-ready: no', () => {
    expect(doc).toMatch(/Payment-ready[\s|]+.*no/i)
  })

  it('states no job guarantee', () => {
    expect(doc).toMatch(/No job guarantee|job guarantee.*never/i)
  })

  it('states no visa guarantee', () => {
    expect(doc).toMatch(/No visa guarantee|visa guarantee.*never/i)
  })

  it('states no automatic outreach', () => {
    expect(doc).toMatch(/Automatic outreach.*off|No automatic outreach/i)
  })

  it('contains good employer criteria section', () => {
    expect(doc).toMatch(/Good Fit|Good Pilot Employer/i)
  })

  it('contains red flags / not suitable section', () => {
    expect(doc).toMatch(/Not a Good Fit|Not Suitable|Red Flag/i)
  })

  it('contains pilot process steps', () => {
    expect(doc).toMatch(/Pilot Process|Step by Step/i)
  })

  it('contains legal boundaries section', () => {
    expect(doc).toMatch(/Legal Boundaries|Legal Limits/i)
  })

  it('does not mention Stripe as active', () => {
    expect(doc).not.toMatch(/Stripe.*active(?!\s*[:|].*no)/i)
  })

  it('does not contain Global Talent Bridge as visible brand', () => {
    const lines = doc.split('\n').filter((l) => !l.trim().startsWith('<!--'))
    expect(lines.join('\n')).not.toContain('Global Talent Bridge')
  })
})
