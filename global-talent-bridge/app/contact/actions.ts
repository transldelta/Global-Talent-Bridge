'use server'

import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

type ContactFormState = {
  success: boolean
  error?: string
}

// ---------------------------------------------------------------------------
// In-memory IP rate limiter — max 10 submissions per IP per hour.
// Reset on server restart (serverless: per-instance). Good enough for spam.
// ---------------------------------------------------------------------------
const _rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function _isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (_rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  )
  if (timestamps.length >= RATE_LIMIT_MAX) return true
  timestamps.push(now)
  _rateLimitMap.set(ip, timestamps)
  return false
}

/**
 * Speichert Kontaktanfrage in Supabase (contact_requests + sales_leads).
 * Sendet KEINE echte E-Mail.
 * Validiert: name, email (Format), message (min. 10 Zeichen), consent (muss true sein).
 * Sicherheit: Honeypot-Feld (website), IP-Rate-Limit (10/Stunde).
 */
export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // --- Honeypot check: bots fill hidden fields, humans don't ---
  const honeypot = (formData.get('website') as string | null) ?? ''
  if (honeypot.length > 0) {
    // Silent success — bot doesn't know it was rejected
    return { success: true }
  }

  // --- IP rate limit ---
  const headersList = headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
  if (_isRateLimited(ip)) {
    return {
      success: false,
      error: 'Zu viele Anfragen. Bitte versuche es später erneut.',
    }
  }

  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const role = (formData.get('role') as string | null)?.trim() || 'other'
  const company_name = (formData.get('company_name') as string | null)?.trim() || null
  const interest = (formData.get('interest') as string | null)?.trim() || null
  const message = (formData.get('message') as string | null)?.trim() ?? ''
  const consent = formData.get('consent') === 'true' || formData.get('consent') === 'on'

  // Validierung
  if (!name || name.length < 2) {
    return { success: false, error: 'Bitte gib deinen Namen an (mind. 2 Zeichen).' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return { success: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' }
  }

  if (!message || message.length < 10) {
    return { success: false, error: 'Bitte schreibe mindestens 10 Zeichen in deine Nachricht.' }
  }

  if (!consent) {
    return { success: false, error: 'Bitte stimme der Datenschutzerklärung zu.' }
  }

  const validRoles = ['candidate', 'employer', 'partner', 'other']
  const safeRole = validRoles.includes(role) ? role : 'other'

  const validInterests = [
    'pilot_employer',
    'candidate',
    'partnership',
    'feedback',
    'other',
    'buyer_acquisition',
  ]
  const safeInterest = interest && validInterests.includes(interest) ? interest : null

  // Admin-Client — Service Role umgeht RLS (nur serverseitig)
  const supabase = createAdminClient()

  // 1. In contact_requests speichern
  const { error: contactError } = await supabase.from('contact_requests').insert({
    name,
    email,
    role: safeRole,
    company_name,
    interest: safeInterest,
    message,
    consent: true,
    status: 'new',
  })

  if (contactError) {
    console.error('[contact] contact_requests insert error:', contactError.message)
    return {
      success: false,
      error: 'Fehler beim Speichern der Anfrage. Bitte versuche es später erneut.',
    }
  }

  // 2. Parallel als Sales Lead speichern (optional, ignoriert Fehler)
  const notesParts = [
    safeInterest ? `Interesse: ${safeInterest}` : null,
    `Kontaktformular: ${message.slice(0, 200)}`,
  ].filter(Boolean)

  await supabase.from('sales_leads').insert({
    source: 'contact_form',
    role: safeRole,
    name,
    email,
    company_name,
    status: 'new',
    priority: safeInterest === 'pilot_employer' || safeInterest === 'buyer_acquisition' ? 'high' : 'normal',
    notes: notesParts.join(' · '),
  })

  return { success: true }
}
