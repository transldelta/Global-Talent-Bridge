'use client'

import { useState } from 'react'
import type { TestStep, TestStepStatus } from '@/app/api/admin/e2e-pilot-test/run/route'

type RunResult = {
  steps: TestStep[]
  overall: TestStepStatus
  completed_at: string
  summary: { pass: number; warn: number; fail: number; skip: number }
}

function StepIcon({ status }: { status: TestStepStatus }) {
  if (status === 'pass') return <span className="text-green-400 text-base">✅</span>
  if (status === 'warn') return <span className="text-yellow-400 text-base">⚠️</span>
  if (status === 'fail') return <span className="text-red-400 text-base">❌</span>
  return <span className="text-gray-500 text-base">⏭️</span>
}

function StepRow({ step, index }: { step: TestStep; index: number }) {
  const borderColor =
    step.status === 'pass' ? 'border-green-800/50 bg-green-900/10' :
    step.status === 'warn' ? 'border-yellow-700/50 bg-yellow-900/10' :
    step.status === 'fail' ? 'border-red-800/50 bg-red-900/10' :
    'border-gray-700/50 bg-gray-900/30'

  const textColor =
    step.status === 'pass' ? 'text-green-300' :
    step.status === 'warn' ? 'text-yellow-300' :
    step.status === 'fail' ? 'text-red-300' :
    'text-gray-500'

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${borderColor}`}>
      <div className="flex items-center gap-2 w-6 shrink-0 mt-0.5">
        <StepIcon status={step.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-semibold ${textColor}`}>
            {index + 1}. {step.name}
          </p>
          {step.duration_ms > 0 && (
            <span className="text-xs text-gray-600 shrink-0">{step.duration_ms}ms</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.detail}</p>
      </div>
    </div>
  )
}

export function E2ETestRunner() {
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle')
  const [result, setResult] = useState<RunResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runTest() {
    setState('running')
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/admin/e2e-pilot-test/run', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`)
        setState('idle')
        return
      }

      setResult(data)
      setState('done')
    } catch (e) {
      setError(`Netzwerkfehler: ${e}`)
      setState('idle')
    }
  }

  const overallBg =
    result?.overall === 'pass' ? 'bg-green-900/20 border-green-700/50 text-green-300' :
    result?.overall === 'warn' ? 'bg-yellow-900/20 border-yellow-700/50 text-yellow-300' :
    result?.overall === 'fail' ? 'bg-red-900/20 border-red-700/50 text-red-300' :
    ''

  const overallLabel =
    result?.overall === 'pass' ? '✅ Alle Tests bestanden — Pilot-Flow bereit' :
    result?.overall === 'warn' ? '⚠️ Tests bestanden mit Warnungen — prüfen' :
    result?.overall === 'fail' ? '❌ Tests fehlgeschlagen — Blocker beheben' :
    ''

  return (
    <div className="space-y-6">
      {/* Run button */}
      <div className="flex items-center gap-4">
        <button
          onClick={runTest}
          disabled={state === 'running'}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
            state === 'running'
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-600 text-white'
          }`}
        >
          {state === 'running' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Test läuft…
            </span>
          ) : (
            '▶ E2E-Test ausführen'
          )}
        </button>

        {result && (
          <button
            onClick={runTest}
            disabled={state === 'running'}
            className="px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-colors"
          >
            ↻ Erneut ausführen
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
          <p className="text-red-300 text-sm">❌ Fehler: {error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Overall badge */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${overallBg}`}>
            <span className="font-semibold text-sm">{overallLabel}</span>
            <div className="flex gap-3 text-xs">
              {result.summary.pass > 0 && (
                <span className="text-green-400">✅ {result.summary.pass} bestanden</span>
              )}
              {result.summary.warn > 0 && (
                <span className="text-yellow-400">⚠️ {result.summary.warn} Warnungen</span>
              )}
              {result.summary.fail > 0 && (
                <span className="text-red-400">❌ {result.summary.fail} Fehler</span>
              )}
              {result.summary.skip > 0 && (
                <span className="text-gray-500">⏭️ {result.summary.skip} übersprungen</span>
              )}
            </div>
          </div>

          {/* Step list */}
          <div className="space-y-2">
            {result.steps.map((step, i) => (
              <StepRow key={step.id} step={step} index={i} />
            ))}
          </div>

          <p className="text-xs text-gray-600 text-right">
            Abgeschlossen: {new Date(result.completed_at).toLocaleString('de-DE')}
          </p>
        </div>
      )}
    </div>
  )
}
