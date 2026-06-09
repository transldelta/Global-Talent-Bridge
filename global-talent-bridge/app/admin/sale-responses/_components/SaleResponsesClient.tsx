'use client'

import { useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'first-reply' | 'tech-dd' | 'pricing' | 'qa-bank' | 'red-lines'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'first-reply', label: 'First Reply',       icon: '✉️'  },
  { id: 'tech-dd',     label: 'Technical DD',      icon: '🔧'  },
  { id: 'pricing',     label: 'Pricing',           icon: '💶'  },
  { id: 'qa-bank',     label: 'Q&A Bank',          icon: '❓'  },
  { id: 'red-lines',   label: 'Red Lines',         icon: '🚫'  },
]

// ── Template block ────────────────────────────────────────────────────────────

function TemplateBlock({ subject, body }: { subject: string; body: string }) {
  const [copied, setCopied] = useState(false)
  const full = `Subject: ${subject}\n\n${body}`
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-850">
        <span className="text-xs text-gray-400 font-mono">Subject: {subject}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(full); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed p-4">{body}</pre>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-white border-b border-gray-800 pb-2">{title}</h2>
      {children}
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-blue-950/30 border border-blue-800/30 p-3 text-xs text-blue-200">
      {children}
    </div>
  )
}

function RedLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start text-sm">
      <span className="text-red-400 mt-0.5 shrink-0">✗</span>
      <span className="text-gray-300">{children}</span>
    </div>
  )
}

function GreenLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start text-sm">
      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
      <span className="text-gray-300">{children}</span>
    </div>
  )
}

// ── Tab content ───────────────────────────────────────────────────────────────

function FirstReplyTab() {
  return (
    <div className="space-y-6">
      <Note>
        Use when someone contacts you with initial acquisition interest. Personalise [Name] before sending.
        Send manually — no auto-send.
      </Note>
      <Section title="Template — Initial Response">
        <TemplateBlock
          subject="Re: CorridorWork — thank you for your interest"
          body={`Hi [Name],

Thank you for reaching out about CorridorWork.

To be straightforward from the start:

CorridorWork is pre-revenue. There are no paying customers and no MRR. The opportunity is an asset-based sale — not a revenue multiple — so the asking price reflects the built infrastructure, not traction.

What is included in the sale:
- Live domain: corridorwork.com
- Full codebase (Next.js, TypeScript strict, Supabase, Vercel)
- Public-facing site: employer, candidate, partner, demo, and buyer pages
- Protected admin toolset and buyer-room documentation
- Documented transfer steps for all four assets (domain, GitHub, Vercel, Supabase)
- Latest lint, TypeScript, build, and test suite passed

What is not included:
- Revenue, customers, or signed agreements — none exist
- Staff or ongoing support beyond the handover process

If you have technical questions, I am happy to answer them in writing. I can share a short buyer overview document as a first step, and provide deeper technical due-diligence materials after confirmed mutual interest.

No obligation and no pressure.

Kind regards,
[Your name]
CorridorWork
corridorwork.com`}
        />
      </Section>
      <Section title="Founder notes">
        <div className="space-y-2 text-sm text-gray-400">
          <div>→ Revenue question: answer €0 MRR, 0 customers, pre-revenue asset stage. Always.</div>
          <div>→ Transfer time: do not give a fixed number of days — say it depends on domain, GitHub, Vercel, Supabase, and buyer account setup.</div>
          <div>→ Admin access / credentials: decline until escrow is in place. See Red Lines tab.</div>
          <div>→ Fast offer: welcome in writing. Point to corridorwork.com/for-buyers for context.</div>
        </div>
      </Section>
    </div>
  )
}

function TechDDTab() {
  return (
    <div className="space-y-6">
      <Note>
        Use when a buyer asks about the stack, code quality, test coverage, or transfer process.
        Answer in writing only — no live screen shares that expose credentials.
      </Note>
      <Section title="Template — General Technical Overview">
        <TemplateBlock
          subject="Re: CorridorWork — technical overview"
          body={`Hi [Name],

Happy to walk you through the technical picture.

Stack:
- Framework: Next.js App Router, React, TypeScript (strict mode)
- Database: Supabase PostgreSQL 17, EU-Frankfurt region, GDPR compliant
- Deployment: Vercel, serverless, auto-deploy from GitHub
- Authentication: Supabase Auth
- Code quality: latest lint, TypeScript, build, and test suite all passed — zero errors

What is documented:
- Full technical architecture (docs/buyer-package/technical-architecture.md)
- Security and RLS overview (docs/buyer-package/security-rls-overview.md)
- Deployment and transfer checklist (docs/buyer-package/deployment-transfer-checklist.md)
- Admin toolset overview accessible from the buyer room documentation

Transfer process:
The transfer involves four independently transferable assets:
1. Domain (corridorwork.com) — registrar transfer
2. GitHub repository — transfer to buyer's GitHub account
3. Vercel project — transfer to buyer's Vercel account
4. Supabase project — transfer to buyer's Supabase account

Actual transfer timing depends on registrar processing, GitHub transfer acceptance,
Vercel project migration, and buyer-side account setup. Documented handover steps
are included.

Credentials policy:
I do not share Supabase connection strings, API keys, or admin credentials until
payment is confirmed in escrow. This protects both parties.

Happy to answer specific technical questions in writing.

Kind regards,
[Your name]
CorridorWork`}
        />
      </Section>
      <Section title="Template — Code Review Request">
        <TemplateBlock
          subject="Re: CorridorWork — code access"
          body={`Hi [Name],

For code review purposes, I can share:
- Read-only GitHub repository access — after you confirm your GitHub username
  and we agree on the scope of the review
- Technical architecture and security docs from the buyer package

I will not provide:
- Database credentials or Supabase service role keys before escrow payment
- Admin panel login credentials before escrow payment
- Write access to any production resource

Once a formal process is agreed (escrow step initiated), I am happy to arrange
a time-limited read-only review of the full codebase.

Does that work for you?

Kind regards,
[Your name]
CorridorWork`}
        />
      </Section>
    </div>
  )
}

function PricingTab() {
  return (
    <div className="space-y-6">
      <Note>
        Core position: asset-based sale, not revenue-multiple. €0 MRR, 0 customers. Be honest.
        Current realistic range: €15 000–€25 000. Higher tiers require documented market signals.
      </Note>
      <Section title="Tier ladder (reference only — do not promise)">
        <div className="rounded-lg border border-gray-700 bg-gray-900 divide-y divide-gray-800">
          {[
            { tier: 'Tier 1 (current)', range: '€15 000–€25 000', condition: 'Asset-as-is, no proof required' },
            { tier: 'Tier 2', range: '€30 000–€50 000', condition: 'With documented buyer signals or pilot interest' },
            { tier: 'Tier 3', range: '€50 000–€69 000+', condition: 'With first paying customer or signed LOI' },
          ].map(({ tier, range, condition }) => (
            <div key={tier} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="text-gray-400 w-36 shrink-0">{tier}</span>
              <span className="text-white font-medium w-36 shrink-0">{range}</span>
              <span className="text-gray-500 text-xs">{condition}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Template — Responding to a price question">
        <TemplateBlock
          subject="Re: CorridorWork — pricing"
          body={`Hi [Name],

Happy to discuss pricing directly.

The asking price for CorridorWork is positioned as follows:

Current realistic range: €15 000–€25 000

This reflects an asset-based valuation — not a revenue multiple. The reasoning:
- CorridorWork is pre-revenue: €0 MRR, 0 paying customers
- The value is the built infrastructure: codebase, domain, deployment,
  documentation, and corridor intelligence engine
- A buyer with existing market relationships can activate this infrastructure
  without building it from scratch
- No revenue guarantee, no customer guarantee, no placement guarantee

The price is negotiable. I am open to serious written offers.

What affects the final price:
- Buyer's ability to close quickly and manage the transfer independently
- Whether the buyer brings documented market interest that validates the product
- Transfer terms agreed

What does not affect the price:
- Future revenue projections — I will not make them
- Growth trajectory promises — I will not make them
- Job, visa, or placement guarantees — not applicable

If you would like to make an offer, please do so in writing with your proposed
price and any conditions.

Kind regards,
[Your name]
CorridorWork`}
        />
      </Section>
      <Section title="Template — Responding to a low offer">
        <TemplateBlock
          subject="Re: CorridorWork — counter offer"
          body={`Hi [Name],

Thank you for the offer.

The infrastructure included — live domain, production-grade Next.js/Supabase codebase,
Vercel deployment, admin toolset, corridor intelligence engine, full documentation,
and transfer-ready process — represents a meaningful development investment.

That said, I understand pre-revenue assets carry real uncertainty for the buyer,
and I have priced accordingly.

I am willing to meet at [your counter-offer]. This is my best realistic position
given the current asset stage.

Kind regards,
[Your name]
CorridorWork`}
        />
      </Section>
    </div>
  )
}

function QABankTab() {
  const QA = [
    {
      q: 'Why are you selling?',
      a: `I am a solo founder who built CorridorWork as a structured infrastructure product for the international talent mobility market. I am prioritising other projects and do not have the market relationships or GTM capacity to activate CorridorWork commercially at this stage.

A buyer with existing distribution in HR-tech, international recruiting, or talent mobility can activate this infrastructure faster than I can.`,
    },
    {
      q: 'Is there revenue?',
      a: `No. CorridorWork is pre-revenue. €0 MRR, €0 ARR. No paying customers, no paid subscriptions, no commercial transactions of any kind.

The sale is asset-based, not revenue-multiple based.`,
    },
    {
      q: 'Are there customers?',
      a: `No. There are 0 paying customers and 0 signed agreements with any organisation. The platform has functioning intake forms, but no one has gone through a full commercial onboarding. No LOIs. No pilot agreements.`,
    },
    {
      q: 'What is included?',
      a: `1. Domain — corridorwork.com (live, HTTPS, indexed)
2. Codebase — full Next.js / TypeScript / Supabase / Vercel repository
3. Database — Supabase PostgreSQL 17, EU-Frankfurt, all schema and RLS policies
4. Vercel deployment — production project, auto-deploy from GitHub
5. Admin toolset — 10+ admin pages
6. Documentation — 50+ markdown files (architecture, security, transfer guide, buyer package, market signal sprint)
7. Corridor intelligence engine — 8 scored global talent corridors
8. Public pages — employer, candidate, partner, demo, for-buyers`,
    },
    {
      q: 'What is not included?',
      a: `- Revenue or MRR — none exists
- Paying customers or signed agreements — none exist
- Staff or employees — solo founder, no team
- Ongoing support beyond agreed handover steps
- Guarantees of any kind: no revenue, growth, customer, job, visa, or placement guarantee
- Third-party contracts — none are in place
- Personal candidate data — not transferred`,
    },
    {
      q: 'How hard is the transfer?',
      a: `Four independently transferable steps:
1. Domain transfer — registrar process
2. GitHub repository transfer — requires buyer GitHub account
3. Vercel project transfer — requires buyer Vercel account
4. Supabase project transfer — requires buyer Supabase account

I will not quote a fixed number of days — it depends on registrar processing and buyer account readiness. A technically experienced buyer should find it straightforward. Full handover documentation is included.`,
    },
    {
      q: 'Can I see the code?',
      a: `Yes, under the right conditions.

Before escrow: read-only GitHub access after you provide your username and we agree on scope and duration.

Admin credentials and Supabase keys: only after payment confirmed in escrow.`,
    },
    {
      q: 'Is there outreach or market proof?',
      a: `Not yet. A Market Signal Sprint has been prepared with buyer profiles, pilot customer profiles, partner profiles, and outreach templates. No outreach has been sent. Commercial Proof score is 7/100 (LOW) — stated honestly in the buyer docs.

A buyer who executes the sprint can generate their own validation signals.`,
    },
    {
      q: 'What are the next growth steps?',
      a: `Potential steps for a buyer (none guaranteed):
1. Activate employer intake in high-score corridors (Germany Healthcare 93, Germany Engineering 87)
2. Partner with a recruitment agency — provide corridor intelligence as a value-add
3. Run a pilot — offer corridor briefings to 1–3 employers to generate written market feedback
4. Monetise corridor data — subscription or one-time intelligence package
5. White-label — licence the corridor intelligence engine to an ATS or HRIS platform

All require a buyer with existing market relationships and execution capacity.`,
    },
  ]

  return (
    <div className="space-y-4">
      <Note>
        Honest, pre-drafted answers. Review before sending. No revenue, customer, or guarantee claims in any answer.
      </Note>
      {QA.map(({ q, a }) => (
        <div key={q} className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
          <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
            <p className="text-sm font-medium text-white">{q}</p>
          </div>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed px-4 py-3">{a}</pre>
        </div>
      ))}
    </div>
  )
}

function RedLinesTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-md bg-red-950/30 border border-red-800/30 p-3 text-xs text-red-200">
        ⚠️ These are absolute rules. No exception. No &ldquo;just this once.&rdquo;
      </div>

      {[
        {
          title: '1. Do not promise revenue',
          bad: ['Saying "you can expect €X MRR within 6 months"', 'Citing comparable platforms\' earnings', 'Saying "with your network this will monetise quickly"'],
          good: ['"CorridorWork is pre-revenue. I cannot predict or guarantee future revenue."'],
        },
        {
          title: '2. Do not promise customers',
          bad: ['Claiming there are "interested organisations ready to sign"', 'Saying "I have warm leads ready for you"', 'Describing test submissions as customers'],
          good: ['"There are 0 paying customers and 0 signed agreements."'],
        },
        {
          title: '3. Do not promise jobs, visas, or placements',
          bad: ['Saying "the platform will help candidates get jobs in Germany"', 'Quoting placement or visa success rates'],
          good: ['"CorridorWork is a corridor intelligence tool — not a placement or visa service."'],
        },
        {
          title: '4. Do not share credentials before escrow payment',
          bad: ['Sharing Supabase connection string or service role key', 'Sharing Vercel API token', 'Giving GitHub write access', 'Sharing admin panel login', 'Sharing any .env file contents'],
          good: ['Read-only GitHub access is OK before escrow', 'Documentation sharing is OK before escrow', 'Full credentials: only after escrow payment confirmed'],
        },
        {
          title: '5. Use escrow for any serious sale',
          bad: ['Wire transfer before transfer begins', 'Crypto without escrow', '"Pay the second half after 30 days" without legal agreement', 'PayPal (chargeable by buyer after transfer)'],
          good: ['Agree escrow service → buyer initiates payment → escrow confirms → transfer → buyer confirms → escrow releases'],
        },
        {
          title: '6. Use written answers for technical questions',
          bad: ['Live screen shares that expose credentials', 'Verbally committing to technical specifications under pressure'],
          good: ['"Happy to answer technical questions in writing first to make sure I give you accurate information."'],
        },
      ].map(({ title, bad, good }) => (
        <Section key={title} title={title}>
          <div className="space-y-1.5">
            {bad.map(b => <RedLine key={b}>{b}</RedLine>)}
            {good.map(g => <GreenLine key={g}>{g}</GreenLine>)}
          </div>
        </Section>
      ))}

      <Section title="Pre-close checklist">
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-2">
          {[
            'Price stated in writing as asset-based, not revenue-multiple',
            'Pre-revenue status stated clearly in every communication',
            'No revenue, customer, job, visa, or placement promises made',
            'No credentials shared before escrow payment confirmed',
            'Written offer and written acceptance on record',
            'Escrow service agreed and payment initiated before transfer starts',
            'Full transfer checklist completed and verified',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-gray-600">☐</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SaleResponsesClient() {
  const [activeTab, setActiveTab] = useState<Tab>('first-reply')

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-800 pb-3">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'first-reply' && <FirstReplyTab />}
      {activeTab === 'tech-dd'     && <TechDDTab />}
      {activeTab === 'pricing'     && <PricingTab />}
      {activeTab === 'qa-bank'     && <QABankTab />}
      {activeTab === 'red-lines'   && <RedLinesTab />}
    </div>
  )
}
