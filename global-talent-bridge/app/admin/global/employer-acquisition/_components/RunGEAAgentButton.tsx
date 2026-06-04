'use client'

import { useState } from 'react'

export function RunGEAAgentButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleRun() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/global/employer-acquisition/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.success) {
        setResult(
          `✅ ${data.sourcesAnalyzed} Quellen analysiert, ${data.scoresUpdated} Score-Updates, ${data.outreachRecsCreated} neue Outreach-Empfehlungen`
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
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
      >
        {loading ? '⏳ Analysiert...' : '🏢 GEA-Agent starten'}
      </button>
      {result && (
        <span className="text-xs text-gray-400 text-right max-w-xs">{result}</span>
      )}
    </div>
  )
}
