'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = [
  'planned',
  'contacted',
  'interested',
  'not_interested',
  'follow_up',
  'converted',
  'archived',
] as const

const VALID_PRIORITIES = ['high', 'normal', 'low'] as const

function revalidateAll(id?: string) {
  revalidatePath('/admin/outreach')
  revalidatePath('/admin/ceo-dashboard')
  if (id) revalidatePath(`/admin/outreach/${id}`)
}

/**
 * Neues Outreach-Ziel anlegen.
 * Nur Admin — Service Role serverseitig — keine E-Mail, kein Auto-Kontakt.
 */
export async function createOutreachTargetAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const company_name = (formData.get('company_name') as string)?.trim()
  if (!company_name) return

  const priority = formData.get('priority') as string
  const safePriority = VALID_PRIORITIES.includes(priority as typeof VALID_PRIORITIES[number])
    ? priority
    : 'normal'

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('outreach_targets')
    .insert({
      company_name,
      contact_person: (formData.get('contact_person') as string)?.trim() || null,
      email: (formData.get('email') as string)?.trim() || null,
      phone: (formData.get('phone') as string)?.trim() || null,
      website: (formData.get('website') as string)?.trim() || null,
      sector: (formData.get('sector') as string)?.trim() || null,
      city: (formData.get('city') as string)?.trim() || null,
      country: (formData.get('country') as string)?.trim() || 'Deutschland',
      notes: (formData.get('notes') as string)?.trim() || null,
      priority: safePriority,
      status: 'planned',
    })
    .select('id')
    .single()

  revalidateAll()
  redirect(data?.id ? `/admin/outreach/${data.id}` : '/admin/outreach')
}

/**
 * Status eines Outreach-Ziels aktualisieren.
 */
export async function updateOutreachStatusAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  const status = formData.get('status') as string
  if (!id || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) return

  const supabase = createAdminClient()
  await supabase.from('outreach_targets').update({ status }).eq('id', id)

  revalidateAll(id)
}

/**
 * Als kontaktiert markieren → status='contacted', last_contacted_at=now().
 * Keine E-Mail wird gesendet.
 */
export async function markOutreachContactedAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  if (!id) return

  const supabase = createAdminClient()
  await supabase
    .from('outreach_targets')
    .update({ status: 'contacted', last_contacted_at: new Date().toISOString() })
    .eq('id', id)

  revalidateAll(id)
}

/**
 * Als interessiert markieren → status='interested'.
 */
export async function markOutreachInterestedAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  if (!id) return

  const supabase = createAdminClient()
  await supabase.from('outreach_targets').update({ status: 'interested' }).eq('id', id)

  revalidateAll(id)
}

/**
 * Als nicht interessiert markieren → status='not_interested'.
 */
export async function markOutreachNotInterestedAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  if (!id) return

  const supabase = createAdminClient()
  await supabase.from('outreach_targets').update({ status: 'not_interested' }).eq('id', id)

  revalidateAll(id)
}

/**
 * Als konvertiert markieren → status='converted'.
 */
export async function markOutreachConvertedAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  if (!id) return

  const supabase = createAdminClient()
  await supabase.from('outreach_targets').update({ status: 'converted' }).eq('id', id)

  revalidateAll(id)
}

/**
 * Archivieren → status='archived'.
 */
export async function archiveOutreachAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  if (!id) return

  const supabase = createAdminClient()
  await supabase.from('outreach_targets').update({ status: 'archived' }).eq('id', id)

  revalidateAll(id)
}

/**
 * Notizen speichern.
 */
export async function updateOutreachNotesAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  const notes = (formData.get('notes') as string)?.trim() || null
  if (!id) return

  const supabase = createAdminClient()
  await supabase.from('outreach_targets').update({ notes }).eq('id', id)

  revalidateAll(id)
}

/**
 * Follow-up-Datum setzen.
 */
export async function updateOutreachFollowUpAction(formData: FormData) {
  const admin = await getCurrentAdminUser()
  if (!admin) return

  const id = formData.get('id') as string
  const raw = (formData.get('next_follow_up_at') as string)?.trim() || null
  if (!id) return

  const supabase = createAdminClient()
  await supabase
    .from('outreach_targets')
    .update({ next_follow_up_at: raw || null, status: raw ? 'follow_up' : undefined })
    .eq('id', id)

  revalidateAll(id)
}
