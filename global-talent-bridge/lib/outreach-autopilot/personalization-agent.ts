/**
 * lib/outreach-autopilot/personalization-agent.ts
 *
 * Personalization Agent
 *
 * Aufgabe: Erstellt eine kurze, menschlich klingende Pilot-Einladungsnachricht.
 *
 * Invarianten:
 * - Immer: kostenlos, unverbindlich, kein Abo, keine automatische Zahlung
 * - Immer: Link https://corridorwork.com/auth/register?role=employer
 * - Immer: Signatur "CorridorWork Team"
 * - Kein aggressiver Verkauf, kein Marketing-Blabla
 * - Kein persönlicher Absendername
 *
 * Reine Funktion. Kein DB-Call, kein API-Call.
 */
import type { CompanyProfile, ContactMethod, DraftMessage } from './types'

const REGISTER_LINK = 'https://corridorwork.com/auth/register?role=employer'
const SIGNATURE_SHORT = '– CorridorWork Team\n  https://corridorwork.com'
const SIGNATURE_FORMAL = 'Mit freundlichen Grüßen\nCorridorWork Team\nhttps://corridorwork.com'

// ── Sector-spezifische Aussagen ────────────────────────────────────────────────

function getSectorNote(sector: string | null | undefined): string {
  if (!sector) return ''
  const s = sector.toLowerCase()
  if (s.includes('pflege') || s.includes('gesundheit') || s.includes('klinik'))
    return 'Wir sehen im Gesundheits- und Pflegebereich besonders viel Matching-Potenzial mit qualifizierten internationalen Fachkräften. '
  if (s.includes('bau') || s.includes('handwerk'))
    return 'Im Bau- und Handwerksbereich gibt es viele passende internationale Fachkräfte, die wir auf der Plattform haben. '
  if (s.includes('it') || s.includes('software') || s.includes('tech'))
    return 'Im IT-Bereich kommen viele internationale Kandidaten mit starken technischen Skills — unser Matching zeigt das transparent. '
  if (s.includes('logistik') || s.includes('transport'))
    return 'In Logistik und Transport sehen wir starkes Matching mit internationalen Fachkräften. '
  if (s.includes('gastronomie') || s.includes('hotel') || s.includes('gastro'))
    return 'Im Gastgewerbe gibt es gute Kandidaten-Profile auf CorridorWork — der Pilot zeigt dir, welche passen. '
  return ''
}

// ── WhatsApp Vorlage ──────────────────────────────────────────────────────────

function generateWhatsApp(profile: CompanyProfile): DraftMessage {
  const name = profile.contact_person?.trim()
  const greeting = name ? `Hallo ${name},` : 'Hallo,'
  const companyRef = profile.company_name ? ` Ich dachte dabei an ${profile.company_name}.` : ''
  const sectorNote = getSectorNote(profile.sector)

  const body = `${greeting}

ich entwickle CorridorWork — eine Plattform, die Arbeitgeber strukturiert mit internationalen Fachkräften matcht (transparenter Matching-Score, kein Lebenslauf-Chaos).

Wir suchen 2–3 Pilotbetriebe, die CorridorWork kostenlos und unverbindlich testen.${companyRef} ${sectorNote}
Was du bekommst: Firmenprofil anlegen + Stelle einstellen + passende Kandidatenprofile mit Score sehen.

Kein Abo, keine automatischen E-Mails, keine automatische Zahlung, kein Risiko.

Registrierung: ${REGISTER_LINK}

Interesse? Kurz "Ja" reicht — ich begleite dich beim Setup.

${SIGNATURE_SHORT}`

  return {
    body:      body.replace(/  +/g, ' ').trim(),
    channel:   'whatsapp',
    wordCount: body.split(/\s+/).length,
    hasCTA:    true,
  }
}

// ── LinkedIn Vorlage ──────────────────────────────────────────────────────────

function generateLinkedIn(profile: CompanyProfile): DraftMessage {
  const rawName = profile.contact_person?.trim() ?? ''
  const firstName = rawName ? rawName.split(' ')[0] : ''
  const greeting = firstName ? `Hallo ${firstName},` : 'Guten Tag,'
  const companyRef = profile.company_name
    ? `\n\nIch würde mich freuen, wenn ${profile.company_name} zu unseren ersten Pilot-Betrieben gehört.`
    : ''
  const sectorNote = getSectorNote(profile.sector)

  const body = `${greeting}

ich baue CorridorWork — ein Matching-Tool für Arbeitgeber, die gezielt internationale Fachkräfte suchen. ${sectorNote}Das System berechnet einen transparenten Score (0–100 %) und zeigt dir, warum jemand passt.${companyRef}

Was du bekommst:
- Kostenloses Firmenprofil + Stellenanzeige
- Matching-Score mit realen Kandidatenprofilen
- Transparente Auswertung: Warum passt wer?

Was du NICHT bekommst:
- Keine automatischen E-Mails an Kandidaten
- Keine Zahlungspflicht
- Keine Verpflichtung nach der Testphase
- Kein Abo, keine automatische externe Kontaktaufnahme

Der Pilot ist vollständig kostenlos und unverbindlich.

Registrierung: ${REGISTER_LINK}

Lust, dabei zu sein?

${SIGNATURE_SHORT}`

  return {
    body:      body.replace(/  +/g, ' ').trim(),
    channel:   'linkedin',
    wordCount: body.split(/\s+/).length,
    hasCTA:    true,
  }
}

// ── E-Mail Vorlage ────────────────────────────────────────────────────────────

function generateEmail(profile: CompanyProfile): DraftMessage {
  const name = profile.contact_person?.trim()
  const salutation = name ? `Sehr geehrte/r ${name},` : 'Sehr geehrte Damen und Herren,'
  const companyRef = profile.company_name
    ? `Ich wende mich an Sie mit einer Einladung zum kostenlosen Pilotprogramm von CorridorWork — für ${profile.company_name}.`
    : 'Ich wende mich an Sie mit einer Einladung zum kostenlosen Pilotprogramm von CorridorWork.'
  const sectorNote = getSectorNote(profile.sector)

  const subject = `Einladung zum kostenlosen CorridorWork Pilot — Internationales Fachkräfte-Matching`

  const body = `${salutation}

${companyRef}

CorridorWork ist eine Matching-Plattform für Arbeitgeber, die strukturiert nach internationalen Fachkräften suchen. ${sectorNote}Das System berechnet einen transparenten Score (0–100 %) und zeigt Ihnen, welche Kandidatenprofile zu Ihren Stellenanforderungen passen — und warum.

Was der Pilot umfasst:
→ Firmenprofil anlegen (Branche, Land, Beschreibung)
→ Stellenanzeige mit definierten Anforderungen erstellen
→ Matching-Ergebnisse mit Score-Breakdown einsehen

Was der Pilot nicht umfasst:
→ Keine automatischen E-Mails an Kandidaten
→ Keine Zahlungspflicht — der Pilot ist vollständig kostenlos
→ Keine Verpflichtung nach der Testphase
→ Kein Abo, keine automatische externe Kontaktaufnahme

Zur Registrierung genügt ein Klick:
${REGISTER_LINK}

Ich begleite Sie beim ersten Setup gerne persönlich.

${SIGNATURE_FORMAL}`

  return {
    subject,
    body:      body.replace(/  +/g, ' ').trim(),
    channel:   'email',
    wordCount: body.split(/\s+/).length,
    hasCTA:    true,
  }
}

// ── Persönlich / Sonstiges ────────────────────────────────────────────────────

function generatePersonal(profile: CompanyProfile): DraftMessage {
  const name = profile.contact_person?.trim()
  const greeting = name ? `Hallo ${name},` : 'Hallo,'
  const companyRef = profile.company_name ? `Ich dachte dabei an ${profile.company_name}. ` : ''
  const sectorNote = getSectorNote(profile.sector)

  const body = `${greeting}

kurze Info: Ich entwickle CorridorWork — ein Matching-Tool, das Arbeitgeber mit internationalen Fachkräften zusammenbringt. ${sectorNote}
Wir suchen 2–3 Pilotbetriebe die das kostenlos und unverbindlich testen. ${companyRef}
Firmenprofil anlegen, Stelle einstellen, Matching-Score sehen — kein Abo, kein Risiko.

Registrierung: ${REGISTER_LINK}

${SIGNATURE_SHORT}`

  return {
    body:      body.replace(/  +/g, ' ').trim(),
    channel:   'personal',
    wordCount: body.split(/\s+/).length,
    hasCTA:    true,
  }
}

// ── Main Export ────────────────────────────────────────────────────────────────

/**
 * Erstellt eine personalisierte Pilot-Einladungsnachricht basierend auf
 * CompanyProfile und gewünschtem Kontaktkanal.
 */
export function generateDraftMessage(
  profile: CompanyProfile,
  channel?: ContactMethod,
): DraftMessage {
  const ch = channel ?? profile.contact_method ?? 'personal'

  switch (ch) {
    case 'whatsapp': return generateWhatsApp(profile)
    case 'linkedin': return generateLinkedIn(profile)
    case 'email':    return generateEmail(profile)
    default:         return generatePersonal(profile)
  }
}

/**
 * Empfiehlt den optimalen Kontaktkanal basierend auf vorhandenen Infos.
 */
export function recommendChannel(profile: CompanyProfile): ContactMethod {
  if (profile.contact_method && profile.contact_method !== 'personal') {
    return profile.contact_method
  }
  if (profile.contact_address?.includes('@')) return 'email'
  if (profile.hasWebsite) return 'linkedin'
  return 'whatsapp'
}
