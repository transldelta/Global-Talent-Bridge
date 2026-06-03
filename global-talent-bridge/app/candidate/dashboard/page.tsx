import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/actions'

export default async function CandidateDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Profil laden
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Kandidatenprofil laden
  const { data: candidate } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', user.id)
    .single()

  type MatchRow = {
    id: string
    score: number
    status: string
    job_id: string
    jobs: { title: string; sector: string | null; city: string | null; country: string | null } | null
  }

  // Matches laden (mit Job-Daten)
  let matches: MatchRow[] = []

  if (candidate) {
    const { data: matchData } = await supabase
      .from('matches')
      .select('id, score, status, job_id, jobs(title, sector, city, country)')
      .eq('candidate_id', candidate.id)
      .order('score', { ascending: false })
      .limit(20)

    if (matchData) {
      matches = (matchData as unknown[]).map((item) => {
        const row = item as {
          id: string
          score: number
          status: string
          job_id: string
          jobs: { title: string; sector: string | null; city: string | null; country: string | null }[] | null
        }
        return {
          id: row.id,
          score: row.score,
          status: row.status,
          job_id: row.job_id,
          jobs: Array.isArray(row.jobs) && row.jobs.length > 0 ? row.jobs[0] : null,
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-white font-semibold">Global Talent Bridge</span>
            <span className="ml-2 text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">Kandidat</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-gray-400 hover:text-white transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

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
              <h2 className="text-lg font-semibold text-yellow-300 mb-1">Profil unvollständig</h2>
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
                <p className="text-white text-sm font-medium">{candidate.sector || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Erfahrung</p>
                <p className="text-white text-sm font-medium">{candidate.years_experience} Jahre</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Deutsch</p>
                <p className="text-white text-sm font-medium">{candidate.german_level || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Englisch</p>
                <p className="text-white text-sm font-medium">{candidate.english_level || '—'}</p>
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
        <div className="flex flex-wrap gap-3">
          <Link
            href="/jobs"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Alle Jobs ansehen
          </Link>
          {candidate && (
            <form action="/api/matches/run-basic" method="POST">
              <button
                type="submit"
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                ⚡ Matching starten
              </button>
            </form>
          )}
        </div>

        {/* Matches */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Meine Matches
            {matches.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">({matches.length})</span>
            )}
          </h2>

          {matches.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-400">Noch keine Matches. Starte das Matching oder fülle zuerst dein Profil aus.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">{match.jobs?.title || 'Unbekannte Stelle'}</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {match.jobs?.sector && <span>{match.jobs.sector}</span>}
                      {match.jobs?.city && <span> · {match.jobs.city}</span>}
                      {match.jobs?.country && <span>, {match.jobs.country}</span>}
                    </p>
                  </div>
                  <div className="text-right">
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
                    <div className="text-xs text-gray-500 capitalize">{match.status}</div>
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
