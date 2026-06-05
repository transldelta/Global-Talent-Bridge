/**
 * GET /api/admin/exit-readiness/export
 *
 * Exportiert das Exit Evidence Pack als JSON.
 * Enthält: productSummary, readinessScores, buyerChecklist,
 *          valueDrivers, riskRegister, buyerQuestions,
 *          nextActions, markdown.
 *
 * Kein PDF — kein externe Library nötig.
 * Markdown-String als Basis für Data-Room-Dokument.
 *
 * Admin-only.
 */
import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  generateExitEvidence,
  generateMarkdown,
} from '@/lib/exit-readiness'
import {
  computeAllCategories,
  buildKpiSnapshot,
  type PilotLiveData,
} from '@/lib/pilot-execution'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const db = createAdminClient()

  // ── Live data aus DB ────────────────────────────────────────────────────────
  const [
    candidatesRes,
    candidatesCvRes,
    jobsRes,
    appsRes,
    pilotTotalRes,
    pilotActiveRes,
    pilotIntRes,
    pilotDemoRes,
    pilotContactedRes,
    pilotIdentifiedRes,
    pilotOnboardingRes,
    pilotRejectedRes,
    pilotCandRes,
    outreachRes,
    corridorsRes,
    tasksRes,
    logsRes,
    profilesRes,
  ] = await Promise.all([
    db.from('candidates').select('*', { count: 'exact', head: true }),
    db.from('candidates').select('*', { count: 'exact', head: true }).not('cv_url', 'is', null),
    db.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    db.from('application_requests').select('*', { count: 'exact', head: true }),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'active_pilot'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'interested'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'demo_scheduled'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'contacted_manual'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'identified'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'onboarding'),
    db.from('pilot_employers').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    db.from('pilot_candidates').select('*', { count: 'exact', head: true }),
    db.from('outreach_targets').select('*', { count: 'exact', head: true }),
    db.from('migration_corridors').select('*', { count: 'exact', head: true }),
    db.from('pilot_tasks').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    db.from('system_logs').select('*', { count: 'exact', head: true }),
    db.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const liveData: PilotLiveData = {
    candidates:          candidatesRes.count ?? 0,
    candidatesWithCv:    candidatesCvRes.count ?? 0,
    activeJobs:          jobsRes.count ?? 0,
    applications:        appsRes.count ?? 0,
    pilotEmployers:      pilotTotalRes.count ?? 0,
    pilotActive:         pilotActiveRes.count ?? 0,
    pilotInterested:     pilotIntRes.count ?? 0,
    pilotDemo:           pilotDemoRes.count ?? 0,
    pilotContacted:      pilotContactedRes.count ?? 0,
    pilotIdentified:     pilotIdentifiedRes.count ?? 0,
    pilotOnboarding:     pilotOnboardingRes.count ?? 0,
    pilotRejected:       pilotRejectedRes.count ?? 0,
    pilotCandidates:     pilotCandRes.count ?? 0,
    outreachTargets:     outreachRes.count ?? 0,
    migrationCorridors:  corridorsRes.count ?? 0,
    openTasks:           tasksRes.count ?? 0,
    systemLogs:          logsRes.count ?? 0,
    profiles:            profilesRes.count ?? 0,
    testsPassing:        246, // statisch — aus letztem npm run test
    landingpages:        null,  // Tabelle nicht vorhanden
    dueDiligenceSections:null,  // Tabelle nicht vorhanden
  }

  // ── Evidence Pack generieren ────────────────────────────────────────────────
  const evidence = generateExitEvidence()
  const markdown = generateMarkdown(evidence)
  const categories = computeAllCategories(liveData)
  const kpiSnapshot = buildKpiSnapshot(liveData)

  // Logging
  await db.from('system_logs').insert({
    agent_name: 'exit-readiness-export',
    status: 'success',
    message: `Exit Evidence Export angefordert (Admin: ${admin.email}). Score: ${evidence.overallReadinessScore}%`,
  }).then(() => {})

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    exportedBy: admin.email,
    productSummary: evidence.productSummary,
    readinessScores: {
      overallExitScore: evidence.overallReadinessScore,
      categories: categories.map((c) => ({
        key: c.key,
        label: c.label,
        score: c.score,
        status: c.status,
      })),
      overallPilotScore: Math.round(
        categories.reduce((sum, c) => sum + c.score, 0) / categories.length
      ),
    },
    kpiSnapshot,
    buyerChecklist: evidence.buyerChecklist,
    valueDrivers: evidence.valueDrivers,
    riskRegister: evidence.riskRegister,
    buyerQuestions: evidence.buyerQuestions,
    nextActions: [
      'Ersten aktiven Pilotkunden gewinnen',
      'Kandidatenpool auf ≥10 echte Profile ausbauen',
      'CV-Uploads von Kandidaten einsammeln',
      'Manuelle Outreach-Kampagne: 10+ Arbeitgeber in 4 Wochen',
      'Rechtliche Prüfung für internationales Arbeitsrecht',
      'Erste Demo durchführen und Feedback dokumentieren',
    ],
    markdown,
  })
}
