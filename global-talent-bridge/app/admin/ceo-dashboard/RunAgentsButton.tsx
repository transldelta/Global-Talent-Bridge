'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function RunAgentsButton() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    success: boolean
    summary?: string
    total_suggestions?: number
    total_notifications?: number
    error?: string
  } | null>(null)
  const router = useRouter()

  async function handleRun() {
    setResult(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/agents/run', { method: 'POST' })
        const data = await res.json() as {
          success?: boolean
          summary?: string
          total_suggestions?: number
          total_notifications?: number
          error?: string
        }
        setResult({
          success: res.ok && data.success === true,
          summary: data.summary,
          total_suggestions: data.total_suggestions,
          total_notifications: data.total_notifications,
          error: data.error,
        })
        router.refresh()
      } catch {
        setResult({ success: false, error: 'Netzwerkfehler — bitte erneut versuchen.' })
      }
    })
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleRun}
        disabled={isPending}
        className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors"
      >
        {isPending ? '⏳ Agenten laufen…' : '🤖 Agenten jetzt prüfen lassen'}
      </button>

      {result && (
        <div
          className={`p-3 rounded-xl text-xs leading-relaxed ${
            result.success
              ? 'bg-green-900/20 border border-green-800/40 text-green-300'
              : 'bg-red-900/20 border border-red-800/40 text-red-300'
          }`}
        >
          {result.success ? '✅ ' : '❌ '}
          {result.summary ?? result.error ?? 'Unbekanntes Ergebnis'}
          {result.success && result.total_suggestions !== undefined && (
            <span className="ml-2 opacity-70">
              ({result.total_suggestions} Vorschläge, {result.total_notifications ?? 0} Notifications)
            </span>
          )}
        </div>
      )}
    </div>
  )
}
