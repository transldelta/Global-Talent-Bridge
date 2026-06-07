# CorridorWork — Passive Revenue Distribution Pack

> **Stand: 2026-06-07 | Phase 1**
> Für passive, manuelle Verbreitung. Kein Cold-Outreach. Kein automatischer Versand.

---

## Was passiv geteilt werden kann

| Seite | URL | Zweck |
|---|---|---|
| Launch-Übersicht | /launch | Alle Revenue-Pfade auf einen Blick |
| Buyer Snapshot | /buyer-snapshot | 2-Minuten-Überblick für Käufer/Partner |
| Strategic Partnership | /strategic-partnership | Rang-1-Revenue-Pfad |
| Partner-Programm | /partners | Agency / White-Label Partner |
| Employer Pilot | /pilot/employers | Arbeitgeber-Pilot |
| Market Intelligence | /market-intelligence | Korridor-Daten |
| Demo | /demo | Live-Demo des Systems |

---

## Wichtigste Links (nach Priorität)

1. **https://corridorwork.com/strategic-partnership** — Höchste Priorität (Strategic Partner)
2. **https://corridorwork.com/launch** — Allgemeine Übersicht für alle Pfade
3. **https://corridorwork.com/buyer-snapshot** — Für Käufer, Investoren, Partner
4. **https://corridorwork.com/partners** — Für Agenturen und HR-Dienstleister
5. **https://corridorwork.com/pilot/employers** — Für Arbeitgeber
6. **https://corridorwork.com/demo** — Für Produktdemos

---

## Admin Distribution Pack

Fertige Copy-Paste-Texte unter `/admin/distribution-pack`:

| Text | Zweck |
|---|---|
| 1-Satz Pitch | Profil-Bios, Kurzbeschreibungen |
| 3-Satz Pitch | E-Mail-Signaturen, LinkedIn |
| 30-Sekunden Pitch | Gespräche, Events, Calls |
| LinkedIn Post | LinkedIn-Profil oder -Seite |
| WhatsApp Status | Kurz, max. 250 Zeichen |
| Kurzer Partner-Text | Persönliche Nachrichten (keine Cold-Outreach!) |
| Marketplace Listing | Acquire.com, Flippa etc. |

---

## Wie Leads reinkommen

1. Interessent sieht Link (Bio, Status, geteilter Post, organische Suche)
2. Interessent besucht /launch, /buyer-snapshot oder direkte Revenue-Seite
3. Interessent füllt Formular aus (manuell)
4. Lead landet in `revenue_leads` DB-Tabelle
5. Lead erscheint in `/admin/revenue-inbox`
6. Admin (Nutzer) qualifiziert Lead manuell
7. Gespräch → kein automatischer Prozess danach

---

## Was NICHT automatisch passiert

```
❌ Keine E-Mails werden gesendet
❌ Kein automatischer Follow-up
❌ Kein Cold-Outreach oder Bulk-Outreach
❌ Keine Stripe-Zahlungen
❌ Kein Scraping externer Daten
❌ Keine bezahlten Anzeigen aktiv
❌ Keine erfundenen Umsatzzahlen
❌ Keine Jobgarantie / Visa-Garantie
```

---

## Warum kein Spam

- `EMAIL_PROVIDER = none` — technisch unmöglich, E-Mails zu senden
- `OUTREACH_EMAIL_PROVIDER = none` — kein Outreach-Dienst konfiguriert
- Alle Formulare: manuell geprüft, DSGVO-konform
- Honeypot-Schutz gegen Bots
- Rate-Limit: 10 Anfragen pro Stunde pro IP
- Duplicate-Limit: 5 Einträge pro E-Mail-Adresse

---

## Sicherer Verbreitungsweg (Schritt für Schritt)

1. `/launch`-Link in LinkedIn-Bio, WhatsApp-Status, persönliches Profil setzen
2. Buyer Snapshot (`/buyer-snapshot`) bei ernsthaftem Interesse-Gespräch teilen
3. `Strategic Partnership`-Link direkt für strategische Kontakte
4. Revenue Inbox täglich prüfen: `/admin/revenue-inbox`
5. Leads manuell qualifizieren → Gespräch führen

**Was nicht tun:**
- Kein Massen-Mailing
- Keine bezahlten Anzeigen ohne rechtliche Prüfung
- Kein automatisches Teilen in Gruppen

---

## Daily Runner — Distribution Status

Der CWO Daily Runner protokolliert täglich:

```
Distribution links ready:
- top public link: /strategic-partnership
- top buyer link: /buyer-snapshot
- top employer link: /pilot/employers
```

Keine externen Calls. Kein Versand. Nur interne Protokollierung.

---

## Safety Invariants

```
EMAIL_PROVIDER          = none     ✓
OUTREACH_EMAIL_PROVIDER = none     ✓
Stripe                  = inaktiv  ✓
Scraping                = nie      ✓
Cold-Outreach           = nie      ✓
Google API              = inaktiv  ✓
Phase                   = 1        ✓
```

---

*Dokument erstellt: 2026-06-07 | CWO Passive Revenue Distribution Pack, Phase 1*
