/**
 * /admin/pilot-control
 *
 * Pilot Control Dashboard — Übersicht über alle Outreach-Aktivitäten.
 * Zeigt aktuellen Status, nächste Schritte, blockierte Einträge.
 * Admin-only. Kein automatischer Versand.
 */
import { getCurrentAdminUser } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { NavBar } from '@/app/_components/NavBar'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = {
  title: 'Pilot Control | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export const dynamic = 'force-dynamic'

// ── Status-Farben ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  draft:                    'bg-gray-700 text-gray-300',
  needs_review:             'bg-yellow-900 text-yellow-300',
  approved_for_manual_copy: 'bg-green-900 text-green-300',
  contacted_manual:         'bg-blue-900 text-blue-300',
  blocked:                  'bg-red-900 text-red-300',
}

const STATUS_LABELS: Record<string, string> = {
  draft:                    '📝 Entwurf',
  needs_review:             '🔍 Zu prüfen',
  approved_for_manual_copy: '✅ Freigegeben',
  contacted_manual:         '☑️ Kontaktiert',
  blocked:                  '🚫 Blockiert',
}

export default async function PilotControlPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/pilot-control')

  // ── Daten direkt server-seitig lesen ────────────────────────────────────────
  const db = createAdminClient()

  const { data: entries } = await db
    .from('outreach_autopilot_entries')
    .select('id, company_name, fit_score, compliance_status, status, created_at, contact_method')
    .order('created_at', { ascending: false })
    .limit(50)

  const all = entries ?? []

  // Zähler
  const byStatus: Record<string, number> = {
    draft: 0, needs_review: 0, approved_for_manual_copy: 0,
    contacted_manual: 0, blocked: 0,
  }
  let readyToCopy = 0
  for (const e of all) {
    if (e.status in byStatus) byStatus[e.status]++
    if (e.compliance_status === 'safe' && (e.fit_score ?? 0) >= 70) readyToCopy++
  }

  const pilotStarted = (byStatus.contacted_manual ?? 0) > 0
  const hasBlocked = (byStatus.blocked ?? 0) > 0

  // Nächste Aktion
  let nextAction: { icon: string; text: string; href: string; color: string }
  if (all.length === 0) {
    nextAction = { icon: '➕', text: 'Erste Firma im Target Finder suchen, dann im Autopilot analysieren', href: '/admin/pilot-target-finder', color: 'bg-blue-800 hover:bg-blue-700' }
  } else if (hasBlocked) {
    nextAction = { icon: '⚠️', text: `${byStatus.blocked} blockierte Einträge prüfen und korrigieren`, href: '/admin/outreach-autopilot', color: 'bg-yellow-800 hover:bg-yellow-700' }
  } else if (readyToCopy > 0) {
    nextAction = { icon: '📋', text: `${readyToCopy} freigegebenen Text kopieren und manuell versenden`, href: '/admin/outreach-autopilot', color: 'bg-green-800 hover:bg-green-700' }
  } else if ((byStatus.needs_review ?? 0) > 0) {
    nextAction = { icon: '🔍', text: `${byStatus.needs_review} Einträge zur Prüfung öffnen`, href: '/admin/outreach-autopilot', color: 'bg-yellow-800 hover:bg-yellow-700' }
  } else {
    nextAction = { icon: '➕', text: 'Neue Firma im Autopilot analysieren', href: '/admin/outreach-autopilot', color: 'bg-blue-800 hover:bg-blue-700' }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">🎛️ Pilot Control Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Übersicht aller Outreach-Aktivitäten · Kein automatischer Versand ·{' '}
              <span className="text-green-300">no_email_sent=true immer</span>
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            Admin: {admin.email}<br />
            {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>

        {/* Sicherheits-Status */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-green-900/20 border border-green-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-green-300">✅ Nein</div>
            <div className="text-xs text-gray-400 mt-1">Wurde etwas gesendet?</div>
          </div>
          <div className="bg-green-900/20 border border-green-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-green-300">none</div>
            <div className="text-xs text-gray-400 mt-1">EMAIL_PROVIDER</div>
          </div>
          <div className="bg-green-900/20 border border-green-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-green-300">none</div>
            <div className="text-xs text-gray-400 mt-1">OUTREACH_EMAIL_PROVIDER</div>
          </div>
        </div>

        {/* Nächste Aktion */}
        <div className="mb-6 bg-gray-900 rounded-xl border border-gray-700 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Nächster sicherer Schritt</div>
          <div className="flex items-center gap-4">
            <div className="text-3xl">{nextAction.icon}</div>
            <div className="flex-1 text-white">{nextAction.text}</div>
            <a
              href={nextAction.href}
              className={`px-4 py-2 rounded text-white text-sm font-medium transition-colors shrink-0 ${nextAction.color}`}
            >
              Öffnen →
            </a>
          </div>
        </div>

        {/* Status-Kacheln */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className={`text-xs mt-1 px-2 py-0.5 rounded inline-block ${STATUS_COLORS[status] ?? 'bg-gray-700 text-gray-300'}`}>
                {STATUS_LABELS[status] ?? status}
              </div>
            </div>
          ))}
        </div>

        {/* Pilot-Fortschritt */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Gesamte Einträge</div>
            <div className="text-3xl font-bold text-white">{all.length}</div>
            <div className="text-xs text-gray-500 mt-1">analysierte Firmen</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Pilot gestartet?</div>
            <div className={`text-3xl font-bold ${pilotStarted ? 'text-green-300' : 'text-gray-500'}`}>
              {pilotStarted ? '✅ Ja' : '⏳ Nein'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {pilotStarted
                ? `${byStatus.contacted_manual} Kontakt${byStatus.contacted_manual !== 1 ? 'e' : ''} erledigt`
                : 'Noch kein Kontakt als "erledigt" markiert'}
            </div>
          </div>
        </div>

        {/* Offene Checkliste */}
        <div className="mb-6 bg-gray-800 rounded-lg p-5">
          <div className="text-sm font-medium text-gray-300 mb-3">📋 Pilot-Checkliste</div>
          <div className="space-y-2">
            {[
              { done: all.length > 0,                          text: 'Mindestens 1 Firma analysiert' },
              { done: readyToCopy > 0 || pilotStarted,        text: 'Mindestens 1 freigegebener Text vorhanden' },
              { done: !hasBlocked || pilotStarted,            text: 'Keine blockierten Einträge offen' },
              { done: pilotStarted,                           text: 'Erster Pilot-Kontakt manuell gesendet' },
              { done: false,                                  text: 'Rückmeldung vom Pilotarbeitgeber erhalten (manuell prüfen)' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={item.done ? 'text-green-400' : 'text-gray-500'}>
                  {item.done ? '✅' : '○'}
                </span>
                <span className={item.done ? 'text-gray-200' : 'text-gray-400'}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Letzte Einträge */}
        {all.length > 0 && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-700 text-sm font-medium text-gray-300">
              Letzte Einträge (max. 10)
            </div>
            <div className="divide-y divide-gray-700">
              {all.slice(0, 10).map(e => (
                <div key={e.id} className="px-5 py-3 flex items-center gap-4 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="text-white truncate">{e.company_name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {e.contact_method} · {new Date(e.created_at).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                      (e.fit_score ?? 0) >= 70 ? 'text-green-300' : 'text-yellow-300'
                    }`}>
                      {e.fit_score}/100
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[e.status] ?? 'bg-gray-700 text-gray-300'}`}>
                      {STATUS_LABELS[e.status] ?? e.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aktions-Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/admin/pilot-target-finder" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
            🎯 Target Finder
          </a>
          <a href="/admin/outreach-autopilot" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
            🤖 Outreach Autopilot
          </a>
          <a href="/admin/first-pilot" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
            🎯 First Pilot
          </a>
        </div>
      </div>
    </div>
  )
}
