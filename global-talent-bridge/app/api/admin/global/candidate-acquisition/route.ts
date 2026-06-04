import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/global/candidate-acquisition
 * Gibt alle candidate_acquisition_sources zurück, sortiert nach opportunity_score.
 * Nur für Admins.
 */
export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('candidate_acquisition_sources')
    .select('*')
    .order('opportunity_score', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count: data?.length ?? 0 })
}
