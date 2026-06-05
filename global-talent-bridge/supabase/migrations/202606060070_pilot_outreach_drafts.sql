-- 202606060070_pilot_outreach_drafts.sql
-- Approval-basierte Outreach-Drafts für den Operator-Autopiloten.
-- Idempotent: CREATE TABLE IF NOT EXISTS, Indizes IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS public.pilot_outreach_drafts (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pilot_employer_id   UUID        NOT NULL
                        REFERENCES public.pilot_employers(id) ON DELETE CASCADE,
  channel             TEXT        NOT NULL
                        CHECK (channel IN ('email','linkedin','whatsapp','phone')),
  recipient_name      TEXT,
  recipient_email     TEXT,
  recipient_phone     TEXT,
  subject             TEXT,
  body                TEXT        NOT NULL,
  status              TEXT        NOT NULL DEFAULT 'generated'
                        CHECK (status IN (
                          'generated','needs_review','approved','rejected',
                          'sent','failed','ready_for_manual_platform_send','postponed'
                        )),
  approval_required   BOOLEAN     NOT NULL DEFAULT true,
  approved_at         TIMESTAMPTZ,
  approved_by         TEXT,
  sent_at             TIMESTAMPTZ,
  provider            TEXT        NOT NULL DEFAULT 'none'
                        CHECK (provider IN (
                          'none','resend','smtp',
                          'manual_platform','whatsapp_business_api','linkedin_manual'
                        )),
  risk_level          TEXT        NOT NULL DEFAULT 'low'
                        CHECK (risk_level IN ('low','medium','high')),
  risk_notes          TEXT,
  next_follow_up_at   TIMESTAMPTZ,
  error_message       TEXT,
  demo                BOOLEAN     NOT NULL DEFAULT false,
  metadata            JSONB       DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pod_employer
  ON public.pilot_outreach_drafts (pilot_employer_id);
CREATE INDEX IF NOT EXISTS idx_pod_status
  ON public.pilot_outreach_drafts (status);
CREATE INDEX IF NOT EXISTS idx_pod_channel
  ON public.pilot_outreach_drafts (channel);
CREATE INDEX IF NOT EXISTS idx_pod_follow_up
  ON public.pilot_outreach_drafts (next_follow_up_at)
  WHERE next_follow_up_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pod_created
  ON public.pilot_outreach_drafts (created_at DESC);

ALTER TABLE public.pilot_outreach_drafts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'pilot_outreach_drafts'
      AND policyname = 'Admin full access to pilot_outreach_drafts'
  ) THEN
    CREATE POLICY "Admin full access to pilot_outreach_drafts"
      ON public.pilot_outreach_drafts
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
