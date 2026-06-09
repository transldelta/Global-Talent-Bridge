/**
 * __tests__/market-signals.test.ts
 *
 * Market Signal Sprint — test suite
 *
 * Tests:
 *  1. lib/market-signals.ts — type safety, profile counts, constraint fields
 *  2. docs/market-signals/ — 6 markdown docs exist and contain required content
 *  3. app/admin/market-signals/ — page and client component exist and are protected
 *  4. for-buyers page — market validation note added
 *  5. sale-readiness page — market signal sprint status present
 *  6. Safety sweep — no auto-send, no fake data, no visa guarantee, no job guarantee
 *
 * Safety rules (always active):
 *  - No auto-send. No scraping. No fake customers. No fake revenue. No fake LOIs.
 *  - REAL_RESPONSES must be empty. MARKET_SIGNAL_STATE.outreachSent must be 0.
 */

import { readFileSync, existsSync } from 'fs'
import { join }                     from 'path'
import { describe, it, expect }     from 'vitest'

import {
  BUYER_PROFILES,
  PILOT_CUSTOMER_PROFILES,
  PARTNER_PROFILES,
  OUTREACH_TEMPLATES,
  RESPONSE_LOG_TEMPLATE,
  REAL_RESPONSES,
  MARKET_SIGNAL_STATE,
  type SignalProfile,
  type OutreachTemplate,
  type ResponseLogEntry,
} from '../lib/market-signals'

const root = join(__dirname, '..')

function readDoc(relPath: string): string {
  const fullPath = join(root, relPath)
  expect(existsSync(fullPath), `File not found: ${relPath}`).toBe(true)
  return readFileSync(fullPath, 'utf-8')
}

// ── 1. lib/market-signals.ts ──────────────────────────────────────────────────

describe('lib/market-signals — BUYER_PROFILES', () => {
  it('exports exactly 5 buyer profiles', () => {
    expect(BUYER_PROFILES).toHaveLength(5)
  })

  it('all buyer profiles have required fields', () => {
    BUYER_PROFILES.forEach((p: SignalProfile) => {
      expect(p.id).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.whyRelevant).toBeTruthy()
      expect(p.coreProblem).toBeTruthy()
      expect(p.whyCWFits).toBeTruthy()
      expect(p.proofQuestion).toBeTruthy()
      expect(p.complianceNote).toBeTruthy()
    })
  })

  it('all buyer profiles have outreachStatus not-started', () => {
    BUYER_PROFILES.forEach(p => {
      expect(p.outreachStatus).toBe('not-started')
    })
  })

  it('all buyer profiles have approvalRequired true', () => {
    BUYER_PROFILES.forEach(p => {
      expect(p.approvalRequired).toBe(true)
    })
  })

  it('buyer profile IDs match expected values', () => {
    const ids = BUYER_PROFILES.map(p => p.id)
    expect(ids).toContain('hr-tech-saas')
    expect(ids).toContain('intl-recruiting-agency')
    expect(ids).toContain('relocation-mobility')
    expect(ids).toContain('micro-saas-operator')
    expect(ids).toContain('portfolio-investor')
  })

  it('no buyer profile makes revenue claims', () => {
    BUYER_PROFILES.forEach(p => {
      const text = [p.description, p.whyCWFits, p.coreProblem].join(' ')
      expect(text).not.toMatch(/revenue guarantee|guaranteed revenue|guaranteed growth/i)
    })
  })
})

describe('lib/market-signals — PILOT_CUSTOMER_PROFILES', () => {
  it('exports exactly 5 pilot customer profiles', () => {
    expect(PILOT_CUSTOMER_PROFILES).toHaveLength(5)
  })

  it('all pilot customer profiles have required fields', () => {
    PILOT_CUSTOMER_PROFILES.forEach((p: SignalProfile) => {
      expect(p.id).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.proofQuestion).toBeTruthy()
      expect(p.complianceNote).toBeTruthy()
    })
  })

  it('all pilot customer profiles have outreachStatus not-started', () => {
    PILOT_CUSTOMER_PROFILES.forEach(p => {
      expect(p.outreachStatus).toBe('not-started')
    })
  })

  it('all pilot customer profiles have approvalRequired true', () => {
    PILOT_CUSTOMER_PROFILES.forEach(p => {
      expect(p.approvalRequired).toBe(true)
    })
  })

  it('pilot customer profile IDs match expected values', () => {
    const ids = PILOT_CUSTOMER_PROFILES.map(p => p.id)
    expect(ids).toContain('german-hospital-group')
    expect(ids).toContain('engineering-firm-germany')
    expect(ids).toContain('uk-hospitality-operator')
    expect(ids).toContain('netherlands-logistics')
    expect(ids).toContain('language-school-operator')
  })

  it('no pilot customer profile makes job placement guarantees', () => {
    PILOT_CUSTOMER_PROFILES.forEach(p => {
      // Check value proposition fields only — complianceNote deliberately lists "No job guarantee"
      const text = [p.whyCWFits, p.description].join(' ')
      // Only flag positive claims like "guaranteed job" or "we guarantee placement"
      expect(text).not.toMatch(/\bguaranteed\s+(a\s+)?(job|placement|employment)\b/i)
      expect(text).not.toMatch(/\bwe guarantee\s+(job|placement|employment)\b/i)
    })
  })

  it('no pilot customer profile makes visa guarantees', () => {
    PILOT_CUSTOMER_PROFILES.forEach(p => {
      // Check value proposition fields only — complianceNote deliberately lists "No visa guarantee"
      const text = [p.whyCWFits, p.description].join(' ')
      expect(text).not.toMatch(/\bguaranteed\s+(a\s+)?visa\b/i)
      expect(text).not.toMatch(/\bwe guarantee\s+visa\b/i)
    })
  })
})

describe('lib/market-signals — PARTNER_PROFILES', () => {
  it('exports exactly 5 partner profiles', () => {
    expect(PARTNER_PROFILES).toHaveLength(5)
  })

  it('all partner profiles have required fields', () => {
    PARTNER_PROFILES.forEach((p: SignalProfile) => {
      expect(p.id).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.proofQuestion).toBeTruthy()
      expect(p.complianceNote).toBeTruthy()
      expect(p.approvalRequired).toBe(true)
      expect(p.outreachStatus).toBe('not-started')
    })
  })

  it('partner profile IDs match expected values', () => {
    const ids = PARTNER_PROFILES.map(p => p.id)
    expect(ids).toContain('intl-recruitment-agency-partner')
    expect(ids).toContain('relocation-service-partner')
    expect(ids).toContain('language-school-partner')
    expect(ids).toContain('hr-consulting-partner')
    expect(ids).toContain('strategic-tech-partner')
  })
})

describe('lib/market-signals — OUTREACH_TEMPLATES', () => {
  it('exports exactly 3 outreach templates', () => {
    expect(OUTREACH_TEMPLATES).toHaveLength(3)
  })

  it('templates cover buyer, pilot-customer, and partner audiences', () => {
    const audiences = OUTREACH_TEMPLATES.map((t: OutreachTemplate) => t.audience)
    expect(audiences).toContain('buyer')
    expect(audiences).toContain('pilot-customer')
    expect(audiences).toContain('partner')
  })

  it('all templates have id, label, subject, body, and rules', () => {
    OUTREACH_TEMPLATES.forEach((t: OutreachTemplate) => {
      expect(t.id).toBeTruthy()
      expect(t.label).toBeTruthy()
      expect(t.subject).toBeTruthy()
      expect(t.body).toBeTruthy()
      expect(Array.isArray(t.rules)).toBe(true)
      expect(t.rules.length).toBeGreaterThan(0)
    })
  })

  it('all templates include a no-auto-send rule', () => {
    OUTREACH_TEMPLATES.forEach(t => {
      const rulesText = t.rules.join(' ')
      expect(rulesText).toMatch(/manual|manually|no.?auto|no bulk/i)
    })
  })

  it('no template makes revenue or customer claims', () => {
    OUTREACH_TEMPLATES.forEach(t => {
      expect(t.body).not.toMatch(/\d+\s*paying customers/i)
      expect(t.body).not.toMatch(/€\d+\s*(MRR|ARR|monthly revenue)/i)
    })
  })

  it('buyer template states pre-revenue status', () => {
    const buyerTemplate = OUTREACH_TEMPLATES.find(t => t.audience === 'buyer')!
    expect(buyerTemplate.body).toMatch(/pre-revenue/i)
  })
})

describe('lib/market-signals — RESPONSE_LOG_TEMPLATE', () => {
  it('has all required fields', () => {
    const t: ResponseLogEntry = RESPONSE_LOG_TEMPLATE
    expect(t).toHaveProperty('date')
    expect(t).toHaveProperty('contactType')
    expect(t).toHaveProperty('organization')
    expect(t).toHaveProperty('contactPerson')
    expect(t).toHaveProperty('channel')
    expect(t).toHaveProperty('sentManually')
    expect(t).toHaveProperty('responseReceived')
    expect(t).toHaveProperty('interestLevel')
    expect(t).toHaveProperty('notes')
    expect(t).toHaveProperty('shareable')
    expect(t).toHaveProperty('evidenceLink')
  })

  it('sentManually defaults to true', () => {
    expect(RESPONSE_LOG_TEMPLATE.sentManually).toBe(true)
  })

  it('responseReceived defaults to false', () => {
    expect(RESPONSE_LOG_TEMPLATE.responseReceived).toBe(false)
  })
})

describe('lib/market-signals — REAL_RESPONSES', () => {
  it('is empty — no fake responses', () => {
    expect(REAL_RESPONSES).toHaveLength(0)
  })
})

describe('lib/market-signals — MARKET_SIGNAL_STATE', () => {
  it('has sprintStatus prepared', () => {
    expect(MARKET_SIGNAL_STATE.sprintStatus).toBe('prepared')
  })

  it('outreachSent is 0', () => {
    expect(MARKET_SIGNAL_STATE.outreachSent).toBe(0)
  })

  it('responsesReceived is 0', () => {
    expect(MARKET_SIGNAL_STATE.responsesReceived).toBe(0)
  })

  it('realProofItems is 0', () => {
    expect(MARKET_SIGNAL_STATE.realProofItems).toBe(0)
  })

  it('noAutoSend is true', () => {
    expect(MARKET_SIGNAL_STATE.noAutoSend).toBe(true)
  })

  it('noScraping is true', () => {
    expect(MARKET_SIGNAL_STATE.noScraping).toBe(true)
  })

  it('noFakeResponses is true', () => {
    expect(MARKET_SIGNAL_STATE.noFakeResponses).toBe(true)
  })

  it('manualApprovalOnly is true', () => {
    expect(MARKET_SIGNAL_STATE.manualApprovalOnly).toBe(true)
  })

  it('disclaimer mentions no outreach sent', () => {
    expect(MARKET_SIGNAL_STATE.disclaimer).toMatch(/no outreach/i)
  })

  it('disclaimer mentions no market proof', () => {
    expect(MARKET_SIGNAL_STATE.disclaimer).toMatch(/no market proof/i)
  })
})

// ── 2. docs/market-signals/ markdown files ────────────────────────────────────

describe('docs/market-signals — 6 markdown files exist', () => {
  const docs = [
    'docs/market-signals/target-buyer-profiles.md',
    'docs/market-signals/pilot-customer-profiles.md',
    'docs/market-signals/partner-profiles.md',
    'docs/market-signals/manual-outreach-playbook.md',
    'docs/market-signals/response-evidence-log-template.md',
    'docs/market-signals/loi-email-template.md',
  ]

  docs.forEach(doc => {
    it(`${doc} exists`, () => {
      expect(existsSync(join(root, doc))).toBe(true)
    })
  })
})

describe('docs/market-signals/target-buyer-profiles.md — content', () => {
  let body: string
  beforeAll(() => { body = readDoc('docs/market-signals/target-buyer-profiles.md') })

  it('mentions safety rules', () => {
    expect(body).toMatch(/safety rules|no fake/i)
  })
  it('contains 5 buyer profiles', () => {
    expect(body).toMatch(/HR-Tech SaaS/i)
    expect(body).toMatch(/Recruiting Agency/i)
    expect(body).toMatch(/Relocation/i)
    expect(body).toMatch(/Micro-SaaS/i)
    expect(body).toMatch(/Portfolio Investor|Micro-PE/i)
  })
  it('contains proof questions', () => {
    expect(body).toMatch(/proof question/i)
  })
  it('states no fake buyers', () => {
    expect(body).toMatch(/no fake buyers/i)
  })
  it('contains compliance notes', () => {
    expect(body).toMatch(/compliance note/i)
  })
})

describe('docs/market-signals/pilot-customer-profiles.md — content', () => {
  let body: string
  beforeAll(() => { body = readDoc('docs/market-signals/pilot-customer-profiles.md') })

  it('mentions safety rules', () => {
    expect(body).toMatch(/safety rules|no fake/i)
  })
  it('contains 5 pilot customer profiles', () => {
    expect(body).toMatch(/German Hospital/i)
    expect(body).toMatch(/Engineering|Manufacturing/i)
    expect(body).toMatch(/UK Hospitality|Post-Brexit/i)
    expect(body).toMatch(/Netherlands Logistics/i)
    expect(body).toMatch(/Language School/i)
  })
  it('states no job guarantee', () => {
    expect(body).toMatch(/no job guarantee/i)
  })
  it('states no visa guarantee', () => {
    expect(body).toMatch(/no visa guarantee/i)
  })
  it('explains what counts as pilot signal', () => {
    expect(body).toMatch(/what counts as a pilot signal/i)
  })
})

describe('docs/market-signals/partner-profiles.md — content', () => {
  let body: string
  beforeAll(() => { body = readDoc('docs/market-signals/partner-profiles.md') })

  it('contains 5 partner profiles', () => {
    expect(body).toMatch(/Recruitment Agency/i)
    expect(body).toMatch(/Relocation Service/i)
    expect(body).toMatch(/Language School/i)
    expect(body).toMatch(/HR Consulting/i)
    expect(body).toMatch(/ATS|Strategic Tech/i)
  })
  it('states no fake partners', () => {
    expect(body).toMatch(/no fake partners/i)
  })
  it('explains what counts as a partner signal', () => {
    expect(body).toMatch(/what counts as a partner signal/i)
  })
})

describe('docs/market-signals/manual-outreach-playbook.md — content', () => {
  let body: string
  beforeAll(() => { body = readDoc('docs/market-signals/manual-outreach-playbook.md') })

  it('has absolute rules section', () => {
    expect(body).toMatch(/absolute rules/i)
  })
  it('explicitly states no auto-send', () => {
    expect(body).toMatch(/no auto-send/i)
  })
  it('explicitly states no scraping', () => {
    expect(body).toMatch(/no scraping/i)
  })
  it('explicitly states no mass messaging', () => {
    expect(body).toMatch(/no mass messaging/i)
  })
  it('explicitly states no fake responses', () => {
    expect(body).toMatch(/no fake responses/i)
  })
  it('has step-by-step process', () => {
    expect(body).toMatch(/step 1/i)
    expect(body).toMatch(/step 2/i)
    expect(body).toMatch(/step 3/i)
  })
  it('explains what to share with interested contacts', () => {
    expect(body).toMatch(/what to share/i)
  })
  it('states no revenue guarantee', () => {
    expect(body).toMatch(/no revenue guarantee|no.*guarantee/i)
  })
  it('explains 3-tier value impact', () => {
    expect(body).toMatch(/tier 1|15.*25|15k.*25k/i)
  })
})

describe('docs/market-signals/response-evidence-log-template.md — content', () => {
  let body: string
  beforeAll(() => { body = readDoc('docs/market-signals/response-evidence-log-template.md') })

  it('has safety rules section', () => {
    expect(body).toMatch(/safety rules/i)
  })
  it('states only real verifiable responses', () => {
    expect(body).toMatch(/real.*verifiable|only.*real/i)
  })
  it('has a log entry template', () => {
    expect(body).toMatch(/date sent/i)
    expect(body).toMatch(/contact type/i)
    expect(body).toMatch(/sent manually/i)
  })
  it('shows no entries yet', () => {
    expect(body).toMatch(/no entries yet|no outreach has been sent/i)
  })
  it('explains what counts as market proof', () => {
    expect(body).toMatch(/what counts as market proof/i)
  })
  it('states verbal conversations do not count', () => {
    expect(body).toMatch(/verbal.*do not count|does not count/i)
  })
})

describe('docs/market-signals/loi-email-template.md — content', () => {
  let body: string
  beforeAll(() => { body = readDoc('docs/market-signals/loi-email-template.md') })

  it('states LOI is non-binding', () => {
    expect(body).toMatch(/non.?binding/i)
  })
  it('warns not to send to cold contacts', () => {
    expect(body).toMatch(/do not send.*cold|not for unsolicited/i)
  })
  it('contains escrow reference', () => {
    expect(body).toMatch(/escrow/i)
  })
  it('states LOI does not guarantee a sale', () => {
    expect(body).toMatch(/does not guarantee a sale/i)
  })
  it('contains LOI template subject line', () => {
    expect(body).toMatch(/Letter of Intent.*CorridorWork/i)
  })
})

// ── 3. app/admin/market-signals/ — page and client ────────────────────────────

describe('app/admin/market-signals/page.tsx — admin protection', () => {
  let body: string
  beforeAll(() => { body = readDoc('app/admin/market-signals/page.tsx') })

  it('exists', () => {
    expect(existsSync(join(root, 'app/admin/market-signals/page.tsx'))).toBe(true)
  })

  it('calls getCurrentAdminUser', () => {
    expect(body).toMatch(/getCurrentAdminUser/i)
  })

  it('redirects if not admin', () => {
    expect(body).toMatch(/redirect/i)
  })

  it('has noindex robots metadata', () => {
    expect(body).toMatch(/noindex/)
  })

  it('has force-dynamic', () => {
    expect(body).toMatch(/force-dynamic/)
  })

  it('imports MarketSignalsClient', () => {
    expect(body).toMatch(/MarketSignalsClient/)
  })
})

describe('app/admin/market-signals/_components/MarketSignalsClient.tsx', () => {
  let body: string
  beforeAll(() => { body = readDoc('app/admin/market-signals/_components/MarketSignalsClient.tsx') })

  it('exists', () => {
    expect(existsSync(join(root, 'app/admin/market-signals/_components/MarketSignalsClient.tsx'))).toBe(true)
  })

  it('is a client component', () => {
    expect(body).toMatch(/'use client'/)
  })

  it('imports BUYER_PROFILES', () => {
    expect(body).toMatch(/BUYER_PROFILES/)
  })

  it('imports PILOT_CUSTOMER_PROFILES', () => {
    expect(body).toMatch(/PILOT_CUSTOMER_PROFILES/)
  })

  it('imports PARTNER_PROFILES', () => {
    expect(body).toMatch(/PARTNER_PROFILES/)
  })

  it('imports OUTREACH_TEMPLATES', () => {
    expect(body).toMatch(/OUTREACH_TEMPLATES/)
  })

  it('imports MARKET_SIGNAL_STATE', () => {
    expect(body).toMatch(/MARKET_SIGNAL_STATE/)
  })

  it('has overview tab', () => {
    expect(body).toMatch(/overview/)
  })

  it('has buyers tab', () => {
    expect(body).toMatch(/buyers/)
  })

  it('has templates tab', () => {
    expect(body).toMatch(/templates/)
  })

  it('has responses tab', () => {
    expect(body).toMatch(/responses/)
  })

  it('shows no responses when REAL_RESPONSES is empty', () => {
    expect(body).toMatch(/no.*responses.*logged|REAL_RESPONSES.*length.*0/i)
  })
})

// ── 4. for-buyers — market validation note ────────────────────────────────────

describe('app/for-buyers/page.tsx — market validation note', () => {
  let body: string
  beforeAll(() => { body = readDoc('app/for-buyers/page.tsx') })

  it('mentions market validation process prepared', () => {
    expect(body).toMatch(/market validation.*prepared|validation.*process.*prepared/i)
  })

  it('states no revenue or customer traction claimed', () => {
    expect(body).toMatch(/no revenue.*claimed|no.*traction.*claimed/i)
  })

  it('mentions no automated outreach', () => {
    expect(body).toMatch(/no automated outreach/i)
  })
})

// ── 5. sale-readiness — market signal sprint status ───────────────────────────

describe('app/admin/sale-readiness/page.tsx — market signal sprint status', () => {
  let body: string
  beforeAll(() => { body = readDoc('app/admin/sale-readiness/page.tsx') })

  it('mentions Market Signal Sprint', () => {
    expect(body).toMatch(/market signal sprint/i)
  })

  it('states no outreach sent yet', () => {
    expect(body).toMatch(/no outreach.*sent|0 messages sent/i)
  })

  it('states 0 responses received', () => {
    expect(body).toMatch(/0.*responses|no responses/i)
  })

  it('links to market-signals admin page', () => {
    expect(body).toMatch(/admin\/market-signals/)
  })
})

// ── 6. Safety sweep — across all new files ────────────────────────────────────

describe('Safety sweep — no forbidden content in market signals files', () => {
  const files = [
    'lib/market-signals.ts',
    'app/admin/market-signals/page.tsx',
    'app/admin/market-signals/_components/MarketSignalsClient.tsx',
    'docs/market-signals/target-buyer-profiles.md',
    'docs/market-signals/pilot-customer-profiles.md',
    'docs/market-signals/partner-profiles.md',
    'docs/market-signals/manual-outreach-playbook.md',
    'docs/market-signals/response-evidence-log-template.md',
    'docs/market-signals/loi-email-template.md',
  ]

  files.forEach(file => {
    it(`${file} — no fake LOI claims`, () => {
      const body = readDoc(file)
      // Should not claim to have signed LOIs
      expect(body).not.toMatch(/we have.*LOI|LOI.*signed.*from|confirmed.*LOI/i)
    })

    it(`${file} — no claimed revenue`, () => {
      const body = readDoc(file)
      // Should not claim current/actual positive revenue figures
      // Allow: "MRR-based valuation" (future/conditional pricing), tier descriptions
      // Block: "current MRR: €X", "our MRR is €X", "MRR: €X"
      expect(body).not.toMatch(/\bcurrent MRR.*€[1-9]|our MRR.*€[1-9]|MRR:\s*€[1-9]|ARR:\s*€[1-9]/i)
    })

    it(`${file} — no fake customer count`, () => {
      const body = readDoc(file)
      // Should not claim real customer counts > 0 as current fact
      expect(body).not.toMatch(/\d+\s+paying customers|customers.*\d+.*confirmed/i)
    })
  })

  it('REAL_RESPONSES array is permanently empty (no fake responses)', () => {
    expect(REAL_RESPONSES).toHaveLength(0)
  })

  it('lib/market-signals.ts source does not have fake response entries', () => {
    const body = readDoc('lib/market-signals.ts')
    // REAL_RESPONSES should equal the empty array literal
    expect(body).toMatch(/REAL_RESPONSES.*=.*\[\]/)
  })

  it('no admin market-signals file makes positive job guarantee claims', () => {
    const body = readDoc('app/admin/market-signals/_components/MarketSignalsClient.tsx')
    // Only flag active positive claims — "No job guarantee" is a safety statement, not a claim
    expect(body).not.toMatch(/\bguaranteed\s+(a\s+)?(job|placement|employment)\b/i)
    expect(body).not.toMatch(/\bwe guarantee\s+(job|placement|employment)\b/i)
  })

  it('no admin market-signals file makes positive visa guarantee claims', () => {
    const body = readDoc('app/admin/market-signals/_components/MarketSignalsClient.tsx')
    // Only flag active positive claims — "No visa guarantee" is a safety statement, not a claim
    expect(body).not.toMatch(/\bguaranteed\s+(a\s+)?visa\b/i)
    expect(body).not.toMatch(/\bwe guarantee\s+visa\b/i)
  })
})
