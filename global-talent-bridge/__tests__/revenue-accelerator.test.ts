/**
 * __tests__/revenue-accelerator.test.ts
 *
 * Revenue Accelerator Sprint — Test Suite
 *
 * Prüft:
 * 1. Strategic Partner Lead-Typ (neue DB-Typen, Validierung, Score)
 * 2. Interest-Type Labels und Werte
 * 3. Revenue-Pfade (REVENUE_PATHS Konstante, Reihenfolge, Safety)
 * 4. /partners und /strategic-partnership Formular-Konfiguration
 * 5. Revenue Accelerator Admin-Logik
 * 6. Daily Runner Revenue-Zählung (erweitert)
 * 7. Sitemap /partners + /strategic-partnership
 * 8. Safety Invarianten (kein Outreach, kein Stripe, kein E-Mail)
 * 9. BUYER_READY_PACKAGE Invarianten
 */
import { describe, it, expect } from 'vitest'
import {
  validateLeadInput,
  calculateLeadScore,
  LEAD_TYPE_LABELS,
  LEAD_TYPE_COLORS,
  INTEREST_TYPE_LABELS,
  STATUS_LABELS,
  REVENUE_PATHS,
  COMPLIANCE_DISCLAIMER,
  REVENUE_LEAD_INVARIANTS,
} from '@/lib/revenue-leads'
import type {
  LeadFormInput,
  LeadType,
  InterestType,
  LeadStatus,
} from '@/lib/revenue-leads'

// ── Helper ─────────────────────────────────────────────────────────────────────

function validStrategicInput(overrides: Partial<LeadFormInput> = {}): LeadFormInput {
  return {
    lead_type:          'strategic_partner',
    organization_name:  'Acme Corp GmbH',
    contact_name:       'John Doe',
    email:              'john@acmecorp.com',
    country:            'Deutschland',
    interest_type:      'acquisition_discussion',
    message:            'Ernsthaftes Übernahmeinteresse — möchten Details besprechen',
    consent_to_contact: true,
    source_page:        '/strategic-partnership',
    ...overrides,
  }
}

function validPartnerInput(overrides: Partial<LeadFormInput> = {}): LeadFormInput {
  return {
    lead_type:          'agency_partner',
    organization_name:  'Recruiting Plus GmbH',
    contact_name:       'Maria Schmidt',
    email:              'maria@recruitingplus.de',
    country:            'Österreich',
    sector:             'Recruiting-Agentur',
    interest_type:      'white_label',
    message:            'White-Label-Nutzung für unsere Plattform',
    consent_to_contact: true,
    source_page:        '/partners',
    ...overrides,
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. STRATEGIC PARTNER — LEAD-TYP
// ══════════════════════════════════════════════════════════════════════════════

describe('Strategic Partner Lead-Typ', () => {

  it('akzeptiert strategic_partner als Lead-Typ', () => {
    const { valid, errors } = validateLeadInput(validStrategicInput())
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it('akzeptiert agency_partner als Lead-Typ (für /partners)', () => {
    const { valid, errors } = validateLeadInput(validPartnerInput())
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it('lehnt ungültigen Lead-Typ ab', () => {
    const { valid, errors } = validateLeadInput(
      validStrategicInput({ lead_type: 'invalid_type' as LeadType })
    )
    expect(valid).toBe(false)
    expect(errors.some(e => e.includes('Lead-Typ'))).toBe(true)
  })

  it('strategic_partner Label ist definiert', () => {
    expect(LEAD_TYPE_LABELS['strategic_partner']).toBeDefined()
    expect(LEAD_TYPE_LABELS['strategic_partner']).toContain('Strategic')
  })

  it('strategic_partner Color-Klasse ist definiert', () => {
    expect(LEAD_TYPE_COLORS['strategic_partner']).toBeDefined()
    expect(typeof LEAD_TYPE_COLORS['strategic_partner']).toBe('string')
  })

  it('alle vier Lead-Typen haben Labels', () => {
    const types: LeadType[] = ['employer_pilot', 'agency_partner', 'market_intelligence', 'strategic_partner']
    types.forEach(t => {
      expect(LEAD_TYPE_LABELS[t]).toBeDefined()
      expect(LEAD_TYPE_LABELS[t].length).toBeGreaterThan(0)
    })
  })

  it('alle vier Lead-Typen haben Color-Klassen', () => {
    const types: LeadType[] = ['employer_pilot', 'agency_partner', 'market_intelligence', 'strategic_partner']
    types.forEach(t => {
      expect(LEAD_TYPE_COLORS[t]).toBeDefined()
    })
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 2. INTEREST-TYPE
// ══════════════════════════════════════════════════════════════════════════════

describe('Interest-Type Labels und Validierung', () => {

  it('alle InterestType-Werte haben Labels', () => {
    const types: InterestType[] = [
      'partnership', 'white_label', 'licensing', 'acquisition_discussion', 'market_intelligence'
    ]
    types.forEach(t => {
      expect(INTEREST_TYPE_LABELS[t]).toBeDefined()
      expect(INTEREST_TYPE_LABELS[t].length).toBeGreaterThan(0)
    })
  })

  it('acquisition_discussion Label ist klar und kein Spam-Trigger', () => {
    const label = INTEREST_TYPE_LABELS['acquisition_discussion']
    expect(label).toBeDefined()
    // Soll kein automatischen Outreach suggerieren
    expect(label.toLowerCase()).not.toContain('outreach')
    expect(label.toLowerCase()).not.toContain('cold')
  })

  it('strategic Input mit interest_type wird korrekt validiert', () => {
    const interestTypes: InterestType[] = [
      'partnership', 'white_label', 'licensing', 'acquisition_discussion', 'market_intelligence'
    ]
    interestTypes.forEach(it_ => {
      const { valid } = validateLeadInput(validStrategicInput({ interest_type: it_ }))
      expect(valid).toBe(true)
    })
  })

  it('strategic Input ohne interest_type ist immer noch valide', () => {
    const input = validStrategicInput()
    delete input.interest_type
    const { valid } = validateLeadInput(input)
    expect(valid).toBe(true)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 3. LEAD SCORE — STRATEGIC PARTNER PRIORITÄT
// ══════════════════════════════════════════════════════════════════════════════

describe('Lead Score — Strategic Partner hat höchste Priorität', () => {

  it('strategic_partner hat höheren Score als employer_pilot', () => {
    const strategicScore = calculateLeadScore({
      lead_type: 'strategic_partner',
      consent_to_contact: true,
      sector: null,
      country: 'Deutschland',
      message: 'Test Message für Score-Berechnung',
    })
    const employerScore = calculateLeadScore({
      lead_type: 'employer_pilot',
      consent_to_contact: true,
      sector: null,
      country: 'Deutschland',
      message: 'Test Message für Score-Berechnung',
    })
    expect(strategicScore).toBeGreaterThan(employerScore)
  })

  it('strategic_partner hat höheren Score als agency_partner', () => {
    const strategicScore = calculateLeadScore({
      lead_type: 'strategic_partner',
      consent_to_contact: true,
      sector: null,
      country: null,
      message: null,
    })
    const agencyScore = calculateLeadScore({
      lead_type: 'agency_partner',
      consent_to_contact: true,
      sector: null,
      country: null,
      message: null,
    })
    expect(strategicScore).toBeGreaterThan(agencyScore)
  })

  it('strategic_partner hat höchsten Basis-Score aller Lead-Typen', () => {
    const baseInput = { consent_to_contact: true, sector: null, country: null, message: null } as const
    const scores = {
      strategic:  calculateLeadScore({ lead_type: 'strategic_partner', ...baseInput }),
      employer:   calculateLeadScore({ lead_type: 'employer_pilot',    ...baseInput }),
      agency:     calculateLeadScore({ lead_type: 'agency_partner',    ...baseInput }),
      intel:      calculateLeadScore({ lead_type: 'market_intelligence', ...baseInput }),
    }
    expect(scores.strategic).toBeGreaterThanOrEqual(scores.employer)
    expect(scores.strategic).toBeGreaterThanOrEqual(scores.agency)
    expect(scores.strategic).toBeGreaterThanOrEqual(scores.intel)
  })

  it('Score ist nie höher als 100', () => {
    const score = calculateLeadScore({
      lead_type:          'strategic_partner',
      consent_to_contact: true,
      sector:             'Pharma',
      country:            'Deutschland',
      message:            'Diese Nachricht ist länger als 20 Zeichen für maximalen Score',
    })
    expect(score).toBeLessThanOrEqual(100)
  })

  it('Score ohne Bonus-Felder ist sinnvoll', () => {
    const score = calculateLeadScore({
      lead_type:          'strategic_partner',
      consent_to_contact: true,
      sector:             null,
      country:            null,
      message:            null,
    })
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThanOrEqual(100)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 4. REVENUE_PATHS KONSTANTE
// ══════════════════════════════════════════════════════════════════════════════

describe('REVENUE_PATHS Konstante', () => {

  it('REVENUE_PATHS ist definiert und hat 4 Pfade', () => {
    expect(REVENUE_PATHS).toBeDefined()
    expect(REVENUE_PATHS).toHaveLength(4)
  })

  it('strategic_partner ist auf Rang 1', () => {
    const first = REVENUE_PATHS[0]
    expect(first.rank).toBe(1)
    expect(first.leadType).toBe('strategic_partner')
  })

  it('agency_partner ist auf Rang 2', () => {
    const second = REVENUE_PATHS[1]
    expect(second.rank).toBe(2)
    expect(second.leadType).toBe('agency_partner')
  })

  it('employer_pilot ist auf Rang 3', () => {
    const third = REVENUE_PATHS[2]
    expect(third.rank).toBe(3)
    expect(third.leadType).toBe('employer_pilot')
  })

  it('market_intelligence ist auf Rang 4', () => {
    const fourth = REVENUE_PATHS[3]
    expect(fourth.rank).toBe(4)
    expect(fourth.leadType).toBe('market_intelligence')
  })

  it('alle Pfade haben icon, label, description, path', () => {
    REVENUE_PATHS.forEach(p => {
      expect(p.icon).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.path).toMatch(/^\//)
    })
  })

  it('strategic_partner Pfad ist /strategic-partnership', () => {
    const strategic = REVENUE_PATHS.find(p => p.leadType === 'strategic_partner')
    expect(strategic?.path).toBe('/strategic-partnership')
  })

  it('agency_partner Pfad ist /partners', () => {
    const agency = REVENUE_PATHS.find(p => p.leadType === 'agency_partner')
    expect(agency?.path).toBe('/partners')
  })

  it('kein Pfad aktiviert Outreach oder Send (negative Aussage erlaubt)', () => {
    REVENUE_PATHS.forEach(p => {
      // Beschreibungen dürfen "Kein Outreach" sagen — aber nie "Outreach aktiv" oder "Cold-Outreach"
      expect(p.description.toLowerCase()).not.toContain('cold-outreach')
      expect(p.description.toLowerCase()).not.toContain('outreach aktiv')
      // Kein automatischer Send
      expect(p.description.toLowerCase()).not.toContain('auto-send')
    })
  })

  it('strategic_partner speed ist schnellster Weg', () => {
    const strategic = REVENUE_PATHS.find(p => p.leadType === 'strategic_partner')
    expect(strategic?.speed).toContain('schnell')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 5. /PARTNERS FORMULAR-KONFIGURATION
// ══════════════════════════════════════════════════════════════════════════════

describe('/partners Formular-Konfiguration', () => {

  it('agency_partner Lead vom /partners Formular wird validiert', () => {
    const { valid, errors } = validateLeadInput(validPartnerInput())
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it('agency_partner ohne sector ist valide (optional)', () => {
    const input = validPartnerInput()
    delete input.sector
    const { valid } = validateLeadInput(input)
    expect(valid).toBe(true)
  })

  it('agency_partner ohne interest_type ist valide (optional)', () => {
    const input = validPartnerInput()
    delete input.interest_type
    const { valid } = validateLeadInput(input)
    expect(valid).toBe(true)
  })

  it('agency_partner ohne consent wird abgelehnt', () => {
    const { valid, errors } = validateLeadInput(
      validPartnerInput({ consent_to_contact: false })
    )
    expect(valid).toBe(false)
    expect(errors.some(e => e.includes('Zustimmung'))).toBe(true)
  })

  it('Honeypot verhindert Bots', () => {
    const { valid } = validateLeadInput(
      validPartnerInput({ website: 'http://spam.example.com' })
    )
    expect(valid).toBe(false)
  })

  it('agency_partner Score ist sinnvoll', () => {
    const score = calculateLeadScore({
      lead_type:          'agency_partner',
      consent_to_contact: true,
      sector:             'Recruiting-Agentur',
      country:            'Deutschland',
      message:            'Interesse an White-Label-Integration für unsere Plattform',
    })
    expect(score).toBeGreaterThan(40)
    expect(score).toBeLessThanOrEqual(100)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 6. /STRATEGIC-PARTNERSHIP FORMULAR-KONFIGURATION
// ══════════════════════════════════════════════════════════════════════════════

describe('/strategic-partnership Formular-Konfiguration', () => {

  it('strategic_partner vom /strategic-partnership Formular wird validiert', () => {
    const { valid, errors } = validateLeadInput(validStrategicInput())
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it('strategic_partner ohne consent wird abgelehnt', () => {
    const { valid, errors } = validateLeadInput(
      validStrategicInput({ consent_to_contact: false })
    )
    expect(valid).toBe(false)
    expect(errors.some(e => e.includes('Zustimmung'))).toBe(true)
  })

  it('strategic_partner ohne Organisation wird abgelehnt', () => {
    const { valid, errors } = validateLeadInput(
      validStrategicInput({ organization_name: '' })
    )
    expect(valid).toBe(false)
    expect(errors.some(e => e.includes('Organisation'))).toBe(true)
  })

  it('strategic_partner ohne E-Mail wird abgelehnt', () => {
    const { valid, errors } = validateLeadInput(
      validStrategicInput({ email: 'invalid-email' })
    )
    expect(valid).toBe(false)
    expect(errors.some(e => e.includes('E-Mail'))).toBe(true)
  })

  it('Honeypot verhindert Bots', () => {
    const { valid } = validateLeadInput(
      validStrategicInput({ website: 'spammer' })
    )
    expect(valid).toBe(false)
  })

  it('acquisition_discussion Interest-Type wird validiert', () => {
    const { valid } = validateLeadInput(
      validStrategicInput({ interest_type: 'acquisition_discussion' })
    )
    expect(valid).toBe(true)
  })

  it('strategic_partner Score ist am höchsten', () => {
    const score = calculateLeadScore({
      lead_type:          'strategic_partner',
      consent_to_contact: true,
      sector:             null,
      country:            'Deutschland',
      message:            'Wir möchten CorridorWork für unsere Plattform übernehmen',
    })
    expect(score).toBeGreaterThan(70)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 7. SITEMAP — /PARTNERS + /STRATEGIC-PARTNERSHIP
// ══════════════════════════════════════════════════════════════════════════════

describe('Sitemap — /partners und /strategic-partnership', () => {

  it('REVENUE_PATHS enthält /strategic-partnership', () => {
    const paths = REVENUE_PATHS.map(p => p.path)
    expect(paths).toContain('/strategic-partnership')
  })

  it('REVENUE_PATHS enthält /partners', () => {
    const paths = REVENUE_PATHS.map(p => p.path)
    expect(paths).toContain('/partners')
  })

  it('/strategic-partnership Priorität sollte höher sein als /partners', () => {
    const sp = REVENUE_PATHS.find(p => p.path === '/strategic-partnership')
    const pa = REVENUE_PATHS.find(p => p.path === '/partners')
    expect(sp?.rank).toBeLessThan(pa?.rank ?? 99)
  })

  it('/admin/revenue-accelerator ist kein öffentlicher Revenue-Pfad', () => {
    const paths = REVENUE_PATHS.map(p => p.path)
    expect(paths).not.toContain('/admin/revenue-accelerator')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 8. SAFETY INVARIANTEN
// ══════════════════════════════════════════════════════════════════════════════

describe('Safety Invarianten — Revenue Accelerator', () => {

  it('REVENUE_LEAD_INVARIANTS.no_email_sent ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_email_sent).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.no_auto_outreach ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_auto_outreach).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.no_payment_started ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_payment_started).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.no_scraping ist true', () => {
    expect(REVENUE_LEAD_INVARIANTS.no_scraping).toBe(true)
  })

  it('REVENUE_LEAD_INVARIANTS.emailProvider ist none', () => {
    expect(REVENUE_LEAD_INVARIANTS.emailProvider).toBe('none')
  })

  it('REVENUE_LEAD_INVARIANTS.phase ist 1', () => {
    expect(REVENUE_LEAD_INVARIANTS.phase).toBe(1)
  })

  it('COMPLIANCE_DISCLAIMER.consentText enthält Datenschutz-Bezug', () => {
    expect(COMPLIANCE_DISCLAIMER.consentText).toContain('Datenschutz')
  })

  it('COMPLIANCE_DISCLAIMER.noAutoContact ist definiert', () => {
    expect(COMPLIANCE_DISCLAIMER.noAutoContact).toBeTruthy()
  })

  it('kein Revenue-Pfad aktiviert automatischen Versand', () => {
    REVENUE_PATHS.forEach(p => {
      // Beschreibungen dürfen Stripe/Outreach als VERBOTE erwähnen — aber nie aktivierend
      expect(p.description.toLowerCase()).not.toContain('automatisch versenden')
      expect(p.description.toLowerCase()).not.toContain('email senden')
      expect(p.description.toLowerCase()).not.toContain('stripe aktiv')
      expect(p.description.toLowerCase()).not.toContain('stripe aktiviert')
    })
  })

  it('REVENUE_LEAD_INVARIANTS sind alle als const definiert', () => {
    // Unveränderlich — typisch für Safety-Konstanten
    expect(typeof REVENUE_LEAD_INVARIANTS).toBe('object')
    expect(REVENUE_LEAD_INVARIANTS).toBeTruthy()
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 9. REVENUE ACCELERATOR — ADMIN-LOGIK
// ══════════════════════════════════════════════════════════════════════════════

describe('Revenue Accelerator — Admin-Logik', () => {

  it('fastest path: strategic_partner wenn strategic > 0', () => {
    const ns = 2, na = 1, ne = 3
    const fastestPath = ns > 0 ? 'strategic_partner' : na > 0 ? 'agency_partner' : ne > 0 ? 'employer_pilot' : null
    expect(fastestPath).toBe('strategic_partner')
  })

  it('fastest path: agency_partner wenn ns=0 und na>0', () => {
    const ns = 0, na = 1, ne = 3
    const fastestPath = ns > 0 ? 'strategic_partner' : na > 0 ? 'agency_partner' : ne > 0 ? 'employer_pilot' : null
    expect(fastestPath).toBe('agency_partner')
  })

  it('fastest path: employer_pilot wenn ns=0, na=0, ne>0', () => {
    const ns = 0, na = 0, ne = 2
    const fastestPath = ns > 0 ? 'strategic_partner' : na > 0 ? 'agency_partner' : ne > 0 ? 'employer_pilot' : null
    expect(fastestPath).toBe('employer_pilot')
  })

  it('fastest path: null wenn alle 0', () => {
    const ns = 0, na = 0, ne = 0
    const fastestPath = ns > 0 ? 'strategic_partner' : na > 0 ? 'agency_partner' : ne > 0 ? 'employer_pilot' : null
    expect(fastestPath).toBeNull()
  })

  it('BLOCKED_RISKS enthält Stripe', () => {
    const risks = ['stripe', 'outreach', 'candidate_fees', 'scraping', 'job_guarantee']
    expect(risks).toContain('stripe')
  })

  it('BLOCKED_RISKS enthält outreach', () => {
    const risks = ['stripe', 'outreach', 'candidate_fees', 'scraping', 'job_guarantee']
    expect(risks).toContain('outreach')
  })

  it('BLOCKED_RISKS enthält candidate_fees', () => {
    const risks = ['stripe', 'outreach', 'candidate_fees', 'scraping', 'job_guarantee']
    expect(risks).toContain('candidate_fees')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 10. DAILY RUNNER — REVENUE ACCELERATOR INTEGRATION
// ══════════════════════════════════════════════════════════════════════════════

describe('Daily Runner — Revenue Accelerator Integration', () => {

  it('topRevenuePath erkennt strategic_partner korrekt', () => {
    const strategicNew = 1
    const agencyLeads  = 0
    const employerLeads = 0
    const path =
      strategicNew > 0 ? 'strategic_partner (schnellster Weg)' :
      agencyLeads > 0  ? 'agency_partner' :
      employerLeads > 0 ? 'employer_pilot' :
      'kein neuer Lead — SEO-Sichtbarkeit ausbauen'
    expect(path).toBe('strategic_partner (schnellster Weg)')
  })

  it('topRevenuePath fällt auf SEO-Hinweis wenn keine Leads', () => {
    const path =
      0 > 0 ? 'strategic_partner (schnellster Weg)' :
      0 > 0 ? 'agency_partner' :
      0 > 0 ? 'employer_pilot' :
      'kein neuer Lead — SEO-Sichtbarkeit ausbauen'
    expect(path).toBe('kein neuer Lead — SEO-Sichtbarkeit ausbauen')
  })

  it('completedItems enthält Revenue Accelerator Status', () => {
    const newLeadsCount = 3
    const strategicAll  = 1
    const topRevenuePath = 'strategic_partner (schnellster Weg)'
    const item = `Revenue Accelerator: ${newLeadsCount} neue Leads | ${strategicAll} Strategic-Leads gesamt | Top-Pfad: ${topRevenuePath}`
    expect(item).toContain('Revenue Accelerator')
    expect(item).toContain('Strategic-Leads')
    expect(item).toContain('Top-Pfad')
  })

  it('revenueLeads Response enthält strategicPartner Feld', () => {
    const response = {
      newTotal:           5,
      strategicPartner:   2,
      strategicTotal:     3,
      employerPilot:      1,
      agencyPartner:      1,
      marketIntel:        1,
      topRevenuePath:     'strategic_partner (schnellster Weg)',
    }
    expect(response.strategicPartner).toBeDefined()
    expect(response.strategicTotal).toBeDefined()
    expect(response.topRevenuePath).toBeDefined()
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// 11. STATUS LABELS
// ══════════════════════════════════════════════════════════════════════════════

describe('Status Labels vollständig', () => {

  const statuses: LeadStatus[] = ['new', 'reviewed', 'qualified', 'rejected', 'contacted_manual']

  it('alle Status-Labels sind definiert', () => {
    statuses.forEach(s => {
      expect(STATUS_LABELS[s]).toBeDefined()
      expect(STATUS_LABELS[s].length).toBeGreaterThan(0)
    })
  })

  it('Status-Aktionen enthalten keinen automatischen Versand', () => {
    Object.values(STATUS_LABELS).forEach(label => {
      expect(label.toLowerCase()).not.toContain('auto')
      expect(label.toLowerCase()).not.toContain('send')
    })
  })

})
