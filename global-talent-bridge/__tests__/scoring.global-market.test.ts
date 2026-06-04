import { describe, it, expect } from 'vitest'
import {
  computeGMIOpportunityScore,
  deriveGMIPriorityLevel,
} from '@/lib/scoring/global-market'

describe('Global Market Intelligence — computeGMIOpportunityScore', () => {
  it('returns 0 when supply=0 and demand=0', () => {
    expect(computeGMIOpportunityScore(0, 0)).toBe(0)
  })

  it('returns 100 when supply=100 and demand=100', () => {
    // 100*0.4 + 100*0.6 = 100
    expect(computeGMIOpportunityScore(100, 100)).toBe(100)
  })

  it('weights demand (0.6) more than supply (0.4)', () => {
    const demandOnly = computeGMIOpportunityScore(0, 100)   // 60
    const supplyOnly = computeGMIOpportunityScore(100, 0)   // 40
    expect(demandOnly).toBeGreaterThan(supplyOnly)
    expect(demandOnly).toBe(60)
    expect(supplyOnly).toBe(40)
  })

  it('computes a typical corridor: supply=60, demand=80 → 60*0.4 + 80*0.6 = 72', () => {
    expect(computeGMIOpportunityScore(60, 80)).toBe(72)
  })

  it('result is clamped to 100 even for large inputs', () => {
    expect(computeGMIOpportunityScore(200, 200)).toBe(100)
  })

  it('result is always between 0 and 100', () => {
    const cases = [[0,0],[50,50],[100,100],[0,100],[100,0],[75,90]]
    for (const [s, d] of cases) {
      const score = computeGMIOpportunityScore(s, d)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })
})

describe('Global Market Intelligence — deriveGMIPriorityLevel', () => {
  it('returns critical for score >= 85', () => {
    expect(deriveGMIPriorityLevel(85)).toBe('critical')
    expect(deriveGMIPriorityLevel(100)).toBe('critical')
  })

  it('returns high for score 70–84', () => {
    expect(deriveGMIPriorityLevel(70)).toBe('high')
    expect(deriveGMIPriorityLevel(84)).toBe('high')
  })

  it('returns medium for score 50–69', () => {
    expect(deriveGMIPriorityLevel(50)).toBe('medium')
    expect(deriveGMIPriorityLevel(69)).toBe('medium')
  })

  it('returns low for score < 50', () => {
    expect(deriveGMIPriorityLevel(0)).toBe('low')
    expect(deriveGMIPriorityLevel(49)).toBe('low')
  })

  it('boundary: 85 is critical, 84 is high', () => {
    expect(deriveGMIPriorityLevel(85)).toBe('critical')
    expect(deriveGMIPriorityLevel(84)).toBe('high')
  })
})
