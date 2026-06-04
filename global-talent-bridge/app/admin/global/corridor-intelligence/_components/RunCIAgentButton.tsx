'use client'

import { useState } from 'react'

export function RunCIAgentButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleRun() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/global/corridor-intelligence/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.success) {
        setResult(
          `✅ ${data.corridorsAnalyzed} Korridore analysiert, ${data.scoresUpdated} Score-Updates, ${data.suggestionsCreated} Empfehlungen`
        )
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setResult(`❌ Fehler: ${data.error ?? 'Unbekannt'}`)
      }
    } catch {
      setResult('❌ Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRun}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
      >
        {loading ? '⏳ Analysiert...' : '🧠 CI-Agent starten'}
      </button>
      {result && (
        <span className="text-xs text-gray-400 text-right max-w-xs">{result}</span>
      )}
    </div>
  )
}
