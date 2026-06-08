/**
 * app/global/candidates/page.tsx — /global/candidates
 * Professional candidate intake page — trust redesign.
 * Server component wrapper: nav, hero, trust, sectors, compliance + client form.
 * No job guarantee · No visa guarantee · Free interest · Admin-reviewed
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import { CandidateIntakeForm } from './CandidateIntakeForm'

export const metadata: Metadata = {
  title: 'Candidate Interest — Express Interest in International Opportunities',
  description:
    'Register your interest in international career opportunities across sectors and regions. Voluntary, free, consent-based — no job guarantee, no visa guidance.',
  openGraph: {
    title: 'CorridorWork — Candidate Interest',
    description:
      'Express interest in global talent corridors across sectors. Voluntary, free, consent-based interest form.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const SECTORS = [
  'Healthcare & Nursing',
  'IT & Software',
  'Engineering',
  'Skilled Trades',
  'Hospitality',
  'Logistics & Transport',
  'Construction',
  'Business Support',
]

const TRUST_ITEMS = [
  {
    title: 'Free expression of interest',
    desc: 'No registration fee, no subscription, no hidden costs. Voluntary and free.',
  },
  {
    title: 'No job guarantee',
    desc: 'Registering does not guarantee employment. No automatic placement.',
  },
  {
    title: 'No visa guarantee',
    desc: 'We do not provide visa advice or immigration services. No visa outcome guaranteed.',
  },
  {
    title: 'Admin-reviewed interest only',
    desc: 'All submissions are reviewed by our team. No automatic outreach to candidates.',
  },
]

export default function GlobalCandidatesPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/global/candidate-hero.jpg"
            alt="International professional candidate — global career opportunities"
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
            <span className="text-slate-300">Candidate Interest</span>
          </p>
          <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
            For Candidates
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight max-w-2xl">
            Express interest in international career opportunities.
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
            CorridorWork lets qualified workers share their interest in global talent
            corridors across sectors, countries and skill categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#interest-form"
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors text-base"
            >
              Submit candidate interest
            </a>
            <Link
              href="/"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/25 transition-colors text-base backdrop-blur-sm"
            >
              Learn how it works
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ─────────────────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-8">
            What to expect
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h3 className="text-white font-semibold text-sm leading-snug">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTORS ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden h-64 lg:h-80 order-2 lg:order-1">
              <Image
                src="/images/global/candidate-form-side.jpg"
                alt="International candidate — professional career"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-slate-900/35" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
                Sectors
              </p>
              <h2 className="text-2xl font-bold text-white mb-4">
                Available across multiple sectors
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Express interest in one or multiple fields. CorridorWork organizes
                candidate interest across 21 global workforce sectors.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SECTORS.map((sector) => (
                  <div key={sector} className="flex items-center gap-2.5 py-2">
                    <div className="w-1 h-4 bg-emerald-500/60 rounded-full shrink-0" />
                    <span className="text-slate-300 text-sm">{sector}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 py-2">
                  <div className="w-1 h-4 bg-slate-600 rounded-full shrink-0" />
                  <span className="text-slate-500 text-sm">+ 13 more sectors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CANDIDATE FORM ────────────────────────────────────────────────── */}
      <div id="interest-form">
        <CandidateIntakeForm />
      </div>

      {/* ── COMPLIANCE NOTE ───────────────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-10 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
            Safety
          </p>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">
            This is an interest form, not a job offer or visa service.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              'No employment guarantee',
              'No visa guarantee',
              'No automatic placement',
              'No candidate fee active',
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
            See{' '}
            <Link href="/legal/datenschutz" className="text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            {' '}for data handling details. Operated by Delta Translation, Karlsruhe.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
