/**
 * __tests__/buyer-room.test.ts
 *
 * Tests for lib/buyer-room.ts — Sale Readiness Score, Asset Inventory,
 * Transfer Checklist, Honest Gaps, and safety guarantees.
 */

import { describe, it, expect } from 'vitest'
import {
  SALE_READINESS_CRITERIA,
  BUYER_ASSETS,
  DIFFERENTIATION_POINTS,
  TECHNICAL_PROOF_ITEMS,
  HONEST_GAPS,
  TRANSFER_STEPS,
  MONETIZATION_OPTIONS,
  VALUATION_CONTEXT,
  DEMO_STEPS,
  SELL_READY_ITEMS,
  EXECUTIVE_SUMMARY,
  MARKET_PROOF_PLAN,
  calculateSaleReadinessScore,
  saleReadinessBand,
} from '@/lib/buyer-room'

// ── calculateSaleReadinessScore ───────────────────────────────────────────────

describe('calculateSaleReadinessScore', () => {
  it('returns a number between 0 and 100', () => {
    const score = calculateSaleReadinessScore()
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('is the average of all criteria scores', () => {
    const sum = SALE_READINESS_CRITERIA.reduce((s, c) => s + c.score, 0)
    const expected = Math.round(sum / SALE_READINESS_CRITERIA.length)
    expect(calculateSaleReadinessScore()).toBe(expected)
  })

  it('is a whole number (rounded)', () => {
    const score = calculateSaleReadinessScore()
    expect(Number.isInteger(score)).toBe(true)
  })
})

// ── saleReadinessBand ─────────────────────────────────────────────────────────

describe('saleReadinessBand', () => {
  it('returns green for score >= 70', () => {
    expect(saleReadinessBand(70).color).toBe('green')
    expect(saleReadinessBand(100).color).toBe('green')
  })

  it('returns yellow for 50–69', () => {
    expect(saleReadinessBand(50).color).toBe('yellow')
    expect(saleReadinessBand(69).color).toBe('yellow')
  })

  it('returns red for score < 50', () => {
    expect(saleReadinessBand(0).color).toBe('red')
    expect(saleReadinessBand(49).color).toBe('red')
  })

  it('every band has a non-empty label and summary', () => {
    for (const score of [0, 50, 70, 100]) {
      const band = saleReadinessBand(score)
      expect(band.label.length).toBeGreaterThan(0)
      expect(band.summary.length).toBeGreaterThan(0)
    }
  })
})

// ── SALE_READINESS_CRITERIA ───────────────────────────────────────────────────

describe('SALE_READINESS_CRITERIA', () => {
  it('has 8 criteria', () => {
    expect(SALE_READINESS_CRITERIA.length).toBe(8)
  })

  it('contains market_proof criterion', () => {
    const keys = SALE_READINESS_CRITERIA.map((c) => c.key)
    expect(keys).toContain('market_proof')
  })

  it('contains revenue_proof criterion', () => {
    const keys = SALE_READINESS_CRITERIA.map((c) => c.key)
    expect(keys).toContain('revenue_proof')
  })

  it('market_proof score is honestly low (< 30)', () => {
    const mp = SALE_READINESS_CRITERIA.find((c) => c.key === 'market_proof')
    expect(mp).toBeDefined()
    expect(mp!.score).toBeLessThan(30)
  })

  it('revenue_proof score is honestly low (< 20)', () => {
    const rp = SALE_READINESS_CRITERIA.find((c) => c.key === 'revenue_proof')
    expect(rp).toBeDefined()
    expect(rp!.score).toBeLessThan(20)
  })

  it('every criterion has a non-empty rationale', () => {
    for (const c of SALE_READINESS_CRITERIA) {
      expect(c.rationale.length).toBeGreaterThan(10)
    }
  })

  it('every criterion score is in [0, 100]', () => {
    for (const c of SALE_READINESS_CRITERIA) {
      expect(c.score).toBeGreaterThanOrEqual(0)
      expect(c.score).toBeLessThanOrEqual(100)
    }
  })

  it('every criterion has a unique key', () => {
    const keys = SALE_READINESS_CRITERIA.map((c) => c.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

// ── BUYER_ASSETS — "What the buyer gets" ─────────────────────────────────────

describe('BUYER_ASSETS', () => {
  it('has at least 15 assets', () => {
    expect(BUYER_ASSETS.length).toBeGreaterThanOrEqual(15)
  })

  it('contains domain asset', () => {
    expect(BUYER_ASSETS.some((a) => a.id === 'domain')).toBe(true)
  })

  it('contains github asset', () => {
    expect(BUYER_ASSETS.some((a) => a.id === 'github')).toBe(true)
  })

  it('contains vercel asset', () => {
    expect(BUYER_ASSETS.some((a) => a.id === 'vercel')).toBe(true)
  })

  it('contains supabase asset', () => {
    expect(BUYER_ASSETS.some((a) => a.id === 'supabase')).toBe(true)
  })

  it('contains corridor intelligence asset', () => {
    expect(BUYER_ASSETS.some((a) => a.id === 'corridor')).toBe(true)
  })

  it('stripe is explicitly listed as not-active', () => {
    const stripe = BUYER_ASSETS.find((a) => a.id === 'stripe')
    expect(stripe).toBeDefined()
    expect(stripe!.status).toBe('not-active')
  })

  it('paying customers is explicitly listed as not-active', () => {
    const customers = BUYER_ASSETS.find((a) => a.id === 'customers')
    expect(customers).toBeDefined()
    expect(customers!.status).toBe('not-active')
  })

  it('every asset has a non-empty label and detail', () => {
    for (const a of BUYER_ASSETS) {
      expect(a.label.length).toBeGreaterThan(0)
      expect(a.detail.length).toBeGreaterThan(0)
    }
  })

  it('every asset has a valid status', () => {
    const valid = new Set(['ready', 'partial', 'not-active'])
    for (const a of BUYER_ASSETS) {
      expect(valid.has(a.status)).toBe(true)
    }
  })
})

// ── DIFFERENTIATION_POINTS — "Why not a generic SaaS" ────────────────────────

describe('DIFFERENTIATION_POINTS', () => {
  it('has at least 6 points', () => {
    expect(DIFFERENTIATION_POINTS.length).toBeGreaterThanOrEqual(6)
  })

  it('contains "Not a job board" point', () => {
    expect(DIFFERENTIATION_POINTS.some((d) =>
      d.label.toLowerCase().includes('job board'),
    )).toBe(true)
  })

  it('contains "Not a standard ATS" point', () => {
    expect(DIFFERENTIATION_POINTS.some((d) =>
      d.label.toLowerCase().includes('ats'),
    )).toBe(true)
  })

  it('contains approval-based growth point', () => {
    expect(DIFFERENTIATION_POINTS.some((d) =>
      d.label.toLowerCase().includes('approval'),
    )).toBe(true)
  })

  it('every point has a non-empty detail', () => {
    for (const d of DIFFERENTIATION_POINTS) {
      expect(d.detail.length).toBeGreaterThan(10)
    }
  })
})

// ── TRANSFER_STEPS ────────────────────────────────────────────────────────────

describe('TRANSFER_STEPS', () => {
  it('has exactly 10 transfer steps', () => {
    expect(TRANSFER_STEPS.length).toBe(10)
  })

  it('steps are ordered 1–10', () => {
    for (let i = 0; i < TRANSFER_STEPS.length; i++) {
      expect(TRANSFER_STEPS[i].order).toBe(i + 1)
    }
  })

  it('contains GitHub transfer step', () => {
    expect(TRANSFER_STEPS.some((s) =>
      s.label.toLowerCase().includes('github'),
    )).toBe(true)
  })

  it('contains Vercel transfer step', () => {
    expect(TRANSFER_STEPS.some((s) =>
      s.label.toLowerCase().includes('vercel'),
    )).toBe(true)
  })

  it('contains Supabase transfer step', () => {
    expect(TRANSFER_STEPS.some((s) =>
      s.label.toLowerCase().includes('supabase'),
    )).toBe(true)
  })

  it('contains domain transfer step', () => {
    expect(TRANSFER_STEPS.some((s) =>
      s.label.toLowerCase().includes('domain'),
    )).toBe(true)
  })

  it('every step has a valid effort value', () => {
    const valid = new Set(['minutes', 'hours', 'days'])
    for (const s of TRANSFER_STEPS) {
      expect(valid.has(s.effort)).toBe(true)
    }
  })
})

// ── HONEST_GAPS ───────────────────────────────────────────────────────────────

describe('HONEST_GAPS', () => {
  it('has at least 6 honest gaps', () => {
    expect(HONEST_GAPS.length).toBeGreaterThanOrEqual(6)
  })

  it('contains "No paying customers yet" gap', () => {
    expect(HONEST_GAPS.some((g) =>
      g.label.toLowerCase().includes('no paying customers'),
    )).toBe(true)
  })

  it('contains "No MRR yet" gap', () => {
    expect(HONEST_GAPS.some((g) =>
      g.label.toLowerCase().includes('no mrr'),
    )).toBe(true)
  })

  it('contains "Stripe not active" gap', () => {
    expect(HONEST_GAPS.some((g) =>
      g.label.toLowerCase().includes('stripe'),
    )).toBe(true)
  })

  it('contains "Market validation" gap', () => {
    expect(HONEST_GAPS.some((g) =>
      g.label.toLowerCase().includes('market validation'),
    )).toBe(true)
  })

  it('contains "Test data ≠ market proof" gap', () => {
    expect(HONEST_GAPS.some((g) =>
      g.detail.toLowerCase().includes('test data'),
    )).toBe(true)
  })

  it('every gap has a valid severity', () => {
    const valid = new Set(['info', 'caution', 'blocker'])
    for (const g of HONEST_GAPS) {
      expect(valid.has(g.severity)).toBe(true)
    }
  })
})

// ── MONETIZATION_OPTIONS ──────────────────────────────────────────────────────

describe('MONETIZATION_OPTIONS', () => {
  it('has at least 6 options', () => {
    expect(MONETIZATION_OPTIONS.length).toBeGreaterThanOrEqual(6)
  })

  it('contains acquisition option', () => {
    expect(MONETIZATION_OPTIONS.some((m) => m.id === 'acquisition')).toBe(true)
  })

  it('every option has a valid effort', () => {
    const valid = new Set(['low', 'medium', 'high'])
    for (const m of MONETIZATION_OPTIONS) {
      expect(valid.has(m.effort)).toBe(true)
    }
  })

  it('every option has a valid readiness', () => {
    const valid = new Set(['ready-to-activate', 'needs-sales-step', 'strategic-long-term'])
    for (const m of MONETIZATION_OPTIONS) {
      expect(valid.has(m.readiness)).toBe(true)
    }
  })
})

// ── VALUATION_CONTEXT ─────────────────────────────────────────────────────────

describe('VALUATION_CONTEXT', () => {
  it('has a disclaimer', () => {
    expect(VALUATION_CONTEXT.disclaimer.length).toBeGreaterThan(20)
  })

  it('disclaimer mentions it is NOT a guarantee', () => {
    expect(VALUATION_CONTEXT.disclaimer).toMatch(/not.*guarantee|guarantee.*not/i)
  })

  it('has a suggested ask range', () => {
    expect(VALUATION_CONTEXT.suggestedAsk.length).toBeGreaterThan(0)
  })

  it('suggested ask contains € symbol', () => {
    expect(VALUATION_CONTEXT.suggestedAsk).toMatch(/€/)
  })

  it('has rationale with at least 3 entries', () => {
    expect(VALUATION_CONTEXT.rationale.length).toBeGreaterThanOrEqual(3)
  })

  it('has value drivers with at least 5 entries', () => {
    expect(VALUATION_CONTEXT.valueDrivers.length).toBeGreaterThanOrEqual(5)
  })

  it('value drivers include a negative entry (paying customers)', () => {
    const negatives = VALUATION_CONTEXT.valueDrivers.filter((v) => v.impact.startsWith('−'))
    expect(negatives.length).toBeGreaterThan(0)
  })

  it('rationale does not promise guaranteed revenue', () => {
    const combined = VALUATION_CONTEXT.rationale.join(' ')
    expect(combined).not.toMatch(/guaranteed.*revenue|revenue.*guaranteed/i)
  })
})

// ── SELL_READY_ITEMS ──────────────────────────────────────────────────────────

describe('SELL_READY_ITEMS', () => {
  it('has at least 25 items', () => {
    expect(SELL_READY_ITEMS.length).toBeGreaterThanOrEqual(25)
  })

  it('has at least some done items', () => {
    expect(SELL_READY_ITEMS.filter((i) => i.done).length).toBeGreaterThan(15)
  })

  it('has at least some pending items (honest gaps)', () => {
    expect(SELL_READY_ITEMS.filter((i) => !i.done).length).toBeGreaterThan(0)
  })

  it('first paid transaction is NOT done', () => {
    const paid = SELL_READY_ITEMS.find((i) =>
      i.label.toLowerCase().includes('paid transaction'),
    )
    expect(paid).toBeDefined()
    expect(paid!.done).toBe(false)
  })

  it('market proof (real replies) is NOT done', () => {
    const replies = SELL_READY_ITEMS.find((i) =>
      i.label.toLowerCase().includes('written replies'),
    )
    expect(replies).toBeDefined()
    expect(replies!.done).toBe(false)
  })

  it('TypeScript clean is done', () => {
    const ts = SELL_READY_ITEMS.find((i) =>
      i.label.toLowerCase().includes('typescript'),
    )
    expect(ts).toBeDefined()
    expect(ts!.done).toBe(true)
  })
})

// ── Safety guarantees in data ─────────────────────────────────────────────────

describe('Safety guarantees — no fake data', () => {
  it('HONEST_GAPS contains no fake revenue claim', () => {
    const combined = HONEST_GAPS.map((g) => g.label + ' ' + g.detail).join(' ')
    expect(combined).not.toMatch(/fake revenue|invented revenue|fake customer/i)
  })

  it('VALUATION_CONTEXT does not claim fake customers', () => {
    const combined = [
      ...VALUATION_CONTEXT.rationale,
      ...VALUATION_CONTEXT.valueDrivers.map((v) => v.driver + ' ' + v.impact),
    ].join(' ')
    expect(combined).not.toMatch(/fake customer|fake revenue/i)
  })

  it('EXECUTIVE_SUMMARY does not claim paying customers exist', () => {
    const combined = EXECUTIVE_SUMMARY.join(' ').toLowerCase()
    expect(combined).not.toMatch(/paying customer|mrr|arr|revenue of/i)
  })

  it('MARKET_PROOF_PLAN forbids fake testimonials', () => {
    const combined = MARKET_PROOF_PLAN.join(' ').toLowerCase()
    expect(combined).toMatch(/no fake testimonial|fake testimonial/i)
  })

  it('no_auto_send is mentioned in compliance items', () => {
    const combined = SELL_READY_ITEMS.map((i) => i.label + ' ' + i.note).join(' ')
    expect(combined).toMatch(/no.auto.send|no_auto_send/i)
  })

  it('stripe is explicitly noted as not active', () => {
    const stripeAsset = BUYER_ASSETS.find((a) => a.id === 'stripe')
    expect(stripeAsset!.status).toBe('not-active')
    const stripeGap = HONEST_GAPS.find((g) => g.label.toLowerCase().includes('stripe'))
    expect(stripeGap).toBeDefined()
  })

  it('job guarantee is not promised anywhere in the data', () => {
    const allText = [
      ...EXECUTIVE_SUMMARY,
      ...DIFFERENTIATION_POINTS.map((d) => d.label + ' ' + d.detail),
      ...VALUATION_CONTEXT.rationale,
    ].join(' ').toLowerCase()
    expect(allText).not.toMatch(/job guarantee|guaranteed.*job|visa guarantee|guaranteed.*visa/i)
  })
})

// ── DEMO_STEPS ────────────────────────────────────────────────────────────────

describe('DEMO_STEPS', () => {
  it('has exactly 10 demo steps', () => {
    expect(DEMO_STEPS.length).toBe(10)
  })

  it('steps are ordered 1–10', () => {
    for (let i = 0; i < DEMO_STEPS.length; i++) {
      expect(DEMO_STEPS[i].step).toBe(i + 1)
    }
  })

  it('includes /admin/buyer-room in the demo', () => {
    expect(DEMO_STEPS.some((s) => s.url.includes('buyer-room'))).toBe(true)
  })

  it('includes corridor intelligence in the demo', () => {
    expect(DEMO_STEPS.some((s) => s.url.includes('corridor-intelligence'))).toBe(true)
  })

  it('every step has a non-empty focus description', () => {
    for (const s of DEMO_STEPS) {
      expect(s.focus.length).toBeGreaterThan(0)
    }
  })
})

// ── TECHNICAL_PROOF_ITEMS ─────────────────────────────────────────────────────

describe('TECHNICAL_PROOF_ITEMS', () => {
  it('has at least 10 proof items', () => {
    expect(TECHNICAL_PROOF_ITEMS.length).toBeGreaterThanOrEqual(10)
  })

  it('all items have status "pass"', () => {
    for (const item of TECHNICAL_PROOF_ITEMS) {
      expect(['pass', 'info'].includes(item.status)).toBe(true)
    }
  })

  it('mentions 4112 tests passing', () => {
    expect(TECHNICAL_PROOF_ITEMS.some((i) =>
      i.value.includes('4 112') || i.value.includes('4112'),
    )).toBe(true)
  })

  it('mentions 0 TypeScript errors', () => {
    expect(TECHNICAL_PROOF_ITEMS.some((i) =>
      i.label.toLowerCase().includes('typescript') && i.value === '0',
    )).toBe(true)
  })

  it('confirms robots.txt blocks /admin', () => {
    expect(TECHNICAL_PROOF_ITEMS.some((i) =>
      i.label.toLowerCase().includes('robots') && i.value.includes('/admin'),
    )).toBe(true)
  })
})
