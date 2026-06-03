import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Datenschutz — Global Talent Bridge',
  description: 'Datenschutzerklärung für Global Talent Bridge gemäß DSGVO.',
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      <div className="max-w-2xl mx-auto px-4 py-16 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-400 transition-colors">Startseite</Link>
          <span>/</span>
          <span className="text-gray-400">Datenschutz</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-8 text-sm leading-relaxed">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Datenschutzerklärung</h1>
            <p className="text-gray-500 text-sm">Stand: Juni 2026 · MVP-Entwurf</p>
          </div>

          {/* MVP-Hinweis */}
          <div className="p-4 bg-yellow-900/20 border border-yellow-800/40 rounded-xl">
            <p className="text-yellow-300 text-sm">
              <strong>Hinweis:</strong> Dies ist ein MVP-Entwurf der Datenschutzerklärung.
              Er stellt keine abschließende Rechtsberatung dar. Bei rechtlichen Fragen wende
              dich an einen qualifizierten Datenschutzbeauftragten.
            </p>
          </div>

          {/* 1. Verantwortlicher */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Verantwortlicher</h2>
            <p className="text-gray-400">
              Verantwortlicher im Sinne der DSGVO ist:
            </p>
            <div className="mt-3 text-gray-400 space-y-1">
              <p className="text-white font-medium">Brahim Ben Abla / Delta Translation</p>
              <p>Schlesier Str. 64, 76227 Karlsruhe, Deutschland</p>
              <p>E-Mail: <a href="mailto:transl.delta@gmail.com" className="text-blue-400">transl.delta@gmail.com</a></p>
              <p>Telefon: 0157 863 047 59</p>
            </div>
          </div>

          {/* 2. Welche Daten */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Welche Daten wir erheben</h2>
            <div className="space-y-3 text-gray-400">
              <div>
                <p className="text-white font-medium mb-1">Registrierungsdaten</p>
                <p>E-Mail-Adresse, Name (optional), Passwort (verschlüsselt über Supabase Auth).</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Kandidatenprofil</p>
                <p>Branche, Erfahrungsjahre, Deutschkenntnisse, Englischkenntnisse, Zielland. Diese Daten werden freiwillig angegeben.</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Arbeitgeberprofil</p>
                <p>Unternehmensname, Branche, Land, Kontakt-E-Mail.</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Kontaktanfragen</p>
                <p>Name, E-Mail, Nachricht, Rolle — nur bei Nutzung des Kontaktformulars.</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Technische Daten</p>
                <p>Server-Logs (IP-Adresse, Zeitstempel) — nur für Sicherheit und Fehleranalyse, nicht für Tracking.</p>
              </div>
            </div>
          </div>

          {/* 3. Zweck */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Zweck der Verarbeitung</h2>
            <ul className="text-gray-400 space-y-2 list-none">
              {[
                'Bereitstellung der Matching-Plattform (Profil, Jobs, Score)',
                'Verarbeitung von Kontaktanfragen',
                'Betrieb und Sicherheit der Plattform',
                'Fehleranalyse und Verbesserung des Dienstes',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Rechtsgrundlage */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Rechtsgrundlage</h2>
            <p className="text-gray-400">
              Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO
              (Vertragserfüllung), Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z.B.
              Kontaktformular) und Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen
              für Sicherheit und Betrieb).
            </p>
          </div>

          {/* 5. Datenspeicherung */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Datenspeicherung & Sicherheit</h2>
            <div className="space-y-3 text-gray-400">
              <p>
                Daten werden auf Servern von{' '}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400">
                  Supabase
                </a>{' '}
                in der EU (eu-central-1, Frankfurt) gespeichert.
              </p>
              <p>
                Row Level Security (RLS) stellt sicher, dass Nutzer nur ihre eigenen Daten
                lesen und schreiben können. Kandidatenprofile sind nicht öffentlich zugänglich.
              </p>
              <p>
                Keine Kreditkartendaten oder Zahlungsdaten werden gespeichert.
                Zahlungen sind in der aktuellen MVP-Phase nicht aktiviert.
              </p>
              <p>
                Keine automatischen E-Mails werden versendet. Kontaktanfragen werden
                manuell beantwortet.
              </p>
            </div>
          </div>

          {/* 6. Weitergabe */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Weitergabe an Dritte</h2>
            <div className="space-y-3 text-gray-400">
              <p>
                Daten werden <strong className="text-white">nicht</strong> an Dritte verkauft
                oder für Werbezwecke weitergegeben.
              </p>
              <p>
                Technische Dienstleister (Supabase für Datenbank und Auth, Vercel für Hosting)
                erhalten nur die zur Bereitstellung des Dienstes notwendigen Daten.
              </p>
              <p>
                Arbeitgeber können im Rahmen des Matchings Kandidatenprofile in
                eingeschränkter Form sehen (Name, Branche, Erfahrung, Sprachlevel, Score).
                Vollständige Kontaktdaten werden nicht automatisch weitergegeben.
              </p>
            </div>
          </div>

          {/* 7. Rechte */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">7. Deine Rechte</h2>
            <div className="space-y-2 text-gray-400">
              {[
                'Auskunft über gespeicherte Daten (Art. 15 DSGVO)',
                'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
                'Löschung deiner Daten (Art. 17 DSGVO)',
                'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
                'Datenübertragbarkeit (Art. 20 DSGVO)',
                'Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)',
                'Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)',
              ].map((right, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>{right}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 mt-4">
              Zur Ausübung deiner Rechte wende dich an:{' '}
              <a href="mailto:transl.delta@gmail.com" className="text-blue-400">
                transl.delta@gmail.com
              </a>
            </p>
          </div>

          {/* 8. Cookies */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">8. Cookies & Session</h2>
            <p className="text-gray-400">
              Die Plattform verwendet ausschließlich funktionale Cookies für die
              Authentifizierung (Supabase Auth Session). Es werden keine Tracking-Cookies,
              keine Werbe-Cookies und keine Cookies von Drittanbietern für Analysen eingesetzt.
            </p>
          </div>

          {/* 9. Kontakt */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">9. Kontakt für Datenschutzanfragen</h2>
            <p className="text-gray-400">
              Für Fragen zum Datenschutz wende dich an:{' '}
              <a href="mailto:transl.delta@gmail.com" className="text-blue-400">
                transl.delta@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
