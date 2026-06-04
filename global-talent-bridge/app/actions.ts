'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ============================================================
// AUTH ACTIONS
// ============================================================

/**
 * Login mit E-Mail und Passwort.
 * Leitet nach Rolle auf das richtige Dashboard weiter.
 */
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/auth/login?error=E-Mail+und+Passwort+sind+erforderlich.')
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  // Profilrolle lesen für Weiterleitung
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'employer') {
      redirect('/employer/dashboard')
    }
  }

  redirect('/candidate/dashboard')
}

/**
 * Registrierung mit E-Mail, Passwort, Name und Rolle.
 */
export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const roleInput = formData.get('role') as string

  const role = roleInput === 'employer' ? 'employer' : 'candidate'

  if (!email || !password || !full_name) {
    redirect('/auth/register?error=Alle+Felder+sind+erforderlich.')
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      },
    },
  })

  if (error) {
    redirect(`/auth/register?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/login?message=Registrierung+erfolgreich.+Bitte+einloggen.')
}

/**
 * Logout und Weiterleitung zur Startseite.
 */
export async function logoutAction() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}

/**
 * Passwort-Reset-E-Mail senden.
 * Nutzt Supabase resetPasswordForEmail ohne externen Versand-Provider.
 */
export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    redirect('/auth/forgot-password?error=E-Mail+ist+erforderlich.')
  }

  const supabase = createClient()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/auth/update-password`,
  })

  if (error) {
    redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  // Immer Erfolg anzeigen (kein E-Mail-Enumeration)
  redirect('/auth/forgot-password?message=Falls+ein+Konto+mit+dieser+E-Mail+existiert%2C+wurde+eine+Reset-E-Mail+gesendet.')
}

/**
 * Neues Passwort setzen nach Reset-Link-Klick.
 * Nur gültig wenn aktive Session (von Supabase-Callback gesetzt).
 */
export async function updatePasswordAction(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 8) {
    redirect('/auth/update-password?error=Passwort+muss+mindestens+8+Zeichen+lang+sein.')
  }

  if (password !== confirmPassword) {
    redirect('/auth/update-password?error=Passwörter+stimmen+nicht+überein.')
  }

  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect(`/auth/update-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/login?message=Passwort+erfolgreich+geändert.+Bitte+einloggen.')
}

// ============================================================
// ONBOARDING ACTIONS
// ============================================================

/**
 * Kandidaten-Onboarding speichern.
 * Aktualisiert profile, candidates und onboarding_progress.
 */
export async function saveCandidateOnboardingAction(formData: FormData) {
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  const full_name = formData.get('full_name') as string
  const country = formData.get('country') as string
  const city = formData.get('city') as string
  const sector = formData.get('sector') as string
  const years_experience = parseInt(formData.get('years_experience') as string) || 0
  const german_level = formData.get('german_level') as string
  const english_level = formData.get('english_level') as string
  const skillsRaw = formData.get('skills') as string
  const preferredCountriesRaw = formData.get('preferred_countries') as string

  const skills = skillsRaw
    ? skillsRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const preferred_countries = preferredCountriesRaw
    ? preferredCountriesRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  // Profil aktualisieren
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name, country, city, role: 'candidate' })
    .eq('id', user.id)

  if (profileError) {
    redirect(`/candidate/onboarding?error=${encodeURIComponent(profileError.message)}`)
  }

  // Kandidatenprofil upsert
  const { error: candidateError } = await supabase
    .from('candidates')
    .upsert(
      {
        user_id: user.id,
        sector,
        years_experience,
        german_level,
        english_level,
        skills,
        preferred_countries,
      },
      { onConflict: 'user_id' }
    )

  if (candidateError) {
    redirect(`/candidate/onboarding?error=${encodeURIComponent(candidateError.message)}`)
  }

  // Onboarding-Fortschritt upsert
  await supabase
    .from('onboarding_progress')
    .upsert(
      {
        user_id: user.id,
        step1_complete: true,
        step2_complete: true,
        step3_complete: true,
        step4_complete: true,
        step5_complete: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  redirect('/candidate/dashboard')
}

/**
 * Arbeitgeber-Onboarding speichern.
 * Aktualisiert profile, employers und optional ersten Job.
 */
export async function saveEmployerOnboardingAction(formData: FormData) {
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  const full_name = formData.get('full_name') as string
  const country = formData.get('country') as string
  const city = formData.get('city') as string
  const company_name = formData.get('company_name') as string
  const sector = formData.get('sector') as string
  const contact_email = formData.get('contact_email') as string

  const job_title = formData.get('job_title') as string
  const required_experience = parseInt(formData.get('required_experience') as string) || 0
  const required_german = formData.get('required_german') as string
  const required_english = formData.get('required_english') as string
  const salary_range = formData.get('salary_range') as string
  const job_city = formData.get('job_city') as string
  const job_country = formData.get('job_country') as string

  if (!company_name) {
    redirect('/employer/onboarding?error=Firmenname+ist+erforderlich.')
  }

  // Profil aktualisieren
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name, country, city, role: 'employer' })
    .eq('id', user.id)

  if (profileError) {
    redirect(`/employer/onboarding?error=${encodeURIComponent(profileError.message)}`)
  }

  // Arbeitgeberprofil upsert
  const { data: employer, error: employerError } = await supabase
    .from('employers')
    .upsert(
      {
        user_id: user.id,
        company_name,
        country,
        sector,
        contact_email,
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (employerError) {
    redirect(`/employer/onboarding?error=${encodeURIComponent(employerError.message)}`)
  }

  // Ersten Job erstellen wenn Jobtitel vorhanden
  if (job_title && employer) {
    await supabase.from('jobs').insert({
      employer_id: employer.id,
      title: job_title,
      sector,
      required_experience,
      required_german,
      required_english,
      salary_range,
      city: job_city,
      country: job_country,
      is_active: true,
    })
  }

  // Onboarding-Fortschritt upsert
  await supabase
    .from('onboarding_progress')
    .upsert(
      {
        user_id: user.id,
        step1_complete: true,
        step2_complete: true,
        step3_complete: true,
        step4_complete: true,
        step5_complete: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  redirect('/employer/dashboard')
}
