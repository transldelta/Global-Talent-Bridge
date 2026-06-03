'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  applicationId: string
  currentStatus: string
}

export function ApplicationReviewButton({ applicationId, currentStatus }: Props) {
  const router = useRouter()
  const [isPendingApprove, startApprove] = useTransition()
  const [isPendingReject, startReject] = useTransition()
  const [adminNote, setAdminNote] = useState('')
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  const isAnyPending = isPendingApprove || isPendingReject
  const isDone = ['accepted', 'rejected', 'employer_notified'].includes(currentStatus)

  async function callReview(action: 'approve' | 'reject') {
    const res = await fetch(`/api/admin/applications/${applicationId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, admin_note: adminNote }),
    })
    const data = await res.json() as { success?: boolean; error?: string; note?: string }
    return { ok: res.ok && data.success === true, msg: data.note ?? data.error ?? '' }
  }

  if (isDone) {
    return (
      <span className={`text-xs px-2 py-1 rounded-lg ${
        currentStatus === 'employer_notified' || currentStatus === 'accepted'
          ? 'bg-green-900/20 text-green-400'
          : 'bg-red-900/20 text-red-400'
      }`}>
        {currentStatus === 'employer_notified' ? '✅ Freigegeben'
          : currentStatus === 'accepted' ? '✅ Angenommen'
          : '❌ Abgelehnt'}
      </span>
    )
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={adminNote}
        onChange={(e) => setAdminNote(e.target.value)}
        placeholder="Admin-Notiz (optional)"
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-600"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setFeedback(null)
            startApprove(async () => {
              const r = await callReview('approve')
              setFeedback(r)
              if (r.ok) router.refresh()
            })
          }}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 bg-green-900/40 hover:bg-green-900/60 border border-green-800/50 text-green-300 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingApprove ? '…' : '✅ Freigeben & Arbeitgeber informieren'}
        </button>
        <button
          onClick={() => {
            setFeedback(null)
            startReject(async () => {
              const r = await callReview('reject')
              setFeedback(r)
              if (r.ok) router.refresh()
            })
          }}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 border border-red-800/40 text-red-400 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingReject ? '…' : '❌ Ablehnen'}
        </button>
      </div>
      {feedback && (
        <p className={`text-xs px-2 py-1 rounded ${feedback.ok ? 'text-green-400' : 'text-red-400'}`}>
          {feedback.ok ? '✅ ' : '❌ '}{feedback.msg}
        </p>
      )}
    </div>
  )
}
