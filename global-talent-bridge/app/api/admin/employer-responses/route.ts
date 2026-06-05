/**
 * POST /api/admin/employer-responses
 *
 * Protokolliert eine manuelle Interaktion mit einem Pilot-Arbeitgeber.
 * Kein automatischer Versand. Keine echten Nachrichten.
 * Nur Aufzeichnung was manuell gemacht wurde.
 *
 * Admin-only.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  VALID_INTERACTION_TYPES,
  VALID_RESPONSE_TYPES,
} from '@/lib/employer-response-pipeline'

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    pilot_employer_id,
    interaction_type,
    response_type,
    summary,
    next_action,
    next_follow_up_at,
  } = body as Record<string, unknown>

  // Validate required fields
  if (!pilot_employer_id || typeof pilot_employer_id !== 'string') {
    return NextResponse.json({ error: 'pilot_employer_id is required' }, { status: 400 })
  }

  if (!interaction_type || !VALID_INTERACTION_TYPES.includes(interaction_type as never)) {
    return NextResponse.json(
      { error: `interaction_type must be one of: ${VALID_INTERACTION_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  const resolvedResponseType = response_type && VALID_RESPONSE_TYPES.includes(response_type as never)
    ? (response_type as string)
    : 'no_response'

  const supabase = createAdminClient()

  // Verify employer exists
  const { data: employer, error: empError } = await supabase
    .from('pilot_employers')
    .select('id, company_name')
    .eq('id', pilot_employer_id)
    .single()

  if (empError || !employer) {
    return NextResponse.json({ error: 'pilot_employer not found' }, { status: 404 })
  }

  // Insert interaction
  const { data: interaction, error: insertError } = await supabase
    .from('pilot_employer_interactions')
    .insert({
      pilot_employer_id,
      interaction_type,
      response_type: resolvedResponseType,
      summary: typeof summary === 'string' ? summary.trim().slice(0, 2000) : null,
      next_action: typeof next_action === 'string' ? next_action.trim().slice(0, 500) : null,
      next_follow_up_at: next_follow_up_at ?? null,
      created_by: admin.email,
    })
    .select()
    .single()

  if (insertError) {
    console.error('employer-responses insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save interaction' }, { status: 500 })
  }

  // Log to system_logs
  await supabase.from('system_logs').insert({
    agent_name: 'employer-response-pipeline',
    status: 'success',
    message: `Interaction logged for ${employer.company_name}: ${interaction_type} / ${resolvedResponseType} by ${admin.email}`,
  })

  return NextResponse.json({ ok: true, interaction }, { status: 201 })
}
