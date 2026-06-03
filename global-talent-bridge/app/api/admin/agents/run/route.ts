import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runAllAgents } from '@/lib/agents/agent-orchestrator'

/**
 * POST /api/admin/agents/run
 * Admin-only. Startet alle Agenten kontrolliert.
 * Keine externen Aktionen. Nur interne Analyse + DB-Writes.
 */
export async function POST() {
  const adminUser = await getCurrentAdminUser()
  if (!adminUser) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 })
  }

  try {
    const result = await runAllAgents()

    return NextResponse.json({
      success: result.success,
      summary: result.summary,
      total_suggestions: result.total_suggestions,
      total_notifications: result.total_notifications,
      total_signals: result.total_signals,
      run_log_id: result.run_log_id,
      details: result.details,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
