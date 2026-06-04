import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

// ── Seed-Kennung (idempotent: nur wenn source = 'pilot_seed_v1') ──────────────
const SEED_SOURCE = 'pilot_seed_v1'

// ── 5 Pilot-Arbeitgeber (je 1 pro Korridor) ──────────────────────────────────
const PILOT_EMPLOYERS = [
  {
    company_name:    'NorthStar Tech Canada',
    country:         'Canada',
    industry:        'IT/Software',
    contact_name:    'James Richardson',
    contact_email:   null,
    contact_phone:   null,
    status:          'identified',
    interest_level:  'unknown',
    next_step:       'Telefonkontakt aufnehmen — Bedarf an IT-Fachkräften aus Indien klären',
    next_follow_up_at: new Date(Date.now() + 3 * 86400_000).toISOString(), // +3 Tage
    notes:           'Korridor: Indien → Kanada (IT). Pilotdaten — kein echter Kontakt.',
    source:          SEED_SOURCE,
  },
  {
    company_name:    'NHS London Royal Trust',
    country:         'United Kingdom',
    industry:        'Healthcare/Nursing',
    contact_name:    'Dr. Sarah Thornton',
    contact_email:   null,
    contact_phone:   null,
    status:          'identified',
    interest_level:  'medium',
    next_step:       'Demo-Termin anfragen — Nursing-Matches aus Indien zeigen',
    next_follow_up_at: new Date(Date.now() + 5 * 86400_000).toISOString(),
    notes:           'Korridor: Indien → UK (Pflege). NHS-Trust mit hohem Personalbedarf. Pilotdaten.',
    source:          SEED_SOURCE,
  },
  {
    company_name:    'Pflege Plus GmbH Karlsruhe',
    country:         'Deutschland',
    industry:        'Altenpflege',
    contact_name:    'Maria Hoffmann',
    contact_email:   null,
    contact_phone:   null,
    status:          'contacted_manual',
    interest_level:  'high',
    next_step:       'Demo-Präsentation vorbereiten — marokkanische Pflegekräfte vorstellen',
    next_follow_up_at: new Date(Date.now() + 2 * 86400_000).toISOString(),
    notes:           'Korridor: Marokko → Deutschland (Pflege). Hat aktiv Interesse signalisiert. Pilotdaten.',
    source:          SEED_SOURCE,
  },
  {
    company_name:    'Berlin Digital Solutions GmbH',
    country:         'Deutschland',
    industry:        'IT/Software',
    contact_name:    'Tobias Schreiber',
    contact_email:   null,
    contact_phone:   null,
    status:          'interested',
    interest_level:  'very_high',
    next_step:       'Demo für türkische IT-Kandidaten vorbereiten — nächste Woche',
    next_follow_up_at: new Date(Date.now() + 1 * 86400_000).toISOString(),
    notes:           'Korridor: Türkei → Deutschland (IT). Demo-Termin steht kurz bevor. Pilotdaten.',
    source:          SEED_SOURCE,
  },
  {
    company_name:    'Sydney CareFirst Services',
    country:         'Australia',
    industry:        'Aged Care',
    contact_name:    'Helen O\'Brien',
    contact_email:   null,
    contact_phone:   null,
    status:          'identified',
    interest_level:  'low',
    next_step:       'Erstgespräch führen — Bedarf an philippinischen Pflegekräften eruieren',
    next_follow_up_at: new Date(Date.now() + 7 * 86400_000).toISOString(),
    notes:           'Korridor: Philippinen → Australien (Pflege). Noch kein konkretes Interesse. Pilotdaten.',
    source:          SEED_SOURCE,
  },
]

// ── 20 Pilot-Kandidaten (4 pro Korridor) ─────────────────────────────────────
const PILOT_CANDIDATES = [
  // Korridor 1: Indien → Kanada (IT) — 4 Kandidaten
  {
    full_name: 'Arjun Sharma', origin_country: 'India', target_country: 'Canada',
    profession: 'Software Engineer', language: 'Englisch', language_level: 'C1',
    status: 'identified', quality_score: 88,
    source: SEED_SOURCE,
    notes: 'Korridor: Indien → Kanada (IT). 5 Jahre React/Node.js. Pilotdaten.',
  },
  {
    full_name: 'Priya Patel', origin_country: 'India', target_country: 'Canada',
    profession: 'Data Scientist', language: 'Englisch', language_level: 'B2',
    status: 'identified', quality_score: 82,
    source: SEED_SOURCE,
    notes: 'Korridor: Indien → Kanada (IT). Machine Learning, Python. Pilotdaten.',
  },
  {
    full_name: 'Rahul Gupta', origin_country: 'India', target_country: 'Canada',
    profession: 'DevOps Engineer', language: 'Englisch', language_level: 'B2',
    status: 'contacted', quality_score: 76,
    source: SEED_SOURCE,
    notes: 'Korridor: Indien → Kanada (IT). AWS/Kubernetes-Erfahrung. Pilotdaten.',
  },
  {
    full_name: 'Sneha Nair', origin_country: 'India', target_country: 'Canada',
    profession: 'Frontend Developer', language: 'Englisch', language_level: 'C1',
    status: 'identified', quality_score: 71,
    source: SEED_SOURCE,
    notes: 'Korridor: Indien → Kanada (IT). Vue.js / TypeScript. Pilotdaten.',
  },

  // Korridor 2: Indien → UK (Pflege) — 4 Kandidaten
  {
    full_name: 'Kavya Reddy', origin_country: 'India', target_country: 'United Kingdom',
    profession: 'Registered Nurse', language: 'Englisch', language_level: 'C1',
    status: 'identified', quality_score: 91,
    source: SEED_SOURCE,
    notes: 'Korridor: Indien → UK (Pflege). 6 Jahre Krankenhauspflege. NMC-Registrierung offen. Pilotdaten.',
  },
  {
    full_name: 'Vikram Singh', origin_country: 'India', target_country: 'United Kingdom',
    profession: 'ICU Nurse', language: 'Englisch', language_level: 'B2',
    status: 'contacted', quality_score: 85,
    source: SEED_SOURCE,
    notes: 'Korridor: Indien → UK (Pflege). Intensivstation 4 Jahre. Pilotdaten.',
  },
  {
    full_name: 'Meera Krishnan', origin_country: 'India', target_country: 'United Kingdom',
    profession: 'Nursing Manager', language: 'Englisch', language_level: 'C2',
    status: 'interested', quality_score: 79,
    source: SEED_SOURCE,
    notes: 'Korridor: Indien → UK (Pflege). Führungserfahrung 3 Jahre. Pilotdaten.',
  },
  {
    full_name: 'Ananya Das', origin_country: 'India', target_country: 'United Kingdom',
    profession: 'General Nurse', language: 'Englisch', language_level: 'B1',
    status: 'identified', quality_score: 62,
    source: SEED_SOURCE,
    notes: 'Korridor: Indien → UK (Pflege). 2 Jahre Erfahrung. Sprachkurs läuft. Pilotdaten.',
  },

  // Korridor 3: Marokko → Deutschland (Pflege) — 4 Kandidaten
  {
    full_name: 'Fatima El Amin', origin_country: 'Morocco', target_country: 'Deutschland',
    profession: 'Pflegefachkraft', language: 'Deutsch', language_level: 'B2',
    status: 'interested', quality_score: 86,
    source: SEED_SOURCE,
    notes: 'Korridor: Marokko → Deutschland (Pflege). B2 Deutsch, 5 Jahre Erfahrung. Demo-bereit. Pilotdaten.',
  },
  {
    full_name: 'Omar Benali', origin_country: 'Morocco', target_country: 'Deutschland',
    profession: 'Krankenpfleger', language: 'Deutsch', language_level: 'B1',
    status: 'identified', quality_score: 74,
    source: SEED_SOURCE,
    notes: 'Korridor: Marokko → Deutschland (Pflege). B1 Deutsch, Sprachkurs B2 geplant. Pilotdaten.',
  },
  {
    full_name: 'Samira Haddad', origin_country: 'Morocco', target_country: 'Deutschland',
    profession: 'Altenpflegerin', language: 'Deutsch', language_level: 'B2',
    status: 'contacted', quality_score: 80,
    source: SEED_SOURCE,
    notes: 'Korridor: Marokko → Deutschland (Pflege). Altenpflege 4 Jahre. Pilotdaten.',
  },
  {
    full_name: 'Karim Mansouri', origin_country: 'Morocco', target_country: 'Deutschland',
    profession: 'Pflegehelfer', language: 'Deutsch', language_level: 'A2',
    status: 'identified', quality_score: 48,
    source: SEED_SOURCE,
    notes: 'Korridor: Marokko → Deutschland (Pflege). A2 Deutsch — für Demo noch nicht geeignet. Pilotdaten.',
  },

  // Korridor 4: Türkei → Deutschland (IT) — 4 Kandidaten
  {
    full_name: 'Emre Yilmaz', origin_country: 'Turkey', target_country: 'Deutschland',
    profession: 'Software Developer', language: 'Deutsch', language_level: 'C1',
    status: 'interested', quality_score: 90,
    source: SEED_SOURCE,
    notes: 'Korridor: Türkei → Deutschland (IT). C1 Deutsch, Java/Spring Boot. Sofort verfügbar. Pilotdaten.',
  },
  {
    full_name: 'Ayse Kaya', origin_country: 'Turkey', target_country: 'Deutschland',
    profession: 'UI/UX Designer', language: 'Deutsch', language_level: 'B2',
    status: 'contacted', quality_score: 83,
    source: SEED_SOURCE,
    notes: 'Korridor: Türkei → Deutschland (IT). Figma, Design Systems. Pilotdaten.',
  },
  {
    full_name: 'Berk Ozturk', origin_country: 'Turkey', target_country: 'Deutschland',
    profession: 'Backend Engineer', language: 'Deutsch', language_level: 'B1',
    status: 'identified', quality_score: 72,
    source: SEED_SOURCE,
    notes: 'Korridor: Türkei → Deutschland (IT). Python/FastAPI, B1 Deutsch. Pilotdaten.',
  },
  {
    full_name: 'Elif Demir', origin_country: 'Turkey', target_country: 'Deutschland',
    profession: 'Product Manager', language: 'Deutsch', language_level: 'B2',
    status: 'identified', quality_score: 77,
    source: SEED_SOURCE,
    notes: 'Korridor: Türkei → Deutschland (IT). 4 Jahre PM-Erfahrung, agile. Pilotdaten.',
  },

  // Korridor 5: Philippinen → Australien (Pflege) — 4 Kandidaten
  {
    full_name: 'Maria Santos', origin_country: 'Philippines', target_country: 'Australia',
    profession: 'Aged Care Worker', language: 'Englisch', language_level: 'B2',
    status: 'identified', quality_score: 84,
    source: SEED_SOURCE,
    notes: 'Korridor: Philippinen → Australien (Pflege). 5 Jahre Altenpflege. AHPRA-Registrierung ausstehend. Pilotdaten.',
  },
  {
    full_name: 'Jose Reyes', origin_country: 'Philippines', target_country: 'Australia',
    profession: 'Community Care Assistant', language: 'Englisch', language_level: 'B1',
    status: 'identified', quality_score: 67,
    source: SEED_SOURCE,
    notes: 'Korridor: Philippinen → Australien (Pflege). Community Nursing 3 Jahre. Pilotdaten.',
  },
  {
    full_name: 'Ana Garcia', origin_country: 'Philippines', target_country: 'Australia',
    profession: 'Disability Support Worker', language: 'Englisch', language_level: 'C1',
    status: 'contacted', quality_score: 78,
    source: SEED_SOURCE,
    notes: 'Korridor: Philippinen → Australien (Pflege). NDIS-Erfahrung. Pilotdaten.',
  },
  {
    full_name: 'Carlos Dela Cruz', origin_country: 'Philippines', target_country: 'Australia',
    profession: 'Personal Care Worker', language: 'Englisch', language_level: 'B2',
    status: 'identified', quality_score: 73,
    source: SEED_SOURCE,
    notes: 'Korridor: Philippinen → Australien (Pflege). 4 Jahre häusliche Pflege. Pilotdaten.',
  },
]

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST() {
  // Admin-Check
  try {
    await getCurrentAdminUser()
  } catch {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  const supabase = createAdminClient()

  // Idempotenz-Check: Bereits geseedet?
  const { count: existingEmploers } = await supabase
    .from('pilot_employers')
    .select('*', { count: 'exact', head: true })
    .eq('source', SEED_SOURCE)

  const { count: existingCandidates } = await supabase
    .from('pilot_candidates')
    .select('*', { count: 'exact', head: true })
    .eq('source', SEED_SOURCE)

  if ((existingEmploers ?? 0) > 0 || (existingCandidates ?? 0) > 0) {
    return NextResponse.json({
      success: true,
      alreadySeeded: true,
      employers: existingEmploers,
      candidates: existingCandidates,
      message: 'Pilotdaten bereits vorhanden. Keine Duplikate erzeugt.',
    })
  }

  // Arbeitgeber einfügen
  const { data: empData, error: empError } = await supabase
    .from('pilot_employers')
    .insert(PILOT_EMPLOYERS)
    .select('id')

  if (empError) {
    console.error('[seed-data] Arbeitgeber-Fehler:', empError.message)
    return NextResponse.json({ error: `Arbeitgeber-Insert fehlgeschlagen: ${empError.message}` }, { status: 500 })
  }

  // Kandidaten einfügen
  const { data: candData, error: candError } = await supabase
    .from('pilot_candidates')
    .insert(PILOT_CANDIDATES)
    .select('id')

  if (candError) {
    console.error('[seed-data] Kandidaten-Fehler:', candError.message)
    return NextResponse.json({ error: `Kandidaten-Insert fehlgeschlagen: ${candError.message}` }, { status: 500 })
  }

  // System-Log
  await supabase.from('system_logs').insert({
    type: 'pilot_seed',
    message: `Pilotdaten angelegt: ${empData?.length ?? 0} Arbeitgeber, ${candData?.length ?? 0} Kandidaten`,
    metadata: {
      seed_source: SEED_SOURCE,
      employers_created: empData?.length ?? 0,
      candidates_created: candData?.length ?? 0,
      corridors: [
        'India → Canada (IT)',
        'India → UK (Nursing)',
        'Morocco → Germany (Care)',
        'Turkey → Germany (IT)',
        'Philippines → Australia (Care)',
      ],
    },
  }).then(() => {})

  return NextResponse.json({
    success: true,
    alreadySeeded: false,
    employers: empData?.length ?? 0,
    candidates: candData?.length ?? 0,
    message: `Pilotdaten erfolgreich angelegt: ${empData?.length ?? 0} Arbeitgeber, ${candData?.length ?? 0} Kandidaten.`,
  })
}
