'use client'

/**
 * VoiceoverRecorderClient.tsx
 *
 * Browser-based voiceover recorder using MediaRecorder API.
 * No TTS · No robot voice · No external API · No Stripe · No email sending.
 *
 * Flow:
 *   1. Request microphone permission
 *   2. Start recording — MediaRecorder captures audio chunks
 *   3. Stop recording — blob assembled
 *   4. Play preview — listen back before downloading
 *   5. Download — saves as corridorwork-vo-en-human.webm
 *   6. (Local dev only) Upload to /api/admin/promo-video/voiceover-upload
 */

import { useState, useRef, useEffect, useCallback } from 'react'

const VOICEOVER_SCRIPT = `Across the world, employers are searching for skilled people.

And qualified workers are searching for better opportunities.

But too often, they never meet.

CorridorWork helps structure that connection.

A global platform for employer demand, candidate interest and international talent corridors.

Employers can share workforce needs.

Candidates can express interest across sectors and regions.

Partners can explore structured collaboration models.

From healthcare and IT to engineering, logistics, construction and skilled trades —

CorridorWork is designed for a global workforce.

Every workflow is consent-based and reviewed.

No job guarantee. No visa guarantee. No automatic outreach.

CorridorWork.

Connecting global talent with opportunity.

Visit corridorwork.com.`

const SCRIPT_LINES = VOICEOVER_SCRIPT.split('\n\n')

type RecordingState = 'idle' | 'requesting' | 'recording' | 'stopped' | 'uploading'

interface Props {
  adminEmail: string
}

export function VoiceoverRecorderClient({ adminEmail }: Props) {
  const [state, setState] = useState<RecordingState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [mimeType, setMimeType] = useState('audio/webm')
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'local-only'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')
  const [permissionError, setPermissionError] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = useCallback(async () => {
    setState('requesting')
    setPermissionError('')
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        }
      })

      // Pick best supported format
      const preferredMime = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
      ].find(m => MediaRecorder.isTypeSupported(m)) ?? 'audio/webm'

      setMimeType(preferredMime)

      const recorder = new MediaRecorder(stream, { mimeType: preferredMime })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: preferredMime })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setAudioBlob(blob)
        stream.getTracks().forEach(t => t.stop())
        setState('stopped')
      }

      recorder.start(250) // collect chunks every 250ms
      setState('recording')
      setSeconds(0)

      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied'
      setPermissionError(
        msg.includes('denied') || msg.includes('Permission')
          ? 'Microphone access was denied. Please allow microphone access in your browser settings and try again.'
          : `Microphone error: ${msg}`
      )
      setState('idle')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
  }, [])

  const playPreview = useCallback(() => {
    if (!audioUrl) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    audio.play()
  }, [audioUrl])

  const downloadFile = useCallback(() => {
    if (!audioBlob || !audioUrl) return
    const ext = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'm4a' : 'webm'
    const filename = `corridorwork-vo-en-human.${ext}`
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = filename
    a.click()
  }, [audioBlob, audioUrl, mimeType])

  const uploadFile = useCallback(async () => {
    if (!audioBlob) return
    setState('uploading')
    setUploadStatus('idle')

    const ext = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'm4a' : 'webm'
    const filename = `corridorwork-vo-en-human.${ext}`

    const formData = new FormData()
    formData.append('file', audioBlob, filename)

    try {
      const res = await fetch('/api/admin/promo-video/voiceover-upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.saved) {
        setUploadStatus('success')
        setUploadMessage(data.message ?? 'File saved successfully.')
      } else if (data.localOnly) {
        setUploadStatus('local-only')
        setUploadMessage(data.message ?? 'Running on Vercel — filesystem not persistent. Download the file instead.')
      } else {
        setUploadStatus('error')
        setUploadMessage(data.error ?? 'Upload failed.')
      }
    } catch {
      setUploadStatus('error')
      setUploadMessage('Upload failed — network error. Please download the file instead.')
    }
    setState('stopped')
  }, [audioBlob, mimeType])

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setAudioBlob(null)
    setSeconds(0)
    setUploadStatus('idle')
    setUploadMessage('')
    setPermissionError('')
    setState('idle')
  }, [audioUrl])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-8">

      {/* ── RECORDER ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">

        {/* Status bar */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {state === 'recording' && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
            <span className="text-sm font-medium text-slate-300">
              {state === 'idle' && 'Ready to record'}
              {state === 'requesting' && 'Requesting microphone…'}
              {state === 'recording' && `Recording — ${formatTime(seconds)}`}
              {state === 'stopped' && `Recording complete — ${formatTime(seconds)}`}
              {state === 'uploading' && 'Uploading…'}
            </span>
          </div>
          <span className="text-xs text-slate-600 font-mono">{adminEmail}</span>
        </div>

        {/* Controls */}
        <div className="px-5 py-5 flex flex-wrap gap-3">
          {state === 'idle' && (
            <button
              onClick={startRecording}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              Start recording
            </button>
          )}

          {state === 'requesting' && (
            <span className="px-5 py-2.5 bg-slate-700 text-slate-400 text-sm rounded-lg">
              Allow microphone in browser…
            </span>
          )}

          {state === 'recording' && (
            <button
              onClick={stopRecording}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="w-3 h-3 rounded-sm bg-red-400" />
              Stop recording
            </button>
          )}

          {state === 'stopped' && (
            <>
              <button
                onClick={playPreview}
                className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                ▶ Play preview
              </button>
              <button
                onClick={downloadFile}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                ↓ Download voiceover file
              </button>
              <button
                onClick={uploadFile}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors border border-slate-600"
              >
                ↑ Upload to project
              </button>
              <button
                onClick={reset}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm rounded-lg transition-colors border border-slate-700"
              >
                Record again
              </button>
            </>
          )}

          {state === 'uploading' && (
            <span className="px-5 py-2.5 bg-slate-700 text-slate-300 text-sm rounded-lg">
              Uploading…
            </span>
          )}
        </div>

        {/* Permission error */}
        {permissionError && (
          <div className="mx-5 mb-5 px-4 py-3 bg-red-900/40 border border-red-700/50 rounded-lg text-red-300 text-sm">
            {permissionError}
          </div>
        )}

        {/* Upload status */}
        {uploadStatus !== 'idle' && (
          <div className={`mx-5 mb-5 px-4 py-3 rounded-lg text-sm border ${
            uploadStatus === 'success'
              ? 'bg-emerald-900/40 border-emerald-700/50 text-emerald-300'
              : uploadStatus === 'local-only'
              ? 'bg-amber-900/40 border-amber-700/50 text-amber-300'
              : 'bg-red-900/40 border-red-700/50 text-red-300'
          }`}>
            {uploadMessage}
          </div>
        )}

        {/* Download instruction */}
        {state === 'stopped' && (
          <div className="mx-5 mb-5 px-4 py-3 bg-slate-800/60 border border-slate-700/40 rounded-lg text-slate-400 text-xs leading-relaxed">
            <strong className="text-slate-300">After downloading:</strong>{' '}
            Send the file to Claude with the message{' '}
            <em>&quot;Voiceover-Datei ist vorhanden&quot;</em>, or place it manually at:{' '}
            <code className="text-indigo-400 bg-slate-900 px-1.5 py-0.5 rounded text-xs">
              public/promo-video/source-clips/audio/corridorwork-vo-en-human.webm
            </code>
            {' '}then run{' '}
            <code className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded text-xs">
              bash scripts/mix-human-voiceover.sh &lt;your-file&gt;
            </code>
          </div>
        )}
      </div>

      {/* ── RECORDING TIPS ───────────────────────────────────────────────── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3 text-sm">Recording tips</h3>
        <ul className="space-y-1.5 text-slate-400 text-sm">
          {[
            'Find a quiet room — close windows, turn off fans',
            'Speak slowly and clearly — pause between paragraphs',
            'Target 55–60 seconds total duration',
            'Hold microphone 15–20 cm from mouth (not directly in front)',
            'No background music — pure voice only',
            'Do a short 3-second test recording first',
            'Read through the script once silently before recording',
          ].map(tip => (
            <li key={tip} className="flex items-start gap-2">
              <span className="text-indigo-500 shrink-0 mt-0.5">·</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── VOICEOVER SCRIPT ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Voiceover script</h3>
          <span className="text-slate-500 text-xs font-mono">~55s · English</span>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Read this verbatim — pause between paragraphs
            </span>
            <span className="text-slate-600 text-xs">No job guarantee · No visa guarantee in script ✓</span>
          </div>
          <div className="px-6 py-6 space-y-5">
            {SCRIPT_LINES.map((line, i) => (
              <p
                key={i}
                className={`leading-relaxed font-medium ${
                  line.startsWith('CorridorWork.') || line.startsWith('Visit')
                    ? 'text-indigo-300 text-xl'
                    : line.includes('No job guarantee')
                    ? 'text-amber-300 text-base'
                    : 'text-white text-lg'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT HAPPENS NEXT ────────────────────────────────────────────── */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
        <h3 className="text-slate-400 font-semibold mb-3 text-sm">What happens after recording</h3>
        <ol className="space-y-2 text-slate-500 text-sm counter-reset-list">
          {[
            'Download the voiceover file (corridorwork-vo-en-human.webm)',
            'Run: bash scripts/mix-human-voiceover.sh <your-downloaded-file>',
            'The script normalizes audio and mixes it with the human footage video',
            'Output: public/promo-video/final/corridorwork-promo-human-en-final.mp4',
            'Commit the final MP4 + push — /promo-video will show it automatically',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-500 text-xs flex items-center justify-center shrink-0 mt-0.5 font-semibold">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

    </div>
  )
}
