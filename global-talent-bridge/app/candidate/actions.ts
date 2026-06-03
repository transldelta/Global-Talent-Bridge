'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// ── Bewerbung einreichen ─────────────────────────────────────────────────────
export async function applyForJobAction(jobId: string, matchId: string | null, coverNote: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  // Kandidatenprofil laden
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!candidate) return { error: 'Kein Kandidatenprofil gefunden.' }

  // Prüfen ob Job existiert
  const { data: job } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('id', jobId)
    .single()

  if (!job) return { error: 'Stelle nicht gefunden.' }

  // Bewerbung anlegen (UNIQUE constraint verhindert Doppelbewerbung)
  const { error } = await supabase
    .from('application_requests')
    .insert({
      candidate_id: candidate.id,
      job_id: jobId,
      match_id: matchId ?? null,
      cover_note: coverNote.trim() || null,
      status: 'pending',
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Du hast dich bereits für diese Stelle beworben.' }
    }
    return { error: `Fehler: ${error.message}` }
  }

  revalidatePath('/candidate/dashboard')
  revalidatePath('/candidate/applications')
  return { success: true, jobTitle: job.title }
}

// ── Bewerbung zurückziehen ───────────────────────────────────────────────────
export async function withdrawApplicationAction(applicationId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!candidate) return { error: 'Kein Kandidatenprofil.' }

  const { error } = await supabase
    .from('application_requests')
    .update({ status: 'withdrawn' })
    .eq('id', applicationId)
    .eq('candidate_id', candidate.id)
    .eq('status', 'pending')  // Nur pending-Bewerbungen zurückziehbar

  if (error) return { error: error.message }

  revalidatePath('/candidate/applications')
  return { success: true }
}
