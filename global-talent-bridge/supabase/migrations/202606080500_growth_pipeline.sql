-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 202606080500_growth_pipeline.sql
-- Global Growth Pipeline: growth_targets + growth_messages
--
-- Safety Constraints:
--   no_auto_send     BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_auto_send = TRUE)
--   no_job_guarantee BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_job_guarantee = TRUE)
--   no_visa_guarantee BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_visa_guarantee = TRUE)
--
-- RLS: activ on both tables
--   Public/anon: NO read, NO write
--   Authenticated users: NO access (growth data is admin-only)
--   Service role only: full access (used by admin API routes)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. growth_targets ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.growth_targets (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Target classification
  target_kind       TEXT        NOT NULL DEFAULT 'employer'
                    CHECK (target_kind IN ('employer', 'partner', 'candidate_source')),

  -- Contact data
  company_name      TEXT        NOT NULL DEFAULT '' CHECK (length(company_name) <= 300),
  contact_email     TEXT        NOT NULL DEFAULT '',
  website_url       TEXT        NOT NULL DEFAULT '',
  contact_page_url  TEXT        NOT NULL DEFAULT '',

  -- Geography
  country           TEXT        NOT NULL DEFAULT '',
  source_market     TEXT        NOT NULL DEFAULT '',
  destination_market TEXT       NOT NULL DEFAULT '',

  -- Classification
  sector            TEXT        NOT NULL DEFAULT '',
  route             TEXT        NOT NULL DEFAULT '',
  corridor          TEXT        NOT NULL DEFAULT '',
  message_type      TEXT        NOT NULL DEFAULT '',

  -- Scoring
  fit_score         INTEGER     NOT NULL DEFAULT 0 CHECK (fit_score >= 0 AND fit_score <= 100),
  risk_level        TEXT        NOT NULL DEFAULT 'unknown'
                    CHECK (risk_level IN ('low', 'medium', 'high', 'unknown')),

  -- Workflow status
  status            TEXT        NOT NULL DEFAULT 'target_profile'
                    CHECK (status IN (
                      'target_profile',
                      'real_contact_needed',
                      'draft_prepared',
                      'needs_review',
                      'screenshot_review',
                      'approved_to_send_manually',
                      'sent_manually',
                      'replied',
                      'rejected'
                    )),

  notes             TEXT        NOT NULL DEFAULT '',

  -- Safety invariants — these can never be set to FALSE
  no_auto_send      BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_auto_send = TRUE),
  no_job_guarantee  BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_job_guarantee = TRUE),
  no_visa_guarantee BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_visa_guarantee = TRUE),

  -- Audit
  created_by        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: keep updated_at current
CREATE OR REPLACE FUNCTION public.set_growth_targets_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_growth_targets_updated_at ON public.growth_targets;
CREATE TRIGGER trg_growth_targets_updated_at
  BEFORE UPDATE ON public.growth_targets
  FOR EACH ROW EXECUTE FUNCTION public.set_growth_targets_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_growth_targets_status       ON public.growth_targets(status);
CREATE INDEX IF NOT EXISTS idx_growth_targets_target_kind  ON public.growth_targets(target_kind);
CREATE INDEX IF NOT EXISTS idx_growth_targets_country      ON public.growth_targets(country);
CREATE INDEX IF NOT EXISTS idx_growth_targets_created_at   ON public.growth_targets(created_at DESC);

-- RLS
ALTER TABLE public.growth_targets ENABLE ROW LEVEL SECURITY;

-- No policy for anon or authenticated users — service role only
-- (Admin API routes use createAdminClient() with service role key)
DO $$
BEGIN
  -- Drop any previously created permissive policies to be safe
  DROP POLICY IF EXISTS "growth_targets_anon_read"  ON public.growth_targets;
  DROP POLICY IF EXISTS "growth_targets_auth_read"  ON public.growth_targets;
  DROP POLICY IF EXISTS "growth_targets_auth_write" ON public.growth_targets;
END $$;

-- ── 2. growth_messages ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.growth_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id   UUID        NOT NULL REFERENCES public.growth_targets(id) ON DELETE CASCADE,

  -- Message content
  channel     TEXT        NOT NULL DEFAULT 'email'
              CHECK (channel IN ('email', 'linkedin', 'whatsapp', 'contact_form')),
  subject     TEXT        NOT NULL DEFAULT '',
  body        TEXT        NOT NULL DEFAULT '',

  -- Workflow status
  status      TEXT        NOT NULL DEFAULT 'prepared'
              CHECK (status IN ('prepared', 'reviewed', 'approved', 'sent_manually')),

  -- Safety invariant — this can never be set to FALSE
  no_auto_send BOOLEAN    NOT NULL DEFAULT TRUE CHECK (no_auto_send = TRUE),

  -- Audit
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_growth_messages_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_growth_messages_updated_at ON public.growth_messages;
CREATE TRIGGER trg_growth_messages_updated_at
  BEFORE UPDATE ON public.growth_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_growth_messages_updated_at();

CREATE INDEX IF NOT EXISTS idx_growth_messages_target_id  ON public.growth_messages(target_id);
CREATE INDEX IF NOT EXISTS idx_growth_messages_status     ON public.growth_messages(status);

-- RLS
ALTER TABLE public.growth_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "growth_messages_anon_read"  ON public.growth_messages;
  DROP POLICY IF EXISTS "growth_messages_auth_read"  ON public.growth_messages;
  DROP POLICY IF EXISTS "growth_messages_auth_write" ON public.growth_messages;
END $$;

-- ── 3. Comments ───────────────────────────────────────────────────────────────

COMMENT ON TABLE public.growth_targets  IS 'Global Growth Pipeline targets — admin-only, no public access, RLS active';
COMMENT ON TABLE public.growth_messages IS 'Messages prepared for growth targets — admin-only, no_auto_send enforced at DB level';
COMMENT ON COLUMN public.growth_targets.no_auto_send      IS 'Safety invariant: always TRUE, enforced by CHECK constraint';
COMMENT ON COLUMN public.growth_targets.no_job_guarantee  IS 'Safety invariant: always TRUE, enforced by CHECK constraint';
COMMENT ON COLUMN public.growth_targets.no_visa_guarantee IS 'Safety invariant: always TRUE, enforced by CHECK constraint';
