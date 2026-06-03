'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Client-seitiger Matching-Button.
 * Ruft POST /api/matches/run-basic auf, zeigt Ladezustand
 * und leitet nach Erfolg zurück zum Dashboard (mit Erfolgsmeldung).
 */
export function MatchingButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/matches/run-basic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(
          (data as { error?: string }).error ||
            'Fehler beim Matching. Bitte erneut versuchen.'
        )
        setLoading(false)
        return
      }

      // Erfolg → Dashboard mit Erfolgs-Parameter aufrufen
      router.push('/candidate/dashboard?matched=true')
      router.refresh()
    } catch {
      setError('Netzwerkfehler. Bitte Verbindung prüfen.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Matching läuft…
          </>
        ) : (
          '⚡ Matching starten'
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  )
}
