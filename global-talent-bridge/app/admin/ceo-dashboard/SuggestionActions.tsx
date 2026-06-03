'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  id: string
  status: string
  actionType: string | null
}

export function SuggestionActions({ id, status, actionType }: Props) {
  const router = useRouter()
  const [isPendingApprove, startApprove] = useTransition()
  const [isPendingReject, startReject] = useTransition()
  const [isPendingExecute, startExecute] = useTransition()
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  const canApprove = status === 'suggested'
  const canReject = status === 'suggested' || status === 'approved'
  const canExecute =
    status === 'approved' &&
    actionType !== null &&
    ['create_outreach_draft', 'create_lead_note', 'mark_notification_read'].includes(actionType)

  async function callApi(endpoint: string) {
    const res = await fetch(endpoint, { method: 'POST' })
    const data = await res.json() as { success?: boolean; error?: string; note?: string }
    return { ok: res.ok && data.success === true, msg: data.note ?? data.error ?? '' }
  }

  function handleApprove() {
    setFeedback(null)
    startApprove(async () => {
      const r = await callApi(`/api/admin/agents/suggestions/${id}/approve`)
      setFeedback(r)
      router.refresh()
    })
  }

  function handleReject() {
    setFeedback(null)
    startReject(async () => {
      const r = await callApi(`/api/admin/agents/suggestions/${id}/reject`)
      setFeedback(r)
      router.refresh()
    })
  }

  function handleExecute() {
    setFeedback(null)
    startExecute(async () => {
      const r = await callApi(`/api/admin/agents/suggestions/${id}/execute`)
      setFeedback(r)
      router.refresh()
    })
  }

  const isAnyPending = isPendingApprove || isPendingReject || isPendingExecute

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {canApprove && (
        <button
          onClick={handleApprove}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 bg-green-900/40 hover:bg-green-900/60 border border-green-800/50 text-green-300 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingApprove ? '…' : '✅ Freigeben'}
        </button>
      )}

      {canExecute && (
        <button
          onClick={handleExecute}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-800/50 text-blue-300 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingExecute ? '…' : '▶️ Sicher ausführen'}
        </button>
      )}

      {canReject && (
        <button
          onClick={handleReject}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 border border-red-800/40 text-red-400 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingReject ? '…' : '❌ Ablehnen'}
        </button>
      )}

      {feedback && (
        <span
          className={`text-xs px-2 py-1 rounded-lg ${
            feedback.ok
              ? 'bg-green-900/20 text-green-400'
              : 'bg-red-900/20 text-red-400'
          }`}
        >
          {feedback.ok ? '✅ ' : '❌ '}
          {feedback.msg || (feedback.ok ? 'Erledigt' : 'Fehler')}
        </span>
      )}
    </div>
  )
}
