'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function GenerateDraftsButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  async function generate() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/operator/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_batch' }),
      })
      const data = await res.json() as { message?: string; created?: number; error?: string }
      if (!res.ok) {
        setResult({ ok: false, text: data.error ?? 'Fehler beim Generieren' })
      } else {
        setResult({ ok: true, text: data.message ?? `${data.created ?? 0} Drafts erstellt` })
        startTransition(() => router.refresh())
      }
    } catch {
      setResult({ ok: false, text: 'Netzwerkfehler' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={generate}
        disabled={loading || isPending}
        className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-800 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors"
      >
        {loading ? '…Wird generiert…' : '⚡ Batch-Drafts generieren'}
      </button>
      {result && (
        <span className={`text-sm ${result.ok ? 'text-green-400' : 'text-red-400'}`}>
          {result.text}
        </span>
      )}
    </div>
  )
}
