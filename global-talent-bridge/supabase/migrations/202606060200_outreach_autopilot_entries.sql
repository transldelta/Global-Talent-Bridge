-- 202606060200_outreach_autopilot_entries.sql
-- Outreach Autopilot Entries — Compliance-First Outreach-Tracking
--
-- Sicherheits-Invarianten:
-- - no_email_sent DEFAULT true, NOT NULL (nie false in Phase 1)
-- - no_auto_outreach DEFAULT true, NOT NULL (nie false in Phase 1)
-- - REVOKE ALL on anon + authenticated + PUBLIC
-- - GRANT nur service_role (createAdminClient)
-- - RLS enabled
--
-- Idempotent: CREATE TABLE IF NOT EXISTS, CREATE INDEX IF NOT EXISTS

-- ── Tabelle ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.outreach_autopilot_entries (
  id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Firmendaten (manuell eingegeben)
  company_name            TEXT        NOT NULL,
  website                 TEXT,
  sector                  TEXT,
  contact_person          TEXT,
  contact_method          TEXT        NOT NULL DEFAULT 'personal'
                            CHECK (contact_method IN ('whatsapp','linkedin','email','personal')),
  contact_address         TEXT,
  notes                   TEXT,

  -- Agenten-Ergebnisse
  fit_score               INTEGER     NOT NULL DEFAULT 0
                            CHECK (fit_score >= 0 AND fit_score <= 100),
  fit_score_breakdown     JSONB       NOT NULL DEFAULT '{}',
  compliance_status       TEXT        NOT NULL DEFAULT 'needs_review'
                            CHECK (compliance_status IN ('safe','needs_review','blocked')),
  spam_risk               TEXT        NOT NULL DEFAULT 'medium'
                            CHECK (spam_risk IN ('low','medium','high')),
  compliance_warnings     JSONB       NOT NULL DEFAULT '[]',

  -- Generierter Text
  draft_message           TEXT,
  draft_subject           TEXT,
  recommended_channel     TEXT        CHECK (recommended_channel IN ('whatsapp','linkedin','email','personal')),

  -- Workflow-Status
  status                  TEXT        NOT NULL DEFAULT 'draft'
                            CHECK (status IN (
                              'draft',
                              'needs_review',
                              'approved_for_manual_copy',
                              'contacted_manual',
                              'blocked'
                            )),

  -- Sicherheits-Flags — IMMER true in Phase 1, NOT NULL
  no_email_sent           BOOLEAN     NOT NULL DEFAULT true,
  no_auto_outreach        BOOLEAN     NOT NULL DEFAULT true,

  -- Audit
  created_by              TEXT        NOT NULL,
  analysis_result         JSONB       DEFAULT '{}',
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

-- ── Indizes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_autopilot_entries_status
  ON public.outreach_autopilot_entries (status);

CREATE INDEX IF NOT EXISTS idx_autopilot_entries_fit_score
  ON public.outreach_autopilot_entries (fit_score);

CREATE INDEX IF NOT EXISTS idx_autopilot_entries_created_by
  ON public.outreach_autopilot_entries (created_by);

CREATE INDEX IF NOT EXISTS idx_autopilot_entries_created_at
  ON public.outreach_autopilot_entries (created_at DESC);

-- ── Trigger: updated_at ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_autopilot_entries_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_autopilot_entries_updated_at
  ON public.outreach_autopilot_entries;

CREATE TRIGGER trg_autopilot_entries_updated_at
  BEFORE UPDATE ON public.outreach_autopilot_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_autopilot_entries_updated_at();

-- ── Constraint: no_email_sent darf nie false werden ──────────────────────────

ALTER TABLE public.outreach_autopilot_entries
  ADD CONSTRAINT chk_no_email_sent_always_true
  CHECK (no_email_sent = true);

ALTER TABLE public.outreach_autopilot_entries
  ADD CONSTRAINT chk_no_auto_outreach_always_true
  CHECK (no_auto_outreach = true);

-- ── RLS ───────────────────────────────────────────────────────────────────────

ALTER TABLE public.outreach_autopilot_entries ENABLE ROW LEVEL SECURITY;

-- Erst alles von PUBLIC und Rollen entziehen
REVOKE ALL ON public.outreach_autopilot_entries FROM PUBLIC;
REVOKE ALL ON public.outreach_autopilot_entries FROM anon;
REVOKE ALL ON public.outreach_autopilot_entries FROM authenticated;

-- Deny-all Policies als zweite Schutzschicht
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'outreach_autopilot_entries'
      AND policyname = 'deny_all_anon'
  ) THEN
    CREATE POLICY deny_all_anon
      ON public.outreach_autopilot_entries
      AS RESTRICTIVE
      TO anon
      USING (false);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'outreach_autopilot_entries'
      AND policyname = 'deny_all_authenticated'
  ) THEN
    CREATE POLICY deny_all_authenticated
      ON public.outreach_autopilot_entries
      AS RESTRICTIVE
      TO authenticated
      USING (false);
  END IF;
END;
$$;

-- service_role hat BYPASSRLS — kein explizites GRANT nötig
-- Aber zur Klarheit:
GRANT ALL ON public.outreach_autopilot_entries TO service_role;

-- REVOKE EXECUTE auf Trigger-Funktion von PUBLIC
REVOKE EXECUTE ON FUNCTION public.set_autopilot_entries_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_autopilot_entries_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION public.set_autopilot_entries_updated_at() FROM authenticated;
GRANT  EXECUTE ON FUNCTION public.set_autopilot_entries_updated_at() TO service_role;
