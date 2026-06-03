'use client'

import { useState, useTransition } from 'react'
import {
  updateAdminNotesAction,
  markContactedAction,
  updateFollowUpAction,
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
}: {
  id: string
  currentNotes: string | null
  currentFollowUp: string | null
  contactedAt: string | null
}) {
  const [isPendingNotes, startNotesTransition] = useTransition()
  const [isPendingContacted, startContactedTransition] = useTransition()
  const [isPendingFollowUp, startFollowUpTransition] = useTransition()
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

  return (
    <div className="space-y-5">
      {/* Notizen */}
      <form onSubmit={handleSaveNotes}>
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

      {/* Manuell kontaktiert */}
      <div className="border-t border-gray-800 pt-5">
        <p className="text-sm font-medium text-gray-300 mb-2">📞 Manuelle Kontaktaufnahme</p>
        {contactedAt ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">✅</span>
            <span className="text-green-300">
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
          <div>
            <p className="text-gray-500 text-xs mb-2">
              Nach manuellem E-Mail-Versand über dein eigenes Mail-Programm hier markieren.
              Keine automatische E-Mail wird gesendet.
            </p>
            <button
              onClick={handleMarkContacted}
              disabled={isPendingContacted}
              className="text-xs px-4 py-2 bg-yellow-700 hover:bg-yellow-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
            >
              {isPendingContacted ? 'Wird markiert…' : '✉️ Als manuell kontaktiert markieren'}
            </button>
          </div>
        )}
      </div>

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
