'use client'
/**
 * app/admin/pilot-target-finder/_components/TargetFinderForm.tsx
 *
 * Pilot Target Finder — generiert Suchvorschläge ohne Scraping.
 * KEIN externer API-Call. KEIN automatisches Crawling.
 * Nur Suchstring-Vorschläge die der Nutzer manuell in Google eingibt.
 */
import { useState } from 'react'
import { generateSearchSuggestions, getAvailableSectors } from '@/lib/pilot-target-finder'
import type { TargetSector, TargetFinderResult } from '@/lib/pilot-target-finder'

const SECTORS = getAvailableSectors()

export function TargetFinderForm() {
  const [city,   setCity]   = useState('')
  const [sector, setSector] = useState<TargetSector>('pflege')
  const [result, setResult] = useState<TargetFinderResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setResult(generateSearchSuggestions(city, sector))
  }

  async function handleCopy(text: string) {
    try { await navigator.clipboard.writeText(text) } catch { /* ignore */ }
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">

      {/* Sicherheits-Banner */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm text-gray-300 flex gap-3">
        <span className="text-green-400 mt-0.5">🔒</span>
        <span>
          <strong className="text-white">Kein Scraping.</strong> Das System erzeugt nur
          Suchvorschläge — du öffnest Google selbst und trägst die Firma dann manuell ein.
          Kein automatischer Zugriff auf externe Webseiten.
        </span>
      </div>

      {/* Formular */}
      <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Stadt / Region</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="z.B. Karlsruhe, München, Hamburg…"
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Branche</label>
          <select
            value={sector}
            onChange={e => setSector(e.target.value as TargetSector)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
          >
            {SECTORS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
          >
            🔍 Suchvorschläge generieren
          </button>
        </div>
      </form>

      {/* Ergebnisse */}
      {result && (
        <div className="space-y-5">

          {/* Kopfzeile */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg px-4 py-3">
            <div className="text-blue-200 font-medium mb-1">
              {result.suggestions.length} Suchvorschläge für{' '}
              <strong>{SECTORS.find(s => s.value === result.sector)?.label}</strong>
              {result.city !== 'Deutschland' && ` in ${result.city}`}
            </div>
            <div className="text-xs text-blue-300">
              Öffne die Links in Google → Finde eine passende Firma → Trage sie im Autopilot ein.
            </div>
          </div>

          {/* Suchvorschläge */}
          <div className="space-y-3">
            {result.suggestions.map((s, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm text-white font-mono">{s.query}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.rationale}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={s.googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs font-medium transition-colors"
                  >
                    🔎 In Google öffnen
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(s.query)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs transition-colors"
                  >
                    {copied === s.query ? '✅' : '📋'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tipps */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-300 mb-3">💡 Worauf achten bei der Firmenauswahl</div>
            <ul className="space-y-1.5">
              {result.tips.map((tip, i) => (
                <li key={i} className="text-xs text-gray-400 flex gap-2">
                  <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nächste Aktion */}
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-sm text-green-200 flex-1">
              <strong>Firma gefunden?</strong> Firmennamen, Website und Branche notieren —
              dann im Outreach Autopilot analysieren.
            </div>
            <a
              href="/admin/outreach-autopilot"
              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors shrink-0 text-center"
            >
              🤖 Firma im Autopilot analysieren
            </a>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Keine automatische Kontaktsuche — du gibst die Firmendaten manuell ein.
          </p>
        </div>
      )}
    </div>
  )
}
