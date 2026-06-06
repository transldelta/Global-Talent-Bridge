/**
 * lib/outreach-autopilot/delivery-agent.ts
 *
 * Delivery Agent — Phase 2 ARCHITEKTUR (NICHT AKTIVIERT)
 *
 * ⚠️  PHASE 1: Dieser Agent ist vollständig deaktiviert.
 *              Alle Methoden geben { allowed: false } zurück.
 *              EMAIL_PROVIDER bleibt none.
 *              OUTREACH_EMAIL_PROVIDER bleibt none.
 *              Kein automatischer Versand möglich.
 *
 * Phase 2 Aktivierungsbedingungen (ALLE müssen erfüllt sein):
 * 1. EMAIL_PROVIDER !== 'none'
 * 2. OUTREACH_EMAIL_PROVIDER !== 'none'
 * 3. ContactSource ∈ { existing_relationship, explicit_opt_in }  (NICHT manual_input)
 * 4. Compliance Agent = 'safe'
 * 5. Fit Score ≥ 70
 * 6. Einzelne Nachricht wurde explizit freigegeben (approved_for_manual_copy → ready)
 * 7. Tageslimit nicht überschritten (max 3–5 Nachrichten/Tag)
 * 8. Vollständiges Audit-Log vorhanden
 * 9. Opt-out/Stop-Vermerk vorhanden
 * 10. Kein bulk — nur single message
 *
 * Reine Funktion. Kein DB-Call.
 */
import type { DeliveryCheckResult, DeliveryCondition, ContactSource } from './types'

export type DeliveryInput = {
  emailProvider:          string
  outreachEmailProvider:  string
  contactSource:          ContactSource
  complianceStatus:       string
  fitScore:               number
  isExplicitlyApproved:   boolean
  dailySentCount:         number
  hasAuditLog:            boolean
  hasOptOut:              boolean
}

const DAILY_SEND_LIMIT = 5

/**
 * Prüft alle Phase-2-Bedingungen für einen automatischen Versand.
 * Gibt IMMER { allowed: false, phase: 1 } in Phase 1 zurück.
 */
export function checkDeliveryConditions(input: DeliveryInput): DeliveryCheckResult {
  const conditions: DeliveryCondition[] = [
    {
      name:        'email_provider_active',
      met:         input.emailProvider !== 'none',
      description: `EMAIL_PROVIDER muss aktiviert sein (aktuell: "${input.emailProvider}")`,
    },
    {
      name:        'outreach_provider_active',
      met:         input.outreachEmailProvider !== 'none',
      description: `OUTREACH_EMAIL_PROVIDER muss aktiviert sein (aktuell: "${input.outreachEmailProvider}")`,
    },
    {
      name:        'valid_contact_source',
      met:         ['existing_relationship', 'explicit_opt_in'].includes(input.contactSource),
      description: `Kontaktquelle muss "existing_relationship" oder "explicit_opt_in" sein (aktuell: "${input.contactSource}")`,
    },
    {
      name:        'compliance_safe',
      met:         input.complianceStatus === 'safe',
      description: `Compliance-Status muss "safe" sein (aktuell: "${input.complianceStatus}")`,
    },
    {
      name:        'fit_score_threshold',
      met:         input.fitScore >= 70,
      description: `Fit Score muss ≥ 70 sein (aktuell: ${input.fitScore})`,
    },
    {
      name:        'explicitly_approved',
      met:         input.isExplicitlyApproved,
      description: 'Nachricht muss explizit freigegeben sein',
    },
    {
      name:        'daily_limit',
      met:         input.dailySentCount < DAILY_SEND_LIMIT,
      description: `Tageslimit: max ${DAILY_SEND_LIMIT} Nachrichten/Tag (heute: ${input.dailySentCount})`,
    },
    {
      name:        'audit_log',
      met:         input.hasAuditLog,
      description: 'Vollständiges Audit-Log muss vorhanden sein',
    },
    {
      name:        'opt_out',
      met:         input.hasOptOut,
      description: 'Opt-out/Stop-Vermerk muss vorhanden sein',
    },
  ]

  // Phase 1: IMMER geblockt, unabhängig von den Bedingungen
  return {
    allowed:    false,
    phase:      1,
    reason:     'Phase 1: Kein automatischer Versand. Alle Nachrichten werden manuell (Copy & Paste) versendet.',
    conditions,
  }
}

/**
 * Gibt einen lesbaren Bericht über fehlende Phase-2-Bedingungen zurück.
 */
export function getDeliveryReadinessReport(input: DeliveryInput): string {
  const result = checkDeliveryConditions(input)
  const missing = result.conditions.filter(c => !c.met)

  if (missing.length === 0) {
    return 'Alle Bedingungen für Phase 2 sind erfüllt — Aktivierung nach manueller Freigabe möglich.'
  }

  return [
    `Phase 2 noch nicht verfügbar. Fehlende Bedingungen (${missing.length}/${result.conditions.length}):`,
    ...missing.map(c => `  - ${c.description}`),
  ].join('\n')
}
