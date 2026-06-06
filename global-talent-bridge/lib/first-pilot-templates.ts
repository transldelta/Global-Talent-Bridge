/**
 * lib/first-pilot-templates.ts
 *
 * Reine Funktionen für die Einladungsvorlagen des First-Pilot-Assistenten.
 * Keine Seiteneffekte. Kein Versand. Nur Text-Generierung.
 *
 * Importierbar in Client Components und Tests.
 */

const REGISTER_LINK = 'https://corridorwork.com/auth/register?role=employer'
const SIGNATURE = '– CorridorWork Team\n  https://corridorwork.com'

/** WhatsApp-Vorlage: kurz, direkt, ~8 Zeilen */
export function generateWhatsAppTemplate(companyName: string, contactName: string): string {
  const greeting = contactName.trim()
    ? `Hallo ${contactName.trim()},`
    : 'Hallo,'

  return `${greeting}

ich entwickle gerade CorridorWork — eine Plattform, die Arbeitgeber strukturiert mit internationalen Fachkräften matcht (transparenter Matching-Score, kein Lebenslauf-Chaos).

Ich suche 2–3 Pilotbetriebe, die das kostenlos und unverbindlich testen. ${companyName.trim() ? `Ich dachte dabei an ${companyName.trim()}.` : ''}

Was du bekommst: Firmenprofil anlegen + erste Stelle einstellen + passende Kandidatenprofile mit Score sehen.

Kein Abo, keine automatischen E-Mails, kein Risiko.

Registrierung: ${REGISTER_LINK}

Interesse? Kurz "Ja" reicht — ich begleite dich beim Setup.

${SIGNATURE}`
}

/** LinkedIn-Vorlage: professionell, mit Bullet-Liste */
export function generateLinkedInTemplate(companyName: string, contactName: string): string {
  const firstName = contactName.trim().split(' ')[0] || 'Guten Tag'
  const greeting = contactName.trim() ? `Hallo ${firstName},` : 'Guten Tag,'

  return `${greeting}

ich entwickle CorridorWork — ein Matching-Tool für Arbeitgeber, die gezielt internationale Fachkräfte suchen. Das System berechnet einen transparenten Score (0–100 %) basierend auf Branche, Erfahrung und Sprachlevel.${companyName.trim() ? `\n\nIch würde mich freuen, wenn ${companyName.trim()} zu unseren ersten Pilot-Betrieben gehört.` : ''}

Was du bekommst:
- Kostenloses Firmenprofil + Stellenanzeige
- Matching-Score mit realen Kandidatenprofilen
- Transparente Auswertung: Warum passt wer?

Was du NICHT bekommst:
- Keine automatischen E-Mails an Kandidaten
- Keine Zahlungspflicht
- Keine Verpflichtung nach der Testphase

Der Pilot ist vollständig kostenlos und unverbindlich.

Registrierung: ${REGISTER_LINK}

Lust, dabei zu sein?

${SIGNATURE}`
}

/** E-Mail-Vorlage: formal, mit Betreff */
export function generateEmailTemplate(
  companyName: string,
  contactName: string,
): { subject: string; body: string } {
  const salutation = contactName.trim()
    ? `Sehr geehrte/r ${contactName.trim()},`
    : 'Sehr geehrte Damen und Herren,'

  const companyRef = companyName.trim()
    ? `Ich wende mich an Sie mit einer Einladung zum kostenlosen Pilotprogramm von CorridorWork — für ${companyName.trim()}.`
    : 'Ich wende mich an Sie mit einer Einladung zum kostenlosen Pilotprogramm von CorridorWork.'

  const subject = `Einladung zum kostenlosen CorridorWork Pilot — Internationales Fachkräfte-Matching`

  const body = `${salutation}

${companyRef}

CorridorWork ist eine Matching-Plattform für Arbeitgeber, die strukturiert nach internationalen Fachkräften suchen. Das System berechnet einen transparenten Score (0–100 %) und zeigt Ihnen, welche Kandidatenprofile zu Ihren Stellenanforderungen passen — und warum.

Was der Pilot umfasst:
→ Firmenprofil anlegen (Branche, Land, Beschreibung)
→ Stellenanzeige mit definierten Anforderungen erstellen
→ Matching-Ergebnisse mit Score-Breakdown einsehen

Was der Pilot nicht umfasst:
→ Keine automatischen E-Mails an Kandidaten
→ Keine Zahlungspflicht — der Pilot ist vollständig kostenlos
→ Keine Verpflichtung nach der Testphase

Zur Registrierung genügt ein Klick:
${REGISTER_LINK}

Ich begleite Sie beim ersten Setup gerne persönlich.

Mit freundlichen Grüßen
${SIGNATURE}`

  return { subject, body }
}
