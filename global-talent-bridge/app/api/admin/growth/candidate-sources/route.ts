import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('candidate_growth_sources')
      .select('*')
      .order('estimated_candidates', { ascending: false })

    if (error) throw error
    return NextResponse.json({ sources: data ?? [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
