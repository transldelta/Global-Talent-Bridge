# CorridorWork

**Approval-basierte Matching-Plattform für Cross-border Hiring.**

Live: **https://corridorwork.com**  
Supabase-Region: eu-central-1 (Frankfurt, DE) — DSGVO-konform  
Status: **Pilot-ready** (Stand: 06.06.2026)

---

## Was ist CorridorWork?

CorridorWork verbindet internationale Fachkräfte strukturiert mit Arbeitgebern, die gezielt internationale Talente suchen. Das System berechnet einen transparenten Matching-Score (0–100 %) basierend auf Branche, Erfahrung und Sprachlevel. Jede Outreach-Aktion erfordert manuelle Freigabe durch den Operator.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components)
- **Datenbank:** Supabase (PostgreSQL 17.6, RLS auf allen Tabellen)
- **Auth:** Supabase Auth (JWT + Cookie-Session)
- **Storage:** Supabase Storage (privater CV-Bucket)
- **Hosting:** Vercel (Serverless, Node.js)
- **Tests:** Vitest — 840/840 Tests ✅
- **E-Mail:** Abstraktionsschicht (`none` / `resend`) — Standard: `none`

---

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

Benötigte Env-Variablen: siehe `.env.example`.

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAILS=deine@email.com
EMAIL_PROVIDER=none
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Tests ausführen

```bash
npx vitest run          # alle Tests
npx vitest run --watch  # Watch-Modus
```

---

## Dokumentation

| Dokument | Inhalt |
|---|---|
| [docs/PILOT_READINESS.md](docs/PILOT_READINESS.md) | E2E-Testergebnis, RLS-Audit, Pilot-Freigabe |
| [docs/DEMO_AND_SALES_OVERVIEW.md](docs/DEMO_AND_SALES_OVERVIEW.md) | Demo-Ablauf, Verkaufsargumente, Produkt-Übersicht |
| [docs/DEMO_CHECKLIST.md](docs/DEMO_CHECKLIST.md) | Checkliste vor/während/nach der Demo |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technische Architektur |
| [docs/BUSINESS_MODEL.md](docs/BUSINESS_MODEL.md) | Geschäftsmodell und Monetarisierung |
| [docs/SECURITY_COMPLIANCE.md](docs/SECURITY_COMPLIANCE.md) | Sicherheit und DSGVO |
| [docs/PILOT_START_CHECKLIST.md](docs/PILOT_START_CHECKLIST.md) | Go/No-Go für den Pilotstart |

---

## Sicherheitshinweise

- `SUPABASE_SERVICE_ROLE_KEY` niemals im Client verwenden — ausschließlich serverseitig
- `.env.local` niemals committen (in `.gitignore`)
- RLS auf allen 57 Tabellen aktiv
- `operator_actions` + `pilot_outreach_drafts`: nur über `service_role` erreichbar (`anon`/`authenticated` blockiert)
- E-Mail-Versand standardmäßig deaktiviert (`EMAIL_PROVIDER=none`)

---

## Betrieben von

Delta Translation, Karlsruhe, Deutschland  
Inhaber: Brahim Ben Abla  
Kontakt: [corridorwork.com/contact](https://corridorwork.com/contact)
