'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Client-seitiger Button zum Neuberechnen der Business Metrics.
 * Ruft POST /api/admin/recalculate-metrics auf (Admin-only).
 */
export function RefreshMetricsButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    setMessage(null)
    setIsError(false)

    try {
      const res = await fetch('/api/admin/recalculate-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setIsError(true)
        setMessage(
          `Fehler: ${(data as { error?: string }).error ?? 'Unbekannter Fehler'}`
        )
      } else {
        const d = data as { metrics_updated?: number; period?: string }
        setMessage(
          `✅ ${d.metrics_updated ?? 0} Kennzahlen aktualisiert (${d.period ?? ''})`
        )
        router.refresh()
      }
    } catch {
      setIsError(true)
      setMessage('Netzwerkfehler. Bitte Verbindung prüfen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-900 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Berechne…
          </>
        ) : (
          '📊 Kennzahlen aktualisieren'
        )}
      </button>
      {message && (
        <p className={`text-xs ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
