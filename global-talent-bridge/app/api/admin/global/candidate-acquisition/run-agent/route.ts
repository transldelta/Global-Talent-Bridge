import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runGlobalCandidateAcquisitionAgent } from '@/lib/agents/global-candidate-acquisition-agent'

/**
 * POST /api/admin/global/candidate-acquisition/run-agent
 * Startet den Global Candidate Acquisition Agent manuell. Nur für Admins.
 * Analysiert Quellen, aktualisiert Scores, erstellt Empfehlungen.
 * Kein Scraping. Kein Senden. Keine externen APIs.
 */
export async function POST() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await runGlobalCandidateAcquisitionAgent()
  return NextResponse.json({
    success: true,
    ...result,
    note: 'GCA-Agent ausgeführt. Scores aktualisiert. CEO-Empfehlungen erstellt.',
  })
}
