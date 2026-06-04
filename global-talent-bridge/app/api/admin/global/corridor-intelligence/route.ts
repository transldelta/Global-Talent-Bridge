import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/global/corridor-intelligence
 * Gibt alle corridor_intelligence Einträge inkl. Korridor-Metadaten zurück.
 * Nur für Admins.
 */
export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('corridor_intelligence')
    .select(`
      *,
      migration_corridors (
        id,
        source_country,
        target_country,
        sector,
        status,
        opportunity_score,
        priority_level
      )
    `)
    .order('opportunity_score', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: data?.length ?? 0 })
}
