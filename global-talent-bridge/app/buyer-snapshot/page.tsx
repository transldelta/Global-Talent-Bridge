/**
 * app/buyer-snapshot/page.tsx — /buyer-snapshot
 *
 * Public platform snapshot page.
 * Gives interested parties a clear 2-minute overview: what is live, what is not,
 * how to engage. No internal admin labels. No fabricated metrics.
 *
 * Safety: No email sending · No Stripe · No scraping · No admin details
 */
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata = {
  title:       'Platform Snapshot — CorridorWork',
  description: 'A 2-minute overview of what CorridorWork is, what is live, and how to engage. No revenue promises — all verifiable.',
}

const LIVE_ASSETS = [
  { label: 'Live domain',           detail: 'corridorwork.com',                         status: 'Live' },
  { label: 'Tech stack',            detail: 'Next.js 14, Supabase, Vercel, TypeScript',  status: 'Production' },
  { label: 'Scheduled processes',   detail: 'Daily platform jobs via Vercel Cron',       status: 'Active' },
  { label: 'Inbound channels',      detail: '4 intake forms live (employer, candidate, partner, strategic)', status: 'Live' },
  { label: 'Public pages',          detail: '16+ indexable pages + sitemap.xml',         status: 'Indexable' },
  { label: 'Compliance layer',      detail: 'Safety-first: no scraping, no auto-outreach', status: 'Active' },
]

// These identifiers are used as data values in the inbound channel system
const INBOUND_CHANNELS = [
  {
    rank:  1,
    type:  'strategic_partner',
    title: 'Strategic Partner / White-Label / Acquisition',
    url:   '/strategic-partnership',
    note:  'Strategic partnership, white-label solution, licensing or acquisition discussion.',
  },
  {
    rank:  2,
    type:  'agency_partner',
    title: 'Agency / Partner',
    url:   '/partners',
    note:  'Recruiting agencies and HR service providers.',
  },
  {
    rank:  3,
    type:  'employer_pilot',
    title: 'Employer Interest',
    url:   '/global/employers',
    note:  'Companies interested in international talent across sectors.',
  },
  {
    rank:  4,
    type:  'market_intelligence',
    title: 'Market Intelligence',
    url:   '/market-intelligence',
    note:  'Aggregated corridor and demand data for strategic analysis.',
  },
]

const NOT_ACTIVE = [
  'No emails sent automatically',
  'No cold outreach or bulk messaging',
  'No Stripe or payment processing active',
  'No data scraping',
  'No employment guarantee or visa guarantee',
  'No active revenue contracts (pilot stage)',
  'No public personal candidate profiles',
  'No fabricated revenue figures',
]

const ENGAGEMENT_OPTIONS = [
  { title: 'Strategic partnership',   desc: 'Joint market coverage, revenue sharing or operational collaboration.' },
  { title: 'White-label solution',    desc: 'Use the CorridorWork platform under your own branding.' },
  { title: 'Licensing / API access',  desc: 'Technology licence or API integration.' },
  { title: 'Acquisition / investment', desc: 'Serious interest in acquisition or strategic stake.' },
  { title: 'Market intelligence',     desc: 'Aggregated corridor and demand data for strategic analysis.' },
]

export default function BuyerSnapshotPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-14 pb-8">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-5">
          Platform snapshot · 2 minutes
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          CorridorWork platform snapshot
        </h1>
        <p className="text-gray-400 text-base mb-4">
          CorridorWork is a live platform for structured, compliance-first international
          talent matching. The platform collects inbound interest via four consent-based
          channels and processes it manually — no automatic outreach.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium mb-3">
          Inbound-first — the platform collects interest automatically. No cold outreach. No spam.
        </div>
        <p className="text-gray-500 text-sm">
          Pilot stage — no active revenue contracts. All figures verifiable. No fabricated metrics.
        </p>
      </section>

      {/* Live Assets */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-white font-bold text-lg mb-3">Platform assets</h2>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
          {LIVE_ASSETS.map((asset, i) => (
            <div key={asset.label}
                 className={`flex items-center gap-3 px-4 py-3 ${i < LIVE_ASSETS.length - 1 ? 'border-b border-slate-800' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="text-gray-400 text-xs">{asset.label}</div>
                <div className="text-white text-sm">{asset.detail}</div>
              </div>
              <span className="text-green-400 text-xs font-medium shrink-0">{asset.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Inbound Channels */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-white font-bold text-lg mb-3">Inbound channels</h2>
        <div className="space-y-2">
          {INBOUND_CHANNELS.map(channel => (
            <div key={channel.rank} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {channel.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm">{channel.title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{channel.note}</div>
                <div className="text-gray-600 text-xs mt-0.5 font-mono">corridorwork.com{channel.url}</div>
              </div>
              <span className="text-green-400 text-xs font-medium shrink-0">Live</span>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-white font-bold text-lg mb-3">Compliance configuration</h2>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-4">
          <p className="text-slate-400 text-xs mb-3">
            Environment configuration — transparency for due diligence:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { k: 'EMAIL_PROVIDER',          v: 'none' },
              { k: 'OUTREACH_EMAIL_PROVIDER', v: 'none' },
              { k: 'Stripe',                  v: 'inactive' },
              { k: 'Scraping',                v: 'never' },
              { k: 'Phase',                   v: 'Pilot' },
            ].map(row => (
              <div key={row.k} className="flex items-center justify-between px-3 py-1.5 bg-slate-800 rounded-lg">
                <span className="text-gray-400 text-xs font-mono">{row.k}</span>
                <span className="text-green-400 text-xs font-semibold">{row.v}</span>
              </div>
            ))}
          </div>
        </div>
        <h3 className="text-gray-400 text-sm font-semibold mb-2">Not active:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {NOT_ACTIVE.map(item => (
            <div key={item} className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Engagement options */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-white font-bold text-lg mb-3">Forms of engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ENGAGEMENT_OPTIONS.map(f => (
            <div key={f.title} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="text-white font-medium text-sm mb-1">{f.title}</div>
              <p className="text-gray-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
          <p className="text-slate-300 text-sm mb-4">
            Serious interest in a strategic partnership, white-label solution or acquisition?
            All submissions are reviewed manually — confidential, no automatic outreach.
          </p>
          <Link href="/strategic-partnership"
                className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors text-base">
            Submit strategic interest
          </Link>
          <p className="text-slate-500 text-xs mt-3">
            No spam. No automatic emails. Manually reviewed. GDPR-compliant.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-600 text-xs text-center">
            CorridorWork is in pilot stage. No revenue guarantees.
            No guaranteed growth figures. No binding contracts without written agreement.
            All listed features are live and verifiable.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
