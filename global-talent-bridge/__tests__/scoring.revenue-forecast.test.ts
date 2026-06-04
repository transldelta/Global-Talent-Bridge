import { describe, it, expect } from 'vitest'
import {
  computeScenario,
  computeScenarios,
  AVG_EMPLOYER_MRR,
  CANDIDATE_PREMIUM_RATE,
  CANDIDATE_PREMIUM_PRICE,
  PLACEMENT_FEE,
  ANNUAL_PLACEMENT_RATE,
  MONTHLY_OPEX_EUR,
} from '@/lib/revenue/forecast'

describe('Revenue Forecast — computeScenario', () => {
  it('returns 0 MRR when employers=0 and candidates=0', () => {
    const s = computeScenario('Zero', 0, 0)
    expect(s.mrr).toBe(0)
    expect(s.arr).toBe(0)
    expect(s.placementFeeAnnual).toBe(0)
    expect(s.totalAnnualRevenue).toBe(0)
  })

  it('ARR equals MRR × 12', () => {
    const s = computeScenario('Test', 10, 100)
    expect(s.arr).toBe(s.mrr * 12)
  })

  it('totalAnnualRevenue equals ARR + placementFeeAnnual', () => {
    const s = computeScenario('Test', 50, 500)
    expect(s.totalAnnualRevenue).toBe(s.arr + s.placementFeeAnnual)
  })

  it('employer MRR scales linearly with employer count', () => {
    const s10  = computeScenario('10emp', 10, 0)
    const s20  = computeScenario('20emp', 20, 0)
    expect(s20.mrr).toBe(s10.mrr * 2)
  })

  it('placement fee scales with candidate count via ANNUAL_PLACEMENT_RATE', () => {
    const s = computeScenario('Test', 0, 100)
    const expectedPlacements = Math.round(100 * ANNUAL_PLACEMENT_RATE)
    expect(s.placementFeeAnnual).toBe(expectedPlacements * PLACEMENT_FEE)
  })

  it('break-even is ceil(MONTHLY_OPEX / MRR) when MRR > 0', () => {
    const s = computeScenario('Test', 10, 100)
    expect(s.breakEvenMonths).toBe(Math.ceil(MONTHLY_OPEX_EUR / s.mrr))
  })

  it('break-even is 999 when MRR is 0', () => {
    const s = computeScenario('Zero', 0, 0)
    expect(s.breakEvenMonths).toBe(999)
  })

  it('candidate MRR accounts for conversion rate', () => {
    const s = computeScenario('Candidates-only', 0, 100)
    const expectedCandidateMRR = Math.round(100 * CANDIDATE_PREMIUM_RATE) * CANDIDATE_PREMIUM_PRICE
    expect(s.mrr).toBe(expectedCandidateMRR)
  })

  it('returns correct label', () => {
    const s = computeScenario('Szenario A', 10, 100)
    expect(s.label).toBe('Szenario A')
    expect(s.employers).toBe(10)
    expect(s.candidates).toBe(100)
  })
})

describe('Revenue Forecast — computeScenarios', () => {
  it('returns exactly 3 scenarios', () => {
    const scenarios = computeScenarios()
    expect(scenarios).toHaveLength(3)
  })

  it('scenarios are ordered ascending by employers', () => {
    const [a, b, c] = computeScenarios()
    expect(a.employers).toBeLessThan(b.employers)
    expect(b.employers).toBeLessThan(c.employers)
  })

  it('MRR increases with scale (A < B < C)', () => {
    const [a, b, c] = computeScenarios()
    expect(a.mrr).toBeLessThan(b.mrr)
    expect(b.mrr).toBeLessThan(c.mrr)
  })

  it('Szenario A has employers=10 candidates=100', () => {
    const [a] = computeScenarios()
    expect(a.employers).toBe(10)
    expect(a.candidates).toBe(100)
  })

  it('Szenario C has employers=100 candidates=1000', () => {
    const [,, c] = computeScenarios()
    expect(c.employers).toBe(100)
    expect(c.candidates).toBe(1000)
  })

  it('Szenario A break-even is achievable (< 12 months given low opex)', () => {
    const [a] = computeScenarios()
    // With ~3000 EUR/month opex and ~1827 EUR MRR, break-even ≤ 3 months
    expect(a.breakEvenMonths).toBeLessThan(12)
  })
})

describe('Revenue Forecast — constants', () => {
  it('AVG_EMPLOYER_MRR is a positive number', () => {
    expect(AVG_EMPLOYER_MRR).toBeGreaterThan(0)
  })

  it('CANDIDATE_PREMIUM_RATE is between 0 and 1', () => {
    expect(CANDIDATE_PREMIUM_RATE).toBeGreaterThan(0)
    expect(CANDIDATE_PREMIUM_RATE).toBeLessThanOrEqual(1)
  })

  it('MONTHLY_OPEX_EUR is positive', () => {
    expect(MONTHLY_OPEX_EUR).toBeGreaterThan(0)
  })

  it('PLACEMENT_FEE is positive', () => {
    expect(PLACEMENT_FEE).toBeGreaterThan(0)
  })
})
