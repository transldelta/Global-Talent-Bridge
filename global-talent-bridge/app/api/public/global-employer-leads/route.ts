/**
 * POST /api/public/global-employer-leads
 *
 * Global Employer Intake — öffentlich zugänglich
 *
 * Sicherheit:
 * - Honeypot-Feld (website) gegen Bots
 * - Serverseitige Validierung aller Felder
 * - Kein E-Mail-Versand
 * - Kein automatischer Outreach
 * - Keine Zahlung
 * - Rate-Limit: max 10 Requests/IP/Stunde
 * - RLS: anon darf nur INSERT mit consent=true
 * - Alle Leads zur manuellen Prüfung im Admin
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient }         from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// ── Rate-Limit ────────────────────────────────────────────────────────────────

const ipSubmissions = new Map<string, number[]>()
const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT     = 10

function checkRateLimit(ip: string): boolean {
  const now   = Date.now()
  const times = (ipSubmissions.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  if (times.length >= RATE_LIMIT) return false
  times.push(now)
  ipSubmissions.set(ip, times)
  return true
}

// ── Validation ────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/

function validate(body: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (body.website && String(body.website).trim().length > 0) {
    return { valid: false, errors: ['Bot detected'] }
  }

  if (!body.organization_name || String(body.organization_name).trim().length < 2) {
    errors.push('Organization name required (min. 2 chars)')
  }
  if (!body.contact_name || String(body.contact_name).trim().length < 2) {
    errors.push('Contact name required (min. 2 chars)')
  }
  if (!body.email || !EMAIL_REGEX.test(String(body.email).trim())) {
    errors.push('Valid email required')
  }
  if (!body.consent_to_contact) {
    errors.push('Consent to contact required')
  }

  return { valid: errors.length === 0, errors }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', code: 'rate_limited' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', code: 'bad_request' }, { status: 400 })
  }

  const { valid, errors } = validate(body)
  if (!valid) {
    return NextResponse.json({ error: 'Validation failed', errors, code: 'validation_error' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Duplicate check (max 3 per email)
  const { count: existingCount } = await supabase
    .from('global_employer_leads')
    .select('id', { count: 'exact', head: true })
    .eq('email', String(body.email).trim().toLowerCase())

  if ((existingCount ?? 0) >= 3) {
    return NextResponse.json(
      { error: 'Limit reached for this email address.', code: 'duplicate_limit' },
      { status: 429 }
    )
  }

  const { data, error } = await supabase
    .from('global_employer_leads')
    .insert({
      organization_name:        String(body.organization_name ?? '').trim(),
      contact_name:             String(body.contact_name ?? '').trim(),
      email:                    String(body.email ?? '').trim().toLowerCase(),
      country:                  body.country  ? String(body.country).trim()  : null,
      city:                     body.city     ? String(body.city).trim()     : null,
      sector:                   body.sector   ? String(body.sector).trim()   : null,
      sectors:                  Array.isArray(body.sectors) ? body.sectors.map(String) : null,
      hiring_need:              body.hiring_need ? String(body.hiring_need).trim() : null,
      target_candidate_regions: body.target_candidate_regions ? String(body.target_candidate_regions).trim() : null,
      urgency:                  body.urgency  ? String(body.urgency).trim()  : null,
      qualification_level:      body.qualification_level ? String(body.qualification_level).trim() : null,
      message:                  body.message  ? String(body.message).trim()  : null,
      consent_to_contact:       true,
      source_page:              body.source_page ? String(body.source_page) : '/global/employers',
      // Safety invariants — immer true
      no_email_sent:            true,
      no_auto_outreach:         true,
      no_payment_started:       true,
      no_scraping:              true,
    })
    .select('id, created_at')
    .single()

  if (error) {
    console.error('[GlobalEmployerLeads] Insert failed:', error.message)
    return NextResponse.json(
      { error: 'Submission failed. Please try again.', code: 'db_error' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok:         true,
    id:         data?.id,
    message:    'Your request has been received. Our team will review it manually.',
    safetyConfirmed: {
      noEmailSent:    true,
      noAutoOutreach: true,
      noPayment:      true,
    },
  })
}
