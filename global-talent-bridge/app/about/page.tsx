import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Über uns — CorridorWork',
  description:
    'Was ist CorridorWork? Mission, Fokus auf internationale Talente und ehrliche Beschreibung der MVP-Phase.',
  openGraph: {
    title: 'Über uns — CorridorWork',
    description: 'Mission: Internationale Talente und globale Arbeitgeber strukturiert verbinden.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      <div className="max-w-3xl mx-auto px-4 py-16 flex-1 space-y-12">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Über CorridorWork
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Eine Plattform, die internationale Fachkräfte mit Arbeitgebern verbindet —
            strukturiert, transparent und ehrlich.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="text-3xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-white mb-4">Unsere Mission</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Qualifizierte Fachkräfte aus der ganzen Welt suchen Jobs in Europa und darüber hinaus.
            Gleichzeitig suchen Arbeitgeber internationale Talente mit spezifischen Sprach-
            und Fachkenntnissen.
          </p>
          <p className="text-gray-400 leading-relaxed">
            CorridorWork schafft eine strukturierte Verbindung: Kandidaten geben ihr
            Profil einmal an — Branche, Erfahrung, Sprachkenntnisse. Arbeitgeber definieren
            klare Anforderungen. Das System berechnet einen transparenten Matching-Score.
            Keine Vermutungen, keine versteckten Kriterien.
          </p>
        </div>

        {/* Was wir sind */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Was wir sind</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '✅', text: 'Eine Matching-Plattform für internationale Fachkräfte und Arbeitgeber' },
              { icon: '✅', text: 'Ein strukturiertes System mit transparentem Score (0–100 %)' },
              { icon: '✅', text: 'Kostenlos für Kandidaten — dauerhaft' },
              { icon: '✅', text: 'DSGVO-freundlich mit EU-Datenspeicherung' },
              { icon: '✅', text: 'Ein ehrliches MVP — wir versprechen nichts, was noch nicht fertig ist' },
              { icon: '✅', text: 'Ein wachsendes Projekt mit klarer Roadmap' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                <span className="text-green-400 shrink-0">{item.icon}</span>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Was wir nicht sind */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Was wir nicht sind</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '❌', text: 'Kein klassisches Stellenportal mit öffentlichen Bewerbungsformularen' },
              { icon: '❌', text: 'Kein Headhunter oder Personalvermittler' },
              { icon: '❌', text: 'Keine Plattform mit Fake-Kundenlogos oder erfundenen Zahlen' },
              { icon: '❌', text: 'Keine automatisierten E-Mail-Kampagnen oder Spam' },
              { icon: '❌', text: 'Kein System, das Zahlungen akzeptiert (noch nicht — MVP-Phase)' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                <span className="text-red-400 shrink-0">{item.icon}</span>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fokus */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Unser Fokus</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg mt-0.5">🌐</span>
              <div>
                <p className="text-white font-medium">Internationales Talent</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Wir konzentrieren uns auf Fachkräfte, die Ländergrenzen überschreiten.
                  Deutsch- und Englischkenntnisse sind zentrale Matching-Kriterien, weil sie
                  für internationale Stellen besonders relevant sind.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg mt-0.5">📊</span>
              <div>
                <p className="text-white font-medium">Strukturierte Daten statt Lebenslauf-Chaos</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Statt unstrukturierte PDFs zu analysieren, erfassen wir strukturierte
                  Attribute: Branche, Erfahrungsjahre, Sprachniveau. Das macht
                  Matching möglich und vergleichbar.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-lg mt-0.5">🤝</span>
              <div>
                <p className="text-white font-medium">Beide Seiten gewinnen</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Kandidaten sparen Zeit mit unklar definierten Stellen. Arbeitgeber sparen Zeit
                  mit irrelevanten Bewerbungen. Das System arbeitet für beide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MVP-Phase */}
        <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-300 mb-3">⚠️ Ehrlicher MVP-Hinweis</h2>
          <p className="text-yellow-200/70 text-sm leading-relaxed mb-3">
            CorridorWork befindet sich in der MVP-Phase (Minimum Viable Product).
            Das bedeutet: Die Kernfunktionen (Profil, Matching, Job-Verwaltung, Kandidaten-Matches)
            sind vollständig funktionsfähig und live nutzbar.
          </p>
          <p className="text-yellow-200/70 text-sm leading-relaxed">
            Funktionen, die noch kommen: Stripe-Zahlungen, erweiterte KI-Matching-Algorithmen,
            direkter Kandidaten-Kontakt, Team-Zugänge. Diese sind in Vorbereitung, aber noch
            nicht aktiv. Wir versprechen nichts, was noch nicht da ist.
          </p>
        </div>

        {/* Betrieben von */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">Betrieben von</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            CorridorWork wird betrieben von{' '}
            <span className="text-white">Delta Translation</span>,
            Karlsruhe, Deutschland. Inhaber: Brahim Ben Abla.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Hinweis: Wenn CorridorWork als eigene Firma geführt wird,
            werden diese Angaben angepasst.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/legal/impressum" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Impressum →
            </Link>
            <Link href="/contact" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Kontakt →
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
