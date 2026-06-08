import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

/**
 * PublicNavBar — simplified professional navigation for CorridorWork.
 * Server Component — checks auth for conditional Dashboard / Login links.
 */
export async function PublicNavBar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="text-white font-bold text-lg tracking-tight hover:text-slate-200 transition-colors shrink-0"
        >
          CorridorWork
        </Link>

        {/* Center links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/global/employers"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Employers
          </Link>
          <Link
            href="/global/candidates"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Candidates
          </Link>
          <Link
            href="/strategic-partnership"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Partners
          </Link>
          <Link
            href="/demo/sandbox"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/promo-video"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Promo Video
          </Link>
        </div>

        {/* Right: auth-conditional */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              href="/candidate/dashboard"
              className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
              >
                Login
              </Link>
              <Link
                href="/global/employers"
                className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
