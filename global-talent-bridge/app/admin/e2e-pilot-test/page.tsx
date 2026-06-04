import { redirect } from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { NavBar } from '@/app/_components/NavBar'
import { E2ETestRunner } from './_components/E2ETestRunner'

export default async function E2EPilotTestPage() {
  try {
    await getCurrentAdminUser()
  } catch {
    redirect('/auth/login')
  }

  const steps = [
    { id: 'auth',           icon: '🔐', label: 'Admin-Authentifizierung' },
    { id: 'storage_bucket', icon: '🪣', label: 'Storage-Bucket "candidate-cvs"' },
    { id: 'cv_columns',     icon: '📋', label: 'CV-Spalten in candidates-Tabelle' },
    { id: 'jobs_available', icon: '💼', label: 'Aktive Jobs vorhanden' },
    { id: 'candidates',     icon: '👤', label: 'Kandidaten mit Profil vorhanden' },
    { id: 'app_create',     icon: '📩', label: 'Testbewerbung anlegen (status: pending)' },
    { id: 'pending',        icon: '⏳', label: 'Pending-Status korrekt' },
    { id: 'duplicate',      icon: '🚫', label: 'Doppelte Bewerbung verhindert (UNIQUE)' },
    { id: 'release',        icon: '✅', label: 'Admin-Freigabe → employer_notified' },
    { id: 'employer_view',  icon: '🏢', label: 'Arbeitgeber sieht freigegebene Bewerbung' },
    { id: 'cv_api',         icon: '📤', label: 'CV-Upload-API + RLS-Policies vorhanden' },
    { id: 'cleanup',        icon: '🧹', label: 'Testdaten vollständig bereinigt' },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🧪</span>
            <h1 className="text-2xl font-bold text-white">Pilot-Flow E2E-Test</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Automatische Validierung des kompletten Pilot-Flows — keine manuellen Klicks nötig.
            Alle Testdaten werden nach dem Test wieder gelöscht.
          </p>
        </div>

        {/* Was wird getestet */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-base font-semibold text-white mb-4">Was wird geprüft?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-base">{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sicherheitshinweis */}
        <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-lg shrink-0">🔒</span>
            <div className="space-y-1 text-xs text-blue-300/80">
              <p><strong>Kein Datenverlust:</strong> Testdaten (nur Bewerbungen) werden am Ende automatisch gelöscht.</p>
              <p><strong>Keine E-Mails:</strong> Der Test sendet keine echten E-Mails oder WhatsApp-Nachrichten.</p>
              <p><strong>Admin-only:</strong> Diese Seite ist nur für Admins zugänglich.</p>
              <p><strong>Protokolliert:</strong> Jeder Testlauf wird in system_logs festgehalten.</p>
            </div>
          </div>
        </div>

        {/* Was noch manuell getestet werden muss */}
        <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-4">
          <h3 className="text-yellow-300 text-sm font-semibold mb-2">⬜ Manuell zu testen (nicht automatisierbar)</h3>
          <ul className="text-xs text-yellow-300/70 space-y-1.5 list-inside">
            <li>📧 <strong>Passwort-Reset:</strong> Test-Account erstellen → /auth/forgot-password → E-Mail empfangen → Link klicken → Passwort ändern</li>
            <li>📤 <strong>CV-Upload:</strong> Als Kandidat einloggen → /candidate/dashboard → PDF hochladen → Badge &quot;✓ Vorhanden&quot; erscheint</li>
            <li>🏢 <strong>Arbeitgeber-Login:</strong> Als Arbeitgeber einloggen → /employer/applications → freigegebene Kandidaten sichtbar</li>
          </ul>
          <p className="text-xs text-yellow-400/50 mt-3">
            Diese Schritte erfordern einen echten Browser und echten E-Mail-Empfang (für Passwort-Reset).
            Alle anderen Schritte sind oben automatisch geprüft.
          </p>
        </div>

        {/* Test Runner */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-base font-semibold text-white mb-6">Test ausführen</h2>
          <E2ETestRunner />
        </div>

      </div>
    </div>
  )
}
