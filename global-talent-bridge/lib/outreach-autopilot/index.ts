/**
 * lib/outreach-autopilot/index.ts
 *
 * Orchestrator — verbindet alle Agenten zu einem einzigen analyze()-Aufruf.
 *
 * Pipeline:
 * 1. Research Agent     → buildCompanyProfile(input)
 * 2. Fit Scoring Agent  → calculateFitScore(profile)
 * 3. Personalization    → generateDraftMessage(profile, channel)
 * 4. Compliance Agent   → checkCompliance(draft.body)
 * 5. Human Approval     → calculateApprovalState(...)
 * 6. Delivery Agent     → checkDeliveryConditions(...) [immer false in Phase 1]
 *
 * Reine Funktion. Kein DB-Call, kein API-Call.
 */
import type { CompanyInput, AutopilotAnalysis, ContactMethod, SpamRisk } from './types'
import { buildCompanyProfile }         from './research-agent'
import { calculateFitScore }           from './fit-scoring-agent'
import { checkCompliance, calculateSpamRisk } from './compliance-agent'
import { generateDraftMessage, recommendChannel } from './personalization-agent'
import { calculateApprovalState }      from './human-approval-agent'
import { checkDeliveryConditions }     from './delivery-agent'

/**
 * Führt die vollständige Autopilot-Analyse für eine Firma durch.
 * Sicher: Keine Seiteneffekte, kein Versand, keine externen Calls.
 */
export function analyzeCompany(input: CompanyInput): AutopilotAnalysis {
  // 1. Research
  const profile = buildCompanyProfile(input)

  // 2. Fit Score
  const fitScore = calculateFitScore(profile)

  // 3. Channel-Empfehlung + Draft-Generierung
  const recommendedChannel = recommendChannel(profile) as ContactMethod
  const draft = generateDraftMessage(profile, recommendedChannel)

  // 4. Compliance (prüft body + ggf. subject)
  const fullText = draft.subject
    ? `${draft.subject}\n\n${draft.body}`
    : draft.body
  const compliance = checkCompliance(fullText)
  const spamRisk: SpamRisk = calculateSpamRisk(compliance)

  // 5. Human Approval
  const approval = calculateApprovalState({
    fitScore:         fitScore.score,
    complianceStatus: compliance.status,
    currentStatus:    'draft',
    hasMessage:       Boolean(draft.body),
  })

  // 6. Delivery (immer Phase 1 → false)
  const delivery = checkDeliveryConditions({
    emailProvider:         'none',
    outreachEmailProvider: 'none',
    contactSource:         profile.source,
    complianceStatus:      compliance.status,
    fitScore:              fitScore.score,
    isExplicitlyApproved:  false,
    dailySentCount:        0,
    hasAuditLog:           false,
    hasOptOut:             false,
  })

  // 7. Zusammenfassung
  const overallSafe =
    compliance.status !== 'blocked' &&
    !fitScore.blockedByScore

  const summary = buildSummary(fitScore.score, compliance.status, spamRisk, overallSafe)

  return {
    profile,
    fitScore,
    compliance,
    draft,
    approval,
    delivery,
    overallSafe,
    recommendedChannel,
    spamRisk,
    summary,
  }
}

function buildSummary(
  score: number,
  compliance: string,
  spamRisk: SpamRisk,
  overallSafe: boolean,
): string {
  if (!overallSafe) {
    const issues: string[] = []
    if (score < 70) issues.push(`Fit Score ${score}/100 (min. 70 erforderlich)`)
    if (compliance === 'blocked') issues.push('Compliance-Status: blocked')
    return `⚠️ Outreach nicht freigegeben: ${issues.join(' | ')}`
  }
  if (compliance === 'needs_review') {
    return `✅ Fit Score ${score}/100 — ⚠️ Warnungen vorhanden, bitte manuell prüfen vor dem Kopieren.`
  }
  return `✅ Fit Score ${score}/100 — Compliance: safe — Spam-Risiko: ${spamRisk} — Bereit zum Kopieren.`
}

// Re-exports für direkten Zugriff
export * from './types'
export * from './research-agent'
export * from './fit-scoring-agent'
export * from './compliance-agent'
export * from './personalization-agent'
export * from './human-approval-agent'
export * from './delivery-agent'
