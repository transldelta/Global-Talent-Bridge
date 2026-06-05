# Operating Costs — CorridorWork

**Stand:** 2026-06-04  
**Zweck:** Sachliche Schätzung der Betriebskosten in drei Phasen.  
**Wichtig:** Alle Zahlen sind Schätzungen basierend auf öffentlich zugänglichen Tarifen. Keine garantierten Werte.

---

## Phasenmodell

### Phase 1 — Development / Pre-Launch

**Ziel:** Plattform aufbauen, testen, erste Nutzer onboarden.  
**Nutzer:** 0–10 Arbeitgeber, 0–100 Kandidaten.

| Dienst | Tier | Kosten/Monat | Anmerkung |
|--------|------|-------------|-----------|
| Vercel | Hobby / Pro | 0–20 USD | Hobby reicht für Dev, Pro für Custom Domain + SLAs |
| Supabase | Free / Pro | 0–25 USD | Free bis 500 MB DB, Pro für Daily Backups |
| Domain | Standard | ~1–2 USD | corridorwork.com oder .de |
| E-Mail (Transactional) | Resend Free / Starter | 0–20 USD | Noch nicht aktiv |
| Storage | Supabase (inkl.) | 0 USD | Profile-Fotos noch nicht implementiert |
| **Gesamt** | | **~2–67 USD/Monat** | |

---

### Phase 2 — Pilot / Early Revenue

**Ziel:** 5–20 zahlende Arbeitgeber, 100–500 Kandidaten.  
**Besonderheit:** Erste echte Nutzer, Monitoring wichtig.

| Dienst | Tier | Kosten/Monat | Anmerkung |
|--------|------|-------------|-----------|
| Vercel | Pro | 20 USD | Custom Domain, Analytics, höhere Limits |
| Supabase | Pro | 25 USD | Daily Backups, 8 GB DB, 250 MAU |
| Domain | Standard | 2 USD | |
| E-Mail (Transactional) | Resend Starter | 20 USD | ~50.000 Emails/Monat |
| E-Mail (Team) | Google Workspace / Protonmail | 6–12 USD | Admin-E-Mails |
| Monitoring | Vercel Analytics (inkl.) | 0 USD | Basis-Monitoring |
| **Gesamt** | | **~73–79 USD/Monat** | ≈ 70–75 EUR |

**Vergleich:** Break-even bei Szenario A bereits bei MRR ~1.827 EUR → 70 EUR OpEx = ~4% Kosten.

---

### Phase 3 — Wachstum / Skalierung

**Ziel:** 50–200 Arbeitgeber, 500–5.000 Kandidaten.

| Dienst | Tier | Kosten/Monat | Anmerkung |
|--------|------|-------------|-----------|
| Vercel | Pro / Enterprise | 20–150 USD | Abhängig von Traffic |
| Supabase | Pro / Team | 25–599 USD | Team-Tier bei >50.000 MAU |
| Domain | Standard | 2 USD | |
| E-Mail (Transactional) | Resend Scale | 90 USD | ~250.000 Emails/Monat |
| E-Mail (Team) | Google Workspace | 30 USD | 5 Accounts |
| Storage | Supabase / Cloudflare R2 | 10–50 USD | Dokumente, Profilbilder |
| Monitoring | Sentry / Datadog | 26–50 USD | Error Tracking, APM |
| **Gesamt** | | **~200–970 USD/Monat** | ~190–920 EUR |

---

## Nicht-Infra-Kosten (nicht in obigen Zahlen enthalten)

| Posten | Schätzung | Anmerkung |
|--------|-----------|-----------|
| Entwicklungszeit | variabel | Aktuell: Solo-Entwickler / KI-unterstützt |
| Rechtsberatung | 500–2.000 EUR einmalig | DSGVO-Konformität, AGB-Prüfung |
| Buchführung | 50–200 EUR/Monat | ab erstem Umsatz |
| Pen-Testing | 1.000–5.000 EUR einmalig | Vor Zahlungsaktivierung empfohlen |
| Stripe-Gebühren | 1,4% + 0,25 EUR/Transaktion | EU-Karten (wenn aktiviert) |

---

## Kostenstruktur-Bewertung

| Aspekt | Einschätzung |
|--------|-------------|
| Skalierbarkeit | Gut — Vercel + Supabase skalieren ohne Infrastruktur-Aufwand |
| Fixkosten | Sehr niedrig (~70 EUR/Monat in Pilot-Phase) |
| Variable Kosten | Niedrig — hauptsächlich Supabase MAU-Gebühren |
| Break-even | Sehr schnell — 10 Arbeitgeber zahlen 70× monatliche Infra-Kosten |
| Risiko Kostensteigerung | Mittel — bei starkem Traffic-Wachstum Vercel Enterprise nötig |

---

## Vergleich: Build vs. Buy

| Alternative | Kosten | Vorteil GTB |
|------------|--------|------------|
| Eigene Server | 200–500 EUR/Monat + DevOps | GTB: managed, kein Server-Management |
| AWS / Azure | 100–300 EUR/Monat + Komplexität | GTB: einfacher Stack, schneller zu verstehen |
| Salesforce / HubSpot | 300–3.000 EUR/Monat | GTB: domänenspezifisch, günstiger, erweiterbar |

---

*Stand: 2026-06-04. Alle Preise ohne Gewähr — aktuelle Tarife der Anbieter prüfen.*
