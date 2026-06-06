'use client'
/**
 * app/admin/cwo-command-center/_components/LastRunPanel.tsx
 *
 * Zeigt den letzten automatischen CWO Daily Runner Lauf.
 * Client Component — fetcht /api/admin/cwo-last-run beim Laden.
 */
import { useEffect, useState } from 'react'

type LastRun = {
  id:               string
  report_type:      string
  system_health:    string
  completed_items:  string[]
  open_items:       string[]
  next_action:      string
  compliance_status: string
  no_email_sent:    boolean
  no_auto_outreach: boolean
  no_scraping:      boolean
  created_by:       string
  created_at:       string
} | null

export function LastRunPanel() {
  const [lastRun, setLastRun] = useState<LastRun>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/cwo-last-run')
      .then(r => r.json())
      .then(d => {
        setLastRun(d.lastRun)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-72" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
        ⚠️ Fehler beim Laden des letzten Laufs: {error}
      </div>
    )
  }

  if (!lastRun) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">⏰ Daily Runner</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="font-semibold text-yellow-800 text-sm">Noch kein automatischer Lauf</div>
          <div className="text-xs text-yellow-700 mt-1">
            Der Daily Runner wird täglich um 06:00 UTC ausgeführt (Vercel Cron).
            Nach dem ersten Lauf erscheint hier die Zusammenfassung.
          </div>
          <div className="text-xs text-yellow-700 mt-2">
            Manueller Test: <code className="bg-yellow-100 px-1 rounded">GET /api/cron/cwo-daily-runner</code> mit Authorization Header.
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-gray-500">
          <span>✓ noEmailSent: true</span>
          <span>✓ noAutoOutreach: true</span>
          <span>✓ noScraping: true</span>
          <span>✓ Zeitplan: täglich 06:00 UTC</span>
        </div>
      </div>
    )
  }

  const healthColor = lastRun.system_health === 'green'
    ? 'bg-green-100 text-green-700 border-green-200'
    : lastRun.system_health === 'yellow'
    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
    : 'bg-red-100 text-red-700 border-red-200'

  const runTime = new Date(lastRun.created_at).toLocaleString('de-DE', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })

  const minutesAgo = Math.round((Date.now() - new Date(lastRun.created_at).getTime()) / 60000)
  const timeAgoLabel = minutesAgo < 60
    ? `vor ${minutesAgo} Min.`
    : minutesAgo < 1440
    ? `vor ${Math.round(minutesAgo / 60)} Std.`
    : `vor ${Math.round(minutesAgo / 1440)} Tag(en)`

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">⏰ Letzter automatischer Lauf</h2>
        <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${healthColor}`}>
          {lastRun.system_health === 'green' ? '✅ Gesund' : lastRun.system_health === 'yellow' ? '⚠️ Hinweise' : '🔴 Prüfen'}
        </span>
      </div>

      {/* Zeit + Quelle */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>🕐 {runTime}</span>
        <span className="text-gray-400">({timeAgoLabel})</span>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{lastRun.created_by}</span>
      </div>

      {/* Nächste Aktion */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-xs font-semibold text-blue-700 uppercase mb-1">🎯 Nächste Aktion (auto-generiert)</div>
        <div className="text-sm text-blue-900">{lastRun.next_action}</div>
      </div>

      {/* Was heute vorbereitet wurde */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">✅ Heute vorbereitet</div>
          <ul className="space-y-1">
            {lastRun.completed_items.map((item, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
            {lastRun.open_items.some(i => i.includes('Keine')) ? '✅ Offene Punkte' : '⏳ Offene Punkte'}
          </div>
          <ul className="space-y-1">
            {lastRun.open_items.map((item, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className={lastRun.open_items[0].includes('Keine') ? 'text-green-500' : 'text-amber-500'}>
                  {lastRun.open_items[0].includes('Keine') ? '✓' : '→'}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Safety Invariants */}
      <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className={lastRun.no_email_sent ? 'text-green-600' : 'text-red-600'}>
          {lastRun.no_email_sent ? '✓' : '✗'} noEmailSent: {String(lastRun.no_email_sent)}
        </span>
        <span className={lastRun.no_auto_outreach ? 'text-green-600' : 'text-red-600'}>
          {lastRun.no_auto_outreach ? '✓' : '✗'} noAutoOutreach: {String(lastRun.no_auto_outreach)}
        </span>
        <span className={lastRun.no_scraping ? 'text-green-600' : 'text-red-600'}>
          {lastRun.no_scraping ? '✓' : '✗'} noScraping: {String(lastRun.no_scraping)}
        </span>
        <span className="text-gray-400">Compliance: {lastRun.compliance_status}</span>
      </div>
    </div>
  )
}
