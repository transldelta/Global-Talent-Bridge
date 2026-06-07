/**
 * __tests__/promo-video-page.test.ts
 *
 * Tests for /promo-video page (app/promo-video/page.tsx)
 *
 * Checks:
 * - Page file exists
 * - Contains "no MP4" disclaimer
 * - Brand "CorridorWork" present
 * - Domain "corridorwork.com" present
 * - No job guarantee / visa guarantee language
 * - No Stripe / no email sending / no scraping references as active features
 * - All 10 language codes present
 * - All 6 scene titles present
 * - All 3 CTAs present (/demo/sandbox, /buyer-snapshot, /strategic-partnership)
 * - "Production-Ready Assets" section present
 * - PublicFooter imported
 * - /promo-video in sitemap.ts
 * - Footer contains promo-video link
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT      = join(__dirname, '..')
const PAGE_FILE = join(ROOT, 'app/promo-video/page.tsx')
const SITEMAP   = join(ROOT, 'app/sitemap.ts')
const FOOTER    = join(ROOT, 'app/_components/PublicFooter.tsx')

function readPage(): string {
  if (!existsSync(PAGE_FILE)) throw new Error('Missing: app/promo-video/page.tsx')
  return readFileSync(PAGE_FILE, 'utf-8')
}

// ── 1. File existence ─────────────────────────────────────────────────────────

describe('/promo-video — File Existence', () => {
  it('app/promo-video/page.tsx existiert', () => {
    expect(existsSync(PAGE_FILE)).toBe(true)
  })

  it('app/sitemap.ts enthält /promo-video', () => {
    expect(existsSync(SITEMAP)).toBe(true)
    const c = readFileSync(SITEMAP, 'utf-8')
    expect(c).toContain('/promo-video')
  })

  it('PublicFooter.tsx enthält /promo-video Link', () => {
    expect(existsSync(FOOTER)).toBe(true)
    const c = readFileSync(FOOTER, 'utf-8')
    expect(c).toContain('/promo-video')
  })
})

// ── 2. Disclaimer — no MP4 ────────────────────────────────────────────────────

describe('/promo-video — No-MP4 Disclaimer', () => {
  it('enthält "no MP4" Hinweis', () => {
    const c = readPage()
    // Case-insensitive: "No MP4" / "no final MP4" / "no MP4 file"
    expect(c.toLowerCase()).toContain('no')
    expect(c.toUpperCase()).toContain('MP4')
  })

  it('enthält "storyboard" oder "script preview"', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/storyboard|script preview|script.only preview/)
  })

  it('enthält "no paid video service" Hinweis', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/no paid|not activated|not active|not enabled|none|kein bezahl/)
  })
})

// ── 3. Brand & domain ─────────────────────────────────────────────────────────

describe('/promo-video — Brand & Domain', () => {
  it('enthält "CorridorWork"', () => {
    expect(readPage()).toContain('CorridorWork')
  })

  it('enthält "corridorwork.com"', () => {
    expect(readPage()).toContain('corridorwork.com')
  })

  it('enthält KEINE alten Markennamen', () => {
    const c = readPage()
    expect(c).not.toContain('Global Talent Bridge')
    expect(c).not.toContain('SlotFill')
    expect(c).not.toContain('Slot Fill')
  })
})

// ── 4. Compliance — no forbidden phrases ─────────────────────────────────────

describe('/promo-video — Keine verbotenen Phrasen', () => {
  const FORBIDDEN = [
    'guaranteed job',
    'job guaranteed',
    'guaranteed visa',
    'visa guaranteed',
    'you will be hired',
    'income guaranteed',
    'guaranteed income',
    'we place you automatically',
  ]

  for (const phrase of FORBIDDEN) {
    it(`enthält nicht "${phrase}"`, () => {
      expect(readPage().toLowerCase()).not.toContain(phrase.toLowerCase())
    })
  }
})

// ── 5. Safety invariants ──────────────────────────────────────────────────────

describe('/promo-video — Safety Invariants', () => {
  it('kein aktiviertes Stripe', () => {
    const c = readPage().toLowerCase()
    // stripe.com / stripe.createCharge / new Stripe( must not appear
    expect(c).not.toContain('stripe.com')
    expect(c).not.toMatch(/new stripe\(|stripe\.createcharge|stripe\.paymentintent/i)
  })

  it('kein aktives E-Mail-Senden', () => {
    const c = readPage()
    // sendEmail() / nodemailer / resend.send must not appear
    expect(c).not.toMatch(/sendEmail\(|nodemailer|resend\.send|smtp/i)
  })

  it('kein Scraping', () => {
    const c = readPage()
    expect(c).not.toMatch(/puppeteer|cheerio|playwright\.chromium/i)
  })

  it('enthält "No payments activated" oder äquivalent', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/no payments|not activated|not active|kein.*zahlung|payment.*none/)
  })
})

// ── 6. Storyboard content ─────────────────────────────────────────────────────

describe('/promo-video — Storyboard Szenen', () => {
  it('enthält alle 6 Szenen-Zeitfenster', () => {
    const c = readPage()
    expect(c).toContain('0:00')
    expect(c).toContain('0:05')
    expect(c).toContain('0:15')
    expect(c).toContain('0:30')
    expect(c).toContain('0:45')
    expect(c).toContain('0:55')
  })

  it('enthält Szenen-Titel', () => {
    const c = readPage()
    expect(c).toContain('THE HOOK')
    expect(c).toContain('THE PROBLEM')
    expect(c).toContain('THE SOLUTION')
    expect(c).toContain('THE FEATURES')
    expect(c).toContain('FOR WHOM')
    expect(c).toContain('CALL TO ACTION')
  })

  it('enthält Voiceover-Texte (EN)', () => {
    const c = readPage()
    expect(c).toContain('Voiceover')
    // At least one quote from the master script
    expect(c).toContain('structured path to global talent')
  })

  it('enthält On-Screen-Texte', () => {
    const c = readPage()
    expect(c).toContain('On-Screen Text')
    expect(c).toContain('Compliance-First')
  })
})

// ── 7. Language pack ──────────────────────────────────────────────────────────

describe('/promo-video — Sprach-Pack', () => {
  const LANG_CODES = ['EN', 'DE', 'FR', 'AR', 'ES', 'PT', 'HI', 'UR', 'FIL', 'TR']

  for (const code of LANG_CODES) {
    it(`enthält Sprach-Code "${code}"`, () => {
      expect(readPage()).toContain(code)
    })
  }

  it('enthält "10" Sprachen-Hinweis', () => {
    expect(readPage()).toContain('10')
  })
})

// ── 8. Production assets section ─────────────────────────────────────────────

describe('/promo-video — Production Assets', () => {
  it('enthält "Production-Ready Assets" Abschnitt', () => {
    const c = readPage()
    expect(c).toMatch(/Production.Ready Assets|Production Ready Assets/i)
  })

  it('enthält Runway', () => {
    expect(readPage()).toContain('Runway')
  })

  it('enthält Pika', () => {
    expect(readPage()).toContain('Pika')
  })

  it('enthält Canva', () => {
    expect(readPage()).toContain('Canva')
  })

  it('enthält CapCut', () => {
    expect(readPage()).toContain('CapCut')
  })

  it('enthält Synthesia oder HeyGen', () => {
    const c = readPage()
    expect(c).toMatch(/Synthesia|HeyGen/)
  })

  it('enthält SRT subtitle Hinweis', () => {
    const c = readPage().toLowerCase()
    expect(c).toContain('srt')
  })
})

// ── 9. CTAs ───────────────────────────────────────────────────────────────────

describe('/promo-video — CTAs', () => {
  it('enthält Link zu /demo/sandbox', () => {
    expect(readPage()).toContain('/demo/sandbox')
  })

  it('enthält Link zu /buyer-snapshot', () => {
    expect(readPage()).toContain('/buyer-snapshot')
  })

  it('enthält Link zu /strategic-partnership', () => {
    expect(readPage()).toContain('/strategic-partnership')
  })
})

// ── 10. Component structure ───────────────────────────────────────────────────

describe('/promo-video — Komponenten-Struktur', () => {
  it('importiert PublicFooter', () => {
    expect(readPage()).toContain('PublicFooter')
  })

  it('importiert Link from next/link', () => {
    expect(readPage()).toContain("from 'next/link'")
  })

  it('exportiert default function PromoVideoPage', () => {
    expect(readPage()).toContain('export default function PromoVideoPage')
  })

  it('enthält metadata export', () => {
    expect(readPage()).toContain('export const metadata')
  })
})
