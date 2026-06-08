/**
 * app/demo/page.tsx — /demo
 *
 * Public "How CorridorWork works" page.
 * Explains the platform structure for employers, candidates and partners.
 * All candidate profiles are sample data — no real personal data.
 * No Auth · No Stripe · No email sending · No admin links · No internal terms.
 */
import type { Metadata } from 'next'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import Link from 'next/link'
import { INDUSTRY_CONFIGS, CORRIDOR_CONFIGS } from '@/lib/seo-pages'

export const metadata: Metadata = {
  title: 'How CorridorWork Works — Demo',
  description:
    'See how CorridorWork connects employer demand with qualified international talent. Corridor scores, sector demand, consent-based inbound matching. Sample data only — no real candidate profiles.',
  openGraph: {
    title: 'How CorridorWork Works — Demo',
    description:
      'Explore the CorridorWork platform: corridor scores, sector demand, and inbound matching logic. Sample data only.',
    url: 'https://corridorwork.com/demo',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'en_US',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/demo' },
}

// Sample candidate profiles — fictional data only, no real personal information
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

const HOW_IT_WORKS = [
  {
    step: 1,
    role: 'Employers',
    color: 'indigo',
    headline: 'Employers submit workforce demand',
    desc: 'Companies share their hiring needs by sector, region and qualification level. Each submission is reviewed by the CorridorWork team. No automatic matching — no automatic outreach.',
    cta: 'Submit employer demand',
    href: '/global/employers',
  },
  {
    step: 2,
    role: 'Candidates',
    color: 'emerald',
    headline: 'Candidates express interest voluntarily',
    desc: 'Qualified workers submit a voluntary interest form across sectors and countries. This is an interest registration — not a job offer, not a visa service. No candidate fee.',
    cta: 'Submit candidate interest',
    href: '/global/candidates',
  },
  {
    step: 3,
    role: 'Partners',
    color: 'amber',
    headline: 'Partners structure the connection',
    desc: 'Recruiting agencies, training providers, language schools and relocation partners can work with CorridorWork to structure talent corridors between employer demand and candidate interest.',
    cta: 'Request partnership discussion',
    href: '/partners',
  },
]

const TRUST_NOTES = [
  {
    label: 'No job guarantee',
    desc: 'Registering interest does not guarantee employment. No automatic placement.',
  },
  {
    label: 'No visa guarantee',
    desc: 'CorridorWork does not provide visa advice or immigration services.',
  },
  {
    label: 'No automatic outreach',
    desc: 'No automatic emails, no automatic matching, no cold outreach.',
  },
  {
    label: 'No candidate fee',
    desc: 'Expressing interest as a candidate is free. No subscription, no hidden costs.',
  },
  {
    label: 'Admin-reviewed',
    desc: 'All submissions are reviewed manually by the CorridorWork team.',
  },
  {
    label: 'Sample data only',
    desc: 'All profiles and scores shown on this page are fictional example data.',
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-block bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-slate-700">
          Sample data only — no real candidate profiles
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
          How CorridorWork works
        </h1>
        <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
          CorridorWork organizes consent-based inbound interest from international
          candidates and connects it with employer demand across sectors and corridors.
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/50 rounded-full px-4 py-2 text-amber-300 text-sm">
          No employment guarantee · No visa guarantee · No automatic outreach
        </div>
      </section>

      {/* ── HOW IT WORKS: EMPLOYERS / CANDIDATES / PARTNERS ──────────────── */}
      <section className="bg-slate-900 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className={`inline-block text-xs font-bold tracking-widest uppercase mb-3 ${
                  item.color === 'indigo' ? 'text-indigo-400' :
                  item.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  Step {item.step} — {item.role}
                </div>
                <h3 className="text-white font-semibold text-base mb-2 leading-snug">
                  {item.headline}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  className={`text-sm font-semibold hover:underline ${
                    item.color === 'indigo' ? 'text-indigo-400' :
                    item.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {item.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEW PROCESS ────────────────────────────────────────────────── */}
      <section className="bg-slate-950 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-6">
            Review process
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { n: '01', label: 'Intake received',   desc: 'Employer or candidate submits a voluntary form.' },
              { n: '02', label: 'Manual review',      desc: 'CorridorWork team reviews each submission individually.' },
              { n: '03', label: 'Corridor matching',  desc: 'Demand and interest are matched across sectors and corridors.' },
              { n: '04', label: 'Structured handoff', desc: 'Partners facilitate next steps — no automated outreach.' },
            ].map(step => (
              <div key={step.n} className="space-y-2">
                <div className="text-2xl font-bold text-slate-700">{step.n}</div>
                <h4 className="text-white font-semibold text-sm">{step.label}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORRIDOR SCORES (example) ──────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-12 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white font-bold text-lg mb-1">Corridor scores <span className="text-slate-500 text-sm font-normal">(example data)</span></h2>
          <p className="text-slate-500 text-sm mb-6">
            Corridor scores reflect candidate interest density, employer demand and
            compliance readiness for each talent corridor. All values shown are sample data.
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
                  <div className="text-xs text-slate-400">Example Score</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.sectors.slice(0, 2).map(s => (
                    <span key={s} className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMPLE PROFILES ──────────────────────────────────────────────── */}
      <section className="bg-slate-950 px-6 py-12 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white font-bold text-lg mb-1">Example profiles <span className="text-slate-500 text-sm font-normal">(anonymised, fictional)</span></h2>
          <p className="text-slate-500 text-sm mb-6">
            No real personal data. For demonstration purposes only.
            Registering interest does not guarantee employment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_PROFILES.map(p => (
              <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
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
                    <span className="text-xs text-slate-500 ml-1">Example Score</span>
                  </div>
                  <span className="bg-slate-700 border border-slate-600 text-slate-400 text-xs px-2 py-0.5 rounded">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTORS ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-12 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white font-bold text-lg mb-6">Sectors covered</h2>
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
        </div>
      </section>

      {/* ── TRUST NOTES ───────────────────────────────────────────────────── */}
      <section className="bg-slate-950 px-6 py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8">
            Trust notes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRUST_NOTES.map(note => (
              <div key={note.label} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <div>
                  <p className="text-white text-sm font-semibold mb-1">{note.label}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{note.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to get started?</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            No automatic placement · No employment guarantee · No payment processing active
            · Consent-based · Manually reviewed
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

      {/* ── DISCLAIMER ────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 pb-10 text-center">
        <p className="text-xs text-slate-600 leading-relaxed">
          All candidate profiles shown on this page are fictional example data.
          No real personal data. No employment guarantee. No visa guarantee.
          {' '}·{' '}
          <Link href="/legal/datenschutz" className="hover:text-slate-400 underline">Privacy Policy</Link>
          {' '}·{' '}
          <Link href="/legal/impressum" className="hover:text-slate-400 underline">Impressum</Link>
        </p>
      </section>

      <PublicFooter />
    </div>
  )
}
