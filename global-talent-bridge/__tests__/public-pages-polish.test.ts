/**
 * __tests__/public-pages-polish.test.ts
 *
 * CorridorWork — Public Pages Premium Trust & Conversion Polish Sprint
 *
 * Tests:
 * 1. OG image exists
 * 2. /global/employers — CTA "Submit workforce demand"
 * 3. /global/candidates — CTA "Submit candidate interest"
 * 4. /partners — CTA "Request partnership discussion", hero image, partner types
 * 5. /demo — Employers / Candidates / Partners / Review process / Trust notes
 * 6. Public trust QA — no admin/dashboard links, no forbidden terms
 * 7. Safety invariants — no Stripe, no scraping, no email, no job/visa guarantee
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')

function read(rel: string) {
  const p = join(ROOT, rel)
  if (!existsSync(p)) throw new Error(`Missing file: ${rel}`)
  return readFileSync(p, 'utf-8')
}

// ── 1. OG Image ───────────────────────────────────────────────────────────────

describe('OG Image', () => {
  it('public/og-image.png exists', () => {
    expect(existsSync(join(ROOT, 'public/og-image.png'))).toBe(true)
  })

  it('og-image.png is at least 10 KB (not empty)', () => {
    const { statSync } = require('fs')
    const size = statSync(join(ROOT, 'public/og-image.png')).size
    expect(size).toBeGreaterThan(10_000)
  })

  it('/global/employers metadata references og-image.png', () => {
    expect(read('app/global/employers/page.tsx')).toContain('/og-image.png')
  })

  it('/global/candidates metadata references og-image.png', () => {
    expect(read('app/global/candidates/page.tsx')).toContain('/og-image.png')
  })

  it('/partners metadata references og-image.png', () => {
    expect(read('app/partners/page.tsx')).toContain('/og-image.png')
  })

  it('/strategic-partnership metadata references og-image.png', () => {
    expect(read('app/strategic-partnership/page.tsx')).toContain('/og-image.png')
  })
})

// ── 2. /global/employers ─────────────────────────────────────────────────────

describe('/global/employers — CTA & Compliance', () => {
  let p: string
  beforeAll(() => { p = read('app/global/employers/page.tsx') })

  it('hero CTA is "Submit workforce demand"', () => {
    expect(p).toContain('Submit workforce demand')
  })

  it('uses PublicNavBar', () => {
    expect(p).toContain('PublicNavBar')
  })

  it('uses PublicFooter', () => {
    expect(p).toContain('PublicFooter')
  })

  it('has og-image metadata', () => {
    expect(p).toContain('/og-image.png')
  })

  it('has "No employment guarantee"', () => {
    expect(p).toContain('No employment guarantee')
  })

  it('has "No visa guarantee"', () => {
    expect(p).toContain('No visa guarantee')
  })

  it('has "No automatic placement"', () => {
    expect(p).toContain('No automatic placement')
  })

  it('does NOT contain "Submit employer demand" as CTA button text in page', () => {
    // The old CTA — now replaced with "Submit workforce demand"
    // The form h2/button text is in EmployerIntakeForm.tsx, not the page
    expect(p).not.toContain('Submit employer demand')
  })

  it('does NOT have admin links', () => {
    expect(p).not.toMatch(/href="\/admin/)
    expect(p).not.toMatch(/href='\/admin/)
  })

  it('does NOT have dashboard links', () => {
    expect(p).not.toContain('/candidate/dashboard')
    expect(p).not.toContain('/employer/dashboard')
  })
})

describe('/global/employers form — CTA consistency', () => {
  let f: string
  beforeAll(() => { f = read('app/global/employers/EmployerIntakeForm.tsx') })

  it('form h2 says "Submit workforce demand"', () => {
    expect(f).toContain('Submit workforce demand')
  })

  it('form submit button says "Submit Workforce Demand"', () => {
    expect(f).toMatch(/Submit Workforce Demand/i)
  })

  it('form has Consent section', () => {
    expect(f).toMatch(/Consent|consent/i)
  })

  it('does NOT have Stripe', () => {
    expect(f).not.toContain('stripe.com')
    expect(f).not.toMatch(/new Stripe\(|loadStripe/i)
  })
})

// ── 3. /global/candidates ─────────────────────────────────────────────────────

describe('/global/candidates — CTA & Compliance', () => {
  let p: string
  beforeAll(() => { p = read('app/global/candidates/page.tsx') })

  it('hero CTA is "Submit candidate interest"', () => {
    expect(p).toContain('Submit candidate interest')
  })

  it('has "No job guarantee" in trust notes', () => {
    expect(p).toContain('No job guarantee')
  })

  it('has "No visa guarantee" in trust notes', () => {
    expect(p).toContain('No visa guarantee')
  })

  it('has "No candidate fee active" language', () => {
    expect(p).toMatch(/No candidate fee active|No candidate fee|No automatic placement/i)
  })

  it('has "interest form, not a job offer" clarity', () => {
    expect(p).toMatch(/interest form|not a job offer/i)
  })

  it('has "Consent-based interest" trust note', () => {
    expect(p).toMatch(/Consent-based|consent.based/i)
  })

  it('has "Admin-reviewed workflow" trust note', () => {
    expect(p).toMatch(/Admin-reviewed|admin.reviewed/i)
  })

  it('has "How it works" section', () => {
    expect(p).toContain('How it works')
  })

  it('has 4 how-it-works steps', () => {
    expect(p).toContain('01')
    expect(p).toContain('02')
    expect(p).toContain('03')
    expect(p).toContain('04')
  })

  it('step 01 is "Submit candidate interest"', () => {
    expect(p).toMatch(/01[\s\S]{0,200}Submit candidate interest/m)
  })

  it('step 02 is "Manual review"', () => {
    expect(p).toMatch(/02[\s\S]{0,200}Manual review/m)
  })

  it('step 03 references "Corridor matching"', () => {
    expect(p).toMatch(/03[\s\S]{0,200}Corridor matching/m)
  })

  it('step 04 references "follow-up"', () => {
    expect(p).toMatch(/04[\s\S]{0,200}follow.up/im)
  })

  it('has breadcrumb linking back to CorridorWork home', () => {
    expect(p).toMatch(/href="\/"\s*[^>]*>[\s\S]*?CorridorWork/m)
  })

  it('has "Trust notes" section label', () => {
    expect(p).toContain('Trust notes')
  })

  it('has "How it works" anchor id', () => {
    expect(p).toContain('id="how-it-works"')
  })

  it('uses next/image for hero', () => {
    expect(p).toContain("import Image from 'next/image'")
  })

  it('uses PublicNavBar', () => {
    expect(p).toContain('PublicNavBar')
  })

  it('uses PublicFooter', () => {
    expect(p).toContain('PublicFooter')
  })

  it('does NOT have admin links', () => {
    expect(p).not.toMatch(/href="\/admin/)
  })

  it('does NOT have dashboard links', () => {
    expect(p).not.toMatch(/href="\/.*dashboard/)
  })
})

// ── 4. /partners ──────────────────────────────────────────────────────────────

describe('/partners — Premium Redesign', () => {
  let p: string
  beforeAll(() => { p = read('app/partners/page.tsx') })

  it('primary CTA is "Request partnership discussion"', () => {
    expect(p).toContain('Request partnership discussion')
  })

  it('has hero image via next/image', () => {
    expect(p).toContain("import Image from 'next/image'")
  })

  it('has "Recruiting Agencies" as partner type', () => {
    expect(p).toContain('Recruiting Agencies')
  })

  it('has "Employer Networks" as partner type', () => {
    expect(p).toContain('Employer Networks')
  })

  it('has "Training Providers" as partner type', () => {
    expect(p).toContain('Training Providers')
  })

  it('has "Language Schools" as partner type', () => {
    expect(p).toContain('Language Schools')
  })

  it('has "Relocation Partners" as partner type', () => {
    expect(p).toContain('Relocation Partners')
  })

  it('has "Market Intelligence Partners" as partner type', () => {
    expect(p).toContain('Market Intelligence Partners')
  })

  it('links to /strategic-partnership', () => {
    expect(p).toContain('/strategic-partnership')
  })

  it('uses PublicNavBar', () => {
    expect(p).toContain('PublicNavBar')
  })

  it('uses PublicFooter', () => {
    expect(p).toContain('PublicFooter')
  })

  it('has "No employment guarantee"', () => {
    expect(p).toContain('No employment guarantee')
  })

  it('has "No visa guarantee"', () => {
    expect(p).toContain('No visa guarantee')
  })

  it('does NOT have "Register partner interest" as primary CTA', () => {
    expect(p).not.toContain('Register partner interest')
  })

  it('does NOT have admin links', () => {
    expect(p).not.toMatch(/href="\/admin/)
  })

  it('does NOT have internal terms (Revenue, CEO, Command Center)', () => {
    expect(p).not.toMatch(/CEO Dashboard|Command Center|Sale Room|CWO Revenue|Revenue Operating/i)
  })
})

// ── 5. /demo ──────────────────────────────────────────────────────────────────

describe('/demo — Structure & Trust', () => {
  let p: string
  beforeAll(() => { p = read('app/demo/page.tsx') })

  it('has "How CorridorWork works" headline', () => {
    expect(p).toMatch(/How CorridorWork works/i)
  })

  it('has Employers section', () => {
    expect(p).toMatch(/Employers/i)
  })

  it('has Candidates section', () => {
    expect(p).toMatch(/Candidates/i)
  })

  it('has Partners section', () => {
    expect(p).toMatch(/Partners/i)
  })

  it('has Review process section', () => {
    expect(p).toMatch(/Review process/i)
  })

  it('has Trust notes section', () => {
    expect(p).toMatch(/Trust notes/i)
  })

  it('has "No employment guarantee" disclaimer', () => {
    expect(p).toMatch(/No employment guarantee/i)
  })

  it('has "No visa guarantee" disclaimer', () => {
    expect(p).toMatch(/No visa guarantee/i)
  })

  it('has "No automatic outreach" disclaimer', () => {
    expect(p).toMatch(/No automatic outreach/i)
  })

  it('has "fictional example data" disclaimer', () => {
    expect(p).toMatch(/fictional.*example|no real personal|sample data/i)
  })

  it('links to /global/employers', () => {
    expect(p).toContain('/global/employers')
  })

  it('links to /global/candidates', () => {
    expect(p).toContain('/global/candidates')
  })

  it('links to /strategic-partnership', () => {
    expect(p).toContain('/strategic-partnership')
  })

  it('uses PublicNavBar', () => {
    expect(p).toContain('PublicNavBar')
  })

  it('uses PublicFooter', () => {
    expect(p).toContain('PublicFooter')
  })

  it('has og-image metadata', () => {
    expect(p).toContain('/og-image.png')
  })

  it('does NOT have admin links', () => {
    expect(p).not.toMatch(/href="\/admin/)
    expect(p).not.toMatch(/href='\/admin/)
  })

  it('does NOT have internal system labels', () => {
    expect(p).not.toMatch(/CEO Dashboard|Command Center|Sale Room|CWO Revenue|Revenue Operating System/i)
  })

  it('does NOT have dashboard links', () => {
    expect(p).not.toContain('/candidate/dashboard')
    expect(p).not.toContain('/employer/dashboard')
  })
})

// ── 6. Public Trust QA — all public pages ────────────────────────────────────

const PUBLIC_PAGES = [
  'app/page.tsx',
  'app/global/employers/page.tsx',
  'app/global/candidates/page.tsx',
  'app/partners/page.tsx',
  'app/demo/page.tsx',
  'app/strategic-partnership/page.tsx',
  'app/buyer-snapshot/page.tsx',
  'app/launch/page.tsx',
  'app/promo-video/page.tsx',
]

describe('Public Trust QA — all public pages', () => {
  it('no page has /admin href links', () => {
    for (const rel of PUBLIC_PAGES) {
      const c = read(rel)
      expect(c, `${rel} has /admin link`).not.toMatch(/href="\/admin/)
      expect(c, `${rel} has /admin link`).not.toMatch(/href='\/admin/)
    }
  })

  it('no page has candidate/employer dashboard links', () => {
    for (const rel of PUBLIC_PAGES) {
      const c = read(rel)
      expect(c, `${rel} has dashboard link`).not.toContain('/candidate/dashboard')
      expect(c, `${rel} has dashboard link`).not.toContain('/employer/dashboard')
    }
  })

  it('no page mentions CEO Dashboard', () => {
    for (const rel of PUBLIC_PAGES) {
      expect(read(rel), `${rel} has CEO Dashboard`).not.toContain('CEO Dashboard')
    }
  })

  it('no page mentions Command Center', () => {
    for (const rel of PUBLIC_PAGES) {
      expect(read(rel), `${rel} has Command Center`).not.toContain('Command Center')
    }
  })

  it('no page mentions Sale Room', () => {
    for (const rel of PUBLIC_PAGES) {
      expect(read(rel), `${rel} has Sale Room`).not.toContain('Sale Room')
    }
  })

  it('no page claims a job guarantee', () => {
    for (const rel of PUBLIC_PAGES) {
      const c = read(rel).toLowerCase()
      expect(c, `${rel} claims job guarantee`).not.toContain('guaranteed job')
      expect(c, `${rel} claims guaranteed placement`).not.toContain('guaranteed placement')
    }
  })

  it('no page claims a visa guarantee', () => {
    for (const rel of PUBLIC_PAGES) {
      const c = read(rel).toLowerCase()
      expect(c, `${rel} claims visa guarantee`).not.toContain('guaranteed visa')
      expect(c, `${rel} claims visa guarantee`).not.toContain('visa guaranteed')
    }
  })

  it('no page contains active Stripe SDK integration', () => {
    for (const rel of PUBLIC_PAGES) {
      const c = read(rel)
      expect(c, `${rel} has Stripe`).not.toContain('stripe.com')
      expect(c, `${rel} has Stripe`).not.toMatch(/new Stripe\(|loadStripe|stripe\.createCharge/i)
    }
  })

  it('no page mentions kostenlos starten', () => {
    for (const rel of PUBLIC_PAGES) {
      expect(read(rel).toLowerCase(), `${rel} has kostenlos starten`).not.toContain('kostenlos starten')
    }
  })

  it('no page mentions keine kreditkarte', () => {
    for (const rel of PUBLIC_PAGES) {
      expect(read(rel).toLowerCase(), `${rel} has keine kreditkarte`).not.toContain('keine kreditkarte')
    }
  })
})

// ── 7. Safety Invariants ──────────────────────────────────────────────────────

describe('Safety Invariants — page files', () => {
  const ALL_PAGES = [
    ...PUBLIC_PAGES,
    'app/global/employers/EmployerIntakeForm.tsx',
    'app/global/candidates/CandidateIntakeForm.tsx',
  ]

  it('no page has scraping libraries', () => {
    for (const rel of ALL_PAGES) {
      const c = read(rel)
      expect(c, `${rel} has scraping`).not.toMatch(/puppeteer|cheerio|playwright/i)
    }
  })

  it('no page has email sending', () => {
    for (const rel of ALL_PAGES) {
      const c = read(rel)
      expect(c, `${rel} has email sending`).not.toMatch(/sendEmail|nodemailer|resend\.send/i)
    }
  })
})

