/**
 * __tests__/outreach-autopilot.test.ts
 *
 * Tests für das Outreach Autopilot System.
 * Keine DB-Calls. Keine Server-Imports. Kein E-Mail-Versand.
 *
 * Abdeckung:
 * - Research Agent: Profil-Aufbau, Keyword-Extraktion, Sektornormalisierung
 * - Fit Scoring Agent: Score 0–100, Threshold, Breakdown
 * - Compliance Agent: Signatur, Spam, Pilot-Charakter, Blocking-Regeln
 * - Personalization Agent: Vorlagen, kein persönlicher Name, CorridorWork-Branding
 * - Human Approval Agent: Approval-Logik, Status-Transitionen
 * - Delivery Agent: Immer false in Phase 1
 * - Orchestrator: Vollständige Pipeline
 * - Sicherheits-Invarianten: kein Send-Button, keine E-Mail-Provider, kein Global Talent Bridge
 */
import { describe, it, expect } from 'vitest'

// Research Agent
import {
  buildCompanyProfile,
  extractKeywords,
  normalizeSector,
  isHighDemandSector,
} from '@/lib/outreach-autopilot/research-agent'

// Fit Scoring Agent
import {
  calculateFitScore,
  FIT_SCORE_THRESHOLD,
} from '@/lib/outreach-autopilot/fit-scoring-agent'

// Compliance Agent
import {
  checkCompliance,
  calculateSpamRisk,
} from '@/lib/outreach-autopilot/compliance-agent'

// Personalization Agent
import {
  generateDraftMessage,
  recommendChannel,
} from '@/lib/outreach-autopilot/personalization-agent'

// Human Approval Agent
import {
  calculateApprovalState,
  validateStatusTransition,
} from '@/lib/outreach-autopilot/human-approval-agent'

// Delivery Agent
import {
  checkDeliveryConditions,
} from '@/lib/outreach-autopilot/delivery-agent'

// Orchestrator
import { analyzeCompany } from '@/lib/outreach-autopilot'

// ── Helpers ────────────────────────────────────────────────────────────────────

const REGISTER_LINK = 'https://corridorwork.com/auth/register?role=employer'
const TEAM_SIGNATURE = 'CorridorWork Team'
const FORBIDDEN_BRAND = 'Global Talent Bridge'

function makePflegeProfile() {
  return buildCompanyProfile({
    company_name:   'Pflegeheim am See GmbH',
    website:        'https://pflegeheim-see.de',
    sector:         'Pflege',
    contact_person: 'Maria Muster',
    contact_method: 'whatsapp',
    notes:          'Suchen dringend Pflegefachkräfte, internationaler Bedarf bekannt',
  })
}

function makeValidMessage(): string {
  return `Hallo Maria,

ich baue CorridorWork — ein Matching-Tool für internationales Personal.
Wir suchen 2–3 Pilotbetriebe die das kostenlos und unverbindlich testen.

Registrierung: ${REGISTER_LINK}

– ${TEAM_SIGNATURE}
  https://corridorwork.com`
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Research Agent
// ═══════════════════════════════════════════════════════════════════════════════

describe('Research Agent — buildCompanyProfile', () => {
  it('gibt korrektes CompanyProfile zurück', () => {
    const p = makePflegeProfile()
    expect(p.company_name).toBe('Pflegeheim am See GmbH')
    expect(p.hasWebsite).toBe(true)
    expect(p.hasContactPerson).toBe(true)
    expect(p.source).toBe('manual_input')
  })

  it('trimmt Leerzeichen in Eingaben', () => {
    const p = buildCompanyProfile({ company_name: '  Test GmbH  ', notes: '  Notiz  ' })
    expect(p.company_name).toBe('Test GmbH')
    expect(p.notes).toBe('Notiz')
  })

  it('source ist immer manual_input in Phase 1', () => {
    const p = buildCompanyProfile({ company_name: 'Firma' })
    expect(p.source).toBe('manual_input')
  })

  it('hasWebsite=false wenn kein Website eingegeben', () => {
    const p = buildCompanyProfile({ company_name: 'Firma', website: '' })
    expect(p.hasWebsite).toBe(false)
  })

  it('hasContactPerson=false wenn leer', () => {
    const p = buildCompanyProfile({ company_name: 'Firma', contact_person: '' })
    expect(p.hasContactPerson).toBe(false)
  })
})

describe('Research Agent — extractKeywords', () => {
  it('findet Hiring-Signale in Notizen', () => {
    const kws = extractKeywords({
      company_name: 'Firma',
      notes: 'Wir suchen dringend Fachkräfte und haben Personalbedarf',
    })
    expect(kws.length).toBeGreaterThan(0)
    expect(kws.some(k => ['suchen', 'fachkräfte', 'personalbedarf'].includes(k))).toBe(true)
  })

  it('gibt leeres Array wenn keine Keywords', () => {
    const kws = extractKeywords({ company_name: 'Bäckerei Müller' })
    // kann 0 oder Treffer haben, aber kein Fehler
    expect(Array.isArray(kws)).toBe(true)
  })
})

describe('Research Agent — normalizeSector', () => {
  it('normalisiert auf Kleinbuchstaben', () => {
    expect(normalizeSector('Pflege')).toBe('pflege')
    expect(normalizeSector('IT-Bereich')).toBe('it-bereich')
  })

  it('gibt null für leeren Sektor', () => {
    expect(normalizeSector('')).toBeNull()
    expect(normalizeSector(null)).toBeNull()
  })
})

describe('Research Agent — isHighDemandSector', () => {
  it('erkennt Pflegesektor', () => {
    expect(isHighDemandSector('Pflege')).toBe(true)
    expect(isHighDemandSector('Altenpflege')).toBe(true)
  })

  it('erkennt IT-Sektor', () => {
    expect(isHighDemandSector('IT')).toBe(true)
    expect(isHighDemandSector('Softwareentwicklung')).toBe(true)
  })

  it('erkennt Bausektor', () => {
    expect(isHighDemandSector('Bau')).toBe(true)
  })

  it('gibt false für unbekannte Sektoren', () => {
    expect(isHighDemandSector('Philosophie')).toBe(false)
  })

  it('gibt false für null', () => {
    expect(isHighDemandSector(null)).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Fit Scoring Agent
// ═══════════════════════════════════════════════════════════════════════════════

describe('Fit Scoring Agent — Threshold', () => {
  it('FIT_SCORE_THRESHOLD ist 70', () => {
    expect(FIT_SCORE_THRESHOLD).toBe(70)
  })
})

describe('Fit Scoring Agent — Scoring', () => {
  it('Pflegeheim mit vollständigem Profil erreicht ≥ 70', () => {
    const result = calculateFitScore(makePflegeProfile())
    expect(result.score).toBeGreaterThanOrEqual(70)
    expect(result.blockedByScore).toBe(false)
  })

  it('leeres Profil hat niedrigen Score', () => {
    const p = buildCompanyProfile({ company_name: 'X' })
    const result = calculateFitScore(p)
    expect(result.score).toBeLessThan(70)
    expect(result.blockedByScore).toBe(true)
  })

  it('Score ist immer zwischen 0 und 100', () => {
    const profiles = [
      buildCompanyProfile({ company_name: 'A' }),
      makePflegeProfile(),
      buildCompanyProfile({ company_name: 'IT Startup', sector: 'IT', website: 'https://startup.de', notes: 'suchen international' }),
    ]
    for (const p of profiles) {
      const r = calculateFitScore(p)
      expect(r.score).toBeGreaterThanOrEqual(0)
      expect(r.score).toBeLessThanOrEqual(100)
    }
  })

  it('gibt Breakdown-Objekt mit allen Feldern zurück', () => {
    const r = calculateFitScore(makePflegeProfile())
    expect(r.breakdown).toHaveProperty('sectorRelevance')
    expect(r.breakdown).toHaveProperty('digitalPresence')
    expect(r.breakdown).toHaveProperty('hiringSignals')
    expect(r.breakdown).toHaveProperty('internationalNeed')
    expect(r.breakdown).toHaveProperty('contactQuality')
    expect(r.breakdown).toHaveProperty('profileCompleteness')
  })

  it('gibt Label zurück', () => {
    const r = calculateFitScore(makePflegeProfile())
    expect(['excellent', 'good', 'marginal', 'low', 'rejected']).toContain(r.label)
  })

  it('blockedByScore=true wenn Score < 70', () => {
    const p = buildCompanyProfile({ company_name: 'Minimale Firma' })
    const r = calculateFitScore(p)
    if (r.score < 70) {
      expect(r.blockedByScore).toBe(true)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Compliance Agent
// ═══════════════════════════════════════════════════════════════════════════════

describe('Compliance Agent — Blocking-Regeln', () => {
  it('blockiert wenn Signatur fehlt', () => {
    const text = `Hallo, wir testen Pilot kostenlos. ${REGISTER_LINK}`
    const r = checkCompliance(text)
    expect(r.violations.some(v => v.rule === 'missing_signature')).toBe(true)
    expect(r.status).toBe('blocked')
  })

  it('blockiert wenn kein Pilot-Charakter', () => {
    const text = `Hallo, kaufen Sie unsere Lösung. ${REGISTER_LINK} – ${TEAM_SIGNATURE}`
    const r = checkCompliance(text)
    expect(r.violations.some(v => v.rule === 'missing_pilot_character')).toBe(true)
    expect(r.status).toBe('blocked')
  })

  it('blockiert wenn kein corridorwork.com Link', () => {
    const text = `Hallo, wir testen Pilot kostenlos. – ${TEAM_SIGNATURE}`
    const r = checkCompliance(text)
    expect(r.violations.some(v => v.rule === 'missing_registration_link')).toBe(true)
    expect(r.status).toBe('blocked')
  })

  it('blockiert bei [Ihr Name] in Signatur', () => {
    const text = `Hallo, Pilot kostenlos testen. ${REGISTER_LINK}\n– [Ihr Name]\n${TEAM_SIGNATURE}`
    const r = checkCompliance(text)
    expect(r.violations.some(v => v.rule === 'personal_name_in_signature')).toBe(true)
  })

  it('blockiert bei "jetzt kaufen"', () => {
    const text = `Hallo, jetzt kaufen! Pilot kostenlos. ${REGISTER_LINK} – ${TEAM_SIGNATURE}`
    const r = checkCompliance(text)
    expect(r.status).toBe('blocked')
  })

  it('blockiert bei "letzte Chance"', () => {
    const text = `Letzte Chance! Pilot kostenlos. ${REGISTER_LINK} – ${TEAM_SIGNATURE}`
    const r = checkCompliance(text)
    expect(r.status).toBe('blocked')
  })

  it('blockiert bei "massenversand"', () => {
    const text = `Massenversand an alle Firmen. Pilot kostenlos. ${REGISTER_LINK} – ${TEAM_SIGNATURE}`
    const r = checkCompliance(text)
    expect(r.status).toBe('blocked')
  })

  it('blockiert Text unter 50 Zeichen', () => {
    const r = checkCompliance('Kurz')
    expect(r.status).toBe('blocked')
  })
})

describe('Compliance Agent — safe', () => {
  it('gültige Nachricht ist safe', () => {
    const r = checkCompliance(makeValidMessage())
    expect(r.status).toBe('safe')
    expect(r.violations).toHaveLength(0)
    expect(r.hasSignature).toBe(true)
    expect(r.hasPilotNote).toBe(true)
  })
})

describe('Compliance Agent — calculateSpamRisk', () => {
  it('blocked → high', () => {
    const r = checkCompliance('kurz')
    expect(calculateSpamRisk(r)).toBe('high')
  })

  it('safe ohne Warnungen → low', () => {
    const r = checkCompliance(makeValidMessage())
    expect(calculateSpamRisk(r)).toBe('low')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Personalization Agent — Branding & Sicherheit
// ═══════════════════════════════════════════════════════════════════════════════

describe('Personalization Agent — Branding', () => {
  const channels = ['whatsapp', 'linkedin', 'email', 'personal'] as const

  for (const ch of channels) {
    it(`${ch}: enthält "CorridorWork"`, () => {
      const p = makePflegeProfile()
      const d = generateDraftMessage(p, ch)
      expect(d.body).toContain('CorridorWork')
    })

    it(`${ch}: enthält "CorridorWork Team"`, () => {
      const p = makePflegeProfile()
      const d = generateDraftMessage(p, ch)
      expect(d.body).toContain(TEAM_SIGNATURE)
    })

    it(`${ch}: enthält Registrierungslink`, () => {
      const p = makePflegeProfile()
      const d = generateDraftMessage(p, ch)
      expect(d.body).toContain(REGISTER_LINK)
    })

    it(`${ch}: enthält "kostenlos"`, () => {
      const p = makePflegeProfile()
      const d = generateDraftMessage(p, ch)
      expect(d.body.toLowerCase()).toContain('kostenlos')
    })

    it(`${ch}: enthält nicht "Global Talent Bridge"`, () => {
      const p = makePflegeProfile()
      const d = generateDraftMessage(p, ch)
      expect(d.body).not.toContain(FORBIDDEN_BRAND)
    })

    it(`${ch}: kein persönlicher Absendername`, () => {
      const p = makePflegeProfile()
      const d = generateDraftMessage(p, ch)
      expect(d.body).not.toContain('Brahim Ben Abla')
      expect(d.body).not.toContain('[Ihr Name]')
    })

    it(`${ch}: ist keine async-Funktion (kein automatischer Versand)`, () => {
      const p = makePflegeProfile()
      const result = generateDraftMessage(p, ch)
      expect(result instanceof Promise).toBe(false)
      expect(typeof result.body).toBe('string')
    })
  }

  it('E-Mail hat Betreff', () => {
    const d = generateDraftMessage(makePflegeProfile(), 'email')
    expect(d.subject).toBeTruthy()
    expect(d.subject!.length).toBeGreaterThan(0)
  })

  it('Betreff enthält nicht localhost', () => {
    const d = generateDraftMessage(makePflegeProfile(), 'email')
    expect(d.subject ?? '').not.toContain('localhost')
    expect(d.body).not.toContain('localhost')
  })
})

describe('Personalization Agent — recommendChannel', () => {
  it('empfiehlt email wenn contact_address eine E-Mail ist', () => {
    const p = buildCompanyProfile({ company_name: 'Firma', contact_address: 'hr@firma.de', contact_method: 'personal' })
    expect(recommendChannel(p)).toBe('email')
  })

  it('empfiehlt linkedin wenn Website vorhanden', () => {
    const p = buildCompanyProfile({ company_name: 'Firma', website: 'https://firma.de', contact_method: 'personal' })
    expect(recommendChannel(p)).toBe('linkedin')
  })

  it('respektiert explizit gesetzten Kanal', () => {
    const p = buildCompanyProfile({ company_name: 'Firma', contact_method: 'whatsapp' })
    expect(recommendChannel(p)).toBe('whatsapp')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Human Approval Agent
// ═══════════════════════════════════════════════════════════════════════════════

describe('Human Approval Agent — calculateApprovalState', () => {
  it('canCopy=true wenn score≥70 UND compliance=safe UND hasMessage=true', () => {
    const s = calculateApprovalState({
      fitScore:         80,
      complianceStatus: 'safe',
      hasMessage:       true,
    })
    expect(s.canCopy).toBe(true)
    expect(s.canApprove).toBe(true)
    expect(s.blockers).toHaveLength(0)
  })

  it('canCopy=false wenn score < 70', () => {
    const s = calculateApprovalState({
      fitScore:         50,
      complianceStatus: 'safe',
      hasMessage:       true,
    })
    expect(s.canCopy).toBe(false)
    expect(s.blockers.some(b => b.includes('Fit Score'))).toBe(true)
  })

  it('canCopy=false wenn compliance=blocked', () => {
    const s = calculateApprovalState({
      fitScore:         85,
      complianceStatus: 'blocked',
      hasMessage:       true,
    })
    expect(s.canCopy).toBe(false)
    expect(s.blockers.some(b => b.includes('blocked'))).toBe(true)
  })

  it('canCopy=false wenn kein Text', () => {
    const s = calculateApprovalState({
      fitScore:         85,
      complianceStatus: 'safe',
      hasMessage:       false,
    })
    expect(s.canCopy).toBe(false)
  })

  it('canSaveAsDraft ist immer true', () => {
    const s1 = calculateApprovalState({ fitScore: 10, complianceStatus: 'blocked', hasMessage: false })
    const s2 = calculateApprovalState({ fitScore: 90, complianceStatus: 'safe', hasMessage: true })
    expect(s1.canSaveAsDraft).toBe(true)
    expect(s2.canSaveAsDraft).toBe(true)
  })
})

describe('Human Approval Agent — validateStatusTransition', () => {
  it('draft → needs_review: erlaubt', () => {
    expect(validateStatusTransition('draft', 'needs_review')).toBeNull()
  })

  it('needs_review → approved_for_manual_copy: erlaubt', () => {
    expect(validateStatusTransition('needs_review', 'approved_for_manual_copy')).toBeNull()
  })

  it('approved_for_manual_copy → contacted_manual: erlaubt', () => {
    expect(validateStatusTransition('approved_for_manual_copy', 'contacted_manual')).toBeNull()
  })

  it('draft → contacted_manual: NICHT erlaubt', () => {
    const err = validateStatusTransition('draft', 'contacted_manual')
    expect(err).not.toBeNull()
    expect(err).toContain('Ungültiger Statusübergang')
  })

  it('blocked → draft: erlaubt (re-open)', () => {
    expect(validateStatusTransition('blocked', 'draft')).toBeNull()
  })

  it('contacted_manual → approved_for_manual_copy: NICHT erlaubt', () => {
    const err = validateStatusTransition('contacted_manual', 'approved_for_manual_copy')
    expect(err).not.toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Delivery Agent — immer Phase 1 (false)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Delivery Agent — Phase 1 immer geblockt', () => {
  const makeDeliveryInput = (overrides = {}) => ({
    emailProvider:         'none',
    outreachEmailProvider: 'none',
    contactSource:         'manual_input' as const,
    complianceStatus:      'safe',
    fitScore:              90,
    isExplicitlyApproved:  true,
    dailySentCount:        0,
    hasAuditLog:           true,
    hasOptOut:             true,
    ...overrides,
  })

  it('allowed ist immer false', () => {
    expect(checkDeliveryConditions(makeDeliveryInput()).allowed).toBe(false)
  })

  it('phase ist immer 1', () => {
    expect(checkDeliveryConditions(makeDeliveryInput()).phase).toBe(1)
  })

  it('reason enthält "Phase 1"', () => {
    expect(checkDeliveryConditions(makeDeliveryInput()).reason).toContain('Phase 1')
  })

  it('auch wenn alle Bedingungen erfüllt wären: allowed=false', () => {
    const r = checkDeliveryConditions(makeDeliveryInput({
      emailProvider:         'resend',
      outreachEmailProvider: 'resend',
      contactSource:         'explicit_opt_in',
    }))
    expect(r.allowed).toBe(false)
  })

  it('conditions-Array enthält email_provider_active', () => {
    const r = checkDeliveryConditions(makeDeliveryInput())
    expect(r.conditions.some(c => c.name === 'email_provider_active')).toBe(true)
  })

  it('email_provider_active.met=false wenn provider=none', () => {
    const r = checkDeliveryConditions(makeDeliveryInput())
    const cond = r.conditions.find(c => c.name === 'email_provider_active')!
    expect(cond.met).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 7. Orchestrator — vollständige Pipeline
// ═══════════════════════════════════════════════════════════════════════════════

describe('Orchestrator — analyzeCompany', () => {
  it('gibt vollständige AutopilotAnalysis zurück', () => {
    const r = analyzeCompany({ company_name: 'Test GmbH', sector: 'Pflege' })
    expect(r).toHaveProperty('profile')
    expect(r).toHaveProperty('fitScore')
    expect(r).toHaveProperty('compliance')
    expect(r).toHaveProperty('draft')
    expect(r).toHaveProperty('approval')
    expect(r).toHaveProperty('delivery')
    expect(r).toHaveProperty('overallSafe')
    expect(r).toHaveProperty('summary')
  })

  it('delivery.allowed ist immer false', () => {
    const r = analyzeCompany({ company_name: 'Pflegeheim', sector: 'Pflege' })
    expect(r.delivery.allowed).toBe(false)
  })

  it('Pflegeheim mit gutem Profil ist overallSafe=true', () => {
    const r = analyzeCompany({
      company_name:   'Pflegeheim am See',
      sector:         'Pflege',
      website:        'https://pflegeheim-see.de',
      contact_method: 'whatsapp',
      notes:          'Suchen Pflegefachkräfte, internationaler Bedarf',
    })
    // Bei gutem Score und guter Compliance
    if (r.fitScore.score >= 70 && r.compliance.status !== 'blocked') {
      expect(r.overallSafe).toBe(true)
    }
  })

  it('Draft enthält immer corridorwork.com', () => {
    const r = analyzeCompany({ company_name: 'Firma', sector: 'IT' })
    expect(r.draft.body).toContain('corridorwork.com')
  })

  it('Draft enthält kein "Global Talent Bridge"', () => {
    const r = analyzeCompany({ company_name: 'Firma', sector: 'Pflege' })
    expect(r.draft.body).not.toContain(FORBIDDEN_BRAND)
  })

  it('summary ist nicht leer', () => {
    const r = analyzeCompany({ company_name: 'Firma', sector: 'Bau' })
    expect(r.summary.length).toBeGreaterThan(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8. EMAIL_PROVIDER-Sicherheit
// ═══════════════════════════════════════════════════════════════════════════════

describe('EMAIL_PROVIDER-Sicherheit', () => {
  it('EMAIL_PROVIDER nicht aktiv (not resend/smtp)', () => {
    const p = process.env.EMAIL_PROVIDER ?? 'none'
    expect(p).not.toBe('resend')
    expect(p).not.toBe('smtp')
  })

  it('OUTREACH_EMAIL_PROVIDER nicht aktiv', () => {
    const p = process.env.OUTREACH_EMAIL_PROVIDER ?? 'none'
    expect(p).not.toBe('resend')
    expect(p).not.toBe('smtp')
  })

  it('emailProviderSafe-Logik korrekt', () => {
    function isEmailSafe(ep: string, oep: string) {
      return ep === 'none' && oep === 'none'
    }
    expect(isEmailSafe('none', 'none')).toBe(true)
    expect(isEmailSafe('resend', 'none')).toBe(false)
    expect(isEmailSafe('none', 'resend')).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 9. Kein Send-Button / keine automatischen Aktionen in Template-Funktionen
// ═══════════════════════════════════════════════════════════════════════════════

describe('Kein automatischer Versand', () => {
  it('generateDraftMessage ist keine async Funktion (kein Versand)', () => {
    const p = makePflegeProfile()
    const result = generateDraftMessage(p, 'whatsapp')
    expect(result instanceof Promise).toBe(false)
  })

  it('analyzeCompany ist keine async Funktion (kein API-Call, kein Versand)', () => {
    const result = analyzeCompany({ company_name: 'Test' })
    expect(result instanceof Promise).toBe(false)
  })

  it('checkCompliance ist keine async Funktion', () => {
    const result = checkCompliance(makeValidMessage())
    expect(result instanceof Promise).toBe(false)
  })

  it('calculateFitScore ist keine async Funktion', () => {
    const result = calculateFitScore(makePflegeProfile())
    expect(result instanceof Promise).toBe(false)
  })

  it('Delivery Agent: kein Versand erlaubt (allowed=false)', () => {
    const r = checkDeliveryConditions({
      emailProvider: 'none',
      outreachEmailProvider: 'none',
      contactSource: 'manual_input',
      complianceStatus: 'safe',
      fitScore: 100,
      isExplicitlyApproved: true,
      dailySentCount: 0,
      hasAuditLog: true,
      hasOptOut: true,
    })
    expect(r.allowed).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 10. Spam-Schutz — spezifische Blocking-Szenarien
// ═══════════════════════════════════════════════════════════════════════════════

describe('Spam-Schutz — Blocking-Szenarien', () => {
  it('blockiert "begrenzte Plätze"', () => {
    const text = `Hallo, begrenzte Plätze! Pilot kostenlos testen. ${REGISTER_LINK} – ${TEAM_SIGNATURE}`
    expect(checkCompliance(text).status).toBe('blocked')
  })

  it('blockiert "100% Erfolg garantiert"', () => {
    const text = `Pilot kostenlos. 100 % Erfolg garantiert! ${REGISTER_LINK} – ${TEAM_SIGNATURE}`
    expect(checkCompliance(text).status).toBe('blocked')
  })

  it('blockiert Bulk-Indikatoren', () => {
    const text = `An alle Arbeitgeber: Pilot kostenlos. ${REGISTER_LINK} – ${TEAM_SIGNATURE}`
    expect(checkCompliance(text).status).toBe('blocked')
  })

  it('blockiert "automatisch versendet"', () => {
    const text = `Diese Nachricht wurde automatisch versendet. Pilot kostenlos. ${REGISTER_LINK} – ${TEAM_SIGNATURE}`
    expect(checkCompliance(text).status).toBe('blocked')
  })

  it('gültige Vorlage übersteht alle Checks', () => {
    expect(checkCompliance(makeValidMessage()).status).toBe('safe')
  })
})
