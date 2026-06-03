'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_CONTACT_STATUSES = ['new', 'contacted', 'qualified', 'closed']
const VALID_LEAD_STATUSES = ['new', 'contacted', 'qualified', 'closed']

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
