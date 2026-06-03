import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

const statusColor: Record<string, string> = {
  identified:    'bg-gray-800 text-gray-300 border border-gray-700',
  outreach_sent: 'bg-blue-900/30 text-blue-300 border border-blue-800/40',
  active:        'bg-green-900/30 text-green-300 border border-green-800/40',
  inactive:      'bg-red-900/20 text-red-400 border border-red-800/30',
}

const typeIcon: Record<string, string> = {
  job_board:    '📋',
  social_media: '📱',
  partner:      '🤝',
  referral:     '🔗',
  organic:      '🌱',
  event:        '🎪',
}

export default async function CandidateSourcesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  const { data: sources } = await adminSupabase
    .from('candidate_growth_sources')
    .select('*')
    .order('estimated_candidates', { ascending: false })

  const allSources = sources ?? []
  const totalPotential = allSources.reduce((sum, s) => sum + (s.estimated_candidates ?? 0), 0)
  const activeSources = allSources.filter((s) => s.status === 'active')
  const monthlySpend = allSources.filter(s => s.status === 'active').reduce((sum, s) => sum + (Number(s.monthly_cost_eur) ?? 0), 0)

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Link href="/admin/growth" className="hover:text-gray-300">Growth Engine</Link>
            <span>›</span>
            <span>Kandidatenquellen</span>
          </div>
          <h1 className="text-2xl font-bold text-white">👤 Kandidatenquellen</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {allSources.length} Quellen · {totalPotential.toLocaleString('de-DE')} Kandidaten-Potenzial ·{' '}
            {activeSources.length} aktiv · {monthlySpend.toFixed(0)} €/Monat
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['identified', 'outreach_sent', 'active', 'inactive'] as const).map((s) => {
            const count = allSources.filter((src) => src.status === s).length
            const labels: Record<string, string> = { identified: 'Identifiziert', outreach_sent: 'Angeschrieben', active: 'Aktiv', inactive: 'Inaktiv' }
            return (
              <div key={s} className="bg-gray-900 rounded-xl border border-gray-800 p-3 text-center">
                <div className="text-xl font-bold text-white">{count}</div>
                <div className="text-xs mt-1">
                  <span className={`px-2 py-0.5 rounded-full ${statusColor[s]}`}>{labels[s]}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Source list */}
        <div className="space-y-3">
          {allSources.map((source) => (
            <div key={source.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl">{typeIcon[source.source_type] ?? '📌'}</span>
                    <h3 className="text-white font-semibold">{source.source_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[source.status] ?? statusColor.identified}`}>
                      {source.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                    <span>🌍 {source.country}</span>
                    {source.target_sector && <span>📁 {source.target_sector}</span>}
                    {source.contact_email && <span className="text-blue-400">✉️ {source.contact_email}</span>}
                    {source.url && (
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 truncate max-w-[200px]">
                        🔗 Website
                      </a>
                    )}
                  </div>
                  {source.notes && (
                    <p className="text-gray-500 text-xs mt-2 leading-relaxed">{source.notes}</p>
                  )}
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="text-xl font-bold text-cyan-400">~{(source.estimated_candidates ?? 0).toLocaleString('de-DE')}</div>
                  <div className="text-gray-600 text-xs">Kandid.-Potenzial</div>
                  {Number(source.monthly_cost_eur) > 0 ? (
                    <div className="text-yellow-400 text-sm font-medium">{Number(source.monthly_cost_eur).toFixed(0)} €/Mo.</div>
                  ) : (
                    <div className="text-green-400 text-sm">Kostenlos</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {allSources.length === 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
              <p className="text-4xl mb-3">👤</p>
              <p className="text-gray-400">Keine Kandidatenquellen gefunden. Growth-Agent ausführen.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
