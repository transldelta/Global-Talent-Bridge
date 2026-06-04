import { getCurrentAdminUser } from '@/lib/admin'
import { redirect } from 'next/navigation'

// Test inventory — source of truth for coverage reporting
const SCORING_TESTS = [
  { file: '__tests__/scoring.migration-intelligence.test.ts',  lib: 'lib/scoring/migration-intelligence.ts',   tests: 13, status: 'passing' as const },
  { file: '__tests__/scoring.corridor-intelligence.test.ts',   lib: 'lib/scoring/corridor-intelligence.ts',    tests: 11, status: 'passing' as const },
  { file: '__tests__/scoring.candidate-acquisition.test.ts',   lib: 'lib/scoring/candidate-acquisition.ts',    tests: 11, status: 'passing' as const },
  { file: '__tests__/scoring.global-market.test.ts',           lib: 'lib/scoring/global-market.ts',            tests: 11, status: 'passing' as const },
  { file: '__tests__/scoring.revenue-forecast.test.ts',        lib: 'lib/revenue/forecast.ts',                 tests: 19, status: 'passing' as const },
]

const UNTESTED_AREAS = [
  { area: 'Agent Orchestrator',          reason: 'Requires Supabase + server-only — integration test needed',  priority: 'high' as const },
  { area: 'Migration Intelligence Agent', reason: 'DB + RLS dependency',                                        priority: 'high' as const },
  { area: 'Revenue Intelligence Agent',   reason: 'DB + RLS dependency',                                        priority: 'medium' as const },
  { area: 'LandingPage Factory Agent',    reason: 'DB + RLS dependency',                                        priority: 'medium' as const },
  { area: 'API Routes (all 24)',          reason: 'E2E/integration tests — require running Next.js server',      priority: 'medium' as const },
  { area: 'Admin Pages (all 16)',         reason: 'UI tests (Playwright/Cypress) — not yet configured',          priority: 'low' as const },
  { area: 'Auth Flow (Admin Guard)',      reason: 'Requires env vars + session mocking',                          priority: 'high' as const },
]

const STATUS_COLOR: Record<string, string> = {
  passing: 'bg-green-100 text-green-800',
  failing: 'bg-red-100 text-red-800',
  skipped: 'bg-yellow-100 text-yellow-800',
}

const PRIORITY_COLOR: Record<string, string> = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low:    'bg-gray-100 text-gray-600',
}

export default async function TestingCenterPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/admin/login')

  const totalTests   = SCORING_TESTS.reduce((s, t) => s + t.tests, 0)
  const passingTests = SCORING_TESTS.filter(t => t.status === 'passing').reduce((s, t) => s + t.tests, 0)
  const coveragePct  = Math.round((passingTests / totalTests) * 100)

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🧪 Test Coverage Center</h1>
        <p className="text-gray-500 mt-1 text-sm">Sprint F — Enterprise Readiness · Unit tests für alle reinen Scoring- und Forecast-Funktionen</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{totalTests}</p>
          <p className="text-xs text-gray-500 mt-1">Tests gesamt</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{passingTests}</p>
          <p className="text-xs text-gray-500 mt-1">Passing</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-gray-800">{SCORING_TESTS.length}</p>
          <p className="text-xs text-gray-500 mt-1">Test-Dateien</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className={`text-3xl font-bold ${coveragePct >= 80 ? 'text-green-600' : coveragePct >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{coveragePct}%</p>
          <p className="text-xs text-gray-500 mt-1">Scoring-Coverage</p>
        </div>
      </div>

      {/* Test files */}
      <section className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">✅ Unit Tests — Scoring & Forecast</h2>
          <p className="text-xs text-gray-500 mt-0.5">Framework: Vitest · Alias-Resolution: vite-tsconfig-paths · Environment: node</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Testdatei</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Getestete Lib</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SCORING_TESTS.map(t => (
              <tr key={t.file} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-mono text-xs text-blue-700">{t.file}</td>
                <td className="px-6 py-3 font-mono text-xs text-gray-600">{t.lib}</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-800">{t.tests}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[t.status]}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* How to run */}
      <section className="bg-gray-900 rounded-xl p-6 text-sm">
        <h2 className="font-semibold text-white mb-3">▶ Tests lokal ausführen</h2>
        <div className="space-y-2 font-mono text-green-300 text-xs">
          <p><span className="text-gray-500"># Einmalig ausführen:</span></p>
          <p>npm run test</p>
          <p className="mt-2"><span className="text-gray-500"># Watch-Modus (Entwicklung):</span></p>
          <p>npm run test:watch</p>
          <p className="mt-2"><span className="text-gray-500"># Mit Coverage-Report:</span></p>
          <p>npm run test:coverage</p>
        </div>
      </section>

      {/* Untested areas */}
      <section className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">⚠️ Noch nicht getestet — Kritische Bereiche</h2>
          <p className="text-xs text-gray-500 mt-0.5">Bereiche, die Integration- oder E2E-Tests erfordern (Supabase/Next.js-Abhängigkeit)</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bereich</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Begründung</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priorität</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {UNTESTED_AREAS.map(u => (
              <tr key={u.area} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-800">{u.area}</td>
                <td className="px-6 py-3 text-gray-500 text-xs">{u.reason}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLOR[u.priority]}`}>
                    {u.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Test strategy */}
      <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="font-semibold text-blue-900 mb-3">📋 Test-Strategie</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-800">Stufe 1 — Unit Tests ✅</p>
            <p className="text-blue-600 text-xs mt-1">Reine Funktionen ohne DB/IO. Vitest. Alle Scoring- und Forecast-Formeln abgedeckt.</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">Stufe 2 — Integration Tests 🔜</p>
            <p className="text-blue-600 text-xs mt-1">Agenten, API-Routes, Auth-Guard. Benötigt Supabase-Test-Instanz oder Mocking.</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">Stufe 3 — E2E Tests 🔜</p>
            <p className="text-blue-600 text-xs mt-1">Admin-Pages, Booking-Flow. Playwright oder Cypress. Für Investor-Präsentation empfohlen.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
