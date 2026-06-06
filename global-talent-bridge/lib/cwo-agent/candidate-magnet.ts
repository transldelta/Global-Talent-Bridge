/**
 * lib/cwo-agent/candidate-magnet.ts
 *
 * Candidate Magnet Department
 *
 * Baut legale Inbound-Strategie für Bewerber:
 * SEO-Ideen, Landingpage-Vorschläge, Länder-/Sprachseiten, Content-Ideen.
 * KEINE falschen Jobversprechen. KEINE Visa-Garantien.
 * KEINE automatische Gruppenansprache.
 * Autonomy Level: A3/A4 (automatisch Aufgaben + Inhalte vorbereiten)
 */
import type { CandidateMagnetAsset, Priority, ComplianceStatus } from './types'

// ── Inbound-Asset-Definitionen ────────────────────────────────────────────────

const CANDIDATE_ASSETS: CandidateMagnetAsset[] = [
  // === Landingpages ===
  {
    type: 'landing_page',
    title: 'Pflegekräfte aus den Philippinen — Arbeiten in Deutschland',
    description: 'Dedicated Landingpage für philippinische Pflegefachkräfte. Erklärt CorridorWork, Matching-Prozess, was passiert nach Registrierung.',
    targetCountry: 'Philippinen',
    targetSector: 'Pflege',
    audience: 'candidate',
    priority: 'high',
    seoKeywords: ['Pflegekraft Philippinen Deutschland', 'Filipino nurse Germany job', 'work in Germany nurse Philippines'],
    complianceNote: 'Keine Visa-Garantien. Klar kommunizieren: Matching-Plattform, kein Jobversprechen.',
    complianceStatus: 'safe',
  },
  {
    type: 'landing_page',
    title: 'IT-Fachkräfte aus Indien — Jobs in Deutschland',
    description: 'Landingpage für indische IT-Profis. Erklärt Blue Card, Matching-Score, Arbeitgeberprofil.',
    targetCountry: 'Indien',
    targetSector: 'IT',
    audience: 'candidate',
    priority: 'high',
    seoKeywords: ['IT jobs Germany India', 'Software engineer Germany visa', 'India Germany tech job'],
    complianceNote: 'Keine Arbeitsvertragsgarantien. Matchingplattform klar erklären.',
    complianceStatus: 'safe',
  },
  {
    type: 'landing_page',
    title: 'Pflegekräfte aus Marokko — Arbeiten in Deutschland',
    description: 'Arabisch/Französisch-sprachige Landingpage für marokkanische Pflegekräfte.',
    targetCountry: 'Marokko',
    targetSector: 'Pflege',
    audience: 'candidate',
    priority: 'high',
    seoKeywords: ['infirmier Maroc Allemagne travail', 'Pflegekraft Marokko Deutschland', 'Morocco nurse Germany job'],
    complianceNote: 'Mehrsprachig anlegen. Kein Versprechen über Anerkennungsdauer.',
    complianceStatus: 'safe',
  },
  // === Employer Landingpages ===
  {
    type: 'employer_page',
    title: 'Arbeitgeber — Pflegepersonal international finden',
    description: 'Dedizierte Seite für Pflegeheime die international rekrutieren möchten. Erklärt Triple Win, Matching-Score, Pilotprogramm.',
    targetSector: 'Pflege',
    audience: 'employer',
    priority: 'high',
    seoKeywords: ['Pflegepersonal international rekrutieren', 'Pflegeheim internationales Personal', 'Triple Win Alternative'],
    complianceNote: 'Kein automatischer Kontakt. Klares CTA: Arbeitgeberkonto erstellen.',
    complianceStatus: 'safe',
  },
  {
    type: 'employer_page',
    title: 'IT-Unternehmen — Internationale Entwickler finden',
    description: 'Landingpage für IT-Arbeitgeber. Erklärt Blue Card, Matching, Self-Registration.',
    targetSector: 'IT',
    audience: 'employer',
    priority: 'high',
    seoKeywords: ['internationale Entwickler finden Deutschland', 'IT Fachkräfte international', 'Developer recruitment international'],
    complianceNote: 'Kein Cold-Outreach. Inbound-Modell: Arbeitgeber kommen zu uns.',
    complianceStatus: 'safe',
  },
  // === Country/Language Pages ===
  {
    type: 'country_page',
    title: 'CorridorWork auf Englisch — Work in Germany',
    description: 'Englischsprachige Hauptseite für internationale Kandidaten.',
    audience: 'candidate',
    priority: 'high',
    seoKeywords: ['work in Germany international', 'Germany job platform', 'find work Germany skilled worker'],
    complianceNote: 'Klar stellen: Matching-Plattform, kein Jobangebot direkt.',
    complianceStatus: 'safe',
  },
  {
    type: 'country_page',
    title: 'CorridorWork auf Arabisch — العمل في ألمانيا',
    description: 'Arabischsprachige Seite für Kandidaten aus MENA-Region.',
    audience: 'candidate',
    priority: 'medium',
    seoKeywords: ['العمل في ألمانيا', 'وظائف في المانيا', 'هجرة ألمانيا مهنية'],
    complianceNote: 'Übersetzung durch Muttersprachler. Kein falsches Jobversprechen.',
    complianceStatus: 'safe',
  },
  // === SEO Content ===
  {
    type: 'seo_content',
    title: 'Fachkräfteeinwanderungsgesetz 2024 — Was ändert sich?',
    description: 'SEO-Blogartikel über das neue Einwanderungsgesetz. Bindet Arbeitgeber als Leser an.',
    audience: 'both',
    priority: 'medium',
    seoKeywords: ['Fachkräfteeinwanderungsgesetz 2024', 'internationales Recruiting Deutschland neu', 'Fachkräftemangel Lösung'],
    complianceNote: 'Keine Rechtsberatung. Hinweis auf qualifizierte Beratung empfehlen.',
    complianceStatus: 'safe',
  },
  {
    type: 'seo_content',
    title: 'Wie funktioniert Triple Win? — Pflegekräfte aus Asien',
    description: 'Erklärender Artikel über das Triple-Win-Programm. Zieht Arbeitgeber und Kandidaten.',
    audience: 'both',
    priority: 'medium',
    seoKeywords: ['Triple Win Programm Pflege', 'GIZ Pflegekräfte Philippinen', 'Triple Win Alternative Pflege'],
    complianceNote: 'Faktenbasiert, keine Partnerschaft mit GIZ vorspiegeln.',
    complianceStatus: 'safe',
  },
  // === Corridor Pages ===
  {
    type: 'corridor_page',
    title: 'Korridor Philippinen → Deutschland',
    description: 'Dedizierte Seite die den Korridor erklärt — für Kandidaten UND Arbeitgeber.',
    targetCountry: 'Philippinen',
    audience: 'both',
    priority: 'high',
    seoKeywords: ['Philippine nurses Germany corridor', 'Pflegekräfte Philippinen Deutschland Weg', 'Filipino healthcare Germany'],
    complianceNote: 'Kein Versprechen über Prozessdauer. Realistische Erwartungen setzen.',
    complianceStatus: 'safe',
  },
]

// ── Hauptfunktionen ───────────────────────────────────────────────────────────

/**
 * Gibt alle Candidate Magnet Assets zurück.
 */
export function getCandidateMagnetAssets(): CandidateMagnetAsset[] {
  return CANDIDATE_ASSETS
    .sort((a, b) => {
      const p: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
      return p[a.priority] - p[b.priority]
    })
}

/**
 * Gibt Top-N Assets zurück.
 */
export function getTopCandidateAssets(n = 5): CandidateMagnetAsset[] {
  return getCandidateMagnetAssets().slice(0, n)
}

/**
 * Gibt Assets nach Zielgruppe gefiltert zurück.
 */
export function getAssetsByAudience(audience: 'employer' | 'candidate' | 'both'): CandidateMagnetAsset[] {
  return getCandidateMagnetAssets().filter(
    a => a.audience === audience || a.audience === 'both'
  )
}

/**
 * Gibt Assets nach Typ gefiltert zurück.
 */
export function getAssetsByType(type: CandidateMagnetAsset['type']): CandidateMagnetAsset[] {
  return getCandidateMagnetAssets().filter(a => a.type === type)
}

/**
 * Compliance-Zusammenfassung.
 */
export function getComplianceSummary(): { safe: number; needs_review: number; blocked: number } {
  const assets = getCandidateMagnetAssets()
  return {
    safe:         assets.filter(a => a.complianceStatus === 'safe').length,
    needs_review: assets.filter(a => a.complianceStatus === 'needs_review').length,
    blocked:      assets.filter(a => a.complianceStatus === 'blocked').length,
  }
}
