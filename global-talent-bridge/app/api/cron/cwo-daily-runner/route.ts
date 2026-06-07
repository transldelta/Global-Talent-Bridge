/**
 * GET /api/cron/cwo-daily-runner
 *
 * Daily CWO Autonomous Runner
 *
 * Wird täglich von Vercel Cron aufgerufen.
 * Bereitet intern vor: Tageslage, Korridore, Sektoren, Revenue, Aufgaben, Risiken.
 * Schreibt Eintrag in autonomous_worklog.
 *
 * Sicherheit:
 * - CRON_SECRET Header erforderlich (Authorization: Bearer <CRON_SECRET>)
 * - Kein E-Mail-Versand
 * - Kein Scraping
 * - Kein externer API-Call
 * - Keine externen Dienste
 *
 * Phase 1: Autonomy Level A2 (auto-save draft/report)
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient }         from '@/lib/supabase/admin'
import { generateCWOState }          from '@/lib/cwo-agent'
import { generateTageslageSummary }  from '@/lib/cwo-agent/ceo-agent'
import { validateInvariants, SYSTEM_INVARIANTS } from '@/lib/cwo-agent/compliance-guard'
import { generateSeoCheckItems }     from '@/lib/seo-indexing'

// ── Sicherheits-Konstante ─────────────────────────────────────────────────────

const CRON_SECRET = process.env.CRON_SECRET

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {

  // ── 1. Auth-Check: CRON_SECRET erforderlich ───────────────────────────────
  const authHeader = req.headers.get('authorization')
  const token      = authHeader?.replace('Bearer ', '').trim()

  if (!CRON_SECRET) {
    // CRON_SECRET nicht konfiguriert → hard block
    return NextResponse.json(
      { error: 'CRON_SECRET not configured', code: 'env_missing' },
      { status: 500 }
    )
  }

  if (!token || token !== CRON_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized — invalid or missing CRON_SECRET', code: 'unauthorized' },
      { status: 401 }
    )
  }

  // ── 2. Compliance-Invarianten prüfen ─────────────────────────────────────
  const violations = validateInvariants()
  if (violations.length > 0) {
    return NextResponse.json(
      {
        error:      'Compliance violation detected — aborting',
        violations,
        code:       'compliance_violation',
        noEmailSent:    true,
        noAutoOutreach: true,
        noScraping:     true,
      },
      { status: 500 }
    )
  }

  // ── 3. Interne Analyse (reine Funktionen, kein I/O, kein Scraping) ────────
  const state     = generateCWOState()
  const tageslage = generateTageslageSummary()

  // Top 3 Korridore
  const topCorridors = state.topCorridors.map(c => (
    `${c.originFlag} ${c.origin} → ${c.destinationFlag} ${c.destination} (Score: ${c.score})`
  ))

  // Top 3 Sektoren
  const topSectors = state.topEmployerSectors.map(s => (
    `${s.sectorIcon} ${s.sector} (Score: ${s.overallScore})`
  ))

  // Top 3 Revenue
  const topRevenue = state.topRevenueStreams.map(r => (
    `${r.icon} ${r.name} — Potenzial: ${r.incomePotential}%`
  ))

  // Top 3 Tasks
  const topTasks = state.topTasks.slice(0, 3).map(t => t.title)

  // Blockierte Risiken
  const blockedRisks = state.blockedRisks.slice(0, 5).map(r => (
    `[${r.severity.toUpperCase()}] ${r.category}: ${r.description}`
  ))

  // Zusammenfassung
  const summary = [
    `=== CWO Tagesbericht — ${new Date().toLocaleDateString('de-DE')} ===`,
    '',
    `Systemstatus: ${tageslage.status.toUpperCase()}`,
    `Top Opportunity: ${tageslage.topOpportunity}`,
    `Nächste Aktion: ${tageslage.immediateAction}`,
    '',
    'Top-3 Korridore:',
    ...topCorridors.map(c => `  · ${c}`),
    '',
    'Top-3 Sektoren:',
    ...topSectors.map(s => `  · ${s}`),
    '',
    'Top-3 Revenue:',
    ...topRevenue.map(r => `  · ${r}`),
    '',
    'Top-3 Aufgaben:',
    ...topTasks.map(t => `  · ${t}`),
    '',
    'Blockierte Risiken:',
    ...blockedRisks.map(r => `  ✗ ${r}`),
    '',
    `=== INVARIANTEN: EMAIL_PROVIDER=${SYSTEM_INVARIANTS.emailProvider} | noEmailSent=${SYSTEM_INVARIANTS.noEmailSent} | noScraping=${SYSTEM_INVARIANTS.noScraping} ===`,
  ].join('\n')

  // SEO Indexing Check — reine Konfigurationsprüfung, kein externer Call
  const seoCheckItems = generateSeoCheckItems()

  const completedItems = [
    `Tageslage generiert: ${tageslage.status}`,
    `${topCorridors.length} Korridore analysiert`,
    `${topSectors.length} Sektoren bewertet`,
    `${topRevenue.length} Revenue-Streams geprüft`,
    `${state.topTasks.length} Aufgaben priorisiert`,
    `${state.blockedRisks.length} Risiken blockiert (Phase 1)`,
    // SEO Visibility Check (kein externer Call, reine Konfiguration)
    ...seoCheckItems,
  ]

  const openItems = tageslage.complianceViolations.length > 0
    ? tageslage.complianceViolations
    : ['Keine offenen Compliance-Probleme']

  // ── 4a. Revenue Leads zählen (interne DB-Abfrage, kein externer Call) ──────
  const supabase = createAdminClient()

  const { count: newLeadsTotal }    = await supabase
    .from('revenue_leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new')

  const { count: employerLeads }    = await supabase
    .from('revenue_leads')
    .select('id', { count: 'exact', head: true })
    .eq('lead_type', 'employer_pilot')
    .eq('status', 'new')

  const { count: agencyLeads }      = await supabase
    .from('revenue_leads')
    .select('id', { count: 'exact', head: true })
    .eq('lead_type', 'agency_partner')
    .eq('status', 'new')

  const { count: intelLeads }       = await supabase
    .from('revenue_leads')
    .select('id', { count: 'exact', head: true })
    .eq('lead_type', 'market_intelligence')
    .eq('status', 'new')

  const newLeadsCount = newLeadsTotal ?? 0

  // Revenue-Leads in completedItems aufnehmen
  if (newLeadsCount > 0) {
    completedItems.push(`${newLeadsCount} neue Inbound-Leads (${employerLeads ?? 0} Employer, ${agencyLeads ?? 0} Agency, ${intelLeads ?? 0} Intel)`)
  }

  // ── 4b. In autonomous_worklog schreiben (service_role, RLS-bypass) ────────

  const { data, error } = await supabase
    .from('autonomous_worklog')
    .insert({
      report_type:      'daily',
      system_health:    tageslage.status,
      summary,
      completed_items:  completedItems,
      open_items:       openItems,
      next_action:      tageslage.immediateAction,
      compliance_status: tageslage.complianceViolations.length > 0 ? 'needs_review' : 'safe',
      // Safety constraints (DB CHECK ensures these can only be true)
      no_email_sent:    true,
      no_auto_outreach: true,
      no_scraping:      true,
      created_by:       'cwo_cron_daily',
    })
    .select('id, created_at')
    .single()

  if (error) {
    console.error('[CWO Cron] Worklog insert failed:', error.message)
    return NextResponse.json(
      {
        error:   'Worklog insert failed',
        details: error.message,
        code:    'db_error',
        // Safety always true even on error
        noEmailSent:    true,
        noAutoOutreach: true,
        noScraping:     true,
      },
      { status: 500 }
    )
  }

  // ── 5. Erfolg zurückmelden ────────────────────────────────────────────────
  return NextResponse.json({
    ok:               true,
    worklogId:        data?.id,
    runAt:            data?.created_at ?? new Date().toISOString(),
    systemHealth:     tageslage.status,
    topOpportunity:   tageslage.topOpportunity,
    immediateAction:  tageslage.immediateAction,
    topCorridors,
    topSectors,
    topRevenue,
    topTasks,
    blockedRisksCount: state.blockedRisks.length,
    completedItems,
    openItems,
    revenueLeads: {
      newTotal:       newLeadsCount,
      employerPilot:  employerLeads  ?? 0,
      agencyPartner:  agencyLeads    ?? 0,
      marketIntel:    intelLeads     ?? 0,
    },
    // Safety invariants im Response bestätigen
    safetyConfirmed: {
      noEmailSent:          true,
      noAutoOutreach:       true,
      noScraping:           true,
      emailProvider:        SYSTEM_INVARIANTS.emailProvider,
      outreachProvider:     SYSTEM_INVARIANTS.outreachEmailProvider,
      phase:                SYSTEM_INVARIANTS.phase,
      autonomyLevel:        'A2',
      externalCallsMade:    0,
      messagesSent:         0,
    },
  })
}
