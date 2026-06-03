import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavBar } from '@/app/_components/NavBar'
import { WithdrawButton } from './WithdrawButton'

const statusInfo: Record<string, { label: string; color: string; icon: string }> = {
  pending:            { label: 'In Prüfung',          color: 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/40', icon: '⏳' },
  reviewed:           { label: 'Geprüft',              color: 'bg-blue-900/30 text-blue-300 border border-blue-800/40',      icon: '👁️' },
  employer_notified:  { label: 'Arbeitgeber informiert', color: 'bg-purple-900/30 text-purple-300 border border-purple-800/40', icon: '📤' },
  accepted:           { label: 'Angenommen',           color: 'bg-green-900/30 text-green-300 border border-green-800/40',   icon: '✅' },
  rejected:           { label: 'Abgelehnt',            color: 'bg-red-900/20 text-red-400 border border-red-800/30',         icon: '❌' },
  withdrawn:          { label: 'Zurückgezogen',        color: 'bg-gray-800 text-gray-500 border border-gray-700',            icon: '↩️' },
}

export default async function CandidateApplicationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!candidate) redirect('/candidate/dashboard')

  // Bewerbungen laden
  const { data: applications } = await supabase
    .from('application_requests')
    .select('id, job_id, status, cover_note, created_at, updated_at, employer_notified_at')
    .eq('candidate_id', candidate.id)
    .order('created_at', { ascending: false })

  const allApps = applications ?? []

  // Jobs separat laden
  const jobIds = [...new Set(allApps.map((a) => a.job_id))]
  let jobMap = new Map<string, { title: string; sector: string | null; city: string | null }>()
  if (jobIds.length > 0) {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title, sector, city')
      .in('id', jobIds)
    for (const j of jobs ?? []) {
      jobMap.set(j.id, { title: j.title, sector: j.sector ?? null, city: j.city ?? null })
    }
  }

  const activeApps = allApps.filter((a) => a.status !== 'withdrawn')
  const withdrawnApps = allApps.filter((a) => a.status === 'withdrawn')

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Kandidat" badgeColor="blue" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">📩 Meine Bewerbungen</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {activeApps.length} aktive Bewerbungen
              {withdrawnApps.length > 0 && ` · ${withdrawnApps.length} zurückgezogen`}
            </p>
          </div>
          <Link href="/candidate/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Dashboard
          </Link>
        </div>

        {/* Info-Box */}
        <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-4">
          <p className="text-blue-300/80 text-sm leading-relaxed">
            ℹ️ Alle Bewerbungen werden zunächst von unserem Team geprüft. Erst nach Freigabe
            wird der Arbeitgeber informiert. Du wirst über Statusänderungen auf dem Laufenden gehalten.
          </p>
        </div>

        {/* Aktive Bewerbungen */}
        {activeApps.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
            <p className="text-4xl mb-3">📩</p>
            <p className="text-gray-400">Noch keine Bewerbungen.</p>
            <Link
              href="/candidate/dashboard"
              className="inline-block mt-3 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            >
              Matches ansehen & bewerben →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeApps.map((app) => {
              const job = jobMap.get(app.job_id)
              const info = statusInfo[app.status] ?? statusInfo.pending
              return (
                <div key={app.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${info.color}`}>
                          {info.icon} {info.label}
                        </span>
                      </div>
                      <h3 className="text-white font-medium">
                        {job?.title ?? 'Stelle unbekannt'}
                      </h3>
                      {(job?.sector || job?.city) && (
                        <p className="text-gray-500 text-sm mt-0.5">
                          {[job.sector, job.city].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {app.cover_note && (
                        <p className="text-gray-400 text-sm mt-2 leading-relaxed border-l-2 border-gray-700 pl-3 italic">
                          &quot;{app.cover_note}&quot;
                        </p>
                      )}
                      <p className="text-gray-600 text-xs mt-2">
                        Beworben am: {new Date(app.created_at).toLocaleDateString('de-DE')}
                        {app.employer_notified_at && (
                          <span className="ml-3">
                            · Arbeitgeber informiert: {new Date(app.employer_notified_at).toLocaleDateString('de-DE')}
                          </span>
                        )}
                      </p>
                    </div>
                    {app.status === 'pending' && (
                      <WithdrawButton applicationId={app.id} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Zurückgezogene (ausgegraut) */}
        {withdrawnApps.length > 0 && (
          <div className="space-y-2 opacity-50">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Zurückgezogen ({withdrawnApps.length})</h2>
            {withdrawnApps.map((app) => {
              const job = jobMap.get(app.job_id)
              return (
                <div key={app.id} className="bg-gray-900/50 rounded-xl border border-gray-800/50 p-4">
                  <p className="text-gray-500 text-sm line-through">{job?.title ?? 'Stelle unbekannt'}</p>
                  <p className="text-gray-600 text-xs">{new Date(app.created_at).toLocaleDateString('de-DE')}</p>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
