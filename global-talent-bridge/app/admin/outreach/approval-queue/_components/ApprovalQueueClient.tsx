'use client'

import { useState, useTransition } from 'react'

type QueueEntry = {
  id: string
  created_by_agent: string
  target_type: string
  target_name: string
  target_email: string | null
  target_phone: string | null
  channel: string
  message_subject: string | null
  message_body: string
  status: string
  risk_level: string
  priority_score: number
  source_context: Record<string, unknown>
  approved_by: string | null
  approved_at: string | null
  sent_at: string | null
  rejected_by: string | null
  rejected_at: string | null
  rejection_reason: string | null
  requires_double_confirmation: boolean
  double_confirmed: boolean
  remind_later_at: string | null
  notes: string | null
  created_at: string
}

type ActionResult = {
  success?: boolean
  action?: string
  error?: string
  note?: string
  message_body?: string
  message_subject?: string | null
  target_email?: string | null
  target_phone?: string | null
}

const STATUS_TABS = [
  { key: 'pending', label: '⏳ Ausstehend' },
  { key: 'approved', label: '✅ Freigegeben' },
  { key: 'prepared_for_manual_send', label: '📋 Manueller Versand' },
  { key: 'sent', label: '📨 Gesendet' },
  { key: 'rejected', label: '❌ Abgelehnt' },
  { key: 'remind_later', label: '📅 Später' },
  { key: 'all', label: '🗂️ Alle' },
]

const RISK_STYLES: Record<string, string> = {
  low: 'bg-green-900/20 text-green-400 border-green-800/30',
  medium: 'bg-yellow-900/20 text-yellow-400 border-yellow-800/30',
  high: 'bg-red-900/20 text-red-400 border-red-800/30',
}

const CHANNEL_EMOJI: Record<string, string> = {
  email: '✉️',
  whatsapp: '💬',
  manual: '📝',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-900/20 text-yellow-300 border-yellow-800/30',
  approved: 'bg-green-900/20 text-green-300 border-green-800/30',
  rejected: 'bg-red-900/30 text-red-400 border-red-800/30',
  sent: 'bg-blue-900/20 text-blue-300 border-blue-800/30',
  prepared_for_manual_send: 'bg-orange-900/20 text-orange-300 border-orange-800/30',
  remind_later: 'bg-purple-900/20 text-purple-300 border-purple-800/30',
}

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Ausstehend',
  approved: '✅ Freigegeben',
  rejected: '❌ Abgelehnt',
  sent: '📨 Gesendet',
  prepared_for_manual_send: '📋 Manueller Versand',
  remind_later: '📅 Später',
}

async function callApi(action: string, id: string, extra: Record<string, unknown> = {}): Promise<ActionResult> {
  const res = await fetch('/api/admin/outreach/approval-queue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, id, ...extra }),
  })
  return res.json() as Promise<ActionResult>
}

export function ApprovalQueueClient({ initialEntries }: { initialEntries: QueueEntry[] }) {
  const [entries, setEntries] = useState<QueueEntry[]>(initialEntries)
  const [activeTab, setActiveTab] = useState('pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, ActionResult>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
  const [remindDate, setRemindDate] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const filtered = entries.filter((e) => activeTab === 'all' || e.status === activeTab)

  function updateEntry(id: string, patch: Partial<QueueEntry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function handleAction(id: string, action: string, extra: Record<string, unknown> = {}) {
    startTransition(async () => {
      const result = await callApi(action, id, extra)
      setFeedback((prev) => ({ ...prev, [id]: result }))

      if (result.success) {
        // Status lokal aktualisieren
        if (action === 'approve') updateEntry(id, { status: 'approved' })
        else if (action === 'double_confirm') updateEntry(id, { double_confirmed: true })
        else if (action === 'approve_send') {
          updateEntry(id, {
            status: result.action === 'prepared_for_manual_send' ? 'prepared_for_manual_send' : 'sent',
          })
        } else if (action === 'reject') updateEntry(id, { status: 'rejected' })
        else if (action === 'remind_later') updateEntry(id, { status: 'remind_later' })
      }
    })
  }

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text).catch(() => undefined)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => {
          const count = tab.key === 'all' ? entries.length : entries.filter((e) => e.status === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.key
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-gray-600/50 rounded-full text-xs">{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">📭</div>
          <div>Keine Einträge in dieser Kategorie</div>
          {activeTab === 'pending' && (
            <div className="mt-2 text-sm">Growth Agent starten, um neue Entwürfe zu generieren.</div>
          )}
        </div>
      )}

      {/* Entry cards */}
      <div className="space-y-4">
        {filtered.map((entry) => {
          const isExpanded = expandedId === entry.id
          const fb = feedback[entry.id]

          return (
            <div
              key={entry.id}
              className={`border rounded-xl overflow-hidden transition-all ${
                entry.risk_level === 'high'
                  ? 'border-red-800/50 bg-red-900/5'
                  : 'border-gray-700/50 bg-gray-800/30'
              }`}
            >
              {/* Header row */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Channel */}
                      <span className="text-lg" title={entry.channel}>
                        {CHANNEL_EMOJI[entry.channel] ?? '📝'}
                      </span>
                      {/* Target name */}
                      <span className="font-semibold text-white truncate">{entry.target_name}</span>
                      {/* Risk badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${RISK_STYLES[entry.risk_level] ?? ''}`}>
                        {entry.risk_level === 'high' ? '⚠️ HIGH' : entry.risk_level === 'medium' ? '🟡 MEDIUM' : '🟢 LOW'} Risk
                      </span>
                      {/* Status badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[entry.status] ?? 'border-gray-700 text-gray-400'}`}>
                        {STATUS_LABELS[entry.status] ?? entry.status}
                      </span>
                      {/* Double confirmed badge */}
                      {entry.double_confirmed && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/20 text-purple-300 border border-purple-800/30">
                          ✅ 2x bestätigt
                        </span>
                      )}
                      {/* Priority */}
                      <span className="text-xs text-gray-500">Prio: {entry.priority_score}</span>
                    </div>
                    {/* Subject line if email */}
                    {entry.message_subject && (
                      <div className="text-sm text-gray-400 mt-0.5">
                        Betreff: <span className="text-gray-300">{entry.message_subject}</span>
                      </div>
                    )}
                    {/* Contact info */}
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      {entry.target_email && <span>✉️ {entry.target_email}</span>}
                      {entry.target_phone && <span>📱 {entry.target_phone}</span>}
                      <span>🕒 {new Date(entry.created_at).toLocaleDateString('de-DE')}</span>
                      {entry.approved_by && (
                        <span className="text-green-500">✓ {entry.approved_by}</span>
                      )}
                    </div>
                  </div>
                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="text-gray-400 hover:text-white text-sm shrink-0 mt-1"
                  >
                    {isExpanded ? '▲ Schließen' : '▼ Anzeigen'}
                  </button>
                </div>

                {/* Feedback message */}
                {fb && (
                  <div className={`mt-2 text-sm px-3 py-2 rounded-lg ${
                    fb.success ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'
                  }`}>
                    {fb.success ? (
                      <>
                        ✅ {fb.action === 'approved' ? 'Freigegeben' :
                           fb.action === 'double_confirmed' ? 'Doppelt bestätigt — jetzt Freigabe möglich' :
                           fb.action === 'sent' ? 'Als gesendet markiert' :
                           fb.action === 'prepared_for_manual_send' ? 'Für manuellen Versand vorbereitet' :
                           fb.action === 'rejected' ? 'Abgelehnt' :
                           fb.action === 'remind_later' ? 'Auf "Später" gesetzt' :
                           fb.action}
                        {fb.note && <div className="mt-1 text-xs text-yellow-300">⚠️ {fb.note}</div>}
                      </>
                    ) : (
                      <>❌ {fb.error}</>
                    )}
                  </div>
                )}

                {/* Manual send copyable block */}
                {(entry.status === 'prepared_for_manual_send' || fb?.action === 'prepared_for_manual_send') && (
                  <div className="mt-3 p-3 bg-orange-900/10 border border-orange-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-orange-300">📋 Nachricht kopieren und manuell senden:</span>
                      <button
                        onClick={() => copyText(
                          (fb?.message_body ?? entry.message_body),
                          entry.id + '_body'
                        )}
                        className="text-xs px-2 py-1 bg-orange-800/30 hover:bg-orange-800/50 text-orange-300 rounded transition-colors"
                      >
                        {copiedId === entry.id + '_body' ? '✓ Kopiert!' : '📋 Kopieren'}
                      </button>
                    </div>
                    {(fb?.message_subject ?? entry.message_subject) && (
                      <div className="text-xs text-gray-400 mb-2">
                        Betreff: {fb?.message_subject ?? entry.message_subject}
                      </div>
                    )}
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-gray-900/50 p-2 rounded max-h-32 overflow-y-auto">
                      {fb?.message_body ?? entry.message_body}
                    </pre>
                    {(fb?.target_email ?? entry.target_email) && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">An:</span>
                        <span className="text-xs text-gray-300">{fb?.target_email ?? entry.target_email}</span>
                        <button
                          onClick={() => copyText(fb?.target_email ?? entry.target_email ?? '', entry.id + '_email')}
                          className="text-xs text-orange-400 hover:text-orange-300"
                        >
                          {copiedId === entry.id + '_email' ? '✓' : '📋'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Expanded: full message + actions */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-700/50 pt-4">
                  {/* Full message */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Nachricht</div>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 max-h-64 overflow-y-auto">
                      {entry.message_body}
                    </pre>
                    <button
                      onClick={() => copyText(entry.message_body, entry.id + '_full')}
                      className="mt-2 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedId === entry.id + '_full' ? '✓ Kopiert!' : '📋 Text kopieren'}
                    </button>
                  </div>

                  {/* Source context */}
                  {Object.keys(entry.source_context ?? {}).length > 0 && (
                    <div className="mb-4 text-xs text-gray-500">
                      <span className="font-semibold text-gray-400">Quelle: </span>
                      {Object.entries(entry.source_context).map(([k, v]) => (
                        <span key={k} className="mr-2">{k}={String(v)}</span>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  {entry.status === 'pending' && (
                    <div className="flex flex-wrap items-start gap-3">
                      {/* High-risk: double confirm first */}
                      {entry.risk_level === 'high' && entry.requires_double_confirmation && !entry.double_confirmed && (
                        <div className="w-full p-3 bg-red-900/20 border border-red-800/40 rounded-lg mb-2">
                          <div className="text-sm text-red-300 font-semibold mb-1">⚠️ High-Risk — Doppelte Bestätigung erforderlich</div>
                          <div className="text-xs text-red-400 mb-2">
                            Diese Nachricht hat Risikostufe &quot;hoch&quot;. Bitte erst doppelt bestätigen.
                          </div>
                          <button
                            onClick={() => handleAction(entry.id, 'double_confirm')}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                          >
                            ⚠️ Ich bestätige: Diese Nachricht soll freigegeben werden
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => handleAction(entry.id, 'approve')}
                        disabled={isPending || (entry.risk_level === 'high' && entry.requires_double_confirmation && !entry.double_confirmed)}
                        className="px-3 py-1.5 bg-green-800 hover:bg-green-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        ✅ Freigeben
                      </button>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Ablehnungsgrund (optional)"
                          value={rejectReason[entry.id] ?? ''}
                          onChange={(e) => setRejectReason((prev) => ({ ...prev, [entry.id]: e.target.value }))}
                          className="px-2 py-1.5 text-xs bg-gray-900 border border-gray-700 rounded-lg text-gray-300 w-52"
                        />
                        <button
                          onClick={() => handleAction(entry.id, 'reject', { rejection_reason: rejectReason[entry.id] ?? '' })}
                          disabled={isPending}
                          className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 text-xs rounded-lg border border-red-800/40 transition-colors disabled:opacity-50"
                        >
                          ❌ Ablehnen
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={remindDate[entry.id] ?? ''}
                          onChange={(e) => setRemindDate((prev) => ({ ...prev, [entry.id]: e.target.value }))}
                          className="px-2 py-1.5 text-xs bg-gray-900 border border-gray-700 rounded-lg text-gray-300"
                        />
                        <button
                          onClick={() => {
                            const d = remindDate[entry.id]
                            if (!d) return
                            handleAction(entry.id, 'remind_later', { remind_later_at: new Date(d).toISOString() })
                          }}
                          disabled={isPending || !remindDate[entry.id]}
                          className="px-3 py-1.5 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 text-xs rounded-lg border border-purple-800/30 transition-colors disabled:opacity-50"
                        >
                          📅 Später
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Approved → can send */}
                  {entry.status === 'approved' && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleAction(entry.id, 'approve_send')}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        📨 Jetzt senden / Manuell vorbereiten
                      </button>
                    </div>
                  )}

                  {/* Rejection info */}
                  {entry.status === 'rejected' && entry.rejection_reason && (
                    <div className="text-xs text-gray-500 mt-2">
                      Grund: <span className="text-gray-400">{entry.rejection_reason}</span>
                      {entry.rejected_by && <> · {entry.rejected_by}</>}
                    </div>
                  )}

                  {/* Remind later info */}
                  {entry.status === 'remind_later' && entry.remind_later_at && (
                    <div className="text-xs text-purple-400 mt-2">
                      📅 Erinnern am: {new Date(entry.remind_later_at).toLocaleDateString('de-DE')}
                    </div>
                  )}

                  {/* Sent info */}
                  {entry.status === 'sent' && entry.sent_at && (
                    <div className="text-xs text-blue-400 mt-2">
                      📨 Gesendet am: {new Date(entry.sent_at).toLocaleString('de-DE')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
