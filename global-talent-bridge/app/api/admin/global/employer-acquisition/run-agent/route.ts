import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runGlobalEmployerAcquisitionAgent } from '@/lib/agents/global-employer-acquisition-agent'

/**
 * POST /api/admin/global/employer-acquisition/run-agent
 * Startet den Global Employer Acquisition Agent manuell. Nur für Admins.
 * Analysiert Quellen, aktualisiert Scores, erstellt Outreach-Empfehlungen.
 * Kein Senden. Keine externen APIs. Keine E-Mails. Kein WhatsApp.
 */
export async function POST() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await runGlobalEmployerAcquisitionAgent()
  return NextResponse.json({
    success: true,
    ...result,
    note: 'GEA-Agent ausgeführt. Scores aktualisiert. Outreach-Empfehlungen erstellt.',
  })
}
