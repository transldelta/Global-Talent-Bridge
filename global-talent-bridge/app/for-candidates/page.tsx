/**
 * app/for-candidates/page.tsx — /for-candidates
 *
 * Premium candidate acquisition page for CorridorWork.
 * Design: dark, minimal, B2B SaaS — no emoji decoration, no cheap gradients.
 * No automatic outreach · No fees · Consent-based · GDPR-compliant
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'For Candidates — CorridorWork',
  description:
    'Express interest in international career opportunities — free, consent-based. No employment guarantee. No automatic outreach.',
  openGraph: {
    title: 'For Candidates — CorridorWork',
    description: 'Free, consent-based interest registration for international professionals.',
    type: 'website',
  },
}

const CANDIDATE_BENEFITS = [
  { title: 'Free — always',         desc: 'Registration, profile and matching are free for candidates. No hidden costs, no subscription.' },
  { title: 'Transparent score',     desc: 'You see exactly how well you match a role — and why.' },
  { title: 'International roles',   desc: 'Roles across Germany and Europe. Focus on positions that welcome international talent.' },
  { title: 'Data privacy',          desc: 'Your profile is visible only to verified employers. No public profile page.' },
  { title: 'Fast and simple',       desc: 'Registered and first match started in minutes. No CV upload required.' },
  { title: 'Mobile-friendly',       desc: 'Create your profile and review matches — including on mobile.' },
]

export default function ForCandidatesPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="px-6 py-20 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-emerald-400 text-xs font-bold tracking-[0.18em] uppercase mb-6">
            For Candidates
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Find roles that genuinely fit
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create a structured profile, register your interest by corridor and sector,
            and see which roles match your experience and language level.
          </p>
          <Link
            href="/auth/register?role=candidate"
            className="inline-block px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors text-base"
          >
            Register free
          </Link>
          <p className="mt-3 text-sm text-slate-600">No credit card · Free — always</p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8 text-center">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Three steps to your matches
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Complete your profile',
                text: 'Sector, years of experience (0–20), German level (A1–C2 or native), English level, target country. Once — done.',
              },
              {
                step: '2',
                title: 'Run matching',
                text: 'One click starts matching. The system compares your profile against all active jobs and calculates a transparent score from 0–100.',
              },
              {
                step: '3',
                title: 'Review your matches',
                text: 'See your top roles sorted by score: job title, company, location, requirements and how well you fit.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mb-4">
                  <span className="text-emerald-400 text-sm font-bold">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8 text-center">
            What you get
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Built for international professionals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CANDIDATE_BENEFITS.map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <div>
                  <p className="text-white font-medium mb-1 text-sm">{item.title}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MVP notice */}
      <section className="px-6 py-10 border-b border-slate-800">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">
              Platform status
            </p>
            <p className="text-slate-300 text-sm font-semibold mb-1">MVP phase</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              CorridorWork is in the MVP phase. Matching is rule-based and is being
              continuously improved. All core features (profile, matching, match review)
              are fully operational. AI-assisted matching and extended features are in preparation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 border-b border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Register free and run your first match.</p>
          <Link
            href="/auth/register?role=candidate"
            className="inline-block px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
          >
            Register as candidate
          </Link>
          <p className="mt-3 text-xs text-slate-600">
            No employment guarantee · No visa guarantee · Consent-based · Free
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
