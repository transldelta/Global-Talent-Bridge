/**
 * lib/seo-indexing.ts
 *
 * SEO Indexing & Visibility Control Layer — Statische Konfiguration
 *
 * Reine Datenkonstanten — keine DB-Calls, keine externen APIs, kein Scraping.
 * Dient als Single-Source-of-Truth für /admin/seo-indexing-control.
 *
 * Safety: Kein Google API, kein Scraping, keine externen Dienste,
 *         kein E-Mail-Versand, kein Stripe.
 */

// ── Typen ─────────────────────────────────────────────────────────────────────

export type IndexabilityStatus = 'indexable' | 'blocked' | 'noindex' | 'unknown'
export type PagePriority = 'high' | 'medium' | 'low'

export type SeoPageEntry = {
  url:           string
  path:          string
  label:         string
  group:         'revenue' | 'industry' | 'corridor' | 'solutions' | 'static'
  priority:      PagePriority
  sitemapEntry:  boolean
  robotsAllowed: boolean
  indexability:  IndexabilityStatus
  canonicalSet:  boolean
  metaNote:      string
}

export type SeoSystemStatus = {
  totalPublicPages:  number
  indexablePages:    number
  sitemapUrl:        string
  robotsUrl:         string
  searchConsoleUrl:  string
  sitemapReady:      boolean
  robotsReady:       boolean
  brand:             'CorridorWork'
  noGoogleApiCalls:  boolean
  noScraping:        boolean
  noEmailSent:       boolean
  noStripe:          boolean
  lastCheckSource:   'static_config'
  phase:             1
}

// ── Alle öffentlichen SEO-/Revenue-Seiten ────────────────────────────────────

export const SEO_PAGE_ENTRIES: SeoPageEntry[] = [
  // Revenue Pages
  {
    url:           'https://corridorwork.com/',
    path:          '/',
    label:         'Homepage',
    group:         'static',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Hauptseite — höchste Priorität für Indexierung',
  },
  {
    url:           'https://corridorwork.com/demo',
    path:          '/demo',
    label:         'Demo',
    group:         'revenue',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Hohe Relevanz für organischen Traffic — erste Indexierung empfohlen',
  },
  {
    url:           'https://corridorwork.com/pilot/employers',
    path:          '/pilot/employers',
    label:         'Employer Pilot',
    group:         'revenue',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Primäre Revenue-Page — erste Indexierung empfohlen',
  },
  {
    url:           'https://corridorwork.com/pilot/agencies',
    path:          '/pilot/agencies',
    label:         'Agentur Pilot',
    group:         'revenue',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Sekundäre Revenue-Page — hohe Priorität',
  },
  {
    url:           'https://corridorwork.com/market-intelligence',
    path:          '/market-intelligence',
    label:         'Market Intelligence',
    group:         'revenue',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'B2B-Zielgruppe — hohe Relevanz',
  },
  {
    url:           'https://corridorwork.com/solutions/recruiting-agencies',
    path:          '/solutions/recruiting-agencies',
    label:         'Lösungen für Agenturen',
    group:         'solutions',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'White-Label Partner-Seite — erste Indexierung empfohlen',
  },
  // Industry Pages
  {
    url:           'https://corridorwork.com/industries/care',
    path:          '/industries/care',
    label:         'Branche: Pflege',
    group:         'industry',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Stärkste Nachfrage-Branche — erste Indexierung empfohlen',
  },
  {
    url:           'https://corridorwork.com/industries/it',
    path:          '/industries/it',
    label:         'Branche: IT',
    group:         'industry',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Hohe Suchvolumen für IT-Recruiting Keywords',
  },
  {
    url:           'https://corridorwork.com/industries/hospitality',
    path:          '/industries/hospitality',
    label:         'Branche: Gastronomie',
    group:         'industry',
    priority:      'medium',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Mittlere Priorität — saisonale Nachfrage',
  },
  {
    url:           'https://corridorwork.com/industries/logistics',
    path:          '/industries/logistics',
    label:         'Branche: Logistik',
    group:         'industry',
    priority:      'medium',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Mittlere Priorität — wachsende Nachfrage',
  },
  {
    url:           'https://corridorwork.com/industries/construction',
    path:          '/industries/construction',
    label:         'Branche: Bau & Handwerk',
    group:         'industry',
    priority:      'medium',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Mittlere Priorität — Fachkräftemangel im Bau wächst',
  },
  // Corridor Pages
  {
    url:           'https://corridorwork.com/corridors/philippines-care',
    path:          '/corridors/philippines-care',
    label:         '🇵🇭→🇩🇪 Philippinen → Deutschland',
    group:         'corridor',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Score 95 — aktivster Pflege-Korridor, hohe Suchrelevanz',
  },
  {
    url:           'https://corridorwork.com/corridors/india-uk',
    path:          '/corridors/india-uk',
    label:         '🇮🇳→🇬🇧 Indien → UK / Deutschland',
    group:         'corridor',
    priority:      'high',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Score 91 — stärkster Tech-Korridor',
  },
  {
    url:           'https://corridorwork.com/corridors/morocco-germany',
    path:          '/corridors/morocco-germany',
    label:         '🇲🇦→🇩🇪 Marokko → Deutschland',
    group:         'corridor',
    priority:      'medium',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Score 84 — breit aufgestellter Korridor',
  },
  {
    url:           'https://corridorwork.com/corridors/nigeria-tech',
    path:          '/corridors/nigeria-tech',
    label:         '🇳🇬→🇩🇪 Nigeria → Deutschland / UK',
    group:         'corridor',
    priority:      'medium',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Score 82 — wachsendes Tech-Ökosystem',
  },
  {
    url:           'https://corridorwork.com/corridors/tunisia-france',
    path:          '/corridors/tunisia-france',
    label:         '🇹🇳→🇫🇷 Tunesien → Frankreich',
    group:         'corridor',
    priority:      'medium',
    sitemapEntry:  true,
    robotsAllowed: true,
    indexability:  'indexable',
    canonicalSet:  true,
    metaNote:      'Score 79 — frankophoner Korridor im Aufbau',
  },
]

// ── Top-URLs für erste Indexierung ───────────────────────────────────────────

export const TOP_PRIORITY_PATHS_FOR_INDEXING: string[] = [
  '/demo',
  '/pilot/employers',
  '/pilot/agencies',
  '/market-intelligence',
  '/industries/care',
  '/solutions/recruiting-agencies',
  '/corridors/philippines-care',
  '/industries/it',
]

// ── Google Search Console Anleitung ──────────────────────────────────────────

export const GOOGLE_SEARCH_CONSOLE_GUIDE = {
  step1: {
    title: 'Google Search Console öffnen',
    url:   'https://search.google.com/search-console',
    text:  'Öffne search.google.com/search-console. Google-Konto erforderlich.',
  },
  step2: {
    title: 'Property hinzufügen',
    text:  'Klicke "+ Property hinzufügen". Wähle "Domain" und gib "corridorwork.com" ein.',
    value: 'corridorwork.com',
  },
  step3: {
    title: 'Domain verifizieren',
    text:  'Verifizierung über DNS-TXT-Eintrag (bei Vercel/DNS-Anbieter). Vercel unterstützt das direkt.',
  },
  step4: {
    title: 'Sitemap einreichen',
    text:  'Öffne "Sitemaps" im linken Menü. Gib die Sitemap-URL ein und klicke "Einreichen".',
    sitemapUrl: 'https://corridorwork.com/sitemap.xml',
  },
  step5: {
    title: 'Top-URLs zur Indexierung anfordern',
    text:  'Nutze "URL-Prüfung" für jede dieser URLs. Klicke "Indexierung beantragen".',
    urls:  TOP_PRIORITY_PATHS_FOR_INDEXING.slice(0, 4),
  },
  importantNote: 'Keine automatische Einreichung über API. Alle Schritte sind manuell und kostenlos.',
} as const

// ── SEO System Status ─────────────────────────────────────────────────────────

export const SEO_SYSTEM_STATUS: SeoSystemStatus = {
  totalPublicPages:  SEO_PAGE_ENTRIES.length,
  indexablePages:    SEO_PAGE_ENTRIES.filter(p => p.indexability === 'indexable').length,
  sitemapUrl:        'https://corridorwork.com/sitemap.xml',
  robotsUrl:         'https://corridorwork.com/robots.txt',
  searchConsoleUrl:  'https://search.google.com/search-console',
  sitemapReady:      true,
  robotsReady:       true,
  brand:             'CorridorWork',
  noGoogleApiCalls:  true,
  noScraping:        true,
  noEmailSent:       true,
  noStripe:          true,
  lastCheckSource:   'static_config',
  phase:             1,
} as const

// ── Daily Runner SEO Check ────────────────────────────────────────────────────
// Reine Berechnung — kein I/O, kein externer Call

export function generateSeoCheckItems(): string[] {
  const indexable = SEO_PAGE_ENTRIES.filter(p => p.indexability === 'indexable').length
  const total     = SEO_PAGE_ENTRIES.length
  return [
    `SEO visibility check prepared: ${indexable}/${total} Seiten indexierbar`,
    `Sitemap vorhanden: ${SEO_SYSTEM_STATUS.sitemapUrl}`,
    `robots.txt vorhanden: ${SEO_SYSTEM_STATUS.robotsUrl}`,
    `Top-Priorität Seiten: ${TOP_PRIORITY_PATHS_FOR_INDEXING.length} für Indexierung markiert`,
    `Kein Google API Call — manuelle Search Console Einreichung erforderlich`,
  ]
}
