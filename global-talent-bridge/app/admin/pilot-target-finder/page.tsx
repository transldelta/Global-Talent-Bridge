/**
 * /admin/pilot-target-finder
 *
 * Pilot Target Finder — Suchvorschläge für passende Pilot-Arbeitgeber.
 * KEIN Scraping. KEIN automatisches Crawling. Nur Suchstring-Vorschläge.
 * Admin-only.
 */
import { getCurrentAdminUser } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { NavBar } from '@/app/_components/NavBar'
import { TargetFinderForm } from './_components/TargetFinderForm'

export const metadata = {
  title: 'Pilot Target Finder | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function PilotTargetFinderPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/pilot-target-finder')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">🎯 Pilot Target Finder</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900 text-blue-300 font-medium">
              Kein Scraping
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl">
            Erhalte sichere Suchvorschläge für passende Pilot-Arbeitgeber.
            Das System generiert nur Suchanfragen — du recherchierst selbst in Google
            und trägst die Firma dann manuell im Outreach Autopilot ein.
          </p>
        </div>

        {/* Wie es funktioniert */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: '🔍', title: 'Stadt + Branche eingeben', desc: 'z.B. Karlsruhe + Pflege' },
            { step: '2', icon: '📋', title: 'Suchvorschläge erhalten', desc: '8 Google-Suchanfragen generiert' },
            { step: '3', icon: '🤖', title: 'Firma im Autopilot prüfen', desc: 'Manuell eintragen → Analyse starten' },
          ].map(item => (
            <div key={item.step} className="bg-gray-800 rounded-lg p-4 flex gap-3">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Schritt {item.step}</div>
                <div className="text-sm text-white font-medium">{item.title}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Formular */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <TargetFinderForm />
        </div>

        {/* Weitere Hinweise */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4 text-xs text-gray-400 space-y-2">
          <div className="text-gray-300 font-medium text-sm">Was dieser Finder NICHT macht</div>
          <ul className="space-y-1">
            <li>❌ Kein automatischer Zugriff auf externe Webseiten</li>
            <li>❌ Kein Scraping von Firmenverzeichnissen</li>
            <li>❌ Keine automatische Kontaktsuche</li>
            <li>❌ Keine Anfragen an Google-API oder ähnliche Dienste</li>
            <li>❌ Kein Datenkauf, keine Lead-Listen</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
