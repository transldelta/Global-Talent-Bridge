/**
 * CorridorWork — Homepage
 * Premium Enterprise Redesign — 5 sections, split-layout hero, no false promises.
 * Design: Hero → Audience Paths → How It Works → Trust & Compliance → Final CTA
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
    title: 'CorridorWork — Global Talent Corridors',
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

      {/* ── A. HERO — split layout ────────────────────────────────────────────── */}
      {/* Left: text on clean dark background. Right: image panel (desktop only). */}
      <section className="relative min-h-[88vh] flex overflow-hidden bg-slate-950">

        {/* Text panel — full width on mobile, 52% on desktop */}
        <div className="relative z-10 flex items-center w-full lg:w-[52%] px-6 py-24 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-xl">

            <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6">
              Global Talent Corridors
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-white mb-6 leading-[1.15]">
              Organize global talent interest across employers, candidates and partners.
            </h1>

            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              CorridorWork helps employers, candidates and partners structure
              international workforce interest across sectors, regions and talent corridors.
            </p>

            {/* Primary + secondary audience CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/global/employers"
                className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-base text-center"
              >
                For employers
              </Link>
              <Link
                href="/global/candidates"
                className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-colors text-base text-center"
              >
                For candidates
              </Link>
            </div>

            {/* Tertiary text link — promo video */}
            <Link
              href="/promo-video"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-600 text-slate-400">
                ▶
              </span>
              Watch 60-second overview
            </Link>

          </div>
        </div>

        {/* Image panel — desktop only, right 50%, no text overlap possible */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%]">
          <Image
            src="/images/home/hero-global-talent.jpg"
            alt="Global workforce — diverse professionals collaborating internationally"
            fill
            className="object-cover object-center"
            priority
            sizes="52vw"
          />
          {/* Left-edge gradient fade — prevents any colour clash at the panel seam */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-950 to-transparent" />
          {/* Bottom fade for smooth section transition */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

      </section>

      {/* ── B. AUDIENCE PATHS ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">
              Three pathways
            </p>
            <h2 className="text-3xl font-bold text-white mb-3">
              Who is CorridorWork for?
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              One structured platform. Three clear entry points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Employers */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 hover:border-indigo-600/60 transition-colors flex flex-col">
              <div className="h-44 relative shrink-0">
                <Image
                  src="/images/home/employers-section.jpg"
                  alt="Professional employer team in discussion"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/60" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-indigo-600/85 text-white text-xs font-semibold rounded-md">
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
                <div className="absolute inset-0 bg-slate-900/60" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-emerald-700/85 text-white text-xs font-semibold rounded-md">
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
                  alt="Business partnership meeting"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/60" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-amber-700/85 text-white text-xs font-semibold rounded-md">
                    Partners
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-xl mb-2">For Partners</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                  Recruiting agencies, employer networks, training providers and
                  relocation partners can work with CorridorWork.
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

      {/* ── C. HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>
              <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
                How it works
              </p>
              <h2 className="text-3xl font-bold text-white mb-10">
                Structured from interest to corridor intelligence
              </h2>

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-600/40 flex items-center justify-center">
                    <span className="text-indigo-400 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1.5">
                      Employers register workforce interest
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Employers describe their international hiring needs by sector,
                      region and corridor — structured intake, admin-reviewed.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-600/40 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1.5">
                      Candidates express interest by corridor
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Candidates indicate where they want to work, in which sector and
                      role — consent-based, no automatic placement or outreach.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-amber-600/20 border border-amber-600/40 flex items-center justify-center">
                    <span className="text-amber-400 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1.5">
                      Corridor intelligence surfaces for partners
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Structured corridor data is prepared for B2B decision-makers,
                      mobility partners and ecosystem collaborators — organized,
                      not estimated.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map image */}
            <div className="relative rounded-2xl overflow-hidden h-72 lg:h-[22rem]">
              <Image
                src="/images/home/global-corridors-map.jpg"
                alt="International talent corridors — global workforce map"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-slate-900/45" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/70 text-xs leading-relaxed">
                  Connecting talent interest with employer demand across global corridors
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── D. TRUST & COMPLIANCE ────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <div>
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
                Compliance
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">
                Built on trust
              </h2>
              <p className="text-slate-400 leading-relaxed max-w-md">
                CorridorWork is designed to be transparent, compliant and honest —
                with employers, candidates and partners alike.
              </p>
              <p className="text-slate-400 leading-relaxed mt-3 max-w-md">
                No guarantees are made regarding employment outcomes or visa approvals.
                No automatic processes. No contact without explicit consent.
              </p>
              <p className="text-slate-500 text-sm mt-5">
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
                  className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 border border-slate-700/70 rounded-lg"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── E. FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">

          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
            Get started
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Explore CorridorWork
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Choose your pathway. Express structured interest or explore the platform.
          </p>

          {/* Primary audience CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/global/employers"
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
            >
              Employer intake
            </Link>
            <Link
              href="/global/candidates"
              className="px-7 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
            >
              Candidate interest
            </Link>
            <Link
              href="/strategic-partnership"
              className="px-7 py-3.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg border border-slate-600 transition-colors"
            >
              Partner discussion
            </Link>
          </div>

          {/* Watch overview text link */}
          <Link
            href="/promo-video"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-12"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-slate-600 text-slate-400 text-xs">
              ▶
            </span>
            Watch overview
          </Link>

          {/* Buyer / partner access bar */}
          <div className="border-t border-slate-800 pt-8">
            <p className="text-slate-600 text-xs mb-4 tracking-wide uppercase">
              For buyers &amp; strategic partners
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/buyer-snapshot"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
              >
                Buyer Snapshot
              </Link>
              <Link
                href="/demo/sandbox"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
              >
                Demo Sandbox
              </Link>
              <Link
                href="/promo-video"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
              >
                Promo Video
              </Link>
            </div>
          </div>

        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
