'use client'

import { useState } from 'react'

export function RunMIAgentButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    result?: {
      entriesAnalyzed: number
      scoresUpdated: number
      markedOutdated: number
      suggestionsCreated: number
      notificationsCreated: number
    }
    error?: string
  } | null>(null)

  async function handleRun() {
    if (!confirm('Migration Intelligence Agent starten? Das analysiert alle Korridore und aktualisiert Scores, Risikolevel und erstellt Vorschläge.')) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/global/migration-intelligence/run-agent', { method: 'POST' })
      const json = await res.json()
      setResult(json)
    } catch {
      setResult({ success: false, error: 'Netzwerkfehler' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleRun}
        disabled={loading}
        className="px-4 py-2 bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
      >
        {loading ? '⏳ Agent läuft…' : '🛂 MI-Agent starten'}
      </button>

      {result && (
        <div
          className={`rounded-xl p-4 text-sm border ${
            result.success
              ? 'bg-green-900/20 border-green-800/40 text-green-300'
              : 'bg-red-900/20 border-red-800/40 text-red-300'
          }`}
        >
          {result.success && result.result ? (
            <div className="space-y-1">
              <p className="font-semibold">✅ Agent erfolgreich abgeschlossen</p>
              <p>🔍 Analysiert: <strong>{result.result.entriesAnalyzed}</strong></p>
              <p>📊 Score-Updates: <strong>{result.result.scoresUpdated}</strong></p>
              <p>🗑️ Veraltet markiert: <strong>{result.result.markedOutdated}</strong></p>
              <p>💡 Vorschläge erstellt: <strong>{result.result.suggestionsCreated}</strong></p>
              <p>🔔 Benachrichtigungen: <strong>{result.result.notificationsCreated}</strong></p>
            </div>
          ) : (
            <p>❌ Fehler: {result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
