/**
 * app/partners/page.tsx — /partners
 * Professional partner intake page — premium redesign.
 * Recruiting agencies · Language schools · Relocation · Market intelligence
 * No automatic outreach · No Stripe · Manual review · GDPR-compliant
 * No admin links · No internal terms · No revenue promises
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import Link from 'next/link'
import { PartnersForm } from './PartnersForm'

export const metadata: Metadata = {
  title: 'Partner with CorridorWork — Global Talent Corridor Platform',
  description:
    'Explore a partnership with CorridorWork. Recruiting agencies, employer networks, training providers, language schools, relocation partners and market intelligence providers.',
  openGraph: {
    title: 'Partner with CorridorWork',
    description:
      'Request a partnership discussion with the CorridorWork global talent corridor platform. Consent-based, manually reviewed.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
  },
}

const PARTNER_TYPES = [
  {
    title: 'Recruiting Agencies',
    desc: 'Extend your portfolio with structured international talent matching across 21 workforce sectors.',
  },
  {
    title: 'Employer Networks',
    desc: 'Aggregate workforce demand across member employers into a structured, corridor-based intake.',
  },
  {
    title: 'Training Providers',
    desc: 'Connect graduates and qualified candidates with international employer demand by sector.',
  },
  {
    title: 'Language Schools',
    desc: 'Link language competencies with employer demand across global talent corridors.',
  },
  {
    title: 'Relocation Partners',
    desc: 'Complete your cross-border hiring offering with consent-based talent pipeline visibility.',
  },
  {
    title: 'Market Intelligence Partners',
    desc: 'Access aggregated corridor and sector demand data to inform strategic market decisions.',
  },
]

const ENGAGEMENT_TYPES = [
  {
    title: 'White-Label Integration',
    desc: 'Use the CorridorWork system under your own branding (Phase 2+).',
  },
  {
    title: 'Operational Partnership',
    desc: 'Joint market coverage or operational collaboration across corridors and sectors.',
  },
  {
    title: 'Licensing / API Access',
    desc: 'Technology licence or API integration into your existing systems.',
  },
  {
    title: 'Market Intelligence',
    desc: 'Aggregated corridor and demand data for your target markets.',
  },
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/global/employer-hero.jpg"
            alt="Global partnership — international talent corridors"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 sm:py-32">
          <p className="text-slate-400 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">CorridorWork</Link>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-slate-300">Partners</span>
          </p>
          <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            For Partners
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight max-w-2xl">
            Partner with a global talent corridor platform.
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
            Recruiting agencies, employer networks, training providers, language schools,
            relocation partners and market intelligence providers can work with
            CorridorWork through structured collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#partner-form"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-base"
            >
              Request partnership discussion
            </a>
            <Link
              href="/strategic-partnership"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/25 transition-colors text-base backdrop-blur-sm"
            >
              Explore strategic partnership
            </Link>
          </div>
        </div>
      </section>

      {/* ── PARTNER TYPES ─────────────────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-8">
            Who it is for
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNER_TYPES.map(pt => (
              <div key={pt.title} className="space-y-2">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                <h3 className="text-white font-semibold text-sm">{pt.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENT TYPES ──────────────────────────────────────────────── */}
      <section className="bg-slate-950 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8">
            Engagement models
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ENGAGEMENT_TYPES.map(et => (
              <div key={et.title} className="space-y-2">
                <div className="w-1.5 h-6 bg-slate-600 rounded-full" />
                <h3 className="text-white font-semibold text-sm">{et.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{et.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER FORM ──────────────────────────────────────────────────── */}
      <div id="partner-form">
        <PartnersForm />
      </div>

      {/* ── COMPLIANCE NOTE ───────────────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-10 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              'No employment guarantee',
              'No visa guarantee',
              'No automatic placement',
              'No payment processing active',
            ].map(item => (
              <div
                key={item}
                className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-slate-400 text-xs leading-tight">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs mt-4">
            All partner requests are reviewed manually. No cold outreach. See{' '}
            <Link href="/legal/datenschutz" className="text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            {' '}for data handling. For deeper conversations:{' '}
            <Link href="/strategic-partnership" className="text-slate-500 hover:text-slate-300 transition-colors">
              explore strategic partnership
            </Link>
            .
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
