import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runGrowthAgent } from '@/lib/agents/growth-agent'

/**
 * POST /api/admin/growth-agent/run
 * Startet den Growth Agent manuell. Nur für Admins.
 * Erstellt Outreach-Entwürfe in outreach_approval_queue.
 * Sendet NIEMALS selbst — alles wartet auf Admin-Freigabe.
 */
export async function POST() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runGrowthAgent('manual')

  return NextResponse.json({
    success: true,
    ...result,
    note: 'Growth Agent erfolgreich ausgeführt. Alle Entwürfe warten auf Freigabe unter /admin/outreach/approval-queue',
  })
}
