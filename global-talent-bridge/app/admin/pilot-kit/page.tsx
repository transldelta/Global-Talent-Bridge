import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { NavBar } from '@/app/_components/NavBar'
import { CopyButton } from './CopyButton'

// ── Konstanten ────────────────────────────────────────────────────────────────

const CTA_URL =
  'https://global-talent-bridge.vercel.app/contact?role=employer&interest=pilot_employer'

// ── Vorlagen ──────────────────────────────────────────────────────────────────

// ── Erstkontakt ──

const EMAIL_FORMAL = `Betreff: Internationale Fachkräfte finden — kostenloser Pilot-Zugang

Sehr geehrte Frau [Name] / Sehr geehrter Herr [Name],

wenn Sie regelmäßig internationale Bewerber prüfen, kennen Sie das Problem:
viele Unterlagen, wenig Vorauswahl, viel manueller Aufwand.

Global Talent Bridge löst genau das: Kandidaten legen ihr Profil an —
Branche, Erfahrung, Deutsch- und Englischkenntnisse. Sie erstellen eine Stelle
und sehen sofort, wer am besten passt — sortiert nach transparentem Matching-Score.

Die Plattform ist live. Ich suche aktuell 5–10 Pilot-Unternehmen, die
das System kostenlos testen:

• Kein Vertrag, keine Kosten, keine automatischen Nachrichten
• Persönliche Betreuung durch mich direkt
• Ihr Feedback fließt direkt in die Weiterentwicklung ein

Hätten Sie 15 Minuten für ein kurzes Gespräch diese Woche?
Oder testen Sie die Plattform direkt:
${CTA_URL}

Mit freundlichen Grüßen
Global Talent Bridge Team
transl.delta@gmail.com`

const EMAIL_SHORT = `Betreff: Kostenloser Test — Kandidaten nach Matching-Score finden

Guten Tag [Name],

ich baue Global Talent Bridge — eine Plattform, auf der Sie Stellen anlegen
und sofort sehen, welche internationalen Kandidaten am besten passen
(Branche, Erfahrung, Sprachkenntnisse — alles in einem Score).

Ich suche ein paar Unternehmen, die das kostenlos ausprobieren möchten.
Kein Vertrag, keine Kosten, kein Aufwand.

Interesse? Hier können Sie direkt eine Pilot-Anfrage stellen:
${CTA_URL}

Mit freundlichen Grüßen
Global Talent Bridge Team
transl.delta@gmail.com`

// ── Follow-up ──

const FOLLOWUP_NO_REPLY = `Betreff: Kurze Nachfrage — Pilot-Zugang Global Talent Bridge

Guten Tag [Name],

ich habe Ihnen vor einigen Tagen geschrieben wegen eines kostenlosen
Pilot-Zugangs für Global Talent Bridge.

Falls meine erste Nachricht untergegangen ist: Kurz zusammengefasst —
ich biete 5–10 Unternehmen einen kostenlosen Testzugang, um internationale
Kandidaten strukturiert nach Matching-Score zu finden.

Kein Vertrag, keine Kosten, keine automatischen Nachrichten.

Falls Sie Interesse haben oder kurz Fragen stellen möchten, melden Sie sich
gerne direkt bei mir:
transl.delta@gmail.com

Oder nutzen Sie das Kontaktformular:
${CTA_URL}

Mit freundlichen Grüßen
Global Talent Bridge Team
transl.delta@gmail.com`

const FOLLOWUP_AFTER_INTEREST = `Betreff: Nächste Schritte — Global Talent Bridge Pilot

Guten Tag [Name],

vielen Dank für Ihr Interesse an Global Talent Bridge!

Hier sind die nächsten Schritte, damit Sie loslegen können:

1. Konto erstellen (kostenlos, keine Kreditkarte):
   https://global-talent-bridge.vercel.app/auth/register?role=employer

2. Unternehmensprofil anlegen (ca. 5 Minuten)

3. Erste Stelle erstellen — Jobtitel, Anforderungen, Sprachkenntnisse

4. Passende Kandidaten mit Matching-Score ansehen

Bei Fragen oder wenn etwas nicht klappt, melden Sie sich direkt bei mir.
Ich bin persönlich erreichbar und antworte schnell.

transl.delta@gmail.com

Mit freundlichen Grüßen
Global Talent Bridge Team
transl.delta@gmail.com`

// ── Telefon ──

const PHONE_GUIDE = `── GESPRÄCHSEINSTIEG ──────────────────────────────────────────────────────────

"Guten Tag, Global Talent Bridge — ich rufe kurz wegen unserer Plattform für
internationales Fachkräfte-Matching an.
Haben Sie kurz 2–3 Minuten?"

── WENN JA ────────────────────────────────────────────────────────────────────

"Ich suche gerade 5–10 Pilot-Unternehmen, die die Plattform kostenlos testen.
Kein Vertrag, keine Zahlung — nur ehrliches Feedback.

Darf ich kurz erklären, wie es funktioniert?"

── ERKLÄRUNG (1 Minute) ───────────────────────────────────────────────────────

"Sie erstellen eine Stelle mit Ihren Anforderungen: Branche, Standort,
Mindesterfahrung, Deutsch- und Englischkenntnisse.

Kandidaten füllen ihr Profil aus. Das System berechnet automatisch den
Matching-Score. Sie sehen sofort, wer am besten passt — Name, Branche,
Erfahrung, Sprachlevel.

Die Plattform ist bereits live und funktioniert."

── ABSCHLUSS ──────────────────────────────────────────────────────────────────

"Wäre das etwas für Sie?
Ich würde Ihnen einen kostenlosen Zugang einrichten.
Hätten Sie Zeit für ein kurzes 15-Minuten-Gespräch diese Woche?"

── EINWAND: KEIN BEDARF ───────────────────────────────────────────────────────

"Verstehe. Haben Sie vielleicht Kollegen oder Bekannte im Netzwerk,
die internationale Fachkräfte suchen?"

── EINWAND: KEINE ZEIT ────────────────────────────────────────────────────────

"Kein Problem. Darf ich Ihnen kurz meine Kontaktdaten per E-Mail hinterlassen?
Dann können Sie sich melden, wenn es passt."

── EINWAND: BEREITS LÖSUNG ────────────────────────────────────────────────────

"Das freut mich zu hören. Was nutzen Sie aktuell?
Wir sind in der Pilot-Phase — Feedback von Praktikern ist für uns sehr wertvoll."

── KONTAKTDATEN ───────────────────────────────────────────────────────────────

E-Mail: transl.delta@gmail.com
Plattform: ${CTA_URL}`

// ── Kurz-Nachrichten ──

const LINKEDIN_MSG = `Guten Tag [Name],

ich baue Global Talent Bridge — strukturiertes Matching für internationale
Fachkräfte und deutsche Arbeitgeber. Arbeitgeber sehen Kandidaten sortiert
nach Matching-Score (Branche, Erfahrung, Sprachkenntnisse).

Ich suche gerade 5–10 Pilot-Unternehmen für einen kostenlosen Test.
Kein Vertrag, keine Kosten, kein Spam.

Wäre das etwas für Sie? Ich erkläre es gerne in 10–15 Minuten.

Viele Grüße,
Global Talent Bridge Team`

const WHATSAPP_MSG = `Hallo [Name]! 👋

Ich baue Global Talent Bridge — eine Plattform, die internationale Fachkräfte und Arbeitgeber über Matching-Score zusammenbringt.

Suche 5–10 Pilot-Unternehmen zum kostenlosen Testen. Kein Vertrag, keine Kosten.

Hast du kurz Zeit für 10 Min Gespräch?

LG, Global Talent Bridge Team 🙂`

// ── Demo-Erklärung ──

const DEMO_5_SENTENCES = `Global Talent Bridge ist eine Matching-Plattform, auf der internationale Fachkräfte ihr Profil mit Branche, Erfahrung und Sprachkenntnissen anlegen.

Arbeitgeber erstellen Stellen mit klaren Anforderungen: Jobtitel, Standort, Mindesterfahrung, Deutsch- und Englischkenntnisse.

Das System berechnet automatisch einen Matching-Score (0–100 %) für jede Kandidat-Stelle-Kombination.

Arbeitgeber sehen sofort eine sortierte Liste passender Kandidaten — mit Score, Name, Branche und Sprachlevel.

Die Plattform ist bereits live — was wir jetzt brauchen, sind Pilot-Arbeitgeber, die echte Stellen einstellen und uns ehrliches Feedback geben.`

// ── Komponenten ───────────────────────────────────────────────────────────────

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-gray-500 text-xs mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function TemplateCard({
  badge,
  badgeColor,
  title,
  description,
  text,
  copyLabel,
}: {
  badge: string
  badgeColor: 'blue' | 'green' | 'yellow' | 'purple' | 'gray'
  title: string
  description: string
  text: string
  copyLabel?: string
}) {
  const badgeStyles: Record<string, string> = {
    blue: 'bg-blue-900/40 text-blue-300 border-blue-800/40',
    green: 'bg-green-900/40 text-green-300 border-green-800/40',
    yellow: 'bg-yellow-900/40 text-yellow-300 border-yellow-800/40',
    purple: 'bg-purple-900/40 text-purple-300 border-purple-800/40',
    gray: 'bg-gray-800 text-gray-400 border-gray-700',
  }
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${badgeStyles[badgeColor]}`}>
              {badge}
            </span>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
        </div>
        <div className="shrink-0">
          <CopyButton text={text} label={copyLabel ?? 'Kopieren'} />
        </div>
      </div>
      <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800/60 rounded-xl p-4 overflow-x-auto border border-gray-700/50">
        {text}
      </pre>
    </div>
  )
}

// ── Seite ─────────────────────────────────────────────────────────────────────

export default async function PilotKitPage() {
  const admin = await getCurrentAdminUser()

  if (!admin) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

        {/* Header */}
        <div>
          <Link
            href="/admin/leads"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Zurück zu Leads
          </Link>
          <h1 className="text-2xl font-bold text-white mt-3">🎯 Pilot-Vertriebskit</h1>
          <p className="text-gray-400 text-sm mt-1">
            Kopierbare Vorlagen für die manuelle Kontaktaufnahme mit Pilot-Arbeitgebern.
            Keine automatischen E-Mails. Kein Massenkontakt. Ziel: 5–10 Pilot-Arbeitgeber gewinnen.
          </p>
        </div>

        {/* Sicherheits-Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-900/10 border border-blue-800/30 rounded-xl">
          <span className="text-blue-400 text-lg shrink-0">💡</span>
          <div>
            <p className="text-blue-300 text-sm font-medium">Nur manuelle Nutzung</p>
            <p className="text-blue-200/60 text-xs mt-0.5 leading-relaxed">
              Alle Vorlagen dienen ausschließlich der manuellen Verwendung. Nichts wird automatisch gesendet.
              Text kopieren → über eigenes E-Mail-Programm, LinkedIn oder Telefon manuell versenden.
            </p>
          </div>
        </div>

        {/* Ziel-Kacheln */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">10–20</div>
            <div className="text-xs text-gray-400 mt-0.5">kontaktieren</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">3–5</div>
            <div className="text-xs text-gray-400 mt-0.5">Pilot-Arbeitgeber</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-xs text-gray-400 mt-0.5">manuell · kein Spam</div>
          </div>
        </div>

        {/* ── Kategorie: Erstkontakt ── */}
        <div>
          <SectionHeader
            title="📬 Erstkontakt"
            description="Für die erste Nachricht — noch kein vorheriger Kontakt. [Name] und [Firma] immer durch echten Namen ersetzen."
          />
          <div className="space-y-4">
            <TemplateCard
              badge="E-Mail · Formell"
              badgeColor="blue"
              title="Formelle E-Mail für GF / HR"
              description="Für Geschäftsführer, HR-Leiter und Personalverantwortliche. Professionell, konkret, mit klarem Nutzen im ersten Satz."
              text={EMAIL_FORMAL}
              copyLabel="E-Mail kopieren"
            />
            <TemplateCard
              badge="E-Mail · Kurz"
              badgeColor="green"
              title="Kurze E-Mail für kleine Unternehmen"
              description="Für KMUs, Handwerksbetriebe und kleine Teams. Direkt und unkompliziert — ohne lange Einleitung."
              text={EMAIL_SHORT}
              copyLabel="Kurz-E-Mail kopieren"
            />
          </div>
        </div>

        {/* ── Kategorie: Follow-up ── */}
        <div>
          <SectionHeader
            title="🔄 Follow-up"
            description="Für Kontakte, die noch nicht geantwortet haben oder bereits Interesse signalisiert haben."
          />
          <div className="space-y-4">
            <TemplateCard
              badge="Follow-up · 3 Tage"
              badgeColor="yellow"
              title="Follow-up nach 3 Tagen ohne Antwort"
              description="Freundliche Erinnerung — kein Druck, kein Vorwurf. Falls die erste Nachricht untergegangen ist."
              text={FOLLOWUP_NO_REPLY}
              copyLabel="Follow-up kopieren"
            />
            <TemplateCard
              badge="Follow-up · Nach Interesse"
              badgeColor="green"
              title="Follow-up nach Interesse / Zusage"
              description="Für Kontakte, die Interesse signalisiert haben. Klare nächste Schritte zum Loslegen."
              text={FOLLOWUP_AFTER_INTEREST}
              copyLabel="Nächste Schritte kopieren"
            />
          </div>
        </div>

        {/* ── Kategorie: Telefon ── */}
        <div>
          <SectionHeader
            title="📞 Telefon"
            description="Gesprächsleitfaden für Kaltakquise per Telefon. Mit Einwandbehandlung und Abschluss-Techniken."
          />
          <div className="space-y-4">
            <TemplateCard
              badge="Telefon · Leitfaden"
              badgeColor="purple"
              title="Telefonleitfaden (Kaltakquise)"
              description="Vollständiger Gesprächsaufbau: Einstieg → Erklärung → Abschluss → Einwandbehandlung. Adapt an eigenen Stil."
              text={PHONE_GUIDE}
              copyLabel="Leitfaden kopieren"
            />
            <TemplateCard
              badge="Demo · 5 Sätze"
              badgeColor="gray"
              title="Demo-Erklärung (5 Sätze)"
              description="Für Demo-Calls oder wenn jemand fragt: 'Was macht die Plattform genau?' Klar, ehrlich, ohne Übertreibung."
              text={DEMO_5_SENTENCES}
              copyLabel="Demo kopieren"
            />
          </div>
        </div>

        {/* ── Kategorie: Kurz-Nachrichten ── */}
        <div>
          <SectionHeader
            title="📱 Kurz-Nachrichten"
            description="Für LinkedIn InMail, WhatsApp und persönliche Netzwerkkontakte. Immer [Name] ersetzen."
          />
          <div className="space-y-4">
            <TemplateCard
              badge="LinkedIn · InMail"
              badgeColor="blue"
              title="LinkedIn-Nachricht"
              description="Für LinkedIn InMail oder Verbindungsanfrage. Professionell, aber nicht zu förmlich."
              text={LINKEDIN_MSG}
              copyLabel="LinkedIn kopieren"
            />
            <TemplateCard
              badge="WhatsApp · Informal"
              badgeColor="green"
              title="WhatsApp-Kurznachricht"
              description="Für persönliche Kontakte und lockeres Netzwerk. Kurz, direkt, mit Emoji — passt zum Kanal."
              text={WHATSAPP_MSG}
              copyLabel="WhatsApp kopieren"
            />
          </div>
        </div>

        {/* ── Checkliste ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">✅ Pilot-Checkliste</h2>
          <div className="space-y-3">
            {[
              { n: '1', text: 'Kontakt identifizieren (LinkedIn, XING, Netzwerk, Google, Kaltakquise)' },
              { n: '2', text: 'Passende Vorlage wählen und [Name] / [Firma] ersetzen' },
              { n: '3', text: 'Manuell senden: eigenes E-Mail-Programm / LinkedIn / Telefon' },
              { n: '4', text: 'In /admin/leads als neuen Kontakt anlegen oder warten bis Formular eingegangen ist' },
              { n: '5', text: 'Status auf „contacted" setzen, Admin-Notizen ergänzen' },
              { n: '6', text: 'Follow-up-Datum setzen (heute + 3 Tage) wenn keine Antwort erwartet' },
              { n: '7', text: 'Bei Interesse: Status auf „qualified" setzen, Pilot-Onboarding starten' },
            ].map((item) => (
              <div key={item.n} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.n}
                </div>
                <p className="text-gray-300 text-sm pt-0.5">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sicherheitshinweis */}
        <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-xl flex items-start gap-3">
          <span className="text-green-400 shrink-0">🔒</span>
          <p className="text-green-300/70 text-xs leading-relaxed">
            Alle Vorlagen sind lokal — nichts wird automatisch gesendet. Kein Massenkontakt.
            Service Role Key nur serverseitig. Admin-Zugang nur über ADMIN_EMAILS.
            Keine Fake-Zahlen, keine übertriebenen Versprechen.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 flex-wrap pb-4">
          <Link href="/admin/leads" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Leads verwalten
          </Link>
          <Link href="/admin/ceo-dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            CEO Dashboard →
          </Link>
        </div>

      </div>
    </div>
  )
}
