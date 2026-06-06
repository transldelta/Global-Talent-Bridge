/**
 * POST /api/admin/first-pilot/save
 *
 * Speichert den ersten Pilotarbeitgeber als manuell-kontaktierten Eintrag
 * in outreach_targets. Kein E-Mail-Versand. Kein automatischer Outreach.
 *
 * SICHERHEITS-CONSTRAINTS:
 * - Admin-Auth erforderlich (getCurrentAdminUser)
 * - Kein E-Mail-Versand (EMAIL_PROVIDER=none ist Systemkonfiguration)
 * - Kein Outreach-Provider aufgerufen
 * - Status immer: contacted_manual
 * - no_email_sent und no_auto_outreach werden in notes protokolliert
 * - Nur einzelner Eintrag pro Request (kein Bulk)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

type SaveBody = {
  company_name:    string
  contact_person?: string | null
  contact_method?: string
  contact_address?: string | null
  notes?:          string | null
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse body ────────────────────────────────────────────────────────
  let body: SaveBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    company_name,
    contact_person,
    contact_method = 'manual',
    contact_address,
    notes,
  } = body

  if (!company_name?.trim()) {
    return NextResponse.json(
      { error: 'Firmenname ist erforderlich.' },
      { status: 400 },
    )
  }

  // ── Safety: kein E-Mail-Versand ───────────────────────────────────────
  // Diese Route ruft niemals einen E-Mail-Provider auf.
  // EMAIL_PROVIDER und OUTREACH_EMAIL_PROVIDER bleiben unberührt.

  const db = createAdminClient()

  // Build notes string
  const noteParts = [
    notes?.trim() || null,
    `Kontaktweg: ${contact_method}`,
    contact_address?.trim() ? `Kontaktadresse: ${contact_address.trim()}` : null,
    'no_email_sent: true',
    'no_auto_outreach: true',
    `Quelle: First Pilot Assistant`,
    `Admin: ${admin.email}`,
    `Datum: ${new Date().toISOString().slice(0, 10)}`,
  ].filter(Boolean).join(' | ')

  // ── Insert outreach_targets ───────────────────────────────────────────
  const { data, error } = await db
    .from('outreach_targets')
    .insert({
      company_name:    company_name.trim(),
      contact_person:  contact_person?.trim() || null,
      email:           contact_method === 'email' ? contact_address?.trim() || null : null,
      phone:           contact_method === 'whatsapp' ? contact_address?.trim() || null : null,
      website:         null,
      sector:          null,
      city:            null,
      country:         'Deutschland',
      source:          'first_pilot_assistant',
      status:          'contacted_manual',
      priority:        'high',
      notes:           noteParts,
    })
    .select('id, company_name, status, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // ── Audit log ─────────────────────────────────────────────────────────
  await db.from('system_logs').insert({
    agent_name: 'first_pilot_assistant',
    status:     'info',
    message:    `Erster Pilot-Arbeitgeber als manuell kontaktiert gespeichert: "${company_name.trim()}" | Kontaktweg: ${contact_method} | no_email_sent: true | no_auto_outreach: true | Admin: ${admin.email}`,
  })

  return NextResponse.json(
    {
      success:         true,
      id:              data.id,
      company_name:    data.company_name,
      status:          data.status,
      no_email_sent:   true,
      no_auto_outreach: true,
    },
    { status: 201 },
  )
}
