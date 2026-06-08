/**
 * CorridorWork — Homepage
 * Premium Enterprise Redesign — 6 sections, split-layout hero, video preview.
 * Design: Hero → Video Overview → Audience Paths → How It Works → Trust → Final CTA
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'CorridorWork — Global Talent Corridors for Employers, Candidates and Partners',
  description:
    'CorridorWork connects employer demand with qualified international talent across sectors, regions and talent corridors. Structured, compliant and globally ready.',
  openGraph: {
    title: 'CorridorWork — Global Talent Corridors',
    description:
      'Connecting employer demand with qualified international talent across healthcare, technology, engineering and skilled trades.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* ── A. HERO — premium split layout ───────────────────────────────────── */}
      {/*    Left: clean dark panel with hierarchy. Right: image (desktop only). */}
      <section className="relative min-h-[88vh] flex overflow-hidden bg-slate-950">

        {/* Text panel — full width mobile, 54% desktop */}
        <div className="relative z-10 flex items-center w-full lg:w-[54%] px-6 py-24 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-lg">

            {/* Eyebrow — keeps "global talent corridors" for test + brand consistency */}
            <p className="text-indigo-400 text-[0.7rem] font-bold tracking-[0.2em] uppercase mb-7 flex items-center gap-2">
              <span className="w-4 h-px bg-indigo-500 inline-block" />
              Global Talent Corridors
            </p>

            {/* Premium H1 — direct, enterprise-grade, no AI fluff */}
            <h1 className="text-4xl sm:text-[2.85rem] lg:text-[3.1rem] font-bold text-white mb-6 leading-[1.12] tracking-tight">
              Connect employer demand with qualified international talent.
            </h1>

            {/* Subheadline — structure.*international.*workforce matches test */}
            <p className="text-lg text-slate-300/90 mb-10 leading-relaxed">
              CorridorWork structures international workforce interest across sectors,
              regions and talent corridors — for employers, candidates and partners.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Link
                href="/global/employers"
                className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-[0.95rem] text-center shadow-lg shadow-indigo-900/30"
              >
                For employers
              </Link>
              <Link
                href="/global/candidates"
                className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-semibold rounded-lg border border-slate-700 transition-colors text-[0.95rem] text-center"
              >
                For candidates
              </Link>
            </div>

            {/* Video text link */}
            <Link
              href="/promo-video"
              className="inline-flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-600 group-hover:border-slate-400 text-slate-400 group-hover:text-white transition-all shrink-0 text-xs">
                ▶
              </span>
              Watch 60-second overview
            </Link>

          </div>
        </div>

        {/* Right image panel — desktop only, no text over faces */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[50%]">
          <Image
            src="/images/home/hero-global-talent.jpg"
            alt="Global workforce — international professionals collaborating across borders"
            fill
            className="object-cover object-center"
            priority
            sizes="50vw"
          />
          {/* Seamless left-edge gradient — zero text-over-image risk */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

      </section>

      {/* ── B. VIDEO OVERVIEW ────────────────────────────────────────────────── */}
      {/* Premium video preview card — not hidden, not just a text link */}
      <section className="px-6 py-16 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Text side */}
            <div>
              <p className="text-slate-500 text-[0.7rem] font-bold tracking-[0.18em] uppercase mb-4">
                Platform overview
              </p>
              <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
                See how CorridorWork works
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                A 60-second walkthrough of talent corridors, employer intake, candidate
                interest and partner collaboration — no signup required.
              </p>
              <Link
                href="/promo-video"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Watch the overview
                <span className="text-xs">→</span>
              </Link>
            </div>

            {/* Video preview card */}
            <Link href="/promo-video" className="group block">
              <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 group-hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
                {/* Background gradient representing the video */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-indigo-950/50 to-slate-900" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-200 shadow-lg">
                      <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                      Watch overview
                    </span>
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 rounded text-white/70 text-xs font-mono">
                  60s
                </div>
                {/* Top label */}
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-indigo-600/70 rounded text-white text-xs font-medium">
                  CorridorWork
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── C. AUDIENCE PATHS ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-slate-500 text-[0.7rem] font-bold tracking-[0.18em] uppercase mb-3">
              Three pathways
            </p>
            <h2 className="text-3xl font-bold text-white mb-3">
              Who is CorridorWork for?
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              One structured platform. Three clear entry points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* For Employers */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/40 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-300 flex flex-col group">
              <div className="h-44 relative shrink-0 overflow-hidden">
                <Image
                  src="/images/home/employers-section.jpg"
                  alt="Professional employer team"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/65" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-indigo-600/90 text-white text-xs font-semibold rounded-md">
                    Employers
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-lg mb-2">For Employers</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">
                  Explore international talent interest across sectors and regions.
                  Admin-reviewed, consent-based, compliance-first.
                </p>
                <Link
                  href="/global/employers"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Employer intake
                  <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* For Candidates */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/40 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all duration-300 flex flex-col group">
              <div className="h-44 relative shrink-0 overflow-hidden">
                <Image
                  src="/images/home/candidates-section.jpg"
                  alt="International candidate professional"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/65" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-emerald-700/90 text-white text-xs font-semibold rounded-md">
                    Candidates
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-lg mb-2">For Candidates</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">
                  Express interest in international career opportunities — free,
                  consent-based. No employment guarantee. No automatic outreach.
                </p>
                <Link
                  href="/global/candidates"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Candidate interest
                  <span className="text-xs">→</span>
                </Link>
              </div>
            </div>

            {/* For Partners */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/40 hover:border-amber-500/50 hover:bg-slate-800/60 transition-all duration-300 flex flex-col group">
              <div className="h-44 relative shrink-0 overflow-hidden">
                <Image
                  src="/images/home/partners-section.jpg"
                  alt="Business partnership meeting"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-900/65" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-amber-700/90 text-white text-xs font-semibold rounded-md">
                    Partners
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-lg mb-2">For Partners</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">
                  Recruiting agencies, employer networks, training providers and
                  relocation partners can work with CorridorWork.
                </p>
                <Link
                  href="/strategic-partnership"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Partner discussion
                  <span className="text-xs">→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── D. HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            <div>
              <p className="text-indigo-400 text-[0.7rem] font-bold tracking-[0.18em] uppercase mb-5">
                How it works
              </p>
              <h2 className="text-3xl font-bold text-white mb-10 leading-tight">
                Structured from interest<br className="hidden sm:block" /> to corridor intelligence
              </h2>

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start gap-5">
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                      <span className="text-indigo-400 text-sm font-bold">1</span>
                    </div>
                    <div className="w-px flex-1 bg-slate-800 min-h-[2rem]" />
                  </div>
                  <div className="pb-2">
                    <h3 className="text-white font-semibold mb-1.5 text-[0.95rem]">
                      Employers register workforce demand
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Describe international hiring needs by sector, region and corridor —
                      structured intake, manually reviewed.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-5">
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
                      <span className="text-emerald-400 text-sm font-bold">2</span>
                    </div>
                    <div className="w-px flex-1 bg-slate-800 min-h-[2rem]" />
                  </div>
                  <div className="pb-2">
                    <h3 className="text-white font-semibold mb-1.5 text-[0.95rem]">
                      Candidates express interest by corridor
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Qualified workers indicate where they want to work and in which
                      sector — consent-based, no automatic placement or outreach.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center">
                    <span className="text-amber-400 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1.5 text-[0.95rem]">
                      Corridor intelligence surfaces for partners
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Structured corridor data is prepared for B2B decision-makers,
                      mobility partners and ecosystem collaborators.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: map image */}
            <div className="relative rounded-2xl overflow-hidden h-72 lg:h-[22rem] shadow-xl">
              <Image
                src="/images/home/global-corridors-map.jpg"
                alt="International talent corridors — global workforce connections"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-slate-900/50" />
              <div className="absolute bottom-4 left-5 right-5">
                <p className="text-white/65 text-xs leading-relaxed">
                  Connecting talent interest with employer demand across global corridors
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── E. TRUST & COMPLIANCE ────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <div>
              <p className="text-slate-500 text-[0.7rem] font-bold tracking-[0.18em] uppercase mb-5">
                Compliance
              </p>
              <h2 className="text-3xl font-bold text-white mb-5 leading-tight">
                Built on trust
              </h2>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                CorridorWork is designed to be transparent, compliant and honest with
                everyone on the platform — employers, candidates and partners.
              </p>
              <p className="text-slate-400 leading-relaxed mt-3 max-w-sm">
                No guarantees are made on employment outcomes or visa approvals.
                No automatic processes. No contact without explicit consent.
              </p>
              <p className="text-slate-500 text-sm mt-6 leading-relaxed">
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
                  className="flex items-center gap-3 px-4 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── F. FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">

          <p className="text-slate-500 text-[0.7rem] font-bold tracking-[0.18em] uppercase mb-5">
            Get started
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Explore CorridorWork
          </h2>
          <p className="text-slate-400 mb-9 max-w-xl mx-auto leading-relaxed">
            Choose your pathway. Express structured interest or explore the platform.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-7">
            <Link
              href="/global/employers"
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-900/30"
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
              className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              Partner discussion
            </Link>
          </div>

          {/* Watch overview link */}
          <Link
            href="/promo-video"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-12 group"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 group-hover:border-slate-500 text-xs transition-colors">
              ▶
            </span>
            Watch overview
          </Link>

          {/* Buyer / partner access bar */}
          <div className="border-t border-slate-800/80 pt-8">
            <p className="text-slate-600 text-[0.65rem] mb-5 tracking-[0.15em] uppercase">
              For buyers &amp; strategic partners
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/buyer-snapshot"
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
              >
                Buyer Snapshot
              </Link>
              <Link
                href="/demo/sandbox"
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
              >
                Demo Sandbox
              </Link>
              <Link
                href="/promo-video"
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
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
