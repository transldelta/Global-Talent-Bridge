import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Visionary Strategy Agent
 * Erstellt langfristige strategische Chancen basierend auf aktuellem Plattform-Zustand.
 * Klar als Potenzial markiert, nicht als Umsatz.
 * Keine externen APIs. Ehrlich über Risiken.
 */
export async function runVisionaryAgent(): Promise<{ suggestions: number }> {
  const supabase = createAdminClient()

  // ── Plattform-Zustand lesen ───────────────────────────────────────────────
  const [candidatesRes, employersRes, matchesRes, pricingRes] = await Promise.all([
    supabase.from('candidates').select('*', { count: 'exact', head: true }),
    supabase.from('employers').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('pricing_plans').select('plan_key, monthly_price_eur, active'),
  ])

  const candidates = candidatesRes.count ?? 0
  const employers = employersRes.count ?? 0
  const matches = matchesRes.count ?? 0
  const pricingPlans = pricingRes.data ?? []
  const maxPrice = pricingPlans.reduce(
    (max: number, p: { monthly_price_eur: number }) => Math.max(max, p.monthly_price_eur),
    0
  )

  // ── Deduplication ─────────────────────────────────────────────────────────
  const { data: existingSuggestions } = await supabase
    .from('agent_suggestions')
    .select('title')
    .eq('status', 'suggested')

  const existingTitles = new Set((existingSuggestions ?? []).map((s: { title: string }) => s.title))

  // ── Visionäre Chancen (fest, ehrlich als MVP-Potenzial markiert) ──────────
  const opportunities = [
    {
      title: '🏥 Pilotprogramm für Pflegeheime & Kliniken',
      description:
        'Pflege ist der Sektor mit dem größten Fachkräftemangel in Deutschland. Ein dediziertes Paket für Pflegeheime (z.B. "Global Talent Pflege") mit vorgefilterten Kandidaten könnte starke Nachfrage erzeugen. Erster Schritt: 2–3 Pflegeheime als Pilot gewinnen.',
      impact_score: 9,
      effort_score: 6,
      risk_score: 4,
      expected_benefit:
        'Bis zu 15+ zahlende Pflegeheime in DACH innerhalb 12 Monaten. Potenzieller Monatsumsatz: 1.500–4.500 € (Potenzial, kein echter Umsatz).',
      risk_note:
        'Regulatorische Anforderungen im Pflegebereich (Anerkennung ausländischer Abschlüsse). Langer Entscheidungszyklus in Kliniken.',
      priority: 'high' as const,
    },
    {
      title: '🤝 B2B-Paket für Personalvermittler & Headhunter',
      description:
        'Personalvermittler könnten CorridorWork als White-Label-Tool nutzen: Sie zahlen ein monatliches Paket, nutzen das Matching für ihre Kunden. Kein direktes Employer-Onboarding nötig — Vermittler bringt Kunden mit.',
      impact_score: 8,
      effort_score: 7,
      risk_score: 5,
      expected_benefit:
        'Jeder B2B-Partner kann 5–20 Arbeitgeber mitbringen. Potenzieller Multiplikator-Effekt (Potenzial, kein echter Umsatz).',
      risk_note:
        'Technische Anpassungen nötig (Multi-Tenant oder Sub-Accounts). Hoher Vertriebsaufwand für B2B-Akquise.',
      priority: 'medium' as const,
    },
    {
      title: '🌍 Kandidatenpool nach Sprachregion aufbauen',
      description:
        'Strukturierter Aufbau nach Herkunftsländern: MENA (Arabisch), Südosteuropa (Rumänisch, Bulgarisch), Lateinamerika (Spanisch). Kandidaten aus Ländern mit hoher Auswanderungsbereitschaft und passenden Qualifikationen gezielt ansprechen.',
      impact_score: 8,
      effort_score: 5,
      risk_score: 3,
      expected_benefit:
        `Mit ${candidates} Kandidaten heute: Ziel 100+ Kandidaten mit guten Deutschkenntnissen für valides Matching.`,
      risk_note:
        'Qualitätskontrolle der Profile nötig. Fake-Accounts verhindern. Verifizierung von Abschlüssen komplex.',
      priority: 'high' as const,
    },
    {
      title: '🎓 Partnerschaften mit Sprachschulen',
      description:
        'Kooperation mit Deutsch-Sprachschulen im Ausland: Schüler, die B1/B2 erreichen, werden automatisch auf CorridorWork aufmerksam gemacht. Sprachschulen empfehlen die Plattform als nächsten Schritt nach dem Sprachkurs.',
      impact_score: 7,
      effort_score: 6,
      risk_score: 3,
      expected_benefit:
        'Organischer Kandidaten-Zustrom ohne bezahlte Werbung. Pro Sprachschulpartner: 10–50 neue Kandidaten/Monat (Potenzial).',
      risk_note:
        'Verhandlungen mit Sprachschulen dauern. Keine Garantie für Conversion. Erfordert klaren Mehrwert für Sprachschulen.',
      priority: 'medium' as const,
    },
    {
      title: '💼 Premium-Matching-Paket für Arbeitgeber',
      description:
        `Aktuell kein aktiver Pricing-Plan. Maximaler Plan: ${maxPrice > 0 ? `${maxPrice} €/Monat` : 'noch nicht definiert'}. Sobald 5 Pilot-Arbeitgeber positives Feedback geben, kann ein Premium-Paket mit erweiterten Features (z.B. direkter Kontaktfreischaltung, Priorisierung, Analytics) eingeführt werden.`,
      impact_score: 9,
      effort_score: 4,
      risk_score: 3,
      expected_benefit:
        `Bei ${employers} Arbeitgeber${employers !== 1 ? 'n' : ''} heute: Ziel 20 zahlende Arbeitgeber = potenziell 1.000–3.000 €/Monat (Potenzial, kein echter Umsatz).`,
      risk_note:
        'Erst nach echtem Mehrwert-Nachweis durch Pilot-Phase einführen. Kein Stripe vor stabiler Nutzerbasis.',
      priority: matches > 5 ? ('high' as const) : ('medium' as const),
    },
    {
      title: '🇪🇺 Internationale Expansion: Österreich & Schweiz',
      description:
        'DACH-Erweiterung als logischer nächster Schritt. Österreich und die Schweiz haben ähnliche Fachkräftemangel-Probleme, aber kleinere Märkte. Weniger regulatorische Komplexität als neue EU-Länder.',
      impact_score: 7,
      effort_score: 8,
      risk_score: 6,
      expected_benefit:
        'Potenziell +30% Marktgröße durch DACH. Neue Arbeitgeber-Segmente ohne neue Plattform-Funktionen.',
      risk_note:
        'Österreichisches Arbeitsrecht unterscheidet sich. Schweizer Markt sehr wettbewerbsintensiv. Erst nach stabilem Deutschland-Piloten.',
      priority: 'low' as const,
    },
  ]

  const suggestionsToInsert = opportunities
    .filter((o) => !existingTitles.has(o.title))
    .map((o) => ({
      department_slug: 'visionary_strategy',
      title: o.title,
      description: o.description,
      category: 'vision',
      priority: o.priority,
      impact_score: o.impact_score,
      effort_score: o.effort_score,
      risk_score: o.risk_score,
      expected_benefit: o.expected_benefit,
      risk_note: o.risk_note,
      requires_approval: false,
    }))

  let suggestionsCreated = 0
  if (suggestionsToInsert.length > 0) {
    const { error } = await supabase.from('agent_suggestions').insert(suggestionsToInsert)
    if (!error) suggestionsCreated = suggestionsToInsert.length
  }

  return { suggestions: suggestionsCreated }
}
