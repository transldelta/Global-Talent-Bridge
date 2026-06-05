# Security & Compliance — CorridorWork

**Stand:** 2026-06-04  
**Zweck:** Technische Sicherheitsmaßnahmen und Compliance-Status für Due-Diligence-Prüfer.

---

## 1. Row Level Security (RLS)

Alle Datenbanktabellen haben RLS aktiviert. Kein unautorisierter Lesezugriff möglich.

| Tabelle | Public READ | Authenticated READ | Admin (service_role) |
|---------|------------|-------------------|---------------------|
| `profiles` | ❌ | Nur eigene | ✅ |
| `employers` | ❌ | Nur eigene | ✅ |
| `candidates` | ❌ | Nur eigene | ✅ |
| `jobs` | ✅ (is_active=true) | ✅ | ✅ |
| `applications` | ❌ | Nur eigene | ✅ |
| `matches` | ❌ | Nur eigene | ✅ |
| `migration_corridors` | ❌ | ❌ | ✅ |
| `landingpage_factory` | ✅ (published only) | ✅ | ✅ |
| `migration_intelligence` | ❌ | ❌ | ✅ |
| `revenue_plans` | ❌ | ❌ | ✅ |
| `revenue_events` | ❌ | ❌ | ✅ |
| `agent_suggestions` | ❌ | ❌ | ✅ |
| `agent_notifications` | ❌ | ❌ | ✅ |
| `system_logs` | ❌ | ❌ | ✅ |

**Prinzip:** "Default Deny" — kein Zugriff, außer explizit erlaubt.

---

## 2. Authentifizierung

### Supabase Auth (JWT-basiert)

- Email + Password (kein Social Login aktuell)
- Tokens in HttpOnly Cookies (nicht localStorage)
- Automatischer Token-Refresh via Supabase SDK
- Middleware (`middleware.ts`) erzwingt Auth für alle geschützten Routen

### Admin-Zugang

```typescript
// lib/admin.ts — serverseitig, nie clientseitig
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',')

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}

export async function getCurrentAdminUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !isAdminEmail(user.email)) return null
  return user
}
```

**Sicherheitsmerkmale:**
- Admin-E-Mails in Umgebungsvariable, nicht in DB → kein Privilege Escalation durch DB-Angriff
- `getUser()` statt `getSession()` — Server-side verifiziert, nicht aus ungeprüftem JWT gelesen
- Jede Admin-API-Route prüft Admin-Status individuell

---

## 3. Secret-Management

| Secret | Wo gespeichert | Clientseitig sichtbar |
|--------|---------------|----------------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel Env / `.env.local` | ❌ Niemals |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel Env | ✅ (designed to be public) |
| `ADMIN_EMAILS` | Vercel Env | ❌ Niemals |

**Prüfung:** `grep -r "SERVICE_ROLE_KEY" app/` → 0 Treffer in Client-Komponenten.

---

## 4. Approval Queue (Anti-Spam / Anti-Abuse)

Alle ausgehenden Nachrichten (E-Mail-Entwürfe, WhatsApp-Entwürfe) durchlaufen eine Approval Queue:

```
Agent erstellt Entwurf (status='draft')
    │
    ▼
Admin prüft in /admin/outreach/approval-queue
    │
    ├── Approve → status='approved' (aber noch kein Versand)
    ├── Send → Admin klickt explizit "Senden"
    └── Reject → status='rejected'
```

**Kein automatischer Versand.** Alle Nachrichten benötigen manuelle Admin-Freigabe.  
**High-Risk-Nachrichten** (risk_level='high') erfordern doppelte Bestätigung.

---

## 5. Agent-Sicherheitsgrenzen

Jeder Agent ist durch Code-Kommentar und Architektur eingeschränkt:

```
✅ Daten analysieren
✅ Scores berechnen
✅ Suggestions/Notifications schreiben
✅ system_logs schreiben
❌ Externe APIs aufrufen
❌ E-Mails senden
❌ WhatsApp senden
❌ Stripe aufrufen
❌ Zahlungen auslösen
❌ Datensätze löschen
```

Diese Grenzen sind architektonisch durchgesetzt — keine externen SDK-Imports in Agent-Dateien.

---

## 6. Input-Validierung

- Alle API-Routen: `getCurrentAdminUser()` Guard vor jeder Operation
- Supabase: Parameterized Queries (kein SQL-Injection möglich via SDK)
- TypeScript strict mode: keine impliziten `any`
- Keine eval()-Nutzung, keine dynamischen SQL-Strings

---

## 7. DSGVO-Compliance

| Anforderung | Status | Beschreibung |
|------------|--------|-------------|
| Datenspeicherung EU | ✅ | Supabase Frankfurt (eu-central-1) |
| Datenschutzerklärung | ✅ | `/legal/datenschutz` |
| AGB | ✅ | `/legal/agb` |
| Impressum | ✅ | `/legal/impressum` |
| Cookie-Minimierung | ✅ | Nur Auth-Session-Cookie |
| Keine Drittanbieter-Tracker | ✅ | Kein GA, kein Facebook Pixel |
| Kein Profiling ohne Einwilligung | ✅ | Nur internes Matching |
| Datenlöschung | ✅ | ON DELETE CASCADE in DB-Schema |
| Kandidatendaten-Zugriff | ✅ | Nur nach expliziter Kontaktfreigabe |
| Recht auf Auskunft | ⚠️ | Manuell via Admin (kein Self-Service) |
| Recht auf Löschung | ⚠️ | Manuell via Admin (kein Self-Service) |

**Handlungsbedarf:** Self-Service für Datenlöschung und Auskunftsanfragen implementieren.

---

## 8. Logging & Audit Trail

Alle relevanten Aktionen werden in `system_logs` protokolliert:

```sql
CREATE TABLE system_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text,
  status     text,  -- success | error | warning
  message    text,
  created_at timestamptz DEFAULT now()
);
```

**Geloggt werden:**
- Jeder Agenten-Lauf (Start, Ende, Ergebnis)
- Fehler in API-Routen
- Wichtige Admin-Aktionen (Approval Queue)
- Score-Updates in MI und CI

**Kein Logging von:** Passwörtern, Tokens, oder PII in Log-Feldern.

---

## 9. Dependency-Sicherheit

| Bereich | Status |
|---------|--------|
| npm audit | Regelmäßig ausführen empfohlen |
| Known CVEs | Nicht bekannt (Stand 2026-06-04) |
| Outdated Dependencies | Vercel aktualisiert Next.js-Runtime automatisch |
| No eval() / no Function() | ✅ |
| Server-only Modules | ✅ `import 'server-only'` in allen Agent-Dateien |

---

## 10. Penetration Testing

**Status:** Noch nicht durchgeführt.  
**Empfehlung für Due Diligence:** Pen-Test vor Produktiv-Launch mit echten Zahlungen.  
**Prioritäre Bereiche:** Auth-Flow, Approval Queue, RLS-Bypass-Versuche.

---

*Stand: 2026-06-04. Alle Angaben nach bestem Wissen und Gewissen.*
