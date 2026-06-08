/**
 * GET  /api/admin/growth/targets  — load all growth targets (admin only)
 * POST /api/admin/growth/targets  — create single or bulk targets (admin only)
 *
 * Safety: no_auto_send, no_job_guarantee, no_visa_guarantee forced TRUE at DB level.
 * No email sent. No automatic outreach. Admin auth required.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser }       from '@/lib/admin'
import { createAdminClient }         from '@/lib/supabase/admin'

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('growth_targets')
    .select('*, growth_messages(id, channel, subject, status)')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    console.error('[growth/targets GET]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ targets: data ?? [] })
}

// ── POST (bulk or single) ─────────────────────────────────────────────────────

interface TargetInput {
  target_kind?:       string
  company_name?:      string
  contact_email?:     string
  website_url?:       string
  contact_page_url?:  string
  country?:           string
  source_market?:     string
  destination_market?: string
  sector?:            string
  route?:             string
  corridor?:          string
  message_type?:      string
  fit_score?:         number
  risk_level?:        string
  status?:            string
  notes?:             string
  // message to also save
  message_subject?:   string
  message_body?:      string
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: TargetInput | TargetInput[]
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const inputs: TargetInput[] = Array.isArray(body) ? body.slice(0, 50) : [body]
  if (inputs.length === 0) return NextResponse.json({ error: 'No targets provided' }, { status: 400 })

  const supabase = createAdminClient()
  const created = []
  const errors  = []

  for (const input of inputs) {
    const row = {
      target_kind:        input.target_kind        ?? 'employer',
      company_name:       (input.company_name       ?? '').trim().slice(0, 300),
      contact_email:      (input.contact_email       ?? '').trim(),
      website_url:        (input.website_url         ?? '').trim(),
      contact_page_url:   (input.contact_page_url    ?? '').trim(),
      country:            (input.country             ?? '').trim(),
      source_market:      (input.source_market       ?? '').trim(),
      destination_market: (input.destination_market  ?? '').trim(),
      sector:             (input.sector              ?? '').trim(),
      route:              (input.route               ?? '').trim(),
      corridor:           (input.corridor            ?? '').trim(),
      message_type:       (input.message_type        ?? '').trim(),
      fit_score:          typeof input.fit_score === 'number' ? Math.min(100, Math.max(0, input.fit_score)) : 0,
      risk_level:         ['low', 'medium', 'high'].includes(input.risk_level ?? '') ? input.risk_level : 'unknown',
      status:             validateStatus(input.status ?? '') ? (input.status ?? 'target_profile') : 'target_profile',
      notes:              (input.notes ?? '').trim(),
      no_auto_send:       true,
      no_job_guarantee:   true,
      no_visa_guarantee:  true,
      created_by:         admin.id ?? null,
    }

    const { data: target, error: tErr } = await supabase
      .from('growth_targets')
      .insert(row)
      .select()
      .single()

    if (tErr) { errors.push({ company: row.company_name, error: tErr.message }); continue }

    // Save generated message if provided
    if (input.message_subject && input.message_body && target) {
      await supabase.from('growth_messages').insert({
        target_id:   target.id,
        channel:     'email',
        subject:     input.message_subject.trim().slice(0, 500),
        body:        input.message_body.trim(),
        status:      'prepared',
        no_auto_send: true,
      })
    }

    created.push(target)
  }

  return NextResponse.json({ created, errors, count: created.length }, { status: 201 })
}

function validateStatus(s: string): boolean {
  return [
    'target_profile', 'real_contact_needed', 'draft_prepared',
    'needs_review', 'screenshot_review', 'approved_to_send_manually',
    'sent_manually', 'replied', 'rejected',
  ].includes(s)
}
