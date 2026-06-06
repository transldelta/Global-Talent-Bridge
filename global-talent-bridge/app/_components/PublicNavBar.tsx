import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

/**
 * PublicNavBar — für öffentliche Seiten (Landing, About, Contact, Legal, Pilot, etc.)
 * Server Component — prüft Auth-Status für bedingte Links (Login vs. Dashboard).
 */
export async function PublicNavBar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="text-white font-bold text-lg hover:text-gray-200 transition-colors shrink-0"
        >
          CorridorWork
        </Link>

        {/* Center links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/for-candidates" className="text-sm text-gray-400 hover:text-white transition-colors">
            Für Kandidaten
          </Link>
          <Link href="/for-employers" className="text-sm text-gray-400 hover:text-white transition-colors">
            Für Arbeitgeber
          </Link>
          <Link href="/pilot/employers" className="text-sm text-gray-400 hover:text-white transition-colors">
            Employer Pilot
          </Link>
          <Link href="/pilot/agencies" className="text-sm text-gray-400 hover:text-white transition-colors">
            Partner-Pilot
          </Link>
          <Link href="/market-intelligence" className="text-sm text-gray-400 hover:text-white transition-colors">
            Market Intelligence
          </Link>
        </div>

        {/* Right: Pilot CTA + Auth */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              href="/candidate/dashboard"
              className="text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
              >
                Login
              </Link>
              <Link
                href="/pilot/employers"
                className="text-sm px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors hidden sm:block"
              >
                🚀 Pilot anfragen
              </Link>
              <Link
                href="/auth/register"
                className="text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Registrieren
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
