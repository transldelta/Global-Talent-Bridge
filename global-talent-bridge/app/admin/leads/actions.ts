'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_CONTACT_STATUSES = ['new', 'contacted', 'qualified', 'rejected', 'closed']
const VALID_LEAD_STATUSES = ['new', 'contacted', 'qualified', 'rejected', 'closed']

/**
 * Aktualisiert den Status einer Kontaktanfrage.
 * Nur Admin — Service Role nur serverseitig — keine E-Mail wird gesendet.
 */
export async function updateContactStatusAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  const status = formData.get('status') as string

  if (!id || !VALID_CONTACT_STATUSES.includes(status)) return

  const supabase = createAdminClient()
  await supabase.from('contact_requests').update({ status }).eq('id', id)

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${id}`)
}

/**
 * Aktualisiert den Status eines Sales Leads.
 * Nur Admin — Service Role nur serverseitig — keine E-Mail wird gesendet.
 */
export async function updateLeadStatusAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  const status = formData.get('status') as string

  if (!id || !VALID_LEAD_STATUSES.includes(status)) return

  const supabase = createAdminClient()
  await supabase.from('sales_leads').update({ status }).eq('id', id)

  revalidatePath('/admin/leads')
}

/**
 * Speichert Admin-Notizen zu einer Kontaktanfrage.
 * Keine E-Mail, keine automatische Aktion.
 */
export async function updateAdminNotesAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  const admin_notes = (formData.get('admin_notes') as string | null)?.trim() ?? ''

  if (!id) return

  const supabase = createAdminClient()
  await supabase
    .from('contact_requests')
    .update({ admin_notes: admin_notes || null })
    .eq('id', id)

  revalidatePath(`/admin/leads/${id}`)
  revalidatePath('/admin/leads')
}

/**
 * Markiert eine Kontaktanfrage als manuell kontaktiert.
 * Setzt contacted_at = now() und Status auf 'contacted'.
 * Keine echte E-Mail — nur DB-Markierung.
 */
export async function markContactedAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  if (!id) return

  const supabase = createAdminClient()
  await supabase
    .from('contact_requests')
    .update({
      contacted_at: new Date().toISOString(),
      status: 'contacted',
    })
    .eq('id', id)

  revalidatePath(`/admin/leads/${id}`)
  revalidatePath('/admin/leads')
}

/**
 * Setzt das nächste Follow-up-Datum für eine Kontaktanfrage.
 * Nur DB-Feld, keine automatische Aktion.
 */
export async function updateFollowUpAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  const next_follow_up_at = (formData.get('next_follow_up_at') as string | null)?.trim() || null

  if (!id) return

  const supabase = createAdminClient()
  await supabase
    .from('contact_requests')
    .update({ next_follow_up_at: next_follow_up_at || null })
    .eq('id', id)

  revalidatePath(`/admin/leads/${id}`)
}
