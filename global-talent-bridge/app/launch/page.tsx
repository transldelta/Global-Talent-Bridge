/**
 * app/launch/page.tsx — /launch
 *
 * Public overview page — how to engage with CorridorWork.
 * Inbound-first: the platform collects requests automatically.
 *
 * Safety: No email sending · No Stripe · No scraping · No outreach
 */
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata = {
  title:       'Get Started — CorridorWork',
  description: 'How to work with CorridorWork: employer intake, candidate interest, partner programme and strategic partnership. Inbound-first, manually reviewed.',
}

const ENGAGEMENT_PATHS = [
  {
    rank:    1,
    title:   'Strategic Partnership',
    desc:    'Strategic collaboration, white-label, licensing or acquisition discussion for organisations with serious interest in CorridorWork.',
    cta:     'Explore strategic partnership',
    href:    '/strategic-partnership',
    accent:  'text-amber-400',
    border:  'border-slate-700 hover:border-amber-600/50',
  },
  {
    rank:    2,
    title:   'Agency / Partner Programme',
    desc:    'Recruiting agencies, HR services and B2B platforms can integrate or partner operationally.',
    cta:     'Explore partner programme',
    href:    '/partners',
    accent:  'text-indigo-400',
    border:  'border-slate-700 hover:border-indigo-600/50',
  },
  {
    rank:    3,
    title:   'Employer Interest',
    desc:    'Companies across sectors can submit workforce demand and receive consent-based inbound interest from qualified international talent.',
    cta:     'Submit employer demand',
    href:    '/global/employers',
    accent:  'text-indigo-400',
    border:  'border-slate-700 hover:border-indigo-500/50',
  },
  {
    rank:    4,
    title:   'Candidate Interest',
    desc:    'Qualified workers can express interest in international career opportunities across sectors and countries.',
    cta:     'Submit candidate interest',
    href:    '/global/candidates',
    accent:  'text-emerald-400',
    border:  'border-slate-700 hover:border-emerald-500/50',
  },
]

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-900/30 border border-emerald-700/40 rounded-full text-emerald-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Live — CorridorWork
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Work with CorridorWork.
        </h1>
        <p className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto">
          Structured, compliance-first international talent matching. Connecting qualified
          workers with employers across sectors and countries.
        </p>
        <p className="text-slate-500 text-sm mb-2">
          Inbound-first — the platform collects requests automatically. No cold outreach.
        </p>
        <p className="text-slate-600 text-xs mb-8">
          All submissions reviewed manually. No automatic emails. GDPR-compliant.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/strategic-partnership"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors">
            Strategic partnership
          </Link>
          <Link href="/demo"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-colors">
            See how it works
          </Link>
        </div>
      </section>

      {/* Engagement Paths */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-6">Ways to engage</p>
        <div className="space-y-4">
          {ENGAGEMENT_PATHS.map(path => (
            <div key={path.rank} className={`bg-slate-900 rounded-2xl border ${path.border} p-5 transition-colors`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                    {path.rank}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base mb-1 ${path.accent}`}>{path.title}</h3>
                    <p className="text-slate-400 text-sm">{path.desc}</p>
                  </div>
                </div>
                <Link href={path.href}
                      className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors border border-slate-700 whitespace-nowrap">
                  {path.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional paths (required for test assertions) */}
      {/* These routes are available for specific use cases */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">More resources</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/demo"
                  className="px-4 py-3 bg-slate-800 rounded-lg text-center text-slate-300 text-sm hover:text-white hover:bg-slate-700 transition-colors">
              Demo
            </Link>
            <Link href="/pilot/employers"
                  className="px-4 py-3 bg-slate-800 rounded-lg text-center text-slate-300 text-sm hover:text-white hover:bg-slate-700 transition-colors">
              Employer Pilot
            </Link>
            <Link href="/market-intelligence"
                  className="px-4 py-3 bg-slate-800 rounded-lg text-center text-slate-300 text-sm hover:text-white hover:bg-slate-700 transition-colors">
              Market Intelligence
            </Link>
            <Link href="/buyer-snapshot"
                  className="px-4 py-3 bg-slate-800 rounded-lg text-center text-slate-300 text-sm hover:text-white hover:bg-slate-700 transition-colors">
              Platform Snapshot
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
          <p className="text-slate-400 text-sm font-medium mb-3">Inbound-first approach</p>
          <p className="text-slate-500 text-sm mb-2">
            CorridorWork collects inbound interest via this website — automatically, without manual social media posting.
            All requests go through structured intake forms and are reviewed by our team.
          </p>
          <p className="text-slate-600 text-xs">
            Kein LinkedIn/WhatsApp nötig — no LinkedIn or WhatsApp required.
            The platform operates independently of owner social media activity.
          </p>
        </div>
      </section>

      {/* Compliance note */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 text-center">
          <p className="text-slate-500 text-xs">
            Kein Cold-Outreach &nbsp;·&nbsp; Kein automatischer Versand &nbsp;·&nbsp;
            No Stripe active &nbsp;·&nbsp; No scraping &nbsp;·&nbsp; GDPR-compliant &nbsp;·&nbsp;
            No employment guarantee &nbsp;·&nbsp; No visa guarantee
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
