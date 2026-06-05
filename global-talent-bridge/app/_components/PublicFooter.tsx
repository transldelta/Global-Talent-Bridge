import Link from 'next/link'

/**
 * PublicFooter — Footer für alle öffentlichen Seiten.
 * Enthält rechtliche Links, Navigation und MVP-Hinweis.
 */
export function PublicFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-gray-900 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Produkt */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Produkt</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/for-candidates" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Für Kandidaten
                </Link>
              </li>
              <li>
                <Link href="/for-employers" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Für Arbeitgeber
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Über uns
                </Link>
              </li>
            </ul>
          </div>

          {/* Konto */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Konto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/register?role=candidate" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Als Kandidat registrieren
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=employer" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Als Arbeitgeber registrieren
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/impressum" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/legal/datenschutz" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/legal/agb" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {year} CorridorWork · MVP-Phase · Betrieben von Delta Translation, Karlsruhe
          </p>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 bg-yellow-900/20 border border-yellow-800/40 rounded-full">
            <span className="text-yellow-400">⚠️</span>
            <span className="text-yellow-300/80">Zahlungen noch nicht aktiv · Keine echten E-Mails</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
