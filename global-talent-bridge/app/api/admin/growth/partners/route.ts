import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('partner_leads')
      .select('*')
      .order('potential_candidates_per_month', { ascending: false })

    if (error) throw error
    return NextResponse.json({ partners: data ?? [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
