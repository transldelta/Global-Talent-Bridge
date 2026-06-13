/**
 * __tests__/contact-form-hardening.test.ts
 *
 * Contact Form Hardening — test suite
 *
 * Tests:
 *  1. app/contact/actions.ts — honeypot check, IP rate limit, buyer_acquisition in validInterests
 *  2. app/contact/ContactForm.tsx — honeypot field present, buyer_acquisition option present
 *  3. app/for-buyers/page.tsx — both CTAs link to /contact?interest=buyer_acquisition
 *  4. Safety sweep — no auto-send introduced, no email dispatch added
 *
 * Safety rules (always active):
 *  - No automatic sending. No scraping. No fake customers. No fake revenue.
 *  - Contact form only stores to DB; no email is dispatched automatically.
 */

import { readFileSync, existsSync } from 'fs'
import { join }                     from 'path'

const ROOT = join(__dirname, '..')

function readDoc(relPath: string): string {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) throw new Error(`File not found: ${relPath}`)
  return readFileSync(full, 'utf-8')
}

// ── 1. actions.ts — server-side hardening ────────────────────────────────────

describe('app/contact/actions.ts — server-side hardening', () => {
  let src: string
  beforeAll(() => { src = readDoc('app/contact/actions.ts') })

  it('file exists', () => { expect(existsSync(join(ROOT, 'app/contact/actions.ts'))).toBe(true) })

  it('imports headers from next/headers for IP extraction', () => {
    expect(src).toMatch(/from ['"]next\/headers['"]/)
    expect(src).toMatch(/\bheaders\b/)
  })

  it('declares in-memory rate-limit map', () => {
    // Should have a Map<string, number[]> for tracking timestamps
    expect(src).toMatch(/new Map/)
    expect(src).toMatch(/RATE_LIMIT_MAX/)
    expect(src).toMatch(/RATE_LIMIT_WINDOW_MS/)
  })

  it('rate-limit window is 1 hour', () => {
    // 60 * 60 * 1000 = 3 600 000 ms
    expect(src).toMatch(/60\s*\*\s*60\s*\*\s*1000/)
  })

  it('rate-limit max is 10', () => {
    expect(src).toMatch(/RATE_LIMIT_MAX\s*=\s*10/)
  })

  it('reads x-forwarded-for header for IP', () => {
    expect(src).toMatch(/x-forwarded-for/i)
  })

  it('returns rate-limit error when limit exceeded', () => {
    expect(src).toMatch(/Zu viele Anfragen/)
  })

  it('reads honeypot field named website from formData', () => {
    expect(src).toMatch(/formData\.get\(['"]website['"]\)/)
  })

  it('silently succeeds when honeypot is filled (does not store)', () => {
    // The honeypot branch must return { success: true } before any DB call
    // Verify: honeypot check appears BEFORE createAdminClient call
    const honeypotIdx  = src.indexOf("formData.get('website')")
    const supabaseIdx  = src.indexOf('createAdminClient()')
    expect(honeypotIdx).toBeGreaterThan(-1)
    expect(supabaseIdx).toBeGreaterThan(-1)
    expect(honeypotIdx).toBeLessThan(supabaseIdx)
  })

  it('includes buyer_acquisition in validInterests', () => {
    expect(src).toMatch(/['"]buyer_acquisition['"]/)
    // Must be inside the validInterests array
    const validBlock = src.match(/const validInterests\s*=\s*\[([\s\S]*?)\]/)
    expect(validBlock).not.toBeNull()
    expect(validBlock![1]).toMatch(/buyer_acquisition/)
  })

  it('still includes all original interests', () => {
    const validBlock = src.match(/const validInterests\s*=\s*\[([\s\S]*?)\]/)
    expect(validBlock![1]).toMatch(/pilot_employer/)
    expect(validBlock![1]).toMatch(/candidate/)
    expect(validBlock![1]).toMatch(/partnership/)
    expect(validBlock![1]).toMatch(/feedback/)
    expect(validBlock![1]).toMatch(/other/)
  })

  it('sets priority high for buyer_acquisition', () => {
    expect(src).toMatch(/buyer_acquisition.*high|high.*buyer_acquisition/)
  })

  it('still sets priority high for pilot_employer', () => {
    expect(src).toMatch(/pilot_employer.*high|high.*pilot_employer/)
  })
})

// ── 2. ContactForm.tsx — client-side hardening ───────────────────────────────

describe('app/contact/ContactForm.tsx — client-side hardening', () => {
  let src: string
  beforeAll(() => { src = readDoc('app/contact/ContactForm.tsx') })

  it('file exists', () => { expect(existsSync(join(ROOT, 'app/contact/ContactForm.tsx'))).toBe(true) })

  it('has honeypot input field with name="website"', () => {
    expect(src).toMatch(/name="website"/)
  })

  it('honeypot field has tabIndex={-1}', () => {
    expect(src).toMatch(/tabIndex=\{-1\}/)
  })

  it('honeypot field has autoComplete="off"', () => {
    expect(src).toMatch(/autoComplete="off"/)
  })

  it('honeypot field has aria-hidden="true"', () => {
    expect(src).toMatch(/aria-hidden="true"/)
  })

  it('honeypot field has className="hidden" (invisible to humans)', () => {
    expect(src).toMatch(/className="hidden"/)
  })

  it.skip('includes buyer_acquisition option in INTEREST_OPTIONS', () => {
    // Phase 1 cleanup: buyer_acquisition removed from ContactForm dropdown (not a public inquiry type)
    // The actions.ts server validation still accepts it; only the UI option was removed
    expect(src).toMatch(/buyer_acquisition/)
  })

  it.skip('buyer_acquisition label mentions acquisition', () => {
    // Phase 1 cleanup: acquisition dropdown option removed from ContactForm
    expect(src).toMatch(/Acquisition|acquisition|Erwerben|erwerben/)
  })

  it('includes core interest options (pilot_employer, candidate, partnership, feedback, other)', () => {
    const optionsBlock = src.match(/const INTEREST_OPTIONS\s*=\s*\[([\s\S]*?)\]/)
    expect(optionsBlock).not.toBeNull()
    expect(optionsBlock![1]).toMatch(/pilot_employer/)
    expect(optionsBlock![1]).toMatch(/candidate/)
    expect(optionsBlock![1]).toMatch(/partnership/)
    expect(optionsBlock![1]).toMatch(/feedback/)
    expect(optionsBlock![1]).toMatch(/other/)
  })

  it('reads interest from URL search params for pre-selection', () => {
    expect(src).toMatch(/searchParams\.get\(['"]interest['"]\)/)
  })
})

// ── 3. for-buyers CTAs ───────────────────────────────────────────────────────

describe('app/for-buyers/page.tsx — CTAs point to buyer_acquisition interest', () => {
  let src: string
  beforeAll(() => { src = readDoc('app/for-buyers/page.tsx') })

  it('file exists', () => { expect(existsSync(join(ROOT, 'app/for-buyers/page.tsx'))).toBe(true) })

  it('all /contact hrefs include ?interest=buyer_acquisition', () => {
    const contactLinks = [...src.matchAll(/href="\/contact([^"]*)"/g)]
    expect(contactLinks.length).toBeGreaterThanOrEqual(2)
    for (const match of contactLinks) {
      expect(match[1]).toBe('?interest=buyer_acquisition')
    }
  })

  it('does not have bare /contact href without interest param', () => {
    expect(src).not.toMatch(/href="\/contact"/)
  })
})

// ── 4. Safety sweep ──────────────────────────────────────────────────────────

describe('Contact form hardening — safety sweep', () => {
  it('actions.ts does not dispatch email automatically', () => {
    const src = readDoc('app/contact/actions.ts')
    // Should not import or call any email-sending library
    expect(src).not.toMatch(/sendEmail|sendMail|nodemailer|resend|postmark|sendgrid/i)
    expect(src).not.toMatch(/fetch.*mailto|smtp/i)
  })

  it('actions.ts comment confirms no email sent', () => {
    const src = readDoc('app/contact/actions.ts')
    expect(src).toMatch(/keine.*E-Mail|no.*email|KEINE.*E-Mail/i)
  })

  it('actions.ts does not import any outreach or scraping module', () => {
    const src = readDoc('app/contact/actions.ts')
    expect(src).not.toMatch(/scrape|crawler|puppeteer|playwright/i)
    expect(src).not.toMatch(/autoOutreach|auto.outreach/i)
  })

  it('ContactForm.tsx does not auto-submit or trigger background requests', () => {
    const src = readDoc('app/contact/ContactForm.tsx')
    // Should not call fetch() or XMLHttpRequest directly
    expect(src).not.toMatch(/fetch\s*\(|XMLHttpRequest/i)
    // Should use the server action via useFormState
    expect(src).toMatch(/useFormState/)
  })

  it('honeypot branch returns success:true without touching DB', () => {
    const src = readDoc('app/contact/actions.ts')
    // After the honeypot check, there must be a return { success: true } before DB code
    const honeypotBlock = src.match(
      /honeypot\.length\s*>\s*0[\s\S]{0,200}return\s*\{\s*success:\s*true\s*\}/
    )
    expect(honeypotBlock).not.toBeNull()
  })

  it('no auto-send flag introduced in actions.ts', () => {
    const src = readDoc('app/contact/actions.ts')
    expect(src).not.toMatch(/noAutoSend\s*:\s*false|auto.send\s*:\s*true/i)
  })
})
