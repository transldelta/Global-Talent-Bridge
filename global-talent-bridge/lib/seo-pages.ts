/**
 * lib/seo-pages.ts
 *
 * SEO Revenue Expansion — Page Configs
 *
 * Enthält reine Datenkonstanten für alle öffentlichen SEO-/Revenue-Landingpages.
 * Keine DB-Calls, keine Seiteneffekte — vollständig testbar.
 *
 * Safety: Kein Stripe, kein Versand, kein Scraping, keine Jobgarantie,
 *         keine Visa-Garantie.
 */

// ── Typen ─────────────────────────────────────────────────────────────────────

export type IndustrySlug = 'care' | 'hospitality' | 'logistics' | 'it' | 'construction'
export type CorridorSlug =
  | 'morocco-germany'
  | 'tunisia-france'
  | 'india-uk'
  | 'philippines-care'
  | 'nigeria-tech'

export type IndustryConfig = {
  slug: IndustrySlug
  name: string
  emoji: string
  colorClass: string
  bgClass: string
  borderClass: string
  tagline: string
  description: string
  targetEmployers: string
  keyPoints: Array<{ icon: string; title: string; text: string }>
  corridors: string[]
  metaTitle: string
  metaDescription: string
}

export type CorridorConfig = {
  slug: CorridorSlug
  originCountry: string
  destinationCountry: string
  originFlag: string
  destinationFlag: string
  headline: string
  description: string
  sectors: string[]
  matchingLogic: string
  corridorScore: number
  complianceNote: string
  metaTitle: string
  metaDescription: string
}

// ── Branchen (Industry) Configs ───────────────────────────────────────────────

export const INDUSTRY_CONFIGS: Record<IndustrySlug, IndustryConfig> = {
  care: {
    slug:           'care',
    name:           'Pflege & Gesundheit',
    emoji:          '🏥',
    colorClass:     'text-blue-400',
    bgClass:        'bg-blue-900/30',
    borderClass:    'border-blue-700/50',
    tagline:        'Qualifiziertes Pflegepersonal aus geprüften internationalen Korridoren.',
    description:
      'Pflegebetriebe und Krankenhäuser finden qualifizierte Pflegefachkräfte über strukturiertes internationales Talent-Matching. Kein automatischer Versand, kein Risiko, kein Abo.',
    targetEmployers: 'Pflegeheime, Krankenhäuser, ambulante Pflegedienste, Rehakliniken',
    keyPoints: [
      { icon: '🎯', title: 'Korridor-Matching',   text: 'Philippinen, Marokko, Tunesien, Indien — geprüfte Korridore mit Pflegefokus.' },
      { icon: '📋', title: 'Strukturierte Profile', text: 'Erfahrungsjahre, Sprachlevel, Pflegespezialisierung im Kandidatenprofil.' },
      { icon: '🛡️', title: 'Compliance First',     text: 'Kein automatischer Kandidatenkontakt. Manuell geprüft. DSGVO-konform.' },
      { icon: '🆓', title: 'Pilot kostenlos',       text: 'Kein Abo, keine automatische Zahlung. Pilot in Phase 1 kostenlos.' },
    ],
    corridors: ['Philippinen → Deutschland', 'Marokko → Deutschland', 'Tunesien → Deutschland', 'Indien → Deutschland'],
    metaTitle:       'Internationale Pflegekräfte finden | CorridorWork',
    metaDescription: 'Pflegebetriebe gewinnen internationale Fachkräfte über strukturiertes Talent-Matching. Kostenloser Pilot — kein Abo, keine Jobgarantie, DSGVO-konform.',
  },

  hospitality: {
    slug:           'hospitality',
    name:           'Gastronomie & Hotellerie',
    emoji:          '🍽️',
    colorClass:     'text-orange-400',
    bgClass:        'bg-orange-900/30',
    borderClass:    'border-orange-700/50',
    tagline:        'Servicepersonal und Küchenfachkräfte aus internationalen Talent-Korridoren.',
    description:
      'Hotels, Restaurants und Eventbetriebe finden qualifiziertes internationales Servicepersonal über transparentes Matching. Keine Garantien — ehrliches Pilot-Programm.',
    targetEmployers: 'Hotels, Restaurants, Caterer, Eventbetriebe, Tourismusunternehmen',
    keyPoints: [
      { icon: '🌍', title: 'Internationale Korridore', text: 'Marokko, Tunesien, Brasilien — Korridore mit Gastronomie-Fachkräften.' },
      { icon: '🗣️', title: 'Sprachfokus',              text: 'Kandidaten mit Deutsch- und Englischkenntnissen für Gastgewerbe.' },
      { icon: '⚡', title: 'Schnelle Prüfung',          text: 'Anfragen werden manuell geprüft — kein automatischer Prozess.' },
      { icon: '🆓', title: 'Pilot kostenlos',            text: 'Phase 1 ist kostenlos. Keine automatische Zahlung.' },
    ],
    corridors: ['Marokko → Deutschland / Frankreich', 'Tunesien → Deutschland', 'Brasilien → Deutschland / Portugal'],
    metaTitle:       'Internationale Gastronomie-Fachkräfte | CorridorWork',
    metaDescription: 'Hotels und Restaurants gewinnen internationales Servicepersonal über Talent-Matching. Kostenloser Pilot für Gastronomie-Betriebe — keine Jobgarantie.',
  },

  logistics: {
    slug:           'logistics',
    name:           'Logistik & Transport',
    emoji:          '🚚',
    colorClass:     'text-amber-400',
    bgClass:        'bg-amber-900/30',
    borderClass:    'border-amber-700/50',
    tagline:        'Logistikfachkräfte und Fahrer aus internationalen Talent-Korridoren.',
    description:
      'Logistikunternehmen und Spediteure finden qualifizierte internationale Fachkräfte für Lager, Transport und Lieferkette. Strukturiertes Matching, manuelle Prüfung.',
    targetEmployers: 'Speditionen, Lagerunternehmen, E-Commerce-Logistik, Kurierdienste',
    keyPoints: [
      { icon: '📦', title: 'Lager & Transport',   text: 'Lagerfachkräfte, Staplerfahrer, LKW-Fahrer aus geprüften Korridoren.' },
      { icon: '🔑', title: 'Qualifikations-Match', text: 'Führerscheinklassen, Zertifikate, Erfahrungsjahre im Profil abbildbar.' },
      { icon: '📋', title: 'Compliance',            text: 'Kein automatischer Kontakt. Kein Outreach ohne Freigabe.' },
      { icon: '🆓', title: 'Pilot kostenlos',       text: 'Kostenlos starten. Keine automatische Zahlung in Phase 1.' },
    ],
    corridors: ['Marokko → Deutschland', 'Georgien → Deutschland', 'Serbien → Deutschland / Österreich'],
    metaTitle:       'Internationale Logistik-Fachkräfte finden | CorridorWork',
    metaDescription: 'Logistikunternehmen gewinnen internationale Lagerfachkräfte und Fahrer. Kostenloser Pilot — strukturiertes Matching, keine Jobgarantie.',
  },

  it: {
    slug:           'it',
    name:           'IT & Technologie',
    emoji:          '💻',
    colorClass:     'text-purple-400',
    bgClass:        'bg-purple-900/30',
    borderClass:    'border-purple-700/50',
    tagline:        'Entwickler, DevOps und IT-Fachkräfte aus globalen Tech-Korridoren.',
    description:
      'Tech-Unternehmen und Startups finden qualifizierte internationale Entwickler und IT-Fachkräfte über transparentes Skill-Matching. Kein Headhunting — strukturierte Inbound-Pipeline.',
    targetEmployers: 'Tech-Startups, Software-Unternehmen, IT-Abteilungen, MSP',
    keyPoints: [
      { icon: '🖥️', title: 'Tech-Korridore',      text: 'Indien, Nigeria, Serbien, Georgien — Top-Tech-Korridore.' },
      { icon: '⚙️', title: 'Skill-basiertes Matching', text: 'Stack, Erfahrungsjahre, englische Sprachkenntnisse im Profil.' },
      { icon: '🌐', title: 'Remote-freundlich',   text: 'Für Remote- und Hybrid-Positionen geeignet.' },
      { icon: '🆓', title: 'Pilot kostenlos',      text: 'Kostenlos testen. Keine automatische Zahlung in Phase 1.' },
    ],
    corridors: ['Indien → Deutschland / UK', 'Nigeria → Deutschland / UK', 'Serbien → Deutschland', 'Georgien → Deutschland'],
    metaTitle:       'Internationale IT-Fachkräfte & Entwickler | CorridorWork',
    metaDescription: 'Tech-Unternehmen finden internationale Entwickler und IT-Fachkräfte. Strukturiertes Talent-Matching — kostenloser Pilot, keine Jobgarantie.',
  },

  construction: {
    slug:           'construction',
    name:           'Bau & Handwerk',
    emoji:          '🏗️',
    colorClass:     'text-stone-400',
    bgClass:        'bg-stone-800/50',
    borderClass:    'border-stone-600/50',
    tagline:        'Baufachkräfte und Handwerker aus geprüften internationalen Korridoren.',
    description:
      'Bauunternehmen und Handwerksbetriebe finden qualifizierte internationale Fachkräfte für Hochbau, Tiefbau und Handwerk. Pilot kostenlos — manuelle Prüfung.',
    targetEmployers: 'Bauunternehmen, Handwerksbetriebe, Elektriker, Installateure, Zimmerer',
    keyPoints: [
      { icon: '🔨', title: 'Handwerk-Korridore', text: 'Bosnien, Serbien, Marokko — Korridore mit Bau- und Handwerksfokus.' },
      { icon: '📐', title: 'Qualifikations-Matching', text: 'Ausbildung, Zertifikate, Erfahrungsjahre im Kandiatenprofil.' },
      { icon: '🛡️', title: 'Compliance',           text: 'Kein automatischer Kontakt. Vollständig manuell kontrolliert.' },
      { icon: '🆓', title: 'Pilot kostenlos',       text: 'Phase 1 kostenlos. Keine automatische Zahlung.' },
    ],
    corridors: ['Bosnien → Deutschland / Österreich', 'Serbien → Deutschland', 'Marokko → Deutschland'],
    metaTitle:       'Internationale Bau- und Handwerksfachkräfte | CorridorWork',
    metaDescription: 'Bauunternehmen finden internationale Handwerker und Baufachkräfte. Kostenloser Pilot — strukturiertes Matching, keine Jobgarantie.',
  },
}

// ── Korridor-Configs ──────────────────────────────────────────────────────────

export const CORRIDOR_CONFIGS: Record<CorridorSlug, CorridorConfig> = {
  'morocco-germany': {
    slug:               'morocco-germany',
    originCountry:      'Marokko',
    destinationCountry: 'Deutschland',
    originFlag:         '🇲🇦',
    destinationFlag:    '🇩🇪',
    headline:           'Marokko → Deutschland',
    description:
      'Der Korridor Marokko → Deutschland ist einer der aktivsten Arbeitsmigrations-Korridore in Europa. Qualifizierte Fachkräfte aus Marokko suchen Möglichkeiten in Pflege, Gastronomie, Logistik und Bau.',
    sectors:           ['Pflege & Gesundheit', 'Gastronomie & Hotellerie', 'Logistik', 'Bau & Handwerk'],
    matchingLogic:
      'Kandidaten aus Marokko werden anhand von Sprachlevel (Deutsch A2-B2, Französisch, Englisch), Erfahrungsjahren und Branche mit offenen Stellen verglichen.',
    corridorScore:     84,
    complianceNote:
      'Kein Visa-Service, keine Visa-Beratung, keine Jobgarantie. CorridorWork ist ein Matching-Dienst. Visa-Prozesse liegen ausschließlich bei den zuständigen Behörden.',
    metaTitle:       'Marokko → Deutschland Talent-Korridor | CorridorWork',
    metaDescription: 'Internationales Talent-Matching für den Korridor Marokko → Deutschland. Pflege, Gastronomie, Logistik, Bau — keine Visa-Garantie, kein automatischer Versand.',
  },

  'tunisia-france': {
    slug:               'tunisia-france',
    originCountry:      'Tunesien',
    destinationCountry: 'Frankreich / Deutschland',
    originFlag:         '🇹🇳',
    destinationFlag:    '🇫🇷',
    headline:           'Tunesien → Frankreich / Deutschland',
    description:
      'Der Korridor Tunesien → Frankreich / Deutschland verbindet frankophon qualifizierte Fachkräfte mit europäischen Arbeitgebern. Stark in Gastronomie, Pflege und IT.',
    sectors:           ['Gastronomie & Hotellerie', 'Pflege & Gesundheit', 'IT & Technologie', 'Produktion'],
    matchingLogic:
      'Kandidaten aus Tunesien werden nach Sprachlevel (Französisch, Deutsch, Englisch), Branche und Erfahrung gematcht. Frankophone Profile für FR-Arbeitgeber priorisiert.',
    corridorScore:     79,
    complianceNote:
      'Kein Visa-Service. Keine Jobgarantie. CorridorWork stellt eine Matching-Plattform bereit — keine Arbeitsvermittlung.',
    metaTitle:       'Tunesien → Frankreich / Deutschland Korridor | CorridorWork',
    metaDescription: 'Talent-Matching für Tunesien → Frankreich und Deutschland. Frankophone Fachkräfte für Gastronomie und Pflege — keine Visa-Garantie.',
  },

  'india-uk': {
    slug:               'india-uk',
    originCountry:      'Indien',
    destinationCountry: 'UK / Deutschland',
    originFlag:         '🇮🇳',
    destinationFlag:    '🇬🇧',
    headline:           'Indien → UK / Deutschland',
    description:
      'Der Korridor Indien → UK / Deutschland ist einer der stärksten globalen Tech-Korridore. Qualifizierte IT-Fachkräfte, Ingenieure und Pflegepersonal aus Indien.',
    sectors:           ['IT & Technologie', 'Pflege & Gesundheit', 'Engineering', 'Produktion'],
    matchingLogic:
      'Kandidaten aus Indien werden nach technischen Skills (Stack, Zertifikate), Sprachlevel (Englisch C1+, Deutsch B1+) und Erfahrung gematcht. Hohe Englischkompetenz.',
    corridorScore:     91,
    complianceNote:
      'Kein Visa-Service. Keine Jobgarantie. Alle Visa-Verfahren liegen bei UK Visas & Immigration bzw. deutschen Ausländerbehörden.',
    metaTitle:       'Indien → UK / Deutschland IT-Korridor | CorridorWork',
    metaDescription: 'Talent-Matching für den Korridor Indien → UK und Deutschland. IT-Fachkräfte, Entwickler, Ingenieure — keine Visa-Garantie, kein automatischer Versand.',
  },

  'philippines-care': {
    slug:               'philippines-care',
    originCountry:      'Philippinen',
    destinationCountry: 'Deutschland',
    originFlag:         '🇵🇭',
    destinationFlag:    '🇩🇪',
    headline:           'Philippinen → Deutschland (Pflege)',
    description:
      'Der Korridor Philippinen → Deutschland ist einer der etabliertesten Pflegekräfte-Korridore weltweit. Philippinische Pflegefachkräfte sind international hochgeschätzt — strukturiertes Matching vereinfacht die Suche.',
    sectors:           ['Pflege & Gesundheit', 'Gesundheitswesen', 'Altenpflege', 'Krankenpflege'],
    matchingLogic:
      'Kandidaten aus den Philippinen werden nach Pflegeausbildung (RN, BSN, Pflegefachkraft), Deutschkenntnissen (A1-B2) und Erfahrungsjahren gematcht. Score-basiertes Ranking.',
    corridorScore:     95,
    complianceNote:
      'Kein Visa-Service. Keine Jobgarantie. Pflegekräfte benötigen Berufsanerkennungsverfahren in Deutschland — dieser Prozess liegt außerhalb von CorridorWork.',
    metaTitle:       'Philippinen → Deutschland Pflegekräfte | CorridorWork',
    metaDescription: 'Talent-Matching für Pflegekräfte aus den Philippinen nach Deutschland. Korridor-Score 95 — keine Visa-Garantie, kein automatischer Versand.',
  },

  'nigeria-tech': {
    slug:               'nigeria-tech',
    originCountry:      'Nigeria',
    destinationCountry: 'Deutschland / UK',
    originFlag:         '🇳🇬',
    destinationFlag:    '🇩🇪',
    headline:           'Nigeria → Deutschland / UK (Tech)',
    description:
      'Nigeria ist Afrikas größtes Tech-Talent-Ökosystem. Qualifizierte nigerianische Entwickler, Data Scientists und IT-Fachkräfte suchen europäische Chancen in Deutschland und UK.',
    sectors:           ['IT & Technologie', 'Software-Entwicklung', 'Data Science', 'Cloud Engineering'],
    matchingLogic:
      'Kandidaten aus Nigeria werden nach Tech-Skills (JavaScript, Python, Cloud, DevOps), Englischlevel (C1+) und Remote-Eignung gematcht. Starke englische Sprachkompetenz.',
    corridorScore:     82,
    complianceNote:
      'Kein Visa-Service. Keine Jobgarantie. EU Blue Card und UK Skilled Worker Visa liegen bei den zuständigen Behörden — nicht bei CorridorWork.',
    metaTitle:       'Nigeria → Deutschland / UK Tech-Korridor | CorridorWork',
    metaDescription: 'Tech-Talent-Matching für den Korridor Nigeria → Deutschland und UK. Entwickler, Data Scientists, IT-Fachkräfte — keine Visa-Garantie.',
  },
}

// ── Öffentliche SEO-Seiten Übersicht ─────────────────────────────────────────

export const INDUSTRY_SLUGS: IndustrySlug[] = ['care', 'hospitality', 'logistics', 'it', 'construction']
export const CORRIDOR_SLUGS: CorridorSlug[] = [
  'morocco-germany',
  'tunisia-france',
  'india-uk',
  'philippines-care',
  'nigeria-tech',
]

export const SEO_REVENUE_PAGES = {
  industryPages:     INDUSTRY_SLUGS.map(s => `/industries/${s}`),
  corridorPages:     CORRIDOR_SLUGS.map(s => `/corridors/${s}`),
  solutionPages:     ['/solutions/recruiting-agencies'],
  demoPage:          '/demo',
  totalNewPages:     INDUSTRY_SLUGS.length + CORRIDOR_SLUGS.length + 1 + 1, // 12
  baseUrl:           'https://corridorwork.com',
  noJobGuarantee:    true,
  noVisaGuarantee:   true,
  noEmailSent:       true,
  noAutoOutreach:    true,
  noScraping:        true,
  noPayment:         true,
  brand:             'CorridorWork',
} as const

export const ALL_SEO_PAGE_PATHS = [
  ...SEO_REVENUE_PAGES.industryPages,
  ...SEO_REVENUE_PAGES.corridorPages,
  ...SEO_REVENUE_PAGES.solutionPages,
  SEO_REVENUE_PAGES.demoPage,
]
