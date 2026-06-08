# 🏆 Buyer Value Layer — CorridorWork

*Letzte Aktualisierung: 2026-06-08 · Sprint: Corridor Intelligence*

> **Warum ist dieser Doc kein eigenständiges System?**
> Der Buyer Value Layer ist eine Datenschicht in `lib/corridor-intelligence.ts`
> (`BUYER_VALUE_ITEMS`, `BUYER_DIFFERENTIATION`), die direkt auf Admin-Seite
> `/admin/corridor-intelligence` → Tab "Buyer Value Layer" angezeigt wird.
> Er ist bewusst in die Corridor Intelligence Datenschicht integriert,
> da er denselben Käufer-Kontext beschreibt.

---

## Was ist der Buyer Value Layer?

Eine strukturierte Übersicht aller Wertversprechen der CorridorWork-Plattform,
organisiert in 7 Kategorien — direkt für Käufer/Investoren aufbereitet.

## Positionierung

> *CorridorWork ist ein globales Corridor Operating System — kein Jobboard.
> Der Wert liegt in der Priorisierung von High-Potential-Korridoren,
> der Vorbereitung konformer Wachstumsaktionen und der Steuerung jedes
> Employer-, Partner- und Candidate-Source-Schritts durch eine persistente
> Approval Queue, gesichert durch eine DSGVO-konforme EU-Datenbank.*

## Die 7 Wert-Kategorien

| # | Kategorie | Kernaussage |
|---|---|---|
| 1 | Employer side | Strukturiertes Demand-Intake, manuelle Review-Workflows, Fit Scoring |
| 2 | Candidate source side | Inbound-Interest, 12 Quellmärkte, freiwillig, keine Kandidatengebühren |
| 3 | Partner side | 4 Partner-Tracks (Agencies, Relocation, Language Schools, Strategic) |
| 4 | Corridor intelligence | 8 Korridore mit Buyer Opportunity Scores, 3 Demo-Deepdives |
| 5 | Approval-based growth pipeline | Persistente Supabase-Tabellen, Quick Add, Gmail Draft, Approval Queue |
| 6 | Buyer transfer readiness | JSON Export, Transfer-Checklist, Supabase + Vercel transferierbar |
| 7 | Safety & compliance | no_auto_send DB-Constraint, RLS aktiv, kein Scraping, kein Stripe |

## Wo anzeigen?

- Admin: `/admin/corridor-intelligence` → Tab **🏆 Buyer Value Layer**
- Daten: `lib/corridor-intelligence.ts` → `BUYER_VALUE_ITEMS`, `BUYER_DIFFERENTIATION`

## Verwandte Docs

- [`CORRIDOR_INTELLIGENCE.md`](./CORRIDOR_INTELLIGENCE.md) — Vollständige Corridor-Engine-Dokumentation
- [`BUYER_ONE_PAGER.md`](./BUYER_ONE_PAGER.md) — Kompakter Käufer-Überblick
- [`BUYER_TRANSFER_DATA_EXPORT.md`](./BUYER_TRANSFER_DATA_EXPORT.md) — Transfer-Checkliste
- [`EXIT_READINESS.md`](./EXIT_READINESS.md) — Exit-Bereitschafts-Audit
