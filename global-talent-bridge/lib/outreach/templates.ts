/**
 * lib/outreach/templates.ts
 *
 * Personalisierte Outreach-Templates für den Pilot-Start.
 *
 * SICHERHEITS-CONSTRAINTS:
 * - Keine externen Kosten
 * - Keine automatischen E-Mails
 * - Keine echten WhatsApp-Nachrichten
 * - Nur vorbereiten, anzeigen, kopierbar machen
 * - Der Admin versendet manuell
 */

export type EmployerType =
  | 'Pflegeheim'
  | 'Klinik'
  | 'IT-Unternehmen'
  | 'Personalvermittler'
  | 'Sprachschule'
  | 'Sonstige'

export type OutreachChannel = 'email' | 'whatsapp' | 'linkedin'

export type FeedbackState =
  | 'interesse'
  | 'kein_interesse'
  | 'rueckruf'
  | 'demo'
  | 'einwand'

export type OutreachTemplate = {
  employerType: EmployerType
  channel: OutreachChannel
  subject?: string  // nur für E-Mail
  body: string
}

export type EmployerContext = {
  companyName: string
  contactName: string | null
  country: string
  industry: string | null
  corridor: string  // z.B. "Philippinen → Deutschland (Pflege)"
}

// ── Korridor-Mapping ────────────────────────────────────────────────────────

export function inferCorridor(country: string, industry: string | null): string {
  const c = country.toLowerCase()
  const i = (industry ?? '').toLowerCase()

  // Reihenfolge spezifisch → allgemein (Substring-Kollisionen vermeiden)
  if (i.includes('pflege') || i.includes('care') || i.includes('nursing')) {
    if (c.includes('philippin') || c === 'ph') return 'Philippinen → Deutschland (Pflege)'
    if (c.includes('vietnam') || c === 'vn') return 'Vietnam → Deutschland (Pflege)'
    return `${country} → Deutschland (Pflege)`
  }

  if (i.includes('sprach') || i.includes('language') || i.includes('bildung')) {
    return `Mehrere Länder → Deutschland (Sprachausbildung)`
  }

  // 'recruiter' enthält 'it' als Substring → vor IT-Check prüfen
  if (i.includes('recruiter') || i.includes('personal') || i.includes('headhunter') || i.includes('hr')) {
    return `Globaler Talentpool → Ihre Kunden`
  }

  // 'it' nur als Wort (Wortgrenze), nicht als Teilstring (recruit, hospital, ...)
  if (i.includes('software') || i.includes('tech') || /\bit\b/.test(i)) {
    if (c.includes('indien') || c === 'in') return 'Indien → EU (IT / Software)'
    if (c.includes('ukraine') || c === 'ua') return 'Ukraine → Deutschland (IT)'
    return `${country} → EU (IT)`
  }

  // Fallback
  return `${country} → Deutschland`
}

export function getEmployerType(industry: string | null): EmployerType {
  const i = (industry ?? '').toLowerCase()
  // Reihenfolge wichtig: spezifisch → allgemein, um Substring-Kollisionen zu vermeiden
  if (i.includes('pflege') || i.includes('care') || i.includes('nursing') || i.includes('heim'))
    return 'Pflegeheim'
  // 'hospital' vor IT-Check, da 'hospital' den Substring 'it' (hosp-it-al) enthält
  if (i.includes('klinik') || i.includes('hospital') || i.includes('krankenhaus') || i.includes('klinisch'))
    return 'Klinik'
  // 'bildung' vor IT-Check, da 'bildungsinstitut' den Substring 'it' enthält
  if (i.includes('sprach') || i.includes('language') || i.includes('bildung') || i.includes('schule'))
    return 'Sprachschule'
  // 'personal'/'hr' vor IT-Check, da 'personalvermittlung'/'vermittlung' den Substring 'it' enthält
  if (i.includes('recruiter') || i.includes('personal') || i.includes('headhunter') || i.includes('hr'))
    return 'Personalvermittler'
  // 'it' nur als ganzes Wort (Wortgrenze via Regex), nicht als Teilstring
  if (i.includes('software') || i.includes('tech') || /\bit\b/.test(i))
    return 'IT-Unternehmen'
  return 'Sonstige'
}

// ── Anrede ──────────────────────────────────────────────────────────────────

function greeting(contactName: string | null): string {
  if (!contactName) return 'Sehr geehrte Damen und Herren'
  const firstName = contactName.split(' ')[0]
  return `Sehr geehrte/r Herr/Frau ${firstName}`
}

function greetingInformal(contactName: string | null): string {
  if (!contactName) return 'Hallo'
  const firstName = contactName.split(' ')[0]
  return `Hallo ${firstName}`
}

// ── E-Mail-Templates ─────────────────────────────────────────────────────────

function emailPflegeheim(ctx: EmployerContext): OutreachTemplate {
  const g = greeting(ctx.contactName)
  return {
    employerType: 'Pflegeheim',
    channel: 'email',
    subject: `Qualifiziertes Pflegepersonal aus dem Ausland – ${ctx.companyName}`,
    body: `${g},

mein Name ist [Ihr Name] und ich bin Gründer von Global Talent Bridge — einer Plattform, die qualifizierte Pflegekräfte aus dem Ausland mit deutschen Pflegeeinrichtungen zusammenbringt.

Ich melde mich, weil ich weiß, wie angespannt die Personalsituation im deutschen Pflegebereich aktuell ist — und weil wir einen strukturierten Lösungsansatz für genau dieses Problem entwickelt haben.

Was wir anbieten:
• Vorgeprüfte Pflegekräfte aus ${ctx.country} (${ctx.corridor})
• Vollständige Sprachdokumentation (B1/B2 Deutsch)
• Begleitung durch Anerkennungsverfahren
• Transparente Matchingkriterien: Erfahrung, Fachbereich, Verfügbarkeit

Für den Pilotstart arbeiten wir mit einer kleinen Zahl ausgewählter Einrichtungen zusammen — kostenlos und ohne Verpflichtung — um den Prozess gemeinsam zu verfeinern.

Hätten Sie 20 Minuten für ein kurzes Gespräch diese oder nächste Woche?

Mit freundlichen Grüßen
[Ihr Name]
Global Talent Bridge
[Telefon / WhatsApp]`,
  }
}

function emailKlinik(ctx: EmployerContext): OutreachTemplate {
  const g = greeting(ctx.contactName)
  return {
    employerType: 'Klinik',
    channel: 'email',
    subject: `Internationale Fachkräfte für Ihren Klinikbetrieb – ${ctx.companyName}`,
    body: `${g},

als Gründer von Global Talent Bridge möchte ich Ihnen kurz vorstellen, wie wir Kliniken und Krankenhäuser bei der strukturierten Gewinnung qualifizierter Fachkräfte aus dem Ausland unterstützen.

Unser aktueller Fokus-Korridor: ${ctx.corridor}

Was uns unterscheidet:
• Gezielte Vorauswahl nach Ihren Anforderungen (Fachgebiet, Sprachstand, Erfahrung)
• Digital abgebildeter Matching-Prozess — kein Excel-Chaos
• Transparente Kommunikation auf beiden Seiten (Klinik & Kandidat)
• Pilotzugang ohne Kosten — nur Feedback im Gegenzug

Gerne stelle ich Ihnen die Plattform in einem 20-minütigen Demo-Termin vor.

Wann passt es Ihnen?

Mit freundlichen Grüßen
[Ihr Name]
Global Talent Bridge
[Telefon / WhatsApp]`,
  }
}

function emailIT(ctx: EmployerContext): OutreachTemplate {
  const g = greeting(ctx.contactName)
  return {
    employerType: 'IT-Unternehmen',
    channel: 'email',
    subject: `Internationale IT-Talente direkt zu Ihnen – ${ctx.companyName}`,
    body: `${g},

ich schreibe Ihnen wegen eines Problems, das viele Tech-Unternehmen kennen: Qualifizierte Entwickler und IT-Fachkräfte sind in Deutschland rar — gleichzeitig gibt es international ein enormes ungenutztes Potenzial.

Global Talent Bridge verbindet international ausgebildete IT-Talente aus ${ctx.country} mit deutschen Unternehmen. Korridor: ${ctx.corridor}.

Was wir leisten:
• Vorgeprüfte Kandidaten mit verifizierten Skills (Stack, Erfahrung, Sprachstand)
• Matchingprozess mit klaren Kriterien — keine Blindbewerbungen
• Pilotzugang für ausgewählte Unternehmen (kostenlos, ohne Verpflichtung)
• Sie erhalten Kandidatenprofile + können Bewerbungen direkt im System einsehen

Hätten Sie Interesse an einer kurzen Vorstellung unserer Plattform?

Freundliche Grüße
[Ihr Name]
Global Talent Bridge
[Telefon / WhatsApp]`,
  }
}

function emailPersonalvermittler(ctx: EmployerContext): OutreachTemplate {
  const g = greeting(ctx.contactName)
  return {
    employerType: 'Personalvermittler',
    channel: 'email',
    subject: `Kooperation: Internationale Kandidaten für Ihre Kunden – ${ctx.companyName}`,
    body: `${g},

als Personalvermittler kennen Sie das Problem: Ihre Kunden suchen spezialisierte Fachkräfte — und der lokale Markt gibt es kaum her.

Ich bin Gründer von Global Talent Bridge und entwickle eine Plattform für strukturiertes internationales Recruiting. Wir bauen aktiv Kandidaten-Pipelines aus ${ctx.corridor}.

Kooperationsansatz:
• Sie senden uns Ihre offenen Positionen — wir matchen mit unserem internationalen Pool
• Ihre Kunden erhalten qualifizierte, vorgeprüfte Kandidatenprofile
• Transparentes Provisionsmodell ab dem ersten erfolgreichen Placement
• Kein Exklusivvertrag nötig

Ich suche für den Pilotstart 2–3 Recruiting-Partner, die echte Vakanzen einbringen und Feedback geben.

Hätten Sie Zeit für ein erstes Gespräch?

Freundliche Grüße
[Ihr Name]
Global Talent Bridge
[Telefon / WhatsApp]`,
  }
}

function emailSonstige(ctx: EmployerContext): OutreachTemplate {
  const g = greeting(ctx.contactName)
  return {
    employerType: 'Sonstige',
    channel: 'email',
    subject: `Internationale Fachkräfte für Ihr Unternehmen – ${ctx.companyName}`,
    body: `${g},

mein Name ist [Ihr Name] und ich bin Gründer von Global Talent Bridge — einer Plattform, die internationale Fachkräfte mit Arbeitgebern in Deutschland und Europa zusammenbringt.

Ich melde mich, weil wir Unternehmen wie ${ctx.companyName} dabei unterstützen, qualifizierte Mitarbeitende aus dem Ausland zu finden — strukturiert, transparent und ohne bürokratischen Aufwand.

Was wir bieten:
• Vorgeprüfte internationale Kandidaten passend zu Ihren Anforderungen
• Klare Matchingkriterien: Qualifikation, Sprachstand, Verfügbarkeit
• Pilotzugang ohne Kosten — wir suchen Feedback-Partner für die erste Phase
• Begleitung von der ersten Kontaktaufnahme bis zur Einstellung

Hätten Sie 20 Minuten für ein kurzes Kennenlerngespräch?

Mit freundlichen Grüßen
[Ihr Name]
Global Talent Bridge
[Telefon / WhatsApp]`,
  }
}

function emailSprachschule(ctx: EmployerContext): OutreachTemplate {
  const g = greeting(ctx.contactName)
  return {
    employerType: 'Sprachschule',
    channel: 'email',
    subject: `Kooperation mit Global Talent Bridge – Sprachvorbereitung für internationale Fachkräfte`,
    body: `${g},

mein Name ist [Ihr Name], ich bin Gründer von Global Talent Bridge — einer Matching-Plattform für internationale Fachkräfte und deutsche Arbeitgeber.

Ich wende mich an Sie, weil Sprachqualifikation in unserem Matching-Prozess ein Kernkriterium ist: Kandidaten mit B1/B2-Nachweis haben deutlich höhere Vermittlungschancen.

Kooperationsvorschlag:
• Ihre Sprachkurse werden als qualifizierendes Angebot auf unserer Plattform verwiesen
• Kandidaten in der Pipeline können aktiv auf Ihr Angebot hingewiesen werden
• Gemeinsame Sichtbarkeit: Global Talent Bridge-Kandidaten → Ihre Kurse → Vermittlung
• Für den Pilotstart: kostenlose Kooperation, gegenseitiger Mehrwert

Hätten Sie 20 Minuten für ein Gespräch über eine mögliche Zusammenarbeit?

Mit freundlichen Grüßen
[Ihr Name]
Global Talent Bridge
[Telefon / WhatsApp]`,
  }
}

// ── WhatsApp / LinkedIn-Templates ───────────────────────────────────────────

function whatsappTemplate(ctx: EmployerContext, type: EmployerType): OutreachTemplate {
  const g = greetingInformal(ctx.contactName)
  const korridorHint = ctx.corridor

  const bodies: Record<EmployerType, string> = {
    'Pflegeheim': `${g} 👋\n\nIch bin [Ihr Name] von Global Talent Bridge. Wir verbinden qualifizierte Pflegekräfte (${korridorHint}) mit deutschen Pflegeeinrichtungen.\n\nFür ${ctx.companyName}: Wäre ein kurzes Gespräch (15 Min.) möglich? Kein Verkaufsgespräch — nur Kennenlernen + ehrliches Feedback. 🙏`,
    'Klinik': `${g} 👋\n\nHier ist [Ihr Name] von Global Talent Bridge. Wir matchen internationale Fachkräfte (${korridorHint}) mit Kliniken in Deutschland.\n\nFür ${ctx.companyName}: Darf ich kurz vorstellen, wie das funktioniert? 15 Minuten würden reichen.`,
    'IT-Unternehmen': `${g} 👋\n\nIch bin [Ihr Name] von Global Talent Bridge. Wir verbinden IT-Talente aus dem Ausland (${korridorHint}) mit deutschen Tech-Unternehmen.\n\nHätten Sie kurz Zeit für ein Kennenlerngespräch? (15 Min., kein Sales-Call)`,
    'Personalvermittler': `${g} 👋\n\nMein Name ist [Ihr Name] — Gründer von Global Talent Bridge. Ich suche Recruiting-Partner für internationales Matching (${korridorHint}).\n\nKooperation auf Augenhöhe — kein Exklusivvertrag. Hätten Sie Zeit für ein kurzes Gespräch?`,
    'Sprachschule': `${g} 👋\n\nIch bin [Ihr Name] von Global Talent Bridge. Wir vermitteln internationale Fachkräfte nach Deutschland und suchen Sprachschulpartner für die B1/B2-Vorbereitung.\n\nWäre eine Kooperation interessant? Gerne kurzes Kennenlernen (15 Min.).`,
    'Sonstige': `${g} 👋\n\nIch bin [Ihr Name] von Global Talent Bridge — einer Plattform für internationales Fachkräfte-Matching.\n\nFür ${ctx.companyName}: Hätten Sie kurz Zeit für ein erstes Gespräch?`,
  }

  return {
    employerType: type,
    channel: 'whatsapp',
    body: bodies[type],
  }
}

function linkedinTemplate(ctx: EmployerContext, type: EmployerType): OutreachTemplate {
  const g = greetingInformal(ctx.contactName)

  const bodies: Record<EmployerType, string> = {
    'Pflegeheim': `${g},\n\nich bin Gründer von Global Talent Bridge — einer Matching-Plattform, die qualifizierte Pflegekräfte aus ${ctx.country} mit deutschen Pflegeeinrichtungen verbindet (${ctx.corridor}).\n\nIch suche für den Pilotstart ausgewählte Einrichtungen wie ${ctx.companyName}. Wäre ein kurzes Kennenlerngespräch möglich?\n\nViele Grüße,\n[Ihr Name]`,
    'Klinik': `${g},\n\nals Gründer von Global Talent Bridge verbinde ich international qualifizierte Fachkräfte (${ctx.corridor}) mit deutschen Kliniken.\n\nIch suche Pilotpartner — kein Vertrag, nur ehrliches Feedback. Hätten Sie 20 Minuten?\n\nViele Grüße,\n[Ihr Name]`,
    'IT-Unternehmen': `${g},\n\nich entwickle Global Talent Bridge, eine Plattform für strukturiertes internationales Recruiting im IT-Bereich (${ctx.corridor}).\n\nFür ${ctx.companyName}: Pilot-Zugang ohne Kosten, echter Kandidatenpool. Darf ich kurz vorstellen?\n\nBeste Grüße,\n[Ihr Name]`,
    'Personalvermittler': `${g},\n\nals Gründer von Global Talent Bridge suche ich Recruiting-Partner für den Pilotstart. Wir haben einen wachsenden internationalen Kandidatenpool (${ctx.corridor}) und suchen Partner, die offene Positionen einbringen.\n\nInteressiert?\n\nBeste Grüße,\n[Ihr Name]`,
    'Sprachschule': `${g},\n\nich bin Gründer von Global Talent Bridge und suche Sprachschulpartner für die B1/B2-Vorbereitung unserer internationalen Kandidaten.\n\nKooperation auf Augenhöhe — gerne kurzes Kennenlerngespräch?\n\nMit freundlichen Grüßen,\n[Ihr Name]`,
    'Sonstige': `${g},\n\nich bin Gründer von Global Talent Bridge, einer Plattform für internationales Fachkräfte-Matching. Darf ich kurz vorstellen, was wir machen?\n\nMit freundlichen Grüßen,\n[Ihr Name]`,
  }

  return {
    employerType: type,
    channel: 'linkedin',
    body: bodies[type],
  }
}

// ── Haupt-Funktion: alle Templates für einen Arbeitgeber ─────────────────────

export function generateTemplates(ctx: EmployerContext): {
  email: OutreachTemplate
  whatsapp: OutreachTemplate
  linkedin: OutreachTemplate
  type: EmployerType
  corridor: string
} {
  const type = getEmployerType(ctx.industry)

  const emailFns: Record<EmployerType, (c: EmployerContext) => OutreachTemplate> = {
    'Pflegeheim':          emailPflegeheim,
    'Klinik':              emailKlinik,
    'IT-Unternehmen':      emailIT,
    'Personalvermittler':  emailPersonalvermittler,
    'Sprachschule':        emailSprachschule,
    'Sonstige':            emailSonstige,
  }

  return {
    type,
    corridor: ctx.corridor,
    email:     emailFns[type](ctx),
    whatsapp:  whatsappTemplate(ctx, type),
    linkedin:  linkedinTemplate(ctx, type),
  }
}

// ── Feedback-State-Labels ─────────────────────────────────────────────────────

export const FEEDBACK_STATE_LABELS: Record<FeedbackState, string> = {
  interesse:      '✅ Interesse gezeigt',
  kein_interesse: '❌ Kein Interesse',
  rueckruf:       '📞 Rückruf gewünscht',
  demo:           '🎯 Demo-Termin vereinbart',
  einwand:        '⚠️ Einwand / Frage',
}

export const FEEDBACK_STATE_NOTES: Record<FeedbackState, string> = {
  interesse:      'Kandidat/Arbeitgeber hat echtes Interesse gezeigt. Nächster Schritt: Demo vereinbaren.',
  kein_interesse: 'Kein Interesse. Status → rejected. Ggf. in 3-6 Monaten erneut kontaktieren.',
  rueckruf:       'Hat um Rückruf gebeten. Status → contacted_manual. Follow-up Datum setzen.',
  demo:           'Demo-Termin vereinbart. Status → demo_scheduled. Kalendereintrag erstellen.',
  einwand:        'Hat Einwand oder Frage geäußert. Antwort vorbereiten und nachfassen.',
}

// ── Pilot-Status-Labels ──────────────────────────────────────────────────────

export const PILOT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  identified:      { label: 'Identifiziert',     color: 'text-gray-400' },
  contacted_manual:{ label: 'Kontaktiert',        color: 'text-blue-400' },
  interested:      { label: 'Interessiert',       color: 'text-yellow-400' },
  demo_scheduled:  { label: 'Demo geplant',       color: 'text-purple-400' },
  onboarding:      { label: 'Onboarding',         color: 'text-orange-400' },
  active_pilot:    { label: 'Aktiver Pilot',      color: 'text-green-400' },
  rejected:        { label: 'Abgelehnt',          color: 'text-red-400' },
}
