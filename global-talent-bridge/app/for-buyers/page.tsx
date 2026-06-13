/**
 * app/for-buyers/page.tsx — /for-buyers
 *
 * Public acquisition inquiry page for CorridorWork.
 * Design: dark, minimal, premium — aligned to slate-950 brand standard.
 * No admin data. No internal admin links. No Buyer Room link.
 * No automatic sending. No Stripe. No fake revenue claims.
 *
 * CTA: "Request details" → links to /contact (existing form).
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'For Buyers — CorridorWork',
  description:
    'CorridorWork is a transfer-ready SaaS asset for global talent corridor intelligence and approval-based candidate workflows. Enquire about acquisition.',
  robots: 'noindex, nofollow',
}

const ASSETS = [
  { label: 'Live domain',         detail: 'corridorwork.com — registered, HTTPS, indexed' },
  { label: 'Full codebase',       detail: 'Next.js · TypeScript strict · clean build · 0 errors' },
  { label: 'Database',            detail: 'Supabase PostgreSQL · EU-Frankfurt · GDPR · RLS active' },
  { label: 'Deployment',          detail: 'Vercel · serverless · auto-deploy from GitHub' },
  { label: 'Corridor engine',     detail: '15+ scored global talent corridors · sector taxonomy' },
  { label: 'Admin toolset',       detail: '10+ tools: pipeline, intelligence, approval queue, outreach' },
  { label: 'Documentation',       detail: '50+ files: architecture, security, transfer guide, buyer package' },
  { label: 'Transfer-prepared',   detail: 'Documented handover steps for all assets: domain, GitHub, Vercel, Supabase' },
]

const FACTS = [
  { label: 'Revenue (MRR)',     value: '€0',          note: 'Pre-revenue asset stage' },
  { label: 'Paying customers',  value: '0',           note: 'No commercial transactions yet' },
  { label: 'Codebase quality',  value: 'Clean',       note: 'TypeScript strict · 0 build errors' },
  { label: 'Test coverage',     value: 'Full suite',  note: 'Automated · 0 failures' },
  { label: 'Asking price',      value: 'Negotiable',  note: 'Asset-based · no MRR multiple' },
]

export default function ForBuyersPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center border-b border-slate-800">
        <p className="text-indigo-400 text-xs font-bold tracking-[0.18em] uppercase mb-5">
          Transfer-Ready SaaS Asset · Asset Stage · Pre-Revenue
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
          CorridorWork is available for acquisition.
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-8">
          A structured corridor intelligence and approval-based growth SaaS for the
          international talent mobility market — built, tested, documented, and
          transfer-ready on day one.
        </p>
        <Link
          href="/contact?interest=buyer_acquisition"
          className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-lg"
        >
          Request details →
        </Link>
        <p className="text-xs text-slate-600 mt-3">
          No automated follow-up. No phone calls without consent. We respond via the contact form.
        </p>
      </section>

      {/* Honest facts */}
      <section className="max-w-3xl mx-auto px-6 py-10 border-b border-slate-800">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-5">
          Honest numbers
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {FACTS.map((f) => (
              <div key={f.label} className="text-center">
                <div className="text-2xl font-bold text-white mb-0.5">{f.value}</div>
                <div className="text-xs text-slate-400">{f.label}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-3xl mx-auto px-6 py-10 border-b border-slate-800">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-5">
          Asset overview
        </p>
        <h2 className="text-xl font-bold text-white mb-5">What you get</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {ASSETS.map((a, i) => (
            <div
              key={a.label}
              className={`flex gap-4 px-5 py-4 ${i < ASSETS.length - 1 ? 'border-b border-slate-800' : ''}`}
            >
              <span className="text-slate-500 text-sm w-36 shrink-0 font-medium">{a.label}</span>
              <span className="text-slate-300 text-sm leading-relaxed">{a.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="max-w-3xl mx-auto px-6 py-10 border-b border-slate-800">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-5">
          Technology
        </p>
        <h2 className="text-xl font-bold text-white mb-5">Tech stack</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {[
            ['Framework',    'Next.js App Router · TypeScript strict'],
            ['Database',     'Supabase PostgreSQL · EU-Frankfurt · GDPR'],
            ['Security',     'RLS on all tables · no_auto_send DB constraint'],
            ['Deployment',   'Vercel · serverless · auto-deploy from GitHub'],
            ['Testing',      'Vitest · automated test suite · 0 failures'],
            ['Code quality', '0 TypeScript errors · ESLint clean'],
          ].map(([layer, tech], i, arr) => (
            <div
              key={layer}
              className={`flex gap-4 px-5 py-3 ${i < arr.length - 1 ? 'border-b border-slate-800' : ''}`}
            >
              <span className="text-slate-500 text-sm w-28 shrink-0">{layer}</span>
              <span className="text-slate-300 text-sm">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance */}
      <section className="max-w-3xl mx-auto px-6 py-10 border-b border-slate-800">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-5">
          Compliance posture
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'No automated outreach (DB constraint)',
              'No scraping — all data manually curated',
              'No Stripe active — payment not connected',
              'No job guarantee in any copy or document',
              'No visa guarantee in any copy or document',
              'No candidate fees — intake is free',
              'Supabase EU-Frankfurt (GDPR)',
              'RLS active on all database tables',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-slate-400 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market validation note */}
      <section className="max-w-3xl mx-auto px-6 py-6 border-b border-slate-800">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-sm leading-relaxed">
            <span className="text-slate-400 font-medium">Market validation status:</span>{' '}
            Market validation process prepared — no revenue or customer traction claimed.
            The platform is pre-revenue and asset-stage. Any stated interest from parties
            is documented via a manual outreach process; no automated outreach has been
            or will be sent.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Interested?</h2>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed max-w-lg mx-auto">
          Contact us via the form below. We will respond with full due diligence access,
          technical documentation, and transfer details.
        </p>
        <Link
          href="/contact?interest=buyer_acquisition"
          className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
        >
          Request details →
        </Link>
        <p className="text-xs text-slate-600 mt-4">
          Full asset transfer starts only after payment is confirmed in escrow.
          No assets are shared before escrow confirmation.
        </p>
      </section>

      <PublicFooter />
    </div>
  )
}
