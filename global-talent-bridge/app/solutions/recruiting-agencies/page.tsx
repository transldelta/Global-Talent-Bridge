/**
 * app/solutions/recruiting-agencies/page.tsx — /solutions/recruiting-agencies
 *
 * Public SEO Landingpage für Recruiting-Agenturen, Sprachschulen, Relocation-Dienstleister.
 * Kein Auth. Kein Stripe. Kein automatischer Versand. Kein Scraping.
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'White-Label Talent-Matching für Recruiting-Agenturen | CorridorWork',
  description:
    'Recruiting-Agenturen und Relocation-Dienstleister nutzen CorridorWork als strukturierte Partner-Pipeline. Kostenloser Pilot — keine Visa-Garantie, kein automatischer Versand.',
  keywords: [
    'White-Label Recruiting Agentur',
    'Partner-Lösung Talent-Matching',
    'Recruiting-Agentur internationales Matching',
    'Relocation Dienstleister Partner',
    'Sprachschule Partner Recruiting',
    'CorridorWork Partner Agentur',
  ],
  openGraph: {
    title: 'White-Label Talent-Matching für Recruiting-Agenturen | CorridorWork',
    description:
      'Recruiting-Agenturen nutzen das CorridorWork-System als White-Label Partnerlösung. Pilot kostenlos, manuell gesteuert, DSGVO-konform.',
    url: 'https://corridorwork.com/solutions/recruiting-agencies',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/solutions/recruiting-agencies' },
}

const BENEFITS = [
  {
    icon: '🏷️',
    title: 'White-Label (Phase 2)',
    text: 'Eigenes Branding auf dem Matching-System. Für Agenturen die ihre eigene Marke stärken wollen.',
  },
  {
    icon: '🌍',
    title: '10+ Talent-Korridore',
    text: 'Zugang zu geprüften Migrations-Korridoren: Pflege, IT, Bau, Gastronomie, Logistik.',
  },
  {
    icon: '📊',
    title: 'Market Intelligence',
    text: 'Aggregierte Nachfragedaten für Agenturen — keine personenbezogenen Kandidatendaten.',
  },
  {
    icon: '🔗',
    title: 'Employer Pipeline',
    text: 'Direktzugang zu vorqualifizierten Arbeitgebern aus dem CorridorWork-Netzwerk (Pilot).',
  },
  {
    icon: '🛡️',
    title: 'Compliance',
    text: 'Kein automatischer Outreach. Keine Kandidatengebühren. DSGVO-konform. Manuell gesteuert.',
  },
  {
    icon: '🆓',
    title: 'Pilot kostenlos',
    text: 'Phase 1 ist kostenlos. Kein verbindlicher Vertrag. Keine automatische Zahlung.',
  },
]

const TARGET_AGENCIES = [
  { icon: '🏢', label: 'Recruiting-Agenturen',          desc: 'Für Agenturen mit Fokus auf Fachkräftevermittlung.' },
  { icon: '🗣️', label: 'Sprachschulen',                  desc: 'Mit Kandidaten-Pipeline und Vermittlungsinteresse.' },
  { icon: '✈️', label: 'Relocation-Dienstleister',       desc: 'Unterstützung bei Visa, Wohnungssuche und Onboarding.' },
  { icon: '🌐', label: 'Internationale Personalberater',  desc: 'Berater die europäische Arbeitgeber bedienen.' },
]

export default function SolutionsRecruitingAgenciesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-900">

      {/* Header */}
      <header className="border-b border-purple-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <div className="flex gap-4">
            <a href="/pilot/employers"     className="text-sm text-slate-400 hover:text-white transition-colors">Arbeitgeber →</a>
            <a href="/pilot/agencies"      className="text-sm text-slate-400 hover:text-white transition-colors">Agenturen →</a>
            <a href="/market-intelligence" className="text-sm text-slate-400 hover:text-white transition-colors">Market Intel →</a>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <nav className="text-xs text-slate-500 flex items-center gap-1">
          <a href="/" className="hover:text-slate-300 transition-colors">CorridorWork</a>
          <span>›</span>
          <span className="text-purple-400">Lösungen für Agenturen</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-purple-900 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          🤝 Partner-Lösung — Phase 1
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Recruiting-Agenturen.<br />
          <span className="text-purple-400">Als CorridorWork-Partner.</span>
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          Recruiting-Agenturen, Sprachschulen und Relocation-Dienstleister nutzen das CorridorWork-System
          als strukturierte Talent-Pipeline. Pilot kostenlos und unverbindlich.
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12 text-left">
          {BENEFITS.map(b => (
            <div key={b.title} className="bg-slate-800 rounded-xl p-5 border border-purple-900/60">
              <div className="text-2xl mb-2">{b.icon}</div>
              <div className="font-semibold text-purple-300 text-sm mb-1">{b.title}</div>
              <div className="text-slate-400 text-sm">{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Agencies */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <h2 className="text-white font-semibold text-lg mb-4">🎯 Für wen ist diese Lösung?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TARGET_AGENCIES.map(a => (
            <div key={a.label} className="bg-slate-800 border border-purple-900/40 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">{a.icon}</span>
              <div>
                <div className="font-semibold text-white text-sm">{a.label}</div>
                <div className="text-slate-400 text-xs mt-1">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <h2 className="text-white font-semibold text-lg mb-4">📋 So funktioniert die Partnerschaft</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', icon: '📝', title: 'Partner-Pilot anfragen',  text: 'Kurzformular — kostenlos, unverbindlich.' },
            { step: '2', icon: '👁️', title: 'Manuelle Prüfung',         text: 'CorridorWork prüft die Anfrage persönlich.' },
            { step: '3', icon: '🤝', title: 'Pilot gemeinsam starten',  text: 'Erste Arbeitgeber und Kandidaten sichten.' },
          ].map(s => (
            <div key={s.step} className="bg-slate-800 border border-purple-900/40 rounded-xl p-5 text-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">{s.step}</div>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
              <div className="text-slate-400 text-xs">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Partner-Pilot anfragen</h2>
          <p className="text-gray-500 text-sm mb-6">
            Pilotphase · Kostenlos · Unverbindlich · Kein automatischer Versand · Keine Visa-Garantie
          </p>
          <a
            href="/pilot/agencies"
            className="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-base"
          >
            🤝 Jetzt Partner-Pilot anfragen →
          </a>
          <p className="text-xs text-gray-400 mt-4">
            Nach Einreichung: manuelle Prüfung. Kein automatischer Kontakt. DSGVO-konform.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <p className="text-xs text-slate-500">
          CorridorWork befindet sich in Phase 1 (Pilot). White-Label ist für Phase 2 geplant.
          Kein verbindlicher Vertrag. Kein automatischer Versand. Keine Jobgarantie. Keine Visa-Garantie.
          Keine Kandidatengebühren. Manuell gesteuerte Pilotphase. DSGVO-konform.
          · <a href="/legal/datenschutz" className="hover:text-slate-300 underline">Datenschutz</a>
          · <a href="/legal/impressum"   className="hover:text-slate-300 underline">Impressum</a>
        </p>
      </section>
    </div>
  )
}
