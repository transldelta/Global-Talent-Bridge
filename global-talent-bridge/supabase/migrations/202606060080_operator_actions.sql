-- 202606060080_operator_actions.sql
-- Operator Action Queue für JA/NEIN/SPÄTER-Entscheidungen.
-- Idempotent: CREATE TABLE IF NOT EXISTS, Indizes IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS public.operator_actions (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type           TEXT        NOT NULL
                          CHECK (action_type IN (
                            'approve_outreach','reject_outreach','postpone_outreach',
                            'send_email','mark_manual_platform_ready',
                            'create_follow_up','update_employer_status',
                            'research_contact','review_risk'
                          )),
  entity_type           TEXT,
  entity_id             UUID,
  title                 TEXT        NOT NULL,
  description           TEXT,
  priority              TEXT        NOT NULL DEFAULT 'medium'
                          CHECK (priority IN ('critical','high','medium','low')),
  status                TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN (
                            'pending','approved','rejected','done','postponed','blocked'
                          )),
  recommended_decision  TEXT,
  risk_level            TEXT        NOT NULL DEFAULT 'low'
                          CHECK (risk_level IN ('low','medium','high')),
  due_at                TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oa_status
  ON public.operator_actions (status);
CREATE INDEX IF NOT EXISTS idx_oa_priority
  ON public.operator_actions (priority);
CREATE INDEX IF NOT EXISTS idx_oa_action_type
  ON public.operator_actions (action_type);
CREATE INDEX IF NOT EXISTS idx_oa_due_at
  ON public.operator_actions (due_at)
  WHERE due_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_oa_entity
  ON public.operator_actions (entity_type, entity_id)
  WHERE entity_id IS NOT NULL;

ALTER TABLE public.operator_actions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'operator_actions'
      AND policyname = 'Admin full access to operator_actions'
  ) THEN
    CREATE POLICY "Admin full access to operator_actions"
      ON public.operator_actions
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
