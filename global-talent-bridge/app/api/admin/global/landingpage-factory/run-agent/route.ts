import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runLandingpageFactoryAgent } from '@/lib/agents/landingpage-factory-agent'

/**
 * POST /api/admin/global/landingpage-factory/run-agent
 * Startet den Landingpage Factory Agent manuell. Nur für Admins.
 * Erzeugt und aktualisiert Landingpages basierend auf Korridor-Daten.
 * Keine Veröffentlichung. Keine externen APIs. Kein Senden.
 */
export async function POST() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await runLandingpageFactoryAgent()
  return NextResponse.json({
    success: true,
    ...result,
    note: 'LPF-Agent ausgeführt. Landingpages erzeugt/aktualisiert. Keine automatische Veröffentlichung.',
  })
}
