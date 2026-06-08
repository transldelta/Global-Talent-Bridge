/**
 * app/admin/buyer-room/page.tsx
 *
 * Buyer Room — Sell-Ready Package for CorridorWork.
 * Admin-only. Noindex/nofollow. No public navigation.
 *
 * Shows: Executive Summary · Asset Inventory · Differentiation ·
 *        Monetization · Technical Proof · Compliance · Honest Gaps ·
 *        Transfer Checklist · Sale Readiness Score
 */
import { getCurrentAdminUser } from '@/lib/admin'
import { redirect }            from 'next/navigation'
import { NavBar }              from '@/app/_components/NavBar'
import { BuyerRoomClient }     from './_components/BuyerRoomClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title:  'Buyer Room | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function BuyerRoomPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/buyer-room')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <BuyerRoomClient />
      </div>
    </div>
  )
}
