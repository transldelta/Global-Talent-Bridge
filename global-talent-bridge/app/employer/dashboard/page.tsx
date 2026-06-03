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

  // Profile + Employer parallel laden
  const [profileRes, employerRes] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', user.id).single(),
    supabase
      .from('employers')
      .select('id, company_name, sector, country, contact_email')
      .eq('user_id', user.id)
      .single(),
  ])

  const profile = profileRes.data
  const employer = employerRes.data

  let jobs: Job[] = []
  let enrichedMatches: EnrichedMatch[] = []

  if (employer) {
    // Jobs laden
    const { data: jobData } = await supabase
      .from('jobs')
      .select(
        'id, title, sector, city, country, is_active, required_experience, required_german, required_english, salary_range, created_at'
      )
      .eq('employer_id', employer.id)
      .order('created_at', { ascending: false })

    if (jobData) jobs = jobData

    // Matches zu eigenen Jobs
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
        const adminSupabase = createAdminClient()
        const candidateIds = [...new Set(matches.map((m) => m.candidate_id))]

        const { data: candidatesData } = await adminSupabase
          .from('candidates')
          .select('id, user_id, sector')
          .in('id', candidateIds)

        const candidateMap = new Map<string, CandidateInfo>(
          (candidatesData ?? []).map((c: CandidateInfo) => [c.id, c])
        )

        const userIds = (candidatesData ?? []).map((c: CandidateInfo) => c.user_id)
        const { data: profileData } = userIds.length > 0
          ? await adminSupabase
              .from('profiles')
              .select('id, full_name')
              .in('id', userIds)
          : { data: [] as ProfileInfo[] }

        const profileMap = new Map<string, ProfileInfo>(
          (profileData ?? []).map((p: ProfileInfo) => [p.id, p])
        )

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
      }
    }
  }

  // KPIs berechnen
  const activeJobs = jobs.filter((j) => j.is_active).length
  const totalMatches = enrichedMatches.length
  const bestScore = enrichedMatches.length > 0 ? Math.max(...enrichedMatches.map((m) => m.score)) : 0
  const openCandidates = enrichedMatches.filter((m) => m.status === 'pending' || m.status === 'new').length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Arbeitgeber" badgeColor="green" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

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

        {/* KPI-Kacheln */}
        {employer && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{jobs.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Jobs gesamt</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{activeJobs}</div>
              <div className="text-xs text-gray-400 mt-0.5">Aktive Jobs</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{totalMatches}</div>
              <div className="text-xs text-gray-400 mt-0.5">Matches gesamt</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {bestScore > 0 ? `${bestScore}%` : '—'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Bester Score</div>
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

        {/* Aktionen */}
        {employer && (
          <div className="flex flex-wrap gap-3">
            <Link
              href="/employer/jobs"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Meine Jobs verwalten
            </Link>
            <Link
              href="/employer/jobs/new"
              className="px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              + Neuen Job erstellen
            </Link>
            <Link
              href="/jobs"
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
            >
              Alle Jobs ansehen
            </Link>
          </div>
        )}

        {/* Kandidaten-Matches */}
        {employer && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Kandidaten-Matches
              {enrichedMatches.length > 0 && (
                <span className="ml-2 text-sm text-gray-400 font-normal">
                  ({enrichedMatches.length})
                  {openCandidates > 0 && (
                    <span className="ml-1 text-yellow-400">
                      · {openCandidates} offen
                    </span>
                  )}
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
                {enrichedMatches.slice(0, 10).map((match) => (
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
                {enrichedMatches.length > 10 && (
                  <p className="text-center text-gray-500 text-sm py-2">
                    + {enrichedMatches.length - 10} weitere Matches in{' '}
                    <Link href="/employer/jobs" className="text-blue-400 hover:text-blue-300">
                      Job-Verwaltung
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Premium-Teaser */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/40 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🚀</div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Premium-Funktionen (demnächst)</h3>
              <p className="text-gray-400 text-sm mb-3">
                In Vorbereitung: Erweiterte Kandidatenprofile, Priorität im Matching,
                unbegrenzte Jobs und Agenten-Unterstützung.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Mehr Jobs', 'Bessere Kandidatenansicht', 'Priorität-Matching', 'Team-Zugang'].map(
                  (f) => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 bg-purple-900/30 text-purple-300 rounded-full"
                    >
                      {f}
                    </span>
                  )
                )}
              </div>
              <Link
                href="/pricing"
                className="inline-block text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Pricing-Übersicht ansehen →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
