import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { NavBar } from '@/app/_components/NavBar'
import { CopyButton } from './CopyButton'

// ── Vorlagen ──────────────────────────────────────────────────────────────────

const EMAIL_TEMPLATE = `Betreff: Kostenloser Pilot-Zugang — Internationale Fachkräfte finden

Guten Tag [Name],

ich bin Brahim Ben Abla, Gründer von Global Talent Bridge — einer Plattform für strukturiertes Matching zwischen internationalen Fachkräften und deutschen Arbeitgebern.

Ich suche aktuell 5–10 Pilot-Arbeitgeber, die die Plattform kostenlos testen und mir ehrliches Feedback geben.

Was das bedeutet:
• Sie erstellen einen oder mehrere Jobs auf der Plattform (kostenlos)
• Das System zeigt passende internationale Kandidaten — sortiert nach Matching-Score
• Kein Zahlungszwang, kein Vertrag, keine automatischen E-Mails an Kandidaten
• Ich betreue Sie persönlich und werte Ihr Feedback direkt in die Weiterentwicklung ein

Die Plattform ist bereits live und funktionsfähig:
https://global-talent-bridge.vercel.app

Hätten Sie 15 Minuten für ein kurzes Gespräch?

Mit freundlichen Grüßen
Brahim Ben Abla
Global Talent Bridge
transl.delta@gmail.com`

const PITCH_SHORT = `Global Talent Bridge verbindet internationale Fachkräfte mit deutschen Arbeitgebern über ein strukturiertes Matching-System.

Arbeitgeber erstellen Jobs mit klaren Anforderungen — Kandidaten füllen ihr Profil aus. Das System berechnet automatisch den Matching-Score. Arbeitgeber sehen sofort, wer am besten passt: Name, Branche, Erfahrung, Sprachlevel.

Wir suchen jetzt 5–10 Pilot-Arbeitgeber, die die Plattform kostenlos testen und uns ehrliches Feedback geben. Kein Vertrag, keine Zahlung.`

const LINKEDIN_MSG = `Hallo [Name],

ich baue Global Talent Bridge — strukturiertes Matching für internationale Fachkräfte und deutsche Arbeitgeber.

Ich suche gerade 5–10 Pilot-Unternehmen für einen kostenlosen Test. Kein Vertrag, keine Zahlung — nur ehrliches Feedback.

Interessiert? Ich erkläre es gerne in 10–15 Minuten.

Viele Grüße, Brahim`

const WHATSAPP_MSG = `Hallo [Name]! Ich baue Global Talent Bridge — eine Plattform für strukturiertes Matching internationaler Fachkräfte mit deutschen Arbeitgebern. Suche 5–10 Pilot-Unternehmen für kostenlosen Test. Hast du kurz Zeit für 10 Min Gespräch? LG Brahim`

const PHONE_GUIDE = `[EINSTIEG]
"Guten Tag, mein Name ist Brahim Ben Abla. Ich bin Gründer von Global Talent Bridge, einer Plattform für strukturiertes Matching internationaler Fachkräfte. Haben Sie kurz 2 Minuten?"

[WENN JA]
"Ich suche gerade 5–10 Pilot-Arbeitgeber, die die Plattform kostenlos testen. Kein Vertrag, keine Zahlung — nur ehrliches Feedback. Darf ich kurz erklären, wie es funktioniert?"

[ERKLÄRUNG (1 Min)]
"Sie erstellen einen Job mit Ihren Anforderungen. Kandidaten füllen ihr Profil aus. Das System berechnet automatisch den Matching-Score. Sie sehen sofort, wer am besten passt — Name, Branche, Erfahrung, Sprachlevel."

[ABSCHLUSS]
"Wäre das etwas für Sie? Ich würde Ihnen einen kostenlosen Pilot-Zugang einrichten. Hätten Sie Zeit für ein kurzes 15-Minuten-Gespräch diese Woche?"

[EINWAND: KEIN BEDARF]
"Verstehe. Haben Sie vielleicht Kollegen oder Bekannte, die internationale Fachkräfte suchen?"

[EINWAND: KEINE ZEIT]
"Kein Problem. Darf ich Ihnen kurz meine Kontaktdaten per E-Mail hinterlassen?"

[KONTAKTDATEN]
Name: Brahim Ben Abla
E-Mail: transl.delta@gmail.com
Plattform: https://global-talent-bridge.vercel.app`

const DEMO_5_SENTENCES = `Global Talent Bridge ist eine Matching-Plattform, auf der internationale Fachkräfte ihr Profil mit Branche, Erfahrung und Sprachkenntnissen anlegen.

Arbeitgeber erstellen Jobs mit klaren Anforderungen: Jobtitel, Standort, Mindesterfahrung, Deutsch- und Englischkenntnisse.

Das System berechnet automatisch einen Matching-Score (0–100 %) für jede Kandidat-Job-Kombination.

Arbeitgeber sehen sofort eine sortierte Liste passender Kandidaten — mit Score, Name, Branche und Sprachlevel.

Die Plattform ist bereits live und voll funktionsfähig — was wir jetzt brauchen, sind Pilot-Arbeitgeber, die echte Jobs einstellen und uns ehrliches Feedback geben.`

// ── Template-Block ────────────────────────────────────────────────────────────

function TemplateBlock({
  icon,
  title,
  description,
  text,
  copyLabel,
}: {
  icon: string
  title: string
  description: string
  text: string
  copyLabel?: string
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">
            {icon} {title}
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">{description}</p>
        </div>
        <CopyButton text={text} label={copyLabel ?? 'Kopieren'} />
      </div>
      <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800 rounded-lg p-4 overflow-x-auto">
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

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

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
            Keine automatischen E-Mails. Kein Massenkontakt.
          </p>
        </div>

        {/* Hinweis-Banner */}
        <div className="p-4 bg-blue-900/10 border border-blue-800/30 rounded-xl flex items-start gap-3">
          <span className="text-blue-400 shrink-0 text-lg">💡</span>
          <div>
            <p className="text-blue-300 text-sm font-medium">Nur manuelle Nutzung</p>
            <p className="text-blue-200/60 text-xs mt-0.5 leading-relaxed">
              Alle Vorlagen sind nur zur manuellen Verwendung. Nichts wird automatisch gesendet.
              Kopiere den gewünschten Text und sende ihn über dein eigenes E-Mail-Programm,
              LinkedIn oder Telefon.
            </p>
          </div>
        </div>

        {/* Ziel-Kontext */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-3">🎯 Zielsetzung Phase 2H</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <div className="text-2xl font-bold text-green-400">10–20</div>
              <div className="text-xs text-gray-400 mt-0.5">Arbeitgeber kontaktieren</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <div className="text-2xl font-bold text-blue-400">3–5</div>
              <div className="text-xs text-gray-400 mt-0.5">Pilot-Arbeitgeber gewinnen</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <div className="text-2xl font-bold text-purple-400">100%</div>
              <div className="text-xs text-gray-400 mt-0.5">Manuell · kein Spam</div>
            </div>
          </div>
        </div>

        {/* Vorlagen */}
        <TemplateBlock
          icon="💬"
          title="Kurz-Pitch (30 Sekunden)"
          description="Für Gespräche, Netzwerktreffen, spontane Situationen"
          text={PITCH_SHORT}
          copyLabel="Pitch kopieren"
        />

        <TemplateBlock
          icon="✉️"
          title="E-Mail-Vorlage"
          description="Für Kaltakquise per E-Mail — [Name] durch echten Namen ersetzen"
          text={EMAIL_TEMPLATE}
          copyLabel="E-Mail kopieren"
        />

        <TemplateBlock
          icon="💼"
          title="LinkedIn-Nachricht"
          description="Für LinkedIn InMail oder Verbindungsanfrage — [Name] ersetzen"
          text={LINKEDIN_MSG}
          copyLabel="LinkedIn kopieren"
        />

        <TemplateBlock
          icon="📱"
          title="WhatsApp-Kurznachricht"
          description="Für persönliche Kontakte und Netzwerk — kurz und informell"
          text={WHATSAPP_MSG}
          copyLabel="WhatsApp kopieren"
        />

        <TemplateBlock
          icon="📞"
          title="Telefonleitfaden"
          description="Gesprächsführung für Kaltakquise per Telefon — mit Einwandbehandlung"
          text={PHONE_GUIDE}
          copyLabel="Leitfaden kopieren"
        />

        <TemplateBlock
          icon="🖥️"
          title="Demo-Erklärung (5 Sätze)"
          description="Für Demo-Calls oder wenn jemand fragt: &quot;Was macht die Plattform genau?&quot;"
          text={DEMO_5_SENTENCES}
          copyLabel="Demo kopieren"
        />

        {/* Checkliste */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">✅ Pilot-Checkliste</h2>
          <div className="space-y-3">
            {[
              { icon: '1️⃣', text: 'Kontakt identifizieren (LinkedIn, Netzwerk, Kaltakquise)' },
              { icon: '2️⃣', text: 'Vorlage kopieren und auf Person anpassen ([Name] ersetzen)' },
              { icon: '3️⃣', text: 'Manuell senden über eigenes E-Mail-Programm / LinkedIn / Telefon' },
              { icon: '4️⃣', text: 'In /admin/leads → Neuer Lead anlegen ODER warten bis Kontaktformular ausgefüllt wird' },
              { icon: '5️⃣', text: 'Status auf "contacted" setzen, Admin-Notizen ergänzen' },
              { icon: '6️⃣', text: 'Follow-up-Datum setzen wenn keine Antwort' },
              { icon: '7️⃣', text: 'Bei Interesse: Status auf "qualified" setzen, Demo einrichten' },
            ].map((item) => (
              <div key={item.icon} className="flex items-start gap-3">
                <span className="text-lg shrink-0">{item.icon}</span>
                <p className="text-gray-300 text-sm pt-0.5">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sicherheitshinweis */}
        <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-xl flex items-start gap-3">
          <span className="text-green-400 shrink-0">🔒</span>
          <p className="text-green-300/70 text-xs leading-relaxed">
            Alle Vorlagen sind lokal. Kein automatisches Senden. Kein Massenkontakt.
            Service Role Key nur serverseitig. Admin-Zugang nur über ADMIN_EMAILS.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
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
