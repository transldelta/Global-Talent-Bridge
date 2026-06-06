'use client'

import { useState } from 'react'
import {
  generateWhatsAppTemplate,
  generateLinkedInTemplate,
  generateEmailTemplate,
} from '@/lib/first-pilot-templates'

interface Props {
  emailProviderSafe: boolean
}

type ContactMethod = 'whatsapp' | 'linkedin' | 'email' | 'personal'
type Tab = 'whatsapp' | 'linkedin' | 'email'
type CheckKey =
  | 'registered'
  | 'profile_created'
  | 'job_created'
  | 'matching_visible'
  | 'followup_needed'

// ── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select text in a textarea
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
        copied
          ? 'bg-green-700 text-green-100'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      }`}
    >
      {copied ? '✅ Kopiert!' : '📋 Text kopieren'}
    </button>
  )
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepBadge({
  n,
  label,
  active,
  done,
}: {
  n: number
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${active ? 'opacity-100' : 'opacity-40'}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          done
            ? 'bg-green-700 text-white'
            : active
              ? 'bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-400'
        }`}
      >
        {done ? '✓' : n}
      </div>
      <span className={`text-sm ${active ? 'text-white font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function FirstPilotAssistant({ emailProviderSafe }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1 form
  const [companyName, setCompanyName]       = useState('')
  const [contactPerson, setContactPerson]   = useState('')
  const [contactMethod, setContactMethod]   = useState<ContactMethod>('whatsapp')
  const [contactAddress, setContactAddress] = useState('')
  const [notes, setNotes]                   = useState('')

  // Step 2 tab
  const [activeTab, setActiveTab] = useState<Tab>('whatsapp')

  // Step 3
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError]     = useState<string | null>(null)
  const [saved, setSaved]             = useState(false)
  const [savedId, setSavedId]         = useState<string | null>(null)

  // Step 4 checklist
  const [checks, setChecks] = useState<Record<CheckKey, boolean>>({
    registered:      false,
    profile_created: false,
    job_created:     false,
    matching_visible: false,
    followup_needed: false,
  })

  // Templates
  const wa    = generateWhatsAppTemplate(companyName, contactPerson)
  const li    = generateLinkedInTemplate(companyName, contactPerson)
  const email = generateEmailTemplate(companyName, contactPerson)

  const REGISTER_LINK = 'https://corridorwork.com/auth/register?role=employer'

  // ── Save tracking ─────────────────────────────────────────────────────────

  async function handleSave() {
    setSaveLoading(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/admin/first-pilot/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name:    companyName.trim(),
          contact_person:  contactPerson.trim() || null,
          contact_method:  contactMethod,
          contact_address: contactAddress.trim() || null,
          notes:           notes.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Unbekannter Fehler beim Speichern.')
      } else {
        setSaved(true)
        setSavedId(data.id ?? null)
        setStep(4)
      }
    } catch (e) {
      setSaveError('Netzwerkfehler. Bitte nochmals versuchen.')
    } finally {
      setSaveLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">🚀 First Pilot Assistant</h1>
        <p className="text-gray-400 text-sm mt-1">
          Schritt-für-Schritt Vorbereitung des ersten Pilotarbeitgebers — manuell, sicher, kein automatischer Versand.
        </p>
      </div>

      {/* ── Status Banner ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3 text-center">
          <div className="text-green-400 text-lg">✅</div>
          <div className="text-green-300 text-xs font-medium mt-1">Pilot-Ready</div>
        </div>
        <div className={`${emailProviderSafe ? 'bg-green-900/20 border-green-800/40' : 'bg-red-900/20 border-red-800/40'} border rounded-xl p-3 text-center`}>
          <div className={emailProviderSafe ? 'text-green-400 text-lg' : 'text-red-400 text-lg'}>
            {emailProviderSafe ? '🔒' : '⚠️'}
          </div>
          <div className={`${emailProviderSafe ? 'text-green-300' : 'text-red-300'} text-xs font-medium mt-1`}>
            {emailProviderSafe ? 'E-Mail deaktiviert' : 'E-Mail WARNUNG'}
          </div>
        </div>
        <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-3 text-center">
          <div className="text-blue-400 text-lg">🤝</div>
          <div className="text-blue-300 text-xs font-medium mt-1">Nur manuell</div>
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 text-center">
          <div className="text-gray-300 text-lg">🔗</div>
          <div className="text-gray-300 text-xs font-medium mt-1">Link bereit</div>
        </div>
      </div>

      {/* Einladungslink */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-1">Einladungslink</div>
          <code className="text-blue-300 text-sm break-all">{REGISTER_LINK}</code>
        </div>
        <CopyButton text={REGISTER_LINK} />
      </div>

      {/* ── Step Navigation ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4">
        <StepBadge n={1} label="Daten eintragen" active={step === 1} done={step > 1} />
        <StepBadge n={2} label="Text auswählen"  active={step === 2} done={step > 2} />
        <StepBadge n={3} label="Als kontaktiert markieren" active={step === 3} done={step > 3} />
        <StepBadge n={4} label="Nach Registrierung prüfen" active={step === 4} done={false} />
      </div>

      {/* ── STEP 1: Arbeitgeberdaten ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Schritt 1 — Arbeitgeberdaten</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Firmenname <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="z.B. TechBridge GmbH"
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Ansprechpartner <span className="text-gray-600 font-normal text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="z.B. Maria Müller"
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Kontaktweg</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { value: 'whatsapp',  label: '💬 WhatsApp' },
                  { value: 'linkedin',  label: '💼 LinkedIn' },
                  { value: 'email',     label: '✉️ E-Mail' },
                  { value: 'personal',  label: '🤝 Persönlich' },
                ] as { value: ContactMethod; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setContactMethod(opt.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    contactMethod === opt.value
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              {contactMethod === 'email'     ? 'E-Mail-Adresse' :
               contactMethod === 'whatsapp'  ? 'Telefonnummer / Handle' :
               contactMethod === 'linkedin'  ? 'LinkedIn-Profil-URL' :
               'Kontaktinfo'}
              {' '}<span className="text-gray-600 font-normal text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder={
                contactMethod === 'email'    ? 'name@firma.de' :
                contactMethod === 'whatsapp' ? '+49 …' :
                contactMethod === 'linkedin' ? 'https://linkedin.com/in/…' :
                'Datum / Ort / Notiz'
              }
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Notiz <span className="text-gray-600 font-normal text-xs">(intern, nicht sichtbar für Firma)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Woher kam der Kontakt? Besondere Hinweise? Bisherige Gespräche?"
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!companyName.trim()}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Weiter → Einladungstext auswählen
          </button>
        </div>
      )}

      {/* ── STEP 2: Einladungstext ────────────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Schritt 2 — Einladungstext</h2>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Zurück
            </button>
          </div>

          <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3">
            <p className="text-blue-300/70 text-xs">
              💡 Wähle den passenden Kanal. Kopiere den Text und sende ihn manuell.
              Es gibt <strong>keinen Senden-Button</strong> — du schickst selbst.
            </p>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 border-b border-gray-700 pb-1">
            {(
              [
                { id: 'whatsapp', label: '💬 WhatsApp' },
                { id: 'linkedin', label: '💼 LinkedIn' },
                { id: 'email',    label: '✉️ E-Mail' },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id
                    ? 'bg-blue-900/40 text-blue-300 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* WhatsApp */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">WhatsApp — kurz und direkt</span>
                <CopyButton text={wa} />
              </div>
              <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                {wa}
              </pre>
            </div>
          )}

          {/* LinkedIn */}
          {activeTab === 'linkedin' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">LinkedIn — professionell</span>
                <CopyButton text={li} />
              </div>
              <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                {li}
              </pre>
            </div>
          )}

          {/* E-Mail */}
          {activeTab === 'email' && (
            <div className="space-y-3">
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Betreff</span>
                  <CopyButton text={email.subject} />
                </div>
                <p className="text-sm text-white font-medium">{email.subject}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">E-Mail-Text — formal</span>
                  <CopyButton text={email.body} />
                </div>
                <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {email.body}
                </pre>
              </div>
            </div>
          )}

          <button
            onClick={() => setStep(3)}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Weiter → Als kontaktiert markieren
          </button>
        </div>
      )}

      {/* ── STEP 3: Tracking speichern ────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Schritt 3 — Tracking speichern</h2>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Zurück
            </button>
          </div>

          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-2">
            <div className="text-sm text-gray-400">Was gespeichert wird:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-500">Firma:</div>
              <div className="text-white font-medium">{companyName}</div>
              {contactPerson && <>
                <div className="text-gray-500">Ansprechpartner:</div>
                <div className="text-white">{contactPerson}</div>
              </>}
              <div className="text-gray-500">Kontaktweg:</div>
              <div className="text-white">{contactMethod}</div>
              <div className="text-gray-500">Status:</div>
              <div className="text-green-400 font-medium">contacted_manual</div>
              <div className="text-gray-500">E-Mail gesendet:</div>
              <div className="text-green-400">Nein (no_email_sent: true)</div>
              <div className="text-gray-500">Auto-Outreach:</div>
              <div className="text-green-400">Nein (no_auto_outreach: true)</div>
            </div>
          </div>

          {saveError && (
            <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-3 text-red-300 text-sm">
              ⚠️ {saveError}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="w-full py-3 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {saveLoading ? '⏳ Wird gespeichert…' : '✅ Als manuell kontaktiert markieren'}
          </button>

          <p className="text-xs text-gray-600 text-center">
            Keine E-Mail wird gesendet. Kein automatischer Versand. Nur interner DB-Eintrag.
          </p>
        </div>
      )}

      {/* ── STEP 4: Nach-Registrierungs-Checkliste ────────────────────────── */}
      {step === 4 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Schritt 4 — Nach der Registrierung</h2>

          {saved && (
            <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3">
              <p className="text-green-300 text-sm">
                ✅ Gespeichert{savedId ? ` (ID: ${savedId.slice(0, 8)}…)` : ''}. Sobald sich der Arbeitgeber registriert hat, prüfe hier:
              </p>
            </div>
          )}

          <div className="space-y-3">
            {(
              [
                { key: 'registered',       label: 'Arbeitgeber hat sich registriert',         hint: '/admin/ceo-dashboard → Arbeitgeber-Zähler erhöht?' },
                { key: 'profile_created',  label: 'Firmenprofil vollständig ausgefüllt',       hint: 'Branche, Land, Beschreibung vorhanden?' },
                { key: 'job_created',      label: 'Erste Stelle angelegt',                    hint: 'Mindestens 1 Job mit Anforderungen sichtbar?' },
                { key: 'matching_visible', label: 'Matching-Ergebnisse sichtbar',             hint: 'Score-Breakdown funktioniert? Kandidaten angezeigt?' },
                { key: 'followup_needed',  label: 'Nächster manueller Follow-up nötig',      hint: 'Feedback-Gespräch vereinbart?' },
              ] as { key: CheckKey; label: string; hint: string }[]
            ).map(({ key, label, hint }) => (
              <label
                key={key}
                className="flex items-start gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-800/70 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checks[key]}
                  onChange={(e) =>
                    setChecks((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="mt-0.5 w-4 h-4 rounded accent-blue-500 shrink-0"
                />
                <div>
                  <div className={`text-sm font-medium ${checks[key] ? 'text-green-400 line-through' : 'text-white'}`}>
                    {label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{hint}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-2">
            <p className="text-xs text-gray-500">Nächste Schritte nach dem Onboarding:</p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              <li>Feedback-Gespräch mit dem Arbeitgeber vereinbaren</li>
              <li>Eintrag in <code className="text-gray-300">/admin/outreach</code> aktualisieren</li>
              <li>Bei Interesse: Arbeitgeber in <code className="text-gray-300">/admin/pilot-outreach</code> eintragen</li>
              <li>Keine Zahlungen aktivieren ohne explizite Bestätigung</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setStep(1)
              setCompanyName('')
              setContactPerson('')
              setContactAddress('')
              setNotes('')
              setSaved(false)
              setSavedId(null)
              setChecks({
                registered: false,
                profile_created: false,
                job_created: false,
                matching_visible: false,
                followup_needed: false,
              })
            }}
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            ↩ Neuen Pilotarbeitgeber vorbereiten
          </button>
        </div>
      )}
    </div>
  )
}
