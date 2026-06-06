/**
 * lib/cwo-agent/ceo-agent.ts
 *
 * CEO Agent Department
 *
 * Orchestriert alle anderen Departments.
 * Erstellt Tageslage, Top-3 Aktionsplan, Systemübersicht.
 * Kein externer API-Call. Kein I/O. Reine Orchestrierung interner Funktionen.
 * Autonomy Level: A4 (automatisch analysieren + priorisieren + berichten)
 */
import { analyzeCorridors, getTopCorridors }             from './global-demand'
import { analyzeEmployerDemand, getTopEmployerSectors }  from './employer-demand'
import { analyzeRevenueStreams, getImmediateRevenueStreams, getBlockedRevenueStreams } from './revenue-pragmatist'
import { getAllBlockedRisks, getCriticalRisks, validateInvariants, SYSTEM_INVARIANTS } from './compliance-guard'
import { getCandidateMagnetAssets, getTopCandidateAssets } from './candidate-magnet'
import { getInboundChannels, getGrowthSummary }          from './inbound-growth'
import { getPilotSteps, getNextPilotStep, generateDailyReport, getSystemStatusSummary } from './operations'
import type { CWOCommandCenterState, CWOTask, Department } from './types'

// ── Tageslagen-Generierung ────────────────────────────────────────────────────

/**
 * Erstellt eine strukturierte Tageslage aus allen Departments.
 * Reine Funktion — kein I/O, kein DB-Call, kein externer API-Call.
 */
export function generateTageslageSummary(): {
  headline:           string
  status:             'green' | 'yellow' | 'red'
  topOpportunity:     string
  topRisk:            string
  immediateAction:    string
  immediateActionHref: string
  corridorsAnalyzed:  number
  sectorsAnalyzed:    number
  revenueStreams:      number
  blockedRisks:       number
  complianceViolations: string[]
} {
  const topCorridors = getTopCorridors(1)
  const topSectors   = getTopEmployerSectors(1)
  const topRevenue   = getImmediateRevenueStreams()
  const criticalRisks = getCriticalRisks()
  const systemStatus  = getSystemStatusSummary()
  const violations    = validateInvariants()
  const nextStep      = getNextPilotStep()

  const topOpportunity = topCorridors[0]
    ? `${topCorridors[0].originFlag} ${topCorridors[0].origin} → ${topCorridors[0].destinationFlag} ${topCorridors[0].destination} (Score: ${topCorridors[0].score})`
    : 'Keine Korridore analysiert'

  const topRiskItem = criticalRisks[0]
    ? `${criticalRisks[0].category}: ${criticalRisks[0].description}`
    : 'Keine kritischen Risiken aktiv'

  const immediateAction = nextStep
    ? nextStep.step
    : topRevenue[0]?.name ?? 'Revenue-Strategie prüfen'

  const immediateActionHref = nextStep
    ? '/admin/pilot-control'
    : '/admin/revenue-pragmatist'

  return {
    headline:            'CorridorWork CWO — Autonomes Revenue Operating System',
    status:              violations.length > 0 ? 'red' : systemStatus.health,
    topOpportunity,
    topRisk:             topRiskItem,
    immediateAction,
    immediateActionHref,
    corridorsAnalyzed:   analyzeCorridors().length,
    sectorsAnalyzed:     analyzeEmployerDemand().length,
    revenueStreams:      analyzeRevenueStreams().length,
    blockedRisks:        getAllBlockedRisks().length,
    complianceViolations: violations,
  }
}

// ── Task-Generierung ──────────────────────────────────────────────────────────

/**
 * Generiert automatisch die Top-N priorisierten Aufgaben aus allen Departments.
 * Reine Funktion. Kein I/O.
 */
export function generateTopTasks(n = 5): CWOTask[] {
  const tasks: CWOTask[] = []

  // Aus Operations (Pilot Steps)
  const pilotSteps = getPilotSteps()
    .filter(s => s.status === 'in_progress' || s.status === 'not_started')
    .slice(0, 3)

  pilotSteps.forEach((step, idx) => {
    tasks.push({
      id:               `pilot_${step.id}`,
      title:            step.step,
      department:       'operations',
      description:      step.description,
      status:           step.status === 'in_progress' ? 'in_progress' : 'planned',
      priority:         step.priority,
      score:            step.status === 'in_progress' ? 90 : 70 - idx * 10,
      riskLevel:        'low',
      complianceStatus: 'safe',
      recommendation:   step.description,
      actionHref:       '/admin/pilot-control',
      noEmailSent:      true,
      noAutoOutreach:   true,
      noScraping:       true,
    })
  })

  // Aus Inbound Growth
  const topChannels = getInboundChannels().filter(c => c.priority === 'high').slice(0, 2)
  topChannels.forEach(channel => {
    tasks.push({
      id:               `inbound_${channel.id}`,
      title:            `Inbound: ${channel.channel}`,
      department:       'inbound_growth',
      description:      channel.description,
      status:           'planned',
      priority:         channel.priority,
      score:            75,
      riskLevel:        'low',
      complianceStatus: channel.complianceStatus,
      recommendation:   channel.actionItems[0] ?? channel.description,
      actionHref:       '/admin/inbound-growth-engine',
      noEmailSent:      true,
      noAutoOutreach:   true,
      noScraping:       true,
    })
  })

  // Revenue — sofort testbare Streams
  const revenueStreams = getImmediateRevenueStreams().slice(0, 2)
  revenueStreams.forEach(stream => {
    tasks.push({
      id:               `revenue_${stream.id}`,
      title:            `Revenue: ${stream.name}`,
      department:       'revenue_pragmatist',
      description:      stream.rationale,
      status:           'planned',
      priority:         'medium',
      score:            stream.incomePotential - stream.legalRisk,
      riskLevel:        stream.legalRisk > 50 ? 'high' : stream.legalRisk > 25 ? 'medium' : 'low',
      complianceStatus: stream.complianceStatus,
      recommendation:   stream.prerequisites[0] ?? stream.rationale,
      actionHref:       '/admin/revenue-pragmatist',
      noEmailSent:      true,
      noAutoOutreach:   true,
      noScraping:       true,
    })
  })

  // Sortieren nach Score desc, slice
  return tasks
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
}

// ── Department Status ─────────────────────────────────────────────────────────

const DEPARTMENT_META: Record<Department, { name: string; icon: string; href: string; description: string }> = {
  ceo_agent:         { name: 'CEO Agent',          icon: '🧠', href: '/admin/cwo-command-center',    description: 'Orchestriert alle Departments. Erstellt Tageslage.' },
  global_demand:     { name: 'Global Demand Radar', icon: '🌍', href: '/admin/global-demand-radar',   description: 'Analysiert globale Talent-Korridore.' },
  employer_demand:   { name: 'Employer Demand Map', icon: '🏭', href: '/admin/employer-demand-map',   description: 'Priorisiert Arbeitgeberbranchen nach Potenzial.' },
  candidate_magnet:  { name: 'Candidate Magnet',    icon: '🧲', href: '/admin/candidate-magnet',      description: 'Baut legale Inbound-Strategie für Bewerber.' },
  inbound_growth:    { name: 'Inbound Growth Engine',icon: '📈', href: '/admin/inbound-growth-engine', description: 'SEO, Landingpages, Selbstregistrierung.' },
  revenue_pragmatist:{ name: 'Revenue Pragmatist',  icon: '💰', href: '/admin/revenue-pragmatist',    description: 'Bewertet Revenue-Streams nach Potenzial und Risiko.' },
  compliance_guard:  { name: 'Compliance Guard',    icon: '🛡️', href: '/admin/cwo-command-center',    description: 'Blockiert riskante Aktionen automatisch.' },
  operations:        { name: 'Operations',          icon: '⚙️', href: '/admin/autonomous-worklog',     description: 'Systemstatus, Pilot-Schritte, Tagesbericht.' },
}

/**
 * Gibt Department-Metadata zurück.
 */
export function getDepartmentMeta(): typeof DEPARTMENT_META {
  return DEPARTMENT_META
}

// ── Hauptfunktion: CWO Command Center ────────────────────────────────────────

/**
 * Generiert den vollständigen CWO Command Center State.
 * Orchestriert alle Departments. Reine Funktion.
 */
export function generateCWOState(): CWOCommandCenterState {
  const tageslage  = generateTageslageSummary()
  const topTasks   = generateTopTasks(5)
  const dailyReport = generateDailyReport()

  return {
    generatedAt:        new Date().toISOString(),
    topCorridors:       getTopCorridors(3),
    topEmployerSectors: getTopEmployerSectors(3),
    topRevenueStreams:  getImmediateRevenueStreams().slice(0, 3),
    topTasks,
    blockedRisks:       getCriticalRisks(),
    nextBestStep:       tageslage.immediateAction,
    nextBestStepHref:   tageslage.immediateActionHref,
    departments:        Object.entries(DEPARTMENT_META).map(([key, meta]) => ({
      id:          key as Department,
      name:        meta.name,
      label:       meta.name,
      icon:        meta.icon,
      href:        meta.href,
      route:       meta.href,
      description: meta.description,
      status:      'active' as const,
      lastAction:  'Auto-Analyse',
      autonomyLevel: 'A4' as const,
    })),
    systemInvariants: {
      emailProvider:         SYSTEM_INVARIANTS.emailProvider,
      outreachEmailProvider: SYSTEM_INVARIANTS.outreachEmailProvider,
      noEmailSent:           SYSTEM_INVARIANTS.noEmailSent,
      noAutoOutreach:        SYSTEM_INVARIANTS.noAutoOutreach,
      noScraping:            SYSTEM_INVARIANTS.noScraping,
      currentAutonomyLevel:  'A4',
      phase:                 SYSTEM_INVARIANTS.phase,
    },
  }
}
