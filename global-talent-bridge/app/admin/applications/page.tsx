import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentAdminUser } from '@/lib/admin'
import { NavBar } from '@/app/_components/NavBar'
import { ApplicationReviewButton } from './ApplicationReviewButton'
import Link from 'next/link'

type Application = {
  id: string
  candidate_id: string
  job_id: string
  match_id: string | null
  status: string
  cover_note: string | null
  admin_note: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  employer_notified_at: string | null
  created_at: string
  auto_generated_message: boolean
  message_generation_mode: 'manual' | 'test_auto'
}

type CandidateProfile = {
  id: string
  first_name: string | null
  last_name: string | null
  profession: string | null
  country_of_origin: string | null
  cv_url: string | null
  cv_filename: string | null
}

type JobPosting = {
  id: string
  title: string
  location: string | null
  employer_id: string
}

type Employer = {
  id: string
  company_name: string
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:            'bg-yellow-900/30 text-yellow-300 border border-yellow-800/40',
    reviewed:           'bg-blue-900/30 text-blue-300 border border-blue-800/40',
    employer_notified:  'bg-purple-900/30 text-purple-300 border border-purple-800/40',
    accepted:           'bg-green-900/30 text-green-300 border border-green-800/40',
    rejected:           'bg-red-900/30 text-red-300 border border-red-800/40',
    withdrawn:          'bg-gray-800 text-gray-400 border border-gray-700',
  }
  const label: Record<string, string> = {
    pending:            '⏳ Ausstehend',
    reviewed:           '🔍 Geprüft',
    employer_notified:  '✅ Freigegeben',
    accepted:           '🎉 Angenommen',
    rejected:           '❌ Abgelehnt',
    withdrawn:          '↩ Zurückgezogen',
  }
  return (
    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${map[status] ?? 'bg-gray-800 text-gray-400'}`}>
      {label[status] ?? status}
    </span>
  )
}

export default async function AdminApplicationsPage() {
  await getCurrentAdminUser()
  const adminSupabase = createAdminClient()

  // Load all applications
  const { data: applications, error: appsError } = await adminSupabase
    .from('application_requests')
    .select('*')
    .order('created_at', { ascending: false })

  // Sichtbarer Fehler wenn Service Role Key fehlt / ungültig
  if (appsError) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <NavBar badge="Admin" badgeColor="purple" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 space-y-2">
            <p className="text-red-400 font-semibold">⚠️ Datenbankfehler — Bewerbungen konnten nicht geladen werden</p>
            <p className="text-red-300/80 text-sm font-mono">{appsError.message}</p>
            <p className="text-gray-400 text-sm mt-3">
              Häufige Ursache: <code className="text-yellow-400">SUPABASE_SERVICE_ROLE_KEY</code> ist nicht gesetzt oder ungültig.
              Prüfe <code className="text-gray-300">.env.local</code> und starte den Dev-Server neu.
            </p>
          </div>
        </main>
      </div>
    )
  }

  const apps: Application[] = applications ?? []

  // Collect IDs to batch-load related data
  const candidateIds = [...new Set(apps.map((a) => a.candidate_id))]
  const jobIds       = [...new Set(apps.map((a) => a.job_id))]

  const [candidatesRes, jobsRes] = await Promise.all([
    candidateIds.length
      ? adminSupabase.from('candidates').select('id, first_name, last_name, profession, country_of_origin, cv_url, cv_filename').in('id', candidateIds)
      : { data: [] },
    jobIds.length
      ? adminSupabase.from('job_postings').select('id, title, location, employer_id').in('id', jobIds)
      : { data: [] },
  ])

  const candidateMap = new Map<string, CandidateProfile>()
  for (const c of (candidatesRes.data ?? [])) candidateMap.set(c.id, c)

  const jobMap = new Map<string, JobPosting>()
  const employerIds: string[] = []
  for (const j of (jobsRes.data ?? [])) {
    jobMap.set(j.id, j)
    if (!employerIds.includes(j.employer_id)) employerIds.push(j.employer_id)
  }

  const { data: employersData } = employerIds.length
    ? await adminSupabase.from('employers').select('id, company_name').in('id', employerIds)
    : { data: [] }
  const employerMap = new Map<string, Employer>()
  for (const e of (employersData ?? [])) employerMap.set(e.id, e)

  // Separate pending vs. done
  const pending = apps.filter((a) => a.status === 'pending' || a.status === 'reviewed')
  const done    = apps.filter((a) => !['pending', 'reviewed'].includes(a.status))

  // Quick KPIs
  const total        = apps.length
  const openCount    = pending.length
  const freedCount   = apps.filter((a) => a.status === 'employer_notified' || a.status === 'accepted').length
  const rejectedCount = apps.filter((a) => a.status === 'rejected').length

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Bewerbungen</h1>
            <p className="text-sm text-gray-400 mt-1">Alle Kandidaten-Bewerbungen — kein Kontakt ohne Admin-Freigabe.</p>
          </div>
          <Link
            href="/admin/ceo-dashboard"
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            ← CEO Dashboard
          </Link>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Gesamt',       value: total,         color: 'text-white' },
            { label: 'Offen',        value: openCount,     color: 'text-yellow-300' },
            { label: 'Freigegeben',  value: freedCount,    color: 'text-green-400' },
            { label: 'Abgelehnt',    value: rejectedCount, color: 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Pending applications */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
            Ausstehend / Zu prüfen ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500 text-sm">
              Keine offenen Bewerbungen.
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((app) => {
                const candidate = candidateMap.get(app.candidate_id)
                const job       = jobMap.get(app.job_id)
                const employer  = job ? employerMap.get(job.employer_id) : undefined
                return (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    candidate={candidate}
                    job={job}
                    employer={employer}
                  />
                )
              })}
            </div>
          )}
        </section>

        {/* Completed applications */}
        {done.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Abgeschlossen ({done.length})
            </h2>
            <div className="space-y-2">
              {done.map((app) => {
                const candidate = candidateMap.get(app.candidate_id)
                const job       = jobMap.get(app.job_id)
                const employer  = job ? employerMap.get(job.employer_id) : undefined
                return (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    candidate={candidate}
                    job={job}
                    employer={employer}
                    compact
                  />
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function ApplicationCard({
  app,
  candidate,
  job,
  employer,
  compact = false,
}: {
  app: Application
  candidate?: CandidateProfile
  job?: JobPosting
  employer?: Employer
  compact?: boolean
}) {
  const candidateName = candidate
    ? `${candidate.first_name ?? ''} ${candidate.last_name ?? ''}`.trim() || `Kandidat #${app.candidate_id.slice(0, 8)}`
    : `Kandidat #${app.candidate_id.slice(0, 8)}`

  const jobTitle   = job?.title ?? `Job #${app.job_id.slice(0, 8)}`
  const companyName = employer?.company_name ?? '—'

  const appliedDate = new Date(app.created_at).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-4 ${compact ? 'opacity-70' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Left: candidate + job info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{candidateName}</span>
            {candidate?.profession && (
              <span className="text-xs text-gray-400">{candidate.profession}</span>
            )}
            {candidate?.country_of_origin && (
              <span className="text-xs text-gray-500">🌍 {candidate.country_of_origin}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
            <span>➔</span>
            <span className="text-gray-200">{jobTitle}</span>
            <span className="text-gray-600">bei</span>
            <span className="text-blue-400">{companyName}</span>
            {job?.location && <span className="text-gray-500">📍 {job.location}</span>}
          </div>
          {/* Nachricht + Modus-Badge */}
          {app.cover_note ? (
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2">
                {app.message_generation_mode === 'test_auto' ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-300 border border-yellow-700/40">
                    🧪 Test-Auto
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                    ✍️ Manuell
                  </span>
                )}
                {app.auto_generated_message && (
                  <span className="text-xs text-yellow-500/70">
                    (serverseitig generiert)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/50 line-clamp-3 whitespace-pre-line">
                &ldquo;{app.cover_note}&rdquo;
              </p>
            </div>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700">
                ✍️ Manuell
              </span>
              <span className="text-xs text-gray-600">Keine Nachricht hinterlassen</span>
            </div>
          )}
          {app.admin_note && (
            <p className="text-xs text-blue-400 mt-1">
              📝 Admin-Notiz: {app.admin_note}
            </p>
          )}
          {/* CV-Download (nur für Admin) */}
          {candidate?.cv_url && (
            <div className="mt-1">
              <a
                href={`/api/admin/download-cv?path=${encodeURIComponent(candidate.cv_url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-blue-900/30 text-blue-300 border border-blue-800/40 hover:bg-blue-900/50 transition-colors"
              >
                📄 CV herunterladen {candidate.cv_filename ? `(${candidate.cv_filename})` : ''}
              </a>
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
            <span>Eingegangen: {appliedDate}</span>
            {app.reviewed_by && <span>· Geprüft von: {app.reviewed_by}</span>}
          </div>
        </div>

        {/* Right: status + action */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={app.status} />
          <ApplicationReviewButton
            applicationId={app.id}
            currentStatus={app.status}
          />
        </div>
      </div>
    </div>
  )
}
