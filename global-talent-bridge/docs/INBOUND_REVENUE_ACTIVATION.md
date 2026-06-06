# Inbound Revenue Activation Layer
## CorridorWork — Phase 1

**Letzte Aktualisierung:** 2026-06-06  
**Status:** Live (Pilot)  
**Prinzip:** Inbound statt Spam — Pull statt Push

---

## Warum Inbound statt Spam?

CorridorWork baut Revenue auf einer rein inbound-getriebenen Basis auf:

- **Kein Cold-Outreach** — keine unerbetenen E-Mails, kein LinkedIn-Spam
- **Kein Bulk-Versand** — EMAIL_PROVIDER bleibt `none`
- **Vertrauen zuerst** — Arbeitgeber, Agenturen und Datenkäufer kommen zu uns
- **Compliance by Design** — jedes Lead wird manuell geprüft, bevor Kontakt aufgenommen wird
- **DSGVO-konform** — Consent vor Speicherung, klare Zweckbeschreibung

---

## Welche Einnahmequellen sind vorbereitet?

### 1. Employer Pilot (`/pilot/employers`)

**Ziel:** Arbeitgeber melden sich für kostenlosen Pilot an.  
**Einnahmepotenzial:** SaaS-Abo nach Pilot, Success Fee, Recruitment-Fee  
**Phase 1:** Kostenlos, unverbindlich, manuell kontrolliert  
**Formular:** Firmenname, Ansprechpartner, E-Mail, Branche, Stadt/Land, Personalbedarf

```
Employer Pilot → revenue_leads (status=new) → Admin-Inbox → Manueller Kontakt
```

### 2. Agency Partner (`/pilot/agencies`)

**Ziel:** Recruiting-Agenturen, Sprachschulen, Relocation-Dienstleister als Partner.  
**Einnahmepotenzial:** White-Label Lizenz, Revenue Share, Market Intelligence Abo  
**Phase 1:** Pilotphase, Kooperation ohne Vertrag  
**Formular:** Organisation, Ansprechpartner, E-Mail, Land, Zielkorridor, Organisationstyp, Interessenfelder

```
Agency Partner → revenue_leads (status=new) → Admin-Inbox → Manueller Kontakt
```

### 3. Market Intelligence (`/market-intelligence`)

**Ziel:** B2B-Interessenten erhalten aggregierte Korridor-Insights als Report.  
**Einnahmepotenzial:** Report-Abo, Custom Analysis, Data-as-a-Service  
**Phase 1:** Interesse anmelden → manuell geprüft → manuelle Report-Erstellung  
**Formular:** Organisation, E-Mail, Korridor-Interesse, Bedarfsbeschreibung  
**Wichtig:** Keine personenbezogenen Kandidatendaten. Nur aggregierte, anonymisierte Marktdaten.

```
Market Intelligence Interesse → revenue_leads (status=new) → Admin-Inbox → Manueller Report
```

---

## Warum ist Stripe nicht aktiv?

Stripe ist in Phase 1 bewusst deaktiviert, weil:

1. **Rechtsprüfung fehlt** — Zahlungsprozesse für Recruitment-Dienste unterliegen besonderen rechtlichen Anforderungen (z.B. AÜG, Vermittlungsgebühren)
2. **Kein Pilot-Beweis** — Erst wenn ein Pilot erfolgreich abgeschlossen wurde, macht eine kostenpflichtige Stufe Sinn
3. **Vertrauen aufbauen** — Arbeitgeber und Partner müssen dem System vertrauen, bevor sie zahlen
4. **Regulatorisches Risiko** — Keine Zahlungsauslösung ohne explizite Zustimmung und Rechtsprüfung

**Was vor der Stripe-Aktivierung geprüft werden muss:**
- [ ] Rechtliche Beratung: Recruitment-Fee-Modell (AÜG, BGB § 611a)
- [ ] Datenschutz-Prüfung: Datenschutzerklärung aktualisieren
- [ ] AGB: Zahlungskonditionen, Widerrufsrecht, Leistungsbeschreibung
- [ ] Impressum: Vollständige Angaben
- [ ] Testphase: Mind. 3 erfolgreiche Pilot-Abschlüsse
- [ ] Stripe-Konto: Nicht aktiviert, bis obige Punkte erfüllt

---

## Was passiert täglich automatisch?

Der **Daily CWO Runner** (täglich 06:00 UTC) zählt automatisch:

- Neue `revenue_leads` (status=`new`)
- Aufschlüsselung nach Typ: Employer Pilot / Agency Partner / Market Intelligence
- Schreibt Summary in `autonomous_worklog`
- **Kein E-Mail-Versand**
- **Kein automatischer Outreach**
- **Keine externe API**

```
Vercel Cron 06:00 UTC
  → GET /api/cron/cwo-daily-runner (CRON_SECRET)
  → COUNT revenue_leads WHERE status='new' [interne DB-Abfrage]
  → INSERT autonomous_worklog (summary mit Lead-Anzahl)
  → Response: { revenueLeads: { newTotal, employerPilot, agencyPartner, marketIntel } }
```

---

## Datenbankstruktur

### `revenue_leads`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primärschlüssel |
| `lead_type` | TEXT | `employer_pilot` / `agency_partner` / `market_intelligence` |
| `organization_name` | TEXT | Firmen-/Organisationsname |
| `contact_name` | TEXT | Ansprechpartner |
| `email` | TEXT | E-Mail (normalisiert, lowercase) |
| `country` / `city` | TEXT | Geografische Einordnung |
| `sector` | TEXT | Branche oder Korridor |
| `message` | TEXT | Beschreibung des Bedarfs |
| `consent_to_contact` | BOOLEAN | DSGVO-Zustimmung |
| `status` | TEXT | `new` / `reviewed` / `qualified` / `rejected` / `contacted_manual` |
| `admin_note` | TEXT | Interne Admin-Notiz |
| `no_email_sent` | BOOLEAN | Immer TRUE (DB CHECK) |
| `no_auto_outreach` | BOOLEAN | Immer TRUE (DB CHECK) |
| `no_payment_started` | BOOLEAN | Immer TRUE (DB CHECK) |

**RLS:** Aktiviert. Kein direkter Zugriff für `anon` oder `authenticated`. Nur `service_role` (createAdminClient).

---

## API-Sicherheit

### `POST /api/public/revenue-leads`

- **Honeypot-Feld** (`website`): Bots füllen es aus → stille Ablehnung
- **Rate-Limit:** 10 Requests/IP/Stunde (in-memory)
- **Duplicate-Check:** max. 5 Leads pro E-Mail+Typ
- **Serverseitige Validierung:** alle Felder geprüft
- **Kein E-Mail-Versand:** nie
- **Kein Scraping**

---

## Compliance-Grundsätze (alle Formulare)

1. Keine Jobgarantie
2. Keine Visa-Garantie
3. Keine automatische Zahlung
4. Keine automatische Kontaktaufnahme durch System
5. Freiwillige, widerrufbare Pilot-Anfrage
6. DSGVO Art. 6 Abs. 1 lit. b — Vertragsanbahnung

---

## Admin-Workflow

```
1. Lead kommt an → revenue_leads (status=new)
2. Admin öffnet /admin/revenue-inbox
3. Lead prüfen → "Als geprüft markieren"
4. Lead qualifizieren → "Als qualifiziert markieren"
5. Manuell kontaktieren (außerhalb des Systems: per E-Mail/Telefon)
6. Status setzen → "Als manuell kontaktiert markieren"
7. Optional: In CWO Worklog übernehmen
```

**KEIN Send-Button. KEIN automatischer Versand. KEIN Stripe.**
