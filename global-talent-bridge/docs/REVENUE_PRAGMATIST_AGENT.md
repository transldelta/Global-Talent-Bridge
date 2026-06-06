# Revenue Pragmatist Agent

**Seite:** `/admin/revenue-pragmatist`  
**Department:** Revenue Pragmatist  
**Autonomy Level:** A1 (automatisch analysieren)

---

## Konzept

Der Revenue Pragmatist bewertet alle möglichen Einnahmequellen nach 4 Kriterien:

| Kriterium | Gewichtung |
|---|---|
| incomePotential | Wie viel kann damit verdient werden? (0–100) |
| legalRisk | Wie hoch ist das rechtliche Risiko? (0–100) |
| effort | Wie viel Aufwand ist nötig? (0–100) |
| timeToRevenue | Wie schnell fließt Geld? |

**Prioritätsscore:** `max(0, incomePotential - legalRisk - floor(effort / 2))`

---

## Revenue-Streams

### ✅ Sofort testbar (test_now)

| Stream | Potenzial | Risiko | Aufwand | Zeitrahmen |
|---|---|---|---|---|
| 💳 Arbeitgeber-SaaS-Abo | 85% | 15% | 40% | 2–4 Wochen |
| 📊 Premium Employer Dashboard | 75% | 10% | 35% | 3–6 Wochen |
| ⭐ Featured Employer / Job Promotion | 60% | 10% | 20% | 1–3 Wochen |

### ⏳ Später testen (test_later)

| Stream | Potenzial | Risiko | Zeitrahmen |
|---|---|---|---|
| 📑 Market Intelligence Reports | 65% | 12% | 4–8 Wochen |
| 🏷️ White-Label für Agenturen | 90% | 25% | 8–16 Wochen |

### 🚫 Blockiert — Rechtsprüfung erforderlich

| Stream | Potenzial | Risiko | Blocker |
|---|---|---|---|
| 🎯 B2B Success Fee | 95% | 65% | AÜG § 1, SGB III § 296 |
| ✈️ Kandidaten-Services | 70% | 80% | RDG, SGB III, Visa-Verbot |

---

## Warum Success Fee blockiert ist

Der B2B Success Fee (Provision nach Einstellung) ist das attraktivste Modell, aber:

- **AÜG § 1 ff.** — Arbeitnehmerüberlassungsgesetz: mögliche Erlaubnispflicht
- **SGB III § 296** — Arbeitsvermittlung gegen Entgelt erfordert ggf. BA-Genehmigung
- **Vertragsform** — ohne klaren Haftungsausschluss besteht Schadenersatzrisiko

**Nächste Schritte:** Anwalt konsultieren, Rechtsgutachten einholen, dann reaktivieren.

---

## Warum Kandidaten-Services blockiert sind

- **RDG** (Rechtsdienstleistungsgesetz) — Visa-Beratung ohne Zulassung verboten
- **SGB III** — Kandidatengebühren bei Vermittlung riskant
- **Irreführungsverbot § 5 UWG** — Keine Visa-Garantien möglich

---

## Empfohlene Reihenfolge

1. **Featured Employer** — niedrigster Aufwand, schnellster Test
2. **Arbeitgeber-SaaS** — skalierbarste Option nach Pilot
3. **Premium Dashboard** — Upsell nach SaaS-Etablierung
4. **Market Intelligence** — nach Datenbasis aufgebaut
5. **White-Label** — erst nach Produktreife (5+ erfolgreiche Matches)
6. **Success Fee** — erst nach anwaltlicher Freigabe
7. **Kandidaten-Services** — erst nach umfassender Rechtsprüfung

---

## Aktivierung von Stripe

Stripe (Zahlungsabwicklung) kann erst aktiviert werden, wenn:
- [ ] AGB für Arbeitgeber vorhanden (anwaltlich geprüft)
- [ ] Datenschutzerklärung aktualisiert (Zahlungsdaten)
- [ ] Mindestens 1 Pilot-Arbeitgeber bereit zu zahlen
- [ ] Steuerliche Registrierung / VAT-Nummer vorhanden
