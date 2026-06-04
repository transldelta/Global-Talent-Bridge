-- ============================================================
-- Global Market Intelligence Tables
-- Migration: 202606040005_global_market_intelligence.sql
-- Already applied to Supabase via MCP — local reference copy
-- ============================================================

-- TABLE: migration_corridors
CREATE TABLE IF NOT EXISTS public.migration_corridors (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_country           TEXT NOT NULL,
  target_country           TEXT NOT NULL,
  sector                   TEXT NOT NULL,
  language_requirement     TEXT,
  visa_pathway             TEXT,
  recognition_requirement  TEXT,
  estimated_supply_score   INTEGER NOT NULL DEFAULT 0,
  estimated_demand_score   INTEGER NOT NULL DEFAULT 0,
  opportunity_score        INTEGER NOT NULL DEFAULT 0,
  priority_level           TEXT NOT NULL DEFAULT 'medium'
                           CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
  notes                    TEXT,
  status                   TEXT NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active', 'paused', 'research', 'deprecated')),
  created_at               TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at               TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.migration_corridors ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_corridors_source    ON public.migration_corridors(source_country);
CREATE INDEX IF NOT EXISTS idx_corridors_target    ON public.migration_corridors(target_country);
CREATE INDEX IF NOT EXISTS idx_corridors_sector    ON public.migration_corridors(sector);
CREATE INDEX IF NOT EXISTS idx_corridors_priority  ON public.migration_corridors(priority_level);
CREATE INDEX IF NOT EXISTS idx_corridors_status    ON public.migration_corridors(status);
CREATE INDEX IF NOT EXISTS idx_corridors_oppscore  ON public.migration_corridors(opportunity_score DESC);

CREATE TRIGGER trg_migration_corridors_updated_at
  BEFORE UPDATE ON public.migration_corridors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TABLE: candidate_sources
CREATE TABLE IF NOT EXISTS public.candidate_sources (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name         TEXT NOT NULL,
  source_country      TEXT,
  language            TEXT,
  source_type         TEXT
                      CHECK (source_type IN (
                        'university', 'language_school', 'community',
                        'job_board', 'association', 'social_network',
                        'referral', 'recruiter'
                      )),
  estimated_audience  INTEGER DEFAULT 0,
  priority_score      INTEGER DEFAULT 0,
  notes               TEXT,
  status              TEXT DEFAULT 'active',
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.candidate_sources ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_candidate_sources_country  ON public.candidate_sources(source_country);
CREATE INDEX IF NOT EXISTS idx_candidate_sources_type     ON public.candidate_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_candidate_sources_priority ON public.candidate_sources(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidate_sources_status   ON public.candidate_sources(status);

CREATE TRIGGER trg_candidate_sources_updated_at
  BEFORE UPDATE ON public.candidate_sources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
