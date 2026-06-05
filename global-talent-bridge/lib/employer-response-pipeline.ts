/**
 * lib/employer-response-pipeline.ts
 *
 * Pilot Offer & Employer Response Pipeline — reine Business-Logic.
 * Keine UI. Keine Server-Imports. Testbar mit Vitest.
 *
 * CONSTRAINTS:
 * - Keine echten Nachrichten senden
 * - Keine Fake-Umsätze / Fake-Traction
 * - Preise nur als Vorschläge / Annahmen
 * - pilot_employers.status: nur gültige DB-Werte
 * - response_type in Interactions != pilot_employers.status
 * - Rechtliche Situation ehrlich kommunizieren
 */

import { VALID_PILOT_STATUSES, isValidPilotStatus, type ValidPilotStatus } from '@/lib/pilot-execution'

// ── Types ─────────────────────────────────────────────────────────────────────

export type PilotOfferVariant = 'validation' | 'starter' | 'success_based'

export type IndustryPitchType = 'care' | 'it' | 'construction' | 'hospitality' | 'logistics' | 'other'

export type InteractionType =
  | 'email_manual'
  | 'whatsapp_manual'
  | 'linkedin_manual'
  | 'call'
  | 'demo'
  | 'note'

export type ResponseType =
  | 'no_response'
  | 'positive'
  | 'neutral'
  | 'objection'
  | 'rejected'
  | 'demo_requested'
  | 'pilot_requested'

export const VALID_RESPONSE_TYPES: readonly ResponseType[] = [
  'no_response',
  'positive',
  'neutral',
  'objection',
  'rejected',
  'demo_requested',
  'pilot_requested',
] as const

export const VALID_INTERACTION_TYPES: readonly InteractionType[] = [
  'email_manual',
  'whatsapp_manual',
  'linkedin_manual',
  'call',
  'demo',
  'note',
] as const

export type PilotOffer = {
  variant: PilotOfferVariant
  title: string
  priceLabel: string          // Always labeled as "Vorschlag/Annahme"
  monthlyEstimate: number     // EUR — Annahme, kein echter Umsatz
  description: string
  targetEmployer: string
  noGuaranteeNote: string
  isEstimate: true
}

export type IndustryPitch = {
  industry: IndustryPitchType
  headline: string
  problem: string
  benefit: string
  pilotOffer: string
  nextAction: string
  noFakeClaimsNote: string
}

export type ObjectionResponse = {
  objectionKey: string
  objection: string
  response: string
  honesty: 'candid' | 'positive' | 'neutral'
}

export type CallScriptSection = {
  id: string
  label: string
  script: string
  notes: string
}

export type EmployerNextBestAction = {
  employerId: string
  employerName: string
  industry: string | null
  country: string
  currentStatus: ValidPilotStatus
  recommendedAction: string
  suggestedPitchType: IndustryPitchType
  suggestedOfferVariant: PilotOfferVariant
  urgency: 'high' | 'medium' | 'low'
  opportunityNote: string
}

export type PipelineSummary = {
  total: number
  byStatus: Record<string, number>
  hotLeads: number          // interested + demo_scheduled + onboarding
  activeCount: number       // active_pilot
  rejectedCount: number
  contactedCount: number    // contacted_manual
  identifiedCount: number   // identified
  nextActionRequired: number // employers that need action now
}

// ── Pilot Offer Variants ──────────────────────────────────────────────────────

export function getPilotOfferVariants(): PilotOffer[] {
  return [
    {
      variant: 'validation',
      title: 'Validation Pilot',
      priceLabel: '0 € – 99 €/Monat (Vorschlag)',
      monthlyEstimate: 49,
      description:
        'Kostenloser oder symbolischer Zugang zur Plattform. Ziel: strukturiertes Feedback und erster Case. ' +
        'Arbeitgeber sieht Demo-Kandidatenpool und Matching-Interface. Admin betreut manuell. ' +
        'Kein Erfolgsversprechen. Kein automatischer Versand.',
      targetEmployer: 'Arbeitgeber die internationale Rekrutierung evaluieren und kein Budget-Commitment wollen.',
      noGuaranteeNote:
        'Keine Garantie für Vermittlung. Kein Versprechen auf Kandidatenverfügbarkeit. Pilot dient der Validierung.',
      isEstimate: true,
    },
    {
      variant: 'starter',
      title: 'Starter Pilot',
      priceLabel: '99 € – 149 €/Monat (Vorschlag)',
      monthlyEstimate: 149,
      description:
        'Erster bezahlter Pilot mit vollständigem Plattformzugang. Persönliche Betreuung, ' +
        'Kandidatenprofil-Sharing, Statusupdates. Monatlich kündbar. ' +
        'Kein Jahresvertrag. Ziel: ersten bezahlten Kunden gewinnen und Case dokumentieren.',
      targetEmployer: 'Arbeitgeber mit konkretem Personalbedarf, bereit für kontrollierte Erprobung.',
      noGuaranteeNote:
        'Kein garantiertes Match. Kandidatenpool wächst mit aktivem Betrieb. Preise sind Vorschläge.',
      isEstimate: true,
    },
    {
      variant: 'success_based',
      title: 'Success-Based Pilot',
      priceLabel: 'Niedrige Basis + Erfolgsgebühr bei Vermittlung (Annahme)',
      monthlyEstimate: 99,
      description:
        'Niedrige Monatspauschale (z.B. 99 €) plus Erfolgsgebühr bei erfolgreicher Vermittlung (z.B. 500 €). ' +
        'Risiko für Arbeitgeber minimal. Nur Zahlung bei tatsächlichem Wert. ' +
        'Modell ist Annahme — noch kein aktiver Vertrag dieser Art vorhanden.',
      targetEmployer: 'Arbeitgeber die kein Risiko eingehen wollen. Gut für erste Gespräche.',
      noGuaranteeNote:
        'ANNAHME/MODELL — kein bestehender Vertrag. Kein verifizierter Umsatz. Erfolgsgebühr setzt erfolgreiche Vermittlung voraus.',
      isEstimate: true,
    },
  ]
}

export function getOfferVariantForEmployer(
  industry: string | null,
  interestLevel?: string
): PilotOfferVariant {
  const i = (industry ?? '').toLowerCase()
  const interest = interestLevel ?? 'unknown'

  // High interest → starter pilot
  if (interest === 'very_high' || interest === 'high') return 'starter'

  // IT companies tend to prefer success-based
  if (i.includes('software') || i.includes('tech') || i.includes('it')) return 'success_based'

  // Care/nursing — known shortage, validation pilot to build trust
  if (i.includes('pflege') || i.includes('care') || i.includes('nursing') || i.includes('heim') || i.includes('klinik'))
    return 'validation'

  // Staffing agencies → success-based (they understand placement fees)
  if (i.includes('recruiter') || i.includes('personal') || i.includes('headhunter'))
    return 'success_based'

  // Unknown/medium interest → validation pilot (lowest barrier)
  return 'validation'
}

// ── Industry Pitches ──────────────────────────────────────────────────────────

export function inferPitchType(industry: string | null): IndustryPitchType {
  const i = (industry ?? '').toLowerCase()
  // Care / Nursing — check before IT to prevent 'hospital' → IT (hosp-IT-al)
  if (i.includes('pflege') || i.includes('care') || i.includes('nursing') ||
      i.includes('heim') || i.includes('klinik') || i.includes('hospital') ||
      i.includes('krankenhaus'))
    return 'care'
  // IT — use word boundary for 'it' to prevent false matches (personalvermittlung, recruit-er, etc.)
  if (i.includes('software') || i.includes('tech') || /\bit\b/.test(i))
    return 'it'
  // Construction — avoid matching 'bergbau', use word boundary for 'bau'
  if (/\bbau\b/.test(i) || i.includes('construct') || i.includes('handwerk') ||
      i.includes('elektrik') || i.includes('elektro') || i.includes('maurer') ||
      i.includes('installat'))
    return 'construction'
  // Hospitality
  if (i.includes('gastro') || i.includes('hotel') || i.includes('hospitality') ||
      i.includes('restaurant') || i.includes('küche'))
    return 'hospitality'
  // Logistics
  if (i.includes('logistik') || i.includes('logistics') || i.includes('transport') || i.includes('lkw'))
    return 'logistics'
  return 'other'
}

export function getIndustryPitch(pitchType: IndustryPitchType): IndustryPitch {
  const pitches: Record<IndustryPitchType, IndustryPitch> = {
    care: {
      industry: 'care',
      headline: 'Pflegekräfte aus dem Ausland — strukturiert, transparent, kontrolliert.',
      problem:
        'Deutschland fehlen bis 2035 über 300.000 Pflegekräfte. Lokale Rekrutierung reicht nicht. ' +
        'Internationale Vermittlung ist oft intransparent und teuer.',
      benefit:
        'Global Talent Bridge verbindet Sie mit vorqualifizierten Pflegekräften aus definierten ' +
        'Migrations-Korridoren. Transparente Matching-Kriterien. Admin-Freigabe-Workflow. ' +
        'Pilot zunächst ohne Vollautomatisierung — persönlich betreut.',
      pilotOffer:
        'Validation Pilot: 4 Wochen Plattformzugang, Demo-Kandidatenpool, Feedback-Gespräch. ' +
        '0–99 €/Monat als Einstieg.',
      nextAction: 'Demo-Gespräch vereinbaren: 30 Minuten, unverbindlich, kein Kauf nötig.',
      noFakeClaimsNote:
        'Noch kein aktiver zahlender Pilotkunde. Pilot-Infrastruktur ist bereit. ' +
        'Ehrliche Darstellung: kein Erfolgsversprechen.',
    },
    it: {
      industry: 'it',
      headline: 'Internationale IT-Fachkräfte — schneller als klassisches Recruiting.',
      problem:
        'Lokale IT-Fachkräfte sind knapp. Gehaltserwartungen steigen. ' +
        'Internationale Talente sind verfügbar, aber Visa/Anerkennungsprozesse sind komplex.',
      benefit:
        'Global Talent Bridge hat IT-Korridore mit hohem Supply-Score (Nigeria, Indien, Philippinen → EU/UK/Kanada). ' +
        'Vorqualifizierte Profile, CV-Upload, transparentes Matching. ' +
        'Keine Headhunter-Provision — SaaS-Modell.',
      pilotOffer:
        'Success-Based Pilot: Niedrige Monatspauschale + optional Erfolgsgebühr. ' +
        'Kein Risiko ohne Match.',
      nextAction: 'Kurzes Gespräch: Welche IT-Rollen sind offen? Welche Sprachkenntnisse nötig?',
      noFakeClaimsNote:
        'Kein Versprechen auf Sofort-Verfügbarkeit. Kandidatenpool wächst. ' +
        'Pilot dient der gemeinsamen Validierung.',
    },
    construction: {
      industry: 'construction',
      headline: 'Facharbeiter aus dem Ausland — für Bau, Handwerk und Infrastruktur.',
      problem:
        'Bauprojekte scheitern an Fachkräftemangel. Elektriker, Maurer, Installateure fehlen europaweit. ' +
        'Internationale Rekrutierung läuft oft über unstrukturierte Netzwerke.',
      benefit:
        'Global Talent Bridge hat Bau-Korridore (Marokko, Türkei → Deutschland). ' +
        'Kandidaten mit Sprach-Check und Berufsquali-Nachweis. ' +
        'Strukturierter Onboarding-Prozess, kein Wildwuchs.',
      pilotOffer:
        'Validation Pilot: Zugang zu Kandidatenprofilen aus 2 Korridoren. ' +
        'Persönliche Begleitung. 0–99 €/Monat.',
      nextAction: 'Klärung: Welche Berufe? Welche Zertifikate werden anerkannt? DGUV-Anforderungen?',
      noFakeClaimsNote:
        'Anerkennungsverfahren pro Bundesland unterschiedlich. Keine Garantie auf Anerkennung. ' +
        'Rechtsberatung separat empfohlen.',
    },
    hospitality: {
      industry: 'hospitality',
      headline: 'Köche, Servicekräfte, Hotelfachleute — international, strukturiert.',
      problem:
        'Gastgewerbe hat historisch hohe Fluktuation und saisonalen Mehrbedarf. ' +
        'Lokale Bewerber fehlen. Sprache ist oft Barriere.',
      benefit:
        'Global Talent Bridge hat Hospitality-Korridore mit sprachaffinen Kandidaten. ' +
        'Tunesien, Marokko → Frankreich, Deutschland. ' +
        'Vorauswahl nach Sprachniveau und Berufserfahrung.',
      pilotOffer:
        'Validation Pilot: 4 Wochen Profil-Sharing, 2–3 Demo-Kandidaten vorgestellt. ' +
        'Feedback für Weiterentwicklung der Plattform.',
      nextAction: 'Klärung: Welche Saison? Welches Sprachniveau? Unterkunft vorhanden?',
      noFakeClaimsNote:
        'Saisonarbeit hat spezifische Visa-Anforderungen. Keine Rechtsberatung. ' +
        'Pilot ist Validierungsphase, kein Platzierungsversprechen.',
    },
    logistics: {
      industry: 'logistics',
      headline: 'Lkw-Fahrer und Logistikfachkräfte aus dem Ausland.',
      problem:
        'Europa fehlen hunderttausende Lkw-Fahrer. Führerscheinklasse CE international anerkannt, ' +
        'aber Bürokratie ist komplex.',
      benefit:
        'Global Talent Bridge hat Logistik-Korridore (Kenia, Türkei → Deutschland). ' +
        'Kandidaten mit EU-Fahrerschein oder gleichwertigem Ausweis. ' +
        'Anerkennungsweg dokumentiert.',
      pilotOffer:
        'Validation Pilot: Klärung ob Korridor passt, Demo-Profile teilen. ' +
        'B1-Deutsch Mindestanforderung kommuniziert.',
      nextAction: 'Frage klären: Führerschein-Klasse, Einsatzregion, Nacht-/Wochenenddienst?',
      noFakeClaimsNote:
        'Führerscheinklassen-Anerkennung variiert. Keine Garantie für sofortige Einsetzbarkeit. ' +
        'Pilot ist Evaluierungsphase.',
    },
    other: {
      industry: 'other',
      headline: 'Internationale Fachkräfte für Ihren Bereich — strukturiert und transparent.',
      problem:
        'Fachkräftemangel betrifft viele Branchen. Internationale Rekrutierung ist aufwendig ' +
        'und intransparent.',
      benefit:
        'Global Talent Bridge bietet strukturiertes internationales Matching mit Admin-Kontrolle. ' +
        'Kein Wildwuchs, kein unkontrollierter Versand. ' +
        'Pilot: Validierung ob Korridor zu Ihrer Branche passt.',
      pilotOffer:
        'Validation Pilot: 4 Wochen Evaluation, keine langfristige Bindung, ' +
        'persönliche Betreuung.',
      nextAction: 'Klärungsgespräch: Welche Berufe? Welche Länder? Welche Anforderungen?',
      noFakeClaimsNote:
        'Keine Branchengarantie ohne Vorab-Klärung. Rechtliche Anforderungen je Branche prüfen.',
    },
  }
  return pitches[pitchType]
}

// ── Objection Handling ────────────────────────────────────────────────────────

export type ObjectionKey =
  | 'already_have_recruiter'
  | 'international_is_complex'
  | 'no_budget'
  | 'candidate_quality'
  | 'no_customers_yet'
  | 'legal_compliance'
  | 'how_fast'
  | 'after_pilot'

export function getObjectionResponse(key: ObjectionKey): ObjectionResponse {
  const responses: Record<ObjectionKey, ObjectionResponse> = {
    already_have_recruiter: {
      objectionKey: 'already_have_recruiter',
      objection: 'Wir haben schon Recruiter.',
      response:
        'Das ist gut. Recruiter und Global Talent Bridge schließen sich nicht aus. ' +
        'Wir ergänzen bestehende Sourcing-Kanäle um strukturierte internationale Korridore. ' +
        'Oft decken lokale Recruiter nur lokale Märkte ab — wir liefern Kandidaten, ' +
        'die sonst nicht erreichbar wären. Pilot: 4 Wochen testen ob das einen Unterschied macht.',
      honesty: 'positive',
    },
    international_is_complex: {
      objectionKey: 'international_is_complex',
      objection: 'Internationale Vermittlung ist kompliziert.',
      response:
        'Sie haben Recht — das ist sie. Visa, Anerkennung, Sprachanforderungen variieren je Land und Sektor. ' +
        'Deshalb arbeiten wir mit definierten Migrations-Korridoren, die rechtlich vorklärt sind. ' +
        'Wir übernehmen die Struktur — Sie entscheiden über jeden Kandidaten. ' +
        'Im Pilot klären wir gemeinsam welche Route für Sie konkret funktioniert.',
      honesty: 'candid',
    },
    no_budget: {
      objectionKey: 'no_budget',
      objection: 'Wir wollen erstmal keine Kosten.',
      response:
        'Verstanden. Deshalb gibt es einen Validation Pilot ohne oder mit symbolischen Kosten (0–99 €/Monat). ' +
        'Ziel ist nicht sofort Umsatz — Ziel ist zu prüfen ob der Ansatz zu Ihnen passt. ' +
        'Wenn es keinen Wert liefert, kein Vertrag. Wenn es Wert liefert, reden wir über Konditionen.',
      honesty: 'positive',
    },
    candidate_quality: {
      objectionKey: 'candidate_quality',
      objection: 'Wie prüfen Sie Kandidaten?',
      response:
        'Kandidaten durchlaufen: CV-Upload + Admin-Review, Sprachnachweis-Upload, ' +
        'Qualifikationsprüfung durch Admin. Automatische Verifikation durch Drittanbieter existiert noch nicht. ' +
        'Pilot = manuell betreut. Im Pilot entscheiden Sie welche Kandidaten interessant sind. ' +
        'Kein Kandidat wird ohne Admin-Freigabe weitergereicht.',
      honesty: 'candid',
    },
    no_customers_yet: {
      objectionKey: 'no_customers_yet',
      objection: 'Gibt es schon Kunden?',
      response:
        'Ehrliche Antwort: noch kein aktiver zahlender Pilotkunde. Die Plattform ist vollständig gebaut, ' +
        '410 Tests bestanden, 10 Arbeitgeber vorbereitet. Sie wären einer der ersten Piloten — ' +
        'das bedeutet direkte Aufmerksamkeit und Einfluss auf die Weiterentwicklung. ' +
        'Early Adopter haben oft die besten Konditionen.',
      honesty: 'candid',
    },
    legal_compliance: {
      objectionKey: 'legal_compliance',
      objection: 'Ist das rechtlich abgesichert?',
      response:
        'Internationale Arbeitsvermittlung ist in vielen Ländern reguliert (Deutschland: §291 SGB III). ' +
        'Wir empfehlen eine rechtliche Prüfung vor kommerziellem Einsatz. ' +
        'Im Pilot bleiben wir in einer beratenden Rolle — kein direktes Placement ohne Klärung. ' +
        'Wir sind kein Ersatz für einen Fachanwalt, aber wir helfen bei der Struktur.',
      honesty: 'candid',
    },
    how_fast: {
      objectionKey: 'how_fast',
      objection: 'Wie schnell bekommen wir Kandidaten?',
      response:
        'Im Pilot: Demo-Profile in 1–2 Wochen. Echte Kandidaten-Akquise dauert 4–8 Wochen pro Korridor, ' +
        'je nach Sprachanforderung und Anerkennungspfad. ' +
        'Wir sind ehrlich: kein Sofort-Lieferversprechen. ' +
        'Strukturierter Prozess sichert Qualität — schnelle Vermittlung die nicht hält ist teurer.',
      honesty: 'candid',
    },
    after_pilot: {
      objectionKey: 'after_pilot',
      objection: 'Was passiert nach dem Pilot?',
      response:
        'Nach dem Pilot entscheiden Sie ob Sie weitermachen wollen. ' +
        'Optionen: Starter-Abo (99–149 €/Monat), Success-Based-Modell, oder Ende ohne Vertragsbindung. ' +
        'Keine automatische Verlängerung. Kein Jahresvertrag ohne Ihre Zustimmung. ' +
        'Pilot-Erkenntnisse fließen direkt in die Plattform ein.',
      honesty: 'positive',
    },
  }
  return responses[key]
}

export function getAllObjectionResponses(): ObjectionResponse[] {
  const keys: ObjectionKey[] = [
    'already_have_recruiter',
    'international_is_complex',
    'no_budget',
    'candidate_quality',
    'no_customers_yet',
    'legal_compliance',
    'how_fast',
    'after_pilot',
  ]
  return keys.map(getObjectionResponse)
}

// ── Call Script ───────────────────────────────────────────────────────────────

export type CallScript = {
  opening: CallScriptSection
  qualifyingQuestions: CallScriptSection
  needsQuestions: CallScriptSection
  pitchSection: CallScriptSection
  closingSection: CallScriptSection
}

export function getCallScript(): CallScript {
  return {
    opening: {
      id: 'opening',
      label: '30-Sekunden-Eröffnung',
      script:
        'Guten Tag, mein Name ist [Name] von Global Talent Bridge. ' +
        'Wir helfen [Branche]-Unternehmen in [Land], qualifizierte internationale Fachkräfte ' +
        'strukturiert und transparent zu rekrutieren. ' +
        'Haben Sie kurz 5 Minuten? Ich möchte kurz klären ob unser Ansatz zu Ihnen passt.',
      notes:
        'Klar und ehrlich. Kein Druck. Ziel: Klärung ob Gespräch sinnvoll. ' +
        'Nicht: "Ich habe das perfekte Angebot für Sie."',
    },
    qualifyingQuestions: {
      id: 'qualifying',
      label: '3 Qualifizierungsfragen',
      script:
        '1. "Haben Sie aktuell offene Stellen, die Sie auch international besetzen würden?"\n' +
        '2. "Haben Sie in der Vergangenheit internationale Fachkräfte eingestellt oder evaluiert?"\n' +
        '3. "Wer ist bei Ihnen die Entscheidungsperson für Recruiting-Investitionen?"',
      notes:
        'Wenn alle 3 mit Nein: höflich beenden. ' +
        'Wenn min. 1 mit Ja: weiter. Kein Druck bei "Nein".',
    },
    needsQuestions: {
      id: 'needs',
      label: '3 Bedarfsfragen',
      script:
        '1. "Welche Berufe/Qualifikationen suchen Sie am dringendsten?"\n' +
        '2. "Was war bisher Ihre Haupthürde bei internationaler Rekrutierung?"\n' +
        '3. "Wenn wir in 4 Wochen 2–3 passende Profile liefern könnten — wäre das interessant?"',
      notes:
        'Aktiv zuhören. Keine eigene Agenda durchdrücken. ' +
        'Antworten bestimmen welches Angebot relevant ist.',
    },
    pitchSection: {
      id: 'pitch',
      label: 'Pilotangebot erklären',
      script:
        'Unser Validation Pilot: 4 Wochen Plattformzugang, [X] Demo-Kandidatenprofile aus [Korridor]. ' +
        'Sie sehen wie das Matching funktioniert, geben uns Feedback. ' +
        'Kosten: [0–99 €/Monat] als Vorschlag. Kein Jahresvertrag. Monatlich kündbar. ' +
        'Wenn es nichts bringt, kein Vertrag.',
      notes:
        'Preise sind Vorschläge. Nicht als fixe Preisliste präsentieren. ' +
        'Pilot ist Validierung für beide Seiten.',
    },
    closingSection: {
      id: 'closing',
      label: 'Nächster Schritt',
      script:
        'Was ich jetzt vorschlage: Ich schicke Ihnen kurz unsere Pilot-Übersicht per E-Mail. ' +
        'Wenn das interessant klingt, vereinbaren wir eine 30-minütige Demo. ' +
        'Unverbindlich. Kein Kaufdruck. Passt das für Sie?',
      notes:
        'Nächsten Schritt klar benennen. ' +
        'Keine sofortige Kaufentscheidung erwarten. ' +
        'Demo-Termin oder E-Mail-Follow-up als Minimalziel.',
    },
  }
}

// ── Response Classification ───────────────────────────────────────────────────

export function classifyEmployerResponse(rawInput: string): ResponseType {
  const lower = (rawInput ?? '').toLowerCase().trim()
  if (!lower) return 'no_response'

  if (lower.match(/pilot.*anfrag|pilot.*anfordern|pilot.*zusagen|ja.*pilot|interested.*pilot|pilot.*yes|let.*start|möchten.*pilot|wir.*pilot/i))
    return 'pilot_requested'
  if (lower.match(/demo.*anfragen|demo.*vereinbar|demo.*ja|yes.*demo|schedule.*demo/i))
    return 'demo_requested'
  if (lower.match(/sehr interessiert|toll|super|ja.*gerne|absolut|definitiv|great|fantastic|perfect/i))
    return 'positive'
  if (lower.match(/abgelehnt|kein interesse|nein danke|no thank|not interested|rejected|absage/i))
    return 'rejected'
  if (lower.match(/einwand|bedenken|concern|problem|kompliziert|zu teuer|not sure|unsure|ob das|schwierig/i))
    return 'objection'
  if (lower.match(/keine antwort|no response|nicht gemeldet|keine reaktion|unread|bounced/i))
    return 'no_response'
  if (lower.match(/interessant|interessiert|klingt gut|sounds good|could work|mal schauen|würde gerne|mal ansehen/i))
    return 'positive'

  return 'neutral'
}

// ── Status Suggestion ─────────────────────────────────────────────────────────

export function getSuggestedPilotStatus(
  currentStatus: ValidPilotStatus,
  responseType: ResponseType
): ValidPilotStatus | null {
  // Status progression map — only suggests, admin decides
  const progressionMap: Partial<Record<ValidPilotStatus, Partial<Record<ResponseType, ValidPilotStatus>>>> = {
    identified: {
      positive:         'interested',
      neutral:          'contacted_manual',
      objection:        'contacted_manual',
      demo_requested:   'demo_scheduled',
      pilot_requested:  'interested',
      rejected:         'rejected',
    },
    contacted_manual: {
      positive:         'interested',
      neutral:          'contacted_manual',
      objection:        'contacted_manual',
      demo_requested:   'demo_scheduled',
      pilot_requested:  'interested',
      rejected:         'rejected',
    },
    interested: {
      demo_requested:   'demo_scheduled',
      pilot_requested:  'onboarding',
      rejected:         'rejected',
      positive:         'demo_scheduled',
    },
    demo_scheduled: {
      pilot_requested:  'onboarding',
      positive:         'onboarding',
      rejected:         'rejected',
      neutral:          'interested',
    },
    onboarding: {
      positive:         'active_pilot',
      pilot_requested:  'active_pilot',
      rejected:         'rejected',
    },
  }

  return progressionMap[currentStatus]?.[responseType] ?? null
}

// ── Recommended Next Action ───────────────────────────────────────────────────

export function getRecommendedNextAction(
  currentStatus: ValidPilotStatus,
  lastResponseType?: ResponseType,
  daysSinceLastContact?: number
): string {
  const days = daysSinceLastContact ?? 0

  if (currentStatus === 'active_pilot')
    return 'Pilot läuft. Check-in in 1 Woche: Feedback einholen, Kandidaten-Matching starten.'

  if (currentStatus === 'onboarding')
    return 'Onboarding läuft. Plattformzugang bestätigen. Erste Kandidatenprofile teilen.'

  if (currentStatus === 'demo_scheduled')
    return 'Demo vorbereiten: 30 Min. Agenda, Live-Plattform-Zugang testen, 2–3 Demo-Profile bereitstellen.'

  if (currentStatus === 'rejected')
    return 'Als abgelehnt markiert. In 6 Monaten optional erneut ansprechen wenn neues Angebot verfügbar.'

  if (currentStatus === 'interested') {
    if (lastResponseType === 'demo_requested') return 'Demo-Termin vorschlagen. Konkrete Zeit/Datum anbieten.'
    return 'Pilot-Angebot konkretisieren: Welche Variante? Welcher Korridor? E-Mail mit Details senden.'
  }

  if (currentStatus === 'contacted_manual') {
    if (days >= 7) return 'Follow-up fällig: 7+ Tage ohne Antwort. Zweite Kontaktaufnahme via anderem Kanal.'
    if (lastResponseType === 'no_response') return 'Keine Antwort. Nach 5–7 Tagen Follow-up planen.'
    if (lastResponseType === 'objection') return 'Einwand notiert. Passende Antwort aus Objection Handling senden.'
    return 'Antwort abwarten. Follow-up nach 5–7 Tagen wenn keine Reaktion.'
  }

  if (currentStatus === 'identified')
    return 'Noch nicht kontaktiert. Passenden Outreach-Text aus /admin/pilot-outreach kopieren und manuell senden.'

  return 'Status prüfen. Nächste Aktion manuell festlegen.'
}

// ── Next Best Action per Employer ─────────────────────────────────────────────

export type PilotEmployerRow = {
  id: string
  company_name: string
  industry: string | null
  country: string
  status: string
  interest_level?: string | null
}

export function buildNextBestAction(employer: PilotEmployerRow): EmployerNextBestAction {
  const status = isValidPilotStatus(employer.status)
    ? (employer.status as ValidPilotStatus)
    : 'identified'

  const pitchType = inferPitchType(employer.industry)
  const offerVariant = getOfferVariantForEmployer(employer.industry, employer.interest_level ?? undefined)
  const recommendedAction = getRecommendedNextAction(status)

  const urgencyMap: Record<ValidPilotStatus, 'high' | 'medium' | 'low'> = {
    identified:        'high',
    contacted_manual:  'medium',
    interested:        'high',
    demo_scheduled:    'high',
    onboarding:        'high',
    active_pilot:      'medium',
    rejected:          'low',
  }

  const opportunityNoteMap: Record<ValidPilotStatus, string> = {
    identified:        'Noch nicht kontaktiert — höchste Priorität. Korrekte Outreach-Vorlage wählen.',
    contacted_manual:  'Kontaktiert aber ohne bestätigtes Interesse. Follow-up fokussieren.',
    interested:        'Interesse signalisiert. Demo oder konkretes Angebot als nächster Schritt.',
    demo_scheduled:    'Demo geplant. Vorbereitung entscheidet über Pilot-Konversion.',
    onboarding:        'Onboarding läuft. Reibungsloser Start bestimmt aktive Pilot-Qualität.',
    active_pilot:      'Aktiver Pilot. Feedback und Case Documentation sind jetzt Priorität.',
    rejected:          'Abgelehnt. Keine Energie verschwenden. Gelegentlich re-evaluieren.',
  }

  return {
    employerId: employer.id,
    employerName: employer.company_name,
    industry: employer.industry,
    country: employer.country,
    currentStatus: status,
    recommendedAction,
    suggestedPitchType: pitchType,
    suggestedOfferVariant: offerVariant,
    urgency: urgencyMap[status],
    opportunityNote: opportunityNoteMap[status],
  }
}

// ── Pipeline Summary ──────────────────────────────────────────────────────────

export function getPipelineSummary(employers: PilotEmployerRow[]): PipelineSummary {
  const byStatus: Record<string, number> = {}
  for (const status of VALID_PILOT_STATUSES) {
    byStatus[status] = 0
  }
  for (const e of employers) {
    if (isValidPilotStatus(e.status)) {
      byStatus[e.status] = (byStatus[e.status] ?? 0) + 1
    }
  }

  return {
    total: employers.length,
    byStatus,
    hotLeads: (byStatus['interested'] ?? 0) + (byStatus['demo_scheduled'] ?? 0) + (byStatus['onboarding'] ?? 0),
    activeCount: byStatus['active_pilot'] ?? 0,
    rejectedCount: byStatus['rejected'] ?? 0,
    contactedCount: byStatus['contacted_manual'] ?? 0,
    identifiedCount: byStatus['identified'] ?? 0,
    nextActionRequired: employers.filter((e) =>
      ['identified', 'interested', 'demo_scheduled'].includes(e.status)
    ).length,
  }
}

// ── Offer Labels ──────────────────────────────────────────────────────────────

export const OFFER_VARIANT_LABELS: Record<PilotOfferVariant, string> = {
  validation:    '🔬 Validation Pilot',
  starter:       '🚀 Starter Pilot',
  success_based: '💰 Success-Based Pilot',
}

export const RESPONSE_TYPE_LABELS: Record<ResponseType, string> = {
  no_response:    '— Keine Antwort',
  positive:       '✅ Positiv',
  neutral:        '➡️ Neutral',
  objection:      '⚠️ Einwand',
  rejected:       '❌ Abgelehnt',
  demo_requested: '📅 Demo angefragt',
  pilot_requested:'🚀 Pilot angefragt',
}

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  email_manual:     '📧 E-Mail (manuell)',
  whatsapp_manual:  '💬 WhatsApp (manuell)',
  linkedin_manual:  '🔗 LinkedIn (manuell)',
  call:             '📞 Telefon',
  demo:             '🖥️ Demo',
  note:             '📝 Notiz',
}
