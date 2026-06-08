/**
 * __tests__/sales-launch.test.ts
 *
 * Final Sales Launch Preparation Sprint — tests.
 *
 * Verifies:
 * - All required sale docs exist and have minimum content
 * - Buyer Room has Sales Launch tab (via type check)
 * - Safety constraints: no fake revenue, no fake customers,
 *   no job/visa guarantee, no auto-send, no scraping, no Stripe
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(process.cwd())
const docs = (file: string) => join(ROOT, 'docs', file)
const app  = (file: string) => join(ROOT, 'app', file)

function readDoc(file: string): string {
  const path = docs(file)
  expect(existsSync(path), `${file} must exist`).toBe(true)
  return readFileSync(path, 'utf-8')
}

// ── Document existence ────────────────────────────────────────────────────────

describe('Sale docs — existence', () => {
  const required = [
    'SALE_LISTING_DRAFT.md',
    'BUYER_OUTREACH_MESSAGES.md',
    'BUYER_QA.md',
    'FAST_SALE_PLAN.md',
    'SALE_DATA_ROOM_INDEX.md',
    // Pre-existing docs that must still be present
    'BUYER_OVERVIEW.md',
    'TRANSFER_GUIDE.md',
    'TECHNICAL_ARCHITECTURE.md',
    'SECURITY_AND_COMPLIANCE.md',
    'MARKET_PROOF_PLAN.md',
    'VALUATION_ARGUMENT.md',
    'ASSET_INVENTORY.md',
    'SELL_READY_CHECKLIST.md',
    'BUYER_DEMO_SCRIPT.md',
    'BUYER_TARGET_LIST_TEMPLATE.md',
  ]

  for (const file of required) {
    it(`docs/${file} exists`, () => {
      expect(existsSync(docs(file))).toBe(true)
    })
  }
})

// ── SALE_LISTING_DRAFT ────────────────────────────────────────────────────────

describe('SALE_LISTING_DRAFT.md', () => {
  it('has a title', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md')
    expect(content).toContain('CorridorWork')
  })

  it('mentions corridor intelligence', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content).toContain('corridor intelligence')
  })

  it('mentions persistent or approval-based pipeline', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content.includes('approval-based') || content.includes('persistent')).toBe(true)
  })

  it('mentions Buyer Room', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content).toContain('buyer room')
  })

  it('mentions EU-hosted Supabase or EU-Frankfurt', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content.includes('eu-frankfurt') || content.includes('eu-hosted') || content.includes('supabase')).toBe(true)
  })

  it('mentions no auto-send or no automatic sending', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content.includes('no auto') || content.includes('no automatic') || content.includes('auto-send')).toBe(true)
  })

  it('mentions no scraping', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content).toContain('scrap')
  })

  it('mentions RLS or row-level security', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content.includes('rls') || content.includes('row-level security')).toBe(true)
  })

  it('mentions suggested ask range', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md')
    expect(content.includes('49') || content.includes('79 000') || content.includes('49 000')).toBe(true)
  })

  it('[SAFETY] states asset stage explicitly', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content).toContain('asset stage')
  })

  it('[SAFETY] states no MRR or €0 MRR', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content.includes('no mrr') || content.includes('€0') || content.includes('mrr = €0')).toBe(true)
  })

  it('[SAFETY] has honest gaps section', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content.includes('honest gap') || content.includes('gaps')).toBe(true)
  })

  it('[SAFETY] does not claim paying customers', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content).not.toMatch(/\d+\s+paying\s+customer/)
  })

  it('[SAFETY] does not claim non-zero MRR adjacent to amount', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content).not.toMatch(/€[1-9]\d{2,}\s{0,5}mrr|mrr[:\s]{0,5}€[1-9]/)
  })

  it('[SAFETY] explicitly states no job guarantee (not an affirmative claim)', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    // Must contain the disclaimer; must NOT contain affirmative "we guarantee job/placement"
    expect(content).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?job|job\s+placement\s+guaranteed/)
    // The phrase "no job guarantee" (the disclaimer) must be present
    expect(content.includes('no job guarantee') || content.includes('keine jobgarantie') || content.includes('no placement guarantee')).toBe(true)
  })

  it('[SAFETY] explicitly states no visa guarantee (not an affirmative claim)', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    expect(content).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?visa|visa\s+guaranteed/)
    expect(content.includes('no visa guarantee') || content.includes('keine visagarantie')).toBe(true)
  })

  it('[SAFETY] no Stripe activation claim', () => {
    const content = readDoc('SALE_LISTING_DRAFT.md').toLowerCase()
    // Stripe mention is fine (explaining it's not active); claiming it's active is not
    expect(content).not.toMatch(/stripe\s+is\s+active|stripe\s+connected/)
  })
})

// ── BUYER_OUTREACH_MESSAGES ───────────────────────────────────────────────────

describe('BUYER_OUTREACH_MESSAGES.md', () => {
  it('has 5 buyer type sections (A–E)', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md')
    expect(content).toContain('## A.')
    expect(content).toContain('## B.')
    expect(content).toContain('## C.')
    expect(content).toContain('## D.')
    expect(content).toContain('## E.')
  })

  it('covers recruiting agency owner', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content).toContain('recruiting agency')
  })

  it('covers relocation company', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content).toContain('relocation')
  })

  it('covers HR-tech founder', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content.includes('hr-tech') || content.includes('hr tech')).toBe(true)
  })

  it('covers micro-SaaS buyer', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content.includes('micro-saas') || content.includes('micro saas')).toBe(true)
  })

  it('covers training / language school', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content.includes('language school') || content.includes('training')).toBe(true)
  })

  it('uses CorridorWork Team signature', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md')
    expect(content).toContain('CorridorWork Team')
  })

  it('instructs manual sending only', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content.includes('manually') || content.includes('manual')).toBe(true)
  })

  it('[SAFETY] does not claim paying customers', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content).not.toMatch(/\d+\s+paying\s+customer/)
  })

  it('[SAFETY] does not claim non-zero MRR in message body', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content).not.toMatch(/€[1-9]\d{2,}\s{0,5}mrr|mrr[:\s]{0,5}€[1-9]/)
  })

  it('[SAFETY] no affirmative job guarantee in messages', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    // Only affirmative claims are prohibited; "no job guarantee" disclaimers are correct
    expect(content).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?job|job\s+placement\s+guaranteed/)
  })

  it('[SAFETY] no affirmative visa guarantee in messages', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    expect(content).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?visa|visa\s+guaranteed/)
  })

  it('[SAFETY] no affirmative auto-send claim in messages', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md').toLowerCase()
    // "no auto-send" or "send automatically" in a positive context would be problematic
    // Checks for affirmative auto-send claims only (not the "no auto-send" disclaimer)
    expect(content).not.toMatch(/(?:we\s+)?send\s+automatically|auto.?send\s+is\s+enabled|bulk\s+send\s+supported/)
  })

  it('mentions corridorwork.com in messages', () => {
    const content = readDoc('BUYER_OUTREACH_MESSAGES.md')
    expect(content).toContain('corridorwork.com')
  })
})

// ── BUYER_QA ──────────────────────────────────────────────────────────────────

describe('BUYER_QA.md', () => {
  it('covers revenue question', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content.includes('umsatz') || content.includes('revenue')).toBe(true)
  })

  it('covers customers question', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content.includes('kunden') || content.includes('customer')).toBe(true)
  })

  it('covers what is ready', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content.includes('fertig') || content.includes('ready') || content.includes('what is ready')).toBe(true)
  })

  it('covers transfer process', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content.includes('übertragen') || content.includes('transfer')).toBe(true)
  })

  it('covers risks', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content.includes('risiken') || content.includes('risk')).toBe(true)
  })

  it('covers no auto-send question', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content.includes('auto') || content.includes('automatic')).toBe(true)
  })

  it('covers no scraping question', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content).toContain('scrap')
  })

  it('has at least 8 Q sections', () => {
    const content = readDoc('BUYER_QA.md')
    const matches = content.match(/^## Q\d+/gm)
    expect(matches).toBeDefined()
    expect(matches!.length).toBeGreaterThanOrEqual(8)
  })

  it('[SAFETY] Q1 (revenue) answers with €0 or no revenue honestly', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    // Revenue answer must be honest — contain "0" or "nein" or "no"
    expect(content.includes('€0') || content.includes('nein') || content.includes('no.')).toBe(true)
  })

  it('[SAFETY] no fake customers claimed', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content).not.toMatch(/\d+\s+paying\s+customer/)
  })

  it('[SAFETY] no job guarantee', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content).not.toMatch(/guarantee.*job|job.*guarantee/)
  })

  it('[SAFETY] no visa guarantee', () => {
    const content = readDoc('BUYER_QA.md').toLowerCase()
    expect(content).not.toMatch(/guarantee.*visa|visa.*guarantee/)
  })
})

// ── FAST_SALE_PLAN ────────────────────────────────────────────────────────────

describe('FAST_SALE_PLAN.md', () => {
  it('has 7-day structure', () => {
    const content = readDoc('FAST_SALE_PLAN.md')
    expect(content.includes('Day 1') || content.includes('Tag 1')).toBe(true)
    expect(content.includes('Day 7') || content.includes('Tag 7')).toBe(true)
  })

  it('covers listing step', () => {
    const content = readDoc('FAST_SALE_PLAN.md').toLowerCase()
    expect(content.includes('list') || content.includes('listing')).toBe(true)
  })

  it('covers buyer candidates step', () => {
    const content = readDoc('FAST_SALE_PLAN.md').toLowerCase()
    expect(content.includes('buyer') && content.includes('candid')).toBe(true)
  })

  it('covers manual outreach step', () => {
    const content = readDoc('FAST_SALE_PLAN.md').toLowerCase()
    expect(content.includes('manual') || content.includes('manually')).toBe(true)
  })

  it('covers market proof step', () => {
    const content = readDoc('FAST_SALE_PLAN.md').toLowerCase()
    expect(content.includes('market proof') || content.includes('marktproof') || content.includes('proof')).toBe(true)
  })

  it('covers negotiation step', () => {
    const content = readDoc('FAST_SALE_PLAN.md').toLowerCase()
    expect(content.includes('negotiat') || content.includes('verhandl')).toBe(true)
  })

  it('[SAFETY] explicitly states no automatic sending', () => {
    const content = readDoc('FAST_SALE_PLAN.md').toLowerCase()
    expect(content.includes('no automatic') || content.includes('manually') || content.includes('auto-send')).toBe(true)
  })

  it('[SAFETY] no affirmative job guarantee', () => {
    const content = readDoc('FAST_SALE_PLAN.md').toLowerCase()
    expect(content).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?job|job\s+placement\s+guaranteed/)
  })

  it('[SAFETY] no affirmative visa guarantee', () => {
    const content = readDoc('FAST_SALE_PLAN.md').toLowerCase()
    expect(content).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?visa|visa\s+guaranteed/)
  })
})

// ── SALE_DATA_ROOM_INDEX ──────────────────────────────────────────────────────

describe('SALE_DATA_ROOM_INDEX.md', () => {
  const expectedDocs = [
    'BUYER_OVERVIEW',
    'TRANSFER_GUIDE',
    'TECHNICAL_ARCHITECTURE',
    'SECURITY_AND_COMPLIANCE',
    'MARKET_PROOF_PLAN',
    'VALUATION_ARGUMENT',
    'ASSET_INVENTORY',
    'SELL_READY_CHECKLIST',
    'BUYER_DEMO_SCRIPT',
    'SALE_LISTING_DRAFT',
    'BUYER_TARGET_LIST_TEMPLATE',
    'BUYER_OUTREACH_MESSAGES',
    'BUYER_QA',
    'FAST_SALE_PLAN',
  ]

  for (const doc of expectedDocs) {
    it(`references ${doc}`, () => {
      const content = readDoc('SALE_DATA_ROOM_INDEX.md')
      expect(content).toContain(doc)
    })
  }

  it('has at least 14 document references', () => {
    const content = readDoc('SALE_DATA_ROOM_INDEX.md')
    const matches = content.match(/\.md/g)
    expect(matches).toBeDefined()
    expect(matches!.length).toBeGreaterThanOrEqual(14)
  })

  it('[SAFETY] no fake revenue claimed in index', () => {
    const content = readDoc('SALE_DATA_ROOM_INDEX.md').toLowerCase()
    expect(content).not.toMatch(/€[1-9]\d{2,}\s{0,5}mrr/)
  })
})

// ── Buyer Room has sales-launch tab (source check) ────────────────────────────

describe('BuyerRoomClient — Sales Launch tab', () => {
  it('source code contains sales-launch tab type', () => {
    const path = app('admin/buyer-room/_components/BuyerRoomClient.tsx')
    expect(existsSync(path)).toBe(true)
    const source = readFileSync(path, 'utf-8')
    expect(source).toContain("'sales-launch'")
  })

  it('source code renders SalesLaunchTab', () => {
    const path = app('admin/buyer-room/_components/BuyerRoomClient.tsx')
    const source = readFileSync(path, 'utf-8')
    expect(source).toContain('SalesLaunchTab')
  })

  it('source code has Sales Launch in TABS array', () => {
    const path = app('admin/buyer-room/_components/BuyerRoomClient.tsx')
    const source = readFileSync(path, 'utf-8')
    expect(source).toContain('Sales Launch')
  })

  it('source code links to /admin/market-proof-launch', () => {
    const path = app('admin/buyer-room/_components/BuyerRoomClient.tsx')
    const source = readFileSync(path, 'utf-8')
    expect(source).toContain('/admin/market-proof-launch')
  })

  it('[SAFETY] BuyerRoomClient has no fake revenue claims', () => {
    const path = app('admin/buyer-room/_components/BuyerRoomClient.tsx')
    const source = readFileSync(path, 'utf-8').toLowerCase()
    expect(source).not.toMatch(/€[1-9]\d{2,}\s{0,5}mrr|paying customers.*\d+/)
  })

  it('[SAFETY] BuyerRoomClient has no Stripe activation', () => {
    const path = app('admin/buyer-room/_components/BuyerRoomClient.tsx')
    const source = readFileSync(path, 'utf-8').toLowerCase()
    expect(source).not.toMatch(/stripe\.activate|stripe is active/)
  })
})

// ── Cross-doc safety sweep ────────────────────────────────────────────────────

describe('[SAFETY] Cross-document sweep', () => {
  const salesDocs = [
    'SALE_LISTING_DRAFT.md',
    'BUYER_OUTREACH_MESSAGES.md',
    'BUYER_QA.md',
    'FAST_SALE_PLAN.md',
    'SALE_DATA_ROOM_INDEX.md',
  ]

  it('no sales doc makes affirmative job guarantee claims', () => {
    for (const file of salesDocs) {
      const content = readDoc(file).toLowerCase()
      // Only block affirmative claims — "no job guarantee" disclaimers are correct
      expect(content).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?job|job\s+placement\s+guaranteed/)
    }
  })

  it('no sales doc makes affirmative visa guarantee claims', () => {
    for (const file of salesDocs) {
      const content = readDoc(file).toLowerCase()
      expect(content).not.toMatch(/(?:we|platform)\s+guarantee\s+(?:a\s+)?visa|visa\s+guaranteed/)
    }
  })

  it('no sales doc claims affirmative automatic sending', () => {
    for (const file of salesDocs) {
      const content = readDoc(file).toLowerCase()
      // Block affirmative auto-send claims; "no auto-send" disclaimers are correct
      expect(content).not.toMatch(/(?:we\s+)?send\s+automatically|auto.?send\s+is\s+enabled|bulk\s+send\s+supported/)
    }
  })

  it('no sales doc claims scraping', () => {
    for (const file of salesDocs) {
      const content = readDoc(file).toLowerCase()
      // "scraping" can appear in "no scraping" context — check it's not claiming scraping is used
      expect(content).not.toMatch(/we scrap|uses? scrap/)
    }
  })

  it('no sales doc claims Stripe is active', () => {
    for (const file of salesDocs) {
      const content = readDoc(file).toLowerCase()
      expect(content).not.toMatch(/stripe is active|stripe connected|stripe enabled/)
    }
  })
})
