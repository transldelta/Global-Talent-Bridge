import Link from 'next/link'

/**
 * PublicFooter — Footer für alle öffentlichen Seiten.
 * Enthält rechtliche Links, Navigation, Revenue-Pilot-Links, SEO-Branchen/Korridore und MVP-Hinweis.
 */
export function PublicFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-gray-900 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Top row: 4 columns */}
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
                <Link href="/demo" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  🎬 Demo ansehen
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Pilot & Partner — Revenue Pages */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Pilot & Partner</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/launch" className="text-green-400 text-sm hover:text-green-300 transition-colors font-medium">
                  🚀 Launch-Übersicht
                </Link>
              </li>
              <li>
                <Link href="/buyer-snapshot" className="text-amber-400 text-sm hover:text-amber-300 transition-colors font-medium">
                  📋 Buyer Snapshot
                </Link>
              </li>
              <li>
                <Link href="/strategic-partnership" className="text-amber-500 text-sm hover:text-amber-300 transition-colors font-medium">
                  🎯 Strategic Partnership
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-purple-400 text-sm hover:text-purple-300 transition-colors font-medium">
                  🤝 Partner-Programm
                </Link>
              </li>
              <li>
                <Link href="/pilot/employers" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  🏭 Arbeitgeber-Pilot
                </Link>
              </li>
              <li>
                <Link href="/market-intelligence" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  📊 Market Intelligence
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  🎬 Demo ansehen
                </Link>
              </li>
            </ul>
          </div>

          {/* Global Intake */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Global Intake</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/global/employers" className="text-blue-400 text-sm hover:text-blue-300 transition-colors font-medium">
                  🌍 Global Employers
                </Link>
              </li>
              <li>
                <Link href="/global/candidates" className="text-green-400 text-sm hover:text-green-300 transition-colors font-medium">
                  🌍 Global Candidates
                </Link>
              </li>
              <li>
                <Link href="/demo/sandbox" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors font-medium">
                  🔬 Demo Sandbox
                </Link>
              </li>
              <li>
                <Link href="/promo-video" className="text-pink-400 text-sm hover:text-pink-300 transition-colors font-medium">
                  🎬 Promo Video
                </Link>
              </li>
              <li>
                <Link href="/buyer-snapshot" className="text-amber-400 text-sm hover:text-amber-300 transition-colors">
                  📋 Buyer Snapshot
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

        {/* SEO row: Branchen + Korridore */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 pt-4 border-t border-gray-800">
          {/* Branchen */}
          <div>
            <h3 className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3">Branchen</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {[
                { href: '/industries/care',         label: '🏥 Pflege' },
                { href: '/industries/hospitality',  label: '🍽️ Gastronomie' },
                { href: '/industries/logistics',    label: '🚚 Logistik' },
                { href: '/industries/it',           label: '💻 IT' },
                { href: '/industries/construction', label: '🏗️ Bau & Handwerk' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-gray-600 text-xs hover:text-gray-400 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Korridore */}
          <div>
            <h3 className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3">Talent-Korridore</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {[
                { href: '/corridors/philippines-care',  label: '🇵🇭→🇩🇪 Philippinen' },
                { href: '/corridors/india-uk',          label: '🇮🇳→🇬🇧 Indien' },
                { href: '/corridors/morocco-germany',   label: '🇲🇦→🇩🇪 Marokko' },
                { href: '/corridors/nigeria-tech',      label: '🇳🇬→🇩🇪 Nigeria' },
                { href: '/corridors/tunisia-france',    label: '🇹🇳→🇫🇷 Tunesien' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-gray-600 text-xs hover:text-gray-400 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
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
