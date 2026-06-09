import { getCurrentAdminUser } from '@/lib/admin'
import { redirect }            from 'next/navigation'
import { NavBar }              from '@/app/_components/NavBar'
import { SaleResponsesClient } from './_components/SaleResponsesClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title:  'Buyer Response Kit | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function SaleResponsesPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/sale-responses')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Buyer Response Kit</h1>
          <p className="mt-1 text-gray-400 text-sm">
            Read-only reference for responding to buyer enquiries. No auto-send. No forms.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-900/30 border border-green-700/30 text-green-300 text-xs font-medium">
              ✓ Pre-revenue honest
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-900/30 border border-green-700/30 text-green-300 text-xs font-medium">
              ✓ No revenue guarantees
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-900/30 border border-green-700/30 text-green-300 text-xs font-medium">
              ✓ Escrow required
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/30 border border-red-700/30 text-red-300 text-xs font-medium">
              ✗ No credentials before escrow
            </span>
          </div>
        </div>
        <SaleResponsesClient />
      </div>
    </div>
  )
}
