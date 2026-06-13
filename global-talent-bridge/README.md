# CorridorWork

**SaaS-Asset für strukturiertes, compliance-first Cross-border Hiring.**

Live: **https://corridorwork.com**  
Supabase-Region: eu-central-1 (Frankfurt, DE) — DSGVO-konform  
Status: **Phase 1 Pilot** (Stand: 2026-06-07) | Buyer Readiness: 66/100

---

## Was ist CorridorWork?

CorridorWork ist ein live betriebenes SaaS-Asset für strukturiertes Cross-border Hiring. Das System verbindet internationale Fachkräfte (Pflege, Logistik, IT, Bau, Gastronomie) mit Arbeitgebern in Deutschland und Europa über 4 aktive Revenue-Pfade.

**Für Käufer/Partner:** Technisch solide, 0 echter Umsatz, Transfer-Dokumentation vollständig. Ehrlicher Stand: Pre-Revenue Phase 1.

---

## Öffentliche Live-URLs

| Seite | URL | Typ |
|---|---|---|
| Startseite | https://corridorwork.com | Marketing |
| Launch-Übersicht | /launch | Revenue |
| Buyer Snapshot | /buyer-snapshot | Buyer |
| Strategic Partnership | /strategic-partnership | Revenue (Rang 1) |
| Agency Partner | /partners | Revenue (Rang 2) |
| Employer Pilot | /pilot/employers | Revenue (Rang 3) |
| Market Intelligence | /market-intelligence | Revenue (Rang 4) |
| Demo | /demo | Demo |
| Sitemap | /sitemap.xml | SEO |

**Alle öffentlichen Seiten sind ohne Login prüfbar.**

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Datenbank | Supabase (PostgreSQL 17.6) | — |
| Auth | Supabase Auth (JWT + Cookies) | — |
| Hosting | Vercel (Serverless) | — |
| Styling | Tailwind CSS | 3.x |
| Tests | Vitest | 4.x |

---

## Lokale Entwicklung

```bash
npm install
cp .env.example .env.local
# .env.local mit deinen Supabase-Werten befüllen
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

---

## Alle benötigten Env-Variablen

Vollständige Liste in `.env.example`. Wichtigste:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # Geheim! Niemals im Frontend
CRON_SECRET=<openssl rand -hex 32>              # Für /api/cron/cwo-daily-runner
NEXT_PUBLIC_BASE_URL=https://corridorwork.com
ADMIN_EMAILS=deine@email.com
EMAIL_PROVIDER=none
OUTREACH_EMAIL_PROVIDER=none
```

---

## Tests

```bash
npm test           # alle Tests
npx vitest run     # CI-Modus
```

Stand: **4596 Tests, alle grün.**

---

## Admin-Bereich (nach Login)

| Tool | URL | Funktion |
|---|---|---|
| Buyer Readiness | /admin/buyer-readiness | Transferability Audit |
| Revenue Inbox | /admin/revenue-inbox | Leads prüfen |
| Revenue Accelerator | /admin/revenue-accelerator | Lead-Dashboard |
| CWO Command Center | /admin/cwo-command-center | Systemstatus |
| Distribution Pack | /admin/distribution-pack | Copy-Paste-Texte |
| SEO Indexing | /admin/seo-indexing-control | GSC-Setup |
| Autonomous Worklog | /admin/autonomous-worklog | Tagesberichte |

Admin-Login: `/auth/login` — Zugang erfordert E-Mail in `ADMIN_EMAILS`.

---

## Transfer-Dokumentation (für Käufer)

| Dokument | Inhalt |
|---|---|
| [docs/BUYER_DUE_DILIGENCE.md](docs/BUYER_DUE_DILIGENCE.md) | Was ist CorridorWork, was funktioniert, Risiken |
| [docs/TRANSFER_CHECKLIST.md](docs/TRANSFER_CHECKLIST.md) | 10-Punkte-Übergabe-Checkliste |
| [docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md](docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md) | Tech Stack, API, DB, Tests |
| [docs/SECURITY_AND_RLS_SUMMARY.md](docs/SECURITY_AND_RLS_SUMMARY.md) | RLS, Auth, Secrets, DSGVO |
| [docs/COMMERCIAL_READINESS_SUMMARY.md](docs/COMMERCIAL_READINESS_SUMMARY.md) | Revenue-Pfade, Lücken, schnellster Weg |

---

## Safety Invariants

```
EMAIL_PROVIDER=none           → Kein E-Mail-Versand möglich
OUTREACH_EMAIL_PROVIDER=none  → Kein Outreach möglich
Stripe                        → nicht konfiguriert
Scraping                      → nie erlaubt (compliance-guard)
Cold-Outreach                 → nie erlaubt (compliance-guard)
Kandidatengebühren            → nicht aktiviert
```

Alle Safety-Flags werden in jeder Worklog-Zeile in der DB gespeichert.

---

## Deployment

```bash
vercel deploy  # Vercel (empfohlen)
```

Oder GitHub-Integration: Push auf `main` → automatisches Deployment.

---

## Ehrlicher Stand (Phase 1)

- ✅ Technisch live und funktionsfähig
- ✅ 4 Revenue-Pfade mit Lead-Erfassung
- ✅ Admin-Tools, CWO Daily Runner, SEO Network
- ✅ 4596 Tests bestanden
- ❌ 0 zahlende Kunden
- ❌ 0 EUR Umsatz (Phase 1 Pre-Revenue)
- ❌ Stripe nicht konfiguriert

---

## For Buyers (English Summary)

**CorridorWork** is a live, technically complete SaaS asset for structured cross-border hiring.

| Item | Status |
|---|---|
| Live at | https://corridorwork.com |
| Revenue | €0 — pre-revenue, Phase 1 |
| Paying customers | 0 |
| Tech stack | Next.js 14, TypeScript, Supabase (PostgreSQL), Vercel, Tailwind CSS |
| Tests | 4596 passing, 0 failing |
| Stripe / Payment | Not configured — ready to activate |
| Email / Outreach | Not active — `EMAIL_PROVIDER=none` by default |
| Transfer docs | `docs/` directory — full buyer package included |
| Admin access | `/auth/login` — requires `ADMIN_EMAILS` env variable handover |

**What you get:** Fully built platform, 167 pages, 15+ corridor SEO pages, 4 inbound revenue paths, complete admin dashboard, GDPR-compliant, EU-hosted, honest pre-revenue disclosure on all public pages.

**What you do NOT get:** Active customers, revenue, or MRR. No job guarantee, no visa guarantee, no automated outreach. Buyer activates those layers post-transfer.

---

## Betrieben von

Delta Translation, Karlsruhe, Deutschland  
Inhaber: Brahim Ben Abla  
Kontakt: [transl.delta@gmail.com](mailto:transl.delta@gmail.com) | [corridorwork.com/contact](https://corridorwork.com/contact)
