'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Client-seitiger Matching-Button.
 * Ruft POST /api/matches/run-basic auf, zeigt Ladezustand
 * und leitet nach Erfolg zurück zum Dashboard (mit Erfolgsmeldung).
 *
 * Fix: finally-Block stellt sicher, dass loading IMMER auf false gesetzt wird —
 * auch im Erfolgsfall nach router.push(). Kein dauerhafter Spinner mehr.
 */
export function MatchingButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleClick() {
    // Doppelklick verhindern
    if (loading) return

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
        return
      }

      // Erfolg → Dashboard mit Erfolgs-Parameter aufrufen
      router.push('/candidate/dashboard?matched=true')
      router.refresh()
    } catch {
      setError('Netzwerkfehler. Bitte Verbindung prüfen.')
    } finally {
      // Immer zurücksetzen — egal ob Erfolg, Fehler oder Exception
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
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
