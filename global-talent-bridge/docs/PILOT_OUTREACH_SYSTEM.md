# Pilot Outreach System — Überblick

**Seiten:**  
- `/admin/outreach-autopilot` — Entwurfs-Generator  
- `/admin/pilot-target-finder` — Zielgruppen-Recherche  
- `/admin/pilot-control` — Pilot-Dashboard  

**Compliance:** Safe Mode · Kein automatischer Versand · Phase 1

---

## Was das System macht

Das Pilot Outreach System ist ein **manueller Entwurfs-Generator** für Kontaktversuche mit potenziellen Pilotpartnern. Es:

1. Nimmt Firmendaten entgegen (manuell eingegeben)
2. Analysiert Fit-Score (0–100)
3. Erkennt Platzhalter und blockiert Demo-Daten
4. Generiert einen personalisierten Entwurf
5. Gibt den Entwurf zur **manuellen Prüfung und Versand** zurück

**Es wird NICHTS automatisch versendet.**

---

## Sicherheitsschichten

### Schicht 0: Placeholder-Erkennung

Blockiert sofort wenn erkannt:

| Muster | Beispiel |
|---|---|
| "Testfirma" | Testfirma GmbH |
| "Beispiel" | Beispiel GmbH |
| "example.com" | www.example.com |
| "Demo" | Demo Pflegeheim |
| "Muster" | Musterfirma AG |
| "Placeholder" | Placeholder Inc |
| "[Firmenname]" | [Firmenname] eingeben |
| "ACME" | ACME Corp |
| "Dummy" | Dummy GmbH |
| "Test" (allein) | Test GmbH |
| "Fake" | Fake Company |
| "localhost" | localhost:3000 |
| "your-company" | your-company.com |

### Schicht 1: Fit-Score ≥ 70

Score < 70 → `canCopy: false` + strukturierte Verbesserungshinweise

| Feld | Score-Beitrag |
|---|---|
| companyName vollständig | +20 |
| website vorhanden | +20 |
| sector ausgewählt | +15 |
| staffCount angegeben | +15 |
| contactName angegeben | +15 |
| contactRole angegeben | +10 |
| urgency angegeben | +5 |

### Schicht 2: Delivery Agent (immer blockiert)

```typescript
// lib/outreach-autopilot/delivery-agent.ts
export function checkDeliveryConditions(): DeliveryCheck {
  return {
    allowed: false,  // HARDCODED — unveränderlich in Phase 1
    reason: 'Phase 1: Kein automatischer E-Mail-Versand aktiviert.',
    ...
  }
}
```

### Schicht 3: DB Constraints

```sql
no_email_sent    BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_email_sent = TRUE)
no_auto_outreach BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_auto_outreach = TRUE)
```

---

## Pilot Target Finder

**Seite:** `/admin/pilot-target-finder`

Generiert manuelle Google-Suchlinks für 10 Sektoren:

| Sektor | Pilotfähigkeit |
|---|---|
| Altenpflege & Pflege | ⭐⭐⭐⭐⭐ |
| IT & Software | ⭐⭐⭐⭐⭐ |
| Hotel & Gastronomie | ⭐⭐⭐⭐⭐ |
| Gesundheit & Kliniken | ⭐⭐⭐⭐ |
| Logistik & Transport | ⭐⭐⭐⭐ |
| Bau & Handwerk | ⭐⭐⭐ |
| Zeitarbeit | ⭐⭐⭐ |
| Sicherheitsdienste | ⭐⭐⭐ |
| Gebäudereinigung | ⭐⭐ |
| Landwirtschaft | ⭐⭐ |

**Was es NICHT tut:**
- Kein Scraping
- Kein automatischer Kontakt
- Kein Datenkauf
- Keine LinkedIn-Automation

---

## Pilot Control Dashboard

**Seite:** `/admin/pilot-control`

Zeigt:
- Offene Pilot-Schritte (aus DB)
- Generierte Entwürfe (Anzahl, Durchschnitts-Score)
- Nächste empfohlene Aktion
- Systemstatus-Zusammenfassung

---

## Workflow für Nutzer

1. **Target Finder** → Google-Links öffnen → Firmen recherchieren
2. **Outreach Autopilot** → Firmendaten eingeben → Entwurf generieren
3. **Entwurf prüfen** → anpassen → manuell versenden (Copy-Paste)
4. **Pilot Control** → Fortschritt tracken

---

## Was niemals passiert

- ❌ Automatischer E-Mail-Versand (Delivery Agent blockiert)
- ❌ Bulk-Outreach an mehrere Firmen gleichzeitig
- ❌ Demo-Daten werden verarbeitet (Placeholder Guard)
- ❌ E-Mail-Provider aktiviert (EMAIL_PROVIDER = none)
- ❌ WhatsApp oder LinkedIn Automation
