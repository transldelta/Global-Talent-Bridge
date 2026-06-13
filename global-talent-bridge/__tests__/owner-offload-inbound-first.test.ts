/**
 * __tests__/owner-offload-inbound-first.test.ts
 *
 * Tests für den Owner-Offload / No-Manual-Social Fix.
 *
 * Prüft:
 * - Kein LinkedIn/WhatsApp als Pflicht
 * - Keine private WhatsApp-Nummer empfohlen
 * - /launch enthält keine Pflicht-Social-Schritte
 * - /admin/distribution-pack zeigt Social nur optional
 * - /admin/cwo-command-center zeigt Owner-Offload-Status
 * - /admin/revenue-accelerator zeigt Inbound-first Next Step
 * - Kein Send-Button, kein Stripe, kein Scraping, kein Outreach
 * - Keine alten Brand-Namen (Global Talent Bridge etc.)
 * - Marke CorridorWork korrekt
 *
 * Safety: Kein Versand · Kein Stripe · Kein Scraping · Kein Outreach
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

// ── 1. /admin/distribution-pack — Social nur optional ────────────────────────

describe('/admin/distribution-pack — Social optional, nicht Pflicht', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/distribution-pack/page.tsx') })

  it('WhatsApp ist als optional markiert', () => {
    // Muss "optional" oder "OPTIONAL" nahe dem WhatsApp-Block enthalten
    expect(content.toLowerCase()).toMatch(/whatsapp.*optional|optional.*whatsapp/i)
  })

  it('LinkedIn ist als optional markiert', () => {
    expect(content.toLowerCase()).toMatch(/linkedin.*optional|optional.*linkedin/i)
  })

  it('enthält Inbound-first Hinweis', () => {
    expect(content.toLowerCase()).toMatch(/inbound-first|inbound first/i)
  })

  it('private WhatsApp-Nummer wird nicht empfohlen', () => {
    // Muss explizit sagen "nicht privat" oder "Business-Nummer"
    expect(content.toLowerCase()).toMatch(/nicht privat|business-nummer|whatsapp business/i)
  })

  it('enthält Hinweis: kein LinkedIn erforderlich', () => {
    expect(content.toLowerCase()).toMatch(/kein linkedin|linkedin.*nicht.*erforderlich/i)
  })

  it('enthält Hinweis: kein WhatsApp erforderlich', () => {
    expect(content.toLowerCase()).toMatch(/kein whatsapp|whatsapp.*nicht.*erforderlich|kein.*whatsapp.*nötig/i)
  })

  it('enthält CorridorWork (kein alter Brand-Name)', () => {
    expect(content).toContain('CorridorWork')
    expect(content).not.toContain('Global Talent Bridge')
    expect(content).not.toContain('GlobalTalentBridge')
    expect(content).not.toContain('SlotFill')
  })

  it('kein Send-Button / kein Outreach', () => {
    expect(content).not.toContain('sendEmail(')
    expect(content).not.toContain('nodemailer')
    expect(content).not.toContain('smtp')
  })
})

// ── 2. /admin/cwo-command-center — Owner-Offload Box ─────────────────────────

describe('/admin/cwo-command-center — Owner-Offload Status', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/cwo-command-center/page.tsx') })

  it('enthält Owner-Offload Box / "Das System arbeitet für dich"', () => {
    expect(content.toLowerCase()).toMatch(/das system arbeitet für dich|system arbeitet.*für/i)
  })

  it('zeigt "Private WhatsApp/LinkedIn nötig: nein"', () => {
    expect(content.toLowerCase()).toMatch(/private.*whatsapp.*linkedin.*nötig|whatsapp.*linkedin.*nein/i)
  })

  it('zeigt Revenue Inbox als aktiv', () => {
    expect(content.toLowerCase()).toMatch(/revenue inbox.*aktiv|revenue inbox sammelt/i)
  })

  it('zeigt Daily Runner als aktiv', () => {
    expect(content.toLowerCase()).toMatch(/daily runner.*aktiv|daily runner arbeitet/i)
  })

  it('enthält nächsten Schritt ohne Social-Pflicht', () => {
    const nextStep = content.match(/nächster schritt.*[\s\S]{0,200}/i)?.[0] ?? ''
    expect(nextStep.toLowerCase()).not.toMatch(/linkedin posten|whatsapp posten|social media posten/i)
  })

  it('Passive Distribution Panel vorhanden', () => {
    expect(content.toLowerCase()).toMatch(/passive distribution ready/i)
  })

  it('kein Stripe, kein Scraping, kein Outreach', () => {
    expect(content).not.toContain("from 'stripe'")
    expect(content).not.toContain('cheerio')
    expect(content).not.toContain('sendEmail(')
  })
})

// ── 3. /launch — keine Pflicht-Social-Schritte ───────────────────────────────

describe('/launch — keine Pflicht-Social-Schritte', () => {
  let content: string
  beforeAll(() => { content = readFile('app/launch/page.tsx') })

  it('enthält Inbound-first Hinweis', () => {
    expect(content.toLowerCase()).toMatch(/inbound-first|inbound first|inbound.*automatisch/i)
  })

  it('enthält keine Pflicht-Formulierung für LinkedIn/WhatsApp', () => {
    // Die Seite darf LinkedIn/WhatsApp nicht als "musst du tun" formulieren
    expect(content).not.toMatch(/du musst.*linkedin|du musst.*whatsapp/i)
    expect(content).not.toMatch(/poste auf linkedin|poste auf whatsapp/i)
  })

  it('enthält Inbound-first / kein Social-Pflicht Hinweis', () => {
    // Phase 1: German "Kein LinkedIn/WhatsApp nötig" → English "No cold outreach" / "Inbound-first"
    expect(content.toLowerCase()).toMatch(/kein linkedin.*whatsapp nötig|no cold outreach|inbound-first|inbound only/i)
  })

  it('enthält alle 4 Revenue-CTAs', () => {
    expect(content).toContain('/strategic-partnership')
    expect(content).toContain('/partners')
    expect(content).toContain('/pilot/employers')
    expect(content).toContain('/market-intelligence')
    expect(content).toContain('/demo')
  })

  it('Marke CorridorWork korrekt', () => {
    expect(content).toContain('CorridorWork')
    expect(content).not.toContain('Global Talent Bridge')
    expect(content).not.toContain('SlotFill')
  })
})

// ── 4. /buyer-snapshot — Inbound-first Statement ─────────────────────────────

describe('/buyer-snapshot — Inbound-first Statement', () => {
  let content: string
  beforeAll(() => { content = readFile('app/buyer-snapshot/page.tsx') })

  it('enthält Inbound-first Statement', () => {
    expect(content.toLowerCase()).toMatch(/inbound-first|inbound first/i)
  })

  it('enthält keine Empfehlung für privates Social-Media-Posting', () => {
    expect(content).not.toMatch(/poste auf linkedin|poste auf whatsapp/i)
    expect(content).not.toMatch(/du musst.*social|social.*media.*pflicht/i)
  })

  it('kein Hinweis auf Owner als privaten Social-Media-Nutzer', () => {
    expect(content).not.toMatch(/linkedin-profil.*des.*owners|owners.*linkedin/i)
  })
})

// ── 5. /admin/revenue-accelerator — Inbound-first Next Steps ─────────────────

describe('/admin/revenue-accelerator — Inbound-first Next Steps', () => {
  let content: string
  beforeAll(() => { content = readFile('app/admin/revenue-accelerator/page.tsx') })

  it('Revenue Inbox als Schritt 1', () => {
    expect(content.toLowerCase()).toMatch(/revenue inbox|inbox prüfen/i)
  })

  it('Inbound-Seiten live lassen als Schritt', () => {
    expect(content.toLowerCase()).toMatch(/inbound-seiten.*live|seiten.*live.*lassen/i)
  })

  it('Google-Indexierung beobachten als Schritt', () => {
    expect(content.toLowerCase()).toMatch(/google.*indexierung.*beobachten|google.*indexierung/i)
  })

  it('kein Schritt "auf WhatsApp/LinkedIn teilen" als Pflicht', () => {
    // NEXT_SAFE_STEPS darf nicht "LinkedIn teilen" oder "WhatsApp teilen" als Pflichtschritt enthalten
    const stepsSection = content.slice(
      content.indexOf('NEXT_SAFE_STEPS'),
      content.indexOf('NEXT_SAFE_STEPS') + 1500
    )
    expect(stepsSection).not.toMatch(/auf linkedin teilen|auf whatsapp teilen/i)
    expect(stepsSection).not.toMatch(/linkedin.*posten.*pflicht|pflicht.*linkedin/i)
  })

  it('Strategic Partner als höchster Wertpfad markiert (Rang 1 Hinweis)', () => {
    expect(content.toLowerCase()).toMatch(/strategic.*partner|strategic_partner/i)
  })

  it('kein Stripe, kein Scraping', () => {
    expect(content).not.toContain("from 'stripe'")
    expect(content).not.toContain('cheerio')
    expect(content).not.toContain('puppeteer')
  })
})

// ── 6. Docs — Inbound-first, kein Social-Pflicht ─────────────────────────────

describe('Docs — Inbound-first, kein Social-Pflicht', () => {
  it('PASSIVE_REVENUE_DISTRIBUTION_PACK.md: kein LinkedIn erforderlich', () => {
    const doc = readFile('docs/PASSIVE_REVENUE_DISTRIBUTION_PACK.md')
    expect(doc.toLowerCase()).toMatch(/kein linkedin erforderlich|linkedin.*nicht.*erforderlich/i)
  })

  it('PASSIVE_REVENUE_DISTRIBUTION_PACK.md: keine private WhatsApp', () => {
    const doc = readFile('docs/PASSIVE_REVENUE_DISTRIBUTION_PACK.md')
    expect(doc.toLowerCase()).toMatch(/keine private whatsapp|privat.*whatsapp.*nicht/i)
  })

  it('PASSIVE_REVENUE_DISTRIBUTION_PACK.md: Inbound-first erwähnt', () => {
    const doc = readFile('docs/PASSIVE_REVENUE_DISTRIBUTION_PACK.md')
    expect(doc.toLowerCase()).toMatch(/inbound-first|inbound first/i)
  })

  it('REVENUE_ACCELERATOR_STATUS.md: kein LinkedIn als Pflicht', () => {
    const doc = readFile('docs/REVENUE_ACCELERATOR_STATUS.md')
    // Darf LinkedIn erwähnen (als "nicht erforderlich"), aber nicht als Pflicht-Schritt
    expect(doc).not.toMatch(/Schritt.*LinkedIn posten|LinkedIn.*Pflichtschritt/i)
  })

  it('REVENUE_ACCELERATOR_STATUS.md: Inbound-first System erwähnt', () => {
    const doc = readFile('docs/REVENUE_ACCELERATOR_STATUS.md')
    expect(doc.toLowerCase()).toMatch(/inbound-first|inbound first/i)
  })
})

// ── 7. Safety Invarianten ─────────────────────────────────────────────────────

describe('Safety Invarianten — Owner-Offload Paket', () => {
  const files = [
    'app/launch/page.tsx',
    'app/buyer-snapshot/page.tsx',
    'app/admin/distribution-pack/page.tsx',
    'app/admin/cwo-command-center/page.tsx',
    'app/admin/revenue-accelerator/page.tsx',
  ]

  files.forEach(file => {
    it(`${file}: kein Stripe-Import`, () => {
      const c = readFile(file)
      expect(c).not.toContain("from 'stripe'")
      expect(c).not.toContain('loadStripe(')
    })

    it(`${file}: kein Scraping`, () => {
      const c = readFile(file)
      expect(c).not.toContain('cheerio')
      expect(c).not.toContain('puppeteer')
      expect(c).not.toContain('playwright')
    })

    it(`${file}: kein E-Mail-Versand`, () => {
      const c = readFile(file)
      expect(c).not.toContain('nodemailer')
      expect(c).not.toContain('sendEmail(')
      expect(c).not.toContain('transporter.send')
    })

    it(`${file}: CorridorWork-Branding (kein alter Name)`, () => {
      const c = readFile(file)
      expect(c).not.toContain('Global Talent Bridge')
      expect(c).not.toContain('GlobalTalentBridge')
      expect(c).not.toContain('SlotFill')
    })
  })
})
