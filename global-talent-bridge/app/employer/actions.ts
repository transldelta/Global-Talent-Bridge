'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// -------------------------------------------------------
// Helper: Eingeloggten Arbeitgeber verifizieren
// Gibt null zurück wenn nicht eingeloggt oder kein Employer-Profil
// -------------------------------------------------------
async function getVerifiedEmployer() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { supabase, user: null, employer: null }

  const { data: employer } = await supabase
    .from('employers')
    .select('id, company_name')
    .eq('user_id', user.id)
    .single()

  return { supabase, user, employer }
}

// -------------------------------------------------------
// Job erstellen
// -------------------------------------------------------
/**
 * Erstellt einen neuen Job für den eingeloggten Arbeitgeber.
 * RLS: Nur eigener employer_id wird eingetragen — keine fremden Jobs möglich.
 * Bei Fehler: redirect mit ?error=... Parameter.
 * Bei Erfolg: redirect zu /employer/jobs.
 */
export async function createJobAction(formData: FormData) {
  const { supabase, user, employer } = await getVerifiedEmployer()

  if (!user) redirect('/auth/login')
  if (!employer) redirect('/employer/onboarding')

  const title = (formData.get('title') as string)?.trim()

  if (!title) {
    redirect('/employer/jobs/new?error=' + encodeURIComponent('Jobtitel ist erforderlich.'))
  }

  const requiredExperienceRaw = formData.get('required_experience') as string
  const required_experience = parseInt(requiredExperienceRaw) || 0

  const { error } = await supabase.from('jobs').insert({
    employer_id: employer.id,
    title,
    sector: (formData.get('sector') as string)?.trim() || null,
    required_experience,
    required_german: (formData.get('required_german') as string) || null,
    required_english: (formData.get('required_english') as string) || null,
    salary_range: (formData.get('salary_range') as string)?.trim() || null,
    city: (formData.get('city') as string)?.trim() || null,
    country: (formData.get('country') as string)?.trim() || null,
    is_active: formData.get('is_active') === 'true',
  })

  if (error) {
    redirect('/employer/jobs/new?error=' + encodeURIComponent(error.message))
  }

  redirect('/employer/jobs')
}

// -------------------------------------------------------
// Job aktiv/inaktiv umschalten
// -------------------------------------------------------
/**
 * Schaltet den is_active-Status eines Jobs um.
 * Sicherheitscheck: employer_id muss dem eingeloggten Arbeitgeber gehören.
 * Wird als Form-Action aus der Jobs-Liste oder Detailseite aufgerufen.
 */
export async function toggleJobActiveAction(formData: FormData) {
  const { supabase, employer } = await getVerifiedEmployer()

  if (!employer) return

  const jobId = formData.get('job_id') as string
  const currentActive = formData.get('current_active') === 'true'

  if (!jobId) return

  // Explizite Eigentümerprüfung — doppelt sicher neben RLS
  await supabase
    .from('jobs')
    .update({ is_active: !currentActive })
    .eq('id', jobId)
    .eq('employer_id', employer.id)

  revalidatePath('/employer/jobs')
  revalidatePath(`/employer/jobs/${jobId}`)
}
