/**
 * app/admin/corridor-intelligence/page.tsx
 *
 * Corridor Intelligence — Buyer Opportunity Scores, Demo Corridors,
 * Monetization Map, and Buyer Value Layer.
 *
 * Admin-only. No sending. No scraping. Pure data layer.
 */
import { getCurrentAdminUser } from '@/lib/admin'
import { redirect }            from 'next/navigation'
import { NavBar }              from '@/app/_components/NavBar'
import { CorridorIntelligenceClient } from './_components/CorridorIntelligenceClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title:  'Corridor Intelligence | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function CorridorIntelligencePage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/corridor-intelligence')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <CorridorIntelligenceClient />
      </div>
    </div>
  )
}
