# CorridorWork — Buyer Due Diligence

> **Stand: 2026-06-07 | Phase 1 Pilot**
> Alle Angaben ehrlich und verifizierbar. Keine erfundenen Umsätze. Keine Fake-Traction.

---

## Was ist CorridorWork?

CorridorWork ist ein live betriebenes SaaS-Asset für strukturiertes, compliance-first Cross-border Hiring. Das System verbindet internationale Fachkräfte (Pflege, Logistik, IT, Bau, Gastronomie) mit Arbeitgebern in Deutschland und Europa.

Das System läuft **autonom** — tägliche Reports, Inbound-Lead-Erfassung, Admin-Dashboards — ohne manuelle tägliche Arbeit des Betreibers.

---

## Live-Domain & Prüfbarkeit

| Asset | URL | Status |
|---|---|---|
| Live-Domain | https://corridorwork.com | ✅ Live |
| Buyer Snapshot | /buyer-snapshot | ✅ Live |
| Strategic Partnership | /strategic-partnership | ✅ Live |
| Partner-Programm | /partners | ✅ Live |
| Employer Pilot | /pilot/employers | ✅ Live |
| Market Intelligence | /market-intelligence | ✅ Live |
| Launch-Übersicht | /launch | ✅ Live |
| Demo | /demo | ✅ Live |
| Sitemap | /sitemap.xml | ✅ Live |

**Alle URLs sind öffentlich prüfbar ohne Login.**

---

## Kernfunktionen (live)

1. **Inbound Lead Capture** — 4 Revenue-Pfade aktiv, Formulare live, Leads in Supabase DB
2. **Revenue Lead Scoring** — automatische Score-Berechnung (0–100) nach Lead-Typ
3. **Admin Revenue Inbox** — Leads prüfen, qualifizieren, ablehnen
4. **Revenue Accelerator** — Dashboard: schnellster Revenue-Weg, Lead-Übersicht, Blockierte Risiken
5. **CWO Operating System** — Autonomous Revenue Operating System, tägliche Berichte
6. **Daily Runner** — Vercel Cron, täglich automatisch, kein manuelles Zutun
7. **SEO Network** — 16+ indexierbare Seiten (Branchen, Korridore, Lösungen)
8. **Buyer Snapshot** — 2-Minuten-Überblick für Käufer/Investoren
9. **Distribution Pack** — Copy-Paste-Texte für passive Verbreitung

---

## Admin-Funktionen (admin-geschützt, nur nach Login)

| Admin-Tool | URL | Funktion |
|---|---|---|
| Revenue Inbox | /admin/revenue-inbox | Leads prüfen & qualifizieren |
| Revenue Accelerator | /admin/revenue-accelerator | Lead-Counts, Revenue-Pfade |
| Buyer Readiness | /admin/buyer-readiness | Verkaufsbereitschafts-Check |
| CWO Command Center | /admin/cwo-command-center | Systemstatus, Tageslage |
| Distribution Pack | /admin/distribution-pack | Copy-Paste-Texte |
| SEO Indexing Control | /admin/seo-indexing-control | GSC Setup & Follow-up |
| Autonomous Worklog | /admin/autonomous-worklog | Tagesberichte |

---

## Revenue-Pfade (4 aktiv, kein Umsatz)

| Rang | Pfad | Lead-Typ | Status |
|---|---|---|---|
| 1 | Strategic Partnership / White-Label / Acquisition | strategic_partner | ✅ Live, 0 echte Leads |
| 2 | Agency / White-Label Partner | agency_partner | ✅ Live, 0 echte Leads |
| 3 | Employer Pilot | employer_pilot | ✅ Live, 0 echte Leads |
| 4 | Market Intelligence | market_intelligence | ✅ Live, 0 echte Leads |

**Hinweis:** Alle Leads bisher = interne Testdaten (als `rejected` markiert). Kein echtes Revenue.

---

## Was funktioniert live?

✅ Public Website (8+ Revenue- und Inbound-Seiten)
✅ Lead-Capture-Formulare (4 Pfade)
✅ DB-Speicherung (Supabase, RLS aktiv)
✅ Admin-Dashboards (5+ Tools)
✅ CWO Daily Runner (automatisch)
✅ SEO Network (16+ Seiten, sitemap.xml)
✅ Google Search Console (Domain bestätigt, Sitemap eingereicht)
✅ Tests: 2061 Tests bestanden
✅ TypeScript (keine any-Typen in Kern-Dateien)

---

## Was ist blockiert (Safety Invariants)

```
EMAIL_PROVIDER          = none  → kein Versand möglich
OUTREACH_EMAIL_PROVIDER = none  → kein Outreach möglich
Stripe                  = nicht aktiv
Scraping                = nie erlaubt
Cold-Outreach           = nie erlaubt
Google API              = nicht aktiv
Kandidatengebühren      = nicht aktiv
```

---

## Ehrliche Risiken & Lücken

| Risiko | Schwere | Details |
|---|---|---|
| Kein echter Umsatz | 🔴 Hoch | Phase 1 Pilot — 0 zahlende Kunden |
| Keine echten Leads | 🔴 Hoch | Alle bisherigen Leads = interne Tests |
| Payment nicht aktiv | 🔴 Hoch | Stripe nicht konfiguriert |
| AGB/Widerruf unvollständig | 🟡 Mittel | AGB-Seite existiert, Widerrufsrecht nicht vollständig |
| AÜG/Rechtsprüfung | 🟡 Mittel | Arbeitnehmerüberlassung nicht geprüft |
| Google-Indexierung | 🟡 Mittel | GSC eingerichtet, Crawling braucht Zeit |
| Market Validation | 🟡 Mittel | Kein validierter Produktmarkt-Fit |
| Kandidaten-Datenbank | 🟡 Mittel | Wenige echte Kandidaten im System |

---

## Keine erfundenen Zahlen

> CorridorWork befindet sich in Phase 1 (Pilot). Es gibt keine laufenden Umsätze, keine zahlenden Kunden und keine garantierten Wachstumszahlen. Alle genannten Features sind live und verifizierbar. Diese Due-Diligence-Dokumentation enthält keine erfundenen Metriken.

---

*Erstellt: 2026-06-07 | Phase 1 | Kontakt: transl.delta@gmail.com*
