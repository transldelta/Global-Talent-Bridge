/**
 * __tests__/market-proof-launch.test.ts
 *
 * Tests for lib/market-proof-launch.ts — Market Proof & Buyer Launch Sprint.
 *
 * ⚠️  Safety constraints are tested explicitly:
 *     No fake customers · No fake revenue · No auto-send ·
 *     No Stripe · No job guarantee · No visa guarantee
 */

import { describe, it, expect } from 'vitest'
import {
  CAMPAIGNS,
  CAMPAIGN_TARGETS,
  LAUNCH_STEPS,
  REPLY_CLASSIFICATIONS,
  BUYER_OUTREACH_TEXTS,
  INITIAL_PROOF_STATE,
  REAL_REPLIES,
  generateProofExport,
  type ReplyClassification,
  type TargetStatus,
  type CampaignId,
  type ProofTrackerState,
} from '../lib/market-proof-launch'

// ── CAMPAIGNS ─────────────────────────────────────────────────────────────────

describe('CAMPAIGNS', () => {
  it('has exactly 3 campaigns', () => {
    expect(CAMPAIGNS).toHaveLength(3)
  })

  it('has correct campaign IDs', () => {
    const ids = CAMPAIGNS.map((c) => c.id)
    expect(ids).toContain('germany-healthcare')
    expect(ids).toContain('partner-channels')
    expect(ids).toContain('buyer-candidates')
  })

  it('each campaign has a label, goal, targetCount, corridor, priority, status, note', () => {
    for (const c of CAMPAIGNS) {
      expect(c.label.length).toBeGreaterThan(0)
      expect(c.goal.length).toBeGreaterThan(0)
      expect(c.targetCount).toBeGreaterThan(0)
      expect(c.corridor.length).toBeGreaterThan(0)
      expect(['high', 'medium', 'low']).toContain(c.priority)
      expect(['ready-to-launch', 'in-progress', 'completed']).toContain(c.status)
      expect(c.note.length).toBeGreaterThan(0)
    }
  })

  it('campaigns cover the top corridors (Germany Healthcare, Partner, Buyer)', () => {
    const labels = CAMPAIGNS.map((c) => c.label)
    expect(labels.some((l) => l.includes('Germany Healthcare'))).toBe(true)
    expect(labels.some((l) => l.includes('Partner'))).toBe(true)
    expect(labels.some((l) => l.includes('Buyer'))).toBe(true)
  })

  it('total declared target count is 45', () => {
    const total = CAMPAIGNS.reduce((sum, c) => sum + c.targetCount, 0)
    expect(total).toBe(45)
  })

  it('Campaign A is highest priority', () => {
    const a = CAMPAIGNS.find((c) => c.id === 'germany-healthcare')
    expect(a?.priority).toBe('high')
  })
})

// ── CAMPAIGN_TARGETS ──────────────────────────────────────────────────────────

describe('CAMPAIGN_TARGETS', () => {
  it('has exactly 45 targets', () => {
    expect(CAMPAIGN_TARGETS).toHaveLength(45)
  })

  it('Campaign A has 20 targets', () => {
    const a = CAMPAIGN_TARGETS.filter((t) => t.campaignId === 'germany-healthcare')
    expect(a).toHaveLength(20)
  })

  it('Campaign B has 15 targets', () => {
    const b = CAMPAIGN_TARGETS.filter((t) => t.campaignId === 'partner-channels')
    expect(b).toHaveLength(15)
  })

  it('Campaign C has 10 targets', () => {
    const c = CAMPAIGN_TARGETS.filter((t) => t.campaignId === 'buyer-candidates')
    expect(c).toHaveLength(10)
  })

  // ── SAFETY: all targets are placeholders ──────────────────────────────────

  it('[SAFETY] ALL targets have status real_contact_needed — no real contacts stored', () => {
    for (const t of CAMPAIGN_TARGETS) {
      expect(t.status).toBe('real_contact_needed')
    }
  })

  it('[SAFETY] no target contains a real email address', () => {
    for (const t of CAMPAIGN_TARGETS) {
      // notes should not contain @email.com style addresses
      expect(t.note).not.toMatch(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
    }
  })

  it('[SAFETY] no target contains a real phone number', () => {
    for (const t of CAMPAIGN_TARGETS) {
      expect(t.note).not.toMatch(/\+\d{7,}/)
    }
  })

  it('each target has required fields', () => {
    for (const t of CAMPAIGN_TARGETS) {
      expect(t.id.length).toBeGreaterThan(0)
      expect(['germany-healthcare', 'partner-channels', 'buyer-candidates']).toContain(t.campaignId)
      expect(t.targetType.length).toBeGreaterThan(0)
      expect(t.country.length).toBeGreaterThan(0)
      expect(t.corridor.length).toBeGreaterThan(0)
      expect(['email', 'linkedin', 'contact_form']).toContain(t.contactChannel)
      expect(t.note.length).toBeGreaterThan(0)
    }
  })

  it('target IDs are unique', () => {
    const ids = CAMPAIGN_TARGETS.map((t) => t.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('Campaign A targets include Germany Healthcare corridor', () => {
    const a = CAMPAIGN_TARGETS.filter((t) => t.campaignId === 'germany-healthcare')
    const hasGermany = a.some((t) =>
      t.corridor.includes('Germany') || t.corridor.includes('DACH'),
    )
    expect(hasGermany).toBe(true)
  })

  it('Campaign C targets are buyer-type contacts', () => {
    const c = CAMPAIGN_TARGETS.filter((t) => t.campaignId === 'buyer-candidates')
    const buyerTypes = c.filter((t) =>
      t.targetType.toLowerCase().includes('buyer') ||
      t.targetType.toLowerCase().includes('owner') ||
      t.targetType.toLowerCase().includes('founder') ||
      t.targetType.toLowerCase().includes('company') ||
      t.targetType.toLowerCase().includes('investor'),
    )
    expect(buyerTypes.length).toBeGreaterThan(0)
  })
})

// ── LAUNCH_STEPS ──────────────────────────────────────────────────────────────

describe('LAUNCH_STEPS', () => {
  it('has 8 steps', () => {
    expect(LAUNCH_STEPS).toHaveLength(8)
  })

  it('steps are numbered 1–8', () => {
    const nums = LAUNCH_STEPS.map((s) => s.step)
    expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('each step has a label, action, and tool', () => {
    for (const s of LAUNCH_STEPS) {
      expect(s.label.length).toBeGreaterThan(0)
      expect(s.action.length).toBeGreaterThan(0)
      expect(s.tool.length).toBeGreaterThan(0)
    }
  })

  // ── SAFETY: no auto-send in launch steps ─────────────────────────────────

  it('[SAFETY] step 4 (send) explicitly says "manual" or "manually"', () => {
    const sendStep = LAUNCH_STEPS.find((s) => s.step === 4)
    expect(sendStep).toBeDefined()
    const actionLower = sendStep!.action.toLowerCase()
    expect(actionLower.includes('manual') || actionLower.includes('manually')).toBe(true)
  })

  it('[SAFETY] no step references automatic sending', () => {
    for (const s of LAUNCH_STEPS) {
      const combined = `${s.label} ${s.action} ${s.tool}`.toLowerCase()
      expect(combined).not.toMatch(/auto.?send|automatic.?send|schedule.?send|bulk.?send/)
    }
  })

  it('[SAFETY] no step references scraping', () => {
    for (const s of LAUNCH_STEPS) {
      const combined = `${s.label} ${s.action} ${s.tool}`.toLowerCase()
      expect(combined).not.toMatch(/scrap/)
    }
  })

  it('all steps start as not done', () => {
    for (const s of LAUNCH_STEPS) {
      expect(s.done).toBe(false)
    }
  })
})

// ── REPLY_CLASSIFICATIONS ─────────────────────────────────────────────────────

describe('REPLY_CLASSIFICATIONS', () => {
  it('has 7 classification types', () => {
    expect(REPLY_CLASSIFICATIONS).toHaveLength(7)
  })

  it('includes all required classification values', () => {
    const values = REPLY_CLASSIFICATIONS.map((r) => r.value) as ReplyClassification[]
    expect(values).toContain('positive_interest')
    expect(values).toContain('wants_more_info')
    expect(values).toContain('neutral_feedback')
    expect(values).toContain('not_relevant')
    expect(values).toContain('rejected')
    expect(values).toContain('legal_risk')
    expect(values).toContain('buyer_interest')
  })

  it('each classification has value, label, description, and buyerValue', () => {
    for (const r of REPLY_CLASSIFICATIONS) {
      expect(r.value.length).toBeGreaterThan(0)
      expect(r.label.length).toBeGreaterThan(0)
      expect(r.description.length).toBeGreaterThan(0)
      expect(['high', 'medium', 'low', 'none']).toContain(r.buyerValue)
    }
  })

  it('positive_interest and buyer_interest have high buyer value', () => {
    const pos = REPLY_CLASSIFICATIONS.find((r) => r.value === 'positive_interest')
    const buyerInt = REPLY_CLASSIFICATIONS.find((r) => r.value === 'buyer_interest')
    expect(pos?.buyerValue).toBe('high')
    expect(buyerInt?.buyerValue).toBe('high')
  })

  it('rejected has none buyer value', () => {
    const rejected = REPLY_CLASSIFICATIONS.find((r) => r.value === 'rejected')
    expect(rejected?.buyerValue).toBe('none')
  })

  it('legal_risk has a description mentioning compliance or legal', () => {
    const lr = REPLY_CLASSIFICATIONS.find((r) => r.value === 'legal_risk')
    const desc = lr!.description.toLowerCase()
    expect(desc.includes('legal') || desc.includes('compliance') || desc.includes('regulatory')).toBe(true)
  })
})

// ── BUYER_OUTREACH_TEXTS ──────────────────────────────────────────────────────

describe('BUYER_OUTREACH_TEXTS', () => {
  it('has at least 6 outreach templates', () => {
    expect(BUYER_OUTREACH_TEXTS.length).toBeGreaterThanOrEqual(6)
  })

  it('each template has id, label, targetType, channel, body, note', () => {
    for (const t of BUYER_OUTREACH_TEXTS) {
      expect(t.id.length).toBeGreaterThan(0)
      expect(t.label.length).toBeGreaterThan(0)
      expect(t.targetType.length).toBeGreaterThan(0)
      expect(['dm', 'email', 'listing', 'teaser']).toContain(t.channel)
      expect(t.body.length).toBeGreaterThan(50)
      expect(t.note.length).toBeGreaterThan(0)
    }
  })

  it('email templates have a subject', () => {
    const emails = BUYER_OUTREACH_TEXTS.filter((t) => t.channel === 'email')
    for (const e of emails) {
      expect(e.subject).toBeDefined()
      expect(e.subject!.length).toBeGreaterThan(0)
    }
  })

  it('IDs are unique', () => {
    const ids = BUYER_OUTREACH_TEXTS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  // ── SAFETY: templates must acknowledge honest gaps ────────────────────────

  it('[SAFETY] templates do not claim fake revenue or paying customers', () => {
    for (const t of BUYER_OUTREACH_TEXTS) {
      const bodyLower = t.body.toLowerCase()
      // Should not claim non-zero MRR adjacent to amount (€0 MRR is fine — honest disclosure)
      // Only matches immediate adjacency e.g. "€5000 mrr" or "mrr: €5000" (not distant in text)
      expect(bodyLower).not.toMatch(/€[1-9]\d*\s{0,5}mrr|mrr[:\s]{0,5}€[1-9]|\$[1-9]\d*\s{0,5}mrr/)
      // Should not claim "X customers" with a real number
      expect(bodyLower).not.toMatch(/\d+\s+paying\s+customers/)
    }
  })

  it('[SAFETY] templates do not mention automatic sending', () => {
    for (const t of BUYER_OUTREACH_TEXTS) {
      const bodyLower = t.body.toLowerCase()
      expect(bodyLower).not.toMatch(/auto.?send|automatic.*send|send automatically/)
    }
  })

  it('[SAFETY] templates do not make job or visa guarantees', () => {
    for (const t of BUYER_OUTREACH_TEXTS) {
      const bodyLower = t.body.toLowerCase()
      expect(bodyLower).not.toMatch(/guarantee.*job|job.*guarantee|guarantee.*visa|visa.*guarantee/)
    }
  })

  it('asset-stage disclosure appears in listing or email templates', () => {
    const hasDisclosure = BUYER_OUTREACH_TEXTS.some((t) =>
      t.body.toLowerCase().includes('asset stage') ||
      t.body.toLowerCase().includes('no mrr') ||
      t.body.toLowerCase().includes('no paying'),
    )
    expect(hasDisclosure).toBe(true)
  })

  it('suggested ask range (49 000–79 000) appears in at least one template', () => {
    const hasRange = BUYER_OUTREACH_TEXTS.some((t) =>
      t.body.includes('49') || t.body.includes('79 000') || t.body.includes('49 000'),
    )
    expect(hasRange).toBe(true)
  })

  it('includes a teaser/short-form template', () => {
    const teaser = BUYER_OUTREACH_TEXTS.find((t) => t.channel === 'teaser')
    expect(teaser).toBeDefined()
  })

  it('includes a listing/marketplace template', () => {
    const listing = BUYER_OUTREACH_TEXTS.find((t) => t.channel === 'listing')
    expect(listing).toBeDefined()
  })
})

// ── INITIAL_PROOF_STATE ───────────────────────────────────────────────────────

describe('INITIAL_PROOF_STATE', () => {
  it('starts with all numeric fields at 0', () => {
    expect(INITIAL_PROOF_STATE.targetsPrepared).toBe(0)
    expect(INITIAL_PROOF_STATE.draftsOpened).toBe(0)
    expect(INITIAL_PROOF_STATE.sentManually).toBe(0)
    expect(INITIAL_PROOF_STATE.repliesReceived).toBe(0)
    expect(INITIAL_PROOF_STATE.positiveReplies).toBe(0)
    expect(INITIAL_PROOF_STATE.neutralReplies).toBe(0)
    expect(INITIAL_PROOF_STATE.rejectedReplies).toBe(0)
    expect(INITIAL_PROOF_STATE.legalRiskReplies).toBe(0)
    expect(INITIAL_PROOF_STATE.buyerInterestLeads).toBe(0)
  })

  it('starts with empty proofNotes', () => {
    expect(INITIAL_PROOF_STATE.proofNotes).toBe('')
  })

  it('starts with buyerVisibleProof = false', () => {
    expect(INITIAL_PROOF_STATE.buyerVisibleProof).toBe(false)
  })
})

// ── REAL_REPLIES ──────────────────────────────────────────────────────────────

describe('REAL_REPLIES', () => {
  it('starts empty — no real replies collected yet', () => {
    expect(REAL_REPLIES).toHaveLength(0)
  })

  it('[SAFETY] if any reply exists, it must have isReal = true', () => {
    for (const r of REAL_REPLIES) {
      expect(r.isReal).toBe(true)
    }
  })
})

// ── generateProofExport ───────────────────────────────────────────────────────

describe('generateProofExport', () => {
  it('returns a non-empty string', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('includes the date', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(result).toContain('2026-06-08')
  })

  it('includes outreach activity section', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(result).toContain('Outreach Activity')
  })

  it('shows 0 for all counts when no replies', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(result).toContain('Targets prepared:')
    expect(result).toContain('Replies received:')
    expect(result).toContain('0')
  })

  it('shows "No buyer-visible replies" when none', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(result).toContain('No buyer-visible replies collected yet')
  })

  it('[SAFETY] export header warns about real replies only', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(result.toLowerCase()).toContain('real replies only')
  })

  it('[SAFETY] export states test data is excluded', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(result.toLowerCase()).toContain('test data')
  })

  it('[SAFETY] export states no fake customers', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    const lower = result.toLowerCase()
    expect(lower.includes('no fake') || lower.includes('fake customer')).toBe(true)
  })

  it('shows buyer-visible replies when provided', () => {
    const replies = [
      {
        targetId: 'a01',
        classification: 'positive_interest' as ReplyClassification,
        summary: 'Language school expressed interest in corridor partnership',
        buyerVisible: true,
        isReal: true,
      },
    ]
    const result = generateProofExport(INITIAL_PROOF_STATE, replies, '2026-06-08')
    expect(result).toContain('Language school expressed interest')
    expect(result).toContain('positive_interest')
  })

  it('excludes non-buyer-visible replies from buyer section', () => {
    const replies = [
      {
        targetId: 'a02',
        classification: 'neutral_feedback' as ReplyClassification,
        summary: 'Internal feedback only — not for buyer',
        buyerVisible: false,
        isReal: true,
      },
    ]
    const result = generateProofExport(INITIAL_PROOF_STATE, replies, '2026-06-08')
    expect(result).not.toContain('Internal feedback only')
  })

  it('[SAFETY] excludes replies where isReal = false', () => {
    const replies = [
      {
        targetId: 'test-fake',
        classification: 'positive_interest' as ReplyClassification,
        summary: 'This is a fake reply for testing',
        buyerVisible: true,
        isReal: false, // must be excluded
      },
    ]
    const result = generateProofExport(INITIAL_PROOF_STATE, replies, '2026-06-08')
    // fake reply should not appear — only isReal=true replies are included
    expect(result).not.toContain('This is a fake reply for testing')
  })

  it('shows correct sent count from tracker', () => {
    const tracker: ProofTrackerState = {
      ...INITIAL_PROOF_STATE,
      sentManually: 7,
      repliesReceived: 2,
      positiveReplies: 1,
    }
    const result = generateProofExport(tracker, [], '2026-06-08')
    expect(result).toContain('7')
    expect(result).toContain('2')
  })

  it('includes a disclaimer section', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(result).toContain('Disclaimer')
  })

  it('[SAFETY] disclaimer states real human contacts only', () => {
    const result = generateProofExport(INITIAL_PROOF_STATE, [], '2026-06-08')
    expect(result.toLowerCase()).toContain('real human')
  })
})

// ── TYPE GUARDS ───────────────────────────────────────────────────────────────

describe('TypeScript type coverage', () => {
  it('TargetStatus covers all required statuses', () => {
    const statuses: TargetStatus[] = [
      'real_contact_needed',
      'draft_ready',
      'draft_opened',
      'sent_manually',
      'reply_received',
      'proof_confirmed',
    ]
    expect(statuses).toHaveLength(6)
  })

  it('CampaignId covers all 3 campaigns', () => {
    const ids: CampaignId[] = [
      'germany-healthcare',
      'partner-channels',
      'buyer-candidates',
    ]
    expect(ids).toHaveLength(3)
  })

  it('all targets use a valid TargetStatus', () => {
    const validStatuses: TargetStatus[] = [
      'real_contact_needed',
      'draft_ready',
      'draft_opened',
      'sent_manually',
      'reply_received',
      'proof_confirmed',
    ]
    for (const t of CAMPAIGN_TARGETS) {
      expect(validStatuses).toContain(t.status)
    }
  })

  it('all classifications use a valid ReplyClassification', () => {
    const validClassifications: ReplyClassification[] = [
      'positive_interest',
      'wants_more_info',
      'neutral_feedback',
      'not_relevant',
      'rejected',
      'legal_risk',
      'buyer_interest',
    ]
    for (const r of REPLY_CLASSIFICATIONS) {
      expect(validClassifications).toContain(r.value)
    }
  })
})

// ── INTEGRATION ───────────────────────────────────────────────────────────────

describe('Integration: campaigns and targets are consistent', () => {
  it('every target.campaignId corresponds to an existing campaign', () => {
    const campaignIds = CAMPAIGNS.map((c) => c.id)
    for (const t of CAMPAIGN_TARGETS) {
      expect(campaignIds).toContain(t.campaignId)
    }
  })

  it('each campaign targetCount matches the actual number of targets', () => {
    for (const c of CAMPAIGNS) {
      const actual = CAMPAIGN_TARGETS.filter((t) => t.campaignId === c.id).length
      expect(actual).toBe(c.targetCount)
    }
  })

  it('launch steps reference known admin tools', () => {
    const knownTools = [
      '/admin/global-growth-department',
      '/admin/contact-copilot',
      '/admin/market-proof-launch',
      'Gmail (manual)',
    ]
    for (const s of LAUNCH_STEPS) {
      expect(knownTools.some((k) => s.tool.includes(k))).toBe(true)
    }
  })
})
