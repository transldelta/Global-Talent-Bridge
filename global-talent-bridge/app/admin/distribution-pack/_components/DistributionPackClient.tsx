'use client'
/**
 * DistributionPackClient — Copy-Paste Distribution Texts
 *
 * Kein Send-Button. Nur Kopieren-Buttons.
 * Kein Outreach. Kein automatischer Versand.
 */
import { useState } from 'react'

interface CopyBlock {
  id:      string
  label:   string
  icon:    string
  text:    string
  note:    string
}

interface Props {
  blocks: CopyBlock[]
}

function CopyCard({ block }: { block: CopyBlock }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(block.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">{block.icon}</span>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{block.label}</div>
            <div className="text-gray-500 text-xs">{block.note}</div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            copied
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {copied ? '✅ Kopiert!' : '📋 Kopieren'}
        </button>
      </div>
      {/* Content */}
      <div className="px-4 py-3">
        <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans leading-relaxed">
          {block.text}
        </pre>
      </div>
    </div>
  )
}

export function DistributionPackClient({ blocks }: Props) {
  const [copiedAll, setCopiedAll] = useState(false)

  async function handleCopyAll() {
    const all = blocks.map(b => `--- ${b.label} ---\n${b.text}`).join('\n\n')
    await navigator.clipboard.writeText(all)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2500)
  }

  return (
    <div className="space-y-4">
      {/* Safety Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center gap-3 text-sm">
        <span className="text-xl">🛡️</span>
        <span className="text-slate-300">
          <strong className="text-green-400">Kein Send-Button.</strong>{' '}
          Nur kopieren und manuell teilen. Kein automatischer Versand. Kein Outreach. Kein Spam.
        </span>
      </div>

      {/* Copy All */}
      <div className="flex justify-end">
        <button
          onClick={handleCopyAll}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            copiedAll
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          {copiedAll ? '✅ Alle kopiert!' : '📋 Alle Texte kopieren'}
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {blocks.map(block => (
          <CopyCard key={block.id} block={block} />
        ))}
      </div>

      {/* Footer Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
        <p className="text-yellow-800 text-xs">
          ⚠️ Diese Texte sind für passive Verbreitung gedacht: LinkedIn-Bio, WhatsApp-Status,
          Profil-Links, persönliche Netzwerke. Kein Massen-Outreach. Kein Cold-Mailing.
          Keine bezahlten Anzeigen ohne rechtliche Prüfung.
        </p>
      </div>
    </div>
  )
}
