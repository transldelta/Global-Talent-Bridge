-- ============================================================
-- Growth Engine + Approval Queue Tables
-- Migration: 202606040004_growth_engine_approval_queue.sql
-- Already applied to Supabase via MCP — this file is the local reference copy
-- ============================================================

-- TABLE: internal_growth_agent_runs
CREATE TABLE IF NOT EXISTS public.internal_growth_agent_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at            TIMESTAMPTZ DEFAULT now() NOT NULL,
  run_type          TEXT NOT NULL DEFAULT 'manual'
                    CHECK (run_type IN ('manual', 'scheduled', 'triggered')),
  status            TEXT NOT NULL DEFAULT 'success'
                    CHECK (status IN ('success', 'partial', 'error')),
  leads_analyzed    INTEGER DEFAULT 0,
  drafts_created    INTEGER DEFAULT 0,
  followups_planned INTEGER DEFAULT 0,
  alerts_sent       INTEGER DEFAULT 0,
  summary           TEXT,
  error_message     TEXT,
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.internal_growth_agent_runs ENABLE ROW LEVEL SECURITY;
-- No RLS policy = only service_role can read/write

-- TABLE: outreach_approval_queue
CREATE TABLE IF NOT EXISTS public.outreach_approval_queue (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_agent             TEXT NOT NULL DEFAULT 'growth_agent',
  target_type                  TEXT NOT NULL DEFAULT 'employer_lead'
                               CHECK (target_type IN ('employer_lead', 'candidate_source', 'partner', 'other')),
  target_name                  TEXT NOT NULL,
  target_email                 TEXT,
  target_phone                 TEXT,
  channel                      TEXT NOT NULL DEFAULT 'email'
                               CHECK (channel IN ('email', 'whatsapp', 'manual')),
  message_subject              TEXT,
  message_body                 TEXT NOT NULL,
  status                       TEXT NOT NULL DEFAULT 'pending'
                               CHECK (status IN (
                                 'pending',
                                 'approved',
                                 'rejected',
                                 'sent',
                                 'prepared_for_manual_send',
                                 'remind_later'
                               )),
  risk_level                   TEXT NOT NULL DEFAULT 'low'
                               CHECK (risk_level IN ('low', 'medium', 'high')),
  priority_score               INTEGER DEFAULT 0,
  source_context               JSONB DEFAULT '{}'::jsonb,
  approved_by                  TEXT,
  approved_at                  TIMESTAMPTZ,
  sent_at                      TIMESTAMPTZ,
  rejected_by                  TEXT,
  rejected_at                  TIMESTAMPTZ,
  rejection_reason             TEXT,
  requires_double_confirmation BOOLEAN DEFAULT false,
  double_confirmed             BOOLEAN DEFAULT false,
  remind_later_at              TIMESTAMPTZ,
  notes                        TEXT,
  created_at                   TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at                   TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.outreach_approval_queue ENABLE ROW LEVEL SECURITY;
-- No RLS policy = only service_role can access

CREATE INDEX IF NOT EXISTS idx_approval_queue_status     ON public.outreach_approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_approval_queue_channel    ON public.outreach_approval_queue(channel);
CREATE INDEX IF NOT EXISTS idx_approval_queue_risk       ON public.outreach_approval_queue(risk_level);
CREATE INDEX IF NOT EXISTS idx_approval_queue_created_at ON public.outreach_approval_queue(created_at DESC);

CREATE TRIGGER trg_outreach_approval_queue_updated_at
  BEFORE UPDATE ON public.outreach_approval_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
