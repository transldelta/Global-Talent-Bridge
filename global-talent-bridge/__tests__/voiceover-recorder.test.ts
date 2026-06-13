/**
 * __tests__/voiceover-recorder.test.ts
 *
 * Tests for /admin/voiceover-recorder and related voiceover infrastructure.
 * Verifies: auth protection, voiceover script content, no robot TTS,
 * download instructions, mix script, upload API, safety invariants.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')

const RECORDER_PAGE    = join(ROOT, 'app/admin/voiceover-recorder/page.tsx')
const RECORDER_CLIENT  = join(ROOT, 'app/admin/voiceover-recorder/VoiceoverRecorderClient.tsx')
const UPLOAD_API       = join(ROOT, 'app/api/admin/promo-video/voiceover-upload/route.ts')
const MIX_SCRIPT       = join(ROOT, 'scripts/mix-human-voiceover.sh')
const PROMO_PAGE       = join(ROOT, 'app/promo-video/page.tsx')
const VO_SCRIPT_DOC    = join(ROOT, 'docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md')

function readFile(path: string): string {
  if (!existsSync(path)) throw new Error(`Missing file: ${path}`)
  return readFileSync(path, 'utf-8')
}

// ── 1. File Existence ─────────────────────────────────────────────────────────

describe('/admin/voiceover-recorder — File Existence', () => {
  it('app/admin/voiceover-recorder/page.tsx exists', () => {
    expect(existsSync(RECORDER_PAGE)).toBe(true)
  })

  it('app/admin/voiceover-recorder/VoiceoverRecorderClient.tsx exists', () => {
    expect(existsSync(RECORDER_CLIENT)).toBe(true)
  })

  it('app/api/admin/promo-video/voiceover-upload/route.ts exists', () => {
    expect(existsSync(UPLOAD_API)).toBe(true)
  })

  it('scripts/mix-human-voiceover.sh exists', () => {
    expect(existsSync(MIX_SCRIPT)).toBe(true)
  })
})

// ── 2. Auth Protection ────────────────────────────────────────────────────────

describe('/admin/voiceover-recorder — Auth Protection', () => {
  it('page uses getCurrentAdminUser for auth check', () => {
    const p = readFile(RECORDER_PAGE)
    expect(p).toContain('getCurrentAdminUser')
  })

  it('page redirects to /auth/login if not admin', () => {
    const p = readFile(RECORDER_PAGE)
    expect(p).toContain("redirect('/auth/login")
  })

  it('page has robots noindex (admin-only)', () => {
    const p = readFile(RECORDER_PAGE)
    expect(p).toContain('noindex')
  })

  it('upload API checks getCurrentAdminUser', () => {
    const p = readFile(UPLOAD_API)
    expect(p).toContain('getCurrentAdminUser')
  })

  it('upload API returns 401 for unauthenticated requests', () => {
    const p = readFile(UPLOAD_API)
    expect(p).toContain('Unauthorized')
    expect(p).toContain('401')
  })
})

// ── 3. Voiceover Script Content ───────────────────────────────────────────────

describe('/admin/voiceover-recorder — Voiceover Script', () => {
  it('client contains first line of final voiceover script', () => {
    expect(readFile(RECORDER_CLIENT)).toContain(
      'Across the world, employers are searching for skilled people'
    )
  })

  it('client contains "CorridorWork helps structure that connection"', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('CorridorWork helps structure that connection')
  })

  it('client contains "No job guarantee" in script', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('No job guarantee')
  })

  it('client contains "No visa guarantee" in script', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('No visa guarantee')
  })

  it('client contains "No automatic outreach" in script', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('No automatic outreach')
  })

  it('client contains "Visit corridorwork.com" in script', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('Visit corridorwork.com')
  })

  it('client script text spans ~16 paragraphs', () => {
    const content = readFile(RECORDER_CLIENT)
    const scriptMatch = content.match(/VOICEOVER_SCRIPT\s*=\s*`([\s\S]*?)`/)
    expect(scriptMatch).not.toBeNull()
    const lines = scriptMatch![1].split('\n\n').filter(l => l.trim().length > 0)
    expect(lines.length).toBeGreaterThanOrEqual(10)
  })
})

// ── 4. Recording UI ───────────────────────────────────────────────────────────

describe('/admin/voiceover-recorder — Recording UI', () => {
  it('client uses MediaRecorder API', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('MediaRecorder')
  })

  it('client has Start recording button', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('Start recording')
  })

  it('client has Stop recording button', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('Stop recording')
  })

  it('client has Play preview button', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('Play preview')
  })

  it('client has Download voiceover file button', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('Download voiceover file')
  })

  it('client downloads file as corridorwork-vo-en-human.*', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('corridorwork-vo-en-human')
  })

  it('client has Upload to project button', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('Upload to project')
  })

  it('client shows recording tips', () => {
    const c = readFile(RECORDER_CLIENT)
    expect(c).toMatch(/quiet room|ruhiger Raum|quiet/i)
    expect(c).toMatch(/slowly|slowly and clearly|langsam/i)
  })
})

// ── 5. Download / Upload Instructions ────────────────────────────────────────

describe('/admin/voiceover-recorder — Download & Upload Instructions', () => {
  it('client explains where to place the downloaded file', () => {
    expect(readFile(RECORDER_CLIENT)).toContain(
      'public/promo-video/source-clips/audio'
    )
  })

  it('client mentions the mix script command', () => {
    expect(readFile(RECORDER_CLIENT)).toContain('mix-human-voiceover.sh')
  })

  it('upload API is honest about Vercel filesystem limitation', () => {
    const p = readFile(UPLOAD_API)
    expect(p).toMatch(/Vercel|ephemeral|not persistent/i)
    expect(p).toContain('localOnly')
  })

  it('upload API points to correct save path', () => {
    expect(readFile(UPLOAD_API)).toContain('source-clips/audio')
  })
})

// ── 6. Mix Script ─────────────────────────────────────────────────────────────

describe('scripts/mix-human-voiceover.sh', () => {
  it('script uses ffmpeg', () => {
    expect(readFile(MIX_SCRIPT)).toContain('ffmpeg')
  })

  it('script accepts .webm format', () => {
    expect(readFile(MIX_SCRIPT)).toContain('webm')
  })

  it('script accepts .m4a format', () => {
    expect(readFile(MIX_SCRIPT)).toContain('m4a')
  })

  it('script accepts .mp3 format', () => {
    expect(readFile(MIX_SCRIPT)).toContain('mp3')
  })

  it('script accepts .wav format', () => {
    expect(readFile(MIX_SCRIPT)).toContain('wav')
  })

  it('script applies audio normalization (loudnorm)', () => {
    expect(readFile(MIX_SCRIPT)).toContain('loudnorm')
  })

  it('script copies video stream without re-encoding (-c:v copy)', () => {
    expect(readFile(MIX_SCRIPT)).toContain('-c:v copy')
  })

  it('script outputs corridorwork-promo-human-en-final.mp4', () => {
    expect(readFile(MIX_SCRIPT)).toContain('corridorwork-promo-human-en-final.mp4')
  })

  it('script uses source video corridorwork-promo-human-en.mp4', () => {
    expect(readFile(MIX_SCRIPT)).toContain('corridorwork-promo-human-en.mp4')
  })

  it('script verifies audio track present in output', () => {
    const s = readFile(MIX_SCRIPT)
    expect(s).toMatch(/HAS_AUDIO|audio.*track|no audio/i)
  })

  it('script provides next-step instructions after mix', () => {
    expect(readFile(MIX_SCRIPT)).toContain('git add')
    expect(readFile(MIX_SCRIPT)).toContain('git commit')
    expect(readFile(MIX_SCRIPT)).toContain('git push')
  })
})

// ── 7. /promo-video page — conditional final version ─────────────────────────

describe('/promo-video — Conditional final version display', () => {
  it.skip('page imports existsSync for final video check', () => {
    // Phase 1: /promo-video replaced with notFound() — no video content served publicly
    expect(readFile(PROMO_PAGE)).toContain('existsSync')
  })

  it.skip('page has FINAL_AUDIO_EXISTS constant', () => {
    // Phase 1: /promo-video replaced with notFound()
    expect(readFile(PROMO_PAGE)).toContain('FINAL_AUDIO_EXISTS')
  })

  it.skip('page references corridorwork-promo-human-en-final.mp4', () => {
    // Phase 1: /promo-video replaced with notFound()
    expect(readFile(PROMO_PAGE)).toContain('corridorwork-promo-human-en-final.mp4')
  })

  it.skip('page has "Human voiceover version" label for final section', () => {
    // Phase 1: /promo-video replaced with notFound()
    expect(readFile(PROMO_PAGE)).toContain('Human voiceover version')
  })

  it('page does NOT link to /admin (no admin links on public page)', () => {
    const p = readFile(PROMO_PAGE)
    expect(p).not.toMatch(/href="\/admin/)
    expect(p).not.toMatch(/href='\/admin/)
    expect(p).not.toContain('voiceover-recorder')
  })

  it.skip('page still shows visual preview section with honest label', () => {
    // Phase 1: /promo-video replaced with notFound()
    expect(readFile(PROMO_PAGE)).toContain('VISUAL PREVIEW')
  })
})

// ── 8. Safety Invariants ──────────────────────────────────────────────────────

describe('/admin/voiceover-recorder — Safety Invariants', () => {
  it('recorder page explicitly states no robot voice (safety note present)', () => {
    // Must say "No robot voice" as a safety note — NOT use robot TTS
    const p = readFile(RECORDER_PAGE)
    expect(p).toMatch(/No robot voice|no robot voice/i)
    // Must NOT claim robot voice is acceptable or finished
    expect(p).not.toMatch(/robot voice.*is.*final|robot.*voice.*ok/i)
  })

  it('recorder client has no active TTS/robot voice implementation', () => {
    const c = readFile(RECORDER_CLIENT)
    // No browser TTS API usage
    expect(c).not.toContain('speechSynthesis')
    expect(c).not.toContain('SpeechSynthesisUtterance')
    // No robot voice claim as ready
    expect(c).not.toMatch(/robot voice.*ready|tts.*final/i)
  })

  it('recorder client has no active Stripe payment integration', () => {
    const c = readFile(RECORDER_CLIENT)
    // Must not have active Stripe SDK calls (having "No Stripe" safety text is fine)
    expect(c).not.toContain('stripe.com')
    expect(c).not.toMatch(/new Stripe\(|stripe\.createCharge|loadStripe/i)
  })

  it('recorder client has no email sending', () => {
    expect(readFile(RECORDER_CLIENT)).not.toMatch(/sendEmail|nodemailer|resend\.send/i)
  })

  it('recorder client has no scraping', () => {
    expect(readFile(RECORDER_CLIENT)).not.toMatch(/puppeteer|cheerio|playwright/i)
  })

  it('upload API has no active Stripe integration (having "No Stripe" safety text is fine)', () => {
    const p = readFile(UPLOAD_API)
    expect(p).not.toContain('stripe.com')
    expect(p).not.toMatch(/new Stripe\(|stripe\.createCharge|loadStripe/i)
  })

  it('upload API has no email sending', () => {
    expect(readFile(UPLOAD_API)).not.toMatch(/sendEmail|nodemailer|resend\.send/i)
  })

  it('mix script has no macOS say command', () => {
    expect(readFile(MIX_SCRIPT)).not.toMatch(/^say\s|`say\s/m)
  })

  it('mix script has no job guarantee language', () => {
    expect(readFile(MIX_SCRIPT).toLowerCase()).not.toContain('guaranteed job')
  })
})

// ── 9. /promo-video page safety (no admin links) ──────────────────────────────

describe('/promo-video — No admin links on public page', () => {
  it('promo-video page has no /admin link', () => {
    const p = readFile(PROMO_PAGE)
    expect(p).not.toMatch(/href="\/admin/)
    expect(p).not.toMatch(/href='\/admin/)
  })

  it('promo-video page has no voiceover-recorder link', () => {
    expect(readFile(PROMO_PAGE)).not.toContain('/admin/voiceover-recorder')
  })

  it('promo-video page has no dashboard link', () => {
    const p = readFile(PROMO_PAGE)
    expect(p).not.toContain('/candidate/dashboard')
    expect(p).not.toContain('/employer/dashboard')
  })
})
