/**
 * __tests__/global-growth-department.test.ts
 *
 * Tests for lib/global-growth-department.ts and /admin/global-growth-department.
 */
import { describe, it, expect } from 'vitest'
import {
  CORRIDORS,
  DESTINATION_MARKETS,
  SOURCE_MARKETS,
  GROWTH_SECTORS,
  MESSAGE_TYPE_CONFIG,
  QUEUE_STATUS_OPTIONS,
  SEARCH_PLAYBOOK,
  GROWTH_OPERATING_RULES,
  SENDER_NAME,
  generateGrowthMessage,
  generateGmailDraftUrl,
  generateContactFormSnippet,
  generateSearchUrl,
  parseQuickAddLine,
  parseQuickAddBulk,
  generateBatchTargets,
} from '@/lib/global-growth-department'
import { readFileSync } from 'fs'
import { join } from 'path'

function readFile(rel: string) { return readFileSync(join(process.cwd(), rel), 'utf-8') }

// ── SENDER ────────────────────────────────────────────────────────────────────
describe('SENDER_NAME', () => {
  it('is CorridorWork Team', () => { expect(SENDER_NAME).toBe('CorridorWork Team') })
})

// ── CORRIDORS ─────────────────────────────────────────────────────────────────
describe('CORRIDORS', () => {
  it('has at least 8 corridors', () => { expect(CORRIDORS.length).toBeGreaterThanOrEqual(8) })

  it('includes Morocco/Tunisia → DACH corridor', () => {
    expect(CORRIDORS.some((c) => /morocco/i.test(c.sourceMarkets.join(' ')))).toBe(true)
  })

  it('includes India → UK/Canada corridor', () => {
    expect(CORRIDORS.some((c) => /india/i.test(c.sourceMarkets.join(' ')))).toBe(true)
  })

  it('includes Philippines corridor', () => {
    expect(CORRIDORS.some((c) => /philippines/i.test(c.sourceMarkets.join(' ')))).toBe(true)
  })

  it('includes Nigeria/Ghana/Kenya corridor', () => {
    expect(CORRIDORS.some((c) => /nigeria|ghana|kenya/i.test(c.sourceMarkets.join(' ')))).toBe(true)
  })

  it('includes Turkey corridor', () => {
    expect(CORRIDORS.some((c) => /turkey/i.test(c.sourceMarkets.join(' ')))).toBe(true)
  })

  it('every corridor has required fields', () => {
    for (const c of CORRIDORS) {
      expect(typeof c.id).toBe('string')
      expect(typeof c.label).toBe('string')
      expect(Array.isArray(c.sourceMarkets)).toBe(true)
      expect(Array.isArray(c.destinationMarkets)).toBe(true)
      expect(['low', 'medium', 'high']).toContain(c.riskLevel)
    }
  })
})

// ── MARKETS ───────────────────────────────────────────────────────────────────
describe('DESTINATION_MARKETS', () => {
  it('includes Germany/DACH', () => { expect(DESTINATION_MARKETS.some((m) => /germany|dach/i.test(m))).toBe(true) })
  it('includes UK', ()         => { expect(DESTINATION_MARKETS.some((m) => /uk/i.test(m))).toBe(true) })
  it('includes Canada', ()     => { expect(DESTINATION_MARKETS.some((m) => /canada/i.test(m))).toBe(true) })
  it('includes Australia', ()  => { expect(DESTINATION_MARKETS.some((m) => /australia/i.test(m))).toBe(true) })
  it('includes Gulf region', ()=> { expect(DESTINATION_MARKETS.some((m) => /gulf/i.test(m))).toBe(true) })
  it('includes France', ()     => { expect(DESTINATION_MARKETS.some((m) => /france/i.test(m))).toBe(true) })
  it('includes Spain', ()      => { expect(DESTINATION_MARKETS.some((m) => /spain/i.test(m))).toBe(true) })
  it('includes USA', ()        => { expect(DESTINATION_MARKETS.some((m) => /usa/i.test(m))).toBe(true) })
})

describe('SOURCE_MARKETS', () => {
  it('includes Morocco', ()        => { expect(SOURCE_MARKETS.some((m) => /morocco/i.test(m))).toBe(true) })
  it('includes India', ()          => { expect(SOURCE_MARKETS.some((m) => /india/i.test(m))).toBe(true) })
  it('includes Philippines', ()    => { expect(SOURCE_MARKETS.some((m) => /philippines/i.test(m))).toBe(true) })
  it('includes Nigeria', ()        => { expect(SOURCE_MARKETS.some((m) => /nigeria/i.test(m))).toBe(true) })
  it('includes Ghana', ()          => { expect(SOURCE_MARKETS.some((m) => /ghana/i.test(m))).toBe(true) })
  it('includes Kenya', ()          => { expect(SOURCE_MARKETS.some((m) => /kenya/i.test(m))).toBe(true) })
  it('includes Turkey', ()         => { expect(SOURCE_MARKETS.some((m) => /turkey/i.test(m))).toBe(true) })
})

// ── MESSAGE FACTORY ───────────────────────────────────────────────────────────
describe('generateGrowthMessage — all types', () => {
  const TYPES = ['employer_healthcare','employer_it','employer_engineering','recruiting_agency','language_school','relocation_partner','candidate_source','university_career','strategic_partner'] as const

  for (const type of TYPES) {
    it(`${type}: signed CorridorWork Team`, () => {
      const { body } = generateGrowthMessage(type, 'Test GmbH', 'Germany', 'Healthcare')
      expect(body).toContain('CorridorWork Team')
    })

    it(`${type}: no job guarantee`, () => {
      const { body } = generateGrowthMessage(type, 'Test GmbH', 'Germany', 'Healthcare')
      expect(body).not.toMatch(/Jobgarantie.*ja|guaranteed.*job|job.*guarantee.*yes/i)
    })

    it(`${type}: asks for written reply by email — no mandatory call/meeting`, () => {
      const { body } = generateGrowthMessage(type, 'Test GmbH', 'Germany', 'Healthcare')
      // Must have written-reply language
      expect(body).toMatch(/schriftliche Rückmeldung|per E-Mail|schriftliche Einschätzung/i)
      // Must NOT have mandatory call/meeting language
      expect(body).not.toMatch(/15-minütiger Austausch|15 Minuten.*Gespräch|Termin.*vereinbar/i)
    })

    it(`${type}: no Global Talent Bridge`, () => {
      const { body, subject } = generateGrowthMessage(type, 'Test GmbH', 'Germany', 'Healthcare')
      expect(body + subject).not.toContain('Global Talent Bridge')
    })

    it(`${type}: no Stripe`, () => {
      const { body } = generateGrowthMessage(type, 'Test GmbH', 'Germany', 'Healthcare')
      expect(body).not.toMatch(/stripe/i)
    })
  }

  it('language_school: links to /global/candidates', () => {
    const { body } = generateGrowthMessage('language_school', 'Testschule', 'Germany', 'Language training')
    expect(body).toContain('/global/candidates')
  })

  it('employer_healthcare: links to /global/employers', () => {
    const { body } = generateGrowthMessage('employer_healthcare', 'Klinikum', 'Germany', 'Healthcare')
    expect(body).toContain('/global/employers')
  })

  it('strategic_partner: links to /strategic-partnership', () => {
    const { body } = generateGrowthMessage('strategic_partner', 'Agency X', 'UK', 'HR Tech')
    expect(body).toContain('/strategic-partnership')
  })
})

// ── Gmail draft URL ───────────────────────────────────────────────────────────
describe('generateGmailDraftUrl', () => {
  it('starts with mail.google.com', () => {
    expect(generateGmailDraftUrl('test@example.com', 'Subject', 'Body')).toMatch(/^https:\/\/mail\.google\.com/)
  })

  it('includes view=cm for compose', () => {
    expect(generateGmailDraftUrl('test@example.com', 'Subject', 'Body')).toContain('view=cm')
  })

  it('encodes the subject', () => {
    const url = generateGmailDraftUrl('a@b.com', 'Pilot-Feedback', 'Body')
    expect(url).toContain('su=')
  })

  it('encodes the body', () => {
    const url = generateGmailDraftUrl('a@b.com', 'Subject', 'Hello world')
    expect(url).toContain('body=')
  })

  it('works without email', () => {
    const url = generateGmailDraftUrl('', 'Subject', 'Body')
    expect(url).toMatch(/^https:\/\/mail\.google\.com/)
    expect(url).not.toContain('to=')
  })
})

// ── Autofill snippet ──────────────────────────────────────────────────────────
describe('generateContactFormSnippet', () => {
  const snippet = generateContactFormSnippet('Pilot-Feedback', 'Message body')

  it('does not call .submit()', () => {
    const noComments = snippet.replace(/\/\*[\s\S]*?\*\//g, '')
    expect(noComments).not.toMatch(/\.submit\(\)/)
  })

  it('contains CorridorWork Team', () => { expect(snippet).toContain('CorridorWork Team') })

  it('shows alert asking to review before sending', () => {
    expect(snippet).toMatch(/alert|Review before sending|STOP/i)
  })

  it('has SAFETY comment', () => { expect(snippet).toMatch(/SAFETY/i) })
})

// ── Search URLs ───────────────────────────────────────────────────────────────
describe('generateSearchUrl', () => {
  it('google: starts with google.com/search', () => {
    expect(generateSearchUrl('google', 'test query')).toMatch(/google\.com\/search/)
  })

  it('linkedin: starts with linkedin.com/search', () => {
    expect(generateSearchUrl('linkedin', 'test query')).toMatch(/linkedin\.com\/search/)
  })
})

// ── Quick Add parser ──────────────────────────────────────────────────────────
describe('parseQuickAddLine', () => {
  it('parses full line correctly', () => {
    const r = parseQuickAddLine('Acme GmbH | info@acme.de | Germany | Healthcare | https://acme.de')
    expect(r.companyName).toBe('Acme GmbH')
    expect(r.contactEmail).toBe('info@acme.de')
    expect(r.country).toBe('Germany')
    expect(r.sector).toBe('Healthcare')
    expect(r.website).toBe('https://acme.de')
  })

  it('handles missing fields gracefully', () => {
    const r = parseQuickAddLine('Only Company Name')
    expect(r.companyName).toBe('Only Company Name')
    expect(r.error).toBeTruthy()
  })

  it('ignores empty lines', () => {
    const r = parseQuickAddLine('')
    expect(r.error).toBeTruthy()
  })

  it('ignores comment lines starting with #', () => {
    const r = parseQuickAddLine('# this is a comment')
    expect(r.error).toBeTruthy()
  })
})

describe('parseQuickAddBulk', () => {
  it('parses multiple lines', () => {
    const text = 'Acme GmbH | info@acme.de | Germany | Healthcare | https://acme.de\nBeta Corp | b@b.com | UK | IT | https://b.com'
    const results = parseQuickAddBulk(text)
    expect(results).toHaveLength(2)
  })

  it('limits to 50 lines', () => {
    const text = Array.from({ length: 100 }, (_, i) => `Company ${i} | e${i}@x.com | Germany | Healthcare | https://x.com`).join('\n')
    expect(parseQuickAddBulk(text).length).toBeLessThanOrEqual(50)
  })
})

// ── Batch targets ─────────────────────────────────────────────────────────────
describe('generateBatchTargets', () => {
  const spec = { targetKind: 'employer' as const, country: 'Germany', sector: 'Healthcare', count: 5, messageType: 'employer_healthcare' as const }
  const targets = generateBatchTargets(spec)

  it('generates correct count', () => { expect(targets).toHaveLength(5) })
  it('all have status real_contact_needed', () => {
    targets.forEach((t) => expect(t.status).toBe('real_contact_needed'))
  })
  it('all have generated subject and body', () => {
    targets.forEach((t) => { expect(t.subject.length).toBeGreaterThan(5); expect(t.body.length).toBeGreaterThan(20) })
  })
  it('none has a real company name', () => {
    targets.forEach((t) => expect(t.companyName).toMatch(/\[Target/))
  })
})

// ── Operating Rules ───────────────────────────────────────────────────────────
describe('GROWTH_OPERATING_RULES', () => {
  it('has at least 8 rules', () => { expect(GROWTH_OPERATING_RULES.length).toBeGreaterThanOrEqual(8) })
  it('includes no automatic outreach', () => { expect(GROWTH_OPERATING_RULES.some((r) => /automatic outreach/i.test(r))).toBe(true) })
  it('includes written reply by email rule', () => { expect(GROWTH_OPERATING_RULES.some((r) => /written reply|schriftliche|by email/i.test(r))).toBe(true) })
  it('includes no job guarantee', () => { expect(GROWTH_OPERATING_RULES.some((r) => /job guarantee/i.test(r))).toBe(true) })
  it('includes no visa guarantee', () => { expect(GROWTH_OPERATING_RULES.some((r) => /visa guarantee/i.test(r))).toBe(true) })
  it('includes manual approval', () => { expect(GROWTH_OPERATING_RULES.some((r) => /manual approval/i.test(r))).toBe(true) })
  it('includes screenshot review', () => { expect(GROWTH_OPERATING_RULES.some((r) => /screenshot/i.test(r))).toBe(true) })
})

// ── Page file ─────────────────────────────────────────────────────────────────
describe('/admin/global-growth-department — page file', () => {
  const page = readFile('app/admin/global-growth-department/page.tsx')
  it('has admin guard',        () => { expect(page).toMatch(/getCurrentAdminUser|redirect.*login/i) })
  it('is noindex nofollow',    () => { expect(page).toMatch(/noindex.*nofollow|nofollow.*noindex/i) })
  it('imports GlobalGrowthClient', () => { expect(page).toContain('GlobalGrowthClient') })
})

// ── Component file ────────────────────────────────────────────────────────────
describe('/admin/global-growth-department — component file', () => {
  const comp = readFile('app/admin/global-growth-department/_components/GlobalGrowthClient.tsx')
  const lib  = readFile('lib/global-growth-department.ts')

  it('contains CEO Growth Control tab', ()      => { expect(comp).toMatch(/CEO Growth Control/i) })
  it('contains Employer Market Agent tab', ()   => { expect(comp).toMatch(/Employer Market Agent/i) })
  it('contains Candidate Source Agent tab', ()  => { expect(comp).toMatch(/Candidate Source Agent/i) })
  it('contains Partner Channel Agent tab', ()   => { expect(comp).toMatch(/Partner Channel Agent/i) })
  it('contains Approval Queue tab', ()          => { expect(comp).toMatch(/Approval Queue/i) })
  it('contains Quick Add Bulk Import', ()       => { expect(comp).toMatch(/Quick Add Bulk Import/i) })
  it('contains Paste multiple lines hint', ()   => { expect(comp).toMatch(/Paste multiple lines/i) })
  it('contains Open Gmail draft in browser', () => { expect(comp).toMatch(/Open Gmail draft/i) })
  it('contains Contact Form Autofill Helper', ()=> { expect(comp).toMatch(/Contact Form Autofill Helper/i) })
  it('contains No automatic send safety text',()=> { expect(comp).toMatch(/No automatic send/i) })
  it('contains No scraping safety text', ()     => { expect(comp).toMatch(/No scraping/i) })
  it('contains Manual approval required', ()    => { expect(comp).toMatch(/Manual approval required/i) })
  it('contains No job guarantee', ()            => { expect(comp).toMatch(/No job guarantee/i) })
  it('contains No visa guarantee', ()           => { expect(comp).toMatch(/No visa guarantee/i) })

  it('destination markets in lib include Germany/DACH, UK, Canada, Australia, Gulf, France, Spain, USA', () => {
    expect(lib).toMatch(/Germany.*DACH/i)
    expect(lib).toContain("'UK'")
    expect(lib).toContain("'Canada'")
    expect(lib).toContain("'Australia'")
    expect(lib).toMatch(/gulf/i)
    expect(lib).toContain("'France'")
    expect(lib).toContain("'Spain'")
    expect(lib).toContain("'USA'")
  })

  it('source markets in lib include Morocco, India, Philippines, Nigeria, Ghana, Kenya, Turkey', () => {
    expect(lib).toContain("'Morocco'")
    expect(lib).toContain("'India'")
    expect(lib).toContain("'Philippines'")
    expect(lib).toContain("'Nigeria'")
    expect(lib).toContain("'Ghana'")
    expect(lib).toContain("'Kenya'")
    expect(lib).toContain("'Turkey'")
  })

  it('has no executable submit() call', () => {
    const noComments = comp.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
    expect(noComments).not.toMatch(/\.submit\(\)/)
  })

  it('has no send button (no sendEmail call)', () => { expect(comp).not.toMatch(/sendEmail|sendMail/i) })
  it('does not integrate Stripe', ()           => { expect(comp).not.toMatch(/stripe\.com|loadStripe/i) })
  it('no Global Talent Bridge brand', ()        => {
    const lines = comp.split('\n').filter((l) => !l.trim().startsWith('//'))
    expect(lines.join('\n')).not.toContain('Global Talent Bridge')
  })

  it('schriftliche Rückmeldung in lib messages', () => {
    expect(lib).toMatch(/schriftliche Rückmeldung per E-Mail/i)
  })

  it('no calls or meetings required in lib rules', () => {
    expect(lib).toMatch(/No calls or meetings required.*written reply|written reply by email/i)
  })
})

// ── Docs ──────────────────────────────────────────────────────────────────────
describe('GLOBAL_GROWTH_DEPARTMENT.md', () => {
  const doc = readFile('docs/GLOBAL_GROWTH_DEPARTMENT.md')
  it('file is substantial', ()                   => { expect(doc.length).toBeGreaterThan(2000) })
  it('contains employer section', ()             => { expect(doc).toMatch(/Employer Market Agent/i) })
  it('contains candidate section', ()            => { expect(doc).toMatch(/Candidate Source Agent/i) })
  it('contains partner section', ()              => { expect(doc).toMatch(/Partner Channel Agent/i) })
  it('contains corridor strategy', ()            => { expect(doc).toMatch(/Corridor/i) })
  it('states no automatic mass email', ()        => { expect(doc).toMatch(/No automatic.*mass.*email|Why No Automatic/i) })
  it('explains how Quick Add works', ()          => { expect(doc).toMatch(/Quick Add/i) })
  it('explains how Gmail draft works', ()        => { expect(doc).toMatch(/Gmail Draft/i) })
  it('explains how autofill works', ()           => { expect(doc).toMatch(/Autofill/i) })
  it('explains inbound-first candidate model',() => { expect(doc).toMatch(/inbound-first|Inbound-First/i) })
  it('states user approves manually', ()         => { expect(doc).toMatch(/user.*review|review.*approve|approves/i) })
  it('no Global Talent Bridge', ()               => { expect(doc).not.toContain('Global Talent Bridge') })
})
