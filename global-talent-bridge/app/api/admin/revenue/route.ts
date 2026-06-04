import 'server-only'
import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const [plansResult, eventsResult] = await Promise.all([
    supabase
      .from('revenue_plans')
      .select('*')
      .order('audience_type')
      .order('monthly_price'),
    supabase
      .from('revenue_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  if (plansResult.error) {
    return NextResponse.json({ error: plansResult.error.message }, { status: 500 })
  }

  return NextResponse.json({
    plans:  plansResult.data ?? [],
    events: eventsResult.data ?? [],
  })
}
