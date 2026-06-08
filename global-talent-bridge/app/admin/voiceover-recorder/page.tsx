/**
 * app/admin/voiceover-recorder/page.tsx
 *
 * Admin-only browser-based voiceover recorder.
 * Requires admin login — redirects to /auth/login if not authenticated.
 *
 * Safety: no robot voice · no macOS say · no TTS · no Stripe · no email sending ·
 *         no scraping · no job guarantee · no visa guarantee
 */
import { redirect } from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { NavBar } from '@/app/_components/NavBar'
import { VoiceoverRecorderClient } from './VoiceoverRecorderClient'

export const metadata = {
  title: 'Voiceover Recorder — CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function VoiceoverRecorderPage() {
  const user = await getCurrentAdminUser()
  if (!user) {
    redirect('/auth/login?redirectTo=/admin/voiceover-recorder')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[0.65rem] px-2.5 py-1 bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 rounded-full font-bold uppercase tracking-widest">
              Admin
            </span>
            <span className="text-slate-600 text-sm">/admin/voiceover-recorder</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Voiceover Recorder</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Record your voiceover directly in the browser. No software needed.
            Read the script below slowly and clearly — the recorder captures your microphone.
          </p>
          <div className="mt-3 px-4 py-2.5 bg-amber-900/30 border border-amber-700/40 rounded-lg text-amber-300 text-xs leading-relaxed">
            <strong>No robot voice · No macOS say · No TTS.</strong>{' '}
            Your real human voice is the only acceptable input for the final video.
          </div>
        </div>

        <VoiceoverRecorderClient adminEmail={user.email} />

      </div>
    </div>
  )
}
