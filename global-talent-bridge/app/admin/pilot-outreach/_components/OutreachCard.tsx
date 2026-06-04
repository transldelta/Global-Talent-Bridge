'use client'

import { useState } from 'react'
import { CopyButton } from './CopyButton'
import { StatusUpdater } from './StatusUpdater'
import {
  generateTemplates,
  inferCorridor,
  PILOT_STATUS_LABELS,
  FEEDBACK_STATE_LABELS,
  FEEDBACK_STATE_NOTES,
  type FeedbackState,
} from '@/lib/outreach/templates'

type Employer = {
  id: string
  company_name: string
  country: string
  industry: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  status: string
  interest_level: string
  next_step: string | null
  notes: string | null
  source: string | null
}

type Props = { employer: Employer }

const TABS = ['email', 'whatsapp', 'linkedin'] as const
type Tab = typeof TABS[number]

const TAB_LABELS: Record<Tab, string> = {
  email: '📧 E-Mail',
  whatsapp: '💬 WhatsApp',
  linkedin: '💼 LinkedIn',
}

const FEEDBACK_STATES: FeedbackState[] = ['interesse', 'kein_interesse', 'rueckruf', 'demo', 'einwand']

export function OutreachCard({ employer }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('email')
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackState | null>(null)

  const corridor = inferCorridor(employer.country, employer.industry)
  const ctx = {
    companyName: employer.company_name,
    contactName: employer.contact_name,
    country: employer.country,
    industry: employer.industry,
    corridor,
  }
  const templates = generateTemplates(ctx)

  const activeTemplate = templates[activeTab]
  const textToCopy = activeTab === 'email'
    ? `Betreff: ${activeTemplate.subject ?? ''}\n\n${activeTemplate.body}`
    : activeTemplate.body

  const statusMeta = PILOT_STATUS_LABELS[employer.status] ?? { label: employer.status, color: 'text-gray-400' }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">{employer.company_name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-800 font-medium ${statusMeta.color}`}>
                {statusMeta.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                {templates.type}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {employer.country}{employer.industry ? ` · ${employer.industry}` : ''}
            </p>
            <p className="text-xs text-blue-400 mt-0.5">🗺️ Korridor: {corridor}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            {employer.contact_name && <p>👤 {employer.contact_name}</p>}
            {employer.contact_email && <p>📧 {employer.contact_email}</p>}
            {employer.contact_phone && <p>📞 {employer.contact_phone}</p>}
          </div>
        </div>

        {/* Status-Updater */}
        <div className="mt-3">
          <StatusUpdater
            employerId={employer.id}
            currentStatus={employer.status}
            companyName={employer.company_name}
          />
        </div>
      </div>

      {/* Template-Tabs */}
      <div className="p-5">
        <div className="flex gap-2 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Subject (nur E-Mail) */}
        {activeTab === 'email' && activeTemplate.subject && (
          <div className="mb-3 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Betreff</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-white font-medium">{activeTemplate.subject}</p>
              <CopyButton text={activeTemplate.subject} label="Betreff" />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Nachrichtentext</p>
            <CopyButton text={textToCopy} label="Alles kopieren" />
          </div>
          <pre className="p-4 text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed max-h-80 overflow-y-auto">
            {activeTemplate.body}
          </pre>
        </div>

        <p className="text-xs text-gray-600 mt-2">
          ⚠️ Platzhalter in [eckigen Klammern] vor dem Senden ersetzen. Kein automatischer Versand.
        </p>
      </div>

      {/* Feedback-Vorbereitung */}
      <div className="px-5 pb-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Feedback-Vorbereitung</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {FEEDBACK_STATES.map((state) => (
            <button
              key={state}
              onClick={() => setSelectedFeedback(selectedFeedback === state ? null : state)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                selectedFeedback === state
                  ? 'bg-blue-800/50 text-blue-300 border border-blue-700'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {FEEDBACK_STATE_LABELS[state]}
            </button>
          ))}
        </div>

        {selectedFeedback && (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-400 leading-relaxed">
              💡 <strong className="text-white">{FEEDBACK_STATE_LABELS[selectedFeedback]}:</strong>{' '}
              {FEEDBACK_STATE_NOTES[selectedFeedback]}
            </p>
          </div>
        )}
      </div>

      {/* Notes */}
      {employer.notes && (
        <div className="px-5 pb-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notizen</p>
          <p className="text-xs text-gray-400 bg-gray-800/30 rounded-lg p-3 border border-gray-700">
            {employer.notes}
          </p>
        </div>
      )}
    </div>
  )
}
