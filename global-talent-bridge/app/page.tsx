/**
 * CorridorWork — Homepage
 * Professional Trust Redesign — 7 sections, no clutter, no false promises.
 * Design: Hero → Audience Split → What We Do → Global Scope → Trust → Buyer → CTA
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'CorridorWork — Global Talent Corridors for Employers, Candidates and Partners',
  description:
    'CorridorWork organizes international employer demand, candidate interest and talent mobility signals across sectors and regions.',
  openGraph: {
    title: 'CorridorWork — Global Talent Mobility Platform',
    description:
      'Connecting global employer demand with candidate interest across healthcare, technology, engineering and skilled trades.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* ── A. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Background image with dark overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/home/hero-global-talent.jpg"
            alt="Global workforce — diverse professionals working together"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-slate-950/72" />
          {/* Subtle gradient at bottom for section transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center">
          <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6 sm:text-sm">
            Global Talent Mobility Platform
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Global talent corridors for employers,{' '}
            candidates and partners.
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            CorridorWork helps organize international employer demand, candidate interest
            and talent mobility signals across sectors and regions.
          </p>
          {/* Three clear audience buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/global/employers"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-base"
            >
              I&apos;m an employer
            </Link>
            <Link
              href="/global/candidates"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/25 transition-colors text-base backdrop-blur-sm"
            >
              I&apos;m a candidate
            </Link>
            <Link
              href="/strategic-partnership"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/25 transition-colors text-base backdrop-blur-sm"
            >
              I&apos;m a partner
            </Link>
          </div>
        </div>
      </section>

      {/* ── B. AUDIENCE SPLIT ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Who is CorridorWork for?
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Three clear pathways. One structured platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employers */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 hover:border-indigo-600/60 transition-colors flex flex-col">
              <div className="h-44 relative shrink-0">
                <Image
                  src="/images/home/employers-section.jpg"
                  alt="Professional employer team"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/55" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-indigo-600/80 text-white text-xs font-semibold rounded-md backdrop-blur-sm">
                    Employers
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-xl mb-2">For Employers</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                  Explore international talent interest and workforce corridors across
                  sectors and regions. Admin-reviewed and compliance-first.
                </p>
                <Link
                  href="/global/employers"
                  className="inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Explore employer intake →
                </Link>
              </div>
            </div>

            {/* Candidates */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 hover:border-emerald-600/60 transition-colors flex flex-col">
              <div className="h-44 relative shrink-0">
                <Image
                  src="/images/home/candidates-section.jpg"
                  alt="International candidate professional"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/55" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-emerald-700/80 text-white text-xs font-semibold rounded-md backdrop-blur-sm">
                    Candidates
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-xl mb-2">For Candidates</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                  Express interest in international career opportunities.
                  Consent-based, no automatic outreach. No employment guarantee.
                </p>
                <Link
                  href="/global/candidates"
                  className="inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Explore candidate intake →
                </Link>
              </div>
            </div>

            {/* Partners */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 hover:border-amber-600/60 transition-colors flex flex-col">
              <div className="h-44 relative shrink-0">
                <Image
                  src="/images/home/partners-section.jpg"
                  alt="Business partnership and strategic discussion"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/55" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-amber-700/80 text-white text-xs font-semibold rounded-md backdrop-blur-sm">
                    Partners
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-xl mb-2">For Partners</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                  Explore partnership, licensing or acquisition opportunities.
                  Strategic discussion available by arrangement.
                </p>
                <Link
                  href="/strategic-partnership"
                  className="inline-block text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Explore partnership →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── C. WHAT CORRIDORWORK DOES ────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
                Platform
              </p>
              <h2 className="text-3xl font-bold text-white mb-8">
                What CorridorWork does
              </h2>
              <div className="space-y-7">
                <div className="flex items-start gap-5">
                  <div className="w-0.5 h-14 bg-indigo-500 rounded-full shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1.5">
                      Organizes global employer demand
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Structures inbound employer interest across 21 sectors and multiple
                      regions into actionable corridor intelligence.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-0.5 h-14 bg-emerald-500 rounded-full shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1.5">
                      Collects candidate interest across sectors
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Gathers structured, consent-based candidate expressions of interest —
                      healthcare, IT, engineering, skilled trades and more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-0.5 h-14 bg-amber-500 rounded-full shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1.5">
                      Prepares corridor-based matching and partner intelligence
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Delivers structured corridor data and partner-ready reporting for
                      B2B decision-makers, acquirers and mobility ecosystem partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-72 lg:h-80">
              <Image
                src="/images/home/global-corridors-map.jpg"
                alt="International talent corridors — global workforce"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-slate-900/40" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/75 text-xs leading-relaxed">
                  Connecting talent with opportunity across regions and sectors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── D. GLOBAL SCOPE ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            Scope
          </p>
          <h2 className="text-3xl font-bold text-white mb-3">
            Global reach, structured corridors
          </h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
            CorridorWork operates across sectors, regions and talent corridors —
            organized, not estimated.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { value: '21', label: 'Sectors covered' },
              { value: 'Global', label: 'Candidate reach' },
              { value: 'Global', label: 'Employer intake' },
              { value: 'Corridor-based', label: 'Structure' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-800/60 border border-slate-700 rounded-xl p-5"
              >
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── E. TRUST & COMPLIANCE ────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
                Compliance
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">
                Built on trust
              </h2>
              <p className="text-slate-400 leading-relaxed">
                CorridorWork is designed to be transparent, compliant and honest —
                with employers, candidates and partners alike. No guarantees,
                no automatic processes, no payment without explicit arrangement.
              </p>
              <p className="text-slate-500 text-sm mt-4">
                No job guarantee · No visa guarantee · Inbound-first
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'No employment guarantee',
                'No visa guarantee',
                'No automatic outreach',
                'No payment processing active',
                'Consent-based inbound interest',
                'Admin-reviewed workflows',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700/60 rounded-lg"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── F. BUYER / PARTNER SECTION ───────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">
            For Buyers &amp; Partners
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Built as a global talent mobility SaaS asset
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            CorridorWork is structured for acquisition, licensing or strategic partnership.
            Buyer documentation, demo environment and partner discussion are available
            on request.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/buyer-snapshot"
              className="px-6 py-3 bg-amber-600/15 hover:bg-amber-600/25 text-amber-300 font-semibold rounded-lg border border-amber-700/50 transition-colors"
            >
              Buyer Snapshot
            </Link>
            <Link
              href="/demo/sandbox"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg border border-slate-600 transition-colors"
            >
              Demo Sandbox
            </Link>
            <Link
              href="/promo-video"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg border border-slate-600 transition-colors"
            >
              Promo Video
            </Link>
            <Link
              href="/strategic-partnership"
              className="px-6 py-3 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 font-semibold rounded-lg border border-indigo-700/50 transition-colors"
            >
              Strategic Partnership
            </Link>
          </div>
        </div>
      </section>

      {/* ── G. FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Explore CorridorWork</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Choose your pathway. Express interest or explore the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/global/employers"
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
            >
              Employer Intake
            </Link>
            <Link
              href="/global/candidates"
              className="px-7 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
            >
              Candidate Interest
            </Link>
            <Link
              href="/strategic-partnership"
              className="px-7 py-3.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg border border-slate-600 transition-colors"
            >
              Partner Discussion
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
