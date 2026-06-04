import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/global/campaigns
 * Gibt alle campaign_recommendations inkl. Korridor-Metadaten zurück.
 * Nur für Admins.
 */
export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('campaign_recommendations')
    .select(`
      *,
      migration_corridors (
        id,
        source_country,
        target_country,
        sector
      )
    `)
    .order('campaign_priority', { ascending: false })
    .order('estimated_reach', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: data?.length ?? 0 })
}

/**
 * POST /api/admin/global/campaigns
 * Erstellt oder aktualisiert eine Kampagnen-Empfehlung.
 * Keine automatischen Nachrichten. Nur Planung.
 * Nur für Admins.
 */
export async function POST(request: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const supabase = createAdminClient()

  // If id provided → update, else → insert
  if (body.id) {
    const { id, ...updates } = body
    const { data, error } = await supabase
      .from('campaign_recommendations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Log the update
    await supabase.from('system_logs').insert({
      action: 'admin:campaign_updated',
      details: { campaign_id: id, updated_by: admin.email, changes: Object.keys(updates) },
    })

    return NextResponse.json({ success: true, data })
  }

  const { data, error } = await supabase
    .from('campaign_recommendations')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('system_logs').insert({
    action: 'admin:campaign_created',
    details: { campaign_id: data.id, created_by: admin.email },
  })

  return NextResponse.json({ success: true, data }, { status: 201 })
}
