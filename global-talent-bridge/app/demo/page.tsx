/**
 * app/demo/page.tsx — /demo
 *
 * Public "How CorridorWork works" demo page.
 * Shows corridor scores, sector demand and example profiles — all sample data.
 * No real candidate data · No Auth · No Stripe · No email sending.
 */
import type { Metadata } from 'next'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import Link from 'next/link'
import { INDUSTRY_CONFIGS, CORRIDOR_CONFIGS } from '@/lib/seo-pages'

export const metadata: Metadata = {
  title: 'How CorridorWork Works — Demo',
  description:
    'See how CorridorWork organizes international talent interest: corridor scores, sector demand, and consent-based inbound matching. Sample data only — no real candidate profiles.',
  openGraph: {
    title: 'How CorridorWork Works — Demo',
    description:
      'Explore the CorridorWork platform: corridor scores, sector demand, and inbound matching logic. Sample data only.',
    url: 'https://corridorwork.com/demo',
    type: 'website',
    locale: 'en_US',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/demo' },
}

// Sample candidate profiles — example data only, no real personal data
const DEMO_PROFILES = [
  {
    id: 'demo-001',
    initials: 'FK',
    origin: 'Philippines',
    sector: 'Healthcare & Nursing',
    experience: '5 years',
    languages: 'English C1 · German A2',
    matchScore: 94,
    status: 'Example',
  },
  {
    id: 'demo-002',
    initials: 'AK',
    origin: 'Morocco',
    sector: 'Construction & Skilled Trades',
    experience: '8 years',
    languages: 'Arabic · French B2 · German A1',
    matchScore: 82,
    status: 'Example',
  },
  {
    id: 'demo-003',
    initials: 'RN',
    origin: 'India',
    sector: 'IT & Technology',
    experience: '6 years',
    languages: 'English C2 · German B1',
    matchScore: 91,
    status: 'Example',
  },
]

const DEMO_CORRIDORS = [
  CORRIDOR_CONFIGS['philippines-care'],
  CORRIDOR_CONFIGS['india-uk'],
  CORRIDOR_CONFIGS['morocco-germany'],
]

const DEMO_INDUSTRIES = [
  INDUSTRY_CONFIGS.care,
  INDUSTRY_CONFIGS.it,
  INDUSTRY_CONFIGS.construction,
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-slate-700">
          Sample data — no real candidate profiles
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How CorridorWork works
        </h1>
        <p className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto">
          CorridorWork organizes consent-based inbound interest from international
          candidates and connects it with employer demand across sectors and corridors.
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/50 rounded-full px-4 py-2 text-amber-300 text-sm">
          All data shown is sample data — no real personal information, no employment guarantee
        </div>
      </section>

      {/* Corridor Scores */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-white font-bold text-xl mb-2">Corridor scores (example)</h2>
        <p className="text-slate-500 text-sm mb-4">
          Corridor scores reflect candidate interest density, employer demand, and compliance readiness for each talent corridor.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_CORRIDORS.map(c => (
            <div key={c.slug} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{c.originFlag}</span>
                <span className="text-slate-400">→</span>
                <span className="text-2xl">{c.destinationFlag}</span>
              </div>
              <div className="text-white font-semibold text-sm mb-1">{c.headline}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`text-2xl font-bold ${c.corridorScore >= 90 ? 'text-green-400' : c.corridorScore >= 80 ? 'text-blue-400' : 'text-amber-400'}`}>
                  {c.corridorScore}
                </div>
                <div className="text-xs text-slate-400">Corridor Score</div>
              </div>
              <div className="flex flex-wrap gap-1">
                {c.sectors.slice(0, 2).map(s => (
                  <span key={s} className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Example Profiles */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-white font-bold text-xl mb-2">Example profiles (anonymised)</h2>
        <p className="text-slate-500 text-sm mb-4">
          No real personal data. For demonstration purposes only. Registering interest does not guarantee employment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_PROFILES.map(p => (
            <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center text-sm">
                  {p.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{p.origin}</div>
                  <div className="text-slate-500 text-xs">{p.sector}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-400 mb-3">
                <div>Experience: <span className="text-slate-300">{p.experience}</span></div>
                <div>Languages: <span className="text-slate-300">{p.languages}</span></div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-indigo-400">{p.matchScore}</span>
                  <span className="text-xs text-slate-500 ml-1">Match Score</span>
                </div>
                <span className="bg-slate-700 border border-slate-600 text-slate-400 text-xs px-2 py-0.5 rounded">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-white font-bold text-xl mb-4">Sectors covered</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_INDUSTRIES.map(ind => (
            <a key={ind.slug} href={`/industries/${ind.slug}`}
               className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-600/50 transition-colors group">
              <div className="text-2xl mb-2">{ind.emoji}</div>
              <div className={`font-semibold text-sm mb-1 group-hover:text-white ${ind.colorClass}`}>{ind.name}</div>
              <div className="text-slate-400 text-xs">{ind.tagline}</div>
              <div className="mt-3 text-xs text-indigo-400 group-hover:underline">Learn more →</div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to get started?</h2>
          <p className="text-slate-400 text-sm mb-6">
            No automatic placement · No employment guarantee · No payment processing active · Consent-based · Manually reviewed
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link
              href="/global/employers"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
            >
              For employers
            </Link>
            <Link
              href="/global/candidates"
              className="px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              For candidates
            </Link>
            <Link
              href="/strategic-partnership"
              className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
            >
              Strategic partnership
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            All submissions are reviewed manually. No automatic emails. GDPR-compliant.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-2xl mx-auto px-4 pb-8 text-center">
        <p className="text-xs text-slate-600">
          All candidate profiles shown on this page are fictional example data.
          No real personal data. No employment guarantee. No visa guarantee.
          ·{' '}
          <Link href="/legal/datenschutz" className="hover:text-slate-400 underline">Privacy Policy</Link>
          {' '}·{' '}
          <Link href="/legal/impressum" className="hover:text-slate-400 underline">Impressum</Link>
        </p>
      </section>

      <PublicFooter />
    </div>
  )
}
