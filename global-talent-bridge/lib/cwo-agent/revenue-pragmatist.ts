/**
 * lib/cwo-agent/revenue-pragmatist.ts
 *
 * Revenue Pragmatist Department
 *
 * Bewertet Revenue Streams nach Potenzial, Risiko, Aufwand, Schnelligkeit.
 * Blockiert automatisch alles was rechtliche Prüfung erfordert.
 * Autonomy Level: A1 (automatisch analysieren)
 */
import type { RevenueStream, RevenueRecommendation, ComplianceStatus } from './types'

// ── Revenue Stream Definitionen ───────────────────────────────────────────────

const REVENUE_STREAM_CONFIGS: Omit<RevenueStream, 'complianceStatus'>[] = [
  {
    id: 'employer_saas',
    name: 'Arbeitgeber-SaaS-Abo',
    icon: '💳',
    type: 'saas',
    incomePotential: 85,
    legalRisk: 15,
    effort: 40,
    timeToRevenue: '2–4 Wochen nach erstem Piloten',
    recommendation: 'test_now',
    rationale: 'Niedrigstes Risiko, skalierbar, kein Kandidatengeld. Monatliches Abo für Employer-Dashboard.',
    prerequisites: [
      'Mindestens 1 aktiver Pilotarbeitgeber',
      'Stripe oder ähnliches aktivieren (nach Rechtsprüfung Zahlungsabwicklung)',
      'AGB für Arbeitgeber vorhanden',
    ],
  },
  {
    id: 'premium_employer_dashboard',
    name: 'Premium Employer Dashboard',
    icon: '📊',
    type: 'premium',
    incomePotential: 75,
    legalRisk: 10,
    effort: 35,
    timeToRevenue: '3–6 Wochen',
    recommendation: 'test_now',
    rationale: 'Upgrade-Tier für Arbeitgeber — erweiterte Matching-Ansichten, Kandidaten-Vergleich, Analytics.',
    prerequisites: [
      'Basis-Dashboard live',
      'Mindestens 3 aktive Arbeitgeber',
      'Zahlungsabwicklung (Stripe) bereit',
    ],
  },
  {
    id: 'featured_employer',
    name: 'Featured Employer / Job Promotion',
    icon: '⭐',
    type: 'featured',
    incomePotential: 60,
    legalRisk: 10,
    effort: 20,
    timeToRevenue: '1–3 Wochen',
    recommendation: 'test_now',
    rationale: 'Einfachstes Modell — Arbeitgeber zahlen für Sichtbarkeit. Kein Kandidatengeld.',
    prerequisites: [
      'Jobs-Seite live mit ausreichend Traffic',
      'Mindestens 5 aktive Arbeitgeber',
    ],
  },
  {
    id: 'market_intelligence_reports',
    name: 'Market Intelligence Reports',
    icon: '📑',
    type: 'report',
    incomePotential: 65,
    legalRisk: 12,
    effort: 50,
    timeToRevenue: '4–8 Wochen',
    recommendation: 'test_later',
    rationale: 'Hochwertige Berichte über Talent-Korridore für HR-Abteilungen und Agenturen. Kein personenbezogenes Daten.',
    prerequisites: [
      'Datengrundlage aus Piloten aufgebaut',
      'Mindestens 50 anonymisierte Matching-Datensätze',
      'DSGVO-konforme Aggregierung sicherstellen',
    ],
  },
  {
    id: 'white_label',
    name: 'White-Label für Recruiting-Agenturen',
    icon: '🏷️',
    type: 'white_label',
    incomePotential: 90,
    legalRisk: 25,
    effort: 70,
    timeToRevenue: '8–16 Wochen',
    recommendation: 'test_later',
    rationale: 'Großes Potenzial — Agenturen als Reseller. Höherer Aufwand durch Customizing.',
    prerequisites: [
      'Produktreife nachgewiesen (min. 5 erfolgreiche Matches)',
      'White-Label-Vertragsvorlage (Anwalt)',
      'API oder Tenant-System',
    ],
  },
  {
    id: 'success_fee',
    name: 'B2B Success Fee (nach Einstellung)',
    icon: '🎯',
    type: 'success_fee',
    incomePotential: 95,
    legalRisk: 65,
    effort: 45,
    timeToRevenue: '3–6 Monate',
    recommendation: 'blocked_legal_review',
    rationale: 'Höchstes Potenzial — ABER: Arbeitnehmerüberlassungsgesetz, AÜG, mögliche Erlaubnispflicht prüfen.',
    prerequisites: [
      '⚠️ Rechtliche Prüfung AÜG § 1 ff.',
      '⚠️ Klärung ob Arbeitsvermittlungserlaubnis nötig (§ 296 SGB III)',
      '⚠️ Anwaltliche Freigabe vor Aktivierung',
      '⚠️ Vertragsvorlage mit Haftungsausschluss',
    ],
  },
  {
    id: 'candidate_services',
    name: 'Kandidaten-Services (Visa-Prep etc.)',
    icon: '✈️',
    type: 'candidate_service',
    incomePotential: 70,
    legalRisk: 80,
    effort: 60,
    timeToRevenue: '4–8 Monate',
    recommendation: 'blocked_legal_review',
    rationale: 'Kandidatengebühren riskant — § 296 SGB III, DSGVO, Visa-Rechtsberatung (RDG). Erst rechtliche Prüfung.',
    prerequisites: [
      '⚠️ Rechtliche Prüfung RDG (Rechtsdienstleistungsgesetz)',
      '⚠️ Klärung ob Vergütung von Kandidaten legal (Schwarzarbeit, SGB III)',
      '⚠️ Verbraucherschutzrecht prüfen',
      '⚠️ Keine Visa-Garantien — Verstoß gegen Irreführungsverbot',
    ],
  },
]

// ── Compliance-Berechnung ─────────────────────────────────────────────────────

function getComplianceStatus(recommendation: RevenueRecommendation): ComplianceStatus {
  if (recommendation === 'blocked_legal_review') return 'blocked'
  if (recommendation === 'test_later') return 'needs_review'
  return 'safe'
}

// ── Hauptfunktionen ───────────────────────────────────────────────────────────

/**
 * Gibt alle Revenue Streams bewertet zurück.
 * Reine Funktion. Kein I/O.
 */
export function analyzeRevenueStreams(): RevenueStream[] {
  return REVENUE_STREAM_CONFIGS.map((cfg): RevenueStream => ({
    ...cfg,
    complianceStatus: getComplianceStatus(cfg.recommendation),
  }))
}

/**
 * Gibt nur die sofort testbaren Streams zurück.
 */
export function getImmediateRevenueStreams(): RevenueStream[] {
  return analyzeRevenueStreams().filter(r => r.recommendation === 'test_now')
}

/**
 * Gibt blockierte Streams zurück (zur Warnung).
 */
export function getBlockedRevenueStreams(): RevenueStream[] {
  return analyzeRevenueStreams().filter(r => r.recommendation === 'blocked_legal_review')
}

/**
 * Gibt Top-N Revenue Streams nach Potenzial zurück (nur sichere).
 */
export function getTopRevenueStreams(n = 3): RevenueStream[] {
  return analyzeRevenueStreams()
    .filter(r => r.recommendation !== 'blocked_legal_review')
    .sort((a, b) => b.incomePotential - a.incomePotential)
    .slice(0, n)
}

/**
 * Berechnet einen einfachen Prioritätsscore (Potenzial - Risiko - Aufwand/2).
 */
export function getPriorityScore(stream: RevenueStream): number {
  return Math.max(0, stream.incomePotential - stream.legalRisk - Math.floor(stream.effort / 2))
}
