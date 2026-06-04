import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { CandidateActionButtons } from '@/app/employer/_components/CandidateActionButtons'

// ── Typen ─────────────────────────────────────────────────────────────────────

type ReleasedApp = {
  id: string
  candidate_id: string
  job_id: string
  status: 'employer_notified' | 'accepted' | 'rejected'
  cover_note: string | null
  created_at: string
  employer_notified_at: string | null
  // enriched
  job_title: string
  candidate_name: string | null
  candidate_sector: string | null
  candidate_experience: number | null
  candidate_german: string | null
  candidate_english: string | null
  candidate_skills: string[]
  match_score: number | null
  is_saved: boolean
  has_interview_request: boolean
}

// ── Hilfskomponenten ───────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null
  const colorClass =
    score >= 80 ? 'text-green-400' :
    score >= 60 ? 'text-yellow-400' :
    'text-gray-400'
  return (
    <div className="text-right shrink-0">
      <span className={`text-xl font-bold ${colorClass}`}>{score}%</span>
      <p className="text-xs text-gray-500 mt-0.5">Match</p>
    </div>
  )
}

function StatusBadge({ status }: { status: ReleasedApp['status'] }) {
  const map: Record<ReleasedApp['status'], { label: string; css: string }> = {
    employer_notified: { label: '✅ Freigegeben',  css: 'bg-green-900/20 text-green-300 border border-green-800/40' },
    accepted:          { label: '🎉 Angenommen',   css: 'bg-blue-900/20 text-blue-300 border border-blue-800/40' },
    rejected:          { label: '❌ Abgelehnt',    css: 'bg-red-900/10 text-red-400 border border-red-800/20' },
  }
  const { label, css } = map[status]
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${css}`}>
      {label}
    </span>
  )
}

function ApplicationCard({
  app,
  compact = false,
}: {
  app: ReleasedApp
  compact?: boolean
}) {
  const appliedDate = new Date(app.created_at).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
  const releasedDate = app.employer_notified_at
    ? new Date(app.employer_notified_at).toLocaleDateString('de-DE', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3 ${compact ? 'opacity-60' : ''}`}>
      {/* Kopfzeile: Name + Score */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold">
              {app.candidate_name ?? `Kandidat #${app.candidate_id.slice(0, 8)}`}
            </span>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Auf: <span className="text-gray-300">{app.job_title}</span>
          </p>
        </div>
        <ScoreBadge score={app.match_score} />
      </div>

      {/* Kandidatenprofil */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {app.candidate_sector && (
          <span className="text-gray-400">
            🏷️ <span className="text-gray-300">{app.candidate_sector}</span>
          </span>
        )}
        {app.candidate_experience !== null && (
          <span className="text-gray-400">
            💼 <span className="text-gray-300">{app.candidate_experience} J. Erfahrung</span>
          </span>
        )}
        {app.candidate_german && (
          <span className="text-gray-400">
            🇩🇪 <span className="text-gray-300">DE: {app.candidate_german}</span>
          </span>
        )}
        {app.candidate_english && (
          <span className="text-gray-400">
            🇬🇧 <span className="text-gray-300">EN: {app.candidate_english}</span>
          </span>
        )}
      </div>

      {/* Skills */}
      {app.candidate_skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {app.candidate_skills.slice(0, 8).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full border border-gray-700/50"
            >
              {skill}
            </span>
          ))}
          {app.candidate_skills.length > 8 && (
            <span className="text-xs text-gray-600 self-center">
              +{app.candidate_skills.length - 8} weitere
            </span>
          )}
        </div>
      )}

      {/* Bewerbungsschreiben */}
      {app.cover_note && (
        <blockquote className="text-xs text-gray-400 bg-gray-800/40 border-l-2 border-gray-600 rounded-r-lg px-3 py-2 italic leading-relaxed whitespace-pre-line line-clamp-5">
          &ldquo;{app.cover_note}&rdquo;
        </blockquote>
      )}

      {/* Datum */}
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <span>📅 Beworben: {appliedDate}</span>
        {releasedDate && (
          <span>· ✅ Freigegeben: {releasedDate}</span>
        )}
      </div>

      {/* Aktions-Buttons — nur für nicht abgelehnte */}
      {!compact && app.status !== 'rejected' && (
        <div className="pt-3 border-t border-gray-800/60">
          <CandidateActionButtons
            candidateId={app.candidate_id}
            jobId={app.job_id}
            applicationId={app.id}
            isSaved={app.is_saved}
            hasInterviewRequest={app.has_interview_request}
          />
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EmployerApplicationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: employer } = await supabase
    .from('employers')
    .select('id, company_name')
    .eq('user_id', user.id)
    .single()

  if (!employer) redirect('/employer/onboarding')

  // Jobs des Arbeitgebers
  const { data: jobsData } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('employer_id', employer.id)

  const jobs = jobsData ?? []
  const jobIds = jobs.map((j) => j.id)
  const jobTitleMap = new Map(jobs.map((j) => [j.id, j.title]))

  // Keine Jobs → früh zurückgeben
  if (jobIds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <NavBar badge="Arbeitgeber" badgeColor="green" />
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Header count={null} />
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-4xl mb-3">💼</p>
            <p className="text-gray-400 mb-4">Keine Jobs vorhanden. Erstelle zuerst einen Job.</p>
            <Link
              href="/employer/jobs/new"
              className="inline-block px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            >
              + Neuen Job erstellen →
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const adminSupabase = createAdminClient()

  // Freigegebene Bewerbungen + bestehende Interview-Anfragen parallel laden
  const [appsRes, interviewRes] = await Promise.all([
    adminSupabase
      .from('application_requests')
      .select('id, candidate_id, job_id, status, cover_note, created_at, employer_notified_at')
      .in('job_id', jobIds)
      .in('status', ['employer_notified', 'accepted', 'rejected'])
      .order('created_at', { ascending: false }),
    adminSupabase
      .from('interview_requests')
      .select('candidate_id, job_id')
      .eq('employer_id', employer.id),
  ])

  const apps = appsRes.data ?? []
  const interviewSet = new Set(
    (interviewRes.data ?? []).map((i) => `${i.candidate_id}:${i.job_id}`)
  )

  // Keine freigegebenen Bewerbungen → Empty State
  if (apps.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <NavBar badge="Arbeitgeber" badgeColor="green" />
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Header count={0} />
          <SecurityNote />
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-400">Noch keine freigegebenen Bewerbungen für deine Jobs.</p>
            <p className="text-xs text-gray-600 mt-2">
              Bewerbungen erscheinen hier sobald das Admin-Team sie für dich freigibt.
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Kandidaten-Profile + Matches + Gespeicherte laden
  const candidateIds = [...new Set(apps.map((a) => a.candidate_id))]

  const [candidatesRes, matchesRes, savedRes] = await Promise.all([
    adminSupabase
      .from('candidates')
      .select('id, user_id, sector, years_experience, german_level, english_level, skills')
      .in('id', candidateIds),
    adminSupabase
      .from('matches')
      .select('candidate_id, job_id, score')
      .in('job_id', jobIds)
      .in('candidate_id', candidateIds),
    adminSupabase
      .from('saved_candidates')
      .select('candidate_id, job_id')
      .eq('employer_id', employer.id),
  ])

  const candidatesData = candidatesRes.data ?? []
  const userIds = candidatesData.map((c) => c.user_id)

  const profilesRes = userIds.length > 0
    ? await adminSupabase.from('profiles').select('id, full_name').in('id', userIds)
    : { data: [] }

  // Maps aufbauen
  const candidateMap = new Map(candidatesData.map((c) => [c.id, c]))
  const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p]))
  const matchScoreMap = new Map(
    (matchesRes.data ?? []).map((m) => [`${m.candidate_id}:${m.job_id}`, m.score])
  )
  const savedSet = new Set(
    (savedRes.data ?? []).map((s) => `${s.candidate_id}:${s.job_id}`)
  )

  // Anreichern
  const enriched: ReleasedApp[] = apps.map((app) => {
    const cand = candidateMap.get(app.candidate_id)
    const prof = cand ? profileMap.get(cand.user_id) : undefined
    return {
      ...app,
      status: app.status as ReleasedApp['status'],
      job_title: jobTitleMap.get(app.job_id) ?? '—',
      candidate_name: prof?.full_name ?? null,
      candidate_sector: cand?.sector ?? null,
      candidate_experience: (cand?.years_experience as number | null) ?? null,
      candidate_german: (cand?.german_level as string | null) ?? null,
      candidate_english: (cand?.english_level as string | null) ?? null,
      candidate_skills: Array.isArray(cand?.skills) ? (cand.skills as string[]) : [],
      match_score: matchScoreMap.get(`${app.candidate_id}:${app.job_id}`) ?? null,
      is_saved: savedSet.has(`${app.candidate_id}:${app.job_id}`),
      has_interview_request: interviewSet.has(`${app.candidate_id}:${app.job_id}`),
    }
  })

  const open     = enriched.filter((a) => a.status === 'employer_notified')
  const accepted = enriched.filter((a) => a.status === 'accepted')
  const rejected = enriched.filter((a) => a.status === 'rejected')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Arbeitgeber" badgeColor="green" />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        <Header count={open.length + accepted.length} />
        <SecurityNote />

        {/* KPI-Bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Zu bearbeiten',  value: open.length,     color: 'text-green-400'  },
            { label: 'Mit Interview',  value: enriched.filter((a) => a.has_interview_request).length, color: 'text-purple-400' },
            { label: 'Gespeichert',    value: enriched.filter((a) => a.is_saved).length, color: 'text-yellow-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Offene (employer_notified) */}
        {open.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Zu bearbeiten ({open.length})
            </h2>
            <div className="space-y-4">
              {open.map((app) => <ApplicationCard key={app.id} app={app} />)}
            </div>
          </section>
        )}

        {/* Angenommen */}
        {accepted.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">
              Angenommen ({accepted.length})
            </h2>
            <div className="space-y-3">
              {accepted.map((app) => <ApplicationCard key={app.id} app={app} />)}
            </div>
          </section>
        )}

        {/* Abgelehnte — ausgegraut */}
        {rejected.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Abgelehnt ({rejected.length})
            </h2>
            <div className="space-y-2">
              {rejected.map((app) => <ApplicationCard key={app.id} app={app} compact />)}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

// ── Shared Layout-Teile ───────────────────────────────────────────────────────

function Header({ count }: { count: number | null }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">📩 Freigegebene Bewerbungen</h1>
        {count !== null && (
          <p className="text-sm text-gray-400 mt-1">
            {count} freigegeben — bereit zur Bearbeitung
          </p>
        )}
      </div>
      <Link
        href="/employer/dashboard"
        className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
      >
        ← Dashboard
      </Link>
    </div>
  )
}

function SecurityNote() {
  return (
    <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-4">
      <p className="text-blue-300/80 text-sm leading-relaxed">
        🔒 Nur Admin-freigegebene Bewerbungen werden angezeigt.
        Kandidatenprofile zeigen Qualifikationen ohne persönliche Kontaktdaten.
        Interview-Anfragen werden vom Admin koordiniert — kein Direktkontakt.
      </p>
    </div>
  )
}
