'use client'

import { useState } from 'react'

export function ExportButton() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExport() {
    setLoading(true)
    setDone(false)
    setError(null)

    try {
      const res = await fetch('/api/admin/exit-readiness/export')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? `HTTP ${res.status}`)
        return
      }

      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `exit-readiness-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (e) {
      setError(`Fehler: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' :
          done    ? 'bg-green-800 text-green-200' :
          'bg-blue-700 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? '⏳ Exportiere…' : done ? '✅ Exportiert!' : '📥 JSON exportieren'}
      </button>
      {error && <span className="text-xs text-red-400">❌ {error}</span>}
    </div>
  )
}
