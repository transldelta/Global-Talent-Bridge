'use server'

import { createAdminClient } from '@/lib/supabase/admin'

type ContactFormState = {
  success: boolean
  error?: string
}

/**
 * Speichert Kontaktanfrage in Supabase (contact_requests + sales_leads).
 * Sendet KEINE echte E-Mail.
 * Validiert: name, email (Format), message (min. 10 Zeichen), consent (muss true sein).
 */
export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
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

  const validInterests = ['pilot_employer', 'candidate', 'partnership', 'feedback', 'other']
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
    priority: safeInterest === 'pilot_employer' ? 'high' : 'normal',
    notes: notesParts.join(' · '),
  })

  return { success: true }
}
