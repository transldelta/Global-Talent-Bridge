# CorridorWork — Security & RLS Summary

> Für Käufer, Entwickler und technische Due-Diligence.
> Stand: 2026-06-07 | Phase 1 Pilot

---

## Row Level Security (RLS)

| Tabelle | RLS aktiv | Zugriff |
|---|---|---|
| `revenue_leads` | ✅ Ja | service_role (Admin-Client) |
| `autonomous_worklog` | ✅ Ja | service_role (Admin-Client) |
| `landingpage_factory` | ✅ Ja | service_role (Admin-Client) |

**Alle Tabellen:** RLS ist in Supabase aktiviert. Direkter Zugriff vom Frontend (anon key) ist nicht möglich.

Admin-Seiten nutzen ausschließlich `createAdminClient()` (service_role) — nie den anon key.

---

## Admin-Authentifizierung

Alle Admin-Seiten sind durch `getCurrentAdminUser()` geschützt:

```typescript
// lib/admin.ts
export async function getCurrentAdminUser() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
  if (!adminEmails.includes(user.email ?? '')) return null
  return user
}
```

- Wenn kein User → Redirect auf `/auth/login?redirectTo=...`
- Wenn User nicht in `ADMIN_EMAILS` → kein Zugang
- `ADMIN_EMAILS` ist eine Env-Variable, nicht in der DB → kann nicht durch SQL-Injection umgangen werden

---

## Public API Schutz

### POST /api/public/revenue-leads

| Schutz | Implementierung |
|---|---|
| Honeypot | `website`-Feld muss leer bleiben |
| Rate-Limit | 10 Requests / Stunde / IP |
| Duplicate-Limit | 5 Leads / E-Mail |
| Input-Validierung | Pflichtfelder, Typ-Check |
| CORS | Next.js Standard |
| SQL-Injection | Supabase parametrisierte Queries |

### GET /api/cron/cwo-daily-runner

- Authentifizierung: `Authorization: Bearer <CRON_SECRET>`
- Ohne gültigen CRON_SECRET → 401 Unauthorized
- CRON_SECRET ist min. 32 Hex-Zeichen (empfohlen: `openssl rand -hex 32`)

---

## Safety Invariants (Compliance Guards)

Die `SYSTEM_INVARIANTS` in `lib/cwo-agent/compliance-guard.ts` erzwingen:

```typescript
export const SYSTEM_INVARIANTS = {
  emailProvider:           'none',   // Kein E-Mail-Versand möglich
  outreachEmailProvider:   'none',   // Kein Outreach möglich
  noEmailSent:             true,
  noAutoOutreach:          true,
  noScraping:              true,
  noCandidateFees:         true,
  phase:                   'phase_1_pilot',
}
```

- `validateInvariants()` wird bei jedem Cron-Run aufgerufen
- Bei Verletzung: Cron-Run wird abgebrochen (HTTP 500)
- Safety-Flags werden in **jeder** DB-Zeile in `autonomous_worklog` gespeichert (`no_email_sent=true`, `no_auto_outreach=true`, `no_scraping=true`)

---

## DB-Safety-Flags

In `autonomous_worklog`:
```sql
no_email_sent    BOOLEAN NOT NULL DEFAULT true  CHECK (no_email_sent = true),
no_auto_outreach BOOLEAN NOT NULL DEFAULT true  CHECK (no_auto_outreach = true),
no_scraping      BOOLEAN NOT NULL DEFAULT true  CHECK (no_scraping = true),
```

In `revenue_leads`:
```sql
no_email_sent    BOOLEAN DEFAULT true,
no_auto_outreach BOOLEAN DEFAULT true,
no_payment_started BOOLEAN DEFAULT true,
```

Diese Felder können **nicht** auf `false` gesetzt werden (DB CHECK Constraints).

---

## Secret Management

| Secret | Typ | Speicherort |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Vercel Env (nie im Code) |
| `CRON_SECRET` | Server-only | Vercel Env (nie im Code) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (sicher für anon) | Vercel Env |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Vercel Env |
| `ADMIN_EMAILS` | Server-only | Vercel Env |

**Secret Leak Scan:** `grep -rn "sk_live\|re_live\|sk_test_\|service_role" --include="*.ts" --include="*.tsx" app/ lib/` → **0 Treffer**

Keine Secrets in Git History, keine Secrets im Frontend-Bundle.

---

## DSGVO / Datenschutz

| Anforderung | Status |
|---|---|
| Impressum | ✅ /legal/impressum |
| Datenschutzerklärung | ✅ /legal/datenschutz |
| AGB | ✅ /legal/agb |
| Supabase Region | ✅ eu-central-1 (Frankfurt) |
| Kandidatengebühren | ✅ nicht aktiv |
| Kein Tracking | ✅ kein Google Analytics, kein Facebook Pixel |

---

## Was ist NICHT aktiviert (Security-Boundaries)

```
Stripe           → nicht konfiguriert, kein Payment möglich
Google API       → nicht aktiviert
Scraping         → technisch blockiert (compliance-guard)
Cold-Outreach    → technisch blockiert (compliance-guard)
E-Mail-Versand   → EMAIL_PROVIDER=none (kein Versand möglich)
Kandidatengebühren → nicht implementiert
```

---

## Nach Transfer: Security-Checkliste

- [ ] `SUPABASE_SERVICE_ROLE_KEY` rotieren
- [ ] `CRON_SECRET` neu generieren (`openssl rand -hex 32`)
- [ ] `ADMIN_EMAILS` auf neuen Admin setzen
- [ ] Alte Supabase-Admin-User deaktivieren
- [ ] Supabase RLS-Status prüfen: Dashboard → Authentication → Policies

---

*Erstellt: 2026-06-07 | Phase 1 Transfer Pack*
