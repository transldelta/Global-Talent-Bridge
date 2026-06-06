/**
 * lib/cwo-agent/global-demand.ts
 *
 * Global Demand Department
 *
 * Analysiert globale Talent-Korridore und erzeugt Corridor-Scores 0–100.
 * KEIN Scraping. KEIN externer API-Call. KEIN Datenkauf.
 * Reine interne Regeln + sichere Suchvorschläge.
 * Autonomy Level: A1 (automatisch analysieren)
 */
import type { CorridorOpportunity, Priority } from './types'

// ── Corridor-Daten (intern, regelbasiert) ─────────────────────────────────────

type CorridorConfig = {
  origin:          string
  originFlag:      string
  destination:     string
  destinationFlag: string
  primarySectors:  string[]
  demandScore:     number  // bekannter Marktbedarf 0–100
  legalReadiness:  number  // wie gut ist rechtlicher Rahmen 0–100
  searchTerms:     string[]
  legalNote:       string
}

const CORRIDOR_CONFIGS: CorridorConfig[] = [
  {
    origin: 'Philippinen', originFlag: '🇵🇭',
    destination: 'Deutschland', destinationFlag: '🇩🇪',
    primarySectors: ['Pflege', 'Gesundheit', 'Hospitality'],
    demandScore: 92, legalReadiness: 85,
    searchTerms: ['Pflegekräfte Philippinen Deutschland', 'Filipino nurses Germany', 'Triple Win Philippinen'],
    legalNote: 'Triple Win Programm vorhanden — guter rechtlicher Rahmen',
  },
  {
    origin: 'Indien', originFlag: '🇮🇳',
    destination: 'Deutschland', destinationFlag: '🇩🇪',
    primarySectors: ['IT', 'Software', 'Ingenieurwesen'],
    demandScore: 88, legalReadiness: 80,
    searchTerms: ['Indian IT professionals Germany', 'Fachkräfteeinwanderungsgesetz IT Indien', 'India Germany tech talent'],
    legalNote: 'Fachkräfteeinwanderungsgesetz 2023 erweitert Optionen deutlich',
  },
  {
    origin: 'Marokko', originFlag: '🇲🇦',
    destination: 'Deutschland', destinationFlag: '🇩🇪',
    primarySectors: ['Pflege', 'Handwerk', 'Bau', 'Logistik'],
    demandScore: 82, legalReadiness: 75,
    searchTerms: ['Marokko Fachkräfte Deutschland', 'Morocco skilled workers Germany', 'Handwerker Marokko Rekrutierung'],
    legalNote: 'Anerkennungsberatung nötig — AHK Marokko aktiv',
  },
  {
    origin: 'Tunesien', originFlag: '🇹🇳',
    destination: 'Deutschland', destinationFlag: '🇩🇪',
    primarySectors: ['Pflege', 'Handwerk', 'IT'],
    demandScore: 78, legalReadiness: 72,
    searchTerms: ['Tunesien Fachkräfte Deutschland', 'Tunisian professionals Germany', 'GIZ Tunesien Migration'],
    legalNote: 'GIZ-Programme aktiv — strukturierte Anerkennungswege',
  },
  {
    origin: 'Nigeria', originFlag: '🇳🇬',
    destination: 'UK', destinationFlag: '🇬🇧',
    primarySectors: ['Pflege', 'Gesundheit', 'IT'],
    demandScore: 85, legalReadiness: 78,
    searchTerms: ['Nigeria nurses UK NHS', 'Nigerian healthcare professionals UK', 'Skilled Worker Visa Nigeria UK'],
    legalNote: 'Skilled Worker Visa aktiv — NHS-Nachfrage sehr hoch',
  },
  {
    origin: 'Brasilien', originFlag: '🇧🇷',
    destination: 'Portugal', destinationFlag: '🇵🇹',
    primarySectors: ['IT', 'Gesundheit', 'Gastronomie'],
    demandScore: 80, legalReadiness: 88,
    searchTerms: ['Brasilien Portugal Fachkräfte', 'Brazil Portugal skilled workers', 'EU Blue Card Brazil'],
    legalNote: 'Sprachvorteil + EU-Zugang über Portugal — sehr niedrige Barriere',
  },
  {
    origin: 'Kenia', originFlag: '🇰🇪',
    destination: 'Deutschland', destinationFlag: '🇩🇪',
    primarySectors: ['Pflege', 'Hospitality', 'Gastronomie'],
    demandScore: 74, legalReadiness: 68,
    searchTerms: ['Kenya nurses Germany', 'Kenia Pflegekräfte Rekrutierung', 'East Africa Germany migration'],
    legalNote: 'Wachsendes Interesse — Anerkennungsberatung erforderlich',
  },
  {
    origin: 'Indonesien', originFlag: '🇮🇩',
    destination: 'Deutschland', destinationFlag: '🇩🇪',
    primarySectors: ['Pflege', 'Hospitality'],
    demandScore: 76, legalReadiness: 70,
    searchTerms: ['Indonesien Pflegekräfte Deutschland', 'Indonesian nurses Germany', 'Triple Win Indonesia'],
    legalNote: 'Triple Win Erweiterung auf Indonesien in Diskussion',
  },
  {
    origin: 'Pakistan', originFlag: '🇵🇰',
    destination: 'Kanada', destinationFlag: '🇨🇦',
    primarySectors: ['IT', 'Ingenieurwesen', 'Gesundheit'],
    demandScore: 83, legalReadiness: 82,
    searchTerms: ['Pakistan Canada Express Entry', 'Pakistani engineers Canada', 'Pakistan IT professionals Canada'],
    legalNote: 'Express Entry — technische Profile sehr nachgefragt',
  },
  {
    origin: 'Mexiko', originFlag: '🇲🇽',
    destination: 'Kanada', destinationFlag: '🇨🇦',
    primarySectors: ['Landwirtschaft', 'Bau', 'Gastronomie'],
    demandScore: 79, legalReadiness: 85,
    searchTerms: ['Mexico Canada seasonal workers', 'SAWP Mexico Canada', 'Mexican workers Canada agriculture'],
    legalNote: 'SAWP (Seasonal Agricultural Worker Program) gut etabliert',
  },
]

// ── Score-Berechnung ──────────────────────────────────────────────────────────

function calculateCorridorScore(cfg: CorridorConfig): number {
  // Gewichtung: 60% Marktnachfrage + 40% rechtliche Bereitschaft
  return Math.round(cfg.demandScore * 0.6 + cfg.legalReadiness * 0.4)
}

function scoreToPriority(score: number): Priority {
  if (score >= 80) return 'high'
  if (score >= 65) return 'medium'
  return 'low'
}

function buildSearchSuggestions(cfg: CorridorConfig): string[] {
  return cfg.searchTerms.map(term =>
    `https://www.google.com/search?q=${encodeURIComponent(term)}`
  )
}

// ── Hauptfunktion ─────────────────────────────────────────────────────────────

/**
 * Analysiert alle Korridore und gibt priorisierte Liste zurück.
 * Reine Funktion. Kein Scraping. Kein I/O.
 */
export function analyzeCorridors(): CorridorOpportunity[] {
  return CORRIDOR_CONFIGS
    .map((cfg, i): CorridorOpportunity => ({
      id:              `corridor_${i + 1}`,
      origin:          cfg.origin,
      originFlag:      cfg.originFlag,
      destination:     cfg.destination,
      destinationFlag: cfg.destinationFlag,
      primarySectors:  cfg.primarySectors,
      score:           calculateCorridorScore(cfg),
      demandRationale: `Marktbedarf: ${cfg.demandScore}/100 · Rechtliche Bereitschaft: ${cfg.legalReadiness}/100`,
      legalReadiness:  cfg.legalNote,
      searchSuggestions: buildSearchSuggestions(cfg),
      priority:        scoreToPriority(calculateCorridorScore(cfg)),
      complianceStatus: 'safe',
      noScraping:      true,
    }))
    .sort((a, b) => b.score - a.score)
}

/**
 * Gibt Top-N Korridore zurück.
 */
export function getTopCorridors(n = 3): CorridorOpportunity[] {
  return analyzeCorridors().slice(0, n)
}

/**
 * Gibt alle verfügbaren Ursprungsländer zurück.
 */
export function getAvailableOrigins(): string[] {
  return [...new Set(CORRIDOR_CONFIGS.map(c => c.origin))]
}

/**
 * Gibt alle verfügbaren Zielmärkte zurück.
 */
export function getAvailableDestinations(): string[] {
  return [...new Set(CORRIDOR_CONFIGS.map(c => c.destination))]
}
