import { getCurrentAdminUser } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { NavBar } from '@/app/_components/NavBar'
import { MarketSignalsClient } from './_components/MarketSignalsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Market Signals | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function MarketSignalsPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/market-signals')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Market Signal Sprint</h1>
          <p className="mt-1 text-gray-400 text-sm">
            Prepared for manual outreach — no auto-send, no scraping, no fake data.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900/40 border border-yellow-700/40 text-yellow-300 text-xs font-medium">
            <span>⚠️</span>
            <span>Sprint prepared · 0 messages sent · 0 responses · Pre-revenue</span>
          </div>
        </div>
        <MarketSignalsClient />
      </div>
    </div>
  )
}
