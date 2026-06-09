import { describe, test, expect, beforeAll } from 'vitest'
/**
 * CorridorWork — Homepage Trust Redesign Tests
 * Verifies the professional redesign: clean structure, correct language,
 * no fake promises, proper audience separation, mobile-ready.
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')
const PAGE  = join(ROOT, 'app/page.tsx')
const NAV   = join(ROOT, 'app/_components/PublicNavBar.tsx')
const FOOTER = join(ROOT, 'app/_components/PublicFooter.tsx')
const LICENSE = join(ROOT, 'docs/design/HOMEPAGE_VISUAL_LICENSE_NOTES.md')

const page   = readFileSync(PAGE, 'utf8')
const nav    = readFileSync(NAV, 'utf8')
const footer = readFileSync(FOOTER, 'utf8')

// ── Hero language ────────────────────────────────────────────────────────────
describe('Homepage — Hero language (no cheap promises)', () => {
  test('does NOT contain "kostenlos starten" (case insensitive)', () => {
    expect(page.toLowerCase()).not.toContain('kostenlos starten')
  })

  test('does NOT contain "keine kreditkarte" (case insensitive)', () => {
    expect(page.toLowerCase()).not.toContain('keine kreditkarte')
  })

  test('does NOT contain "no credit card" (case insensitive)', () => {
    expect(page.toLowerCase()).not.toContain('no credit card')
  })

  test('does NOT contain "automatisch kostenlos"', () => {
    expect(page.toLowerCase()).not.toContain('automatisch kostenlos')
  })

  test('does NOT contain "Jetzt kostenlos starten"', () => {
    expect(page).not.toContain('Jetzt kostenlos starten')
  })

  test('does NOT contain "Keine Kreditkarte. Kein Risiko."', () => {
    expect(page).not.toContain('Keine Kreditkarte. Kein Risiko.')
  })

  test('contains professional hero headline about global talent corridors', () => {
    expect(page).toMatch(/global talent corridors/i)
  })

  test('contains the CorridorWork platform subheadline', () => {
    // New subheadline: "CorridorWork helps employers, candidates and partners structure
    // international workforce interest across sectors, regions and talent corridors."
    expect(page).toMatch(/structure.*international.*workforce|organize.*global.*talent.*interest/i)
  })
})

// ── Audience split ────────────────────────────────────────────────────────────
describe('Homepage — Audience split (Employers / Candidates / Partners)', () => {
  test('contains employer pathway link to /global/employers', () => {
    expect(page).toContain('/global/employers')
  })

  test('contains candidate pathway link to /global/candidates', () => {
    expect(page).toContain('/global/candidates')
  })

  test('contains partner pathway link to /strategic-partnership', () => {
    expect(page).toContain('/strategic-partnership')
  })

  test('contains "For Employers" section heading', () => {
    expect(page).toMatch(/For Employers/i)
  })

  test('contains "For Candidates" section heading', () => {
    expect(page).toMatch(/For Candidates/i)
  })

  test('contains "For Partners" section heading', () => {
    expect(page).toMatch(/For Partners/i)
  })

  test('contains three clear audience CTAs: employer, candidate, partner', () => {
    // Hero CTAs: "For employers" and "For candidates" — partner CTA in audience cards
    expect(page).toMatch(/For employers/i)
    expect(page).toMatch(/For candidates/i)
    expect(page).toMatch(/For Partners/i)
  })
})

// ── No fake guarantees ────────────────────────────────────────────────────────
describe('Homepage — No false promises', () => {
  test('does NOT contain "job guarantee" as a promise', () => {
    // The page may contain "No employment guarantee" which is fine
    // But should not contain "job guarantee" as a positive claim
    const noGuaranteeMatches = page.match(/no (?:job|employment) guarantee/gi) || []
    const positiveGuarantee = page.match(/(?:^|\W)guaranteed job|job (?:is )?guaranteed/gi) || []
    expect(positiveGuarantee).toHaveLength(0)
    // And it should explicitly state the disclaimer
    expect(page).toMatch(/no employment guarantee|no job guarantee/i)
  })

  test('does NOT contain "visa guarantee" as a positive promise', () => {
    const positiveVisa = page.match(/visa (?:is )?guaranteed|guaranteed visa/gi) || []
    expect(positiveVisa).toHaveLength(0)
    expect(page).toMatch(/no visa guarantee/i)
  })

  test('does NOT contain "100% success" or "instant placement"', () => {
    expect(page.toLowerCase()).not.toContain('100% success')
    expect(page.toLowerCase()).not.toContain('instant placement')
  })

  test('does NOT contain "wir garantieren" (German guarantee)', () => {
    expect(page.toLowerCase()).not.toContain('wir garantieren')
  })

  test('does NOT contain "du bekommst Job"', () => {
    expect(page.toLowerCase()).not.toContain('du bekommst job')
  })
})

// ── No Fake Revenue / Stripe / Scraping ──────────────────────────────────────
describe('Homepage — No fake revenue, no Stripe, no scraping', () => {
  test('does NOT contain Stripe references on homepage', () => {
    expect(page.toLowerCase()).not.toContain('stripe')
  })

  test('does NOT contain fake revenue or fake customer claims', () => {
    // Check for specific misleading phrases (not the word "fake" in general, which may appear in comments)
    expect(page.toLowerCase()).not.toContain('fake revenue')
    expect(page.toLowerCase()).not.toContain('fake clients')
    expect(page.toLowerCase()).not.toContain('fake umsatz')
    expect(page.toLowerCase()).not.toContain('1m talents')
    expect(page.toLowerCase()).not.toContain('1 million customers')
  })

  test('does NOT contain scraping references', () => {
    expect(page.toLowerCase()).not.toContain('scraping')
    expect(page.toLowerCase()).not.toContain('google api')
  })
})

// ── Old overloaded sections removed ──────────────────────────────────────────
describe('Homepage — Old overloaded content removed', () => {
  test('does NOT show "Aktueller MVP-Status" section publicly', () => {
    expect(page).not.toContain('Aktueller MVP-Status')
  })

  test('does NOT contain excessive emoji navigation (rockets, targets)', () => {
    // Page should not have inline rocket emoji in text blocks
    expect(page).not.toMatch(/🚀.*Pilot anfragen/)
    expect(page).not.toMatch(/🚀.*starten/)
  })

  test('does NOT have "Kostenlos für Kandidaten" feature card', () => {
    expect(page).not.toContain('Kostenlos für Kandidaten')
  })

  test('does NOT show "So funktioniert das Matching" section', () => {
    expect(page).not.toContain('So funktioniert das Matching')
  })

  test('does NOT show old German "Das Problem" section heading', () => {
    expect(page).not.toContain('>Das Problem<')
  })
})

// ── Brand correctness ─────────────────────────────────────────────────────────
describe('Homepage — Brand correctness', () => {
  test('uses CorridorWork brand name', () => {
    expect(page).toContain('CorridorWork')
  })

  test('does NOT use old brand names (SlotFill, Global Talent Bridge)', () => {
    expect(page).not.toContain('SlotFill')
    expect(page).not.toContain('Global Talent Bridge')
  })

  test('metadata title is professional and in English', () => {
    expect(page).toMatch(/CorridorWork.*Global Talent Corridors/i)
  })

  test('metadata locale is en_US (not de_DE)', () => {
    expect(page).toContain("locale: 'en_US'")
  })
})

// ── Trust & compliance section ────────────────────────────────────────────────
describe('Homepage — Trust & Compliance section', () => {
  test('contains "No employment guarantee" compliance item', () => {
    expect(page).toContain('No employment guarantee')
  })

  test('contains "No visa guarantee" compliance item', () => {
    expect(page).toContain('No visa guarantee')
  })

  test('contains "No automatic outreach" compliance item', () => {
    expect(page).toContain('No automatic outreach')
  })

  test('contains "Consent-based inbound interest"', () => {
    expect(page).toContain('Consent-based inbound interest')
  })

  test('contains "Admin-reviewed workflows"', () => {
    expect(page).toContain('Admin-reviewed workflows')
  })
})

// ── Buyer / Partner section ───────────────────────────────────────────────────
describe('Homepage — Buyer / Partner section', () => {
  test('contains buyer snapshot link', () => {
    expect(page).toContain('/buyer-snapshot')
  })

  test('contains demo sandbox link', () => {
    expect(page).toContain('/demo/sandbox')
  })

  test('does NOT contain promo video link (removed — no audio track, not sale-ready)', () => {
    expect(page).not.toContain('/promo-video')
  })

  test('contains structured/acquisition framing for buyers section', () => {
    // The buyer section no longer uses "SaaS asset" framing — it uses structured corridor language.
    // Verify the buyer access bar is still present and accessible.
    expect(page).toContain('/buyer-snapshot')
    expect(page).toContain('For buyers')
  })
})

// ── Navigation ────────────────────────────────────────────────────────────────
describe('Navigation — Simplified professional nav', () => {
  test('nav contains Employers link', () => {
    expect(nav).toContain('/global/employers')
  })

  test('nav contains Candidates link', () => {
    expect(nav).toContain('/global/candidates')
  })

  test('nav contains Partners link', () => {
    expect(nav).toContain('/strategic-partnership')
  })

  test('nav contains Demo link', () => {
    expect(nav).toContain('/demo/sandbox')
  })

  test('nav does NOT have Promo Video as a nav item (removed — no audio track)', () => {
    // Promo Video is not linked from public nav (no voiceover ready).
    expect(nav).not.toContain("href=\"/promo-video\"")
  })

  test('nav does NOT show Dashboard button publicly (security)', () => {
    // The Dashboard button must NEVER appear in the public nav.
    // Internal dashboards are accessible only via direct authenticated URL.
    expect(nav).not.toContain('/candidate/dashboard')
    expect(nav).not.toContain('/employer/dashboard')
    expect(nav).not.toContain('>Dashboard<')
  })

  test('nav does NOT have emoji-heavy text like "🚀 Pilot anfragen"', () => {
    expect(nav).not.toContain('🚀 Pilot anfragen')
  })

  test('nav does NOT have "Market Intelligence" visible nav item', () => {
    expect(nav).not.toContain('/market-intelligence')
  })
})

// ── Footer ────────────────────────────────────────────────────────────────────
describe('Footer — Clean 4-column structure', () => {
  test('footer has Platform column with Employers link', () => {
    expect(footer).toContain('/global/employers')
  })

  test('footer has Platform column with Candidates link', () => {
    expect(footer).toContain('/global/candidates')
  })

  test('footer has Partners column with Strategic Partnership', () => {
    expect(footer).toContain('/strategic-partnership')
  })

  test('footer has Partners column with Buyer Snapshot', () => {
    expect(footer).toContain('/buyer-snapshot')
  })

  test('footer has Legal column with Datenschutz', () => {
    expect(footer).toContain('/legal/datenschutz')
  })

  test('footer has Legal column with Impressum', () => {
    expect(footer).toContain('/legal/impressum')
  })

  test('footer has Legal column with AGB', () => {
    expect(footer).toContain('/legal/agb')
  })

  test('footer Status column has "No job guarantee"', () => {
    expect(footer).toContain('No job guarantee')
  })

  test('footer Status column has "No visa guarantee"', () => {
    expect(footer).toContain('No visa guarantee')
  })

  test('footer Status column has "Inbound-first"', () => {
    expect(footer).toContain('Inbound-first')
  })

  test('footer does NOT show "Zahlungen noch nicht aktiv · Keine echten E-Mails" warning banner', () => {
    expect(footer).not.toContain('Zahlungen noch nicht aktiv')
  })
})

// ── Images / Assets ───────────────────────────────────────────────────────────
describe('Homepage — Real images in public/images/home/', () => {
  const IMAGES_DIR = join(ROOT, 'public/images/home')

  test('hero-global-talent.jpg exists', () => {
    expect(existsSync(join(IMAGES_DIR, 'hero-global-talent.jpg'))).toBe(true)
  })

  test('employers-section.jpg exists', () => {
    expect(existsSync(join(IMAGES_DIR, 'employers-section.jpg'))).toBe(true)
  })

  test('candidates-section.jpg exists', () => {
    expect(existsSync(join(IMAGES_DIR, 'candidates-section.jpg'))).toBe(true)
  })

  test('partners-section.jpg exists', () => {
    expect(existsSync(join(IMAGES_DIR, 'partners-section.jpg'))).toBe(true)
  })

  test('global-corridors-map.jpg exists', () => {
    expect(existsSync(join(IMAGES_DIR, 'global-corridors-map.jpg'))).toBe(true)
  })

  test('all images are non-empty (>10KB)', () => {
    const { statSync } = require('fs')
    for (const name of [
      'hero-global-talent.jpg',
      'employers-section.jpg',
      'candidates-section.jpg',
      'partners-section.jpg',
      'global-corridors-map.jpg',
    ]) {
      const size = statSync(join(IMAGES_DIR, name)).size
      expect(size).toBeGreaterThan(10_000)
    }
  })

  test('page.tsx uses next/image Image component', () => {
    expect(page).toContain("import Image from 'next/image'")
  })

  test('page.tsx references hero-global-talent.jpg', () => {
    expect(page).toContain('hero-global-talent.jpg')
  })

  test('page.tsx has priority prop on hero image', () => {
    expect(page).toContain('priority')
  })
})

// ── Hero split-layout ─────────────────────────────────────────────────────────
describe('Homepage — Split-layout hero (promo video links removed)', () => {
  test('homepage does NOT link to /promo-video (removed — no audio track, not sale-ready)', () => {
    expect(page).not.toContain('/promo-video')
  })

  test('homepage does not use "Watch the overview" or "Watch 60-second overview"', () => {
    expect(page).not.toContain('Watch the overview')
    expect(page).not.toContain('Watch 60-second overview')
  })

  test('hero uses split layout (image as right panel, not full-bleed background)', () => {
    // The image panel div must be hidden on mobile (hidden lg:block)
    // and the text panel must NOT have the image behind it
    expect(page).toContain('hidden lg:block')
  })

  test('hero does NOT have full-bleed text-over-image overlay (no bg-slate-950/72)', () => {
    // The old hero had a dark overlay over a full-bleed image with text on top.
    // The new hero keeps image strictly in a right-side panel.
    expect(page).not.toContain('bg-slate-950/72')
  })

  test('hero new headline is present', () => {
    // New premium enterprise headline — clear, direct, no AI fluff
    expect(page).toContain('Connect employer demand with qualified international talent.')
  })
})

// ── Security — no admin or dashboard links in page ────────────────────────────
describe('Homepage — No admin / dashboard links exposed', () => {
  test('page does NOT link to /admin', () => {
    expect(page).not.toMatch(/href="\/admin/)
    expect(page).not.toMatch(/href='\/admin/)
  })

  test('page does NOT link to /candidate/dashboard or /employer/dashboard', () => {
    expect(page).not.toContain('/candidate/dashboard')
    expect(page).not.toContain('/employer/dashboard')
  })

  test('page does NOT expose Dashboard button', () => {
    expect(page).not.toMatch(/>Dashboard</)
  })
})

// ── License notes ─────────────────────────────────────────────────────────────
describe('Homepage Visual License Notes', () => {
  test('license notes file exists', () => {
    expect(existsSync(LICENSE)).toBe(true)
  })

  test('license notes references Pexels Free License', () => {
    const notes = readFileSync(LICENSE, 'utf8')
    expect(notes).toContain('pexels.com/license')
  })

  test('license notes documents all 5 image files', () => {
    const notes = readFileSync(LICENSE, 'utf8')
    expect(notes).toContain('hero-global-talent.jpg')
    expect(notes).toContain('employers-section.jpg')
    expect(notes).toContain('candidates-section.jpg')
    expect(notes).toContain('partners-section.jpg')
    expect(notes).toContain('global-corridors-map.jpg')
  })

  test('license notes contain Pexels photo IDs', () => {
    const notes = readFileSync(LICENSE, 'utf8')
    expect(notes).toContain('3182812')
    expect(notes).toContain('3184465')
  })

  test('license notes confirm no employment/visa outcome claims', () => {
    const notes = readFileSync(LICENSE, 'utf8')
    expect(notes).toMatch(/no image implies/i)
  })
})
