import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavBar } from '@/app/_components/NavBar'
import { MatchingButton } from '@/app/candidate/_components/MatchingButton'

// -------------------------------------------------------
// Typen
// -------------------------------------------------------
type JobData = {
  id: string
  title: string
  sector: string | null
  city: string | null
  country: string | null
  salary_range: string | null
}

type MatchRow = {
  id: string
  score: number
  status: string
  job_id: string
  jobs: JobData | null
}

// -------------------------------------------------------
// Page
// -------------------------------------------------------
export default async function CandidateDashboard({
  searchParams,
}: {
  searchParams: { matched?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Profil laden
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  // Kandidatenprofil laden
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id, sector, years_experience, german_level, english_level, skills')
    .eq('user_id', user.id)
    .single()

  // ----------------------------------------------------------
  // Matches: 2-Schritt-Abfrage (umgeht PostgREST-Join-Probleme
  // bei RLS auf verschachtelten Tabellen)
  // ----------------------------------------------------------
  let matches: MatchRow[] = []

  if (candidate) {
    // Schritt 1: Matches des Kandidaten laden
    const { data: matchData } = await supabase
      .from('matches')
      .select('id, score, status, job_id')
      .eq('candidate_id', candidate.id)
      .order('score', { ascending: false })
      .limit(20)

    if (matchData && matchData.length > 0) {
      // Schritt 2: Job-Details separat laden (RLS: is_active=true)
      const jobIds = matchData.map((m) => m.job_id)

      const { data: jobData } = await supabase
        .from('jobs')
        .select('id, title, sector, city, country, salary_range')
        .in('id', jobIds)

      // Schritt 3: Im Code zusammenführen
      const jobMap = new Map<string, JobData>(
        (jobData ?? []).map((j) => [
          j.id,
          {
            id: j.id,
            title: j.title,
            sector: j.sector ?? null,
            city: j.city ?? null,
            country: j.country ?? null,
            salary_range: j.salary_range ?? null,
          },
        ])
      )

      matches = matchData.map((m) => ({
        id: m.id,
        score: m.score,
        status: m.status,
        job_id: m.job_id,
        jobs: jobMap.get(m.job_id) ?? null,
      }))
    }
  }

  const showMatchingSuccess = searchParams?.matched === 'true'

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Kandidat" badgeColor="blue" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Erfolgsmeldung nach Matching */}
        {showMatchingSuccess && (
          <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-green-300 font-medium text-sm">
                Matching erfolgreich gestartet!
              </p>
              <p className="text-green-200/70 text-xs mt-0.5">
                Deine Matches wurden berechnet und aktualisiert.
              </p>
            </div>
          </div>
        )}

        {/* Willkommen */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hallo{profile?.full_name ? `, ${profile.full_name}` : ''} 👋
          </h1>
          <p className="text-gray-400 mt-1">{user.email}</p>
        </div>

        {/* Kein Kandidatenprofil */}
        {!candidate && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-2xl p-6 flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h2 className="text-lg font-semibold text-yellow-300 mb-1">
                Profil unvollständig
              </h2>
              <p className="text-yellow-200/70 text-sm mb-4">
                Erstelle dein Kandidatenprofil, damit wir passende Jobs finden können.
              </p>
              <Link
                href="/candidate/onboarding"
                className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Profil ausfüllen →
              </Link>
            </div>
          </div>
        )}

        {/* Profil-Karte */}
        {candidate && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Mein Profil</h2>
              <Link
                href="/candidate/onboarding"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Bearbeiten
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Branche</p>
                <p className="text-white text-sm font-medium">
                  {candidate.sector || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Erfahrung</p>
                <p className="text-white text-sm font-medium">
                  {candidate.years_experience} Jahre
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Deutsch</p>
                <p className="text-white text-sm font-medium">
                  {candidate.german_level || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Englisch</p>
                <p className="text-white text-sm font-medium">
                  {candidate.english_level || '—'}
                </p>
              </div>
              {Array.isArray(candidate.skills) && candidate.skills.length > 0 && (
                <div className="col-span-2 sm:col-span-4">
                  <p className="text-xs text-gray-500 mb-2">Fähigkeiten</p>
                  <div className="flex flex-wrap gap-2">
                    {(candidate.skills as string[]).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aktionen */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/jobs"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Alle Jobs ansehen
          </Link>
          {candidate && <MatchingButton />}
        </div>

        {/* Matches */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Meine Matches
            {matches.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">
                ({matches.length})
              </span>
            )}
          </h2>

          {matches.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-400">
                Noch keine Matches. Starte das Matching oder fülle zuerst dein Profil aus.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {match.jobs?.title ?? 'Stelle wird geladen…'}
                    </p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {[
                        match.jobs?.sector,
                        match.jobs?.city,
                        match.jobs?.country,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {match.jobs?.salary_range && (
                      <p className="text-gray-500 text-xs mt-1">
                        💰 {match.jobs.salary_range}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`text-lg font-bold ${
                        match.score >= 80
                          ? 'text-green-400'
                          : match.score >= 60
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {match.score}%
                    </div>
                    <div className="text-xs text-gray-500 capitalize mt-0.5">
                      {match.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
