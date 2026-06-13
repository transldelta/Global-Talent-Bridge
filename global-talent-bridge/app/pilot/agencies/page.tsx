/**
 * app/pilot/agencies/page.tsx — /pilot/agencies
 *
 * Public agency / white-label partner landing page. No auth required.
 */
import type { Metadata } from 'next'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import { AgencyPartnerForm } from './_components/AgencyPartnerForm'

export const metadata: Metadata = {
  title: 'Agency Partner Pilot — CorridorWork',
  description:
    'White-label talent matching for recruiting agencies, language schools and relocation providers. Pilot free — no automatic payment, no binding contracts.',
  keywords: [
    'White-Label Recruiting',
    'Agency partner pilot',
    'Talent matching agency',
    'Recruiting agency international matching',
    'Language school partner',
    'Relocation provider',
    'CorridorWork partner',
  ],
  openGraph: {
    title: 'Agency Partner Pilot — White-Label Talent Matching | CorridorWork',
    description:
      'Recruiting agencies and relocation providers can use the CorridorWork system as a partner solution. Pilot free, manually controlled.',
    url: 'https://corridorwork.com/pilot/agencies',
    type: 'website',
    locale: 'en_US',
    siteName: 'CorridorWork',
  },
  alternates: {
    canonical: 'https://corridorwork.com/pilot/agencies',
  },
}

export default function AgenciesPilotPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center w-full">
        <div className="inline-block bg-amber-900/30 border border-amber-700/40 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          Partner Pilot — Phase 1
        </div>
        <p className="text-amber-400 text-xs font-bold tracking-[0.18em] uppercase mb-4">
          For Partners
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Your own talent matching.<br />
          <span className="text-amber-400">As a partner solution.</span>
        </h1>
        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Recruiting agencies, language schools and relocation providers can use the
          CorridorWork system as a white-label partner solution. Pilot phase free and without commitment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 text-left">
          {[
            { title: 'White-label',        text: 'Your own branding on the matching system (Phase 2).' },
            { title: 'Talent corridors',   text: 'Access to 10+ verified migration corridors.' },
            { title: 'Market intelligence',text: 'Aggregated demand data — no personal data.' },
            { title: 'Employer pipeline',  text: 'Direct access to pre-qualified employers (pilot).' },
          ].map(b => (
            <div key={b.title} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full mb-3" />
              <div className="font-semibold text-white text-sm mb-1.5">{b.title}</div>
              <div className="text-slate-400 text-sm leading-relaxed">{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-6 pb-16 w-full">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Request partner pilot</h2>
          <p className="text-slate-400 text-sm mb-6">
            Pilot phase · Free · No commitment · No automatic sending
          </p>
          <AgencyPartnerForm />
        </div>
      </section>

      {/* Notes */}
      <section className="max-w-2xl mx-auto px-6 pb-16 text-center w-full">
        <p className="text-xs text-slate-500">
          CorridorWork is in Phase 1 (Pilot). White-label is planned for Phase 2.
          No binding contract. No automatic sending. Manually controlled pilot phase.
        </p>
      </section>

      <PublicFooter />
    </div>
  )
}
