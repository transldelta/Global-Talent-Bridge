import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/global/landingpages
 * Gibt alle landingpage_recommendations mit Korridor-Daten zurück.
 * Nur für Admins.
 */
export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('landingpage_recommendations')
    .select(`*, migration_corridors(source_country, target_country, sector)`)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count: data?.length ?? 0 })
}

/**
 * POST /api/admin/global/landingpages
 * Erstellt oder aktualisiert eine Landingpage-Empfehlung.
 * Nur für Admins.
 */
export async function POST(request: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const supabase = createAdminClient()

  if (body.id) {
    const { id, ...updates } = body
    const { data, error } = await supabase
      .from('landingpage_recommendations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('system_logs').insert({
      action: 'admin:landingpage_updated',
      details: { lp_id: id, updated_by: admin.email },
    })
    return NextResponse.json({ success: true, data })
  }

  const { data, error } = await supabase
    .from('landingpage_recommendations')
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('system_logs').insert({
    action: 'admin:landingpage_created',
    details: { lp_id: data.id, created_by: admin.email },
  })
  return NextResponse.json({ success: true, data }, { status: 201 })
}
