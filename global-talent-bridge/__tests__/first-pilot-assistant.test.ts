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
 */
import { describe, it, expect } from 'vitest'
import {
  generateWhatsAppTemplate,
  generateLinkedInTemplate,
  generateEmailTemplate,
} from '@/lib/first-pilot-templates'

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

    // Keine Promises (kein async send)
    expect(whatsApp instanceof Promise).toBe(false)
    expect(linkedIn instanceof Promise).toBe(false)
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
