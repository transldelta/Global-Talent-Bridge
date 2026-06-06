# CorridorWork — Demo-Checkliste

**Für:** Live-Demos mit Pilotkunden oder Käufern  
**Stand:** 06.06.2026  

---

## ⬜ Vor der Demo prüfen (15 Min vorher)

### Technisch
- [ ] https://corridorwork.com öffnet ohne Fehler
- [ ] https://www.corridorwork.com → leitet korrekt weiter
- [ ] Login-Seite lädt: https://corridorwork.com/auth/login
- [ ] Admin-Account eingeloggt (transl.delta@gmail.com) — Tab offen halten
- [ ] Kandidaten-Demo-Account verfügbar und eingeloggt (separater Incognito-Browser)
- [ ] Arbeitgeber-Demo-Account verfügbar und eingeloggt (separater Browser)
- [ ] Mindestens 1 aktiver Job in der DB vorhanden
- [ ] Mindestens 1 Matching-Ergebnis für Demo-Kandidat vorhanden (Score ≥ 50)

### Inhalte
- [ ] Demo-Kandidat hat vollständiges Profil (Sektor, Erfahrung, Sprachen, Zielland)
- [ ] Demo-Arbeitgeber hat vollständiges Profil + mindestens 1 aktiven Job
- [ ] Job-Anforderungen passen zum Demo-Kandidaten-Profil (Score ~80–100 % erwartet)
- [ ] Kein Test-Datenmüll sichtbar (z. B. "E2E Testkandidat" aus Tests)

### Browser-Vorbereitung
- [ ] Mindestens 3 Tabs vorbereitet:
  - Tab 1: `https://corridorwork.com` (Startseite)
  - Tab 2: Kandidaten-Dashboard (eingeloggt, Incognito)
  - Tab 3: Admin-Panel (eingeloggt)
- [ ] Browser-Cache geleert (verhindert veraltete Darstellung)
- [ ] Keine privaten Lesezeichen / Autofill-Daten sichtbar
- [ ] Bildschirmgröße: mind. 1280px Breite für korrektes Layout

---

## ✅ Während der Demo — Empfohlene Klick-Reihenfolge

### 1. Startseite (30 Sekunden)
- Öffne https://corridorwork.com
- Zeige: Headline, Nav-Punkte (Für Kandidaten / Für Arbeitgeber / Über uns)
- Sage: "Das ist das live Produkt, kein Mock"

### 2. Für Kandidaten (/for-candidates)
- Zeige die 3 Schritte: Profil → Matching → Matches
- Betone: dauerhaft kostenlos, kein Lebenslaup-Zwang

### 3. Für Arbeitgeber (/for-employers)
- Zeige den 3-Schritt-Ablauf: Firmenprofil → Job → Kandidaten
- Zeige Pricing-Vorschau (Free/Starter/Growth/Enterprise)
- Betone: MVP-Phase → aktuell kostenlos zum Testen

### 4. Kandidaten-Dashboard (Demo-Kandidat)
- Zeige das ausgefüllte Profil (Branche, Erfahrung, Sprachen)
- Klicke "Matching starten" live — oder zeige bestehende Matches
- Zeige Score-Breakdown: "Warum 100 %? Warum 60 %?"
- Betone: transparent, keine Black Box

### 5. Arbeitgeber-Dashboard (Demo-Arbeitgeber)
- Zeige Job-Liste mit Match-Anzahl
- Zeige Kandidaten-Matches für einen Job (Score, Branche, Erfahrung, Sprachlevel)
- Zeige: RLS-Isolation ("Dieser Arbeitgeber sieht nur seine Matches")

### 6. Admin-Panel (optional, für technisch interessierte Käufer)
- Zeige /admin → CEO-Dashboard mit KPIs
- Zeige /admin/operator → Approval-Queue
- Zeige: "Kein E-Mail wird ohne Bestätigung gesendet"

---

## 🚫 Was NICHT gezeigt / aktiviert werden soll

| Was | Warum |
|---|---|
| **Echte E-Mails senden** | EMAIL_PROVIDER=none — bewusst deaktiviert |
| **Outreach-Funktion auslösen** | Kein Bulk-Send, kein automatischer Versand |
| **Resend aktivieren** | Erst nach bewusster Entscheidung mit Rückfrage |
| **Echte Arbeitgeber-Kontaktdaten** | Keine persönlichen Daten in Demo zeigen |
| **echte Kandidaten-Daten ohne Einwilligung** | DSGVO — nur Demo-Daten zeigen |
| **Stripe-Zahlung** | Nicht aktiv, nicht simulieren |
| **Admin-E-Mail-Adresse** | Nicht in Screen-Share sichtbar lassen |
| **Service-Role-Key** | Nie in der Demo zeigen oder erwähnen |
| **Supabase-Dashboard** | Nicht in Demo zeigen (enthält sensible Config) |
| **`.env.local`** | Niemals öffnen während Demo/Screen-Share |

---

## ⚠️ Was nicht live demonstriert werden kann (Stand 06.06.2026)

| Funktion | Status | Erklärung für Demo |
|---|---|---|
| Automatische E-Mail-Benachrichtigungen | ⏳ In Vorbereitung | "E-Mail-Provider wird aktiviert wenn wir starten" |
| Zahlungen / Stripe | ⏳ In Vorbereitung | "Zahlungen kommen in Phase 2 — MVP ist kostenlos" |
| KI-gestütztes Matching | ⏳ Geplant | "Aktuell regelbasiert, KI-Upgrade folgt" |
| Direkter Kandidaten-Kontakt | ⏳ Freigabe-Flow | "Nur nach expliziter Freigabe — Datenschutz-by-Design" |
| Team-Zugänge | ⏳ Geplant | "Aktuell 1 Account pro Firma, Teamzugang kommt" |

---

## 📋 Nach der Demo prüfen

- [ ] Keine echten Daten des Pilotkunden in Production angelegt (falls nicht gewünscht)
- [ ] Demo-Accounts weiterhin funktionsfähig für nächste Demo
- [ ] Keine temporären Test-Einträge in der DB (E2E-Test räumt automatisch auf)
- [ ] Feedback des Kunden notiert: Was fehlte? Was überzeugte?
- [ ] Nächster Schritt mit Kunden vereinbart: Pilot-Registrierung / Rückfrage / Vertrag

---

## 🔑 Demo-Zugänge (NICHT in Dokumente einfügen — intern halten)

- Demo-Kandidat-E-Mail: intern verwaltet  
- Demo-Arbeitgeber-E-Mail: intern verwaltet  
- Admin-E-Mail: transl.delta@gmail.com  

**Passwörter niemals im Klartext in Dokumenten speichern.**

---

## 📞 Empfohlene Reaktion auf häufige Fragen

**"Wie viele Kandidaten habt ihr?"**  
→ "Wir sind im Pilot-Aufbau. Qualität vor Quantität — strukturierte Profile statt Masse."

**"Wie viele Arbeitgeber nutzen es?"**  
→ "Das ist ein ehrliches MVP. Wir suchen die ersten 3–5 Pilot-Arbeitgeber, die mitgestalten."

**"Warum kein KI-Matching?"**  
→ "Regelbasiertes Matching ist transparent und nachvollziehbar. KI-Upgrade ist in Planung."

**"Was kostet es?"**  
→ "In der Pilot-Phase ist alles kostenlos. Später: Free / 49 € / 149 € / 499 € pro Monat."

**"Ist das DSGVO-konform?"**  
→ "Ja. Daten in EU (Frankfurt), RLS auf allen Tabellen, Impressum und Datenschutz vorhanden."

**"Wer steckt dahinter?"**  
→ "Delta Translation, Karlsruhe. Brahim Ben Abla. Ein-Personen-MVP mit klar dokumentiertem Stand."
