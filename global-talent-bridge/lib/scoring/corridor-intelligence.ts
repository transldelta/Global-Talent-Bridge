/**
 * Corridor Intelligence — pure scoring functions.
 * No server-only. No Supabase. Safe to import in tests.
 *
 * Opportunity Score Formula:
 *   corridor_demand × 0.4 + corridor_supply × 0.2 + ci_demand × 0.4
 *   Clamped to [0, 100].
 *
 * Priority levels: ≥85→critical | ≥70→high | ≥50→medium | <50→low
 */

export function computeCIOpportunityScore(
  corridorDemand: number,
  corridorSupply: number,
  ciDemand: number,
): number {
  return Math.min(100, Math.round(
    corridorDemand * 0.4 + corridorSupply * 0.2 + ciDemand * 0.4,
  ))
}

export function deriveCIPriority(
  score: number,
): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}
