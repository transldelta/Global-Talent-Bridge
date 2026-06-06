'use client'
/**
 * app/admin/outreach-autopilot/_components/OutreachAutopilotForm.tsx
 *
 * Outreach Autopilot — 3-Schritt-Interface für den Admin.
 *
 * Schritte:
 * 1. Firma eintragen (manuell)
 * 2. Analyse-Ergebnisse (Fit Score, Compliance, Draft)
 * 3. Aktionen (Kopieren / Speichern / Markieren)
 *
 * SICHERHEITS-INVARIANTEN (im UI hart verdrahtet):
 * - Kein "Senden"-Button
 * - Kein "Bulk"-Button
 * - "Kopieren" nur wenn compliance=safe UND fitScore≥70
 * - EMAIL_PROVIDER wird nie gelesen/gesetzt
 * - OUTREACH_EMAIL_PROVIDER wird nie gelesen/gesetzt
 * - no_email_sent immer sichtbar als Hinweis
 */
import { useState } from 'react'
import type { AutopilotAnalysis } from '@/lib/outreach-autopilot/types'

// ── Typen ──────────────────────────────────────────────────────────────────────

type FormData = {
  company_name:     string
  website:          string
  sector:           string
  contact_person:   string
  contact_method:   string
  contact_address:  string
  notes:            string
}

type Step = 1 | 2 | 3

// ── Sub-Komponenten ────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70 ? 'text-green-400 border-green-700 bg-green-900/30' :
    score >= 50 ? 'text-yellow-400 border-yellow-700 bg-yellow-900/30' :
                  'text-red-400 border-red-700 bg-red-900/30'
  return (
    <span className={`inline-block border rounded px-3 py-1 font-mono font-bold text-xl ${color}`}>
      {score}/100
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    safe:          'bg-green-900 text-green-300',
    needs_review:  'bg-yellow-900 text-yellow-300',
    blocked:       'bg-red-900 text-red-300',
    low:           'bg-green-900 text-green-300',
    medium:        'bg-yellow-900 text-yellow-300',
    high:          'bg-red-900 text-red-300',
  }
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium uppercase ${colors[status] ?? 'bg-gray-700 text-gray-300'}`}>
      {status}
    </span>
  )
}

function CopyButton({ text, disabled }: { text: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (disabled) return
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
        disabled
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : copied
          ? 'bg-green-700 text-white'
          : 'bg-blue-700 hover:bg-blue-600 text-white'
      }`}
    >
      {copied ? '✅ Kopiert!' : '📋 Text kopieren'}
    </button>
  )
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────

export function OutreachAutopilotForm() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>({
    company_name:    '',
    website:         '',
    sector:          '',
    contact_person:  '',
    contact_method:  'whatsapp',
    contact_address: '',
    notes:           '',
  })
  const [analysis, setAnalysis]     = useState<AutopilotAnalysis | null>(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [savedId, setSavedId]       = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError]   = useState<string | null>(null)
  const [statusMsg, setStatusMsg]   = useState<string | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ── Analyse starten ──────────────────────────────────────────────────────
  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company_name.trim()) {
      setError('Firmenname ist erforderlich.')
      return
    }
    setLoading(true)
    setError(null)
    setAnalysis(null)
    setSavedId(null)

    try {
      const res = await fetch('/api/admin/outreach-autopilot/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name:    form.company_name.trim(),
          website:         form.website.trim() || undefined,
          sector:          form.sector.trim() || undefined,
          contact_person:  form.contact_person.trim() || undefined,
          contact_method:  form.contact_method as any,
          contact_address: form.contact_address.trim() || undefined,
          notes:           form.notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Analyse fehlgeschlagen.')
        return
      }
      setAnalysis(data.analysis)
      setStep(2)
    } catch (err) {
      setError('Netzwerkfehler. Bitte erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  // ── Als Entwurf speichern ────────────────────────────────────────────────
  async function handleSave(statusOverride?: string) {
    setSaveLoading(true)
    setSaveError(null)
    setStatusMsg(null)

    try {
      const res = await fetch('/api/admin/outreach-autopilot/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name:    form.company_name.trim(),
          website:         form.website.trim() || undefined,
          sector:          form.sector.trim() || undefined,
          contact_person:  form.contact_person.trim() || undefined,
          contact_method:  form.contact_method as any,
          contact_address: form.contact_address.trim() || undefined,
          notes:           form.notes.trim() || undefined,
          override_status: statusOverride,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Speichern fehlgeschlagen.')
        return
      }
      setSavedId(data.id)
      setStatusMsg(`✅ Gespeichert als "${data.status}" (ID: ${data.id.slice(0, 8)}…)`)
      setStep(3)
    } catch {
      setSaveError('Netzwerkfehler beim Speichern.')
    } finally {
      setSaveLoading(false)
    }
  }

  // ── Status aktualisieren ─────────────────────────────────────────────────
  async function handleStatusUpdate(newStatus: string) {
    if (!savedId) {
      setSaveError('Bitte zuerst speichern.')
      return
    }
    setSaveLoading(true)
    setSaveError(null)

    try {
      const res = await fetch(`/api/admin/outreach-autopilot/${savedId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Status-Update fehlgeschlagen.')
        return
      }
      setStatusMsg(`✅ Status aktualisiert: "${data.status}"`)
    } catch {
      setSaveError('Netzwerkfehler beim Status-Update.')
    } finally {
      setSaveLoading(false)
    }
  }

  const canCopy = analysis
    ? analysis.compliance.status !== 'blocked' && !analysis.fitScore.blockedByScore
    : false

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Sicherheits-Banner ── */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm text-gray-300 flex items-start gap-3">
        <span className="text-green-400 text-base mt-0.5">🔒</span>
        <span>
          <strong className="text-white">Compliance First</strong> — Kein automatischer Versand.
          Kein Send-Button. EMAIL_PROVIDER=none. OUTREACH_EMAIL_PROVIDER=none.{' '}
          <strong className="text-green-300">Du kopierst den Text und sendest ihn selbst.</strong>
        </span>
      </div>

      {/* ── Schritt-Indikator ── */}
      <div className="flex items-center gap-2 text-xs">
        {([1, 2, 3] as const).map(n => (
          <span
            key={n}
            className={`px-3 py-1 rounded-full font-medium ${
              step === n
                ? 'bg-blue-700 text-white'
                : step > n
                ? 'bg-green-800 text-green-300'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {n === 1 ? '① Firma eingeben' : n === 2 ? '② Analyse' : '③ Aktionen'}
          </span>
        ))}
      </div>

      {/* ════════════ SCHRITT 1: Formular ════════════ */}
      {step === 1 && (
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Firmenname <span className="text-red-400">*</span>
              </label>
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                required
                placeholder="z.B. Pflegeheim am See GmbH"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Website (optional)</label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://www.firma.de"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Branche (optional)</label>
              <input
                name="sector"
                value={form.sector}
                onChange={handleChange}
                placeholder="z.B. Pflege, IT, Bau, Gastronomie"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Kontaktperson (optional)</label>
              <input
                name="contact_person"
                value={form.contact_person}
                onChange={handleChange}
                placeholder="Vor- und Nachname"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Kontaktkanal</label>
              <select
                name="contact_method"
                value={form.contact_method}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email">E-Mail</option>
                <option value="personal">Persönlich</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Kontaktadresse (optional)
              </label>
              <input
                name="contact_address"
                value={form.contact_address}
                onChange={handleChange}
                placeholder="+49… / LinkedIn-URL / E-Mail"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Notizen / Kontext (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Warum könnte diese Firma passen? Fachkräftemangel? Bekannte Person?"
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !form.company_name.trim()}
            className="px-6 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded font-medium text-sm transition-colors"
          >
            {loading ? '⏳ Analysiere…' : '🔍 Analyse starten'}
          </button>
        </form>
      )}

      {/* ════════════ SCHRITT 2: Analyse-Ergebnisse ════════════ */}
      {step === 2 && analysis && (
        <div className="space-y-5">

          {/* Score-Übersicht */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-2">Fit Score</div>
              <ScoreBadge score={analysis.fitScore.score} />
              <div className="text-xs text-gray-400 mt-2">{analysis.fitScore.label}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-2">Compliance</div>
              <StatusBadge status={analysis.compliance.status} />
              <div className="text-xs text-gray-400 mt-2">
                {analysis.compliance.hasSignature ? '✅ Signatur' : '❌ Signatur fehlt'}
                {' | '}
                {analysis.compliance.hasPilotNote ? '✅ Pilot-Hinweis' : '❌ Pilot-Hinweis fehlt'}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-2">Spam-Risiko</div>
              <StatusBadge status={analysis.spamRisk} />
              <div className="text-xs text-gray-400 mt-2">
                Kanal: {analysis.recommendedChannel}
              </div>
            </div>
          </div>

          {/* Zusammenfassung */}
          <div className={`rounded-lg px-4 py-3 text-sm ${
            analysis.overallSafe
              ? 'bg-green-900/20 border border-green-800 text-green-200'
              : 'bg-red-900/20 border border-red-800 text-red-200'
          }`}>
            {analysis.summary}
          </div>

          {/* Score-Breakdown */}
          <details className="bg-gray-800 rounded-lg">
            <summary className="px-4 py-3 cursor-pointer text-sm text-gray-300 hover:text-white">
              📊 Score-Breakdown anzeigen
            </summary>
            <div className="px-4 pb-4 space-y-2">
              {Object.entries(analysis.fitScore.breakdown).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{key}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (val / 30) * 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-300 w-6 text-right">{val}</span>
                  </div>
                </div>
              ))}
            </div>
          </details>

          {/* Compliance-Details */}
          {(analysis.compliance.violations.length > 0 || analysis.compliance.warnings.length > 0) && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="text-sm font-medium text-gray-300">⚠️ Compliance-Details</div>
              {analysis.compliance.violations.map((v, i) => (
                <div key={i} className="text-xs text-red-300 flex gap-2">
                  <span>❌</span>
                  <span>{v.description}</span>
                </div>
              ))}
              {analysis.compliance.warnings.map((w, i) => (
                <div key={i} className="text-xs text-yellow-300 flex gap-2">
                  <span>⚠️</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Draft-Nachricht */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-300">
                ✉️ Vorgeschlagene Nachricht ({analysis.draft.channel})
              </div>
              <CopyButton
                text={
                  analysis.draft.subject
                    ? `Betreff: ${analysis.draft.subject}\n\n${analysis.draft.body}`
                    : analysis.draft.body
                }
                disabled={!canCopy}
              />
            </div>

            {!canCopy && (
              <div className="text-xs text-yellow-300 bg-yellow-900/20 border border-yellow-800 rounded px-3 py-2">
                ⚠️ Kopieren erst möglich wenn Fit Score ≥ 70 UND Compliance = safe.
                {analysis.fitScore.blockedByScore && ` (Score: ${analysis.fitScore.score}/100)`}
                {analysis.compliance.status === 'blocked' && ' (Compliance: blocked)'}
              </div>
            )}

            {analysis.draft.subject && (
              <div className="text-xs text-gray-400">
                <strong>Betreff:</strong> {analysis.draft.subject}
              </div>
            )}
            <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans bg-gray-900 rounded p-3 text-xs leading-relaxed max-h-80 overflow-y-auto">
              {analysis.draft.body}
            </pre>
          </div>

          {/* Empfehlung */}
          <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300">
            <strong className="text-white">Empfehlung:</strong>{' '}
            {analysis.fitScore.recommendation}
          </div>

          {/* Approval-Blocker */}
          {analysis.approval.blockers.length > 0 && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <div className="text-sm text-red-300 font-medium mb-2">🚫 Approval-Blocker</div>
              {analysis.approval.blockers.map((b, i) => (
                <div key={i} className="text-xs text-red-300">• {b}</div>
              ))}
            </div>
          )}

          {/* Aktions-Buttons */}
          <div className="flex flex-wrap gap-3">
            <CopyButton
              text={
                analysis.draft.subject
                  ? `Betreff: ${analysis.draft.subject}\n\n${analysis.draft.body}`
                  : analysis.draft.body
              }
              disabled={!canCopy}
            />

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saveLoading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded text-sm font-medium transition-colors"
            >
              {saveLoading ? '⏳ Speichere…' : '💾 Als Entwurf speichern'}
            </button>

            <button
              type="button"
              onClick={() => handleSave('needs_review')}
              disabled={saveLoading}
              className="px-4 py-2 bg-yellow-800 hover:bg-yellow-700 disabled:bg-gray-800 text-white rounded text-sm font-medium transition-colors"
            >
              🔍 Zur Prüfung markieren
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setAnalysis(null); setSavedId(null); setStatusMsg(null) }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
            >
              ← Neue Analyse
            </button>
          </div>

          {saveError && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded px-3 py-2">
              {saveError}
            </div>
          )}
          {statusMsg && (
            <div className="text-green-300 text-sm bg-green-900/20 border border-green-800 rounded px-3 py-2">
              {statusMsg}
            </div>
          )}
        </div>
      )}

      {/* ════════════ SCHRITT 3: Nach dem Speichern ════════════ */}
      {step === 3 && savedId && (
        <div className="space-y-5">
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
            <div className="text-green-300 font-medium mb-1">✅ Eintrag gespeichert</div>
            <div className="text-xs text-gray-400">ID: {savedId}</div>
            {statusMsg && <div className="text-sm text-green-200 mt-1">{statusMsg}</div>}
          </div>

          {analysis && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="text-sm text-gray-300 font-medium">Nächste Aktionen</div>

              {/* Copy als letzte Chance */}
              <div className="flex flex-wrap gap-3">
                <CopyButton
                  text={
                    analysis.draft.subject
                      ? `Betreff: ${analysis.draft.subject}\n\n${analysis.draft.body}`
                      : analysis.draft.body
                  }
                  disabled={!canCopy}
                />

                {canCopy && (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('approved_for_manual_copy')}
                    disabled={saveLoading}
                    className="px-4 py-2 bg-green-800 hover:bg-green-700 disabled:bg-gray-800 text-white rounded text-sm font-medium transition-colors"
                  >
                    ✅ Freigeben (Copy ready)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleStatusUpdate('contacted_manual')}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded text-sm font-medium transition-colors"
                >
                  ☑️ Kontakt manuell erledigt
                </button>
              </div>

              {/* Nächste sichere Aktion */}
              <div className="text-xs text-blue-300 bg-blue-900/20 border border-blue-800 rounded px-3 py-2">
                🎯 Nächste sichere Aktion: <strong>{analysis.approval.nextSafeAction}</strong>
              </div>
            </div>
          )}

          {saveError && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded px-3 py-2">
              {saveError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep(1)
                setForm({ company_name: '', website: '', sector: '', contact_person: '', contact_method: 'whatsapp', contact_address: '', notes: '' })
                setAnalysis(null)
                setSavedId(null)
                setStatusMsg(null)
                setSaveError(null)
              }}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
            >
              ➕ Neue Firma analysieren
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
            >
              ← Zurück zur Analyse
            </button>
          </div>

          {/* Phase-2-Hinweis */}
          <details className="bg-gray-800 rounded-lg">
            <summary className="px-4 py-3 cursor-pointer text-xs text-gray-500 hover:text-gray-300">
              ℹ️ Phase 2 — Wann wird automatischer Versand möglich?
            </summary>
            <div className="px-4 pb-4 text-xs text-gray-400 space-y-2">
              <p>Phase 2 Versand erfordert <strong>ALLE</strong> folgenden Bedingungen:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>EMAIL_PROVIDER ≠ none (aktuell: none)</li>
                <li>OUTREACH_EMAIL_PROVIDER ≠ none (aktuell: none)</li>
                <li>Kontaktquelle: existing_relationship oder explicit_opt_in</li>
                <li>Compliance Agent = safe</li>
                <li>Fit Score ≥ 70</li>
                <li>Explizit freigegeben durch Admin</li>
                <li>Tageslimit nicht überschritten (max 5/Tag)</li>
                <li>Vollständiges Audit-Log vorhanden</li>
                <li>Opt-out/Stop-Vermerk vorhanden</li>
              </ul>
              <p className="text-gray-500 mt-2">
                <strong>Phase 1 (jetzt):</strong> Kein automatischer Versand. Nur Copy & Paste.
              </p>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
