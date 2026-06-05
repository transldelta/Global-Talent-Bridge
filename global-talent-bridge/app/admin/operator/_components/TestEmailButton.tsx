'use client'

import { useState } from 'react'

export function TestEmailButton() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<{ ok: boolean; text: string } | null>(null)
  const [open, setOpen]       = useState(false)

  async function send() {
    if (!email || !email.includes('@')) {
      setResult({ ok: false, text: 'Bitte eine gültige E-Mail-Adresse eingeben.' })
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/operator/email-provider/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_email: email }),
      })
      const data = await res.json() as { message?: string; error?: string; reason?: string }
      if (!res.ok) {
        setResult({ ok: false, text: data.reason ?? data.error ?? 'Fehler beim Senden' })
      } else {
        setResult({ ok: true, text: data.message ?? 'Test-E-Mail gesendet ✓' })
        setOpen(false)
      }
    } catch {
      setResult({ ok: false, text: 'Netzwerkfehler' })
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <div className="mt-3">
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-900/40 hover:bg-green-800/60 text-green-300 border border-green-800/50 transition-colors"
        >
          🧪 Test-E-Mail senden
        </button>
        {result && (
          <p className={`text-xs mt-2 ${result.ok ? 'text-green-400' : 'text-red-400'}`}>
            {result.text}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-3 p-3 bg-green-900/10 border border-green-800/30 rounded-xl space-y-2">
      <p className="text-green-300/80 text-xs font-medium">
        🧪 Test-E-Mail — kein Arbeitgeber wird kontaktiert, kein Draft markiert
      </p>
      <div className="flex gap-2 flex-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="deine@email.de"
          className="flex-1 min-w-48 px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-700"
        />
        <button
          onClick={send}
          disabled={loading || !email}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-700 hover:bg-green-600 text-white disabled:opacity-50 transition-colors"
        >
          {loading ? '…Senden…' : '📤 Senden'}
        </button>
        <button
          onClick={() => { setOpen(false); setResult(null) }}
          className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 transition-colors"
        >
          Abbrechen
        </button>
      </div>
      {result && (
        <p className={`text-xs ${result.ok ? 'text-green-400' : 'text-red-400'}`}>
          {result.text}
        </p>
      )}
    </div>
  )
}
