'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface DraftApprovalCardProps {
  draft: {
    id: string
    channel: string
    recipient_name: string | null
    recipient_email: string | null
    subject: string | null
    body: string
    status: string
    risk_level: string
    risk_notes: string | null
    next_follow_up_at: string | null
    company_name?: string
  }
  providerConfigured: boolean
}

const RISK_STYLES: Record<string, string> = {
  low:    'text-green-400 border-green-800/40 bg-green-900/10',
  medium: 'text-yellow-400 border-yellow-800/40 bg-yellow-900/10',
  high:   'text-red-400 border-red-800/40 bg-red-900/10',
}

const STATUS_LABELS: Record<string, string> = {
  generated:                    '⚪ Generiert',
  needs_review:                 '🟡 Prüfung nötig',
  approved:                     '✅ Freigegeben',
  rejected:                     '❌ Abgelehnt',
  sent:                         '📤 Gesendet',
  failed:                       '💥 Fehlgeschlagen',
  ready_for_manual_platform_send: '📋 Bereit (manuell)',
  postponed:                    '⏳ Verschoben',
}

export function DraftApprovalCard({ draft, providerConfigured }: DraftApprovalCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [expanded, setExpanded] = useState(draft.status === 'needs_review')

  async function callDrafts(action: string) {
    setLoading(action)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/operator/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, draft_id: draft.id }),
      })
      const data = await res.json() as { error?: string; draft?: unknown }
      if (!res.ok) {
        setMessage({ ok: false, text: data.error ?? 'Fehler' })
      } else {
        setMessage({ ok: true, text: action === 'approve' ? '✅ Freigegeben' : action === 'reject' ? '❌ Abgelehnt' : '⏳ Verschoben' })
        startTransition(() => router.refresh())
      }
    } catch {
      setMessage({ ok: false, text: 'Netzwerkfehler' })
    } finally {
      setLoading(null)
    }
  }

  async function sendEmail() {
    setLoading('send')
    setMessage(null)
    try {
      const res = await fetch('/api/admin/operator/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft_id: draft.id }),
      })
      const data = await res.json() as { error?: string; message?: string; reason?: string }
      if (!res.ok) {
        setMessage({ ok: false, text: data.reason ?? data.error ?? 'Versand fehlgeschlagen' })
      } else {
        setMessage({ ok: true, text: data.message ?? 'Gesendet' })
        startTransition(() => router.refresh())
      }
    } catch {
      setMessage({ ok: false, text: 'Netzwerkfehler' })
    } finally {
      setLoading(null)
    }
  }

  const isApproved = draft.status === 'approved'
  const isPending2 = draft.status === 'generated' || draft.status === 'needs_review'
  const canSendEmail =
    isApproved &&
    draft.channel === 'email' &&
    !!draft.recipient_email &&
    providerConfigured
  const disabled = isPending || loading !== null
  const riskStyle = RISK_STYLES[draft.risk_level] ?? RISK_STYLES.low

  return (
    <div className={`border rounded-2xl p-5 bg-gray-900 ${draft.risk_level === 'high' ? 'border-red-800/50' : 'border-gray-800'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${riskStyle}`}>
              Risiko: {draft.risk_level}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
              {draft.channel}
            </span>
            <span className="text-xs text-gray-500">{STATUS_LABELS[draft.status] ?? draft.status}</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">
            {draft.company_name ?? 'Unbekannt'}
            {draft.subject && <span className="text-gray-400 font-normal"> — {draft.subject}</span>}
          </p>
          {draft.recipient_email && (
            <p className="text-xs text-gray-500 mt-0.5">An: {draft.recipient_email}</p>
          )}
        </div>
      </div>

      {/* Risk notes */}
      {draft.risk_notes && (
        <div className="mb-3 px-3 py-2 bg-yellow-900/20 border border-yellow-800/30 rounded-xl">
          <p className="text-yellow-300/80 text-xs">⚠️ {draft.risk_notes}</p>
        </div>
      )}

      {/* Body preview */}
      <details open={expanded} onToggle={(e) => setExpanded((e.target as HTMLDetailsElement).open)}>
        <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-300 mb-2 select-none">
          {expanded ? '▾ Text ausblenden' : '▸ Text anzeigen'}
        </summary>
        <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800/60 rounded-xl p-4 mb-3 border border-gray-700/50 max-h-64 overflow-y-auto">
          {draft.body}
        </pre>
      </details>

      {/* Follow-up date */}
      {draft.next_follow_up_at && (
        <p className="text-xs text-gray-500 mb-3">
          📅 Follow-up: {new Date(draft.next_follow_up_at).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {isPending2 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => callDrafts('approve')}
              disabled={disabled}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-700 hover:bg-green-600 text-white disabled:opacity-50 transition-colors"
            >
              {loading === 'approve' ? '…' : '✅ JA / Freigeben'}
            </button>
            <button
              onClick={() => callDrafts('reject')}
              disabled={disabled}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-900/60 hover:bg-red-800 text-red-300 border border-red-800/50 disabled:opacity-50 transition-colors"
            >
              {loading === 'reject' ? '…' : '❌ NEIN'}
            </button>
            <button
              onClick={() => callDrafts('postpone')}
              disabled={disabled}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'postpone' ? '…' : '⏳ Später'}
            </button>
          </div>
        )}

        {/* Send email button — only when approved + provider configured */}
        {canSendEmail && (
          <div>
            <button
              onClick={sendEmail}
              disabled={disabled}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-50 transition-colors"
            >
              {loading === 'send' ? '…Wird gesendet…' : '📤 Freigegebene E-Mail senden'}
            </button>
            <p className="text-xs text-gray-600 mt-1">
              Provider konfiguriert · Kein automatischer Versand · Nur dieser Draft
            </p>
          </div>
        )}

        {isApproved && draft.channel === 'email' && !providerConfigured && (
          <div className="px-3 py-2 bg-orange-900/20 border border-orange-800/30 rounded-lg">
            <p className="text-orange-300/80 text-xs">
              ⚙️ E-Mail-Provider nicht konfiguriert (OUTREACH_EMAIL_PROVIDER=none).
              Setze OUTREACH_EMAIL_PROVIDER=resend oder smtp in der .env-Datei.
            </p>
          </div>
        )}

        {isApproved && (draft.channel === 'linkedin' || draft.channel === 'whatsapp' || draft.channel === 'phone') && (
          <div className="px-3 py-2 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <p className="text-blue-300/80 text-xs">
              📋 {draft.channel} wird nicht automatisch gesendet.
              Text manuell über {draft.channel === 'linkedin' ? 'LinkedIn' : draft.channel === 'whatsapp' ? 'WhatsApp' : 'Telefon'} versenden.
            </p>
          </div>
        )}

        {message && (
          <p className={`text-xs ${message.ok ? 'text-green-400' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}
