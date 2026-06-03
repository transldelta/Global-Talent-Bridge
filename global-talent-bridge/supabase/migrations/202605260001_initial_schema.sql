-- ============================================================
-- Global Talent Bridge — Initiales Schema
-- Migration: 202605260001_initial_schema.sql
-- Phase 1 MVP
-- ============================================================

-- ============================================================
-- HILFSFUNKTION: updated_at automatisch setzen
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- TABELLE: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       VARCHAR(20) NOT NULL DEFAULT 'candidate'
               CONSTRAINT profiles_role_check CHECK (role IN ('candidate', 'employer')),
  full_name  VARCHAR(200),
  country    VARCHAR(100),
  city       VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABELLE: candidates
-- ============================================================
CREATE TABLE IF NOT EXISTS public.candidates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  sector              VARCHAR(100),
  years_experience    INTEGER DEFAULT 0,
  german_level        VARCHAR(5),
  english_level       VARCHAR(5),
  skills              JSONB DEFAULT '[]'::jsonb,
  preferred_countries JSONB DEFAULT '[]'::jsonb,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);

-- ============================================================
-- TABELLE: employers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.employers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name  VARCHAR(200) NOT NULL,
  country       VARCHAR(100),
  sector        VARCHAR(100),
  contact_email VARCHAR(200),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employers_user_id ON public.employers(user_id);

-- ============================================================
-- TABELLE: jobs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id         UUID REFERENCES public.employers(id) ON DELETE CASCADE NOT NULL,
  title               VARCHAR(200) NOT NULL,
  sector              VARCHAR(100),
  required_experience INTEGER DEFAULT 0,
  required_german     VARCHAR(5),
  required_english    VARCHAR(5),
  salary_range        VARCHAR(100),
  city                VARCHAR(100),
  country             VARCHAR(100),
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active   ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_sector       ON public.jobs(sector);

-- ============================================================
-- TABELLE: matches
-- ============================================================
CREATE TABLE IF NOT EXISTS public.matches (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  job_id       UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  score        INTEGER DEFAULT 0,
  status       VARCHAR(20) DEFAULT 'pending',
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(candidate_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_candidate_id ON public.matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_matches_job_id       ON public.matches(job_id);

-- ============================================================
-- TABELLE: onboarding_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  step1_complete  BOOLEAN DEFAULT false,
  step2_complete  BOOLEAN DEFAULT false,
  step3_complete  BOOLEAN DEFAULT false,
  step4_complete  BOOLEAN DEFAULT false,
  step5_complete  BOOLEAN DEFAULT false,
  completed_at    TIMESTAMP WITH TIME ZONE
);

-- ============================================================
-- TABELLE: system_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.system_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(100),
  status     VARCHAR(20),
  message    TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- TABELLE: agent_departments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agent_departments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_key VARCHAR(100) UNIQUE NOT NULL,
  name           VARCHAR(200) NOT NULL,
  description    TEXT,
  mission        TEXT,
  active         BOOLEAN DEFAULT false,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_departments_key ON public.agent_departments(department_key);

-- ============================================================
-- TABELLE: agent_registry
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agent_registry (
  agent_name              VARCHAR(100) PRIMARY KEY,
  department_key          VARCHAR(100) REFERENCES public.agent_departments(department_key),
  description             TEXT,
  responsibility          TEXT,
  active                  BOOLEAN DEFAULT false,
  risk_level              VARCHAR(20) DEFAULT 'low',
  requires_human_approval BOOLEAN DEFAULT true,
  created_at              TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_registry_department ON public.agent_registry(department_key);

-- ============================================================
-- TABELLE: agent_tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agent_tasks (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_key          VARCHAR(100),
  agent_name              VARCHAR(100),
  title                   VARCHAR(200),
  description             TEXT,
  status                  VARCHAR(30) DEFAULT 'planned',
  priority                INTEGER DEFAULT 0,
  requires_human_approval BOOLEAN DEFAULT true,
  created_at              TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at              TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_department ON public.agent_tasks(department_key);

CREATE TRIGGER trg_agent_tasks_updated_at
  BEFORE UPDATE ON public.agent_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABELLE: agent_reports
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agent_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_key  VARCHAR(100),
  agent_name      VARCHAR(100),
  report_type     VARCHAR(100),
  title           VARCHAR(200),
  summary         TEXT,
  recommendations TEXT,
  risk_notes      TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_reports_department ON public.agent_reports(department_key);

-- ============================================================
-- TABELLE: business_metrics
-- ============================================================
CREATE TABLE IF NOT EXISTS public.business_metrics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key   VARCHAR(100),
  metric_name  VARCHAR(200),
  metric_value NUMERIC DEFAULT 0,
  period       VARCHAR(50),
  source       VARCHAR(100),
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_metrics_key ON public.business_metrics(metric_key);

-- ============================================================
-- TRIGGER: handle_new_user
-- Erstellt automatisch profiles + onboarding_progress bei Registrierung
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role      VARCHAR(20);
  v_full_name VARCHAR(200);
BEGIN
  -- Role aus Metadaten lesen, nur 'candidate' oder 'employer' erlaubt
  v_role := COALESCE(
    NULLIF(
      CASE WHEN NEW.raw_user_meta_data->>'role' IN ('candidate', 'employer')
           THEN NEW.raw_user_meta_data->>'role'
           ELSE NULL
      END,
      NULL
    ),
    'candidate'
  );

  v_full_name := NEW.raw_user_meta_data->>'full_name';

  -- Profil anlegen
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (NEW.id, v_role, v_full_name)
  ON CONFLICT (id) DO NOTHING;

  -- Onboarding-Fortschritt anlegen
  INSERT INTO public.onboarding_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger für neue User
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS AKTIVIEREN
-- ============================================================
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_departments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_registry     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_reports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_metrics   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: profiles
-- ============================================================
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- RLS POLICIES: candidates
-- ============================================================
CREATE POLICY "candidates_select_own"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "candidates_insert_own"
  ON public.candidates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "candidates_update_own"
  ON public.candidates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "candidates_delete_own"
  ON public.candidates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES: employers
-- ============================================================
CREATE POLICY "employers_select_own"
  ON public.employers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "employers_insert_own"
  ON public.employers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "employers_update_own"
  ON public.employers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "employers_delete_own"
  ON public.employers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES: jobs
-- ============================================================
-- Alle authentifizierten Nutzer dürfen aktive Jobs lesen
CREATE POLICY "jobs_select_active"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Arbeitgeber dürfen ihre eigenen Jobs verwalten (aktiv + inaktiv)
CREATE POLICY "jobs_select_own"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM public.employers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "jobs_insert_own"
  ON public.jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id IN (
      SELECT id FROM public.employers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "jobs_update_own"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM public.employers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "jobs_delete_own"
  ON public.jobs FOR DELETE
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM public.employers WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: matches
-- Kandidaten sehen ihre Matches, Arbeitgeber sehen Matches zu ihren Jobs
-- Kein Client-Insert/Update/Delete — nur Service Role
-- ============================================================
CREATE POLICY "matches_select_as_candidate"
  ON public.matches FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM public.candidates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "matches_select_as_employer"
  ON public.matches FOR SELECT
  TO authenticated
  USING (
    job_id IN (
      SELECT j.id FROM public.jobs j
      JOIN public.employers e ON j.employer_id = e.id
      WHERE e.user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: onboarding_progress
-- ============================================================
CREATE POLICY "onboarding_select_own"
  ON public.onboarding_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "onboarding_insert_own"
  ON public.onboarding_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "onboarding_update_own"
  ON public.onboarding_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- system_logs, agent_*, business_metrics:
-- Kein direkter Client-Zugriff — nur Service Role / Admin-API
-- (Keine Policy = kein Zugriff für authenticated/anon)
-- ============================================================

-- ============================================================
-- RLS STATUS FUNKTION
-- Gibt RLS-Status aller Kerntabellen zurück
-- Nur service_role darf diese Funktion aufrufen
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_rls_status()
RETURNS TABLE(table_name TEXT, rls_enabled BOOLEAN)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    c.relname::TEXT AS table_name,
    c.relrowsecurity AS rls_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname IN (
      'profiles',
      'candidates',
      'employers',
      'jobs',
      'matches',
      'onboarding_progress',
      'system_logs',
      'agent_departments',
      'agent_registry',
      'agent_tasks',
      'agent_reports',
      'business_metrics'
    )
  ORDER BY c.relname;
$$;

-- Rechte entziehen und nur service_role erlauben
REVOKE EXECUTE ON FUNCTION public.get_rls_status() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_rls_status() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_rls_status() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_rls_status() TO service_role;

-- ============================================================
-- STANDARD-ABTEILUNGEN EINTRAGEN (alle inactive)
-- ============================================================
INSERT INTO public.agent_departments (department_key, name, description, mission, active)
VALUES
  (
    'ceo_command',
    'CEO / Erzdirigent',
    'Zentrale Steuerungseinheit des Systems',
    'Kontrolliert alle Abteilungen, priorisiert Aufgaben, prüft Risiken, fordert Berichte an und entscheidet pragmatisch nach Wachstum, Stabilität und Umsatz.',
    false
  ),
  (
    'strategy_vision_department',
    'Strategie & Vision',
    'Strategische Planung und Marktanalyse',
    'Marktchancen erkennen, Prioritäten setzen, langfristige Richtung bestimmen.',
    false
  ),
  (
    'product_tech_department',
    'Produkt & Technik',
    'Technische Entwicklung und Produktqualität',
    'Plattform warten, Fehler prüfen, technische Qualität sichern, Features vorbereiten.',
    false
  ),
  (
    'data_matching_department',
    'Daten & Matching',
    'Datenqualität und Matching-Algorithmen',
    'Kandidaten, Jobs und Matching-Qualität verbessern.',
    false
  ),
  (
    'marketing_growth_department',
    'Marketing & Wachstum',
    'Reichweite, SEO und Content-Strategie',
    'SEO, Content, Landingpages, Kampagnen und Reichweite vorbereiten.',
    false
  ),
  (
    'sales_employer_department',
    'Sales & Arbeitgebergewinnung',
    'B2B-Vertrieb und Arbeitgebergewinnung',
    'Arbeitgeber-Zielgruppen finden, B2B-Angebote vorbereiten, zahlende Kunden gewinnen.',
    false
  ),
  (
    'partnerships_department',
    'Partnerschaften & Netzwerke',
    'Strategische Partnerschaften und Netzwerke',
    'Sprachschulen, Bildungsträger, Jobportale, Agenturen und internationale Partner vorbereiten.',
    false
  ),
  (
    'revenue_monetization_department',
    'Umsatz & Monetarisierung',
    'Preismodelle, Pakete und Umsatzoptimierung',
    'Preise, Pakete, Premium-Angebote, Provisionen und Umsatzmodelle optimieren.',
    false
  ),
  (
    'customer_success_department',
    'Kundenservice & Support',
    'Kandidaten- und Arbeitgebersupport',
    'Kandidaten und Arbeitgeber unterstützen, Probleme erkennen, Zufriedenheit verbessern.',
    false
  ),
  (
    'legal_risk_department',
    'Recht, DSGVO & Risiko',
    'Rechtliche Compliance und Risikomanagement',
    'Datenschutz, Impressum, AGB, Risiken, Freigaben und rechtliche Grenzen überwachen.',
    false
  ),
  (
    'quality_control_department',
    'Qualität & Kontrolle',
    'Qualitätssicherung und Systemüberwachung',
    'Ergebnisse prüfen, Agentenfehler erkennen, Datenqualität und Matchingqualität überwachen.',
    false
  ),
  (
    'finance_cost_department',
    'Finanzen & Kostenkontrolle',
    'Finanzplanung und Kostenkontrolle',
    'Kosten niedrig halten, Free-Tier überwachen, Gewinnlogik und Wirtschaftlichkeit prüfen.',
    false
  ),
  (
    'automation_orchestration_department',
    'Automatisierung & Agenten-Orchestrierung',
    'Agenten-Koordination und Automatisierung',
    'Spätere Agenten steuern, Aufgaben verteilen, Deadlocks vermeiden und Systemabläufe koordinieren.',
    false
  )
ON CONFLICT (department_key) DO NOTHING;
