import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function JobsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      id, title, sector, city, country,
      required_experience, required_german, required_english,
      salary_range, created_at,
      employers(company_name)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  type JobRow = {
    id: string
    title: string
    sector: string | null
    city: string | null
    country: string | null
    required_experience: number
    required_german: string | null
    required_english: string | null
    salary_range: string | null
    created_at: string
    employers: { company_name: string } | null
  }

  type RawJobRow = Omit<JobRow, 'employers'> & {
    employers: { company_name: string }[] | null
  }

  const rawJobs: RawJobRow[] = (jobs as unknown as RawJobRow[]) || []
  const jobList: JobRow[] = rawJobs.map((j) => ({
    ...j,
    employers: Array.isArray(j.employers) && j.employers.length > 0 ? j.employers[0] : null,
  }))

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/candidate/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
              ← Dashboard
            </Link>
            <span className="text-white font-semibold">Alle Jobs</span>
          </div>
          <span className="text-gray-500 text-sm">{jobList.length} aktive Stellen</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {jobList.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💼</div>
            <h2 className="text-xl font-semibold text-white mb-2">Keine Jobs verfügbar</h2>
            <p className="text-gray-400">Aktuell sind keine aktiven Stellenangebote vorhanden.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobList.map((job) => (
              <div
                key={job.id}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                    {job.employers?.company_name && (
                      <p className="text-blue-400 text-sm mt-0.5">{job.employers.company_name}</p>
                    )}
                    <p className="text-gray-400 text-sm mt-1">
                      {[job.sector, job.city, job.country].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-green-900/40 text-green-300 font-medium">
                    Aktiv
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.required_experience > 0 && (
                    <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                      🕐 {job.required_experience}+ Jahre Erfahrung
                    </span>
                  )}
                  {job.required_german && (
                    <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                      🇩🇪 Deutsch: {job.required_german}
                    </span>
                  )}
                  {job.required_english && (
                    <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                      🇬🇧 Englisch: {job.required_english}
                    </span>
                  )}
                  {job.salary_range && (
                    <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                      💰 {job.salary_range}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
