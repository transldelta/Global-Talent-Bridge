/**
 * __tests__/employer-response-pipeline.test.ts
 *
 * Tests für lib/employer-response-pipeline.ts
 * Keine UI, kein Supabase, kein Netzwerk.
 *
 * Validiert:
 * - Pilot Offer Varianten (3)
 * - Branchen-Pitch-Generierung (6 Typen)
 * - Objection Handling (8 Einwände)
 * - Response Classification
 * - Next Best Action
 * - getSuggestedPilotStatus
 * - Pipeline Summary
 * - getRecommendedNextAction
 * - Call Script
 * - Keine echten Sendefunktionen
 * - Gültige pilot_employers.status Werte
 * - response_type ≠ pilot_employers.status
 */

import { describe, it, expect } from 'vitest'
import {
  getPilotOfferVariants,
  getOfferVariantForEmployer,
  getIndustryPitch,
  inferPitchType,
  getObjectionResponse,
  getAllObjectionResponses,
  getCallScript,
  classifyEmployerResponse,
  getSuggestedPilotStatus,
  getRecommendedNextAction,
  buildNextBestAction,
  getPipelineSummary,
  VALID_RESPONSE_TYPES,
  VALID_INTERACTION_TYPES,
  OFFER_VARIANT_LABELS,
  RESPONSE_TYPE_LABELS,
  INTERACTION_TYPE_LABELS,
  type PilotOfferVariant,
  type IndustryPitchType,
  type ObjectionKey,
  type ResponseType,
  type InteractionType,
  type PilotEmployerRow,
} from '@/lib/employer-response-pipeline'
import { VALID_PILOT_STATUSES, isValidPilotStatus } from '@/lib/pilot-execution'

// ── Pilot Offer Variants ──────────────────────────────────────────────────────

describe('getPilotOfferVariants', () => {
  it('returns exactly 3 variants', () => {
    expect(getPilotOfferVariants()).toHaveLength(3)
  })

  it('returns validation, starter, success_based variants', () => {
    const variants = getPilotOfferVariants().map((v) => v.variant)
    expect(variants).toContain('validation')
    expect(variants).toContain('starter')
    expect(variants).toContain('success_based')
  })

  it('all variants have isEstimate: true', () => {
    for (const v of getPilotOfferVariants()) {
      expect(v.isEstimate).toBe(true)
    }
  })

  it('all variants have priceLabel containing "Vorschlag" or "Annahme"', () => {
    for (const v of getPilotOfferVariants()) {
      expect(v.priceLabel).toMatch(/vorschlag|annahme/i)
    }
  })

  it('all variants have non-empty noGuaranteeNote', () => {
    for (const v of getPilotOfferVariants()) {
      expect(v.noGuaranteeNote.length).toBeGreaterThan(5)
    }
  })

  it('no variant claims verified revenue', () => {
    for (const v of getPilotOfferVariants()) {
      const combined = (v.description + v.noGuaranteeNote).toLowerCase()
      expect(combined).not.toMatch(/verified revenue|echter umsatz|confirmed.*payment/i)
    }
  })

  it('monthlyEstimate is a positive number', () => {
    for (const v of getPilotOfferVariants()) {
      expect(v.monthlyEstimate).toBeGreaterThan(0)
    }
  })

  it('success_based variant has ANNAHME/MODELL disclaimer', () => {
    const v = getPilotOfferVariants().find((v) => v.variant === 'success_based')
    expect(v).toBeDefined()
    expect(v!.noGuaranteeNote).toMatch(/annahme|modell/i)
  })

  it('all variants have non-empty title and description', () => {
    for (const v of getPilotOfferVariants()) {
      expect(v.title.length).toBeGreaterThan(0)
      expect(v.description.length).toBeGreaterThan(20)
    }
  })
})

describe('getOfferVariantForEmployer', () => {
  it('returns starter for very_high interest', () => {
    expect(getOfferVariantForEmployer('IT-Unternehmen', 'very_high')).toBe('starter')
  })

  it('returns starter for high interest', () => {
    expect(getOfferVariantForEmployer('Pflege', 'high')).toBe('starter')
  })

  it('returns success_based for IT industry with low interest', () => {
    expect(getOfferVariantForEmployer('Software', 'low')).toBe('success_based')
  })

  it('returns validation for unknown industry and interest', () => {
    expect(getOfferVariantForEmployer(null, undefined)).toBe('validation')
  })

  it('returns validation for care industry with unknown interest', () => {
    expect(getOfferVariantForEmployer('Pflegeheim', 'unknown')).toBe('validation')
  })

  it('returns success_based for Personalvermittler', () => {
    expect(getOfferVariantForEmployer('Personalvermittler', 'medium')).toBe('success_based')
  })

  it('returns a valid PilotOfferVariant', () => {
    const valid: PilotOfferVariant[] = ['validation', 'starter', 'success_based']
    expect(valid).toContain(getOfferVariantForEmployer('Gastronomie'))
  })
})

// ── Industry Pitches ──────────────────────────────────────────────────────────

describe('inferPitchType', () => {
  it('care for Pflegeheim', () => {
    expect(inferPitchType('Pflegeheim')).toBe('care')
  })

  it('care for nursing', () => {
    expect(inferPitchType('nursing')).toBe('care')
  })

  it('it for Software', () => {
    expect(inferPitchType('Software')).toBe('it')
  })

  it('it for IT-Unternehmen (word boundary)', () => {
    expect(inferPitchType('IT-Unternehmen')).toBe('it')
  })

  it('construction for Bau', () => {
    expect(inferPitchType('Bau')).toBe('construction')
  })

  it('construction for Elektriker', () => {
    expect(inferPitchType('Elektriker')).toBe('construction')
  })

  it('hospitality for Gastronomie', () => {
    expect(inferPitchType('Gastronomie')).toBe('hospitality')
  })

  it('logistics for Logistik', () => {
    expect(inferPitchType('Logistik')).toBe('logistics')
  })

  it('other for null', () => {
    expect(inferPitchType(null)).toBe('other')
  })

  it('other for unknown industry', () => {
    expect(inferPitchType('Bergbau')).toBe('other')
  })

  it('hospital does NOT trigger IT classification', () => {
    // hospital contains 'it' substring — word boundary must prevent false match
    expect(inferPitchType('hospital')).not.toBe('it')
    expect(inferPitchType('hospital')).toBe('care')
  })

  it('Personalvermittlung does NOT trigger IT classification', () => {
    // personalvermittlung contains 'it' substring
    expect(inferPitchType('personalvermittlung')).not.toBe('it')
  })
})

describe('getIndustryPitch', () => {
  const pitchTypes: IndustryPitchType[] = ['care', 'it', 'construction', 'hospitality', 'logistics', 'other']

  it('returns a pitch for every type', () => {
    for (const type of pitchTypes) {
      const pitch = getIndustryPitch(type)
      expect(pitch.industry).toBe(type)
    }
  })

  it('all pitches have non-empty headline, problem, benefit, pilotOffer, nextAction', () => {
    for (const type of pitchTypes) {
      const p = getIndustryPitch(type)
      expect(p.headline.length).toBeGreaterThan(5)
      expect(p.problem.length).toBeGreaterThan(10)
      expect(p.benefit.length).toBeGreaterThan(10)
      expect(p.pilotOffer.length).toBeGreaterThan(5)
      expect(p.nextAction.length).toBeGreaterThan(5)
    }
  })

  it('all pitches have noFakeClaimsNote (honesty requirement)', () => {
    for (const type of pitchTypes) {
      const p = getIndustryPitch(type)
      expect(p.noFakeClaimsNote.length).toBeGreaterThan(5)
    }
  })

  it('care pitch does not promise instant availability', () => {
    const p = getIndustryPitch('care')
    const combined = (p.pilotOffer + p.noFakeClaimsNote).toLowerCase()
    expect(combined).not.toMatch(/garantier.*sofort|guaranteed.*instant|sofortige.*lieferung/i)
  })

  it('no pitch claims existing paying customers', () => {
    for (const type of pitchTypes) {
      const p = getIndustryPitch(type)
      const combined = (p.benefit + p.pilotOffer).toLowerCase()
      // Should not claim "hundreds of customers" or "proven revenue"
      expect(combined).not.toMatch(/hundert.*kunden|tausend.*kunden|proven revenue/i)
    }
  })

  it('no_customers_yet pitch acknowledges honestly', () => {
    // The "other" or general pitch should not hide lack of traction
    const p = getIndustryPitch('care')
    expect(p.noFakeClaimsNote).toMatch(/noch kein|pilot|ehrlich|no.*customer|kein.*zahlend/i)
  })
})

// ── Objection Handling ────────────────────────────────────────────────────────

describe('getObjectionResponse', () => {
  const objectionKeys: ObjectionKey[] = [
    'already_have_recruiter',
    'international_is_complex',
    'no_budget',
    'candidate_quality',
    'no_customers_yet',
    'legal_compliance',
    'how_fast',
    'after_pilot',
  ]

  it('returns response for every key', () => {
    for (const key of objectionKeys) {
      const r = getObjectionResponse(key)
      expect(r.objectionKey).toBe(key)
      expect(r.objection.length).toBeGreaterThan(5)
      expect(r.response.length).toBeGreaterThan(10)
      expect(['candid', 'positive', 'neutral']).toContain(r.honesty)
    }
  })

  it('no_customers_yet is candid', () => {
    expect(getObjectionResponse('no_customers_yet').honesty).toBe('candid')
  })

  it('legal_compliance is candid', () => {
    expect(getObjectionResponse('legal_compliance').honesty).toBe('candid')
  })

  it('candidate_quality is candid', () => {
    expect(getObjectionResponse('candidate_quality').honesty).toBe('candid')
  })

  it('how_fast is candid', () => {
    expect(getObjectionResponse('how_fast').honesty).toBe('candid')
  })

  it('no_customers_yet does not lie about existing customers', () => {
    const r = getObjectionResponse('no_customers_yet')
    const lower = r.response.toLowerCase()
    // Must acknowledge no paying customer yet
    expect(lower).toMatch(/noch kein|no.*paying|first.*pilot|kein.*zahlend/i)
  })

  it('legal_compliance mentions legal review', () => {
    const r = getObjectionResponse('legal_compliance')
    const lower = r.response.toLowerCase()
    expect(lower).toMatch(/rechtlich|legal|prüfung|review/i)
  })

  it('how_fast response does not promise same-day delivery', () => {
    const r = getObjectionResponse('how_fast')
    const lower = r.response.toLowerCase()
    expect(lower).not.toMatch(/sofort.*kandidat|kandidat.*3 tag|same day/i)
  })
})

describe('getAllObjectionResponses', () => {
  it('returns exactly 8 objection responses', () => {
    expect(getAllObjectionResponses()).toHaveLength(8)
  })

  it('all have unique objectionKey', () => {
    const keys = getAllObjectionResponses().map((o) => o.objectionKey)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

// ── Call Script ───────────────────────────────────────────────────────────────

describe('getCallScript', () => {
  it('returns a call script with all sections', () => {
    const script = getCallScript()
    expect(script).toHaveProperty('opening')
    expect(script).toHaveProperty('qualifyingQuestions')
    expect(script).toHaveProperty('needsQuestions')
    expect(script).toHaveProperty('pitchSection')
    expect(script).toHaveProperty('closingSection')
  })

  it('all sections have non-empty script and notes', () => {
    const script = getCallScript()
    for (const section of Object.values(script)) {
      expect(section.script.length).toBeGreaterThan(10)
      expect(section.notes.length).toBeGreaterThan(5)
    }
  })

  it('opening does not promise guaranteed results', () => {
    const lower = getCallScript().opening.script.toLowerCase()
    expect(lower).not.toMatch(/garantiert|guaranteed|sicher.*gewinn|definitely.*place/i)
  })

  it('closing aims for demo or follow-up, not immediate purchase', () => {
    const lower = getCallScript().closingSection.script.toLowerCase()
    expect(lower).toMatch(/demo|e-mail|unverbindlich|no.*pressure/i)
  })

  it('qualifying section has at least 2 questions', () => {
    const script = getCallScript().qualifyingQuestions.script
    const questionCount = (script.match(/\?/g) || []).length
    expect(questionCount).toBeGreaterThanOrEqual(2)
  })
})

// ── Response Classification ───────────────────────────────────────────────────

describe('classifyEmployerResponse', () => {
  it('returns no_response for empty string', () => {
    expect(classifyEmployerResponse('')).toBe('no_response')
  })

  it('returns no_response for whitespace', () => {
    expect(classifyEmployerResponse('   ')).toBe('no_response')
  })

  it('detects positive response', () => {
    expect(classifyEmployerResponse('Ja gerne, klingt interessant!')).toBe('positive')
  })

  it('detects rejected response', () => {
    expect(classifyEmployerResponse('Nein danke, kein Interesse')).toBe('rejected')
  })

  it('detects objection', () => {
    expect(classifyEmployerResponse('Das klingt kompliziert und bedenkenswert')).toBe('objection')
  })

  it('detects demo_requested', () => {
    expect(classifyEmployerResponse('Ja, wir würden eine Demo vereinbaren')).toBe('demo_requested')
  })

  it('detects pilot_requested', () => {
    expect(classifyEmployerResponse('Wir möchten den Pilot anfragen')).toBe('pilot_requested')
  })

  it('returns a valid ResponseType for any input', () => {
    const inputs = [
      'super toll',
      'nicht interessiert',
      'vielleicht später',
      'demo anfragen',
      '...',
      'Hello',
    ]
    for (const input of inputs) {
      expect(VALID_RESPONSE_TYPES as readonly string[]).toContain(classifyEmployerResponse(input))
    }
  })
})

// ── getSuggestedPilotStatus ───────────────────────────────────────────────────

describe('getSuggestedPilotStatus', () => {
  it('suggests interested when identified + positive', () => {
    expect(getSuggestedPilotStatus('identified', 'positive')).toBe('interested')
  })

  it('suggests demo_scheduled when identified + demo_requested', () => {
    expect(getSuggestedPilotStatus('identified', 'demo_requested')).toBe('demo_scheduled')
  })

  it('suggests rejected when any status + rejected', () => {
    expect(getSuggestedPilotStatus('identified', 'rejected')).toBe('rejected')
    expect(getSuggestedPilotStatus('interested', 'rejected')).toBe('rejected')
  })

  it('suggests onboarding when demo_scheduled + pilot_requested', () => {
    expect(getSuggestedPilotStatus('demo_scheduled', 'pilot_requested')).toBe('onboarding')
  })

  it('suggests active_pilot when onboarding + positive', () => {
    expect(getSuggestedPilotStatus('onboarding', 'positive')).toBe('active_pilot')
  })

  it('returns null for no_response (no status change suggested)', () => {
    expect(getSuggestedPilotStatus('identified', 'no_response')).toBeNull()
  })

  it('never suggests "draft" status', () => {
    for (const status of VALID_PILOT_STATUSES) {
      for (const response of VALID_RESPONSE_TYPES) {
        const suggested = getSuggestedPilotStatus(status, response)
        expect(suggested).not.toBe('draft')
      }
    }
  })

  it('never suggests "demo_requested" as pilot status', () => {
    for (const status of VALID_PILOT_STATUSES) {
      for (const response of VALID_RESPONSE_TYPES) {
        const suggested = getSuggestedPilotStatus(status, response)
        expect(suggested).not.toBe('demo_requested')
      }
    }
  })

  it('any non-null suggestion is a valid pilot status', () => {
    for (const status of VALID_PILOT_STATUSES) {
      for (const response of VALID_RESPONSE_TYPES) {
        const suggested = getSuggestedPilotStatus(status, response)
        if (suggested !== null) {
          expect(isValidPilotStatus(suggested)).toBe(true)
        }
      }
    }
  })
})

// ── getRecommendedNextAction ──────────────────────────────────────────────────

describe('getRecommendedNextAction', () => {
  it('returns a non-empty string for every valid status', () => {
    for (const status of VALID_PILOT_STATUSES) {
      const action = getRecommendedNextAction(status)
      expect(typeof action).toBe('string')
      expect(action.length).toBeGreaterThan(5)
    }
  })

  it('active_pilot → check-in message', () => {
    const action = getRecommendedNextAction('active_pilot')
    expect(action).toMatch(/pilot.*läuft|check-in|feedback/i)
  })

  it('rejected → no aggressive follow-up', () => {
    const action = getRecommendedNextAction('rejected')
    expect(action).toMatch(/abgelehnt|optional|6 monate|no.*contact/i)
  })

  it('identified → outreach recommendation', () => {
    const action = getRecommendedNextAction('identified')
    expect(action).toMatch(/outreach|kontakt|pilot-outreach/i)
  })

  it('contacted_manual with 7+ days → follow-up', () => {
    const action = getRecommendedNextAction('contacted_manual', 'no_response', 7)
    expect(action).toMatch(/follow-up|fällig|7|zweite/i)
  })

  it('interested + demo_requested → demo slot suggestion', () => {
    const action = getRecommendedNextAction('interested', 'demo_requested')
    expect(action).toMatch(/demo|termin/i)
  })
})

// ── buildNextBestAction ───────────────────────────────────────────────────────

describe('buildNextBestAction', () => {
  const mockEmployer: PilotEmployerRow = {
    id: 'test-001',
    company_name: 'Test GmbH',
    industry: 'Pflegeheim',
    country: 'Germany',
    status: 'identified',
  }

  it('returns a valid EmployerNextBestAction', () => {
    const nba = buildNextBestAction(mockEmployer)
    expect(nba.employerId).toBe('test-001')
    expect(nba.employerName).toBe('Test GmbH')
    expect(nba.currentStatus).toBe('identified')
    expect(nba.country).toBe('Germany')
    expect(typeof nba.recommendedAction).toBe('string')
    expect(['care', 'it', 'construction', 'hospitality', 'logistics', 'other']).toContain(nba.suggestedPitchType)
    expect(['validation', 'starter', 'success_based']).toContain(nba.suggestedOfferVariant)
    expect(['high', 'medium', 'low']).toContain(nba.urgency)
    expect(nba.opportunityNote.length).toBeGreaterThan(0)
  })

  it('care industry → care pitch type', () => {
    const nba = buildNextBestAction(mockEmployer)
    expect(nba.suggestedPitchType).toBe('care')
  })

  it('identified status → high urgency', () => {
    const nba = buildNextBestAction(mockEmployer)
    expect(nba.urgency).toBe('high')
  })

  it('rejected status → low urgency', () => {
    const nba = buildNextBestAction({ ...mockEmployer, status: 'rejected' })
    expect(nba.urgency).toBe('low')
  })

  it('invalid status falls back to identified', () => {
    const nba = buildNextBestAction({ ...mockEmployer, status: 'draft' })
    expect(isValidPilotStatus(nba.currentStatus)).toBe(true)
    expect(nba.currentStatus).toBe('identified')
  })

  it('active_pilot → medium urgency', () => {
    const nba = buildNextBestAction({ ...mockEmployer, status: 'active_pilot' })
    expect(nba.urgency).toBe('medium')
  })
})

// ── getPipelineSummary ────────────────────────────────────────────────────────

describe('getPipelineSummary', () => {
  const mockEmployers: PilotEmployerRow[] = [
    { id: '1', company_name: 'A', industry: null, country: 'DE', status: 'identified' },
    { id: '2', company_name: 'B', industry: null, country: 'DE', status: 'identified' },
    { id: '3', company_name: 'C', industry: null, country: 'DE', status: 'contacted_manual' },
    { id: '4', company_name: 'D', industry: null, country: 'DE', status: 'interested' },
    { id: '5', company_name: 'E', industry: null, country: 'DE', status: 'demo_scheduled' },
    { id: '6', company_name: 'F', industry: null, country: 'DE', status: 'active_pilot' },
    { id: '7', company_name: 'G', industry: null, country: 'DE', status: 'rejected' },
  ]

  it('total count matches', () => {
    expect(getPipelineSummary(mockEmployers).total).toBe(7)
  })

  it('hotLeads = interested + demo_scheduled + onboarding', () => {
    expect(getPipelineSummary(mockEmployers).hotLeads).toBe(2) // 1 interested + 1 demo_scheduled
  })

  it('activeCount = active_pilot', () => {
    expect(getPipelineSummary(mockEmployers).activeCount).toBe(1)
  })

  it('rejectedCount = rejected', () => {
    expect(getPipelineSummary(mockEmployers).rejectedCount).toBe(1)
  })

  it('identifiedCount correct', () => {
    expect(getPipelineSummary(mockEmployers).identifiedCount).toBe(2)
  })

  it('nextActionRequired includes identified + interested + demo_scheduled', () => {
    // 2 identified + 1 interested + 1 demo_scheduled = 4
    expect(getPipelineSummary(mockEmployers).nextActionRequired).toBe(4)
  })

  it('byStatus has all valid statuses as keys', () => {
    const summary = getPipelineSummary(mockEmployers)
    for (const status of VALID_PILOT_STATUSES) {
      expect(summary.byStatus).toHaveProperty(status)
    }
  })

  it('returns zero counts for empty array', () => {
    const s = getPipelineSummary([])
    expect(s.total).toBe(0)
    expect(s.hotLeads).toBe(0)
    expect(s.activeCount).toBe(0)
  })

  it('byStatus does not include "draft" key', () => {
    const summary = getPipelineSummary(mockEmployers)
    expect(summary.byStatus).not.toHaveProperty('draft')
  })

  it('byStatus does not include "demo_requested" key', () => {
    const summary = getPipelineSummary(mockEmployers)
    expect(summary.byStatus).not.toHaveProperty('demo_requested')
  })
})

// ── Constants ─────────────────────────────────────────────────────────────────

describe('VALID_RESPONSE_TYPES', () => {
  it('contains expected response types', () => {
    expect(VALID_RESPONSE_TYPES).toContain('no_response')
    expect(VALID_RESPONSE_TYPES).toContain('positive')
    expect(VALID_RESPONSE_TYPES).toContain('demo_requested')
    expect(VALID_RESPONSE_TYPES).toContain('pilot_requested')
    expect(VALID_RESPONSE_TYPES).toContain('rejected')
  })

  it('contains demo_requested (valid interaction response — NOT a pilot_employers.status)', () => {
    // demo_requested is valid as an INTERACTION response_type
    expect(VALID_RESPONSE_TYPES).toContain('demo_requested')
    // But it must NOT be in pilot_employers valid statuses
    expect(VALID_PILOT_STATUSES).not.toContain('demo_requested')
  })

  it('does not contain "draft" (not a valid response type)', () => {
    expect(VALID_RESPONSE_TYPES).not.toContain('draft')
  })
})

describe('VALID_INTERACTION_TYPES', () => {
  it('contains all expected interaction types', () => {
    expect(VALID_INTERACTION_TYPES).toContain('email_manual')
    expect(VALID_INTERACTION_TYPES).toContain('whatsapp_manual')
    expect(VALID_INTERACTION_TYPES).toContain('linkedin_manual')
    expect(VALID_INTERACTION_TYPES).toContain('call')
    expect(VALID_INTERACTION_TYPES).toContain('demo')
    expect(VALID_INTERACTION_TYPES).toContain('note')
  })
})

describe('OFFER_VARIANT_LABELS', () => {
  it('has labels for all 3 variants', () => {
    expect(OFFER_VARIANT_LABELS).toHaveProperty('validation')
    expect(OFFER_VARIANT_LABELS).toHaveProperty('starter')
    expect(OFFER_VARIANT_LABELS).toHaveProperty('success_based')
  })
})

describe('RESPONSE_TYPE_LABELS', () => {
  it('has labels for all response types', () => {
    for (const rt of VALID_RESPONSE_TYPES) {
      expect(RESPONSE_TYPE_LABELS).toHaveProperty(rt)
    }
  })
})

describe('INTERACTION_TYPE_LABELS', () => {
  it('has labels for all interaction types', () => {
    for (const it of VALID_INTERACTION_TYPES) {
      expect(INTERACTION_TYPE_LABELS).toHaveProperty(it)
    }
  })
})

// ── Compliance: Status Separation ─────────────────────────────────────────────

describe('Status Compliance: pilot_employers.status vs interaction response_type', () => {
  it('pilot_employers.status does NOT contain "demo_requested"', () => {
    expect(VALID_PILOT_STATUSES).not.toContain('demo_requested')
  })

  it('pilot_employers.status does NOT contain "draft"', () => {
    expect(VALID_PILOT_STATUSES).not.toContain('draft')
  })

  it('interaction response_type CAN contain "demo_requested" (different domain)', () => {
    expect(VALID_RESPONSE_TYPES).toContain('demo_requested')
  })

  it('getSuggestedPilotStatus never suggests "demo_requested" as pilot status', () => {
    for (const status of VALID_PILOT_STATUSES) {
      for (const response of VALID_RESPONSE_TYPES) {
        const suggested = getSuggestedPilotStatus(status, response)
        expect(suggested).not.toBe('demo_requested')
        expect(suggested).not.toBe('draft')
      }
    }
  })

  it('all VALID_PILOT_STATUSES have a recommended action', () => {
    for (const status of VALID_PILOT_STATUSES) {
      const action = getRecommendedNextAction(status)
      expect(action.length).toBeGreaterThan(0)
    }
  })
})

// ── No Auto-Send Guarantee ────────────────────────────────────────────────────

describe('No auto-send functions', () => {
  it('lib/employer-response-pipeline has no sendEmail function', async () => {
    const module = await import('@/lib/employer-response-pipeline')
    const exports = Object.keys(module)
    const sendFunctions = exports.filter((k) => k.toLowerCase().includes('send'))
    expect(sendFunctions).toHaveLength(0)
  })

  it('lib/employer-response-pipeline has no sendWhatsApp function', async () => {
    const module = await import('@/lib/employer-response-pipeline')
    const exports = Object.keys(module)
    const whatsappFunctions = exports.filter((k) => k.toLowerCase().includes('whatsapp'))
    expect(whatsappFunctions).toHaveLength(0)
  })

  it('getCallScript does not reference an auto-send mechanism', () => {
    const scriptText = JSON.stringify(getCallScript()).toLowerCase()
    expect(scriptText).not.toMatch(/auto.send|automatisch.*senden|trigger.*email/i)
  })

  it('getAllObjectionResponses does not reference sending messages automatically', () => {
    const text = JSON.stringify(getAllObjectionResponses()).toLowerCase()
    expect(text).not.toMatch(/auto.send|automatisch.*senden/i)
  })
})

// ── Exit Readiness Integration ────────────────────────────────────────────────

describe('Exit Readiness Checklist Integration', () => {
  it('exit-readiness checklist now has 15 items (13 + 2 new)', async () => {
    const { generateBuyerChecklist } = await import('@/lib/exit-readiness')
    const list = generateBuyerChecklist()
    expect(list.length).toBe(15)
  })

  it('pilot_offer_exists item is confirmed', async () => {
    const { generateBuyerChecklist } = await import('@/lib/exit-readiness')
    const list = generateBuyerChecklist()
    const item = list.find((i) => i.id === 'pilot_offer_exists')
    expect(item).toBeDefined()
    expect(item!.status).toBe('confirmed')
  })

  it('response_pipeline_exists item is confirmed', async () => {
    const { generateBuyerChecklist } = await import('@/lib/exit-readiness')
    const list = generateBuyerChecklist()
    const item = list.find((i) => i.id === 'response_pipeline_exists')
    expect(item).toBeDefined()
    expect(item!.status).toBe('confirmed')
  })
})

// ── Data Room Integration ─────────────────────────────────────────────────────

describe('Data Room Built Modules Integration', () => {
  it('pilot-offer module is in built modules', async () => {
    const { getBuiltModules } = await import('@/lib/data-room')
    const modules = getBuiltModules()
    const m = modules.find((m) => m.id === 'pilot-offer')
    expect(m).toBeDefined()
    expect(m!.route).toBe('/admin/pilot-offer')
    expect(m!.status).toBe('complete')
  })

  it('employer-responses module is in built modules', async () => {
    const { getBuiltModules } = await import('@/lib/data-room')
    const modules = getBuiltModules()
    const m = modules.find((m) => m.id === 'employer-responses')
    expect(m).toBeDefined()
    expect(m!.route).toBe('/admin/employer-responses')
    expect(m!.status).toBe('complete')
  })

  it('total built modules is now 13', async () => {
    const { getBuiltModules } = await import('@/lib/data-room')
    expect(getBuiltModules().length).toBe(13)
  })
})
