import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { NavBar } from '@/app/_components/NavBar'
import { RunRevenueAgentButton } from './_components/RunRevenueAgentButton'
import {
  computeScenarios,
  MONTHLY_OPEX_EUR,
} from '@/lib/revenue/forecast'

export const dynamic = 'force-dynamic'

type RevenuePlan = {
  id: string
  audience_type: string
  plan_name: string
  monthly_price: number
  yearly_price: number
  features: string[]
  active: boolean
}

type RevenueEvent = {
  id: string
  event_type: string
  amount: number
  currency: string
  source: string | null
  notes: string | null
  created_at: string
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  subscription:         '📦 Abo',
  placement_fee:        '🤝 Vermittlung',
  premium_upgrade:      '⭐ Premium-Upgrade',
  referral_commission:  '🔗 Provision',
  forecast:             '🔮 Forecast',
}

const AUDIENCE_LABELS: Record<string, string> = {
  employer:  '🏢 Arbeitgeber',
  candidate: '👤 Kandidat',
  partner:   '🤝 Partner',
}

const AUDIENCE_COLORS: Record<string, string> = {
  employer:  'bg-blue-900/30 border-blue-800/40 text-blue-300',
  candidate: 'bg-violet-900/30 border-violet-800/40 text-violet-300',
  partner:   'bg-amber-900/30 border-amber-800/40 text-amber-300',
}

function formatEUR(value: number) {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

export default async function RevenuePage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const supabase = createAdminClient()

  const [plansResult, eventsResult] = await Promise.all([
    supabase.from('revenue_plans').select('*').order('audience_type').order('monthly_price'),
    supabase.from('revenue_events').select('*').order('created_at', { ascending: false }).limit(20),
  ])

  const plans  = (plansResult.data  ?? []) as RevenuePlan[]
  const events = (eventsResult.data ?? []) as RevenueEvent[]

  const scenarios = computeScenarios()

  const employerPlans  = plans.filter(p => p.audience_type === 'employer')
  const candidatePlans = plans.filter(p => p.audience_type === 'candidate')
  const partnerPlans   = plans.filter(p => p.audience_type === 'partner')

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Revenue Intelligence" badgeColor="green" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">💰 Revenue Intelligence</h1>
            <p className="text-gray-400 text-sm mt-1">
              Forecast-Simulationen · Revenue-Architektur · Keine echten Zahlungen · Kein Stripe
            </p>
          </div>
          <RunRevenueAgentButton />
        </div>

        {/* Simulation Warning */}
        <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-4 flex items-start gap-3">
          <span className="text-yellow-400 text-lg shrink-0">🔮</span>
          <div>
            <p className="text-yellow-300 text-sm font-semibold">Simulation — Keine echten Umsatzdaten</p>
            <p className="text-yellow-200/60 text-xs mt-0.5 leading-relaxed">
              Alle Forecasts und Kennzahlen auf dieser Seite sind Schätzungen und Simulationen.
              Keine Stripe-Integration. Keine echten Abbuchungen. Keine Zahlungsverarbeitung aktiv.
              Zahlen dienen der internen Planung und Investor-Kommunikation.
            </p>
          </div>
        </div>

        {/* ── Forecast Scenarios ─────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">🔮 Forecast-Szenarien</h2>
          <p className="text-gray-500 text-xs mb-5">
            Basierend auf: Ø {formatEUR(scenarios[0].mrr / scenarios[0].employers)} MRR/Arbeitgeber ·
            15% Kandidaten-Conversion auf Premium · {formatEUR(500)} Vermittlungsgebühr ·
            5% Vermittlungsrate · OpEx ~{formatEUR(MONTHLY_OPEX_EUR)}/Monat
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {scenarios.map((s, i) => (
              <div
                key={s.label}
                className={`rounded-2xl border p-5 ${
                  i === 0 ? 'bg-gray-900 border-gray-700' :
                  i === 1 ? 'bg-blue-950/30 border-blue-800/40' :
                  'bg-emerald-950/30 border-emerald-800/40'
                }`}
              >
                <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                  i === 0 ? 'text-gray-400' : i === 1 ? 'text-blue-400' : 'text-emerald-400'
                }`}>
                  {s.label}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Arbeitgeber</span>
                    <span className="text-sm font-bold text-white">{s.employers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Kandidaten</span>
                    <span className="text-sm font-bold text-white">{s.candidates}</span>
                  </div>
                  <div className="border-t border-gray-700/50 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">MRR</span>
                    <span className={`text-lg font-bold ${i === 0 ? 'text-white' : i === 1 ? 'text-blue-300' : 'text-emerald-300'}`}>
                      {formatEUR(s.mrr)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">ARR</span>
                    <span className="text-sm font-semibold text-gray-200">{formatEUR(s.arr)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Vermittlungsgebühren/Jahr</span>
                    <span className="text-sm font-semibold text-gray-200">{formatEUR(s.placementFeeAnnual)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-700/50 pt-2">
                    <span className="text-xs text-gray-400 font-medium">Jahresumsatz gesamt</span>
                    <span className={`text-sm font-bold ${i === 0 ? 'text-white' : i === 1 ? 'text-blue-200' : 'text-emerald-200'}`}>
                      {formatEUR(s.totalAnnualRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Break-even</span>
                    <span className={`text-sm font-semibold ${s.breakEvenMonths <= 3 ? 'text-green-400' : s.breakEvenMonths <= 6 ? 'text-yellow-400' : 'text-orange-400'}`}>
                      ~{s.breakEvenMonths} Monat{s.breakEvenMonths !== 1 ? 'e' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Revenue Plans ─────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-white mb-5">📦 Revenue Pläne</h2>

          {([
            { key: 'employer',  label: '🏢 Arbeitgeber-Pläne',  rows: employerPlans  },
            { key: 'candidate', label: '👤 Kandidaten-Pläne',   rows: candidatePlans },
            { key: 'partner',   label: '🤝 Partner-Pläne',      rows: partnerPlans   },
          ] as const).map(({ key, label, rows }) => (
            <div key={key} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {label} · {rows.length}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rows.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-xl border p-4 ${AUDIENCE_COLORS[plan.audience_type] ?? 'bg-gray-900 border-gray-800 text-gray-300'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{plan.plan_name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${plan.active ? 'bg-green-900/40 text-green-300' : 'bg-gray-800 text-gray-500'}`}>
                        {plan.active ? 'aktiv' : 'inaktiv'}
                      </span>
                    </div>

                    <div className="mb-3">
                      {plan.monthly_price > 0 ? (
                        <>
                          <div className="text-xl font-bold text-white">
                            {formatEUR(plan.monthly_price)}
                            <span className="text-xs font-normal text-gray-400">/Monat</span>
                          </div>
                          {plan.yearly_price > 0 && (
                            <div className="text-xs text-gray-400">
                              oder {formatEUR(plan.yearly_price)}/Jahr
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-lg font-bold text-gray-300">Kostenlos</div>
                      )}
                    </div>

                    <ul className="space-y-1">
                      {(plan.features as string[]).map((feature, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-300">
                          <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Revenue Events ─────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">📋 Revenue Events</h2>
          <p className="text-gray-500 text-xs mb-4">
            Letzte 20 Einträge · Nur Forecasts und Simulationen
          </p>

          {events.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
              Noch keine Revenue Events. Agent starten, um Forecast-Events zu generieren.
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-3 px-4 py-2 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                <div className="col-span-2">Typ</div>
                <div className="col-span-2 text-right">Betrag</div>
                <div className="col-span-1 text-center">Währung</div>
                <div className="col-span-2">Quelle</div>
                <div className="col-span-4">Notiz</div>
                <div className="col-span-1 text-right">Datum</div>
              </div>
              <div className="divide-y divide-gray-800">
                {events.map((ev) => (
                  <div key={ev.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                    <div className="col-span-2">
                      <span className="text-xs text-gray-300">{EVENT_TYPE_LABELS[ev.event_type] ?? ev.event_type}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-mono font-semibold text-emerald-300">
                        {formatEUR(ev.amount)}
                      </span>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-xs text-gray-500">{ev.currency}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-gray-400 font-mono">{ev.source ?? '—'}</span>
                    </div>
                    <div className="col-span-4">
                      <span className="text-xs text-gray-500 truncate block">{ev.notes ?? '—'}</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <span className="text-xs text-gray-600">
                        {new Date(ev.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Revenue Assumptions ─────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">📐 Forecast-Annahmen</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-gray-400">
            {[
              { label: 'Ø MRR/Arbeitgeber', value: '~254 EUR (70% Starter, 25% Pro, 5% Enterprise)' },
              { label: 'Kandidaten-Conversion', value: '15% → Premium (29 EUR/Monat)' },
              { label: 'Vermittlungsgebühr', value: '500 EUR pro erfolgreicher Vermittlung' },
              { label: 'Vermittlungsrate', value: '5% der Kandidaten/Jahr' },
              { label: 'Monatliche OpEx (Schätzung)', value: `~${formatEUR(MONTHLY_OPEX_EUR)}/Monat` },
              { label: 'Wichtig', value: 'Alle Zahlen sind Simulationen ohne Gewähr' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-medium text-gray-300">{label}</p>
                <p className="text-gray-500 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audience legend */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {Object.entries(AUDIENCE_LABELS).map(([key, label]) => (
            <span key={key} className={`px-2 py-0.5 rounded-full border ${AUDIENCE_COLORS[key]}`}>{label}</span>
          ))}
        </div>

      </div>
    </div>
  )
}
