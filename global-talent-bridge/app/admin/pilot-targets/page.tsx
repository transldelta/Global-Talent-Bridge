/**
 * app/admin/pilot-targets/page.tsx — /admin/pilot-targets
 *
 * Pilot Target Strategy — internal preparation tool for the first pilot
 * employer or partner contact.
 * Admin-only. No automatic outreach. No send button. No scraping.
 */
import { getCurrentAdminUser } from '@/lib/admin'
import { redirect }            from 'next/navigation'
import { NavBar }              from '@/app/_components/NavBar'
import { PilotTargetsClient }  from './_components/PilotTargetsClient'

export const metadata = {
  title: 'Pilot Target Strategy | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function PilotTargetsPage() {
  // ── Admin Guard ──────────────────────────────────────────────────────────
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/pilot-targets')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <PilotTargetsClient />
      </div>
    </div>
  )
}
