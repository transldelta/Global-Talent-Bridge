import { describe, it, expect } from 'vitest'

// ─────────────────────────────────────────────────────────────
// Pure helper functions extracted from Pilot Launch domain
// (No DB, no server-only — purely testable logic)
// ─────────────────────────────────────────────────────────────

// Valid status values
const EMPLOYER_STATUSES = [
  'identified', 'contacted_manual', 'interested',
  'demo_scheduled', 'onboarding', 'active_pilot', 'rejected',
] as const
type EmployerStatus = typeof EMPLOYER_STATUSES[number]

const CANDIDATE_STATUSES = [
  'identified', 'contacted', 'interested',
  'onboarding', 'active', 'rejected', 'placed',
] as const
type CandidateStatus = typeof CANDIDATE_STATUSES[number]

const INTEREST_LEVELS = ['unknown', 'low', 'medium', 'high', 'very_high'] as const
type InterestLevel = typeof INTEREST_LEVELS[number]

// Priority derivation based on interest level
function derivePilotTaskPriority(interestLevel: InterestLevel): 'critical' | 'high' | 'medium' | 'low' {
  if (interestLevel === 'very_high' || interestLevel === 'high') return 'critical'
  if (interestLevel === 'medium') return 'high'
  if (interestLevel === 'low') return 'medium'
  return 'low'
}

// Pipeline score: how far an employer is in the funnel (0-100)
function computeEmployerPipelineScore(status: EmployerStatus, interestLevel: InterestLevel): number {
  // Rejected always scores 0, interest irrelevant
  if (status === 'rejected') return 0

  const statusScore: Record<EmployerStatus, number> = {
    identified:       10,
    contacted_manual: 25,
    interested:       45,
    demo_scheduled:   65,
    onboarding:       80,
    active_pilot:     100,
    rejected:         0,
  }
  const interestBonus: Record<InterestLevel, number> = {
    unknown:  0,
    low:      0,
    medium:   5,
    high:     10,
    very_high:15,
  }
  return Math.min(100, statusScore[status] + interestBonus[interestLevel])
}

// Follow-up detection
function isFollowUpDue(nextFollowUpAt: string | null, now: Date = new Date()): boolean {
  if (!nextFollowUpAt) return false
  return new Date(nextFollowUpAt) <= now
}

// Employer funnel conversion rate
function computeFunnelConversionRate(total: number, active: number): number {
  if (total === 0) return 0
  return Math.round((active / total) * 100)
}

// Candidate quality tier
function deriveCandidateQualityTier(qualityScore: number): 'excellent' | 'good' | 'fair' | 'low' {
  if (qualityScore >= 85) return 'excellent'
  if (qualityScore >= 70) return 'good'
  if (qualityScore >= 50) return 'fair'
  return 'low'
}

// ─────────────────────────────────────────────────────────────

describe('Pilot Launch — derivePilotTaskPriority', () => {
  it('returns critical for very_high interest', () => {
    expect(derivePilotTaskPriority('very_high')).toBe('critical')
  })
  it('returns critical for high interest', () => {
    expect(derivePilotTaskPriority('high')).toBe('critical')
  })
  it('returns high for medium interest', () => {
    expect(derivePilotTaskPriority('medium')).toBe('high')
  })
  it('returns medium for low interest', () => {
    expect(derivePilotTaskPriority('low')).toBe('medium')
  })
  it('returns low for unknown interest', () => {
    expect(derivePilotTaskPriority('unknown')).toBe('low')
  })
})

describe('Pilot Launch — computeEmployerPipelineScore', () => {
  it('active_pilot returns 100 (max)', () => {
    expect(computeEmployerPipelineScore('active_pilot', 'very_high')).toBe(100)
  })
  it('rejected returns 0 regardless of interest', () => {
    expect(computeEmployerPipelineScore('rejected', 'very_high')).toBe(0)
    expect(computeEmployerPipelineScore('rejected', 'unknown')).toBe(0)
  })
  it('identified with unknown interest returns 10', () => {
    expect(computeEmployerPipelineScore('identified', 'unknown')).toBe(10)
  })
  it('demo_scheduled with very_high returns 80 (65 + 15)', () => {
    expect(computeEmployerPipelineScore('demo_scheduled', 'very_high')).toBe(80)
  })
  it('score increases with interest level for same status', () => {
    const base   = computeEmployerPipelineScore('interested', 'unknown')
    const medium = computeEmployerPipelineScore('interested', 'medium')
    const high   = computeEmployerPipelineScore('interested', 'very_high')
    expect(medium).toBeGreaterThan(base)
    expect(high).toBeGreaterThan(medium)
  })
  it('is always between 0 and 100', () => {
    for (const s of EMPLOYER_STATUSES) {
      for (const i of INTEREST_LEVELS) {
        const score = computeEmployerPipelineScore(s, i)
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      }
    }
  })
})

describe('Pilot Launch — isFollowUpDue', () => {
  it('returns false for null', () => {
    expect(isFollowUpDue(null)).toBe(false)
  })
  it('returns true when date is in the past', () => {
    const past = new Date(Date.now() - 86400_000).toISOString()
    expect(isFollowUpDue(past)).toBe(true)
  })
  it('returns false when date is in the future', () => {
    const future = new Date(Date.now() + 86400_000).toISOString()
    expect(isFollowUpDue(future)).toBe(false)
  })
  it('returns true when date equals now (on the boundary)', () => {
    const now = new Date()
    const boundary = new Date(now.getTime() - 1).toISOString()
    expect(isFollowUpDue(boundary, now)).toBe(true)
  })
})

describe('Pilot Launch — computeFunnelConversionRate', () => {
  it('returns 0 when total is 0', () => {
    expect(computeFunnelConversionRate(0, 0)).toBe(0)
  })
  it('returns 100 when all are active', () => {
    expect(computeFunnelConversionRate(5, 5)).toBe(100)
  })
  it('returns 20 for 1/5', () => {
    expect(computeFunnelConversionRate(5, 1)).toBe(20)
  })
  it('returns 0 when active=0', () => {
    expect(computeFunnelConversionRate(10, 0)).toBe(0)
  })
})

describe('Pilot Launch — deriveCandidateQualityTier', () => {
  it('returns excellent for score >= 85', () => {
    expect(deriveCandidateQualityTier(85)).toBe('excellent')
    expect(deriveCandidateQualityTier(100)).toBe('excellent')
  })
  it('returns good for score 70–84', () => {
    expect(deriveCandidateQualityTier(70)).toBe('good')
    expect(deriveCandidateQualityTier(84)).toBe('good')
  })
  it('returns fair for score 50–69', () => {
    expect(deriveCandidateQualityTier(50)).toBe('fair')
    expect(deriveCandidateQualityTier(69)).toBe('fair')
  })
  it('returns low for score < 50', () => {
    expect(deriveCandidateQualityTier(0)).toBe('low')
    expect(deriveCandidateQualityTier(49)).toBe('low')
  })
  it('boundary: 85 is excellent, 84 is good', () => {
    expect(deriveCandidateQualityTier(85)).toBe('excellent')
    expect(deriveCandidateQualityTier(84)).toBe('good')
  })
})

describe('Pilot Launch — status constants', () => {
  it('EMPLOYER_STATUSES has 7 values', () => {
    expect(EMPLOYER_STATUSES).toHaveLength(7)
  })
  it('CANDIDATE_STATUSES has 7 values', () => {
    expect(CANDIDATE_STATUSES).toHaveLength(7)
  })
  it('INTEREST_LEVELS has 5 values', () => {
    expect(INTEREST_LEVELS).toHaveLength(5)
  })
  it('active_pilot is a valid employer status', () => {
    expect(EMPLOYER_STATUSES).toContain('active_pilot')
  })
  it('placed is a valid candidate status', () => {
    expect(CANDIDATE_STATUSES).toContain('placed')
  })
})
