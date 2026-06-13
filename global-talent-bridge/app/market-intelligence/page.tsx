/**
 * app/market-intelligence/page.tsx — /market-intelligence
 *
 * Market Intelligence landing page — public.
 * No auth required.
 */
import type { Metadata } from 'next'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import { MarketIntelForm } from './_components/MarketIntelForm'

export const metadata: Metadata = {
  title: 'Market Intelligence Reports — CorridorWork',
  description:
    'Aggregated talent corridor data for B2B decision-makers: demand sectors, employer need, corridor scores. No personal data. Beta access free.',
  keywords: [
    'Market Intelligence Recruiting',
    'Talent Corridor Data',
    'International Recruiting Market Data',
    'Employer Demand Workforce',
    'Corridor Score',
    'B2B Market Data',
    'CorridorWork Market Intelligence',
  ],
  openGraph: {
    title: 'Market Intelligence Reports — CorridorWork',
    description:
      'Aggregated market data on international talent corridors: corridor scores, sector demand, employer need. No personal data.',
    url: 'https://corridorwork.com/market-intelligence',
    type: 'website',
    locale: 'en_US',
    siteName: 'CorridorWork',
  },
  alternates: {
    canonical: 'https://corridorwork.com/market-intelligence',
  },
}

export default function MarketIntelligencePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center w-full">
        <div className="inline-block bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          Market Intelligence — Beta
        </div>
        <p className="text-indigo-400 text-xs font-bold tracking-[0.18em] uppercase mb-4">
          Corridor Intelligence
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Talent corridor insights.<br />
          <span className="text-indigo-400">Aggregated. Anonymous. B2B.</span>
        </h1>
        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Receive aggregated market data on international talent corridors:
          demand sectors, employer need and corridor scores — no personal data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
          {[
            { title: 'Corridor scores',   text: '10+ talent corridors with demand score, regulatory overview and sector focus.' },
            { title: 'Sector demand',     text: 'Aggregated employer demand by sector and origin country.' },
            { title: 'GDPR-compliant',    text: 'No personal data. Only aggregated, anonymised insights.' },
          ].map(b => (
            <div key={b.title} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full mb-3" />
              <div className="font-semibold text-white text-sm mb-1.5">{b.title}</div>
              <div className="text-slate-400 text-sm leading-relaxed">{b.text}</div>
            </div>
          ))}
        </div>

        {/* Sample data */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left mb-8 max-w-2xl mx-auto">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase mb-4">
            Example: Corridor score Philippines → Germany
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-slate-400 text-xs mb-1">Total score</div>
              <div className="text-white font-bold text-2xl">92</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Top sectors</div>
              <div className="text-white text-sm">Care, Construction, IT</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Priority</div>
              <div className="text-emerald-400 font-semibold">High</div>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">* Aggregated example value. No candidate data included.</p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-6 pb-16 w-full">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Register report interest</h2>
          <p className="text-slate-400 text-sm mb-6">
            Beta · Free · No automatic email · Manually reviewed
          </p>
          <MarketIntelForm />
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-16 text-center w-full">
        <p className="text-xs text-slate-500">
          CorridorWork Market Intelligence is in Phase 1 (Beta). Reports are created and
          distributed manually. No automatic emails. No personal candidate data.
        </p>
      </section>

      <PublicFooter />
    </div>
  )
}
