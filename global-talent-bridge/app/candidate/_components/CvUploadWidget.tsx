'use client'

import { useState, useRef } from 'react'

interface Props {
  currentCvFilename?: string | null
  currentCvUploadedAt?: string | null
}

export function CvUploadWidget({ currentCvFilename, currentCvUploadedAt }: Props) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [filename, setFilename] = useState<string>(currentCvFilename || '')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return

    setStatus('uploading')
    setMessage('')

    const formData = new FormData()
    formData.append('cv', file)

    try {
      const res = await fetch('/api/candidate/upload-cv', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Upload fehlgeschlagen.')
        return
      }

      setStatus('success')
      setFilename(data.filename)
      setMessage('CV erfolgreich hochgeladen.')

      // Eingabe zurücksetzen
      if (fileRef.current) fileRef.current.value = ''
    } catch {
      setStatus('error')
      setMessage('Netzwerkfehler. Bitte erneut versuchen.')
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-1">Lebenslauf (CV)</h3>
      <p className="text-gray-400 text-sm mb-4">
        PDF, DOC oder DOCX · Max. 5 MB · Privat gespeichert
      </p>

      {/* Aktueller CV */}
      {filename && (
        <div className="mb-4 flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <span className="text-blue-400 text-xl">📄</span>
          <div>
            <p className="text-white text-sm font-medium">{filename}</p>
            {currentCvUploadedAt && (
              <p className="text-gray-500 text-xs">
                Hochgeladen: {new Date(currentCvUploadedAt).toLocaleDateString('de-DE')}
              </p>
            )}
          </div>
          <span className="ml-auto text-green-400 text-sm">✓ Vorhanden</span>
        </div>
      )}

      {/* Status-Meldung */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          status === 'success'
            ? 'bg-green-900/40 border border-green-700 text-green-300'
            : 'bg-red-900/40 border border-red-700 text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Upload-Form */}
      <form onSubmit={handleUpload} className="flex items-center gap-3">
        <label className="flex-1 cursor-pointer">
          <input
            ref={fileRef}
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            required
          />
          <div className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 border-dashed rounded-lg text-gray-400 text-sm hover:border-blue-500 hover:text-blue-400 transition-colors text-center cursor-pointer">
            {fileRef.current?.files?.[0]?.name || 'Datei auswählen...'}
          </div>
        </label>

        <button
          type="submit"
          disabled={status === 'uploading'}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          {status === 'uploading' ? 'Lädt...' : filename ? 'Ersetzen' : 'Hochladen'}
        </button>
      </form>

      <p className="text-gray-600 text-xs mt-3">
        Dein CV wird verschlüsselt gespeichert und nur für Arbeitgeber sichtbar, denen du zustimmst.
      </p>
    </div>
  )
}
