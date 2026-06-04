'use client'

import { useState } from 'react'

type SeedResult = {
  success: boolean
  alreadySeeded?: boolean
  employers?: number
  candidates?: number
  message?: string
  error?: string
}

export function PreparePilotDataButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')
  const [result, setResult] = useState<SeedResult | null>(null)

  async function handleClick() {
    if (status === 'loading') return
    setStatus('loading')
    setResult(null)

    try {
      const res = await fetch('/api/admin/pilot-launch/seed-data', { method: 'POST' })
      const data: SeedResult = await res.json()

      if (!res.ok || !data.success) {
        setStatus('error')
        setResult(data)
        return
      }

      setStatus(data.alreadySeeded ? 'already' : 'success')
      setResult(data)
    } catch {
      setStatus('error')
      setResult({ success: false, error: 'Netzwerkfehler.' })
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          status === 'loading'
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : status === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300 cursor-default'
            : status === 'already'
            ? 'bg-blue-100 text-blue-700 border border-blue-300 cursor-default'
            : status === 'error'
            ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
        }`}
      >
        {status === 'loading' && <span className="animate-spin text-base">⏳</span>}
        {status === 'success' && '✅'}
        {status === 'already' && 'ℹ️'}
        {status === 'error' && '❌'}
        {status === 'idle' && '🌱'}

        {status === 'loading'  ? 'Pilotdaten werden angelegt…' :
         status === 'success'  ? `Fertig: ${result?.employers} Arbeitgeber, ${result?.candidates} Kandidaten` :
         status === 'already'  ? `Bereits vorhanden (${result?.employers} AG / ${result?.candidates} Kand.)` :
         status === 'error'    ? 'Fehler — erneut versuchen' :
                                 'Pilotdaten vorbereiten'}
      </button>

      {result?.message && (status === 'success' || status === 'already') && (
        <p className="text-xs text-gray-500">{result.message}</p>
      )}
      {result?.error && status === 'error' && (
        <p className="text-xs text-red-600">{result.error}</p>
      )}
    </div>
  )
}
