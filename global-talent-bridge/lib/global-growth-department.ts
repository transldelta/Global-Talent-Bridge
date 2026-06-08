/**
 * lib/global-growth-department.ts
 *
 * Pure data and functions for the CEO Global Growth Department.
 * No side effects. No automatic sending. No scraping. No network calls.
 *
 * All outreach is prepared only — manual approval and manual send required.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type TargetKind = 'employer' | 'partner' | 'candidate_source'

export type RiskLevel = 'low' | 'medium' | 'high'

export type QueueStatus =
  | 'target_profile'
  | 'real_contact_needed'
  | 'draft_prepared'
  | 'needs_review'
  | 'screenshot_review'
  | 'approved_to_send'
  | 'sent_manually'
  | 'replied'
  | 'rejected'

export type MessageType =
  | 'employer_healthcare'
  | 'employer_it'
  | 'employer_engineering'
  | 'recruiting_agency'
  | 'language_school'
  | 'relocation_partner'
  | 'candidate_source'
  | 'university_career'
  | 'strategic_partner'

export interface GrowthTarget {
  id:            string
  targetKind:    TargetKind
  companyName:   string
  contactEmail:  string
  website:       string
  contactPage:   string
  country:       string
  sourceMarket:  string
  destMarket:    string
  sector:        string
  corridor:      string
  messageType:   MessageType
  fitScore:      number
  riskLevel:     RiskLevel
  status:        QueueStatus
  notes:         string
  subject:       string
  body:          string
  createdAt:     string
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const SENDER_NAME  = 'CorridorWork Team'
export const SENDER_EMAIL = 'transl.delta@gmail.com'
export const SENDER_URL   = 'https://corridorwork.com'

export const DESTINATION_MARKETS = [
  'Germany / DACH',
  'UK',
  'Canada',
  'Australia',
  'Gulf region',
  'Netherlands',
  'France',
  'Spain',
  'Portugal',
  'USA',
] as const

export const SOURCE_MARKETS = [
  'Morocco',
  'Tunisia',
  'Egypt',
  'India',
  'Philippines',
  'Pakistan',
  'Nigeria',
  'Ghana',
  'Kenya',
  'Turkey',
  'Latin America',
  'Eastern Europe',
] as const

export const GROWTH_SECTORS = [
  'Healthcare',
  'IT & Software',
  'Engineering',
  'Skilled Trades',
  'Logistics',
  'Hospitality',
  'Construction',
] as const

// ── Corridor map ──────────────────────────────────────────────────────────────

export interface Corridor {
  id:                  string
  label:               string
  sourceMarkets:       string[]
  destinationMarkets:  string[]
  sectors:             string[]
  riskLevel:           RiskLevel
  candidateSourceTypes: string[]
  bestFirstContact:    MessageType
  description:         string
}

export const CORRIDORS: Corridor[] = [
  {
    id:                  'morocco-dach-france-spain',
    label:               'Morocco / Tunisia → DACH / France / Spain',
    sourceMarkets:       ['Morocco', 'Tunisia'],
    destinationMarkets:  ['Germany / DACH', 'France', 'Spain'],
    sectors:             ['Healthcare', 'Hospitality', 'Skilled Trades', 'Logistics'],
    riskLevel:           'low',
    candidateSourceTypes: ['Language schools', 'Vocational training centres', 'Nursing schools', 'Training providers'],
    bestFirstContact:    'language_school',
    description:         'Strong language school infrastructure in Morocco and Tunisia. French and German language programmes well-established. Direct corridor to DACH healthcare and hospitality sectors.',
  },
  {
    id:                  'india-uk-canada-australia-gulf',
    label:               'India → UK / Canada / Australia / Gulf',
    sourceMarkets:       ['India'],
    destinationMarkets:  ['UK', 'Canada', 'Australia', 'Gulf region'],
    sectors:             ['Healthcare', 'IT & Software', 'Engineering'],
    riskLevel:           'low',
    candidateSourceTypes: ['Universities', 'Career centres', 'Nursing colleges', 'IT training institutes'],
    bestFirstContact:    'university_career',
    description:         'Large English-speaking candidate pool. Strong diaspora networks. IT and healthcare professionals well-prepared for English-speaking destination markets.',
  },
  {
    id:                  'philippines-germany-canada-gulf',
    label:               'Philippines → Germany / Canada / Gulf / Australia',
    sourceMarkets:       ['Philippines'],
    destinationMarkets:  ['Germany / DACH', 'Canada', 'Gulf region', 'Australia'],
    sectors:             ['Healthcare', 'Hospitality', 'Construction'],
    riskLevel:           'low',
    candidateSourceTypes: ['Nursing schools', 'Vocational training', 'Diaspora associations', 'Career centres'],
    bestFirstContact:    'candidate_source',
    description:         'Philippines is one of the highest-volume international healthcare and hospitality candidate sources globally. Established bilateral agreements with Germany.',
  },
  {
    id:                  'nigeria-ghana-kenya-uk-canada-germany',
    label:               'Nigeria / Ghana / Kenya → UK / Canada / Germany',
    sourceMarkets:       ['Nigeria', 'Ghana', 'Kenya'],
    destinationMarkets:  ['UK', 'Canada', 'Germany / DACH'],
    sectors:             ['Healthcare', 'IT & Software', 'Engineering'],
    riskLevel:           'medium',
    candidateSourceTypes: ['Universities', 'Professional associations', 'Training providers', 'Diaspora organisations'],
    bestFirstContact:    'recruiting_agency',
    description:         'Growing professional candidate pools in healthcare and tech. UK and Canada have established immigration pathways. Germany requires German language preparation.',
  },
  {
    id:                  'turkey-dach-eu',
    label:               'Turkey → DACH / EU',
    sourceMarkets:       ['Turkey'],
    destinationMarkets:  ['Germany / DACH', 'Netherlands', 'France'],
    sectors:             ['Healthcare', 'Engineering', 'Skilled Trades', 'Construction'],
    riskLevel:           'low',
    candidateSourceTypes: ['Vocational schools', 'Universities', 'Training providers', 'Diaspora networks'],
    bestFirstContact:    'language_school',
    description:         'Large established diaspora in Germany. Strong vocational training base. Healthcare and engineering professionals increasingly mobile.',
  },
  {
    id:                  'latam-spain-portugal-canada',
    label:               'Latin America → Spain / Portugal / Canada',
    sourceMarkets:       ['Latin America'],
    destinationMarkets:  ['Spain', 'Portugal', 'Canada'],
    sectors:             ['Healthcare', 'IT & Software', 'Hospitality'],
    riskLevel:           'low',
    candidateSourceTypes: ['Universities', 'Career centres', 'Nursing schools', 'IT training providers'],
    bestFirstContact:    'university_career',
    description:         'Spanish and Portuguese language advantage. Canada increasingly accepting Latin American professionals. Healthcare and tech strong candidate pipeline.',
  },
  {
    id:                  'eastern-europe-dach-netherlands-uk',
    label:               'Eastern Europe → Germany / Netherlands / UK',
    sourceMarkets:       ['Eastern Europe'],
    destinationMarkets:  ['Germany / DACH', 'Netherlands', 'UK'],
    sectors:             ['Healthcare', 'Construction', 'Logistics', 'Engineering'],
    riskLevel:           'low',
    candidateSourceTypes: ['Vocational schools', 'Nursing schools', 'Training providers', 'Recruiting agencies'],
    bestFirstContact:    'recruiting_agency',
    description:         'Established intra-EU mobility. Strong vocational infrastructure. Healthcare and construction particularly active corridors.',
  },
  {
    id:                  'egypt-pakistan-gulf-uk-canada',
    label:               'Egypt / Pakistan → Gulf / UK / Canada',
    sourceMarkets:       ['Egypt', 'Pakistan'],
    destinationMarkets:  ['Gulf region', 'UK', 'Canada'],
    sectors:             ['Engineering', 'Healthcare', 'Construction', 'IT & Software'],
    riskLevel:           'medium',
    candidateSourceTypes: ['Universities', 'Engineering colleges', 'Training providers', 'Professional associations'],
    bestFirstContact:    'university_career',
    description:         'Long-established Gulf labour corridors. UK and Canada offering alternative pathways. Engineering and healthcare main professional sectors.',
  },
]

// ── Queue status options ──────────────────────────────────────────────────────

export const QUEUE_STATUS_OPTIONS: { value: QueueStatus; label: string }[] = [
  { value: 'target_profile',     label: 'Target profile'             },
  { value: 'real_contact_needed', label: 'Real contact needed'       },
  { value: 'draft_prepared',     label: 'Draft prepared'             },
  { value: 'needs_review',       label: 'Needs review'               },
  { value: 'screenshot_review',  label: 'Screenshot review'          },
  { value: 'approved_to_send',   label: 'Approved to send manually'  },
  { value: 'sent_manually',      label: 'Sent manually'              },
  { value: 'replied',            label: 'Replied'                    },
  { value: 'rejected',           label: 'Rejected'                   },
]

// ── Message type config ───────────────────────────────────────────────────────

export const MESSAGE_TYPE_CONFIG: {
  value: MessageType
  label: string
  link: string
  targetKind: TargetKind
}[] = [
  { value: 'employer_healthcare', label: 'Employer — Healthcare',           link: '/global/employers',        targetKind: 'employer'         },
  { value: 'employer_it',         label: 'Employer — IT & Software',        link: '/global/employers',        targetKind: 'employer'         },
  { value: 'employer_engineering',label: 'Employer — Engineering',          link: '/global/employers',        targetKind: 'employer'         },
  { value: 'recruiting_agency',   label: 'Recruiting / Staffing agency',    link: '/partners',                targetKind: 'partner'          },
  { value: 'language_school',     label: 'Language school / Training provider', link: '/global/candidates',   targetKind: 'candidate_source' },
  { value: 'relocation_partner',  label: 'Relocation partner',              link: '/partners',                targetKind: 'partner'          },
  { value: 'candidate_source',    label: 'Candidate source / Community',    link: '/global/candidates',       targetKind: 'candidate_source' },
  { value: 'university_career',   label: 'University / Career centre',      link: '/global/candidates',       targetKind: 'candidate_source' },
  { value: 'strategic_partner',   label: 'Strategic partner',               link: '/strategic-partnership',   targetKind: 'partner'          },
]

// ── Message factory ───────────────────────────────────────────────────────────

const SIG = `${SENDER_NAME}\n${SENDER_URL}`

export function generateGrowthMessage(
  type:        MessageType,
  companyName: string,
  country:     string,
  sector:      string,
): { subject: string; body: string } {
  const co  = companyName.trim() || 'Ihr Unternehmen'
  const sec = sector.trim()      || 'Ihrem Bereich'

  switch (type) {
    case 'employer_healthcare':
      return {
        subject: 'CorridorWork — Strukturierte Erfassung von internationalem Pflegepersonal',
        body: `Guten Tag,

wir entwickeln CorridorWork, eine Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse im Bereich Pflege und Gesundheit.

Wir wenden uns an ${co} in ${country || 'Ihrem Land'}, um zu verstehen, ob ein früher Pilotansatz für die strukturierte Erfassung von internationalem Pflegepersonal für Ihre Einrichtung relevant wäre.

Es geht nicht um Jobgarantie, Visaberatung oder automatische Vermittlung. Alles wird manuell geprüft.

Eine kurze schriftliche Rückmeldung per E-Mail würde uns sehr helfen. Für weitere Informationen:
${SENDER_URL}/global/employers

Mit freundlichen Grüßen
${SIG}`,
      }

    case 'employer_it':
      return {
        subject: 'CorridorWork — Internationales Kandidateninteresse im IT-Bereich',
        body: `Guten Tag,

wir arbeiten an CorridorWork, einer Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse im Bereich IT und Software.

Wir suchen Arbeitgeber in ${country || 'Ihrem Markt'}, die Feedback zu unserem frühen Pilotansatz geben können — ob dieser für die Gewinnung internationaler IT-Fachkräfte für ${co} hilfreich wäre.

Keine Jobgarantie, keine Visaberatung, keine automatische Vermittlung.

Eine schriftliche Rückmeldung per E-Mail würde uns sehr helfen:
${SENDER_URL}/global/employers

Mit freundlichen Grüßen
${SIG}`,
      }

    case 'employer_engineering':
      return {
        subject: 'CorridorWork — Pilotphase für internationales Engineering-Matching',
        body: `Guten Tag,

wir entwickeln CorridorWork, eine Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse im Ingenieurbereich.

Für die Pilotphase suchen wir Unternehmen wie ${co} in ${country || 'Ihrem Markt'}, die einschätzen können, ob dieser Ansatz für die strukturierte Gewinnung internationaler Ingenieure relevant wäre.

Keine Jobgarantie. Keine automatische Vermittlung. Manuell geprüft.

Ihre schriftliche Rückmeldung per E-Mail ist sehr willkommen:
${SENDER_URL}/global/employers

Mit freundlichen Grüßen
${SIG}`,
      }

    case 'recruiting_agency':
      return {
        subject: 'CorridorWork — Infrastruktur für Cross-border Recruiting',
        body: `Guten Tag,

wir entwickeln CorridorWork, eine Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Wir wenden uns an ${co}, da Ihr Unternehmen im Bereich ${sec} tätig ist und CorridorWork als Infrastruktur für strukturiertes Cross-border Matching relevant sein könnte.

Es geht um eine mögliche Zusammenarbeit als Kanal- oder Pilotpartner — kein automatischer Versand, keine Jobgarantie, keine Visaberatung, alles manuell geprüft.

Ihre schriftliche Einschätzung per E-Mail würde uns sehr helfen:
${SENDER_URL}/partners

Mit freundlichen Grüßen
${SIG}`,
      }

    case 'language_school':
      return {
        subject: 'Pilot-Feedback zu CorridorWork',
        body: `Guten Tag,

wir arbeiten an CorridorWork, einer Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Für die erste Pilotphase suchen wir Sprachschulen und Training Provider wie ${co} in ${country || 'Ihrem Land'}, die einschätzen können, ob dieser Ansatz für internationale Absolventen und Arbeitgeber hilfreich wäre.

Es geht nicht um Jobgarantie, Visaberatung oder automatische Vermittlung.

Ihre schriftliche Rückmeldung per E-Mail würde uns sehr helfen:
${SENDER_URL}/global/candidates

Mit freundlichen Grüßen
${SIG}`,
      }

    case 'relocation_partner':
      return {
        subject: 'CorridorWork — Kooperationsmöglichkeit für Relocation-Partner',
        body: `Guten Tag,

wir entwickeln CorridorWork, eine Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Als Relocation-Partner arbeitet ${co} direkt mit Unternehmen, die internationales Personal einsetzen. Wir möchten gerne erfahren, ob CorridorWork als ergänzende Infrastruktur für Ihre Arbeit relevant sein könnte.

Keine automatische Vermittlung, keine Jobgarantie. Manuell geprüft.

Ihre schriftliche Rückmeldung per E-Mail ist sehr willkommen:
${SENDER_URL}/partners

Mit freundlichen Grüßen
${SIG}`,
      }

    case 'candidate_source':
      return {
        subject: 'CorridorWork — Kandidateninteresse strukturiert erfassen',
        body: `Guten Tag,

wir entwickeln CorridorWork, eine Plattform, auf der internationale Kandidaten ihr Interesse an Beschäftigung im Ausland strukturiert eintragen können.

Wir wenden uns an Organisationen wie ${co} in ${country || 'Ihrem Land'}, die Zugang zu Kandidaten im Bereich ${sec} haben und uns helfen könnten, den Ansatz zu validieren.

Keine direkte Ansprache einzelner Kandidaten durch uns. Keine Jobgarantie. Keine Gebühren.

Interessierten Kandidaten empfehlen wir:
${SENDER_URL}/global/candidates

Ihre schriftliche Einschätzung per E-Mail wäre sehr hilfreich.

Mit freundlichen Grüßen
${SIG}`,
      }

    case 'university_career':
      return {
        subject: 'CorridorWork — Internationale Karrierewege für Absolventen',
        body: `Guten Tag,

wir entwickeln CorridorWork, eine Plattform zur strukturierten Erfassung von Interesse an internationalen Beschäftigungsmöglichkeiten.

Wir wenden uns an Bildungseinrichtungen wie ${co} in ${country || 'Ihrem Land'}, um zu verstehen, ob dieser Ansatz für Absolventen im Bereich ${sec} hilfreich wäre.

Keine Jobgarantie, keine Visaberatung, keine Kandidatengebühren. Freiwillig und kostenlos für Kandidaten.

Kandidaten können ihr Interesse hier eintragen:
${SENDER_URL}/global/candidates

Ihre schriftliche Rückmeldung per E-Mail würde uns sehr helfen.

Mit freundlichen Grüßen
${SIG}`,
      }

    case 'strategic_partner':
      return {
        subject: 'CorridorWork — Strategische Partnerschaft oder Lizenzmöglichkeit',
        body: `Guten Tag,

wir entwickeln CorridorWork, eine live betriebene Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Wir wenden uns an ${co}, um eine mögliche strategische Zusammenarbeit — als Kanalpartner, Lizenznehmer oder für eine weitergehende Kooperation — zu erkunden.

Keine automatische Outreach-Funktion aktiv. DSGVO-konform. Kein Kandidatengebührenmodell.

Weitere Informationen: ${SENDER_URL}/strategic-partnership

Ihre schriftliche Einschätzung per E-Mail ist sehr willkommen.

Mit freundlichen Grüßen
${SIG}`,
      }
  }
}

// ── Gmail draft URL ───────────────────────────────────────────────────────────

/**
 * Generate a Gmail compose URL that opens a draft with pre-filled fields.
 * The user must click Send in Gmail themselves — nothing is sent automatically.
 * No Gmail API. No automatic sending.
 */
export function generateGmailDraftUrl(
  toEmail: string,
  subject: string,
  body:    string,
): string {
  const params = new URLSearchParams()
  params.set('view', 'cm')
  params.set('fs', '1')
  if (toEmail.trim()) params.set('to', toEmail.trim())
  params.set('su', subject)
  params.set('body', body)
  return `https://mail.google.com/mail/?${params.toString()}`
}

// ── Autofill snippet ──────────────────────────────────────────────────────────

/**
 * Generate a browser console snippet that fills contact form fields.
 * Never submits the form. Shows alert asking user to review before sending.
 */
export function generateContactFormSnippet(subject: string, body: string): string {
  const safe = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
  return `(function() {
  var VALS = {
    name:    'CorridorWork Team',
    fname:   'CorridorWork',
    lname:   'Team',
    email:   '${SENDER_EMAIL}',
    subject: '${safe(subject)}',
    message: '${safe(body)}'
  };
  var filled = 0;
  function fill(sel, val) {
    var el = document.querySelector(sel);
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      el.value = val; el.style.outline = '3px solid #6366f1';
      el.dispatchEvent(new Event('input', {bubbles:true}));
      filled++;
    }
  }
  fill('input[name*=name i]:not([type=hidden])', VALS.name);
  fill('input[name*=first i]', VALS.fname);
  fill('input[name*=last i]', VALS.lname);
  fill('input[type=email]', VALS.email);
  fill('input[name*=subject i]', VALS.subject);
  fill('input[name*=betreff i]', VALS.subject);
  var ta = document.querySelector('textarea');
  if (ta) { ta.value = VALS.message; ta.style.outline = '3px solid #6366f1'; ta.dispatchEvent(new Event('input', {bubbles:true})); filled++; }
  /* SAFETY: fields filled only — no automatic submission */
  alert('CorridorWork Autofill: ' + filled + ' field(s) filled.\\n\\nSTOP — Review before sending:\\n1. Read the message.\\n2. Confirm recipient is correct.\\n3. Click Send yourself only after review.\\n\\nNever send without screenshot approval.');
})();`
}

// ── Search URL generator ──────────────────────────────────────────────────────

/**
 * Generate a Google or LinkedIn search URL — opens search in browser,
 * no scraping, no API, user reads results manually.
 */
export function generateSearchUrl(
  platform: 'google' | 'linkedin',
  query: string,
): string {
  if (platform === 'google') {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`
  }
  return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(query)}`
}

// ── Search playbook templates ─────────────────────────────────────────────────

export const SEARCH_PLAYBOOK: {
  id:       string
  label:    string
  platform: 'google' | 'linkedin'
  query:    string
}[] = [
  { id: 'g1', label: 'Language schools — international nurses — Germany', platform: 'google',   query: 'language school international nurses Germany contact' },
  { id: 'g2', label: 'Healthcare recruitment agency — Morocco → Germany', platform: 'google',   query: 'healthcare recruitment agency Morocco Germany' },
  { id: 'g3', label: 'Training provider — international healthcare — Canada', platform: 'google', query: 'training provider international healthcare workers Canada' },
  { id: 'g4', label: 'Nursing school — Philippines → Germany partnership', platform: 'google',  query: 'nursing school Philippines Germany partnership' },
  { id: 'g5', label: 'Language school — Turkey → DACH',                   platform: 'google',   query: 'Sprachschule Türkei Deutschland internationale Fachkräfte' },
  { id: 'l1', label: 'LinkedIn — placement coordinator — Germany',         platform: 'linkedin', query: 'language school placement coordinator Germany' },
  { id: 'l2', label: 'LinkedIn — recruitment agency healthcare Morocco',   platform: 'linkedin', query: 'recruitment agency healthcare Morocco Germany' },
  { id: 'l3', label: 'LinkedIn — candidate community Nigeria healthcare',  platform: 'linkedin', query: 'candidate community Nigeria healthcare UK' },
  { id: 'l4', label: 'LinkedIn — relocation partner DACH HR',             platform: 'linkedin', query: 'relocation partner Germany HR international hiring' },
  { id: 'l5', label: 'LinkedIn — training provider Philippines nursing',   platform: 'linkedin', query: 'training provider Philippines nursing international' },
]

// ── Quick Add parser ──────────────────────────────────────────────────────────

export interface ParsedQuickAdd {
  companyName:  string
  contactEmail: string
  country:      string
  sector:       string
  website:      string
  raw:          string
  error?:       string
}

/**
 * Parse one line of Quick Add input.
 * Expected format: CompanyName | email | Country | Sector | website
 * Returns a parsed target or an error.
 */
export function parseQuickAddLine(line: string): ParsedQuickAdd {
  const raw = line.trim()
  if (!raw || raw.startsWith('#')) return { companyName: '', contactEmail: '', country: '', sector: '', website: '', raw, error: 'empty or comment' }

  const parts = raw.split('|').map((p) => p.trim())
  if (parts.length < 2) return { companyName: raw, contactEmail: '', country: '', sector: '', website: '', raw, error: 'missing fields — expected: Name | email | Country | Sector | website' }

  return {
    companyName:  parts[0] ?? '',
    contactEmail: parts[1] ?? '',
    country:      parts[2] ?? '',
    sector:       parts[3] ?? '',
    website:      parts[4] ?? '',
    raw,
  }
}

/**
 * Parse up to 50 lines of Quick Add text.
 */
export function parseQuickAddBulk(text: string): ParsedQuickAdd[] {
  return text
    .split('\n')
    .slice(0, 50)
    .map(parseQuickAddLine)
    .filter((r) => !r.error && r.companyName)
}

// ── Batch target generator ────────────────────────────────────────────────────

export interface BatchSpec {
  targetKind:  TargetKind
  country:     string
  sector:      string
  count:       number
  messageType: MessageType
}

/**
 * Generate N template targets without real company names.
 * Status: real_contact_needed.
 * The user fills in real data after finding contacts via Search Playbook.
 */
export function generateBatchTargets(spec: BatchSpec): Omit<GrowthTarget, 'id' | 'createdAt'>[] {
  return Array.from({ length: spec.count }, (_, i) => {
    const msg = generateGrowthMessage(spec.messageType, '', spec.country, spec.sector)
    return {
      targetKind:   spec.targetKind,
      companyName:  `[Target ${i + 1} — ${spec.sector} — ${spec.country}]`,
      contactEmail: '',
      website:      '',
      contactPage:  '',
      country:      spec.country,
      sourceMarket: '',
      destMarket:   spec.country,
      sector:       spec.sector,
      corridor:     '',
      messageType:  spec.messageType,
      fitScore:     0,
      riskLevel:    'low' as RiskLevel,
      status:       'real_contact_needed' as QueueStatus,
      notes:        'Target profile — real contact needed. Use Search Playbook to find a real company.',
      subject:      msg.subject,
      body:         msg.body,
    }
  })
}

// ── Operating rules ───────────────────────────────────────────────────────────

export const GROWTH_OPERATING_RULES = [
  'No automatic outreach — ever',
  'Manual approval required before every send',
  'No scraping or automated data collection',
  'No job guarantee to any employer or candidate',
  'No visa guarantee to any employer or candidate',
  'No candidate fees',
  'No Stripe or payment activation',
  'No calls or meetings required — written reply by email only',
  'All messages signed: CorridorWork Team',
  'Screenshot review before any manual send',
] as const
