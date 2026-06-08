/**
 * lib/first-pilot-templates.ts
 *
 * Pure functions for First Pilot Assistant — outreach templates, qualification
 * criteria, and inbound response drafts.
 * No side effects. No sending. Text generation only.
 *
 * Importable in Client Components and Tests.
 */

const REGISTER_LINK = 'https://corridorwork.com/auth/register?role=employer'
const SIGNATURE = '– CorridorWork Team\n  https://corridorwork.com'
const SIGNATURE_EN = '— CorridorWork Team\n  https://corridorwork.com'

// ── Qualification Criteria ────────────────────────────────────────────────────

/** Characteristics of a suitable pilot employer. */
export const PILOT_GOOD_CRITERIA: { label: string; desc: string }[] = [
  {
    label: 'Genuine workforce demand',
    desc: 'Has a real, specific hiring need — not theoretical or exploratory.',
  },
  {
    label: 'Clear sector & role',
    desc: 'Can name the industry and type of role they are hiring for.',
  },
  {
    label: 'Open to international candidates',
    desc: 'Willing to consider qualified candidates from other countries.',
  },
  {
    label: 'Reachable contact person',
    desc: 'Has a named HR or decision-maker we can speak with directly.',
  },
  {
    label: 'Accepts manual review process',
    desc: 'Understands that matching is reviewed by a human, not automated.',
  },
  {
    label: 'No guarantees expected',
    desc: 'Does not expect a job guarantee, visa support, or placement guarantee.',
  },
  {
    label: 'Realistic scope',
    desc: 'Not expecting immediate mass placement — open to starting small.',
  },
]

/** Red flags that make an employer unsuitable or risky. */
export const PILOT_RED_FLAGS: { label: string; desc: string }[] = [
  {
    label: 'Requesting job guarantee',
    desc: 'Expects guaranteed employment outcomes — we cannot provide this.',
  },
  {
    label: 'Requesting visa guarantee',
    desc: 'Expects visa processing or immigration outcomes — outside our scope.',
  },
  {
    label: 'Requesting candidate fees',
    desc: 'Wants to charge candidates — not permitted on CorridorWork.',
  },
  {
    label: 'Expecting mass placement',
    desc: 'Wants hundreds of candidates delivered automatically — not our model.',
  },
  {
    label: 'Unverifiable company',
    desc: 'No verifiable address, registration, or contact information.',
  },
  {
    label: 'Legally ambiguous request',
    desc: 'Crosses into AÜG (temp staffing) territory — requires legal review first.',
  },
  {
    label: 'Pressure for automated outreach',
    desc: 'Insists on automated candidate contact — against our current policy.',
  },
]

// ── Commercial Readiness ──────────────────────────────────────────────────────

/** Current commercial readiness status — honest, no fake metrics. */
export const COMMERCIAL_READINESS = {
  pilotReady:         true,
  inboundReady:       true,
  paymentReady:       false,
  legalReviewNeeded:  true,
  automaticOutreach:  false,
  candidateFeeActive: false,
  jobGuarantee:       false,
  visaGuarantee:      false,
} as const

// ── Outreach Templates (German) ───────────────────────────────────────────────

/** WhatsApp template: short, direct */
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

/** LinkedIn template: professional, with bullet list */
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

/** Email template: formal, with subject */
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

// ── Inbound Response Drafts (English) ────────────────────────────────────────

/**
 * Response to a well-qualified inbound employer lead.
 * Professional, concise, no guarantees, signed CorridorWork Team.
 */
export function generateResponseGoodEmployer(companyName: string): string {
  const company = companyName.trim() || 'your organisation'
  return `Thank you for reaching out to CorridorWork.

We have reviewed the workforce demand submitted by ${company} and it looks like a strong match for our pilot programme.

Here is what happens next:

1. We will review your submission in detail — manually, no automated steps.
2. If your requirements align with available candidate corridors, we will prepare a structured overview.
3. We will reach out to schedule a brief introductory call to walk through the matching results together.

Please note:
— No job guarantee is provided at any stage.
— No visa services are offered or implied.
— No automated candidate outreach will take place without your explicit approval.
— The pilot is free of charge and non-binding.

We aim to respond with next steps within 3–5 business days.

${SIGNATURE_EN}`
}

/**
 * Response to an employer lead that needs clarification before qualifying.
 * Friendly, specific questions, no commitment.
 */
export function generateResponseUnclearEmployer(companyName: string): string {
  const company = companyName.trim() || 'your organisation'
  return `Thank you for your interest in CorridorWork.

We have received the workforce demand submission from ${company} and would like to learn a bit more before we can assess a potential fit.

Could you help us with the following:

1. What specific role or job title are you looking to fill?
2. Which industry or sector does the position fall under?
3. Is your organisation open to candidates who would need to relocate internationally?
4. Is there a named contact person on your side we can follow up with directly?

We want to make sure any match we prepare is relevant and realistic — which requires a clear picture of your actual hiring need.

There is no obligation on your side, and this clarification step is part of our standard manual review process.

${SIGNATURE_EN}`
}

/**
 * Response when a lead carries legal or compliance risk.
 * Polite, clear, non-committal. Refers to compliance review.
 */
export function generateResponseLegalRisk(companyName: string): string {
  const company = companyName.trim() || 'your organisation'
  return `Thank you for reaching out to CorridorWork.

We appreciate the interest from ${company} and have reviewed your submission carefully.

At this time, we are unable to proceed with your request as submitted. Based on the details provided, this engagement would require additional legal and compliance review before we could responsibly move forward.

Specifically, we are not in a position to:
— Guarantee employment outcomes or placement results.
— Provide visa or immigration services.
— Arrange temporary staffing arrangements that fall under local labour law (e.g. AÜG in Germany).

If the requirements change or you would like to discuss an adjusted scope, we are happy to re-evaluate at a later stage.

We wish you success in finding the right solution for your hiring needs.

${SIGNATURE_EN}`
}

/**
 * Response when an employer is better suited as a partner or agency.
 * Redirects to /partners, no hard rejection.
 */
export function generateResponsePartnerAlternative(companyName: string): string {
  const company = companyName.trim() || 'your organisation'
  return `Thank you for your message to CorridorWork.

After reviewing the submission from ${company}, we believe there may be a better fit under our partner programme rather than as a direct pilot employer.

Our partner track is designed for:
— Recruiting agencies seeking access to international candidate corridors
— Staffing firms looking for structured cross-border matching infrastructure
— B2B platforms integrating global talent sourcing

If this describes your situation more accurately, we would encourage you to submit a partnership enquiry via:
https://corridorwork.com/partners

There is no obligation, and the discussion is non-binding. We aim to respond to all partner enquiries within 5 business days.

${SIGNATURE_EN}`
}
