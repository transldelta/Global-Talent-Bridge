/**
 * app/global/employers/page.tsx — /global/employers
 * Professional employer intake page — trust redesign.
 * Server component wrapper: nav, hero, trust, sectors, compliance + client form.
 * No job guarantee · No visa guarantee · Inbound-first · Admin-reviewed
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import { EmployerIntakeForm } from './EmployerIntakeForm'

export const metadata: Metadata = {
  title: 'Employer Intake — Explore International Talent Interest',
  description:
    'Submit your employer demand and explore international talent interest across sectors. Consent-based, admin-reviewed, no automatic outreach.',
  openGraph: {
    title: 'CorridorWork — Employer Intake',
    description:
      'Organize workforce demand and receive consent-based inbound interest from qualified international talent.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const SECTORS = [
  'Healthcare & Nursing',
  'IT & Software',
  'Engineering',
  'Skilled Trades',
  'Construction',
  'Hospitality',
  'Logistics & Transport',
  'Manufacturing',
]

const TRUST_ITEMS = [
  {
    title: 'Consent-based inbound interest',
    desc: 'Candidates submit interest voluntarily. No cold outreach, no automation.',
  },
  {
    title: 'Admin-reviewed workflows',
    desc: 'Every submission is reviewed by our team before any next step.',
  },
  {
    title: 'Multi-sector workforce categories',
    desc: 'Healthcare, IT, engineering, skilled trades and 17 more sectors covered.',
  },
  {
    title: 'No automatic outreach',
    desc: 'No automatic emails, no automatic matching, no automatic payment.',
  },
]

export default function GlobalEmployersPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/global/employer-hero.jpg"
            alt="Professional employer team — international hiring"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-slate-950/78" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 sm:py-32">
          {/* Breadcrumb */}
          <p className="text-slate-400 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">CorridorWork</Link>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-slate-300">Employer Intake</span>
          </p>
          <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            For Employers
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight max-w-2xl">
            Explore international talent interest across sectors and regions.
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
            CorridorWork helps employers organize workforce demand and receive
            consent-based inbound interest from qualified international talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#intake-form"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-base"
            >
              Submit employer demand
            </a>
            <Link
              href="/demo/sandbox"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/25 transition-colors text-base backdrop-blur-sm"
            >
              View demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ─────────────────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-8">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                <h3 className="text-white font-semibold text-sm leading-snug">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT IS FOR ─────────────────────────────────────────────────── */}
      <section className="bg-slate-950 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
                Sectors
              </p>
              <h2 className="text-2xl font-bold text-white mb-4">
                Multi-sector workforce coverage
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                CorridorWork covers 21 workforce sectors globally.
                Submit demand in one or multiple categories.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SECTORS.map((sector) => (
                  <div
                    key={sector}
                    className="flex items-center gap-2.5 py-2"
                  >
                    <div className="w-1 h-4 bg-indigo-500/60 rounded-full shrink-0" />
                    <span className="text-slate-300 text-sm">{sector}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 py-2">
                  <div className="w-1 h-4 bg-slate-600 rounded-full shrink-0" />
                  <span className="text-slate-500 text-sm">+ 13 more sectors</span>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-64 lg:h-80">
              <Image
                src="/images/global/employer-form-side.jpg"
                alt="Professional workplace — international employer"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-slate-900/40" />
            </div>
          </div>
        </div>
      </section>

      {/* ── INTAKE FORM ───────────────────────────────────────────────────── */}
      <div id="intake-form">
        <EmployerIntakeForm />
      </div>

      {/* ── COMPLIANCE NOTE ───────────────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-10 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
            Compliance
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              'No employment guarantee',
              'No visa guarantee',
              'No automatic placement',
              'No payment processing active',
            ].map((item) => (
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
            All employer requests are reviewed manually by the CorridorWork team.
            See{' '}
            <Link href="/legal/datenschutz" className="text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            {' '}for data handling.
            Interested in a deeper conversation?{' '}
            <Link href="/strategic-partnership" className="text-slate-500 hover:text-slate-300 transition-colors">
              Explore Strategic Partnership
            </Link>
            .
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
