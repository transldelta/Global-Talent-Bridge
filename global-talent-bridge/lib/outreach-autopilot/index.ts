/**
 * lib/outreach-autopilot/index.ts
 *
 * Orchestrator — verbindet alle Agenten zu einem einzigen analyze()-Aufruf.
 *
 * Pipeline:
 * 0. Placeholder Check  → detectPlaceholder(input.company_name)
 * 1. Research Agent     → buildCompanyProfile(input)
 * 2. Fit Scoring Agent  → calculateFitScore(profile)  [0 wenn Placeholder]
 * 3. Score Hints        → buildScoreImprovementHints(input)
 * 4. Personalization    → generateDraftMessage(profile, channel)
 * 5. Compliance Agent   → checkCompliance(draft.body) + placeholder override
 * 6. Human Approval     → calculateApprovalState(...)
 * 7. Delivery Agent     → checkDeliveryConditions(...) [immer false in Phase 1]
 *
 * Reine Funktion. Kein DB-Call, kein API-Call.
 */
import type {
  CompanyInput, AutopilotAnalysis, ContactMethod, SpamRisk,
  PlaceholderDetectionResult, FitScoreResult,
} from './types'
import { buildCompanyProfile, detectPlaceholder, buildScoreImprovementHints } from './research-agent'
import { calculateFitScore, FIT_SCORE_THRESHOLD } from './fit-scoring-agent'
import { checkCompliance, calculateSpamRisk, checkComplianceForPlaceholder } from './compliance-agent'
import { generateDraftMessage, recommendChannel } from './personalization-agent'
import { calculateApprovalState }      from './human-approval-agent'
import { checkDeliveryConditions }     from './delivery-agent'

/**
 * Führt die vollständige Autopilot-Analyse für eine Firma durch.
 * Sicher: Keine Seiteneffekte, kein Versand, keine externen Calls.
 */
export function analyzeCompany(input: CompanyInput): AutopilotAnalysis {
  // 0. Placeholder-Check (vor allem anderen)
  const placeholder: PlaceholderDetectionResult = detectPlaceholder(input.company_name ?? '')

  // 1. Research
  const profile = buildCompanyProfile(input)

  // 2. Fit Score — bei Placeholder erzwungen auf 0
  const rawFitScore = calculateFitScore(profile)
  const fitScore: FitScoreResult = placeholder.isPlaceholder
    ? {
        ...rawFitScore,
        score:          0,
        label:          'rejected',
        blockedByScore: true,
        recommendation: placeholder.userMessage ?? 'Bitte echten Firmennamen eintragen.',
      }
    : rawFitScore

  // 3. Score-Verbesserungs-Hinweise (nur wenn kein Placeholder und Score < 70)
  const scoreHints = (!placeholder.isPlaceholder && fitScore.score < FIT_SCORE_THRESHOLD)
    ? buildScoreImprovementHints(input)
    : []

  // 4. Channel-Empfehlung + Draft-Generierung
  const recommendedChannel = recommendChannel(profile) as ContactMethod
  const draft = generateDraftMessage(profile, recommendedChannel)

  // 5. Compliance — Placeholder überschreibt Ergebnis
  const placeholderCompliance = checkComplianceForPlaceholder(placeholder)
  const fullText = draft.subject
    ? `${draft.subject}\n\n${draft.body}`
    : draft.body
  const compliance = placeholderCompliance ?? checkCompliance(fullText)
  const spamRisk: SpamRisk = calculateSpamRisk(compliance)

  // 6. Human Approval
  const approval = calculateApprovalState({
    fitScore:         fitScore.score,
    complianceStatus: compliance.status,
    currentStatus:    'draft',
    hasMessage:       Boolean(draft.body),
  })

  // 7. Delivery (immer Phase 1 → false)
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

  // 8. Zusammenfassung
  const overallSafe =
    !placeholder.isPlaceholder &&
    compliance.status !== 'blocked' &&
    !fitScore.blockedByScore

  const summary = buildSummary(fitScore.score, compliance.status, spamRisk, overallSafe, placeholder)

  return {
    profile,
    fitScore,
    compliance,
    draft,
    approval,
    delivery,
    placeholder,
    scoreHints,
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
  placeholder: PlaceholderDetectionResult,
): string {
  if (placeholder.isPlaceholder) {
    return `🚫 ${placeholder.userMessage ?? 'Test- oder Platzhalternamen erkannt.'} ${placeholder.improvementHint ?? ''}`
  }
  if (!overallSafe) {
    const issues: string[] = []
    if (score < 70) issues.push(`Fit Score ${score}/100 — mind. 70 erforderlich`)
    if (compliance === 'blocked') issues.push('Compliance: blocked')
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
