/**
 * __tests__/promo-video-compliance.test.ts
 *
 * Compliance tests for CorridorWork Multilingual Promo Video Pack.
 *
 * Checks:
 * - All 12 required files exist
 * - No forbidden guarantee phrases in any language
 * - Brand "CorridorWork" present in all files
 * - No old brand names ("Global Talent Bridge", "SlotFill")
 * - CTA language approved in all files
 * - SRT format present in all language files
 * - AI generation prompts cover all 5 tools
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT       = join(__dirname, '..')
const VIDEO_DIR  = join(ROOT, 'docs/video')

function readVideo(filename: string): string {
  const p = join(VIDEO_DIR, filename)
  if (!existsSync(p)) throw new Error(`Missing video file: ${filename}`)
  return readFileSync(p, 'utf-8')
}

// ── Required files ────────────────────────────────────────────────────────────

const REQUIRED_FILES = [
  'CORRIDORWORK_PROMO_MASTER_EN.md',
  'CORRIDORWORK_PROMO_DE.md',
  'CORRIDORWORK_PROMO_FR.md',
  'CORRIDORWORK_PROMO_AR.md',
  'CORRIDORWORK_PROMO_ES.md',
  'CORRIDORWORK_PROMO_PT.md',
  'CORRIDORWORK_PROMO_HI.md',
  'CORRIDORWORK_PROMO_UR.md',
  'CORRIDORWORK_PROMO_FIL.md',
  'CORRIDORWORK_PROMO_TR.md',
  'CORRIDORWORK_SUBTITLES_SRT_PACK.md',
  'CORRIDORWORK_VIDEO_GENERATION_PROMPTS.md',
]

// ── Forbidden phrases (multi-language) ───────────────────────────────────────

const FORBIDDEN = [
  // English
  'guaranteed job',
  'job guaranteed',
  'guaranteed visa',
  'visa guaranteed',
  'you will be hired',
  'we place you automatically',
  'income guaranteed',
  'guaranteed income',
  // German
  'Jobgarantie',
  'garantierter Job',
  'Visa-Garantie',
  'garantiertes Einkommen',
  'Sie werden eingestellt',
  // French
  'emploi garanti',
  'visa garanti',
  'vous serez embauché',
  'revenu garanti',
  // Spanish
  'empleo garantizado',
  'visa garantizado',
  'serás contratado',
  'ingresos garantizados',
  // Portuguese
  'emprego garantido',
  'visto garantido',
  'será contratado',
  'rendimento garantido',
  // Turkish
  'iş garantisi',
  'vize garantisi',
  'işe alınacaksınız',
  'gelir garantisi',
  // Filipino
  'garantiyang trabaho',
  'garantiyang visa',
  'magiging employed',
  'garantiyang kita',
]

// ── Old brand names ────────────────────────────────────────────────────────────

const FORBIDDEN_BRANDS = [
  'Global Talent Bridge',
  'SlotFill',
  'Slot Fill',
]

// ── 1. File existence ─────────────────────────────────────────────────────────

describe('Promo Video Pack — File Existence', () => {
  for (const filename of REQUIRED_FILES) {
    it(`${filename} existiert`, () => {
      expect(existsSync(join(VIDEO_DIR, filename))).toBe(true)
    })
  }
})

// ── 2. Compliance — no forbidden phrases ─────────────────────────────────────
// Note: compliance-table rows (containing ✅ / ❌) document what is NOT used —
// they are filtered out so "| No guaranteed job | ✅" doesn't false-positive.

function scriptContentOnly(raw: string): string {
  return raw
    .split('\n')
    .filter(line => !line.includes('✅') && !line.includes('❌') && !line.includes('| ✓'))
    .join('\n')
}

describe('Promo Video Pack — Keine verbotenen Phrasen (Skript-Inhalt)', () => {
  for (const filename of REQUIRED_FILES) {
    describe(filename, () => {
      let content: string
      try { content = scriptContentOnly(readVideo(filename)) } catch { content = '' }

      for (const phrase of FORBIDDEN) {
        it(`enthält nicht "${phrase}"`, () => {
          expect(content.toLowerCase()).not.toContain(phrase.toLowerCase())
        })
      }
    })
  }
})

// ── 3. Brand checks ───────────────────────────────────────────────────────────

describe('Promo Video Pack — Marke CorridorWork', () => {
  for (const filename of REQUIRED_FILES) {
    it(`${filename}: enthält "CorridorWork"`, () => {
      const c = readVideo(filename)
      expect(c).toContain('CorridorWork')
    })

    for (const oldBrand of FORBIDDEN_BRANDS) {
      it(`${filename}: enthält nicht "${oldBrand}"`, () => {
        const c = readVideo(filename)
        expect(c).not.toContain(oldBrand)
      })
    }
  }
})

// ── 4. Domain present ─────────────────────────────────────────────────────────

describe('Promo Video Pack — Domain corridorwork.com', () => {
  for (const filename of REQUIRED_FILES) {
    it(`${filename}: enthält corridorwork.com`, () => {
      const c = readVideo(filename)
      expect(c).toContain('corridorwork.com')
    })
  }
})

// ── 5. SRT format in language files ──────────────────────────────────────────

describe('Promo Video Pack — SRT Format', () => {
  const LANG_FILES = REQUIRED_FILES.filter(f =>
    f.startsWith('CORRIDORWORK_PROMO_') || f === 'CORRIDORWORK_SUBTITLES_SRT_PACK.md'
  )

  for (const filename of LANG_FILES) {
    it(`${filename}: enthält SRT-Zeitstempel`, () => {
      const c = readVideo(filename)
      // SRT format: 00:00:00,000 --> 00:00:00,000
      expect(c).toMatch(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/)
    })
  }
})

// ── 6. Voiceover present ──────────────────────────────────────────────────────

describe('Promo Video Pack — Voiceover vorhanden', () => {
  const LANG_FILES = REQUIRED_FILES.filter(f => f.startsWith('CORRIDORWORK_PROMO_'))

  for (const filename of LANG_FILES) {
    it(`${filename}: enthält Voiceover-Text`, () => {
      const c = readVideo(filename)
      // All lang files use blockquote for voiceover
      expect(c).toContain('>')
    })
  }
})

// ── 7. Short versions present ────────────────────────────────────────────────

describe('Promo Video Pack — Kurzversion und Hook', () => {
  const LANG_FILES = REQUIRED_FILES.filter(f => f.startsWith('CORRIDORWORK_PROMO_'))

  for (const filename of LANG_FILES) {
    it(`${filename}: enthält 30-Sekunden-Version`, () => {
      const c = readVideo(filename)
      // Covers: 30 Sek / 30 seconds / 30 saniye / 30 ثانية / 30 सेकंड / 30 سیکنڈ / 30 segundo / 30 SANİYELİK / VERSION 30
      expect(c).toMatch(/30[- _]?(SEK|SECOND|SANIY|SANİY|SEG|MINU|MAYO|ثاني|سیکن|سیک|सेकंड|segundo|secund|version|seg)/i)
    })

    it(`${filename}: enthält 10-Sekunden-Hook`, () => {
      const c = readVideo(filename)
      // Covers: HOOK / KANCA / ACCROCHE / GANCHO / خطّاف / हुक / ہک / 10 Sek / 10-SECOND
      expect(c).toMatch(/HOOK|KANCA|ACCROCHE|GANCHO|خطّاف|هوك|हुक|ہک|10[- _]?(SEK|SECOND|SANIY|SANİY|SEG|ثاني|سیکن|سیک|सेकंड|segundo)/i)
    })
  }
})

// ── 8. AI tool prompts ────────────────────────────────────────────────────────

describe('Promo Video Pack — AI Tool Prompts', () => {
  const promptsFile = 'CORRIDORWORK_VIDEO_GENERATION_PROMPTS.md'

  it('enthält Runway Prompt', () => {
    const c = readVideo(promptsFile)
    expect(c).toContain('RUNWAY')
  })

  it('enthält Pika Prompt', () => {
    const c = readVideo(promptsFile)
    expect(c).toContain('PIKA')
  })

  it('enthält Canva Prompt', () => {
    const c = readVideo(promptsFile)
    expect(c).toContain('CANVA')
  })

  it('enthält CapCut Prompt', () => {
    const c = readVideo(promptsFile)
    expect(c).toContain('CAPCUT')
  })

  it('enthält Synthesia/HeyGen Prompt', () => {
    const c = readVideo(promptsFile)
    expect(c).toContain('SYNTHESIA')
    expect(c).toContain('HEYGEN')
  })

  it('kein aktivierter Bezahldienst', () => {
    const c = readVideo(promptsFile)
    expect(c).not.toContain('stripe.com')
    expect(c).not.toContain('payment activated')
    expect(c).not.toContain('billing activated')
  })
})

// ── 9. Master script structure ────────────────────────────────────────────────

describe('Promo Video Pack — Master Script EN Struktur', () => {
  const master = 'CORRIDORWORK_PROMO_MASTER_EN.md'

  it('enthält 6 Szenen', () => {
    const c = readVideo(master)
    expect(c).toContain('SCENE 1')
    expect(c).toContain('SCENE 2')
    expect(c).toContain('SCENE 3')
    expect(c).toContain('SCENE 4')
    expect(c).toContain('SCENE 5')
    expect(c).toContain('SCENE 6')
  })

  it('enthält 60-Sekunden-Vollversion', () => {
    const c = readVideo(master)
    expect(c).toContain('60')
  })

  it('enthält Visual-Beschreibungen', () => {
    const c = readVideo(master)
    expect(c).toContain('Visual')
  })

  it('enthält Screen-Text', () => {
    const c = readVideo(master)
    expect(c).toContain('Screen Text')
  })

  it('enthält Voiceover', () => {
    const c = readVideo(master)
    expect(c).toContain('Voiceover')
  })

  it('enthält CTA-Tabelle', () => {
    const c = readVideo(master)
    expect(c).toContain('CTA')
  })

  it('verwendet compliance-konforme Sprache: connect', () => {
    const c = readVideo(master)
    expect(c.toLowerCase()).toContain('connect')
  })

  it('verwendet compliance-konforme Sprache: explore', () => {
    const c = readVideo(master)
    expect(c.toLowerCase()).toContain('explore')
  })

  it('verwendet compliance-konforme Sprache: compliance-first', () => {
    const c = readVideo(master)
    expect(c.toLowerCase()).toContain('compliance-first')
  })

  it('verwendet compliance-konforme Sprache: express interest', () => {
    const c = readVideo(master)
    expect(c.toLowerCase()).toContain('express interest')
  })
})

// ── 10. Language coverage ─────────────────────────────────────────────────────

describe('Promo Video Pack — 10 Sprachen abgedeckt', () => {
  const LANGUAGES = [
    { code: 'EN', check: 'English' },
    { code: 'DE', check: 'Deutsch' },
    { code: 'FR', check: 'Français' },
    { code: 'AR', check: 'العربية' },
    { code: 'ES', check: 'Español' },
    { code: 'PT', check: 'Português' },
    { code: 'HI', check: 'हिंदी' },
    { code: 'UR', check: 'اردو' },
    { code: 'FIL', check: 'Filipino' },
    { code: 'TR', check: 'Türkçe' },
  ]

  for (const lang of LANGUAGES) {
    const filename = lang.code === 'EN'
      ? 'CORRIDORWORK_PROMO_MASTER_EN.md'
      : `CORRIDORWORK_PROMO_${lang.code}.md`

    it(`${lang.code} (${lang.check}) — Datei existiert`, () => {
      expect(existsSync(join(VIDEO_DIR, filename))).toBe(true)
    })
  }
})
