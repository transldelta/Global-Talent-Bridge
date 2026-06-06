/**
 * lib/cwo-agent/inbound-growth.ts
 *
 * Inbound Growth Department
 *
 * Bereitet sichere Wachstumskanäle vor:
 * Landingpage-Plan, SEO-Plan, Content-Kalender, Self-Registration,
 * Kandidaten-Selbstregistrierung, Arbeitgeber-Selbstregistrierung.
 * KEIN Spam. KEIN Bulk-Outreach. KEIN automatischer E-Mail-Versand.
 * Autonomy Level: A3/A4 (automatisch Pläne + Inhalte vorbereiten)
 */
import type { Priority, ComplianceStatus } from './types'

// ── Types ─────────────────────────────────────────────────────────────────────

export type InboundChannel = {
  id:               string
  channel:          string
  channelIcon:      string
  description:      string
  priority:         Priority
  estimatedReach:   string
  effort:           'low' | 'medium' | 'high'
  timeToFirstLead:  string
  complianceStatus: ComplianceStatus
  complianceNote:   string
  actionItems:      string[]
  noEmailSent:      true
  noAutoOutreach:   true
}

export type ContentCalendarItem = {
  week:         number
  title:        string
  type:         'blog' | 'landing_page' | 'social_post' | 'email_template' | 'corridor_page'
  targetAudience: 'employer' | 'candidate' | 'both'
  seoKeywords:  string[]
  status:       'planned' | 'in_progress' | 'ready'
  priority:     Priority
  complianceNote: string
}

export type RegistrationFunnel = {
  id:               string
  funnelName:       string
  audience:         'employer' | 'candidate'
  steps:            string[]
  currentStatus:    'planned' | 'active' | 'blocked'
  blockedReason?:   string
  complianceStatus: ComplianceStatus
  noEmailSent:      true
}

export type SEOPlan = {
  cluster:      string
  keywords:     string[]
  pageType:     string
  estimatedMonthlySearches: string
  competitionLevel: 'low' | 'medium' | 'high'
  priority:     Priority
  complianceNote: string
}

// ── Inbound Channels ──────────────────────────────────────────────────────────

const INBOUND_CHANNELS: InboundChannel[] = [
  {
    id: 'seo_organic',
    channel: 'Organische Suche (SEO)',
    channelIcon: '🔍',
    description: 'Kandidaten und Arbeitgeber finden CorridorWork über Google — ohne Werbung, ohne Outreach.',
    priority: 'high',
    estimatedReach: '500–5.000 Besucher/Monat nach 3 Monaten',
    effort: 'medium',
    timeToFirstLead: '4–8 Wochen',
    complianceStatus: 'safe',
    complianceNote: 'Vollständig legal. Kein personenbezogener Outreach.',
    actionItems: [
      'Corridor-Landingpages erstellen (Philippinen→DE, Indien→DE, Marokko→DE)',
      'Blog-Artikel: Fachkräfteeinwanderungsgesetz 2024, Triple Win Alternativen',
      'Meta-Tags und structured data implementieren',
      'Sitemap.xml für alle neuen Seiten',
    ],
    noEmailSent: true,
    noAutoOutreach: true,
  },
  {
    id: 'employer_self_registration',
    channel: 'Arbeitgeber-Selbstregistrierung',
    channelIcon: '🏢',
    description: 'Arbeitgeber registrieren sich selbst über ein öffentliches Formular — Inbound, kein Cold-Outreach.',
    priority: 'high',
    estimatedReach: '5–30 Arbeitgeber/Monat im Piloten',
    effort: 'low',
    timeToFirstLead: '1–2 Wochen nach Launch',
    complianceStatus: 'safe',
    complianceNote: 'Selbstregistrierung = klare Einwilligung. DSGVO-konform.',
    actionItems: [
      'Öffentliche /employer/register Seite live stellen',
      'Klares Wertversprechen auf der Seite formulieren',
      'Bestätigungs-E-Mail mit Opt-In (nur nach Einwilligung)',
      'Dashboard-Onboarding nach Registrierung',
    ],
    noEmailSent: true,
    noAutoOutreach: true,
  },
  {
    id: 'candidate_self_registration',
    channel: 'Kandidaten-Selbstregistrierung',
    channelIcon: '👤',
    description: 'Internationale Fachkräfte registrieren sich selbst — über Landingpages oder Direct Links.',
    priority: 'high',
    estimatedReach: '20–200 Kandidaten/Monat nach SEO-Ramp',
    effort: 'low',
    timeToFirstLead: '1–3 Wochen nach Landingpage-Launch',
    complianceStatus: 'safe',
    complianceNote: 'Klare Einwilligung via Registrierungsformular. DSGVO Art. 6 Abs. 1a.',
    actionItems: [
      'Kandidaten-Registrierungsseite in DE + EN + AR',
      'Klare Erklärung: was CorridorWork ist, was nicht',
      'Kein Versprechen: kein "garantierter Job", kein "sicheres Visum"',
      'Datenschutzerklärung in allen Sprachen verlinken',
    ],
    noEmailSent: true,
    noAutoOutreach: true,
  },
  {
    id: 'partner_referrals',
    channel: 'Partnernetzwerk & Empfehlungen',
    channelIcon: '🤝',
    description: 'Andere Vermittler, Beratungsstellen, Community-Gruppen empfehlen CorridorWork.',
    priority: 'medium',
    estimatedReach: '10–50 Leads/Monat über Partner',
    effort: 'medium',
    timeToFirstLead: '4–8 Wochen',
    complianceStatus: 'safe',
    complianceNote: 'Partnerschaften ohne Vergütungsvereinbarung zunächst sicher. Provisionsmodell → Rechtsprüfung.',
    actionItems: [
      'Partnerseite /partner erstellen mit Inbound-Formular',
      'Liste möglicher Partner: Beratungsstellen, Hochschulen, IHK',
      'Informationspaket (PDF) für Partner vorbereiten',
      '⚠️ Provisionsmodell erst nach anwaltlicher Prüfung',
    ],
    noEmailSent: true,
    noAutoOutreach: true,
  },
  {
    id: 'linkedin_organic',
    channel: 'LinkedIn Organisch (Inhalt)',
    channelIcon: '💼',
    description: 'Regelmäßige organische Posts über Talent-Korridore, Brancheninsights, Firmenprofil-Aufbau.',
    priority: 'medium',
    estimatedReach: '200–2.000 Impressionen/Post',
    effort: 'medium',
    timeToFirstLead: '4–12 Wochen',
    complianceStatus: 'safe',
    complianceNote: 'Organische Posts: vollständig legal. KEIN automatischer DM-Versand.',
    actionItems: [
      'CorridorWork LinkedIn-Firmenprofil erstellen',
      '2–3 Posts/Woche zu Fachkräftemangel, Korridoren, Erfolgsgeschichten',
      'KEIN automatischer DM-Versand (LinkedIn-Regelverstoß)',
      'Nutzer können von LinkedIn zur Selbstregistrierung kommen',
    ],
    noEmailSent: true,
    noAutoOutreach: true,
  },
  {
    id: 'press_pr',
    channel: 'Presse & PR',
    channelIcon: '📰',
    description: 'Presseartikel, Gastbeiträge, Fachmagazine über Fachkräftemangel und CorridorWork.',
    priority: 'low',
    estimatedReach: '1.000–50.000 Leser pro Artikel',
    effort: 'high',
    timeToFirstLead: '8–16 Wochen',
    complianceStatus: 'safe',
    complianceNote: 'Vollständig legal. Redaktionelle Kontrolle beachten.',
    actionItems: [
      'Pressemappe erstellen (Gründungsstory, Mission, Marktlücke)',
      'Fachmagazine: Altenpflege heute, Krankenhaus IT, HR-Journal',
      'Gastbeiträge zu: Fachkräfteeinwanderungsgesetz, Triple Win, Blue Card',
    ],
    noEmailSent: true,
    noAutoOutreach: true,
  },
]

// ── Content-Kalender ──────────────────────────────────────────────────────────

const CONTENT_CALENDAR: ContentCalendarItem[] = [
  {
    week: 1,
    title: 'Startseite: Was ist CorridorWork? (EN/DE)',
    type: 'landing_page',
    targetAudience: 'both',
    seoKeywords: ['CorridorWork platform', 'internationale Fachkräftevermittlung', 'global talent matching'],
    status: 'planned',
    priority: 'high',
    complianceNote: 'Kein Jobversprechen. Matching-Plattform klar kommunizieren.',
  },
  {
    week: 1,
    title: 'Korridor: Philippinen → Deutschland (DE/EN)',
    type: 'corridor_page',
    targetAudience: 'both',
    seoKeywords: ['Pflegekräfte Philippinen Deutschland', 'Filipino nurses Germany', 'Triple Win Alternative'],
    status: 'planned',
    priority: 'high',
    complianceNote: 'Kein Versprechen über Prozessdauer. Realistische Erwartungen setzen.',
  },
  {
    week: 2,
    title: 'Blog: Fachkräfteeinwanderungsgesetz 2024 — Was ändert sich?',
    type: 'blog',
    targetAudience: 'both',
    seoKeywords: ['Fachkräfteeinwanderungsgesetz 2024', 'Fachkräftemangel Lösung', 'internationales Recruiting neu'],
    status: 'planned',
    priority: 'high',
    complianceNote: 'Keine Rechtsberatung. Empfehle qualifizierte Beratung für Detailfragen.',
  },
  {
    week: 2,
    title: 'Korridor: Indien → Deutschland (DE/EN)',
    type: 'corridor_page',
    targetAudience: 'both',
    seoKeywords: ['IT Fachkräfte Indien Deutschland', 'Indian developer Germany Blue Card', 'Blue Card IT Indien'],
    status: 'planned',
    priority: 'high',
    complianceNote: 'Blue Card Infos nur faktisch. Keine Visa-Garantien.',
  },
  {
    week: 3,
    title: 'Blog: Triple Win Programm — für wen eignet es sich?',
    type: 'blog',
    targetAudience: 'both',
    seoKeywords: ['Triple Win Programm Pflege', 'GIZ Pflegekräfte Alternative', 'Triple Win Alternativen 2024'],
    status: 'planned',
    priority: 'medium',
    complianceNote: 'Keine Partnerschaft mit GIZ vorspiegeln. Faktenbasiert.',
  },
  {
    week: 3,
    title: 'Landingpage: Für Pflegeheime — Internationales Personal finden',
    type: 'landing_page',
    targetAudience: 'employer',
    seoKeywords: ['Pflegeheim internationales Personal', 'Pflegepersonal international rekrutieren', 'Pflegekräfte international'],
    status: 'planned',
    priority: 'high',
    complianceNote: 'Kein Cold-Outreach CTA. CTA: "Arbeitgeberkonto erstellen" (Inbound).',
  },
  {
    week: 4,
    title: 'Korridor: Marokko → Deutschland (DE/FR/AR)',
    type: 'corridor_page',
    targetAudience: 'both',
    seoKeywords: ['Marokko Fachkräfte Deutschland', 'infirmier Maroc Allemagne', 'Morocco Germany skilled workers'],
    status: 'planned',
    priority: 'high',
    complianceNote: 'Mehrsprachig anlegen. Übersetzung durch Muttersprachler.',
  },
  {
    week: 4,
    title: 'Blog: Blaue Karte EU — Voraussetzungen und Antrag',
    type: 'blog',
    targetAudience: 'candidate',
    seoKeywords: ['Blaue Karte EU Voraussetzungen', 'Blue Card Germany requirements', 'EU Blue Card application'],
    status: 'planned',
    priority: 'medium',
    complianceNote: 'Keine Rechtsberatung. Verlinkung auf offizielle BA/BAMF-Quellen.',
  },
]

// ── SEO-Plan ──────────────────────────────────────────────────────────────────

const SEO_CLUSTERS: SEOPlan[] = [
  {
    cluster: 'Fachkräftemangel Lösungen',
    keywords: ['Fachkräftemangel Lösung 2024', 'internationales Recruiting Deutschland', 'Fachkräfteeinwanderungsgesetz Umsetzung'],
    pageType: 'Blog + Pillar Page',
    estimatedMonthlySearches: '5.000–20.000',
    competitionLevel: 'medium',
    priority: 'high',
    complianceNote: 'Keine Rechtsberatung. Faktische Information.',
  },
  {
    cluster: 'Pflegekräfte International',
    keywords: ['Pflegekräfte international rekrutieren', 'Pflegepersonal Philippinen Deutschland', 'Triple Win Alternative'],
    pageType: 'Corridor Pages + Employer Landingpages',
    estimatedMonthlySearches: '2.000–8.000',
    competitionLevel: 'low',
    priority: 'high',
    complianceNote: 'Kein Visa-Versprechen. Klar: Matching-Plattform.',
  },
  {
    cluster: 'IT Fachkräfte International',
    keywords: ['IT Fachkräfte international', 'Indian developer Germany', 'Blue Card IT Software'],
    pageType: 'Corridor Pages + Employer Pages',
    estimatedMonthlySearches: '3.000–12.000',
    competitionLevel: 'medium',
    priority: 'high',
    complianceNote: 'Blue Card Infos faktisch. Kein Versprechen über Bearbeitungszeit.',
  },
  {
    cluster: 'Work in Germany (English)',
    keywords: ['work in Germany international', 'find job Germany skilled worker', 'Germany job platform foreign'],
    pageType: 'English-Language Main Pages',
    estimatedMonthlySearches: '10.000–50.000',
    competitionLevel: 'high',
    priority: 'medium',
    complianceNote: 'Kein Jobangebot direkt. Matching-Plattform klar stellen.',
  },
  {
    cluster: 'Visum / Aufenthaltstitel DE',
    keywords: ['Fachkräfteeinwanderungsgesetz Visum', 'Arbeitsvisum Deutschland Pflege', 'Aufenthaltserlaubnis Fachkraft'],
    pageType: 'Info-Artikel + FAQ',
    estimatedMonthlySearches: '8.000–30.000',
    competitionLevel: 'high',
    priority: 'medium',
    complianceNote: 'Keine Rechtsberatung. Nur faktenbasierte Infos + Verweis auf Behörden.',
  },
]

// ── Registration Funnels ──────────────────────────────────────────────────────

const REGISTRATION_FUNNELS: RegistrationFunnel[] = [
  {
    id: 'employer_funnel',
    funnelName: 'Arbeitgeber-Registrierung',
    audience: 'employer',
    steps: [
      'Landingpage besuchen (/employer/register)',
      'Formular ausfüllen: Firmendaten, Sektor, Stellenbedarf',
      'E-Mail-Bestätigung (Opt-In nach Einwilligung)',
      'Onboarding: Stellenbeschreibung eintragen, Matching-Score sehen',
      'Arbeitgeber kann Kandidaten-Profile ansehen (nach Freigabe)',
    ],
    currentStatus: 'planned',
    complianceStatus: 'safe',
    noEmailSent: true,
  },
  {
    id: 'candidate_funnel',
    funnelName: 'Kandidaten-Registrierung',
    audience: 'candidate',
    steps: [
      'Landingpage besuchen (länderspezifisch z.B. /work-in-germany/ph)',
      'Formular ausfüllen: Qualifikation, Erfahrung, Zielland',
      'DSGVO-Einwilligung explizit einholen',
      'Kandidaten-Profil erstellt (unsichtbar für andere ohne Match)',
      'Matching-Vorschläge sehen (wenn Arbeitgeber vorhanden)',
    ],
    currentStatus: 'planned',
    complianceStatus: 'safe',
    noEmailSent: true,
  },
]

// ── Hauptfunktionen ───────────────────────────────────────────────────────────

/**
 * Gibt alle Inbound-Kanäle zurück, sortiert nach Priorität.
 */
export function getInboundChannels(): InboundChannel[] {
  const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
  return INBOUND_CHANNELS.sort((a, b) => order[a.priority] - order[b.priority])
}

/**
 * Gibt Top-N sofort umsetzbare Kanäle zurück.
 */
export function getTopInboundChannels(n = 3): InboundChannel[] {
  return getInboundChannels()
    .filter(c => c.effort !== 'high')
    .slice(0, n)
}

/**
 * Gibt den Content-Kalender zurück, sortiert nach Woche.
 */
export function getContentCalendar(): ContentCalendarItem[] {
  return CONTENT_CALENDAR.sort((a, b) => a.week - b.week)
}

/**
 * Gibt Kalender-Items der nächsten N Wochen zurück.
 */
export function getUpcomingContent(weeks = 2): ContentCalendarItem[] {
  return getContentCalendar().filter(i => i.week <= weeks)
}

/**
 * Gibt den SEO-Plan zurück.
 */
export function getSEOClusters(): SEOPlan[] {
  const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
  return SEO_CLUSTERS.sort((a, b) => order[a.priority] - order[b.priority])
}

/**
 * Gibt Registration Funnels zurück.
 */
export function getRegistrationFunnels(): RegistrationFunnel[] {
  return REGISTRATION_FUNNELS
}

/**
 * Gibt zusammenfassende Wachstums-Metriken zurück.
 */
export function getGrowthSummary(): {
  totalChannels:     number
  highPriorityChannels: number
  contentItemsPlanned: number
  seoClusters:       number
  registrationFunnels: number
  estimatedFirstLeadWeeks: string
} {
  const channels = getInboundChannels()
  return {
    totalChannels:            channels.length,
    highPriorityChannels:     channels.filter(c => c.priority === 'high').length,
    contentItemsPlanned:      CONTENT_CALENDAR.length,
    seoClusters:              SEO_CLUSTERS.length,
    registrationFunnels:      REGISTRATION_FUNNELS.length,
    estimatedFirstLeadWeeks:  '1–3 Wochen (Selbstregistrierung aktiv)',
  }
}
