/**
 * app/admin/global-growth-department/page.tsx
 *
 * CEO Global Growth Department — internal operations centre.
 * Admin-only. No automatic sending. No scraping. Manual approval required.
 */
import { getCurrentAdminUser }     from '@/lib/admin'
import { redirect }                from 'next/navigation'
import { NavBar }                  from '@/app/_components/NavBar'
import { GlobalGrowthClient }      from './_components/GlobalGrowthClient'

export const metadata = {
  title:  'Global Growth Department | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function GlobalGrowthDepartmentPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/global-growth-department')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <GlobalGrowthClient />
      </div>
    </div>
  )
}
