/**
 * GET /api/admin/pilot-control/summary
 *
 * Liest aggregierte Daten für das Pilot Control Dashboard.
 * KEIN E-Mail-Versand. Admin-only.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export type PilotControlSummary = {
  total:                  number
  byStatus: {
    draft:                number
    needs_review:         number
    approved_for_manual_copy: number
    contacted_manual:     number
    blocked:              number
  }
  readyToCopy:            number   // compliance=safe AND fit_score >= 70
  blockedEntries:         number
  recentEntry:            { id: string; company_name: string; fit_score: number; status: string; created_at: string } | null
  nextSuggestedAction:    string
  noEmailSent:            true     // immer true — Sicherheits-Invariante
  noAutoOutreach:         true     // immer true
  pilotStarted:           boolean  // true wenn mindestens 1 contacted_manual
}

export async function GET(_req: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createAdminClient()

  // Alle Einträge lesen (max 200 — kein Pagination nötig in Phase 1)
  const { data: entries, error } = await db
    .from('outreach_autopilot_entries')
    .select('id, company_name, fit_score, compliance_status, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const all = entries ?? []

  // Zähler
  const byStatus = {
    draft:                    0,
    needs_review:             0,
    approved_for_manual_copy: 0,
    contacted_manual:         0,
    blocked:                  0,
  }
  let readyToCopy = 0

  for (const e of all) {
    const s = e.status as keyof typeof byStatus
    if (s in byStatus) byStatus[s]++
    if (e.compliance_status === 'safe' && (e.fit_score ?? 0) >= 70) {
      readyToCopy++
    }
  }

  const recentEntry = all[0] ?? null
  const pilotStarted = byStatus.contacted_manual > 0

  // Nächste empfohlene Aktion
  let nextSuggestedAction: string
  if (all.length === 0) {
    nextSuggestedAction = '➕ Erste Firma eintragen: Outreach Autopilot öffnen → Firma eingeben → Analyse starten.'
  } else if (byStatus.blocked > 0 && byStatus.approved_for_manual_copy === 0) {
    nextSuggestedAction = `⚠️ ${byStatus.blocked} blockierte Einträge prüfen: Firmenname oder Compliance-Problem beheben.`
  } else if (readyToCopy > 0) {
    nextSuggestedAction = `📋 ${readyToCopy} Entwurf/Entwürfe bereit zum Kopieren: Text kopieren und manuell versenden.`
  } else if (byStatus.needs_review > 0) {
    nextSuggestedAction = `🔍 ${byStatus.needs_review} Entwurf/Entwürfe zur Prüfung ausstehend.`
  } else if (pilotStarted) {
    nextSuggestedAction = '✅ Erster Pilot-Kontakt gestartet! Rückmeldung abwarten und nachfassen.'
  } else {
    nextSuggestedAction = '➕ Neue Firma analysieren: Outreach Autopilot → Firma eintragen → Analyse starten.'
  }

  const summary: PilotControlSummary = {
    total:               all.length,
    byStatus,
    readyToCopy,
    blockedEntries:      byStatus.blocked,
    recentEntry,
    nextSuggestedAction,
    noEmailSent:         true,
    noAutoOutreach:      true,
    pilotStarted,
  }

  return NextResponse.json(summary)
}
