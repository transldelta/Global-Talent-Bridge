import { describe, test, expect, beforeAll } from 'vitest'
/**
 * CorridorWork — Sprint 4: Premium Public Trust Lockdown Tests
 *
 * Verifies:
 * - /demo: no internal system labels, PublicNavBar+Footer, English, no CWO section
 * - /partners: server+client split, no purple gradient, no emoji wall, professional
 * - /strategic-partnership: no "Strategisches Asset", no CWO OS, professional headline
 * - /buyer-snapshot: no "Admin Tools" internal entry, no "CWO Operating System" row
 * - /launch: professional, no internal terms, PublicNavBar+Footer
 * - robots.txt: has Disallow: /admin/
 * - All pages: no internal terms publicly visible
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')

function readFile(rel: string) {
  return readFileSync(join(ROOT, rel), 'utf8')
}

// ── /demo ─────────────────────────────────────────────────────────────────────

describe('/demo — Permanent Redirect to /demo/sandbox', () => {
  // /demo now permanently redirects to /demo/sandbox (all content consolidated there)
  let content: string
  beforeAll(() => { content = readFile('app/demo/page.tsx') })

  test('redirects to /demo/sandbox', () => {
    expect(content).toContain('/demo/sandbox')
  })

  test('uses permanentRedirect', () => {
    expect(content).toMatch(/permanentRedirect/i)
  })

  test('references CorridorWork brand', () => {
    expect(content).toContain('CorridorWork')
  })

  test('does NOT have custom internal header nav', () => {
    expect(content).not.toContain('/pilot/agencies')
    expect(content).not.toContain('/market-intelligence')
  })

  test('does NOT contain "CWO Revenue Operating System"', () => {
    expect(content).not.toContain('CWO Revenue Operating System')
  })

  test('does NOT contain "Daily Runner" label', () => {
    expect(content).not.toContain('Daily Runner')
  })

  test('does NOT contain "Revenue Operating System"', () => {
    expect(content).not.toContain('Revenue Operating System')
  })

  test('does NOT use bg-white CTA box (contrast risk)', () => {
    expect(content).not.toContain('bg-white rounded-2xl shadow-2xl p-8 text-center')
  })

  test('does NOT contain "Kostenlos testen"', () => {
    expect(content.toLowerCase()).not.toContain('kostenlos testen')
  })

  test('does NOT contain "Phase 1 Pilot" badge', () => {
    expect(content).not.toContain('Phase 1 Pilot')
  })
})

// ── /partners ─────────────────────────────────────────────────────────────────

describe('/partners — Professional Partner Page', () => {
  let page: string
  let form: string
  beforeAll(() => {
    page = readFile('app/partners/page.tsx')
    form = readFile('app/partners/PartnersForm.tsx')
  })

  test('page.tsx is a server component (no "use client")', () => {
    expect(page).not.toContain("'use client'")
  })

  test('PartnersForm.tsx is a client component', () => {
    expect(form).toContain("'use client'")
  })

  test('page uses PublicNavBar', () => {
    expect(page).toContain('PublicNavBar')
  })

  test('page uses PublicFooter', () => {
    expect(page).toContain('PublicFooter')
  })

  test('page imports PartnersForm', () => {
    expect(page).toContain('PartnersForm')
  })

  test('page has professional English headline', () => {
    expect(page).toMatch(/partner with a global talent corridor platform/i)
  })

  test('page does NOT have purple gradient background', () => {
    expect(page).not.toContain('from-purple-950')
    expect(page).not.toContain('bg-gradient-to-b from-purple-')
  })

  test('page does NOT have "Phase 1" badge', () => {
    expect(page).not.toContain('Phase 1')
  })

  test('page does NOT have emoji wall in hero', () => {
    // Old page had 🤝🏷️🌍📊🔗 as decorative elements
    expect(page).not.toMatch(/🤝🏷️🌍📊🔗/)
  })

  test('page does NOT have old German headline', () => {
    expect(page).not.toContain('CorridorWork als')
    expect(page).not.toContain('Partnerlösung nutzen')
  })

  test('form submits to /api/public/revenue-leads', () => {
    expect(form).toContain('/api/public/revenue-leads')
  })

  test('form has honeypot field', () => {
    expect(form).toContain('website')
    expect(form.toLowerCase()).toContain('honeypot')
  })

  test('form has consent_to_contact checkbox', () => {
    expect(form).toContain('consent_to_contact')
    expect(form).toContain('type="checkbox"')
    expect(form).toContain('required')
  })

  test('form has organization_name field', () => {
    expect(form).toContain('organization_name')
  })

  test('form has email field', () => {
    expect(form).toContain('type="email"')
  })

  test('form uses lead_type agency_partner', () => {
    expect(form).toContain('agency_partner')
  })

  test('form does NOT send automatic emails', () => {
    expect(form.toLowerCase()).not.toContain('sendmail')
    expect(form.toLowerCase()).not.toContain('smtp')
    expect(form.toLowerCase()).not.toContain('nodemailer')
  })

  test('form does NOT load Stripe SDK', () => {
    expect(form.toLowerCase()).not.toContain('loadstripe')
    expect(form.toLowerCase()).not.toContain('stripe.com/pay')
    expect(form.toLowerCase()).not.toContain("import('stripe')")
  })

  test('success state does not promise job placement', () => {
    expect(form).not.toContain('job offer')
    expect(form.toLowerCase()).not.toContain('guaranteed placement')
  })

  test('page links to /strategic-partnership', () => {
    expect(page).toContain('/strategic-partnership')
  })

  test('compliance badges on page', () => {
    expect(page).toContain('No employment guarantee')
    expect(page).toContain('No visa guarantee')
  })
})

// ── /strategic-partnership ────────────────────────────────────────────────────

describe('/strategic-partnership — Professional Partnership Page', () => {
  let page: string
  let form: string
  beforeAll(() => {
    page = readFile('app/strategic-partnership/page.tsx')
    form = readFile('app/strategic-partnership/StrategicPartnershipForm.tsx')
  })

  test('page.tsx is a server component (no "use client")', () => {
    expect(page).not.toContain("'use client'")
  })

  test('StrategicPartnershipForm.tsx is a client component', () => {
    expect(form).toContain("'use client'")
  })

  test('page uses PublicNavBar', () => {
    expect(page).toContain('PublicNavBar')
  })

  test('page uses PublicFooter', () => {
    expect(page).toContain('PublicFooter')
  })

  test('page has professional English headline', () => {
    expect(page).toMatch(/explore a strategic partnership with corridorwork/i)
  })

  test('page does NOT use old German headline "Strategisches Asset"', () => {
    expect(page).not.toContain('Strategisches Asset')
    expect(page).not.toContain('CorridorWork als')
  })

  test('page does NOT expose "CWO Operating System"', () => {
    expect(page).not.toContain('CWO Operating System')
  })

  test('page does NOT expose "Daily Runner" as an internal label', () => {
    expect(page).not.toContain('Daily Runner')
  })

  test('page does NOT expose "Autonomous Revenue Operating System"', () => {
    expect(page).not.toContain('Autonomous Revenue Operating System')
    expect(page).not.toContain('Autonomous Revenue OS')
  })

  test('page does NOT expose "Revenue-Pfade"', () => {
    expect(page).not.toContain('Revenue-Pfade')
  })

  test('page does NOT have amber gradient background', () => {
    expect(page).not.toContain('from-amber-950 to-slate-')
    expect(page).not.toContain('bg-gradient-to-b from-amber-')
  })

  test('page does NOT have custom internal header nav', () => {
    expect(page).not.toContain('Partner-Programm →')
  })

  test('page links to /partners', () => {
    expect(page).toContain('/partners')
  })

  test('page links to /demo', () => {
    expect(page).toContain('/demo')
  })

  test('form submits to /api/public/revenue-leads', () => {
    expect(form).toContain('/api/public/revenue-leads')
  })

  test('form uses lead_type strategic_partner', () => {
    expect(form).toContain('strategic_partner')
  })

  test('form has honeypot field', () => {
    expect(form).toContain('website')
    expect(form).toContain('honeypot')
  })

  test('form has consent_to_contact checkbox', () => {
    expect(form).toContain('consent_to_contact')
    expect(form).toContain('type="checkbox"')
    expect(form).toContain('required')
  })

  test('form has organization_name field', () => {
    expect(form).toContain('organization_name')
  })

  test('form has email field', () => {
    expect(form).toContain('type="email"')
  })

  test('form does NOT send automatic emails', () => {
    expect(form.toLowerCase()).not.toContain('sendmail')
    expect(form.toLowerCase()).not.toContain('smtp')
    expect(form.toLowerCase()).not.toContain('nodemailer')
  })

  test('form does NOT reference Stripe', () => {
    expect(form.toLowerCase()).not.toContain('stripe')
  })

  test('page has no false promises', () => {
    expect(page).not.toContain('guaranteed revenue')
    expect(page).not.toContain('guaranteed growth')
  })
})

// ── /buyer-snapshot ───────────────────────────────────────────────────────────

describe('/buyer-snapshot — Public Platform Snapshot', () => {
  let content: string
  beforeAll(() => { content = readFile('app/buyer-snapshot/page.tsx') })

  test('has professional English headline', () => {
    expect(content).toMatch(/corridorwork platform snapshot/i)
  })

  test('uses PublicNavBar', () => {
    expect(content).toContain('PublicNavBar')
  })

  test('uses PublicFooter', () => {
    expect(content).toContain('PublicFooter')
  })

  test('does NOT expose "CWO Operating System" label', () => {
    expect(content).not.toContain('CWO Operating System')
  })

  test('does NOT expose "Admin Tools: Revenue Inbox, Accelerator, CWO CC"', () => {
    expect(content).not.toContain('Revenue Inbox, Accelerator, CWO CC')
    expect(content).not.toContain('CWO CC')
  })

  test('does NOT expose "Autonomous Revenue OS"', () => {
    expect(content).not.toContain('Autonomous Revenue OS')
    expect(content).not.toContain('Autonomous Revenue Operating System')
  })

  test('does NOT use "Revenue-Pfade (4 aktiv)" as a section heading', () => {
    expect(content).not.toContain('💰 Revenue-Pfade (4 aktiv)')
  })

  test('has compliance configuration section', () => {
    // Phase 1: env-vars table removed. Section is now "Compliance configuration" with readable items.
    expect(content.toLowerCase()).toContain('compliance configuration')
    // Readable compliance items present (no email, no outreach, no payment)
    expect(content.toLowerCase()).toMatch(/no automatic email|no cold outreach|no payment|gdpr/i)
  })

  test('keeps inbound channel identifiers (as route URLs)', () => {
    // Phase 1: Internal type codes (strategic_partner, agency_partner…) replaced with route URLs
    expect(content).toContain('/strategic-partnership')
    expect(content).toContain('/partners')
    expect(content).toContain('/global/employers')
    expect(content).toContain('/market-intelligence')
  })

  test('has inbound-first statement', () => {
    expect(content.toLowerCase()).toMatch(/inbound-first|inbound first/i)
  })

  test('links to /strategic-partnership', () => {
    expect(content).toContain('/strategic-partnership')
  })

  test('contains "Pilot stage" or "pilot" disclaimer', () => {
    expect(content.toLowerCase()).toMatch(/pilot stage|pilot/i)
  })

  test('does NOT contain admin secrets', () => {
    expect(content).not.toContain('SUPABASE_SERVICE_ROLE')
    expect(content).not.toContain('CRON_SECRET')
  })

  test('does NOT promise guaranteed revenue', () => {
    expect(content).not.toContain('€ 1.000.000')
    expect(content).not.toMatch(/guaranteed.*jobs|jobs.*guaranteed/i)
  })
})

// ── /launch ───────────────────────────────────────────────────────────────────

describe('/launch — Professional Overview Page', () => {
  let content: string
  beforeAll(() => { content = readFile('app/launch/page.tsx') })

  test('uses PublicNavBar', () => {
    expect(content).toContain('PublicNavBar')
  })

  test('uses PublicFooter', () => {
    expect(content).toContain('PublicFooter')
  })

  test('has professional headline', () => {
    expect(content).toMatch(/work with corridorwork|get started|corridorwork.*live/i)
  })

  test('does NOT expose "CWO Operating System"', () => {
    expect(content).not.toContain('CWO Operating System')
  })

  test('does NOT expose "Autonomous Revenue OS"', () => {
    expect(content).not.toContain('Autonomous Revenue OS')
  })

  test('does NOT expose "Revenue-Pfade" as section heading', () => {
    expect(content).not.toContain('Revenue-Pfade offen')
  })

  test('links to /strategic-partnership', () => {
    expect(content).toContain('/strategic-partnership')
  })

  test('links to /partners', () => {
    expect(content).toContain('/partners')
  })

  test('links to /pilot/employers', () => {
    // Required by passive-revenue-distribution.test.ts
    expect(content).toContain('/pilot/employers')
  })

  test('links to /market-intelligence', () => {
    // Required by passive-revenue-distribution.test.ts
    expect(content).toContain('/market-intelligence')
  })

  test('links to /demo', () => {
    expect(content).toContain('/demo')
  })

  test('has inbound-first statement', () => {
    expect(content.toLowerCase()).toMatch(/inbound-first|inbound first|inbound.*automatisch/i)
  })

  test('contains inbound-first / no social obligation note', () => {
    // Phase 1: "Kein LinkedIn/WhatsApp nötig" → English "No cold outreach" / "Inbound-first"
    expect(content.toLowerCase()).toMatch(/kein linkedin.*whatsapp nötig|no cold outreach|inbound-first/i)
  })

  test('does NOT have custom internal header (no emoji pill with "Phase 1 Pilot")', () => {
    expect(content).not.toContain('Phase 1 Pilot')
  })

  test('does NOT reference Stripe as active', () => {
    expect(content).not.toContain('stripe aktiv')
    expect(content).not.toContain('stripe.com/pay')
    expect(content).not.toContain('loadStripe')
  })

  test('brand is CorridorWork, not old names', () => {
    expect(content).toContain('CorridorWork')
    expect(content).not.toContain('Global Talent Bridge')
    expect(content).not.toContain('SlotFill')
  })
})

// ── robots.txt ────────────────────────────────────────────────────────────────

describe('robots.txt — Security', () => {
  let content: string
  beforeAll(() => { content = readFile('public/robots.txt') })

  test('robots.txt exists', () => {
    expect(existsSync(join(ROOT, 'public/robots.txt'))).toBe(true)
  })

  test('disallows /admin/', () => {
    expect(content).toContain('Disallow: /admin/')
  })

  test('disallows /api/', () => {
    expect(content).toContain('Disallow: /api/')
  })

  test('disallows /auth/', () => {
    expect(content).toContain('Disallow: /auth/')
  })

  test('allows /global/', () => {
    expect(content).toContain('Allow: /global/')
  })

  test('has sitemap reference', () => {
    expect(content).toContain('Sitemap:')
  })
})

// ── Global brand correctness ──────────────────────────────────────────────────

describe('Brand Correctness — All Rewritten Pages', () => {
  const pages = [
    'app/demo/page.tsx',
    'app/partners/page.tsx',
    'app/partners/PartnersForm.tsx',
    'app/strategic-partnership/page.tsx',
    'app/strategic-partnership/StrategicPartnershipForm.tsx',
    'app/buyer-snapshot/page.tsx',
    'app/launch/page.tsx',
  ]

  for (const rel of pages) {
    test(`${rel} uses CorridorWork brand`, () => {
      const c = readFile(rel)
      expect(c).toContain('CorridorWork')
    })

    test(`${rel} does NOT use old brand names`, () => {
      const c = readFile(rel)
      expect(c).not.toContain('SlotFill')
      expect(c).not.toContain('Global Talent Bridge')
    })

    test(`${rel} does NOT reference Stripe`, () => {
      const c = readFile(rel)
      expect(c.toLowerCase()).not.toContain('loadstripe')
      expect(c.toLowerCase()).not.toContain('stripe.com/pay')
    })
  }
})

// ── No internal terms exposed publicly ────────────────────────────────────────

describe('No Internal Terms on Public Pages', () => {
  const PUBLIC_PAGES = [
    'app/demo/page.tsx',
    'app/partners/page.tsx',
    'app/strategic-partnership/page.tsx',
    'app/launch/page.tsx',
  ]

  const BANNED_INTERNAL_TERMS = [
    'CEO Dashboard',
    'Command Center',
    'Sale Room',
    'Revenue Inbox',
    'Revenue Accelerator',
    'CWO Revenue Operating System',
    'Autonomous Revenue Operating System',
    'Buyer Readiness',
    'Commercial Proof',
    'Distribution Pack',
  ]

  for (const rel of PUBLIC_PAGES) {
    for (const term of BANNED_INTERNAL_TERMS) {
      test(`${rel} does NOT expose internal term "${term}"`, () => {
        const c = readFile(rel)
        expect(c).not.toContain(term)
      })
    }
  }
})

// ── No admin links in public nav ──────────────────────────────────────────────

describe('No Admin Links in Public Navigation', () => {
  test('PublicNavBar does not link to /admin', () => {
    const content = readFile('app/_components/PublicNavBar.tsx')
    expect(content).not.toContain('href="/admin')
    expect(content).not.toContain("href='/admin")
  })

  test('PublicFooter does not link to /admin', () => {
    const content = readFile('app/_components/PublicFooter.tsx')
    expect(content).not.toContain('href="/admin')
    expect(content).not.toContain("href='/admin")
  })

  test('PublicNavBar does not expose "CEO Dashboard"', () => {
    const content = readFile('app/_components/PublicNavBar.tsx')
    expect(content).not.toContain('CEO Dashboard')
  })

  test('PublicNavBar does not expose "Command Center"', () => {
    const content = readFile('app/_components/PublicNavBar.tsx')
    expect(content).not.toContain('Command Center')
  })

  test('PublicNavBar does NOT contain Dashboard button (security)', () => {
    const content = readFile('app/_components/PublicNavBar.tsx')
    // Dashboard links must never appear in the public nav
    expect(content).not.toContain('/candidate/dashboard')
    expect(content).not.toContain('/employer/dashboard')
    expect(content).not.toContain('>Dashboard<')
  })

  test('PublicNavBar does NOT contain Promo Video as nav item', () => {
    const content = readFile('app/_components/PublicNavBar.tsx')
    expect(content).not.toContain('href="/promo-video"')
  })

  test('MobileNavMenu client component exists and has no dashboard links', () => {
    const content = readFile('app/_components/MobileNavMenu.tsx')
    expect(content).toContain("'use client'")
    expect(content).not.toContain('/candidate/dashboard')
    expect(content).not.toContain('/employer/dashboard')
    expect(content).not.toContain('/admin')
  })

  test('middleware.ts protects /dashboard route', () => {
    const content = readFile('middleware.ts')
    expect(content).toContain('/dashboard')
    expect(content).toContain('/admin')
    expect(content).toContain('/candidate')
    expect(content).toContain('/employer')
  })

  test('PublicFooter does not expose internal CWO terms', () => {
    const content = readFile('app/_components/PublicFooter.tsx')
    expect(content).not.toContain('CWO')
    expect(content).not.toContain('Revenue Inbox')
    expect(content).not.toContain('Sale Room')
  })
})
