/**
 * Global Candidate Acquisition — pure scoring functions.
 * No server-only. No Supabase. Safe to import in tests.
 *
 * Opportunity Score Formula:
 *   quality × 0.4 + reachScore × 0.3 + ease × 0.3
 *   where reachScore = log10(audience) / log10(10M) × 100, clamped to [0,100]
 *   and   ease       = 100 − difficulty
 *   Final result clamped to [0, 100].
 *
 * Priority levels: ≥85→critical | ≥70→high | ≥50→medium | <50→low
 */

const MAX_AUDIENCE = 10_000_000

export function computeCAOpportunityScore(
  quality: number,
  estimatedAudience: number,
  difficulty: number,
): number {
  const reachScore = Math.min(100, Math.round(
    (Math.log10(Math.max(1, estimatedAudience)) / Math.log10(MAX_AUDIENCE)) * 100,
  ))
  const ease = 100 - difficulty
  return Math.min(100, Math.round(quality * 0.4 + reachScore * 0.3 + ease * 0.3))
}

export function deriveCAPriority(
  score: number,
): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}
