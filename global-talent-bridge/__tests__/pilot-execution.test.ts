/**
 * pilot-execution.test.ts
 *
 * Unit-Tests für lib/pilot-execution.ts
 * Testet: Readiness-Scoring, Launch-Blocker, 7-Day-Plan,
 *         Corridor Cards, KPI Snapshot, Status-Validierung.
 */
import { describe, it, expect } from 'vitest'
import {
  scoreTechnicalReadiness,
  scoreCandidateAcquisition,
  scoreEmployerAcquisition,
  scoreOutreachReadiness,
  scoreMigrationCorridorReadiness,
  scoreDueDiligenceReadiness,
  scoreRevenueReadiness,
  scoreComplianceReadiness,
  computeOverallReadinessScore,
  computeAllCategories,
  generateLaunchBlockers,
  generate7DayPlan,
  buildCorridorCards,
  buildKpiSnapshot,
  isValidPilotStatus,
  VALID_PILOT_STATUSES,
  type PilotLiveData,
  type MigrationCorridorRow,
} from '@/lib/pilot-execution'

// ── Test-Fixtures ────────────────────────────────────────────────────────────

const FULL_DATA: PilotLiveData = {
  candidates: 5,
  candidatesWithCv: 3,
  activeJobs: 3,
  applications: 5,
  pilotEmployers: 10,
  pilotActive: 2,
  pilotInterested: 3,
  pilotDemo: 2,
  pilotContacted: 2,
  pilotIdentified: 1,
  pilotOnboarding: 0,
  pilotRejected: 0,
  pilotCandidates: 25,
  outreachTargets: 6,
  migrationCorridors: 8,
  openTasks: 3,
  systemLogs: 20,
  profiles: 5,
  testsPassing: 246,
  landingpages: null,
  dueDiligenceSections: null,
}

const EMPTY_DATA: PilotLiveData = {
  candidates: 0,
  candidatesWithCv: 0,
  activeJobs: 0,
  applications: 0,
  pilotEmployers: 0,
  pilotActive: 0,
  pilotInterested: 0,
  pilotDemo: 0,
  pilotContacted: 0,
  pilotIdentified: 0,
  pilotOnboarding: 0,
  pilotRejected: 0,
  pilotCandidates: 0,
  outreachTargets: 0,
  migrationCorridors: 0,
  openTasks: 0,
  systemLogs: 0,
  profiles: 0,
  testsPassing: 0,
  landingpages: null,
  dueDiligenceSections: null,
}

// ── Technical Readiness ──────────────────────────────────────────────────────

describe('scoreTechnicalReadiness', () => {
  it('voller Datensatz → hoher Score', () => {
    const r = scoreTechnicalReadiness(FULL_DATA)
    expect(r.score).toBeGreaterThanOrEqual(60)
    expect(r.status).toBe('ready')
  })

  it('leerer Datensatz → niederer Score', () => {
    const r = scoreTechnicalReadiness(EMPTY_DATA)
    expect(r.score).toBeLessThan(50)
  })

  it('hat key "technical"', () => {
    expect(scoreTechnicalReadiness(FULL_DATA).key).toBe('technical')
  })

  it('hat label, explanation, nextAction', () => {
    const r = scoreTechnicalReadiness(FULL_DATA)
    expect(r.label.length).toBeGreaterThan(0)
    expect(r.explanation.length).toBeGreaterThan(0)
    expect(r.nextAction.length).toBeGreaterThan(0)
  })

  it('246 Tests → 40 Punkte vom Score', () => {
    const withTests = scoreTechnicalReadiness({ ...EMPTY_DATA, testsPassing: 246 })
    const withoutTests = scoreTechnicalReadiness({ ...EMPTY_DATA, testsPassing: 0 })
    expect(withTests.score).toBeGreaterThan(withoutTests.score)
  })
})

// ── Candidate Acquisition ────────────────────────────────────────────────────

describe('scoreCandidateAcquisition', () => {
  it('0 Kandidaten → warning', () => {
    const r = scoreCandidateAcquisition(EMPTY_DATA)
    expect(r.status).toBe('warning')
  })

  it('mit Kandidaten und CVs → höherer Score', () => {
    const r = scoreCandidateAcquisition(FULL_DATA)
    expect(r.score).toBeGreaterThan(scoreCandidateAcquisition(EMPTY_DATA).score)
  })

  it('key ist "candidate_acquisition"', () => {
    expect(scoreCandidateAcquisition(FULL_DATA).key).toBe('candidate_acquisition')
  })

  it('nextAction enthält Hinweis für 0 Kandidaten', () => {
    const r = scoreCandidateAcquisition({ ...EMPTY_DATA, candidates: 0 })
    expect(r.nextAction).toContain('Onboarding')
  })
})

// ── Employer Acquisition ─────────────────────────────────────────────────────

describe('scoreEmployerAcquisition', () => {
  it('kein aktiver Pilot → blocked oder warning', () => {
    const r = scoreEmployerAcquisition({ ...FULL_DATA, pilotActive: 0, pilotInterested: 0, pilotDemo: 0 })
    expect(['blocked', 'warning']).toContain(r.status)
  })

  it('aktiver Pilot → ready', () => {
    const r = scoreEmployerAcquisition(FULL_DATA)
    expect(r.status).toBe('ready')
  })

  it('key ist "employer_acquisition"', () => {
    expect(scoreEmployerAcquisition(FULL_DATA).key).toBe('employer_acquisition')
  })

  it('score steigt mit aktivem Pilot', () => {
    const without = scoreEmployerAcquisition({ ...EMPTY_DATA })
    const withActive = scoreEmployerAcquisition({ ...FULL_DATA })
    expect(withActive.score).toBeGreaterThan(without.score)
  })
})

// ── Outreach Readiness ───────────────────────────────────────────────────────

describe('scoreOutreachReadiness', () => {
  it('mit Arbeitgebern und Kontakten → ready', () => {
    const r = scoreOutreachReadiness(FULL_DATA)
    expect(r.status).toBe('ready')
    expect(r.score).toBeGreaterThanOrEqual(80)
  })

  it('ohne Kontakte → warning oder blocked', () => {
    const r = scoreOutreachReadiness({ ...EMPTY_DATA, pilotEmployers: 5 })
    expect(['warning', 'blocked']).toContain(r.status)
  })

  it('key ist "outreach"', () => {
    expect(scoreOutreachReadiness(FULL_DATA).key).toBe('outreach')
  })
})

// ── Migration Corridor ───────────────────────────────────────────────────────

describe('scoreMigrationCorridorReadiness', () => {
  it('8 Korridore → ready, hoher Score', () => {
    const r = scoreMigrationCorridorReadiness(FULL_DATA)
    expect(r.score).toBe(100)
    expect(r.status).toBe('ready')
  })

  it('0 Korridore → blocked', () => {
    const r = scoreMigrationCorridorReadiness(EMPTY_DATA)
    expect(r.status).toBe('blocked')
  })

  it('key ist "migration_corridor"', () => {
    expect(scoreMigrationCorridorReadiness(FULL_DATA).key).toBe('migration_corridor')
  })
})

// ── Due Diligence ────────────────────────────────────────────────────────────

describe('scoreDueDiligenceReadiness', () => {
  it('ohne Tabelle (null) → warning, niederer Score', () => {
    const r = scoreDueDiligenceReadiness(EMPTY_DATA)
    expect(r.status).toBe('warning')
    expect(r.score).toBeLessThan(40)
  })

  it('mit Sections → warning (noch nicht ready ohne externe Prüfung)', () => {
    const r = scoreDueDiligenceReadiness({ ...FULL_DATA, dueDiligenceSections: 5 })
    expect(r.status).toBe('warning')
  })

  it('key ist "due_diligence"', () => {
    expect(scoreDueDiligenceReadiness(FULL_DATA).key).toBe('due_diligence')
  })
})

// ── Revenue Readiness ────────────────────────────────────────────────────────

describe('scoreRevenueReadiness', () => {
  it('ohne echten Umsatz → blocked (kein aktiver Pilot)', () => {
    const r = scoreRevenueReadiness(EMPTY_DATA)
    expect(r.status).toBe('blocked')
  })

  it('mit aktivem Pilot → warning (noch kein Stripe)', () => {
    const r = scoreRevenueReadiness(FULL_DATA)
    expect(r.status).toBe('warning')
  })

  it('key ist "revenue"', () => {
    expect(scoreRevenueReadiness(FULL_DATA).key).toBe('revenue')
  })

  it('explanation erwähnt kein echten Umsatz', () => {
    const r = scoreRevenueReadiness(FULL_DATA)
    expect(r.explanation.toLowerCase()).toContain('umsatz')
  })
})

// ── Compliance ───────────────────────────────────────────────────────────────

describe('scoreComplianceReadiness', () => {
  it('immer warning (keine externe Rechtsberatung dokumentiert)', () => {
    expect(scoreComplianceReadiness(FULL_DATA).status).toBe('warning')
    expect(scoreComplianceReadiness(EMPTY_DATA).status).toBe('warning')
  })

  it('key ist "compliance"', () => {
    expect(scoreComplianceReadiness(FULL_DATA).key).toBe('compliance')
  })

  it('nextAction erwähnt Rechtsprüfung', () => {
    const r = scoreComplianceReadiness(FULL_DATA)
    expect(r.nextAction.toLowerCase()).toContain('recht')
  })
})

// ── computeOverallReadinessScore ─────────────────────────────────────────────

describe('computeOverallReadinessScore', () => {
  it('leere Liste → 0', () => {
    expect(computeOverallReadinessScore([])).toBe(0)
  })

  it('Durchschnitt aller Kategorien', () => {
    const cats = computeAllCategories(FULL_DATA)
    const score = computeOverallReadinessScore(cats)
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('volle Daten → höherer Score als leere Daten', () => {
    const fullScore = computeOverallReadinessScore(computeAllCategories(FULL_DATA))
    const emptyScore = computeOverallReadinessScore(computeAllCategories(EMPTY_DATA))
    expect(fullScore).toBeGreaterThan(emptyScore)
  })
})

// ── computeAllCategories ─────────────────────────────────────────────────────

describe('computeAllCategories', () => {
  it('gibt 8 Kategorien zurück', () => {
    expect(computeAllCategories(FULL_DATA)).toHaveLength(8)
  })

  it('alle Kategorien haben valide Status', () => {
    const cats = computeAllCategories(FULL_DATA)
    for (const cat of cats) {
      expect(['ready', 'warning', 'blocked']).toContain(cat.status)
    }
  })

  it('alle Scores sind 0-100', () => {
    const cats = computeAllCategories(FULL_DATA)
    for (const cat of cats) {
      expect(cat.score).toBeGreaterThanOrEqual(0)
      expect(cat.score).toBeLessThanOrEqual(100)
    }
  })

  it('alle Keys sind eindeutig', () => {
    const cats = computeAllCategories(FULL_DATA)
    const keys = cats.map((c) => c.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

// ── generateLaunchBlockers ───────────────────────────────────────────────────

describe('generateLaunchBlockers', () => {
  it('ohne aktiven Pilot → critical blocker vorhanden', () => {
    const blockers = generateLaunchBlockers({ ...EMPTY_DATA })
    const critical = blockers.filter((b) => b.priority === 'critical')
    expect(critical.length).toBeGreaterThan(0)
  })

  it('sortiert: critical zuerst', () => {
    const blockers = generateLaunchBlockers(EMPTY_DATA)
    const firstPriority = blockers[0].priority
    expect(firstPriority).toBe('critical')
  })

  it('kein kritischer Blocker wenn alles voll', () => {
    const fullWithActive = { ...FULL_DATA, pilotActive: 1, candidates: 10, candidatesWithCv: 5, pilotContacted: 5 }
    const blockers = generateLaunchBlockers(fullWithActive)
    const critical = blockers.filter((b) => b.priority === 'critical')
    expect(critical.length).toBe(0)
  })

  it('jeder Blocker hat id, title, description, resolution', () => {
    const blockers = generateLaunchBlockers(EMPTY_DATA)
    for (const b of blockers) {
      expect(b.id.length).toBeGreaterThan(0)
      expect(b.title.length).toBeGreaterThan(0)
      expect(b.description.length).toBeGreaterThan(0)
      expect(b.resolution.length).toBeGreaterThan(0)
    }
  })

  it('alle Prioritäten sind gültig', () => {
    const blockers = generateLaunchBlockers(EMPTY_DATA)
    for (const b of blockers) {
      expect(['critical', 'high', 'medium', 'low']).toContain(b.priority)
    }
  })

  it('"draft" und "demo_requested" erscheinen nicht in Blocker-IDs', () => {
    const blockers = generateLaunchBlockers(EMPTY_DATA)
    for (const b of blockers) {
      expect(b.id).not.toContain('draft')
      expect(b.id).not.toContain('demo_requested')
    }
  })
})

// ── generate7DayPlan ─────────────────────────────────────────────────────────

describe('generate7DayPlan', () => {
  it('gibt genau 7 Tage zurück', () => {
    expect(generate7DayPlan()).toHaveLength(7)
  })

  it('Tage sind nummeriert 1-7', () => {
    const plan = generate7DayPlan()
    plan.forEach((day, i) => {
      expect(day.day).toBe(i + 1)
    })
  })

  it('jeder Tag hat tasks, title, module, moduleUrl', () => {
    const plan = generate7DayPlan()
    for (const day of plan) {
      expect(day.tasks.length).toBeGreaterThan(0)
      expect(day.title.length).toBeGreaterThan(0)
      expect(day.module.length).toBeGreaterThan(0)
      expect(day.moduleUrl).toMatch(/^\/admin\//)
    }
  })

  it('Tag 7 enthält Go/No-Go Entscheidung', () => {
    const day7 = generate7DayPlan()[6]
    expect(day7.title.toLowerCase()).toContain('go')
  })
})

// ── buildCorridorCards ───────────────────────────────────────────────────────

describe('buildCorridorCards', () => {
  const corridors: MigrationCorridorRow[] = [
    { sourceCountry: 'Philippinen', targetCountry: 'Deutschland', sector: 'Pflege', supplyScore: 80, demandScore: 85, opportunityScore: 83, priorityLevel: 'critical' },
    { sourceCountry: 'Indien', targetCountry: 'Kanada', sector: 'IT / Software', supplyScore: 85, demandScore: 90, opportunityScore: 88, priorityLevel: 'critical' },
  ]

  it('gibt Karten für alle Korridore zurück', () => {
    const cards = buildCorridorCards(corridors)
    expect(cards).toHaveLength(2)
  })

  it('leere Liste → Demo-Korridor als Fallback (isExample=true)', () => {
    const cards = buildCorridorCards([])
    expect(cards).toHaveLength(1)
    expect(cards[0].isExample).toBe(true)
  })

  it('echte Korridore → isExample=false', () => {
    const cards = buildCorridorCards(corridors)
    for (const card of cards) {
      expect(card.isExample).toBe(false)
    }
  })

  it('Pflege-Korridor hat Pflege-Landingpage-Angle', () => {
    const cards = buildCorridorCards([corridors[0]])
    expect(cards[0].landingpageAngle.toLowerCase()).toContain('pflege')
  })

  it('IT-Korridor hat IT-Landingpage-Angle', () => {
    const cards = buildCorridorCards([corridors[1]])
    expect(cards[0].landingpageAngle.toLowerCase()).toContain('developer')
  })

  it('hohe Scores → low risk', () => {
    const cards = buildCorridorCards(corridors)
    expect(cards[0].riskLevel).toBe('low')
  })

  it('jede Karte hat name, nextBestAction, outreachAngle', () => {
    const cards = buildCorridorCards(corridors)
    for (const card of cards) {
      expect(card.name.length).toBeGreaterThan(0)
      expect(card.nextBestAction.length).toBeGreaterThan(0)
      expect(card.outreachAngle.length).toBeGreaterThan(0)
    }
  })
})

// ── buildKpiSnapshot ─────────────────────────────────────────────────────────

describe('buildKpiSnapshot', () => {
  it('Landingpages null → "not_configured"', () => {
    const snap = buildKpiSnapshot({ ...FULL_DATA, landingpages: null })
    expect(snap.landingpages).toBe('not_configured')
  })

  it('DueDiligence null → "not_configured"', () => {
    const snap = buildKpiSnapshot({ ...FULL_DATA, dueDiligenceSections: null })
    expect(snap.dueDiligenceSections).toBe('not_configured')
  })

  it('pilotByStatus enthält genau die 7 gültigen Status', () => {
    const snap = buildKpiSnapshot(FULL_DATA)
    const keys = Object.keys(snap.pilotByStatus)
    expect(keys).toContain('identified')
    expect(keys).toContain('contacted_manual')
    expect(keys).toContain('interested')
    expect(keys).toContain('demo_scheduled')
    expect(keys).toContain('onboarding')
    expect(keys).toContain('active_pilot')
    expect(keys).toContain('rejected')
    expect(keys).toHaveLength(7)
    // Ungültige Status dürfen nicht enthalten sein
    expect(keys).not.toContain('draft')
    expect(keys).not.toContain('demo_requested')
  })

  it('revenueEstimated ist "estimated"', () => {
    const snap = buildKpiSnapshot(FULL_DATA)
    expect(snap.revenueEstimated).toBe('estimated')
  })
})

// ── isValidPilotStatus ───────────────────────────────────────────────────────

describe('isValidPilotStatus — Status-Validierung', () => {
  it('alle 7 gültigen Status werden akzeptiert', () => {
    for (const s of VALID_PILOT_STATUSES) {
      expect(isValidPilotStatus(s)).toBe(true)
    }
  })

  it('"draft" ist ungültig', () => {
    expect(isValidPilotStatus('draft')).toBe(false)
  })

  it('"demo_requested" ist ungültig', () => {
    expect(isValidPilotStatus('demo_requested')).toBe(false)
  })

  it('leerer String ist ungültig', () => {
    expect(isValidPilotStatus('')).toBe(false)
  })

  it('"active" (ohne _pilot) ist ungültig', () => {
    expect(isValidPilotStatus('active')).toBe(false)
  })

  it('VALID_PILOT_STATUSES hat genau 7 Einträge', () => {
    expect(VALID_PILOT_STATUSES).toHaveLength(7)
  })
})
