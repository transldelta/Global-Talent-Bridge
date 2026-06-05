/**
 * lib/pilot-execution.ts
 *
 * Pilot Execution — reine Business-Logic-Funktionen.
 * Keine UI-Logik. Keine Server-Imports. Testbar mit Vitest.
 *
 * CONSTRAINTS:
 * - Keine externen APIs
 * - Keine echten Umsätze erfunden
 * - Schätzungen klar als Schätzungen markieren
 * - Nur die 7 gültigen pilot_employers-Status verwenden:
 *   identified | contacted_manual | interested | demo_scheduled |
 *   onboarding | active_pilot | rejected
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type ReadinessStatus = 'ready' | 'warning' | 'blocked'

export type ReadinessCategory = {
  key: string
  label: string
  score: number           // 0–100
  status: ReadinessStatus
  explanation: string
  nextAction: string
}

export type LaunchBlocker = {
  id: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  resolution: string
  blocksLaunch: boolean
}

export type DayPlan = {
  day: number
  title: string
  tasks: string[]
  module: string          // welches Admin-Modul hilft
  moduleUrl: string
}

export type CorridorCard = {
  name: string
  sourceCountry: string
  targetCountry: string
  sector: string
  supplyScore: number
  demandScore: number
  opportunityScore: number
  riskLevel: 'low' | 'medium' | 'high'
  landingpageAngle: string
  outreachAngle: string
  nextBestAction: string
  isExample: boolean     // true wenn keine echten DB-Daten
}

export type KpiSnapshot = {
  candidates: number
  candidatesWithCv: number
  activeJobs: number
  applications: number
  pilotEmployers: number
  pilotByStatus: Record<string, number>
  outreachPrepared: number
  migrationCorridors: number
  openTasks: number
  systemLogs: number
  landingpages: number | 'not_configured'
  dueDiligenceSections: number | 'not_configured'
  revenueEstimated: 'none' | 'estimated'
}

export type PilotLiveData = {
  candidates: number
  candidatesWithCv: number
  activeJobs: number
  applications: number
  pilotEmployers: number
  pilotActive: number
  pilotInterested: number
  pilotDemo: number
  pilotContacted: number
  pilotIdentified: number
  pilotOnboarding: number
  pilotRejected: number
  pilotCandidates: number
  outreachTargets: number
  migrationCorridors: number
  openTasks: number
  systemLogs: number
  profiles: number
  testsPassing: number
  landingpages: number | null   // null = Tabelle nicht vorhanden
  dueDiligenceSections: number | null
}

export type MigrationCorridorRow = {
  sourceCountry: string
  targetCountry: string
  sector: string
  supplyScore: number
  demandScore: number
  opportunityScore: number
  priorityLevel: string
}

// ── Readiness Scoring ────────────────────────────────────────────────────────

export function scoreTechnicalReadiness(data: PilotLiveData): ReadinessCategory {
  // Kriterien: Tests passing, Build, E2E, API-Routen, Auth
  const hasTests     = data.testsPassing >= 200
  const hasProfiles  = data.profiles >= 1
  const hasJobs      = data.activeJobs >= 1
  const hasCandidates= data.candidates >= 1

  let score = 0
  if (hasTests)     score += 40
  if (hasProfiles)  score += 20
  if (hasJobs)      score += 20
  if (hasCandidates)score += 20

  return {
    key: 'technical',
    label: 'Technical Readiness',
    score,
    status: score >= 80 ? 'ready' : score >= 50 ? 'warning' : 'blocked',
    explanation: `${data.testsPassing} Tests passing. ${data.activeJobs} aktive Jobs. ${data.candidates} registrierte Kandidaten. ${data.profiles} Profile.`,
    nextAction: score >= 80
      ? 'Technisch bereit — regelmäßige Test-Runs sicherstellen.'
      : 'Weitere Kandidaten und Arbeitgeber in Produktion onboarden.',
  }
}

export function scoreCandidateAcquisition(data: PilotLiveData): ReadinessCategory {
  // Echte Kandidaten (nicht Pilot-Seed) zählen
  const real = data.candidates
  const withCv = data.candidatesWithCv
  const pilot  = data.pilotCandidates

  let score = 0
  if (real >= 1)   score += 20
  if (real >= 5)   score += 20
  if (withCv >= 1) score += 25
  if (pilot >= 10) score += 20
  if (pilot >= 20) score += 15

  const status: ReadinessStatus = real === 0 ? 'warning' : score >= 60 ? 'ready' : 'warning'

  return {
    key: 'candidate_acquisition',
    label: 'Candidate Acquisition',
    score,
    status,
    explanation: `${real} echte Kandidaten (${withCv} mit CV). ${pilot} Pilot-Kandidaten (Seed-Daten).`,
    nextAction: real === 0
      ? 'Ersten echten Kandidaten über Onboarding-Flow gewinnen.'
      : withCv === 0
        ? 'Kandidaten zur CV-Upload-Nutzung motivieren.'
        : 'Kandidatenpool auf ≥20 echte Profile ausbauen.',
  }
}

export function scoreEmployerAcquisition(data: PilotLiveData): ReadinessCategory {
  const hasActive   = data.pilotActive >= 1
  const hasInterest = data.pilotInterested >= 1
  const hasDemo     = data.pilotDemo >= 1
  const hasPipeline = (data.pilotInterested + data.pilotDemo + data.pilotOnboarding) >= 3

  let score = 0
  if (data.pilotIdentified >= 3)  score += 10
  if (data.pilotContacted >= 1)   score += 20
  if (hasInterest)                score += 25
  if (hasDemo)                    score += 25
  if (hasActive)                  score += 20

  const status: ReadinessStatus =
    hasActive ? 'ready' :
    hasPipeline ? 'warning' :
    'blocked'

  return {
    key: 'employer_acquisition',
    label: 'Employer Acquisition',
    score,
    status,
    explanation: `${data.pilotEmployers} Pilot-Arbeitgeber: ${data.pilotActive} aktiv, ${data.pilotInterested} interessiert, ${data.pilotDemo} Demo, ${data.pilotContacted} kontaktiert, ${data.pilotIdentified} identifiziert.`,
    nextAction: hasActive
      ? 'Aktiven Pilotkunden betreuen und Feedback sammeln.'
      : hasDemo
        ? 'Demo-Termin professionell vorbereiten — Kandidatenprofile bereitstellen.'
        : 'Manuelle Outreach-Kampagne starten: /admin/pilot-outreach.',
  }
}

export function scoreOutreachReadiness(data: PilotLiveData): ReadinessCategory {
  const hasPrepared = data.pilotEmployers >= 5
  const hasContacted = data.pilotContacted >= 1
  const hasTemplates = true  // lib/outreach/templates.ts existiert

  let score = 0
  if (hasTemplates)   score += 35
  if (hasPrepared)    score += 30
  if (hasContacted)   score += 35

  return {
    key: 'outreach',
    label: 'Outreach Readiness',
    score,
    status: score >= 80 ? 'ready' : score >= 50 ? 'warning' : 'blocked',
    explanation: `${data.pilotEmployers} Arbeitgeber mit personalisierten Templates vorbereitet. ${data.pilotContacted} manuell kontaktiert. ${data.outreachTargets} Outreach-Ziele konfiguriert.`,
    nextAction: hasContacted
      ? 'Antworten prüfen und Status aktualisieren: /admin/pilot-outreach.'
      : 'Erste manuelle Outreach-Nachricht senden — Templates unter /admin/pilot-outreach.',
  }
}

export function scoreMigrationCorridorReadiness(data: PilotLiveData): ReadinessCategory {
  const hasCorridor = data.migrationCorridors >= 1
  const hasMany     = data.migrationCorridors >= 5

  let score = 0
  if (hasCorridor) score += 50
  if (hasMany)     score += 30
  if (data.migrationCorridors >= 8) score += 20

  return {
    key: 'migration_corridor',
    label: 'Migration Corridor',
    score,
    status: score >= 70 ? 'ready' : score >= 30 ? 'warning' : 'blocked',
    explanation: `${data.migrationCorridors} Migrations-Korridore mit Opportunity-Scores konfiguriert.`,
    nextAction: hasCorridor
      ? 'Top-Korridor fokussieren — Korridore nach Opportunity-Score priorisieren.'
      : 'Migration Corridors in /admin/global/corridors anlegen.',
  }
}

export function scoreDueDiligenceReadiness(data: PilotLiveData): ReadinessCategory {
  const hasSections = data.dueDiligenceSections !== null && (data.dueDiligenceSections ?? 0) > 0

  const score = hasSections ? 60 : 25

  return {
    key: 'due_diligence',
    label: 'Due Diligence',
    score,
    status: hasSections ? 'warning' : 'warning',
    explanation: data.dueDiligenceSections === null
      ? 'Due-Diligence-Tabelle nicht eingerichtet. Struktur vorhanden via Sale-Readiness-Modul.'
      : `${data.dueDiligenceSections} Due-Diligence-Abschnitte konfiguriert.`,
    nextAction: 'Rechtliche Prüfung für internationale Arbeitsvermittlung dokumentieren. /admin/sale-readiness prüfen.',
  }
}

export function scoreRevenueReadiness(data: PilotLiveData): ReadinessCategory {
  // Ehrlich: kein echter Umsatz vorhanden
  const hasJobs       = data.activeJobs >= 1
  const hasApps       = data.applications >= 1
  const hasEmployer   = data.pilotActive >= 1

  let score = 0
  if (hasJobs)     score += 20
  if (hasApps)     score += 20
  if (hasEmployer) score += 30
  // Kein Stripe → max 40 ohne echten Umsatz

  return {
    key: 'revenue',
    label: 'Revenue Readiness',
    score,
    status: hasEmployer ? 'warning' : 'blocked',
    explanation: 'Kein verifizierter Umsatz vorhanden. Revenue Intelligence und Forecast-Modelle existieren (Schätzungen). Stripe nicht aktiv.',
    nextAction: hasEmployer
      ? 'Erstes Pricing-Gespräch mit aktivem Pilotkunden führen.'
      : 'Ersten aktiven Pilotkunden gewinnen, bevor Pricing-Diskussion stattfindet.',
  }
}

export function scoreComplianceReadiness(data: PilotLiveData): ReadinessCategory {
  // Basis-Compliance: Rechtstexte existieren (Impressum, AGB, Datenschutz)
  const hasLegal = true  // Rechtstexte vorhanden (Sprint I)
  const hasRLS   = true  // RLS auf allen Tabellen

  const score = hasLegal && hasRLS ? 55 : 20

  return {
    key: 'compliance',
    label: 'Compliance / Risk',
    score,
    status: 'warning',
    explanation: 'Rechtstexte (AGB, Datenschutz, Impressum) vorhanden. RLS auf allen Tabellen aktiv. Keine externe Rechtsberatung für internationale Arbeitsvermittlung dokumentiert.',
    nextAction: 'Rechtliche Grundlage für Länder-übergreifende Arbeitsvermittlung prüfen lassen. DSGVO-konformes Löschkonzept dokumentieren.',
  }
}

export function computeOverallReadinessScore(categories: ReadinessCategory[]): number {
  if (categories.length === 0) return 0
  const total = categories.reduce((sum, c) => sum + c.score, 0)
  return Math.round(total / categories.length)
}

export function computeAllCategories(data: PilotLiveData): ReadinessCategory[] {
  return [
    scoreTechnicalReadiness(data),
    scoreCandidateAcquisition(data),
    scoreEmployerAcquisition(data),
    scoreOutreachReadiness(data),
    scoreMigrationCorridorReadiness(data),
    scoreDueDiligenceReadiness(data),
    scoreRevenueReadiness(data),
    scoreComplianceReadiness(data),
  ]
}

// ── Launch Blockers ──────────────────────────────────────────────────────────

export function generateLaunchBlockers(data: PilotLiveData): LaunchBlocker[] {
  const blockers: LaunchBlocker[] = []

  if (data.pilotActive === 0) {
    blockers.push({
      id: 'no_active_pilot_employer',
      priority: 'critical',
      title: 'Kein aktiver Pilot-Arbeitgeber',
      description: 'Noch kein Arbeitgeber im Status "active_pilot". Echter Pilot kann nicht starten.',
      resolution: 'Manuellen Outreach starten, Demo durchführen, ersten Arbeitgeber ins Onboarding bringen.',
      blocksLaunch: true,
    })
  }

  if (data.candidates < 3) {
    blockers.push({
      id: 'insufficient_real_candidates',
      priority: 'critical',
      title: 'Zu wenige echte Kandidaten',
      description: `Nur ${data.candidates} echte Kandidaten registriert. Für sinnvolle Matches mindestens 10 benötigt.`,
      resolution: 'Kandidaten über Onboarding-Flow, Community, Social Media gewinnen.',
      blocksLaunch: true,
    })
  }

  if (data.candidatesWithCv === 0) {
    blockers.push({
      id: 'no_cv_uploads',
      priority: 'high',
      title: 'Keine CV-Uploads vorhanden',
      description: 'Kein Kandidat hat ein CV hochgeladen. Arbeitgeber können Profile nicht bewerten.',
      resolution: 'Kandidaten aktiv zur CV-Upload-Nutzung animieren (Dashboard-Hinweis vorhanden).',
      blocksLaunch: false,
    })
  }

  if (data.pilotContacted < 3) {
    blockers.push({
      id: 'outreach_not_started',
      priority: 'high',
      title: 'Manuelle Outreach unzureichend',
      description: `Nur ${data.pilotContacted} Arbeitgeber manuell kontaktiert. Ziel: ≥5 pro Woche.`,
      resolution: 'Outreach starten: /admin/pilot-outreach (Templates) + /admin/pilot-offer (Angebotsvarianten) + /admin/employer-responses (Antworten protokollieren).',
      blocksLaunch: false,
    })
  }

  // Datenschutz-Prüfung
  blockers.push({
    id: 'legal_review_missing',
    priority: 'high',
    title: 'Rechtsprüfung international fehlt',
    description: 'Keine dokumentierte Rechtsgrundlage für länderübergreifende Arbeitsvermittlung.',
    resolution: 'Rechtsberatung für internationales Arbeitsrecht (Zielländer) einholen.',
    blocksLaunch: false,
  })

  if (data.dueDiligenceSections === null || (data.dueDiligenceSections ?? 0) === 0) {
    blockers.push({
      id: 'no_due_diligence',
      priority: 'medium',
      title: 'Due-Diligence-Dokumentation fehlt',
      description: 'Keine strukturierte Due-Diligence-Dokumentation für potenzielle Käufer/Investoren.',
      resolution: 'Sale-Readiness-Modul nutzen: /admin/sale-readiness.',
      blocksLaunch: false,
    })
  }

  blockers.push({
    id: 'no_verified_revenue',
    priority: 'medium',
    title: 'Kein verifizierter Umsatz',
    description: 'Keine echten Zahlungstransaktionen. Revenue Intelligence zeigt nur Schätzungen.',
    resolution: 'Ersten Pilotkunden mit Basis-Pricing konvertieren (nach Demo).',
    blocksLaunch: false,
  })

  if (data.landingpages === null || (data.landingpages ?? 0) === 0) {
    blockers.push({
      id: 'no_landingpages',
      priority: 'medium',
      title: 'Keine Landingpages konfiguriert',
      description: 'Landingpage-Factory-Modul existiert, aber keine Landingpages angelegt.',
      resolution: 'Landingpage-Factory nutzen: /admin/global/landingpage-factory.',
      blocksLaunch: false,
    })
  }

  blockers.push({
    id: 'no_conversion_data',
    priority: 'low',
    title: 'Keine echten Conversion-Daten',
    description: 'Kein A/B-Test, keine Conversion-Rate, keine Retention-Daten aus realen Nutzern.',
    resolution: 'Nach erstem Pilotkunden: Conversion-Tracking einrichten.',
    blocksLaunch: false,
  })

  // Sortierung: critical → high → medium → low
  const order = { critical: 0, high: 1, medium: 2, low: 3 }
  return blockers.sort((a, b) => order[a.priority] - order[b.priority])
}

// ── 7-Day Plan ───────────────────────────────────────────────────────────────

export function generate7DayPlan(): DayPlan[] {
  return [
    {
      day: 1,
      title: 'Zielkorridor & Grundlage prüfen',
      tasks: [
        'Top-Korridor nach Opportunity-Score auswählen (/admin/global/corridors)',
        '10 Pilot-Arbeitgeber in diesem Korridor identifizieren und prüfen',
        '20 Kandidatenquellen für diesen Korridor priorisieren',
        'E2E-Pilot-Test ausführen: /admin/e2e-pilot-test',
      ],
      module: 'Corridor Intelligence',
      moduleUrl: '/admin/global/corridor-intelligence',
    },
    {
      day: 2,
      title: 'Outreach & Risiko vorbereiten',
      tasks: [
        'Passende Landingpage-Variante auswählen oder erstellen',
        'Outreach-Sequenz für Top-5-Arbeitgeber vorbereiten (/admin/pilot-outreach)',
        'Neutrale Signatur "Global Talent Bridge Team" in allen Templates prüfen',
        'Risiko-Check durchführen: Rechtsgrundlage, DSGVO, Zielland-Compliance',
      ],
      module: 'Pilot Outreach',
      moduleUrl: '/admin/pilot-outreach',
    },
    {
      day: 3,
      title: 'Manuelle Arbeitgeberansprache starten',
      tasks: [
        'Erste 3 Outreach-Nachrichten manuell senden (E-Mail oder LinkedIn)',
        'Kandidatenquellen für diesen Korridor konkret ansprechen',
        'Kandidaten zu CV-Upload und Profil-Vervollständigung motivieren',
        'Status nach Versand in Outreach-Cockpit auf contacted_manual setzen',
      ],
      module: 'Pilot Outreach',
      moduleUrl: '/admin/pilot-outreach',
    },
    {
      day: 4,
      title: 'Antworten prüfen & Messaging verbessern',
      tasks: [
        'Eingehende Antworten prüfen und Status aktualisieren',
        'Nicht-antwortende Arbeitgeber: Follow-up vorbereiten',
        'Template-Text basierend auf erstem Feedback anpassen',
        'Kandidaten-Pipeline prüfen: neue Profile vorhanden?',
      ],
      module: 'Pilot Outreach',
      moduleUrl: '/admin/pilot-outreach',
    },
    {
      day: 5,
      title: 'Pilot-KPIs prüfen',
      tasks: [
        'CEO Dashboard öffnen: Outreach-Funnel-KPIs prüfen',
        'Anzahl Antworten vs. gesendete Nachrichten — Response Rate berechnen',
        'Demo-Termine: vorbereiten, Kandidatenprofile bereitstellen',
        'Launch Readiness Score prüfen: /admin/pilot-execution',
      ],
      module: 'CEO Dashboard',
      moduleUrl: '/admin/ceo-dashboard',
    },
    {
      day: 6,
      title: 'Buyer Evidence aktualisieren',
      tasks: [
        'Exit Readiness Evidence Pack prüfen: /admin/exit-readiness',
        'Buyer Checklist aktualisieren (was ist jetzt real vorhanden?)',
        'Risiko-Register reviewen — neue Risiken aufnehmen',
        'Proof-of-Concept dokumentieren: was zeigt das System, was ist noch Demo?',
      ],
      module: 'Exit Readiness',
      moduleUrl: '/admin/exit-readiness',
    },
    {
      day: 7,
      title: 'Pilot Go/No-Go Entscheidung',
      tasks: [
        'Readiness Score prüfen: ≥60% für Go empfohlen',
        'Critical Blocker: alle behoben oder mitigiert?',
        'Ersten Demo-Termin abhalten oder bestätigen',
        'Entscheidung: Pilot starten / 1 Woche verlängern / Strategie anpassen',
      ],
      module: 'Pilot Execution',
      moduleUrl: '/admin/pilot-execution',
    },
  ]
}

// ── Corridor Execution Cards ─────────────────────────────────────────────────

function riskFromScores(supply: number, demand: number): 'low' | 'medium' | 'high' {
  const avg = (supply + demand) / 2
  if (avg >= 75) return 'low'
  if (avg >= 55) return 'medium'
  return 'high'
}

function landingpageAngle(sector: string, source: string): string {
  const s = sector.toLowerCase()
  if (s.includes('pflege') || s.includes('care') || s.includes('nursing'))
    return `"Qualifizierte Pflegekräfte aus ${source} — jetzt anfragen"`
  if (s.includes('it') || s.includes('software'))
    return `"Senior Developer aus ${source} für Ihr Tech-Team"`
  if (s.includes('ingenieur') || s.includes('technik'))
    return `"Ingenieure aus ${source} — sofort verfügbar"`
  return `"Internationale Fachkräfte aus ${source} — vorgekqualifiziert"`
}

function outreachAngle(sector: string, target: string): string {
  const s = sector.toLowerCase()
  if (s.includes('pflege') || s.includes('care') || s.includes('nursing'))
    return `Pflegeheim/Klinik in ${target}: Fokus auf Personalmangel + Anerkennungsbegleitung`
  if (s.includes('it') || s.includes('software'))
    return `Tech-Unternehmen in ${target}: Fokus auf geprüfte Skills + strukturiertes Matching`
  return `Arbeitgeber in ${target}: Fokus auf vorqualifizierte internationale Kandidaten`
}

function nextBestAction(opportunityScore: number, priorityLevel: string): string {
  if (priorityLevel === 'critical')
    return 'Sofort priorisieren: Demo vorbereiten und Arbeitgeber aktiv ansprechen'
  if (priorityLevel === 'high')
    return 'In diesem Quartal starten: Korridorkampagne aufsetzen'
  if (priorityLevel === 'medium')
    return 'Nach Priority-Korridoren angehen: Sourcing-Daten sammeln'
  return 'Für spätere Expansion vormerken'
}

export function buildCorridorCards(corridors: MigrationCorridorRow[]): CorridorCard[] {
  if (corridors.length === 0) {
    // Demo-Korridor als Fallback
    return [{
      name: 'Philippinen → Deutschland (Pflege)',
      sourceCountry: 'Philippinen',
      targetCountry: 'Deutschland',
      sector: 'Pflege',
      supplyScore: 80,
      demandScore: 85,
      opportunityScore: 83,
      riskLevel: 'low',
      landingpageAngle: '"Qualifizierte Pflegekräfte aus den Philippinen — jetzt anfragen"',
      outreachAngle: 'Pflegeheim/Klinik in Deutschland: Fokus auf Personalmangel + B1/B2 Deutschkenntnisse',
      nextBestAction: 'Demo-Korridor — echte Daten noch nicht konfiguriert',
      isExample: true,
    }]
  }
  return corridors.map((c) => ({
    name: `${c.sourceCountry} → ${c.targetCountry} (${c.sector})`,
    sourceCountry: c.sourceCountry,
    targetCountry: c.targetCountry,
    sector: c.sector,
    supplyScore: c.supplyScore,
    demandScore: c.demandScore,
    opportunityScore: c.opportunityScore,
    riskLevel: riskFromScores(c.supplyScore, c.demandScore),
    landingpageAngle: landingpageAngle(c.sector, c.sourceCountry),
    outreachAngle: outreachAngle(c.sector, c.targetCountry),
    nextBestAction: nextBestAction(c.opportunityScore, c.priorityLevel),
    isExample: false,
  }))
}

// ── KPI Snapshot ─────────────────────────────────────────────────────────────

export function buildKpiSnapshot(data: PilotLiveData): KpiSnapshot {
  return {
    candidates:          data.candidates,
    candidatesWithCv:    data.candidatesWithCv,
    activeJobs:          data.activeJobs,
    applications:        data.applications,
    pilotEmployers:      data.pilotEmployers,
    pilotByStatus: {
      identified:       data.pilotIdentified,
      contacted_manual: data.pilotContacted,
      interested:       data.pilotInterested,
      demo_scheduled:   data.pilotDemo,
      onboarding:       data.pilotOnboarding,
      active_pilot:     data.pilotActive,
      rejected:         data.pilotRejected,
    },
    outreachPrepared:    data.pilotEmployers,
    migrationCorridors:  data.migrationCorridors,
    openTasks:           data.openTasks,
    systemLogs:          data.systemLogs,
    landingpages:        data.landingpages === null ? 'not_configured' : data.landingpages,
    dueDiligenceSections:data.dueDiligenceSections === null ? 'not_configured' : data.dueDiligenceSections,
    revenueEstimated:    'estimated',
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const VALID_PILOT_STATUSES = [
  'identified',
  'contacted_manual',
  'interested',
  'demo_scheduled',
  'onboarding',
  'active_pilot',
  'rejected',
] as const

export type ValidPilotStatus = typeof VALID_PILOT_STATUSES[number]

export function isValidPilotStatus(status: string): status is ValidPilotStatus {
  return VALID_PILOT_STATUSES.includes(status as ValidPilotStatus)
}
