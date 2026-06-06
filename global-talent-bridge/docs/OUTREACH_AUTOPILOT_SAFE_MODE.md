# CorridorWork — Outreach Autopilot Safe Mode

**Stand:** 06.06.2026  
**Status:** Phase 1 — Kein automatischer Versand  
**Route:** https://corridorwork.com/admin/outreach-autopilot

---

## Warum kein Bulk-Spam?

CorridorWork ist eine B2B-Plattform, die auf Vertrauen aufgebaut ist. Massenhafte unerwünschte Nachrichten würden:

1. **DSGVO verletzen** — unaufgeforderte Kontaktaufnahme ohne Rechtsgrundlage (kein berechtigtes Interesse bei kaltem Erstkontakt per E-Mail)
2. **Reputation zerstören** — Spam-Beschwerden führen zu Domain-Blacklisting
3. **Falsche Arbeitgeber anziehen** — Massenoutreach erzeugt unqualifizierte Leads
4. **Vertrauen brechen** — CorridorWork wirbt mit transparentem Matching, nicht mit Spam

**Grundsatz:** Jede Nachricht ist eine einzelne, überlegte Einladung — nicht ein Massenversand.

---

## Wie arbeiten die Agenten?

Das System besteht aus 6 Agenten, die wie eine interne Abteilung arbeiten:

### 1. 🔬 Research Agent
- **Was er tut:** Strukturiert die manuell eingegebenen Firmendaten
- **Was er NICHT tut:** Kein Scraping, kein Web-Crawling, kein API-Call, kein Datenkauf
- **Eingabe:** Firmenname, Website (optional), Branche (optional), Notizen (optional)
- **Ausgabe:** Strukturiertes CompanyProfile mit Keywords und Kontextinfos

### 2. 🎯 Fit Scoring Agent
- **Was er tut:** Bewertet ob die Firma zu CorridorWork passt
- **Score-Kriterien:**
  | Kriterium | Max. Punkte |
  |---|---|
  | Sektor-Relevanz (Pflege, Bau, IT, Logistik…) | 30 |
  | Digitale Präsenz / Website | 10 |
  | Einstellungssignale in Notizen | 20 |
  | Internationaler Fachkräftebedarf | 20 |
  | Kontaktqualität | 10 |
  | Profilvollständigkeit | 10 |
  | **Gesamt** | **100** |
- **Threshold:** Score ≥ 70 für Outreach-Freigabe
- **Unter 70:** Kein Outreach vorgeschlagen, keine Copy-Funktion aktiv

### 3. 🛡️ Compliance & Spam-Risk Agent
- **Was er tut:** Prüft jeden Nachrichtentext vor Freigabe
- **Blockiert wenn:**
  - Zu werbliche Sprache (revolutionär, sofort kaufen, letzte Chance)
  - Massenversand-Indikatoren (bulk, an alle Firmen, automatisch versendet)
  - Falsche Versprechen (100% Garantie, garantierte Einstellung)
  - Druck-Taktiken (begrenzte Plätze, nur noch X frei)
  - Fehlende Signatur "CorridorWork Team"
  - Kein klarer Pilot-/Test-Charakter
  - Persönliche Daten ohne Grundlage
  - Persönlicher Name oder [Ihr Name]-Platzhalter
- **Ergebnisse:**
  - `safe` — Text kann kopiert werden
  - `needs_review` — Warnungen vorhanden, manuell prüfen
  - `blocked` — Kein Kopieren möglich bis Fehler behoben

### 4. ✍️ Personalization Agent
- **Was er tut:** Erstellt eine kurze, menschlich klingende Nachricht
- **Kanalspezifisch:** WhatsApp (kurz), LinkedIn (professionell), E-Mail (formal), Persönlich
- **Immer enthalten:**
  - "kostenlos" und "unverbindlich"
  - "kein Abo, keine automatische Zahlung"
  - "keine automatischen E-Mails an Kandidaten"
  - Link: https://corridorwork.com/auth/register?role=employer
  - Signatur: CorridorWork Team
- **Nie enthalten:** persönlicher Absendername, Drucksprache, Massenversand-Sprache

### 5. 👤 Human Approval Agent
- **Was er tut:** Prüft ob eine Freigabe möglich ist
- **Freigabe-Bedingungen:** Fit Score ≥ 70 UND Compliance = safe/needs_review
- **Copy-Bedingungen:** Fit Score ≥ 70 UND Compliance = safe
- **Wichtig:** Ohne menschliche Freigabe passiert gar nichts
- **Kein automatisches Approval**

### 6. 📦 Delivery Agent (Phase 2 — NICHT AKTIVIERT)
- **Status:** Architektur vorhanden, Code existiert, aber hardcoded `allowed: false`
- **Was er wann tun wird:** Siehe Abschnitt "Phase 2" unten

---

## Was ist automatisch?

| Was | Automatisch? |
|---|---|
| Firmendaten aus öffentlicher Quelle holen | ❌ Nein — nur manuelle Eingabe |
| Fit Score berechnen | ✅ Ja — nach "Analyse starten" klicken |
| Compliance prüfen | ✅ Ja — nach "Analyse starten" klicken |
| Nachrichtentext generieren | ✅ Ja — nach "Analyse starten" klicken |
| Nachricht versenden | ❌ Nein — niemals in Phase 1 |
| DB-Eintrag erstellen | ✅ Ja — nach "Als Entwurf speichern" klicken |
| Arbeitgeber kontaktieren | ❌ Nein — immer Copy & Paste durch Admin |

---

## Was bleibt bewusst manuell?

| Was | Warum manuell |
|---|---|
| Firmendaten eingeben | Kein Scraping — nur eigene Kontakte |
| Kanal wählen | Admin entscheidet welcher Kanal passt |
| Text kopieren | Bewusste Entscheidung pro Nachricht |
| Nachricht versenden | WhatsApp/LinkedIn/E-Mail manuell durch Admin |
| Freigabe erteilen | Menschliche Kontrolle vor jeder Aktion |

---

## Wann wäre Phase 2 (automatischer Versand) erlaubt?

Phase 2 wird **nur** aktiviert wenn **ALLE** folgenden Bedingungen erfüllt sind:

| Bedingung | Erfüllt? |
|---|---|
| `EMAIL_PROVIDER ≠ none` | ❌ (aktuell: none) |
| `OUTREACH_EMAIL_PROVIDER ≠ none` | ❌ (aktuell: none) |
| Kontaktquelle: `existing_relationship` oder `explicit_opt_in` | ❌ (aktuell: manual_input) |
| Compliance Agent = `safe` | Prüfung ausstehend |
| Fit Score ≥ 70 | Prüfung ausstehend |
| Einzelne Nachricht explizit freigegeben | Prüfung ausstehend |
| Tageslimit ≤ 5 Nachrichten | Prüfung ausstehend |
| Vollständiges Audit-Log vorhanden | Prüfung ausstehend |
| Opt-out/Stop-Vermerk vorhanden | Prüfung ausstehend |

**Kein E-Mail-Massenversand ist geplant.** Phase 2 erlaubt maximal 3–5 Nachrichten/Tag an explizit einwilligende oder bekannte Kontakte.

---

## Sicherheitsregeln

| Regel | Durchsetzung |
|---|---|
| Kein Scraping / Crawling | Kein externer API-Call in Research Agent |
| Kein Massenversand | Kein Bulk-Endpoint, kein Array-Versand |
| Keine Resend-Aktivierung | EMAIL_PROVIDER=none hardcoded in ENV |
| Keine automatischen E-Mails | OUTREACH_EMAIL_PROVIDER=none |
| Kein Send-Button | Kein `<button>Senden</button>` in UI |
| Admin-only Zugriff | `getCurrentAdminUser()` → redirect bei Fehler |
| no_email_sent=true immer | DB-Constraint: `CHECK (no_email_sent = true)` |
| no_auto_outreach=true immer | DB-Constraint: `CHECK (no_auto_outreach = true)` |
| RLS auf DB-Tabelle | REVOKE ALL von anon/authenticated/PUBLIC |
| Keine Secrets im Client | Alle Admin-Operationen serverseitig |

---

## Tageslimits (Phase 2 — vorbereitet)

- **Maximum:** 5 Nachrichten pro Tag
- **Typ:** nur Einzelnachrichten (keine Arrays)
- **Tracking:** `dailySentCount` in Delivery Agent geprüft
- **Enforcement:** `checkDeliveryConditions()` blockiert bei Überschreitung

---

## Approval-Workflow

```
Firma eingeben
      ↓
Analyse starten
      ↓
Research Agent → Fit Scoring → Personalization → Compliance
      ↓
Score ≥ 70 UND Compliance safe?
      ├── Ja  → "Text kopieren" aktiviert
      └── Nein → Hinweis anzeigen, speichern als blocked/needs_review
      ↓
Als Entwurf speichern (immer möglich)
      ↓
[Optional] Zur Prüfung markieren
      ↓
[Optional] Freigeben (approved_for_manual_copy)
      ↓
Text kopieren (Copy & Paste durch Admin)
      ↓
Manuell versenden (WhatsApp / LinkedIn / E-Mail / Persönlich)
      ↓
Kontakt manuell erledigt markieren
```

---

## Erlaubte Aktionen in Phase 1

| Aktion | Erlaubt? |
|---|---|
| "Text kopieren" | ✅ (nur wenn compliance=safe UND score≥70) |
| "Als Entwurf speichern" | ✅ immer |
| "Zur Prüfung markieren" | ✅ immer |
| "Freigeben (Copy ready)" | ✅ (nur wenn compliance≠blocked UND score≥70) |
| "Kontakt manuell erledigt" | ✅ immer |
| "Senden" | ❌ nicht vorhanden |
| "Bulk senden" | ❌ nicht vorhanden |
| "Automatisch kontaktieren" | ❌ nicht vorhanden |
| "Resend aktivieren" | ❌ nicht vorhanden |

---

## Audit-Trail

Jede Aktion wird in `system_logs` protokolliert:
- `agent_name: 'outreach_autopilot'`
- Fit Score, Compliance-Status, Status, Admin-E-Mail
- `no_email_sent: true`
- `no_auto_outreach: true`

---

## Datenschutz & DSGVO

- Nur manuell eingegebene, öffentlich bekannte Firmendaten
- Keine persönlichen Daten ohne Grundlage
- Keine automatische Kontaktaufnahme
- Kein Datenkauf, kein Scraping
- Alle Daten in EU (Supabase Frankfurt)
- Admin-only Zugriff auf alle Daten
