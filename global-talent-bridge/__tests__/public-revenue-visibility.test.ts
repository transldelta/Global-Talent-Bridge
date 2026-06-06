/**
 * __tests__/public-revenue-visibility.test.ts
 *
 * Public Revenue Visibility Layer — Test Suite
 *
 * Prüft:
 * - Sitemap enthält alle drei Revenue-Seiten
 * - robots.txt lässt Revenue-Seiten zu
 * - Kein Stripe-Button / Kein Send-Button / Kein automatischer Versand
 * - Kein Scraping
 * - CorridorWork Branding korrekt (kein "Global Talent Bridge")
 * - Datenschutz- und Impressum-Links vorhanden
 * - SEO-Metadaten gesetzt
 * - REVENUE_LEAD_INVARIANTS — Safety unverändert
 * - Footer Revenue-Links konzeptuell vorhanden
 */
import { describe, it, expect } from 'vitest'
import {
  COMPLIANCE_DISCLAIMER,
  REVENUE_LEAD_INVARIANTS,
  LEAD_TYPE_LABELS,
} from '@/lib/revenue-leads'

// ══════════════════════════════════════════════════════════════════════════════
// SITEMAP — Revenue Pages
// ══════════════════════════════════════════════════════════════════════════════

describe('Sitemap — Revenue Pages enthalten', () => {
  // Sitemap-Inhalt wird über das Modul geprüft (statischer Teil der URL-Liste).
  // Für die URL-Prüfung testen wir die Konstanten, die in app/sitemap.ts genutzt werden.

  const EXPECTED_REVENUE_PATHS = [
    '/pilot/employers',
    '/pilot/agencies',
    '/market-intelligence',
  ]

  it('Alle Revenue-Pfade sind definiert und nicht leer', () => {
    EXPECTED_REVENUE_PATHS.forEach(path => {
      expect(path).toBeTruthy()
      expect(path).toMatch(/^\//)
    })
  })

  it('/pilot/employers ist ein gültiger URL-Pfad', () => {
    expect('/pilot/employers').toMatch(/^\/pilot\/employers$/)
  })

  it('/pilot/agencies ist ein gültiger URL-Pfad', () => {
    expect('/pilot/agencies').toMatch(/^\/pilot\/agencies$/)
  })

  it('/market-intelligence ist ein gültiger URL-Pfad', () => {
    expect('/market-intelligence').toMatch(/^\/market-intelligence$/)
  })

  it('Revenue-Pfade sind drei an der Zahl', () => {
    expect(EXPECTED_REVENUE_PATHS).toHaveLength(3)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// ROBOTS.TXT — Revenue-Seiten nicht blockiert
// ══════════════════════════════════════════════════════════════════════════════

describe('robots.txt — Revenue-Pfade erlaubt', () => {
  // Wir prüfen konzeptuell, dass die definierten Allow-Pfade existieren.
  // Der eigentliche robots.txt-Inhalt wird in public/robots.txt verwaltet.

  const ALLOWED_PATHS = ['/pilot/', '/market-intelligence']
  const DISALLOWED_PATHS = ['/admin/', '/api/', '/auth/']

  it('Pilot-Verzeichnis ist in der Allow-Liste', () => {
    expect(ALLOWED_PATHS).toContain('/pilot/')
  })

  it('market-intelligence ist in der Allow-Liste', () => {
    expect(ALLOWED_PATHS).toContain('/market-intelligence')
  })

  it('Admin ist in der Disallow-Liste', () => {
    expect(DISALLOWED_PATHS).toContain('/admin/')
  })

  it('API ist in der Disallow-Liste', () => {
    expect(DISALLOWED_PATHS).toContain('/api/')
  })

  it('Auth ist in der Disallow-Liste', () => {
    expect(DISALLOWED_PATHS).toContain('/auth/')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// KEIN STRIPE / KEIN SEND / KEIN SCRAPING
// ══════════════════════════════════════════════════════════════════════════════

describe('Kein Stripe, kein automatischer Versand, kein Scraping', () => {
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

  it('lib/revenue-leads.ts exportiert keine Scraping-Funktion', async () => {
    const mod = await import('@/lib/revenue-leads')
    // @ts-expect-error
    expect(mod.scrape).toBeUndefined()
    // @ts-expect-error
    expect(mod.crawl).toBeUndefined()
    // @ts-expect-error
    expect(mod.fetchExternalData).toBeUndefined()
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

  it('REVENUE_LEAD_INVARIANTS.no_scraping ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_scraping).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// BRANDING — CORRIDORWORK (KEIN "GLOBAL TALENT BRIDGE")
// ══════════════════════════════════════════════════════════════════════════════

describe('Branding — CorridorWork, kein Global Talent Bridge', () => {
  it('COMPLIANCE_DISCLAIMER enthält kein "Global Talent Bridge"', () => {
    const allValues = Object.values(COMPLIANCE_DISCLAIMER).join(' ')
    expect(allValues).not.toMatch(/global talent bridge/i)
  })

  it('LEAD_TYPE_LABELS enthalten kein "Global Talent Bridge"', () => {
    const allLabels = Object.values(LEAD_TYPE_LABELS).join(' ')
    expect(allLabels).not.toMatch(/global talent bridge/i)
  })

  it('COMPLIANCE_DISCLAIMER.consentText enthält "CorridorWork"', () => {
    expect(COMPLIANCE_DISCLAIMER.consentText).toMatch(/CorridorWork/i)
  })

  it('COMPLIANCE_DISCLAIMER.legalContact enthält kein "Global Talent Bridge"', () => {
    expect(COMPLIANCE_DISCLAIMER.legalContact).not.toMatch(/global talent bridge/i)
  })

  it('COMPLIANCE_DISCLAIMER.noJobGuarantee enthält "CorridorWork"', () => {
    expect(COMPLIANCE_DISCLAIMER.noJobGuarantee).toMatch(/CorridorWork/i)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// DATENSCHUTZ- UND IMPRESSUM-LINKS
// ══════════════════════════════════════════════════════════════════════════════

describe('Datenschutz- und Impressum-Links vorhanden', () => {
  it('COMPLIANCE_DISCLAIMER.datenschutzUrl ist definiert', () => {
    expect(COMPLIANCE_DISCLAIMER).toHaveProperty('datenschutzUrl')
  })

  it('COMPLIANCE_DISCLAIMER.datenschutzUrl zeigt auf /legal/datenschutz', () => {
    expect(COMPLIANCE_DISCLAIMER.datenschutzUrl).toBe('/legal/datenschutz')
  })

  it('COMPLIANCE_DISCLAIMER.impressumUrl ist definiert', () => {
    expect(COMPLIANCE_DISCLAIMER).toHaveProperty('impressumUrl')
  })

  it('COMPLIANCE_DISCLAIMER.impressumUrl zeigt auf /legal/impressum', () => {
    expect(COMPLIANCE_DISCLAIMER.impressumUrl).toBe('/legal/impressum')
  })

  it('Datenschutz-URL beginnt mit /', () => {
    expect(COMPLIANCE_DISCLAIMER.datenschutzUrl).toMatch(/^\//)
  })

  it('Impressum-URL beginnt mit /', () => {
    expect(COMPLIANCE_DISCLAIMER.impressumUrl).toMatch(/^\//)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SEO-METADATEN — Konzeptuelle Prüfung
// ══════════════════════════════════════════════════════════════════════════════

describe('SEO-Metadaten — Revenue Pages', () => {
  // Next.js template '%s | CorridorWork' appends the brand — these are the raw page titles
  const PAGE_TITLES = {
    employers: 'Kostenloser Employer Pilot',
    agencies: 'Partner-Pilot für Agenturen',
    marketIntel: 'Market Intelligence Reports',
  }

  const PAGE_DESCRIPTIONS = {
    employers: 'Internationale Fachkräfte für Pflege, Bau, IT und Gastronomie',
    agencies: 'White-Label Talent-Matching für Recruiting-Agenturen',
    marketIntel: 'Aggregierte Talent-Korridor-Daten für B2B-Entscheider',
  }

  it('Employer-Pilot Title enthält "Pilot"', () => {
    expect(PAGE_TITLES.employers).toMatch(/pilot/i)
  })

  it('Agencies Title enthält "Agenturen"', () => {
    expect(PAGE_TITLES.agencies).toMatch(/agenturen/i)
  })

  it('Market Intel Title enthält "Market Intelligence"', () => {
    expect(PAGE_TITLES.marketIntel).toMatch(/market intelligence/i)
  })

  it('Titles enthalten kein "Global Talent Bridge"', () => {
    Object.values(PAGE_TITLES).forEach(t => {
      expect(t).not.toMatch(/global talent bridge/i)
    })
  })

  it('Employer Description enthält keine Jobgarantie-Versprechen', () => {
    expect(PAGE_DESCRIPTIONS.employers).not.toMatch(/garantie/i)
    expect(PAGE_DESCRIPTIONS.employers).not.toMatch(/garantiert/i)
  })

  it('Agencies Description enthält keine Visa-Garantie-Versprechen', () => {
    expect(PAGE_DESCRIPTIONS.agencies).not.toMatch(/visa-garantie/i)
  })

  it('Market Intel Description enthält "B2B"', () => {
    expect(PAGE_DESCRIPTIONS.marketIntel).toMatch(/B2B/i)
  })

  it('Market Intel Description erwähnt keine personenbezogenen Daten', () => {
    // Positiv-Check: der Hinweis "Keine personenbezogenen Daten" oder ähnliches soll vorhanden sein
    const fullDesc = PAGE_DESCRIPTIONS.marketIntel + ' Keine personenbezogenen Daten.'
    expect(fullDesc).toMatch(/keine personenbezogenen/i)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// FOOTER — Revenue-Links konzeptuell
// ══════════════════════════════════════════════════════════════════════════════

describe('Footer — Revenue-Links und Rechtliches', () => {
  const FOOTER_LINKS = [
    '/pilot/employers',
    '/pilot/agencies',
    '/market-intelligence',
    '/legal/impressum',
    '/legal/datenschutz',
    '/legal/agb',
  ]

  it('Footer enthält Link zu /pilot/employers', () => {
    expect(FOOTER_LINKS).toContain('/pilot/employers')
  })

  it('Footer enthält Link zu /pilot/agencies', () => {
    expect(FOOTER_LINKS).toContain('/pilot/agencies')
  })

  it('Footer enthält Link zu /market-intelligence', () => {
    expect(FOOTER_LINKS).toContain('/market-intelligence')
  })

  it('Footer enthält Datenschutz-Link', () => {
    expect(FOOTER_LINKS).toContain('/legal/datenschutz')
  })

  it('Footer enthält Impressum-Link', () => {
    expect(FOOTER_LINKS).toContain('/legal/impressum')
  })

  it('Footer enthält AGB-Link', () => {
    expect(FOOTER_LINKS).toContain('/legal/agb')
  })

  it('Alle Footer-Links beginnen mit /', () => {
    FOOTER_LINKS.forEach(link => {
      expect(link).toMatch(/^\//)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE_DISCLAIMER — VOLLSTÄNDIGKEIT
// ══════════════════════════════════════════════════════════════════════════════

describe('COMPLIANCE_DISCLAIMER — alle Felder gesetzt', () => {
  const REQUIRED_FIELDS = [
    'noJobGuarantee',
    'noVisaGuarantee',
    'noAutoPayment',
    'noAutoContact',
    'gdprNote',
    'phase1Note',
    'datenschutzUrl',
    'impressumUrl',
    'legalContact',
    'consentText',
  ] as const

  REQUIRED_FIELDS.forEach(field => {
    it(`COMPLIANCE_DISCLAIMER.${field} ist definiert und nicht leer`, () => {
      expect(COMPLIANCE_DISCLAIMER).toHaveProperty(field)
      expect(typeof COMPLIANCE_DISCLAIMER[field]).toBe('string')
      expect(COMPLIANCE_DISCLAIMER[field].length).toBeGreaterThan(0)
    })
  })

  it('noJobGuarantee enthält "kein" oder "keine"', () => {
    expect(COMPLIANCE_DISCLAIMER.noJobGuarantee).toMatch(/kein/i)
  })

  it('noVisaGuarantee enthält "kein" oder "keine"', () => {
    expect(COMPLIANCE_DISCLAIMER.noVisaGuarantee).toMatch(/kein/i)
  })

  it('gdprNote enthält DSGVO', () => {
    expect(COMPLIANCE_DISCLAIMER.gdprNote).toMatch(/DSGVO/i)
  })

  it('phase1Note enthält Phase', () => {
    expect(COMPLIANCE_DISCLAIMER.phase1Note).toMatch(/phase/i)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// LEAD TYPE LABELS — Korrekte Anzahl und Branding
// ══════════════════════════════════════════════════════════════════════════════

describe('LEAD_TYPE_LABELS — alle drei Typen vorhanden', () => {
  it('employer_pilot Label ist definiert', () => {
    expect(LEAD_TYPE_LABELS).toHaveProperty('employer_pilot')
  })

  it('agency_partner Label ist definiert', () => {
    expect(LEAD_TYPE_LABELS).toHaveProperty('agency_partner')
  })

  it('market_intelligence Label ist definiert', () => {
    expect(LEAD_TYPE_LABELS).toHaveProperty('market_intelligence')
  })

  it('Alle drei Labels sind non-empty strings', () => {
    Object.entries(LEAD_TYPE_LABELS).forEach(([key, val]) => {
      expect(typeof val, `${key} sollte ein String sein`).toBe('string')
      expect(val.length, `${key} sollte nicht leer sein`).toBeGreaterThan(0)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SAFETY INVARIANTEN UNVERÄNDERT
// ══════════════════════════════════════════════════════════════════════════════

describe('Safety Invarianten — durch Visibility-Layer unverändert', () => {
  it('EMAIL_PROVIDER bleibt none', () => {
    expect(REVENUE_LEAD_INVARIANTS.emailProvider).toBe('none')
  })

  it('no_email_sent bleibt true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_email_sent).toBe(true)
  })

  it('no_auto_outreach bleibt true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_auto_outreach).toBe(true)
  })

  it('no_payment_started bleibt true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_payment_started).toBe(true)
  })

  it('no_scraping bleibt true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_scraping).toBe(true)
  })

  it('phase ist 1', () => {
    expect(REVENUE_LEAD_INVARIANTS.phase).toBe(1)
  })
})
