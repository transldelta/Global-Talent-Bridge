/**
 * app/partners/page.tsx — /partners
 * Professional partner intake page — server component wrapper.
 * Recruiting agencies, language schools, relocation services and HR consultants.
 * No automatic outreach · No Stripe · Manual review · GDPR-compliant
 */
import type { Metadata } from 'next'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import Link from 'next/link'
import { PartnersForm } from './PartnersForm'

export const metadata: Metadata = {
  title: 'Partner with CorridorWork — Global Talent Corridor Platform',
  description:
    'Register your interest in partnering with CorridorWork. White-label, operational partnerships, licensing and market intelligence for recruiting agencies, HR consultants and relocation services.',
  openGraph: {
    title: 'Partner with CorridorWork',
    description:
      'Register interest in white-label, licensing or operational partnership with the CorridorWork global talent platform.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
  },
}

const PARTNER_TYPES = [
  {
    title: 'Recruiting Agencies',
    desc: 'Extend your portfolio with structured international talent matching across 21 sectors.',
  },
  {
    title: 'Employer Networks',
    desc: 'Aggregate workforce demand across your member employers into structured corridor intake.',
  },
  {
    title: 'Training Providers',
    desc: 'Connect graduates and qualified candidates to international employer demand by sector.',
  },
  {
    title: 'Language Schools',
    desc: 'Connect language competencies with employer demand across global corridors.',
  },
  {
    title: 'Relocation Services',
    desc: 'Complete your cross-border hiring offering with consent-based talent pipeline visibility.',
  },
  {
    title: 'HR Consulting',
    desc: 'Offer structured international matching as a managed service to your clients.',
  },
  {
    title: 'B2B Platforms',
    desc: 'API integration or white-label deployment within your existing platform.',
  },
  {
    title: 'Operational Partners',
    desc: 'Joint handling of employer demand across corridors and sectors.',
  },
]

const ENGAGEMENT_TYPES = [
  {
    title: 'White-Label Integration',
    desc: 'Use the CorridorWork system under your own branding (Phase 2+).',
  },
  {
    title: 'Operational Partnership',
    desc: 'Joint market coverage, revenue sharing or operational collaboration.',
  },
  {
    title: 'Licensing / API Access',
    desc: 'Technology licence or API integration into your systems.',
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

      {/* Hero */}
      <section className="bg-slate-950 px-6 py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            For Partners
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight max-w-2xl mx-auto">
            Partner with a global talent corridor platform.
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Recruiting agencies, language schools, relocation services and HR consultants
            can work with CorridorWork through white-label integration, licensing or
            operational partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#partner-form"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-base"
            >
              Register partner interest
            </a>
            <Link
              href="/strategic-partnership"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/25 transition-colors text-base"
            >
              Explore strategic partnership
            </Link>
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="bg-slate-900 px-6 py-14 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8">
            Who it is for
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* Engagement types */}
      <section className="bg-slate-950 px-6 py-14 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8">
            Engagement types
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* Partner Form */}
      <div id="partner-form">
        <PartnersForm />
      </div>

      {/* Compliance note */}
      <section className="bg-slate-900 px-6 py-8 border-t border-slate-800">
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
            All partner requests are reviewed manually. See{' '}
            <Link href="/legal/datenschutz" className="text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            {' '}for data handling. Interested in a deeper conversation?{' '}
            <Link href="/strategic-partnership" className="text-slate-500 hover:text-slate-300 transition-colors">
              Explore strategic partnership
            </Link>
            .
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
