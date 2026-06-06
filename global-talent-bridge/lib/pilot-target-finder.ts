/**
 * lib/pilot-target-finder.ts
 *
 * Pilot Target Finder — reine Suchvorschlag-Generierung.
 *
 * KEIN Scraping. KEIN Web-Crawling. KEIN externer API-Call.
 * Gibt nur Suchstring-Vorschläge zurück, die der Nutzer
 * manuell in Google eingeben kann.
 *
 * Reine Funktion. Keine Seiteneffekte.
 */

export type TargetSector =
  | 'pflege'
  | 'hotel'
  | 'logistik'
  | 'it'
  | 'zeitarbeit'
  | 'reinigung'
  | 'sicherheit'
  | 'handwerk'
  | 'bau'
  | 'gesundheit'

export type SearchSuggestion = {
  query:        string
  googleUrl:    string
  rationale:    string
}

export type TargetFinderResult = {
  city:         string
  sector:       TargetSector
  suggestions:  SearchSuggestion[]
  tips:         string[]
  nextAction:   string
}

// ── Sektor-Konfiguration ───────────────────────────────────────────────────────

const SECTOR_CONFIG: Record<TargetSector, {
  label:    string
  terms:    string[]
  jobTerms: string[]
}> = {
  pflege: {
    label:    'Pflege & Soziales',
    terms:    ['Pflegeheim', 'Pflegedienst', 'Altenpflege', 'Seniorenheim', 'Sozialstation', 'AWO', 'Caritas', 'Diakonie'],
    jobTerms: ['Jobs', 'Karriere', 'Stellenangebote', 'Fachkräfte gesucht', 'Personal'],
  },
  hotel: {
    label:    'Hotel & Gastgewerbe',
    terms:    ['Hotel', 'Gasthaus', 'Restaurant', 'Catering', 'Gastronomie'],
    jobTerms: ['Jobs', 'Karriere', 'Stellenangebote', 'Personal', 'Mitarbeiter'],
  },
  logistik: {
    label:    'Logistik & Transport',
    terms:    ['Spedition', 'Logistik', 'Lager', 'Versand', 'Transport'],
    jobTerms: ['Jobs', 'Karriere', 'Stellenangebote', 'Fahrer gesucht', 'Lagerarbeiter'],
  },
  it: {
    label:    'IT & Software',
    terms:    ['IT-Dienstleister', 'Softwareunternehmen', 'IT-Firma', 'Systemhaus', 'Tech-Startup'],
    jobTerms: ['Jobs', 'Karriere', 'Entwickler gesucht', 'Stellenangebote'],
  },
  zeitarbeit: {
    label:    'Zeitarbeit & Personalvermittlung',
    terms:    ['Zeitarbeitsfirma', 'Personalvermittlung', 'Zeitarbeit Pflege', 'Personaldienstleister'],
    jobTerms: ['Jobs', 'Karriere', 'Mitarbeiter', 'Stellenangebote'],
  },
  reinigung: {
    label:    'Gebäudereinigung & Facility',
    terms:    ['Reinigungsfirma', 'Gebäudereinigung', 'Facility Management', 'Reinigungsdienst'],
    jobTerms: ['Jobs', 'Reinigungskraft gesucht', 'Stellenangebote', 'Personal'],
  },
  sicherheit: {
    label:    'Sicherheitsdienste',
    terms:    ['Sicherheitsdienst', 'Wachdienst', 'Sicherheitsunternehmen', 'Security'],
    jobTerms: ['Jobs', 'Wachmann gesucht', 'Sicherheitsmitarbeiter', 'Stellenangebote'],
  },
  handwerk: {
    label:    'Handwerk',
    terms:    ['Handwerksbetrieb', 'Elektriker', 'Klempner', 'Maler', 'Schreiner', 'Zimmerer'],
    jobTerms: ['Jobs', 'Gesellen gesucht', 'Fachkraft gesucht', 'Stellenangebote'],
  },
  bau: {
    label:    'Bau & Bauhilfsgewerbe',
    terms:    ['Bauunternehmen', 'Bauftirma', 'Hochbau', 'Tiefbau', 'Baugewerbe'],
    jobTerms: ['Jobs', 'Fachkraft gesucht', 'Bauarbeiter gesucht', 'Stellenangebote'],
  },
  gesundheit: {
    label:    'Gesundheit & Medizin',
    terms:    ['Arztpraxis', 'Klinik', 'Krankenhaus', 'Medizinisches Versorgungszentrum', 'MVZ'],
    jobTerms: ['Jobs', 'Karriere', 'Stellenangebote', 'Fachärzte gesucht', 'MFA gesucht'],
  },
}

// ── Suchvorschlag-Generierung ──────────────────────────────────────────────────

function toGoogleUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

/**
 * Generiert Suchvorschläge für den Pilot Target Finder.
 * Reine Funktion — KEIN externer Aufruf, KEIN Scraping.
 */
export function generateSearchSuggestions(
  city: string,
  sector: TargetSector,
): TargetFinderResult {
  const cfg = SECTOR_CONFIG[sector]
  const cityTrimmed = city.trim()

  const suggestions: SearchSuggestion[] = []

  // Typ 1: Firmenart + Stadt + Karrierestichwort
  for (const term of cfg.terms.slice(0, 3)) {
    for (const job of cfg.jobTerms.slice(0, 2)) {
      const query = cityTrimmed
        ? `${term} ${cityTrimmed} ${job}`
        : `${term} Deutschland ${job}`
      suggestions.push({
        query,
        googleUrl: toGoogleUrl(query),
        rationale: `Findet ${term} in ${cityTrimmed || 'Deutschland'} mit aktiver Stellensuche`,
      })
    }
  }

  // Typ 2: Branche + Stadt + "Fachkräfte"
  const fachkraefteQuery = cityTrimmed
    ? `${cfg.label} ${cityTrimmed} Fachkräfte international`
    : `${cfg.label} Deutschland Fachkräfte international`
  suggestions.push({
    query:     fachkraefteQuery,
    googleUrl: toGoogleUrl(fachkraefteQuery),
    rationale: `Zeigt Diskussionen über Fachkräftemangel in diesem Bereich`,
  })

  // Typ 3: Mit "Karriere"-Seite Suche
  const karriereQuery = cityTrimmed
    ? `${cfg.terms[0]} ${cityTrimmed} site:karriere OR site:jobs OR "offene Stellen"`
    : `${cfg.terms[0]} Deutschland "offene Stellen" OR "Stellenangebote"`
  suggestions.push({
    query:     karriereQuery,
    googleUrl: toGoogleUrl(karriereQuery),
    rationale: `Sucht Firmen mit aktiver Karriere-Seite — ideal für Pilot`,
  })

  // Typ 4: LinkedIn-Suche
  const linkedinQuery = cityTrimmed
    ? `site:linkedin.com ${cfg.terms[0]} ${cityTrimmed} HR OR Personalleitung`
    : `site:linkedin.com ${cfg.terms[0]} Deutschland HR OR Personalleitung`
  suggestions.push({
    query:     linkedinQuery,
    googleUrl: toGoogleUrl(linkedinQuery),
    rationale: `LinkedIn-Suche nach Entscheidungsträgern in ${cfg.label}`,
  })

  const tips = [
    `Nimm eine Firma mit Website und sichtbarer Karriere-/Jobs-Seite.`,
    `Ideal: Firmen die auf ihrer Website "Wir suchen" oder "Offene Stellen" zeigen.`,
    `Firmen mit 10–200 Mitarbeitern sind oft offener für Pilot-Tests als Konzerne.`,
    `Vermeide Firmen ohne Website — schwerer zu kontaktieren und Score bleibt niedrig.`,
    `Notiere Firmenname + Website + Ansprechpartner bevor du in den Autopilot wechselst.`,
  ]

  return {
    city:       cityTrimmed || 'Deutschland',
    sector,
    suggestions: suggestions.slice(0, 8),   // max 8 Vorschläge
    tips,
    nextAction: 'Firma gefunden? → Outreach Autopilot öffnen und Firma eintragen.',
  }
}

/**
 * Gibt alle verfügbaren Sektoren als Label-Liste zurück.
 */
export function getAvailableSectors(): Array<{ value: TargetSector; label: string }> {
  return Object.entries(SECTOR_CONFIG).map(([value, cfg]) => ({
    value: value as TargetSector,
    label: cfg.label,
  }))
}
