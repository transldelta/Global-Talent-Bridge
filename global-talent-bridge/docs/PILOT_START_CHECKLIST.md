# Pilot-Start-Checkliste — Global Talent Bridge

> **Zweck:** Schritt-für-Schritt-Vorbereitung bevor die ersten echten Pilot-Arbeitgeber und Kandidaten die Plattform nutzen.  
> **Admin-Dashboard:** `/admin/pilot-launch`

---

## 1. Vercel-Umgebungsvariablen setzen

Vor dem ersten echten Nutzer müssen diese Variablen in Vercel gesetzt sein:

| Variable | Pflicht | Wert (Produktion) | Zweck |
|----------|---------|-------------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://qjxojvxhsoicldccfmkq.supabase.co` | Supabase-Verbindung |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | *(aus Supabase Dashboard)* | Client-Auth |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | *(aus Supabase Dashboard)* | Server-Ops (Admin) |
| `ADMIN_EMAILS` | ✅ | `transl.delta@gmail.com` | Admin-Zugriff |
| `NEXT_PUBLIC_BASE_URL` | ✅ | `https://DEINE-DOMAIN.vercel.app` | Passwort-Reset-Redirect |
| `ENABLE_TEST_AUTO_APPLICATION_MESSAGE` | ✅ | `false` | Test-Modus AUS |
| `EMAIL_PROVIDER` | empfohlen | `none` (oder `resend`) | E-Mail-Versand |

**Wo setzen:** Vercel Dashboard → Project → Settings → Environment Variables  
**Wichtig:** Nach Änderung Redeploy auslösen.

---

## 2. Supabase-Checks

- [ ] Supabase-Projekt aktiv (nicht pausiert): [Dashboard](https://supabase.com/dashboard/project/qjxojvxhsoicldccfmkq)
- [ ] RLS auf allen Tabellen aktiviert ✓ (bereits konfiguriert)
- [ ] Storage-Bucket `candidate-cvs` vorhanden (Migration `202606040050_cv_storage.sql`)
- [ ] Alle 14 Migrationen angewendet
- [ ] Supabase Auth: E-Mail-Bestätigung-Einstellung prüfen
  - Auth → Providers → Email → "Confirm email" = je nach Wunsch an/aus
- [ ] Supabase Auth: `Site URL` auf Production-URL setzen
  - Auth → URL Configuration → Site URL = `https://DEINE-DOMAIN.vercel.app`
- [ ] Supabase Auth: Redirect-URLs erlauben
  - Hinzufügen: `https://DEINE-DOMAIN.vercel.app/auth/callback`

---

## 3. Test-Modus deaktivieren

**Vercel Environment Variables:**
```
ENABLE_TEST_AUTO_APPLICATION_MESSAGE = false
```

**Prüfung:** `/admin/ceo-dashboard` öffnen → kein ⚠️-Banner sichtbar.

**Lokale Entwicklung:** `.env.local` darf `true` behalten — gilt nur lokal.

---

## 4. Passwort-Reset prüfen

1. Test-Account registrieren (andere E-Mail als Admin)
2. `/auth/forgot-password` aufrufen
3. E-Mail eingeben → "Reset-Link senden"
4. Supabase sendet Reset-E-Mail (prüfe Posteingang)
5. Link klicken → landet auf `/auth/update-password`
6. Neues Passwort setzen → Redirect zu Login mit Erfolgsmeldung
7. Mit neuem Passwort einloggen ✓

**Häufiger Fehler:** `NEXT_PUBLIC_BASE_URL` in Vercel nicht gesetzt → Reset-Link zeigt auf `localhost:3000`.

---

## 5. CV-Upload prüfen

1. Als Kandidat einloggen (oder Test-Account mit Kandidatenrolle)
2. `/candidate/dashboard` öffnen → Abschnitt "Lebenslauf (CV)" sichtbar?
3. PDF hochladen (max. 5 MB)
4. Badge "✓ Vorhanden" erscheint nach Upload
5. Als Admin: `/admin/applications` → Bewerbung suchen → "📄 CV herunterladen" sichtbar?
6. Download-Link öffnen → CV lädt herunter ✓

---

## 6. Pilot-Arbeitgeber anlegen (2–5 Unternehmen)

Direkt in Supabase oder über das Admin-Dashboard:

**Minimalfelder pro Arbeitgeber:**
```sql
INSERT INTO pilot_employers (
  company_name, country, industry,
  contact_name, contact_phone,
  status, interest_level,
  next_step, next_follow_up_at
) VALUES (
  'Firma GmbH', 'Deutschland', 'Pflege',
  'Max Mustermann', '+49 xxx',
  'identified', 'unknown',
  'Telefonkontakt aufnehmen', NOW() + INTERVAL '3 days'
);
```

**Status-Workflow:**
```
identified → contacted_manual → interested → demo_scheduled → onboarding → active_pilot
```

**Ziel-Korridore (höchste Nachfrage):**
- Marokko → Deutschland (Pflege)
- Indien → Deutschland (IT)
- Philippinen → Deutschland (Pflege)

---

## 7. Pilot-Kandidaten anlegen (10–20 Personen)

```sql
INSERT INTO pilot_candidates (
  full_name, origin_country, target_country,
  profession, language, language_level,
  status, quality_score, source
) VALUES (
  'Ali Hassan', 'Marokko', 'Deutschland',
  'Pflegefachkraft', 'Deutsch', 'B2',
  'identified', 75, 'Facebook-Gruppe'
);
```

**Qualitäts-Tiers:**
| Score | Tier | Verwendung |
|-------|------|-----------|
| ≥ 85 | Excellent | Sofort für Demo geeignet |
| 70–84 | Good | Gut, minimale Vorbereitung |
| 50–69 | Fair | Für Demo nacharbeiten |
| < 50 | Low | Nicht für Demo |

---

## 8. Manuelle Kontaktfreigabe (Admin-Workflow)

**Prinzip:** Kein automatischer Kontakt. Admin genehmigt jeden Schritt.

### Bewerbungsfreigabe
1. Kandidat bewirbt sich auf Job → Status: `pending`
2. Admin öffnet `/admin/applications`
3. Bewerbung prüfen → "Freigeben" klicken
4. Status: `employer_notified` → Arbeitgeber sieht Kandidat

### Interview-Anfragen
1. Arbeitgeber stellt Interview-Anfrage → Status: `pending`
2. Admin prüft → genehmigt manuell
3. Admin informiert Kandidaten (aktuell manuell per E-Mail/Telefon)

### Pilot-Tasks (automatisch generiert)
- `/admin/pilot-launch` → Aufgaben-Tab
- Follow-up-Aufgaben erscheinen automatisch wenn Datum überschritten
- Demo-Prep-Tasks erscheinen bei `status = demo_scheduled`

---

## 9. Feedback erfassen

Nach jedem Demo-Termin / nach erstem Pilot-Einsatz:

**Über Supabase direkt:**
```sql
INSERT INTO pilot_feedback (
  source_type, employer_id,
  category, title, description,
  priority, status
) VALUES (
  'employer', 'EMPLOYER_UUID',
  'ux', 'Formular zu lang',
  'Onboarding-Formular hat zu viele Felder auf einmal.',
  'high', 'open'
);
```

**Kategorien:** ux · feature_request · bug · process · pricing · matching · general  
**Prioritäten:** critical → high → medium → low

**Ziel:** Nach 3 Demo-Terminen: mind. 5 Feedback-Einträge in DB.

---

## 10. Go/No-Go-Kriterien für Pilot-Start

| Kriterium | Prüfung | Status |
|-----------|---------|--------|
| `NEXT_PUBLIC_BASE_URL` in Vercel | Passwort-Reset end-to-end testen | ⬜ |
| Test-Modus aus | CEO-Dashboard kein ⚠️ | ⬜ |
| Passwort-Reset funktioniert | Manuell getestet | ⬜ |
| CV-Upload funktioniert | Manuell getestet | ⬜ |
| Min. 1 Pilot-Arbeitgeber in DB | `/admin/pilot-launch` | ⬜ |
| Min. 3 Pilot-Kandidaten (Score ≥ 70) | `/admin/pilot-launch` | ⬜ |
| Admin-Bewerbungsfreigabe getestet | 1 Test-Bewerbung durchgeführt | ⬜ |
| Impressum/AGB/Datenschutz final | Kein "MVP-Entwurf" sichtbar | ✅ |
| Build ohne Errors | `npm run build` | ✅ |

**Alle ⬜ müssen ✅ sein bevor erster echter Nutzer eingeladen wird.**

---

*Erstellt: 2026-06-04 · Sprint I Audit*  
*Keine automatischen externen Nachrichten. Alle Aktionen durch Admin kontrolliert.*
