import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/global/landingpage-factory
 * Gibt alle Landingpages zurück, sortiert nach opportunity_score.
 * Nur für Admins.
 */
export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('landingpage_factory')
    .select('*, migration_corridors(source_country, target_country, sector)')
    .order('opportunity_score', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count: data?.length ?? 0 })
}
