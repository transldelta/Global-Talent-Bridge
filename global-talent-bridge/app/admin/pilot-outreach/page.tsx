/**
 * /admin/pilot-outreach
 *
 * Admin-only Pilot-Outreach-Cockpit.
 * Zeigt alle pilot_employers mit personalisierten Outreach-Templates.
 *
 * SICHERHEITS-CONSTRAINTS:
 * - Keine automatischen E-Mails
 * - Keine automatischen WhatsApp-Nachrichten
 * - Nur vorbereiten, anzeigen, kopierbar machen
 * - Admin versendet manuell
 */
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { OutreachCard } from './_components/OutreachCard'
import { PILOT_STATUS_LABELS } from '@/lib/outreach/templates'

type PilotEmployer = {
  id: string
  company_name: string
  country: string
  industry: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  status: string
  interest_level: string
  next_step: string | null
  notes: string | null
  source: string | null
  created_at: string
}

function StatusCount({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

export default async function PilotOutreachPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const db = createAdminClient()

  const { data: employers, error } = await db
    .from('pilot_employers')
    .select('id, company_name, country, industry, contact_name, contact_email, contact_phone, status, interest_level, next_step, notes, source, created_at')
    .order('created_at', { ascending: false })

  const list: PilotEmployer[] = employers ?? []

  // KPI counts
  const counts = {
    total:            list.length,
    identified:       list.filter((e) => e.status === 'identified').length,
    contacted:        list.filter((e) => e.status === 'contacted_manual').length,
    interested:       list.filter((e) => e.status === 'interested').length,
    demo:             list.filter((e) => e.status === 'demo_scheduled').length,
    active:           list.filter((e) => e.status === 'active_pilot').length,
    rejected:         list.filter((e) => e.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">📤 Pilot Outreach</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-800/50">
                Manuell senden
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Personalisierte Templates für {list.length} Pilot-Arbeitgeber. Admin sendet manuell — kein automatischer Versand.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/pilot-launch" className="text-xs text-blue-400 hover:text-blue-300">
              📋 Pilot Dashboard →
            </Link>
            <Link href="/admin/ceo-dashboard" className="text-xs text-gray-400 hover:text-gray-300">
              🏠 CEO Dashboard →
            </Link>
          </div>
        </div>

        {/* Sicherheits-Hinweis */}
        <div className="mb-6 bg-yellow-900/10 border border-yellow-800/40 rounded-xl px-4 py-3">
          <p className="text-yellow-300/80 text-xs leading-relaxed">
            ⚠️ <strong>Kein automatischer Versand.</strong> Alle Texte dienen als Vorlage — du kopierst sie und sendest sie manuell per E-Mail, WhatsApp oder LinkedIn.
            Ersetze alle Platzhalter in [eckigen Klammern] vor dem Versand.
            Alle Status-Updates werden in <code className="bg-yellow-900/30 px-1 rounded">system_logs</code> protokolliert.
          </p>
        </div>

        {/* Outreach-KPIs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          <StatusCount label="Identifiziert"  count={counts.identified} color="text-gray-400" />
          <StatusCount label="Kontaktiert"    count={counts.contacted}  color="text-blue-400" />
          <StatusCount label="Interessiert"   count={counts.interested} color="text-yellow-400" />
          <StatusCount label="Demo geplant"   count={counts.demo}       color="text-purple-400" />
          <StatusCount label="Aktiver Pilot"  count={counts.active}     color="text-green-400" />
          <StatusCount label="Abgelehnt"      count={counts.rejected}   color="text-red-400" />
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-700/50 rounded-xl p-4">
            <p className="text-red-300 text-sm">❌ DB-Fehler: {error.message}</p>
          </div>
        )}

        {list.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-white mb-2">Keine Pilot-Arbeitgeber</h2>
            <p className="text-gray-400 text-sm mb-4">
              Noch keine Einträge in <code>pilot_employers</code>.
            </p>
            <Link
              href="/admin/pilot-launch"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              → Pilotdaten anlegen (Seed)
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Nicht-abgelehnte zuerst */}
            {list
              .filter((e) => e.status !== 'rejected')
              .map((employer) => (
                <OutreachCard key={employer.id} employer={employer} />
              ))}

            {/* Abgelehnte am Ende, zusammengeklappt */}
            {list.filter((e) => e.status === 'rejected').length > 0 && (
              <details className="group">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300 list-none flex items-center gap-2 py-2">
                  <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                  {list.filter((e) => e.status === 'rejected').length} abgelehnte Arbeitgeber
                </summary>
                <div className="space-y-4 mt-4">
                  {list
                    .filter((e) => e.status === 'rejected')
                    .map((employer) => (
                      <OutreachCard key={employer.id} employer={employer} />
                    ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Legende */}
        <div className="mt-10 bg-gray-900 rounded-xl border border-gray-800 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Status-Legende</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(PILOT_STATUS_LABELS).map(([status, meta]) => (
              <div key={status} className="flex items-center gap-2">
                <span className={`text-xs font-medium ${meta.color}`}>●</span>
                <span className="text-xs text-gray-400">{meta.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
