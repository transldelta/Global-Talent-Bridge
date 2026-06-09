/**
 * app/for-buyers/page.tsx
 *
 * Public acquisition inquiry page for CorridorWork.
 * No admin data. No internal admin links. No Buyer Room link.
 * No automatic sending. No Stripe. No fake revenue claims.
 *
 * CTA: "Request details" → links to /contact (existing form).
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/app/_components/NavBar'

export const metadata: Metadata = {
  title: 'For Buyers — CorridorWork',
  description:
    'CorridorWork is a transfer-ready SaaS asset for global talent corridor intelligence and approval-based candidate workflows. Enquire about acquisition.',
  robots: 'index, follow',
}

const ASSETS = [
  { icon: '🌐', label: 'Live domain',      detail: 'corridorwork.com — registered, HTTPS, indexed' },
  { icon: '💻', label: 'Full codebase',    detail: 'Next.js · TypeScript strict · 4 352 passing tests · 0 errors' },
  { icon: '🗄️', label: 'Database',         detail: 'Supabase PostgreSQL 17 · EU-Frankfurt · GDPR · RLS active' },
  { icon: '🚀', label: 'Deployment',       detail: 'Vercel · serverless · auto-deploy · 163 pages' },
  { icon: '🧠', label: 'Corridor engine',  detail: '8 scored global talent corridors · Buyer Opportunity Scores' },
  { icon: '🔧', label: 'Admin toolset',    detail: '10+ tools: pipeline, intelligence, approval queue, buyer room' },
  { icon: '📄', label: 'Documentation',    detail: '50+ files: architecture, security, transfer guide, buyer package' },
  { icon: '🔄', label: 'Transfer-prepared', detail: 'Documented handover steps for all 4 assets; timing depends on domain, GitHub, Vercel, Supabase, and buyer-side setup' },
]

const FACTS = [
  { label: 'Revenue (MRR)',      value: '€0',        note: 'Pre-revenue asset stage' },
  { label: 'Paying customers',   value: '0',         note: 'No commercial transactions yet' },
  { label: 'Test suite',         value: '4 352 ✅',  note: '0 failures' },
  { label: 'TypeScript errors',  value: '0',         note: 'tsc --noEmit clean' },
  { label: 'Asking price',       value: 'Negotiable', note: 'Asset-based · no MRR multiple' },
]

export default function ForBuyersPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
          Transfer-Ready SaaS Asset · Asset Stage · Pre-Revenue
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
          CorridorWork is available for acquisition.
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">
          A structured corridor intelligence and approval-based growth SaaS for the
          international talent mobility market — built, tested, documented, and
          transfer-ready on day one.
        </p>
        <Link
          href="/contact?interest=buyer_acquisition"
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-lg"
        >
          Request details →
        </Link>
        <p className="text-xs text-gray-600 mt-3">
          No automated follow-up. No phone calls without consent. We respond via the contact form.
        </p>
      </section>

      {/* Honest facts */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Honest numbers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FACTS.map((f) => (
              <div key={f.label} className="text-center">
                <div className="text-2xl font-bold text-white">{f.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{f.label}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-6">What you get</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ASSETS.map((a) => (
            <div
              key={a.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-3"
            >
              <span className="text-2xl shrink-0 mt-0.5">{a.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm">{a.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-4">Technology</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {[
            ['Framework',   'Next.js App Router · TypeScript strict'],
            ['Database',    'Supabase PostgreSQL 17 · EU-Frankfurt · GDPR'],
            ['Security',    'RLS on all tables · no_auto_send DB constraint'],
            ['Deployment',  'Vercel · serverless · auto-deploy from GitHub'],
            ['Testing',     'Vitest · 4 352 tests · 48 files · 0 failures'],
            ['Code quality','0 TypeScript errors · ESLint clean'],
          ].map(([layer, tech]) => (
            <div
              key={layer}
              className="flex gap-4 px-5 py-3 border-b border-gray-800 last:border-0"
            >
              <span className="text-sm text-gray-500 w-28 shrink-0">{layer}</span>
              <span className="text-sm text-gray-200">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Compliance posture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-400">
            {[
              '✅ No automated outreach (DB constraint)',
              '✅ No scraping — all data manually curated',
              '✅ No Stripe active — payment not connected',
              '✅ No job guarantee in any copy or document',
              '✅ No visa guarantee in any copy or document',
              '✅ No candidate fees — intake is free',
              '✅ Supabase EU-Frankfurt (GDPR)',
              '✅ RLS active on all database tables',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Market validation note */}
      <section className="max-w-3xl mx-auto px-6 pb-10">
        <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-400">
          <p>
            <span className="text-gray-300 font-medium">Market validation status:</span>{' '}
            Market validation process prepared — no revenue or customer traction claimed.
            The platform is pre-revenue and asset-stage. Any stated interest from parties
            is documented via a manual outreach process; no automated outreach has been
            or will be sent.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Interested?</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Contact us via the form below. We will respond with full due diligence access,
          technical documentation, and transfer details.
        </p>
        <Link
          href="/contact?interest=buyer_acquisition"
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
        >
          Request details →
        </Link>
        <p className="text-xs text-gray-600 mt-4">
          Full asset transfer starts only after payment is confirmed in escrow.
          No assets are shared before escrow confirmation.
        </p>
      </section>
    </div>
  )
}
