-- ============================================================
-- Sprint G — Pilot Launch Engine
-- Tabellen: pilot_employers, pilot_candidates, pilot_campaigns,
--            pilot_tasks, pilot_feedback
-- ============================================================

-- ── 1. pilot_employers ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pilot_employers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name    TEXT NOT NULL,
  country         TEXT NOT NULL,
  industry        TEXT,
  contact_name    TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  status          TEXT NOT NULL DEFAULT 'identified'
                    CHECK (status IN ('identified','contacted_manual','interested','demo_scheduled','onboarding','active_pilot','rejected')),
  interest_level  TEXT NOT NULL DEFAULT 'unknown'
                    CHECK (interest_level IN ('unknown','low','medium','high','very_high')),
  next_step       TEXT,
  next_follow_up_at TIMESTAMPTZ,
  notes           TEXT,
  source          TEXT,           -- e.g. 'linkedin', 'outreach', 'inbound'
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pilot_employers_status ON public.pilot_employers(status);
CREATE INDEX idx_pilot_employers_follow_up ON public.pilot_employers(next_follow_up_at);
CREATE INDEX idx_pilot_employers_country ON public.pilot_employers(country);

ALTER TABLE public.pilot_employers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only pilot_employers"
  ON public.pilot_employers FOR ALL TO authenticated USING (false);

-- ── 2. pilot_candidates ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pilot_candidates (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name       TEXT,
  origin_country  TEXT NOT NULL,
  target_country  TEXT NOT NULL,
  profession      TEXT NOT NULL,
  language        TEXT,
  language_level  TEXT,           -- A1, A2, B1, B2, C1, C2
  status          TEXT NOT NULL DEFAULT 'identified'
                    CHECK (status IN ('identified','contacted','interested','onboarding','active','rejected','placed')),
  quality_score   INTEGER DEFAULT 50 CHECK (quality_score BETWEEN 0 AND 100),
  source          TEXT,           -- e.g. 'facebook_group', 'corridor_lp', 'referral'
  source_detail   TEXT,
  notes           TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pilot_candidates_status ON public.pilot_candidates(status);
CREATE INDEX idx_pilot_candidates_profession ON public.pilot_candidates(profession);

ALTER TABLE public.pilot_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only pilot_candidates"
  ON public.pilot_candidates FOR ALL TO authenticated USING (false);

-- ── 3. pilot_campaigns ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pilot_campaigns (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'employer_outreach'
                    CHECK (type IN ('employer_outreach','candidate_acquisition','corridor_test','full_pilot')),
  status          TEXT NOT NULL DEFAULT 'planned'
                    CHECK (status IN ('planned','active','paused','completed','cancelled')),
  target_country  TEXT,
  target_industry TEXT,
  target_corridor TEXT,           -- e.g. 'Morocco → Germany Nursing'
  start_date      DATE,
  end_date        DATE,
  goal_employers  INTEGER DEFAULT 0,
  goal_candidates INTEGER DEFAULT 0,
  actual_employers INTEGER DEFAULT 0,
  actual_candidates INTEGER DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pilot_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only pilot_campaigns"
  ON public.pilot_campaigns FOR ALL TO authenticated USING (false);

-- ── 4. pilot_tasks ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pilot_tasks (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  type            TEXT NOT NULL DEFAULT 'general'
                    CHECK (type IN ('call','demo_prep','lp_review','source_check','feedback','follow_up','onboarding','general')),
  priority        TEXT NOT NULL DEFAULT 'medium'
                    CHECK (priority IN ('low','medium','high','critical')),
  status          TEXT NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open','in_progress','done','cancelled')),
  related_employer_id UUID REFERENCES public.pilot_employers(id) ON DELETE SET NULL,
  related_candidate_id UUID REFERENCES public.pilot_candidates(id) ON DELETE SET NULL,
  related_campaign_id  UUID REFERENCES public.pilot_campaigns(id) ON DELETE SET NULL,
  due_at          TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  assigned_to     TEXT,
  created_by      TEXT DEFAULT 'agent',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pilot_tasks_status ON public.pilot_tasks(status);
CREATE INDEX idx_pilot_tasks_priority ON public.pilot_tasks(priority);
CREATE INDEX idx_pilot_tasks_due_at ON public.pilot_tasks(due_at);

ALTER TABLE public.pilot_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only pilot_tasks"
  ON public.pilot_tasks FOR ALL TO authenticated USING (false);

-- ── 5. pilot_feedback ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pilot_feedback (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type     TEXT NOT NULL DEFAULT 'employer'
                    CHECK (source_type IN ('employer','candidate','internal')),
  related_employer_id UUID REFERENCES public.pilot_employers(id) ON DELETE SET NULL,
  related_candidate_id UUID REFERENCES public.pilot_candidates(id) ON DELETE SET NULL,
  category        TEXT NOT NULL DEFAULT 'general'
                    CHECK (category IN ('ux','feature_request','bug','process','pricing','matching','general')),
  title           TEXT NOT NULL,
  description     TEXT,
  priority        TEXT NOT NULL DEFAULT 'medium'
                    CHECK (priority IN ('low','medium','high','critical')),
  status          TEXT NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new','acknowledged','in_progress','resolved','wont_fix')),
  impact_score    INTEGER DEFAULT 50 CHECK (impact_score BETWEEN 0 AND 100),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pilot_feedback_priority ON public.pilot_feedback(priority);
CREATE INDEX idx_pilot_feedback_status ON public.pilot_feedback(status);

ALTER TABLE public.pilot_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only pilot_feedback"
  ON public.pilot_feedback FOR ALL TO authenticated USING (false);

-- ── Seed: Demo-Daten für Pilot-Arbeitgeber (Status: identified/interested) ──
INSERT INTO public.pilot_employers
  (company_name, country, industry, contact_name, status, interest_level, next_step, source, notes)
VALUES
  ('Pflege Plus GmbH',         'Deutschland', 'Pflege',      'M. Schmidt',  'interested',        'high',      'Demo-Termin vereinbaren', 'outreach',  'Erster Kontakt via LinkedIn-Outreach'),
  ('MedCare Bayern',           'Deutschland', 'Pflege',      'A. Müller',   'contacted_manual',  'medium',    'Follow-up anrufen',       'outreach',  'Interesse signalisiert, wartet auf Details'),
  ('TechRecruit Berlin',       'Deutschland', 'IT',          'J. Bauer',    'identified',        'unknown',   'Erstkontakt aufnehmen',   'linkedin',  'IT-Fachkräftemangel erkannt'),
  ('Hospitality Group Wien',   'Österreich',  'Gastronomie', 'K. Fischer',  'demo_scheduled',    'very_high', 'Demo durchführen',        'inbound',   'Hat Formular ausgefüllt, sehr interessiert'),
  ('Bau AG Hamburg',           'Deutschland', 'Bau',         'T. Wagner',   'identified',        'low',       'Qualifizieren',           'outreach',  'Großer Baukonzern, potenziell Enterprise')
ON CONFLICT DO NOTHING;

-- ── Seed: Demo-Pilot-Kandidaten ──
INSERT INTO public.pilot_candidates
  (origin_country, target_country, profession, language, language_level, status, quality_score, source, notes)
VALUES
  ('Marokko',    'Deutschland', 'Pflegefachkraft',     'Deutsch', 'B1', 'interested',   85, 'facebook_group', 'Sehr motiviert, sucht Anerkennung'),
  ('Indien',     'Deutschland', 'IT-Entwickler',       'Englisch','C1', 'interested',   90, 'corridor_lp',    'Senior Developer, will nach DE'),
  ('Philippinen','Deutschland', 'Krankenschwester',    'Deutsch', 'A2', 'identified',   70, 'referral',       'Empfehlung durch bestehenden Kandidaten'),
  ('Tunesien',   'Deutschland', 'Elektriker',          'Deutsch', 'B2', 'contacted',    80, 'corridor_lp',    'Meisterbrief vorhanden'),
  ('Brasilien',  'Portugal',    'Software Engineer',   'Portugiesisch','C2','interested',88, 'linkedin',       'Bilingal DE/PT, flexibel')
ON CONFLICT DO NOTHING;

-- ── Seed: Demo-Aufgaben ──
INSERT INTO public.pilot_tasks (title, type, priority, status, created_by)
VALUES
  ('Pflege Plus GmbH Demo vorbereiten',         'demo_prep',    'critical', 'open', 'agent'),
  ('Hospitality Group Wien Demo durchführen',   'demo_prep',    'critical', 'open', 'agent'),
  ('MedCare Bayern anrufen',                    'call',         'high',     'open', 'agent'),
  ('TechRecruit Berlin Erstkontakt',            'call',         'medium',   'open', 'agent'),
  ('Pilot-Kandidaten-Profil vervollständigen',  'source_check', 'medium',   'open', 'agent'),
  ('Landingpage DE-Pflege auf Konversion prüfen', 'lp_review',  'high',     'open', 'agent')
ON CONFLICT DO NOTHING;
