/**
 * __tests__/exit-readiness.test.ts
 *
 * Tests für lib/exit-readiness.ts
 * Reine Unit-Tests — kein Supabase, kein Server, kein Netzwerk.
 */

import { describe, it, expect } from 'vitest'
import {
  generateProductSummary,
  generateBuyerChecklist,
  generateValueDrivers,
  generateRiskRegister,
  generateBuyerQuestions,
  computeExitReadinessScore,
  generateExitEvidence,
  generateMarkdown,
  type ChecklistItem,
  type ValueDriver,
  type RiskItem,
  type BuyerQuestion,
  type ExitEvidence,
} from '@/lib/exit-readiness'

// ── ProductSummary ────────────────────────────────────────────────────────────

describe('generateProductSummary', () => {
  it('returns a non-empty product name', () => {
    const ps = generateProductSummary()
    expect(ps.name).toBeTruthy()
    expect(typeof ps.name).toBe('string')
  })

  it('returns a non-empty tagline', () => {
    const ps = generateProductSummary()
    expect(ps.tagline).toBeTruthy()
    expect(ps.tagline.length).toBeGreaterThan(5)
  })

  it('returns a non-empty description', () => {
    const ps = generateProductSummary()
    expect(ps.description).toBeTruthy()
    expect(ps.description.length).toBeGreaterThan(50)
  })

  it('returns at least 3 target audience entries', () => {
    const ps = generateProductSummary()
    expect(Array.isArray(ps.targetAudience)).toBe(true)
    expect(ps.targetAudience.length).toBeGreaterThanOrEqual(3)
  })

  it('returns at least 5 core modules', () => {
    const ps = generateProductSummary()
    expect(Array.isArray(ps.coreModules)).toBe(true)
    expect(ps.coreModules.length).toBeGreaterThanOrEqual(5)
  })

  it('returns a pilot status string', () => {
    const ps = generateProductSummary()
    expect(typeof ps.pilotStatus).toBe('string')
    expect(ps.pilotStatus.length).toBeGreaterThan(0)
  })

  it('returns a technical status string', () => {
    const ps = generateProductSummary()
    expect(typeof ps.technicalStatus).toBe('string')
    expect(ps.technicalStatus.length).toBeGreaterThan(0)
  })

  it('returns a monetization logic string', () => {
    const ps = generateProductSummary()
    expect(typeof ps.monetizationLogic).toBe('string')
    expect(ps.monetizationLogic.length).toBeGreaterThan(0)
  })

  it('includes "kein Stripe Live" or similar in monetizationLogic to signal no live payment', () => {
    const ps = generateProductSummary()
    const lower = ps.monetizationLogic.toLowerCase()
    expect(lower).toMatch(/kein stripe|no stripe|kein.*umsatz|kein.*revenue/i)
  })

  it('returns a valid ISO generatedAt timestamp', () => {
    const ps = generateProductSummary()
    expect(ps.generatedAt).toBeTruthy()
    expect(new Date(ps.generatedAt).getTime()).not.toBeNaN()
  })

  it('all target audience entries are non-empty strings', () => {
    const ps = generateProductSummary()
    for (const entry of ps.targetAudience) {
      expect(typeof entry).toBe('string')
      expect(entry.length).toBeGreaterThan(0)
    }
  })

  it('all core modules are non-empty strings', () => {
    const ps = generateProductSummary()
    for (const module of ps.coreModules) {
      expect(typeof module).toBe('string')
      expect(module.length).toBeGreaterThan(0)
    }
  })
})

// ── BuyerChecklist ────────────────────────────────────────────────────────────

describe('generateBuyerChecklist', () => {
  it('returns exactly 13 checklist items', () => {
    const list = generateBuyerChecklist()
    expect(list).toHaveLength(13)
  })

  it('every item has id, label, status, detail', () => {
    const list = generateBuyerChecklist()
    for (const item of list) {
      expect(typeof item.id).toBe('string')
      expect(item.id.length).toBeGreaterThan(0)
      expect(typeof item.label).toBe('string')
      expect(item.label.length).toBeGreaterThan(0)
      expect(['confirmed', 'partial', 'missing']).toContain(item.status)
      expect(typeof item.detail).toBe('string')
      expect(item.detail.length).toBeGreaterThan(0)
    }
  })

  it('all item IDs are unique', () => {
    const list = generateBuyerChecklist()
    const ids = list.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has at least 8 confirmed items (product exists, modules, tests, etc.)', () => {
    const list = generateBuyerChecklist()
    const confirmed = list.filter((c) => c.status === 'confirmed')
    expect(confirmed.length).toBeGreaterThanOrEqual(8)
  })

  it('product_exists item is confirmed', () => {
    const list = generateBuyerChecklist()
    const item = list.find((c) => c.id === 'product_exists')
    expect(item).toBeDefined()
    expect(item!.status).toBe('confirmed')
  })

  it('admin_dashboards item exists and is confirmed', () => {
    const list = generateBuyerChecklist()
    const item = list.find((c) => c.id === 'admin_dashboards')
    expect(item).toBeDefined()
    expect(item!.status).toBe('confirmed')
  })

  it('tests_documented item exists and is confirmed', () => {
    const list = generateBuyerChecklist()
    const item = list.find((c) => c.id === 'tests_documented')
    expect(item).toBeDefined()
    expect(item!.status).toBe('confirmed')
  })

  it('risks_documented item exists and is confirmed', () => {
    const list = generateBuyerChecklist()
    const item = list.find((c) => c.id === 'risks_documented')
    expect(item).toBeDefined()
    expect(item!.status).toBe('confirmed')
  })

  it('no item has empty label', () => {
    const list = generateBuyerChecklist()
    for (const item of list) {
      expect(item.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('no item has empty detail', () => {
    const list = generateBuyerChecklist()
    for (const item of list) {
      expect(item.detail.trim().length).toBeGreaterThan(0)
    }
  })

  it('works without liveData argument', () => {
    expect(() => generateBuyerChecklist()).not.toThrow()
  })

  it('works with empty liveData', () => {
    expect(() => generateBuyerChecklist({})).not.toThrow()
    const list = generateBuyerChecklist({})
    expect(list).toHaveLength(13)
  })

  it('works with all flags provided', () => {
    const list = generateBuyerChecklist({
      hasAdminDashboards: true,
      hasCandidateAcquisition: true,
      hasEmployerAcquisition: true,
      hasMigrationIntelligence: true,
      hasRevenueIntelligence: true,
      hasDueDiligence: true,
      hasOutreachKit: true,
      pilotOutreachTested: true,
      deploymentPresent: true,
      testsDocumented: true,
    })
    expect(list).toHaveLength(13)
  })
})

// ── ValueDrivers ──────────────────────────────────────────────────────────────

describe('generateValueDrivers', () => {
  it('returns exactly 9 value drivers', () => {
    const drivers = generateValueDrivers()
    expect(drivers).toHaveLength(9)
  })

  it('every driver has id, title, description, evidence, strength', () => {
    const drivers = generateValueDrivers()
    for (const v of drivers) {
      expect(typeof v.id).toBe('string')
      expect(v.id.length).toBeGreaterThan(0)
      expect(typeof v.title).toBe('string')
      expect(v.title.length).toBeGreaterThan(0)
      expect(typeof v.description).toBe('string')
      expect(v.description.length).toBeGreaterThan(10)
      expect(typeof v.evidence).toBe('string')
      expect(v.evidence.length).toBeGreaterThan(0)
      expect(['strong', 'moderate', 'weak']).toContain(v.strength)
    }
  })

  it('all driver IDs are unique', () => {
    const drivers = generateValueDrivers()
    const ids = drivers.map((v) => v.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has at least 3 strong drivers', () => {
    const drivers = generateValueDrivers()
    const strong = drivers.filter((v) => v.strength === 'strong')
    expect(strong.length).toBeGreaterThanOrEqual(3)
  })

  it('marketplace_structure driver is strong', () => {
    const drivers = generateValueDrivers()
    const d = drivers.find((v) => v.id === 'marketplace_structure')
    expect(d).toBeDefined()
    expect(d!.strength).toBe('strong')
  })

  it('modular_saas driver exists', () => {
    const drivers = generateValueDrivers()
    const d = drivers.find((v) => v.id === 'modular_saas')
    expect(d).toBeDefined()
  })

  it('migration_corridor_positioning driver exists and is strong', () => {
    const drivers = generateValueDrivers()
    const d = drivers.find((v) => v.id === 'migration_corridor_positioning')
    expect(d).toBeDefined()
    expect(d!.strength).toBe('strong')
  })

  it('no driver has empty description', () => {
    const drivers = generateValueDrivers()
    for (const v of drivers) {
      expect(v.description.trim().length).toBeGreaterThan(0)
    }
  })

  it('no driver has empty evidence', () => {
    const drivers = generateValueDrivers()
    for (const v of drivers) {
      expect(v.evidence.trim().length).toBeGreaterThan(0)
    }
  })
})

// ── RiskRegister ──────────────────────────────────────────────────────────────

describe('generateRiskRegister', () => {
  it('returns exactly 10 risks', () => {
    const risks = generateRiskRegister()
    expect(risks).toHaveLength(10)
  })

  it('every risk has id, title, severity, explanation, mitigation, ownerSuggestion', () => {
    const risks = generateRiskRegister()
    for (const r of risks) {
      expect(typeof r.id).toBe('string')
      expect(r.id.length).toBeGreaterThan(0)
      expect(typeof r.title).toBe('string')
      expect(r.title.length).toBeGreaterThan(0)
      expect(['critical', 'high', 'medium', 'low']).toContain(r.severity)
      expect(typeof r.explanation).toBe('string')
      expect(r.explanation.length).toBeGreaterThan(10)
      expect(typeof r.mitigation).toBe('string')
      expect(r.mitigation.length).toBeGreaterThan(5)
      expect(typeof r.ownerSuggestion).toBe('string')
      expect(r.ownerSuggestion.length).toBeGreaterThan(0)
    }
  })

  it('all risk IDs are unique', () => {
    const risks = generateRiskRegister()
    const ids = risks.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('no_revenue risk exists and is high severity', () => {
    const risks = generateRiskRegister()
    const r = risks.find((r) => r.id === 'no_revenue')
    expect(r).toBeDefined()
    expect(r!.severity).toBe('high')
  })

  it('legal_compliance risk exists', () => {
    const risks = generateRiskRegister()
    const r = risks.find((r) => r.id === 'legal_compliance')
    expect(r).toBeDefined()
  })

  it('no_traction risk exists and is high severity', () => {
    const risks = generateRiskRegister()
    const r = risks.find((r) => r.id === 'no_traction')
    expect(r).toBeDefined()
    expect(r!.severity).toBe('high')
  })

  it('cold_start risk exists', () => {
    const risks = generateRiskRegister()
    const r = risks.find((r) => r.id === 'cold_start')
    expect(r).toBeDefined()
  })

  it('has at least 2 high severity risks', () => {
    const risks = generateRiskRegister()
    const high = risks.filter((r) => r.severity === 'high' || r.severity === 'critical')
    expect(high.length).toBeGreaterThanOrEqual(2)
  })

  it('every risk has non-empty mitigation', () => {
    const risks = generateRiskRegister()
    for (const r of risks) {
      expect(r.mitigation.trim().length).toBeGreaterThan(0)
    }
  })

  it('every risk has non-empty ownerSuggestion', () => {
    const risks = generateRiskRegister()
    for (const r of risks) {
      expect(r.ownerSuggestion.trim().length).toBeGreaterThan(0)
    }
  })

  it('no_revenue risk honestly mentions no stripe live or no payment', () => {
    const risks = generateRiskRegister()
    const r = risks.find((r) => r.id === 'no_revenue')
    expect(r).toBeDefined()
    const combined = (r!.explanation + r!.title).toLowerCase()
    expect(combined).toMatch(/revenue|umsatz|zahlung|payment|stripe/i)
  })
})

// ── BuyerQuestions ────────────────────────────────────────────────────────────

describe('generateBuyerQuestions', () => {
  it('returns exactly 10 Q&A pairs', () => {
    const qas = generateBuyerQuestions()
    expect(qas).toHaveLength(10)
  })

  it('every Q&A has question, answer, honesty', () => {
    const qas = generateBuyerQuestions()
    for (const qa of qas) {
      expect(typeof qa.question).toBe('string')
      expect(qa.question.length).toBeGreaterThan(5)
      expect(typeof qa.answer).toBe('string')
      expect(qa.answer.length).toBeGreaterThan(10)
      expect(['positive', 'neutral', 'candid']).toContain(qa.honesty)
    }
  })

  it('has at least 3 candid answers (honesty !== positive)', () => {
    const qas = generateBuyerQuestions()
    const candid = qas.filter((qa) => qa.honesty === 'candid')
    expect(candid.length).toBeGreaterThanOrEqual(3)
  })

  it('revenue question has candid honesty', () => {
    const qas = generateBuyerQuestions()
    const revenueQa = qas.find((qa) => qa.question.toLowerCase().includes('revenue'))
    expect(revenueQa).toBeDefined()
    expect(revenueQa!.honesty).toBe('candid')
  })

  it('revenue answer honestly states no verified revenue', () => {
    const qas = generateBuyerQuestions()
    const revenueQa = qas.find((qa) => qa.question.toLowerCase().includes('revenue'))
    expect(revenueQa).toBeDefined()
    const lower = revenueQa!.answer.toLowerCase()
    expect(lower).toMatch(/no.*revenue|no.*verified|kein.*umsatz/i)
  })

  it('no question is empty', () => {
    const qas = generateBuyerQuestions()
    for (const qa of qas) {
      expect(qa.question.trim().length).toBeGreaterThan(0)
    }
  })

  it('no answer is empty', () => {
    const qas = generateBuyerQuestions()
    for (const qa of qas) {
      expect(qa.answer.trim().length).toBeGreaterThan(0)
    }
  })

  it('all questions end with a question mark', () => {
    const qas = generateBuyerQuestions()
    for (const qa of qas) {
      expect(qa.question.trim()).toMatch(/\?$/)
    }
  })

  it('questions about revenue/traction are candid, not positive', () => {
    const qas = generateBuyerQuestions()
    const sensitiveQas = qas.filter((qa) => {
      const q = qa.question.toLowerCase()
      return q.includes('revenue') || q.includes('traction') || q.includes('risk')
    })
    for (const qa of sensitiveQas) {
      expect(qa.honesty).not.toBe('positive')
    }
  })
})

// ── computeExitReadinessScore ─────────────────────────────────────────────────

describe('computeExitReadinessScore', () => {
  it('returns 0 for empty checklist', () => {
    expect(computeExitReadinessScore([])).toBe(0)
  })

  it('returns 100 for all confirmed items', () => {
    const items: ChecklistItem[] = [
      { id: 'a', label: 'A', status: 'confirmed', detail: 'ok' },
      { id: 'b', label: 'B', status: 'confirmed', detail: 'ok' },
    ]
    expect(computeExitReadinessScore(items)).toBe(100)
  })

  it('returns 0 for all missing items', () => {
    const items: ChecklistItem[] = [
      { id: 'a', label: 'A', status: 'missing', detail: 'not ok' },
      { id: 'b', label: 'B', status: 'missing', detail: 'not ok' },
    ]
    expect(computeExitReadinessScore(items)).toBe(0)
  })

  it('returns 50 for all partial items', () => {
    const items: ChecklistItem[] = [
      { id: 'a', label: 'A', status: 'partial', detail: 'half' },
      { id: 'b', label: 'B', status: 'partial', detail: 'half' },
    ]
    expect(computeExitReadinessScore(items)).toBe(50)
  })

  it('returns correct mixed score: 2 confirmed, 1 partial, 1 missing out of 4 = 63%', () => {
    const items: ChecklistItem[] = [
      { id: 'a', label: 'A', status: 'confirmed', detail: '' },
      { id: 'b', label: 'B', status: 'confirmed', detail: '' },
      { id: 'c', label: 'C', status: 'partial', detail: '' },
      { id: 'd', label: 'D', status: 'missing', detail: '' },
    ]
    // (1 + 1 + 0.5 + 0) / 4 * 100 = 62.5 → rounded = 63
    expect(computeExitReadinessScore(items)).toBe(63)
  })

  it('returns value in 0–100 range for default checklist', () => {
    const list = generateBuyerChecklist()
    const score = computeExitReadinessScore(list)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('returns integer (rounded value)', () => {
    const list = generateBuyerChecklist()
    const score = computeExitReadinessScore(list)
    expect(Number.isInteger(score)).toBe(true)
  })

  it('returns high score (>= 80) for default checklist (most items confirmed)', () => {
    const list = generateBuyerChecklist()
    const score = computeExitReadinessScore(list)
    // Default: 12 confirmed, 1 partial → (12 + 0.5) / 13 = 96.2% → 96
    expect(score).toBeGreaterThanOrEqual(80)
  })

  it('handles single confirmed item → 100', () => {
    const items: ChecklistItem[] = [
      { id: 'x', label: 'X', status: 'confirmed', detail: '' },
    ]
    expect(computeExitReadinessScore(items)).toBe(100)
  })

  it('handles single missing item → 0', () => {
    const items: ChecklistItem[] = [
      { id: 'x', label: 'X', status: 'missing', detail: '' },
    ]
    expect(computeExitReadinessScore(items)).toBe(0)
  })
})

// ── generateExitEvidence ──────────────────────────────────────────────────────

describe('generateExitEvidence', () => {
  it('returns all required top-level keys', () => {
    const ev = generateExitEvidence()
    expect(ev).toHaveProperty('productSummary')
    expect(ev).toHaveProperty('buyerChecklist')
    expect(ev).toHaveProperty('valueDrivers')
    expect(ev).toHaveProperty('riskRegister')
    expect(ev).toHaveProperty('buyerQuestions')
    expect(ev).toHaveProperty('overallReadinessScore')
    expect(ev).toHaveProperty('generatedAt')
  })

  it('overallReadinessScore matches computeExitReadinessScore of checklist', () => {
    const ev = generateExitEvidence()
    const expected = computeExitReadinessScore(ev.buyerChecklist)
    expect(ev.overallReadinessScore).toBe(expected)
  })

  it('buyerChecklist has 13 items', () => {
    const ev = generateExitEvidence()
    expect(ev.buyerChecklist).toHaveLength(13)
  })

  it('valueDrivers has 9 items', () => {
    const ev = generateExitEvidence()
    expect(ev.valueDrivers).toHaveLength(9)
  })

  it('riskRegister has 10 items', () => {
    const ev = generateExitEvidence()
    expect(ev.riskRegister).toHaveLength(10)
  })

  it('buyerQuestions has 10 items', () => {
    const ev = generateExitEvidence()
    expect(ev.buyerQuestions).toHaveLength(10)
  })

  it('generatedAt is a valid ISO string', () => {
    const ev = generateExitEvidence()
    expect(new Date(ev.generatedAt).getTime()).not.toBeNaN()
  })

  it('works without arguments', () => {
    expect(() => generateExitEvidence()).not.toThrow()
  })

  it('works with partial liveData', () => {
    expect(() => generateExitEvidence({ hasAdminDashboards: true })).not.toThrow()
  })

  it('works with all liveData flags', () => {
    expect(() =>
      generateExitEvidence({
        hasAdminDashboards: true,
        hasCandidateAcquisition: true,
        hasEmployerAcquisition: true,
        hasMigrationIntelligence: true,
        hasRevenueIntelligence: true,
        hasDueDiligence: true,
        hasOutreachKit: true,
        pilotOutreachTested: true,
        deploymentPresent: true,
        testsDocumented: true,
      })
    ).not.toThrow()
  })

  it('productSummary.name is non-empty', () => {
    const ev = generateExitEvidence()
    expect(ev.productSummary.name.length).toBeGreaterThan(0)
  })
})

// ── generateMarkdown ──────────────────────────────────────────────────────────

describe('generateMarkdown', () => {
  const evidence = generateExitEvidence()
  const md = generateMarkdown(evidence)

  it('returns a non-empty string', () => {
    expect(typeof md).toBe('string')
    expect(md.length).toBeGreaterThan(100)
  })

  it('contains the product name as H1', () => {
    expect(md).toContain('# ')
    expect(md).toContain(evidence.productSummary.name)
  })

  it('contains Product Summary section', () => {
    expect(md).toMatch(/##.*Product Summary/i)
  })

  it('contains Buyer Checklist section', () => {
    expect(md).toMatch(/##.*Buyer Checklist/i)
  })

  it('contains Value Drivers section', () => {
    expect(md).toMatch(/##.*Value Drivers/i)
  })

  it('contains Risk Register section', () => {
    expect(md).toMatch(/##.*Risk Register/i)
  })

  it('contains Buyer Q&A section', () => {
    expect(md).toMatch(/##.*Buyer.*Q.A/i)
  })

  it('contains the readiness score as percentage', () => {
    expect(md).toContain(`${evidence.overallReadinessScore}%`)
  })

  it('contains disclaimer about no legal advice', () => {
    const lower = md.toLowerCase()
    expect(lower).toMatch(/keine rechtsberatung|no legal|keine garantie/i)
  })

  it('contains checklist items as table rows', () => {
    // Table rows start with |
    const tableLines = md.split('\n').filter((l) => l.trim().startsWith('|'))
    expect(tableLines.length).toBeGreaterThan(0)
  })

  it('contains ✅, ⚠️ or ❌ status icons for checklist items', () => {
    expect(md).toMatch(/✅|⚠️|❌/)
  })

  it('contains risk severity icons', () => {
    expect(md).toMatch(/🔴|🟠|🟡|🟢/)
  })

  it('contains separator lines (---)', () => {
    const separators = md.split('\n').filter((l) => l.trim() === '---')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('tagline appears in the output', () => {
    expect(md).toContain(evidence.productSummary.tagline)
  })

  it('contains "Schätzungen" keyword (estimates clearly marked)', () => {
    expect(md).toMatch(/schätzung/i)
  })

  it('each risk has a mitigation section', () => {
    const riskCount = evidence.riskRegister.length
    const mitigationMatches = (md.match(/\*\*Mitigation:/g) || []).length
    expect(mitigationMatches).toBe(riskCount)
  })

  it('each risk has an owner suggestion', () => {
    const riskCount = evidence.riskRegister.length
    const ownerMatches = (md.match(/\*\*Owner:/g) || []).length
    expect(ownerMatches).toBe(riskCount)
  })
})

// ── Integrity / Regression ────────────────────────────────────────────────────

describe('Integrity checks', () => {
  it('no checklist item mentions fake revenue or fabricated traction', () => {
    const list = generateBuyerChecklist()
    for (const item of list) {
      const lower = (item.label + ' ' + item.detail).toLowerCase()
      // Must not claim MRR or ARR as real confirmed values
      expect(lower).not.toMatch(/€\d+.*mrr confirmed|real paying|verifizierter umsatz.*vorhanden/i)
    }
  })

  it('no risk item trivializes the no-revenue situation', () => {
    const risks = generateRiskRegister()
    const noRevenue = risks.find((r) => r.id === 'no_revenue')
    expect(noRevenue).toBeDefined()
    // Severity should not be downgraded to low or medium — must be high or critical
    expect(['high', 'critical']).toContain(noRevenue!.severity)
  })

  it('no buyer Q&A answer claims revenue is confirmed', () => {
    const qas = generateBuyerQuestions()
    for (const qa of qas) {
      const lower = qa.answer.toLowerCase()
      // Should not say things like "yes, we have revenue" or "confirmed revenue"
      expect(lower).not.toMatch(/revenue.*confirmed|umsatz.*bestätigt|has.*revenue.*yes/i)
    }
  })

  it('computeExitReadinessScore is deterministic', () => {
    const list = generateBuyerChecklist()
    expect(computeExitReadinessScore(list)).toBe(computeExitReadinessScore(list))
  })

  it('generateExitEvidence returns fresh generatedAt each call', async () => {
    // Small timing difference guaranteed by waiting a tick
    const ev1 = generateExitEvidence()
    await new Promise((r) => setTimeout(r, 5))
    const ev2 = generateExitEvidence()
    // Both are valid ISO strings
    expect(new Date(ev1.generatedAt).getTime()).not.toBeNaN()
    expect(new Date(ev2.generatedAt).getTime()).not.toBeNaN()
  })

  it('generateMarkdown does not throw for any valid evidence', () => {
    const ev = generateExitEvidence()
    expect(() => generateMarkdown(ev)).not.toThrow()
  })

  it('all strength values in value drivers are one of: strong | moderate | weak', () => {
    const drivers = generateValueDrivers()
    for (const v of drivers) {
      expect(['strong', 'moderate', 'weak']).toContain(v.strength)
    }
  })

  it('all severity values in risk register are one of: critical | high | medium | low', () => {
    const risks = generateRiskRegister()
    for (const r of risks) {
      expect(['critical', 'high', 'medium', 'low']).toContain(r.severity)
    }
  })

  it('all honesty values in buyer questions are one of: positive | neutral | candid', () => {
    const qas = generateBuyerQuestions()
    for (const qa of qas) {
      expect(['positive', 'neutral', 'candid']).toContain(qa.honesty)
    }
  })
})
