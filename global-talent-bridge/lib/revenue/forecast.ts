/**
 * Revenue Forecast Engine — shared constants and computation logic.
 *
 * ⚠️  All numbers are SIMULATIONS / ESTIMATES.
 *     No real payments. No Stripe. No real billing.
 */

// ─── Assumptions ──────────────────────────────────────────────────────────────

/** Estimated monthly operating expenses (hosting, tooling, labour) */
export const MONTHLY_OPEX_EUR = 3_000

/** Weighted average employer MRR: 70% Starter(149) + 25% Pro(399) + 5% Enterprise(999) */
export const AVG_EMPLOYER_MRR = Math.round(0.70 * 149 + 0.25 * 399 + 0.05 * 999) // ≈ 254

/** Share of candidates who convert to Premium */
export const CANDIDATE_PREMIUM_RATE = 0.15

/** Monthly price for Candidate Premium plan */
export const CANDIDATE_PREMIUM_PRICE = 29

/** One-time placement fee per successful hire */
export const PLACEMENT_FEE = 500

/** Annual rate of candidates leading to a successful placement */
export const ANNUAL_PLACEMENT_RATE = 0.05

// ─── Forecast type ────────────────────────────────────────────────────────────

export type ForecastScenario = {
  label: string
  employers: number
  candidates: number
  mrr: number
  arr: number
  placementFeeAnnual: number
  totalAnnualRevenue: number
  breakEvenMonths: number
}

// ─── Computation ──────────────────────────────────────────────────────────────

export function computeScenario(
  label: string,
  employers: number,
  candidates: number,
): ForecastScenario {
  const employerMRR   = Math.round(employers * AVG_EMPLOYER_MRR)
  const premiumCount  = Math.round(candidates * CANDIDATE_PREMIUM_RATE)
  const candidateMRR  = premiumCount * CANDIDATE_PREMIUM_PRICE
  const mrr           = employerMRR + candidateMRR
  const arr           = mrr * 12
  const placements    = Math.round(candidates * ANNUAL_PLACEMENT_RATE)
  const placementFeeAnnual   = placements * PLACEMENT_FEE
  const totalAnnualRevenue   = arr + placementFeeAnnual
  const breakEvenMonths      = mrr > 0 ? Math.ceil(MONTHLY_OPEX_EUR / mrr) : 999

  return {
    label,
    employers,
    candidates,
    mrr,
    arr,
    placementFeeAnnual,
    totalAnnualRevenue,
    breakEvenMonths,
  }
}

/** Returns the 3 standard forecast scenarios A / B / C. */
export function computeScenarios(): ForecastScenario[] {
  return [
    computeScenario('Szenario A — Early Stage',  10,   100),
    computeScenario('Szenario B — Growth Phase', 50,   500),
    computeScenario('Szenario C — Scale Phase',  100, 1000),
  ]
}
