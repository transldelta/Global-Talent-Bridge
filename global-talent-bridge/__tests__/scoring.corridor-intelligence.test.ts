import { describe, it, expect } from 'vitest'
import {
  computeCIOpportunityScore,
  deriveCIPriority,
} from '@/lib/scoring/corridor-intelligence'

describe('Corridor Intelligence — computeCIOpportunityScore', () => {
  it('returns 100 when all inputs are 100', () => {
    // 100*0.4 + 100*0.2 + 100*0.4 = 100
    expect(computeCIOpportunityScore(100, 100, 100)).toBe(100)
  })

  it('returns 0 when all inputs are 0', () => {
    expect(computeCIOpportunityScore(0, 0, 0)).toBe(0)
  })

  it('weights demand (0.4) higher than supply (0.2)', () => {
    // demand-only: 100*0.4 + 0 + 0 = 40
    // supply-only: 0 + 100*0.2 + 0 = 20
    const demandOnly = computeCIOpportunityScore(100, 0, 0)
    const supplyOnly = computeCIOpportunityScore(0, 100, 0)
    expect(demandOnly).toBeGreaterThan(supplyOnly)
    expect(demandOnly).toBe(40)
    expect(supplyOnly).toBe(20)
  })

  it('ci_demand (0.4) equals corridor_demand weight', () => {
    const ciDemandOnly  = computeCIOpportunityScore(0, 0, 100)
    const corrDemandOnly = computeCIOpportunityScore(100, 0, 0)
    expect(ciDemandOnly).toBe(corrDemandOnly) // both = 40
  })

  it('computes a realistic mid-range corridor correctly', () => {
    // demand=70, supply=50, ciDemand=80 → 70*0.4 + 50*0.2 + 80*0.4 = 28 + 10 + 32 = 70
    expect(computeCIOpportunityScore(70, 50, 80)).toBe(70)
  })

  it('is always clamped to [0, 100]', () => {
    const cases = [[0,0,0],[100,100,100],[50,50,50],[0,100,100]]
    for (const [d, s, c] of cases) {
      const score = computeCIOpportunityScore(d, s, c)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })
})

describe('Corridor Intelligence — deriveCIPriority', () => {
  it('returns critical for score >= 85', () => {
    expect(deriveCIPriority(85)).toBe('critical')
    expect(deriveCIPriority(100)).toBe('critical')
  })

  it('returns high for score 70–84', () => {
    expect(deriveCIPriority(70)).toBe('high')
    expect(deriveCIPriority(84)).toBe('high')
  })

  it('returns medium for score 50–69', () => {
    expect(deriveCIPriority(50)).toBe('medium')
    expect(deriveCIPriority(69)).toBe('medium')
  })

  it('returns low for score < 50', () => {
    expect(deriveCIPriority(0)).toBe('low')
    expect(deriveCIPriority(49)).toBe('low')
  })

  it('boundary: 85 is critical, 84 is high', () => {
    expect(deriveCIPriority(85)).toBe('critical')
    expect(deriveCIPriority(84)).toBe('high')
  })
})
