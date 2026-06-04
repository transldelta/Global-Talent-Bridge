import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Impressum — Global Talent Bridge',
  description: 'Impressum und Anbieterkennzeichnung gemäß § 5 TMG.',
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      <div className="max-w-2xl mx-auto px-4 py-16 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-400 transition-colors">Startseite</Link>
          <span>/</span>
          <span className="text-gray-400">Impressum</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Impressum</h1>
            <p className="text-gray-500 text-sm">Angaben gemäß § 5 TMG</p>
          </div>

          {/* Admin-Hinweis (nur intern sichtbar wenn env gesetzt) */}
          {/* VOR LAUNCH PRÜFEN: Firmenname + Adresse + USt-ID aktuell? Rechtsform korrekt? */}

          {/* Anbieter */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Anbieter</h2>
            <div className="text-gray-400 text-sm space-y-1">
              <p className="text-white font-medium">Brahim Ben Abla</p>
              <p>Delta Translation</p>
              <p>Schlesier Str. 64</p>
              <p>76227 Karlsruhe</p>
              <p>Deutschland</p>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Kontakt</h2>
            <div className="text-gray-400 text-sm space-y-1">
              <p>
                E-Mail:{' '}
                <a href="mailto:transl.delta@gmail.com" className="text-blue-400 hover:text-blue-300">
                  transl.delta@gmail.com
                </a>
              </p>
              <p>Telefon: 0157 863 047 59</p>
            </div>
          </div>

          {/* Umsatzsteuer */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Umsatzsteuer-ID</h2>
            <p className="text-gray-400 text-sm">
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
              <span className="text-white ml-1">DE310737989</span>
            </p>
          </div>

          {/* Plattform */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Plattform</h2>
            <div className="text-gray-400 text-sm space-y-2">
              <p>
                <strong className="text-white">Global Talent Bridge</strong> ist eine
                Online-Plattform zur Verbindung internationaler Fachkräfte mit Arbeitgebern.
              </p>
              <p>
                Alle Angaben wurden nach bestem Wissen und Gewissen erstellt.
              </p>
            </div>
          </div>

          {/* EU-Streitschlichtung */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">EU-Streitschlichtung</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit
              oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </div>

          {/* Haftungsausschluss */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Haftungsausschluss</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir keine
              Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für
              eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            </p>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
