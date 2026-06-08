/**
 * lib/contact-copilot.ts
 *
 * Pure functions for the Approval-Based Contact Copilot.
 * No side effects. No automatic sending. No scraping. No network calls.
 * Generates messages, mailto links, autofill helpers, and checklists only.
 *
 * The user always reviews and sends manually.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type ContactRoute =
  | 'language_school'
  | 'recruiting_agency'
  | 'relocation_partner'
  | 'employer_network'

export type ContactStatus =
  | 'draft_prepared'
  | 'awaiting_review'
  | 'screenshot_sent'
  | 'approved'
  | 'sent_manually'
  | 'replied'
  | 'rejected'

export interface ContactTarget {
  companyName:    string
  website:        string
  contactPageUrl: string
  contactEmail:   string
  sector:         string
  country:        string
  contactPerson:  string
  notes:          string
}

export interface GeneratedMessage {
  subject: string
  body:    string
  route:   ContactRoute
}

// ── Sender ────────────────────────────────────────────────────────────────────

export const SENDER = {
  name:    'CorridorWork Team',
  email:   'transl.delta@gmail.com',
  website: 'https://corridorwork.com',
} as const

// ── Route config ──────────────────────────────────────────────────────────────

export const CONTACT_ROUTES: { value: ContactRoute; label: string; desc: string }[] = [
  {
    value: 'language_school',
    label: 'Language school / Training provider',
    desc:  'Sprachschulen, vocational training, placement coordinators in DACH',
  },
  {
    value: 'recruiting_agency',
    label: 'Recruiting / Staffing agency',
    desc:  'International recruiting agencies, staffing firms',
  },
  {
    value: 'relocation_partner',
    label: 'Relocation partner',
    desc:  'Relocation service providers working with HR teams',
  },
  {
    value: 'employer_network',
    label: 'Employer / HR network',
    desc:  'Industry associations, HR networks, employer groups',
  },
]

// ── Status options ────────────────────────────────────────────────────────────

export const CONTACT_STATUS_OPTIONS: { value: ContactStatus; label: string }[] = [
  { value: 'draft_prepared',    label: 'Draft prepared'          },
  { value: 'awaiting_review',   label: 'Awaiting user review'    },
  { value: 'screenshot_sent',   label: 'Screenshot sent for approval' },
  { value: 'approved',          label: 'Approved to send manually' },
  { value: 'sent_manually',     label: 'Sent manually'           },
  { value: 'replied',           label: 'Replied'                 },
  { value: 'rejected',          label: 'Rejected / no response'  },
]

// ── Message generator ─────────────────────────────────────────────────────────

/**
 * Generate a professional B2B message for the given route and target.
 * No sales promises. No guarantees. Signed CorridorWork Team.
 */
export function generateMessage(
  route:  ContactRoute,
  target: ContactTarget,
): GeneratedMessage {
  const company = target.companyName.trim() || 'Ihr Unternehmen'
  const person  = target.contactPerson.trim()
  const salut   = person ? `Guten Tag ${person},` : 'Guten Tag,'

  switch (route) {
    case 'language_school':
      return {
        route,
        subject: 'Pilot-Feedback zu CorridorWork',
        body: `${salut}

wir arbeiten an CorridorWork, einer Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Für die erste Pilotphase suchen wir eine Sprachschule oder einen Training Provider, der Feedback dazu geben kann, ob dieser Ansatz für internationale Absolventen und Arbeitgeber hilfreich wäre.

Es geht nicht um Jobgarantie, Visaberatung oder automatische Vermittlung, sondern um ein kurzes, unverbindliches Feedbackgespräch.

Wäre ein 15-minütiger Austausch diese Woche möglich?

Mit freundlichen Grüßen

${SENDER.name}
${SENDER.website}`,
      }

    case 'recruiting_agency':
      return {
        route,
        subject: 'CorridorWork — Pilotpartner für internationales Matching gesucht',
        body: `${salut}

wir entwickeln CorridorWork, eine Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse im Bereich Cross-border Hiring.

Wir suchen in der ersten Pilotphase einen Praxispartner aus dem Bereich Recruiting oder Staffing, der Feedback dazu geben kann, ob diese Infrastruktur für die Arbeit von ${company} relevant wäre — beispielsweise als Unterstützung bei der Vorbereitung oder Strukturierung internationaler Besetzungsprozesse.

Kein automatischer Versand, keine Jobgarantie, keine Visaberatung. Alles wird manuell geprüft.

Wäre ein kurzes, unverbindliches Gespräch möglich?

Mit freundlichen Grüßen

${SENDER.name}
${SENDER.website}`,
      }

    case 'relocation_partner':
      return {
        route,
        subject: 'CorridorWork — Feedbackgespräch zur Pilotphase',
        body: `${salut}

wir arbeiten an CorridorWork, einer Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Da ${company} im Bereich Relocation und internationaler Personalbegleitung tätig ist, würden wir gerne erfahren, ob dieser Ansatz für Ihre Arbeit mit Arbeitgebern und internationalen Fachkräften relevant sein könnte.

Es geht nicht um automatische Vermittlung oder Visaberatung, sondern um ein kurzes, unverbindliches Gespräch zu einem frühen Plattformansatz.

Wäre ein 15-minütiger Austausch diese Woche möglich?

Mit freundlichen Grüßen

${SENDER.name}
${SENDER.website}`,
      }

    case 'employer_network':
      return {
        route,
        subject: 'CorridorWork — Früher Plattformansatz für internationales Matching',
        body: `${salut}

wir entwickeln CorridorWork, eine Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Wir suchen in der Pilotphase Feedback von Organisationen, die Arbeitgeber im Bereich internationaler Fachkräftegewinnung begleiten oder vernetzt sind — um zu verstehen, ob dieser Ansatz in der Praxis hilfreich wäre.

Keine automatische Vermittlung, keine Jobgarantie, keine Visaberatung — nur ein unverbindliches Feedbackgespräch.

Wäre ein kurzer Austausch möglich?

Mit freundlichen Grüßen

${SENDER.name}
${SENDER.website}`,
      }
  }
}

// ── Mailto link ───────────────────────────────────────────────────────────────

/**
 * Generate a mailto: link that opens the user's email client with
 * pre-filled To, Subject, and Body. The user must click Send themselves.
 * No automatic sending.
 */
export function generateMailtoLink(
  toEmail: string,
  subject: string,
  body:    string,
): string {
  const encoded = [
    `subject=${encodeURIComponent(subject)}`,
    `body=${encodeURIComponent(body)}`,
  ].join('&')

  if (toEmail.trim()) {
    return `mailto:${encodeURIComponent(toEmail.trim())}?${encoded}`
  }
  return `mailto:?${encoded}`
}

// ── Autofill bookmarklet ──────────────────────────────────────────────────────

/**
 * Generate a browser-console-safe JavaScript snippet that fills
 * visible form fields with the prepared values.
 *
 * SAFETY GUARANTEES:
 * - Does NOT call form.submit()
 * - Does NOT click any submit button
 * - Only fills input/textarea fields
 * - Adds a visible highlight to filled fields
 * - Shows a confirmation alert asking user to review before sending
 *
 * Usage: user pastes this into the browser console on the contact form page.
 * They still click Send themselves.
 */
export function generateAutofillSnippet(
  target:  ContactTarget,
  subject: string,
  body:    string,
): string {
  const fields = {
    name:    SENDER.name,
    email:   SENDER.email,
    subject: subject,
    message: body,
    company: SENDER.name,
  }

  // Serialise safely — no template literals with backticks inside the snippet
  const safe = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')

  return `(function() {
  var FIELDS = {
    name:    '${safe(fields.name)}',
    email:   '${safe(fields.email)}',
    subject: '${safe(fields.subject)}',
    message: '${safe(fields.message)}'
  };

  var NAME_SEL    = 'input[name*=name], input[id*=name], input[placeholder*=Name], input[placeholder*=name]';
  var EMAIL_SEL   = 'input[type=email], input[name*=email], input[id*=email]';
  var SUBJECT_SEL = 'input[name*=subject], input[id*=subject], input[placeholder*=Betreff], input[placeholder*=Subject]';
  var MSG_SEL     = 'textarea[name*=message], textarea[id*=message], textarea[name*=body], textarea, [contenteditable=true]';

  function fill(sel, val) {
    var el = document.querySelector(sel);
    if (el) {
      el.value = val;
      el.style.outline = '3px solid #6366f1';
      el.dispatchEvent(new Event('input', {bubbles:true}));
      el.dispatchEvent(new Event('change', {bubbles:true}));
      return true;
    }
    return false;
  }

  var filled = 0;
  if (fill(NAME_SEL,    FIELDS.name))    filled++;
  if (fill(EMAIL_SEL,   FIELDS.email))   filled++;
  if (fill(SUBJECT_SEL, FIELDS.subject)) filled++;
  if (fill(MSG_SEL,     FIELDS.message)) filled++;

  /* SAFETY: fields filled only — no automatic submission — no click on any button */

  alert(
    'CorridorWork Autofill: ' + filled + ' field(s) filled.\\n\\n' +
    'STOP — Review before sending:\\n' +
    '1. Read the message carefully.\\n' +
    '2. Confirm the recipient is correct.\\n' +
    '3. Click Send yourself — nothing was sent automatically.'
  );
})();`
}

// ── Approval checklist ────────────────────────────────────────────────────────

export const APPROVAL_CHECKLIST: { key: string; label: string }[] = [
  { key: 'correct_company',    label: 'Correct company?' },
  { key: 'correct_recipient',  label: 'Correct recipient / email address?' },
  { key: 'corridorwork_team',  label: 'Message signed with CorridorWork Team (no personal name)?' },
  { key: 'no_job_guarantee',   label: 'No job guarantee promised?' },
  { key: 'no_visa_guarantee',  label: 'No visa guarantee promised?' },
  { key: 'no_placement',       label: 'No automatic placement implied?' },
  { key: 'no_payment',         label: 'No payment request included?' },
  { key: 'screenshot_reviewed', label: 'Screenshot reviewed and approved?' },
  { key: 'manual_send_only',   label: 'Manual send only — no automation triggered?' },
]
