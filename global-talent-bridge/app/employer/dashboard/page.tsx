import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/actions'

export default async function EmployerDashboard() {
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

  // Arbeitgeberprofil laden
  const { data: employer } = await supabase
    .from('employers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Jobs laden
  let jobs: Array<{
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
  }> = []

  if (employer) {
    const { data: jobData } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employer.id)
      .order('created_at', { ascending: false })

    if (jobData) jobs = jobData
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-white font-semibold">Global Talent Bridge</span>
            <span className="ml-2 text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">Arbeitgeber</span>
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

        {/* Kein Arbeitgeberprofil */}
        {!employer && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-2xl p-6 flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h2 className="text-lg font-semibold text-yellow-300 mb-1">Profil unvollständig</h2>
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
              <h2 className="text-lg font-semibold text-white">🏢 {employer.company_name}</h2>
              <Link href="/employer/onboarding" className="text-sm text-blue-400 hover:text-blue-300">
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
                        {job.sector && <span>{job.sector}</span>}
                        {job.city && <span> · {job.city}</span>}
                        {job.country && <span>, {job.country}</span>}
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
      </div>
    </div>
  )
}
