-- Migration: Corridor Intelligence + Campaign Recommendations
-- Branch: feature/corridor-intelligence
-- Date: 2026-06-04
-- Applied via Supabase MCP (project: qjxojvxhsoicldccfmkq)

-- ─────────────────────────────────────────────
-- Table: corridor_intelligence
-- Purpose: Tiefes Korridor-Wissen: Berufe, Sprachen, Visa, Anerkennung, Scoring
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.corridor_intelligence (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id                 uuid NOT NULL REFERENCES public.migration_corridors(id) ON DELETE CASCADE,

  -- JSONB Knowledge Fields
  top_professions             jsonb NOT NULL DEFAULT '[]',
  language_requirements       jsonb NOT NULL DEFAULT '{}',
  visa_pathways               jsonb NOT NULL DEFAULT '[]',
  recognition_requirements    jsonb NOT NULL DEFAULT '{}',
  estimated_salary_range      jsonb NOT NULL DEFAULT '{}',

  -- Scores
  migration_difficulty        integer NOT NULL DEFAULT 50 CHECK (migration_difficulty BETWEEN 0 AND 100),
  demand_level                integer NOT NULL DEFAULT 50 CHECK (demand_level BETWEEN 0 AND 100),
  opportunity_score           integer NOT NULL DEFAULT 50 CHECK (opportunity_score BETWEEN 0 AND 100),

  -- Recommended Actions
  recommended_channels        jsonb NOT NULL DEFAULT '[]',
  recommended_landingpage_slug text,

  notes                       text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),

  UNIQUE(corridor_id)
);

ALTER TABLE public.corridor_intelligence ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role (admin) can access

-- ─────────────────────────────────────────────
-- Table: campaign_recommendations
-- Purpose: Kampagnen-Empfehlungen je Korridor (nur Planung, kein Auto-Sending)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.campaign_recommendations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id         uuid NOT NULL REFERENCES public.migration_corridors(id) ON DELETE CASCADE,

  target_audience     text,
  language            text,
  recommended_channels jsonb NOT NULL DEFAULT '[]',
  landingpage_slug    text,

  campaign_priority   text NOT NULL DEFAULT 'medium'
                      CHECK (campaign_priority IN ('low','medium','high','critical')),

  estimated_reach     integer,
  notes               text,
  status              text NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','ready_for_review','approved','paused','rejected')),

  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campaign_recommendations ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role (admin) can access
