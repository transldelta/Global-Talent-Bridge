import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

type Job = {
  id: string
  title: string
  sector: string | null
  city: string | null
  country: string | null
  is_active: boolean
  required_experience: number
  required_german: string | null
  required_english: string | null
  salary_range: string | null
  created_at: string
}

type MatchRow = {
  id: string
  job_id: string
  candidate_id: string
  score: number
  status: string
}

type CandidateInfo = {
  id: string
  user_id: string
  sector: string | null
}

type ProfileInfo = {
  id: string
  full_name: string | null
}

type EnrichedMatch = {
  id: string
  job_id: string
  job_title: string
  candidate_id: string
  candidate_name: string | null
  candidate_sector: string | null
  score: number
  status: string
}

export default async function EmployerDashboard() {
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

  // Arbeitgeberprofil laden (eigenes — RLS schützt fremde Daten)
  const { data: employer } = await supabase
    .from('employers')
    .select('id, company_name, sector, country, contact_email')
    .eq('user_id', user.id)
    .single()

  // Jobs laden (eigene — RLS: employer_id = employer.id)
  let jobs: Job[] = []
  let enrichedMatches: EnrichedMatch[] = []

  if (employer) {
    const { data: jobData } = await supabase
      .from('jobs')
      .select(
        'id, title, sector, city, country, is_active, required_experience, required_german, required_english, salary_range, created_at'
      )
      .eq('employer_id', employer.id)
      .order('created_at', { ascending: false })

    if (jobData) jobs = jobData

    // Matches zu eigenen Jobs laden
    // RLS-Policy "matches_select_as_employer" erlaubt dies für den eingeloggten Arbeitgeber
    if (jobs.length > 0) {
      const jobIds = jobs.map((j) => j.id)

      const { data: matchData } = await supabase
        .from('matches')
        .select('id, job_id, candidate_id, score, status')
        .in('job_id', jobIds)
        .order('score', { ascending: false })
        .limit(50)

      if (matchData && matchData.length > 0) {
        const matches: MatchRow[] = matchData

        // Kandidaten-Infos und Profile mit Admin-Client laden
        // (serverseitig, RLS umgehen für legitime cross-entity Daten)
        const adminSupabase = createAdminClient()
        const candidateIds = [...new Set(matches.map((m) => m.candidate_id))]

        const [candidatesRes, profilesForCandidatesRes] = await Promise.all([
          adminSupabase
            .from('candidates')
            .select('id, user_id, sector')
            .in('id', candidateIds),
          // Erst candidates laden, dann profiles — wir holen alle profiles für die user_ids
          Promise.resolve({ data: null as ProfileInfo[] | null }),
        ])

        const candidateMap = new Map<string, CandidateInfo>(
          (candidatesRes.data ?? []).map((c: CandidateInfo) => [c.id, c])
        )

        // Profile für die user_ids der Kandidaten laden
        const userIds = (candidatesRes.data ?? []).map((c: CandidateInfo) => c.user_id)
        const { data: profileData } = userIds.length > 0
          ? await adminSupabase
              .from('profiles')
              .select('id, full_name')
              .in('id', userIds)
          : { data: [] as ProfileInfo[] }

        const profileMap = new Map<string, ProfileInfo>(
          (profileData ?? []).map((p: ProfileInfo) => [p.id, p])
        )

        // Job-Titel-Map für schnellen Lookup
        const jobTitleMap = new Map<string, string>(jobs.map((j) => [j.id, j.title]))

        enrichedMatches = matches.map((m) => {
          const candidate = candidateMap.get(m.candidate_id)
          const profileEntry = candidate ? profileMap.get(candidate.user_id) : null
          return {
            id: m.id,
            job_id: m.job_id,
            job_title: jobTitleMap.get(m.job_id) ?? '—',
            candidate_id: m.candidate_id,
            candidate_name: profileEntry?.full_name ?? null,
            candidate_sector: candidate?.sector ?? null,
            score: m.score,
            status: m.status,
          }
        })

        // Suppress unused variable warning
        void profilesForCandidatesRes
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Arbeitgeber" badgeColor="green" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Willkommen */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hallo{profile?.full_name ? `, ${profile.full_name}` : ''} 👋
          </h1>
          <p className="text-gray-400 mt-1">{user.email}</p>
        </div>

        {/* Kein Arbeitgeberprofil */}
        {!employer && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-2xl p-6 flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h2 className="text-lg font-semibold text-yellow-300 mb-1">
                Profil unvollständig
              </h2>
              <p className="text-yellow-200/70 text-sm mb-4">
                Erstelle dein Unternehmensprofil und füge Jobs hinzu.
              </p>
              <Link
                href="/employer/onboarding"
                className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Profil ausfüllen →
              </Link>
            </div>
          </div>
        )}

        {/* Unternehmensprofil */}
        {employer && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                🏢 {employer.company_name}
              </h2>
              <Link
                href="/employer/onboarding"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Bearbeiten
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Branche</p>
                <p className="text-white text-sm">{employer.sector || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Land</p>
                <p className="text-white text-sm">{employer.country || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Kontakt</p>
                <p className="text-white text-sm">{employer.contact_email || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Meine Jobs
              {jobs.length > 0 && (
                <span className="ml-2 text-sm text-gray-400 font-normal">({jobs.length})</span>
              )}
            </h2>
            {employer && (
              <Link
                href="/employer/onboarding"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Job hinzufügen
              </Link>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
              <div className="text-4xl mb-3">💼</div>
              <p className="text-gray-400">Noch keine Jobs. Fülle zuerst dein Profil aus.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {jobs.map((job) => (
                <div key={job.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">{job.title}</p>
                      <p className="text-gray-400 text-sm mt-0.5">
                        {[job.sector, job.city, job.country].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        job.is_active
                          ? 'bg-green-900/40 text-green-300'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {job.is_active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                    {job.required_experience > 0 && (
                      <span>🕐 {job.required_experience}+ Jahre</span>
                    )}
                    {job.required_german && <span>🇩🇪 DE: {job.required_german}</span>}
                    {job.required_english && <span>🇬🇧 EN: {job.required_english}</span>}
                    {job.salary_range && <span>💰 {job.salary_range}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matches zu eigenen Jobs */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Kandidaten-Matches
            {enrichedMatches.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">
                ({enrichedMatches.length})
              </span>
            )}
          </h2>

          {enrichedMatches.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-400 text-sm">
                Noch keine Matches für deine Jobs. Sobald Kandidaten das Matching starten,
                erscheinen ihre Profile hier.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {enrichedMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {match.candidate_name ?? 'Kandidat (anonym)'}
                    </p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {[match.candidate_sector, match.job_title]
                        .filter(Boolean)
                        .join(' → ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
