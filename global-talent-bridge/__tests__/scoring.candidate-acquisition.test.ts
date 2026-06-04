import { describe, it, expect } from 'vitest'
import {
  computeCAOpportunityScore,
  deriveCAPriority,
} from '@/lib/scoring/candidate-acquisition'

describe('Candidate Acquisition — computeCAOpportunityScore', () => {
  it('returns 0 when quality=0, audience=1, difficulty=100', () => {
    // quality*0.4=0, reachScore≈0, ease=0 → 0
    expect(computeCAOpportunityScore(0, 1, 100)).toBe(0)
  })

  it('returns 100 (clamped) for max inputs', () => {
    const score = computeCAOpportunityScore(100, 10_000_000, 0)
    expect(score).toBe(100)
  })

  it('reach score uses logarithmic scale — 1M audience < 10M audience', () => {
    const score1M  = computeCAOpportunityScore(50, 1_000_000,  50)
    const score10M = computeCAOpportunityScore(50, 10_000_000, 50)
    expect(score10M).toBeGreaterThan(score1M)
  })

  it('higher quality increases score', () => {
    const low  = computeCAOpportunityScore(20, 100_000, 50)
    const high = computeCAOpportunityScore(90, 100_000, 50)
    expect(high).toBeGreaterThan(low)
  })

  it('higher difficulty decreases score (through ease = 100 - difficulty)', () => {
    const easy = computeCAOpportunityScore(50, 100_000, 10)
    const hard = computeCAOpportunityScore(50, 100_000, 90)
    expect(easy).toBeGreaterThan(hard)
  })

  it('result is always between 0 and 100', () => {
    const cases = [
      [0, 1, 0], [100, 10_000_000, 0],
      [50, 100_000, 50], [0, 0, 100],
      [100, 1, 100],
    ]
    for (const [q, a, d] of cases) {
      const s = computeCAOpportunityScore(q, a, d)
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThanOrEqual(100)
    }
  })
})

describe('Candidate Acquisition — deriveCAPriority', () => {
  it('returns critical for score >= 85', () => {
    expect(deriveCAPriority(85)).toBe('critical')
    expect(deriveCAPriority(100)).toBe('critical')
  })

  it('returns high for score 70–84', () => {
    expect(deriveCAPriority(70)).toBe('high')
    expect(deriveCAPriority(84)).toBe('high')
  })

  it('returns medium for score 50–69', () => {
    expect(deriveCAPriority(50)).toBe('medium')
    expect(deriveCAPriority(69)).toBe('medium')
  })

  it('returns low for score < 50', () => {
    expect(deriveCAPriority(0)).toBe('low')
    expect(deriveCAPriority(49)).toBe('low')
  })
})
