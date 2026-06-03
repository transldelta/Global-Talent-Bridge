import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavBar } from '@/app/_components/NavBar'
import { toggleJobActiveAction } from '@/app/employer/actions'

type Job = {
  id: string
  title: string
  sector: string | null
  city: string | null
  country: string | null
  salary_range: string | null
  is_active: boolean
  required_experience: number
  required_german: string | null
  required_english: string | null
  created_at: string
}

export default async function EmployerJobsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Arbeitgeberprofil laden
  const { data: employer } = await supabase
    .from('employers')
    .select('id, company_name')
    .eq('user_id', user.id)
    .single()

  if (!employer) redirect('/employer/onboarding')

  // Eigene Jobs laden (RLS schützt fremde Jobs)
  const { data: jobs } = await supabase
    .from('jobs')
    .select(
      'id, title, sector, city, country, salary_range, is_active, required_experience, required_german, required_english, created_at'
    )
    .eq('employer_id', employer.id)
    .order('created_at', { ascending: false })

  const jobList: Job[] = jobs ?? []

  // Matches pro Job zählen (alle Matches für eigene Jobs in einer Abfrage)
  const jobIds = jobList.map((j) => j.id)
  const { data: matchData } = jobIds.length > 0
    ? await supabase
        .from('matches')
        .select('job_id')
        .in('job_id', jobIds)
    : { data: [] }

  const matchCounts = new Map<string, number>()
  for (const m of matchData ?? []) {
    matchCounts.set(m.job_id, (matchCounts.get(m.job_id) ?? 0) + 1)
  }

  const activeCount = jobList.filter((j) => j.is_active).length
  const totalMatches = (matchData ?? []).length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Arbeitgeber" badgeColor="green" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meine Jobs</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {employer.company_name} · {jobList.length} Jobs · {activeCount} aktiv · {totalMatches} Matches
            </p>
          </div>
          <Link
            href="/employer/jobs/new"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Neuen Job erstellen
          </Link>
        </div>

        {/* Jobs */}
        {jobList.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10 text-center">
            <div className="text-5xl mb-4">💼</div>
            <h2 className="text-lg font-semibold text-white mb-2">Noch keine Jobs</h2>
            <p className="text-gray-400 text-sm mb-6">
              Erstelle deinen ersten Job, um Kandidaten zu finden.
            </p>
            <Link
              href="/employer/jobs/new"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Ersten Job erstellen →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {jobList.map((job) => {
              const matches = matchCounts.get(job.id) ?? 0
              return (
                <div
                  key={job.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/employer/jobs/${job.id}`}
                        className="text-white font-semibold hover:text-blue-400 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          job.is_active
                            ? 'bg-green-900/40 text-green-300'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {job.is_active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {[job.sector, job.city, job.country].filter(Boolean).join(' · ')}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1.5">
                      {job.required_experience > 0 && (
                        <span>🕐 {job.required_experience}+ Jahre</span>
                      )}
                      {job.required_german && <span>🇩🇪 {job.required_german}</span>}
                      {job.required_english && <span>🇬🇧 {job.required_english}</span>}
                      {job.salary_range && <span>💰 {job.salary_range}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Match-Anzahl */}
                    <div className="text-center hidden sm:block">
                      <div className="text-lg font-bold text-purple-400">{matches}</div>
                      <div className="text-xs text-gray-500">Matches</div>
                    </div>

                    {/* Toggle-Button */}
                    <form action={toggleJobActiveAction}>
                      <input type="hidden" name="job_id" value={job.id} />
                      <input
                        type="hidden"
                        name="current_active"
                        value={String(job.is_active)}
                      />
                      <button
                        type="submit"
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          job.is_active
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-green-900/40 text-green-300 hover:bg-green-900/60'
                        }`}
                      >
                        {job.is_active ? 'Deaktivieren' : 'Aktivieren'}
                      </button>
                    </form>

                    {/* Detail-Link */}
                    <Link
                      href={`/employer/jobs/${job.id}`}
                      className="text-xs px-3 py-1.5 bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 rounded-lg transition-colors"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
