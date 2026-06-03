'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type RunResult = {
  leads_scored: number
  tasks_created: number
  messages_drafted: number
  signals_found: number
  summary: string
}

export function RunGrowthAgentButton() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<RunResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleRun() {
    setResult(null)
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/growth/run', { method: 'POST' })
        const data = await res.json() as RunResult & { error?: string }
        if (!res.ok || data.error) {
          setError(data.error ?? 'Unbekannter Fehler')
        } else {
          setResult(data)
          router.refresh()
        }
      } catch {
        setError('Netzwerkfehler. Bitte erneut versuchen.')
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleRun}
        disabled={isPending}
        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {isPending ? (
          <>
            <span className="animate-spin">⏳</span> Läuft…
          </>
        ) : (
          <>🚀 Growth-Agent ausführen</>
        )}
      </button>

      {result && (
        <div className="flex-1 bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-4 py-2">
          <p className="text-emerald-300 text-sm font-medium">✅ Agent abgeschlossen</p>
          <p className="text-emerald-200/70 text-xs mt-0.5">{result.summary}</p>
        </div>
      )}

      {error && (
        <div className="flex-1 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-2">
          <p className="text-red-300 text-sm">❌ {error}</p>
        </div>
      )}
    </div>
  )
}
