/**
 * app/pilot/employers/page.tsx — /pilot/employers
 *
 * Public employer pilot landing page. No auth required.
 */
import type { Metadata } from 'next'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import { EmployerPilotForm } from './_components/EmployerPilotForm'

export const metadata: Metadata = {
  title: 'Free Employer Pilot — CorridorWork',
  description:
    'International professionals for healthcare, construction, IT and hospitality. Free pilot — no subscription, no automatic payment, no job guarantee. No-commitment enquiry.',
  keywords: [
    'international recruiting',
    'international talent',
    'employer pilot',
    'employer international talent',
    'healthcare professionals international',
    'cross-border hiring',
    'CorridorWork pilot',
  ],
  openGraph: {
    title: 'Free Employer Pilot — International Talent Matching | CorridorWork',
    description:
      'International professionals from verified talent corridors. Start the pilot free — manually reviewed, GDPR-compliant, no subscription.',
    url: 'https://corridorwork.com/pilot/employers',
    type: 'website',
    locale: 'en_US',
    siteName: 'CorridorWork',
  },
  alternates: {
    canonical: 'https://corridorwork.com/pilot/employers',
  },
}

export default function EmployerPilotPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center w-full">
        <div className="inline-block bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          Free Pilot — Phase 1
        </div>
        <p className="text-indigo-400 text-xs font-bold tracking-[0.18em] uppercase mb-4">
          For Employers
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          International talent.<br />
          <span className="text-indigo-400">Direct. Reviewed. No-risk.</span>
        </h1>
        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          CorridorWork connects employers with qualified international professionals from
          verified talent corridors. Test the matching free and without commitment.
        </p>

        {/* Bullets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
          {[
            { title: 'Free pilot',             text: 'No subscription, no hidden costs, no automatic payment.' },
            { title: 'International matching',  text: 'Access to talent corridors: healthcare, construction, IT, hospitality, logistics.' },
            { title: 'Compliance first',        text: 'No automatic candidate contact. Manually controlled. GDPR-compliant.' },
          ].map(b => (
            <div key={b.title} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full mb-3" />
              <div className="font-semibold text-white text-sm mb-1.5">{b.title}</div>
              <div className="text-slate-400 text-sm leading-relaxed">{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-6 pb-16 w-full">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Request pilot access</h2>
          <p className="text-slate-400 text-sm mb-6">
            Free · No commitment · No subscription · No automatic payment
          </p>
          <EmployerPilotForm />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-12 w-full">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-8 text-center">
          How the pilot works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Submit inquiry',      text: 'Fill in this form. Free, no commitment.' },
            { step: '2', title: 'Manual review',        text: 'CorridorWork reviews your inquiry. No automation.' },
            { step: '3', title: 'Personal contact',     text: 'We get in touch with you directly.' },
            { step: '4', title: 'Start pilot',          text: 'Review first candidates together.' },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-bold flex items-center justify-center mx-auto mb-3 text-sm">{s.step}</div>
              <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
              <div className="text-slate-400 text-xs">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-2xl mx-auto px-6 pb-16 text-center w-full">
        <p className="text-xs text-slate-500">
          CorridorWork is a pilot service (Phase 1). No employment contract. No visa guarantee.
          No automatic payment. Candidate contact only after explicit consent from employer and candidate.
          GDPR-compliant.
        </p>
      </section>

      <PublicFooter />
    </div>
  )
}
