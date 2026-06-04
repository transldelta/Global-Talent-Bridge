import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runCorridorIntelligenceAgent } from '@/lib/agents/corridor-intelligence-agent'

/**
 * POST /api/admin/global/corridor-intelligence/run-agent
 * Startet den Corridor Intelligence Agent manuell. Nur für Admins.
 * Analysiert corridor_intelligence, aktualisiert Scores, erstellt CEO-Empfehlungen.
 * Kein Scraping. Kein Senden. Keine externen APIs.
 */
export async function POST() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runCorridorIntelligenceAgent()

  return NextResponse.json({
    success: true,
    ...result,
    note: 'Corridor Intelligence Agent erfolgreich ausgeführt. Scores aktualisiert. CEO-Empfehlungen erstellt.',
  })
}
