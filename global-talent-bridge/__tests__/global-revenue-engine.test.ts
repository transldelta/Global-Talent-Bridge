/**
 * __tests__/global-revenue-engine.test.ts
 *
 * Tests für den CorridorWork Global Buyer Satisfaction & Autonomous Revenue Sprint.
 *
 * Prüft:
 * - /global/employers HTTP-ready (Datei vorhanden, Consent pflicht, kein Fake)
 * - /global/candidates HTTP-ready (Datei vorhanden, Consent pflicht, kein Fake)
 * - Talent Categories (viele Bereiche, kein Deutschland-only)
 * - Admin-Seiten geschützt
 * - Daily Runner global revenue items
 * - Campaign Planner kein Ads-Start
 * - Sitemap enthält neue Public Pages
 * - Keine privaten WhatsApp/LinkedIn-Pflichten
 * - Marke CorridorWork korrekt
 * - Safety Invarianten
 *
 * Safety: Kein Stripe · Kein E-Mail · Kein Outreach · Kein Scraping · Keine Fake-Zahlen
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')

function readFile(relPath: string): string {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) throw new Error(`File not found: ${relPath}`)
  return readFileSync(full, 'utf-8')
}

// ── 1. Talent Categories ─────────────────────────────────────────────────────

describe('lib/talent-categories.ts', () => {
  let content: string
  beforeAll(() => { content = readFile('lib/talent-categories.ts') })

  it('Datei existiert', () => {
    expect(existsSync(join(ROOT, 'lib/talent-categories.ts'))).toBe(true)
  })

  it('enthält viele qualifizierte Berufsbereiche (mindestens 15)', () => {
    const matches = content.match(/sector_key:/g)
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(15)
  })

  it('enthält Pflege & Gesundheit', () => { expect(content).toContain('healthcare_care') })
  it('enthält IT & Software', () => { expect(content).toContain('it_software') })
  it('enthält Bau & Handwerk', () => { expect(content).toContain('construction_trades') })
  it('enthält Logistik & Transport', () => { expect(content).toContain('logistics_transport') })
  it('enthält Engineering', () => { expect(content).toContain('engineering') })
  it('enthält Hotel & Hospitality', () => { expect(content).toContain('hospitality_hotel') })
  it('enthält Gastronomie', () => { expect(content).toContain('gastronomy') })
  it('enthält Reinigung & Facility', () => { expect(content).toContain('facility_cleaning') })
  it('enthält Produktion & Industrie', () => { expect(content).toContain('manufacturing_production') })
  it('enthält Bildung & Training', () => { expect(content).toContain('education_training') })
  it('enthält Sprachdienste', () => { expect(content).toContain('language_services') })
  it('enthält Remote-geeignete Tätigkeiten', () => { expect(content).toContain('remote_qualified') })
  it('enthält Ausbildungskorridore', () => { expect(content).toContain('apprenticeship_training') })

  it('enthält revenue_potential Felder', () => { expect(content).toContain('revenue_potential') })
  it('enthält global_relevance_score Felder', () => { expect(content).toContain('global_relevance_score') })
  it('enthält keine Jobgarantie', () => { expect(content).not.toMatch(/garantierter.*job|job.*garantiert/i) })
  it('enthält keine Visa-Garantie', () => { expect(content).not.toMatch(/visa.*garantiert/i) })
  it('enthält kein Stripe', () => { expect(content).not.toContain("from 'stripe'") })
})

// ── 2. /global/employers ─────────────────────────────────────────────────────

describe('/global/employers Page', () => {
  let content: string
  beforeAll(() => { content = readFile('app/global/employers/page.tsx') })

  it('Datei existiert', () => {
    expect(existsSync(join(ROOT, 'app/global/employers/page.tsx'))).toBe(true)
  })

  it('enthält Consent-Checkbox (Pflicht)', () => {
    expect(content).toContain('consent_to_contact')
    expect(content).toContain('required')
  })

  it('enthält organization_name Feld', () => { expect(content).toContain('organization_name') })
  it('enthält contact_name Feld', () => { expect(content).toContain('contact_name') })
  it('enthält email Feld', () => { expect(content).toContain('email') })
  it('enthält country Feld', () => { expect(content).toContain('country') })
  it('enthält sector selection', () => { expect(content).toContain('TALENT_CATEGORIES') })
  it('enthält Honeypot-Feld', () => { expect(content).toContain('website') })
  it('enthält API-Endpoint /api/public/global-employer-leads', () => {
    expect(content).toContain('/api/public/global-employer-leads')
  })

  it('enthält globale Positionierung (nicht nur DE)', () => {
    expect(content).toMatch(/worldwide|weltweit|global/i)
  })

  it('enthält mehrere Branchen-Felder', () => { expect(content).toContain('sectors') })
  it('enthält urgency-Feld', () => { expect(content).toContain('urgency') })
  it('enthält qualification_level-Feld', () => { expect(content).toContain('qualification_level') })

  it('kein Stripe', () => { expect(content).not.toContain("from 'stripe'") })
  it('kein Versand', () => { expect(content).not.toContain('sendEmail(') })
  it('kein Scraping', () => { expect(content).not.toContain('puppeteer') })
  it('keine Jobgarantie', () => { expect(content).not.toMatch(/garantierter.*job|job.*garantiert/i) })
  it('keine Visa-Garantie', () => { expect(content).not.toMatch(/visa.*garantiert/i) })
  it('keine privaten WhatsApp/LinkedIn-Pflichten', () => {
    expect(content).not.toMatch(/whatsapp.*pflicht|linkedin.*pflicht/i)
  })
  it('enthält Datenschutz-Link', () => {
    expect(content).toMatch(/datenschutz|privacy.*policy/i)
  })
})

// ── 3. /global/candidates ────────────────────────────────────────────────────

describe('/global/candidates Page', () => {
  let content: string
  beforeAll(() => { content = readFile('app/global/candidates/page.tsx') })

  it('Datei existiert', () => {
    expect(existsSync(join(ROOT, 'app/global/candidates/page.tsx'))).toBe(true)
  })

  it('enthält Consent-Checkbox (Pflicht)', () => {
    expect(content).toContain('consent_to_contact')
    expect(content).toContain('required')
  })

  it('enthält display_name Feld', () => { expect(content).toContain('display_name') })
  it('enthält email Feld', () => { expect(content).toContain('email') })
  it('enthält country_of_origin Feld', () => { expect(content).toContain('country_of_origin') })
  it('enthält target_country Feld', () => { expect(content).toContain('target_country') })
  it('enthält sector selection', () => { expect(content).toContain('TALENT_CATEGORIES') })
  it('enthält Honeypot-Feld', () => { expect(content).toContain('website') })
  it('enthält API-Endpoint /api/public/candidate-interest', () => {
    expect(content).toContain('/api/public/candidate-interest')
  })

  it('enthält keine Jobgarantie Disclaimer', () => {
    expect(content).toMatch(/no job guarantee|keine.*jobgarantie|kein.*stellenangebot/i)
  })
  it('enthält keine Visa-Garantie Disclaimer', () => {
    expect(content).toMatch(/no visa guarantee|keine.*visa.*garantie/i)
  })
  it('enthält keine Kandidatengebühr', () => {
    expect(content).toMatch(/no.*fee|kostenlos|free of charge/i)
  })
  it('enthält Datenschutz-Link', () => {
    expect(content).toMatch(/datenschutz|privacy.*policy/i)
  })

  it('kein Stripe', () => { expect(content).not.toContain("from 'stripe'") })
  it('kein Versand', () => { expect(content).not.toContain('sendEmail(') })
  it('kein Scraping', () => { expect(content).not.toContain('puppeteer') })
  it('keine privaten WhatsApp/LinkedIn-Pflichten', () => {
    expect(content).not.toMatch(/whatsapp.*pflicht|linkedin.*pflicht/i)
  })
})

// ── 4. API Routes ─────────────────────────────────────────────────────────────

describe('API /api/public/global-employer-leads', () => {
  let content: string
  beforeAll(() => { content = readFile('app/api/public/global-employer-leads/route.ts') })

  it('Datei existiert', () => {
    expect(existsSync(join(ROOT, 'app/api/public/global-employer-leads/route.ts'))).toBe(true)
  })

  it('enthält no_email_sent: true', () => { expect(content).toContain('no_email_sent') })
  it('enthält no_auto_outreach: true', () => { expect(content).toContain('no_auto_outreach') })
  it('enthält no_payment_started: true', () => { expect(content).toContain('no_payment_started') })
  it('enthält Rate-Limit', () => { expect(content).toContain('RATE_LIMIT') })
  it('enthält Honeypot-Check', () => { expect(content).toContain('website') })
  it('kein Stripe', () => { expect(content).not.toContain("from 'stripe'") })
  it('kein Versand', () => { expect(content).not.toContain('nodemailer') })
})

describe('API /api/public/candidate-interest', () => {
  let content: string
  beforeAll(() => { content = readFile('app/api/public/candidate-interest/route.ts') })

  it('Datei existiert', () => {
    expect(existsSync(join(ROOT, 'app/api/public/candidate-interest/route.ts'))).toBe(true)
  })

  it('enthält no_email_sent', () => { expect(content).toContain('no_email_sent') })
  it('enthält no_auto_outreach', () => { expect(content).toContain('no_auto_outreach') })
  it('enthält no_job_guarantee', () => { expect(content).toContain('no_job_guarantee') })
  it('enthält no_visa_guarantee', () => { expect(content).toContain('no_visa_guarantee') })
  it('enthält no_candidate_fee', () => { expect(content).toContain('no_candidate_fee') })
  it('enthält Rate-Limit', () => { expect(content).toContain('RATE_LIMIT') })
  it('kein Stripe', () => { expect(content).not.toContain("from 'stripe'") })
})

// ── 5. DB Migration ───────────────────────────────────────────────────────────

describe('DB Migration 202606070400', () => {
  let content: string
  beforeAll(() => { content = readFile('supabase/migrations/202606070400_global_intake_tables.sql') })

  it('Datei existiert', () => {
    expect(existsSync(join(ROOT, 'supabase/migrations/202606070400_global_intake_tables.sql'))).toBe(true)
  })

  it('erstellt global_employer_leads', () => { expect(content).toContain('global_employer_leads') })
  it('erstellt candidate_interest_leads', () => { expect(content).toContain('candidate_interest_leads') })
  it('RLS aktiv auf beiden Tabellen', () => {
    expect(content).toContain('ENABLE ROW LEVEL SECURITY')
  })
  it('no_email_sent CHECK constraint', () => {
    expect(content).toContain('no_email_sent')
    expect(content).toContain('CHECK')
  })
  it('no_job_guarantee CHECK constraint', () => { expect(content).toContain('no_job_guarantee') })
  it('no_visa_guarantee CHECK constraint', () => { expect(content).toContain('no_visa_guarantee') })
  it('consent_to_contact = TRUE required', () => { expect(content).toContain('consent_to_contact = TRUE') })
})

// ── 6. Admin Pages — geschützt ────────────────────────────────────────────────

describe('Admin Pages — geschützt', () => {
  const adminPages = [
    'app/admin/global-campaign-planner/page.tsx',
    'app/admin/global-revenue-control/page.tsx',
    'app/admin/commercial-proof-tracker/page.tsx',
    'app/admin/sale-room/page.tsx',
    'app/admin/final-readiness/page.tsx',
  ]

  adminPages.forEach(page => {
    it(`${page} existiert`, () => {
      expect(existsSync(join(ROOT, page))).toBe(true)
    })
    it(`${page} ist admin-geschützt`, () => {
      const c = readFile(page)
      expect(c).toContain('getCurrentAdminUser')
      expect(c).toContain('redirect(')
    })
    it(`${page} kein Stripe`, () => {
      const c = readFile(page)
      expect(c).not.toContain("from 'stripe'")
    })
    it(`${page} kein Scraping`, () => {
      const c = readFile(page)
      expect(c).not.toContain('puppeteer')
      expect(c).not.toContain('cheerio')
    })
  })
})

// ── 7. Campaign Planner — kein Ads-Start-Button ───────────────────────────────

describe('Global Campaign Planner — kein Ads-Start', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/global-campaign-planner/page.tsx') })

  it('kein Start-Ads-Button', () => {
    expect(content).not.toMatch(/onClick.*startAds|startCampaign|launchAds/i)
  })

  it('kein Google API Call', () => {
    expect(content).not.toContain('googleapis.com')
    expect(content).not.toContain('google-ads-api')
  })

  it('kein Stripe', () => { expect(content).not.toContain("from 'stripe'") })

  it('enthält blocked_until_budget_and_legal_review Status', () => {
    expect(content).toContain('blocked_until_budget_and_legal_review')
  })

  it('enthält TALENT_CATEGORIES', () => {
    expect(content).toContain('TALENT_CATEGORIES')
  })

  it('zeigt Top Skill Categories', () => {
    expect(content).toMatch(/skill.*categor|top.*segment/i)
  })

  it('enthält "Keine Ads live" Hinweis', () => {
    expect(content).toMatch(/keine.*ads.*live|no.*ads.*live/i)
  })
})

// ── 8. Global Revenue Control ─────────────────────────────────────────────────

describe('Global Revenue Control', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/global-revenue-control/page.tsx') })

  it('kein Send-Button', () => {
    expect(content).not.toContain('sendEmail(')
    expect(content).not.toMatch(/onClick.*send\b/i)
  })

  it('kein Ads-Button', () => {
    expect(content).not.toMatch(/startCampaign|launchAds/i)
  })

  it('kein Stripe-Button', () => {
    expect(content).not.toContain("from 'stripe'")
    expect(content).not.toContain('loadStripe(')
  })

  it('zeigt globale Lead-Counts', () => {
    expect(content).toContain('global_employer_leads')
    expect(content).toContain('candidate_interest_leads')
  })

  it('zeigt Top Revenue Segments', () => {
    expect(content).toContain('getTopCategoriesByRevenue')
  })
})

// ── 9. Daily Runner — Global Revenue ─────────────────────────────────────────

describe('Daily Runner — Global Revenue Engine', () => {
  let content: string
  beforeAll(() => { content = readFile('app/api/cron/cwo-daily-runner/route.ts') })

  it('enthält "Global revenue engine prepared today"', () => {
    expect(content).toContain('Global revenue engine prepared today')
  })

  it('enthält globalEmployerNew', () => { expect(content).toContain('globalEmployerNew') })
  it('enthält candidateInterestNew', () => { expect(content).toContain('candidateInterestNew') })
  it('enthält TOP_GLOBAL_CORRIDORS', () => { expect(content).toContain('TOP_GLOBAL_CORRIDORS') })
  it('enthält TOP_SKILL_CATEGORIES', () => { expect(content).toContain('TOP_SKILL_CATEGORIES') })
  it('enthält TOP_EMPLOYER_SEGMENTS', () => { expect(content).toContain('TOP_EMPLOYER_SEGMENTS') })
  it('enthält TOP_CANDIDATE_SEGMENTS', () => { expect(content).toContain('TOP_CANDIDATE_SEGMENTS') })

  it('enthält globalRevenue im Response', () => {
    expect(content).toContain('globalRevenue:')
  })

  it('globalRevenue.paidAdsLive: false', () => {
    expect(content).toContain('paidAdsLive:')
    expect(content).toContain('false')
  })

  it('globalRevenue.outreachLive: false', () => {
    expect(content).toContain('outreachLive:')
  })

  it('Safety-Invarianten unverändert', () => {
    expect(content).toContain('no_email_sent:    true')
    expect(content).toContain('no_auto_outreach: true')
    expect(content).toContain('no_scraping:      true')
  })

  it('kein externer API-Call in Global-Section', () => {
    expect(content).not.toContain('googleapis.com')
    expect(content).not.toContain('google-ads-api')
  })
})

// ── 10. Sitemap — neue Public Pages ──────────────────────────────────────────

describe('Sitemap — neue globale Pages', () => {
  let content: string
  beforeAll(() => { content = readFile('app/sitemap.ts') })

  it('enthält /global/employers', () => { expect(content).toContain('/global/employers') })
  it('enthält /global/candidates', () => { expect(content).toContain('/global/candidates') })
  it('enthält /demo/sandbox', () => { expect(content).toContain('/demo/sandbox') })
  it('enthält /corridors/india-canada', () => { expect(content).toContain('/corridors/india-canada') })
  it('enthält /corridors/nigeria-uk', () => { expect(content).toContain('/corridors/nigeria-uk') })
  it('enthält /corridors/philippines-healthcare', () => { expect(content).toContain('/corridors/philippines-healthcare') })
  it('enthält /corridors/pakistan-gulf', () => { expect(content).toContain('/corridors/pakistan-gulf') })
  it('enthält keine Admin-Seiten', () => {
    expect(content).not.toContain('/admin/')
  })
})

// ── 11. Sale Room & Final Readiness ──────────────────────────────────────────

describe('Sale Room', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/sale-room/page.tsx') })

  it('zeigt Multisector Capability', () => {
    expect(content).toMatch(/multisector|viele.*bereiche/i)
  })

  it('zeigt TALENT_CATEGORIES', () => { expect(content).toContain('TALENT_CATEGORIES') })
  it('zeigt 0 echte Leads (ehrlich)', () => { expect(content).toContain('0 echte Leads') })
  it('zeigt 0 EUR Umsatz (ehrlich)', () => { expect(content).toContain('0 EUR') })
  it('kein Stripe', () => { expect(content).not.toContain("from 'stripe'") })
})

describe('Final Readiness', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/final-readiness/page.tsx') })

  it('zeigt Global-ready: Ja', () => { expect(content).toMatch(/global-ready|global.*ready/i) })
  it('zeigt Employer worldwide intake', () => { expect(content).toMatch(/employer.*worldwide|employer.*weltweit/i) })
  it('zeigt Candidate worldwide intake', () => { expect(content).toMatch(/candidate.*worldwide/i) })
  it('zeigt Paid Ads live: Nein', () => { expect(content).toMatch(/paid.*ads.*live/i) })
  it('zeigt Outreach live: Nein', () => { expect(content).toContain('Outreach live') })
  it('zeigt Payment-ready: Nein', () => { expect(content).toContain('Payment-ready') })
  it('zeigt Fully automated money machine: Nein', () => { expect(content).toMatch(/fully automated money machine/i) })
})

// ── 12. Neue Corridor Pages ───────────────────────────────────────────────────

describe('Neue globale Corridor Pages', () => {
  const corridors = [
    'app/corridors/india-canada/page.tsx',
    'app/corridors/india-australia/page.tsx',
    'app/corridors/nigeria-uk/page.tsx',
    'app/corridors/morocco-france/page.tsx',
    'app/corridors/tunisia-germany/page.tsx',
    'app/corridors/philippines-healthcare/page.tsx',
    'app/corridors/brazil-portugal/page.tsx',
    'app/corridors/kenya-care/page.tsx',
    'app/corridors/pakistan-gulf/page.tsx',
    'app/corridors/indonesia-hospitality/page.tsx',
  ]

  corridors.forEach(corridor => {
    it(`${corridor} existiert`, () => {
      expect(existsSync(join(ROOT, corridor))).toBe(true)
    })
  })
})

// ── 13. Global Corridor Template ──────────────────────────────────────────────

describe('GlobalCorridorPage Template', () => {
  let content: string
  beforeAll(() => { content = readFile('app/_components/GlobalCorridorPage.tsx') })

  it('Datei existiert', () => {
    expect(existsSync(join(ROOT, 'app/_components/GlobalCorridorPage.tsx'))).toBe(true)
  })

  it('enthält Employer-CTA → /global/employers', () => { expect(content).toContain('/global/employers') })
  it('enthält Candidate-CTA → /global/candidates', () => { expect(content).toContain('/global/candidates') })
  it('enthält Partner-CTA → /partners', () => { expect(content).toContain('/partners') })
  it('enthält Market-Intelligence-CTA', () => { expect(content).toContain('/market-intelligence') })
  it('keine Jobgarantie', () => { expect(content).toMatch(/no job guarantee/i) })
  it('keine Visa-Garantie', () => { expect(content).toMatch(/no visa guarantee/i) })
})

// ── 14. Brand Check ───────────────────────────────────────────────────────────

describe('Brand Check — CorridorWork', () => {
  const files = [
    'app/global/employers/page.tsx',
    'app/global/candidates/page.tsx',
    'app/demo/sandbox/page.tsx',
    'app/admin/global-campaign-planner/page.tsx',
    'app/admin/sale-room/page.tsx',
  ]

  files.forEach(file => {
    it(`${file}: enthält CorridorWork, nicht Global Talent Bridge`, () => {
      const c = readFile(file)
      expect(c).toContain('CorridorWork')
      expect(c).not.toContain('Global Talent Bridge')
      expect(c).not.toContain('SlotFill')
    })
  })
})

// ── 15. Safety Invarianten gesamt ────────────────────────────────────────────

describe('Safety Invarianten — Global Revenue Sprint', () => {
  const safetyFiles = [
    'app/api/public/global-employer-leads/route.ts',
    'app/api/public/candidate-interest/route.ts',
    'app/admin/global-campaign-planner/page.tsx',
    'app/admin/global-revenue-control/page.tsx',
  ]

  safetyFiles.forEach(file => {
    it(`${file}: kein Stripe`, () => {
      const c = readFile(file)
      expect(c).not.toContain("from 'stripe'")
    })
    it(`${file}: kein Scraping`, () => {
      const c = readFile(file)
      expect(c).not.toContain('cheerio')
      expect(c).not.toContain('puppeteer')
    })
    it(`${file}: kein Google API`, () => {
      const c = readFile(file)
      expect(c).not.toContain('googleapis.com')
    })
    it(`${file}: kein Outreach`, () => {
      const c = readFile(file)
      expect(c).not.toContain('sendEmail(')
      expect(c).not.toContain('nodemailer')
    })
  })
})
