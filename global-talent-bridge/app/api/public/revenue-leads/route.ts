/**
 * POST /api/public/revenue-leads
 *
 * Inbound Revenue Lead Capture — öffentlich zugänglich
 *
 * Sicherheit:
 * - Honeypot-Feld (website) gegen Bots
 * - Serverseitige Validierung aller Felder
 * - Kein E-Mail-Versand
 * - Kein automatischer Outreach
 * - Keine Zahlung
 * - Rate-Limit: max 5 Leads pro E-Mail (DB-seitig geprüft)
 * - Nur INSERT via service_role (RLS bypass)
 *
 * Phase 1: Alle Leads landen zur manuellen Prüfung im Admin-Inbox.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient }         from '@/lib/supabase/admin'
import { validateLeadInput, calculateLeadScore } from '@/lib/revenue-leads'
import type { LeadFormInput }                    from '@/lib/revenue-leads'

export const dynamic = 'force-dynamic'

// ── Einfaches In-Memory Rate-Limit (pro Node-Instanz, ergänzend zu DB-Check) ─

const ipSubmissions = new Map<string, number[]>()
const RATE_WINDOW_MS  = 60 * 60 * 1000  // 1 Stunde
const RATE_LIMIT      = 10              // max 10 Requests pro IP/Stunde

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const times = (ipSubmissions.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  if (times.length >= RATE_LIMIT) return false
  times.push(now)
  ipSubmissions.set(ip, times)
  return true
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {

  // ── 1. Rate-Limit prüfen ──────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte später erneut versuchen.', code: 'rate_limited' },
      { status: 429 }
    )
  }

  // ── 2. Body parsen ─────────────────────────────────────────────────────────
  let body: LeadFormInput
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON', code: 'bad_request' }, { status: 400 })
  }

  // ── 3. Honeypot-Check (Bot-Schutz) ─────────────────────────────────────────
  if (body.website && body.website.trim().length > 0) {
    // Stille Ablehnung — Bots bekommen 200 ohne zu wissen, dass sie blockiert wurden
    return NextResponse.json({ success: true, id: 'bot_blocked' })
  }

  // ── 4. Validierung ─────────────────────────────────────────────────────────
  const { valid, errors } = validateLeadInput(body)
  if (!valid) {
    return NextResponse.json(
      { error: 'Validierungsfehler', errors, code: 'validation_error' },
      { status: 422 }
    )
  }

  // ── 5. DB: Duplicate-Check (max 5 Leads pro E-Mail) ───────────────────────
  const supabase   = createAdminClient()
  const emailNorm  = body.email.trim().toLowerCase()

  const { count } = await supabase
    .from('revenue_leads')
    .select('id', { count: 'exact', head: true })
    .eq('email', emailNorm)
    .eq('lead_type', body.lead_type)

  if ((count ?? 0) >= 5) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen von dieser E-Mail-Adresse.', code: 'duplicate_limit' },
      { status: 429 }
    )
  }

  // ── 6. Lead speichern ─────────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('revenue_leads')
    .insert({
      lead_type:          body.lead_type,
      organization_name:  body.organization_name.trim(),
      contact_name:       body.contact_name.trim(),
      email:              emailNorm,
      country:            body.country?.trim() || null,
      city:               body.city?.trim()    || null,
      sector:             body.sector?.trim()  || null,
      message:            body.message?.trim() || null,
      consent_to_contact: body.consent_to_contact,
      source_page:        body.source_page || 'unknown',
      status:             'new',
      lead_score:         calculateLeadScore({
        lead_type:          body.lead_type,
        consent_to_contact: body.consent_to_contact,
        sector:             body.sector?.trim() || null,
        country:            body.country?.trim() || null,
        message:            body.message?.trim() || null,
      }),
      interest_type:      body.interest_type || null,
      // Safety constraints (DB CHECK stellt sicher, dass diese nie false sein können)
      no_email_sent:       true,
      no_auto_outreach:    true,
      no_payment_started:  true,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[RevenueLeads] Insert error:', error.message)
    return NextResponse.json(
      { error: 'Anfrage konnte nicht gespeichert werden. Bitte versuche es erneut.', code: 'db_error' },
      { status: 500 }
    )
  }

  // ── 7. Erfolg — kein Versand, kein Outreach ───────────────────────────────
  return NextResponse.json({
    success:           true,
    id:                data?.id,
    message:           'Ihre Anfrage wurde erfolgreich eingereicht. Wir melden uns manuell.',
    safetyConfirmed: {
      noEmailSent:       true,
      noAutoOutreach:    true,
      noPaymentStarted:  true,
    },
  })
}

// GET ist nicht erlaubt
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
