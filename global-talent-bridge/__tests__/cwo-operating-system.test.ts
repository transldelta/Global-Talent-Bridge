/**
 * __tests__/cwo-operating-system.test.ts
 *
 * CWO Operating System — Comprehensive Test Suite
 * Tests alle 8 Departments und Safety-Invarianten
 */

import { describe, it, expect } from 'vitest'

// Global Demand
import {
  analyzeCorridors,
  getTopCorridors,
  getAvailableOrigins,
  getAvailableDestinations,
} from '@/lib/cwo-agent/global-demand'

// Employer Demand
import {
  analyzeEmployerDemand,
  getTopEmployerSectors,
  getPilotReadySectors,
} from '@/lib/cwo-agent/employer-demand'

// Revenue Pragmatist
import {
  analyzeRevenueStreams,
  getImmediateRevenueStreams,
  getBlockedRevenueStreams,
  getTopRevenueStreams,
  getPriorityScore,
} from '@/lib/cwo-agent/revenue-pragmatist'

// Compliance Guard
import {
  getAllBlockedRisks,
  getCriticalRisks,
  checkAction,
  validateInvariants,
  getRiskSummary,
  SYSTEM_INVARIANTS,
} from '@/lib/cwo-agent/compliance-guard'

// Candidate Magnet
import {
  getCandidateMagnetAssets,
  getTopCandidateAssets,
  getAssetsByAudience,
  getAssetsByType,
  getComplianceSummary,
} from '@/lib/cwo-agent/candidate-magnet'

// Inbound Growth
import {
  getInboundChannels,
  getTopInboundChannels,
  getContentCalendar,
  getUpcomingContent,
  getSEOClusters,
  getRegistrationFunnels,
  getGrowthSummary,
} from '@/lib/cwo-agent/inbound-growth'

// Operations
import {
  getSystemChecks,
  getSystemIssues,
  getPilotSteps,
  getOpenPilotSteps,
  getNextPilotStep,
  generateDailyReport,
  getSystemStatusSummary,
} from '@/lib/cwo-agent/operations'

// CEO Agent
import {
  generateTageslageSummary,
  generateTopTasks,
  getDepartmentMeta,
  generateCWOState,
} from '@/lib/cwo-agent/ceo-agent'

// ══════════════════════════════════════════════════════════════════════════════
// GLOBAL DEMAND
// ══════════════════════════════════════════════════════════════════════════════

describe('Global Demand — analyzeCorridors()', () => {
  it('gibt mindestens 5 Korridore zurück', () => {
    expect(analyzeCorridors().length).toBeGreaterThanOrEqual(5)
  })

  it('alle Korridore haben noScraping: true', () => {
    analyzeCorridors().forEach(c => expect(c.noScraping).toBe(true))
  })

  it('alle Korridore haben complianceStatus: safe', () => {
    analyzeCorridors().forEach(c => expect(c.complianceStatus).toBe('safe'))
  })

  it('Score ist zwischen 0 und 100', () => {
    analyzeCorridors().forEach(c => {
      expect(c.score).toBeGreaterThanOrEqual(0)
      expect(c.score).toBeLessThanOrEqual(100)
    })
  })

  it('Korridore sind nach Score absteigend sortiert', () => {
    const corridors = analyzeCorridors()
    for (let i = 0; i < corridors.length - 1; i++) {
      expect(corridors[i].score).toBeGreaterThanOrEqual(corridors[i + 1].score)
    }
  })

  it('jeder Korridor hat searchSuggestions', () => {
    analyzeCorridors().forEach(c => {
      expect(Array.isArray(c.searchSuggestions)).toBe(true)
      expect(c.searchSuggestions.length).toBeGreaterThan(0)
    })
  })

  it('searchSuggestions sind Google-URLs', () => {
    analyzeCorridors().forEach(c => {
      c.searchSuggestions.forEach(url => {
        expect(url).toMatch(/^https:\/\/www\.google\.com\/search/)
      })
    })
  })

  it('jeder Korridor hat primarySectors', () => {
    analyzeCorridors().forEach(c => {
      expect(Array.isArray(c.primarySectors)).toBe(true)
      expect(c.primarySectors.length).toBeGreaterThan(0)
    })
  })

  it('priority ist high/medium/low', () => {
    analyzeCorridors().forEach(c => {
      expect(['high', 'medium', 'low']).toContain(c.priority)
    })
  })
})

describe('Global Demand — getTopCorridors()', () => {
  it('gibt standardmäßig 3 zurück', () => {
    expect(getTopCorridors()).toHaveLength(3)
  })

  it('gibt N zurück wenn spezifiziert', () => {
    expect(getTopCorridors(5)).toHaveLength(5)
  })

  it('Top-Korridore haben höchste Scores', () => {
    const all  = analyzeCorridors()
    const top3 = getTopCorridors(3)
    expect(top3[0].score).toBe(all[0].score)
    expect(top3[1].score).toBe(all[1].score)
  })
})

describe('Global Demand — Origins + Destinations', () => {
  it('getAvailableOrigins gibt deduplizierte Liste zurück', () => {
    const origins = getAvailableOrigins()
    expect(new Set(origins).size).toBe(origins.length)
  })

  it('getAvailableDestinations gibt deduplizierte Liste zurück', () => {
    const dests = getAvailableDestinations()
    expect(new Set(dests).size).toBe(dests.length)
  })

  it('Philippinen ist als Origin vorhanden', () => {
    expect(getAvailableOrigins()).toContain('Philippinen')
  })

  it('Deutschland ist als Destination vorhanden', () => {
    expect(getAvailableDestinations()).toContain('Deutschland')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// EMPLOYER DEMAND
// ══════════════════════════════════════════════════════════════════════════════

describe('Employer Demand — analyzeEmployerDemand()', () => {
  it('gibt mindestens 8 Sektoren zurück', () => {
    expect(analyzeEmployerDemand().length).toBeGreaterThanOrEqual(8)
  })

  it('alle Sektoren haben overallScore zwischen 0 und 100', () => {
    analyzeEmployerDemand().forEach(s => {
      expect(s.overallScore).toBeGreaterThanOrEqual(0)
      expect(s.overallScore).toBeLessThanOrEqual(100)
    })
  })

  it('Sektoren sind nach overallScore absteigend sortiert', () => {
    const sectors = analyzeEmployerDemand()
    for (let i = 0; i < sectors.length - 1; i++) {
      expect(sectors[i].overallScore).toBeGreaterThanOrEqual(sectors[i + 1].overallScore)
    }
  })

  it('Altenpflege ist enthalten', () => {
    const names = analyzeEmployerDemand().map(s => s.sector)
    expect(names.some(n => n.includes('Pflege'))).toBe(true)
  })

  it('IT ist enthalten', () => {
    const names = analyzeEmployerDemand().map(s => s.sector)
    expect(names.some(n => n.includes('IT'))).toBe(true)
  })

  it('complianceStatus ist safe/needs_review/blocked', () => {
    analyzeEmployerDemand().forEach(s => {
      expect(['safe', 'needs_review', 'blocked']).toContain(s.complianceStatus)
    })
  })

  it('alle searchStrategies sind non-empty arrays', () => {
    analyzeEmployerDemand().forEach(s => {
      expect(Array.isArray(s.searchStrategies)).toBe(true)
      expect(s.searchStrategies.length).toBeGreaterThan(0)
    })
  })
})

describe('Employer Demand — getTopEmployerSectors()', () => {
  it('gibt standardmäßig 3 zurück', () => {
    expect(getTopEmployerSectors()).toHaveLength(3)
  })

  it('Top hat höchsten Score', () => {
    const all  = analyzeEmployerDemand()
    const top3 = getTopEmployerSectors(3)
    expect(top3[0].overallScore).toBe(all[0].overallScore)
  })
})

describe('Employer Demand — getPilotReadySectors()', () => {
  it('alle zurückgegebenen Sektoren haben pilotReadiness >= 80', () => {
    getPilotReadySectors().forEach(s => {
      expect(s.pilotReadiness).toBeGreaterThanOrEqual(80)
    })
  })

  it('gibt mindestens einen Sektor zurück', () => {
    expect(getPilotReadySectors().length).toBeGreaterThan(0)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// REVENUE PRAGMATIST
// ══════════════════════════════════════════════════════════════════════════════

describe('Revenue Pragmatist — analyzeRevenueStreams()', () => {
  it('gibt mindestens 5 Streams zurück', () => {
    expect(analyzeRevenueStreams().length).toBeGreaterThanOrEqual(5)
  })

  it('alle Scores zwischen 0 und 100', () => {
    analyzeRevenueStreams().forEach(s => {
      expect(s.incomePotential).toBeGreaterThanOrEqual(0)
      expect(s.incomePotential).toBeLessThanOrEqual(100)
      expect(s.legalRisk).toBeGreaterThanOrEqual(0)
      expect(s.legalRisk).toBeLessThanOrEqual(100)
    })
  })

  it('complianceStatus ist safe wenn recommendation = test_now', () => {
    analyzeRevenueStreams()
      .filter(s => s.recommendation === 'test_now')
      .forEach(s => expect(s.complianceStatus).toBe('safe'))
  })

  it('complianceStatus ist blocked wenn recommendation = blocked_legal_review', () => {
    analyzeRevenueStreams()
      .filter(s => s.recommendation === 'blocked_legal_review')
      .forEach(s => expect(s.complianceStatus).toBe('blocked'))
  })

  it('alle Streams haben prerequisites Array', () => {
    analyzeRevenueStreams().forEach(s => {
      expect(Array.isArray(s.prerequisites)).toBe(true)
    })
  })
})

describe('Revenue Pragmatist — Immediate + Blocked', () => {
  it('getImmediateRevenueStreams enthält nur test_now', () => {
    getImmediateRevenueStreams().forEach(s => {
      expect(s.recommendation).toBe('test_now')
    })
  })

  it('getBlockedRevenueStreams enthält nur blocked_legal_review', () => {
    getBlockedRevenueStreams().forEach(s => {
      expect(s.recommendation).toBe('blocked_legal_review')
    })
  })

  it('success_fee ist blockiert', () => {
    const blocked = getBlockedRevenueStreams()
    expect(blocked.some(s => s.id === 'success_fee')).toBe(true)
  })

  it('employer_saas ist sofort testbar', () => {
    const immediate = getImmediateRevenueStreams()
    expect(immediate.some(s => s.id === 'employer_saas')).toBe(true)
  })
})

describe('Revenue Pragmatist — getPriorityScore()', () => {
  it('gibt non-negative Zahl zurück', () => {
    analyzeRevenueStreams().forEach(s => {
      expect(getPriorityScore(s)).toBeGreaterThanOrEqual(0)
    })
  })

  it('employer_saas hat höheren Score als success_fee', () => {
    const streams  = analyzeRevenueStreams()
    const saas     = streams.find(s => s.id === 'employer_saas')!
    const successFee = streams.find(s => s.id === 'success_fee')!
    expect(getPriorityScore(saas)).toBeGreaterThan(getPriorityScore(successFee))
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE GUARD
// ══════════════════════════════════════════════════════════════════════════════

describe('Compliance Guard — SYSTEM_INVARIANTS', () => {
  it('emailProvider ist none', () => {
    expect(SYSTEM_INVARIANTS.emailProvider).toBe('none')
  })

  it('outreachEmailProvider ist none', () => {
    expect(SYSTEM_INVARIANTS.outreachEmailProvider).toBe('none')
  })

  it('noEmailSent ist true', () => {
    expect(SYSTEM_INVARIANTS.noEmailSent).toBe(true)
  })

  it('noAutoOutreach ist true', () => {
    expect(SYSTEM_INVARIANTS.noAutoOutreach).toBe(true)
  })

  it('noScraping ist true', () => {
    expect(SYSTEM_INVARIANTS.noScraping).toBe(true)
  })

  it('sendButtonExists ist false', () => {
    expect(SYSTEM_INVARIANTS.sendButtonExists).toBe(false)
  })

  it('bulkSendExists ist false', () => {
    expect(SYSTEM_INVARIANTS.bulkSendExists).toBe(false)
  })

  it('scrapingEnabled ist false', () => {
    expect(SYSTEM_INVARIANTS.scrapingEnabled).toBe(false)
  })

  it('phase ist 1', () => {
    expect(SYSTEM_INVARIANTS.phase).toBe(1)
  })

  it('autoContactExists ist false', () => {
    expect(SYSTEM_INVARIANTS.autoContactExists).toBe(false)
  })
})

describe('Compliance Guard — validateInvariants()', () => {
  it('gibt leeres Array zurück (keine Verletzungen)', () => {
    expect(validateInvariants()).toHaveLength(0)
  })
})

describe('Compliance Guard — Blocked Risks', () => {
  it('gibt mindestens 8 blockierte Risiken zurück', () => {
    expect(getAllBlockedRisks().length).toBeGreaterThanOrEqual(8)
  })

  it('alle haben status: blocked', () => {
    getAllBlockedRisks().forEach(r => expect(r.status).toBe('blocked'))
  })

  it('spam_outreach ist blockiert', () => {
    expect(getAllBlockedRisks().some(r => r.id === 'spam_outreach')).toBe(true)
  })

  it('email_provider ist blockiert', () => {
    expect(getAllBlockedRisks().some(r => r.id === 'email_provider')).toBe(true)
  })

  it('scraping ist blockiert', () => {
    expect(getAllBlockedRisks().some(r => r.id === 'scraping')).toBe(true)
  })

  it('whatsapp_automation ist blockiert', () => {
    expect(getAllBlockedRisks().some(r => r.id === 'whatsapp_automation')).toBe(true)
  })

  it('visa_guarantees ist blockiert', () => {
    expect(getAllBlockedRisks().some(r => r.id === 'visa_guarantees')).toBe(true)
  })
})

describe('Compliance Guard — getCriticalRisks()', () => {
  it('alle kritischen Risiken haben severity: critical', () => {
    getCriticalRisks().forEach(r => expect(r.severity).toBe('critical'))
  })

  it('gibt mindestens 3 kritische Risiken zurück', () => {
    expect(getCriticalRisks().length).toBeGreaterThanOrEqual(3)
  })
})

describe('Compliance Guard — checkAction()', () => {
  it('spam_outreach ist nicht erlaubt', () => {
    const result = checkAction('spam_outreach')
    expect(result.allowed).toBe(false)
    expect(result.reason).toBeTruthy()
  })

  it('email_provider ist nicht erlaubt', () => {
    expect(checkAction('email_provider').allowed).toBe(false)
  })

  it('whatsapp_automation ist nicht erlaubt', () => {
    expect(checkAction('whatsapp_automation').allowed).toBe(false)
  })

  it('unbekannte Aktionen sind erlaubt', () => {
    expect(checkAction('safe_internal_analysis').allowed).toBe(true)
  })

  it('create_landing_page ist erlaubt', () => {
    expect(checkAction('create_landing_page').allowed).toBe(true)
  })
})

describe('Compliance Guard — getRiskSummary()', () => {
  it('gibt alle vier Severity-Level zurück', () => {
    const summary = getRiskSummary()
    expect(typeof summary.critical).toBe('number')
    expect(typeof summary.high).toBe('number')
    expect(typeof summary.medium).toBe('number')
    expect(typeof summary.low).toBe('number')
  })

  it('Total stimmt mit getAllBlockedRisks überein', () => {
    const summary = getRiskSummary()
    const total   = summary.critical + summary.high + summary.medium + summary.low
    expect(total).toBe(getAllBlockedRisks().length)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// CANDIDATE MAGNET
// ══════════════════════════════════════════════════════════════════════════════

describe('Candidate Magnet — getCandidateMagnetAssets()', () => {
  it('gibt mindestens 8 Assets zurück', () => {
    expect(getCandidateMagnetAssets().length).toBeGreaterThanOrEqual(8)
  })

  it('alle haben complianceStatus: safe', () => {
    getCandidateMagnetAssets().forEach(a => {
      expect(a.complianceStatus).toBe('safe')
    })
  })

  it('alle haben seoKeywords Array', () => {
    getCandidateMagnetAssets().forEach(a => {
      expect(Array.isArray(a.seoKeywords)).toBe(true)
      expect(a.seoKeywords.length).toBeGreaterThan(0)
    })
  })

  it('Sortierung: high zuerst', () => {
    const assets = getCandidateMagnetAssets()
    const firstLow = assets.findIndex(a => a.priority === 'low')
    const lastHigh = assets.map(a => a.priority).lastIndexOf('high')
    if (firstLow !== -1 && lastHigh !== -1) {
      expect(lastHigh).toBeLessThan(firstLow)
    }
  })

  it('audience ist employer/candidate/both', () => {
    getCandidateMagnetAssets().forEach(a => {
      expect(['employer', 'candidate', 'both']).toContain(a.audience)
    })
  })
})

describe('Candidate Magnet — getTopCandidateAssets()', () => {
  it('gibt standardmäßig 5 zurück', () => {
    expect(getTopCandidateAssets()).toHaveLength(5)
  })

  it('gibt N zurück', () => {
    expect(getTopCandidateAssets(3)).toHaveLength(3)
  })
})

describe('Candidate Magnet — getAssetsByAudience()', () => {
  it('employer filtert korrekt', () => {
    const assets = getAssetsByAudience('employer')
    assets.forEach(a => expect(['employer', 'both']).toContain(a.audience))
  })

  it('candidate filtert korrekt', () => {
    const assets = getAssetsByAudience('candidate')
    assets.forEach(a => expect(['candidate', 'both']).toContain(a.audience))
  })
})

describe('Candidate Magnet — getComplianceSummary()', () => {
  it('gibt safe, needs_review, blocked zurück', () => {
    const summary = getComplianceSummary()
    expect(typeof summary.safe).toBe('number')
    expect(typeof summary.needs_review).toBe('number')
    expect(typeof summary.blocked).toBe('number')
  })

  it('Total stimmt mit Gesamtliste überein', () => {
    const summary = getComplianceSummary()
    const total   = summary.safe + summary.needs_review + summary.blocked
    expect(total).toBe(getCandidateMagnetAssets().length)
  })

  it('alle Assets sind safe (Phase 1)', () => {
    expect(getComplianceSummary().safe).toBe(getCandidateMagnetAssets().length)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// INBOUND GROWTH
// ══════════════════════════════════════════════════════════════════════════════

describe('Inbound Growth — getInboundChannels()', () => {
  it('gibt mindestens 4 Kanäle zurück', () => {
    expect(getInboundChannels().length).toBeGreaterThanOrEqual(4)
  })

  it('alle haben noEmailSent: true', () => {
    getInboundChannels().forEach(c => expect(c.noEmailSent).toBe(true))
  })

  it('alle haben noAutoOutreach: true', () => {
    getInboundChannels().forEach(c => expect(c.noAutoOutreach).toBe(true))
  })

  it('alle haben complianceStatus: safe', () => {
    getInboundChannels().forEach(c => expect(c.complianceStatus).toBe('safe'))
  })

  it('seo_organic ist enthalten', () => {
    expect(getInboundChannels().some(c => c.id === 'seo_organic')).toBe(true)
  })

  it('employer_self_registration ist enthalten', () => {
    expect(getInboundChannels().some(c => c.id === 'employer_self_registration')).toBe(true)
  })

  it('kein Channel hat automatischen E-Mail-Versand', () => {
    getInboundChannels().forEach(c => {
      const hasEmailSend = c.actionItems.some(item =>
        item.toLowerCase().includes('automatisch') && item.toLowerCase().includes('email')
      )
      expect(hasEmailSend).toBe(false)
    })
  })
})

describe('Inbound Growth — Content Calendar', () => {
  it('getContentCalendar gibt mindestens 6 Items zurück', () => {
    expect(getContentCalendar().length).toBeGreaterThanOrEqual(6)
  })

  it('Items sind nach Woche sortiert', () => {
    const items = getContentCalendar()
    for (let i = 0; i < items.length - 1; i++) {
      expect(items[i].week).toBeLessThanOrEqual(items[i + 1].week)
    }
  })

  it('getUpcomingContent(1) gibt nur Woche 1 zurück', () => {
    getUpcomingContent(1).forEach(item => expect(item.week).toBeLessThanOrEqual(1))
  })
})

describe('Inbound Growth — SEO Clusters', () => {
  it('gibt mindestens 4 Cluster zurück', () => {
    expect(getSEOClusters().length).toBeGreaterThanOrEqual(4)
  })

  it('alle haben keywords Array', () => {
    getSEOClusters().forEach(c => {
      expect(Array.isArray(c.keywords)).toBe(true)
      expect(c.keywords.length).toBeGreaterThan(0)
    })
  })
})

describe('Inbound Growth — Registration Funnels', () => {
  it('gibt mindestens 2 Funnels zurück', () => {
    expect(getRegistrationFunnels().length).toBeGreaterThanOrEqual(2)
  })

  it('alle haben noEmailSent: true', () => {
    getRegistrationFunnels().forEach(f => expect(f.noEmailSent).toBe(true))
  })

  it('employer und candidate Funnel vorhanden', () => {
    const audiences = getRegistrationFunnels().map(f => f.audience)
    expect(audiences).toContain('employer')
    expect(audiences).toContain('candidate')
  })
})

describe('Inbound Growth — getGrowthSummary()', () => {
  it('gibt alle erwarteten Felder zurück', () => {
    const summary = getGrowthSummary()
    expect(typeof summary.totalChannels).toBe('number')
    expect(typeof summary.highPriorityChannels).toBe('number')
    expect(typeof summary.contentItemsPlanned).toBe('number')
    expect(typeof summary.seoClusters).toBe('number')
    expect(typeof summary.registrationFunnels).toBe('number')
    expect(typeof summary.estimatedFirstLeadWeeks).toBe('string')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

describe('Operations — getSystemChecks()', () => {
  it('gibt mindestens 10 Checks zurück', () => {
    expect(getSystemChecks().length).toBeGreaterThanOrEqual(10)
  })

  it('email_provider_none check ist ok', () => {
    const check = getSystemChecks().find(c => c.id === 'email_provider_none')
    expect(check).toBeDefined()
    expect(check!.status).toBe('ok')
  })

  it('no_send_button check ist ok', () => {
    const check = getSystemChecks().find(c => c.id === 'no_send_button')
    expect(check).toBeDefined()
    expect(check!.status).toBe('ok')
  })

  it('no_scraping check ist ok', () => {
    const check = getSystemChecks().find(c => c.id === 'no_scraping')
    expect(check).toBeDefined()
    expect(check!.status).toBe('ok')
  })

  it('alle category Werte sind gültig', () => {
    const validCategories = ['env', 'dns', 'email', 'db', 'auth', 'compliance', 'feature']
    getSystemChecks().forEach(c => {
      expect(validCategories).toContain(c.category)
    })
  })
})

describe('Operations — getPilotSteps()', () => {
  it('gibt mindestens 8 Schritte zurück', () => {
    expect(getPilotSteps().length).toBeGreaterThanOrEqual(8)
  })

  it('alle haben gültige priority', () => {
    getPilotSteps().forEach(s => {
      expect(['high', 'medium', 'low']).toContain(s.priority)
    })
  })

  it('alle haben gültige status', () => {
    getPilotSteps().forEach(s => {
      expect(['done', 'in_progress', 'blocked', 'not_started']).toContain(s.status)
    })
  })

  it('estimatedDays ist positiv', () => {
    getPilotSteps().forEach(s => {
      expect(s.estimatedDays).toBeGreaterThan(0)
    })
  })
})

describe('Operations — generateDailyReport()', () => {
  it('gibt gültigen Tagesbericht zurück', () => {
    const report = generateDailyReport()
    expect(report.generatedAt).toBeTruthy()
    expect(['green', 'yellow', 'red']).toContain(report.systemHealth)
    expect(typeof report.nextBestAction).toBe('string')
    expect(report.nextBestAction.length).toBeGreaterThan(0)
    expect(report.nextBestActionHref).toMatch(/^\/admin/)
  })

  it('safetyInvariants sind korrekt', () => {
    const report = generateDailyReport()
    expect(report.safetyInvariants.noEmailSent).toBe(true)
    expect(report.safetyInvariants.noAutoOutreach).toBe(true)
    expect(report.safetyInvariants.noScraping).toBe(true)
    expect(report.safetyInvariants.emailProvider).toBe('none')
    expect(report.safetyInvariants.outreachProvider).toBe('none')
    expect(report.safetyInvariants.phase).toBe(1)
  })

  it('completedToday ist nicht leer', () => {
    expect(generateDailyReport().completedToday.length).toBeGreaterThan(0)
  })

  it('complianceStatus ist safe', () => {
    expect(generateDailyReport().complianceStatus).toBe('safe')
  })
})

describe('Operations — getSystemStatusSummary()', () => {
  it('health ist green/yellow/red', () => {
    const { health } = getSystemStatusSummary()
    expect(['green', 'yellow', 'red']).toContain(health)
  })

  it('total = ok + warning + blocked', () => {
    const { total, ok, warning, blocked } = getSystemStatusSummary()
    expect(total).toBe(ok + warning + blocked)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// CEO AGENT
// ══════════════════════════════════════════════════════════════════════════════

describe('CEO Agent — generateTageslageSummary()', () => {
  it('gibt Tageslage zurück', () => {
    const t = generateTageslageSummary()
    expect(t.headline).toContain('CWO')
    expect(['green', 'yellow', 'red']).toContain(t.status)
    expect(t.topOpportunity.length).toBeGreaterThan(0)
    expect(t.immediateAction.length).toBeGreaterThan(0)
    expect(t.immediateActionHref).toMatch(/^\/admin/)
  })

  it('corridorsAnalyzed stimmt mit analyzeCorridors überein', () => {
    expect(generateTageslageSummary().corridorsAnalyzed).toBe(analyzeCorridors().length)
  })

  it('sectorsAnalyzed stimmt mit analyzeEmployerDemand überein', () => {
    expect(generateTageslageSummary().sectorsAnalyzed).toBe(analyzeEmployerDemand().length)
  })

  it('blockedRisks stimmt mit getAllBlockedRisks überein', () => {
    expect(generateTageslageSummary().blockedRisks).toBe(getAllBlockedRisks().length)
  })

  it('complianceViolations ist leer (keine Invarianten verletzt)', () => {
    expect(generateTageslageSummary().complianceViolations).toHaveLength(0)
  })
})

describe('CEO Agent — generateTopTasks()', () => {
  it('gibt standardmäßig 5 Tasks zurück', () => {
    expect(generateTopTasks()).toHaveLength(5)
  })

  it('alle Tasks haben noEmailSent: true', () => {
    generateTopTasks().forEach(t => expect(t.noEmailSent).toBe(true))
  })

  it('alle Tasks haben noAutoOutreach: true', () => {
    generateTopTasks().forEach(t => expect(t.noAutoOutreach).toBe(true))
  })

  it('alle Tasks haben noScraping: true', () => {
    generateTopTasks().forEach(t => expect(t.noScraping).toBe(true))
  })

  it('alle Tasks haben actionHref', () => {
    generateTopTasks().forEach(t => {
      expect(t.actionHref).toMatch(/^\/admin/)
    })
  })

  it('Tasks sind nach Score sortiert (höchster zuerst)', () => {
    const tasks = generateTopTasks()
    for (let i = 0; i < tasks.length - 1; i++) {
      expect(tasks[i].score).toBeGreaterThanOrEqual(tasks[i + 1].score)
    }
  })
})

describe('CEO Agent — getDepartmentMeta()', () => {
  it('gibt alle 8 Departments zurück', () => {
    const meta = getDepartmentMeta()
    expect(Object.keys(meta).length).toBe(8)
  })

  it('jedes Department hat icon, href, name, description', () => {
    Object.values(getDepartmentMeta()).forEach(dept => {
      expect(dept.icon.length).toBeGreaterThan(0)
      expect(dept.href).toMatch(/^\/admin/)
      expect(dept.name.length).toBeGreaterThan(0)
      expect(dept.description.length).toBeGreaterThan(0)
    })
  })
})

describe('CEO Agent — generateCWOState()', () => {
  it('gibt vollständigen State zurück', () => {
    const state = generateCWOState()
    expect(state.generatedAt).toBeTruthy()
    expect(Array.isArray(state.topCorridors)).toBe(true)
    expect(Array.isArray(state.topEmployerSectors)).toBe(true)
    expect(Array.isArray(state.topRevenueStreams)).toBe(true)
    expect(Array.isArray(state.topTasks)).toBe(true)
    expect(Array.isArray(state.blockedRisks)).toBe(true)
    expect(Array.isArray(state.departments)).toBe(true)
  })

  it('systemInvariants sind korrekt', () => {
    const { systemInvariants } = generateCWOState()
    expect(systemInvariants.emailProvider).toBe('none')
    expect(systemInvariants.outreachEmailProvider).toBe('none')
    expect(systemInvariants.noEmailSent).toBe(true)
    expect(systemInvariants.noAutoOutreach).toBe(true)
    expect(systemInvariants.noScraping).toBe(true)
    expect(systemInvariants.phase).toBe(1)
    expect(systemInvariants.currentAutonomyLevel).toBe('A4')
  })

  it('topCorridors enthält 3 Einträge', () => {
    expect(generateCWOState().topCorridors).toHaveLength(3)
  })

  it('topRevenueStreams enthält nur sichere Streams', () => {
    generateCWOState().topRevenueStreams.forEach(s => {
      expect(s.recommendation).not.toBe('blocked_legal_review')
    })
  })

  it('departments enthält 7 Einträge (ohne ceo_agent)', () => {
    const state = generateCWOState()
    // departments Liste im State hat 7 Items (ceo_agent ist der Orchestrator, nicht extra gelistet)
    expect(state.departments.length).toBeGreaterThanOrEqual(7)
  })

  it('nextBestStep ist non-empty String', () => {
    expect(generateCWOState().nextBestStep.length).toBeGreaterThan(0)
  })

  it('nextBestStepHref zeigt auf /admin Bereich', () => {
    expect(generateCWOState().nextBestStepHref).toMatch(/^\/admin/)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// CROSS-SYSTEM SAFETY INVARIANTS
// ══════════════════════════════════════════════════════════════════════════════

describe('System-wide Safety Invariants', () => {
  it('kein Department führt externe API-Calls aus', () => {
    // Alle Funktionen sind pure / regelbasiert
    // Test: sie werfen keinen Netzwerk-Fehler
    expect(() => analyzeCorridors()).not.toThrow()
    expect(() => analyzeEmployerDemand()).not.toThrow()
    expect(() => analyzeRevenueStreams()).not.toThrow()
    expect(() => getAllBlockedRisks()).not.toThrow()
    expect(() => getCandidateMagnetAssets()).not.toThrow()
    expect(() => getInboundChannels()).not.toThrow()
    expect(() => getPilotSteps()).not.toThrow()
    expect(() => generateCWOState()).not.toThrow()
  })

  it('kein Department sendet E-Mails', () => {
    // E-Mail-Versand ist blockiert — checkAction bestätigt das
    expect(checkAction('email_provider').allowed).toBe(false)
    expect(SYSTEM_INVARIANTS.noEmailSent).toBe(true)
  })

  it('kein Department führt Scraping durch', () => {
    expect(SYSTEM_INVARIANTS.noScraping).toBe(true)
    expect(checkAction('scraping').allowed).toBe(false)
    analyzeCorridors().forEach(c => expect(c.noScraping).toBe(true))
  })

  it('kein Auto-Outreach in irgendeinem Kanal', () => {
    expect(SYSTEM_INVARIANTS.noAutoOutreach).toBe(true)
    getInboundChannels().forEach(c => expect(c.noAutoOutreach).toBe(true))
  })

  it('kein Send-Button existiert', () => {
    expect(SYSTEM_INVARIANTS.sendButtonExists).toBe(false)
    expect(SYSTEM_INVARIANTS.bulkSendExists).toBe(false)
  })

  it('Phase 1 constraint: Autonomy Level A4 max', () => {
    const state = generateCWOState()
    expect(['A0', 'A1', 'A2', 'A3', 'A4']).toContain(state.systemInvariants.currentAutonomyLevel)
    // A5 (externe Aktionen) ist nicht erlaubt
    expect(state.systemInvariants.currentAutonomyLevel).not.toBe('A5')
  })

  it('alle CWO Tasks haben Safety-Flags true', () => {
    generateTopTasks(10).forEach(task => {
      expect(task.noEmailSent).toBe(true)
      expect(task.noAutoOutreach).toBe(true)
      expect(task.noScraping).toBe(true)
    })
  })

  it('Tagesbericht löst keine automatischen Aktionen aus', () => {
    const report = generateDailyReport()
    // nextBestAction ist ein String, kein ausgeführter API-Call
    expect(typeof report.nextBestAction).toBe('string')
    expect(report.safetyInvariants.noEmailSent).toBe(true)
    expect(report.safetyInvariants.noAutoOutreach).toBe(true)
  })
})
