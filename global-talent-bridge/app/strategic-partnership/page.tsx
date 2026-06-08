/**
 * app/strategic-partnership/page.tsx — /strategic-partnership
 * Professional strategic partnership page — server component wrapper.
 * White-label · Licensing · Acquisition interest · No automatic outreach
 */
import type { Metadata } from 'next'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import Link from 'next/link'
import { StrategicPartnershipForm } from './StrategicPartnershipForm'

export const metadata: Metadata = {
  title: 'Strategic Partnership — CorridorWork',
  description:
    'Explore a strategic partnership with CorridorWork: white-label integration, licensing, acquisition discussions or market intelligence. No automatic outreach — confidential and manually reviewed.',
  openGraph: {
    title: 'Strategic Partnership — CorridorWork',
    description:
      'White-label, licensing, acquisition or market intelligence partnership with the CorridorWork global talent corridor platform.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
  },
}

const ENGAGEMENT_OPTIONS = [
  {
    title: 'Strategic partnership',
    desc: 'Joint market coverage, revenue sharing or operational collaboration.',
  },
  {
    title: 'White-label solution',
    desc: 'Use the CorridorWork platform under your own branding.',
  },
  {
    title: 'Licensing / API access',
    desc: 'Technology licence or API integration into your own systems.',
  },
  {
    title: 'Acquisition / investment',
    desc: 'Serious interest in acquisition, merger or strategic stake.',
  },
  {
    title: 'Market intelligence',
    desc: 'Aggregated corridor and demand data for strategic analysis.',
  },
]

const PLATFORM_FACTS = [
  { label: 'Live domain',       value: 'corridorwork.com' },
  { label: 'Tech stack',        value: 'Next.js 14, Supabase, Vercel, TypeScript' },
  { label: 'Platform scope',    value: '21 workforce sectors, global corridors' },
  { label: 'Inbound channels',  value: 'Employer intake, candidate interest, partner and strategic forms' },
  { label: 'Compliance',        value: 'No automatic outreach, no Stripe, GDPR-compliant' },
  { label: 'Status',            value: 'Pilot — no active revenue contracts' },
]

const CLEAR_LIMITS = [
  'No revenue promises or projections',
  'No active email sending (all manual)',
  'No active payment systems (Stripe not active)',
  'No cold outreach or bulk outreach',
  'No existing active contracts',
  'No candidate data scraped or purchased',
  'Pilot stage: no binding revenue agreements',
  'No public personal candidate profiles',
]

export default function StrategicPartnershipPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="bg-slate-950 px-6 py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">
            Strategic Partnership
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight max-w-2xl mx-auto">
            Explore a strategic partnership with CorridorWork.
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            CorridorWork is a live platform for structured, compliance-first international
            talent matching. We are open to white-label, licensing, acquisition discussions
            and strategic collaboration.
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-5 py-3 text-slate-400 text-sm">
            No revenue guarantees. No fabricated numbers. All figures verifiable.
          </div>
        </div>
      </section>

      {/* Platform facts */}
      <section className="bg-slate-900 px-6 py-14 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8">
            Platform overview
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLATFORM_FACTS.map(f => (
              <div key={f.label} className="bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-700/40">
                <div className="text-slate-400 text-xs font-semibold uppercase mb-0.5">{f.label}</div>
                <div className="text-white text-sm">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement options */}
      <section className="bg-slate-950 px-6 py-14 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8">
            Forms of engagement
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ENGAGEMENT_OPTIONS.map(opt => (
              <div key={opt.title} className="space-y-2">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                <h3 className="text-white font-semibold text-sm">{opt.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clear limits */}
      <section className="bg-slate-900 px-6 py-12 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-6">
            Clear limits — no false expectations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {CLEAR_LIMITS.map(l => (
              <div key={l} className="flex items-start gap-2.5 text-slate-400 text-sm">
                <div className="w-1 h-4 bg-slate-600 rounded-full shrink-0 mt-0.5" />
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="bg-slate-950 px-6 py-10 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link
            href="/demo/sandbox"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-colors text-sm"
          >
            View demo
          </Link>
          <Link
            href="/partners"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Explore partner programme
          </Link>
          <a
            href="#interest-form"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Submit strategic interest
          </a>
        </div>
      </section>

      {/* Form */}
      <StrategicPartnershipForm />

      {/* Compliance note */}
      <section className="bg-slate-900 px-6 py-8 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-600 text-xs text-center leading-relaxed">
            CorridorWork is in pilot stage. No revenue promises.
            No projected growth figures. No binding contracts without written agreement.
            All features listed are live and verifiable.{' '}
            <Link href="/legal/datenschutz" className="text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
