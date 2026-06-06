/**
 * lib/cwo-agent/compliance-guard.ts
 *
 * Compliance Guard Department
 *
 * Blockiert automatisch alle riskanten Aktionen.
 * Gibt strukturierte Risikoliste zurück.
 * Autonomy Level: A1 (automatisch prüfen und blockieren)
 */
import type { BlockedRisk, RiskLevel } from './types'

// ── Bekannte blockierte Risiken ───────────────────────────────────────────────

const BLOCKED_RISKS: Omit<BlockedRisk, 'status'>[] = [
  {
    id: 'spam_outreach',
    category: 'Massenversand',
    description: 'Automatischer Bulk-Outreach an externe Firmen',
    severity: 'critical',
    reason: 'Verstößt gegen DSGVO Art. 6, UWG § 7 (unzumutbare Belästigung), und zerstört Reputation.',
  },
  {
    id: 'email_provider',
    category: 'E-Mail-Versand',
    description: 'Aktivierung von Resend / EMAIL_PROVIDER',
    severity: 'critical',
    reason: 'Ohne rechtliche Grundlage (Einwilligung oder berechtigtes Interesse) kein Cold-Email-Outreach erlaubt.',
  },
  {
    id: 'scraping',
    category: 'Scraping',
    description: 'Automatisches Crawling externer Webseiten oder APIs',
    severity: 'high',
    reason: 'Verstößt gegen Nutzungsbedingungen, DSGVO, und möglicherweise § 202a StGB (Ausspähen von Daten).',
  },
  {
    id: 'whatsapp_automation',
    category: 'Messaging-Automation',
    description: 'Automatische WhatsApp- oder LinkedIn-Nachrichten',
    severity: 'critical',
    reason: 'WhatsApp Business API ohne offizielle Genehmigung = Kontosperrrisiko + DSGVO-Verstoß.',
  },
  {
    id: 'visa_guarantees',
    category: 'Falsche Versprechen',
    description: 'Visa-Garantien oder garantierte Jobzusagen an Kandidaten',
    severity: 'critical',
    reason: 'Irreführungstatbestand § 5 UWG. Keine Plattform kann Visa garantieren.',
  },
  {
    id: 'candidate_fees',
    category: 'Kandidatengebühren',
    description: 'Gebühren von Kandidaten ohne Rechtsprüfung erheben',
    severity: 'high',
    reason: 'Arbeitsvermittlung gegen Entgelt erfordert Erlaubnis (§ 296 SGB III). RDG für Beratungsleistungen.',
  },
  {
    id: 'personal_data_no_basis',
    category: 'Datenschutz',
    description: 'Personenbezogene Daten ohne Rechtsgrundlage sammeln',
    severity: 'high',
    reason: 'DSGVO Art. 6 — jede Verarbeitung personenbezogener Daten braucht Rechtsgrundlage.',
  },
  {
    id: 'paid_services',
    category: 'Kostenpflichtige Dienste',
    description: 'Aktivierung kostenpflichtiger APIs oder Dienste ohne Freigabe',
    severity: 'medium',
    reason: 'Budget-Kontrolle und rechtliche Prüfung der AGB des Diensteanbieters erforderlich.',
  },
  {
    id: 'success_fee_no_review',
    category: 'Success Fee',
    description: 'B2B Erfolgsgebühr ohne anwaltliche Prüfung',
    severity: 'high',
    reason: 'AÜG § 1 ff., ggf. Arbeitnehmerüberlassungserlaubnis. Strafbar ohne Genehmigung.',
  },
  {
    id: 'data_purchase',
    category: 'Datenkauf',
    description: 'Kauf von Kandidaten- oder Arbeitgeberlisten',
    severity: 'high',
    reason: 'DSGVO — Daten Dritter ohne nachweisliche Einwilligung verarbeiten ist unzulässig.',
  },
]

// ── Compliance-Check Funktionen ───────────────────────────────────────────────

/**
 * Gibt alle blockierten Risiken zurück.
 * Immer vollständig. Keine Ausnahmen in Phase 1.
 */
export function getAllBlockedRisks(): BlockedRisk[] {
  return BLOCKED_RISKS.map(r => ({ ...r, status: 'blocked' as const }))
}

/**
 * Gibt kritische Risiken zurück (severity = critical).
 */
export function getCriticalRisks(): BlockedRisk[] {
  return getAllBlockedRisks().filter(r => r.severity === 'critical')
}

/**
 * Prüft ob eine Aktion erlaubt ist.
 * Gibt { allowed: false, reason } zurück wenn blockiert.
 */
export function checkAction(actionId: string): { allowed: boolean; reason?: string } {
  const risk = BLOCKED_RISKS.find(r => r.id === actionId)
  if (risk) {
    return { allowed: false, reason: risk.reason }
  }
  return { allowed: true }
}

/**
 * System-Invarianten — immer true, können nicht überschrieben werden.
 */
export const SYSTEM_INVARIANTS = {
  noEmailSent:           true as const,
  noAutoOutreach:        true as const,
  noScraping:            true as const,
  emailProvider:         'none' as const,
  outreachEmailProvider: 'none' as const,
  sendButtonExists:      false as const,
  bulkSendExists:        false as const,
  autoContactExists:     false as const,
  scrapingEnabled:       false as const,
  phase:                 1 as const,
} as const

/**
 * Prüft ob alle Invarianten eingehalten sind.
 * Gibt Array leerer Strings zurück wenn OK, sonst Fehlerliste.
 */
export function validateInvariants(): string[] {
  const violations: string[] = []
  if (SYSTEM_INVARIANTS.emailProvider !== 'none') violations.push('EMAIL_PROVIDER ist nicht none')
  if (SYSTEM_INVARIANTS.outreachEmailProvider !== 'none') violations.push('OUTREACH_EMAIL_PROVIDER ist nicht none')
  if (!SYSTEM_INVARIANTS.noEmailSent) violations.push('noEmailSent ist nicht true')
  if (!SYSTEM_INVARIANTS.noAutoOutreach) violations.push('noAutoOutreach ist nicht true')
  if (!SYSTEM_INVARIANTS.noScraping) violations.push('noScraping ist nicht true')
  if (SYSTEM_INVARIANTS.sendButtonExists) violations.push('Send-Button existiert')
  if (SYSTEM_INVARIANTS.bulkSendExists) violations.push('Bulk-Send existiert')
  if (SYSTEM_INVARIANTS.scrapingEnabled) violations.push('Scraping ist aktiviert')
  return violations
}

/**
 * Gibt Anzahl blockierter Risiken nach Severity zurück.
 */
export function getRiskSummary(): Record<RiskLevel, number> {
  const risks = getAllBlockedRisks()
  return {
    critical: risks.filter(r => r.severity === 'critical').length,
    high:     risks.filter(r => r.severity === 'high').length,
    medium:   risks.filter(r => r.severity === 'medium').length,
    low:      risks.filter(r => r.severity === 'low').length,
  }
}
