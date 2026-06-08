/**
 * __tests__/corridor-intelligence.lib.test.ts
 *
 * Tests for lib/corridor-intelligence.ts
 * — calculateBuyerScore, scoreBand, CORRIDOR_PROFILES, DEMO_CORRIDORS,
 *   MONETIZATION_PATHS, BUYER_VALUE_ITEMS, SCORE_DISCLAIMER
 */

import { describe, it, expect } from 'vitest'
import {
  calculateBuyerScore,
  scoreBand,
  CORRIDOR_PROFILES,
  DEMO_CORRIDORS,
  MONETIZATION_PATHS,
  BUYER_VALUE_ITEMS,
  BUYER_DIFFERENTIATION,
  SCORE_DISCLAIMER,
} from '@/lib/corridor-intelligence'
import type { ScoreCriterion } from '@/lib/corridor-intelligence'

// ── calculateBuyerScore ───────────────────────────────────────────────────────

describe('calculateBuyerScore', () => {
  it('returns 100 when all criteria are maxed', () => {
    const criteria: ScoreCriterion[] = [
      { key: 'a', label: 'A', value: 10, max: 10, note: '' },
      { key: 'b', label: 'B', value: 20, max: 20, note: '' },
    ]
    expect(calculateBuyerScore(criteria)).toBe(100)
  })

  it('returns 0 when all criteria are 0', () => {
    const criteria: ScoreCriterion[] = [
      { key: 'a', label: 'A', value: 0, max: 10, note: '' },
    ]
    expect(calculateBuyerScore(criteria)).toBe(0)
  })

  it('returns 0 for empty criteria array', () => {
    expect(calculateBuyerScore([])).toBe(0)
  })

  it('rounds to nearest integer', () => {
    // 1/3 * 100 ≈ 33.33 → 33
    const criteria: ScoreCriterion[] = [
      { key: 'a', label: 'A', value: 1, max: 3, note: '' },
    ]
    expect(calculateBuyerScore(criteria)).toBe(33)
  })

  it('computes correctly for multi-criterion breakdown', () => {
    // 9+10 out of 10+15 = 19/25 = 76
    const criteria: ScoreCriterion[] = [
      { key: 'x', label: 'X', value: 9,  max: 10, note: '' },
      { key: 'y', label: 'Y', value: 10, max: 15, note: '' },
    ]
    expect(calculateBuyerScore(criteria)).toBe(76)
  })
})

// ── scoreBand ─────────────────────────────────────────────────────────────────

describe('scoreBand', () => {
  it('returns green + "High opportunity" for score >= 75', () => {
    expect(scoreBand(75)).toEqual({ label: 'High opportunity', color: 'green' })
    expect(scoreBand(100)).toEqual({ label: 'High opportunity', color: 'green' })
  })

  it('returns yellow + "Medium opportunity" for 50–74', () => {
    expect(scoreBand(50)).toEqual({ label: 'Medium opportunity', color: 'yellow' })
    expect(scoreBand(74)).toEqual({ label: 'Medium opportunity', color: 'yellow' })
  })

  it('returns red + "Lower priority" for score < 50', () => {
    expect(scoreBand(0)).toEqual({ label: 'Lower priority', color: 'red' })
    expect(scoreBand(49)).toEqual({ label: 'Lower priority', color: 'red' })
  })

  it('boundary: 75 is green, 74 is yellow', () => {
    expect(scoreBand(75).color).toBe('green')
    expect(scoreBand(74).color).toBe('yellow')
  })
})

// ── CORRIDOR_PROFILES ─────────────────────────────────────────────────────────

describe('CORRIDOR_PROFILES', () => {
  it('has at least 8 corridors', () => {
    expect(CORRIDOR_PROFILES.length).toBeGreaterThanOrEqual(8)
  })

  it('every corridor has a unique id', () => {
    const ids = CORRIDOR_PROFILES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every corridor has a non-empty label', () => {
    for (const c of CORRIDOR_PROFILES) {
      expect(c.label.length).toBeGreaterThan(0)
    }
  })

  it('every corridor has at least one source and destination market', () => {
    for (const c of CORRIDOR_PROFILES) {
      expect(c.sourceMarkets.length).toBeGreaterThan(0)
      expect(c.destinationMarkets.length).toBeGreaterThan(0)
    }
  })

  it('every corridor has a valid legalRisk value', () => {
    const valid = new Set(['low', 'medium', 'high'])
    for (const c of CORRIDOR_PROFILES) {
      expect(valid.has(c.legalRisk)).toBe(true)
    }
  })

  it('every corridor has a valid speedToPilot value', () => {
    const valid = new Set(['fast', 'medium', 'slow'])
    for (const c of CORRIDOR_PROFILES) {
      expect(valid.has(c.speedToPilot)).toBe(true)
    }
  })

  it('every corridor scoreBreakdown sums to a max of 100', () => {
    for (const c of CORRIDOR_PROFILES) {
      const totalMax = c.scoreBreakdown.reduce((s, cr) => s + cr.max, 0)
      expect(totalMax).toBe(100)
    }
  })

  it('every score criterion value is within [0, max]', () => {
    for (const c of CORRIDOR_PROFILES) {
      for (const cr of c.scoreBreakdown) {
        expect(cr.value).toBeGreaterThanOrEqual(0)
        expect(cr.value).toBeLessThanOrEqual(cr.max)
      }
    }
  })

  it('every corridor has a non-empty recommendedFirstAction', () => {
    for (const c of CORRIDOR_PROFILES) {
      expect(c.recommendedFirstAction.length).toBeGreaterThan(0)
    }
  })

  it('all corridor scores are in range [0, 100]', () => {
    for (const c of CORRIDOR_PROFILES) {
      const score = calculateBuyerScore(c.scoreBreakdown)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })

  it('top-ranked corridor has score >= 85', () => {
    const scores = CORRIDOR_PROFILES.map((c) => calculateBuyerScore(c.scoreBreakdown))
    expect(Math.max(...scores)).toBeGreaterThanOrEqual(85)
  })
})

// ── DEMO_CORRIDORS ────────────────────────────────────────────────────────────

describe('DEMO_CORRIDORS', () => {
  it('has exactly 3 demo corridors', () => {
    expect(DEMO_CORRIDORS.length).toBe(3)
  })

  it('every demo corridor has a buyerScore between 70 and 100', () => {
    for (const dc of DEMO_CORRIDORS) {
      expect(dc.buyerScore).toBeGreaterThanOrEqual(70)
      expect(dc.buyerScore).toBeLessThanOrEqual(100)
    }
  })

  it('every demo corridor has a unique id', () => {
    const ids = DEMO_CORRIDORS.map((dc) => dc.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every demo corridor has a growthDepartmentLink starting with /', () => {
    for (const dc of DEMO_CORRIDORS) {
      expect(dc.growthDepartmentLink.startsWith('/')).toBe(true)
    }
  })

  it('every demo corridor has a non-empty whyHighValue', () => {
    for (const dc of DEMO_CORRIDORS) {
      expect(dc.whyHighValue.length).toBeGreaterThan(10)
    }
  })

  it('every demo corridor has at least one source market', () => {
    for (const dc of DEMO_CORRIDORS) {
      expect(dc.sourceMarkets.length).toBeGreaterThan(0)
    }
  })
})

// ── MONETIZATION_PATHS ────────────────────────────────────────────────────────

describe('MONETIZATION_PATHS', () => {
  it('has at least 6 monetization paths', () => {
    expect(MONETIZATION_PATHS.length).toBeGreaterThanOrEqual(6)
  })

  it('every path has a unique id', () => {
    const ids = MONETIZATION_PATHS.map((mp) => mp.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every path has a valid effort value', () => {
    const valid = new Set(['low', 'medium', 'high'])
    for (const mp of MONETIZATION_PATHS) {
      expect(valid.has(mp.effort)).toBe(true)
    }
  })

  it('every path has a valid revenueType', () => {
    const valid = new Set(['recurring', 'one-time', 'transaction', 'licence'])
    for (const mp of MONETIZATION_PATHS) {
      expect(valid.has(mp.revenueType)).toBe(true)
    }
  })

  it('includes acquisition path', () => {
    const ids = MONETIZATION_PATHS.map((mp) => mp.id)
    expect(ids).toContain('acquisition')
  })

  it('every path has a non-empty label and desc', () => {
    for (const mp of MONETIZATION_PATHS) {
      expect(mp.label.length).toBeGreaterThan(0)
      expect(mp.desc.length).toBeGreaterThan(0)
    }
  })
})

// ── BUYER_VALUE_ITEMS ─────────────────────────────────────────────────────────

describe('BUYER_VALUE_ITEMS', () => {
  it('has at least 6 categories', () => {
    expect(BUYER_VALUE_ITEMS.length).toBeGreaterThanOrEqual(6)
  })

  it('every category has at least 3 items', () => {
    for (const section of BUYER_VALUE_ITEMS) {
      expect(section.items.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('safety category contains no_auto_send', () => {
    const safetySection = BUYER_VALUE_ITEMS.find((s) =>
      s.category.toLowerCase().includes('safety') ||
      s.category.toLowerCase().includes('compliance'),
    )
    expect(safetySection).toBeDefined()
    const combined = safetySection!.items.join(' ')
    expect(combined).toMatch(/no_auto_send|no automatic sending/i)
  })
})

// ── BUYER_DIFFERENTIATION / SCORE_DISCLAIMER ─────────────────────────────────

describe('constants', () => {
  it('BUYER_DIFFERENTIATION is a non-empty string', () => {
    expect(typeof BUYER_DIFFERENTIATION).toBe('string')
    expect(BUYER_DIFFERENTIATION.length).toBeGreaterThan(20)
  })

  it('SCORE_DISCLAIMER mentions validation', () => {
    expect(SCORE_DISCLAIMER).toMatch(/validat/i)
  })

  it('SCORE_DISCLAIMER is not investment advice', () => {
    expect(SCORE_DISCLAIMER).toMatch(/not.*investment advice|investment advice.*not/i)
  })
})
