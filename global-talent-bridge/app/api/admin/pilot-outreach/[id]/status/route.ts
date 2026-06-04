/**
 * PATCH /api/admin/pilot-outreach/[id]/status
 *
 * Aktualisiert den Status eines pilot_employers-Eintrags.
 * Nur für Admins.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = [
  'identified',
  'contacted_manual',
  'interested',
  'demo_scheduled',
  'onboarding',
  'active_pilot',
  'rejected',
] as const

type ValidStatus = typeof VALID_STATUSES[number]

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = params

  let body: { status: string; notes?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { status, notes } = body

  if (!VALID_STATUSES.includes(status as ValidStatus)) {
    return NextResponse.json(
      { error: `Ungültiger Status. Erlaubt: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const db = createAdminClient()

  const updatePayload: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (notes !== undefined) {
    updatePayload.notes = notes
  }

  const { data, error } = await db
    .from('pilot_employers')
    .update(updatePayload)
    .eq('id', id)
    .select('id, company_name, status')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Protokollieren
  await db.from('system_logs').insert({
    agent_name: 'pilot-outreach',
    status: 'success',
    message: `Status-Update: ${data.company_name} → ${status} (Admin: ${admin.email})`,
  }).then(() => {})

  return NextResponse.json({ ok: true, employer: data })
}
