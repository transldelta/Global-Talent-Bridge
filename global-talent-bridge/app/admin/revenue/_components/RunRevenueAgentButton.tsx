'use client'

import { useState } from 'react'
import type { ForecastScenario } from '@/lib/agents/revenue-intelligence-agent'

type AgentResult = {
  success: boolean
  result?: {
    plansAnalyzed: number
    scenariosComputed: number
    suggestionsCreated: number
    forecasts: ForecastScenario[]
  }
  error?: string
}

export function RunRevenueAgentButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AgentResult | null>(null)

  async function handleRun() {
    if (!confirm('Revenue Intelligence Agent starten? Das berechnet Forecasts, MRR/ARR-Schätzungen und erstellt CEO-Vorschläge. Alle Zahlen sind Simulationen.')) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/revenue/run-agent', { method: 'POST' })
      const json = await res.json()
      setResult(json as AgentResult)
    } catch {
      setResult({ success: false, error: 'Netzwerkfehler' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleRun}
        disabled={loading}
        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
      >
        {loading ? '⏳ Agent läuft…' : '💰 Revenue-Agent starten'}
      </button>

      {result && (
        <div
          className={`rounded-xl p-4 text-sm border ${
            result.success
              ? 'bg-green-900/20 border-green-800/40 text-green-300'
              : 'bg-red-900/20 border-red-800/40 text-red-300'
          }`}
        >
          {result.success && result.result ? (
            <div className="space-y-2">
              <p className="font-semibold">✅ Revenue Agent abgeschlossen</p>
              <p>📊 Pläne analysiert: <strong>{result.result.plansAnalyzed}</strong></p>
              <p>🔮 Szenarien berechnet: <strong>{result.result.scenariosComputed}</strong></p>
              <p>💡 Vorschläge erstellt: <strong>{result.result.suggestionsCreated}</strong></p>
              {result.result.forecasts.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-green-800/30 pt-3">
                  {result.result.forecasts.map((f) => (
                    <div key={f.label} className="text-xs text-green-200/70">
                      <span className="font-medium text-green-200">{f.label}:</span>{' '}
                      MRR {f.mrr.toLocaleString('de-DE')} € · ARR {f.arr.toLocaleString('de-DE')} € · Break-even ~{f.breakEvenMonths} Monate
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-green-200/50 mt-2">⚠️ Alle Zahlen sind Forecast-Simulationen.</p>
            </div>
          ) : (
            <p>❌ Fehler: {result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
