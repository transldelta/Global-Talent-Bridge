import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  computeScenarios,
  MONTHLY_OPEX_EUR,
  type ForecastScenario,
} from '@/lib/revenue/forecast'

/**
 * Revenue Intelligence Agent
 *
 * Analysiert revenue_plans, berechnet MRR/ARR-Forecasts für 3 Szenarien,
 * schätzt Break-even, erzeugt CEO-Suggestions und schreibt system_logs.
 *
 * ✅ Forecasts berechnen  ✅ Pläne analysieren  ✅ Empfehlungen erzeugen
 * ❌ Stripe  ❌ echte Zahlungen  ❌ Abbuchungen  ❌ E-Mails  ❌ externe APIs
 *
 * Alle Zahlen sind Simulationen / Schätzungen.
 */

export type { ForecastScenario }

type RevenuePlan = {
  id: string
  audience_type: string
  plan_name: string
  monthly_price: number
  yearly_price: number
  features: string[]
  active: boolean
}

export async function runRevenueIntelligenceAgent(): Promise<{
  plansAnalyzed: number
  scenariosComputed: number
  suggestionsCreated: number
  forecasts: ForecastScenario[]
}> {
  const supabase = createAdminClient()
  const agentName = 'revenue-intelligence-agent'

  let suggestionsCreated = 0

  // ── 1. Load revenue plans ────────────────────────────────────────────────────
  const { data: rawPlans, error: planErr } = await supabase
    .from('revenue_plans')
    .select('*')
    .eq('active', true)

  if (planErr) {
    await supabase.from('system_logs').insert({
      agent_name: agentName, status: 'error',
      message: `Revenue Agent: Fehler beim Laden der Pläne — ${planErr.message}`,
    })
    throw new Error(`Revenue Agent: ${planErr.message}`)
  }

  const plans = (rawPlans ?? []) as RevenuePlan[]

  // ── 2. Compute 3 forecast scenarios ──────────────────────────────────────────
  const scenarios = computeScenarios()

  // ── 3. Load 7-day dedup set ───────────────────────────────────────────────────
  const { data: existingSugg } = await supabase
    .from('agent_suggestions')
    .select('title')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  const existingTitles = new Set((existingSugg ?? []).map((s: { title: string }) => s.title))

  // ── 4. CEO Suggestions ───────────────────────────────────────────────────────

  // a) Highest-potential scenario (Szenario C)
  const topScenario = scenarios.at(-1)!
  const titleTop = `[Revenue] ${topScenario.label}: ARR ${topScenario.arr.toLocaleString('de-DE')} EUR (Forecast)`
  if (!existingTitles.has(titleTop)) {
    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name:  agentName,
      title:       titleTop,
      description: `Forecast-Simulation: Bei ${topScenario.employers} Arbeitgebern und ${topScenario.candidates} Kandidaten ergibt sich ein MRR von ${topScenario.mrr.toLocaleString('de-DE')} EUR und ein ARR von ${topScenario.arr.toLocaleString('de-DE')} EUR. Vermittlungsgebühren: ${topScenario.placementFeeAnnual.toLocaleString('de-DE')} EUR/Jahr. Break-even in ~${topScenario.breakEvenMonths} Monat(en). Empfehlung: Arbeitgeber-Akquisition priorisieren.`,
      priority: 'high',
      metadata: { scenario: topScenario.label, mrr: topScenario.mrr, arr: topScenario.arr, break_even_months: topScenario.breakEvenMonths, is_simulation: true },
    })
    if (!error) { suggestionsCreated++; existingTitles.add(titleTop) }
  }

  // b) Revenue plan completeness
  const employerPlans  = plans.filter(p => p.audience_type === 'employer')
  const candidatePlans = plans.filter(p => p.audience_type === 'candidate')
  const partnerPlans   = plans.filter(p => p.audience_type === 'partner')
  const titlePlans = `[Revenue] ${plans.length} aktive Pläne — Employer:${employerPlans.length} Kandidat:${candidatePlans.length} Partner:${partnerPlans.length}`
  if (!existingTitles.has(titlePlans)) {
    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name:  agentName,
      title:       titlePlans,
      description: `Revenue-Architektur vollständig: ${plans.length} aktive Pläne. Employer-Pläne: ${employerPlans.map(p => p.plan_name).join(', ')}. Kandidaten-Pläne: ${candidatePlans.map(p => p.plan_name).join(', ')}. Partner-Pläne: ${partnerPlans.map(p => p.plan_name).join(', ')}. Empfehlung: Preise nach ersten Piloten validieren.`,
      priority: 'medium',
      metadata: { total_plans: plans.length, employer_plans: employerPlans.length, candidate_plans: candidatePlans.length, partner_plans: partnerPlans.length, is_simulation: true },
    })
    if (!error) { suggestionsCreated++; existingTitles.add(titlePlans) }
  }

  // c) Break-even alert for earliest scenario
  const earlyScenario = scenarios[0]
  const titleBE = `[Revenue] Break-even Szenario A in ~${earlyScenario.breakEvenMonths} Monat(en) — MRR ${earlyScenario.mrr} EUR`
  if (!existingTitles.has(titleBE)) {
    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name:  agentName,
      title:       titleBE,
      description: `Szenario A (${earlyScenario.employers} Employer, ${earlyScenario.candidates} Kandidaten): Break-even bereits nach ${earlyScenario.breakEvenMonths} Monat(en) bei MRR von ${earlyScenario.mrr} EUR und operativen Kosten von ~${MONTHLY_OPEX_EUR} EUR/Monat. Empfehlung: 10 zahlende Pilotarbeitgeber als erstes Meilenstein-Ziel setzen.`,
      priority: earlyScenario.breakEvenMonths <= 3 ? 'high' : 'medium',
      metadata: { scenario: earlyScenario.label, break_even_months: earlyScenario.breakEvenMonths, monthly_opex: MONTHLY_OPEX_EUR, is_simulation: true },
    })
    if (!error) { suggestionsCreated++; existingTitles.add(titleBE) }
  }

  // ── 5. Write daily forecast events (once per day) ─────────────────────────────
  const { data: todayForecasts } = await supabase
    .from('revenue_events')
    .select('id')
    .eq('event_type', 'forecast')
    .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
    .limit(1)

  if (!todayForecasts || todayForecasts.length === 0) {
    for (const s of scenarios) {
      await supabase.from('revenue_events').insert({
        event_type: 'forecast',
        amount:     s.mrr,
        currency:   'EUR',
        source:     s.label,
        notes:      `[SIMULATION] MRR ${s.mrr} EUR | ARR ${s.arr} EUR | Break-even ${s.breakEvenMonths} Monate | ${s.employers} Employer, ${s.candidates} Kandidaten`,
      })
    }
  }

  // ── 6. System log ─────────────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    agent_name: agentName,
    status:     'success',
    message:    `Revenue Agent: ${plans.length} Pläne analysiert, 3 Szenarien berechnet (MRR A:${scenarios[0].mrr}€ B:${scenarios[1].mrr}€ C:${scenarios[2].mrr}€), ${suggestionsCreated} Vorschläge. Alle Zahlen sind Simulationen.`,
  })

  return {
    plansAnalyzed:     plans.length,
    scenariosComputed: scenarios.length,
    suggestionsCreated,
    forecasts:         scenarios,
  }
}
