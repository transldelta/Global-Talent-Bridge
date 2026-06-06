# CorridorWork — Demo- und Verkaufsübersicht

**Stand:** 06.06.2026 | Live: https://corridorwork.com

---

## Was CorridorWork macht

CorridorWork ist eine **approval-basierte Matching-Plattform für Cross-border Hiring** — sie verbindet internationale Fachkräfte strukturiert mit Arbeitgebern, die gezielt internationale Talente suchen.

Kandidaten legen ein strukturiertes Profil an (Branche, Erfahrung, Sprachlevel, Zielland). Arbeitgeber definieren ihre Jobanforderungen. Das System berechnet einen transparenten Matching-Score (0–100 %) und zeigt beiden Seiten nur relevante Treffer. Jede Aktion — Kontaktaufnahme, Outreach, Weitergabe — erfordert manuelle Freigabe durch den Operator.

---

## Das Problem

Internationale Fachkräfte kämpfen mit:
- Unübersichtlichen Stellenportalen ohne Relevanz-Filter
- Bewerbungsformularen, die keine Einschätzung über ihre Chancen geben
- Mangelnder Transparenz bei Sprachanforderungen und Einwanderungsvoraussetzungen

Arbeitgeber mit internationalem Personalbedarf kämpfen mit:
- Hunderten irrelevanter Bewerbungen von unpassenden Kandidaten
- Aufwändiger manueller Vorauswahl
- Fehlenden strukturierten Daten (Sprachlevel, Erfahrung) für direkten Vergleich

---

## Die Lösung

CorridorWork löst das **strukturierte Mismatch-Problem**:

1. **Kandidaten** geben ihr Profil einmal an — Branche, Jahre Erfahrung, Deutschlevel (A1–C2), Englischlevel, bevorzugte Zielländer
2. **Arbeitgeber** definieren klare Anforderungen — kein Formularchaos, keine vagen Stellenanzeigen
3. **Das System** berechnet einen transparenten Score mit sichtbarem Breakdown: Warum passt jemand? Warum nicht?
4. **Der Operator** behält volle Kontrolle — keine automatischen Kontaktaufnahmen, kein Bulk-Send, alles mit JA/NEIN/SPÄTER

---

## Zielgruppen

### Kandidaten
- Internationale Fachkräfte mit DE/EN-Kenntnissen, die nach Europa oder international arbeiten wollen
- Branchen: IT/Software, Pflege, Bau/Handwerk, Logistik, Gastronomie
- Typische Korridore: Marokko→Deutschland, Indien→UK, Philippinen→Australien, Türkei→Deutschland

### Arbeitgeber (Primäre Zahlkunden)
- KMUs mit internationalem Fachkräftebedarf (20–500 MA)
- Pflegeheime, IT-Unternehmen, Handwerksbetriebe
- Personalvermittler für internationale Talente
- Unternehmen mit aktiver Visa-Sponsoring-Bereitschaft

---

## Kernfunktionen (live, produktiv)

| Funktion | Status | Beschreibung |
|---|---|---|
| Kandidaten-Registrierung | ✅ Live | E-Mail + Passwort, sofort nutzbar |
| Kandidaten-Profil | ✅ Live | Branche, Erfahrung, Sprachen, Zielland |
| CV-Upload | ✅ Live | PDF/DOC/DOCX, privater Storage, RLS-geschützt |
| Arbeitgeber-Registrierung | ✅ Live | Firmenprofil in Minuten angelegt |
| Job-Erstellung | ✅ Live | Anforderungen strukturiert definieren |
| Matching-Score | ✅ Live | 0–100 %, transparenter Breakdown |
| Kandidaten-Dashboard | ✅ Live | Eigene Matches sortiert nach Score |
| Arbeitgeber-Dashboard | ✅ Live | Alle Jobs, Matches, KPIs |
| Bewerbungs-Flow | ✅ Live | Kandidat bewirbt sich → Admin freigegebener → Arbeitgeber sieht CV |
| Admin-Panel | ✅ Live | Vollständiges Operator-Cockpit |
| Outreach-Templates | ✅ Live | Personalisierte E-Mail/WhatsApp/LinkedIn-Texte |
| Approval-Queue | ✅ Live | Jede Aktion benötigt manuelle Freigabe |
| Legal (Impressum, DSGVO, AGB) | ✅ Live | Vollständig vorhanden |

---

## Demo-Ablauf in 5 Minuten

### Vorbereitung (1 Min)
- Browser öffnen: https://corridorwork.com
- Demo-Tab 1: Kandidaten-Ansicht (Incognito)
- Demo-Tab 2: Arbeitgeber-Ansicht (Normal)
- Demo-Tab 3: Admin-Ansicht (Normal, eingeloggt)

### Schritt 1 — Startseite zeigen (30 Sek)
Öffne https://corridorwork.com — zeige die Headline "Cross-border Hiring. Fully Controlled." und den Aufbau (Für Kandidaten / Für Arbeitgeber / Über uns). Betone: **kein Fake-Logo, keine erfundene Kundenzahl**, ehrliches MVP.

### Schritt 2 — Kandidaten-Seite (30 Sek)
Navigiere zu `/for-candidates`. Zeige die 3 Schritte (Profil, Matching, Matches). Betone: dauerhaft kostenlos für Kandidaten, kein Lebenslauf-Upload erzwungen, Matching per Klick.

### Schritt 3 — Arbeitgeber-Seite (30 Sek)
Navigiere zu `/for-employers`. Zeige den Ablauf (Firmenprofil → Job → Kandidaten-Matches). Zeige den Pricing-Preview (Free/Starter/Growth/Enterprise). Betone: MVP-Phase → aktuell kostenlos.

### Schritt 4 — Live-Matching zeigen (2 Min)
1. Navigiere zu `/candidate/dashboard` (Demo-Kandidat eingeloggt)
2. Zeige das Profil: Branche, Erfahrung, Sprachlevel
3. Klicke "Matching starten"
4. Zeige die Ergebnisse: Job-Titel, Unternehmen, Score 0–100 %, Breakdown
5. Erkläre: "Das sind echte Daten. Kein Mock."

### Schritt 5 — Admin/Operator-Panel (1 Min)
1. Zeige `/admin` → CEO-Dashboard mit KPIs
2. Zeige `/admin/operator` → Approval-Queue
3. Betone: "Kein E-Mail wird ohne mein JA gesendet."

---

## Warum das Produkt verkaufsfähig ist

### Technisch
- **Vollständig live** — keine Mock-Daten in der Hauptfunktion
- **Echter Auth-Flow** — Registrierung, Login, Passwort-Reset produktiv
- **RLS-geprüft** — Kandidaten sehen nur eigene Daten (6/6 Tests bestanden)
- **Security-auditiert** — RLS-Fix commited, kein offenes Sicherheitsrisiko
- **840/840 Tests** — alle grün
- **EU-Datenspeicherung** — Supabase Frankfurt (eu-central-1), DSGVO-konform
- **Rechtstexte vorhanden** — Impressum, Datenschutz, AGB vollständig

### Geschäftlich
- **Klares Monetarisierungsmodell** — Arbeitgeber zahlen (Free/Starter/Growth/Enterprise)
- **Kostenlos für Kandidaten** — struktureller Anreiz für Kandidaten-Wachstum
- **Approval-basiert** — macht das Produkt defensiv verkaufbar ("keine unkontrollierten Massen-E-Mails")
- **Nische** — kein direkter Wettbewerb mit LinkedIn/Indeed (strukturiertes Cross-border statt Masse)
- **Skalierbar** — Supabase/Vercel skalieren automatisch

---

## Was bewusst manuell / approval-basiert bleibt

Diese Entscheidungen sind **kein Bug, sondern Feature-Design**:

| Was | Warum manuell |
|---|---|
| Jede Outreach-E-Mail | Schutz vor Spam, rechtliche Sicherheit, Operator-Kontrolle |
| Bewerbungsfreigabe (CV-Sichtbarkeit) | Kandidat hat Kontrolle, Arbeitgeber sieht nur freigegebene CVs |
| Kandidaten-Kontaktdaten | Nur nach expliziter Freigabe sichtbar |
| Pilot-Outreach | Nur nach Admin-Bestätigung — kein Bulk-Send |

---

## Was produktiv funktioniert vs. was in Planung ist

### Produktiv (heute testbar)
- Registrierung und Login beider Rollen
- Strukturierte Profile (Kandidaten + Arbeitgeber)
- Job-Erstellung mit definierten Anforderungen
- Regelbasiertes Matching mit Score-Breakdown
- CV-Upload mit privatem Storage
- Bewerbungs-Flow mit Admin-Freigabe
- Admin-Operator-Panel mit Approval-Queue
- Legal-Seiten (Impressum, DSGVO, AGB)

### In Planung / nicht aktiv
- **Stripe-Zahlungen** — Infrastruktur bereit, Aktivierung steht aus
- **KI-gestütztes Matching** — regelbasiert jetzt, KI-Upgrade geplant
- **Automatischer E-Mail-Versand** — Provider (`resend`) konfiguriert, Aktivierung steht aus
- **Direkter Kandidaten-Kontakt** — aktuell nur über Admin-Freigabe
- **Team-Zugänge** — ein Arbeitgeber-Account pro Firma jetzt
- **API-Zugang** — nicht öffentlich

---

## Nächste Monetarisierungsschritte

| Schritt | Aufwand | Umsatzpotenzial |
|---|---|---|
| 1. Erste 3–5 Pilotarbeitgeber gewinnen (kostenlos) | 1–2 Wochen | Testimonials, erste Matches |
| 2. Stripe-Integration aktivieren | 1–3 Tage | Starter: 49 €/Mo / Arbeitgeber |
| 3. E-Mail-Provider aktivieren (Resend) | 1 Tag | Automatisierte Benachrichtigungen |
| 4. KI-Matching-Upgrade | 2–4 Wochen | Growth-Plan-Differenzierungsmerkmal |
| 5. Outreach-Kampagne für Kandidaten | laufend | Kandidaten-Pool aufbauen |

---

## Ehrlicher Hinweis (MVP-Phase)

CorridorWork ist ein funktionsfähiges MVP. Das bedeutet:

- Die Kernfunktionen funktionieren produktiv
- Die Benutzerzahlen sind gering (Pilot-Phase)
- Keine verifizierten Umsatzzahlen (Zahlungen noch nicht aktiv)
- Kein bewährtes KI-Modell (regelbasiertes Matching)
- Keine Referenzkunden oder öffentliche Fallstudien

Das ist kein Versteckspiel — es ist ein ehrliches MVP, das die Kernhypothese (strukturiertes Cross-border Matching) live testet.
