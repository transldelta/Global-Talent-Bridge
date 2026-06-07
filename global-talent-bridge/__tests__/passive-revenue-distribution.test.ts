/**
 * __tests__/passive-revenue-distribution.test.ts
 *
 * Tests für den Passive Revenue Distribution Pack.
 *
 * Prüft:
 * - /launch Seite existiert und enthält CorridorWork
 * - /buyer-snapshot Seite existiert und enthält CorridorWork
 * - /admin/distribution-pack ist geschützt
 * - Copy-Texte enthalten CorridorWork, kein alten Brand-Namen
 * - Kein Send-Button, kein Stripe, kein Scraping, kein Outreach
 * - Sitemap enthält /launch und /buyer-snapshot
 * - Footer enthält Links
 * - CWO Command Center zeigt Distribution Ready
 * - Daily Runner enthält distribution links
 *
 * Safety: Kein Versand · Kein Stripe · Kein Scraping · Kein Outreach
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')

function readFile(relPath: string): string {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) throw new Error(`File not found: ${relPath}`)
  return readFileSync(full, 'utf-8')
}

// ── 1. /launch Seite ──────────────────────────────────────────────────────────

describe('/launch Seite', () => {
  let content: string
  beforeAll(() => { content = readFile('app/launch/page.tsx') })

  it('existiert als Datei', () => {
    expect(existsSync(join(ROOT, 'app/launch/page.tsx'))).toBe(true)
  })

  it('enthält CorridorWork (kein alter Brand-Name)', () => {
    expect(content).toContain('CorridorWork')
    expect(content).not.toContain('SlotFill')
    expect(content).not.toContain('GlobalTalentBridge')
    expect(content).not.toContain('Global Talent Bridge')
  })

  it('verlinkt alle 4 Revenue-Pfade', () => {
    expect(content).toContain('/strategic-partnership')
    expect(content).toContain('/partners')
    expect(content).toContain('/pilot/employers')
    expect(content).toContain('/market-intelligence')
  })

  it('verlinkt /demo', () => {
    expect(content).toContain('/demo')
  })

  it('hat kein aktives Formular-Submit für E-Mail-Versand', () => {
    // Kein E-Mail-Submit (CTAs sind nur Links, kein Outreach-Formular)
    expect(content).not.toContain('sendEmail(')
    expect(content).not.toContain('nodemailer')
    expect(content).not.toContain('smtp')
    expect(content).not.toContain('versenden(')
  })

  it('hat kein Stripe-Hinweis als aktiv', () => {
    expect(content).not.toContain('stripe aktiv')
    expect(content).not.toContain('stripe.com/pay')
    expect(content).not.toContain('loadStripe')
  })

  it('hat kein Scraping', () => {
    expect(content).not.toContain('axios.get')
    expect(content).not.toContain('cheerio')
    expect(content).not.toContain('puppeteer')
  })

  it('enthält Sicherheitshinweis (kein Outreach)', () => {
    expect(content.toLowerCase()).toMatch(/kein.*outreach|kein.*versand|kein.*cold/i)
  })

  it('exportiert default function', () => {
    expect(content).toContain('export default function')
  })
})

// ── 2. /buyer-snapshot Seite ──────────────────────────────────────────────────

describe('/buyer-snapshot Seite', () => {
  let content: string
  beforeAll(() => { content = readFile('app/buyer-snapshot/page.tsx') })

  it('existiert als Datei', () => {
    expect(existsSync(join(ROOT, 'app/buyer-snapshot/page.tsx'))).toBe(true)
  })

  it('enthält CorridorWork', () => {
    expect(content).toContain('CorridorWork')
  })

  it('enthält Live-Assets Übersicht', () => {
    expect(content).toContain('Live')
    expect(content).toContain('corridorwork.com')
  })

  it('enthält alle 4 Revenue-Pfade', () => {
    expect(content).toContain('strategic_partner')
    expect(content).toContain('agency_partner')
    expect(content).toContain('employer_pilot')
    expect(content).toContain('market_intelligence')
  })

  it('enthält Compliance/Safety-Sektion', () => {
    expect(content.toLowerCase()).toMatch(/compliance|safety|sicherheit/i)
    expect(content).toContain('EMAIL_PROVIDER')
    expect(content).toContain('none')
  })

  it('enthält kein erfundenes Umsatzversprechen', () => {
    // Seite darf Dinge als NICHT aktiv erwähnen ("Keine Jobgarantie"),
    // aber darf sie nicht positiv versprechen
    expect(content).not.toContain('€ 1.000.000')
    expect(content).not.toContain('€1.000.000')
    expect(content).not.toMatch(/garantierte.*jobs|jobs.*garantiert/i)
    expect(content).not.toMatch(/visa.*garantiert|garantierte.*visa/i)
  })

  it('enthält Phase 1 Disclaimer', () => {
    expect(content.toLowerCase()).toMatch(/phase 1|pilot/i)
  })

  it('hat CTA zu /strategic-partnership', () => {
    expect(content).toContain('/strategic-partnership')
  })

  it('enthält keine Admin-Secrets', () => {
    expect(content).not.toContain('SUPABASE_SERVICE_ROLE')
    expect(content).not.toContain('CRON_SECRET')
    expect(content).not.toContain('getCurrentAdminUser')
  })
})

// ── 3. /admin/distribution-pack Seite ────────────────────────────────────────

describe('/admin/distribution-pack Seite', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/distribution-pack/page.tsx') })

  it('existiert als Datei', () => {
    expect(existsSync(join(ROOT, 'app/admin/distribution-pack/page.tsx'))).toBe(true)
  })

  it('ist admin-geschützt (getCurrentAdminUser + redirect)', () => {
    expect(content).toContain('getCurrentAdminUser')
    expect(content).toContain('redirect(')
    expect(content).toContain('/auth/login')
  })

  it('hat force-dynamic', () => {
    expect(content).toContain("force-dynamic")
  })

  it('hat keinen aktiven E-Mail-Send-Button', () => {
    expect(content).not.toContain('sendmail')
    expect(content).not.toContain('smtp')
    expect(content).not.toContain('sendEmail(')
    // Kein submit-Button für E-Mail-Outreach
    expect(content).not.toMatch(/type="submit".*outreach/i)
  })

  it('enthält Copy-Texte mit CorridorWork', () => {
    expect(content).toContain('CorridorWork')
  })

  it('hat keine alten Brand-Namen', () => {
    expect(content).not.toContain('SlotFill')
    expect(content).not.toContain('GlobalTalentBridge')
    expect(content).not.toContain('Global Talent Bridge')
  })

  it('verlinkt /launch und /buyer-snapshot', () => {
    expect(content).toContain('/launch')
    expect(content).toContain('/buyer-snapshot')
  })

  it('enthält alle wichtigen Distribution-Formate', () => {
    expect(content).toContain('1-Satz Pitch')
    expect(content).toContain('3-Satz Pitch')
    expect(content).toContain('30-Sekunden Pitch')
    expect(content).toContain('LinkedIn Post')
    // WhatsApp-Label kann "WhatsApp Status" oder "WhatsApp Business Status" sein
    expect(content.toLowerCase()).toContain('whatsapp')
    expect(content).toContain('Marketplace')
  })
})

// ── 4. DistributionPackClient — Kopieren-Buttons ──────────────────────────────

describe('DistributionPackClient — Copy-Buttons', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/distribution-pack/_components/DistributionPackClient.tsx') })

  it('existiert als Datei', () => {
    expect(existsSync(join(ROOT, 'app/admin/distribution-pack/_components/DistributionPackClient.tsx'))).toBe(true)
  })

  it('ist use client', () => {
    expect(content).toContain("'use client'")
  })

  it('hat Kopieren-Button (kein aktiver Send-Button)', () => {
    expect(content.toLowerCase()).toContain('kopier')
    expect(content).not.toContain('sendmail')
    expect(content).not.toContain('sendEmail(')
    // Kein submit-Handler für E-Mail-Versand
    expect(content).not.toMatch(/onSubmit.*send/i)
  })

  it('verwendet clipboard API (kein Email-Send)', () => {
    expect(content).toContain('clipboard')
    expect(content).not.toContain('fetch(')
    expect(content).not.toContain('sendEmail')
    expect(content).not.toContain('nodemailer')
  })

  it('enthält Safety-Banner', () => {
    expect(content.toLowerCase()).toMatch(/kein.*send|kein.*outreach|kein.*versand/i)
  })
})

// ── 5. Sitemap enthält /launch und /buyer-snapshot ───────────────────────────

describe('Sitemap — Distribution Pages', () => {
  let content: string
  beforeAll(() => { content = readFile('app/sitemap.ts') })

  it('/launch ist in der Sitemap', () => {
    expect(content).toContain('/launch')
  })

  it('/buyer-snapshot ist in der Sitemap', () => {
    expect(content).toContain('/buyer-snapshot')
  })

  it('/launch hat priority >= 0.80', () => {
    const launchSection = content.slice(content.indexOf('/launch') - 50, content.indexOf('/launch') + 200)
    expect(launchSection).toMatch(/priority:\s*0\.[89][05]/)
  })

  it('/buyer-snapshot hat priority >= 0.75', () => {
    const snapshotSection = content.slice(content.indexOf('/buyer-snapshot') - 50, content.indexOf('/buyer-snapshot') + 200)
    expect(snapshotSection).toMatch(/priority:\s*0\.[789]/)
  })
})

// ── 6. Footer enthält Distribution-Links ─────────────────────────────────────

describe('PublicFooter — Distribution Links', () => {
  let content: string
  beforeAll(() => { content = readFile('app/_components/PublicFooter.tsx') })

  it('enthält /launch Link', () => {
    expect(content).toContain('href="/launch"')
  })

  it('enthält /buyer-snapshot Link', () => {
    expect(content).toContain('href="/buyer-snapshot"')
  })

  it('enthält /strategic-partnership Link', () => {
    expect(content).toContain('href="/strategic-partnership"')
  })

  it('enthält /partners Link', () => {
    expect(content).toContain('href="/partners"')
  })
})

// ── 7. CWO Command Center — Distribution Ready Panel ─────────────────────────

describe('CWO Command Center — Passive Distribution Panel', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/cwo-command-center/page.tsx') })

  it('enthält Distribution Ready Panel', () => {
    expect(content.toLowerCase()).toMatch(/passive distribution ready/i)
  })

  it('verlinkt /admin/distribution-pack', () => {
    expect(content).toContain('/admin/distribution-pack')
  })

  it('zeigt /launch als live', () => {
    expect(content).toContain('/launch')
  })

  it('zeigt /buyer-snapshot als live', () => {
    expect(content).toContain('/buyer-snapshot')
  })

  it('enthält nächsten sicheren Schritt Hinweis', () => {
    expect(content.toLowerCase()).toMatch(/launch-link.*profil|bio|status/i)
  })
})

// ── 8. Daily Runner — Distribution Links ─────────────────────────────────────

describe('Daily Runner — Distribution Links', () => {
  let content: string
  beforeAll(() => { content = readFile('app/api/cron/cwo-daily-runner/route.ts') })

  it('enthält distribution links ready im worklog', () => {
    expect(content).toContain('Distribution links ready')
  })

  it('enthält top buyer link /buyer-snapshot', () => {
    expect(content).toContain('/buyer-snapshot')
  })

  it('enthält top public link /strategic-partnership', () => {
    expect(content).toContain('top public link: /strategic-partnership')
  })

  it('enthält top employer link /pilot/employers', () => {
    expect(content).toContain('/pilot/employers')
  })

  it('distributionLinks im Response hat passiveOnly: true', () => {
    expect(content).toContain('passiveOnly')
    expect(content).toContain('true')
  })

  it('kein externer API-Call in distribution', () => {
    // Distribution ist rein intern — kein fetch zu externen URLs
    const distributionSection = content.slice(content.indexOf('Distribution links ready'), content.indexOf('distributionLinks') + 300)
    expect(distributionSection).not.toMatch(/fetch\(['"]http/)
    expect(distributionSection).not.toContain('axios')
  })
})

// ── 9. Safety Invarianten — Distribution Pack ────────────────────────────────

describe('Safety Invarianten — Passive Distribution', () => {
  const files = [
    'app/launch/page.tsx',
    'app/buyer-snapshot/page.tsx',
    'app/admin/distribution-pack/page.tsx',
    'app/admin/distribution-pack/_components/DistributionPackClient.tsx',
  ]

  files.forEach(file => {
    it(`${file}: kein nodemailer/SMTP/sendEmail`, () => {
      const c = readFile(file)
      expect(c).not.toContain('nodemailer')
      expect(c).not.toContain('smtp')
      expect(c).not.toContain('sendEmail')
      expect(c).not.toContain('transporter.send')
    })

    it(`${file}: kein Stripe-Import`, () => {
      const c = readFile(file)
      expect(c).not.toContain("from 'stripe'")
      expect(c).not.toContain("from '@stripe/stripe-js'")
      expect(c).not.toContain('loadStripe(')
    })

    it(`${file}: kein Scraping`, () => {
      const c = readFile(file)
      expect(c).not.toContain('cheerio')
      expect(c).not.toContain('puppeteer')
      expect(c).not.toContain('playwright')
    })
  })

  it('PASSIVE_REVENUE_DISTRIBUTION_PACK.md existiert', () => {
    expect(existsSync(join(ROOT, 'docs/PASSIVE_REVENUE_DISTRIBUTION_PACK.md'))).toBe(true)
  })

  it('Docs erwähnen kein Cold-Outreach', () => {
    const doc = readFile('docs/PASSIVE_REVENUE_DISTRIBUTION_PACK.md')
    expect(doc.toLowerCase()).toMatch(/kein.*cold-outreach|kein.*spam/i)
  })

  it('Docs bestätigen EMAIL_PROVIDER=none', () => {
    const doc = readFile('docs/PASSIVE_REVENUE_DISTRIBUTION_PACK.md')
    expect(doc).toContain('EMAIL_PROVIDER')
    expect(doc).toContain('none')
  })
})

// ── import needed for beforeAll ───────────────────────────────────────────────
import { beforeAll } from 'vitest'
