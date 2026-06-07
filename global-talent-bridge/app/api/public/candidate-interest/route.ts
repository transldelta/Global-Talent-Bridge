/**
 * POST /api/public/candidate-interest
 *
 * Global Candidate Interest Intake — öffentlich zugänglich
 *
 * Sicherheit:
 * - Honeypot-Feld (website) gegen Bots
 * - Kein E-Mail-Versand
 * - Kein automatischer Outreach
 * - Keine Zahlung
 * - Keine Kandidatengebühr
 * - Keine Jobgarantie
 * - Keine Visa-Garantie
 * - Rate-Limit: max 10/IP/Stunde
 * - RLS: anon darf nur INSERT mit consent + safety flags
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

  if (!body.display_name || String(body.display_name).trim().length < 2) {
    errors.push('Name required (min. 2 chars)')
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

  // Duplicate check (max 2 per email)
  const { count: existingCount } = await supabase
    .from('candidate_interest_leads')
    .select('id', { count: 'exact', head: true })
    .eq('email', String(body.email).trim().toLowerCase())

  if ((existingCount ?? 0) >= 2) {
    return NextResponse.json(
      { error: 'You have already submitted your interest. We will be in touch.', code: 'duplicate_limit' },
      { status: 429 }
    )
  }

  const { data, error } = await supabase
    .from('candidate_interest_leads')
    .insert({
      display_name:         String(body.display_name ?? '').trim(),
      email:                String(body.email ?? '').trim().toLowerCase(),
      country_of_origin:    body.country_of_origin ? String(body.country_of_origin).trim() : null,
      target_country:       body.target_country ? String(body.target_country).trim() : null,
      target_countries:     Array.isArray(body.target_countries) ? body.target_countries.map(String) : null,
      sector:               body.sector   ? String(body.sector).trim()   : null,
      sectors:              Array.isArray(body.sectors) ? body.sectors.map(String) : null,
      experience_level:     body.experience_level ? String(body.experience_level).trim() : null,
      languages:            body.languages ? String(body.languages).trim() : null,
      qualifications:       body.qualifications ? String(body.qualifications).trim() : null,
      relocation_readiness: body.relocation_readiness ? String(body.relocation_readiness).trim() : null,
      message:              body.message ? String(body.message).trim() : null,
      consent_to_contact:   true,
      source_page:          body.source_page ? String(body.source_page) : '/global/candidates',
      // Safety invariants — immer true
      no_email_sent:        true,
      no_auto_outreach:     true,
      no_payment_started:   true,
      no_job_guarantee:     true,
      no_visa_guarantee:    true,
      no_candidate_fee:     true,
      no_scraping:          true,
    })
    .select('id, created_at')
    .single()

  if (error) {
    console.error('[CandidateInterest] Insert failed:', error.message)
    return NextResponse.json(
      { error: 'Submission failed. Please try again.', code: 'db_error' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok:      true,
    id:      data?.id,
    message: 'Your interest has been registered. We will review it manually — no automatic responses, no fees, no guarantees.',
    safetyConfirmed: {
      noEmailSent:      true,
      noAutoOutreach:   true,
      noPayment:        true,
      noJobGuarantee:   true,
      noVisaGuarantee:  true,
      noCandidateFee:   true,
    },
  })
}
