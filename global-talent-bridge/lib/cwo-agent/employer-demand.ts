/**
 * lib/cwo-agent/employer-demand.ts
 *
 * Employer Demand Department
 *
 * Priorisiert Arbeitgeberbranchen nach Personalnot, Zahlungsbereitschaft,
 * internationalem Bedarf, Pilotfähigkeit und Risiko.
 * KEIN Scraping. KEIN externer API-Call. Nur interne Bewertungslogik.
 * Autonomy Level: A1 (automatisch analysieren)
 */
import type { EmployerSectorDemand, Priority, ComplianceStatus } from './types'

type SectorConfig = {
  sector:             string
  sectorIcon:         string
  urgency:            number  // Personalnot 0–100
  paymentWillingness: number  // Zahlungsbereitschaft 0–100
  internationalNeed:  number  // internationaler Fachkräftebedarf 0–100
  pilotReadiness:     number  // Pilotfähigkeit 0–100 (kleine Firmen, offene Chefs)
  riskScore:          number  // regulatorisches/rechtliches Risiko 0–100
  recommendation:     string
  searchStrategies:   string[]
}

const SECTOR_CONFIGS: SectorConfig[] = [
  {
    sector: 'Altenpflege & Pflege', sectorIcon: '🏥',
    urgency: 95, paymentWillingness: 70, internationalNeed: 92,
    pilotReadiness: 85, riskScore: 35,
    recommendation: 'Höchste Priorität — Triple Win & Co. bieten Rahmen. Sofort Pilot starten.',
    searchStrategies: [
      'Pflegeheim Fachkräftemangel 2024 Stellenangebote',
      'Altenpflege internationales Personal Deutschland',
      'Pflegedienstleitung internationale Rekrutierung Kontakt',
    ],
  },
  {
    sector: 'IT & Software', sectorIcon: '💻',
    urgency: 88, paymentWillingness: 92, internationalNeed: 85,
    pilotReadiness: 80, riskScore: 20,
    recommendation: 'Sehr hohes Potenzial — Zahlungsbereitschaft top. IT-Fachkräftevisa einfacher.',
    searchStrategies: [
      'IT-Dienstleister Deutschland internationale Entwickler',
      'Software Unternehmen internationale Fachkräfte gesucht',
      'IT Personalvermittlung international Kontakt',
    ],
  },
  {
    sector: 'Hotel & Gastronomie', sectorIcon: '🏨',
    urgency: 82, paymentWillingness: 55, internationalNeed: 80,
    pilotReadiness: 90, riskScore: 25,
    recommendation: 'Sehr pilotfähig — kleine Hotels offen, Entscheidung schnell.',
    searchStrategies: [
      'Hotel Fachkräfte international Deutschland suchen',
      'Gastronomie internationale Mitarbeiter Rekrutierung',
      'Restaurant Stellenangebote internationale Küchenkräfte',
    ],
  },
  {
    sector: 'Logistik & Transport', sectorIcon: '🚚',
    urgency: 85, paymentWillingness: 65, internationalNeed: 82,
    pilotReadiness: 75, riskScore: 30,
    recommendation: 'Gutes Potenzial — Führerscheinfragen klären, dann Pilot.',
    searchStrategies: [
      'Logistik Fahrer Fachkräftemangel international',
      'Spedition internationale Fahrer gesucht',
      'Transport Logistik Personalvermittlung international',
    ],
  },
  {
    sector: 'Bau & Handwerk', sectorIcon: '🔨',
    urgency: 87, paymentWillingness: 68, internationalNeed: 83,
    pilotReadiness: 72, riskScore: 40,
    recommendation: 'Hoher Bedarf — Anerkennungsfragen dauern, trotzdem lohnend.',
    searchStrategies: [
      'Bauunternehmen internationale Fachkräfte Handwerk',
      'Elektriker international Deutschland Stellenangebote',
      'Handwerksbetrieb Fachkräftemangel internationales Personal',
    ],
  },
  {
    sector: 'Gesundheit & Kliniken', sectorIcon: '⚕️',
    urgency: 90, paymentWillingness: 75, internationalNeed: 88,
    pilotReadiness: 65, riskScore: 50,
    recommendation: 'Sehr hohe Nachfrage — Approbation ist Hürde, Partner nötig.',
    searchStrategies: [
      'Klinik Arzt internationales Recruiting Deutschland',
      'MVZ internationale Ärzte Fachkräftemangel',
      'Krankenhaus Pflege internationale Rekrutierung',
    ],
  },
  {
    sector: 'Gebäudereinigung & Facility', sectorIcon: '🧹',
    urgency: 78, paymentWillingness: 45, internationalNeed: 75,
    pilotReadiness: 88, riskScore: 20,
    recommendation: 'Sehr pilotfähig, geringe Barrieren — Zahlungsbereitschaft niedrig.',
    searchStrategies: [
      'Reinigungsfirma internationale Mitarbeiter Deutschland',
      'Gebäudereinigung Fachkräftemangel Personal',
      'Facility Management internationale Reinigungskräfte',
    ],
  },
  {
    sector: 'Zeitarbeit & Personalvermittlung', sectorIcon: '🤝',
    urgency: 80, paymentWillingness: 78, internationalNeed: 80,
    pilotReadiness: 70, riskScore: 45,
    recommendation: 'Multiplikatoren — ein Zeitarbeiter = viele Arbeitgeber.',
    searchStrategies: [
      'Zeitarbeitsfirma internationale Kandidaten Partner',
      'Personalvermittlung internationales Recruiting Kooperation',
      'Zeitarbeit Pflege international Rahmenvertrag',
    ],
  },
  {
    sector: 'Sicherheitsdienste', sectorIcon: '🔒',
    urgency: 75, paymentWillingness: 52, internationalNeed: 70,
    pilotReadiness: 82, riskScore: 35,
    recommendation: 'Gute Pilotfähigkeit — Zuverlässigkeitsprüfung beachten.',
    searchStrategies: [
      'Sicherheitsdienst internationale Mitarbeiter Deutschland',
      'Wachdienst Fachkräftemangel internationales Personal',
      'Security Unternehmen internationale Rekrutierung',
    ],
  },
  {
    sector: 'Landwirtschaft & Saisonarbeit', sectorIcon: '🌱',
    urgency: 83, paymentWillingness: 40, internationalNeed: 88,
    pilotReadiness: 78, riskScore: 30,
    recommendation: 'Saisonale Programme gut etabliert — Einstieg über bestehende Rahmen.',
    searchStrategies: [
      'Landwirtschaft Saisonkräfte international Deutschland',
      'Erntehilfe internationale Arbeiter Vermittlung',
      'Agrar Fachkräfte international Stellenangebote',
    ],
  },
]

// ── Score-Berechnung ──────────────────────────────────────────────────────────

function calculateOverallScore(cfg: SectorConfig): number {
  // Gewichtung: Urgency 30% + Zahlung 25% + International 25% + Pilot 20% - Risiko 10%
  return Math.min(100, Math.round(
    cfg.urgency * 0.30 +
    cfg.paymentWillingness * 0.25 +
    cfg.internationalNeed * 0.25 +
    cfg.pilotReadiness * 0.20 -
    cfg.riskScore * 0.10
  ))
}

function scoreToCompliance(riskScore: number): ComplianceStatus {
  if (riskScore >= 60) return 'needs_review'
  if (riskScore >= 80) return 'blocked'
  return 'safe'
}

function scoreToPriority(score: number): Priority {
  if (score >= 78) return 'high'
  if (score >= 65) return 'medium'
  return 'low'
}

// ── Hauptfunktionen ───────────────────────────────────────────────────────────

/**
 * Gibt alle Sektoren mit Bewertung zurück, sortiert nach Score.
 * Reine Funktion. Kein I/O.
 */
export function analyzeEmployerDemand(): EmployerSectorDemand[] {
  return SECTOR_CONFIGS
    .map((cfg): EmployerSectorDemand => ({
      sector:              cfg.sector,
      sectorIcon:          cfg.sectorIcon,
      urgency:             cfg.urgency,
      paymentWillingness:  cfg.paymentWillingness,
      internationalNeed:   cfg.internationalNeed,
      pilotReadiness:      cfg.pilotReadiness,
      riskScore:           cfg.riskScore,
      overallScore:        calculateOverallScore(cfg),
      recommendation:      cfg.recommendation,
      searchStrategies:    cfg.searchStrategies,
      complianceStatus:    scoreToCompliance(cfg.riskScore),
    }))
    .sort((a, b) => b.overallScore - a.overallScore)
}

/**
 * Gibt Top-N Sektoren zurück.
 */
export function getTopEmployerSectors(n = 3): EmployerSectorDemand[] {
  return analyzeEmployerDemand().slice(0, n)
}

/**
 * Gibt Sektoren zurück die sofort pilotfähig sind (pilotReadiness ≥ 80).
 */
export function getPilotReadySectors(): EmployerSectorDemand[] {
  return analyzeEmployerDemand().filter(s => s.pilotReadiness >= 80)
}
