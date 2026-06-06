import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Allgemeine Geschäftsbedingungen für die Nutzung von CorridorWork.',
}

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      <div className="max-w-2xl mx-auto px-4 py-16 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-400 transition-colors">Startseite</Link>
          <span>/</span>
          <span className="text-gray-400">AGB</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-8 text-sm leading-relaxed">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Allgemeine Geschäftsbedingungen</h1>
            <p className="text-gray-500 text-sm">Stand: Juni 2026</p>
          </div>

          {/* §1 Geltungsbereich */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 1 Geltungsbereich</h2>
            <div className="text-gray-400 space-y-2">
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der
                Online-Plattform <strong className="text-white">CorridorWork</strong>,
                betrieben von Brahim Ben Abla / Delta Translation, Schlesier Str. 64,
                76227 Karlsruhe, Deutschland (nachfolgend &bdquo;Anbieter&ldquo;).
              </p>
              <p>
                Durch die Registrierung auf der Plattform akzeptierst du diese AGB.
              </p>
            </div>
          </div>

          {/* §2 Leistungen */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 2 Leistungen der Plattform</h2>
            <div className="text-gray-400 space-y-2">
              <p>
                CorridorWork stellt eine Online-Plattform bereit, die internationale
                Fachkräfte (Kandidaten) mit Arbeitgebern verbindet. Die Kernleistungen umfassen:
              </p>
              <ul className="list-none space-y-1 ml-4">
                {[
                  'Erstellung und Verwaltung von Kandidatenprofilen',
                  'Erstellung und Verwaltung von Stellenangeboten (Jobs)',
                  'Berechnung eines regelbasierten Matching-Scores',
                  'Anzeige von Kandidaten-Matches für Arbeitgeber',
                  'Anzeige von Job-Matches für Kandidaten',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Die Plattform befindet sich in der MVP-Phase. Der Anbieter behält sich vor,
                Funktionen zu ändern, hinzuzufügen oder zu entfernen.
              </p>
            </div>
          </div>

          {/* §3 Registrierung */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 3 Registrierung & Nutzerkonto</h2>
            <div className="text-gray-400 space-y-2">
              <p>
                Die Registrierung ist kostenlos und erfordert eine gültige E-Mail-Adresse.
                Nutzer sind verpflichtet, wahrheitsgemäße Angaben zu machen.
              </p>
              <p>
                Der Anbieter behält sich vor, Konten bei Verstoß gegen diese AGB oder bei
                Missbrauch zu sperren oder zu löschen.
              </p>
              <p>
                Jede natürliche oder juristische Person darf nur ein Konto pro Rolle
                (Kandidat oder Arbeitgeber) führen.
              </p>
            </div>
          </div>

          {/* §4 Nutzungsbedingungen */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 4 Nutzungsbedingungen</h2>
            <div className="text-gray-400 space-y-2">
              <p>Folgendes ist untersagt:</p>
              <ul className="list-none space-y-1 ml-4">
                {[
                  'Falsche oder irreführende Angaben im Profil oder in Stellenanzeigen',
                  'Automatisiertes Scraping oder Massenabrufe der Plattform',
                  'Weiterverkauf von Kandidaten- oder Arbeitgeberdaten',
                  'Nutzung der Plattform für Spam oder unerwünschte Kontaktaufnahmen',
                  'Versuche, Sicherheitsmechanismen zu umgehen',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* §5 Vergütung */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 5 Vergütung</h2>
            <div className="text-gray-400 space-y-2">
              <p>
                Die Nutzung der Plattform ist in der aktuellen MVP-Phase für Kandidaten
                <strong className="text-white"> dauerhaft kostenlos</strong>.
              </p>
              <p>
                Für Arbeitgeber sind alle Grundfunktionen in der MVP-Phase kostenlos.
                Premium-Pläne sind vorbereitet, aber{' '}
                <strong className="text-white">Zahlungen sind noch nicht aktiviert</strong>.
                Es werden keine Zahlungen erhoben, bis dies ausdrücklich angekündigt wird.
              </p>
            </div>
          </div>

          {/* §6 Haftung */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 6 Haftungsbeschränkung</h2>
            <div className="text-gray-400 space-y-2">
              <p>
                Der Anbieter haftet nicht für:
              </p>
              <ul className="list-none space-y-1 ml-4">
                {[
                  'Die Richtigkeit der Angaben in Kandidatenprofilen oder Stellenanzeigen',
                  'Erfolgreiche Vermittlung zwischen Kandidaten und Arbeitgebern',
                  'Ausfälle oder Unterbrechungen der Plattform',
                  'Schäden durch Datenverlust, soweit zulässig gesetzlich begrenzt',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-500 shrink-0">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Die Haftung für grobe Fahrlässigkeit und Vorsatz sowie für Personenschäden
                bleibt unberührt.
              </p>
            </div>
          </div>

          {/* §7 Datenschutz */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 7 Datenschutz</h2>
            <p className="text-gray-400">
              Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{' '}
              <Link href="/legal/datenschutz" className="text-blue-400 hover:text-blue-300">
                Datenschutzerklärung
              </Link>
              . Die Datenschutzerklärung ist Bestandteil dieser AGB.
            </p>
          </div>

          {/* §8 Änderungen */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 8 Änderungen der AGB</h2>
            <p className="text-gray-400">
              Der Anbieter behält sich vor, diese AGB mit angemessener Vorankündigungsfrist
              zu ändern. Nutzer werden über wesentliche Änderungen informiert. Die weitere
              Nutzung der Plattform nach Änderung gilt als Zustimmung.
            </p>
          </div>

          {/* §9 Anwendbares Recht */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 9 Anwendbares Recht</h2>
            <p className="text-gray-400">
              Es gilt deutsches Recht. Gerichtsstand ist Karlsruhe, Deutschland,
              soweit gesetzlich zulässig.
            </p>
          </div>

          {/* §10 Salvatorische Klausel */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">§ 10 Salvatorische Klausel</h2>
            <p className="text-gray-400">
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die
              Wirksamkeit der übrigen Bestimmungen davon unberührt.
            </p>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
