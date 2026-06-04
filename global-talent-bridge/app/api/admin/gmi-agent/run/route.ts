import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runGlobalMarketIntelligenceAgent } from '@/lib/agents/global-market-intelligence-agent'

/**
 * POST /api/admin/gmi-agent/run
 * Startet den Global Market Intelligence Agent manuell. Nur für Admins.
 * Analysiert migration_corridors + candidate_sources.
 * Keine externen Aktionen. Kein Scraping. Kein Senden.
 */
export async function POST() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runGlobalMarketIntelligenceAgent()

  return NextResponse.json({
    success: true,
    ...result,
    note: 'GMI-Agent erfolgreich ausgeführt. Scores und Prioritäten aktualisiert. CEO-Empfehlungen erstellt.',
  })
}
