'use client'

import { useState, useTransition } from 'react'
import {
  updateAdminNotesAction,
  markContactedAction,
  updateFollowUpAction,
  markQualifiedAction,
  markRejectedAction,
} from '../actions'

/**
 * AdminNotesForm — Client Component für CRM-Aktionen auf der Lead-Detailseite.
 * Keine E-Mails werden gesendet. Nur DB-Felder werden aktualisiert.
 */
export function AdminNotesForm({
  id,
  currentNotes,
  currentFollowUp,
  contactedAt,
  currentStatus,
}: {
  id: string
  currentNotes: string | null
  currentFollowUp: string | null
  contactedAt: string | null
  currentStatus: string
}) {
  const [isPendingNotes, startNotesTransition] = useTransition()
  const [isPendingContacted, startContactedTransition] = useTransition()
  const [isPendingFollowUp, startFollowUpTransition] = useTransition()
  const [isPendingQualified, startQualifiedTransition] = useTransition()
  const [isPendingRejected, startRejectedTransition] = useTransition()
  const [notesSaved, setNotesSaved] = useState(false)

  function handleSaveNotes(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startNotesTransition(async () => {
      await updateAdminNotesAction(formData)
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    })
  }

  function handleMarkContacted() {
    const formData = new FormData()
    formData.append('id', id)
    startContactedTransition(() => markContactedAction(formData))
  }

  function handleFollowUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startFollowUpTransition(() => updateFollowUpAction(formData))
  }

  function handleMarkQualified() {
    const formData = new FormData()
    formData.append('id', id)
    startQualifiedTransition(() => markQualifiedAction(formData))
  }

  function handleMarkRejected() {
    const formData = new FormData()
    formData.append('id', id)
    startRejectedTransition(() => markRejectedAction(formData))
  }

  return (
    <div className="space-y-5">

      {/* Schnellaktionen */}
      <div>
        <p className="text-sm font-medium text-gray-300 mb-3">⚡ Schnellaktionen</p>
        <div className="grid grid-cols-1 gap-2">
          {/* Als kontaktiert markieren */}
          {contactedAt ? (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-yellow-900/20 border border-yellow-800/40">
              <span className="text-yellow-400">✉️</span>
              <span className="text-yellow-300">
                Kontaktiert am{' '}
                {new Date(contactedAt).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ) : (
            <button
              onClick={handleMarkContacted}
              disabled={isPendingContacted}
              className="w-full text-left text-xs px-3 py-2 bg-yellow-900/20 hover:bg-yellow-900/40 border border-yellow-800/40 disabled:opacity-50 text-yellow-300 rounded-lg transition-colors font-medium"
            >
              {isPendingContacted ? '⏳ Wird markiert…' : '✉️ Als kontaktiert markieren'}
            </button>
          )}

          {/* Als qualifiziert markieren */}
          {currentStatus === 'qualified' ? (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-green-900/20 border border-green-800/40">
              <span className="text-green-400">⭐</span>
              <span className="text-green-300">Als qualifiziert markiert</span>
            </div>
          ) : (
            <button
              onClick={handleMarkQualified}
              disabled={isPendingQualified}
              className="w-full text-left text-xs px-3 py-2 bg-green-900/20 hover:bg-green-900/40 border border-green-800/40 disabled:opacity-50 text-green-300 rounded-lg transition-colors font-medium"
            >
              {isPendingQualified ? '⏳ Wird aktualisiert…' : '⭐ Als qualifiziert markieren'}
            </button>
          )}

          {/* Als abgelehnt markieren */}
          {currentStatus === 'rejected' ? (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-red-900/20 border border-red-800/40">
              <span className="text-red-400">❌</span>
              <span className="text-red-300">Als abgelehnt markiert</span>
            </div>
          ) : (
            <button
              onClick={handleMarkRejected}
              disabled={isPendingRejected}
              className="w-full text-left text-xs px-3 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-800/40 disabled:opacity-50 text-red-300 rounded-lg transition-colors font-medium"
            >
              {isPendingRejected ? '⏳ Wird aktualisiert…' : '❌ Als abgelehnt markieren'}
            </button>
          )}
        </div>
        <p className="text-gray-600 text-xs mt-2">
          Keine automatische E-Mail. Nur DB-Status wird geändert.
        </p>
      </div>

      {/* Notizen */}
      <form onSubmit={handleSaveNotes} className="border-t border-gray-800 pt-5">
        <input type="hidden" name="id" value={id} />
        <label className="block text-sm font-medium text-gray-300 mb-2">
          📝 Admin-Notizen{' '}
          <span className="text-gray-600 font-normal text-xs">(intern — nicht sichtbar für Kontakt)</span>
        </label>
        <textarea
          name="admin_notes"
          rows={4}
          defaultValue={currentNotes ?? ''}
          placeholder="Notizen zum Lead: Gesprächsnotizen, nächste Schritte, Bewertung..."
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
          {notesSaved && (
            <span className="text-xs text-green-400">✅ Gespeichert</span>
          )}
        </div>
      </form>

      {/* Follow-up */}
      <form onSubmit={handleFollowUp} className="border-t border-gray-800 pt-5">
        <input type="hidden" name="id" value={id} />
        <label className="block text-sm font-medium text-gray-300 mb-2">
          📅 Nächstes Follow-up{' '}
          <span className="text-gray-600 font-normal text-xs">(optional)</span>
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
