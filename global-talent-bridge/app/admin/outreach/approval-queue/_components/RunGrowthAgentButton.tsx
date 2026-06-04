'use client'

import { useState } from 'react'

type RunResult = {
  success?: boolean
  leadsAnalyzed?: number
  draftsCreated?: number
  followupsPlanned?: number
  alertsSent?: number
  note?: string
  error?: string
}

export function RunGrowthAgentButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)

  async function handleRun() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/growth-agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json() as RunResult
      setResult(data)
      // Seite nach 1,5s neu laden, damit neue Entwürfe erscheinen
      if (data.success) {
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : 'Netzwerkfehler' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRun}
        disabled={loading}
        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⚙️</span> Analysiere Leads…
          </>
        ) : (
          <>🤖 Growth Agent starten</>
        )}
      </button>
      {result && (
        <div className={`text-xs px-3 py-2 rounded-lg max-w-xs text-right ${
          result.success ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
        }`}>
          {result.success ? (
            <>
              ✅ {result.draftsCreated} Entwürfe · {result.leadsAnalyzed} Leads
              {result.followupsPlanned ? ` · ${result.followupsPlanned} Follow-ups` : ''}
              <div className="text-green-400/70 text-xs mt-0.5">Seite wird neu geladen…</div>
            </>
          ) : (
            <>❌ {result.error}</>
          )}
        </div>
      )}
    </div>
  )
}
