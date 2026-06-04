'use client'
import { useState } from 'react'

type AgentResult = {
  followUpsDue:       number
  tasksCreated:       number
  suggestionsCreated: number
  employersActive:    number
  candidatesTotal:    number
  feedbackCritical:   number
}

export function RunPilotAgentButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<AgentResult | null>(null)
  const [error, setError]     = useState<string | null>(null)

  async function handleRun() {
    if (!confirm('Pilot Launch Agent ausführen? Es werden Follow-ups erkannt und Tasks/Suggestions erzeugt.')) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/admin/pilot-launch/run-agent', { method: 'POST' })
      const data = await res.json()
      if (data.success) setResult(data.result)
      else setError(data.error ?? 'Fehler')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleRun}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? '⏳ Agent läuft…' : '🤖 Pilot Agent ausführen'}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-800 mb-2">✅ Agent abgeschlossen</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-white border rounded p-2 text-center">
              <p className="text-lg font-bold text-red-600">{result.followUpsDue}</p>
              <p className="text-gray-500">Follow-ups fällig</p>
            </div>
            <div className="bg-white border rounded p-2 text-center">
              <p className="text-lg font-bold text-blue-600">{result.tasksCreated}</p>
              <p className="text-gray-500">Tasks erstellt</p>
            </div>
            <div className="bg-white border rounded p-2 text-center">
              <p className="text-lg font-bold text-purple-600">{result.suggestionsCreated}</p>
              <p className="text-gray-500">Suggestions</p>
            </div>
            <div className="bg-white border rounded p-2 text-center">
              <p className="text-lg font-bold text-green-600">{result.employersActive}</p>
              <p className="text-gray-500">Aktive Pilotkunden</p>
            </div>
            <div className="bg-white border rounded p-2 text-center">
              <p className="text-lg font-bold text-gray-700">{result.candidatesTotal}</p>
              <p className="text-gray-500">Kandidaten</p>
            </div>
            <div className="bg-white border rounded p-2 text-center">
              <p className="text-lg font-bold text-orange-600">{result.feedbackCritical}</p>
              <p className="text-gray-500">Krit. Feedback</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
