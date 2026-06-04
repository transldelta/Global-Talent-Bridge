import { describe, it, expect } from 'vitest'

// ─────────────────────────────────────────────────────────────
// Launch Readiness Audit — Pure scoring helpers
// Tested: Score aggregation, blocker counting, recommendation derivation
// ─────────────────────────────────────────────────────────────

type ReadinessDimension = {
  name: string
  score: number
  weight: number
}

type ReadinessLevel = 'not_ready' | 'pilot_ready' | 'launch_ready'

// Compute weighted overall score from dimensions
function computeOverallReadinessScore(dimensions: ReadinessDimension[]): number {
  const totalWeight = dimensions.reduce((s, d) => s + d.weight, 0)
  if (totalWeight === 0) return 0
  const weightedSum = dimensions.reduce((s, d) => s + d.score * d.weight, 0)
  return Math.round(weightedSum / totalWeight)
}

// Derive recommendation from overall score
function deriveReadinessLevel(overallScore: number, criticalBlockers: number): ReadinessLevel {
  if (criticalBlockers > 5 || overallScore < 40) return 'not_ready'
  if (criticalBlockers > 0 || overallScore < 65) return 'pilot_ready'
  return 'launch_ready'
}

// Count how many dimensions are below threshold
function countWeakDimensions(dimensions: ReadinessDimension[], threshold = 50): number {
  return dimensions.filter(d => d.score < threshold).length
}

// Check if all critical dimensions pass minimum threshold
function allCriticalDimensionsPass(
  dimensions: ReadinessDimension[],
  criticalNames: string[],
  minScore = 60
): boolean {
  return criticalNames.every(name => {
    const dim = dimensions.find(d => d.name === name)
    return dim !== undefined && dim.score >= minScore
  })
}

// ── Actual GTB audit dimensions (2026-06-04) ──────────────────
const GTB_DIMENSIONS: ReadinessDimension[] = [
  { name: 'technical',  score: 62, weight: 0.30 },
  { name: 'business',   score: 38, weight: 0.25 },
  { name: 'launch',     score: 35, weight: 0.25 },
  { name: 'buyer',      score: 68, weight: 0.20 },
]

describe('Launch Readiness — computeOverallReadinessScore', () => {
  it('returns 0 for empty dimensions', () => {
    expect(computeOverallReadinessScore([])).toBe(0)
  })

  it('returns the score directly for a single dimension with weight 1', () => {
    expect(computeOverallReadinessScore([{ name: 'test', score: 75, weight: 1 }])).toBe(75)
  })

  it('computes weighted average correctly', () => {
    const dims: ReadinessDimension[] = [
      { name: 'a', score: 100, weight: 1 },
      { name: 'b', score: 0,   weight: 1 },
    ]
    expect(computeOverallReadinessScore(dims)).toBe(50)
  })

  it('weights higher-weight dimensions more', () => {
    const hiWeight: ReadinessDimension[] = [
      { name: 'high', score: 90, weight: 3 },
      { name: 'low',  score: 10, weight: 1 },
    ]
    const evenWeight: ReadinessDimension[] = [
      { name: 'high', score: 90, weight: 1 },
      { name: 'low',  score: 10, weight: 1 },
    ]
    expect(computeOverallReadinessScore(hiWeight)).toBeGreaterThan(computeOverallReadinessScore(evenWeight))
  })

  it('computes GTB actual audit score in range 45-55', () => {
    const score = computeOverallReadinessScore(GTB_DIMENSIONS)
    expect(score).toBeGreaterThanOrEqual(45)
    expect(score).toBeLessThanOrEqual(55)
  })

  it('result is always between 0 and 100', () => {
    const cases: ReadinessDimension[][] = [
      [{ name: 'a', score: 0, weight: 1 }],
      [{ name: 'a', score: 100, weight: 1 }],
      GTB_DIMENSIONS,
    ]
    for (const dims of cases) {
      const s = computeOverallReadinessScore(dims)
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThanOrEqual(100)
    }
  })
})

describe('Launch Readiness — deriveReadinessLevel', () => {
  it('returns not_ready when criticalBlockers > 5', () => {
    expect(deriveReadinessLevel(80, 6)).toBe('not_ready')
    expect(deriveReadinessLevel(90, 10)).toBe('not_ready')
  })

  it('returns not_ready when score < 40 regardless of blockers', () => {
    expect(deriveReadinessLevel(30, 0)).toBe('not_ready')
    expect(deriveReadinessLevel(39, 0)).toBe('not_ready')
  })

  it('returns pilot_ready when there are blockers but score >= 40', () => {
    expect(deriveReadinessLevel(51, 10)).toBe('not_ready') // > 5 blockers
    expect(deriveReadinessLevel(51, 3)).toBe('pilot_ready')
  })

  it('returns pilot_ready when score 40-64 and 0 blockers', () => {
    expect(deriveReadinessLevel(50, 0)).toBe('pilot_ready')
    expect(deriveReadinessLevel(64, 0)).toBe('pilot_ready')
  })

  it('returns launch_ready only when score >= 65 AND 0 blockers', () => {
    expect(deriveReadinessLevel(65, 0)).toBe('launch_ready')
    expect(deriveReadinessLevel(100, 0)).toBe('launch_ready')
  })

  it('GTB current state (51, 10 blockers) is not_ready', () => {
    expect(deriveReadinessLevel(51, 10)).toBe('not_ready')
  })
})

describe('Launch Readiness — countWeakDimensions', () => {
  it('returns 0 when all dimensions pass', () => {
    const dims: ReadinessDimension[] = [
      { name: 'a', score: 60, weight: 1 },
      { name: 'b', score: 70, weight: 1 },
    ]
    expect(countWeakDimensions(dims)).toBe(0)
  })

  it('returns correct count for mixed dimensions', () => {
    const dims: ReadinessDimension[] = [
      { name: 'a', score: 30, weight: 1 },
      { name: 'b', score: 70, weight: 1 },
      { name: 'c', score: 40, weight: 1 },
    ]
    expect(countWeakDimensions(dims)).toBe(2)
  })

  it('GTB has 2 weak dimensions (business=38, launch=35)', () => {
    expect(countWeakDimensions(GTB_DIMENSIONS)).toBe(2)
  })

  it('uses custom threshold', () => {
    expect(countWeakDimensions(GTB_DIMENSIONS, 65)).toBe(3)
  })
})

describe('Launch Readiness — allCriticalDimensionsPass', () => {
  it('returns true when all critical dimensions meet threshold', () => {
    const dims: ReadinessDimension[] = [
      { name: 'technical', score: 80, weight: 1 },
      { name: 'security',  score: 70, weight: 1 },
    ]
    expect(allCriticalDimensionsPass(dims, ['technical', 'security'], 60)).toBe(true)
  })

  it('returns false when any critical dimension fails', () => {
    const dims: ReadinessDimension[] = [
      { name: 'technical', score: 80, weight: 1 },
      { name: 'security',  score: 50, weight: 1 },
    ]
    expect(allCriticalDimensionsPass(dims, ['technical', 'security'], 60)).toBe(false)
  })

  it('returns false when critical dimension not found', () => {
    const dims: ReadinessDimension[] = [
      { name: 'technical', score: 80, weight: 1 },
    ]
    expect(allCriticalDimensionsPass(dims, ['technical', 'business'], 60)).toBe(false)
  })

  it('GTB: technical+buyer pass at 60, business+launch do not', () => {
    expect(allCriticalDimensionsPass(GTB_DIMENSIONS, ['technical', 'buyer'], 60)).toBe(true)
    expect(allCriticalDimensionsPass(GTB_DIMENSIONS, ['business', 'launch'], 60)).toBe(false)
  })
})
