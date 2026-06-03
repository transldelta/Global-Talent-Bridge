import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

// ── Erlaubte Action-Types für automatische Ausführung ─────────────────────────
// Nur interne, risikoarme Aktionen. Kein E-Mail-Versand, keine Zahlungen,
// keine externen APIs, keine RLS-Änderungen, keine User-Daten-Löschung.
const ALLOWED_ACTION_TYPES = ['create_outreach_draft', 'create_lead_note', 'mark_notification_read'] as const
type AllowedActionType = (typeof ALLOWED_ACTION_TYPES)[number]

function isAllowedActionType(t: unknown): t is AllowedActionType {
  return typeof t === 'string' && ALLOWED_ACTION_TYPES.includes(t as AllowedActionType)
}

/**
 * POST /api/admin/agents/suggestions/[id]/execute
 * Führt sichere interne Aktionen aus. Nur nach Admin-Freigabe.
 *
 * NICHT ERLAUBT:
 * - E-Mail senden
 * - Zahlung aktivieren
 * - Externe kostenpflichtige API
 * - RLS ändern
 * - User-Daten löschen
 */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const adminUser = await getCurrentAdminUser()
  if (!adminUser) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 })
  }

  const supabase = createAdminClient()

  // Vorschlag laden
  const { data: suggestion, error: fetchError } = await supabase
    .from('agent_suggestions')
    .select('*')
    .eq('id', params.id)
    .single()

  if (fetchError || !suggestion) {
    return NextResponse.json({ error: 'Vorschlag nicht gefunden.' }, { status: 404 })
  }

  if (suggestion.status !== 'approved') {
    return NextResponse.json(
      { error: 'Vorschlag muss zuerst freigegeben (approved) werden.' },
      { status: 400 }
    )
  }

  if (!isAllowedActionType(suggestion.action_type)) {
    return NextResponse.json(
      {
        error: `Action-Type "${suggestion.action_type}" ist nicht für automatische Ausführung erlaubt.`,
        allowed: ALLOWED_ACTION_TYPES,
      },
      { status: 400 }
    )
  }

  const payload = (suggestion.action_payload ?? {}) as Record<string, unknown>
  let executionNote = ''

  try {
    // ── create_outreach_draft ────────────────────────────────────────────────
    if (suggestion.action_type === 'create_outreach_draft') {
      const companyName =
        typeof payload.company_name === 'string' && payload.company_name
          ? payload.company_name
          : `[Entwurf] ${typeof payload.sector === 'string' ? payload.sector : 'Allgemein'}`

      const { error: insertError } = await supabase.from('outreach_targets').insert({
        company_name: companyName,
        sector: typeof payload.sector === 'string' ? payload.sector : null,
        city: typeof payload.city === 'string' ? payload.city : null,
        country: typeof payload.country === 'string' ? payload.country : 'Deutschland',
        contact_person: typeof payload.contact_person === 'string' ? payload.contact_person : null,
        priority: typeof payload.priority === 'string' ? payload.priority : 'normal',
        status: 'planned',
        source: 'agent_suggestion',
        notes: [
          typeof payload.reason === 'string' ? `Grund: ${payload.reason}` : '',
          typeof payload.suggested_message === 'string'
            ? `Vorgeschlagene Nachricht:\n${payload.suggested_message}`
            : '',
        ]
          .filter(Boolean)
          .join('\n\n'),
      })

      if (insertError) throw new Error(insertError.message)
      executionNote = `Outreach-Entwurf erstellt: ${companyName}`
    }

    // ── create_lead_note ─────────────────────────────────────────────────────
    if (suggestion.action_type === 'create_lead_note') {
      const leadId = typeof payload.lead_id === 'string' ? payload.lead_id : null
      const note = typeof payload.note === 'string' ? payload.note : suggestion.description
      if (leadId) {
        const { error: updateError } = await supabase
          .from('contact_requests')
          .update({ admin_notes: note })
          .eq('id', leadId)
        if (updateError) throw new Error(updateError.message)
        executionNote = `Lead-Notiz gespeichert für ${leadId}`
      }
    }

    // ── mark_notification_read ────────────────────────────────────────────────
    if (suggestion.action_type === 'mark_notification_read') {
      const notifId = typeof payload.notification_id === 'string' ? payload.notification_id : null
      if (notifId) {
        await supabase
          .from('agent_notifications')
          .update({ is_read: true })
          .eq('id', notifId)
        executionNote = `Notification ${notifId} als gelesen markiert`
      }
    }

    // ── Status auf executed setzen ────────────────────────────────────────────
    await supabase
      .from('agent_suggestions')
      .update({
        status: 'executed',
        executed_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    await supabase.from('system_logs').insert({
      agent_name: 'suggestion_execute',
      status: 'success',
      message: `Vorschlag ${params.id} ausgeführt von ${adminUser.email}. ${executionNote}`,
    })

    return NextResponse.json({
      success: true,
      id: params.id,
      status: 'executed',
      note: executionNote,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'

    await supabase
      .from('agent_suggestions')
      .update({ status: 'failed' })
      .eq('id', params.id)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
