import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung für CorridorWork gemäß DSGVO.',
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
            <p className="text-gray-500 text-sm">Stand: Juni 2026</p>
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

          {/* 10. Globale Arbeitgeber- und Kandidaten-Interessensregistrierung */}
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-white mb-3">
              10. Globale Arbeitgeber- und Kandidaten-Interessensregistrierung
            </h2>
            <p className="text-gray-400 mb-4">
              Über die öffentlichen Formulare auf{' '}
              <span className="text-white">/global/employers</span> und{' '}
              <span className="text-white">/global/candidates</span>{' '}
              können Arbeitgeber und Kandidaten weltweit unverbindliches Interesse
              an CorridorWork bekunden. Die dabei anfallenden Daten werden in den
              internen Tabellen{' '}
              <code className="text-green-400 text-xs bg-gray-800 px-1 rounded">global_employer_leads</code> und{' '}
              <code className="text-green-400 text-xs bg-gray-800 px-1 rounded">candidate_interest_leads</code> gespeichert.
            </p>

            <div className="space-y-4 text-gray-400">
              <div>
                <p className="text-white font-medium mb-1">Erhobene Daten — Arbeitgeber</p>
                <ul className="list-none space-y-1 text-sm">
                  {[
                    'Organisationsname / Firmenname',
                    'Ansprechpartner (Name)',
                    'E-Mail-Adresse',
                    'Land und Stadt (optional)',
                    'Branche(n) — Mehrfachauswahl aus 21 Kategorien (optional)',
                    'Qualifikationsniveau, Dringlichkeit, Zielnachricht (optional)',
                    'Ziel-Kandidatenregionen (optional)',
                    'Freitextnachricht (optional)',
                    'Einwilligung zur Kontaktaufnahme (DSGVO-Pflicht)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400 shrink-0 mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Erhobene Daten — Kandidaten</p>
                <ul className="list-none space-y-1 text-sm">
                  {[
                    'Anzeigename / Vorname (Pseudonym möglich)',
                    'E-Mail-Adresse',
                    'Herkunftsland und Zielland (optional)',
                    'Branche(n) — Mehrfachauswahl aus 21 Kategorien (optional)',
                    'Erfahrungsniveau, Umzugsbereitschaft (optional)',
                    'Sprachen, Qualifikationen (optional)',
                    'Freitextnachricht (optional)',
                    'Einwilligung zur Kontaktaufnahme (DSGVO-Pflicht)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400 shrink-0 mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Zweck der Verarbeitung</p>
                <p className="text-sm">
                  Die Daten werden ausschließlich zur Bearbeitung des eingereichten
                  Interesses verwendet — d.h. zur Prüfung, ob eine Vermittlung oder
                  Zusammenarbeit im Rahmen von CorridorWork möglich ist.
                  Rechtsgrundlage:{' '}
                  <strong className="text-white">Art. 6 Abs. 1 lit. a DSGVO</strong>{' '}
                  (ausdrückliche Einwilligung, die vor dem Einreichen erteilt wird) in
                  Verbindung mit{' '}
                  <strong className="text-white">Art. 6 Abs. 1 lit. b DSGVO</strong>{' '}
                  (vorvertragliche Maßnahmen).
                </p>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Garantien und Einschränkungen</p>
                <ul className="list-none space-y-1 text-sm">
                  {[
                    'Keine Jobgarantie — die Registrierung stellt kein Jobangebot dar.',
                    'Keine Visagarantie — CorridorWork übernimmt keine Verantwortung für Visumprozesse.',
                    'Keine Gebühren für Kandidaten — die Registrierung ist und bleibt kostenlos.',
                    'Keine automatischen E-Mails an registrierte Personen.',
                    'Kein automatischer Outreach durch das System.',
                    'Keine Zahlungen werden ausgelöst.',
                    'E-Mail-Provider ist deaktiviert (EMAIL_PROVIDER = none).',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Speicherdauer und Löschung</p>
                <p className="text-sm">
                  Interessensdaten werden für die Dauer des Piloten gespeichert,
                  längstens jedoch 24 Monate nach Eingang, sofern keine längere
                  Aufbewahrung gesetzlich erforderlich ist. Auf Wunsch werden Daten
                  jederzeit gelöscht — Anfrage an:{' '}
                  <a href="mailto:transl.delta@gmail.com" className="text-blue-400">
                    transl.delta@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* 11. Pilot-, Partner- und Market-Intelligence-Anfragen */}
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-white mb-3">
              11. Pilot-, Partner- und Market-Intelligence-Anfragen
            </h2>
            <p className="text-gray-400 mb-4">
              Über die öffentlichen Formulare auf{' '}
              <span className="text-white">/pilot/employers</span>,{' '}
              <span className="text-white">/pilot/agencies</span> und{' '}
              <span className="text-white">/market-intelligence</span>{' '}
              können Arbeitgeber, Recruiting-Agenturen und B2B-Interessenten
              unverbindliche Anfragen einreichen. Die dabei anfallenden Daten werden
              in der internen Tabelle <code className="text-green-400 text-xs bg-gray-800 px-1 rounded">revenue_leads</code> gespeichert.
            </p>

            <div className="space-y-4 text-gray-400">
              <div>
                <p className="text-white font-medium mb-1">Erhobene Daten</p>
                <ul className="list-none space-y-1 text-sm">
                  {[
                    'Organisation / Firmenname',
                    'Ansprechpartner (Name)',
                    'E-Mail-Adresse',
                    'Land und Stadt (optional)',
                    'Branche / Korridor-Interesse (optional)',
                    'Nachricht / Freitext (optional)',
                    'Zeitpunkt der Anfrage (automatisch)',
                    'Art der Anfrage (Employer Pilot / Agency Partner / Market Intelligence)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400 shrink-0 mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Zweck der Verarbeitung</p>
                <p className="text-sm">
                  Die Daten werden ausschließlich zur Bearbeitung der eingereichten
                  Anfrage verwendet — d.h. zur Prüfung, ob eine Zusammenarbeit im
                  Rahmen des CorridorWork-Piloten sinnvoll ist. Rechtsgrundlage:{' '}
                  <strong className="text-white">Art. 6 Abs. 1 lit. b DSGVO</strong>{' '}
                  (Vertragsanbahnung) in Verbindung mit der ausdrücklichen Einwilligung
                  (Art. 6 Abs. 1 lit. a DSGVO), die vor dem Einreichen der Anfrage
                  erteilt wird.
                </p>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Was NICHT passiert</p>
                <ul className="list-none space-y-1 text-sm">
                  {[
                    'Es werden keine automatischen E-Mails an die anfragende Person gesendet.',
                    'Es findet kein automatischer Outreach durch das System statt.',
                    'Es werden keine Zahlungen ausgelöst.',
                    'Kein Bulk-Versand, kein Cold-Outreach.',
                    'E-Mail-Provider ist deaktiviert (EMAIL_PROVIDER = none).',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Weitergabe an Dritte</p>
                <p className="text-sm">
                  Die Anfragedaten werden nicht an Dritte verkauft, vermietet oder für
                  Werbezwecke weitergegeben. Technische Dienstleister (Supabase für
                  Datenbank, Vercel für Hosting) erhalten nur die zur Bereitstellung
                  des Dienstes notwendigen Daten und verarbeiten diese ausschließlich
                  auf Weisung.
                </p>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Speicherdauer</p>
                <p className="text-sm">
                  Anfragedaten werden für die Dauer des Piloten gespeichert, längstens
                  jedoch 24 Monate nach Eingang, sofern keine längere Aufbewahrung
                  gesetzlich erforderlich ist. Auf Wunsch werden Daten jederzeit
                  gelöscht.
                </p>
              </div>

              <div>
                <p className="text-white font-medium mb-1">Deine Rechte</p>
                <p className="text-sm">
                  Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
                  der Verarbeitung sowie das Recht, die Einwilligung jederzeit zu
                  widerrufen — ohne Angabe von Gründen. Wende dich dazu an:{' '}
                  <a href="mailto:transl.delta@gmail.com" className="text-blue-400">
                    transl.delta@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
