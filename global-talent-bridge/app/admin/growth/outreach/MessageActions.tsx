'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  id: string
  status: string
}

export function MessageActions({ id, status }: Props) {
  const router = useRouter()
  const [isPendingApprove, startApprove] = useTransition()
  const [isPendingSent, startSent] = useTransition()
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  const isAnyPending = isPendingApprove || isPendingSent

  async function callApi(url: string) {
    const res = await fetch(url, { method: 'POST' })
    const data = await res.json() as { success?: boolean; error?: string; note?: string }
    return { ok: res.ok && data.success === true, msg: data.note ?? data.error ?? '' }
  }

  function handleApprove() {
    setFeedback(null)
    startApprove(async () => {
      const r = await callApi(`/api/admin/growth/outreach-messages/${id}/approve`)
      setFeedback(r)
      router.refresh()
    })
  }

  function handleMarkSent() {
    setFeedback(null)
    startSent(async () => {
      const r = await callApi(`/api/admin/growth/outreach-messages/${id}/mark-sent`)
      setFeedback(r)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {status === 'draft' && (
        <button
          onClick={handleApprove}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 bg-green-900/40 hover:bg-green-900/60 border border-green-800/50 text-green-300 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingApprove ? '…' : '✅ Freigeben'}
        </button>
      )}
      {status === 'approved' && (
        <button
          onClick={handleMarkSent}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-800/50 text-blue-300 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingSent ? '…' : '📤 Als versendet markieren'}
        </button>
      )}
      {feedback && (
        <span className={`text-xs px-2 py-1 rounded-lg ${feedback.ok ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
          {feedback.ok ? '✅ ' : '❌ '}{feedback.msg || (feedback.ok ? 'Erledigt' : 'Fehler')}
        </span>
      )}
    </div>
  )
}
