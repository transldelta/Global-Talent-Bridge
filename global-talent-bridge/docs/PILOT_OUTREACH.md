# Pilot Outreach — Leitfaden

> **Hinweis:** Keine Rechtsberatung. Keine Garantie. Nur strukturierte Orientierung für den manuellen Outreach-Prozess.

---

## Überblick

Das Pilot-Outreach-Cockpit unter `/admin/pilot-outreach` bereitet personalisierte Outreach-Templates für alle Pilot-Arbeitgeber vor.

**Wichtigste Regel:** Kein automatischer Versand. Der Admin kopiert den Text und sendet manuell per E-Mail, WhatsApp oder LinkedIn.

---

## Workflow

```
1. /admin/pilot-outreach aufrufen
2. Arbeitgeber auswählen (Korridor + Template-Typ wird automatisch erkannt)
3. Kanal wählen: E-Mail / WhatsApp / LinkedIn
4. Text kopieren (📋 Button)
5. [Platzhalter] in eckigen Klammern ersetzen
6. Manuell senden
7. Status aktualisieren: identified → contacted_manual
8. Reaktion dokumentieren (Feedback-Vorbereitung im Cockpit)
9. Status weiter: contacted_manual → interested / rejected / demo_scheduled
```

---

## Status-Workflow

| Status | Bedeutung | Nächster Schritt |
|--------|-----------|------------------|
| `identified` | Arbeitgeber identifiziert, noch nicht kontaktiert | Template vorbereiten, manuell senden |
| `contacted_manual` | Manuell kontaktiert, noch keine Antwort | Warten, ggf. Follow-up in 5-7 Tagen |
| `interested` | Hat Interesse gezeigt | Demo-Termin vereinbaren |
| `demo_scheduled` | Demo-Termin vereinbart | Demo vorbereiten, durchführen |
| `onboarding` | Startet Pilotprogramm | Onboarding-Checkliste |
| `active_pilot` | Aktiver Pilotkunde | Regelmäßiger Check-in |
| `rejected` | Kein Interesse | In 3-6 Monaten erneut evaluieren |

---

## Template-Typen

### 1. Pflegeheim / Altenpflege
- **Zielgruppe:** Pflegeheime, Seniorenwohnungen, Sozialstationen
- **Korridor:** Philippinen → Deutschland, Vietnam → Deutschland
- **Hauptargument:** Qualifizierte Pflegekräfte mit B1/B2 Deutsch, Anerkennungsbegleitung
- **Ton:** Formal, empathisch, lösungsorientiert

### 2. Klinik / Krankenhaus
- **Zielgruppe:** Akutkliniken, Fachkliniken, MVZ
- **Korridor:** Mehrere Länder → Deutschland
- **Hauptargument:** Gezieltes Matching nach Fachgebiet, transparenter Prozess
- **Ton:** Professionell, präzise, auf Effizienz fokussiert

### 3. IT-Unternehmen
- **Zielgruppe:** Tech-Startups, Software-Agenturen, IT-Abteilungen
- **Korridor:** Indien → EU, Ukraine → Deutschland
- **Hauptargument:** Geprüfte Tech-Skills, strukturierter Matching-Prozess, kein Blindposting
- **Ton:** Direkt, modern, peer-to-peer

### 4. Personalvermittler / Recruiter
- **Zielgruppe:** HR-Agenturen, Headhunter, Personaldienstleister
- **Korridor:** Globaler Talentpool → Kunden
- **Hauptargument:** Erweiterter Kandidatenpool, Provisionsmodell, kein Exklusivvertrag
- **Ton:** Kooperativ, B2B, zahlenorientiert

### 5. Sprachschule / Bildungspartner
- **Zielgruppe:** Sprachschulen, Bildungsinstitute, Universitäten
- **Korridor:** Mehrere Länder → Deutschland (Sprachausbildung)
- **Hauptargument:** Zugang zu Kandidaten, die aktiv B1/B2 benötigen, gegenseitiger Mehrwert
- **Ton:** Partnerschaftlich, inhaltlich, langfristig

---

## Feedback-Zustände

| Zustand | Bedeutung | Empfohlene Aktion |
|---------|-----------|-------------------|
| ✅ Interesse | Echtes Interesse gezeigt | Demo-Termin anfragen, Status → interested |
| ❌ Kein Interesse | Abgelehnt | Status → rejected, in 3-6 Monaten re-evaluieren |
| 📞 Rückruf | Hat um Rückruf gebeten | Follow-up-Datum setzen, Status → contacted_manual |
| 🎯 Demo | Demo-Termin vereinbart | Kalender eintragen, Status → demo_scheduled |
| ⚠️ Einwand | Frage / Vorbehalt | Antwort vorbereiten, nachfassen |

---

## Korridor-Inferenz

Die Plattform leitet automatisch den passenden Korridor aus Land + Branche ab:

```typescript
// Beispiele:
inferCorridor('Philippinen', 'Pflegeheim')   // → "Philippinen → Deutschland (Pflege)"
inferCorridor('Indien', 'IT')                 // → "Indien → EU (IT / Software)"
inferCorridor('Ukraine', 'Software')          // → "Ukraine → Deutschland (IT)"
inferCorridor('Deutschland', 'Recruiter')     // → "Globaler Talentpool → Ihre Kunden"
```

---

## Platzhalter-Referenz

Alle Templates enthalten folgende Platzhalter — **vor dem Senden ersetzen**:

| Platzhalter | Ersetzen mit |
|------------|-------------|
| `[Ihr Name]` | Vollständiger Name des Absenders |
| `[Telefon / WhatsApp]` | Kontaktdaten des Absenders |

---

## CEO Dashboard KPIs (Outreach-Funnel)

Im CEO Dashboard unter „🚀 Pilot Launch" werden folgende Outreach-KPIs angezeigt:

| KPI | Quelle | Bedeutung |
|-----|--------|-----------|
| Vorbereitet | `pilot_employers.status = 'identified'` | Noch nicht kontaktiert |
| Kontaktiert | `pilot_employers.status = 'contacted_manual'` | Manuell angeschrieben |
| Interessiert | `pilot_employers.status = 'interested'` | Hat Interesse signalisiert |
| Demo | `pilot_employers.status = 'demo_scheduled'` | Termin vereinbart |
| Abgelehnt | `pilot_employers.status = 'rejected'` | Kein Interesse |

---

## Logging

Alle Status-Änderungen werden automatisch protokolliert:

```
system_logs:
  agent_name: 'pilot-outreach'
  status: 'success'
  message: 'Status-Update: Seniorenheim XY → contacted_manual (Admin: admin@example.com)'
```

---

## Sicherheits-Constraints

- **Kein automatischer Versand** — System sendet niemals selbst
- **Keine externen Kosten** — Kein API-Aufruf für E-Mail/WhatsApp
- **Alle Aktionen in system_logs** — Vollständige Nachvollziehbarkeit
- **Admin-only** — Nur authentifizierte Admins (ADMIN_EMAILS) haben Zugriff
- **Keine Rechtsberatung** — Templates sind Orientierungshilfe, keine rechtlich verbindlichen Muster

---

## Entwickler-Referenz

| Datei | Zweck |
|-------|-------|
| `lib/outreach/templates.ts` | Template-Generierung, Korridor-Inferenz, Typ-Erkennung |
| `app/admin/pilot-outreach/page.tsx` | Server Component, lädt pilot_employers |
| `app/admin/pilot-outreach/_components/OutreachCard.tsx` | Client Component, Tab-UI + Feedback |
| `app/admin/pilot-outreach/_components/StatusUpdater.tsx` | Client Component, PATCH-Status-API |
| `app/admin/pilot-outreach/_components/CopyButton.tsx` | Client Component, Clipboard API |
| `app/api/admin/pilot-outreach/[id]/status/route.ts` | PATCH API für Status-Updates |
| `__tests__/outreach.templates.test.ts` | Unit-Tests (Vitest) |

---

*Erstellt: 2026-06-04 | Sprint J: Pilot Outreach Kit*
