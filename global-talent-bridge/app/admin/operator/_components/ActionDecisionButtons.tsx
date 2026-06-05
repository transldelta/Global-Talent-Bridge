'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface ActionDecisionButtonsProps {
  actionId: string
  currentStatus: string
  onDecision?: (decision: 'approve' | 'reject' | 'postpone') => void
}

export function ActionDecisionButtons({
  actionId,
  currentStatus,
  onDecision,
}: ActionDecisionButtonsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  if (currentStatus !== 'pending') {
    const labels: Record<string, string> = {
      approved:  '✅ Freigegeben',
      rejected:  '❌ Abgelehnt',
      postponed: '⏳ Verschoben',
      done:      '✓ Erledigt',
      blocked:   '🚫 Blockiert',
    }
    return (
      <span className="text-xs text-gray-500 font-medium">
        {labels[currentStatus] ?? currentStatus}
      </span>
    )
  }

  async function decide(decision: 'approve' | 'reject' | 'postpone') {
    setLoading(decision)
    setResult(null)
    try {
      const res = await fetch('/api/admin/operator/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: actionId, decision }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) {
        setResult({ ok: false, msg: data.error ?? 'Fehler' })
      } else {
        setResult({ ok: true, msg: decision === 'approve' ? 'Freigegeben' : decision === 'reject' ? 'Abgelehnt' : 'Verschoben' })
        onDecision?.(decision)
        startTransition(() => router.refresh())
      }
    } catch {
      setResult({ ok: false, msg: 'Netzwerkfehler' })
    } finally {
      setLoading(null)
    }
  }

  const disabled = isPending || loading !== null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => decide('approve')}
          disabled={disabled}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-700 hover:bg-green-600 text-white disabled:opacity-50 transition-colors"
        >
          {loading === 'approve' ? '…' : '✅ JA / Freigeben'}
        </button>
        <button
          onClick={() => decide('reject')}
          disabled={disabled}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-900/60 hover:bg-red-800/80 text-red-300 border border-red-800/50 disabled:opacity-50 transition-colors"
        >
          {loading === 'reject' ? '…' : '❌ NEIN'}
        </button>
        <button
          onClick={() => decide('postpone')}
          disabled={disabled}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 disabled:opacity-50 transition-colors"
        >
          {loading === 'postpone' ? '…' : '⏳ Später'}
        </button>
      </div>
      {result && (
        <p className={`text-xs ${result.ok ? 'text-green-400' : 'text-red-400'}`}>
          {result.msg}
        </p>
      )}
    </div>
  )
}
