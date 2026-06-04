'use client'

import { useState, useTransition } from 'react'

type Props = {
  candidateId: string
  jobId: string
  applicationId?: string
  isSaved?: boolean
  /** true wenn bereits eine Interview-Anfrage für diesen Kandidaten+Job existiert */
  hasInterviewRequest?: boolean
}

export function CandidateActionButtons({
  candidateId,
  jobId,
  applicationId,
  isSaved = false,
  hasInterviewRequest = false,
}: Props) {
  const [isPendingSave, startSave] = useTransition()
  const [isPendingInterview, startInterview] = useTransition()
  const [isPendingContact, startContact] = useTransition()
  const [saved, setSaved] = useState(isSaved)
  const [interviewDone, setInterviewDone] = useState(hasInterviewRequest)
  const [feedbacks, setFeedbacks] = useState<Record<string, { ok: boolean; msg: string }>>({})

  async function callApi(url: string, method: string, body: object) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json() as { success?: boolean; error?: string; note?: string }
    return { ok: res.ok && (data.success === true || !!data.note), msg: data.note ?? data.error ?? '' }
  }

  function handleSave() {
    startSave(async () => {
      if (saved) {
        const r = await callApi('/api/employer/saved-candidates', 'DELETE', { candidate_id: candidateId, job_id: jobId })
        if (r.ok) setSaved(false)
        setFeedbacks((prev) => ({ ...prev, save: r }))
      } else {
        const r = await callApi('/api/employer/saved-candidates', 'POST', { candidate_id: candidateId, job_id: jobId })
        if (r.ok) setSaved(true)
        setFeedbacks((prev) => ({ ...prev, save: r }))
      }
    })
  }

  function handleInterview() {
    startInterview(async () => {
      const r = await callApi('/api/employer/interview-requests', 'POST', {
        candidate_id: candidateId,
        job_id: jobId,
        application_id: applicationId ?? undefined,
        format: 'video',
        message: 'Interview-Anfrage über das Arbeitgeber-Dashboard erstellt.',
      })
      if (r.ok) setInterviewDone(true)
      setFeedbacks((prev) => ({ ...prev, interview: r }))
    })
  }

  function handleContact() {
    startContact(async () => {
      const r = await callApi('/api/employer/contact-release', 'POST', {
        candidate_id: candidateId,
        job_id: jobId,
        application_id: applicationId ?? undefined,
        reason: 'Direktkontakt nach Sichtung des Matching-Profils.',
      })
      setFeedbacks((prev) => ({ ...prev, contact: r }))
    })
  }

  const isAnyPending = isPendingSave || isPendingInterview || isPendingContact

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {/* Speichern */}
      <button
        onClick={handleSave}
        disabled={isAnyPending}
        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
          saved
            ? 'bg-yellow-900/30 border-yellow-800/40 text-yellow-300 hover:bg-yellow-900/50'
            : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
      >
        {isPendingSave ? '…' : saved ? '⭐ Gespeichert' : '☆ Kandidat speichern'}
      </button>

      {/* Interview anfragen */}
      {interviewDone ? (
        <span className="text-xs px-3 py-1.5 rounded-lg bg-purple-900/20 text-purple-400 border border-purple-800/30">
          📅 Interview beantragt
        </span>
      ) : (
        <button
          onClick={handleInterview}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 rounded-lg bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/30 text-purple-300 transition-colors disabled:opacity-50"
        >
          {isPendingInterview ? '…' : '📅 Interview anfragen'}
        </button>
      )}

      {/* Kontakt freigeben */}
      {feedbacks.contact?.ok ? (
        <span className="text-xs px-3 py-1.5 rounded-lg bg-green-900/20 text-green-400 border border-green-800/30">
          📋 Kontaktfreigabe beantragt
        </span>
      ) : (
        <button
          onClick={handleContact}
          disabled={isAnyPending}
          className="text-xs px-3 py-1.5 rounded-lg bg-green-900/20 hover:bg-green-900/40 border border-green-800/30 text-green-300 transition-colors disabled:opacity-50"
        >
          {isPendingContact ? '…' : '📋 Kontakt freigeben'}
        </button>
      )}

      {/* Feedback-Messages */}
      {feedbacks.interview?.msg && !feedbacks.interview.ok && (
        <span className="text-xs text-red-400">❌ {feedbacks.interview.msg}</span>
      )}
      {feedbacks.contact?.msg && !feedbacks.contact.ok && (
        <span className="text-xs text-red-400">❌ {feedbacks.contact.msg}</span>
      )}
    </div>
  )
}
