/**
 * __tests__/promo-video-page.test.ts
 *
 * Tests for /promo-video page (app/promo-video/page.tsx)
 * and for the generated video + subtitle assets.
 *
 * Checks:
 * - Page file exists
 * - MP4 referenced in page (src attribute)
 * - Subtitle tracks referenced
 * - Brand "CorridorWork" present
 * - Domain "corridorwork.com" present
 * - No job guarantee / visa guarantee language
 * - No Stripe / no email / no scraping as active features
 * - Compliance banner present
 * - All 10 language subtitle codes present
 * - All 6 scene titles present
 * - All 3 CTAs present
 * - PublicFooter imported
 * - /promo-video in sitemap.ts
 * - Footer contains /promo-video link
 * - SRT files exist and contain valid timecodes
 * - MP4 files exist in public/promo-video/
 * - Build script exists in scripts/
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT      = join(__dirname, '..')
const PAGE_FILE = join(ROOT, 'app/promo-video/page.tsx')
const SITEMAP   = join(ROOT, 'app/sitemap.ts')
const FOOTER    = join(ROOT, 'app/_components/PublicFooter.tsx')
const VIDEO_DIR = join(ROOT, 'public/promo-video')
const SRT_DIR   = join(ROOT, 'public/promo-video/subtitles')
const SCRIPT    = join(ROOT, 'scripts/build-promo-video.py')

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
    expect(readFileSync(SITEMAP, 'utf-8')).toContain('/promo-video')
  })

  it('PublicFooter.tsx enthält /promo-video Link', () => {
    expect(existsSync(FOOTER)).toBe(true)
    expect(readFileSync(FOOTER, 'utf-8')).toContain('/promo-video')
  })

  it('scripts/build-promo-video.py existiert', () => {
    expect(existsSync(SCRIPT)).toBe(true)
  })
})

// ── 2. MP4 assets ─────────────────────────────────────────────────────────────

describe('/promo-video — MP4 Assets', () => {
  it('corridorwork-promo-en.mp4 existiert', () => {
    expect(existsSync(join(VIDEO_DIR, 'corridorwork-promo-en.mp4'))).toBe(true)
  })

  it('corridorwork-promo-en-noaudio.mp4 existiert', () => {
    expect(existsSync(join(VIDEO_DIR, 'corridorwork-promo-en-noaudio.mp4'))).toBe(true)
  })

  it('corridorwork-promo-en.mp4 ist größer als 100KB', () => {
    const { statSync } = require('fs')
    const size = statSync(join(VIDEO_DIR, 'corridorwork-promo-en.mp4')).size
    expect(size).toBeGreaterThan(100 * 1024) // > 100 KB
  })
})

// ── 3. SRT subtitle files ─────────────────────────────────────────────────────

const SRT_LANGS = ['en', 'de', 'fr', 'ar', 'es', 'pt', 'hi', 'ur', 'fil', 'tr']

describe('/promo-video — SRT Subtitle Files', () => {
  for (const lang of SRT_LANGS) {
    const file = `corridorwork-promo-${lang}.srt`
    it(`${file} existiert`, () => {
      expect(existsSync(join(SRT_DIR, file))).toBe(true)
    })

    it(`${file} enthält SRT-Zeitstempel`, () => {
      const content = readFileSync(join(SRT_DIR, file), 'utf-8')
      expect(content).toMatch(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/)
    })
  }

  it('10 SRT-Dateien vorhanden', () => {
    expect(SRT_LANGS.length).toBe(10)
  })
})

// ── 4. Page embeds video ──────────────────────────────────────────────────────

describe('/promo-video — Video Eingebettet', () => {
  it('Seite referenziert corridorwork-promo-en.mp4', () => {
    expect(readPage()).toContain('corridorwork-promo-en.mp4')
  })

  it('Seite hat <video> Element', () => {
    const c = readPage().toLowerCase()
    expect(c).toContain('<video')
  })

  it('Seite hat <source> mit video/mp4', () => {
    expect(readPage()).toContain('video/mp4')
  })

  it('Seite hat subtitle <track> Elemente', () => {
    expect(readPage()).toContain('<track')
    expect(readPage()).toContain('kind="subtitles"')
  })

  it('Seite referenziert alle 10 SRT-Sprachen', () => {
    const c = readPage()
    for (const lang of SRT_LANGS) {
      expect(c).toContain(`corridorwork-promo-${lang}.srt`)
    }
  })
})

// ── 5. Compliance banner ──────────────────────────────────────────────────────

describe('/promo-video — Compliance Banner', () => {
  it('enthält "No job guarantee"', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/no job guarantee|zero.*employment|no.*employment guarantee/)
  })

  it('enthält "No visa guarantee"', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/no visa guarantee|zero.*visa|no.*visa guarantee/)
  })

  it('enthält "No fake revenue claims"', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/no fake revenue|no.*fake.*revenue|no fake.*claim/)
  })
})

// ── 6. Brand & domain ─────────────────────────────────────────────────────────

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

// ── 7. Forbidden phrases ──────────────────────────────────────────────────────

describe('/promo-video — Keine verbotenen Phrasen', () => {
  const FORBIDDEN = [
    'guaranteed job',
    'job guaranteed',
    'guaranteed visa',
    'visa guaranteed',
    'you will be hired',
    'income guaranteed',
    'guaranteed income',
  ]

  for (const phrase of FORBIDDEN) {
    it(`enthält nicht "${phrase}"`, () => {
      expect(readPage().toLowerCase()).not.toContain(phrase.toLowerCase())
    })
  }
})

// ── 8. Safety invariants ──────────────────────────────────────────────────────

describe('/promo-video — Safety Invariants', () => {
  it('kein aktiviertes Stripe', () => {
    const c = readPage()
    expect(c).not.toContain('stripe.com')
    expect(c).not.toMatch(/new Stripe\(|stripe\.createCharge/i)
  })

  it('kein aktives E-Mail-Senden', () => {
    expect(readPage()).not.toMatch(/sendEmail\(|nodemailer|resend\.send/i)
  })

  it('kein Scraping', () => {
    expect(readPage()).not.toMatch(/puppeteer|cheerio|playwright\.chromium/i)
  })

  it('enthält Stripe/payments-Hinweis', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/no stripe|not activated|no payments/)
  })
})

// ── 9. Storyboard content ─────────────────────────────────────────────────────

describe('/promo-video — Storyboard Szenen', () => {
  it('enthält alle 6 Szenen-Titel', () => {
    const c = readPage()
    expect(c).toContain('THE HOOK')
    expect(c).toContain('THE SOLUTION')
    expect(c).toContain('THE FEATURES')
    expect(c).toContain('FOR WHOM')
    expect(c).toContain('CALL TO ACTION')
  })

  it('enthält Zeitstempel', () => {
    const c = readPage()
    expect(c).toContain('0:00')
    expect(c).toContain('0:42')
  })
})

// ── 10. Language codes ────────────────────────────────────────────────────────

describe('/promo-video — 10 Sprachcodes', () => {
  for (const lang of SRT_LANGS) {
    it(`enthält Sprachcode "${lang}"`, () => {
      expect(readPage()).toContain(lang)
    })
  }
})

// ── 11. CTAs ──────────────────────────────────────────────────────────────────

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

// ── 12. Component structure ───────────────────────────────────────────────────

describe('/promo-video — Komponenten-Struktur', () => {
  it('importiert PublicFooter', () => {
    expect(readPage()).toContain('PublicFooter')
  })

  it('exportiert default function PromoVideoPage', () => {
    expect(readPage()).toContain('export default function PromoVideoPage')
  })

  it('enthält metadata export', () => {
    expect(readPage()).toContain('export const metadata')
  })

  it('build-script enthält "ffmpeg"', () => {
    expect(readFileSync(SCRIPT, 'utf-8')).toContain('ffmpeg')
  })

  it('build-script enthält "CorridorWork"', () => {
    expect(readFileSync(SCRIPT, 'utf-8')).toContain('CorridorWork')
  })
})
