/**
 * app/admin/global-growth-department/page.tsx
 *
 * CEO Global Growth Department — persistent pipeline backed by Supabase.
 * Admin-only. No automatic sending. No scraping. Manual approval required.
 */
import { getCurrentAdminUser }   from '@/lib/admin'
import { redirect }              from 'next/navigation'
import { NavBar }                from '@/app/_components/NavBar'
import { GlobalGrowthClient }    from './_components/GlobalGrowthClient'
import { createAdminClient }     from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export const metadata = {
  title:  'Global Growth Department | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function GlobalGrowthDepartmentPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/global-growth-department')

  // Load persisted targets server-side
  let initialTargets: Record<string, unknown>[] = []
  let dbError: string | null = null

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('growth_targets')
      .select('*, growth_messages(id, channel, subject, status)')
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('[GlobalGrowthDepartmentPage] DB load error:', error.message)
      dbError = error.message
    } else {
      initialTargets = data ?? []
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown DB error'
    console.error('[GlobalGrowthDepartmentPage] Error:', msg)
    dbError = msg
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <GlobalGrowthClient
          initialTargets={initialTargets}
          dbError={dbError}
        />
      </div>
    </div>
  )
}
