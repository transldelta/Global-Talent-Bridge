/**
 * __tests__/promo-video-preview-guard.test.ts
 *
 * Promo Video Preview Guard — test suite
 *
 * Verifies that /promo-video is correctly marked as a visual preview
 * until a final human voiceover is recorded and committed.
 *
 * Tests:
 *  1. Page metadata has noindex
 *  2. Page shows visual-preview warning banner (when no final audio)
 *  3. Primary heading does not claim "Version" — uses "Visual Preview"
 *  4. No false audio claims anywhere in the page source
 *  5. docs/video/final-voiceover-required.md exists and is complete
 *  6. scripts/check-video-audio.sh exists, is read-only, reports AUDIO_TRACK_PRESENT
 *  7. Final with-audio file status check
 *  8. Safety sweep — no robot voice as human, no fake audio claim
 *
 * Safety rules (always active):
 *  - No robot voice sold as human. No TTS sold as final.
 *  - No job guarantee. No visa guarantee. No fake revenue.
 *  - noindex stays until final human voiceover is committed.
 */

import { readFileSync, existsSync, statSync } from 'fs'
import { join } from 'path'

const ROOT       = join(__dirname, '..')
const PAGE_FILE  = join(ROOT, 'app/promo-video/page.tsx')
const DOC_FILE   = join(ROOT, 'docs/video/final-voiceover-required.md')
const SCRIPT     = join(ROOT, 'scripts/check-video-audio.sh')
const FINAL_MP4  = join(ROOT, 'public/promo-video/final/corridorwork-promo-human-en-final.mp4')
const SILENT_MP4 = join(ROOT, 'public/promo-video/final/corridorwork-promo-human-en.mp4')

function readPage(): string {
  if (!existsSync(PAGE_FILE)) throw new Error('Missing: app/promo-video/page.tsx')
  return readFileSync(PAGE_FILE, 'utf-8')
}

// ── 1. Page metadata ──────────────────────────────────────────────────────────

describe('/promo-video page — metadata', () => {
  it('page file exists', () => {
    expect(existsSync(PAGE_FILE)).toBe(true)
  })

  it('metadata includes robots noindex', () => {
    const src = readPage()
    // Must have robots: 'noindex...' in the metadata export
    expect(src).toMatch(/robots\s*:\s*['"]noindex/)
  })

  it('noindex applies nofollow as well', () => {
    const src = readPage()
    expect(src).toMatch(/noindex.*nofollow|nofollow.*noindex/)
  })
})

// ── 2. Visual preview warning banner ─────────────────────────────────────────

describe('/promo-video page — visual preview banner', () => {
  it.skip('page source contains internal visual preview warning text', () => {
    // Phase 1: /promo-video replaced with notFound() — no preview banner shown
    const src = readPage()
    expect(src).toMatch(/Internal visual preview only|Do not use this page as a sales.*buyer.*or marketing asset/i)
  })

  it.skip('banner is conditionally shown based on FINAL_AUDIO_EXISTS', () => {
    // Phase 1: /promo-video replaced with notFound()
    const src = readPage()
    expect(src).toMatch(/!FINAL_AUDIO_EXISTS[\s\S]{0,500}Internal visual preview only/i)
  })

  it('page metadata has noindex (page is not indexed)', () => {
    const src = readPage()
    // noindex is in the metadata export, not necessarily the banner text
    expect(src).toMatch(/robots\s*:\s*['"]noindex/)
  })

  it.skip('banner references the voiceover required doc', () => {
    // Phase 1: /promo-video replaced with notFound()
    const src = readPage()
    expect(src).toContain('final-voiceover-required.md')
  })

  it.skip('banner explains video has no audio track', () => {
    // Phase 1: /promo-video replaced with notFound()
    const src = readPage()
    expect(src).toMatch(/no audio track|no final audio|no.*voiceover.*included/i)
  })
})

// ── 3. Primary heading ────────────────────────────────────────────────────────

describe('/promo-video page — primary heading', () => {
  it.skip('primary heading uses "Visual Preview" when no final audio', () => {
    // Phase 1: /promo-video replaced with notFound() — no heading rendered
    const src = readPage()
    expect(src).toMatch(/Human Footage — Visual Preview/)
  })

  it('primary heading does not use bare "Human Footage Version" (misleading)', () => {
    const src = readPage()
    // "Human Footage Version" (without qualifier) must not appear as a standalone heading value
    // It's acceptable in comments, but not as the rendered heading for the preview state
    const headingBlock = src.match(/FINAL_AUDIO_EXISTS\s*\?[^:]+:\s*['"]([^'"]+)['"]/)
    if (headingBlock) {
      // The false-branch heading must not be bare "Human Footage Version"
      expect(headingBlock[1]).not.toBe('Human Footage Version')
    }
  })
})

// ── 4. No false audio claims ──────────────────────────────────────────────────

describe('/promo-video page — no false audio claims', () => {
  it('does not claim the silent video has voiceover', () => {
    const src = readPage()
    // Should not say "with voiceover" or "has audio" about the silent human footage
    expect(src).not.toMatch(/corridorwork-promo-human-en\.mp4.*with voiceover/i)
    expect(src).not.toMatch(/human footage.*has audio/i)
  })

  it('does not claim TTS audio is human', () => {
    const src = readPage()
    // The TTS draft must not claim to be a human voiceover
    expect(src).not.toMatch(/macOS Samantha.*human voice|TTS.*human voiceover/i)
  })

  it('does not mark preview as WITH AUDIO badge when final file missing', () => {
    const src = readPage()
    // The "WITH AUDIO" badge only renders inside FINAL_AUDIO_EXISTS block
    const withAudioIdx    = src.indexOf('WITH AUDIO')
    const finalExistsIdx  = src.indexOf('FINAL_AUDIO_EXISTS &&')
    if (withAudioIdx > -1 && finalExistsIdx > -1) {
      // The WITH AUDIO text must come after the FINAL_AUDIO_EXISTS guard
      expect(withAudioIdx).toBeGreaterThan(finalExistsIdx)
    }
  })
})

// ── 5. docs/video/final-voiceover-required.md ───────────────────────────────

describe('docs/video/final-voiceover-required.md — completeness', () => {
  it('file exists', () => {
    expect(existsSync(DOC_FILE)).toBe(true)
  })

  it('states current status: AUDIO_TRACK_PRESENT false', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8')
    expect(doc).toMatch(/AUDIO_TRACK_PRESENT.*false/i)
  })

  it('documents the final target filename', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8')
    expect(doc).toContain('corridorwork-promo-human-en-final.mp4')
  })

  it('specifies accepted audio formats', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8')
    expect(doc).toMatch(/wav|mp3|m4a/i)
  })

  it('references mix script', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8')
    expect(doc).toContain('mix-human-voiceover.sh')
  })

  it('references check script', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8')
    expect(doc).toContain('check-video-audio.sh')
  })

  it('states noindex is active', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8')
    expect(doc).toMatch(/noindex/i)
  })

  it('says no robot voice', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8').toLowerCase()
    expect(doc).toMatch(/no robot voice|not.*robot|no tts/)
  })

  it('says no job guarantee', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8').toLowerCase()
    expect(doc).toMatch(/no job guarantee/)
  })

  it('says no visa guarantee', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8').toLowerCase()
    expect(doc).toMatch(/no visa guarantee/)
  })

  it('does not itself make false audio claims', () => {
    const doc = readFileSync(DOC_FILE, 'utf-8').toLowerCase()
    expect(doc).not.toMatch(/audio.*ready|voiceover.*complete|human voice.*done/i)
  })
})

// ── 6. scripts/check-video-audio.sh ──────────────────────────────────────────

describe('scripts/check-video-audio.sh — content and safety', () => {
  it('script file exists', () => {
    expect(existsSync(SCRIPT)).toBe(true)
  })

  it('script reports AUDIO_TRACK_PRESENT', () => {
    const sh = readFileSync(SCRIPT, 'utf-8')
    expect(sh).toContain('AUDIO_TRACK_PRESENT')
  })

  it('script is read-only — does not call ffmpeg (write operations)', () => {
    const sh = readFileSync(SCRIPT, 'utf-8')
    // check-video-audio uses ffprobe only — must NOT call ffmpeg
    expect(sh).not.toMatch(/ffmpeg\s+-[iy]|ffmpeg.*-codec|ffmpeg.*output/i)
    // Must not modify any files
    expect(sh).toContain('No files were modified')
  })

  it('script uses ffprobe for read-only check', () => {
    const sh = readFileSync(SCRIPT, 'utf-8')
    expect(sh).toContain('ffprobe')
  })

  it('script references final target file', () => {
    const sh = readFileSync(SCRIPT, 'utf-8')
    expect(sh).toContain('corridorwork-promo-human-en-final.mp4')
  })

  it('script references docs/video/final-voiceover-required.md', () => {
    const sh = readFileSync(SCRIPT, 'utf-8')
    expect(sh).toContain('final-voiceover-required.md')
  })

  it('script does not send or upload anything', () => {
    const sh = readFileSync(SCRIPT, 'utf-8')
    expect(sh).not.toMatch(/curl.*upload|wget.*upload|aws s3 cp|gsutil cp/i)
    expect(sh).not.toMatch(/sendEmail|nodemailer/i)
  })

  it('script exits 0 (non-blocking — does not break build)', () => {
    const sh = readFileSync(SCRIPT, 'utf-8')
    expect(sh).toContain('exit 0')
  })
})

// ── 7. Final audio file status ────────────────────────────────────────────────

describe('Video files — audio track status (source of truth)', () => {
  it('silent human footage file exists', () => {
    expect(existsSync(SILENT_MP4)).toBe(true)
  })

  it('silent human footage is larger than 5MB', () => {
    const size = statSync(SILENT_MP4).size
    expect(size).toBeGreaterThan(5 * 1024 * 1024)
  })

  it('final with-audio file does NOT exist yet (correct — voiceover not recorded)', () => {
    // This test passes as long as the final file is missing.
    // When voiceover is recorded and committed, this test should be UPDATED
    // to expect existsSync(FINAL_MP4) === true.
    expect(existsSync(FINAL_MP4)).toBe(false)
  })
})

// ── 8. Safety sweep ───────────────────────────────────────────────────────────

describe('Promo video preview — safety sweep', () => {
  it('page does not promise audio is ready', () => {
    const src = readPage().toLowerCase()
    expect(src).not.toMatch(/voiceover.*complete|audio.*ready.*for sale/i)
  })

  it.skip('page does not position robot voice as final/human voiceover', () => {
    // Phase 1: /promo-video replaced with notFound() — no content to check
    const src = readPage().toLowerCase()
    expect(src).not.toMatch(/tts.*is.*human voiceover|robot voice.*is.*final|robot.*audio.*is.*complete/i)
    expect(src).toMatch(/not a final version|not.*final/i)
  })

  it('page does not have autoplay without muted (unexpected auto-audio)', () => {
    const src = readPage()
    // autoplay without muted would blast audio at visitors unexpectedly
    const autoplayWithoutMuted = /autoplay(?![^}]*muted)/
    expect(src).not.toMatch(autoplayWithoutMuted)
  })

  it.skip('all three video sections have controls attribute', () => {
    // Phase 1: /promo-video replaced with notFound() — 0 video sections
    const src = readPage()
    const videoControlsCount = (src.match(/<video[\s\S]{0,200}controls/g) || []).length
    expect(videoControlsCount).toBeGreaterThanOrEqual(2)
  })

  it.skip('page does not claim audio is human when TTS draft is shown', () => {
    // Phase 1: /promo-video replaced with notFound() — no TTS/audio content
    const src = readPage()
    expect(src).toMatch(/TTS|macOS Samantha|NOT FINAL|not.*final/i)
  })
})

// ── 9. Public link text — homepage and footer ─────────────────────────────────

describe('Public /promo-video links — removed from public pages (no audio track)', () => {
  const HOMEPAGE = join(ROOT, 'app/page.tsx')
  const FOOTER   = join(ROOT, 'app/_components/PublicFooter.tsx')

  let homepage: string
  let footer: string
  beforeAll(() => {
    homepage = readFileSync(HOMEPAGE, 'utf-8')
    footer   = readFileSync(FOOTER, 'utf-8')
  })

  // Homepage — all /promo-video links removed
  it('homepage does NOT link to /promo-video (removed — no audio track, not sale-ready)', () => {
    expect(homepage).not.toContain('/promo-video')
  })

  it('homepage does not use "Watch the overview" (implies finished product)', () => {
    expect(homepage).not.toContain('Watch the overview')
  })

  it('homepage does not use "Watch 60-second overview" (implies finished product)', () => {
    expect(homepage).not.toContain('Watch 60-second overview')
  })

  it('homepage does not use bare "Watch overview" text (implies finished product)', () => {
    const bareWatchOverview = />\s*Watch overview\s*</
    expect(homepage).not.toMatch(bareWatchOverview)
  })

  it('homepage video card does NOT show "Promo Video" as a prominent label', () => {
    expect(homepage).not.toMatch(/>\s*Promo Video\s*</)
  })

  it('homepage video section description does not promise finished video content', () => {
    expect(homepage).not.toContain('A 60-second walkthrough')
  })

  // Footer — /promo-video link removed
  it('PublicFooter.tsx does NOT contain public /promo-video link (removed until voiceover ready)', () => {
    expect(footer).not.toContain('href="/promo-video"')
  })

  it('footer does not use "Promo Video" as link text (implies finished product)', () => {
    expect(footer).not.toMatch(/>\s*Promo Video\s*</)
  })
})
