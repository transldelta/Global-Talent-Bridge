/**
 * POST /api/admin/outreach-autopilot/analyze
 *
 * Führt die vollständige Autopilot-Analyse für eine Firma durch.
 * KEIN DB-Write (nur Analyse). KEIN E-Mail-Versand.
 *
 * Sicherheit:
 * - Admin-Auth erforderlich
 * - Kein externer API-Call
 * - Kein Scraping
 * - EMAIL_PROVIDER bleibt unberührt
 * - OUTREACH_EMAIL_PROVIDER bleibt unberührt
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { analyzeCompany } from '@/lib/outreach-autopilot'
import type { CompanyInput } from '@/lib/outreach-autopilot/types'

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let body: CompanyInput
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.company_name?.trim()) {
    return NextResponse.json(
      { error: 'Firmenname ist erforderlich.' },
      { status: 400 },
    )
  }

  // ── Analyse — reine Funktion, keine Seiteneffekte ────────────────────────
  try {
    const analysis = analyzeCompany(body)

    // Safety: Delivery ist immer Phase 1
    // EMAIL_PROVIDER und OUTREACH_EMAIL_PROVIDER werden NICHT berührt
    return NextResponse.json(
      {
        success:            true,
        no_email_sent:      true,
        no_auto_outreach:   true,
        analysis,
      },
      { status: 200 },
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Analyse fehlgeschlagen'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
