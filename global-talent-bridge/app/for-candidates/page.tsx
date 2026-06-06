import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Für Kandidaten',
  description:
    'Internationale Fachkräfte: Kostenloses Profil, strukturiertes Matching, transparenter Score. Finde Jobs, die zu dir passen.',
  openGraph: {
    title: 'Für Kandidaten — CorridorWork',
    description: 'Kostenloses Profil und KI-gestütztes Matching für internationale Fachkräfte.',
    type: 'website',
  },
}

export default function ForCandidatesPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-medium mb-6">
            👤 Für internationale Fachkräfte
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Finde Jobs, die wirklich zu dir passen
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Erstelle ein strukturiertes Profil, starte das Matching und sieh sofort,
            welche Jobs zu deiner Erfahrung und deinen Sprachkenntnissen passen.
          </p>
          <Link
            href="/auth/register?role=candidate"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-base"
          >
            Kostenlos registrieren →
          </Link>
          <p className="mt-3 text-sm text-gray-600">Kein Kreditkarte · Dauerhaft kostenlos</p>
        </div>
      </section>

      {/* Ablauf */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-3">
            In 3 Schritten zu deinen Job-Matches
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Keine langen Bewerbungsformulare. Kein Raten, ob du qualifiziert bist.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                icon: '📝',
                title: 'Profil ausfüllen',
                text: 'Branche, Erfahrungsjahre (0–20), Deutschkenntnisse (A1–C2 oder Muttersprache), Englischkenntnisse, Zielland. Einmal angeben — fertig.',
              },
              {
                step: '2',
                icon: '🤖',
                title: 'Matching starten',
                text: 'Ein Klick startet das Matching. Das System vergleicht dein Profil mit allen aktiven Jobs und berechnet einen transparenten Score von 0–100 %.',
              },
              {
                step: '3',
                icon: '🎯',
                title: 'Matches sehen',
                text: 'Du siehst deine Top-Jobs sortiert nach Score: Jobtitel, Unternehmen, Standort, Anforderungen und wie gut du passt.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Was du bekommst
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: '🆓', title: 'Dauerhaft kostenlos', text: 'Registrierung, Profil und Matching sind für Kandidaten kostenlos. Kein versteckter Preis.' },
              { icon: '📊', title: 'Transparenter Score', text: 'Du siehst genau, wie gut du zu einem Job passt — und warum.' },
              { icon: '🌍', title: 'Internationale Jobs', text: 'Jobs aus Deutschland und anderen europäischen Ländern. Fokus auf Stellen, die internationales Talent willkommen heißen.' },
              { icon: '🔒', title: 'Datenschutz', text: 'Dein Profil ist nur für berechtigte Arbeitgeber sichtbar. Keine öffentliche Profilseite.' },
              { icon: '⚡', title: 'Schnell & einfach', text: 'In wenigen Minuten registriert und erstes Matching gestartet. Kein Lebenslauf-Upload erforderlich.' },
              { icon: '📱', title: 'Mobil nutzbar', text: 'Profil erstellen und Matches ansehen — auch vom Handy.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div>
                  <p className="text-white font-medium mb-1">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hinweis MVP */}
      <section className="px-4 py-10 border-t border-gray-800">
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-900/20 border border-blue-800/40 rounded-2xl p-6">
            <h3 className="text-blue-300 font-semibold mb-2">💡 Hinweis: MVP-Phase</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              CorridorWork befindet sich in der MVP-Phase. Das Matching ist
              regelbasiert und wird kontinuierlich verbessert. Alle Grundfunktionen
              (Profil, Matching, Matches ansehen) sind bereits vollständig nutzbar.
              KI-gestütztes Matching und erweiterte Funktionen sind in Vorbereitung.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Bereit loszulegen?</h2>
          <p className="text-gray-400 mb-6">Kostenlos registrieren und ersten Match starten.</p>
          <Link
            href="/auth/register?role=candidate"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
          >
            👤 Als Kandidat registrieren →
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
