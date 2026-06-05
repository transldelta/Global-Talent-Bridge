/**
 * GET /api/admin/data-room/export
 *
 * Exportiert den vollständigen Buyer Data Room als JSON.
 * Enthält: assetOverview, builtModules, technicalProof, demoAssets,
 *          handoverChecklist, notYetProven, nextActions, riskRegister,
 *          demoPack, markdown.
 *
 * Admin-only. Kein PDF — kein externer Library-Install nötig.
 * Markdown als Grundlage für Data-Room-PDF oder Verkaufsdokument.
 *
 * CONSTRAINTS:
 * - Keine Fake-Umsätze als echte Umsätze darstellen
 * - demoMode: true/false klar im Export enthalten
 * - Alle Demo-Daten mit demo: true markiert
 * - Keine externen Dienste
 */
import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  generateDataRoomSnapshot,
  generateDataRoomMarkdown,
} from '@/lib/data-room'
import { getDemoPack } from '@/lib/demo-data'
import { isDemoModeEnabled, getDemoDisclaimer } from '@/lib/demo-mode'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const supabase = createAdminClient()
    const demoMode = isDemoModeEnabled()

    // ── Live DB stats (parallel) ─────────────────────────────────────────────
    const [
      { count: candidateCount },
      { count: employerCount },
      { count: pilotEmployerCount },
      { count: pilotCandidateCount },
      { count: corridorCount },
      { count: systemLogCount },
      { count: applicationCount },
      { count: jobCount },
    ] = await Promise.all([
      supabase.from('candidates').select('*', { count: 'exact', head: true }),
      supabase.from('employers').select('*', { count: 'exact', head: true }),
      supabase.from('pilot_employers').select('*', { count: 'exact', head: true }),
      supabase.from('pilot_candidates').select('*', { count: 'exact', head: true }),
      supabase.from('migration_corridors').select('*', { count: 'exact', head: true }),
      supabase.from('system_logs').select('*', { count: 'exact', head: true }),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
    ])

    // Pilot employer status breakdown
    const { data: pilotStatuses } = await supabase
      .from('pilot_employers')
      .select('status')

    const statusBreakdown = (pilotStatuses ?? []).reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1
      return acc
    }, {})

    // ── Snapshot & Demo Pack ─────────────────────────────────────────────────
    const snapshot = generateDataRoomSnapshot(demoMode)
    const demoPack = getDemoPack()
    const markdown = generateDataRoomMarkdown(snapshot)

    // ── Log to system_logs ───────────────────────────────────────────────────
    await supabase.from('system_logs').insert({
      agent_name: 'data-room-export',
      status: 'success',
      message: `Data Room exported by ${admin.email} at ${new Date().toISOString()}`,
    })

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      exportedBy: admin.email,
      demoMode,
      disclaimer: getDemoDisclaimer(),

      // Live database stats
      liveStats: {
        realCandidates: candidateCount ?? 0,
        realEmployers: employerCount ?? 0,
        pilotEmployers: pilotEmployerCount ?? 0,
        pilotCandidates: pilotCandidateCount ?? 0,
        migrationCorridors: corridorCount ?? 0,
        systemLogs: systemLogCount ?? 0,
        applications: applicationCount ?? 0,
        jobs: jobCount ?? 0,
        pilotStatusBreakdown: statusBreakdown,
      },

      // Structured data room snapshot
      assetOverview: snapshot.assetOverview,
      builtModules: snapshot.builtModules,
      technicalProof: snapshot.technicalProof,
      demoAssets: snapshot.demoAssets,
      handoverChecklist: snapshot.handoverChecklist,
      notYetProven: snapshot.notYetProven,
      nextActions: snapshot.nextActions,

      // Full demo data pack (all items: demo: true)
      demoPack: {
        meta: demoPack.meta,
        candidates: demoPack.candidates,
        employers: demoPack.employers,
        corridors: demoPack.corridors,
        revenueAssumptions: demoPack.revenueAssumptions,
        risks: demoPack.risks,
      },

      // Markdown for data room / PDF basis
      markdown,
    })
  } catch (err) {
    console.error('data-room/export error:', err)
    return NextResponse.json(
      { error: 'Internal server error during Data Room export' },
      { status: 500 }
    )
  }
}
