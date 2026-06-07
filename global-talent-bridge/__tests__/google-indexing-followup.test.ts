/**
 * __tests__/google-indexing-followup.test.ts
 *
 * Tests für den Google Indexing Follow-up Sprint.
 *
 * Prüft:
 * - Alle 6 Prioritäts-URLs in sitemap.ts definiert
 * - /admin/seo-indexing-control enthält Follow-up Block
 * - /admin/cwo-command-center enthält Google Indexing Follow-up Panel
 * - Daily Runner enthält Indexing Follow-up Note
 * - Kein Google API Call
 * - Kein Scraping
 * - Kein Versand, kein Stripe
 * - Admin-Seite geschützt
 * - Marke CorridorWork korrekt
 *
 * Safety: Kein Google API · Kein Scraping · Kein Versand · Kein Stripe
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

// Die 6 Prioritäts-URLs
const PRIORITY_PATHS = [
  '/strategic-partnership',
  '/partners',
  '/pilot/employers',
  '/launch',
  '/buyer-snapshot',
  '/market-intelligence',
]

// ── 1. Sitemap enthält alle 6 Prioritäts-URLs ─────────────────────────────────

describe('Sitemap — alle 6 Prioritäts-URLs enthalten', () => {
  let content: string
  beforeAll(() => { content = readFile('app/sitemap.ts') })

  PRIORITY_PATHS.forEach(path => {
    it(`enthält ${path}`, () => {
      expect(content).toContain(path)
    })
  })

  it('Keine Google API in sitemap.ts', () => {
    expect(content).not.toContain('googleapis.com')
    expect(content).not.toContain('google-indexing-api')
    expect(content).not.toContain('google.auth')
  })
})

// ── 2. /admin/seo-indexing-control — Follow-up Block ─────────────────────────

describe('/admin/seo-indexing-control — Google Indexing Follow-up Block', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/seo-indexing-control/page.tsx') })

  it('existiert als Datei', () => {
    expect(existsSync(join(ROOT, 'app/admin/seo-indexing-control/page.tsx'))).toBe(true)
  })

  it('ist admin-geschützt', () => {
    expect(content).toContain('getCurrentAdminUser')
    expect(content).toContain('redirect(')
  })

  it('enthält "Als Nächstes bei Google manuell indexieren" Block', () => {
    expect(content).toContain('Als Nächstes bei Google manuell indexieren')
  })

  it('enthält FOLLOWUP_URLS_FOR_INDEXING mit allen 6 URLs', () => {
    expect(content).toContain('FOLLOWUP_URLS_FOR_INDEXING')
    PRIORITY_PATHS.forEach(path => {
      expect(content).toContain(path)
    })
  })

  it('enthält Schritt-für-Schritt Anleitung', () => {
    expect(content.toLowerCase()).toMatch(/url kopieren|url.*einfügen|indexierung beantragen/i)
  })

  it('enthält Google Search Console Link', () => {
    expect(content).toContain('search.google.com/search-console')
  })

  it('Status-Badges: Sitemap eingereicht + /demo beantragt', () => {
    expect(content).toContain('Sitemap eingereicht')
    expect(content).toContain('/demo beantragt')
    expect(content).toContain('6 Prioritäts-URLs offen')
  })

  it('Kein Google API Call', () => {
    expect(content).not.toContain('googleapis.com')
    expect(content).not.toContain('google-indexing-api')
    expect(content).not.toContain("import { google }")
    expect(content).not.toContain('google.auth')
  })

  it('Kein Scraping', () => {
    expect(content).not.toContain('cheerio')
    expect(content).not.toContain('puppeteer')
    expect(content).not.toContain('playwright')
  })

  it('Kein Stripe, kein Versand', () => {
    expect(content).not.toContain("from 'stripe'")
    expect(content).not.toContain('nodemailer')
    expect(content).not.toContain('sendEmail(')
  })

  it('Marke CorridorWork (kein alter Name)', () => {
    expect(content).toContain('corridorwork.com')
    expect(content).not.toContain('Global Talent Bridge')
    expect(content).not.toContain('SlotFill')
  })
})

// ── 3. /admin/cwo-command-center — Google Indexing Panel ─────────────────────

describe('/admin/cwo-command-center — Google Indexing Follow-up Panel', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/cwo-command-center/page.tsx') })

  it('enthält Google Indexing Follow-up Panel', () => {
    expect(content).toContain('Google Indexing Follow-up')
  })

  it('zeigt Sitemap eingereicht', () => {
    expect(content.toLowerCase()).toMatch(/sitemap.*eingereicht|sitemap.*bereit/i)
  })

  it('zeigt /demo beantragt', () => {
    expect(content).toContain('/demo')
    expect(content.toLowerCase()).toMatch(/beantragt|demo.*beantragt/i)
  })

  it('zeigt 6 Prioritäts-URLs', () => {
    // Die URLs sind als Inline-Array im Panel definiert — überprüfe die ganze Datei
    expect(content).toContain('/strategic-partnership')
    expect(content).toContain('/partners')
    expect(content).toContain('/launch')
    expect(content).toContain('/buyer-snapshot')
    expect(content).toContain('/pilot/employers')
    expect(content).toContain('/market-intelligence')
  })

  it('verlinkt auf Indexing-Assistent', () => {
    expect(content).toContain('/admin/seo-indexing-control')
  })

  it('Domain bestätigt Status (nicht mehr ausstehend)', () => {
    // Der alte "DNS-Eintrag ausstehend" Badge sollte nicht mehr da sein (oder mindestens bestätigt auch)
    expect(content).toContain('Domain bestätigt')
  })

  it('kein Google API, kein Scraping', () => {
    expect(content).not.toContain('googleapis.com')
    expect(content).not.toContain('cheerio')
  })
})

// ── 4. Daily Runner — Indexing Follow-up Note ────────────────────────────────

describe('Daily Runner — Google Indexing Follow-up Note', () => {
  let content: string
  beforeAll(() => { content = readFile('app/api/cron/cwo-daily-runner/route.ts') })

  it('enthält Google indexing follow-up prepared Note', () => {
    expect(content).toContain('Google indexing follow-up prepared')
  })

  it('enthält "Domain verifiziert: ja"', () => {
    expect(content).toContain('Domain verifiziert: ja')
  })

  it('enthält "Sitemap eingereicht: ja"', () => {
    expect(content).toContain('Sitemap eingereicht: ja')
  })

  it('enthält Prioritäts-URL-Hinweis', () => {
    expect(content).toContain('Prioritäts-URLs offen')
    expect(content).toContain('/strategic-partnership')
  })

  it('kein externer Google API Call in der Note', () => {
    const noteSection = content.slice(
      content.indexOf('Google indexing follow-up prepared'),
      content.indexOf('Google indexing follow-up prepared') + 500
    )
    expect(noteSection).not.toContain('googleapis.com')
    expect(noteSection).not.toContain('fetch(')
    expect(noteSection).not.toContain('axios')
  })

  it('enthält Kein Google API Hinweis', () => {
    const noteSection = content.slice(
      content.indexOf('Google indexing follow-up prepared'),
      content.indexOf('Google indexing follow-up prepared') + 500
    )
    expect(noteSection).toContain('Kein Google API')
  })

  it('Safety-Invarianten unverändert', () => {
    expect(content).toContain('no_email_sent:    true')
    expect(content).toContain('no_auto_outreach: true')
    expect(content).toContain('no_scraping:      true')
  })
})

// ── 5. Safety Invarianten ─────────────────────────────────────────────────────

describe('Safety Invarianten — Indexing Follow-up', () => {
  const files = [
    'app/admin/seo-indexing-control/page.tsx',
    'app/admin/cwo-command-center/page.tsx',
    'app/api/cron/cwo-daily-runner/route.ts',
  ]

  files.forEach(file => {
    it(`${file}: kein Stripe`, () => {
      const c = readFile(file)
      expect(c).not.toContain("from 'stripe'")
      expect(c).not.toContain('loadStripe(')
    })

    it(`${file}: kein Scraping`, () => {
      const c = readFile(file)
      expect(c).not.toContain('cheerio')
      expect(c).not.toContain('puppeteer')
    })

    it(`${file}: kein Google API (googleapis/indexing-api)`, () => {
      const c = readFile(file)
      expect(c).not.toContain('googleapis.com')
      expect(c).not.toContain('google-indexing-api')
    })
  })
})
