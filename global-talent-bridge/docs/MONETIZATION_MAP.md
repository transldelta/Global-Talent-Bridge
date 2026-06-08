# 💰 Monetization Map — CorridorWork

*Letzte Aktualisierung: 2026-06-08 · Sprint: Corridor Intelligence*

> **Warum ist dieser Doc kein eigenständiges System?**
> Die Monetization Map ist eine Datenschicht in `lib/corridor-intelligence.ts`
> (`MONETIZATION_PATHS`), die auf `/admin/corridor-intelligence` → Tab
> "Monetization Map" angezeigt wird. Der Inhalt ergänzt
> `docs/FINAL_COMPLETION_AND_MONETIZATION_READINESS.md` mit dem
> technischen/strukturellen Fokus.

---

## 7 Monetarisierungspfade

Sortiert nach Aufwand (niedrigste Barrier to Entry zuerst):

### 🟢 Low Effort

| ID | Pfad | Revenue-Typ | Kernaussage |
|---|---|---|---|
| `employer_pilot` | Employer Pilot Package | one-time | Schnellste Aktivierung sobald erster Pilot-Arbeitgeber on-board |
| `partner_intelligence` | Partner Intelligence Package | recurring | Intelligence-as-a-Service — kein Placement-Involvement erforderlich |
| `saas_agency` | SaaS Licence für Recruiting Agencies | recurring | Natürlichster erster kommerzieller Schritt; Corridor Intelligence als Differenziator |

### 🟡 Medium Effort

| ID | Pfad | Revenue-Typ | Kernaussage |
|---|---|---|---|
| `white_label` | White-Label Licence | licence | Höherer Wert pro Kunde; UI-Customization; Architektur unterstützt dies |
| `candidate_source` | Candidate Source Partnership | recurring | Umgekehrtes Modell: Candidate Sources zahlen für Employer-Demand-Daten |

### 🔴 High Effort (strategic)

| ID | Pfad | Revenue-Typ | Kernaussage |
|---|---|---|---|
| `corridor_dashboard` | Market Corridor Intelligence Dashboard | licence | Premium für HR-Tech-Unternehmen, Behörden, Investoren |
| `acquisition` | **Acquisition** | one-time | **Primäres Ziel** — Platform transfer-ready: Supabase + Vercel transferierbar |

---

## Primärziel: Acquisition

Das aktuelle Ziel ist **Akquisition durch ein Recruiting- oder HR-Tech-Unternehmen**.

**Transfer-Bereitschaft:**
- ✅ Supabase-Projekt transferierbar (Settings → Transfer Project)
- ✅ Vercel-Projekt transferierbar
- ✅ JSON-Export via `/api/admin/growth/export`
- ✅ Alle Env-Vars in `.env.example` dokumentiert
- ✅ Vollständige Docs + Git History

## Sicherheits-Rahmen (alle Pfade)

- ❌ Kein Stripe aktiviert
- ❌ Keine automatischen Zahlungsflows
- ❌ Keine versprochenen Umsatzzahlen
- ❌ Keine Jobgarantie
- ❌ Keine Visagarantie
- ✅ Alle Monetarisierungspfade erfordern manuelle Aktivierung

## Wo anzeigen?

- Admin: `/admin/corridor-intelligence` → Tab **💰 Monetization Map**
- Daten: `lib/corridor-intelligence.ts` → `MONETIZATION_PATHS`

## Verwandte Docs

- [`CORRIDOR_INTELLIGENCE.md`](./CORRIDOR_INTELLIGENCE.md) — Vollständige Corridor-Engine-Dokumentation
- [`FINAL_COMPLETION_AND_MONETIZATION_READINESS.md`](./FINAL_COMPLETION_AND_MONETIZATION_READINESS.md) — Detaillierte Monetarisierungsbereitschaft
- [`BUYER_VALUE_LAYER.md`](./BUYER_VALUE_LAYER.md) — Käufer-Wertversprechen
- [`BUYER_READY_PACKAGE.md`](./BUYER_READY_PACKAGE.md) — Vollständiges Käuferpaket
