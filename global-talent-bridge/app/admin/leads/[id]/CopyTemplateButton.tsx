'use client'

import { useState } from 'react'

/**
 * CopyTemplateButton — kopiert die Antwortvorlage in die Zwischenablage.
 * Kein automatischer E-Mail-Versand. Nur manuelles Kopieren + eigenes Mail-Programm.
 */
export function CopyTemplateButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback für ältere Browser: Text markieren
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
      {copied ? '✅ Kopiert!' : '📋 Vorlage kopieren'}
    </button>
  )
}
