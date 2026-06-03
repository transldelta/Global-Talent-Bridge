'use client'

import { useState } from 'react'

/**
 * CopyButton — kopiert Text-Inhalt in die Zwischenablage.
 * Kein automatischer Versand. Nur manuelles Kopieren.
 */
export function CopyButton({ text, label = 'Kopieren' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: nichts tun
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
        copied
          ? 'bg-green-700 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
    >
      {copied ? '✅ Kopiert!' : `📋 ${label}`}
    </button>
  )
}
