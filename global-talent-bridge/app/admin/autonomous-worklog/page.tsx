/**
 * app/admin/autonomous-worklog/page.tsx
 *
 * Autonomous Worklog — Systemstatus, Pilot-Schritte, Tagesbericht
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { getSystemChecks, getSystemIssues, getPilotSteps, generateDailyReport, getSystemStatusSummary } from '@/lib/cwo-agent'

export const dynamic = 'force-dynamic'

export default async function AutonomousWorklogPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/autonomous-worklog')

  const checks       = getSystemChecks()
  const issues       = getSystemIssues()
  const pilotSteps   = getPilotSteps()
  const report       = generateDailyReport()
  const statusSummary = getSystemStatusSummary()

  const healthColor = report.systemHealth === 'green' ? 'text-green-600' : report.systemHealth === 'yellow' ? 'text-yellow-600' : 'text-red-600'
  const healthBg    = report.systemHealth === 'green' ? 'bg-green-50 border-green-200' : report.systemHealth === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
  const healthLabel = report.systemHealth === 'green' ? '✅ System OK' : report.systemHealth === 'yellow' ? '⚠️ Hinweise vorhanden' : '🔴 Prüfung erforderlich'

  const stepStatusColor = (status: string) =>
    status === 'done' ? 'bg-green-100 text-green-700 border-green-200' :
    status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
    status === 'blocked' ? 'bg-red-100 text-red-700 border-red-200' :
    'bg-gray-100 text-gray-600 border-gray-200'

  const stepDotColor = (status: string) =>
    status === 'done' ? 'bg-green-400' :
    status === 'in_progress' ? 'bg-blue-400' :
    status === 'blocked' ? 'bg-red-400' :
    'bg-gray-300'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Autonomous Worklog</h1>
          <p className="text-gray-500 mt-1">Systemstatus · Pilot-Schritte · Tagesbericht</p>
          <p className="text-xs text-gray-400 mt-1">Generiert: {new Date(report.generatedAt).toLocaleString('de-DE')}</p>
        </div>
        <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${healthColor} ${healthBg}`}>
          {healthLabel}
        </div>
      </div>

      {/* Safety Invariants */}
      <div className="bg-slate-900 text-white rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Sicherheits-Invarianten (unveränderlich)</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: 'EMAIL_PROVIDER',    value: report.safetyInvariants.emailProvider },
            { label: 'OUTREACH_PROVIDER', value: report.safetyInvariants.outreachProvider },
            { label: 'noEmailSent',       value: String(report.safetyInvariants.noEmailSent) },
            { label: 'noAutoOutreach',    value: String(report.safetyInvariants.noAutoOutreach) },
            { label: 'noScraping',        value: String(report.safetyInvariants.noScraping) },
            { label: 'Phase',             value: String(report.safetyInvariants.phase) },
          ].map(inv => (
            <div key={inv.label} className="text-xs">
              <span className="text-slate-400">{inv.label}: </span>
              <span className="text-green-400 font-mono">{inv.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{statusSummary.total}</div>
          <div className="text-xs text-gray-500">Checks total</div>
        </div>
        <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statusSummary.ok}</div>
          <div className="text-xs text-green-700">OK</div>
        </div>
        <div className="bg-white border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{statusSummary.warning}</div>
          <div className="text-xs text-yellow-700">Warnungen</div>
        </div>
        <div className="bg-white border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statusSummary.blocked}</div>
          <div className="text-xs text-red-700">Blockiert</div>
        </div>
      </div>

      {/* System Checks */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">🔍 System-Checks</h2>
          <span className={`text-sm font-semibold ${healthColor}`}>{healthLabel}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {checks.map(check => (
            <div key={check.id} className="px-6 py-3 flex items-start gap-3">
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                check.status === 'ok'      ? 'bg-green-400' :
                check.status === 'warning' ? 'bg-yellow-400' :
                check.status === 'blocked' ? 'bg-red-400' : 'bg-gray-300'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{check.label}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded">{check.category}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{check.description}</div>
                {check.actionNeeded && (
                  <div className="text-xs text-amber-700 mt-0.5">→ {check.actionNeeded}</div>
                )}
              </div>
              <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium ${
                check.status === 'ok' ? 'text-green-700 bg-green-100' :
                check.status === 'warning' ? 'text-yellow-700 bg-yellow-100' :
                'text-red-700 bg-red-100'
              }`}>{check.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Report */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">📋 Tagesbericht</h2>

        {/* Next Action */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-blue-700 uppercase mb-1">🎯 Nächste Aktion</div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-blue-900">{report.nextBestAction}</div>
            <a href={report.nextBestActionHref} className="flex-shrink-0 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
              Zum Bereich →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Completed */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">✅ Heute abgeschlossen</div>
            <ul className="space-y-1">
              {report.completedToday.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Open Items */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">⏳ Offene Punkte</div>
            {report.openItems.length === 0 ? (
              <p className="text-sm text-green-700">Keine offenen Punkte!</p>
            ) : (
              <ul className="space-y-1">
                {report.openItems.map((item, idx) => (
                  <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-500 flex-shrink-0 mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Pilot Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🚀 Pilot-Fahrplan</h2>
        <div className="space-y-3">
          {pilotSteps.map((step, idx) => (
            <div key={step.id} className={`border rounded-lg p-4 ${stepStatusColor(step.status)}`}>
              <div className="flex items-start gap-3">
                {/* Status Dot + Number */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full mt-1 ${stepDotColor(step.status)}`} />
                  {idx < pilotSteps.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{step.step}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${stepStatusColor(step.status)}`}>
                      {step.status === 'done' ? '✅ done' :
                       step.status === 'in_progress' ? '🔄 in progress' :
                       step.status === 'blocked' ? '🚫 blocked' : '⏳ geplant'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      step.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{step.priority}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">{step.description}</div>
                  {step.blockedReason && (
                    <div className="text-xs text-red-700 mt-1">🚫 {step.blockedReason}</div>
                  )}
                  {step.complianceNote && (
                    <div className="text-xs text-amber-700 mt-1">⚖️ {step.complianceNote}</div>
                  )}
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-xs text-gray-500">~{step.estimatedDays}d</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
