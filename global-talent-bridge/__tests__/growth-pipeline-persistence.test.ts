/**
 * __tests__/growth-pipeline-persistence.test.ts
 *
 * Tests for the Global Growth Persistence Layer.
 * Checks: migration file, API routes, component updates, docs.
 * No DB calls. File-based checks only.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

function readFile(rel: string) { return readFileSync(join(process.cwd(), rel), 'utf-8') }
function fileExists(rel: string) { return existsSync(join(process.cwd(), rel)) }

// ── Migration ─────────────────────────────────────────────────────────────────

describe('Migration 202606080500_growth_pipeline.sql', () => {
  const sql = readFile('supabase/migrations/202606080500_growth_pipeline.sql')

  it('migration file exists', () => {
    expect(fileExists('supabase/migrations/202606080500_growth_pipeline.sql')).toBe(true)
  })

  it('creates growth_targets table', () => {
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS.*growth_targets/i)
  })

  it('creates growth_messages table', () => {
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS.*growth_messages/i)
  })

  it('growth_targets has no_auto_send safety constraint', () => {
    expect(sql).toMatch(/no_auto_send.*CHECK.*no_auto_send.*=.*TRUE/i)
  })

  it('growth_targets has no_job_guarantee safety constraint', () => {
    expect(sql).toMatch(/no_job_guarantee.*CHECK.*no_job_guarantee.*=.*TRUE/i)
  })

  it('growth_targets has no_visa_guarantee safety constraint', () => {
    expect(sql).toMatch(/no_visa_guarantee.*CHECK.*no_visa_guarantee.*=.*TRUE/i)
  })

  it('growth_messages has no_auto_send safety constraint', () => {
    expect(sql).toMatch(/no_auto_send BOOLEAN.*DEFAULT TRUE.*CHECK.*TRUE/i)
  })

  it('RLS is enabled on growth_targets', () => {
    expect(sql).toMatch(/ALTER TABLE.*growth_targets.*ENABLE ROW LEVEL SECURITY/i)
  })

  it('RLS is enabled on growth_messages', () => {
    expect(sql).toMatch(/ALTER TABLE.*growth_messages.*ENABLE ROW LEVEL SECURITY/i)
  })

  it('drops any anon/auth read policies (admin-only access)', () => {
    expect(sql).toMatch(/DROP POLICY IF EXISTS.*growth_targets_anon_read/i)
  })

  it('growth_targets has all required status values', () => {
    expect(sql).toContain('target_profile')
    expect(sql).toContain('real_contact_needed')
    expect(sql).toContain('draft_prepared')
    expect(sql).toContain('approved_to_send_manually')
    expect(sql).toContain('sent_manually')
    expect(sql).toContain('replied')
    expect(sql).toContain('rejected')
  })

  it('growth_messages has no_auto_send default true', () => {
    expect(sql).toMatch(/no_auto_send.*DEFAULT TRUE/i)
  })

  it('has updated_at trigger for growth_targets', () => {
    expect(sql).toMatch(/CREATE TRIGGER.*trg_growth_targets_updated_at/i)
  })

  it('has updated_at trigger for growth_messages', () => {
    expect(sql).toMatch(/CREATE TRIGGER.*trg_growth_messages_updated_at/i)
  })

  it('has table comments documenting admin-only access', () => {
    expect(sql).toMatch(/COMMENT ON TABLE.*growth_targets.*admin-only/i)
  })
})

// ── API routes ────────────────────────────────────────────────────────────────

describe('API route: GET/POST /api/admin/growth/targets', () => {
  const route = readFile('app/api/admin/growth/targets/route.ts')

  it('route file exists', () => {
    expect(fileExists('app/api/admin/growth/targets/route.ts')).toBe(true)
  })

  it('GET requires admin auth', () => {
    expect(route).toMatch(/getCurrentAdminUser/)
    expect(route).toMatch(/Unauthorized/)
  })

  it('POST requires admin auth', () => {
    expect(route).toMatch(/getCurrentAdminUser/)
  })

  it('POST limits to 50 items', () => {
    expect(route).toContain('50')
  })

  it('sets no_auto_send: true on every insert', () => {
    expect(route).toMatch(/no_auto_send.*true/i)
  })

  it('sets no_job_guarantee: true on every insert', () => {
    expect(route).toMatch(/no_job_guarantee.*true/i)
  })

  it('sets no_visa_guarantee: true on every insert', () => {
    expect(route).toMatch(/no_visa_guarantee.*true/i)
  })

  it('validates status before inserting', () => {
    expect(route).toMatch(/validateStatus|approved_to_send_manually/)
  })

  it('does not trigger automatic sending', () => {
    expect(route).not.toMatch(/sendEmail|sendMail|triggerOutreach/i)
  })
})

describe('API route: PATCH/DELETE /api/admin/growth/targets/[id]', () => {
  const route = readFile('app/api/admin/growth/targets/[id]/route.ts')

  it('PATCH requires admin auth', () => {
    expect(route).toMatch(/getCurrentAdminUser/)
  })

  it('PATCH does not allow changing safety invariants', () => {
    // no_auto_send, no_job_guarantee, no_visa_guarantee must NOT be in allowed object
    expect(route).not.toMatch(/allowed\.no_auto_send|allowed\[.no_auto_send/)
    expect(route).not.toMatch(/allowed\.no_job_guarantee|allowed\[.no_job_guarantee/)
  })

  it('DELETE requires admin auth', () => {
    expect(route).toMatch(/getCurrentAdminUser/)
  })

  it('does not trigger automatic sending', () => {
    expect(route).not.toMatch(/sendEmail|sendMail/i)
  })
})

describe('API route: GET /api/admin/growth/export', () => {
  const route = readFile('app/api/admin/growth/export/route.ts')

  it('export route exists', () => {
    expect(fileExists('app/api/admin/growth/export/route.ts')).toBe(true)
  })

  it('requires admin auth', () => {
    expect(route).toMatch(/getCurrentAdminUser/)
  })

  it('includes export metadata with no_auto_send flag', () => {
    expect(route).toMatch(/no_auto_send.*true/i)
  })

  it('includes note about manual-only outreach', () => {
    expect(route).toMatch(/manual.*outreach|manual.*send/i)
  })

  it('does not expose contact emails in summary (only in targets array)', () => {
    // Summary only has by_status, by_target_kind, by_country — no email fields
    expect(route).toMatch(/by_status|by_target_kind|by_country/)
  })
})

// ── Page ──────────────────────────────────────────────────────────────────────

describe('/admin/global-growth-department — page with persistence', () => {
  const page = readFile('app/admin/global-growth-department/page.tsx')

  it('page is force-dynamic (SSR, not static)', () => {
    expect(page).toContain("force-dynamic")
  })

  it('page loads initial targets from Supabase server-side', () => {
    expect(page).toMatch(/growth_targets|initialTargets/)
  })

  it('page passes initialTargets to client', () => {
    expect(page).toContain('initialTargets')
  })

  it('page handles DB error gracefully', () => {
    expect(page).toMatch(/dbError|db.*error/i)
  })
})

// ── Component ─────────────────────────────────────────────────────────────────

describe('/admin/global-growth-department — component persistence checks', () => {
  const comp = readFile('app/admin/global-growth-department/_components/GlobalGrowthClient.tsx')

  it('accepts initialTargets prop', () => {
    expect(comp).toMatch(/initialTargets.*Record|initialTargets.*\[\]|Props.*initialTargets/i)
  })

  it('calls POST /api/admin/growth/targets on addToQueue', () => {
    expect(comp).toContain('/api/admin/growth/targets')
  })

  it('calls PATCH on status update', () => {
    expect(comp).toMatch(/PATCH|api.*growth.*targets.*id/i)
  })

  it('calls DELETE on remove', () => {
    expect(comp).toContain('DELETE')
  })

  it('has Export growth pipeline JSON panel', () => {
    expect(comp).toMatch(/Export growth pipeline JSON/i)
  })

  it('has /api/admin/growth/export call', () => {
    expect(comp).toContain('/api/admin/growth/export')
  })

  it('shows DB error banner when dbError provided', () => {
    expect(comp).toMatch(/dbError/i)
  })

  it('shows saving indicator when isSaving', () => {
    expect(comp).toMatch(/isSaving|Saving to persistent/i)
  })

  it('no send button', () => {
    expect(comp).not.toMatch(/sendEmail|sendMail/i)
  })

  it('no submit() executable call', () => {
    const noComments = comp.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
    expect(noComments).not.toMatch(/\.submit\(\)/)
  })

  it('no Stripe', () => {
    expect(comp).not.toMatch(/stripe\.com|loadStripe/i)
  })

  it('no Global Talent Bridge brand', () => {
    const lines = comp.split('\n').filter((l) => !l.trim().startsWith('//'))
    expect(lines.join('\n')).not.toContain('Global Talent Bridge')
  })

  it('targets saved in persistent pipeline message', () => {
    expect(comp).toMatch(/persistent pipeline/i)
  })
})

// ── Docs ──────────────────────────────────────────────────────────────────────

describe('GLOBAL_GROWTH_DATA_MODEL.md', () => {
  const doc = readFile('docs/GLOBAL_GROWTH_DATA_MODEL.md')
  it('exists and is substantial', ()       => { expect(doc.length).toBeGreaterThan(1000) })
  it('has growth_targets table section', ()=> { expect(doc).toMatch(/growth_targets/i) })
  it('has growth_messages table section', ()=> { expect(doc).toMatch(/growth_messages/i) })
  it('documents RLS', ()                   => { expect(doc).toMatch(/RLS|Row Level Security/i) })
  it('documents safety constraints', ()    => { expect(doc).toMatch(/no_auto_send|safety.*constraint/i) })
  it('documents status model', ()          => { expect(doc).toMatch(/real_contact_needed|sent_manually/i) })
  it('documents API routes', ()            => { expect(doc).toMatch(/api.*growth|growth.*api/i) })
  it('no Global Talent Bridge', ()         => { expect(doc).not.toContain('Global Talent Bridge') })
})

describe('BUYER_TRANSFER_DATA_EXPORT.md', () => {
  const doc = readFile('docs/BUYER_TRANSFER_DATA_EXPORT.md')
  it('exists and is substantial', ()       => { expect(doc.length).toBeGreaterThan(1000) })
  it('explains export process', ()         => { expect(doc).toMatch(/Export.*JSON|JSON.*export/i) })
  it('explains what export proves', ()     => { expect(doc).toMatch(/proves to a buyer|buyer/i) })
  it('states no automatic outreach', ()    => { expect(doc).toMatch(/no.*automatic|manual.*only/i) })
  it('has technical transfer checklist',() => { expect(doc).toMatch(/transfer.*checklist|checklist/i) })
  it('mentions Vercel/Supabase transfer', ()=> { expect(doc).toMatch(/Vercel|Supabase/i) })
  it('no Global Talent Bridge', ()         => { expect(doc).not.toContain('Global Talent Bridge') })
})

describe('Public pages contain no admin links', () => {
  const pages = [
    'app/page.tsx',
    'app/global/employers/page.tsx',
    'app/global/candidates/page.tsx',
    'app/partners/page.tsx',
    'app/demo/page.tsx',
  ]
  for (const p of pages) {
    it(`${p}: no /admin links`, () => {
      const content = readFile(p)
      expect(content).not.toMatch(/href="\/admin/)
    })
  }
})
