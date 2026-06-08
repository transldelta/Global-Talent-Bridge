/**
 * app/admin/market-proof-launch/page.tsx
 *
 * Market Proof Launch — guide through the final pre-sale outreach steps.
 * Admin-only. Noindex/nofollow. No public navigation.
 *
 * ⚠️  No automatic sending. No scraping. No fake customers. No fake revenue.
 */
import { getCurrentAdminUser }          from '@/lib/admin'
import { redirect }                     from 'next/navigation'
import { NavBar }                       from '@/app/_components/NavBar'
import { MarketProofLaunchClient }      from './_components/MarketProofLaunchClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title:  'Market Proof Launch | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function MarketProofLaunchPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/market-proof-launch')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <MarketProofLaunchClient />
      </div>
    </div>
  )
}
