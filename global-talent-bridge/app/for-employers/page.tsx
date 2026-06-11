/**
 * app/for-employers/page.tsx — /for-employers
 *
 * Premium employer acquisition page for CorridorWork.
 * Design: dark, minimal, B2B SaaS — no emoji decoration, no cheap gradients.
 * No automatic outreach · No Stripe active · Manual review · GDPR-compliant
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'For Employers — CorridorWork',
  description:
    'Connect with qualified international talent. Submit workforce demand across sectors and corridors — structured, consent-based, admin-reviewed.',
  openGraph: {
    title: 'For Employers — CorridorWork',
    description: 'International talent corridors for employers — structured, compliant, globally ready.',
    type: 'website',
  },
}

const WHAT_YOU_SEE = [
  { title: 'Matching score (0–100)',  desc: 'A transparent score per candidate based on sector, experience and language level.' },
  { title: 'Candidate overview',      desc: 'Sector, years of experience, German and English proficiency — at a glance.' },
  { title: 'Job dashboard',           desc: 'All your jobs with status, match count, and detail access.' },
  { title: 'Job status control',      desc: 'Activate or deactivate jobs at any time. Inactive jobs do not participate in matching.' },
  { title: 'KPIs at a glance',        desc: 'Total jobs, active jobs, total matches, best score — always visible.' },
  { title: 'Protected data',          desc: 'Candidate profiles are visible only to verified employers — never publicly accessible.' },
]

const PILOT_BENEFITS = [
  { title: 'MVP is live',          desc: 'The platform is operational: employer profiles, job creation, matching score, candidate overview.' },
  { title: 'No cost',              desc: 'No charges during the pilot phase. No contract, no payment obligation, no hidden terms.' },
  { title: 'Direct contact',       desc: 'Reachable directly for questions. No support ticket system, no automated response.' },
  { title: 'Your feedback counts', desc: 'Pilot employers shape product development directly — issues and requests are implemented fast.' },
]

const PILOT_STEPS = [
  'Create an account or submit a pilot enquiry',
  'Set up your company profile (5 minutes)',
  'Create one or more job listings',
  'Review matching scores and candidate overview',
  'Share direct feedback on what helps and what is missing',
]

export default function ForEmployersPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="px-6 py-20 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-indigo-400 text-xs font-bold tracking-[0.18em] uppercase mb-6">
            For Employers
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Find qualified international talent
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create structured job listings and see which candidates match — sorted by corridor
            score. Admin-reviewed, consent-based, compliance-first.
          </p>
          <Link
            href="/auth/register?role=employer"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-base"
          >
            Start as an employer
          </Link>
          <p className="mt-3 text-sm text-slate-600">No credit card · Free to start</p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8 text-center">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Three steps to your candidates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Create company profile',
                text: 'Company name, sector, country and contact email — done in a few minutes.',
              },
              {
                step: '2',
                title: 'Post a job listing',
                text: 'Job title, sector, location, minimum experience, language requirements and salary range.',
              },
              {
                step: '3',
                title: 'Review candidate matches',
                text: 'Once candidates run matching, they appear ranked by score: name, sector, experience, language level.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mb-4">
                  <span className="text-indigo-400 text-sm font-bold">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What employers see */}
      <section className="px-6 py-16 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8 text-center">
            Employer view
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            What you see as an employer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHAT_YOU_SEE.map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                <div>
                  <p className="text-white font-medium mb-1 text-sm">{item.title}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 border-b border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
            Pricing
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">Plans</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Multiple plans are available for employers. In the current MVP phase,
            all features are available at no cost. Payments will be activated in a later phase.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { name: 'Free',       price: '€0',       accent: 'text-slate-300' },
              { name: 'Starter',    price: '€49/mo',   accent: 'text-indigo-300' },
              { name: 'Growth',     price: '€149/mo',  accent: 'text-indigo-300' },
              { name: 'Enterprise', price: '€499/mo',  accent: 'text-amber-300' },
            ].map((plan) => (
              <div key={plan.name} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <p className={`text-sm font-semibold mb-1 ${plan.accent}`}>{plan.name}</p>
                <p className="text-slate-400 text-xs">{plan.price}</p>
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 text-xs mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            Payment processing is not active in the current MVP phase.
          </div>
          <div>
            <Link
              href="/pricing"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View full pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* Pilot employers */}
      <section className="px-6 py-16 border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
              Pilot programme
            </p>
            <h2 className="text-3xl font-bold text-white mb-3">Pilot employers wanted</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto">
              CorridorWork is live and fully operational — now looking for companies
              to test and shape the platform first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {PILOT_BENEFITS.map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <div>
                  <p className="text-white font-medium mb-1 text-sm">{item.title}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              How the pilot phase works
            </h3>
            <div className="space-y-3">
              {PILOT_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-slate-400 text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?role=employer&interest=pilot_employer"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-center"
            >
              Request pilot access
            </Link>
            <Link
              href="/auth/register?role=employer"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-lg transition-colors text-center"
            >
              Register directly
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-slate-600">
            Pilot request: direct conversation, no automated emails, no spam.
            Direct registration: get started immediately, no conversation needed.
          </p>
        </div>
      </section>

      {/* Upcoming premium features */}
      <section className="px-6 py-16 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
            Roadmap
          </p>
          <h2 className="text-2xl font-bold text-white mb-3">Upcoming premium features</h2>
          <p className="text-slate-400 text-sm mb-8">
            These features are in preparation and will be available in premium plans.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Extended candidate profiles',
              'Direct candidate contact',
              'More concurrent listings',
              'Priority matching',
              'Team access',
              'CSV export',
              'API access',
              'Dedicated support',
            ].map((f) => (
              <span
                key={f}
                className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-400 rounded-lg"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-16 border-b border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Start at no cost</h2>
          <p className="text-slate-400 mb-8">
            Create a company profile, post your first job, find candidates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=employer"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
            >
              Register as employer
            </Link>
            <Link
              href="/contact?role=employer&interest=pilot_employer"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-lg transition-colors"
            >
              Request pilot access
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            Pilot request: direct conversation, no automated emails, no spam.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
