# Pilot-Start-Checkliste — Global Talent Bridge

> **Zweck:** Schritt-für-Schritt-Vorbereitung bevor die ersten echten Pilot-Arbeitgeber und Kandidaten die Plattform nutzen.  
> **Admin-Dashboard:** `/admin/pilot-launch` — enthält interaktive Version dieser Checkliste.  
> **Stand:** 2026-06-04 · Sprint I vollständig

---

## Go/No-Go-Kriterien (Kurzfassung)

| # | Kriterium | Auto-Check | Status |
|---|-----------|-----------|--------|
| 1 | `NEXT_PUBLIC_BASE_URL` in Vercel gesetzt | `/admin/pilot-launch` | ⬜ |
| 2 | `ENABLE_TEST_AUTO_APPLICATION_MESSAGE=false` in Vercel | `/admin/pilot-launch` | ⬜ |
| 3 | Min. 2 Pilot-Arbeitgeber in DB | `/admin/pilot-launch` | ⬜ |
| 4 | Min. 10 Pilot-Kandidaten, ≥5 mit Score ≥ 70 | `/admin/pilot-launch` | ⬜ |
| 5 | Passwort-Reset manuell getestet | Manuell | ⬜ |
| 6 | CV-Upload manuell getestet | Manuell | ⬜ |
| 7 | Admin-Bewerbungsfreigabe manuell getestet | Manuell | ⬜ |
| 8 | Supabase Auth → Site URL auf Production-Domain | Manuell | ⬜ |
| 9 | Impressum/AGB/Datenschutz final (kein MVP-Entwurf) | Erledigt ✅ | ✅ |

**Alle ⬜ → ✅ bevor erster echter Nutzer eingeladen wird.**

---

## 1. Vercel-Umgebungsvariablen setzen

**Wo:** Vercel Dashboard → Project → Settings → Environment Variables → Production

| Variable | Pflicht | Wert | Zweck |
|----------|---------|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://qjxojvxhsoicldccfmkq.supabase.co` | Supabase-Verbindung |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | *(Supabase Dashboard → API → anon key)* | Client-Auth |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | *(Supabase Dashboard → API → service_role)* | Admin-Ops |
| `ADMIN_EMAILS` | ✅ | `transl.delta@gmail.com` | Admin-Zugriff |
| **`NEXT_PUBLIC_BASE_URL`** | ✅ 🔴 | `https://DEINE-DOMAIN.vercel.app` | Passwort-Reset |
| **`ENABLE_TEST_AUTO_APPLICATION_MESSAGE`** | ✅ 🔴 | `false` | Test-Modus AUS |
| `EMAIL_PROVIDER` | empfohlen | `none` *(oder `resend`)* | E-Mail-Versand |
| `RESEND_API_KEY` | optional | `re_xxx…` | Nur wenn resend |
| `RESEND_FROM_EMAIL` | optional | `noreply@domain.de` | Nur wenn resend |

**Nach Änderung:** Vercel → Deployments → Redeploy auslösen.

---

## 2. Supabase-Checks

- [ ] Supabase-Projekt aktiv (nicht pausiert): [Dashboard](https://supabase.com/dashboard/project/qjxojvxhsoicldccfmkq)
- [ ] **Auth → URL Configuration → Site URL:** `https://DEINE-DOMAIN.vercel.app`
- [ ] **Auth → URL Configuration → Redirect URLs:** `https://DEINE-DOMAIN.vercel.app/auth/callback`
- [ ] Storage-Bucket `candidate-cvs` vorhanden (Migration `202606040050_cv_storage.sql` angewendet)
- [ ] Alle 14 Migrationen angewendet (`supabase db status` oder Supabase Dashboard → Database → Migrations)

---

## 3. Pilotdaten vorbereiten (automatisch)

**Im Admin-Dashboard:**  
`/admin/pilot-launch` → Button **"Pilotdaten vorbereiten"** klicken.

Dies legt automatisch an:
- **5 Pilot-Arbeitgeber** (je 1 pro Korridor):
  - NorthStar Tech Canada (India → Canada, IT)
  - NHS London Royal Trust (India → UK, Nursing)
  - Pflege Plus GmbH Karlsruhe (Morocco → Germany, Care)
  - Berlin Digital Solutions GmbH (Turkey → Germany, IT)
  - Sydney CareFirst Services (Philippines → Australia, Care)
- **20 Pilot-Kandidaten** (4 pro Korridor, Score 48–91)

**Idempotent:** Doppeltes Klicken erzeugt keine Duplikate (source = `pilot_seed_v1`).  
**Markierung:** Alle Einträge mit `source = 'pilot_seed_v1'` — sicher identifizierbar.

---

## 4. Test-Modus deaktivieren

**Vercel:** `ENABLE_TEST_AUTO_APPLICATION_MESSAGE = false`  
**Prüfung:** `/admin/pilot-launch` → kein roter ❌-Banner für Test-Modus.

---

## 5. Passwort-Reset end-to-end testen

1. Test-Account mit anderer E-Mail registrieren
2. `/auth/forgot-password` aufrufen
3. E-Mail eingeben → "Reset-Link senden"
4. Posteingang öffnen → E-Mail von Supabase
5. Link klicken → landet auf `/auth/update-password` (nicht auf localhost!)
6. Neues Passwort eingeben → "Passwort speichern"
7. Redirect zu Login → mit neuem Passwort einloggen ✓

**Häufiger Fehler:** Link zeigt auf `localhost:3000` → `NEXT_PUBLIC_BASE_URL` in Vercel fehlt.

---

## 6. CV-Upload end-to-end testen

1. Als Kandidat einloggen (oder Test-Account mit `role=candidate`)
2. `/candidate/dashboard` öffnen
3. Abschnitt "Lebenslauf (CV)" sichtbar?
4. PDF hochladen (max. 5 MB) → Badge "✓ Vorhanden" erscheint
5. Als Admin: `/admin/applications` öffnen
6. Eine Testbewerbung suchen → "📄 CV herunterladen"-Link sichtbar?
7. Download-Link öffnen → Datei lädt herunter ✓

---

## 7. Manuelle Kontaktfreigabe testen

**Ablauf:**
1. Test-Kandidat bewirbt sich auf einen Test-Job
2. Admin öffnet `/admin/applications`
3. Bewerbung prüfen → "Freigeben" klicken
4. Status: `employer_notified`
5. Als Arbeitgeber einloggen → `/employer/applications` → Kandidat sichtbar? ✓
6. CV-Badge "Lebenslauf vorhanden" sichtbar (wenn CV hochgeladen)?

---

## 8. Echte Pilot-Arbeitgeber anlegen (nach Seed)

Die Seed-Daten sind Demo-Daten. Echte Arbeitgeber direkt in Supabase eintragen:

```sql
INSERT INTO pilot_employers (
  company_name, country, industry,
  contact_name, contact_phone,
  status, interest_level,
  next_step, next_follow_up_at
) VALUES (
  'ECHTER Firmenname GmbH', 'Deutschland', 'Pflege',
  'Echter Ansprechpartner', '+49 xxx',
  'contacted_manual', 'high',
  'Demo-Termin am XX.XX.2026 um 14:00 Uhr',
  '2026-06-10T14:00:00Z'
);
```

**Status-Workflow:**
```
identified → contacted_manual → interested → demo_scheduled → onboarding → active_pilot
```

**Ziel-Korridore:**
- Marokko → Deutschland (Pflege) — höchste Nachfrage lokal
- Indien → Deutschland (IT) — Visa-Erleichterungen
- Türkei → Deutschland (IT) — starke Community

---

## 9. Feedback erfassen (nach Demo)

```sql
INSERT INTO pilot_feedback (
  source_type, employer_id,
  category, title, description,
  priority, status
) VALUES (
  'employer', 'UUID-des-Arbeitgebers',
  'ux', 'Onboarding zu komplex',
  'Das Registrierungsformular hat zu viele Felder auf einmal.',
  'high', 'open'
);
```

**Kategorien:** ux · feature_request · bug · process · pricing · matching · general

---

## 10. Pilot-Readiness-Ampel

Das Dashboard `/admin/pilot-launch` zeigt automatisch:

| Farbe | Bedeutung |
|-------|-----------|
| ✅ grün | Konfiguration korrekt |
| ❌ rot | Blocker — vor Pilot-Start beheben |
| ⚠️ gelb | Warnung — für Pilot akzeptabel, aber dokumentieren |
| ⬜ grau | Manuelle Prüfung erforderlich |

---

*Erstellt: 2026-06-04 · Sprint I Audit*  
*Aktualisiert: 2026-06-04 · Pilot-Start-Setup implementiert (Seed-API, interaktive Checkliste)*  
*Keine automatischen externen Nachrichten. Alle Aktionen durch Admin kontrolliert.*
