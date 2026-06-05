'use client'

import { useState } from 'react'

type Props = {
  employerId: string
  employerName: string
  onSuccess?: () => void
}

const INTERACTION_TYPES = [
  { value: 'email_manual',    label: '📧 E-Mail (manuell)' },
  { value: 'whatsapp_manual', label: '💬 WhatsApp (manuell)' },
  { value: 'linkedin_manual', label: '🔗 LinkedIn (manuell)' },
  { value: 'call',            label: '📞 Telefon' },
  { value: 'demo',            label: '🖥️ Demo' },
  { value: 'note',            label: '📝 Notiz' },
]

const RESPONSE_TYPES = [
  { value: 'no_response',    label: '— Keine Antwort' },
  { value: 'positive',       label: '✅ Positiv' },
  { value: 'neutral',        label: '➡️ Neutral' },
  { value: 'objection',      label: '⚠️ Einwand' },
  { value: 'rejected',       label: '❌ Abgelehnt' },
  { value: 'demo_requested', label: '📅 Demo angefragt' },
  { value: 'pilot_requested','label': '🚀 Pilot angefragt' },
]

export function InteractionForm({ employerId, employerName, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [interactionType, setInteractionType] = useState('email_manual')
  const [responseType, setResponseType] = useState('no_response')
  const [summary, setSummary] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/employer-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilot_employer_id: employerId,
          interaction_type: interactionType,
          response_type: responseType,
          summary: summary.trim() || null,
          next_action: nextAction.trim() || null,
          next_follow_up_at: followUpDate || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? `HTTP ${res.status}`)
        return
      }

      setDone(true)
      setSummary('')
      setNextAction('')
      setFollowUpDate('')
      setResponseType('no_response')
      setInteractionType('email_manual')
      setTimeout(() => {
        setDone(false)
        setOpen(false)
        onSuccess?.()
      }, 1500)
    } catch (e) {
      setError(`Fehler: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-3 py-1.5 bg-blue-900/30 border border-blue-800/50 text-blue-300 rounded-lg hover:bg-blue-900/50 transition-colors"
      >
        + Interaktion protokollieren
      </button>
    )
  }

  return (
    <div className="mt-3 bg-gray-800/50 rounded-xl border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-300">Interaktion mit: <span className="text-white">{employerName}</span></p>
        <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-400 text-xs">✕ Schließen</button>
      </div>
      <p className="text-xs text-amber-400/70 bg-amber-900/10 border border-amber-800/30 rounded px-2 py-1 mb-3">
        ⚠️ Kein automatischer Versand. Diese Protokollierung erfasst nur was manuell gemacht wurde.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Interaktionstyp</label>
            <select
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none"
            >
              {INTERACTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Antwort-Typ</label>
            <select
              value={responseType}
              onChange={(e) => setResponseType(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none"
            >
              {RESPONSE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Zusammenfassung (optional)</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Was wurde besprochen? Wie war die Reaktion?"
            className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nächste Aktion (optional)</label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              maxLength={500}
              placeholder="z.B. Demo-Termin senden"
              className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Follow-Up-Datum (optional)</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400">❌ {error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' :
              done    ? 'bg-green-800 text-green-200' :
              'bg-blue-700 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? '⏳ Speichere…' : done ? '✅ Gespeichert!' : '💾 Protokollieren'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-300 border border-gray-700"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  )
}
