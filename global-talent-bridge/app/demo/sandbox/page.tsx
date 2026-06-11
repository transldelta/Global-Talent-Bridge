/**
 * app/demo/sandbox/page.tsx — /demo/sandbox
 *
 * Demo Sandbox — public, shows global platform capabilities.
 * No real data. No accounts. No login required.
 * Premium design: dark theme, clean typography, no emoji decoration.
 */
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import { TALENT_CATEGORIES, getTopCategoriesByRevenue } from '@/lib/talent-categories'

export const metadata = {
  title: 'Demo Sandbox — CorridorWork Global Talent Platform',
  description: 'Explore CorridorWork — global talent corridors, multisector capability, employer and candidate intake. Live demo.',
}

const DEMO_CORRIDORS = [
  { flag1: '🇵🇭', flag2: '🌍', name: 'Philippines → Global Healthcare', score: 92, href: '/corridors/philippines-healthcare' },
  { flag1: '🇮🇳', flag2: '🇨🇦', name: 'India → Canada', score: 88, href: '/corridors/india-canada' },
  { flag1: '🇲🇦', flag2: '🇩🇪', name: 'Morocco → Germany', score: 84, href: '/corridors/morocco-germany' },
  { flag1: '🇳🇬', flag2: '🇬🇧', name: 'Nigeria → UK', score: 84, href: '/corridors/nigeria-uk' },
  { flag1: '🇵🇰', flag2: '🌏', name: 'Pakistan → Gulf', score: 85, href: '/corridors/pakistan-gulf' },
]

export default function DemoSandboxPage() {
  const topRevCats = getTopCategoriesByRevenue(5)

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Demo notice — subtle, dark, professional */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            <span className="text-amber-400 font-semibold">Demo-Modus:</span>
            {' '}
            Ausschließlich synthetische Daten. Keine echten Kunden, keine echten Umsätze, keine echten Kandidaten- oder Arbeitgeberdaten.
          </p>
          <Link
            href="/strategic-partnership"
            className="shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Echter Käufer? →
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-slate-800 bg-slate-900/50 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Link href="/" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
              CorridorWork
            </Link>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400 text-sm">Platform Demo</span>
          </div>
          <p className="text-indigo-400 text-xs font-bold tracking-[0.18em] uppercase mb-4">
            Platform capabilities
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-2xl">
            Global Talent Corridor Platform
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-8 leading-relaxed">
            Structured, compliance-first cross-border hiring — worldwide employers, worldwide candidates,
            {' '}{TALENT_CATEGORIES.length}+ sectors, 15+ global corridors. Inbound-first. No cold outreach.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/global/employers"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              Employer intake
            </Link>
            <Link
              href="/global/candidates"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold border border-slate-700 transition-colors text-sm"
            >
              Candidate interest
            </Link>
            <Link
              href="/strategic-partnership"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-semibold border border-slate-700 transition-colors text-sm"
            >
              Strategic partnership
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10 w-full">

        {/* Platform metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { value: `${TALENT_CATEGORIES.length}+`, label: 'Sectors covered',   accent: 'text-indigo-400' },
            { value: '15+',                           label: 'Global corridors',  accent: 'text-slate-300' },
            { value: '4',                             label: 'Revenue pathways',  accent: 'text-slate-300' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className={`text-3xl font-bold mb-1 ${s.accent}`}>{s.value}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sectors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="mb-5">
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">
              Sector coverage
            </p>
            <h2 className="text-white font-bold text-lg">{TALENT_CATEGORIES.length} sectors supported</h2>
            <p className="text-slate-500 text-sm mt-1">Not limited to healthcare or IT — all qualified sectors worldwide.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {TALENT_CATEGORIES.map(cat => (
              <div key={cat.sector_key} className="flex items-center gap-2 p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-lg">
                <span className="text-base shrink-0">{cat.emoji}</span>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-300 truncate">{cat.public_label}</div>
                  {cat.remote_eligible && (
                    <span className="text-[10px] text-indigo-400">Remote</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Corridors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-2">
            Top talent corridors
          </p>
          <h2 className="text-white font-bold text-lg mb-5">Active global corridors</h2>
          <div className="space-y-2">
            {DEMO_CORRIDORS.map(c => (
              <Link
                key={c.href}
                href={c.href}
                className="flex items-center gap-4 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-lg hover:border-indigo-500/40 hover:bg-slate-800 transition-colors group"
              >
                <span className="text-lg">{c.flag1}</span>
                <span className="text-slate-600 text-xs">→</span>
                <span className="text-lg">{c.flag2}</span>
                <span className="flex-1 font-medium text-slate-300 text-sm group-hover:text-white transition-colors">{c.name}</span>
                <span className="text-sm font-bold text-indigo-400">{c.score}/100</span>
                <span className="text-slate-600 text-xs group-hover:text-slate-400 transition-colors">→</span>
              </Link>
            ))}
            <Link href="/corridors" className="block text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-3">
              View all 15+ corridors →
            </Link>
          </div>
        </div>

        {/* Top Demand Segments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-2">
            Demand intelligence
          </p>
          <h2 className="text-white font-bold text-lg mb-5">Top demand segments</h2>
          <div className="space-y-2">
            {topRevCats.map((cat, i) => (
              <div key={cat.sector_key} className="flex items-center gap-3 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-lg">
                <span className="text-slate-600 font-bold text-xs w-5 shrink-0">#{i + 1}</span>
                <span className="text-base shrink-0">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-300 text-sm">{cat.public_label}</div>
                </div>
                <div className="text-sm font-bold text-indigo-400">{cat.revenue_potential}/100</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-2">
            Platform logic
          </p>
          <h2 className="text-white font-bold text-lg mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                n: '01',
                title: 'Inbound intake',
                desc: 'Employers and candidates register interest globally — no cold outreach needed.',
              },
              {
                n: '02',
                title: 'Corridor processing',
                desc: 'Platform prepares top corridors, sectors, and demand priorities — structured and compliance-first.',
              },
              {
                n: '03',
                title: 'Manual review',
                desc: 'Admin reviews leads, qualifies matches, and takes action — approval-based throughout.',
              },
            ].map(step => (
              <div key={step.n} className="space-y-3">
                <div className="text-2xl font-bold text-slate-700">{step.n}</div>
                <h4 className="text-white font-semibold text-sm">{step.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust — what is real, what is not */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-2">
            Demo Disclaimer
          </p>
          <p className="text-slate-500 text-sm mb-5">Was diese Seite zeigt und was nicht</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-400 font-semibold mb-3">Was gezeigt wird</p>
              <ul className="space-y-2">
                {[
                  'Plattformarchitektur (echt)',
                  'Technische Fähigkeiten (echt)',
                  `${TALENT_CATEGORIES.length} Sektoren-Taxonomie (echt)`,
                  '15+ Korridor-Seiten (echt)',
                  'Demo-Inhalte (zur Illustration)',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-slate-400 font-semibold mb-3">Was nicht gezeigt wird</p>
              <ul className="space-y-2">
                {[
                  'Echte Kunden (0)',
                  'Echter Umsatz (0 EUR)',
                  'Echte Traction (keine)',
                  'Echte Placements (keine)',
                  'Fake-Erfolgszahlen (keine)',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Safety & Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
            Safety &amp; Compliance
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'No automatic emails',
              'No cold outreach',
              'No scraping',
              'No payment processing active',
              'No job guarantee',
              'No visa guarantee',
              'No candidate fees',
              'GDPR-compliant — EU region',
              'Inbound-only',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/global/employers"
            className="flex flex-col p-6 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl transition-colors group"
          >
            <span className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">Employers</span>
            <div className="font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
              Register hiring need
            </div>
            <div className="text-sm text-slate-500 mt-1">International workforce demand</div>
          </Link>
          <Link
            href="/global/candidates"
            className="flex flex-col p-6 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition-colors group"
          >
            <span className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">Candidates</span>
            <div className="font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
              Register interest
            </div>
            <div className="text-sm text-slate-500 mt-1">Free — consent-based</div>
          </Link>
          <Link
            href="/strategic-partnership"
            className="flex flex-col p-6 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl transition-colors group"
          >
            <span className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">Partners & Buyers</span>
            <div className="font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
              Strategic discussion
            </div>
            <div className="text-sm text-slate-500 mt-1">White-label, licensing, acquisition</div>
          </Link>
        </div>

      </div>

      <PublicFooter />
    </div>
  )
}
