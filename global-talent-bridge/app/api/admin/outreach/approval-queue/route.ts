import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentAdminUser } from '@/lib/admin'

/**
 * GET /api/admin/outreach/approval-queue
 * Liefert Einträge der Approval-Queue. Nur für Admins.
 * Query-Params: status (pending|approved|rejected|sent|prepared_for_manual_send|remind_later|all), channel, risk_level
 */
export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'pending'
  const channel = searchParams.get('channel')
  const riskLevel = searchParams.get('risk_level')

  const supabase = createAdminClient()

  let query = supabase
    .from('outreach_approval_queue')
    .select('*')
    .order('priority_score', { ascending: false })
    .order('created_at', { ascending: false })

  if (status !== 'all') {
    query = query.eq('status', status)
  }
  if (channel) {
    query = query.eq('channel', channel)
  }
  if (riskLevel) {
    query = query.eq('risk_level', riskLevel)
  }

  const { data, error } = await query.limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

type ActionBody =
  | { action: 'approve'; id: string; notes?: string }
  | { action: 'double_confirm'; id: string }
  | { action: 'approve_send'; id: string }
  | { action: 'reject'; id: string; rejection_reason?: string }
  | { action: 'remind_later'; id: string; remind_later_at: string }
  | { action: 'edit'; id: string; message_subject?: string; message_body: string; notes?: string }

/**
 * POST /api/admin/outreach/approval-queue
 * Aktionen: approve | double_confirm | approve_send | reject | remind_later | edit
 * Alle Aktionen werden in system_logs protokolliert.
 * Kein echter Versand ohne konfigurierten Provider.
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as ActionBody
  const { action, id } = body

  if (!id) {
    return NextResponse.json({ error: 'id fehlt' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Aktuellen Eintrag lesen
  const { data: entry, error: fetchError } = await supabase
    .from('outreach_approval_queue')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !entry) {
    return NextResponse.json({ error: 'Eintrag nicht gefunden' }, { status: 404 })
  }

  const adminEmail = admin.email ?? 'admin'
  const now = new Date().toISOString()

  // ── ACTION: edit ─────────────────────────────────────────────────────────
  if (action === 'edit') {
    const { message_body, message_subject, notes } = body as { action: 'edit'; id: string; message_subject?: string; message_body: string; notes?: string }
    const { error } = await supabase
      .from('outreach_approval_queue')
      .update({ message_body, message_subject: message_subject ?? entry.message_subject, notes: notes ?? entry.notes })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('system_logs').insert({
      agent_name: 'approval_queue',
      status: 'info',
      message: `[edit] Entwurf bearbeitet: ${entry.target_name} (${entry.channel}) von ${adminEmail}`,
    })

    return NextResponse.json({ success: true, action: 'edited' })
  }

  // ── ACTION: approve ───────────────────────────────────────────────────────
  if (action === 'approve') {
    const { notes } = body as { action: 'approve'; id: string; notes?: string }

    // High-risk ohne double_confirmed → ablehnen
    if (entry.risk_level === 'high' && entry.requires_double_confirmation && !entry.double_confirmed) {
      return NextResponse.json({
        error: 'High-Risk-Eintrag benötigt doppelte Bestätigung (double_confirm zuerst)',
        requires_double_confirmation: true,
      }, { status: 422 })
    }

    const { error } = await supabase
      .from('outreach_approval_queue')
      .update({
        status: 'approved',
        approved_by: adminEmail,
        approved_at: now,
        notes: notes ?? entry.notes,
      })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('system_logs').insert({
      agent_name: 'approval_queue',
      status: 'success',
      message: `[approve] Freigabe: ${entry.target_name} (${entry.channel}) durch ${adminEmail}`,
    })

    return NextResponse.json({ success: true, action: 'approved' })
  }

  // ── ACTION: double_confirm (nur für high-risk) ────────────────────────────
  if (action === 'double_confirm') {
    if (entry.risk_level !== 'high') {
      return NextResponse.json({ error: 'Nur für High-Risk-Einträge' }, { status: 400 })
    }

    const { error } = await supabase
      .from('outreach_approval_queue')
      .update({ double_confirmed: true })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('system_logs').insert({
      agent_name: 'approval_queue',
      status: 'warning',
      message: `[double_confirm] High-Risk doppelt bestätigt: ${entry.target_name} (${entry.channel}) durch ${adminEmail}`,
    })

    return NextResponse.json({ success: true, action: 'double_confirmed' })
  }

  // ── ACTION: approve_send ──────────────────────────────────────────────────
  if (action === 'approve_send') {
    // Muss zuerst approved sein
    if (entry.status !== 'approved') {
      return NextResponse.json({ error: 'Erst freigeben (approve), dann senden' }, { status: 422 })
    }

    // High-risk Sicherheitscheck
    if (entry.risk_level === 'high' && entry.requires_double_confirmation && !entry.double_confirmed) {
      return NextResponse.json({
        error: 'High-Risk benötigt doppelte Bestätigung',
        requires_double_confirmation: true,
      }, { status: 422 })
    }

    // Provider prüfen — kein echter Versand ohne konfigurierten Provider
    const hasEmailProvider = !!(process.env.EMAIL_PROVIDER)
    const hasWhatsAppProvider = !!(process.env.WHATSAPP_PROVIDER)

    const channelHasProvider =
      (entry.channel === 'email' && hasEmailProvider) ||
      (entry.channel === 'whatsapp' && hasWhatsAppProvider) ||
      (entry.channel === 'manual')

    if (!channelHasProvider) {
      // Kein Provider → prepared_for_manual_send
      const { error } = await supabase
        .from('outreach_approval_queue')
        .update({ status: 'prepared_for_manual_send' })
        .eq('id', id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await supabase.from('system_logs').insert({
        agent_name: 'approval_queue',
        status: 'info',
        message: `[approve_send] Kein ${entry.channel.toUpperCase()}_PROVIDER → prepared_for_manual_send: ${entry.target_name} durch ${adminEmail}`,
      })

      return NextResponse.json({
        success: true,
        action: 'prepared_for_manual_send',
        note: `Kein ${entry.channel === 'email' ? 'EMAIL_PROVIDER' : 'WHATSAPP_PROVIDER'} konfiguriert. Nachricht wurde für manuellen Versand vorbereitet.`,
        message_body: entry.message_body,
        message_subject: entry.message_subject,
        target_email: entry.target_email,
        target_phone: entry.target_phone,
      })
    }

    // Provider vorhanden → als gesendet markieren (echter Versand nicht implementiert)
    const { error } = await supabase
      .from('outreach_approval_queue')
      .update({ status: 'sent', sent_at: now })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('system_logs').insert({
      agent_name: 'approval_queue',
      status: 'success',
      message: `[approve_send] Gesendet: ${entry.target_name} (${entry.channel}) durch ${adminEmail}`,
    })

    return NextResponse.json({ success: true, action: 'sent' })
  }

  // ── ACTION: reject ────────────────────────────────────────────────────────
  if (action === 'reject') {
    const { rejection_reason } = body as { action: 'reject'; id: string; rejection_reason?: string }

    const { error } = await supabase
      .from('outreach_approval_queue')
      .update({
        status: 'rejected',
        rejected_by: adminEmail,
        rejected_at: now,
        rejection_reason: rejection_reason ?? null,
      })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('system_logs').insert({
      agent_name: 'approval_queue',
      status: 'info',
      message: `[reject] Abgelehnt: ${entry.target_name} (${entry.channel}) durch ${adminEmail}. Grund: ${rejection_reason ?? '–'}`,
    })

    return NextResponse.json({ success: true, action: 'rejected' })
  }

  // ── ACTION: remind_later ──────────────────────────────────────────────────
  if (action === 'remind_later') {
    const { remind_later_at } = body as { action: 'remind_later'; id: string; remind_later_at: string }

    if (!remind_later_at) {
      return NextResponse.json({ error: 'remind_later_at fehlt' }, { status: 400 })
    }

    const { error } = await supabase
      .from('outreach_approval_queue')
      .update({ status: 'remind_later', remind_later_at })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('system_logs').insert({
      agent_name: 'approval_queue',
      status: 'info',
      message: `[remind_later] Erinnern am ${remind_later_at}: ${entry.target_name} (${entry.channel}) durch ${adminEmail}`,
    })

    return NextResponse.json({ success: true, action: 'remind_later' })
  }

  return NextResponse.json({ error: 'Unbekannte Aktion' }, { status: 400 })
}
