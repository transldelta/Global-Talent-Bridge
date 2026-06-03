'use client'

import { useState, useTransition } from 'react'
import {
  markOutreachContactedAction,
  markOutreachInterestedAction,
  markOutreachNotInterestedAction,
  markOutreachConvertedAction,
  archiveOutreachAction,
  updateOutreachNotesAction,
  updateOutreachFollowUpAction,
} from '../actions'

/**
 * OutreachActionsPanel — Client Component für alle CRM-Aktionen.
 * Kein automatischer E-Mail-Versand. Nur DB-Updates.
 */
export function OutreachActionsPanel({
  id,
  currentStatus,
  currentNotes,
  currentFollowUp,
  lastContactedAt,
}: {
  id: string
  currentStatus: string
  currentNotes: string | null
  currentFollowUp: string | null
  lastContactedAt: string | null
}) {
  const [isPendingContacted, startContacted] = useTransition()
  const [isPendingInterested, startInterested] = useTransition()
  const [isPendingNotInterested, startNotInterested] = useTransition()
  const [isPendingConverted, startConverted] = useTransition()
  const [isPendingArchive, startArchive] = useTransition()
  const [isPendingNotes, startNotes] = useTransition()
  const [isPendingFollowUp, startFollowUp] = useTransition()
  const [notesSaved, setNotesSaved] = useState(false)

  function call(startFn: typeof startContacted, action: (fd: FormData) => Promise<void>) {
    const fd = new FormData()
    fd.append('id', id)
    startFn(() => action(fd))
  }

  function handleNotes(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startNotes(async () => {
      await updateOutreachNotesAction(fd)
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    })
  }

  function handleFollowUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startFollowUp(() => updateOutreachFollowUpAction(fd))
  }

  const isContacted = currentStatus === 'contacted' || !!lastContactedAt
  const isInterested = currentStatus === 'interested'
  const isNotInterested = currentStatus === 'not_interested'
  const isConverted = currentStatus === 'converted'
  const isArchived = currentStatus === 'archived'

  return (
    <div className="space-y-5">

      {/* Schnellaktionen */}
      <div>
        <p className="text-sm font-medium text-gray-300 mb-3">⚡ Schnellaktionen</p>
        <div className="grid grid-cols-1 gap-2">

          {/* Kontaktiert */}
          {isContacted ? (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-yellow-900/20 border border-yellow-800/40">
              <span className="text-yellow-400">✉️</span>
              <span className="text-yellow-300">
                Kontaktiert{lastContactedAt ? ` am ${new Date(lastContactedAt).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}` : ''}
              </span>
            </div>
          ) : (
            <button
              onClick={() => call(startContacted, markOutreachContactedAction)}
              disabled={isPendingContacted}
              className="w-full text-left text-xs px-3 py-2 bg-yellow-900/20 hover:bg-yellow-900/40 border border-yellow-800/40 disabled:opacity-50 text-yellow-300 rounded-lg transition-colors font-medium"
            >
              {isPendingContacted ? '⏳ …' : '✉️ Als kontaktiert markieren'}
            </button>
          )}

          {/* Interessiert */}
          {isInterested ? (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-800/40">
              <span className="text-blue-400">🤝</span>
              <span className="text-blue-300">Als interessiert markiert</span>
            </div>
          ) : (
            <button
              onClick={() => call(startInterested, markOutreachInterestedAction)}
              disabled={isPendingInterested || isConverted || isArchived}
              className="w-full text-left text-xs px-3 py-2 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-800/40 disabled:opacity-50 text-blue-300 rounded-lg transition-colors font-medium"
            >
              {isPendingInterested ? '⏳ …' : '🤝 Als interessiert markieren'}
            </button>
          )}

          {/* Nicht interessiert */}
          {isNotInterested ? (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-gray-800 border border-gray-700">
              <span className="text-gray-500">👎</span>
              <span className="text-gray-400">Nicht interessiert</span>
            </div>
          ) : (
            <button
              onClick={() => call(startNotInterested, markOutreachNotInterestedAction)}
              disabled={isPendingNotInterested || isConverted || isArchived}
              className="w-full text-left text-xs px-3 py-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 disabled:opacity-50 text-gray-400 rounded-lg transition-colors font-medium"
            >
              {isPendingNotInterested ? '⏳ …' : '👎 Nicht interessiert'}
            </button>
          )}

          {/* Konvertiert */}
          {isConverted ? (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-green-900/20 border border-green-800/40">
              <span className="text-green-400">⭐</span>
              <span className="text-green-300">Als Pilot-Arbeitgeber konvertiert</span>
            </div>
          ) : (
            <button
              onClick={() => call(startConverted, markOutreachConvertedAction)}
              disabled={isPendingConverted || isArchived}
              className="w-full text-left text-xs px-3 py-2 bg-green-900/20 hover:bg-green-900/40 border border-green-800/40 disabled:opacity-50 text-green-300 rounded-lg transition-colors font-medium"
            >
              {isPendingConverted ? '⏳ …' : '⭐ Als Pilot-Arbeitgeber konvertieren'}
            </button>
          )}

          {/* Archivieren */}
          {!isArchived && (
            <button
              onClick={() => call(startArchive, archiveOutreachAction)}
              disabled={isPendingArchive}
              className="w-full text-left text-xs px-3 py-2 bg-gray-800/40 hover:bg-gray-700/40 border border-gray-700/50 disabled:opacity-50 text-gray-500 rounded-lg transition-colors font-medium"
            >
              {isPendingArchive ? '⏳ …' : '🗄️ Archivieren'}
            </button>
          )}
        </div>
        <p className="text-gray-600 text-xs mt-2">Keine E-Mail wird gesendet. Nur DB-Status.</p>
      </div>

      {/* Notizen */}
      <form onSubmit={handleNotes} className="border-t border-gray-800 pt-5">
        <input type="hidden" name="id" value={id} />
        <label className="block text-sm font-medium text-gray-300 mb-2">
          📝 Notizen{' '}
          <span className="text-gray-600 text-xs font-normal">(intern)</span>
        </label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={currentNotes ?? ''}
          placeholder="Gesprächsnotizen, nächste Schritte, Einschätzung…"
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={isPendingNotes}
            className="text-xs px-3 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
          >
            {isPendingNotes ? 'Speichert…' : 'Notizen speichern'}
          </button>
          {notesSaved && <span className="text-xs text-green-400">✅ Gespeichert</span>}
        </div>
      </form>

      {/* Follow-up */}
      <form onSubmit={handleFollowUp} className="border-t border-gray-800 pt-5">
        <input type="hidden" name="id" value={id} />
        <label className="block text-sm font-medium text-gray-300 mb-2">
          📅 Follow-up-Datum{' '}
          <span className="text-gray-600 text-xs font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="date"
            name="next_follow_up_at"
            defaultValue={currentFollowUp ? currentFollowUp.split('T')[0] : ''}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isPendingFollowUp}
            className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 rounded-lg transition-colors font-medium"
          >
            {isPendingFollowUp ? 'Speichert…' : 'Datum setzen'}
          </button>
        </div>
      </form>
    </div>
  )
}
