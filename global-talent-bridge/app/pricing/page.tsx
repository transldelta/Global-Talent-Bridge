import Link from 'next/link'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Pricing — CorridorWork',
  description:
    'Transparent pricing for employers on CorridorWork. Start free and upgrade when ready. Payment not yet active in the current MVP phase.',
}

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

// English display overrides — DB values may be in German; always show English on public site
const PLAN_DISPLAY: Record<string, { name: string; description: string }> = {
  free_employer: {
    name:        'Free',
    description: 'Discover international talent with no commitment. No subscription, no payment required.',
  },
  starter_employer: {
    name:        'Starter',
    description: 'For growing organisations building their international talent pipeline.',
  },
  growth_employer: {
    name:        'Growth',
    description: 'For organisations with regular international hiring needs.',
  },
  enterprise_employer: {
    name:        'Enterprise',
    description: 'Custom terms for large organisations. Commercial pricing available on request.',
  },
}

const PLAN_STYLE: Record<string, { border: string; badge: string; highlight: boolean }> = {
  free_employer: {
    border: 'border-slate-700',
    badge: 'bg-slate-800 text-slate-400',
    highlight: false,
  },
  starter_employer: {
    border: 'border-indigo-700/50',
    badge: 'bg-indigo-900/40 text-indigo-300',
    highlight: false,
  },
  growth_employer: {
    border: 'border-indigo-600/60',
    badge: 'bg-indigo-900/50 text-indigo-200',
    highlight: true,
  },
  enterprise_employer: {
    border: 'border-amber-700/50',
    badge: 'bg-amber-900/40 text-amber-300',
    highlight: false,
  },
}

export default async function PricingPage() {
  const adminSupabase = createAdminClient()
  const { data: plansRaw } = await adminSupabase
    .from('pricing_plans')
    .select('plan_key, name, description, monthly_price_eur, yearly_price_eur, features, active')
    .order('monthly_price_eur', { ascending: true })

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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10 flex-1">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-indigo-400 text-xs font-bold tracking-[0.18em] uppercase mb-3">
            Pricing
          </p>
          <h1 className="text-4xl font-bold text-white">
            Transparent pricing for employers
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Find the right plan for your organisation. Start free and upgrade when ready.
          </p>

          {/* MVP notice */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-amber-300 text-sm font-medium">
              Payment processing is not yet active in the current pilot phase.
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
                className={`relative bg-slate-900 rounded-2xl border p-6 flex flex-col ${style.border} ${
                  style.highlight ? 'ring-2 ring-indigo-600/50' : ''
                }`}
              >
                {style.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-full font-medium">
                      Recommended
                    </span>
                  </div>
                )}

                {/* Plan name + badge */}
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
                  <h2 className="text-lg font-bold text-white mt-2">
                    {PLAN_DISPLAY[plan.plan_key]?.name ?? plan.name}
                  </h2>
                  {(PLAN_DISPLAY[plan.plan_key]?.description ?? plan.description) && (
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {PLAN_DISPLAY[plan.plan_key]?.description ?? plan.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-5">
                  {plan.monthly_price_eur === 0 ? (
                    <div>
                      <span className="text-3xl font-bold text-white">Free</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-white">
                        €{plan.monthly_price_eur}
                      </span>
                      <span className="text-slate-400 text-sm"> / month</span>
                      {plan.yearly_price_eur > 0 && (
                        <p className="text-slate-500 text-xs mt-0.5">
                          €{plan.yearly_price_eur} / year (2 months free)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <div className="w-1 h-4 bg-emerald-500/60 rounded-full shrink-0 mt-0.5" />
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
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : plan.monthly_price_eur === 0
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-indigo-700 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    Register as employer
                  </Link>
                  <p className="text-center text-xs text-slate-600 mt-2">
                    Payment not yet active
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* MVP note */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <h3 className="text-white font-semibold mb-2">Pilot phase</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            CorridorWork is in the MVP pilot phase. All features are available to use now.
            Payments and premium plans will be activated in a later phase. Start free today.
          </p>
        </div>

        {/* Pilot CTA */}
        <div className="bg-slate-900 border border-indigo-800/40 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Pilot employers wanted</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Want to be one of the first employers to test the platform and provide feedback?
            Get in touch directly — no sales pressure, no automated emails.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?role=employer&interest=pilot_employer"
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
            >
              Request pilot access
            </Link>
            <Link
              href="/auth/register?role=employer"
              className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Register directly
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            No payment required · No automated emails · Pilot phase
          </p>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
