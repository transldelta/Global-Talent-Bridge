/**
 * app/pilot/employers/page.tsx
 *
 * Public Employer Pilot Landingpage — /pilot/employers
 * Kein Auth. Öffentlich zugänglich.
 */
import type { Metadata } from 'next'
import { EmployerPilotForm } from './_components/EmployerPilotForm'

export const metadata: Metadata = {
  title: 'Kostenloser Employer Pilot | CorridorWork',
  description: 'Testen Sie internationales Talent-Matching kostenlos. Kein Abo. Keine automatische Zahlung. Unverbindlicher Pilot für Arbeitgeber.',
}

export default function EmployerPilotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">

      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <a href="/pilot/agencies" className="text-sm text-slate-400 hover:text-white transition-colors">
            Recruiting-Agentur? →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-blue-900 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          🚀 Kostenloser Pilot — Phase 1
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Internationale Fachkräfte.<br />
          <span className="text-blue-400">Direkt. Geprüft. Ohne Risiko.</span>
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          CorridorWork verbindet Arbeitgeber mit qualifizierten internationalen Fachkräften aus geprüften Talent-Korridoren.
          Testen Sie das Matching kostenlos und unverbindlich.
        </p>

        {/* Bullets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
          {[
            { icon: '🆓', title: 'Kostenloser Pilot', text: 'Kein Abo, keine versteckten Kosten, keine automatische Zahlung.' },
            { icon: '🎯', title: 'Internationales Matching', text: 'Zugang zu Talent-Korridoren: Pflege, Bau, IT, Gastronomie, Logistik.' },
            { icon: '🛡️', title: 'Compliance First', text: 'Kein automatischer Kandidatenkontakt. Manuell kontrolliert. DSGVO-konform.' },
          ].map(b => (
            <div key={b.title} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Pilot anfragen</h2>
          <p className="text-gray-500 text-sm mb-6">
            Kostenlos · Unverbindlich · Kein Abo · Keine automatische Zahlung
          </p>
          <EmployerPilotForm />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white text-center mb-8">So funktioniert der Pilot</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '1', icon: '📝', title: 'Anfrage einreichen', text: 'Dieses Formular ausfüllen. Kostenlos.' },
            { step: '2', icon: '👁️', title: 'Manuelle Prüfung', text: 'CorridorWork prüft Ihre Anfrage. Kein Automat.' },
            { step: '3', icon: '📞', title: 'Persönlicher Kontakt', text: 'Wir melden uns direkt bei Ihnen.' },
            { step: '4', icon: '🤝', title: 'Pilot starten', text: 'Gemeinsam erste Kandidaten sichten.' },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">{s.step}</div>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
              <div className="text-slate-400 text-xs">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <p className="text-xs text-slate-500">
          CorridorWork ist ein Pilot-Dienst (Phase 1). Kein Arbeitsvertrag. Keine Visa-Garantie. Keine automatische Zahlung.
          Kandidatenkontakt nur nach expliziter Freigabe durch Arbeitgeber und Kandidat. DSGVO-konform.
        </p>
      </section>
    </div>
  )
}
