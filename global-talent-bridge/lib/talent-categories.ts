/**
 * lib/talent-categories.ts
 *
 * Global Talent Category System — CorridorWork
 *
 * Zentrale Skill-/Sector-Konfiguration für globale Talent-Korridore.
 * Keine personenbezogenen Daten. Keine Fake-Nachfrage. Nur Struktur und Bewertung.
 *
 * Safety: Kein Versand · Kein Scraping · Keine Jobgarantie · Keine Visa-Garantie
 */

// ── Typen ─────────────────────────────────────────────────────────────────────

export type QualificationLevel =
  | 'entry-level'
  | 'skilled-worker'
  | 'certified-professional'
  | 'senior-specialist'
  | 'regulated-profession'

export type TalentCategory = {
  sector_key:             string
  public_label:           string
  emoji:                  string
  employer_description:   string
  candidate_description:  string
  qualification_levels:   QualificationLevel[]
  global_relevance_score: number   // 0–100
  compliance_notes:       string
  recommended_corridors:  string[]
  revenue_potential:      number   // 0–100
  remote_eligible:        boolean
}

// ── Globale Talent-Kategorien ─────────────────────────────────────────────────

export const TALENT_CATEGORIES: TalentCategory[] = [
  {
    sector_key:            'healthcare_care',
    public_label:          'Pflege & Gesundheit',
    emoji:                 '🏥',
    employer_description:  'Pflegefachkräfte, Krankenpfleger/innen, Altenpfleger/innen, Medizinisches Assistenzpersonal',
    candidate_description: 'Ausgebildete Pflegekräfte mit internationaler Qualifikation suchen Stellen in DE/EU/UK/AU/CA',
    qualification_levels:  ['skilled-worker', 'certified-professional', 'regulated-profession'],
    global_relevance_score: 95,
    compliance_notes:      'Anerkennungsverfahren je Land erforderlich. Keine Jobgarantie. Keine Visa-Beratung.',
    recommended_corridors: ['philippines-healthcare', 'india-uk', 'kenya-care', 'morocco-germany'],
    revenue_potential:     90,
    remote_eligible:       false,
  },
  {
    sector_key:            'it_software',
    public_label:          'IT & Software',
    emoji:                 '💻',
    employer_description:  'Software-Entwickler, DevOps, Data Engineers, Cloud Architects, IT-Support',
    candidate_description: 'IT-Fachkräfte weltweit suchen Positionen in Technologie-Hubs in EU/UK/AU/CA/US',
    qualification_levels:  ['skilled-worker', 'certified-professional', 'senior-specialist'],
    global_relevance_score: 95,
    compliance_notes:      'Anerkennungsverfahren variiert. Viele Stellen remote möglich. Keine Visa-Garantie.',
    recommended_corridors: ['india-uk', 'nigeria-tech', 'brazil-portugal', 'pakistan-gulf', 'india-canada'],
    revenue_potential:     92,
    remote_eligible:       true,
  },
  {
    sector_key:            'engineering',
    public_label:          'Engineering / Ingenieurwesen',
    emoji:                 '⚙️',
    employer_description:  'Maschinenbauingenieure, Elektroingenieure, Bauingenieure, Verfahrenstechniker',
    candidate_description: 'Ingenieure mit internationaler Ausbildung suchen Positionen in Industrie und Technologie',
    qualification_levels:  ['certified-professional', 'senior-specialist', 'regulated-profession'],
    global_relevance_score: 88,
    compliance_notes:      'Ingenieurkammer-Anerkennung in vielen Ländern erforderlich. Keine Garantien.',
    recommended_corridors: ['india-uk', 'india-canada', 'india-australia', 'pakistan-gulf'],
    revenue_potential:     85,
    remote_eligible:       false,
  },
  {
    sector_key:            'construction_trades',
    public_label:          'Bau & Handwerk',
    emoji:                 '🏗️',
    employer_description:  'Maurer, Elektriker, Sanitär-Installateure, Zimmerer, Fliesen-leger, Schreiner',
    candidate_description: 'Ausgebildete Handwerker suchen Arbeit in Europa und anderen Industrienationen',
    qualification_levels:  ['entry-level', 'skilled-worker', 'certified-professional'],
    global_relevance_score: 87,
    compliance_notes:      'Handwerksanerkennung erforderlich. Keine Jobgarantie. Keine Visa-Beratung.',
    recommended_corridors: ['morocco-germany', 'tunisia-germany', 'morocco-france', 'pakistan-gulf'],
    revenue_potential:     82,
    remote_eligible:       false,
  },
  {
    sector_key:            'logistics_transport',
    public_label:          'Logistik & Transport',
    emoji:                 '🚚',
    employer_description:  'LKW-Fahrer, Lagerlogistiker, Gabelstaplerfahrer, Supply-Chain-Experten',
    candidate_description: 'Logistikfachkräfte und Fahrer suchen Positionen in Europa und global',
    qualification_levels:  ['entry-level', 'skilled-worker'],
    global_relevance_score: 85,
    compliance_notes:      'EU-Führerscheinklassen, Fahrerkarten. Keine Jobgarantie. Keine Visa-Beratung.',
    recommended_corridors: ['morocco-germany', 'tunisia-france', 'nigeria-uk', 'morocco-france'],
    revenue_potential:     80,
    remote_eligible:       false,
  },
  {
    sector_key:            'hospitality_hotel',
    public_label:          'Hotel & Hospitality',
    emoji:                 '🏨',
    employer_description:  'Rezeptionisten, Housekeeping, F&B, Eventmanager, Hotelmanagement',
    candidate_description: 'Hospitality-Fachkräfte suchen internationale Einsätze in Hotels weltweit',
    qualification_levels:  ['entry-level', 'skilled-worker', 'certified-professional'],
    global_relevance_score: 84,
    compliance_notes:      'Branchenanforderungen variieren. Keine Garantien. Inbound-only.',
    recommended_corridors: ['philippines-healthcare', 'indonesia-hospitality', 'morocco-france', 'tunisia-france'],
    revenue_potential:     78,
    remote_eligible:       false,
  },
  {
    sector_key:            'gastronomy',
    public_label:          'Gastronomie',
    emoji:                 '🍽️',
    employer_description:  'Köche, Restaurantfachleute, Baristas, Servicepersonal',
    candidate_description: 'Gastronomie-Fachkräfte suchen internationale Einsätze in EU und weltweit',
    qualification_levels:  ['entry-level', 'skilled-worker', 'certified-professional'],
    global_relevance_score: 80,
    compliance_notes:      'Hygieneschulung erforderlich. Keine Jobgarantie.',
    recommended_corridors: ['morocco-france', 'tunisia-france', 'indonesia-hospitality', 'brazil-portugal'],
    revenue_potential:     72,
    remote_eligible:       false,
  },
  {
    sector_key:            'facility_cleaning',
    public_label:          'Reinigung & Facility Management',
    emoji:                 '🧹',
    employer_description:  'Reinigungskräfte, Facility Manager, Hausmeister, Gebäudetechnik',
    candidate_description: 'Fachkräfte in Gebäudedienstleistungen suchen Stellen in EU',
    qualification_levels:  ['entry-level', 'skilled-worker'],
    global_relevance_score: 75,
    compliance_notes:      'Niedrige Hürden. Keine Jobgarantie. Keine Visa-Beratung.',
    recommended_corridors: ['morocco-germany', 'morocco-france', 'tunisia-germany'],
    revenue_potential:     65,
    remote_eligible:       false,
  },
  {
    sector_key:            'security',
    public_label:          'Sicherheit',
    emoji:                 '🔐',
    employer_description:  'Sicherheitspersonal, Werkschutz, Eventschutz, Portier',
    candidate_description: 'Ausgebildetes Sicherheitspersonal sucht Positionen in EU',
    qualification_levels:  ['entry-level', 'skilled-worker', 'certified-professional'],
    global_relevance_score: 73,
    compliance_notes:      'Sicherheitsgewerbeerlaubnis (§ 34a GewO in DE) erforderlich. Keine Jobgarantie.',
    recommended_corridors: ['morocco-germany', 'nigeria-uk'],
    revenue_potential:     62,
    remote_eligible:       false,
  },
  {
    sector_key:            'manufacturing_production',
    public_label:          'Produktion & Industrie',
    emoji:                 '🏭',
    employer_description:  'Fließbandarbeiter, CNC-Bediener, Qualitätsprüfer, Produktionsmechaniker',
    candidate_description: 'Produktionsfachkräfte suchen Stellen in der europäischen Industrie',
    qualification_levels:  ['entry-level', 'skilled-worker', 'certified-professional'],
    global_relevance_score: 82,
    compliance_notes:      'Maschinen-Zertifikate variieren. Keine Jobgarantie.',
    recommended_corridors: ['morocco-germany', 'tunisia-germany', 'india-uk', 'pakistan-gulf'],
    revenue_potential:     76,
    remote_eligible:       false,
  },
  {
    sector_key:            'agriculture_food',
    public_label:          'Landwirtschaft & Food Processing',
    emoji:                 '🌾',
    employer_description:  'Landarbeiter, Erntehelfer, Food-Processing-Mitarbeiter',
    candidate_description: 'Saisonarbeiter und Landwirtschaftsfachkräfte suchen internationale Einsätze',
    qualification_levels:  ['entry-level', 'skilled-worker'],
    global_relevance_score: 70,
    compliance_notes:      'Saisonarbeit-Regelungen variieren. Keine Jobgarantie. Keine Visa-Beratung.',
    recommended_corridors: ['morocco-france', 'morocco-germany', 'tunisia-france'],
    revenue_potential:     60,
    remote_eligible:       false,
  },
  {
    sector_key:            'education_training',
    public_label:          'Bildung & Training',
    emoji:                 '🎓',
    employer_description:  'Lehrkräfte, Ausbilder, Trainer, E-Learning-Spezialisten',
    candidate_description: 'Pädagogen und Trainer suchen internationale Positionen',
    qualification_levels:  ['certified-professional', 'senior-specialist'],
    global_relevance_score: 78,
    compliance_notes:      'Lehrerlizenz/Anerkennungsverfahren erforderlich. Keine Garantien.',
    recommended_corridors: ['india-uk', 'nigeria-uk', 'india-canada', 'india-australia'],
    revenue_potential:     70,
    remote_eligible:       true,
  },
  {
    sector_key:            'language_services',
    public_label:          'Sprachdienste / Dolmetschen / Übersetzen',
    emoji:                 '🌐',
    employer_description:  'Dolmetscher, Übersetzer, Sprachmittler, Lokalisierungsexperten',
    candidate_description: 'Mehrsprachige Fachkräfte bieten Sprach-/Übersetzungsdienstleistungen an',
    qualification_levels:  ['skilled-worker', 'certified-professional', 'senior-specialist'],
    global_relevance_score: 80,
    compliance_notes:      'Zertifizierungen variieren. Remote-geeignet. Keine Garantien.',
    recommended_corridors: ['morocco-germany', 'tunisia-france', 'brazil-portugal', 'nigeria-uk'],
    revenue_potential:     74,
    remote_eligible:       true,
  },
  {
    sector_key:            'admin_backoffice',
    public_label:          'Verwaltung / Backoffice',
    emoji:                 '📋',
    employer_description:  'Bürokaufleute, Sachbearbeiter, HR-Assistenten, Datenerfasser',
    candidate_description: 'Kaufmännische Fachkräfte suchen internationale Positionen',
    qualification_levels:  ['entry-level', 'skilled-worker', 'certified-professional'],
    global_relevance_score: 77,
    compliance_notes:      'Sprachkenntnisse besonders wichtig. Keine Jobgarantie.',
    recommended_corridors: ['morocco-germany', 'tunisia-france', 'india-uk', 'nigeria-uk'],
    revenue_potential:     68,
    remote_eligible:       true,
  },
  {
    sector_key:            'customer_support',
    public_label:          'Customer Support',
    emoji:                 '🎧',
    employer_description:  'Call-Center-Mitarbeiter, Customer-Success-Manager, Support-Techniker',
    candidate_description: 'Mehrsprachige Support-Fachkräfte suchen internationale Remote-Positionen',
    qualification_levels:  ['entry-level', 'skilled-worker'],
    global_relevance_score: 79,
    compliance_notes:      'Datenschutz-Compliance (DSGVO etc.) beachten. Keine Garantien.',
    recommended_corridors: ['philippines-healthcare', 'india-uk', 'nigeria-uk', 'indonesia-hospitality'],
    revenue_potential:     73,
    remote_eligible:       true,
  },
  {
    sector_key:            'sales_vertrieb',
    public_label:          'Vertrieb / Sales',
    emoji:                 '📈',
    employer_description:  'Vertriebsmitarbeiter, Account Manager, Sales Representatives',
    candidate_description: 'Vertriebsfachkräfte suchen internationale Positionen mit Sprachkompetenz',
    qualification_levels:  ['entry-level', 'skilled-worker', 'certified-professional'],
    global_relevance_score: 76,
    compliance_notes:      'Branchenregulierungen variieren. Keine Garantien.',
    recommended_corridors: ['india-uk', 'nigeria-uk', 'brazil-portugal', 'india-canada'],
    revenue_potential:     75,
    remote_eligible:       true,
  },
  {
    sector_key:            'technician_electro',
    public_label:          'Techniker / Elektriker / Mechaniker',
    emoji:                 '🔧',
    employer_description:  'Elektriker, KFZ-Mechaniker, Industriemechaniker, Wartungstechniker',
    candidate_description: 'Technische Fachkräfte suchen Positionen in Industrienationen',
    qualification_levels:  ['skilled-worker', 'certified-professional'],
    global_relevance_score: 85,
    compliance_notes:      'Elektriker: Länderspezifische Zulassung erforderlich. Keine Jobgarantie.',
    recommended_corridors: ['morocco-germany', 'tunisia-germany', 'india-uk', 'pakistan-gulf'],
    revenue_potential:     83,
    remote_eligible:       false,
  },
  {
    sector_key:            'drivers_delivery',
    public_label:          'Fahrer / Lieferdienste',
    emoji:                 '🚗',
    employer_description:  'Berufskraftfahrer, Lieferfahrer, Kurier-Dienste, ÖPNV-Fahrer',
    candidate_description: 'Fahrer mit gültigen Führerscheinen suchen internationale Einsätze',
    qualification_levels:  ['entry-level', 'skilled-worker'],
    global_relevance_score: 80,
    compliance_notes:      'EU-Führerschein-Klassen, ADR wenn zutreffend. Keine Jobgarantie.',
    recommended_corridors: ['morocco-germany', 'tunisia-france', 'morocco-france', 'nigeria-uk'],
    revenue_potential:     74,
    remote_eligible:       false,
  },
  {
    sector_key:            'skilled_worker_general',
    public_label:          'Facharbeiter allgemein',
    emoji:                 '👷',
    employer_description:  'Qualifizierte Arbeitskräfte in vielen Branchen — flexible Kategorisierung',
    candidate_description: 'Facharbeiter mit Berufserfahrung, nicht eindeutig einer Branche zuzuordnen',
    qualification_levels:  ['entry-level', 'skilled-worker', 'certified-professional'],
    global_relevance_score: 82,
    compliance_notes:      'Anerkennungsverfahren je nach Qualifikation. Keine Jobgarantie.',
    recommended_corridors: ['morocco-germany', 'india-uk', 'nigeria-uk', 'pakistan-gulf'],
    revenue_potential:     78,
    remote_eligible:       false,
  },
  {
    sector_key:            'apprenticeship_training',
    public_label:          'Trainees / Apprenticeship / Ausbildungskorridore',
    emoji:                 '🎯',
    employer_description:  'Ausbildungsunternehmen suchen internationale Auszubildende und Trainees',
    candidate_description: 'Junge Fachkräfte suchen duale Ausbildung oder Trainee-Programme in DE/EU',
    qualification_levels:  ['entry-level', 'skilled-worker'],
    global_relevance_score: 75,
    compliance_notes:      'Ausbildungsvertrag, Aufenthaltsgenehmigung erforderlich. Keine Garantien.',
    recommended_corridors: ['morocco-germany', 'tunisia-germany', 'india-uk', 'kenya-care'],
    revenue_potential:     70,
    remote_eligible:       false,
  },
  {
    sector_key:            'remote_qualified',
    public_label:          'Remote-geeignete qualifizierte Tätigkeiten',
    emoji:                 '🌍',
    employer_description:  'Digitale Nomaden-freundliche Unternehmen suchen Remote-Fachkräfte weltweit',
    candidate_description: 'Qualifizierte Fachkräfte bieten Remote-Dienstleistungen global an',
    qualification_levels:  ['skilled-worker', 'certified-professional', 'senior-specialist'],
    global_relevance_score: 88,
    compliance_notes:      'Remote-Steuer/Arbeitsrecht komplex. Keine Jobgarantie. Keine Visa-Beratung.',
    recommended_corridors: ['india-uk', 'nigeria-tech', 'brazil-portugal', 'india-canada', 'india-australia'],
    revenue_potential:     86,
    remote_eligible:       true,
  },
]

// ── Helper-Funktionen ─────────────────────────────────────────────────────────

export function getCategoryByKey(key: string): TalentCategory | undefined {
  return TALENT_CATEGORIES.find(c => c.sector_key === key)
}

export function getTopCategoriesByRevenue(limit = 5): TalentCategory[] {
  return [...TALENT_CATEGORIES]
    .sort((a, b) => b.revenue_potential - a.revenue_potential)
    .slice(0, limit)
}

export function getTopCategoriesByRelevance(limit = 5): TalentCategory[] {
  return [...TALENT_CATEGORIES]
    .sort((a, b) => b.global_relevance_score - a.global_relevance_score)
    .slice(0, limit)
}

export function getRemoteEligibleCategories(): TalentCategory[] {
  return TALENT_CATEGORIES.filter(c => c.remote_eligible)
}

export const SECTOR_KEYS = TALENT_CATEGORIES.map(c => c.sector_key)
export const SECTOR_LABELS = TALENT_CATEGORIES.map(c => c.public_label)
