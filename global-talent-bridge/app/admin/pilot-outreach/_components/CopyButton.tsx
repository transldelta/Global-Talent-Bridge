'use client'

import { useState } from 'react'

export function CopyButton({ text, label = 'Kopieren' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select + execCommand
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        copied
          ? 'bg-green-800/50 text-green-300 border border-green-700'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
      }`}
    >
      {copied ? '✅ Kopiert!' : `📋 ${label}`}
    </button>
  )
}
