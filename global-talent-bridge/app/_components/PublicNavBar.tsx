import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MobileNavMenu } from './MobileNavMenu'

/**
 * PublicNavBar — clean professional navigation for CorridorWork.
 * Server Component — checks auth only to decide whether to show "Sign in".
 *
 * SECURITY: Dashboard link is intentionally ABSENT from this public nav.
 * Internal dashboard is accessible only via direct URL for authenticated users.
 * The middleware at middleware.ts enforces auth guards on /candidate, /employer, /admin.
 *
 * Nav items: Employers | Candidates | Partners | Demo
 * Right: quiet "Sign in" text only for non-authenticated visitors.
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

        {/* Desktop center links */}
        <div className="hidden md:flex items-center gap-7">
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
        </div>

        {/* Right: quiet "Sign in" only — NO Dashboard button on public nav */}
        <div className="hidden md:flex items-center shrink-0">
          {!user && (
            <Link
              href="/auth/login"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger (client component) */}
        <MobileNavMenu showSignIn={!user} />

      </div>
    </nav>
  )
}
