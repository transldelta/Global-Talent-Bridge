/**
 * __tests__/pilot-targets.test.ts
 *
 * Tests for lib/pilot-target-strategy.ts and the /admin/pilot-targets page.
 * No DB calls. No server imports. No email sending.
 *
 * Coverage:
 * - TARGET_GROUPS: structure, content
 * - FIT_SCORE_CRITERIA: structure, weights sum to 100
 * - calculateFitScore: correct scoring
 * - fitScoreLabel: correct thresholds
 * - RED_FLAGS: structure, severity, includes job/visa/fee flags
 * - OPERATING_RULES: includes all key rules
 * - TARGET_STATUS_OPTIONS: includes all statuses
 * - EXAMPLE_TARGET_PROFILES: structure, disclaimer, specific profiles
 * - GUIDED_ACTION: title, subtitle, 6 steps
 * - PILOT_ROUTES: 3 routes A/B/C
 * - generateOutreachDrafts: 4 drafts, CorridorWork Team signed, no auto-send
 * - Page file: admin guard, noindex, guided action box
 * - Component file: no send button, Fit Score, Red Flags, copy-ready drafts,
 *   example profiles, "not a real lead" disclaimer, human approval required
 * - Docs: guided action, example profiles, what to do after reply
 */

import { describe, it, expect } from 'vitest'
import {
  TARGET_GROUPS,
  FIT_SCORE_CRITERIA,
  RED_FLAGS,
  OPERATING_RULES,
  TARGET_STATUS_OPTIONS,
  EXAMPLE_TARGET_PROFILES,
  GUIDED_ACTION,
  PILOT_ROUTES,
  calculateFitScore,
  fitScoreLabel,
  generateOutreachDrafts,
} from '@/lib/pilot-target-strategy'
import { readFileSync } from 'fs'
import { join }         from 'path'

function readFile(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf-8')
}

// ── TARGET_GROUPS ─────────────────────────────────────────────────────────────

describe('TARGET_GROUPS', () => {
  it('has exactly 3 target groups', () => {
    expect(TARGET_GROUPS).toHaveLength(3)
  })

  it('includes employer group', () => {
    expect(TARGET_GROUPS.some((g) => g.id === 'employer')).toBe(true)
  })

  it('includes recruiting_partner group', () => {
    expect(TARGET_GROUPS.some((g) => g.id === 'recruiting_partner')).toBe(true)
  })

  it('includes strategic_partner group', () => {
    expect(TARGET_GROUPS.some((g) => g.id === 'strategic_partner')).toBe(true)
  })

  it('every group has required fields', () => {
    for (const g of TARGET_GROUPS) {
      expect(typeof g.label).toBe('string')
      expect(g.label.length).toBeGreaterThan(0)
      expect(typeof g.tagline).toBe('string')
      expect(typeof g.why).toBe('string')
      expect(Array.isArray(g.examples)).toBe(true)
      expect(g.examples.length).toBeGreaterThan(0)
      expect(typeof g.approach).toBe('string')
    }
  })

  it('employer group has healthcare and IT in examples', () => {
    const employer = TARGET_GROUPS.find((g) => g.id === 'employer')!
    const examplesText = employer.examples.join(' ')
    expect(examplesText).toMatch(/healthcare|Health/i)
    expect(examplesText).toMatch(/IT|Software|software/i)
  })
})

// ── FIT_SCORE_CRITERIA ────────────────────────────────────────────────────────

describe('FIT_SCORE_CRITERIA', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(FIT_SCORE_CRITERIA)).toBe(true)
    expect(FIT_SCORE_CRITERIA.length).toBeGreaterThan(0)
  })

  it('weights sum to 100', () => {
    const total = FIT_SCORE_CRITERIA.reduce((s, c) => s + c.weight, 0)
    expect(total).toBe(100)
  })

  it('every criterion has key, label, desc, weight', () => {
    for (const c of FIT_SCORE_CRITERIA) {
      expect(typeof c.key).toBe('string')
      expect(c.key.length).toBeGreaterThan(0)
      expect(typeof c.label).toBe('string')
      expect(typeof c.desc).toBe('string')
      expect(typeof c.weight).toBe('number')
      expect(c.weight).toBeGreaterThan(0)
    }
  })

  it('includes real workforce demand criterion', () => {
    expect(FIT_SCORE_CRITERIA.some((c) => /demand|workforce/i.test(c.label))).toBe(true)
  })

  it('includes international openness criterion', () => {
    expect(FIT_SCORE_CRITERIA.some((c) => /international/i.test(c.label))).toBe(true)
  })

  it('includes no risky promises criterion', () => {
    expect(FIT_SCORE_CRITERIA.some((c) => /guarantee|risky/i.test(c.label))).toBe(true)
  })
})

// ── calculateFitScore ─────────────────────────────────────────────────────────

describe('calculateFitScore', () => {
  it('returns 0 for empty criteria', () => {
    expect(calculateFitScore([])).toBe(0)
  })

  it('returns 100 for all criteria', () => {
    const allKeys = FIT_SCORE_CRITERIA.map((c) => c.key)
    expect(calculateFitScore(allKeys)).toBe(100)
  })

  it('returns correct partial score', () => {
    const firstKey   = FIT_SCORE_CRITERIA[0].key
    const firstWeight = FIT_SCORE_CRITERIA[0].weight
    expect(calculateFitScore([firstKey])).toBe(firstWeight)
  })

  it('ignores unknown keys', () => {
    expect(calculateFitScore(['nonexistent_key'])).toBe(0)
  })
})

// ── fitScoreLabel ─────────────────────────────────────────────────────────────

describe('fitScoreLabel', () => {
  it('score >= 70 returns green Strong fit', () => {
    const result = fitScoreLabel(70)
    expect(result.color).toBe('green')
    expect(result.label).toMatch(/strong/i)
  })

  it('score 40-69 returns yellow Possible fit', () => {
    const result = fitScoreLabel(55)
    expect(result.color).toBe('yellow')
    expect(result.label).toMatch(/possible/i)
  })

  it('score < 40 returns red Poor fit', () => {
    const result = fitScoreLabel(20)
    expect(result.color).toBe('red')
    expect(result.label).toMatch(/poor/i)
  })

  it('score 100 is still green', () => {
    expect(fitScoreLabel(100).color).toBe('green')
  })

  it('score 0 is red', () => {
    expect(fitScoreLabel(0).color).toBe('red')
  })
})

// ── RED_FLAGS ─────────────────────────────────────────────────────────────────

describe('RED_FLAGS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(RED_FLAGS)).toBe(true)
    expect(RED_FLAGS.length).toBeGreaterThan(0)
  })

  it('every flag has label, desc, severity', () => {
    for (const f of RED_FLAGS) {
      expect(typeof f.label).toBe('string')
      expect(f.label.length).toBeGreaterThan(0)
      expect(typeof f.desc).toBe('string')
      expect(['high', 'medium']).toContain(f.severity)
    }
  })

  it('includes job guarantee as high-severity flag', () => {
    const flag = RED_FLAGS.find((f) => /job guarantee/i.test(f.label))
    expect(flag).toBeDefined()
    expect(flag!.severity).toBe('high')
  })

  it('includes visa guarantee as high-severity flag', () => {
    const flag = RED_FLAGS.find((f) => /visa guarantee/i.test(f.label))
    expect(flag).toBeDefined()
    expect(flag!.severity).toBe('high')
  })

  it('includes candidate fee as high-severity flag', () => {
    const flag = RED_FLAGS.find((f) => /candidate fee/i.test(f.label))
    expect(flag).toBeDefined()
    expect(flag!.severity).toBe('high')
  })

  it('has at least one medium-severity flag', () => {
    expect(RED_FLAGS.some((f) => f.severity === 'medium')).toBe(true)
  })
})

// ── OPERATING_RULES ───────────────────────────────────────────────────────────

describe('OPERATING_RULES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(OPERATING_RULES)).toBe(true)
    expect(OPERATING_RULES.length).toBeGreaterThan(0)
  })

  it('every rule has label and ok boolean', () => {
    for (const r of OPERATING_RULES) {
      expect(typeof r.label).toBe('string')
      expect(typeof r.ok).toBe('boolean')
    }
  })

  it('includes "No automatic outreach" rule', () => {
    expect(OPERATING_RULES.some((r) => /automatic outreach/i.test(r.label))).toBe(true)
  })

  it('"No automatic outreach" is ok: true', () => {
    const rule = OPERATING_RULES.find((r) => /automatic outreach/i.test(r.label))
    expect(rule?.ok).toBe(true)
  })

  it('includes "No job guarantee" or equivalent', () => {
    expect(OPERATING_RULES.some((r) => /job guarantee/i.test(r.label))).toBe(true)
  })

  it('includes "No visa guarantee" or equivalent', () => {
    expect(OPERATING_RULES.some((r) => /visa guarantee/i.test(r.label))).toBe(true)
  })

  it('includes "No candidate fees" rule', () => {
    expect(OPERATING_RULES.some((r) => /candidate fee/i.test(r.label))).toBe(true)
  })

  it('includes "Human approval required" rule', () => {
    expect(OPERATING_RULES.some((r) => /human approval|approval required/i.test(r.label))).toBe(true)
  })

  it('"Human approval required" is ok: true', () => {
    const rule = OPERATING_RULES.find((r) => /human approval|approval required/i.test(r.label))
    expect(rule?.ok).toBe(true)
  })

  it('includes "No payment active" or equivalent', () => {
    expect(OPERATING_RULES.some((r) => /payment/i.test(r.label))).toBe(true)
  })

  it('includes legal review warning', () => {
    expect(OPERATING_RULES.some((r) => /legal review/i.test(r.label))).toBe(true)
  })
})

// ── TARGET_STATUS_OPTIONS ─────────────────────────────────────────────────────

describe('TARGET_STATUS_OPTIONS', () => {
  it('has at least 5 status options', () => {
    expect(TARGET_STATUS_OPTIONS.length).toBeGreaterThanOrEqual(5)
  })

  it('includes pilot_discussion status', () => {
    expect(TARGET_STATUS_OPTIONS.some((s) => s.value === 'pilot_discussion')).toBe(true)
  })

  it('includes idea and shortlisted status', () => {
    expect(TARGET_STATUS_OPTIONS.some((s) => s.value === 'idea')).toBe(true)
    expect(TARGET_STATUS_OPTIONS.some((s) => s.value === 'shortlisted')).toBe(true)
  })

  it('includes contacted_manually status', () => {
    expect(TARGET_STATUS_OPTIONS.some((s) => s.value === 'contacted_manually')).toBe(true)
  })
})

// ── generateOutreachDrafts ────────────────────────────────────────────────────

describe('generateOutreachDrafts', () => {
  const drafts = generateOutreachDrafts('Acme GmbH', 'Healthcare')

  it('returns exactly 4 drafts', () => {
    expect(drafts).toHaveLength(4)
  })

  it('drafts have required fields', () => {
    for (const d of drafts) {
      expect(typeof d.id).toBe('string')
      expect(typeof d.label).toBe('string')
      expect(typeof d.channel).toBe('string')
      expect(typeof d.note).toBe('string')
      expect(typeof d.text).toBe('string')
      expect(d.text.length).toBeGreaterThan(50)
    }
  })

  it('includes linkedin, email, whatsapp, and strategic drafts', () => {
    const ids = drafts.map((d) => d.id)
    expect(ids).toContain('linkedin')
    expect(ids).toContain('email')
    expect(ids).toContain('whatsapp')
    expect(ids).toContain('strategic')
  })

  it('all drafts contain CorridorWork Team signature', () => {
    for (const d of drafts) {
      expect(d.text).toContain('CorridorWork Team')
    }
  })

  it('email and strategic drafts contain the company name', () => {
    // LinkedIn draft is a generic language-school message (not company-specific by design)
    // WhatsApp uses company but not sector; email + strategic use both
    const email    = drafts.find((d) => d.id === 'email')!
    const strategic = drafts.find((d) => d.id === 'strategic')!
    expect(email.text).toContain('Acme GmbH')
    expect(strategic.text).toContain('Acme GmbH')
  })

  it('email and strategic drafts contain the sector', () => {
    const email     = drafts.find((d) => d.id === 'email')!
    const strategic = drafts.find((d) => d.id === 'strategic')!
    expect(email.text).toContain('Healthcare')
    expect(strategic.text).toContain('Healthcare')
  })

  it('no draft contains job guarantee language', () => {
    for (const d of drafts) {
      expect(d.text).not.toMatch(/guaranteed placement|guarantee.*employment|employment.*guarantee/i)
    }
  })

  it('no draft contains visa guarantee language', () => {
    for (const d of drafts) {
      expect(d.text).not.toMatch(/guaranteed visa|visa.*guarantee|guarantee.*visa/i)
    }
  })

  it('no draft contains Global Talent Bridge', () => {
    for (const d of drafts) {
      expect(d.text).not.toContain('Global Talent Bridge')
    }
  })

  it('no draft contains a sendEmail or fetch send call', () => {
    for (const d of drafts) {
      expect(d.text).not.toMatch(/sendEmail|sendMail|fetch.*send/i)
    }
  })

  it('no draft contains sales clichés (kein Abo / no free trial / no risk)', () => {
    for (const d of drafts) {
      expect(d.text).not.toMatch(/kein Abo|no subscription|no risk|no commitment|free trial/i)
    }
  })

  it('LinkedIn draft uses professional B2B framing', () => {
    const li = drafts.find((d) => d.id === 'linkedin')!
    expect(li.text).toMatch(/unverbindlich|Feedbackgespräch|Pilotphase|strukturierte Erfassung/i)
  })

  it('LinkedIn draft explicitly states no job guarantee', () => {
    const li = drafts.find((d) => d.id === 'linkedin')!
    expect(li.text).toMatch(/keine Jobgarantie|keine.*Garantie|nicht um Jobgarantie/i)
  })

  it('email draft uses professional B2B framing', () => {
    const em = drafts.find((d) => d.id === 'email')!
    expect(em.text).toMatch(/unverbindlich|Feedbackgespräch|Pilotphase|strukturierte Erfassung/i)
  })

  it('email draft states no job guarantee and no visa advisory', () => {
    const em = drafts.find((d) => d.id === 'email')!
    expect(em.text).toMatch(/Jobgarantie|Visaberatung/i)
  })

  it('email draft states manual review', () => {
    const em = drafts.find((d) => d.id === 'email')!
    expect(em.text).toMatch(/manuell geprüft|manuelle/i)
  })

  it('WhatsApp draft is short (under 600 chars)', () => {
    const wa = drafts.find((d) => d.id === 'whatsapp')!
    expect(wa.text.length).toBeLessThan(600)
  })

  it('strategic draft references /strategic-partnership', () => {
    const st = drafts.find((d) => d.id === 'strategic')!
    expect(st.text).toContain('/strategic-partnership')
  })

  it('strategic draft states no automatic outreach', () => {
    const st = drafts.find((d) => d.id === 'strategic')!
    expect(st.text).toMatch(/keine automatische|no auto-outreach/i)
  })
})

describe('generateOutreachDrafts — graceful fallback', () => {
  const drafts = generateOutreachDrafts('', '')

  it('works without company name or sector', () => {
    expect(drafts).toHaveLength(4)
    for (const d of drafts) {
      expect(d.text).toContain('CorridorWork Team')
    }
  })

  it('uses fallback text for empty company name', () => {
    const combined = drafts.map((d) => d.text).join('\n')
    expect(combined).toMatch(/your organisation/i)
  })
})

// ── Page file safety checks ───────────────────────────────────────────────────

describe('/admin/pilot-targets — page file', () => {
  const page = readFile('app/admin/pilot-targets/page.tsx')

  it('has admin guard / redirect to login', () => {
    expect(page).toMatch(/redirect.*login|getCurrentAdminUser/i)
  })

  it('is noindex nofollow', () => {
    expect(page).toMatch(/noindex.*nofollow|nofollow.*noindex/i)
  })

  it('imports PilotTargetsClient', () => {
    expect(page).toContain('PilotTargetsClient')
  })
})

// ── Component file safety checks ─────────────────────────────────────────────

describe('/admin/pilot-targets — component file', () => {
  const comp = readFile('app/admin/pilot-targets/_components/PilotTargetsClient.tsx')

  it('renders operating rules from OPERATING_RULES (imports from lib)', () => {
    // Rules text is in OPERATING_RULES lib constant (tested separately).
    // Component renders them dynamically — verify it imports and uses OPERATING_RULES.
    expect(comp).toContain('OPERATING_RULES')
    expect(comp).toMatch(/rule\.label|rule\[.label.\]/i)
  })

  it('contains "No automatic outreach" in Operating Rules section heading or note', () => {
    // The component renders "No automatic outreach" either as section text or via rule.label
    // Verify via the operating rules array in the lib (already tested in OPERATING_RULES suite)
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/No automatic outreach/i)
  })

  it('contains "No job guarantee" in lib operating rules', () => {
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/No job guarantee/i)
  })

  it('contains "No visa guarantee" in lib operating rules', () => {
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/No visa guarantee/i)
  })

  it('contains "No candidate fees active" in lib operating rules', () => {
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/No candidate fee/i)
  })

  it('contains "Human approval required" in lib operating rules', () => {
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/Human approval required/i)
  })

  it('contains Target Card Template section', () => {
    expect(comp).toMatch(/Target Card Template/i)
  })

  it('contains Fit Score section', () => {
    expect(comp).toMatch(/Fit Score/i)
  })

  it('contains Red Flags section', () => {
    expect(comp).toMatch(/Red Flag/i)
  })

  it('contains copy-ready outreach drafts section', () => {
    expect(comp).toMatch(/Manual Outreach Pack|copy-only|Copy.*ready/i)
  })

  it('has no send button (no sendEmail call)', () => {
    expect(comp).not.toMatch(/sendEmail|sendMail/i)
    expect(comp).not.toMatch(/type="submit"[\s\S]{0,100}send/i)
  })

  it('does not integrate Stripe', () => {
    expect(comp).not.toMatch(/stripe\.com|loadStripe|StripeProvider|STRIPE_SECRET/i)
  })

  it('does not contain Global Talent Bridge as visible brand', () => {
    const lines = comp.split('\n').filter((l) => !l.trim().startsWith('//'))
    expect(lines.join('\n')).not.toContain('Global Talent Bridge')
  })

  it('imports from lib/pilot-target-strategy', () => {
    expect(comp).toContain('pilot-target-strategy')
  })
})

// ── Docs file checks ──────────────────────────────────────────────────────────

describe('FIRST_PILOT_TARGET_STRATEGY.md', () => {
  const doc = readFile('docs/FIRST_PILOT_TARGET_STRATEGY.md')

  it('file exists and is substantial', () => {
    expect(doc.length).toBeGreaterThan(1000)
  })

  it('contains goal section', () => {
    expect(doc).toMatch(/Goal/i)
  })

  it('lists employer target group', () => {
    expect(doc).toMatch(/Employer|employer/i)
  })

  it('lists recruiting partner group', () => {
    expect(doc).toMatch(/Recruiting.*Partner|Partner.*Recruiting/i)
  })

  it('lists strategic partner group', () => {
    expect(doc).toMatch(/Strategic.*Partner/i)
  })

  it('contains prioritisation guidance', () => {
    expect(doc).toMatch(/prioritis|prioritiz/i)
  })

  it('states no automatic outreach', () => {
    expect(doc).toMatch(/No automatic outreach|never.*automat/i)
  })

  it('states no job guarantee', () => {
    expect(doc).toMatch(/No job guarantee|job guarantee.*never/i)
  })

  it('states no visa guarantee', () => {
    expect(doc).toMatch(/No visa guarantee|visa guarantee.*never/i)
  })

  it('states no Stripe', () => {
    expect(doc).toMatch(/No Stripe/i)
  })

  it('states no scraping', () => {
    expect(doc).toMatch(/No scraping/i)
  })

  it('contains pilot discussion path', () => {
    expect(doc).toMatch(/Pilot.*Discussion|pilot.*discussion|fastest.*path/i)
  })

  it('does not contain Global Talent Bridge as visible brand', () => {
    const lines = doc.split('\n').filter((l) => !l.trim().startsWith('<!--'))
    expect(lines.join('\n')).not.toContain('Global Talent Bridge')
  })
})

// ── EXAMPLE_TARGET_PROFILES ───────────────────────────────────────────────────

describe('EXAMPLE_TARGET_PROFILES', () => {
  it('has exactly 6 example profiles', () => {
    expect(EXAMPLE_TARGET_PROFILES).toHaveLength(6)
  })

  it('every profile has isExample: true', () => {
    for (const p of EXAMPLE_TARGET_PROFILES) {
      expect(p.isExample).toBe(true)
    }
  })

  it('every profile has a disclaimer "Example target profile — not a real lead"', () => {
    for (const p of EXAMPLE_TARGET_PROFILES) {
      expect(p.disclaimer).toContain('Example target profile — not a real lead')
    }
  })

  it('every profile has required fields', () => {
    for (const p of EXAMPLE_TARGET_PROFILES) {
      expect(typeof p.id).toBe('string')
      expect(typeof p.title).toBe('string')
      expect(typeof p.sector).toBe('string')
      expect(typeof p.country).toBe('string')
      expect(typeof p.whyFits).toBe('string')
      expect(['low', 'medium', 'high']).toContain(p.riskLevel)
      expect(typeof p.riskNote).toBe('string')
      expect(['linkedin', 'email', 'whatsapp', 'strategic']).toContain(p.suggestedMessageType)
      expect(typeof p.firstQuestion).toBe('string')
      expect(typeof p.nextAction).toBe('string')
    }
  })

  it('includes healthcare employer in Germany', () => {
    const p = EXAMPLE_TARGET_PROFILES.find((e) => /healthcare/i.test(e.title) && /germany/i.test(e.country))
    expect(p).toBeDefined()
    expect(p!.isExample).toBe(true)
  })

  it('includes recruiting agency in Morocco', () => {
    const p = EXAMPLE_TARGET_PROFILES.find((e) => /agency/i.test(e.title) && /morocco/i.test(e.country))
    expect(p).toBeDefined()
    expect(p!.isExample).toBe(true)
  })

  it('includes IT employer', () => {
    const p = EXAMPLE_TARGET_PROFILES.find((e) => /IT/i.test(e.title))
    expect(p).toBeDefined()
  })

  it('includes language school or training provider', () => {
    const p = EXAMPLE_TARGET_PROFILES.find((e) => /language|training/i.test(e.title))
    expect(p).toBeDefined()
  })

  it('no profile has a real company name (all are placeholders)', () => {
    for (const p of EXAMPLE_TARGET_PROFILES) {
      // Titles should be generic descriptions, not real company names
      expect(p.title).toMatch(/employer|agency|school|provider|partner/i)
    }
  })

  it('no profile promises job or visa guarantee (false marketing)', () => {
    for (const p of EXAMPLE_TARGET_PROFILES) {
      const combined = `${p.whyFits} ${p.riskNote} ${p.nextAction}`
      // Allowed: "clarify no visa guarantee" / "not visa guarantee" (compliance notes)
      // Disallowed: affirmative promise of a guarantee
      expect(combined).not.toMatch(/we guarantee|guaranteed placement|guaranteed visa outcome|visa outcome guaranteed/i)
    }
  })

  it('no profile contains Global Talent Bridge', () => {
    for (const p of EXAMPLE_TARGET_PROFILES) {
      const combined = JSON.stringify(p)
      expect(combined).not.toContain('Global Talent Bridge')
    }
  })
})

// ── GUIDED_ACTION ─────────────────────────────────────────────────────────────

describe('GUIDED_ACTION', () => {
  it('has correct title', () => {
    expect(GUIDED_ACTION.title).toBe('Next safe action: prepare one pilot target')
  })

  it('has a subtitle', () => {
    expect(typeof GUIDED_ACTION.subtitle).toBe('string')
    expect(GUIDED_ACTION.subtitle.length).toBeGreaterThan(20)
  })

  it('has exactly 6 steps', () => {
    expect(GUIDED_ACTION.steps).toHaveLength(6)
  })

  it('every step has n, label, desc', () => {
    for (const s of GUIDED_ACTION.steps) {
      expect(typeof s.n).toBe('number')
      expect(typeof s.label).toBe('string')
      expect(typeof s.desc).toBe('string')
    }
  })

  it('step numbers are 1-6', () => {
    const nums = [...GUIDED_ACTION.steps].map((s) => s.n)
    expect(nums).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('step 3 references fit score', () => {
    expect(GUIDED_ACTION.steps[2].label).toMatch(/fit score|score/i)
  })

  it('step 4 references copying a message', () => {
    expect(GUIDED_ACTION.steps[3].label).toMatch(/copy|message|draft/i)
  })

  it('step 5 references manual sending', () => {
    expect(GUIDED_ACTION.steps[4].label).toMatch(/send manually|manual/i)
  })
})

// ── PILOT_ROUTES ──────────────────────────────────────────────────────────────

describe('PILOT_ROUTES', () => {
  it('has exactly 3 routes', () => {
    expect(PILOT_ROUTES).toHaveLength(3)
  })

  it('includes Route A (Employer)', () => {
    expect(PILOT_ROUTES.some((r) => /Employer/i.test(r.label))).toBe(true)
  })

  it('includes Route B (Recruiting Partner)', () => {
    expect(PILOT_ROUTES.some((r) => /Recruiting|Partner/i.test(r.label))).toBe(true)
  })

  it('includes Route C (Strategic)', () => {
    expect(PILOT_ROUTES.some((r) => /Strategic/i.test(r.label))).toBe(true)
  })

  it('every route has required fields', () => {
    for (const r of PILOT_ROUTES) {
      expect(typeof r.id).toBe('string')
      expect(typeof r.label).toBe('string')
      expect(typeof r.tagline).toBe('string')
      expect(typeof r.bestFor).toBe('string')
      expect(Array.isArray(r.steps)).toBe(true)
      expect(r.steps.length).toBeGreaterThan(0)
      expect(typeof r.link).toBe('string')
      expect(typeof r.linkLabel).toBe('string')
    }
  })

  it('Route A links to /global/employers', () => {
    const routeA = PILOT_ROUTES.find((r) => /Employer/i.test(r.label))
    expect(routeA?.link).toContain('/global/employers')
  })

  it('Route B links to /partners', () => {
    const routeB = PILOT_ROUTES.find((r) => /Recruiting|Training/i.test(r.label))
    expect(routeB?.link).toContain('/partners')
  })

  it('Route C links to /strategic-partnership', () => {
    const routeC = PILOT_ROUTES.find((r) => /Strategic/i.test(r.label))
    expect(routeC?.link).toContain('/strategic-partnership')
  })
})

// ── Component guided-action checks ───────────────────────────────────────────

describe('/admin/pilot-targets — guided action in component', () => {
  const comp = readFile('app/admin/pilot-targets/_components/PilotTargetsClient.tsx')

  it('contains "Next safe action" guided action box (via GUIDED_ACTION import)', () => {
    // GUIDED_ACTION.title = "Next safe action: prepare one pilot target"
    // Rendered dynamically via {GUIDED_ACTION.title} — check in lib
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/Next safe action/i)
    expect(comp).toContain('GUIDED_ACTION')
  })

  it('contains disclaimer text for example profiles (via EXAMPLE_TARGET_PROFILES import)', () => {
    // Profile disclaimers rendered via {profile.disclaimer} — check in lib
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/Example target profile.*not a real lead/i)
    expect(comp).toContain('EXAMPLE_TARGET_PROFILES')
  })

  it('contains "Healthcare employer in Germany" in EXAMPLE_TARGET_PROFILES lib', () => {
    // Profile titles rendered dynamically via {profile.title}
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/Healthcare employer in Germany/i)
  })

  it('contains "Recruiting agency in Morocco" in EXAMPLE_TARGET_PROFILES lib', () => {
    const lib = readFile('lib/pilot-target-strategy.ts')
    expect(lib).toMatch(/Recruiting agency in Morocco/i)
  })

  it('contains "No automatic contact" safety notice', () => {
    expect(comp).toMatch(/No automatic contact/i)
  })

  it('contains "Human approval required" safety notice', () => {
    expect(comp).toMatch(/Human approval required/i)
  })

  it('has links to /admin/first-pilot, /global/employers, /partners', () => {
    expect(comp).toContain('/admin/first-pilot')
    expect(comp).toContain('/global/employers')
    expect(comp).toContain('/partners')
  })

  it('imports EXAMPLE_TARGET_PROFILES', () => {
    expect(comp).toContain('EXAMPLE_TARGET_PROFILES')
  })

  it('imports GUIDED_ACTION', () => {
    expect(comp).toContain('GUIDED_ACTION')
  })

  it('imports PILOT_ROUTES', () => {
    expect(comp).toContain('PILOT_ROUTES')
  })

  it('has no job guarantee promise', () => {
    expect(comp).not.toMatch(/guaranteed.*job|job.*guaranteed|guarantee.*employment/i)
  })

  it('has no visa guarantee promise', () => {
    expect(comp).not.toMatch(/guaranteed.*visa|visa.*guaranteed/i)
  })
})

// ── Docs guided-action and after-reply sections ───────────────────────────────

describe('FIRST_PILOT_TARGET_STRATEGY.md — guided action + after reply', () => {
  const doc = readFile('docs/FIRST_PILOT_TARGET_STRATEGY.md')

  it('contains Guided First Action section', () => {
    expect(doc).toMatch(/Guided First Action/i)
  })

  it('contains "Next safe action" title', () => {
    expect(doc).toMatch(/Next safe action/i)
  })

  it('contains Example Target Profiles section', () => {
    expect(doc).toMatch(/Example Target Profiles/i)
  })

  it('contains "not real companies or leads" disclaimer in docs', () => {
    expect(doc).toMatch(/not real companies|not a real/i)
  })

  it('contains Healthcare employer in Germany example', () => {
    expect(doc).toMatch(/Healthcare employer in Germany/i)
  })

  it('contains Recruiting agency in Morocco example', () => {
    expect(doc).toMatch(/Recruiting agency in Morocco/i)
  })

  it('contains what to do after a reply section', () => {
    expect(doc).toMatch(/After a Reply|after.*reply/i)
  })

  it('contains what user must approve manually section', () => {
    expect(doc).toMatch(/User Must Approve|must approve/i)
  })
})
