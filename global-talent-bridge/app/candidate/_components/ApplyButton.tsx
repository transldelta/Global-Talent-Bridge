'use client'

import { useState, useTransition } from 'react'
import { applyForJobAction } from '@/app/candidate/actions'

type Props = {
  jobId: string
  matchId: string | null
  jobTitle: string
  alreadyApplied?: boolean
  /** Aus Server Component übergeben: ist ENABLE_TEST_AUTO_APPLICATION_MESSAGE=true? */
  testMode?: boolean
  /** Vom Server vorberechneter Template-Text (nur wenn testMode=true) */
  autoMessage?: string | null
}

export function ApplyButton({
  jobId,
  matchId,
  jobTitle,
  alreadyApplied = false,
  testMode = false,
  autoMessage = null,
}: Props) {
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

  function openModal() {
    // Pre-fill im Testmodus mit dem serverseitig generierten Template
    if (testMode && autoMessage) {
      setCoverNote(autoMessage)
    } else {
      setCoverNote('')
    }
    setResult(null)
    setShowModal(true)
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
        onClick={openModal}
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
              <p className="text-gray-400 text-sm mt-1">
                Stelle: <span className="text-white">{jobTitle}</span>
              </p>
            </div>

            {/* Testmodus-Badge */}
            {testMode && (
              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl px-3 py-2 flex items-start gap-2">
                <span className="text-yellow-400 shrink-0">🧪</span>
                <p className="text-yellow-300/90 text-xs leading-relaxed">
                  <strong>Testmodus:</strong> Nachricht wurde automatisch generiert.
                  Du kannst sie bearbeiten oder direkt absenden.
                </p>
              </div>
            )}

            {/* Sicherheitshinweis */}
            <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3">
              <p className="text-blue-300/80 text-xs leading-relaxed">
                ℹ️ Deine Bewerbung wird zunächst von unserem Admin-Team geprüft.
                Erst nach Freigabe wird der Arbeitgeber informiert.
                Keine automatischen E-Mails.
              </p>
            </div>

            {/* Textfeld */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {testMode
                  ? 'Automatisch generierte Nachricht (bearbeitbar)'
                  : 'Kurze Nachricht (optional)'}
              </label>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                maxLength={800}
                rows={testMode ? 7 : 4}
                placeholder={
                  testMode
                    ? 'Nachricht wird automatisch generiert…'
                    : 'Optional: Schreibe kurz, warum dich diese Stelle interessiert.'
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-600 resize-none"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-gray-600 text-xs">
                  {testMode
                    ? '🧪 Testmodus: Nachricht wurde automatisch generiert.'
                    : 'Optional: Schreibe kurz, warum dich diese Stelle interessiert.'}
                </p>
                <p className="text-gray-600 text-xs">{coverNote.length}/800</p>
              </div>
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
