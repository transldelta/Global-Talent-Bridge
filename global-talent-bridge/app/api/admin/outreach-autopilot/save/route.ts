/**
 * POST /api/admin/outreach-autopilot/save
 *
 * Speichert einen analysierten Eintrag in outreach_autopilot_entries.
 * KEIN E-Mail-Versand. KEIN automatischer Outreach.
 *
 * Sicherheit:
 * - Admin-Auth erforderlich
 * - no_email_sent = true (hardcoded)
 * - no_auto_outreach = true (hardcoded)
 * - EMAIL_PROVIDER bleibt none
 * - OUTREACH_EMAIL_PROVIDER bleibt none
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CompanyInput } from '@/lib/outreach-autopilot/types'
import { analyzeCompany } from '@/lib/outreach-autopilot'

type SaveBody = CompanyInput & {
  override_status?: string
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let body: SaveBody
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

  // ── Analyse ───────────────────────────────────────────────────────────────
  const analysis = analyzeCompany(body)

  // ── Status bestimmen ──────────────────────────────────────────────────────
  // Automatisch: blocked wenn compliance=blocked oder fitScore < 70
  // Sonst: draft (nie automatisch approved)
  let status: string
  if (
    analysis.compliance.status === 'blocked' ||
    analysis.fitScore.blockedByScore
  ) {
    status = 'blocked'
  } else if (analysis.compliance.status === 'needs_review') {
    status = 'needs_review'
  } else {
    status = 'draft'
  }

  // Override nur in Richtung vorsichtiger (nie zu 'approved_for_manual_copy' automatisch)
  if (
    body.override_status === 'needs_review' &&
    status === 'draft'
  ) {
    status = 'needs_review'
  }

  // ── DB-Insert ─────────────────────────────────────────────────────────────
  const db = createAdminClient()

  const { data, error } = await db
    .from('outreach_autopilot_entries')
    .insert({
      company_name:         body.company_name.trim(),
      website:              body.website?.trim() || null,
      sector:               body.sector?.trim() || null,
      contact_person:       body.contact_person?.trim() || null,
      contact_method:       body.contact_method ?? 'personal',
      contact_address:      body.contact_address?.trim() || null,
      notes:                body.notes?.trim() || null,

      fit_score:            analysis.fitScore.score,
      fit_score_breakdown:  analysis.fitScore.breakdown,
      compliance_status:    analysis.compliance.status,
      spam_risk:            analysis.spamRisk,
      compliance_warnings:  [
        ...analysis.compliance.violations.map(v => v.description),
        ...analysis.compliance.warnings,
      ],
      draft_message:        analysis.draft.body,
      draft_subject:        analysis.draft.subject ?? null,
      recommended_channel:  analysis.recommendedChannel,

      status,
      no_email_sent:        true,
      no_auto_outreach:     true,

      created_by:           admin.email,
      analysis_result:      {
        fitLabel:           analysis.fitScore.label,
        recommendation:     analysis.fitScore.recommendation,
        approvalBlockers:   analysis.approval.blockers,
        summary:            analysis.summary,
        generatedAt:        new Date().toISOString(),
      },
    })
    .select('id, company_name, fit_score, compliance_status, status, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // ── Audit Log ─────────────────────────────────────────────────────────────
  await db.from('system_logs').insert({
    agent_name: 'outreach_autopilot',
    status:     'info',
    message:    [
      `Autopilot-Analyse gespeichert: "${body.company_name.trim()}"`,
      `Fit: ${analysis.fitScore.score}/100`,
      `Compliance: ${analysis.compliance.status}`,
      `Status: ${status}`,
      `no_email_sent: true`,
      `no_auto_outreach: true`,
      `Admin: ${admin.email}`,
    ].join(' | '),
  })

  return NextResponse.json(
    {
      success:          true,
      id:               data.id,
      company_name:     data.company_name,
      fit_score:        data.fit_score,
      compliance_status: data.compliance_status,
      status:           data.status,
      no_email_sent:    true,
      no_auto_outreach: true,
      analysis_summary: analysis.summary,
    },
    { status: 201 },
  )
}
