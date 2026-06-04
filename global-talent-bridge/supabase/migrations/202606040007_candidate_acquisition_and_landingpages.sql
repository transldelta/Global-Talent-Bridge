-- Migration: Candidate Acquisition Sources + Landingpage Recommendations
-- Branch: feature/global-candidate-acquisition
-- Date: 2026-06-04
-- Applied via Supabase MCP (project: qjxojvxhsoicldccfmkq)

-- ─────────────────────────────────────────────────────────────────────────────
-- Table: candidate_acquisition_sources
-- Purpose: Globale Kandidatenquellen mit Scoring für Priorisierung
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.candidate_acquisition_sources (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name           text NOT NULL,
  country               text,
  language              text,
  source_type           text CHECK (source_type IN (
    'university','language_school','community','job_board',
    'association','recruiter','training_center','migration_forum'
  )),
  profession_focus      text,
  estimated_audience    integer NOT NULL DEFAULT 0,
  quality_score         integer NOT NULL DEFAULT 50 CHECK (quality_score BETWEEN 0 AND 100),
  opportunity_score     integer NOT NULL DEFAULT 50 CHECK (opportunity_score BETWEEN 0 AND 100),
  priority_level        text CHECK (priority_level IN ('low','medium','high','critical')),
  acquisition_difficulty integer NOT NULL DEFAULT 50 CHECK (acquisition_difficulty BETWEEN 0 AND 100),
  notes                 text,
  status                text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','research')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_acquisition_sources ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role (admin) can access

-- ─────────────────────────────────────────────────────────────────────────────
-- Table: landingpage_recommendations
-- Purpose: Empfohlene Landing Pages je Korridor für Kandidaten-Akquisition
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.landingpage_recommendations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id  uuid REFERENCES public.migration_corridors(id) ON DELETE SET NULL,
  title        text NOT NULL,
  language     text NOT NULL DEFAULT 'en',
  slug         text NOT NULL UNIQUE,
  target_audience text,
  priority     text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  notes        text,
  status       text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','in_progress','live','paused')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.landingpage_recommendations ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role (admin) can access
