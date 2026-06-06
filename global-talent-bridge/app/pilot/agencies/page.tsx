/**
 * app/pilot/agencies/page.tsx
 *
 * Public Agency / White-Label Partner Landingpage — /pilot/agencies
 */
import type { Metadata } from 'next'
import { AgencyPartnerForm } from './_components/AgencyPartnerForm'

export const metadata: Metadata = {
  title: 'Partner-Pilot für Agenturen | CorridorWork',
  description: 'White-Label Talent-Matching für Recruiting-Agenturen, Sprachschulen und Relocation-Dienstleister. Pilotphase kostenlos.',
}

export default function AgenciesPilotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-900">

      {/* Header */}
      <header className="border-b border-purple-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <a href="/pilot/employers" className="text-sm text-slate-400 hover:text-white transition-colors">
            Arbeitgeber? →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-purple-900 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          🤝 Partner-Pilot — Phase 1
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Eigenes Talent-Matching.<br />
          <span className="text-purple-400">Als Partnerlösung.</span>
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          Recruiting-Agenturen, Sprachschulen und Relocation-Dienstleister können das CorridorWork-System
          als White-Label Partnerlösung nutzen. Pilotphase kostenlos und unverbindlich.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 text-left">
          {[
            { icon: '🏷️', title: 'White-Label', text: 'Eigenes Branding auf dem Matching-System (Phase 2).' },
            { icon: '🌍', title: 'Talent-Korridore', text: 'Zugang zu 10+ geprüften Migrations-Korridoren.' },
            { icon: '📊', title: 'Market Intelligence', text: 'Aggregierte Nachfragedaten — keine personenbezogenen Daten.' },
            { icon: '🔗', title: 'Employer Pipeline', text: 'Direktzugang zu vorqualifizierten Arbeitgebern (Pilot).' },
          ].map(b => (
            <div key={b.title} className="bg-slate-800 rounded-xl p-5 border border-purple-900">
              <div className="text-2xl mb-2">{b.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{b.title}</div>
              <div className="text-slate-400 text-sm">{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Partner-Pilot anfragen</h2>
          <p className="text-gray-500 text-sm mb-6">
            Pilotphase · Kostenlos · Unverbindlich · Kein automatischer Versand
          </p>
          <AgencyPartnerForm />
        </div>
      </section>

      {/* Hinweise */}
      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <p className="text-xs text-slate-500">
          CorridorWork befindet sich in Phase 1 (Pilot). White-Label ist für Phase 2 geplant.
          Kein verbindlicher Vertrag. Kein automatischer Versand. Manuell gesteuerte Pilotphase.
        </p>
      </section>
    </div>
  )
}
