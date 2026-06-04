// PilotChecklist — Server Component (wird mit Page-Daten gerendert)
// Auto-detektierte Items: aus env vars + DB-Counts
// Manuelle Items: mit "Manuell prüfen"-Hinweis

type CheckItem = {
  label: string
  status: 'ok' | 'error' | 'warn' | 'manual'
  detail: string
}

type Props = {
  // Auto-detektiert (aus env + DB)
  baseUrlSet: boolean
  testModeOff: boolean
  emailProviderSet: boolean
  employerCount: number
  candidateCount: number
  // Qualitäts-Kandidaten (Score >= 70)
  qualityCandidateCount: number
}

function StatusIcon({ status }: { status: CheckItem['status'] }) {
  if (status === 'ok')     return <span className="text-green-600 font-bold text-base">✅</span>
  if (status === 'error')  return <span className="text-red-600 font-bold text-base">❌</span>
  if (status === 'warn')   return <span className="text-yellow-600 font-bold text-base">⚠️</span>
  return <span className="text-gray-400 text-base">⬜</span>
}

function CheckRow({ item }: { item: CheckItem }) {
  const borderColor =
    item.status === 'ok'     ? 'border-green-200 bg-green-50' :
    item.status === 'error'  ? 'border-red-200 bg-red-50' :
    item.status === 'warn'   ? 'border-yellow-200 bg-yellow-50' :
    'border-gray-200 bg-gray-50'

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${borderColor}`}>
      <StatusIcon status={item.status} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${
          item.status === 'ok'    ? 'text-green-800' :
          item.status === 'error' ? 'text-red-800' :
          item.status === 'warn'  ? 'text-yellow-800' :
          'text-gray-700'
        }`}>{item.label}</p>
        <p className={`text-xs mt-0.5 ${
          item.status === 'ok'    ? 'text-green-600' :
          item.status === 'error' ? 'text-red-600' :
          item.status === 'warn'  ? 'text-yellow-600' :
          'text-gray-500'
        }`}>{item.detail}</p>
      </div>
      {item.status === 'manual' && (
        <span className="text-xs text-gray-400 shrink-0 self-center">Manuell prüfen</span>
      )}
    </div>
  )
}

export function PilotChecklist({
  baseUrlSet,
  testModeOff,
  emailProviderSet,
  employerCount,
  candidateCount,
  qualityCandidateCount,
}: Props) {
  const checks: CheckItem[] = [
    // ── Auto-detektiert ─────────────────────────────────────────────────────
    {
      label: 'NEXT_PUBLIC_BASE_URL gesetzt',
      status: baseUrlSet ? 'ok' : 'error',
      detail: baseUrlSet
        ? 'Passwort-Reset-Links funktionieren korrekt.'
        : 'Fehlt! Passwort-Reset-E-Mails zeigen auf localhost:3000. In Vercel setzen.',
    },
    {
      label: 'Test-Modus deaktiviert',
      status: testModeOff ? 'ok' : 'error',
      detail: testModeOff
        ? 'ENABLE_TEST_AUTO_APPLICATION_MESSAGE=false — Produktionsmodus aktiv.'
        : 'ENABLE_TEST_AUTO_APPLICATION_MESSAGE=true — automatische Testnachrichten aktiv! In Vercel auf false setzen.',
    },
    {
      label: 'E-Mail-Provider konfiguriert',
      status: emailProviderSet ? 'ok' : 'warn',
      detail: emailProviderSet
        ? 'E-Mail-Versand aktiv — Nutzer erhalten Benachrichtigungen.'
        : 'EMAIL_PROVIDER=none — keine E-Mails werden gesendet. Für Pilot akzeptabel, Admin informiert manuell.',
    },
    {
      label: `Pilot-Arbeitgeber angelegt (Ziel: ≥ 2)`,
      status: employerCount >= 2 ? 'ok' : employerCount > 0 ? 'warn' : 'error',
      detail: employerCount >= 2
        ? `${employerCount} Pilot-Arbeitgeber in Datenbank. ✓`
        : employerCount > 0
        ? `${employerCount} Arbeitgeber — mind. 2 empfohlen.`
        : 'Keine Pilot-Arbeitgeber vorhanden. "Pilotdaten vorbereiten" nutzen.',
    },
    {
      label: `Pilot-Kandidaten angelegt (Ziel: ≥ 10, Score ≥ 70: ≥ 5)`,
      status: candidateCount >= 10 && qualityCandidateCount >= 5
        ? 'ok'
        : candidateCount > 0
        ? 'warn'
        : 'error',
      detail: candidateCount > 0
        ? `${candidateCount} Kandidaten gesamt, ${qualityCandidateCount} mit Score ≥ 70 (Demo-bereit).`
        : 'Keine Pilot-Kandidaten vorhanden. "Pilotdaten vorbereiten" nutzen.',
    },
    // ── Manuelle Checks ──────────────────────────────────────────────────────
    {
      label: 'Passwort-Reset end-to-end getestet',
      status: 'manual',
      detail: 'Test: /auth/forgot-password → E-Mail erhalten → Link klicken → neues Passwort setzen → Login.',
    },
    {
      label: 'CV-Upload end-to-end getestet',
      status: 'manual',
      detail: 'Test: Kandidat-Login → /candidate/dashboard → PDF hochladen → Admin sieht Download-Link.',
    },
    {
      label: 'Admin-Bewerbungsfreigabe getestet',
      status: 'manual',
      detail: 'Test: Kandidat bewirbt sich → Admin /admin/applications → Freigabe → Arbeitgeber sieht Kandidat.',
    },
    {
      label: 'Supabase Auth URL konfiguriert',
      status: 'manual',
      detail: 'Supabase Dashboard → Auth → URL Configuration → Site URL und Redirect URLs auf Production-Domain setzen.',
    },
    {
      label: 'Impressum/AGB/Datenschutz final',
      status: 'ok', // wurde in Sprint I behoben
      detail: 'MVP-Entwurf-Marker wurden entfernt. Bitte noch: Firmennamen/Adresse im Impressum vor Launch verifizieren.',
    },
  ]

  const okCount = checks.filter(c => c.status === 'ok').length
  const errorCount = checks.filter(c => c.status === 'error').length
  const warnCount = checks.filter(c => c.status === 'warn').length
  const manualCount = checks.filter(c => c.status === 'manual').length

  const readyForPilot = errorCount === 0

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">📋 Pilot-Start-Checkliste</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {okCount} OK · {errorCount > 0 ? `${errorCount} Fehler · ` : ''}{warnCount > 0 ? `${warnCount} Warnungen · ` : ''}{manualCount} manuell prüfen
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
          readyForPilot
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {readyForPilot ? '✅ Pilotstart möglich' : `❌ ${errorCount} Blocker offen`}
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((item, i) => <CheckRow key={i} item={item} />)}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        ⬜ = manuelle Prüfung erforderlich · Vollständige Anleitung:{' '}
        <code className="bg-gray-100 px-1 rounded">docs/PILOT_START_CHECKLIST.md</code>
      </p>
    </section>
  )
}
