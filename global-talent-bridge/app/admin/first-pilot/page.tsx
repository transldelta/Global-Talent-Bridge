/**
 * /admin/first-pilot
 *
 * First Pilot Assistant — Schritt-für-Schritt Vorbereitung des ersten
 * Pilotarbeitgebers. Admin-only. Kein automatischer Versand.
 */
import { getCurrentAdminUser } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { NavBar } from '@/app/_components/NavBar'
import { FirstPilotAssistant } from './_components/FirstPilotAssistant'

export const metadata = {
  title: 'First Pilot | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function FirstPilotPage() {
  // ── Admin Guard ──────────────────────────────────────────────────────────
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/first-pilot')

  // ── E-Mail-Provider Status (serverseitig prüfen) ──────────────────────
  const emailProviderSafe =
    (process.env.EMAIL_PROVIDER          ?? 'none') === 'none' &&
    (process.env.OUTREACH_EMAIL_PROVIDER  ?? 'none') === 'none'

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <FirstPilotAssistant emailProviderSafe={emailProviderSafe} />
      </div>
    </div>
  )
}
