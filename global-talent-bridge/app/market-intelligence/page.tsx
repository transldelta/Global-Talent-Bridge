/**
 * app/market-intelligence/page.tsx
 *
 * Market Intelligence Landingpage — /market-intelligence
 * Öffentlich zugänglich. Kein Auth.
 */
import type { Metadata } from 'next'
import { MarketIntelForm } from './_components/MarketIntelForm'

export const metadata: Metadata = {
  title: 'Market Intelligence Reports',
  description:
    'Aggregierte Talent-Korridor-Daten für B2B-Entscheider: Nachfragebranchen, Arbeitgeberbedarf, Korridor-Scores. Keine personenbezogenen Daten. Beta-Zugang kostenfrei.',
  keywords: [
    'Market Intelligence Recruiting',
    'Talent-Korridor Daten',
    'internationales Recruiting Marktdaten',
    'Arbeitgeberbedarf Fachkräfte',
    'Korridor-Score',
    'B2B Marktdaten',
    'CorridorWork Market Intelligence',
  ],
  openGraph: {
    title: 'Market Intelligence Reports — Talent-Korridor Insights | CorridorWork',
    description:
      'Aggregierte Marktdaten zu internationalen Talent-Korridoren: Korridor-Scores, Branchennachfrage, Arbeitgeberbedarf. Keine personenbezogenen Daten.',
    url: 'https://corridorwork.com/market-intelligence',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: {
    canonical: 'https://corridorwork.com/market-intelligence',
  },
}

export default function MarketIntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-slate-900">

      {/* Header */}
      <header className="border-b border-emerald-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <div className="flex gap-4">
            <a href="/pilot/employers" className="text-sm text-slate-400 hover:text-white transition-colors">Arbeitgeber →</a>
            <a href="/pilot/agencies"  className="text-sm text-slate-400 hover:text-white transition-colors">Agenturen →</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-emerald-900 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          📊 Market Intelligence — Beta
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Talent-Korridor Insights.<br />
          <span className="text-emerald-400">Aggregiert. Anonym. B2B.</span>
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          Erhalten Sie aggregierte Marktdaten zu internationalen Talent-Korridoren:
          Nachfragebranchen, Arbeitgeberbedarf und Korridor-Scores — keine personenbezogenen Daten.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
          {[
            { icon: '🌍', title: 'Korridor-Scores', text: '10+ Talent-Korridore mit Nachfrage-Score, Rechtslage und Branchenfokus.' },
            { icon: '🏭', title: 'Branchennachfrage', text: 'Aggregierte Arbeitgebernachfrage nach Sektor und Herkunftsland.' },
            { icon: '🔒', title: 'DSGVO-konform', text: 'Keine personenbezogenen Daten. Nur aggregierte, anonymisierte Insights.' },
          ].map(b => (
            <div key={b.title} className="bg-slate-800 rounded-xl p-5 border border-emerald-900">
              <div className="text-2xl mb-2">{b.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{b.title}</div>
              <div className="text-slate-400 text-sm">{b.text}</div>
            </div>
          ))}
        </div>

        {/* Sample Data */}
        <div className="bg-slate-800 border border-emerald-900 rounded-xl p-6 text-left mb-8">
          <h3 className="text-sm font-semibold text-emerald-300 uppercase mb-4">📋 Beispiel: Korridor-Score Philippinen → Deutschland</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-slate-400 text-xs">Gesamtscore</div>
              <div className="text-white font-bold text-2xl">92</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Top-Sektoren</div>
              <div className="text-white text-sm">Pflege, Bau, IT</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Priorität</div>
              <div className="text-emerald-400 font-semibold">High</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">* Aggregierter Beispielwert. Keine Kandidatendaten enthalten.</p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Report-Interesse anmelden</h2>
          <p className="text-gray-500 text-sm mb-6">
            Beta · Kostenlos · Keine automatische E-Mail · Manuell geprüft
          </p>
          <MarketIntelForm />
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <p className="text-xs text-slate-500">
          CorridorWork Market Intelligence ist in Phase 1 (Beta). Reports werden manuell erstellt und verteilt.
          Keine automatischen E-Mails. Keine personenbezogenen Kandidatendaten.
        </p>
      </section>
    </div>
  )
}
