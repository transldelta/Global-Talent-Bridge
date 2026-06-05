'use client'

/**
 * DemoModeBanner — zeigt einen deutlichen Banner wenn Demo Mode aktiv ist.
 * Verwendet NEXT_PUBLIC_BUYER_DEMO_MODE (client-safe env var).
 */

export function DemoModeBanner() {
  const isDemo = process.env.NEXT_PUBLIC_BUYER_DEMO_MODE?.toLowerCase() === 'true'
  if (!isDemo) return null

  return (
    <div className="mb-6 bg-amber-900/20 border border-amber-700/50 rounded-xl px-4 py-3 flex items-start gap-3">
      <span className="text-amber-400 text-lg flex-shrink-0">🎬</span>
      <div>
        <p className="text-amber-300 text-sm font-semibold">
          Demo-Modus aktiv — Beispieldaten, keine echten Kunden oder Umsätze.
        </p>
        <p className="text-amber-400/70 text-xs mt-0.5">
          Demo Mode active — sample data only, not real customers or revenue. All demo items are tagged{' '}
          <code className="bg-amber-900/30 px-1 rounded">demo: true</code>.
        </p>
      </div>
    </div>
  )
}

/**
 * StaticDemoModeBanner — Server-Component-kompatibel.
 * Immer sichtbar auf der Data Room Seite (demo-aware page).
 */
export function StaticDemoModeBanner({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div className="mb-6 bg-amber-900/20 border border-amber-700/50 rounded-xl px-4 py-3 flex items-start gap-3">
      <span className="text-amber-400 text-lg flex-shrink-0">🎬</span>
      <div>
        <p className="text-amber-300 text-sm font-semibold">
          Demo-Modus aktiv — Beispieldaten, keine echten Kunden oder Umsätze.
        </p>
        <p className="text-amber-400/70 text-xs mt-0.5">
          Demo Mode active — sample data only, not real customers or revenue. All demo items are tagged{' '}
          <code className="bg-amber-900/30 px-1 rounded">demo: true</code>.
          Aktivieren: <code className="bg-amber-900/30 px-1 rounded">BUYER_DEMO_MODE=true</code>
        </p>
      </div>
    </div>
  )
}
