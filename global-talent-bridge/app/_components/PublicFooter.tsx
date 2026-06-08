import Link from 'next/link'

/**
 * PublicFooter — clean 4-column footer for CorridorWork.
 * Platform / Partners / Legal / Status
 */
export function PublicFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-slate-900 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Brand row */}
        <div className="mb-10">
          <Link href="/" className="text-white font-bold text-base tracking-tight">
            CorridorWork
          </Link>
          <p className="text-slate-500 text-sm mt-1.5 max-w-xs leading-relaxed">
            Global talent corridors for employers, candidates and partners.
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

          {/* Platform */}
          <div>
            <h3 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/global/employers"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Employers
                </Link>
              </li>
              <li>
                <Link
                  href="/global/candidates"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Candidates
                </Link>
              </li>
              <li>
                <Link
                  href="/demo/sandbox"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/promo-video"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Promo Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Partners
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/strategic-partnership"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Strategic Partnership
                </Link>
              </li>
              <li>
                <Link
                  href="/buyer-snapshot"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Buyer Snapshot
                </Link>
              </li>
              <li>
                <Link
                  href="/launch"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Launch Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/legal/datenschutz"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/impressum"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/agb"
                  className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  AGB
                </Link>
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Status
            </h3>
            <ul className="space-y-2.5">
              <li className="text-slate-500 text-sm">No job guarantee</li>
              <li className="text-slate-500 text-sm">No visa guarantee</li>
              <li className="text-slate-500 text-sm">Inbound-first</li>
              <li className="text-slate-500 text-sm">No payment processing active</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © {year} CorridorWork · Operated by Delta Translation, Karlsruhe
          </p>
          <p className="text-slate-600 text-xs">
            No job guarantee · No visa guarantee · No payment processing active
          </p>
        </div>
      </div>
    </footer>
  )
}
