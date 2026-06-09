/**
 * __tests__/buyer-package.test.ts
 *
 * Zero-Cost Buyer Package Sprint — tests.
 *
 * Covers:
 * 1. docs/buyer-package/ — 9 markdown files exist and contain required content
 * 2. lib/buyer-room.ts — new exports (PUBLIC_PAGES, BUYER_PROFILES, SALE_READINESS_DIMENSIONS)
 * 3. app/for-buyers/page.tsx — public page structure
 * 4. app/admin/sale-readiness/page.tsx — uses SALE_READINESS_DIMENSIONS
 * 5. BuyerRoomClient — new tabs present
 * 6. Safety: no fake revenue, no auto-send, no scraping in any buyer-package doc
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { describe, it, expect } from 'vitest'

import {
  PUBLIC_PAGES,
  BUYER_PROFILES,
  SALE_READINESS_DIMENSIONS,
  calculateSaleReadinessScore,
} from '@/lib/buyer-room'

const ROOT  = join(process.cwd())
const DOCS  = join(ROOT, 'docs', 'buyer-package')
const APP   = join(ROOT, 'app')
const ADMIN = join(APP, 'admin')

// ── 1. docs/buyer-package/ existence ─────────────────────────────────────────

describe('docs/buyer-package — all 9 files exist', () => {
  const required = [
    'executive-summary.md',
    'what-buyer-gets.md',
    'technical-architecture.md',
    'security-rls-overview.md',
    'deployment-transfer-checklist.md',
    'pre-revenue-disclosure.md',
    'growth-opportunities.md',
    'asking-price-rationale.md',
    'handover-checklist.md',
  ]

  required.forEach((file) => {
    it(`${file} exists`, () => {
      expect(existsSync(join(DOCS, file))).toBe(true)
    })
  })
})

// ── 2. executive-summary.md content ──────────────────────────────────────────

describe('executive-summary.md — required content', () => {
  const body = readFileSync(join(DOCS, 'executive-summary.md'), 'utf-8')

  it('mentions CorridorWork', () => {
    expect(body).toContain('CorridorWork')
  })
  it('mentions corridorwork.com', () => {
    expect(body.toLowerCase()).toContain('corridorwork.com')
  })
  it('mentions pre-revenue or asset stage', () => {
    expect(body.toLowerCase()).toMatch(/pre-revenue|asset.?stage/)
  })
  it('mentions €0 or $0 MRR (honest disclosure)', () => {
    expect(body).toMatch(/€0|\$0/)
  })
  it('mentions transfer-ready', () => {
    expect(body.toLowerCase()).toContain('transfer-ready')
  })
  it('mentions a realistic asking price or negotiable positioning', () => {
    expect(body).toMatch(/negotiable|15.000|15 000|25.000|25 000|price ladder|realistic range/i)
  })
  it('mentions Next.js or Supabase or Vercel', () => {
    expect(body).toMatch(/Next\.js|Supabase|Vercel/)
  })
  it('no fake revenue claims', () => {
    expect(body).not.toMatch(/€[1-9]\d*\s{0,3}mrr/i)
  })
  it('no job guarantee claims', () => {
    expect(body).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?job/i)
  })
})

// ── 3. pre-revenue-disclosure.md — honest financial facts ────────────────────

describe('pre-revenue-disclosure.md — honest financial disclosure', () => {
  const body = readFileSync(join(DOCS, 'pre-revenue-disclosure.md'), 'utf-8')

  it('states €0 MRR', () => {
    expect(body).toMatch(/€0|mRR.*€0|mrr.*0/i)
  })
  it('states 0 paying customers', () => {
    expect(body).toMatch(/0 paying customers|paying customers.*0|no paying customers/i)
  })
  it('states Stripe not active', () => {
    expect(body.toLowerCase()).toContain('stripe')
    expect(body.toLowerCase()).toMatch(/not active|not connected/)
  })
  it('does not claim MRR > 0', () => {
    expect(body).not.toMatch(/€[1-9]\d*\s{0,5}mrr|mrr[:\s]+€[1-9]/i)
  })
  it('does not claim fake customers', () => {
    expect(body).not.toMatch(/(?:we have|platform has)\s+\d+\s+(?:paying\s+)?customers/i)
  })
})

// ── 4. asking-price-rationale.md content ─────────────────────────────────────

describe('asking-price-rationale.md — required content', () => {
  const body = readFileSync(join(DOCS, 'asking-price-rationale.md'), 'utf-8')

  it('states a realistic asking price range with tiers', () => {
    // Tier 1: current realistic range
    expect(body).toMatch(/15.000|15 000|tier 1/i)
    // Tier 3: long-term target only with proof
    expect(body).toMatch(/50.000|69.000|tier 3/i)
  })
  it('explains asset-stage valuation', () => {
    expect(body.toLowerCase()).toMatch(/asset.?stage/)
  })
  it('mentions no revenue multiple', () => {
    expect(body.toLowerCase()).toMatch(/no revenue|no mrr|€0 mrr|not a revenue multiple/i)
  })
  it('has negotiation guidance', () => {
    expect(body.toLowerCase()).toContain('negotiation')
  })
})

// ── 5. handover-checklist.md content ─────────────────────────────────────────

describe('handover-checklist.md — required content', () => {
  const body = readFileSync(join(DOCS, 'handover-checklist.md'), 'utf-8')

  it('mentions escrow', () => {
    expect(body.toLowerCase()).toContain('escrow')
  })
  it('mentions payment before transfer (escrow rule)', () => {
    // "No asset is transferred before payment is confirmed in escrow."
    expect(body.toLowerCase()).toMatch(/no asset.*transferred|payment.*escrow|escrow.*payment/)
  })
  it('has GitHub transfer step', () => {
    expect(body.toLowerCase()).toContain('github')
  })
  it('has Vercel transfer step', () => {
    expect(body.toLowerCase()).toContain('vercel')
  })
  it('has Supabase transfer step', () => {
    expect(body.toLowerCase()).toContain('supabase')
  })
  it('has domain transfer step', () => {
    expect(body.toLowerCase()).toContain('domain')
  })
})

// ── 6. growth-opportunities.md content ───────────────────────────────────────

describe('growth-opportunities.md — required content', () => {
  const body = readFileSync(join(DOCS, 'growth-opportunities.md'), 'utf-8')

  it('lists multiple monetization paths', () => {
    expect(body.toLowerCase()).toMatch(/employer pilot|partner intelligence|saas licence/)
  })
  it('states no paths are active', () => {
    expect(body.toLowerCase()).toMatch(/none are active|not active|buyer activates/)
  })
  it('no fake revenue claims', () => {
    expect(body).not.toMatch(/€[1-9]\d{3,}\s{0,3}mrr/i)
  })
})

// ── 7. deployment-transfer-checklist.md content ───────────────────────────────

describe('deployment-transfer-checklist.md — required content', () => {
  const body = readFileSync(join(DOCS, 'deployment-transfer-checklist.md'), 'utf-8')

  it('mentions escrow payment rule', () => {
    expect(body.toLowerCase()).toContain('escrow')
  })
  it('has 10 steps', () => {
    expect(body).toMatch(/Step 10/)
  })
  it('mentions RLS verification', () => {
    expect(body.toLowerCase()).toMatch(/rls|row level security/)
  })
  it('mentions secrets rotation', () => {
    expect(body.toLowerCase()).toMatch(/secret|rotation|rotate/)
  })
})

// ── 8. security-rls-overview.md content ──────────────────────────────────────

describe('security-rls-overview.md — required content', () => {
  const body = readFileSync(join(DOCS, 'security-rls-overview.md'), 'utf-8')

  it('explains RLS', () => {
    expect(body.toLowerCase()).toMatch(/row level security|rls/)
  })
  it('mentions no_auto_send constraint', () => {
    expect(body.toLowerCase()).toContain('no_auto_send')
  })
  it('mentions GDPR', () => {
    expect(body.toLowerCase()).toContain('gdpr')
  })
  it('mentions EU-Frankfurt', () => {
    expect(body.toLowerCase()).toMatch(/eu.frankfurt|eu-central/)
  })
})

// ── 9. lib/buyer-room — new exports ──────────────────────────────────────────

describe('lib/buyer-room — PUBLIC_PAGES', () => {
  it('exports PUBLIC_PAGES as array', () => {
    expect(Array.isArray(PUBLIC_PAGES)).toBe(true)
  })
  it('has at least 15 pages', () => {
    expect(PUBLIC_PAGES.length).toBeGreaterThanOrEqual(15)
  })
  it('each entry has path, label, purpose', () => {
    PUBLIC_PAGES.forEach((p) => {
      expect(p.path).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.purpose).toBeTruthy()
    })
  })
  it('includes /for-buyers', () => {
    expect(PUBLIC_PAGES.some((p) => p.path === '/for-buyers')).toBe(true)
  })
  it('has no admin paths', () => {
    PUBLIC_PAGES.forEach((p) => {
      expect(p.path).not.toMatch(/^\/admin/)
    })
  })
})

describe('lib/buyer-room — BUYER_PROFILES', () => {
  it('exports BUYER_PROFILES as array', () => {
    expect(Array.isArray(BUYER_PROFILES)).toBe(true)
  })
  it('has at least 4 profiles', () => {
    expect(BUYER_PROFILES.length).toBeGreaterThanOrEqual(4)
  })
  it('each profile has id, label, fit, reasons, example', () => {
    BUYER_PROFILES.forEach((p) => {
      expect(p.id).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(['ideal', 'good', 'possible', 'not-recommended']).toContain(p.fit)
      expect(Array.isArray(p.reasons)).toBe(true)
      expect(p.reasons.length).toBeGreaterThan(0)
      expect(p.example).toBeTruthy()
    })
  })
  it('includes at least one ideal profile', () => {
    expect(BUYER_PROFILES.some((p) => p.fit === 'ideal')).toBe(true)
  })
  it('includes at least one not-recommended profile (honesty)', () => {
    expect(BUYER_PROFILES.some((p) => p.fit === 'not-recommended')).toBe(true)
  })
})

describe('lib/buyer-room — SALE_READINESS_DIMENSIONS', () => {
  it('exports SALE_READINESS_DIMENSIONS as array', () => {
    expect(Array.isArray(SALE_READINESS_DIMENSIONS)).toBe(true)
  })
  it('has exactly 6 dimensions', () => {
    expect(SALE_READINESS_DIMENSIONS.length).toBe(6)
  })
  it('each dimension has id, label, score, band, description, honest_note', () => {
    SALE_READINESS_DIMENSIONS.forEach((d) => {
      expect(d.id).toBeTruthy()
      expect(d.label).toBeTruthy()
      expect(typeof d.score).toBe('number')
      expect(d.score).toBeGreaterThanOrEqual(0)
      expect(d.score).toBeLessThanOrEqual(100)
      expect(['high', 'medium', 'low']).toContain(d.band)
      expect(d.description).toBeTruthy()
      expect(d.honest_note).toBeTruthy()
    })
  })
  it('commercial proof dimension has LOW band (honest — 0 MRR)', () => {
    const commercial = SALE_READINESS_DIMENSIONS.find(d => d.id === 'commercial')
    expect(commercial).toBeDefined()
    expect(commercial!.band).toBe('low')
    expect(commercial!.score).toBeLessThan(20)
  })
  it('technical dimension has HIGH band', () => {
    const tech = SALE_READINESS_DIMENSIONS.find(d => d.id === 'technical')
    expect(tech).toBeDefined()
    expect(tech!.band).toBe('high')
    expect(tech!.score).toBeGreaterThan(80)
  })
  it('overall dimension exists and score is realistic (50–80)', () => {
    const overall = SALE_READINESS_DIMENSIONS.find(d => d.id === 'overall')
    expect(overall).toBeDefined()
    expect(overall!.score).toBeGreaterThanOrEqual(50)
    expect(overall!.score).toBeLessThanOrEqual(80)
  })
  it('commercial proof description mentions €0 MRR or 0 paying customers', () => {
    const commercial = SALE_READINESS_DIMENSIONS.find(d => d.id === 'commercial')
    expect(commercial!.description).toMatch(/€0|0 paying|no mrr|stripe not/i)
  })
})

describe('lib/buyer-room — calculateSaleReadinessScore', () => {
  it('returns a number between 0 and 100', () => {
    const score = calculateSaleReadinessScore()
    expect(typeof score).toBe('number')
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThanOrEqual(100)
  })
  it('overall score is in asset-stage range (50–80)', () => {
    const score = calculateSaleReadinessScore()
    expect(score).toBeGreaterThanOrEqual(50)
    expect(score).toBeLessThanOrEqual(80)
  })
})

// ── 10. app/for-buyers/page.tsx — public page ─────────────────────────────────

describe('app/for-buyers/page.tsx — structure and safety', () => {
  const src = readFileSync(join(APP, 'for-buyers', 'page.tsx'), 'utf-8')

  it('exists', () => {
    expect(existsSync(join(APP, 'for-buyers', 'page.tsx'))).toBe(true)
  })
  it('is NOT noindex (public page)', () => {
    expect(src).not.toMatch(/noindex.*nofollow/)
  })
  it('does NOT link to /admin routes', () => {
    expect(src).not.toMatch(/href=["'`]\/admin/)
  })
  it('does NOT expose sale readiness score (admin data)', () => {
    expect(src).not.toMatch(/calculateSaleReadinessScore|SALE_READINESS/)
  })
  it('has a CTA linking to /contact', () => {
    expect(src).toContain('/contact')
  })
  it('states pre-revenue or asset stage', () => {
    expect(src.toLowerCase()).toMatch(/pre-revenue|asset.?stage/)
  })
  it('states transfer-ready', () => {
    expect(src.toLowerCase()).toContain('transfer-ready')
  })
  it('states escrow rule', () => {
    expect(src.toLowerCase()).toContain('escrow')
  })
  it('no Stripe payment activation', () => {
    expect(src.toLowerCase()).not.toMatch(/(?:activate|connect|enable)\s+stripe/i)
  })
  it('has export default function (valid Next.js page)', () => {
    expect(src).toMatch(/export default function/)
  })
})

// ── 11. app/admin/sale-readiness/page.tsx — uses SALE_READINESS_DIMENSIONS ────

describe('app/admin/sale-readiness/page.tsx — honest redesign', () => {
  const src = readFileSync(join(ADMIN, 'sale-readiness', 'page.tsx'), 'utf-8')

  it('imports SALE_READINESS_DIMENSIONS', () => {
    expect(src).toContain('SALE_READINESS_DIMENSIONS')
  })
  it('is admin-gated (getCurrentAdminUser)', () => {
    expect(src).toContain('getCurrentAdminUser')
    expect(src).toContain('redirect')
  })
  it('has noindex metadata', () => {
    expect(src).toContain('noindex')
  })
  it('has force-dynamic', () => {
    expect(src).toContain("'force-dynamic'")
  })
  it('shows 6 dimensions (maps SALE_READINESS_DIMENSIONS)', () => {
    expect(src).toMatch(/SALE_READINESS_DIMENSIONS\.map/)
  })
  it('no Stripe payment code', () => {
    expect(src).not.toMatch(/stripe\.com|loadStripe/i)
  })
})

// ── 12. BuyerRoomClient — new tabs ────────────────────────────────────────────

describe('BuyerRoomClient — new tabs', () => {
  const src = readFileSync(
    join(ADMIN, 'buyer-room', '_components', 'BuyerRoomClient.tsx'),
    'utf-8'
  )

  it('has public-pages tab', () => {
    expect(src).toContain("'public-pages'")
    expect(src).toContain('PublicPagesTab')
  })
  it('has buyer-profile tab', () => {
    expect(src).toContain("'buyer-profile'")
    expect(src).toContain('BuyerProfileTab')
  })
  it('imports PUBLIC_PAGES', () => {
    expect(src).toContain('PUBLIC_PAGES')
  })
  it('imports BUYER_PROFILES', () => {
    expect(src).toContain('BUYER_PROFILES')
  })
  it('renders PublicPagesTab when tab = public-pages', () => {
    expect(src).toMatch(/tab === ['"]public-pages['"].*PublicPagesTab|PublicPagesTab.*tab === ['"]public-pages['"]/)
  })
  it('renders BuyerProfileTab when tab = buyer-profile', () => {
    expect(src).toMatch(/tab === ['"]buyer-profile['"].*BuyerProfileTab|BuyerProfileTab.*tab === ['"]buyer-profile['"]/)
  })
  it('BuyerProfileTab warns about not-recommended buyers', () => {
    expect(src).toContain('not-recommended')
  })
  it('PublicPagesTab has no admin links', () => {
    // The public pages tab should not contain /admin hrefs
    const publicPagesSection = src.slice(
      src.indexOf('function PublicPagesTab'),
      src.indexOf('function BuyerProfileTab')
    )
    expect(publicPagesSection).not.toMatch(/href=["'`]\/admin/)
  })
})

// ── 13. sitemap.ts — /for-buyers included ─────────────────────────────────────

describe('app/sitemap.ts — /for-buyers included', () => {
  const src = readFileSync(join(APP, 'sitemap.ts'), 'utf-8')

  it('includes /for-buyers URL', () => {
    expect(src).toContain('/for-buyers')
  })
  it('still has no /admin URLs', () => {
    expect(src).not.toMatch(/['"`].*\/admin\//)
  })
})

// ── 14. Safety sweep — all buyer-package docs ─────────────────────────────────

describe('buyer-package docs — safety sweep (no prohibited content)', () => {
  const docFiles = [
    'executive-summary.md',
    'what-buyer-gets.md',
    'technical-architecture.md',
    'security-rls-overview.md',
    'deployment-transfer-checklist.md',
    'pre-revenue-disclosure.md',
    'growth-opportunities.md',
    'asking-price-rationale.md',
    'handover-checklist.md',
  ]

  docFiles.forEach((file) => {
    const body = readFileSync(join(DOCS, file), 'utf-8')

    it(`${file} — no affirmative job guarantee`, () => {
      expect(body).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?job|job\s+placement\s+guaranteed/i)
    })

    it(`${file} — no affirmative visa guarantee`, () => {
      expect(body).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?visa|visa\s+(?:approval\s+)?guaranteed/i)
    })

    it(`${file} — no affirmative auto-send claim`, () => {
      expect(body).not.toMatch(/(?:we\s+)?send\s+automatically|auto.?send\s+is\s+enabled|bulk\s+send\s+supported/i)
    })

    it(`${file} — no fake positive MRR (€0 is fine)`, () => {
      expect(body).not.toMatch(/€[1-9]\d{2,}\s{0,3}mrr/i)
    })
  })
})
