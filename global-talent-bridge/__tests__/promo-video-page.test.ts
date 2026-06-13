/**
 * __tests__/promo-video-page.test.ts
 *
 * Tests for /promo-video page (app/promo-video/page.tsx)
 * Covers: human footage video (LIVE), license notes, slide draft, assets,
 *         compliance, brand, forbidden phrases, safety, subtitles, CTAs.
 *
 * Checks:
 * - Page file exists
 * - Human Footage video (final/corridorwork-promo-human-en.mp4) exists + >1MB
 * - Human Footage video embedded in page
 * - License notes doc exists
 * - 10 real clips in source-clips/
 * - Asset list doc exists
 * - Voiceover script doc exists
 * - Build pipeline script exists (sh)
 * - source-clips/ and final/ directories present
 * - Human SRT files exist (10 languages) in subtitles/human/
 * - Draft MP4 still exists (technical draft, clearly labeled)
 * - Subtitle tracks referenced
 * - Brand "CorridorWork" present
 * - Domain "corridorwork.com" present
 * - No job guarantee / visa guarantee language
 * - No Stripe / no email / no scraping
 * - Compliance banner present
 * - No robot voice
 * - Human footage section shows LIVE status
 * - License notes reference Pexels
 * - All 3 CTAs present
 * - PublicFooter imported
 * - /promo-video in sitemap.ts
 * - Footer contains /promo-video link
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT         = join(__dirname, '..')
const PAGE_FILE    = join(ROOT, 'app/promo-video/page.tsx')
const SITEMAP      = join(ROOT, 'app/sitemap.ts')
const FOOTER       = join(ROOT, 'app/_components/PublicFooter.tsx')

// Asset paths
const VIDEO_DIR    = join(ROOT, 'public/promo-video')
const SRT_DIR      = join(ROOT, 'public/promo-video/subtitles')
const HUMAN_SRT    = join(ROOT, 'public/promo-video/subtitles/human')
const CLIPS_DIR    = join(ROOT, 'public/promo-video/source-clips')
const FINAL_DIR    = join(ROOT, 'public/promo-video/final')

// Human footage final video
const HUMAN_MP4    = join(ROOT, 'public/promo-video/final/corridorwork-promo-human-en.mp4')

// Docs
const ASSET_LIST   = join(ROOT, 'docs/video/HUMAN_FOOTAGE_ASSET_LIST.md')
const VO_SCRIPT    = join(ROOT, 'docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md')
const LICENSE_NOTES = join(ROOT, 'docs/video/HUMAN_FOOTAGE_LICENSE_NOTES.md')

// Scripts
const BUILD_HUMAN  = join(ROOT, 'scripts/build-human-promo-video.sh')
const BUILD_SLIDE  = join(ROOT, 'scripts/build-promo-video.py')

// Required source clips
const REQUIRED_CLIPS = [
  '01-empty-office.mp4',
  '02-hr-team.mp4',
  '03-candidates-global.mp4',
  '04-healthcare-worker.mp4',
  '05-it-developer.mp4',
  '06-skilled-trades.mp4',
  '07-candidate-laptop.mp4',
  '08-employer-interview.mp4',
  '09-world-map-city.mp4',
  '10-global-teamwork.mp4',
]

// Languages
const SLIDE_LANGS  = ['en', 'de', 'fr', 'ar', 'es', 'pt', 'hi', 'ur', 'fil', 'tr']
const HUMAN_LANGS  = ['en', 'de', 'fr', 'ar', 'es', 'pt', 'hi', 'ur', 'fil', 'tr']

function readPage(): string {
  if (!existsSync(PAGE_FILE)) throw new Error('Missing: app/promo-video/page.tsx')
  return readFileSync(PAGE_FILE, 'utf-8')
}

// ── 1. File Existence ─────────────────────────────────────────────────────────

describe('/promo-video — File Existence', () => {
  it('app/promo-video/page.tsx existiert', () => {
    expect(existsSync(PAGE_FILE)).toBe(true)
  })

  it('app/sitemap.ts does NOT contain /promo-video (removed — noindex page, not sale-ready)', () => {
    expect(existsSync(SITEMAP)).toBe(true)
    expect(readFileSync(SITEMAP, 'utf-8')).not.toContain('/promo-video')
  })

  it('PublicFooter.tsx does NOT contain public /promo-video link (removed until voiceover ready)', () => {
    expect(existsSync(FOOTER)).toBe(true)
    expect(readFileSync(FOOTER, 'utf-8')).not.toContain('href="/promo-video"')
  })

  it('scripts/build-promo-video.py existiert (slide draft)', () => {
    expect(existsSync(BUILD_SLIDE)).toBe(true)
  })

  it('scripts/build-human-promo-video.sh existiert (human pipeline)', () => {
    expect(existsSync(BUILD_HUMAN)).toBe(true)
  })

  it('docs/video/HUMAN_FOOTAGE_ASSET_LIST.md existiert', () => {
    expect(existsSync(ASSET_LIST)).toBe(true)
  })

  it('docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md existiert', () => {
    expect(existsSync(VO_SCRIPT)).toBe(true)
  })
})

// ── 2. Human Footage Final Video ──────────────────────────────────────────────

describe('/promo-video — Human Footage Final Video', () => {
  it('corridorwork-promo-human-en.mp4 existiert', () => {
    expect(existsSync(HUMAN_MP4)).toBe(true)
  })

  it('corridorwork-promo-human-en.mp4 ist größer als 1MB', () => {
    const { statSync } = require('fs')
    const size = statSync(HUMAN_MP4).size
    expect(size).toBeGreaterThan(1024 * 1024) // > 1MB
  })

  it('corridorwork-promo-human-en.mp4 ist größer als 5MB (echte Footage)', () => {
    const { statSync } = require('fs')
    const size = statSync(HUMAN_MP4).size
    expect(size).toBeGreaterThan(5 * 1024 * 1024) // > 5MB
  })

  it.skip('Seite referenziert corridorwork-promo-human-en.mp4', () => {
    // Phase 1: /promo-video replaced with notFound()
    expect(readPage()).toContain('corridorwork-promo-human-en.mp4')
  })

  it.skip('Seite zeigt Human Footage als LIVE', () => {
    // Phase 1: /promo-video replaced with notFound()
    const c = readPage()
    expect(c).toMatch(/LIVE|✅.*LIVE|live.*human/i)
  })

  it.skip('Seite hat <video> für Human-Version mit source', () => {
    // Phase 1: /promo-video replaced with notFound()
    const c = readPage()
    expect(c).toContain('/promo-video/final/')
    expect(c).toContain('video/mp4')
  })
})

// ── 2b. Real Source Clips ─────────────────────────────────────────────────────

describe('/promo-video — Real Source Clips (Pexels Free License)', () => {
  it('Mindestens 4 echte Clips vorhanden', () => {
    const count = REQUIRED_CLIPS.filter(clip =>
      existsSync(join(CLIPS_DIR, clip))
    ).length
    expect(count).toBeGreaterThanOrEqual(4)
  })

  it('Alle 10 Clips vorhanden', () => {
    for (const clip of REQUIRED_CLIPS) {
      expect(existsSync(join(CLIPS_DIR, clip))).toBe(true)
    }
  })

  it('Alle Clips größer als 1MB (echte Video-Dateien)', () => {
    const { statSync } = require('fs')
    for (const clip of REQUIRED_CLIPS) {
      const path = join(CLIPS_DIR, clip)
      if (existsSync(path)) {
        const size = statSync(path).size
        expect(size).toBeGreaterThan(1024 * 1024)
      }
    }
  })
})

// ── 2c. License Notes ─────────────────────────────────────────────────────────

describe('/promo-video — License Notes', () => {
  it('HUMAN_FOOTAGE_LICENSE_NOTES.md existiert', () => {
    expect(existsSync(LICENSE_NOTES)).toBe(true)
  })

  it('License Notes enthält Pexels', () => {
    const c = readFileSync(LICENSE_NOTES, 'utf-8')
    expect(c).toContain('Pexels')
  })

  it('License Notes enthält Pexels License URL', () => {
    const c = readFileSync(LICENSE_NOTES, 'utf-8')
    expect(c).toContain('pexels.com/license')
  })

  it('License Notes enthält alle 10 Clip-Dateinamen', () => {
    const c = readFileSync(LICENSE_NOTES, 'utf-8')
    for (const clip of REQUIRED_CLIPS) {
      expect(c).toContain(clip)
    }
  })

  it('License Notes enthält keine Job-Garantie', () => {
    const c = readFileSync(LICENSE_NOTES, 'utf-8').toLowerCase()
    expect(c).not.toContain('guaranteed job')
    expect(c).not.toContain('guaranteed visa')
  })

  it('License Notes enthält CorridorWork', () => {
    expect(readFileSync(LICENSE_NOTES, 'utf-8')).toContain('CorridorWork')
  })
})

describe('/promo-video — Pipeline Directories', () => {
  it('public/promo-video/source-clips/ existiert', () => {
    expect(existsSync(CLIPS_DIR)).toBe(true)
  })

  it('public/promo-video/final/ existiert', () => {
    expect(existsSync(FINAL_DIR)).toBe(true)
  })

  it('public/promo-video/ existiert', () => {
    expect(existsSync(VIDEO_DIR)).toBe(true)
  })

  it('public/promo-video/subtitles/ existiert', () => {
    expect(existsSync(SRT_DIR)).toBe(true)
  })

  it('public/promo-video/subtitles/human/ existiert', () => {
    expect(existsSync(HUMAN_SRT)).toBe(true)
  })
})

// ── 3. Draft MP4 Assets (Technical Draft) ────────────────────────────────────

describe('/promo-video — Draft MP4 Assets (Technical Draft)', () => {
  it('corridorwork-promo-en.mp4 existiert', () => {
    expect(existsSync(join(VIDEO_DIR, 'corridorwork-promo-en.mp4'))).toBe(true)
  })

  it('corridorwork-promo-en-noaudio.mp4 existiert', () => {
    expect(existsSync(join(VIDEO_DIR, 'corridorwork-promo-en-noaudio.mp4'))).toBe(true)
  })

  it('corridorwork-promo-en.mp4 ist größer als 100KB', () => {
    const { statSync } = require('fs')
    const size = statSync(join(VIDEO_DIR, 'corridorwork-promo-en.mp4')).size
    expect(size).toBeGreaterThan(100 * 1024)
  })
})

// ── 4. Slide-Draft SRT Subtitle Files ────────────────────────────────────────

describe('/promo-video — Slide-Draft SRT Files', () => {
  for (const lang of SLIDE_LANGS) {
    const file = `corridorwork-promo-${lang}.srt`
    it(`${file} existiert`, () => {
      expect(existsSync(join(SRT_DIR, file))).toBe(true)
    })

    it(`${file} enthält SRT-Zeitstempel`, () => {
      const content = readFileSync(join(SRT_DIR, file), 'utf-8')
      expect(content).toMatch(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/)
    })
  }

  it('10 Slide-Draft SRT-Sprachen vorhanden', () => {
    expect(SLIDE_LANGS.length).toBe(10)
  })
})

// ── 5. Human Version SRT Subtitle Files ───────────────────────────────────────

describe('/promo-video — Human Version SRT Files', () => {
  for (const lang of HUMAN_LANGS) {
    const file = `corridorwork-human-${lang}.srt`
    it(`${file} existiert`, () => {
      expect(existsSync(join(HUMAN_SRT, file))).toBe(true)
    })

    it(`${file} enthält SRT-Zeitstempel`, () => {
      const content = readFileSync(join(HUMAN_SRT, file), 'utf-8')
      expect(content).toMatch(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/)
    })
  }

  it('10 Human-Version SRT-Sprachen vorhanden', () => {
    expect(HUMAN_LANGS.length).toBe(10)
  })

  it('corridorwork-human-en.srt enthält englischen Text', () => {
    const content = readFileSync(join(HUMAN_SRT, 'corridorwork-human-en.srt'), 'utf-8')
    expect(content).toContain('global')
    expect(content).toContain('CorridorWork')
  })

  it('corridorwork-human-de.srt enthält deutschen Text', () => {
    const content = readFileSync(join(HUMAN_SRT, 'corridorwork-human-de.srt'), 'utf-8')
    expect(content).toContain('Talent')
  })

  it('corridorwork-human-ar.srt enthält arabischen Text', () => {
    const content = readFileSync(join(HUMAN_SRT, 'corridorwork-human-ar.srt'), 'utf-8')
    expect(content).toMatch(/[؀-ۿ]/)
  })
})

// ── 6. Video Eingebettet (Technical Draft) ────────────────────────────────────
// Phase 1: /promo-video replaced with notFound() — all content checks skipped

describe.skip('/promo-video — Video Eingebettet (page is now notFound stub)', () => {
  it('Seite referenziert corridorwork-promo-en.mp4 (draft video)', () => {
    expect(readPage()).toContain('corridorwork-promo-en.mp4')
  })

  it('Seite hat <video> Element', () => {
    expect(readPage().toLowerCase()).toContain('<video')
  })

  it('Seite hat <source> mit video/mp4', () => {
    expect(readPage()).toContain('video/mp4')
  })

  it('Seite hat subtitle <track> Elemente', () => {
    expect(readPage()).toContain('<track')
    expect(readPage()).toContain('kind="subtitles"')
  })

  it('Seite referenziert alle 10 Slide-Draft SRT-Sprachen', () => {
    const c = readPage()
    for (const lang of SLIDE_LANGS) {
      expect(c).toContain(`corridorwork-promo-${lang}.srt`)
    }
  })
})

// ── 7. Human Footage Pipeline Section ────────────────────────────────────────
// Phase 1: /promo-video replaced with notFound() — all content checks skipped

describe.skip('/promo-video — Human Footage Pipeline (page is now notFound stub)', () => {
  it('Seite enthält "Human Footage" Abschnitt', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/human.?footage/)
  })

  it('Seite zeigt Human Footage LIVE Status', () => {
    // Video is now live — shows LIVE badge or live section
    expect(readPage()).toMatch(/LIVE|Human Footage Version/i)
  })

  it('Seite enthält Human Footage final/ MP4 Verweis', () => {
    const c = readPage()
    expect(c).toContain('/promo-video/final/')
    expect(c).toContain('corridorwork-promo-human-en.mp4')
  })

  it('Seite enthält build-human-promo-video.sh Verweis', () => {
    expect(readPage()).toContain('build-human-promo-video.sh')
  })

  it('Seite enthält Human Footage Clips (.mp4)', () => {
    // Real clips referenced through the video element or data constants
    expect(readPage()).toContain('.mp4')
    expect(readPage()).toContain('HUMAN_VIDEO_CLIPS')
  })

  it('Seite enthält Pexels Lizenz-Verweis', () => {
    expect(readPage()).toContain('Pexels')
  })

  it('Seite enthält Human SRT Verweise', () => {
    expect(readPage()).toContain('corridorwork-human-en.srt')
  })

  it('Seite markiert alte Version als Technical Draft', () => {
    expect(readPage()).toContain('Technical Draft')
  })

  it('Seite enthält Voiceover Script Verweis', () => {
    // Link to voiceover script docs
    expect(readPage()).toMatch(/HUMAN_FOOTAGE_VOICEOVER_SCRIPT|voiceover/i)
  })

  it('Seite enthält Hinweis "No robot voice"', () => {
    expect(readPage().toLowerCase()).toMatch(/no robot voice|not.*robot|robot.*voice/)
  })
})

// ── 8. Compliance Banner ──────────────────────────────────────────────────────
// Phase 1: /promo-video replaced with notFound() — all content checks skipped

describe.skip('/promo-video — Compliance Banner (page is now notFound stub)', () => {
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

  it('enthält "No unlicensed media" oder "licensed"', () => {
    const c = readPage().toLowerCase()
    expect(c).toMatch(/no unlicensed|licensed|no.*illegal.*media/)
  })
})

// ── 9. Brand & Domain ─────────────────────────────────────────────────────────

describe('/promo-video — Brand & Domain', () => {
  it.skip('enthält "CorridorWork"', () => {
    // Phase 1: /promo-video replaced with notFound() — no brand text in page
    expect(readPage()).toContain('CorridorWork')
  })

  it.skip('enthält "corridorwork.com"', () => {
    // Phase 1: /promo-video replaced with notFound()
    expect(readPage()).toContain('corridorwork.com')
  })

  it('enthält KEINE alten Markennamen', () => {
    const c = readPage()
    expect(c).not.toContain('Global Talent Bridge')
    expect(c).not.toContain('SlotFill')
    expect(c).not.toContain('Slot Fill')
  })
})

// ── 10. Forbidden Phrases ─────────────────────────────────────────────────────

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

// ── 11. Safety Invariants ─────────────────────────────────────────────────────

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

  it.skip('enthält Stripe/payments-Hinweis', () => {
    // Phase 1: /promo-video replaced with notFound() — no content in page
    const c = readPage().toLowerCase()
    expect(c).toMatch(/no stripe|not activated|no payments/)
  })

  it('kein YouTube-Clip-Verweis', () => {
    const c = readPage().toLowerCase()
    expect(c).not.toContain('youtube.com/watch')
  })
})

// ── 12. Human Storyboard Scenes ───────────────────────────────────────────────
// Phase 1: /promo-video replaced with notFound() — all content checks skipped

describe.skip('/promo-video — Human Storyboard Szenen (page is now notFound stub)', () => {
  it('enthält Scene "THE PROBLEM"', () => {
    expect(readPage()).toContain('THE PROBLEM')
  })

  it('enthält Scene "GLOBAL TALENT"', () => {
    expect(readPage()).toContain('GLOBAL TALENT')
  })

  it('enthält Scene "CORRIDORWORK"', () => {
    expect(readPage()).toContain('CORRIDORWORK')
  })

  it('enthält Scene "MULTIPLE SECTORS"', () => {
    expect(readPage()).toContain('MULTIPLE SECTORS')
  })

  it('enthält Scene "FOR WHOM"', () => {
    expect(readPage()).toContain('FOR WHOM')
  })

  it('enthält Scene "CALL TO ACTION"', () => {
    expect(readPage()).toContain('CALL TO ACTION')
  })

  it('enthält Zeitstempel 0:00', () => {
    expect(readPage()).toContain('0:00')
  })

  it('enthält Zeitstempel 0:49', () => {
    expect(readPage()).toContain('0:49')
  })
})

// ── 13. Language Codes (Human Version) ────────────────────────────────────────
// Phase 1: /promo-video replaced with notFound() — all content checks skipped

describe.skip('/promo-video — 10 Sprachcodes (Human Version) (page is now notFound stub)', () => {
  for (const lang of HUMAN_LANGS) {
    it(`enthält Sprachcode "${lang}" (human SRT)`, () => {
      expect(readPage()).toContain(`corridorwork-human-${lang}.srt`)
    })
  }
})

// ── 14. CTAs ──────────────────────────────────────────────────────────────────
// Phase 1: /promo-video replaced with notFound() — all content checks skipped

describe.skip('/promo-video — CTAs (page is now notFound stub)', () => {
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

// ── 15. Component Structure ───────────────────────────────────────────────────

describe('/promo-video — Komponenten-Struktur', () => {
  it.skip('importiert PublicFooter', () => {
    // Phase 1: /promo-video replaced with notFound() — no PublicFooter import needed
    expect(readPage()).toContain('PublicFooter')
  })

  it('exportiert default function PromoVideoPage', () => {
    expect(readPage()).toContain('export default function PromoVideoPage')
  })

  it('enthält metadata export', () => {
    expect(readPage()).toContain('export const metadata')
  })
})

// ── 16. Build Scripts ─────────────────────────────────────────────────────────

describe('/promo-video — Build Scripts', () => {
  it('build-promo-video.py enthält "ffmpeg"', () => {
    expect(readFileSync(BUILD_SLIDE, 'utf-8')).toContain('ffmpeg')
  })

  it('build-promo-video.py enthält "CorridorWork"', () => {
    expect(readFileSync(BUILD_SLIDE, 'utf-8')).toContain('CorridorWork')
  })

  it('build-human-promo-video.sh enthält "ffmpeg"', () => {
    expect(readFileSync(BUILD_HUMAN, 'utf-8')).toContain('ffmpeg')
  })

  it('build-human-promo-video.sh enthält "CorridorWork"', () => {
    expect(readFileSync(BUILD_HUMAN, 'utf-8')).toContain('CorridorWork')
  })

  it('build-human-promo-video.sh enthält "source-clips"', () => {
    expect(readFileSync(BUILD_HUMAN, 'utf-8')).toContain('source-clips')
  })

  it('build-human-promo-video.sh enthält "corridorwork-promo-human-en.mp4"', () => {
    expect(readFileSync(BUILD_HUMAN, 'utf-8')).toContain('corridorwork-promo-human-en.mp4')
  })

  it('build-human-promo-video.sh enthält keine verbotenen Versprechen', () => {
    const c = readFileSync(BUILD_HUMAN, 'utf-8').toLowerCase()
    expect(c).not.toContain('guaranteed job')
    expect(c).not.toContain('guaranteed visa')
  })
})

// ── 17. Asset List Documentation ──────────────────────────────────────────────

describe('/promo-video — Asset List Dokumentation', () => {
  it('HUMAN_FOOTAGE_ASSET_LIST.md enthält Clip-Beschreibungen', () => {
    const c = readFileSync(ASSET_LIST, 'utf-8')
    expect(c).toContain('healthcare')
    expect(c).toContain('source-clips')
  })

  it('HUMAN_FOOTAGE_ASSET_LIST.md enthält Lizenz-Anforderungen', () => {
    const c = readFileSync(ASSET_LIST, 'utf-8')
    expect(c).toContain('Pexels')
    expect(c).toContain('license')
  })

  it('HUMAN_FOOTAGE_ASSET_LIST.md verbietet YouTube-Clips', () => {
    const c = readFileSync(ASSET_LIST, 'utf-8')
    expect(c).toMatch(/youtube.*no|no.*youtube/i)
  })

  it('HUMAN_FOOTAGE_ASSET_LIST.md enthält CorridorWork', () => {
    expect(readFileSync(ASSET_LIST, 'utf-8')).toContain('CorridorWork')
  })

  it('HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md enthält Voiceover-Text', () => {
    const c = readFileSync(VO_SCRIPT, 'utf-8')
    expect(c).toContain('CorridorWork')
    expect(c).toContain('corridorwork.com')
  })

  it('HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md enthält keinen Roboterstimmen-Hinweis als OK', () => {
    const c = readFileSync(VO_SCRIPT, 'utf-8').toLowerCase()
    expect(c).toMatch(/no robot|not.*robot|do not use.*robot/)
  })

  it('HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md enthält keine verbotenen Job-Garantien', () => {
    const c = readFileSync(VO_SCRIPT, 'utf-8').toLowerCase()
    expect(c).not.toContain('guaranteed job')
    expect(c).not.toContain('guaranteed visa')
  })
})

// ── 18. Voiceover Recording Guide (Human Voiceover Integration Sprint) ─────────

// Phase 1: /promo-video replaced with notFound() — page content tests skipped
describe('/promo-video — Voiceover Recording Guide', () => {
  it.skip('zeigt "Visual preview with subtitles" (kein LIVE bei fehlendem Voiceover)', () => {
    expect(readPage()).toMatch(/Visual preview with subtitles/i)
  })

  it.skip('enthält "Record a natural voiceover using this script"', () => {
    expect(readPage()).toMatch(/Record a natural voiceover using this script/i)
  })

  it.skip('enthält ersten Satz des finalen englischen Skripts', () => {
    expect(readPage()).toMatch(/Across the world, employers are searching for skilled people/i)
  })

  it.skip('enthält "CorridorWork helps structure that connection"', () => {
    expect(readPage()).toContain('CorridorWork helps structure that connection')
  })

  it.skip('enthält Dropzone-Pfad für Voiceover-Datei', () => {
    expect(readPage()).toContain('corridorwork-vo-en-human.wav')
  })

  it.skip('enthält "No robot voice" Hinweis (Roboterstimme wird nicht als final dargestellt)', () => {
    const p = readPage().toLowerCase()
    expect(p).toMatch(/no robot voice/)
  })

  it('präsentiert keine Roboterstimme als finale Version', () => {
    const p = readPage()
    // Must not claim robot voice is the finished/final audio
    expect(p).not.toMatch(/robot voice.*is.*final|robot.*audio.*final.*version.*complete/i)
  })

  it.skip('Script enthält "No job guarantee" (Compliance im Skript)', () => {
    expect(readPage()).toMatch(/No job guarantee/i)
  })

  it.skip('Script enthält "No visa guarantee" (Compliance im Skript)', () => {
    expect(readPage()).toMatch(/No visa guarantee/i)
  })

  it.skip('Script enthält "No automatic outreach" (Compliance im Skript)', () => {
    expect(readPage()).toMatch(/No automatic outreach/i)
  })

  it('HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md enthält finales Skript (ersten Satz)', () => {
    const c = readFileSync(VO_SCRIPT, 'utf-8')
    expect(c).toContain('Across the world, employers are searching for skilled people')
  })

  it('HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md enthält Dropzone-Pfad', () => {
    const c = readFileSync(VO_SCRIPT, 'utf-8')
    expect(c).toContain('corridorwork-vo-en-human.wav')
  })

  it('kein aktives Stripe (keine stripe.com Integration)', () => {
    const c = readPage()
    expect(c).not.toContain('stripe.com')
    expect(c).not.toMatch(/new Stripe\(|stripe\.createCharge/i)
  })

  it('kein E-Mail-Versand', () => {
    expect(readPage()).not.toMatch(/sendEmail\(|nodemailer|resend\.send/i)
  })

  it('kein Scraping', () => {
    expect(readPage()).not.toMatch(/puppeteer|cheerio|playwright\.chromium/i)
  })
})
