/**
 * Global Market Intelligence — pure scoring functions.
 * No server-only. No Supabase. Safe to import in tests.
 *
 * Opportunity Score Formula:
 *   supply × 0.4 + demand × 0.6
 *   Clamped to [0, 100].
 *
 * Priority levels: ≥85→critical | ≥70→high | ≥50→medium | <50→low
 */

export function computeGMIOpportunityScore(
  supply: number,
  demand: number,
): number {
  return Math.min(Math.round(supply * 0.4 + demand * 0.6), 100)
}

export function deriveGMIPriorityLevel(
  score: number,
): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}
