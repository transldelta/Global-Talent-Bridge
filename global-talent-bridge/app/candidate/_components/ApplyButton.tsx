'use client'

import { useState, useTransition } from 'react'
import { applyForJobAction } from '@/app/candidate/actions'

type Props = {
  jobId: string
  matchId: string | null
  jobTitle: string
  alreadyApplied?: boolean
}

export function ApplyButton({ jobId, matchId, jobTitle, alreadyApplied = false }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [coverNote, setCoverNote] = useState('')
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [applied, setApplied] = useState(alreadyApplied)

  if (applied) {
    return (
      <span className="text-xs px-3 py-1.5 rounded-lg bg-green-900/20 text-green-400 border border-green-800/30">
        ✅ Beworben
      </span>
    )
  }

  function handleSubmit() {
    setResult(null)
    startTransition(async () => {
      const res = await applyForJobAction(jobId, matchId, coverNote)
      if (res.success) {
        setApplied(true)
        setShowModal(false)
        setCoverNote('')
      } else {
        setResult({ error: res.error })
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-medium transition-colors"
      >
        📩 Interesse senden
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div>
              <h3 className="text-white font-semibold text-lg">Interesse senden</h3>
              <p className="text-gray-400 text-sm mt-1">Stelle: <span className="text-white">{jobTitle}</span></p>
            </div>

            <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3">
              <p className="text-blue-300/80 text-xs leading-relaxed">
                ℹ️ Deine Bewerbung wird zunächst von unserem Admin-Team geprüft.
                Erst nach Freigabe wird der Arbeitgeber informiert.
                Keine automatischen E-Mails.
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Kurze Nachricht (optional)
              </label>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Warum interessiert dich diese Stelle? (optional, max. 500 Zeichen)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-600 resize-none"
              />
              <p className="text-gray-600 text-xs mt-1">{coverNote.length}/500</p>
            </div>

            {result?.error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
                ❌ {result.error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isPending ? 'Wird gesendet…' : '📩 Bewerbung einreichen'}
              </button>
              <button
                onClick={() => { setShowModal(false); setResult(null) }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
