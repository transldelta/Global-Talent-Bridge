-- Migration: Migration Intelligence Engine
-- Branch: feature/migration-intelligence-engine
-- Date: 2026-06-04

CREATE TABLE IF NOT EXISTS public.migration_intelligence (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id             uuid REFERENCES public.migration_corridors(id) ON DELETE CASCADE,
  source_country          text,
  target_country          text,
  sector                  text,
  visa_complexity         integer NOT NULL DEFAULT 50 CHECK (visa_complexity BETWEEN 0 AND 100),
  recognition_complexity  integer NOT NULL DEFAULT 50 CHECK (recognition_complexity BETWEEN 0 AND 100),
  language_complexity     integer NOT NULL DEFAULT 50 CHECK (language_complexity BETWEEN 0 AND 100),
  document_complexity     integer NOT NULL DEFAULT 50 CHECK (document_complexity BETWEEN 0 AND 100),
  estimated_success_score integer NOT NULL DEFAULT 50 CHECK (estimated_success_score BETWEEN 0 AND 100),
  risk_level              text NOT NULL DEFAULT 'medium'
                          CHECK (risk_level IN ('low','medium','high','critical')),
  required_documents      jsonb,
  language_requirements   jsonb,
  recognition_steps       jsonb,
  visa_pathways           jsonb,
  recommended_next_steps  jsonb,
  disclaimer              text,
  status                  text NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft','reviewed','approved','outdated')),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS migration_intelligence_corridor_idx  ON public.migration_intelligence(corridor_id);
CREATE INDEX IF NOT EXISTS migration_intelligence_risk_idx      ON public.migration_intelligence(risk_level);
CREATE INDEX IF NOT EXISTS migration_intelligence_status_idx    ON public.migration_intelligence(status);

ALTER TABLE public.migration_intelligence ENABLE ROW LEVEL SECURITY;
-- No public policies — admin only via service_role client
