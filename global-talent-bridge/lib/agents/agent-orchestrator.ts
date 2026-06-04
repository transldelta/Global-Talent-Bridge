import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { runCeoAgent } from './ceo-agent'
import { runMarketingStrategyAgent } from './marketing-strategy-agent'
import { runVisionaryAgent } from './visionary-agent'
import { runGrowthAgent } from './growth-agent'
import { runGlobalMarketIntelligenceAgent } from './global-market-intelligence-agent'
import { runCorridorIntelligenceAgent } from './corridor-intelligence-agent'
import { runGlobalCandidateAcquisitionAgent } from './global-candidate-acquisition-agent'

export type AgentRunResult = {
  success: boolean
  run_log_id: string
  summary: string
  total_suggestions: number
  total_notifications: number
  total_signals: number
  details: {
    ceo: { suggestions: number; notifications: number } | null
    marketing: { suggestions: number; signals: number } | null
    visionary: { suggestions: number } | null
    growth: { leadsAnalyzed: number; draftsCreated: number; followupsPlanned: number; alertsSent: number } | null
    globalMarket: { corridorsAnalyzed: number; sourcesAnalyzed: number; scoresUpdated: number; suggestionsCreated: number; alertsCreated: number } | null
    corridorIntelligence: { corridorsAnalyzed: number; scoresUpdated: number; suggestionsCreated: number; notificationsCreated: number; campaignsReviewed: number } | null
    candidateAcquisition: { sourcesAnalyzed: number; scoresUpdated: number; landingpagesReviewed: number; suggestionsCreated: number; notificationsCreated: number } | null
  }
  error?: string
}

/**
 * Agent Orchestrator
 * Führt alle Agenten kontrolliert nacheinander aus.
 * Erstellt einen zusammenfassenden Run-Log.
 * Führt KEINE externen Aktionen aus.
 * Keine E-Mails. Keine Zahlungen. Keine externen APIs.
 */
export async function runAllAgents(): Promise<AgentRunResult> {
  const supabase = createAdminClient()

  const details: AgentRunResult['details'] = {
    ceo: null,
    marketing: null,
    visionary: null,
    growth: null,
    globalMarket: null,
    corridorIntelligence: null,
    candidateAcquisition: null,
  }

  let totalSuggestions = 0
  let totalNotifications = 0
  let totalSignals = 0
  let errorMessage: string | undefined

  try {
    // ── CEO Control Agent ───────────────────────────────────────────────────
    const ceoResult = await runCeoAgent()
    details.ceo = ceoResult
    totalSuggestions += ceoResult.suggestions
    totalNotifications += ceoResult.notifications

    // ── Marketing Strategy Agent ─────────────────────────────────────────────
    const marketingResult = await runMarketingStrategyAgent()
    details.marketing = marketingResult
    totalSuggestions += marketingResult.suggestions
    totalSignals += marketingResult.signals

    // ── Visionary Agent ─────────────────────────────────────────────────────
    const visionaryResult = await runVisionaryAgent()
    details.visionary = visionaryResult
    totalSuggestions += visionaryResult.suggestions

    // ── Growth Agent ─────────────────────────────────────────────────────────
    const growthResult = await runGrowthAgent('triggered')
    details.growth = growthResult
    totalNotifications += growthResult.alertsSent

    // ── Global Market Intelligence Agent ──────────────────────────────────────
    const gmiResult = await runGlobalMarketIntelligenceAgent()
    details.globalMarket = gmiResult
    totalSuggestions += gmiResult.suggestionsCreated
    totalNotifications += gmiResult.alertsCreated

    // ── Corridor Intelligence Agent ────────────────────────────────────────────
    const ciResult = await runCorridorIntelligenceAgent()
    details.corridorIntelligence = ciResult
    totalSuggestions += ciResult.suggestionsCreated
    totalNotifications += ciResult.notificationsCreated

    // ── Global Candidate Acquisition Agent ────────────────────────────────────
    const gcaResult = await runGlobalCandidateAcquisitionAgent()
    details.candidateAcquisition = gcaResult
    totalSuggestions += gcaResult.suggestionsCreated
    totalNotifications += gcaResult.notificationsCreated

  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'
  }

  const success = !errorMessage
  const growthSummary = details.growth
    ? ` Growth: ${details.growth.draftsCreated} Entwürfe, ${details.growth.followupsPlanned} Follow-ups.`
    : ''
  const gmiSummary = details.globalMarket
    ? ` GMI: ${details.globalMarket.corridorsAnalyzed} Korridore, ${details.globalMarket.scoresUpdated} Score-Updates.`
    : ''
  const ciSummary = details.corridorIntelligence
    ? ` CI: ${details.corridorIntelligence.corridorsAnalyzed} analysiert, ${details.corridorIntelligence.scoresUpdated} Score-Updates.`
    : ''
  const gcaSummary = details.candidateAcquisition
    ? ` GCA: ${details.candidateAcquisition.sourcesAnalyzed} Quellen, ${details.candidateAcquisition.landingpagesReviewed} Landingpages.`
    : ''

  const summary = success
    ? `Agenten-Lauf abgeschlossen: ${totalSuggestions} neue Vorschläge, ${totalNotifications} Benachrichtigungen, ${totalSignals} Markt-Signale.${growthSummary}${gmiSummary}${ciSummary}${gcaSummary}`
    : `Agenten-Lauf mit Fehler abgebrochen: ${errorMessage}`

  // ── Run-Log schreiben ─────────────────────────────────────────────────────
  const { data: logData } = await supabase
    .from('agent_run_logs')
    .insert({
      run_type: 'full_run',
      status: success ? 'success' : 'error',
      summary,
      suggestions_created: totalSuggestions,
      notifications_created: totalNotifications,
      error_message: errorMessage ?? null,
    })
    .select('id')
    .single()

  // ── System-Log ────────────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    agent_name: 'agent_orchestrator',
    status: success ? 'success' : 'error',
    message: summary,
  })

  return {
    success,
    run_log_id: logData?.id ?? 'unknown',
    summary,
    total_suggestions: totalSuggestions,
    total_notifications: totalNotifications,
    total_signals: totalSignals,
    details,
    error: errorMessage,
  }
}
