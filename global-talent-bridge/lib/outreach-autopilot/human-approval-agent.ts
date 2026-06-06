/**
 * lib/outreach-autopilot/human-approval-agent.ts
 *
 * Human Approval Agent
 *
 * Aufgabe: Prüft ob eine Analyse den Approval-Status erreichen kann.
 *          Gibt klare Blocker zurück wenn nicht.
 *
 * Invarianten:
 * - Ohne menschliche Freigabe passiert nichts
 * - "Kopieren" nur möglich wenn: compliance=safe UND fit≥70
 * - "Als Entwurf speichern" immer möglich
 * - "Zur Prüfung markieren" immer möglich
 *
 * Reine Funktion. Kein DB-Call.
 */
import type { ComplianceStatus, ApprovalState, EntryStatus } from './types'
import { FIT_SCORE_THRESHOLD } from './fit-scoring-agent'

export type ApprovalInput = {
  fitScore:         number
  complianceStatus: ComplianceStatus
  currentStatus?:   EntryStatus
  hasMessage:       boolean
}

/**
 * Berechnet den Approval-Zustand für einen Eintrag.
 */
export function calculateApprovalState(input: ApprovalInput): ApprovalState {
  const blockers: string[] = []

  // Fit-Score-Check
  if (input.fitScore < FIT_SCORE_THRESHOLD) {
    blockers.push(
      `Fit Score ${input.fitScore}/100 unter Schwellenwert (${FIT_SCORE_THRESHOLD}). Mehr Infos zur Firma eintragen.`,
    )
  }

  // Compliance-Check
  if (input.complianceStatus === 'blocked') {
    blockers.push('Compliance-Status: blocked. Text enthält unerlaubte Inhalte. Vorlage überprüfen.')
  }

  if (!input.hasMessage) {
    blockers.push('Kein Nachrichtentext vorhanden.')
  }

  // Status-Check
  if (input.currentStatus === 'blocked') {
    blockers.push('Eintrag ist manuell als "blocked" markiert.')
  }

  const canApprove = blockers.length === 0
  const canCopy    = canApprove && input.complianceStatus !== 'needs_review'

  // Nächste sichere Aktion
  let suggestedAction: string
  let nextSafeAction: string

  if (canCopy) {
    suggestedAction = 'Text kopieren und manuell über den gewählten Kanal versenden.'
    nextSafeAction  = '📋 Text kopieren'
  } else if (canApprove) {
    suggestedAction = 'Zur Prüfung markieren — Compliance-Warnungen manuell prüfen, dann kopieren.'
    nextSafeAction  = '⚠️ Zur Prüfung markieren'
  } else if (input.fitScore < FIT_SCORE_THRESHOLD) {
    suggestedAction = `Fit Score erhöhen (aktuell ${input.fitScore}/100): Sektor, Website oder Notizen ergänzen.`
    nextSafeAction  = '✏️ Profil ergänzen'
  } else {
    suggestedAction = 'Compliance-Probleme beheben: Text überprüfen oder Vorlage neu generieren.'
    nextSafeAction  = '🔄 Analyse neu starten'
  }

  return {
    canApprove,
    canCopy,
    canSaveAsDraft: true,         // immer erlaubt
    blockers,
    suggestedAction,
    nextSafeAction,
  }
}

/**
 * Validiert einen Status-Übergang.
 * Gibt null zurück wenn gültig, sonst Fehlermeldung.
 */
export function validateStatusTransition(
  from: EntryStatus,
  to: EntryStatus,
): string | null {
  const ALLOWED_TRANSITIONS: Partial<Record<EntryStatus, EntryStatus[]>> = {
    draft:                      ['needs_review', 'blocked'],
    needs_review:               ['approved_for_manual_copy', 'blocked', 'draft'],
    approved_for_manual_copy:   ['contacted_manual', 'needs_review', 'blocked'],
    contacted_manual:           ['needs_review'],  // re-open möglich
    blocked:                    ['draft'],          // nur re-open
  }

  const allowed = ALLOWED_TRANSITIONS[from] ?? []
  if (!allowed.includes(to)) {
    return `Ungültiger Statusübergang: "${from}" → "${to}". Erlaubt: ${allowed.join(', ') || 'keiner'}.`
  }
  return null
}
