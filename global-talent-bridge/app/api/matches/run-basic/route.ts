import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { scoreJobs, type CandidateForMatching, type JobForMatching } from '@/lib/matching'

export async function POST() {
  // Normalen Server Client für Auth-Prüfung (RLS aktiv)
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt.' }, { status: 401 })
  }

  // Service Role für Schreibzugriff
  const admin = createAdminClient()

  // Kandidatenprofil laden
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('id, sector, years_experience, german_level, english_level, skills, preferred_countries')
    .eq('user_id', user.id)
    .single()

  if (candidateError || !candidate) {
    return NextResponse.json(
      { error: 'Kein Kandidatenprofil gefunden. Bitte zuerst Onboarding ausfüllen.' },
      { status: 400 }
    )
  }

  // Aktive Jobs laden
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('id, employer_id, title, sector, required_experience, required_german, required_english, country, is_active')
    .eq('is_active', true)

  if (jobsError) {
    return NextResponse.json({ error: 'Fehler beim Laden der Jobs.' }, { status: 500 })
  }

  if (!jobs || jobs.length === 0) {
    return NextResponse.json({
      success: true,
      matches_created_or_updated: 0,
      results: [],
      message: 'Keine aktiven Jobs vorhanden.',
    })
  }

  // Scoring
  const candidateForMatching: CandidateForMatching = {
    id: candidate.id,
    sector: candidate.sector,
    years_experience: candidate.years_experience ?? 0,
    german_level: candidate.german_level,
    english_level: candidate.english_level,
    skills: Array.isArray(candidate.skills) ? (candidate.skills as string[]) : [],
    preferred_countries: Array.isArray(candidate.preferred_countries)
      ? (candidate.preferred_countries as string[])
      : [],
  }

  const jobsForMatching: JobForMatching[] = (jobs as JobForMatching[])

  const results = scoreJobs(candidateForMatching, jobsForMatching)

  // Nur Matches mit Score >= 50 speichern
  const goodMatches = results.filter((r) => r.score >= 50)

  let matchesCreated = 0

  if (goodMatches.length > 0) {
    const matchRows = goodMatches.map((r) => ({
      candidate_id: candidate.id,
      job_id: r.job_id,
      score: r.score,
      status: 'pending',
    }))

    const { error: upsertError } = await admin
      .from('matches')
      .upsert(matchRows, { onConflict: 'candidate_id,job_id' })

    if (!upsertError) {
      matchesCreated = goodMatches.length
    }
  }

  // System-Log schreiben
  await admin.from('system_logs').insert({
    agent_name: 'basic_matching',
    status: 'success',
    message: `Basic Matching ausgeführt: ${matchesCreated} Matches gespeichert (Score >= 50) für Kandidat ${candidate.id}`,
  })

  return NextResponse.json({
    success: true,
    matches_created_or_updated: matchesCreated,
    total_jobs_scored: results.length,
    results: results.slice(0, 10), // Top 10 zurückgeben
  })
}
