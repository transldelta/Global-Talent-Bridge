/**
 * __tests__/contact-copilot.test.ts
 *
 * Tests for lib/contact-copilot.ts and /admin/contact-copilot page.
 * No DB calls. No server imports. No email sending.
 *
 * Coverage:
 * - SENDER: correct name, email, website
 * - CONTACT_ROUTES: 4 routes, required fields
 * - CONTACT_STATUS_OPTIONS: required statuses
 * - APPROVAL_CHECKLIST: 9 items, key fields
 * - generateMessage: per route, CorridorWork Team signed, no guarantee language
 * - generateMailtoLink: correct mailto format, encoded
 * - generateAutofillSnippet: fills fields, no submit(), no form.submit()
 * - Page: admin guard, noindex
 * - Component: no send button, no submit(), no form.submit(), no Stripe,
 *   approval checklist, autofill helper, mailto, no GTB brand
 * - Docs: all key sections
 */

import { describe, it, expect } from 'vitest'
import {
  SENDER,
  CONTACT_ROUTES,
  CONTACT_STATUS_OPTIONS,
  APPROVAL_CHECKLIST,
  generateMessage,
  generateMailtoLink,
  generateAutofillSnippet,
} from '@/lib/contact-copilot'
import type { ContactTarget } from '@/lib/contact-copilot'
import { readFileSync } from 'fs'
import { join }         from 'path'

const BLANK_TARGET: ContactTarget = {
  companyName: '', website: '', contactPageUrl: '',
  contactEmail: '', sector: '', country: '',
  contactPerson: '', notes: '',
}

const FULL_TARGET: ContactTarget = {
  companyName:    'Sprache & Beruf GmbH',
  website:        'https://sprache-beruf.de',
  contactPageUrl: 'https://sprache-beruf.de/contact',
  contactEmail:   'info@sprache-beruf.de',
  sector:         'Language training',
  country:        'Germany',
  contactPerson:  'Dr. Müller',
  notes:          'Found on LinkedIn',
}

function readFile(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf-8')
}

// ── SENDER ────────────────────────────────────────────────────────────────────

describe('SENDER', () => {
  it('name is CorridorWork Team', () => {
    expect(SENDER.name).toBe('CorridorWork Team')
  })

  it('website is https://corridorwork.com', () => {
    expect(SENDER.website).toBe('https://corridorwork.com')
  })

  it('email is a valid address', () => {
    expect(SENDER.email).toMatch(/@/)
  })

  it('name does not contain Global Talent Bridge', () => {
    expect(SENDER.name).not.toContain('Global Talent Bridge')
  })
})

// ── CONTACT_ROUTES ────────────────────────────────────────────────────────────

describe('CONTACT_ROUTES', () => {
  it('has 4 routes', () => {
    expect(CONTACT_ROUTES).toHaveLength(4)
  })

  it('includes language_school route', () => {
    expect(CONTACT_ROUTES.some((r) => r.value === 'language_school')).toBe(true)
  })

  it('includes recruiting_agency route', () => {
    expect(CONTACT_ROUTES.some((r) => r.value === 'recruiting_agency')).toBe(true)
  })

  it('includes relocation_partner route', () => {
    expect(CONTACT_ROUTES.some((r) => r.value === 'relocation_partner')).toBe(true)
  })

  it('includes employer_network route', () => {
    expect(CONTACT_ROUTES.some((r) => r.value === 'employer_network')).toBe(true)
  })

  it('every route has value, label, desc', () => {
    for (const r of CONTACT_ROUTES) {
      expect(typeof r.value).toBe('string')
      expect(typeof r.label).toBe('string')
      expect(typeof r.desc).toBe('string')
    }
  })
})

// ── CONTACT_STATUS_OPTIONS ────────────────────────────────────────────────────

describe('CONTACT_STATUS_OPTIONS', () => {
  it('has at least 6 statuses', () => {
    expect(CONTACT_STATUS_OPTIONS.length).toBeGreaterThanOrEqual(6)
  })

  it('includes draft_prepared', () => {
    expect(CONTACT_STATUS_OPTIONS.some((s) => s.value === 'draft_prepared')).toBe(true)
  })

  it('includes sent_manually (not sent_automatically)', () => {
    expect(CONTACT_STATUS_OPTIONS.some((s) => s.value === 'sent_manually')).toBe(true)
    expect(CONTACT_STATUS_OPTIONS.some((s) => /automatic/i.test(s.value))).toBe(false)
  })

  it('includes approved', () => {
    expect(CONTACT_STATUS_OPTIONS.some((s) => s.value === 'approved')).toBe(true)
  })
})

// ── APPROVAL_CHECKLIST ────────────────────────────────────────────────────────

describe('APPROVAL_CHECKLIST', () => {
  it('has at least 9 items', () => {
    expect(APPROVAL_CHECKLIST.length).toBeGreaterThanOrEqual(9)
  })

  it('every item has key and label', () => {
    for (const item of APPROVAL_CHECKLIST) {
      expect(typeof item.key).toBe('string')
      expect(typeof item.label).toBe('string')
      expect(item.key.length).toBeGreaterThan(0)
      expect(item.label.length).toBeGreaterThan(0)
    }
  })

  it('includes no job guarantee check', () => {
    expect(APPROVAL_CHECKLIST.some((c) => /job guarantee/i.test(c.label))).toBe(true)
  })

  it('includes no visa guarantee check', () => {
    expect(APPROVAL_CHECKLIST.some((c) => /visa guarantee/i.test(c.label))).toBe(true)
  })

  it('includes CorridorWork Team check', () => {
    expect(APPROVAL_CHECKLIST.some((c) => /CorridorWork Team/i.test(c.label))).toBe(true)
  })

  it('includes manual send check', () => {
    expect(APPROVAL_CHECKLIST.some((c) => /manual send|manual/i.test(c.label))).toBe(true)
  })

  it('includes screenshot check', () => {
    expect(APPROVAL_CHECKLIST.some((c) => /screenshot/i.test(c.label))).toBe(true)
  })

  it('includes no automatic placement check', () => {
    expect(APPROVAL_CHECKLIST.some((c) => /automatic placement|placement/i.test(c.label))).toBe(true)
  })
})

// ── generateMessage ───────────────────────────────────────────────────────────

describe('generateMessage — language_school', () => {
  const msg = generateMessage('language_school', FULL_TARGET)

  it('subject contains "Pilot-Feedback"', () => {
    expect(msg.subject).toMatch(/Pilot-Feedback|Pilot|Feedback/i)
  })

  it('body contains CorridorWork', () => {
    expect(msg.body).toContain('CorridorWork')
  })

  it('body is signed CorridorWork Team', () => {
    expect(msg.body).toContain('CorridorWork Team')
  })

  it('body states keine Jobgarantie', () => {
    expect(msg.body).toMatch(/Jobgarantie|keine.*Garantie/i)
  })

  it('body states keine Visaberatung', () => {
    expect(msg.body).toMatch(/Visaberatung/i)
  })

  it('body states keine automatische Vermittlung', () => {
    expect(msg.body).toMatch(/automatische Vermittlung|keine.*Vermittlung/i)
  })

  it('body states unverbindliches Gespräch', () => {
    expect(msg.body).toMatch(/unverbindlich/i)
  })

  it('body does not contain Global Talent Bridge', () => {
    expect(msg.body).not.toContain('Global Talent Bridge')
  })

  it('body does not promise placement', () => {
    expect(msg.body).not.toMatch(/guaranteed placement|Vermittlungsgarantie/i)
  })

  it('body does not mention Stripe', () => {
    expect(msg.body).not.toMatch(/stripe/i)
  })
})

describe('generateMessage — graceful fallback (blank target)', () => {
  const routes = ['language_school', 'recruiting_agency', 'relocation_partner', 'employer_network'] as const

  for (const route of routes) {
    it(`${route}: returns valid message with blank target`, () => {
      const msg = generateMessage(route, BLANK_TARGET)
      expect(msg.subject.length).toBeGreaterThan(5)
      expect(msg.body).toContain('CorridorWork Team')
      expect(msg.body).not.toContain('Global Talent Bridge')
    })
  }
})

describe('generateMessage — all routes signed correctly', () => {
  const routes = ['language_school', 'recruiting_agency', 'relocation_partner', 'employer_network'] as const

  for (const route of routes) {
    it(`${route}: signed CorridorWork Team`, () => {
      const msg = generateMessage(route, FULL_TARGET)
      expect(msg.body).toContain('CorridorWork Team')
    })

    it(`${route}: no job guarantee`, () => {
      const msg = generateMessage(route, FULL_TARGET)
      expect(msg.body).not.toMatch(/guaranteed.*job|Jobgarantie.*ja|job.*guarantee.*yes/i)
    })

    it(`${route}: no automatic sending in body`, () => {
      const msg = generateMessage(route, FULL_TARGET)
      expect(msg.body).not.toMatch(/sendEmail|form\.submit|auto.*send/i)
    })
  }
})

// ── generateMailtoLink ────────────────────────────────────────────────────────

describe('generateMailtoLink', () => {
  it('starts with mailto:', () => {
    const link = generateMailtoLink('test@example.com', 'Hello', 'Body text')
    expect(link).toMatch(/^mailto:/)
  })

  it('encodes the subject', () => {
    const link = generateMailtoLink('test@example.com', 'Pilot-Feedback', 'Body')
    expect(link).toContain('subject=')
    expect(link).toContain('Pilot-Feedback')
  })

  it('encodes the body', () => {
    const link = generateMailtoLink('test@example.com', 'Subject', 'Message body')
    expect(link).toContain('body=')
  })

  it('works without email address', () => {
    const link = generateMailtoLink('', 'Subject', 'Body')
    expect(link).toMatch(/^mailto:\?/)
  })

  it('does not trigger automatic sending', () => {
    const link = generateMailtoLink('test@example.com', 'Subject', 'Body')
    // mailto: links open email clients — they never send automatically
    expect(link).toMatch(/^mailto:/)
    expect(link).not.toMatch(/sendEmail|fetch|POST/i)
  })
})

// ── generateAutofillSnippet ───────────────────────────────────────────────────

describe('generateAutofillSnippet', () => {
  const snippet = generateAutofillSnippet(FULL_TARGET, 'Pilot-Feedback', 'Message body')

  it('does NOT call form.submit() or any submit method', () => {
    // Check executable calls — comments allowed ("no submit" is a safety note)
    // Remove comments then check
    const noComments = snippet.replace(/\/\*[\s\S]*?\*\//g, '')
    expect(noComments).not.toMatch(/\.submit\(\)/)
  })

  it('does NOT click a submit button automatically', () => {
    const noComments = snippet.replace(/\/\*[\s\S]*?\*\//g, '')
    expect(noComments).not.toMatch(/querySelector.*submit.*\.click\(\)|\.click\(\).*submit/i)
  })

  it('contains a visible alert asking user to review', () => {
    expect(snippet).toMatch(/alert|Review before sending|STOP/i)
  })

  it('contains CorridorWork Team as sender name', () => {
    expect(snippet).toContain('CorridorWork Team')
  })

  it('contains SENDER.email', () => {
    expect(snippet).toContain(SENDER.email)
  })

  it('fills name field', () => {
    expect(snippet).toMatch(/NAME_SEL|name.*CorridorWork/i)
  })

  it('is valid JavaScript (no syntax errors via basic check)', () => {
    expect(snippet).toMatch(/^\(function\(\)/)
    expect(snippet).toMatch(/\}\)\(\);$/)
  })

  it('contains a safety comment about no automatic submission', () => {
    expect(snippet).toMatch(/no automatic submission|fields filled only|SAFETY/i)
  })
})

// ── Page file checks ──────────────────────────────────────────────────────────

describe('/admin/contact-copilot — page file', () => {
  const page = readFile('app/admin/contact-copilot/page.tsx')

  it('has admin guard', () => {
    expect(page).toMatch(/getCurrentAdminUser|redirect.*login/i)
  })

  it('is noindex nofollow', () => {
    expect(page).toMatch(/noindex.*nofollow|nofollow.*noindex/i)
  })

  it('imports ContactCopilotClient', () => {
    expect(page).toContain('ContactCopilotClient')
  })
})

// ── Component file checks ─────────────────────────────────────────────────────

describe('/admin/contact-copilot — component file', () => {
  const comp = readFile('app/admin/contact-copilot/_components/ContactCopilotClient.tsx')

  it('has no send button (no sendEmail call)', () => {
    expect(comp).not.toMatch(/sendEmail|sendMail/i)
  })

  it('has no executable submit() call (comments excluded)', () => {
    // Remove JSDoc/comments before checking
    const noComments = comp.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
    expect(noComments).not.toMatch(/\.submit\(\)/)
  })

  it('has no form.submit executable call (comments excluded)', () => {
    const noComments = comp.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
    expect(noComments).not.toContain('form.submit')
  })

  it('does not integrate Stripe', () => {
    expect(comp).not.toMatch(/stripe\.com|loadStripe|StripeProvider|STRIPE_SECRET/i)
  })

  it('contains "Manual send only" or equivalent safety text', () => {
    expect(comp).toMatch(/Manual send only|manual send/i)
  })

  it('contains "Review before sending" safety text', () => {
    expect(comp).toMatch(/Review before sending/i)
  })

  it('contains "Screenshot" approval text', () => {
    expect(comp).toMatch(/screenshot/i)
  })

  it('contains "No automatic sending" safety text', () => {
    expect(comp).toMatch(/No automatic sending/i)
  })

  it('contains "No scraping" safety text', () => {
    expect(comp).toMatch(/No scraping/i)
  })

  it('contains Copy message option', () => {
    expect(comp).toMatch(/Copy message|Copy subject/i)
  })

  it('contains Open mail draft option', () => {
    expect(comp).toMatch(/Open mail draft|mailto/i)
  })

  it('contains Contact Form Autofill Helper', () => {
    expect(comp).toMatch(/Contact Form Autofill Helper|Autofill Helper/i)
  })

  it('contains approval checklist', () => {
    expect(comp).toMatch(/APPROVAL_CHECKLIST|approval checklist/i)
  })

  it('does not contain Global Talent Bridge as visible brand', () => {
    const lines = comp.split('\n').filter((l) => !l.trim().startsWith('//'))
    expect(lines.join('\n')).not.toContain('Global Talent Bridge')
  })

  it('imports from lib/contact-copilot', () => {
    expect(comp).toContain('contact-copilot')
  })

  it('has no job guarantee promise', () => {
    expect(comp).not.toMatch(/guarantee.*job|job.*guaranteed/i)
  })

  it('has no visa guarantee promise', () => {
    expect(comp).not.toMatch(/guarantee.*visa|visa.*guaranteed/i)
  })
})

// ── Docs file checks ──────────────────────────────────────────────────────────

describe('APPROVAL_BASED_CONTACT_COPILOT.md', () => {
  const doc = readFile('docs/APPROVAL_BASED_CONTACT_COPILOT.md')

  it('file exists and is substantial', () => {
    expect(doc.length).toBeGreaterThan(1000)
  })

  it('contains "Manual Send Only" rule', () => {
    expect(doc).toMatch(/Manual Send Only|manual.*send/i)
  })

  it('contains "Review before sending" reference', () => {
    expect(doc).toMatch(/Review before|review.*sending/i)
  })

  it('contains screenshot approval process', () => {
    expect(doc).toMatch(/Screenshot/i)
  })

  it('states no automatic sending', () => {
    expect(doc).toMatch(/No automatic.*sending|never.*automatic|automatically.*prepared/i)
  })

  it('states no scraping', () => {
    expect(doc).toMatch(/No scraping|no.*scraping/i)
  })

  it('states no job guarantee', () => {
    expect(doc).toMatch(/no job guarantee|No.*guarantee/i)
  })

  it('contains GDPR / data protection note', () => {
    expect(doc).toMatch(/GDPR|Datenschutz|data protection/i)
  })

  it('contains status workflow', () => {
    expect(doc).toMatch(/draft_prepared|sent_manually|approved/i)
  })

  it('does not contain Global Talent Bridge as brand', () => {
    const lines = doc.split('\n').filter((l) => !l.trim().startsWith('<!--'))
    expect(lines.join('\n')).not.toContain('Global Talent Bridge')
  })
})
