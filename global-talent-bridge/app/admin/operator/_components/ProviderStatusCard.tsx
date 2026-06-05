/**
 * ProviderStatusCard — Server Component
 *
 * Zeigt den vollständigen E-Mail-Provider-Status:
 * - Provider-Typ (none / resend / smtp)
 * - Konfiguriert? Absender? Test-Modus? Echter Versand möglich?
 * - Fehlende ENV-Variablen (Namen, keine Werte)
 * - Safety-Hinweise
 * - Test-E-Mail-Button (wenn Provider ready)
 */
import { type DetailedProviderStatus } from '@/lib/email-provider-status'
import { TestEmailButton } from './TestEmailButton'

interface ProviderStatusCardProps {
  status: DetailedProviderStatus
}

const READINESS_STYLES = {
  blocked: {
    wrapper: 'bg-red-900/10 border-red-800/30',
    badge:   'bg-red-900/30 text-red-300 border-red-800/50',
    heading: 'text-red-300',
    icon:    '🔴',
    label:   'BLOCKIERT',
  },
  warning: {
    wrapper: 'bg-yellow-900/10 border-yellow-800/30',
    badge:   'bg-yellow-900/30 text-yellow-300 border-yellow-800/50',
    heading: 'text-yellow-300',
    icon:    '🟡',
    label:   'TEILWEISE',
  },
  ready: {
    wrapper: 'bg-green-900/10 border-green-800/30',
    badge:   'bg-green-900/30 text-green-300 border-green-800/50',
    heading: 'text-green-300',
    icon:    '🟢',
    label:   'BEREIT',
  },
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={ok ? 'text-green-400' : 'text-red-400'}>{ok ? '✓' : '✗'}</span>
      <span className={ok ? 'text-gray-300' : 'text-gray-400'}>{label}</span>
    </div>
  )
}

export function ProviderStatusCard({ status }: ProviderStatusCardProps) {
  const style = READINESS_STYLES[status.readinessStatus]

  return (
    <section className={`border rounded-2xl p-5 ${style.wrapper}`}>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">{style.icon}</span>
          <h2 className={`text-base font-semibold ${style.heading}`}>
            E-Mail-Provider Status
          </h2>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${style.badge}`}>
          {style.label}
        </span>
      </div>

      {/* Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6 mb-4">
        <Check ok={status.provider !== 'none'} label={`Provider: ${status.provider}`} />
        <Check ok={status.configured}          label="Konfiguriert" />
        <Check ok={status.fromEmailConfigured} label="Absender-E-Mail vorhanden" />
        <Check ok={!status.testMode}           label={status.testMode ? 'Test-Modus aktiv ⚠️' : 'Test-Modus inaktiv'} />
        <Check ok={status.canSend}             label="Echter Versand möglich" />
      </div>

      {/* Missing config */}
      {status.missingConfig.length > 0 && (
        <div className="mb-4 space-y-1">
          <p className="text-xs text-gray-400 font-medium mb-1">Was fehlt noch:</p>
          {status.missingConfig.map((key) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="text-red-400">•</span>
              <code className="text-yellow-300/80 bg-yellow-900/20 px-1 rounded">{key}</code>
              {key === 'OUTREACH_EMAIL_PROVIDER' && (
                <span className="text-gray-500">→ auf &quot;resend&quot; oder &quot;smtp&quot; setzen</span>
              )}
              {key === 'OUTREACH_FROM_EMAIL' && (
                <span className="text-gray-500">→ z.B. team@globaltalentbridge.de</span>
              )}
              {key === 'RESEND_API_KEY' && (
                <span className="text-gray-500">→ aus resend.com Dashboard</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* .env hint when blocked */}
      {status.readinessStatus === 'blocked' && (
        <div className="mb-4 p-3 bg-gray-900/50 border border-gray-700/50 rounded-xl">
          <p className="text-xs text-gray-400 font-medium mb-1">
            Minimale .env-Konfiguration für Resend:
          </p>
          <div className="font-mono text-xs text-gray-500 space-y-0.5">
            <p>OUTREACH_EMAIL_PROVIDER=resend</p>
            <p>OUTREACH_FROM_EMAIL=team@globaltalentbridge.de</p>
            <p>RESEND_API_KEY=re_xxxxxxxxxxxxxxxx</p>
          </div>
        </div>
      )}

      {/* Safety notes */}
      <div className="mb-3 space-y-0.5">
        {status.safetyNotes.map((note, i) => (
          <p key={i} className="text-xs text-gray-600">{note}</p>
        ))}
      </div>

      {/* Test email button — nur wenn Provider ready */}
      {status.canSend && <TestEmailButton />}
    </section>
  )
}
