# CorridorWork — Transfer Checklist

> Vollständige Übergabe-Checkliste für Käufer/Nachfolger.

---

## 1. GitHub Repository

- [ ] GitHub Repository-Zugang übertragen (Fork oder Transfer)
- [ ] Branch übergeben: `feature/global-talent-bridge-mvp-phase-1`
- [ ] GitHub Actions / CI-Konfiguration prüfen
- [ ] `.gitignore` prüfen (`.env.local` nicht committet ✅)

**Repo:** https://github.com/transldelta/Global-Talent-Bridge

---

## 2. Vercel Projekt

- [ ] Vercel-Team-Zugang übertragen oder neues Projekt deployen
- [ ] Projekt-ID: `prj_TvH1P67ZiIY1RUQCkJiI6x6W98GT`
- [ ] Team-ID: `team_sdqzlfPNWI9abMENAV87d7jT`
- [ ] Environment Variables im Vercel Dashboard übertragen (alle aus `.env.example`)
- [ ] Vercel Cron-Jobs prüfen: `/api/cron/cwo-daily-runner` (täglich)
- [ ] `vercel.json` prüfen (Cron-Konfiguration)

---

## 3. Supabase Projekt

- [ ] Supabase-Projekt-Zugang übertragen (Owner übertragen oder neues Projekt)
- [ ] Projekt-URL: `https://qjxojvxhsoicldccfmkq.supabase.co`
- [ ] Region: `eu-central-1` (Frankfurt, DSGVO-konform)
- [ ] Alle 21 Migrationen wurden angewendet (in `supabase/migrations/`)
- [ ] RLS auf allen Tabellen aktiv prüfen
- [ ] `SUPABASE_SERVICE_ROLE_KEY` im Vercel Dashboard rotieren nach Transfer
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` im Vercel Dashboard aktualisieren

---

## 4. Domain corridorwork.com

- [ ] Domain-Registrar-Zugang übertragen
- [ ] DNS-Einträge prüfen: Vercel DNS oder eigener DNS
- [ ] Google Search Console Property übertragen (optional)
- [ ] DNS TXT-Eintrag für GSC-Verifizierung notieren

---

## 5. Environment Variables

Alle benötigten Variablen aus `.env.example` ins neue System übertragen:

| Variable | Beschreibung |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key (öffentlich) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (geheim!) |
| `CRON_SECRET` | Sicheres Secret für Cron-Job-Auth |
| `NEXT_PUBLIC_BASE_URL` | Production URL (https://corridorwork.com) |
| `ADMIN_EMAILS` | Admin-E-Mail(s) für Zugang |
| `EMAIL_PROVIDER` | `none` (Standard, kein Versand) |
| `OUTREACH_EMAIL_PROVIDER` | `none` (Standard, kein Outreach) |

**Nach Transfer alle Secrets rotieren.**

---

## 6. CRON_SECRET

- [ ] Neues `CRON_SECRET` generieren: `openssl rand -hex 32`
- [ ] Im Vercel Dashboard als Environment Variable setzen
- [ ] In `vercel.json` Cron-Job prüfen

---

## 7. DNS

- [ ] Vercel DNS oder eigener Anbieter
- [ ] A/CNAME für `corridorwork.com` und `www.corridorwork.com`
- [ ] Google Search Console TXT-Eintrag (falls Property übertragen wird)

---

## 8. Google Search Console

- [ ] GSC Property `corridorwork.com` übertragen oder neu verifizieren
- [ ] Sitemap erneut einreichen: `https://corridorwork.com/sitemap.xml`
- [ ] Prioritäts-URLs manuell indexieren (Anleitung: `/admin/seo-indexing-control`)

---

## 9. Admin-Account

- [ ] Admin-E-Mail in `ADMIN_EMAILS` (Vercel Environment) aktualisieren
- [ ] Supabase Auth: bisherige Admin-User deaktivieren
- [ ] Neuen Admin-User über `/auth/register` anlegen
- [ ] Supabase Admin-Tabelle (falls vorhanden) aktualisieren

---

## 10. Post-Sale Schritte

- [ ] Alle Secrets rotieren (Supabase Keys, CRON_SECRET)
- [ ] Admin-E-Mail ändern
- [ ] Revenue Inbox prüfen: `/admin/revenue-inbox`
- [ ] Ersten Daily Runner manuell triggern (optional)
- [ ] Google Search Console erneut verifizieren
- [ ] CWO Command Center öffnen und Systemstatus prüfen

---

## Testdaten / Demo-Daten

**Achtung:** In der Datenbank befinden sich interne Test-Leads (status=`rejected`, admin_note="Internal Revenue Smoke Test").
Diese können nach Transfer gelöscht oder archiviert werden.

```sql
-- Test-Leads löschen (optional nach Transfer)
DELETE FROM revenue_leads WHERE admin_note LIKE '%Smoke Test%';
```

---

*Erstellt: 2026-06-07 | Phase 1 Transfer Pack*
