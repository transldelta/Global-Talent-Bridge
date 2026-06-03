import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

type OutreachTarget = {
  id: string
  company_name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  sector: string | null
  city: string | null
  status: string
  priority: string
  next_follow_up_at: string | null
  last_contacted_at: string | null
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  planned: 'bg-gray-800 text-gray-400',
  contacted: 'bg-yellow-900/40 text-yellow-300',
  interested: 'bg-blue-900/40 text-blue-300',
  not_interested: 'bg-gray-800 text-gray-500',
  follow_up: 'bg-orange-900/40 text-orange-300',
  converted: 'bg-green-900/40 text-green-300',
  archived: 'bg-gray-900 text-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  planned: '📋 Geplant',
  contacted: '✉️ Kontaktiert',
  interested: '🤝 Interessiert',
  not_interested: '👎 Kein Interesse',
  follow_up: '📅 Follow-up',
  converted: '⭐ Konvertiert',
  archived: '🗄️ Archiviert',
}

const PRIORITY_STYLES: Record<string, string> = {
  high: 'text-red-400',
  normal: 'text-gray-500',
  low: 'text-gray-600',
}

const PRIORITY_EMOJI: Record<string, string> = {
  high: '🔴',
  normal: '🟡',
  low: '🟢',
}

type FilterType = 'all' | 'planned' | 'contacted' | 'interested' | 'follow_up' | 'converted' | 'archived'

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Alle',
  planned: 'Geplant',
  contacted: 'Kontaktiert',
  interested: 'Interessiert',
  follow_up: 'Follow-up fällig',
  converted: 'Konvertiert',
  archived: 'Archiviert',
}

export default async function OutreachPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const activeFilter = (searchParams.filter ?? 'all') as FilterType
  const today = new Date().toISOString()

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('outreach_targets')
    .select('id, company_name, contact_person, email, phone, sector, city, status, priority, next_follow_up_at, last_contacted_at, created_at')
    .order('created_at', { ascending: false })
    .limit(500)

  const all: OutreachTarget[] = data ?? []

  // JS-Filter
  let filtered = all
  if (activeFilter === 'follow_up') {
    filtered = all.filter((t) => t.next_follow_up_at != null && t.next_follow_up_at <= today)
  } else if (activeFilter !== 'all') {
    filtered = all.filter((t) => t.status === activeFilter)
  }

  // KPIs
  const kpis = {
    total: all.length,
    planned: all.filter((t) => t.status === 'planned').length,
    contacted: all.filter((t) => t.status === 'contacted').length,
    interested: all.filter((t) => t.status === 'interested').length,
    followupDue: all.filter((t) => t.next_follow_up_at != null && t.next_follow_up_at <= today).length,
    converted: all.filter((t) => t.status === 'converted').length,
    archived: all.filter((t) => t.status === 'archived').length,
  }

  const filterCounts: Record<FilterType, number> = {
    all: kpis.total,
    planned: kpis.planned,
    contacted: kpis.contacted,
    interested: kpis.interested,
    follow_up: kpis.followupDue,
    converted: kpis.converted,
    archived: kpis.archived,
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">📡 Outreach Command Center</h1>
            <p className="text-gray-400 text-sm">
              Manuelle Pilot-Arbeitgeber-Akquise. Keine automatischen E-Mails. Kein Massenkontakt.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/pilot-kit"
              className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-xl transition-colors font-medium"
            >
              🎯 Pilot-Kit
            </Link>
            <Link
              href="/admin/outreach/new"
              className="text-sm px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
            >
              ➕ Neues Ziel
            </Link>
          </div>
        </div>

        {/* KPI-Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{kpis.total}</div>
            <div className="text-xs text-gray-400 mt-0.5">Gesamt</div>
          </div>
          <div className="bg-gray-900 border border-gray-700/40 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{kpis.planned}</div>
            <div className="text-xs text-gray-400 mt-0.5">📋 Geplant</div>
          </div>
          <div className="bg-gray-900 border border-yellow-800/40 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{kpis.contacted}</div>
            <div className="text-xs text-gray-400 mt-0.5">✉️ Kontaktiert</div>
          </div>
          <div className="bg-gray-900 border border-blue-800/40 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{kpis.interested}</div>
            <div className="text-xs text-gray-400 mt-0.5">🤝 Interessiert</div>
          </div>
          <div className={`rounded-xl p-4 text-center ${kpis.followupDue > 0 ? 'bg-orange-900/20 border border-orange-700/50' : 'bg-gray-900 border border-gray-800'}`}>
            <div className={`text-2xl font-bold ${kpis.followupDue > 0 ? 'text-orange-400' : 'text-gray-500'}`}>{kpis.followupDue}</div>
            <div className="text-xs text-gray-400 mt-0.5">📅 Follow-up fällig</div>
          </div>
          <div className="bg-gray-900 border border-green-800/40 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{kpis.converted}</div>
            <div className="text-xs text-gray-400 mt-0.5">⭐ Konvertiert</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{kpis.archived}</div>
            <div className="text-xs text-gray-400 mt-0.5">🗄️ Archiviert</div>
          </div>
        </div>

        {/* Filter-Tabs */}
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-white">
              Outreach-Ziele
              <span className="ml-2 text-sm text-gray-400 font-normal">
                ({filtered.length}{activeFilter !== 'all' ? ` von ${all.length}` : ''})
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => {
              const isActive = f === activeFilter
              const href = f === 'all' ? '/admin/outreach' : `/admin/outreach?filter=${f}`
              const count = filterCounts[f]
              const isUrgent = f === 'follow_up' && count > 0
              return (
                <Link
                  key={f}
                  href={href}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? isUrgent ? 'bg-orange-700 text-white' : 'bg-blue-700 text-white'
                      : isUrgent
                      ? 'bg-orange-900/20 border border-orange-700/40 text-orange-300 hover:bg-orange-900/40'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {FILTER_LABELS[f]}
                  {count > 0 && <span className="ml-1.5 opacity-70">({count})</span>}
                </Link>
              )
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10 text-center">
              <div className="text-4xl mb-3">📡</div>
              <p className="text-gray-500 text-sm mb-4">
                {activeFilter === 'all'
                  ? 'Noch keine Outreach-Ziele erfasst.'
                  : `Keine Einträge für Filter „${FILTER_LABELS[activeFilter]}".`}
              </p>
              {activeFilter === 'all' && (
                <Link
                  href="/admin/outreach/new"
                  className="inline-block text-sm px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
                >
                  ➕ Erstes Ziel hinzufügen
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {/* Tabellenkopf */}
              <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium hidden sm:grid">
                <div className="col-span-2">Firma</div>
                <div className="col-span-2">Ansprechpartner</div>
                <div className="col-span-2">E-Mail</div>
                <div className="col-span-1">Branche</div>
                <div className="col-span-1">Stadt</div>
                <div className="col-span-1">Prio</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Aktion</div>
              </div>

              <div className="divide-y divide-gray-800">
                {filtered.map((target) => {
                  const followupDue =
                    target.next_follow_up_at != null &&
                    target.next_follow_up_at <= today
                  return (
                    <div
                      key={target.id}
                      className={`px-5 py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center ${
                        target.status === 'converted'
                          ? 'bg-green-900/5 border-l-2 border-l-green-700/50'
                          : target.status === 'interested'
                          ? 'bg-blue-900/5 border-l-2 border-l-blue-700/40'
                          : followupDue
                          ? 'bg-orange-900/5 border-l-2 border-l-orange-700/50'
                          : ''
                      }`}
                    >
                      <div className="sm:col-span-2">
                        <p className="text-white text-sm font-medium truncate">{target.company_name}</p>
                        {followupDue && (
                          <span className="text-xs text-orange-400">📅 Follow-up fällig</span>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-400 text-xs truncate">{target.contact_person ?? '—'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        {target.email ? (
                          <a href={`mailto:${target.email}`} className="text-blue-400 hover:text-blue-300 text-xs truncate block transition-colors">
                            {target.email}
                          </a>
                        ) : (
                          <p className="text-gray-600 text-xs">—</p>
                        )}
                      </div>
                      <div className="sm:col-span-1">
                        <p className="text-gray-400 text-xs truncate">{target.sector ?? '—'}</p>
                      </div>
                      <div className="sm:col-span-1">
                        <p className="text-gray-400 text-xs">{target.city ?? '—'}</p>
                      </div>
                      <div className="sm:col-span-1">
                        <span className={`text-xs font-medium ${PRIORITY_STYLES[target.priority] ?? PRIORITY_STYLES.normal}`}>
                          {PRIORITY_EMOJI[target.priority] ?? '🟡'}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[target.status] ?? STATUS_STYLES.planned}`}>
                          {STATUS_LABELS[target.status] ?? target.status}
                        </span>
                      </div>
                      <div className="sm:col-span-1">
                        <Link
                          href={`/admin/outreach/${target.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sicherheitshinweis */}
        <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-xl flex items-start gap-3">
          <span className="text-green-400 shrink-0">🔒</span>
          <p className="text-green-300/70 text-xs leading-relaxed">
            Alle Daten werden über Service Role serverseitig gelesen. Kein öffentlicher Zugriff.
            Keine automatischen E-Mails. Kein Massenkontakt. RLS aktiv.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 flex-wrap">
          <Link href="/admin/leads" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Leads
          </Link>
          <Link href="/admin/ceo-dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            CEO Dashboard →
          </Link>
        </div>
      </div>
    </div>
  )
}
