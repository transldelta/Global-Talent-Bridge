/**
 * __tests__/commercial-proof-sale-room.test.ts
 *
 * Tests: Commercial Proof Tracker, Sale Room, Demo Sandbox, SEO Indexing,
 *        CWO Command Center, Daily Runner — Commercial Proof Sprint
 *
 * Safety Invarianten: kein Fake-Umsatz, kein Stripe, kein Scraping,
 *                     kein Versand, kein Google API, kein Outreach
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')

function readFile(relPath: string): string {
  const p = join(ROOT, relPath)
  if (!existsSync(p)) throw new Error(`File not found: ${relPath}`)
  return readFileSync(p, 'utf-8')
}

// ── 1. Demo Sandbox ──────────────────────────────────────────────────────────

describe('Demo Sandbox — Honesty & Clarity', () => {
  const file = 'app/demo/sandbox/page.tsx'

  it('existiert', () => { expect(existsSync(join(ROOT, file))).toBe(true) })

  it('enthält Demo-Only Banner (English after Phase 1 cleanup)', () => {
    const c = readFile(file)
    // Phase 1: German "Demo-Modus" → English "Demo mode"
    expect(c.toLowerCase()).toMatch(/demo mode|demo-modus/)
  })

  it('enthält klaren Disclaimer: keine echten Kunden', () => {
    const c = readFile(file)
    // Phase 1: German → English. "keine echten kunden" → "no real customers"
    expect(c.toLowerCase()).toMatch(/keine echten kunden|no real customers/)
  })

  it('enthält Disclaimer: keine echten Umsätze', () => {
    const c = readFile(file)
    // Phase 1: German → English. "keine echten umsätze" → "no real revenue"
    expect(c.toLowerCase()).toMatch(/keine echten umsätze|no real revenue/)
  })

  it('enthält Demo Disclaimer Sektion', () => {
    const c = readFile(file)
    // Phase 1: disclaimer is now an inline banner, not a separate "Demo Disclaimer" section
    expect(c.toLowerCase()).toMatch(/demo disclaimer|demo mode|synthetic data/)
  })

  it('enthält "Synthetische Daten" Hinweis', () => {
    const c = readFile(file)
    // Phase 1: "synthetisch" → "synthetic"
    expect(c.toLowerCase()).toMatch(/synthetisch|synthetic/)
  })

  it('enthält Link zu Strategic Partnership (Echter Käufer CTA entfernt)', () => {
    const c = readFile(file)
    // Phase 1: "Echter Käufer?" button removed — but strategic-partnership link remains
    expect(c).toContain('strategic-partnership')
  })

  it('enthält Safety Section', () => {
    const c = readFile(file)
    expect(c).toContain('Safety')
  })

  it('kein Stripe', () => {
    const c = readFile(file)
    expect(c).not.toContain('stripe')
  })

  it('kein Send-Button', () => {
    const c = readFile(file)
    expect(c).not.toContain('sendEmail')
    expect(c).not.toContain('EMAIL_PROVIDER')
  })

  it('Marke CorridorWork korrekt', () => {
    const c = readFile(file)
    expect(c).toContain('CorridorWork')
    expect(c).not.toContain('Global Talent Bridge')
    expect(c).not.toContain('SlotFill')
  })
})

// ── 2. Commercial Proof Tracker ──────────────────────────────────────────────

describe('Commercial Proof Tracker — /admin/commercial-proof-tracker', () => {
  const file = 'app/admin/commercial-proof-tracker/page.tsx'

  it('existiert', () => { expect(existsSync(join(ROOT, file))).toBe(true) })

  it('ist admin-geschützt (getCurrentAdminUser)', () => {
    const c = readFile(file)
    expect(c).toContain('getCurrentAdminUser')
    expect(c).toContain('redirect')
  })

  it('unterscheidet echte und Test-Leads', () => {
    const c = readFile(file)
    expect(c).toContain('smoke test')
    expect(c).toContain('ilike')
    expect(c).toContain('realGlobalEmployerLeads')
    expect(c).toContain('testGlobalEmployerLeads')
  })

  it('Commercial Proof Score ist dynamisch berechnet (kein Fake)', () => {
    const c = readFile(file)
    expect(c).toContain('BASE_PROOF_SCORE')
    expect(c).toContain('proofScore')
    // kein hardcodierter Fake-Score
    expect(c).not.toContain('proofScore = 15')
    expect(c).not.toContain('proofScore = 10')
  })

  it('Umsatz bleibt 0 wenn kein Stripe aktiv', () => {
    const c = readFile(file)
    expect(c).toContain('revenueEUR')
    expect(c).toContain('= 0')
    expect(c).not.toContain('stripe.charges')
    expect(c).not.toContain('stripe.payment')
  })

  it('Test-Leads erhöhen Commercial Proof Score nicht', () => {
    const c = readFile(file)
    // Score-Berechnung hängt von realLeadsTotal ab, nicht von testLeadsTotal
    expect(c).toContain('realLeadsTotal')
    expect(c).not.toContain('testLeadsTotal > 0') // Nicht als Proof
  })

  it('enthält ehrlichen Score-Hinweis', () => {
    const c = readFile(file)
    expect(c).toContain('Kein Schönreden')
  })

  it('kein Stripe', () => {
    const c = readFile(file)
    expect(c).not.toContain("import Stripe")
    expect(c).not.toContain('stripe.')
  })

  it('kein Send-Button', () => {
    const c = readFile(file)
    expect(c).not.toContain('sendEmail')
    expect(c).not.toContain('fetch(\'/api/send')
  })

  it('kein Scraping', () => {
    const c = readFile(file)
    expect(c).not.toContain('puppeteer')
    expect(c).not.toContain('playwright')
    expect(c).not.toContain('cheerio')
  })

  it('enthält Marke CorridorWork', () => {
    const c = readFile(file)
    expect(c).toContain('CorridorWork')
  })

  it('zeigt alle Lead-Typen: global_employer_leads', () => {
    const c = readFile(file)
    expect(c).toContain('global_employer_leads')
  })

  it('zeigt alle Lead-Typen: candidate_interest_leads', () => {
    const c = readFile(file)
    expect(c).toContain('candidate_interest_leads')
  })

  it('zeigt revenue_leads', () => {
    const c = readFile(file)
    expect(c).toContain('revenue_leads')
  })
})

// ── 3. Sale Room ─────────────────────────────────────────────────────────────

describe('Sale Room — /admin/sale-room', () => {
  const file = 'app/admin/sale-room/page.tsx'

  it('existiert', () => { expect(existsSync(join(ROOT, file))).toBe(true) })

  it('ist admin-geschützt', () => {
    const c = readFile(file)
    expect(c).toContain('getCurrentAdminUser')
    expect(c).toContain('redirect')
  })

  it('enthält Buyer Readiness Score', () => {
    const c = readFile(file)
    expect(c).toContain('buyerReadinessScore')
    expect(c).toContain('66')
  })

  it('enthält Commercial Proof Score', () => {
    const c = readFile(file)
    expect(c).toContain('commercialProofScore')
  })

  it('enthält Echter Umsatz = 0', () => {
    const c = readFile(file)
    expect(c).toContain('revenueEUR')
    expect(c).toContain('= 0')
  })

  it('zeigt Live URLs', () => {
    const c = readFile(file)
    expect(c).toContain('/demo/sandbox')
    expect(c).toContain('/buyer-snapshot')
    expect(c).toContain('/strategic-partnership')
  })

  it('enthält Global Intake Links', () => {
    const c = readFile(file)
    expect(c).toContain('/global/employers')
    expect(c).toContain('/global/candidates')
  })

  it('enthält Offene Blocker Sektion', () => {
    const c = readFile(file)
    expect(c).toContain('Offene Blocker')
  })

  it('enthält Nächster Wert-Booster', () => {
    const c = readFile(file)
    expect(c).toContain('Wert-Booster')
  })

  it('enthält Transfer Docs', () => {
    const c = readFile(file)
    expect(c).toContain('docs/BUYER_DUE_DILIGENCE.md')
    expect(c).toContain('docs/TRANSFER_CHECKLIST.md')
  })

  it('zeigt ehrlichen Umsatz-Stand', () => {
    const c = readFile(file)
    expect(c).toContain('0 EUR')
    expect(c).toContain('Pre-Revenue')
  })

  it('kein Stripe', () => {
    const c = readFile(file)
    expect(c).not.toContain("import Stripe")
    expect(c).not.toContain('stripe.')
  })

  it('kein Send-Button', () => {
    const c = readFile(file)
    expect(c).not.toContain('sendEmail')
  })

  it('kein Scraping', () => {
    const c = readFile(file)
    expect(c).not.toContain('puppeteer')
    expect(c).not.toContain('cheerio')
  })

  it('kein Fake-Umsatz', () => {
    const c = readFile(file)
    // Kein hardcodierter Fake-Umsatz
    expect(c).not.toContain('revenueEUR = 5000')
    expect(c).not.toContain('revenueEUR = 1000')
    expect(c).not.toContain('Umsatz: 10.000')
  })

  it('enthält Marke CorridorWork', () => {
    const c = readFile(file)
    expect(c).toContain('CorridorWork')
    expect(c).not.toContain('SlotFill')
  })
})

// ── 4. SEO Indexing Control — globale URLs ────────────────────────────────────

describe('SEO Indexing Control — globale URLs ergänzt', () => {
  const file = 'app/admin/seo-indexing-control/page.tsx'

  it('existiert', () => { expect(existsSync(join(ROOT, file))).toBe(true) })

  it('enthält /global/employers in Follow-up URLs', () => {
    const c = readFile(file)
    expect(c).toContain('/global/employers')
  })

  it('enthält /global/candidates in Follow-up URLs', () => {
    const c = readFile(file)
    expect(c).toContain('/global/candidates')
  })

  it('enthält /demo/sandbox in Follow-up URLs', () => {
    const c = readFile(file)
    expect(c).toContain('/demo/sandbox')
  })

  it('enthält /corridors/india-canada', () => {
    const c = readFile(file)
    expect(c).toContain('/corridors/india-canada')
  })

  it('enthält /corridors/philippines-healthcare', () => {
    const c = readFile(file)
    expect(c).toContain('/corridors/philippines-healthcare')
  })

  it('enthält /corridors/pakistan-gulf', () => {
    const c = readFile(file)
    expect(c).toContain('/corridors/pakistan-gulf')
  })

  it('kein Google API', () => {
    const c = readFile(file)
    expect(c).not.toContain('google.com/apis')
    expect(c).not.toContain('googleapis')
    expect(c).not.toContain('GoogleAuth')
  })
})

// ── 5. CWO Command Center — Commercial Proof Panel ────────────────────────────

describe('CWO Command Center — Commercial Proof & Sale Room Panel', () => {
  const file = 'app/admin/cwo-command-center/page.tsx'

  it('existiert', () => { expect(existsSync(join(ROOT, file))).toBe(true) })

  it('enthält Commercial Proof & Sale Room Panel', () => {
    const c = readFile(file)
    expect(c).toContain('Commercial Proof')
    expect(c).toContain('Sale Room')
  })

  it('enthält Link zu /admin/sale-room', () => {
    const c = readFile(file)
    expect(c).toContain('/admin/sale-room')
  })

  it('enthält Link zu /admin/commercial-proof-tracker', () => {
    const c = readFile(file)
    expect(c).toContain('/admin/commercial-proof-tracker')
  })

  it('enthält Nächster Wert-Booster', () => {
    const c = readFile(file)
    expect(c).toContain('Wert-Booster')
  })

  it('zeigt Global Intake ready', () => {
    const c = readFile(file)
    expect(c).toContain('Global Intake')
  })

  it('kein Send-Button', () => {
    const c = readFile(file)
    expect(c).not.toContain('sendEmail')
    expect(c).not.toContain('bulkSend')
  })

  it('kein Stripe', () => {
    const c = readFile(file)
    expect(c).not.toContain("import Stripe")
  })
})

// ── 6. Daily Runner — Commercial Proof Items ─────────────────────────────────

describe('Daily Runner — Commercial Proof & Sale Room Items', () => {
  const file = 'app/api/cron/cwo-daily-runner/route.ts'

  it('existiert', () => { expect(existsSync(join(ROOT, file))).toBe(true) })

  it('enthält commercialProofScore', () => {
    const c = readFile(file)
    expect(c).toContain('commercialProofScore')
  })

  it('enthält realLeadCount', () => {
    const c = readFile(file)
    expect(c).toContain('realLeadCount')
  })

  it('enthält testLeadCount', () => {
    const c = readFile(file)
    expect(c).toContain('testLeadCount')
  })

  it('enthält revenueAmount = 0', () => {
    const c = readFile(file)
    expect(c).toContain('revenueAmount')
    expect(c).toContain('= 0')
  })

  it('enthält nextValueBooster', () => {
    const c = readFile(file)
    expect(c).toContain('nextValueBooster')
  })

  it('enthält saleRoomStatus', () => {
    const c = readFile(file)
    expect(c).toContain('saleRoomStatus')
  })

  it('enthält globalIntakeReady: true in Response', () => {
    const c = readFile(file)
    expect(c).toContain('globalIntakeReady')
    expect(c).toContain('true')
  })

  it('keine externen Calls', () => {
    const c = readFile(file)
    expect(c).not.toContain('fetch(\'http')
    expect(c).not.toContain('axios.get')
    expect(c).not.toContain('googleapis')
  })

  it('kein E-Mail-Versand', () => {
    const c = readFile(file)
    expect(c).not.toContain('sendEmail')
    expect(c).not.toContain('nodemailer')
    expect(c).not.toContain('sgMail')
  })

  it('kein Scraping', () => {
    const c = readFile(file)
    expect(c).not.toContain('puppeteer')
    expect(c).not.toContain('cheerio')
    expect(c).not.toContain('playwright')
  })
})

// ── 7. Dokumentation ─────────────────────────────────────────────────────────

describe('Dokumentation — Commercial Proof Sprint Updates', () => {
  it('COMMERCIAL_READINESS_SUMMARY.md enthält Global Intake Abschnitt', () => {
    const c = readFile('docs/COMMERCIAL_READINESS_SUMMARY.md')
    expect(c).toContain('Global Intake')
    expect(c).toContain('global_employer_leads') // in lowercase context not important
  })

  it('COMMERCIAL_READINESS_SUMMARY.md enthält Test-Lead Hinweis', () => {
    const c = readFile('docs/COMMERCIAL_READINESS_SUMMARY.md')
    expect(c).toContain('Test-Lead')
    expect(c.toLowerCase()).toContain('smoke test')
  })

  it('BUYER_SATISFACTION_GAP_CLOSURE.md erwähnt Commercial Proof Sprint', () => {
    const c = readFile('docs/BUYER_SATISFACTION_GAP_CLOSURE.md')
    expect(c).toContain('Commercial Proof')
  })

  it('BUYER_SATISFACTION_GAP_CLOSURE.md: Test-Leads zählen nicht als Proof', () => {
    const c = readFile('docs/BUYER_SATISFACTION_GAP_CLOSURE.md')
    expect(c.toLowerCase()).toContain('test lead')
  })

  it('FINAL_COMPLETION_AND_MONETIZATION_READINESS.md ist aktualisiert', () => {
    const c = readFile('docs/FINAL_COMPLETION_AND_MONETIZATION_READINESS.md')
    expect(c).toContain('Commercial Proof')
  })
})

// ── 8. Safety Invarianten ─────────────────────────────────────────────────────

describe('Safety Invarianten — Commercial Proof Sprint', () => {
  it('kein Fake-Umsatz in commercial-proof-tracker', () => {
    const c = readFile('app/admin/commercial-proof-tracker/page.tsx')
    expect(c).not.toContain('= 5000')
    expect(c).not.toContain('= 10000')
    expect(c).not.toContain('Umsatz: €')
  })

  it('kein Fake-Umsatz in sale-room', () => {
    const c = readFile('app/admin/sale-room/page.tsx')
    expect(c).not.toContain('revenueEUR = 5000')
    expect(c).not.toContain('revenueEUR = 1000')
  })

  it('kein Fake-Lead-Count in commercial-proof-tracker', () => {
    const c = readFile('app/admin/commercial-proof-tracker/page.tsx')
    // Kein hardcodierter Fake-Lead-Count
    expect(c).not.toContain('realLeadsTotal = 50')
    expect(c).not.toContain('realLeadsTotal = 100')
  })

  it('demo/sandbox enthält kein "500 customers"', () => {
    const c = readFile('app/demo/sandbox/page.tsx')
    expect(c).not.toContain('500 customers')
    expect(c).not.toContain('1000 clients')
  })

  it('demo/sandbox enthält kein Fake-Traffic-Statement', () => {
    const c = readFile('app/demo/sandbox/page.tsx')
    expect(c).not.toContain('10k visitors')
    expect(c).not.toContain('100k users')
  })

  it('kein Google API in irgendwelchen Sprint-Dateien', () => {
    const files = [
      'app/admin/commercial-proof-tracker/page.tsx',
      'app/admin/sale-room/page.tsx',
      'app/demo/sandbox/page.tsx',
      'app/admin/seo-indexing-control/page.tsx',
    ]
    for (const f of files) {
      const c = readFile(f)
      expect(c).not.toContain('googleapis')
      expect(c).not.toContain('google.com/api')
    }
  })

  it('kein Stripe in Sprint-Seiten', () => {
    const files = [
      'app/admin/commercial-proof-tracker/page.tsx',
      'app/admin/sale-room/page.tsx',
      'app/demo/sandbox/page.tsx',
    ]
    for (const f of files) {
      const c = readFile(f)
      expect(c.toLowerCase()).not.toContain('import stripe')
      expect(c).not.toContain('stripe.checkout')
    }
  })
})

// ── 9. Marke CorridorWork ─────────────────────────────────────────────────────

describe('Marke — CorridorWork korrekt', () => {
  const files = [
    'app/admin/commercial-proof-tracker/page.tsx',
    'app/admin/sale-room/page.tsx',
    'app/demo/sandbox/page.tsx',
    'app/admin/cwo-command-center/page.tsx',
  ]

  for (const f of files) {
    it(`${f}: enthält CorridorWork`, () => {
      const c = readFile(f)
      expect(c).toContain('CorridorWork')
    })

    it(`${f}: enthält nicht "Global Talent Bridge"`, () => {
      const c = readFile(f)
      expect(c).not.toContain('Global Talent Bridge')
    })

    it(`${f}: enthält nicht "SlotFill"`, () => {
      const c = readFile(f)
      expect(c).not.toContain('SlotFill')
    })
  }
})
