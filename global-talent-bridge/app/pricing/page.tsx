import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { logoutAction } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'

type PricingPlan = {
  plan_key: string
  name: string | null
  description: string | null
  monthly_price_eur: number
  yearly_price_eur: number
  features: string[]
  active: boolean
}

const PLAN_ORDER = ['free_employer', 'starter_employer', 'growth_employer', 'enterprise_employer']

const PLAN_STYLE: Record<string, { border: string; badge: string; highlight: boolean }> = {
  free_employer: {
    border: 'border-gray-700',
    badge: 'bg-gray-800 text-gray-400',
    highlight: false,
  },
  starter_employer: {
    border: 'border-blue-700/50',
    badge: 'bg-blue-900/40 text-blue-300',
    highlight: false,
  },
  growth_employer: {
    border: 'border-purple-700/50',
    badge: 'bg-purple-900/40 text-purple-300',
    highlight: true,
  },
  enterprise_employer: {
    border: 'border-amber-700/50',
    badge: 'bg-amber-900/40 text-amber-300',
    highlight: false,
  },
}

export default async function PricingPage() {
  // Pricing-Daten via Admin-Client (public Seite — kein User-Auth nötig)
  const adminSupabase = createAdminClient()
  const { data: plansRaw } = await adminSupabase
    .from('pricing_plans')
    .select('plan_key, name, description, monthly_price_eur, yearly_price_eur, features, active')
    .order('monthly_price_eur', { ascending: true })

  // User für NavBar (optional — kann null sein wenn nicht eingeloggt)
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const plans: PricingPlan[] = (plansRaw ?? [])
    .map((p) => ({
      ...p,
      features: Array.isArray(p.features) ? (p.features as string[]) : [],
    }))
    .sort(
      (a, b) =>
        PLAN_ORDER.indexOf(a.plan_key) - PLAN_ORDER.indexOf(b.plan_key)
    )

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white font-semibold hover:text-gray-200 transition-colors">
              Global Talent Bridge
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/candidate/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  Registrieren
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Transparente Preise für Arbeitgeber
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Finde das passende Paket für dein Unternehmen. Starte kostenlos und wechsle
            jederzeit.
          </p>

          {/* MVP-Hinweis */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-700/50 rounded-full">
            <span className="text-yellow-400 text-sm">⚠️</span>
            <span className="text-yellow-300 text-sm font-medium">
              Zahlungen sind in dieser MVP-Version noch nicht aktiviert.
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => {
            const style = PLAN_STYLE[plan.plan_key] ?? PLAN_STYLE.free_employer
            return (
              <div
                key={plan.plan_key}
                className={`relative bg-gray-900 rounded-2xl border p-6 flex flex-col ${style.border} ${
                  style.highlight ? 'ring-2 ring-purple-600/50' : ''
                }`}
              >
                {style.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs px-3 py-1 bg-purple-600 text-white rounded-full font-medium">
                      Empfohlen
                    </span>
                  </div>
                )}

                {/* Plan-Name + Badge */}
                <div className="mb-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                    {plan.plan_key.includes('free')
                      ? 'Free'
                      : plan.plan_key.includes('starter')
                      ? 'Starter'
                      : plan.plan_key.includes('growth')
                      ? 'Growth'
                      : 'Enterprise'}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-2">{plan.name}</h2>
                  {plan.description && (
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Preis */}
                <div className="mb-5">
                  {plan.monthly_price_eur === 0 ? (
                    <div>
                      <span className="text-3xl font-bold text-white">Kostenlos</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-white">
                        {plan.monthly_price_eur} €
                      </span>
                      <span className="text-gray-400 text-sm"> / Monat</span>
                      {plan.yearly_price_eur > 0 && (
                        <p className="text-gray-500 text-xs mt-0.5">
                          {plan.yearly_price_eur} € / Jahr (2 Monate gratis)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-6">
                  <Link
                    href="/auth/register?role=employer"
                    className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      style.highlight
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : plan.monthly_price_eur === 0
                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    Als Arbeitgeber registrieren
                  </Link>
                  <p className="text-center text-xs text-gray-600 mt-2">
                    Zahlung noch nicht aktiv
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ / Hinweis */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <h3 className="text-white font-semibold mb-2">🚀 MVP-Phase</h3>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Global Talent Bridge befindet sich in der MVP-Phase. Alle Funktionen sind bereits
            nutzbar. Zahlungen und Premium-Pakete werden in einer späteren Phase aktiviert.
            Jetzt kostenlos starten und erste Kandidaten finden.
          </p>
        </div>
      </div>
    </div>
  )
}
