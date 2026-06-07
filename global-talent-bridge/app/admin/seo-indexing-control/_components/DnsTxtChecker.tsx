'use client'
/**
 * DnsTxtChecker.tsx
 *
 * Client-Komponente: Nutzer fügt Google TXT-Wert ein → Button "DNS prüfen"
 * → API-Call an /api/admin/dns-check → Ergebnis anzeigen.
 *
 * Kein Scraping. Kein Google API. Nur DNS-Abfrage über Admin-Route.
 */
import { useState } from 'react'

type CheckResult = {
  found:       boolean
  domain:      string
  recordCount: number
  dnsError:    string | null
  allRecords:  string[]
  checkedAt:   string
} | null

export function DnsTxtChecker() {
  const [txtValue, setTxtValue]   = useState('')
  const [loading,  setLoading]    = useState(false)
  const [result,   setResult]     = useState<CheckResult>(null)
  const [error,    setError]      = useState<string | null>(null)

  async function handleCheck() {
    if (!txtValue.trim() || txtValue.trim().length < 10) {
      setError('Bitte den Google TXT-Wert einfügen (mindestens 10 Zeichen)')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res  = await fetch(`/api/admin/dns-check?txt=${encodeURIComponent(txtValue.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'DNS-Abfrage fehlgeschlagen')
      } else {
        setResult(data)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Google TXT-Wert einfügen
        </label>
        <textarea
          value={txtValue}
          onChange={e => setTxtValue(e.target.value)}
          placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          rows={3}
          className="w-full text-sm font-mono border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Aus Google Search Console kopieren → „Property hinzufügen" → „DNS-Eintrag" → TXT-Wert
        </p>
      </div>

      {/* Button */}
      <button
        onClick={handleCheck}
        disabled={loading || !txtValue.trim()}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin text-base">⟳</span>
            DNS wird geprüft…
          </>
        ) : (
          <>🔍 DNS prüfen</>
        )}
      </button>

      {/* Fehler */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Ergebnis */}
      {result && (
        <div className={`rounded-lg border p-4 ${result.found
          ? 'bg-green-50 border-green-300'
          : 'bg-amber-50 border-amber-300'
        }`}>
          <div className={`text-base font-bold mb-1 ${result.found ? 'text-green-800' : 'text-amber-800'}`}>
            {result.found
              ? '✅ TXT-Eintrag gefunden! Google kann die Domain verifizieren.'
              : '⏳ TXT-Eintrag noch nicht sichtbar.'}
          </div>
          <div className={`text-sm ${result.found ? 'text-green-700' : 'text-amber-700'}`}>
            {result.found
              ? 'DNS-Propagation abgeschlossen. Kehre zu Google Search Console zurück und klicke „Verifizieren".'
              : 'DNS-Einträge können 5 Minuten bis 48 Stunden brauchen. Bitte warte und prüfe erneut.'}
          </div>
          {result.dnsError && (
            <div className="text-xs text-amber-600 mt-2">DNS-Hinweis: {result.dnsError}</div>
          )}
          <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-3">
            <span>Domain: {result.domain}</span>
            <span>TXT-Records gefunden: {result.recordCount}</span>
            <span>Geprüft: {new Date(result.checkedAt).toLocaleTimeString('de-DE')}</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            ✓ Kein Scraping · ✓ Kein Google API · ✓ Nur Standard-DNS-Abfrage
          </div>
        </div>
      )}
    </div>
  )
}
