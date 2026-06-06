# Legal Readiness — Revenue Leads (Pilot-Formulare)
## CorridorWork — Phase 1

**Letzte Aktualisierung:** 2026-06-06  
**Status:** Vorbereitet (kein bezahlter Betrieb aktiv)  
**Verantwortlich:** Brahim Ben Abla / Delta Translation

---

## Was wurde rechtlich vorbereitet?

### ✅ Datenschutzerklärung (§ 10)
Die Datenschutzerklärung unter `/legal/datenschutz` enthält einen eigenen Abschnitt (§ 10)
für Pilot-, Partner- und Market-Intelligence-Anfragen, der dokumentiert:

- Welche Daten erhoben werden (Organisation, Ansprechpartner, E-Mail, Land/Stadt, Branche, Nachricht, Zeitstempel, Anfragetyp)
- Zweck der Verarbeitung (Vertragsanbahnung — Art. 6 Abs. 1 lit. b DSGVO, ggf. Einwilligung Art. 6 Abs. 1 lit. a DSGVO)
- Was NICHT passiert (kein automatischer E-Mail-Versand, kein Outreach, keine Zahlung)
- Weitergabe an Dritte (keine außer technischen Dienstleistern Supabase/Vercel)
- Speicherdauer (max. 24 Monate oder bis auf Wunsch gelöscht)
- Rechte der betroffenen Personen (Auskunft, Berichtigung, Löschung, Widerspruch)
- Kontakt für Datenschutzanfragen: transl.delta@gmail.com

### ✅ Impressum (§ 5 TMG)
Das Impressum unter `/legal/impressum` enthält vollständige Pflichtangaben:
- Anbieter: Brahim Ben Abla / Delta Translation
- Adresse: Schlesier Str. 64, 76227 Karlsruhe, Deutschland
- E-Mail: transl.delta@gmail.com
- Telefon: 0157 863 047 59
- Umsatzsteuer-ID: DE310737989
- EU-Streitschlichtungshinweis: vorhanden

### ✅ Consent-Mechanismus (alle 3 Formulare)
Alle drei Formulare (`/pilot/employers`, `/pilot/agencies`, `/market-intelligence`) haben:
- Consent-Checkbox (Pflichtfeld, nicht vorangekreuzt)
- Checkbox-Text: "Ich möchte, dass CorridorWork mich zur Bearbeitung dieser Anfrage kontaktiert. Ich stimme der Speicherung meiner Angaben gemäß der Datenschutzerklärung zu (freiwillig, jederzeit widerrufbar)."
- Link zur Datenschutzerklärung direkt im Consent-Text
- Submit-Button bleibt deaktiviert bis Consent = true
- Serverseitige Prüfung: `validateLeadInput` lehnt Anfragen ohne `consent_to_contact = true` ab

### ✅ Compliance Disclaimer (alle 3 Formulare)
Jedes Formular zeigt vor der Checkbox:
- Keine Jobgarantie
- Keine Visa-Garantie
- Keine automatische Zahlung
- DSGVO-Hinweis mit Link zur Datenschutzerklärung

### ✅ Honeypot-Schutz
Alle Formulare enthalten ein verstecktes `website`-Feld (display:none).
Bots, die dieses Feld ausfüllen, werden silently abgelehnt.

### ✅ DB-Level Safety Constraints
Die Datenbanktabelle `revenue_leads` hat unüberwindbare CHECK-Constraints:
```sql
CHECK (no_email_sent = TRUE)
CHECK (no_auto_outreach = TRUE)
CHECK (no_payment_started = TRUE)
```
Diese können nicht auf `false` gesetzt werden — weder per API noch per direkten DB-Zugriff.

### ✅ RLS (Row Level Security)
`revenue_leads` ist RLS-geschützt:
- `anon` → kein Zugriff
- `authenticated` → kein Zugriff
- `service_role` (createAdminClient) → vollständiger Admin-Zugriff

### ✅ Rate-Limiting (Public API)
`POST /api/public/revenue-leads`:
- Max. 10 Anfragen pro IP-Adresse pro Stunde (in-memory)
- Max. 5 Leads pro E-Mail-Adresse + Anfragetyp

---

## Was bleibt vor bezahltem Betrieb offen?

| # | Punkt | Priorität | Verantwortlich |
|---|---|---|---|
| 1 | **AGB (Allgemeine Geschäftsbedingungen)** — fehlen komplett für Zahlungsverkehr | 🔴 Kritisch vor Stripe | Rechtliche Beratung erforderlich |
| 2 | **Widerrufsbelehrung** — gemäß § 312g BGB für Fernabsatzverträge | 🔴 Kritisch vor Stripe | Rechtliche Beratung erforderlich |
| 3 | **Leistungsbeschreibung** — präzise Definition der Dienstleistung (was schuldet CorridorWork dem Kunden?) | 🔴 Kritisch vor Stripe | Intern definieren |
| 4 | **Recruitment-Fee-Modell** — rechtliche Prüfung AÜG (Arbeitnehmerüberlassungsgesetz), BGB § 611a | 🟡 Wichtig | Fachanwalt Arbeitsrecht |
| 5 | **Datenschutzerklärung aktualisieren** — Zahlungsanbieter (Stripe) ergänzen, wenn aktiviert | 🟡 Wichtig vor Stripe | Intern |
| 6 | **Cookie-Banner** — aktuell keine Tracking-Cookies, aber prüfen ob notwendig wenn Analytics hinzukommt | 🟢 Gering (Phase 1) | Intern |
| 7 | **Verarbeitungsverzeichnis** (Art. 30 DSGVO) — für B2B relevant wenn Mitarbeiterdaten verarbeitet werden | 🟢 Gering (Phase 1) | Intern |
| 8 | **Auftragsverarbeitungsverträge** (AVV) — mit Supabase + Vercel aktuell vorhanden? | 🟡 Wichtig | Prüfen |

---

## Was muss vor Stripe / Payment geprüft werden?

**Checkliste (alle Punkte müssen erfüllt sein, bevor Stripe aktiviert wird):**

- [ ] ✗ Rechtliche Beratung: Recruitment-Fee-Modell (AÜG, BGB § 611a)
- [ ] ✗ AGB erstellen: Zahlungskonditionen, Leistungsbeschreibung, Haftungsausschluss
- [ ] ✗ Widerrufsbelehrung (14 Tage, §§ 312g, 355 BGB)
- [ ] ✗ Datenschutzerklärung: Stripe als Zahlungsdienstleister ergänzen
- [ ] ✗ Stripe-Konto vollständig verifiziert
- [ ] ✗ Mind. 3 erfolgreiche Pilot-Abschlüsse dokumentiert
- [ ] ✗ Preisgestaltung genehmigt (interner Business-Entscheid)
- [ ] ✗ `REVENUE_LEAD_INVARIANTS.no_payment_started` kann erst nach obigen Checks auf Phase 2 gesetzt werden

---

## Was muss vor automatischem E-Mail-Versand geprüft werden?

**Checkliste:**

- [ ] ✗ Einwilligung prüfen: reicht die bestehende Consent-Checkbox für Transaktions-E-Mails?
- [ ] ✗ E-Mail-Provider auswählen (Resend / Postmark / SendGrid) und konfigurieren
- [ ] ✗ Datenschutzerklärung: E-Mail-Provider ergänzen
- [ ] ✗ Unsubscribe-Mechanismus (CAN-SPAM / DSGVO) implementieren
- [ ] ✗ E-Mail-Vorlagen DSGVO-konform gestalten (kein Tracking ohne Einwilligung)
- [ ] ✗ `EMAIL_PROVIDER` bleibt `none` bis obige Punkte erfüllt

---

## Welche Daten werden gespeichert? (revenue_leads Tabelle)

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | UUID | ja | Primärschlüssel (auto) |
| `lead_type` | TEXT | ja | `employer_pilot` / `agency_partner` / `market_intelligence` |
| `organization_name` | TEXT | ja | Firmen-/Organisationsname (2–200 Zeichen) |
| `contact_name` | TEXT | ja | Ansprechpartner (2–200 Zeichen) |
| `email` | TEXT | ja | E-Mail (normalisiert, Regex-validiert) |
| `country` | TEXT | nein | Land (optional) |
| `city` | TEXT | nein | Stadt (optional) |
| `sector` | TEXT | nein | Branche / Korridor-Interesse (optional) |
| `message` | TEXT | nein | Freitext-Beschreibung (optional) |
| `consent_to_contact` | BOOLEAN | ja | DSGVO-Einwilligung (muss true sein) |
| `status` | TEXT | ja | `new` / `reviewed` / `qualified` / `rejected` / `contacted_manual` |
| `source_page` | TEXT | ja | Herkunftsseite (`/pilot/employers` etc.) |
| `admin_note` | TEXT | nein | Interne Admin-Notiz |
| `no_email_sent` | BOOLEAN | ja | Immer TRUE (DB CHECK Constraint) |
| `no_auto_outreach` | BOOLEAN | ja | Immer TRUE (DB CHECK Constraint) |
| `no_payment_started` | BOOLEAN | ja | Immer TRUE (DB CHECK Constraint) |
| `created_at` | TIMESTAMPTZ | ja | Zeitpunkt der Anfrage (auto) |
| `updated_at` | TIMESTAMPTZ | ja | Letzte Aktualisierung (auto) |

---

## Welche Risiken sind blockiert?

| Risiko | Blockiert durch |
|---|---|
| Automatischer E-Mail-Versand | `no_email_sent = TRUE` (DB CHECK) + `EMAIL_PROVIDER = none` |
| Automatischer Outreach | `no_auto_outreach = TRUE` (DB CHECK) + keine Outreach-Funktion in `lib/revenue-leads.ts` |
| Zahlung / Stripe | `no_payment_started = TRUE` (DB CHECK) + keine Stripe-Funktion in `lib/revenue-leads.ts` |
| Bot-Spam | Honeypot-Feld (`website`) + Rate-Limit (10/IP/h) |
| Duplicate-Flooding | Max. 5 Leads pro E-Mail + Typ |
| Unberechtigter DB-Zugriff | RLS aktiv: nur `service_role` (Admin) kann Leads lesen/schreiben |
| Scraping | Kein outbound HTTP in Lead-Capture-API |
| Datenabfluss | Kandidaten-Leads nicht öffentlich → `anon` = kein Zugriff |
| Jobgarantie-Versprechen | COMPLIANCE_DISCLAIMER auf allen Formularen |
| Visa-Garantie-Versprechen | COMPLIANCE_DISCLAIMER auf allen Formularen |

---

## Admin-Workflow (manuell, Phase 1)

```
1. Lead kommt an  →  revenue_leads (status=new)
2. Admin → /admin/revenue-inbox
3. Lead prüfen: Firmenname, E-Mail, Bedarf, Score
4. "Als geprüft markieren" → status=reviewed
5. "Als qualifiziert markieren" → status=qualified
6. Manuell kontaktieren (E-Mail/Telefon, außerhalb des Systems)
7. "Als manuell kontaktiert markieren" → status=contacted_manual
8. Optional: In CWO Worklog übernehmen
```

**KEIN Send-Button. KEIN automatischer Versand. KEIN Stripe.**

---

## Verantwortlicher / Datenschutzkontakt

**Brahim Ben Abla / Delta Translation**  
Schlesier Str. 64, 76227 Karlsruhe, Deutschland  
E-Mail: transl.delta@gmail.com  
Telefon: 0157 863 047 59  
USt-ID: DE310737989
