/**
 * app/corridors/page.tsx — /corridors
 *
 * Public corridor index page.
 * Lists all available talent corridor pages.
 * No auth · No admin links · No internal terms.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Global Talent Corridors — CorridorWork',
  description:
    'Explore all global talent corridors on CorridorWork — structured, compliance-first cross-border hiring across healthcare, IT, construction, hospitality and more.',
  openGraph: {
    title: 'Global Talent Corridors — CorridorWork',
    description: 'Browse all active talent corridors connecting international candidates with employer demand.',
    type: 'website',
  },
}

const CORRIDORS = [
  { slug: 'philippines-healthcare', origin: 'Philippines', destination: 'Global',   sector: 'Healthcare',           originFlag: '🇵🇭', destFlag: '🌍' },
  { slug: 'philippines-care',       origin: 'Philippines', destination: 'Europe',   sector: 'Care & Nursing',        originFlag: '🇵🇭', destFlag: '🇪🇺' },
  { slug: 'india-uk',               origin: 'India',       destination: 'UK',       sector: 'Technology',            originFlag: '🇮🇳', destFlag: '🇬🇧' },
  { slug: 'india-canada',           origin: 'India',       destination: 'Canada',   sector: 'Technology',            originFlag: '🇮🇳', destFlag: '🇨🇦' },
  { slug: 'india-australia',        origin: 'India',       destination: 'Australia',sector: 'Technology',            originFlag: '🇮🇳', destFlag: '🇦🇺' },
  { slug: 'morocco-germany',        origin: 'Morocco',     destination: 'Germany',  sector: 'Skilled Trades & IT',   originFlag: '🇲🇦', destFlag: '🇩🇪' },
  { slug: 'morocco-france',         origin: 'Morocco',     destination: 'France',   sector: 'Skilled Trades',        originFlag: '🇲🇦', destFlag: '🇫🇷' },
  { slug: 'nigeria-uk',             origin: 'Nigeria',     destination: 'UK',       sector: 'Technology',            originFlag: '🇳🇬', destFlag: '🇬🇧' },
  { slug: 'nigeria-tech',           origin: 'Nigeria',     destination: 'Global',   sector: 'Technology',            originFlag: '🇳🇬', destFlag: '🌍' },
  { slug: 'pakistan-gulf',          origin: 'Pakistan',    destination: 'Gulf',     sector: 'Construction',          originFlag: '🇵🇰', destFlag: '🌏' },
  { slug: 'kenya-care',             origin: 'Kenya',       destination: 'Europe',   sector: 'Care & Nursing',        originFlag: '🇰🇪', destFlag: '🇪🇺' },
  { slug: 'brazil-portugal',        origin: 'Brazil',      destination: 'Portugal', sector: 'Multiple sectors',      originFlag: '🇧🇷', destFlag: '🇵🇹' },
  { slug: 'indonesia-hospitality',  origin: 'Indonesia',   destination: 'Global',   sector: 'Hospitality',           originFlag: '🇮🇩', destFlag: '🌍' },
  { slug: 'tunisia-germany',        origin: 'Tunisia',     destination: 'Germany',  sector: 'Skilled Trades & IT',   originFlag: '🇹🇳', destFlag: '🇩🇪' },
  { slug: 'tunisia-france',         origin: 'Tunisia',     destination: 'France',   sector: 'Skilled Trades',        originFlag: '🇹🇳', destFlag: '🇫🇷' },
]

export default function CorridorsPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center border-b border-slate-800 w-full">
        <p className="text-indigo-400 text-xs font-bold tracking-[0.18em] uppercase mb-4">
          Global Talent Corridors
        </p>
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          All talent corridors
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          CorridorWork covers {CORRIDORS.length}+ structured talent corridors connecting
          employer demand with qualified international candidates across sectors and regions.
        </p>
      </section>

      {/* Corridor grid */}
      <section className="max-w-5xl mx-auto px-6 py-14 w-full">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8">
          Active corridors
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CORRIDORS.map((corridor) => (
            <Link
              key={corridor.slug}
              href={`/corridors/${corridor.slug}`}
              className="flex items-start gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                <span className="text-xl">{corridor.originFlag}</span>
                <span className="text-slate-600 text-xs">→</span>
                <span className="text-xl">{corridor.destFlag}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-0.5 group-hover:text-indigo-300 transition-colors">
                  {corridor.origin} → {corridor.destination}
                </p>
                <p className="text-slate-500 text-xs">{corridor.sector}</p>
              </div>
              <span className="text-slate-600 text-xs group-hover:text-slate-400 transition-colors shrink-0">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-16 text-center w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-md mx-auto">
            Interested in a specific corridor? Submit employer demand or express candidate
            interest — consent-based and manually reviewed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/global/employers"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Employer intake
            </Link>
            <Link
              href="/global/candidates"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-colors text-sm"
            >
              Candidate interest
            </Link>
          </div>
          <p className="text-slate-600 text-xs mt-4">
            No employment guarantee · No visa guarantee · Consent-based · Manually reviewed
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
