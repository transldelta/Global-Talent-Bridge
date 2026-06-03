import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { toggleJobActiveAction } from '@/app/employer/actions'

type CandidateInfo = {
  id: string
  user_id: string
  sector: string | null
  years_experience: number
  german_level: string | null
  english_level: string | null
}

type ProfileInfo = {
  id: string
  full_name: string | null
}

type EnrichedMatch = {
  id: string
  score: number
  status: string
  candidate_id: string
  candidate_name: string | null
  candidate_sector: string | null
  years_experience: number
  german_level: string | null
  english_level: string | null
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Eigenes Arbeitgeberprofil laden
  const { data: employer } = await supabase
    .from('employers')
    .select('id, company_name')
    .eq('user_id', user.id)
    .single()

  if (!employer) redirect('/employer/onboarding')

  // Job laden — RLS + explizite employer_id Prüfung
  const { data: job } = await supabase
    .from('jobs')
    .select(
      'id, title, sector, city, country, salary_range, is_active, required_experience, required_german, required_english, created_at'
    )
    .eq('id', params.id)
    .eq('employer_id', employer.id) // Nur eigene Jobs
    .single()

  if (!job) notFound()

  // Matches für diesen Job laden
  const { data: matchData } = await supabase
    .from('matches')
    .select('id, score, status, candidate_id')
    .eq('job_id', job.id)
    .order('score', { ascending: false })

  let enrichedMatches: EnrichedMatch[] = []

  if (matchData && matchData.length > 0) {
    // Kandidaten-Details via Admin-Client (RLS würde Kandidaten für Arbeitgeber blocken)
    const adminSupabase = createAdminClient()
    const candidateIds = matchData.map((m) => m.candidate_id)

    const [candidatesRes] = await Promise.all([
      adminSupabase
        .from('candidates')
        .select('id, user_id, sector, years_experience, german_level, english_level')
        .in('id', candidateIds),
    ])

    const candidateMap = new Map<string, CandidateInfo>(
      (candidatesRes.data ?? []).map((c: CandidateInfo) => [c.id, c])
    )

    // Profile für Namen
    const userIds = (candidatesRes.data ?? []).map((c: CandidateInfo) => c.user_id)
    const { data: profileData } = userIds.length > 0
      ? await adminSupabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
      : { data: [] }

    const profileMap = new Map<string, ProfileInfo>(
      (profileData ?? []).map((p: ProfileInfo) => [p.id, p])
    )

    enrichedMatches = matchData.map((m) => {
      const candidate = candidateMap.get(m.candidate_id)
      const profile = candidate ? profileMap.get(candidate.user_id) : null
      return {
        id: m.id,
        score: m.score,
        status: m.status,
        candidate_id: m.candidate_id,
        candidate_name: profile?.full_name ?? null,
        candidate_sector: candidate?.sector ?? null,
        years_experience: candidate?.years_experience ?? 0,
        german_level: candidate?.german_level ?? null,
        english_level: candidate?.english_level ?? null,
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Arbeitgeber" badgeColor="green" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/employer/jobs" className="hover:text-gray-300 transition-colors">
            Meine Jobs
          </Link>
          <span>/</span>
          <span className="text-white truncate">{job.title}</span>
        </div>

        {/* Job-Header */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                <span
                  className={`text-sm px-3 py-0.5 rounded-full font-medium ${
                    job.is_active
                      ? 'bg-green-900/40 text-green-300'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {job.is_active ? '✅ Aktiv' : '⏸ Inaktiv'}
                </span>
              </div>
              <p className="text-gray-400 mt-1">
                {employer.company_name}
                {[job.sector, job.city, job.country].filter(Boolean).length > 0 &&
                  ' · ' + [job.sector, job.city, job.country].filter(Boolean).join(' · ')}
              </p>
            </div>

            {/* Toggle-Button */}
            <form action={toggleJobActiveAction}>
              <input type="hidden" name="job_id" value={job.id} />
              <input type="hidden" name="current_active" value={String(job.is_active)} />
              <button
                type="submit"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  job.is_active
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-green-700 text-white hover:bg-green-600'
                }`}
              >
                {job.is_active ? 'Deaktivieren' : 'Aktivieren'}
              </button>
            </form>
          </div>

          {/* Job-Details */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Erfahrung</p>
              <p className="text-white text-sm">
                {job.required_experience > 0 ? `${job.required_experience}+ Jahre` : 'Keine Angabe'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">🇩🇪 Deutsch</p>
              <p className="text-white text-sm">{job.required_german || 'Keine Anforderung'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">🇬🇧 Englisch</p>
              <p className="text-white text-sm">{job.required_english || 'Keine Anforderung'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Gehalt</p>
              <p className="text-white text-sm">{job.salary_range || '—'}</p>
            </div>
          </div>

          <p className="text-gray-600 text-xs mt-4">
            Erstellt: {new Date(job.created_at).toLocaleDateString('de-DE')}
          </p>
        </div>

        {/* Matches */}
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
                Noch keine Matches für diesen Job. Sobald Kandidaten das Matching starten,
                erscheinen ihre Profile hier.
              </p>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {/* Tabellenkopf */}
              <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium">
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Branche</div>
                <div className="col-span-1">Erfahrung</div>
                <div className="col-span-1">🇩🇪</div>
                <div className="col-span-1">🇬🇧</div>
                <div className="col-span-2 text-center">Score</div>
                <div className="col-span-2 text-center">Status</div>
              </div>

              <div className="divide-y divide-gray-800">
                {enrichedMatches.map((match) => (
                  <div
                    key={match.id}
                    className="px-5 py-3 grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-3">
                      <p className="text-white text-sm font-medium truncate">
                        {match.candidate_name ?? 'Kandidat (anonym)'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 text-sm truncate">
                        {match.candidate_sector ?? '—'}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-gray-400 text-sm">
                        {match.years_experience > 0 ? `${match.years_experience}J` : '—'}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-gray-400 text-xs">{match.german_level ?? '—'}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-gray-400 text-xs">{match.english_level ?? '—'}</p>
                    </div>
                    <div className="col-span-2 text-center">
                      <span
                        className={`text-sm font-bold ${
                          match.score >= 80
                            ? 'text-green-400'
                            : match.score >= 60
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {match.score}%
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-xs text-gray-500 capitalize">{match.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
