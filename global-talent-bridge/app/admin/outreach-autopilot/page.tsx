/**
 * /admin/outreach-autopilot
 *
 * Outreach Autopilot — Compliance First.
 * Agenten-gestütztes Outreach-Vorbereitung ohne automatischen Versand.
 *
 * Admin-only. Kein Send-Button. EMAIL_PROVIDER=none. OUTREACH_EMAIL_PROVIDER=none.
 */
import { getCurrentAdminUser } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { NavBar } from '@/app/_components/NavBar'
import { OutreachAutopilotForm } from './_components/OutreachAutopilotForm'

export const metadata = {
  title: 'Outreach Autopilot | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function OutreachAutopilotPage() {
  // ── Admin Guard ───────────────────────────────────────────────────────────
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/outreach-autopilot')

  // ── Safety Check (Server-seitig) ──────────────────────────────────────────
  const emailProviderSafe =
    (process.env.EMAIL_PROVIDER          ?? 'none') === 'none' &&
    (process.env.OUTREACH_EMAIL_PROVIDER  ?? 'none') === 'none'

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">🤖 Outreach Autopilot</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-300 font-medium">
              Compliance First
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 font-medium">
              Phase 1 — Kein Versand
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Interne Agenten-Abteilung: Research → Fit-Score → Compliance → Personalisierung → Freigabe.
            <strong className="text-white"> Kein automatischer Versand.</strong>
          </p>
        </div>

        {/* E-Mail-Provider Status */}
        {emailProviderSafe ? (
          <div className="mb-6 bg-green-900/20 border border-green-800 rounded-lg px-4 py-3 text-sm text-green-300 flex items-center gap-2">
            <span>✅</span>
            <span>
              <strong>Sicher:</strong> EMAIL_PROVIDER=none · OUTREACH_EMAIL_PROVIDER=none ·
              Kein automatischer E-Mail-Versand möglich.
            </span>
          </div>
        ) : (
          <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>
              <strong>Warnung:</strong> E-Mail-Provider ist aktiv. Vor dem Outreach prüfen!
            </span>
          </div>
        )}

        {/* Agenten-Übersicht */}
        <details className="mb-6 bg-gray-800 rounded-lg">
          <summary className="px-4 py-3 cursor-pointer text-sm text-gray-400 hover:text-white">
            🏗️ Wie funktionieren die Agenten?
          </summary>
          <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                icon: '🔬',
                name: 'Research Agent',
                desc: 'Strukturiert deine manuellen Eingaben. Kein Scraping, kein Crawling.',
              },
              {
                icon: '🎯',
                name: 'Fit Scoring Agent',
                desc: 'Score 0–100. Unter 70 → kein Outreach vorgeschlagen. Kriterien: Sektor, Einstellungsbedarf, digitale Präsenz.',
              },
              {
                icon: '🛡️',
                name: 'Compliance Agent',
                desc: 'Prüft Spam-Risiken, Signatur, Pilot-Charakter, verbotene Ausdrücke. Ergebnis: safe / needs_review / blocked.',
              },
              {
                icon: '✍️',
                name: 'Personalization Agent',
                desc: 'Kurze, menschliche Nachricht. Immer: kostenlos, unverbindlich, kein Abo, CorridorWork Team Signatur.',
              },
              {
                icon: '👤',
                name: 'Human Approval Agent',
                desc: 'Alles landet in Approval-Queue. Du musst explizit freigeben. Ohne Freigabe passiert nichts.',
              },
              {
                icon: '📦',
                name: 'Delivery Agent',
                desc: 'Phase 2 — noch nicht aktiviert. Architektur vorhanden. Versand nur nach Erfüllung aller 9 Bedingungen.',
              },
            ].map(agent => (
              <div key={agent.name} className="bg-gray-900 rounded p-3">
                <div className="text-white font-medium mb-1">{agent.icon} {agent.name}</div>
                <div className="text-gray-400">{agent.desc}</div>
              </div>
            ))}
          </div>
        </details>

        {/* Hauptformular */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <OutreachAutopilotForm />
        </div>
      </div>
    </div>
  )
}
