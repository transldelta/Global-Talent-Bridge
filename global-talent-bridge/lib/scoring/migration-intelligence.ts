/**
 * Migration Intelligence — pure scoring functions.
 * No server-only. No Supabase. Safe to import in tests.
 *
 * Formula:
 *   estimated_success_score =
 *     100
 *     − visa_complexity         × 0.25
 *     − recognition_complexity  × 0.25
 *     − language_complexity     × 0.20
 *     − document_complexity     × 0.15
 *     + opportunity_score       × 0.15
 *   Clamped to [0, 100].
 *
 * Risk levels: ≥80→low | ≥60→medium | ≥40→high | <40→critical
 */

export function computeMISuccessScore(
  visaComplexity: number,
  recognitionComplexity: number,
  languageComplexity: number,
  documentComplexity: number,
  opportunityScore: number,
): number {
  const raw =
    100
    - visaComplexity        * 0.25
    - recognitionComplexity * 0.25
    - languageComplexity    * 0.20
    - documentComplexity    * 0.15
    + opportunityScore      * 0.15
  return Math.min(100, Math.max(0, Math.round(raw)))
}

export function deriveMIRiskLevel(
  successScore: number,
): 'low' | 'medium' | 'high' | 'critical' {
  if (successScore >= 80) return 'low'
  if (successScore >= 60) return 'medium'
  if (successScore >= 40) return 'high'
  return 'critical'
}
