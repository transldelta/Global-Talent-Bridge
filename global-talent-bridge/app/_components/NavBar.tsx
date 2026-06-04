import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { logoutAction } from '@/app/actions'

interface NavBarProps {
  badge?: string
  badgeColor?: 'blue' | 'green' | 'purple' | 'yellow'
}

const badgeColorMap: Record<string, string> = {
  blue: 'bg-blue-900 text-blue-300',
  green: 'bg-green-900 text-green-300',
  purple: 'bg-purple-900 text-purple-300',
  yellow: 'bg-yellow-900 text-yellow-300',
}

/**
 * Universelle Navigation für alle geschützten Seiten.
 * Server Component — liest Session aus Cookies, zeigt rollenbasierte Links.
 * Admin-Links nur sichtbar wenn isAdminEmail() = true (serverseitig).
 */
export async function NavBar({ badge, badgeColor = 'blue' }: NavBarProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userIsAdmin = user?.email ? isAdminEmail(user.email) : false

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  const isEmployer = profile?.role === 'employer'
  const dashboardHref = isEmployer ? '/employer/dashboard' : '/candidate/dashboard'

  const badgeCss = badgeColorMap[badgeColor] ?? badgeColorMap.blue

  return (
    <nav className="border-b border-gray-800 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand + badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={dashboardHref}
            className="text-white font-semibold hover:text-gray-200 transition-colors"
          >
            Global Talent Bridge
          </Link>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeCss}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Right: Navigation links + user info + logout */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={dashboardHref}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>

          <Link
            href="/jobs"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Jobs
          </Link>

          <Link
            href="/pricing"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>

          {/* Nur für Arbeitgeber */}
          {isEmployer && (
            <>
              <Link
                href="/employer/jobs"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Meine Jobs
              </Link>
              <Link
                href="/employer/applications"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Bewerbungen
              </Link>
            </>
          )}

          {/* Nur für Kandidaten */}
          {!isEmployer && !userIsAdmin && user && (
            <Link
              href="/candidate/applications"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Meine Bewerbungen
            </Link>
          )}

          {/* Admin-only links */}
          {userIsAdmin && (
            <>
              <Link
                href="/admin/applications"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Bewerbungen
              </Link>
              <Link
                href="/admin/outreach"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Outreach
              </Link>
              <Link
                href="/admin/outreach/approval-queue"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Approval Queue
              </Link>
              <Link
                href="/admin/global/corridors"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                🌍 Korridore
              </Link>
              <Link
                href="/admin/global/sources"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Quellen
              </Link>
              <Link
                href="/admin/global/corridor-intelligence"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                🧠 CI
              </Link>
              <Link
                href="/admin/global/campaigns"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                📣 Kampagnen
              </Link>
              <Link
                href="/admin/global/candidate-acquisition"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                🎯 Akquisition
              </Link>
              <Link
                href="/admin/global/landingpages"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                🌐 Landingpages
              </Link>
              <Link
                href="/admin/global/landingpage-factory"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                🚀 LPF
              </Link>
              <Link
                href="/admin/global/migration-intelligence"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                🛂 MI
              </Link>
              <Link
                href="/admin/leads"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Leads
              </Link>
              <Link
                href="/admin/pilot-kit"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Pilot-Kit
              </Link>
              <Link
                href="/admin/system-check"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                System-Check
              </Link>
              <Link
                href="/admin/ceo-dashboard"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                CEO Dashboard
              </Link>
            </>
          )}

          {user && (
            <span className="text-gray-600 text-sm hidden md:block">{user.email}</span>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
