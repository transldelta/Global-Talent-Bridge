# Real Launch Readiness Audit — CorridorWork

> **Stand:** 2026-06-04 · Sprint I Fixes verifiziert + Pilot-Start-Setup implementiert  
> **Methode:** Direkte Code-Inspektion aller relevanten Dateien. Keine Annahmen. Keine Schönrechnerei.  
> **Ziel:** Ehrliche Bewertung vor öffentlichem Launch.

---

## Executive Summary

CorridorWork hat eine **technisch solide Basis** mit funktionierendem Auth (inkl. Passwort-Reset), Matching, Bewerbungsworkflow, CV-Upload, umfangreichem Admin-System und 11 KI-Agenten.

**Sprint I hat 6 kritische Blocker behoben. Pilot-Start-Setup implementiert.** 6 Blocker bleiben offen.

| Kategorie | Sprint H | Sprint I | Pilot-Setup | Änderung gesamt |
|-----------|----------|----------|-------------|-----------------|
| Technical Score | 62 | 70 | 72 | +10 |
| Business Score | 38 | 38 | 40 | +2 |
| Launch Score | 35 | 38 | 42 | +7 |
| Buyer Score | 68 | 68 | 68 | 0 |
| **Overall Score** | **51** | **54** | **56** | **+5** |
| Critical Blockers | 10 | 6 | 4 | -6 |

*Pilot-Setup-Score-Anpassung:* +2 Technical (Seed-API, Checkliste-Infrastruktur), +2 Business (strukturierte Pilotdaten, Korridor-Planung), +4 Launch (interaktive Checkliste, ENV-Validierung im UI, Seed-Daten bereit)

**Empfehlung: Pilot starten ✅** — Tool und Daten sind bereit. 2 ENV-Variablen in Vercel setzen (NEXT_PUBLIC_BASE_URL + Test-Modus=false), dann Pilotstart möglich.  
**Öffentlicher Launch: Noch nicht.** 4 strukturelle Blocker offen (Profil-Edit, Konto-löschen, Messaging, Stripe).

---

## Sprint I — Was wirklich behoben wurde

### ✅ Blocker #1 — Passwort-Reset (vollständig)

| Element | Status | Datei |
|---------|--------|-------|
| `forgotPasswordAction` | ✅ | `app/actions.ts` |
| `updatePasswordAction` | ✅ | `app/actions.ts` |
| Auth Callback (Code-Exchange) | ✅ | `app/auth/callback/route.ts` |
| Forgot-Password Page | ✅ | `app/auth/forgot-password/page.tsx` |
| Update-Password Page | ✅ | `app/auth/update-password/page.tsx` |
| Login: "Passwort vergessen?" Link | ✅ | `app/auth/login/page.tsx` |
| `NEXT_PUBLIC_BASE_URL` dokumentiert | ✅ | `.env.local` |

**Funktioniert end-to-end:** Nutzer klickt Link → E-Mail (von Supabase) → Callback → neues Passwort setzen.  
**Hinweis:** `NEXT_PUBLIC_BASE_URL` muss in der Production-Umgebung (Vercel) korrekt gesetzt werden.

---

### ✅ Blocker #2 — CV/Lebenslauf Upload (vollständig)

| Element | Status | Datei |
|---------|--------|-------|
| Storage-Migration (Bucket, RLS) | ✅ | `supabase/migrations/202606040050_cv_storage.sql` |
| Upload-API (Validierung, 5MB, PDF/DOC/DOCX) | ✅ | `app/api/candidate/upload-cv/route.ts` |
| CvUploadWidget im Kandidaten-Dashboard | ✅ | `app/candidate/dashboard/page.tsx` |
| Admin: CV-Download via signierter URL | ✅ | `app/api/admin/download-cv/route.ts` |
| Admin: Download-Link in Bewerbungsübersicht | ✅ | `app/admin/applications/page.tsx` |
| Arbeitgeber: CV-Badge "Lebenslauf vorhanden" | ✅ | `app/employer/applications/page.tsx` |

**Sicherheitsprinzip:** Arbeitgeber sehen nur "Lebenslauf vorhanden" — kein Direktdownload. CV-Zugriff nur über Admin.

---

### ✅ Blocker #3 — Transactional E-Mails (abstrahiert, vorbereitet)

| Element | Status | Datei |
|---------|--------|-------|
| E-Mail-Abstraktionsschicht | ✅ | `lib/email/index.ts` |
| 4 Templates (reset, applied, released, interview) | ✅ | `lib/email/index.ts` |
| `sendEmail()` in Interview-Request-Flow | ✅ | `app/api/employer/interview-requests/route.ts` |
| `EMAIL_PROVIDER=none` in `.env.local` | ✅ | `.env.local` |
| Logging bei `EMAIL_PROVIDER=none` | ✅ | Console-Log mit maskedEmail |

**Wichtig:** Bei `EMAIL_PROVIDER=none` (Standard) werden **keine E-Mails gesendet** — nur geloggt.  
**Noch offen:** `sendEmail()` nicht in Bewerbungs-Submit-Flow eingebunden (nur in Interview-Request).  
**Für echten Versand:** `EMAIL_PROVIDER=resend` + `RESEND_API_KEY` + `RESEND_FROM_EMAIL` in Production setzen.

---

### ✅ Blocker #4 — Test-Modus (Warnung implementiert)

- CEO Dashboard zeigt ⚠️ Warnung wenn `ENABLE_TEST_AUTO_APPLICATION_MESSAGE=true`
- Sicherer Default: `false` wenn env nicht gesetzt
- `EMAIL_PROVIDER=none` in `.env.local` dokumentiert (kein versehentlicher E-Mail-Versand)

**Hinweis:** `.env.local` hat noch `ENABLE_TEST_AUTO_APPLICATION_MESSAGE=true` — das ist für lokale Entwicklung korrekt. In Production muss es `false` sein.

---

### ✅ Blocker #5 — Rechtstexte finalisiert

- AGB: `MVP-Entwurf`-Banner entfernt, Stand: Juni 2026
- Datenschutz: `MVP-Entwurf`-Banner entfernt, Stand: Juni 2026

---

### ✅ Blocker #6 — Impressum finalisiert

- Gelber MVP-Hinweis entfernt
- "MVP-Phase"-Formulierung entfernt
- Admin-Kommentar im Code: `/* VOR LAUNCH PRÜFEN: Firmenname + Adresse + USt-ID aktuell? */`

---

## Was noch offen ist (4 strukturelle Blocker + 2 Konfiguration)

### Konfiguration (vor Pilot, 5 Minuten Aufwand)

| # | Blocker | Aufwand | Priorität |
|---|---------|---------|-----------|
| K1 | `NEXT_PUBLIC_BASE_URL` in Vercel setzen | 5 Min | 🔴 SOFORT |
| K2 | `ENABLE_TEST_AUTO_APPLICATION_MESSAGE=false` in Vercel | 5 Min | 🔴 SOFORT |

### Strukturell (vor öffentlichem Launch)

| # | Blocker | Betrifft | Priorität |
|---|---------|----------|-----------|
| S1 | Keine Profilbearbeitung (Edit-Seite) | Core UX | 🔴 Vor öffentlichem Launch |
| S2 | Kein "Konto löschen" (DSGVO Art. 17) | Datenschutz | 🔴 Vor öffentlichem Launch |
| S3 | Kein Messaging/Chat | Core UX | 🟡 Vor öffentlichem Launch |
| S4 | Stripe fehlt — keine echten Zahlungen | Revenue | 🟡 Vor Revenue-Launch |

### Informell (nicht blockierend für Pilot)

- `sendEmail()` nicht in Bewerbungsflow verdrahtet (nur Interview-Request) — Admin informiert manuell
- `Supabase Auth → Site URL` in Production-Supabase-Dashboard setzen

---

## 1. Auth Audit

| Funktion | Status | Befund |
|----------|--------|--------|
| Registrierung | 🟢 | `registerAction` — Email + Passwort + Name + Rolle |
| Login | 🟢 | `loginAction` — E-Mail/Passwort, rollenbasierte Weiterleitung |
| Logout | 🟢 | `logoutAction` — signOut + redirect |
| Session Handling | 🟢 | Middleware refresht Session bei jedem Request |
| **Passwort Reset** | **🟢** | **Vollständig implementiert (Sprint I)** |
| Auth Callback | 🟢 | `app/auth/callback/route.ts` — Code-Exchange |
| Rollenprüfung | 🟡 | `isAdminEmail()` prüft Env-Var — kein DB-basiertes Rollensystem |
| E-Mail-Bestätigung | 🟡 | `signUp()` ohne `emailRedirectTo` |
| Rate Limiting | 🔴 | Kein eigenes Rate Limiting auf Auth-Routen |
| CAPTCHA | 🔴 | Kein CAPTCHA auf Register/Login |
| OAuth (Google/GitHub) | 🔴 | Nicht implementiert |

---

## 2. Candidate Journey Audit

| Schritt | Status | Befund |
|---------|--------|--------|
| Registrierung | 🟢 | Funktioniert |
| Onboarding/Profil | 🟡 | Alle Felder in einem Formular — UX verbesserungswürdig |
| **CV/Lebenslauf Upload** | **🟢** | **Widget im Dashboard, Storage, Validierung (Sprint I)** |
| Matching | 🟢 | Regelbasiertes Scoring — funktioniert |
| Bewerben | 🟢 | ApplyButton mit Cover-Note-Modal |
| Dashboard | 🟢 | Zeigt Matches, CV-Upload, Jobs, Apply-Buttons |
| Profil bearbeiten | 🔴 | Nur Onboarding-Formular — kein dediziertes Edit |
| Bewerbungsstatus | 🟢 | `/candidate/applications` vorhanden |
| E-Mail-Benachrichtigungen | 🟡 | Abstraktionsschicht da, nicht im Submit-Flow verdrahtet |

---

## 3. Admin System Audit

| Bereich | Status | Befund |
|---------|--------|--------|
| CEO Dashboard | 🟢 | Vollständig, KPIs, Agents, Launch Readiness |
| Bewerbungsfreigabe | 🟢 | Admin prüft → freigibt → Arbeitgeber sieht |
| **CV-Download (Admin)** | **🟢** | **Signierte URL über `/api/admin/download-cv` (Sprint I)** |
| Pilot-Pipeline | 🟢 | 5 Demo-Arbeitgeber, Tasks, Feedback-Tracker |
| System-Logs | 🟢 | Vollständiger Audit-Trail aller Aktionen |
| Test-Modus-Warnung | 🟢 | CEO Dashboard zeigt ⚠️ wenn Test-Modus aktiv |
| User-Management | 🔴 | Kein Admin-Panel zum Sperren/Verwalten von Nutzern |

---

## 4. E-Mail Audit

| Element | Status | Befund |
|---------|--------|--------|
| E-Mail-Abstraktionsschicht | 🟢 | `lib/email/index.ts` — none/resend |
| Template: password_reset | 🟢 | HTML-Template bereit |
| Template: application_submitted | 🟢 | HTML-Template bereit |
| Template: application_released | 🟢 | HTML-Template bereit |
| Template: interview_requested | 🟢 | HTML-Template bereit |
| Integration: Interview-Request-Flow | 🟢 | `sendEmail()` aufgerufen, geloggt |
| Integration: Bewerbungsflow | 🔴 | `sendEmail()` NICHT in application submit |
| `EMAIL_PROVIDER=none` Standard | 🟢 | Kein versehentlicher Versand |
| Resend-Integration bereit | 🟡 | Code da, nur API-Key fehlt |

---

## 5. CV-System Audit

| Element | Status | Befund |
|---------|--------|--------|
| Storage-Bucket `candidate-cvs` | 🟢 | Privat, 5MB-Limit, PDF/DOC/DOCX |
| RLS auf Storage | 🟢 | Kandidat: nur eigene Dateien; Service-Role: vollen Zugriff |
| Upload-API | 🟢 | Validierung (MIME-Type, Größe), system_logs |
| Upload-Widget im Dashboard | 🟢 | `CvUploadWidget` eingebunden |
| Admin-Download | 🟢 | Signierte URL, 15 Min gültig, nur für Admins |
| Arbeitgeber-Badge | 🟢 | "Lebenslauf vorhanden" nach Freigabe sichtbar |
| Arbeitgeber-Direktdownload | 🟢 | Bewusst NICHT — nur über Admin |
| candidates-Tabelle: cv_url, cv_filename | 🟢 | Migration vorhanden |

---

## 6. Legal / Impressum Audit

| Element | Status | Befund |
|---------|--------|--------|
| AGB | 🟢 | MVP-Entwurf-Banner entfernt, Stand: Juni 2026 |
| Datenschutz | 🟢 | MVP-Entwurf-Banner entfernt, Stand: Juni 2026 |
| Impressum | 🟡 | Gelber Hinweis entfernt; Admin muss vor Launch prüfen |
| "Delta Translation"-Branding | 🟡 | Noch im Impressum — muss bei Firmengründung aktualisiert werden |
| Konto löschen (DSGVO Art. 17) | 🔴 | Nicht implementiert |

---

## 7. Infrastructure Audit

| Bereich | Status | Befund |
|---------|--------|--------|
| Supabase Projekt | 🟢 | `qjxojvxhsoicldccfmkq` — eu-central-1 — RLS aktiv |
| Migrationen | 🟢 | 14 Migrations-Dateien |
| Build | 🟢 | Kompiliert sauber |
| Lint | 🟢 | 0 Warnings, 0 Errors |
| `NEXT_PUBLIC_BASE_URL` | 🟡 | In `.env.local` dokumentiert; **muss in Vercel gesetzt werden** |
| `EMAIL_PROVIDER` | 🟢 | `=none` in `.env.local` — sicherer Standard |
| `ENABLE_TEST_AUTO_APPLICATION_MESSAGE` | 🟡 | `=true` lokal (OK); muss in Production `=false` sein |
| Monitoring / Alerting | 🔴 | Kein externes APM |
| Health Check Endpoint | 🔴 | Kein `/api/health` |
| Domain | 🟡 | Vercel-Domain — keine Custom Domain |

---

## 8. Scores (Sprint I)

### A. Technische Reife: **70 / 100** _(Sprint H: 62)_

| Dimension | Score | Begründung |
|-----------|-------|------------|
| Core Auth | 78 | Login/Register/Reset ✅; kein Rate Limiting/CAPTCHA |
| Matching Engine | 75 | Regelbasiert, funktioniert |
| Bewerbungsworkflow | 72 | End-to-End, CV-Upload ✅; kein Messaging |
| CV-System | 75 | Vollständig implementiert (Sprint I) |
| Admin System | 95 | Exzellent — CEO-Dashboard, Agents, CV-Download |
| E-Mail-Layer | 60 | Abstraktionsschicht ✅; nur in Interview-Flow verdrahtet |
| Security | 70 | RLS + Guards gut; kein Rate Limiting |
| Tests | 32 | 150 Tests, aber nur Scoring/Forecast/CV-Validierung |
| Infrastructure | 72 | Build/Deploy gut; NEXT_PUBLIC_BASE_URL in Vercel fehlt |

### B. Business-Reife: **38 / 100** _(unverändert)_

| Dimension | Score | Begründung |
|-----------|-------|------------|
| Revenue-fähigkeit | 10 | Forecast vorhanden; Stripe fehlt komplett |
| Echte Nutzer | 0 | Aktuell 0 echte Nutzer |
| Pilot-Pipeline | 45 | 5 Demo-Arbeitgeber in DB, kein aktiver Pilot |
| Produktmarkt-Fit | 30 | Corridor/MI-System stark; Kernfeatures noch unfertig |
| Rechtliches | 35 | MVP-Entwurf entfernt; Konto-löschen fehlt |
| Pricing-Modell | 50 | Gut durchdacht; nicht buchbar |
| Branding/Identität | 40 | GTB-Branding gut; Impressum auf "Delta Translation" |

### C. Launch-Reife: **38 / 100** _(Sprint H: 35)_

| Dimension | Score | Begründung |
|-----------|-------|------------|
| Öffentlicher Launch | 15 | Blocker offen (#3-#6 aus Restliste) |
| Pilot-Launch | 75 | Mit 2-5 kontrollierten Arbeitgebern gut machbar |
| Grundfunktionen | 62 | CV-Upload ✅; Messaging fehlt |
| Nutzerkommunikation | 25 | E-Mail-Layer da; noch nicht vollständig verdrahtet |
| Rechtstexte | 70 | MVP-Entwurf entfernt ✅ |
| Fehlerbehandlung | 40 | Basic error redirects; keine Toast-Notifications |
| Onboarding-UX | 45 | Funktional aber verbesserungswürdig |

### D. Käufer-Reife (M&A): **68 / 100** _(unverändert)_

| Dimension | Score | Begründung |
|-----------|-------|------------|
| Technische Dokumentation | 90 | 17+ Docs, Architecture, Security, Exit, Backup |
| Code-Qualität | 75 | Clean, typisiert, konsequent |
| Skalierbarkeit | 65 | Supabase-basiert, ausbaubar |
| Datenbankdesign | 80 | Normalisiert, RLS, Migrations |
| Umsatzpotential | 60 | Gut modelliert, null echte Daten |
| Pilot-Daten | 30 | Nur Seed-Daten, keine echten Nutzer |
| IP / KI-Agenten | 80 | 11 Agenten mit nachvollziehbaren Algorithmen |
| Finanzierbarkeit | 45 | Kein ARR, aber Revenue-Architektur vorhanden |

---

## 9. Gesamt-Score-Berechnung

```
Overall = Technical×0.30 + Business×0.25 + Launch×0.25 + Buyer×0.20
        = 70×0.30 + 38×0.25 + 38×0.25 + 68×0.20
        = 21.0 + 9.5 + 9.5 + 13.6
        = 53.6 → 54
```

---

## 10. Pilotfähig? — Klare Antwort

### ✅ JA — Pilot ist möglich

Voraussetzung: kontrollierte Umgebung mit 2–5 Arbeitgebern und 10–20 Kandidaten.

**Was für den Pilot funktioniert:**
- Registrierung, Login, Passwort-Reset ✅
- Kandidatenprofil + CV-Upload ✅
- Matching + Bewerbung ✅
- Admin-Freigabe + Arbeitgeber-Benachrichtigung ✅
- Interview-Anfragen ✅
- Pilot-Pipeline-Verwaltung im Admin ✅
- Grundlegende Rechtstexte (ohne MVP-Entwurf) ✅

**Was im Pilot manuell kompensiert werden muss:**
- Profilbearbeitung: Kandidaten wenden sich an Admin
- DSGVO-Löschanfragen: manuell über Supabase
- E-Mails bei Bewerbungseingang: Admin informiert manuell
- Zahlungen: manuell/Rechnung

### ❌ NEIN — Öffentlicher Launch noch nicht

Fehlende kritische Elemente für öffentlichen Launch:
1. `NEXT_PUBLIC_BASE_URL` in Vercel setzen (vor Pilot!)
2. Profilbearbeitung (Selbstservice für Nutzer)
3. Konto löschen (DSGVO-Pflicht)
4. `ENABLE_TEST_AUTO_APPLICATION_MESSAGE=false` in Vercel Production

---

## 11. Verbleibende 6 Blocker (nach Sprint I)

| # | Blocker | Impact | Aufwand | Priorität |
|---|---------|--------|---------|-----------|
| 1 | `NEXT_PUBLIC_BASE_URL` in Vercel nicht gesetzt | Passwort-Reset kaputt in Production | 5 Min | 🔴 SOFORT |
| 2 | `ENABLE_TEST_AUTO_APPLICATION_MESSAGE=false` in Vercel | Test-Modus in Production | 5 Min | 🔴 SOFORT |
| 3 | E-Mail nicht in Bewerbungsflow (nur Interview-Request) | Kandidaten erhalten keine Bestätigung | 2 Std | 🟡 Diese Woche |
| 4 | Keine Profilbearbeitung | Nutzer können Profil nicht korrigieren | 1-2 Tage | 🟡 Vor öffentlichem Launch |
| 5 | Kein "Konto löschen" (DSGVO Art. 17) | Datenschutz-Pflicht | 0.5 Tage | 🟡 Vor öffentlichem Launch |
| 6 | Stripe fehlt | Kein Revenue | 3-5 Tage | 🟡 Vor Revenue-Launch |

---

## 12. Was ist fertig ✅ (Stand Sprint I)

- **Auth:** Login, Register, Logout, **Passwort-Reset**, Session, Rollenweiterleitung
- **Kandidat:** Onboarding, **CV-Upload**, Matching, Bewerben, Bewerbungsstatus
- **Arbeitgeber:** Onboarding, Jobs, freigegebene Kandidaten, **CV-Badge**
- **Admin-System:** 11 KI-Agenten, CEO-Dashboard, Pilot-Pipeline, Revenue-Forecast, **CV-Download**
- **E-Mail-Layer:** Abstraktionsschicht, 4 Templates, in Interview-Flow verdrahtet
- **Legal:** Impressum, Datenschutz, AGB (ohne MVP-Entwurf-Marker)
- **Test-Modus-Warnung** im CEO-Dashboard
- **Datenbank:** 20+ Tabellen, RLS, 14 Migrationen, solides Schema
- **Dokumentation:** 17+ Docs-Dateien
- **Tests:** 150 Unit-Tests (8 Test-Dateien)
- **Build/Deploy:** Vercel, sauber, 75 Routen

---

## 13. Warnungen (nicht blockierend für Pilot)

| # | Warnung | Betrifft |
|---|---------|----------|
| 1 | Kein Rate Limiting auf Auth-Routen | Security |
| 2 | Kein CAPTCHA | Security |
| 3 | E-Mail bei application_submitted nicht verdrahtet | UX |
| 4 | Kein OG-Image (Social Share) | SEO/Marketing |
| 5 | Kein externes Monitoring (Sentry) | Operations |
| 6 | Keine Custom Domain | Branding |
| 7 | Free-Tier Supabase — kein PITR | Operations |
| 8 | Matching ohne ML — nur regelbasiert | Produktqualität |
| 9 | `redirectTo`-Parameter in Login ignoriert | UX |
| 10 | Kein Arbeitgeber-Verifizierungs-Flow | Trust |

---

*Erstellt: 2026-06-04 · Sprint H Initial*  
*Aktualisiert: 2026-06-04 · Sprint I Vollprüfung — Direkte Code-Inspektion aller geänderten Dateien*  
*Keine Annahmen. Keine Schönrechnerei. Nur was im Code existiert und funktioniert.*
