import 'server-only'
import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runRevenueIntelligenceAgent } from '@/lib/agents/revenue-intelligence-agent'

export const dynamic = 'force-dynamic'

export async function POST() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runRevenueIntelligenceAgent()
    return NextResponse.json({ success: true, result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
