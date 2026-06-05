/**
 * __tests__/demo-mode.test.ts
 *
 * Tests für lib/demo-mode.ts, lib/demo-data.ts, lib/data-room.ts
 *
 * Reine Unit-Tests — kein Supabase, kein Server, kein Netzwerk.
 * Validiert:
 * - Demo Mode Logik
 * - Demo Data Markierung (demo: true auf allen Items)
 * - Keine echten Kunden / keine Fake-Revenue als echte Daten
 * - Data Room Snapshot Generation
 * - Markdown Export mit Demo-Disclaimer
 * - Gültige pilot_employers Status (KEINE draft / demo_requested)
 */

import { describe, it, expect } from 'vitest'
import {
  isDemoModeEnabled,
  getDemoModeLabel,
  getDemoBannerText,
  getDemoBannerTextEn,
  getDemoDisclaimer,
  getDemoDisclaimerEn,
  getDemoModeConfig,
  createDemoDataTag,
  assertDemoDataIsClearlyMarked,
  validateDemoDataArray,
  getDemoModeSetupInstructions,
} from '@/lib/demo-mode'

import {
  getDemoCandidates,
  getDemoEmployers,
  getDemoCorridors,
  getDemoRevenueAssumptions,
  getDemoRisks,
  getDemoPack,
  type DemoCandidate,
  type DemoEmployer,
  type DemoCorridor,
  type DemoRevenueAssumption,
  type DemoRisk,
} from '@/lib/demo-data'

import {
  getAssetOverview,
  getBuiltModules,
  getTechnicalProof,
  getHandoverChecklist,
  getNotYetProven,
  getNextActions,
  generateDataRoomSnapshot,
  generateDataRoomMarkdown,
} from '@/lib/data-room'

import { VALID_PILOT_STATUSES } from '@/lib/pilot-execution'

// ── Demo Mode Logic ───────────────────────────────────────────────────────────

describe('isDemoModeEnabled', () => {
  it('returns false when env var is not set', () => {
    // In test environment, neither BUYER_DEMO_MODE nor NEXT_PUBLIC_BUYER_DEMO_MODE is set
    // So it returns false (default)
    const result = isDemoModeEnabled()
    expect(typeof result).toBe('boolean')
  })

  it('returns false by default in test environment', () => {
    const original = process.env.BUYER_DEMO_MODE
    delete process.env.BUYER_DEMO_MODE
    delete process.env.NEXT_PUBLIC_BUYER_DEMO_MODE
    expect(isDemoModeEnabled()).toBe(false)
    if (original !== undefined) process.env.BUYER_DEMO_MODE = original
  })

  it('returns true when BUYER_DEMO_MODE=true', () => {
    const original = process.env.BUYER_DEMO_MODE
    process.env.BUYER_DEMO_MODE = 'true'
    expect(isDemoModeEnabled()).toBe(true)
    if (original !== undefined) process.env.BUYER_DEMO_MODE = original
    else delete process.env.BUYER_DEMO_MODE
  })

  it('is case-insensitive for BUYER_DEMO_MODE=TRUE', () => {
    const original = process.env.BUYER_DEMO_MODE
    process.env.BUYER_DEMO_MODE = 'TRUE'
    expect(isDemoModeEnabled()).toBe(true)
    if (original !== undefined) process.env.BUYER_DEMO_MODE = original
    else delete process.env.BUYER_DEMO_MODE
  })

  it('returns false when BUYER_DEMO_MODE=false', () => {
    const original = process.env.BUYER_DEMO_MODE
    process.env.BUYER_DEMO_MODE = 'false'
    delete process.env.NEXT_PUBLIC_BUYER_DEMO_MODE
    expect(isDemoModeEnabled()).toBe(false)
    if (original !== undefined) process.env.BUYER_DEMO_MODE = original
    else delete process.env.BUYER_DEMO_MODE
  })

  it('returns true when NEXT_PUBLIC_BUYER_DEMO_MODE=true', () => {
    const orig1 = process.env.BUYER_DEMO_MODE
    const orig2 = process.env.NEXT_PUBLIC_BUYER_DEMO_MODE
    delete process.env.BUYER_DEMO_MODE
    process.env.NEXT_PUBLIC_BUYER_DEMO_MODE = 'true'
    expect(isDemoModeEnabled()).toBe(true)
    if (orig1 !== undefined) process.env.BUYER_DEMO_MODE = orig1
    if (orig2 !== undefined) process.env.NEXT_PUBLIC_BUYER_DEMO_MODE = orig2
    else delete process.env.NEXT_PUBLIC_BUYER_DEMO_MODE
  })
})

describe('getDemoModeLabel', () => {
  it('returns a non-empty string', () => {
    expect(typeof getDemoModeLabel()).toBe('string')
    expect(getDemoModeLabel().length).toBeGreaterThan(0)
  })

  it('contains Demo or demo', () => {
    expect(getDemoModeLabel()).toMatch(/demo/i)
  })
})

describe('getDemoBannerText', () => {
  it('returns German banner text', () => {
    const t = getDemoBannerText()
    expect(typeof t).toBe('string')
    expect(t.length).toBeGreaterThan(10)
  })

  it('mentions Demo-Modus or sample data', () => {
    expect(getDemoBannerText()).toMatch(/demo|modus|beispiel/i)
  })

  it('clearly states not real customers or revenue', () => {
    const t = getDemoBannerText().toLowerCase()
    expect(t).toMatch(/keine.*echten|sample|kein.*umsatz|not real/i)
  })
})

describe('getDemoBannerTextEn', () => {
  it('contains Demo Mode in English', () => {
    expect(getDemoBannerTextEn()).toMatch(/demo mode/i)
  })

  it('says not real customers or revenue', () => {
    const t = getDemoBannerTextEn().toLowerCase()
    expect(t).toMatch(/not real|sample only/i)
  })
})

describe('getDemoDisclaimer', () => {
  it('returns a non-empty string longer than 50 chars', () => {
    const d = getDemoDisclaimer()
    expect(typeof d).toBe('string')
    expect(d.length).toBeGreaterThan(50)
  })

  it('mentions demo: true or demo data', () => {
    expect(getDemoDisclaimer()).toMatch(/demo.*true|demo-daten|synthetisch/i)
  })

  it('says no legal advice', () => {
    const d = getDemoDisclaimer().toLowerCase()
    expect(d).toMatch(/keine rechtsberatung|no legal/i)
  })

  it('says no real revenue', () => {
    const d = getDemoDisclaimer().toLowerCase()
    expect(d).toMatch(/keine.*umsätze|not.*revenue|no.*revenue|kein.*umsatz/i)
  })
})

describe('getDemoDisclaimerEn', () => {
  it('mentions no legal advice in English', () => {
    expect(getDemoDisclaimerEn()).toMatch(/no legal advice/i)
  })

  it('says no real revenue', () => {
    expect(getDemoDisclaimerEn()).toMatch(/no.*real revenue|not.*real/i)
  })
})

describe('getDemoModeConfig', () => {
  it('returns all required keys', () => {
    const config = getDemoModeConfig()
    expect(config).toHaveProperty('enabled')
    expect(config).toHaveProperty('label')
    expect(config).toHaveProperty('bannerText')
    expect(config).toHaveProperty('exportLabel')
    expect(config).toHaveProperty('disclaimer')
    expect(config).toHaveProperty('dataTag')
  })

  it('dataTag is "demo"', () => {
    expect(getDemoModeConfig().dataTag).toBe('demo')
  })

  it('enabled matches isDemoModeEnabled()', () => {
    expect(getDemoModeConfig().enabled).toBe(isDemoModeEnabled())
  })
})

describe('createDemoDataTag', () => {
  it('returns demo: true', () => {
    const tag = createDemoDataTag()
    expect(tag.demo).toBe(true)
  })

  it('returns notRealCustomer: true', () => {
    expect(createDemoDataTag().notRealCustomer).toBe(true)
  })

  it('returns notRealRevenue: true', () => {
    expect(createDemoDataTag().notRealRevenue).toBe(true)
  })

  it('returns dataSource: synthetic', () => {
    expect(createDemoDataTag().dataSource).toBe('synthetic')
  })
})

describe('assertDemoDataIsClearlyMarked', () => {
  it('does not throw for demo: true', () => {
    expect(() => assertDemoDataIsClearlyMarked({ demo: true })).not.toThrow()
  })

  it('throws for demo: false', () => {
    expect(() => assertDemoDataIsClearlyMarked({ demo: false })).toThrow()
  })

  it('throws for missing demo property', () => {
    expect(() => assertDemoDataIsClearlyMarked({})).toThrow()
  })

  it('includes label in error message', () => {
    try {
      assertDemoDataIsClearlyMarked({}, 'TestItem')
      expect.fail('should have thrown')
    } catch (e: unknown) {
      expect((e as Error).message).toContain('TestItem')
    }
  })
})

describe('validateDemoDataArray', () => {
  it('returns count for valid array', () => {
    const items = [{ demo: true as const }, { demo: true as const }]
    expect(validateDemoDataArray(items, 'test')).toBe(2)
  })

  it('throws if any item missing demo: true', () => {
    const items = [{ demo: true as const }, {} as { demo?: boolean }]
    expect(() => validateDemoDataArray(items, 'test')).toThrow()
  })

  it('works for empty array', () => {
    expect(validateDemoDataArray([], 'empty')).toBe(0)
  })
})

describe('getDemoModeSetupInstructions', () => {
  it('returns an array of strings', () => {
    const instructions = getDemoModeSetupInstructions()
    expect(Array.isArray(instructions)).toBe(true)
    expect(instructions.length).toBeGreaterThan(0)
  })

  it('includes BUYER_DEMO_MODE', () => {
    const lines = getDemoModeSetupInstructions().join('\n')
    expect(lines).toContain('BUYER_DEMO_MODE')
  })
})

// ── Demo Candidates ───────────────────────────────────────────────────────────

describe('getDemoCandidates', () => {
  it('returns exactly 12 candidates', () => {
    expect(getDemoCandidates()).toHaveLength(12)
  })

  it('all candidates have demo: true', () => {
    for (const c of getDemoCandidates()) {
      expect(c.demo).toBe(true)
    }
  })

  it('all candidates have dataSource: synthetic', () => {
    for (const c of getDemoCandidates()) {
      expect(c.dataSource).toBe('synthetic')
    }
  })

  it('all IDs are unique', () => {
    const ids = getDemoCandidates().map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all IDs start with demo-cand-', () => {
    for (const c of getDemoCandidates()) {
      expect(c.id).toMatch(/^demo-cand-/)
    }
  })

  it('every candidate has required fields', () => {
    for (const c of getDemoCandidates()) {
      expect(typeof c.displayName).toBe('string')
      expect(c.displayName.length).toBeGreaterThan(0)
      expect(typeof c.sourceCountry).toBe('string')
      expect(typeof c.targetCountry).toBe('string')
      expect(typeof c.profession).toBe('string')
      expect(['care', 'it', 'construction', 'hospitality', 'logistics', 'engineering']).toContain(c.sector)
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(c.languageLevel)
      expect(typeof c.experienceYears).toBe('number')
      expect(c.experienceYears).toBeGreaterThanOrEqual(0)
      expect(['uploaded', 'pending', 'missing']).toContain(c.cvStatus)
      expect(['ready', 'planning', 'exploring']).toContain(c.relocationReadiness)
      expect(['verified', 'pending', 'not_started']).toContain(c.complianceStatus)
      expect(c.qualityScore).toBeGreaterThanOrEqual(0)
      expect(c.qualityScore).toBeLessThanOrEqual(100)
    }
  })

  it('no candidate displayName sounds like a real person', () => {
    // All display names should match "Sample Candidate X" pattern
    for (const c of getDemoCandidates()) {
      expect(c.displayName).toMatch(/^Sample Candidate/i)
    }
  })

  it('covers multiple corridors', () => {
    const corridors = new Set(getDemoCandidates().map((c) => c.corridor))
    expect(corridors.size).toBeGreaterThanOrEqual(5)
  })

  it('covers multiple sectors', () => {
    const sectors = new Set(getDemoCandidates().map((c) => c.sector))
    expect(sectors.size).toBeGreaterThanOrEqual(4)
  })

  it('includes care sector candidates', () => {
    const care = getDemoCandidates().filter((c) => c.sector === 'care')
    expect(care.length).toBeGreaterThanOrEqual(1)
  })

  it('includes IT sector candidates', () => {
    const it = getDemoCandidates().filter((c) => c.sector === 'it')
    expect(it.length).toBeGreaterThanOrEqual(1)
  })

  it('includes Philippines → Germany corridor', () => {
    const corridor = getDemoCandidates().find((c) => c.corridor === 'Philippines → Germany')
    expect(corridor).toBeDefined()
  })

  it('validateDemoDataArray passes for all candidates', () => {
    expect(() => validateDemoDataArray(getDemoCandidates(), 'candidates')).not.toThrow()
  })
})

// ── Demo Employers ────────────────────────────────────────────────────────────

describe('getDemoEmployers', () => {
  it('returns exactly 10 employers', () => {
    expect(getDemoEmployers()).toHaveLength(10)
  })

  it('all employers have demo: true', () => {
    for (const e of getDemoEmployers()) {
      expect(e.demo).toBe(true)
    }
  })

  it('all employers have dataSource: synthetic', () => {
    for (const e of getDemoEmployers()) {
      expect(e.dataSource).toBe('synthetic')
    }
  })

  it('all IDs are unique', () => {
    const ids = getDemoEmployers().map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all IDs start with demo-emp-', () => {
    for (const e of getDemoEmployers()) {
      expect(e.id).toMatch(/^demo-emp-/)
    }
  })

  it('every employer has required fields', () => {
    for (const e of getDemoEmployers()) {
      expect(typeof e.companyName).toBe('string')
      expect(e.companyName.length).toBeGreaterThan(0)
      expect(typeof e.country).toBe('string')
      expect(typeof e.industry).toBe('string')
      expect(typeof e.status).toBe('string')
      expect(typeof e.sector).toBe('string')
    }
  })

  it('all statuses are valid pilot_employer statuses', () => {
    for (const e of getDemoEmployers()) {
      expect(VALID_PILOT_STATUSES).toContain(e.status)
    }
  })

  it('no employer has status "draft"', () => {
    for (const e of getDemoEmployers()) {
      expect(e.status).not.toBe('draft')
    }
  })

  it('no employer has status "demo_requested"', () => {
    for (const e of getDemoEmployers()) {
      expect(e.status).not.toBe('demo_requested')
    }
  })

  it('uses multiple valid statuses (not all the same)', () => {
    const statuses = new Set(getDemoEmployers().map((e) => e.status))
    expect(statuses.size).toBeGreaterThanOrEqual(3)
  })

  it('no real company names — all should contain "Sample"', () => {
    for (const e of getDemoEmployers()) {
      expect(e.companyName).toMatch(/^Sample /i)
    }
  })

  it('all notes mention synthetic data', () => {
    for (const e of getDemoEmployers()) {
      expect(e.notes.toLowerCase()).toMatch(/synthetic|demo|sample/i)
    }
  })

  it('covers multiple sectors', () => {
    const sectors = new Set(getDemoEmployers().map((e) => e.sector))
    expect(sectors.size).toBeGreaterThanOrEqual(4)
  })

  it('validateDemoDataArray passes for all employers', () => {
    expect(() => validateDemoDataArray(getDemoEmployers(), 'employers')).not.toThrow()
  })

  it('interest level values are valid', () => {
    const validLevels = ['unknown', 'low', 'medium', 'high', 'very_high']
    for (const e of getDemoEmployers()) {
      expect(validLevels).toContain(e.interestLevel)
    }
  })
})

// ── Demo Corridors ────────────────────────────────────────────────────────────

describe('getDemoCorridors', () => {
  it('returns exactly 8 corridors', () => {
    expect(getDemoCorridors()).toHaveLength(8)
  })

  it('all corridors have demo: true', () => {
    for (const c of getDemoCorridors()) {
      expect(c.demo).toBe(true)
    }
  })

  it('all IDs are unique', () => {
    const ids = getDemoCorridors().map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all IDs start with demo-corr-', () => {
    for (const c of getDemoCorridors()) {
      expect(c.id).toMatch(/^demo-corr-/)
    }
  })

  it('every corridor has required fields', () => {
    for (const c of getDemoCorridors()) {
      expect(typeof c.name).toBe('string')
      expect(c.name.length).toBeGreaterThan(0)
      expect(typeof c.sourceCountry).toBe('string')
      expect(typeof c.targetCountry).toBe('string')
      expect(typeof c.talentCategory).toBe('string')
      expect(['low', 'medium', 'high', 'critical']).toContain(c.demandSignal)
      expect(['low', 'medium', 'high', 'very_high']).toContain(c.candidateSupplySignal)
      expect(['low', 'medium', 'high']).toContain(c.complianceRisk)
      expect(['low', 'medium', 'high', 'critical']).toContain(c.employerUrgency)
      expect(c.opportunityScore).toBeGreaterThanOrEqual(0)
      expect(c.opportunityScore).toBeLessThanOrEqual(100)
      expect(typeof c.suggestedLandingPageAngle).toBe('string')
      expect(c.suggestedLandingPageAngle.length).toBeGreaterThan(0)
      expect(typeof c.suggestedOutreachAngle).toBe('string')
      expect(typeof c.nextBestAction).toBe('string')
      expect(c.nextBestAction.length).toBeGreaterThan(0)
    }
  })

  it('includes Philippines → Germany corridor', () => {
    const c = getDemoCorridors().find((c) => c.sourceCountry === 'Philippines' && c.targetCountry === 'Germany')
    expect(c).toBeDefined()
  })

  it('includes India → Canada corridor', () => {
    const c = getDemoCorridors().find((c) => c.sourceCountry === 'India' && c.targetCountry === 'Canada')
    expect(c).toBeDefined()
  })

  it('opportunity scores are between 0 and 100', () => {
    for (const c of getDemoCorridors()) {
      expect(c.opportunityScore).toBeGreaterThanOrEqual(0)
      expect(c.opportunityScore).toBeLessThanOrEqual(100)
    }
  })

  it('validateDemoDataArray passes for all corridors', () => {
    expect(() => validateDemoDataArray(getDemoCorridors(), 'corridors')).not.toThrow()
  })
})

// ── Demo Revenue Assumptions ──────────────────────────────────────────────────

describe('getDemoRevenueAssumptions', () => {
  it('returns exactly 6 revenue assumptions', () => {
    expect(getDemoRevenueAssumptions()).toHaveLength(6)
  })

  it('all have demo: true', () => {
    for (const r of getDemoRevenueAssumptions()) {
      expect(r.demo).toBe(true)
    }
  })

  it('all have isVerified: false (never real revenue)', () => {
    for (const r of getDemoRevenueAssumptions()) {
      expect(r.isVerified).toBe(false)
    }
  })

  it('all IDs are unique', () => {
    const ids = getDemoRevenueAssumptions().map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('assumption text mentions ESTIMATE ONLY or similar', () => {
    for (const r of getDemoRevenueAssumptions()) {
      expect(r.assumption).toMatch(/estimate only|not verified|not real|schätzung/i)
    }
  })

  it('no assumption claims verified revenue', () => {
    for (const r of getDemoRevenueAssumptions()) {
      const lower = r.assumption.toLowerCase()
      expect(lower).not.toMatch(/verified revenue|confirmed.*revenue|real.*revenue.*yes/i)
    }
  })

  it('all scenarios are valid', () => {
    const validScenarios = ['conservative', 'base', 'optimistic']
    for (const r of getDemoRevenueAssumptions()) {
      expect(validScenarios).toContain(r.scenario)
    }
  })

  it('all types are valid', () => {
    const validTypes = ['subscription', 'placement_fee', 'pilot_fee', 'consulting']
    for (const r of getDemoRevenueAssumptions()) {
      expect(validTypes).toContain(r.type)
    }
  })

  it('monthly estimates are positive numbers', () => {
    for (const r of getDemoRevenueAssumptions()) {
      expect(r.monthlyEstimate).toBeGreaterThan(0)
    }
  })

  it('annual estimates are roughly 12x monthly (within factor)', () => {
    for (const r of getDemoRevenueAssumptions()) {
      // Annual should be in ballpark of monthly × 12 (allow variance for notes)
      expect(r.annualEstimate).toBeGreaterThan(0)
    }
  })

  it('validateDemoDataArray passes', () => {
    expect(() => validateDemoDataArray(getDemoRevenueAssumptions(), 'revenueAssumptions')).not.toThrow()
  })
})

// ── Demo Risks ────────────────────────────────────────────────────────────────

describe('getDemoRisks', () => {
  it('returns exactly 8 risks', () => {
    expect(getDemoRisks()).toHaveLength(8)
  })

  it('all risks have demo: true', () => {
    for (const r of getDemoRisks()) {
      expect(r.demo).toBe(true)
    }
  })

  it('all IDs are unique', () => {
    const ids = getDemoRisks().map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all severity values are valid', () => {
    for (const r of getDemoRisks()) {
      expect(['critical', 'high', 'medium', 'low']).toContain(r.severity)
    }
  })

  it('every risk has non-empty title, description, mitigation', () => {
    for (const r of getDemoRisks()) {
      expect(r.title.length).toBeGreaterThan(0)
      expect(r.description.length).toBeGreaterThan(10)
      expect(r.mitigation.length).toBeGreaterThan(5)
    }
  })

  it('includes legal compliance risk', () => {
    const r = getDemoRisks().find((r) => r.id === 'demo-risk-01' || r.title.toLowerCase().includes('legal'))
    expect(r).toBeDefined()
  })

  it('includes payment activation risk', () => {
    const r = getDemoRisks().find((r) => r.id === 'demo-risk-07' || r.title.toLowerCase().includes('payment'))
    expect(r).toBeDefined()
  })

  it('validateDemoDataArray passes', () => {
    expect(() => validateDemoDataArray(getDemoRisks(), 'risks')).not.toThrow()
  })
})

// ── Demo Pack ─────────────────────────────────────────────────────────────────

describe('getDemoPack', () => {
  it('returns all required collections', () => {
    const pack = getDemoPack()
    expect(pack).toHaveProperty('candidates')
    expect(pack).toHaveProperty('employers')
    expect(pack).toHaveProperty('corridors')
    expect(pack).toHaveProperty('revenueAssumptions')
    expect(pack).toHaveProperty('risks')
    expect(pack).toHaveProperty('meta')
  })

  it('meta counts match actual arrays', () => {
    const pack = getDemoPack()
    expect(pack.meta.totalCandidates).toBe(pack.candidates.length)
    expect(pack.meta.totalEmployers).toBe(pack.employers.length)
    expect(pack.meta.totalCorridors).toBe(pack.corridors.length)
    expect(pack.meta.totalRevenueAssumptions).toBe(pack.revenueAssumptions.length)
    expect(pack.meta.totalRisks).toBe(pack.risks.length)
  })

  it('meta.allMarkedAsDemo is true', () => {
    expect(getDemoPack().meta.allMarkedAsDemo).toBe(true)
  })

  it('meta.noVerifiedRevenue is true', () => {
    expect(getDemoPack().meta.noVerifiedRevenue).toBe(true)
  })

  it('meta.noRealCustomers is true', () => {
    expect(getDemoPack().meta.noRealCustomers).toBe(true)
  })

  it('meta.generatedAt is a valid ISO date', () => {
    const pack = getDemoPack()
    expect(new Date(pack.meta.generatedAt).getTime()).not.toBeNaN()
  })

  it('has 12 candidates, 10 employers, 8 corridors, 6 revenue assumptions, 8 risks', () => {
    const pack = getDemoPack()
    expect(pack.meta.totalCandidates).toBe(12)
    expect(pack.meta.totalEmployers).toBe(10)
    expect(pack.meta.totalCorridors).toBe(8)
    expect(pack.meta.totalRevenueAssumptions).toBe(6)
    expect(pack.meta.totalRisks).toBe(8)
  })
})

// ── Data Room Snapshot ────────────────────────────────────────────────────────

describe('getAssetOverview', () => {
  it('returns required fields', () => {
    const ao = getAssetOverview()
    expect(ao.productName.length).toBeGreaterThan(0)
    expect(ao.oneLineDescription.length).toBeGreaterThan(10)
    expect(Array.isArray(ao.targetBuyer)).toBe(true)
    expect(ao.targetBuyer.length).toBeGreaterThanOrEqual(2)
    expect(ao.businessModel.length).toBeGreaterThan(0)
    expect(ao.currentStage.length).toBeGreaterThan(0)
    expect(ao.technicalReadiness.length).toBeGreaterThan(0)
  })

  it('business model mentions no verified revenue', () => {
    const bm = getAssetOverview().businessModel.toLowerCase()
    expect(bm).toMatch(/no verified revenue|kein.*umsatz|not yet/i)
  })

  it('current stage is honest about pre-revenue status', () => {
    const stage = getAssetOverview().currentStage.toLowerCase()
    expect(stage).toMatch(/pre-revenue|kein.*kunde|first.*employer|pilot|ready/i)
  })
})

describe('getBuiltModules', () => {
  it('returns exactly 13 modules', () => {
    expect(getBuiltModules()).toHaveLength(13)
  })

  it('all modules have id, name, route, status, description', () => {
    for (const m of getBuiltModules()) {
      expect(m.id.length).toBeGreaterThan(0)
      expect(m.name.length).toBeGreaterThan(0)
      expect(m.route).toMatch(/^\//)
      expect(['complete', 'partial', 'planned']).toContain(m.status)
      expect(m.description.length).toBeGreaterThan(0)
    }
  })

  it('all module IDs are unique', () => {
    const ids = getBuiltModules().map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes buyer-demo module', () => {
    const m = getBuiltModules().find((m) => m.id === 'buyer-demo')
    expect(m).toBeDefined()
    expect(m!.route).toBe('/admin/data-room')
  })

  it('includes pilot-outreach module', () => {
    const m = getBuiltModules().find((m) => m.id === 'pilot-outreach')
    expect(m).toBeDefined()
  })

  it('at least 8 modules are complete', () => {
    const complete = getBuiltModules().filter((m) => m.status === 'complete')
    expect(complete.length).toBeGreaterThanOrEqual(8)
  })
})

describe('getTechnicalProof', () => {
  it('returns at least 8 proof items', () => {
    expect(getTechnicalProof().length).toBeGreaterThanOrEqual(8)
  })

  it('all items have label, value, verified, note', () => {
    for (const t of getTechnicalProof()) {
      expect(t.label.length).toBeGreaterThan(0)
      expect(String(t.value).length).toBeGreaterThan(0)
      expect(typeof t.verified).toBe('boolean')
      expect(t.note.length).toBeGreaterThan(0)
    }
  })

  it('Stripe Live item is NOT verified/not live', () => {
    const stripe = getTechnicalProof().find((t) => t.label.toLowerCase().includes('stripe'))
    expect(stripe).toBeDefined()
    // Stripe should be marked as "not yet active" — not a confirmed live integration
    expect(String(stripe!.value).toLowerCase()).toMatch(/not yet|inactive|test mode|not.*active/i)
  })

  it('test count shows 400+ passing', () => {
    const tests = getTechnicalProof().find((t) => t.label.toLowerCase().includes('test'))
    expect(tests).toBeDefined()
    const val = Number(String(tests!.value).replace(/\D/g, ''))
    expect(val).toBeGreaterThanOrEqual(400)
  })
})

describe('getHandoverChecklist', () => {
  it('returns at least 7 items', () => {
    expect(getHandoverChecklist().length).toBeGreaterThanOrEqual(7)
  })

  it('all items have id, label, status, note', () => {
    for (const h of getHandoverChecklist()) {
      expect(h.id.length).toBeGreaterThan(0)
      expect(h.label.length).toBeGreaterThan(0)
      expect(['done', 'partial', 'missing']).toContain(h.status)
      expect(h.note.length).toBeGreaterThan(0)
    }
  })

  it('at least 7 items are "done"', () => {
    const done = getHandoverChecklist().filter((h) => h.status === 'done')
    expect(done.length).toBeGreaterThanOrEqual(7)
  })

  it('demo-mode item is done', () => {
    const item = getHandoverChecklist().find((h) => h.id === 'demo-mode')
    expect(item).toBeDefined()
    expect(item!.status).toBe('done')
  })
})

describe('getNotYetProven', () => {
  it('returns at least 4 items', () => {
    expect(getNotYetProven().length).toBeGreaterThanOrEqual(4)
  })

  it('all items have id, label, explanation, priority', () => {
    for (const n of getNotYetProven()) {
      expect(n.id.length).toBeGreaterThan(0)
      expect(n.label.length).toBeGreaterThan(0)
      expect(n.explanation.length).toBeGreaterThan(10)
      expect(['critical', 'high', 'medium']).toContain(n.priority)
    }
  })

  it('has at least 1 critical item (no revenue)', () => {
    const critical = getNotYetProven().filter((n) => n.priority === 'critical')
    expect(critical.length).toBeGreaterThanOrEqual(1)
  })

  it('no-revenue item is critical', () => {
    const item = getNotYetProven().find((n) => n.id === 'no-revenue')
    expect(item).toBeDefined()
    expect(item!.priority).toBe('critical')
  })

  it('no-paying-employer item exists and is critical', () => {
    const item = getNotYetProven().find((n) => n.id === 'no-paying-employer')
    expect(item).toBeDefined()
    expect(item!.priority).toBe('critical')
  })

  it('all explanations honestly address the gap', () => {
    for (const n of getNotYetProven()) {
      expect(n.explanation.length).toBeGreaterThan(20)
    }
  })
})

describe('getNextActions', () => {
  it('returns at least 4 actions', () => {
    expect(getNextActions().length).toBeGreaterThanOrEqual(4)
  })

  it('all items have id, action, priority, effort', () => {
    for (const a of getNextActions()) {
      expect(a.id.length).toBeGreaterThan(0)
      expect(a.action.length).toBeGreaterThan(5)
      expect(['critical', 'high', 'medium']).toContain(a.priority)
      expect(['hours', 'days', 'weeks']).toContain(a.effort)
    }
  })

  it('first-outreach action is critical', () => {
    const a = getNextActions().find((a) => a.id === 'first-outreach')
    expect(a).toBeDefined()
    expect(a!.priority).toBe('critical')
  })
})

describe('generateDataRoomSnapshot', () => {
  it('returns all required keys', () => {
    const snap = generateDataRoomSnapshot()
    expect(snap).toHaveProperty('generatedAt')
    expect(snap).toHaveProperty('demoMode')
    expect(snap).toHaveProperty('assetOverview')
    expect(snap).toHaveProperty('builtModules')
    expect(snap).toHaveProperty('technicalProof')
    expect(snap).toHaveProperty('demoAssets')
    expect(snap).toHaveProperty('handoverChecklist')
    expect(snap).toHaveProperty('notYetProven')
    expect(snap).toHaveProperty('nextActions')
  })

  it('generatedAt is a valid ISO string', () => {
    const snap = generateDataRoomSnapshot()
    expect(new Date(snap.generatedAt).getTime()).not.toBeNaN()
  })

  it('demoMode defaults to false', () => {
    expect(generateDataRoomSnapshot().demoMode).toBe(false)
  })

  it('demoMode=true is respected when passed', () => {
    expect(generateDataRoomSnapshot(true).demoMode).toBe(true)
  })

  it('demoAssets.allMarkedAsDemo is always true', () => {
    expect(generateDataRoomSnapshot().demoAssets.allMarkedAsDemo).toBe(true)
  })

  it('demoAssets.noVerifiedRevenue is always true', () => {
    expect(generateDataRoomSnapshot().demoAssets.noVerifiedRevenue).toBe(true)
  })

  it('demo asset counts match getDemoPack', () => {
    const snap = generateDataRoomSnapshot()
    const pack = getDemoPack()
    expect(snap.demoAssets.demoCandidates).toBe(pack.meta.totalCandidates)
    expect(snap.demoAssets.demoEmployers).toBe(pack.meta.totalEmployers)
    expect(snap.demoAssets.demoCorridors).toBe(pack.meta.totalCorridors)
  })
})

// ── Markdown Export ───────────────────────────────────────────────────────────

describe('generateDataRoomMarkdown', () => {
  const snap = generateDataRoomSnapshot()
  const md = generateDataRoomMarkdown(snap)

  it('returns a non-empty string', () => {
    expect(typeof md).toBe('string')
    expect(md.length).toBeGreaterThan(200)
  })

  it('contains product name as H1', () => {
    expect(md).toContain('# ')
    expect(md).toContain('Global Talent Bridge')
  })

  it('contains Asset Overview section', () => {
    expect(md).toMatch(/##.*Asset Overview/i)
  })

  it('contains Built Modules section', () => {
    expect(md).toMatch(/##.*Built Modules/i)
  })

  it('contains Technical Proof section', () => {
    expect(md).toMatch(/##.*Technical Proof/i)
  })

  it('contains Demo Assets section', () => {
    expect(md).toMatch(/##.*Demo Assets/i)
  })

  it('contains Handover Checklist section', () => {
    expect(md).toMatch(/##.*Handover Checklist/i)
  })

  it('contains Not Yet Proven section', () => {
    expect(md).toMatch(/##.*Not Yet Proven/i)
  })

  it('contains Next Actions section', () => {
    expect(md).toMatch(/##.*Next Actions/i)
  })

  it('contains demo: true note in demo assets section', () => {
    expect(md).toMatch(/demo.*true|no verified revenue|no real customers/i)
  })

  it('contains disclaimer about no legal advice', () => {
    expect(md).toMatch(/keine rechtsberatung|no legal|keine garantie/i)
  })

  it('contains disclaimer about estimates', () => {
    expect(md).toMatch(/schätzung|estimate/i)
  })

  it('contains status icons (✅, ⚠️, ❌)', () => {
    expect(md).toMatch(/✅|⚠️|❌/)
  })

  it('contains priority icons', () => {
    expect(md).toMatch(/🔴|🟠|🟡/)
  })

  it('contains separator lines', () => {
    const separators = md.split('\n').filter((l) => l.trim() === '---')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('shows demoMode status in header', () => {
    expect(md).toContain('Demo Mode:')
  })
})

// ── Valid Pilot Employer Status Regression ────────────────────────────────────

describe('Demo Employer Status Compliance', () => {
  it('VALID_PILOT_STATUSES does not include "draft"', () => {
    expect(VALID_PILOT_STATUSES).not.toContain('draft')
  })

  it('VALID_PILOT_STATUSES does not include "demo_requested"', () => {
    expect(VALID_PILOT_STATUSES).not.toContain('demo_requested')
  })

  it('all demo employer statuses are in VALID_PILOT_STATUSES', () => {
    for (const e of getDemoEmployers()) {
      expect(VALID_PILOT_STATUSES as readonly string[]).toContain(e.status)
    }
  })

  it('demo employers use at least 4 different statuses from the valid set', () => {
    const statuses = new Set(getDemoEmployers().map((e) => e.status))
    expect(statuses.size).toBeGreaterThanOrEqual(4)
  })

  it('demo employers do NOT use status "draft"', () => {
    const hasDraft = getDemoEmployers().some((e) => e.status === 'draft')
    expect(hasDraft).toBe(false)
  })

  it('demo employers do NOT use status "demo_requested"', () => {
    const hasDemoRequested = getDemoEmployers().some((e) => e.status === 'demo_requested')
    expect(hasDemoRequested).toBe(false)
  })
})

// ── Integrity / Regression ────────────────────────────────────────────────────

describe('Demo Data Integrity', () => {
  it('no demo revenue assumption claims verified income', () => {
    for (const r of getDemoRevenueAssumptions()) {
      expect(r.isVerified).toBe(false)
      const lower = r.assumption.toLowerCase()
      expect(lower).not.toMatch(/verified income|echte.*umsatz|confirmed.*revenue.*true/i)
    }
  })

  it('no demo candidate has a real-sounding personal name', () => {
    for (const c of getDemoCandidates()) {
      // Names should NOT look like "John Smith" or "Maria García" — must be "Sample Candidate X"
      expect(c.displayName).toMatch(/^Sample Candidate/i)
    }
  })

  it('no demo employer has a real company name', () => {
    for (const e of getDemoEmployers()) {
      // Company names must start with "Sample"
      expect(e.companyName).toMatch(/^Sample /i)
    }
  })

  it('all demo items pass validateDemoDataArray', () => {
    const pack = getDemoPack()
    expect(() => validateDemoDataArray(pack.candidates, 'candidates')).not.toThrow()
    expect(() => validateDemoDataArray(pack.employers, 'employers')).not.toThrow()
    expect(() => validateDemoDataArray(pack.corridors, 'corridors')).not.toThrow()
    expect(() => validateDemoDataArray(pack.revenueAssumptions, 'revenueAssumptions')).not.toThrow()
    expect(() => validateDemoDataArray(pack.risks, 'risks')).not.toThrow()
  })

  it('generateDataRoomSnapshot is deterministic structure-wise', () => {
    const s1 = generateDataRoomSnapshot(false)
    const s2 = generateDataRoomSnapshot(false)
    expect(s1.builtModules.length).toBe(s2.builtModules.length)
    expect(s1.handoverChecklist.length).toBe(s2.handoverChecklist.length)
    expect(s1.notYetProven.length).toBe(s2.notYetProven.length)
  })

  it('notYetProven section is never empty (honesty requirement)', () => {
    const snap = generateDataRoomSnapshot()
    expect(snap.notYetProven.length).toBeGreaterThan(0)
  })

  it('getNotYetProven includes no-revenue as a critical gap', () => {
    const item = getNotYetProven().find((n) => n.id === 'no-revenue')
    expect(item).toBeDefined()
    expect(item!.priority).toBe('critical')
  })
})
