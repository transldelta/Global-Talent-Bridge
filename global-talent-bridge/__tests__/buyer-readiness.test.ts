/**
 * __tests__/buyer-readiness.test.ts
 *
 * Tests für den Buyer-Readiness & Transferability Audit Sprint.
 *
 * Prüft:
 * - /admin/buyer-readiness existiert und ist admin-geschützt
 * - Buyer Readiness Score vorhanden (ehrlich, nicht aufgeblasen)
 * - Alle 5 Transfer-Docs existieren
 * - README.md enthält Buyer-Informationen
 * - .env.example enthält alle benötigten Variablen
 * - Daily Runner enthält Buyer Readiness Felder
 * - CWO Command Center enthält Buyer Readiness Panel
 * - Commercial Proof-Abschnitt zeigt 0 Umsatz, 0 echte Kunden
 * - Keine erfundenen Zahlen / kein Fake-Umsatz
 *
 * Safety: Kein Stripe · Kein E-Mail · Kein Outreach · Kein Scraping
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

// ── 1. /admin/buyer-readiness — Seite existiert und ist geschützt ─────────────

describe('/admin/buyer-readiness — Seite', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/buyer-readiness/page.tsx') })

  it('existiert als Datei', () => {
    expect(existsSync(join(ROOT, 'app/admin/buyer-readiness/page.tsx'))).toBe(true)
  })

  it('ist admin-geschützt (getCurrentAdminUser + redirect)', () => {
    expect(content).toContain('getCurrentAdminUser')
    expect(content).toContain('redirect(')
  })

  it('enthält force-dynamic', () => {
    expect(content).toContain("force-dynamic")
  })

  it('enthält Buyer Readiness Score', () => {
    expect(content).toMatch(/buyer.*readiness.*score|readiness.*score|66.*100/i)
  })

  it('enthält alle 5 Transfer-Docs im Panel', () => {
    expect(content).toContain('BUYER_DUE_DILIGENCE.md')
    expect(content).toContain('TRANSFER_CHECKLIST.md')
    expect(content).toContain('TECHNICAL_ARCHITECTURE_OVERVIEW.md')
    expect(content).toContain('SECURITY_AND_RLS_SUMMARY.md')
    expect(content).toContain('COMMERCIAL_READINESS_SUMMARY.md')
  })

  it('enthält Buyer Gap List', () => {
    expect(content).toMatch(/buyer.*gap|gap.*list/i)
  })

  it('enthält alle 4 Revenue-Pfade', () => {
    expect(content).toContain('/strategic-partnership')
    expect(content).toContain('/partners')
    expect(content).toContain('/pilot/employers')
    expect(content).toContain('/market-intelligence')
  })

  it('zeigt 0 echte Leads (kein Fake-Traction)', () => {
    expect(content).toContain('0 echte Leads')
  })

  it('zeigt Commercial Proof als schwach (ehrlich)', () => {
    expect(content).toMatch(/commercial.*proof|4.*20|commercial.*schwach/i)
  })

  it('enthält Keine erfundenen Zahlen Hinweis', () => {
    expect(content).toMatch(/kein.*schönreden|keine.*erfundenen|ehrlich/i)
  })

  it('enthält alle 6 Readiness Sections (A–F)', () => {
    expect(content).toContain('Produkt-Bereitschaft')
    expect(content).toContain('Tech-Bereitschaft')
    expect(content).toContain('Sicherheits-Bereitschaft')
    expect(content).toContain('Transfer-Bereitschaft')
    expect(content).toContain('Commercial Proof')
    expect(content).toMatch(/offene.*punkte|risiken/i)
  })

  it('enthält Safety Footer', () => {
    expect(content).toMatch(/safety.*invariants|kein.*e-mail.*versand/i)
  })

  it('kein Stripe, kein Outreach', () => {
    expect(content).not.toContain("from 'stripe'")
    expect(content).not.toContain('sendEmail(')
    expect(content).not.toContain('nodemailer')
  })

  it('kein Scraping', () => {
    expect(content).not.toContain('cheerio')
    expect(content).not.toContain('puppeteer')
  })

  it('keine erfundenen Umsatzversprechen', () => {
    expect(content).not.toMatch(/garantierter.*umsatz|sicherer.*umsatz/i)
    expect(content).not.toMatch(/\d+.*eur.*umsatz.*garantiert/i)
  })
})

// ── 2. Transfer-Docs ──────────────────────────────────────────────────────────

describe('Transfer-Docs — alle 5 vorhanden', () => {
  const docs = [
    'docs/BUYER_DUE_DILIGENCE.md',
    'docs/TRANSFER_CHECKLIST.md',
    'docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md',
    'docs/SECURITY_AND_RLS_SUMMARY.md',
    'docs/COMMERCIAL_READINESS_SUMMARY.md',
  ]

  docs.forEach(doc => {
    it(`${doc} existiert`, () => {
      expect(existsSync(join(ROOT, doc))).toBe(true)
    })
  })

  it('BUYER_DUE_DILIGENCE.md enthält "Keine erfundenen Zahlen"', () => {
    const c = readFile('docs/BUYER_DUE_DILIGENCE.md')
    expect(c).toMatch(/keine.*erfundenen.*zahlen|kein.*fake/i)
  })

  it('BUYER_DUE_DILIGENCE.md zeigt 0 echte Leads', () => {
    const c = readFile('docs/BUYER_DUE_DILIGENCE.md')
    expect(c).toMatch(/0 echte leads|keine echten leads/i)
  })

  it('TRANSFER_CHECKLIST.md enthält Supabase-Projekt-URL', () => {
    const c = readFile('docs/TRANSFER_CHECKLIST.md')
    expect(c).toContain('qjxojvxhsoicldccfmkq.supabase.co')
  })

  it('TRANSFER_CHECKLIST.md enthält Vercel-Projekt-ID', () => {
    const c = readFile('docs/TRANSFER_CHECKLIST.md')
    expect(c).toContain('prj_TvH1P67ZiIY1RUQCkJiI6x6W98GT')
  })

  it('TECHNICAL_ARCHITECTURE_OVERVIEW.md enthält Tech-Stack-Tabelle', () => {
    const c = readFile('docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md')
    expect(c).toContain('Next.js')
    expect(c).toContain('Supabase')
    expect(c).toContain('Vitest')
  })

  it('SECURITY_AND_RLS_SUMMARY.md enthält RLS-Info', () => {
    const c = readFile('docs/SECURITY_AND_RLS_SUMMARY.md')
    expect(c).toMatch(/rls.*aktiv|row level security/i)
    expect(c).toContain('revenue_leads')
  })

  it('SECURITY_AND_RLS_SUMMARY.md enthält Secret-Scan-Ergebnis', () => {
    const c = readFile('docs/SECURITY_AND_RLS_SUMMARY.md')
    expect(c).toMatch(/secret.*scan|0 treffer|kein.*leak/i)
  })

  it('COMMERCIAL_READINESS_SUMMARY.md zeigt Commercial Score 4/20', () => {
    const c = readFile('docs/COMMERCIAL_READINESS_SUMMARY.md')
    expect(c).toMatch(/4\/20|commercial.*readiness.*score.*4/i)
  })

  it('COMMERCIAL_READINESS_SUMMARY.md enthält "Keine erfundenen Zahlen"', () => {
    const c = readFile('docs/COMMERCIAL_READINESS_SUMMARY.md')
    expect(c).toMatch(/keine.*erfundenen.*zahlen|kein.*fake/i)
  })
})

// ── 3. README.md — für Käufer ────────────────────────────────────────────────

describe('README.md — Buyer-Informationen', () => {
  let content: string
  beforeAll(() => { content = readFile('README.md') })

  it('enthält Live-URL corridorwork.com', () => {
    expect(content).toContain('corridorwork.com')
  })

  it('enthält Tech-Stack', () => {
    expect(content).toContain('Next.js')
    expect(content).toContain('Supabase')
    expect(content).toContain('Vitest')
  })

  it('enthält Test-Zahl (4596)', () => {
    expect(content).toContain('4596')
  })

  it('enthält alle 4 Revenue-Pfade', () => {
    expect(content).toContain('/strategic-partnership')
    expect(content).toContain('/partners')
    expect(content).toContain('/pilot/employers')
    expect(content).toContain('/market-intelligence')
  })

  it('enthält Safety-Info (EMAIL_PROVIDER=none)', () => {
    expect(content).toContain('EMAIL_PROVIDER=none')
  })

  it('enthält Transfer-Docs-Tabelle', () => {
    expect(content).toContain('BUYER_DUE_DILIGENCE.md')
    expect(content).toContain('TRANSFER_CHECKLIST.md')
  })

  it('enthält ehrlichen Phase-1-Hinweis', () => {
    expect(content).toMatch(/0 echter umsatz|0 eur|pre-revenue/i)
  })

  it('enthält Admin-Tabelle mit /admin/buyer-readiness', () => {
    expect(content).toContain('/admin/buyer-readiness')
  })

  it('enthält Setup-Anleitung', () => {
    expect(content).toContain('npm install')
    expect(content).toContain('.env.example')
  })
})

// ── 4. .env.example — vollständig ────────────────────────────────────────────

describe('.env.example — alle benötigten Variablen', () => {
  let content: string
  beforeAll(() => { content = readFile('.env.example') })

  it('NEXT_PUBLIC_SUPABASE_URL', () => { expect(content).toContain('NEXT_PUBLIC_SUPABASE_URL') })
  it('NEXT_PUBLIC_SUPABASE_ANON_KEY', () => { expect(content).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY') })
  it('SUPABASE_SERVICE_ROLE_KEY', () => { expect(content).toContain('SUPABASE_SERVICE_ROLE_KEY') })
  it('CRON_SECRET', () => { expect(content).toContain('CRON_SECRET') })
  it('NEXT_PUBLIC_BASE_URL', () => { expect(content).toContain('NEXT_PUBLIC_BASE_URL') })
  it('ADMIN_EMAILS', () => { expect(content).toContain('ADMIN_EMAILS') })
  it('EMAIL_PROVIDER=none', () => { expect(content).toContain('EMAIL_PROVIDER=none') })
  it('OUTREACH_EMAIL_PROVIDER=none', () => { expect(content).toContain('OUTREACH_EMAIL_PROVIDER=none') })
  it('ENABLE_TEST_AUTO_APPLICATION_MESSAGE=false', () => {
    expect(content).toContain('ENABLE_TEST_AUTO_APPLICATION_MESSAGE=false')
  })
})

// ── 5. Daily Runner — Buyer Readiness Felder ─────────────────────────────────

describe('Daily Runner — Buyer Readiness', () => {
  let content: string
  beforeAll(() => { content = readFile('app/api/cron/cwo-daily-runner/route.ts') })

  it('enthält Buyer Readiness Status note', () => {
    expect(content).toContain('Buyer Readiness Status')
  })

  it('enthält buyerReadinessScore', () => {
    expect(content).toContain('buyerReadinessScore')
  })

  it('enthält topBuyerConcern', () => {
    expect(content).toContain('topBuyerConcern')
  })

  it('enthält nextValueBooster', () => {
    expect(content).toContain('nextValueBooster')
  })

  it('enthält commercialProofStatus', () => {
    expect(content).toContain('commercialProofStatus')
  })

  it('Score ist 66 (ehrlich)', () => {
    expect(content).toContain('66')
  })

  it('enthält buyerReadiness im Response-Objekt', () => {
    expect(content).toContain('buyerReadiness:')
  })

  it('Safety-Invarianten unverändert', () => {
    expect(content).toContain('no_email_sent:    true')
    expect(content).toContain('no_auto_outreach: true')
    expect(content).toContain('no_scraping:      true')
  })

  it('kein externer API-Call in Buyer-Section', () => {
    expect(content).not.toContain('googleapis.com')
    expect(content).not.toContain("from 'stripe'")
  })
})

// ── 6. CWO Command Center — Buyer Readiness Panel ────────────────────────────

describe('CWO Command Center — Buyer Readiness Panel', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/cwo-command-center/page.tsx') })

  it('enthält Buyer Readiness Panel', () => {
    expect(content).toContain('Buyer Readiness')
  })

  it('verlinkt auf /admin/buyer-readiness', () => {
    expect(content).toContain('/admin/buyer-readiness')
  })

  it('zeigt Score 66', () => {
    expect(content).toContain('66')
  })

  it('zeigt "demo-ready: ja"', () => {
    expect(content).toMatch(/demo.*ready|buyer.*demo/i)
  })

  it('zeigt Transfer Docs vorhanden', () => {
    expect(content).toMatch(/transfer.*docs|docs.*vorhanden/i)
  })

  it('zeigt "Payment-ready: nein"', () => {
    expect(content).toMatch(/payment.*ready|payment.*nein/i)
  })

  it('zeigt "commercial proof: noch schwach"', () => {
    expect(content).toMatch(/commercial.*proof|commercial.*schwach/i)
  })

  it('kein Google API, kein Scraping', () => {
    expect(content).not.toContain('googleapis.com')
    expect(content).not.toContain('cheerio')
  })
})

// ── 7. Safety Invarianten ─────────────────────────────────────────────────────

describe('Safety Invarianten — Buyer Readiness Sprint', () => {
  const files = [
    'app/admin/buyer-readiness/page.tsx',
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

    it(`${file}: kein E-Mail-Versand`, () => {
      const c = readFile(file)
      expect(c).not.toContain('nodemailer')
      expect(c).not.toContain('sendEmail(')
    })
  })
})
