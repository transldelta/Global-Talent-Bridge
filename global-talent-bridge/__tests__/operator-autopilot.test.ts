/**
 * __tests__/operator-autopilot.test.ts
 *
 * Tests für lib/operator-autopilot.ts
 * Keine DB-Calls, keine Server-Imports — reine Business-Logic.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  calculateFollowUpDate,
  validateDraftSafety,
  generateApprovalDraftsForBatch,
  generateDailyOperatorActions,
  prioritizeOperatorActions,
  getNextBestActionForEmployer,
  approveAction,
  rejectAction,
  postponeAction,
  executeApprovedAction,
  createAuditLogForAction,
  getDailyActionSummary,
  isValidPilotEmployerStatus,
  FORBIDDEN_PILOT_STATUSES,
  VALID_PILOT_EMPLOYER_STATUSES,
  type EmployerForDraft,
  type OutreachDraft,
  type OperatorAction,
  type ProviderConfig,
} from '@/lib/operator-autopilot'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const PFLEGE_PLUS: EmployerForDraft = {
  id: '33e80e0b-a9e1-4eb2-b90f-2f92ef5466bc',
  company_name: 'Pflege Plus GmbH',
  contact_name: 'M. Schmidt',
  contact_email: null,
  contact_phone: null,
  industry: 'Pflege',
  country: 'Deutschland',
  status: 'interested',
  notes: 'Erster Kontakt via LinkedIn-Outreach',
}

const NORTHSTAR: EmployerForDraft = {
  id: '57f01f73-23fa-4d98-bc1d-794366b70211',
  company_name: 'NorthStar Tech Canada Inc.',
  contact_name: 'Priya Sharma',
  contact_email: 'priya@northstartech.ca',
  contact_phone: '+1-416-555-0101',
  industry: 'IT',
  country: 'Canada',
  status: 'interested',
  notes: 'Korridor: Indien → Kanada (IT). Interesse an 3 Senior-Developers.',
}

const BERLIN_DIGITAL: EmployerForDraft = {
  id: '48874def-03cc-40b0-b214-36b8c7687482',
  company_name: 'Berlin Digital Solutions GmbH',
  contact_name: 'Yildiz Arslan',
  contact_email: 'y.arslan@berlin-digital.de',
  contact_phone: '+49-30-555-0104',
  industry: 'IT',
  country: 'Germany',
  status: 'interested',
  notes: 'Korridor: Türkei → Deutschland (IT). Fokus: Full-Stack + DevOps.',
}

const PFLEGE_KA: EmployerForDraft = {
  id: 'a21da323-d21d-41eb-8f1c-6389a60188af',
  company_name: 'Pflege Plus GmbH Karlsruhe',
  contact_name: 'Markus Weber',
  contact_email: 'mweber@pflegeplus-ka.de',
  contact_phone: '+49-721-555-0103',
  industry: 'Care',
  country: 'Germany',
  status: 'contacted_manual',
  notes: 'Korridor: Marokko → Deutschland (Pflege). Sucht 5 examierte Pflegekräfte.',
}

const MEDCARE: EmployerForDraft = {
  id: '908ac831-65cb-4a4c-a9ee-95941b0a5fa0',
  company_name: 'MedCare Bayern',
  contact_name: 'A. Müller',
  contact_email: null,
  contact_phone: null,
  industry: 'Pflege',
  country: 'Deutschland',
  status: 'contacted_manual',
  notes: 'Interesse signalisiert, wartet auf Details',
}

const SYDNEY: EmployerForDraft = {
  id: '1ad55b69-2cd7-4c49-8849-5a772bc832af',
  company_name: 'Sydney CareFirst Services',
  contact_name: 'Maria Santos',
  contact_email: 'm.santos@carefirst.com.au',
  contact_phone: '+61-2-9555-0105',
  industry: 'Care',
  country: 'Australia',
  status: 'identified',
  notes: 'Korridor: Philippinen → Australien (Pflege). 8 offene Stellen.',
}

const BATCH_1_EMPLOYERS = [PFLEGE_PLUS, NORTHSTAR, BERLIN_DIGITAL, PFLEGE_KA, MEDCARE, SYDNEY]

const PROVIDER_NONE: ProviderConfig = { provider: 'none' }
const PROVIDER_RESEND: ProviderConfig = { provider: 'resend', fromEmail: 'team@gtb.de' }

function makeDraft(overrides: Partial<OutreachDraft> = {}): OutreachDraft {
  return {
    pilot_employer_id: NORTHSTAR.id,
    channel: 'email',
    recipient_email: 'priya@northstartech.ca',
    subject: 'Test Subject',
    body: 'Test body text\n\nViele Grüße\nGlobal Talent Bridge Team',
    status: 'approved',
    approval_required: true,
    provider: 'resend',
    risk_level: 'low',
    demo: false,
    ...overrides,
  }
}

function makeAction(overrides: Partial<OperatorAction> = {}): OperatorAction {
  return {
    action_type: 'approve_outreach',
    title: 'Test Action',
    priority: 'medium',
    status: 'pending',
    risk_level: 'low',
    ...overrides,
  }
}

// ── calculateFollowUpDate ────────────────────────────────────────────────────

describe('calculateFollowUpDate', () => {
  it('adds 3 business days (Fr → Mi)', () => {
    // Freitag 05.06.2026
    const friday = new Date('2026-06-05T10:00:00Z')
    const result = calculateFollowUpDate(friday, 3)
    // Werktage: Mo 08, Di 09, Mi 10
    expect(result.getUTCDay()).toBe(3) // Mittwoch
    expect(result.getUTCDate()).toBe(10)
    expect(result.getUTCMonth()).toBe(5) // June (0-indexed)
  })

  it('adds 3 business days (Di → Fr)', () => {
    // Dienstag 09.06.2026
    const tuesday = new Date('2026-06-09T10:00:00Z')
    const result = calculateFollowUpDate(tuesday, 3)
    // Werktage: Mi 10, Do 11, Fr 12
    expect(result.getUTCDay()).toBe(5) // Freitag
    expect(result.getUTCDate()).toBe(12)
  })

  it('skips weekends correctly', () => {
    // Montag 08.06.2026 + 1 Werktag = Dienstag 09.06
    const monday = new Date('2026-06-08T10:00:00Z')
    const result = calculateFollowUpDate(monday, 1)
    expect(result.getUTCDay()).toBe(2) // Dienstag
    expect(result.getUTCDate()).toBe(9)
  })

  it('skips full weekend when adding 1 day from Friday', () => {
    const friday = new Date('2026-06-05T10:00:00Z')
    const result = calculateFollowUpDate(friday, 1)
    expect(result.getUTCDay()).toBe(1) // Montag
    expect(result.getUTCDate()).toBe(8)
  })

  it('defaults to 3 business days', () => {
    const friday = new Date('2026-06-05T10:00:00Z')
    const explicit3 = calculateFollowUpDate(friday, 3)
    const implicit3 = calculateFollowUpDate(friday)
    expect(explicit3.getTime()).toBe(implicit3.getTime())
  })

  it('result is always in the future relative to input', () => {
    const now = new Date()
    const result = calculateFollowUpDate(now, 1)
    expect(result.getTime()).toBeGreaterThan(now.getTime())
  })
})

// ── validateDraftSafety ───────────────────────────────────────────────────────

describe('validateDraftSafety', () => {
  it('passes a safe draft', () => {
    const result = validateDraftSafety({
      subject: 'Test',
      body: 'Hallo,\n\nTest.\n\nViele Grüße\nGlobal Talent Bridge Team',
    })
    expect(result.safe).toBe(true)
    expect(result.issues).toHaveLength(0)
    expect(result.riskLevel).toBe('low')
  })

  it('rejects personal name "Brahim Ben Abla"', () => {
    const result = validateDraftSafety({ body: 'Brahim Ben Abla\nGlobal Talent Bridge Team' })
    expect(result.safe).toBe(false)
    expect(result.issues.some((i) => /brahim/i.test(i))).toBe(true)
  })

  it('rejects [Ihr Name] placeholder', () => {
    const result = validateDraftSafety({ body: '[Ihr Name]\nGlobal Talent Bridge Team' })
    expect(result.safe).toBe(false)
    expect(result.issues.some((i) => /platzhalter/i.test(i))).toBe(true)
  })

  it('rejects [DEIN NAME] placeholder', () => {
    const result = validateDraftSafety({ body: '[DEIN NAME]\nGlobal Talent Bridge Team' })
    expect(result.safe).toBe(false)
  })

  it('rejects "ich bin Gründer" phrase', () => {
    const result = validateDraftSafety({ body: 'ich bin Gründer von GTB\nGlobal Talent Bridge Team' })
    expect(result.safe).toBe(false)
    expect(result.issues.some((i) => /gründer/i.test(i))).toBe(true)
  })

  it('rejects "als Gründer" phrase', () => {
    const result = validateDraftSafety({ body: 'als Gründer von GTB\nGlobal Talent Bridge Team' })
    expect(result.safe).toBe(false)
  })

  it('rejects guarantee promises', () => {
    const result = validateDraftSafety({ body: 'garantiert erfolgreich\nGlobal Talent Bridge Team' })
    expect(result.safe).toBe(false)
    expect(result.issues.some((i) => /garantie/i.test(i))).toBe(true)
  })

  it('rejects 0-Risiko claim', () => {
    const result = validateDraftSafety({ body: '0 Risiko für Sie\nGlobal Talent Bridge Team' })
    expect(result.safe).toBe(false)
  })

  it('rejects missing "Global Talent Bridge Team" signature', () => {
    const result = validateDraftSafety({ body: 'Hallo,\n\nTest.\n\nViele Grüße' })
    expect(result.safe).toBe(false)
    expect(result.issues.some((i) => /signatur/i.test(i))).toBe(true)
  })

  it('riskLevel is high when many issues', () => {
    const result = validateDraftSafety({
      body: 'Brahim [Ihr Name] garantiert 0 Risiko — kein Team-Name',
    })
    expect(result.riskLevel).toBe('high')
    expect(result.issues.length).toBeGreaterThan(2)
  })

  it('riskLevel is medium for 1-2 issues', () => {
    const result = validateDraftSafety({ body: '[Ihr Name]\nGlobal Talent Bridge Team' })
    expect(result.riskLevel).toBe('medium')
  })

  it('does NOT reject "geprüft" (correct word)', () => {
    const result = validateDraftSafety({
      body: 'Alle Kandidaten wurden sorgfältig geprüft.\n\nViele Grüße\nGlobal Talent Bridge Team',
    })
    // "geprüft" should not trigger "Garantie" check
    expect(result.safe).toBe(true)
  })
})

// ── generateApprovalDraftsForBatch ────────────────────────────────────────────

describe('generateApprovalDraftsForBatch', () => {
  let drafts: OutreachDraft[]

  beforeEach(() => {
    drafts = generateApprovalDraftsForBatch(BATCH_1_EMPLOYERS)
  })

  it('generates drafts for all employers', () => {
    expect(drafts.length).toBeGreaterThan(0)
  })

  it('generates email draft for NorthStar (has email)', () => {
    const d = drafts.find((d) => d.pilot_employer_id === NORTHSTAR.id)
    expect(d).toBeDefined()
    expect(d!.channel).toBe('email')
    expect(d!.recipient_email).toBe('priya@northstartech.ca')
  })

  it('generates linkedin draft for Pflege Plus GmbH (no email/phone)', () => {
    const d = drafts.find((d) => d.pilot_employer_id === PFLEGE_PLUS.id)
    expect(d).toBeDefined()
    expect(d!.channel).toBe('linkedin')
    expect(d!.recipient_email).toBeUndefined()
  })

  it('Pflege Plus GmbH draft has needs_review status (no surname)', () => {
    const d = drafts.find((d) => d.pilot_employer_id === PFLEGE_PLUS.id)
    expect(d!.status).toBe('needs_review')
  })

  it('NorthStar draft has generated status (warm, has contacts)', () => {
    const d = drafts.find((d) => d.pilot_employer_id === NORTHSTAR.id)
    expect(d!.status).toBe('generated')
  })

  it('Sydney CareFirst (identified = cold) has needs_review or medium risk', () => {
    const d = drafts.find((d) => d.pilot_employer_id === SYDNEY.id)
    expect(d).toBeDefined()
    const isColdFlag = d!.status === 'needs_review' || d!.risk_level === 'medium'
    expect(isColdFlag).toBe(true)
  })

  it('all drafts have approval_required = true', () => {
    for (const d of drafts) {
      expect(d.approval_required).toBe(true)
    }
  })

  it('all generated bodies contain "Global Talent Bridge Team"', () => {
    for (const d of drafts) {
      expect(d.body).toContain('Global Talent Bridge Team')
    }
  })

  it('no draft body contains personal name placeholders', () => {
    for (const d of drafts) {
      expect(d.body).not.toContain('[Ihr Name]')
      expect(d.body).not.toContain('[DEIN NAME]')
      expect(d.body).not.toContain('Brahim Ben Abla')
      expect(d.body).not.toContain('ich bin Gründer')
      expect(d.body).not.toContain('als Gründer')
    }
  })

  it('no draft body contains guarantee promises', () => {
    for (const d of drafts) {
      expect(d.body.toLowerCase()).not.toMatch(/garantier|0[\s-]*risiko\b/)
    }
  })

  it('care drafts mention pilot phase', () => {
    const careDrafts = drafts.filter(
      (d) =>
        d.pilot_employer_id === PFLEGE_PLUS.id ||
        d.pilot_employer_id === PFLEGE_KA.id ||
        d.pilot_employer_id === SYDNEY.id,
    )
    for (const d of careDrafts) {
      const lower = d.body.toLowerCase()
      expect(lower).toMatch(/pilot|phase|testen|ohne verpflichtung/)
    }
  })

  it('all drafts have next_follow_up_at set', () => {
    for (const d of drafts) {
      expect(d.next_follow_up_at).toBeDefined()
      expect(d.next_follow_up_at).toBeInstanceOf(Date)
    }
  })

  it('all email drafts have provider = none as safe default', () => {
    const emailDrafts = drafts.filter((d) => d.channel === 'email')
    for (const d of emailDrafts) {
      expect(d.provider).toBe('none')
    }
  })

  // MedCare Bayern: no email, no phone → gets LinkedIn draft only
  it('MedCare Bayern gets a draft (LinkedIn, needs research)', () => {
    const d = drafts.find((d) => d.pilot_employer_id === MEDCARE.id)
    expect(d).toBeDefined()
    expect(d!.channel).toBe('linkedin')
  })

  it('all drafts pass safety check (no personal names etc.)', () => {
    for (const d of drafts) {
      const check = validateDraftSafety({ body: d.body, subject: d.subject })
      expect(check.safe).toBe(true), `Draft for ${d.pilot_employer_id} failed safety: ${check.issues.join(', ')}`
    }
  })
})

// ── generateDailyOperatorActions ─────────────────────────────────────────────

describe('generateDailyOperatorActions', () => {
  it('returns an array of actions', () => {
    const actions = generateDailyOperatorActions(BATCH_1_EMPLOYERS, [])
    expect(Array.isArray(actions)).toBe(true)
  })

  it('creates research actions for employers without contacts', () => {
    const actions = generateDailyOperatorActions([MEDCARE, PFLEGE_PLUS], [])
    const research = actions.filter((a) => a.action_type === 'research_contact')
    expect(research.length).toBeGreaterThanOrEqual(2)
  })

  it('MedCare Bayern research action has high priority (contacted_manual)', () => {
    const actions = generateDailyOperatorActions([MEDCARE], [])
    const med = actions.find((a) => a.entity_id === MEDCARE.id && a.action_type === 'research_contact')
    expect(med).toBeDefined()
    expect(med!.priority).toBe('high')
  })

  it('creates draft approval actions for pending drafts', () => {
    const draft = makeDraft({
      id: 'draft-1',
      pilot_employer_id: NORTHSTAR.id,
      status: 'generated',
    })
    const actions = generateDailyOperatorActions([NORTHSTAR], [draft])
    const approvals = actions.filter((a) => a.action_type === 'approve_outreach')
    expect(approvals.length).toBeGreaterThan(0)
  })

  it('creates follow-up action for overdue sent drafts', () => {
    const pastDate = new Date('2026-01-01')
    const draft = makeDraft({
      id: 'draft-2',
      pilot_employer_id: NORTHSTAR.id,
      status: 'sent',
      next_follow_up_at: pastDate,
    })
    const actions = generateDailyOperatorActions([NORTHSTAR], [draft])
    const followUps = actions.filter((a) => a.action_type === 'create_follow_up')
    expect(followUps.length).toBeGreaterThan(0)
  })

  it('returned actions are sorted by priority', () => {
    const actions = generateDailyOperatorActions(BATCH_1_EMPLOYERS, [])
    const orders: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
    for (let i = 0; i < actions.length - 1; i++) {
      expect(orders[actions[i].priority]).toBeLessThanOrEqual(orders[actions[i + 1].priority])
    }
  })
})

// ── prioritizeOperatorActions ─────────────────────────────────────────────────

describe('prioritizeOperatorActions', () => {
  it('critical comes before high before medium before low', () => {
    const input: OperatorAction[] = [
      makeAction({ priority: 'low' }),
      makeAction({ priority: 'critical' }),
      makeAction({ priority: 'medium' }),
      makeAction({ priority: 'high' }),
    ]
    const result = prioritizeOperatorActions(input)
    expect(result[0].priority).toBe('critical')
    expect(result[1].priority).toBe('high')
    expect(result[2].priority).toBe('medium')
    expect(result[3].priority).toBe('low')
  })

  it('earlier due_at comes first within same priority', () => {
    const earlier = makeAction({ priority: 'high', due_at: new Date('2026-06-01') })
    const later   = makeAction({ priority: 'high', due_at: new Date('2026-06-10') })
    const result  = prioritizeOperatorActions([later, earlier])
    expect(result[0].due_at!.getTime()).toBeLessThan(result[1].due_at!.getTime())
  })

  it('does not mutate original array', () => {
    const input = [makeAction({ priority: 'low' }), makeAction({ priority: 'high' })]
    const original = [...input]
    prioritizeOperatorActions(input)
    expect(input[0].priority).toBe(original[0].priority)
  })
})

// ── getNextBestActionForEmployer ──────────────────────────────────────────────

describe('getNextBestActionForEmployer', () => {
  it('research_contact for employer without contacts', () => {
    const action = getNextBestActionForEmployer(MEDCARE)
    expect(action.action_type).toBe('research_contact')
  })

  it('approve_outreach for interested employer with contacts', () => {
    const action = getNextBestActionForEmployer(NORTHSTAR)
    expect(action.action_type).toBe('approve_outreach')
    expect(action.priority).toBe('high')
  })

  it('create_follow_up for contacted_manual with contacts', () => {
    const action = getNextBestActionForEmployer(PFLEGE_KA)
    expect(action.action_type).toBe('create_follow_up')
  })

  it('approve_outreach for identified with contacts', () => {
    const action = getNextBestActionForEmployer(SYDNEY)
    expect(action.action_type).toBe('approve_outreach')
    expect(action.priority).toBe('medium')
  })

  it('all returned actions have valid action_type', () => {
    const valid = ['approve_outreach','reject_outreach','postpone_outreach',
      'send_email','mark_manual_platform_ready','create_follow_up',
      'update_employer_status','research_contact','review_risk']
    for (const emp of BATCH_1_EMPLOYERS) {
      const action = getNextBestActionForEmployer(emp)
      expect(valid).toContain(action.action_type)
    }
  })
})

// ── approveAction / rejectAction / postponeAction ────────────────────────────

describe('approveAction', () => {
  it('sets status to approved', () => {
    const result = approveAction(makeAction())
    expect(result.status).toBe('approved')
  })

  it('sets completed_at', () => {
    const result = approveAction(makeAction())
    expect(result.completed_at).toBeDefined()
    expect(result.completed_at).toBeInstanceOf(Date)
  })

  it('does not mutate original action', () => {
    const original = makeAction()
    approveAction(original)
    expect(original.status).toBe('pending')
  })

  it('includes approvedBy in recommended_decision', () => {
    const result = approveAction(makeAction(), 'admin@test.de')
    expect(result.recommended_decision).toContain('admin@test.de')
  })
})

describe('rejectAction', () => {
  it('sets status to rejected', () => {
    const result = rejectAction(makeAction())
    expect(result.status).toBe('rejected')
  })

  it('sets completed_at', () => {
    const result = rejectAction(makeAction())
    expect(result.completed_at).toBeDefined()
  })

  it('does not mutate original', () => {
    const original = makeAction()
    rejectAction(original)
    expect(original.status).toBe('pending')
  })
})

describe('postponeAction', () => {
  it('sets status to postponed', () => {
    const result = postponeAction(makeAction())
    expect(result.status).toBe('postponed')
  })

  it('sets due_at when provided', () => {
    const dueAt = new Date('2026-06-10')
    const result = postponeAction(makeAction(), dueAt)
    expect(result.due_at).toEqual(dueAt)
  })

  it('defaults due_at to 1 business day if not provided', () => {
    const result = postponeAction(makeAction())
    expect(result.due_at).toBeDefined()
    expect(result.due_at!.getTime()).toBeGreaterThan(Date.now())
  })
})

// ── executeApprovedAction ─────────────────────────────────────────────────────

describe('executeApprovedAction — send safety rules', () => {
  it('blocks if draft is not approved', () => {
    const draft = makeDraft({ status: 'generated' })
    const plan = executeApprovedAction(draft, PROVIDER_RESEND)
    expect(plan.canExecute).toBe(false)
    expect(plan.action).toBe('blocked')
    expect(plan.blockedReason).toMatch(/nicht freigegeben/i)
  })

  it('blocks send without approval (needs_review)', () => {
    const plan = executeApprovedAction(makeDraft({ status: 'needs_review' }), PROVIDER_RESEND)
    expect(plan.canExecute).toBe(false)
  })

  it('blocks email send when provider is none', () => {
    const draft = makeDraft({ status: 'approved', channel: 'email' })
    const plan = executeApprovedAction(draft, PROVIDER_NONE)
    expect(plan.canExecute).toBe(false)
    expect(plan.blockedReason).toMatch(/provider nicht konfiguriert/i)
  })

  it('blocks email send when recipient_email is missing', () => {
    const draft = makeDraft({ status: 'approved', channel: 'email', recipient_email: undefined })
    const plan = executeApprovedAction(draft, PROVIDER_RESEND)
    expect(plan.canExecute).toBe(false)
    expect(plan.blockedReason).toMatch(/adresse/i)
  })

  it('blocks send when safety check fails (personal name in body)', () => {
    const draft = makeDraft({
      status: 'approved',
      body: 'Brahim Ben Abla\nGlobal Talent Bridge Team',
    })
    const plan = executeApprovedAction(draft, PROVIDER_RESEND)
    expect(plan.canExecute).toBe(false)
    expect(plan.blockedReason).toMatch(/safety/i)
  })

  it('blocks send when signature missing', () => {
    const draft = makeDraft({
      status: 'approved',
      body: 'Kein Team-Name hier',
    })
    const plan = executeApprovedAction(draft, PROVIDER_RESEND)
    expect(plan.canExecute).toBe(false)
  })

  it('allows email send when all conditions met', () => {
    const draft = makeDraft({
      status: 'approved',
      channel: 'email',
      recipient_email: 'priya@northstartech.ca',
    })
    const plan = executeApprovedAction(draft, PROVIDER_RESEND)
    expect(plan.canExecute).toBe(true)
    expect(plan.action).toBe('send_email')
  })

  it('LinkedIn → ready_for_manual_platform_send (never auto-send)', () => {
    const draft = makeDraft({ status: 'approved', channel: 'linkedin' })
    const plan = executeApprovedAction(draft, PROVIDER_RESEND)
    expect(plan.canExecute).toBe(true)
    expect(plan.action).toBe('mark_manual_platform_ready')
    expect(plan.draftUpdates.status).toBe('ready_for_manual_platform_send')
  })

  it('WhatsApp → ready_for_manual_platform_send (never auto-send)', () => {
    const draft = makeDraft({ status: 'approved', channel: 'whatsapp' })
    const plan = executeApprovedAction(draft, PROVIDER_RESEND)
    expect(plan.canExecute).toBe(true)
    expect(plan.action).toBe('mark_manual_platform_ready')
  })

  it('Phone → ready_for_manual_platform_send (never auto-send)', () => {
    const draft = makeDraft({ status: 'approved', channel: 'phone' })
    const plan = executeApprovedAction(draft, PROVIDER_RESEND)
    expect(plan.canExecute).toBe(true)
    expect(plan.action).toBe('mark_manual_platform_ready')
  })

  it('provider none + linkedin still returns mark_manual (not blocked)', () => {
    const draft = makeDraft({ status: 'approved', channel: 'linkedin' })
    const plan = executeApprovedAction(draft, PROVIDER_NONE)
    // LinkedIn doesn't need email provider → mark manual
    expect(plan.action).toBe('mark_manual_platform_ready')
    expect(plan.canExecute).toBe(true)
  })
})

// ── createAuditLogForAction ───────────────────────────────────────────────────

describe('createAuditLogForAction', () => {
  it('returns agent_name = operator_autopilot', () => {
    const log = createAuditLogForAction(makeAction())
    expect(log.agent_name).toBe('operator_autopilot')
  })

  it('approved action → status success', () => {
    const approved = approveAction(makeAction())
    const log = createAuditLogForAction(approved)
    expect(log.status).toBe('success')
  })

  it('rejected action → status warning', () => {
    const rejected = rejectAction(makeAction())
    const log = createAuditLogForAction(rejected)
    expect(log.status).toBe('warning')
  })

  it('pending action → status info', () => {
    const log = createAuditLogForAction(makeAction({ status: 'pending' }))
    expect(log.status).toBe('info')
  })

  it('includes action_type in metadata', () => {
    const log = createAuditLogForAction(makeAction({ action_type: 'research_contact' }))
    expect(log.metadata?.action_type).toBe('research_contact')
  })

  it('includes draft info when draft provided', () => {
    const log = createAuditLogForAction(makeAction(), makeDraft())
    expect(log.message).toMatch(/draft/i)
    expect(log.metadata?.draft_channel).toBe('email')
  })
})

// ── getDailyActionSummary ─────────────────────────────────────────────────────

describe('getDailyActionSummary', () => {
  it('returns correct counts', () => {
    const summary = getDailyActionSummary([MEDCARE, NORTHSTAR], [])
    expect(typeof summary.urgentCount).toBe('number')
    expect(typeof summary.pendingDraftCount).toBe('number')
    expect(typeof summary.researchCount).toBe('number')
    expect(Array.isArray(summary.actions)).toBe(true)
  })

  it('limits actions to top 5', () => {
    const summary = getDailyActionSummary(BATCH_1_EMPLOYERS, [])
    expect(summary.actions.length).toBeLessThanOrEqual(5)
  })

  it('MedCare research is in summary', () => {
    const summary = getDailyActionSummary([MEDCARE], [])
    expect(summary.researchCount).toBeGreaterThan(0)
  })
})

// ── isValidPilotEmployerStatus ────────────────────────────────────────────────

describe('isValidPilotEmployerStatus', () => {
  it('accepts valid statuses', () => {
    for (const s of VALID_PILOT_EMPLOYER_STATUSES) {
      expect(isValidPilotEmployerStatus(s)).toBe(true)
    }
  })

  it('rejects "draft" — NEVER allowed', () => {
    expect(isValidPilotEmployerStatus('draft')).toBe(false)
  })

  it('rejects "demo_requested" — NEVER allowed as pilot_employer status', () => {
    expect(isValidPilotEmployerStatus('demo_requested')).toBe(false)
  })

  it('FORBIDDEN_PILOT_STATUSES contains draft and demo_requested', () => {
    expect(FORBIDDEN_PILOT_STATUSES).toContain('draft')
    expect(FORBIDDEN_PILOT_STATUSES).toContain('demo_requested')
  })

  it('rejects unknown status', () => {
    expect(isValidPilotEmployerStatus('unknown')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidPilotEmployerStatus('')).toBe(false)
  })
})

// ── Batch 1 Integration ───────────────────────────────────────────────────────

describe('Batch 1 integration', () => {
  it('generates correct number of drafts for batch 1', () => {
    const drafts = generateApprovalDraftsForBatch(BATCH_1_EMPLOYERS)
    // 6 employers → at least 5 (all get at least linkedin or email)
    expect(drafts.length).toBeGreaterThanOrEqual(5)
    // At most 6 (one per employer)
    expect(drafts.length).toBeLessThanOrEqual(6)
  })

  it('NorthStar, Berlin Digital, Pflege KA, Sydney all get email drafts', () => {
    const drafts = generateApprovalDraftsForBatch(BATCH_1_EMPLOYERS)
    const emailIds = [NORTHSTAR.id, BERLIN_DIGITAL.id, PFLEGE_KA.id, SYDNEY.id]
    for (const id of emailIds) {
      const d = drafts.find((d) => d.pilot_employer_id === id)
      expect(d).toBeDefined()
      expect(d!.channel).toBe('email')
    }
  })

  it('Pflege Plus GmbH (no email/phone) gets linkedin draft', () => {
    const drafts = generateApprovalDraftsForBatch(BATCH_1_EMPLOYERS)
    const d = drafts.find((d) => d.pilot_employer_id === PFLEGE_PLUS.id)
    expect(d!.channel).toBe('linkedin')
  })

  it('MedCare Bayern (no email/phone) gets linkedin draft (for research)', () => {
    const drafts = generateApprovalDraftsForBatch(BATCH_1_EMPLOYERS)
    const d = drafts.find((d) => d.pilot_employer_id === MEDCARE.id)
    expect(d).toBeDefined()
    expect(d!.channel).toBe('linkedin')
  })

  it('MedCare Bayern generates research action, not email draft', () => {
    const actions = generateDailyOperatorActions([MEDCARE], [])
    const researchActions = actions.filter(
      (a) => a.action_type === 'research_contact' && a.entity_id === MEDCARE.id
    )
    expect(researchActions.length).toBeGreaterThan(0)
  })

  it('all batch 1 drafts pass safety validation', () => {
    const drafts = generateApprovalDraftsForBatch(BATCH_1_EMPLOYERS)
    for (const d of drafts) {
      const check = validateDraftSafety({ body: d.body, subject: d.subject })
      if (!check.safe) {
        throw new Error(
          `Draft for ${d.pilot_employer_id} failed safety: ${check.issues.join(', ')}`
        )
      }
    }
  })

  it('no batch 1 draft body contains personal name placeholders', () => {
    const drafts = generateApprovalDraftsForBatch(BATCH_1_EMPLOYERS)
    const forbidden = [
      '[Ihr Name]', '[DEIN NAME]', '[DEIN VOLLSTÄNDIGER NAME]',
      'Brahim Ben Abla', 'ich bin Gründer', 'als Gründer',
    ]
    for (const d of drafts) {
      for (const f of forbidden) {
        expect(d.body).not.toContain(f)
      }
    }
  })

  it('batch 1 never uses "draft" or "demo_requested" as pilot employer status', () => {
    for (const emp of BATCH_1_EMPLOYERS) {
      expect(isValidPilotEmployerStatus(emp.status)).toBe(true)
      expect(emp.status).not.toBe('draft')
      expect(emp.status).not.toBe('demo_requested')
    }
  })
})

// ── Signature enforcement ─────────────────────────────────────────────────────

describe('Signature enforcement', () => {
  it('all generated email bodies end with "Global Talent Bridge Team"', () => {
    const drafts = generateApprovalDraftsForBatch([NORTHSTAR, BERLIN_DIGITAL, PFLEGE_KA, SYDNEY])
    for (const d of drafts.filter((d) => d.channel === 'email')) {
      expect(d.body).toContain('Global Talent Bridge Team')
    }
  })

  it('all generated linkedin bodies contain "Global Talent Bridge Team"', () => {
    const drafts = generateApprovalDraftsForBatch([PFLEGE_PLUS, MEDCARE])
    for (const d of drafts.filter((d) => d.channel === 'linkedin')) {
      expect(d.body).toContain('Global Talent Bridge Team')
    }
  })

  it('"Viele Grüße" appears in generated bodies', () => {
    const drafts = generateApprovalDraftsForBatch(BATCH_1_EMPLOYERS)
    for (const d of drafts) {
      expect(d.body).toMatch(/viele grüße/i)
    }
  })
})
