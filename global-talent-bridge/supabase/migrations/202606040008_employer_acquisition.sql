-- Migration: Employer Acquisition Sources + Outreach Recommendations
-- Branch: feature/global-employer-acquisition
-- Date: 2026-06-04
-- Applied via Supabase MCP (project: qjxojvxhsoicldccfmkq)

-- ─────────────────────────────────────────────────────────────────────────────
-- Table: employer_acquisition_sources
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employer_acquisition_sources (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name           text NOT NULL,
  country               text,
  sector                text,
  source_type           text CHECK (source_type IN (
    'hospital_group','care_home_group','it_company','logistics_company',
    'industrial_company','recruiter','staffing_agency','employer_association'
  )),
  estimated_employers   integer NOT NULL DEFAULT 0,
  quality_score         integer NOT NULL DEFAULT 50 CHECK (quality_score BETWEEN 0 AND 100),
  opportunity_score     integer NOT NULL DEFAULT 50 CHECK (opportunity_score BETWEEN 0 AND 100),
  acquisition_difficulty integer NOT NULL DEFAULT 50 CHECK (acquisition_difficulty BETWEEN 0 AND 100),
  priority_level        text CHECK (priority_level IN ('low','medium','high','critical')),
  notes                 text,
  status                text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','research')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employer_acquisition_sources ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role (admin) can access

-- ─────────────────────────────────────────────────────────────────────────────
-- Table: employer_outreach_recommendations
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employer_outreach_recommendations (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id               uuid REFERENCES public.employer_acquisition_sources(id) ON DELETE CASCADE,
  recommended_message_type text,
  recommended_channel     text,
  priority_level          text CHECK (priority_level IN ('low','medium','high','critical')),
  notes                   text,
  status                  text NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft','ready_for_review','approved','paused')),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employer_outreach_recommendations ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role (admin) can access
