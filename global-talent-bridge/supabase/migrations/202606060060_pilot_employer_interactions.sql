-- Migration: pilot_employer_interactions
-- Idempotent (IF NOT EXISTS).
-- Speichert manuelle Interaktionsprotokolle für Pilot-Arbeitgeber.
--
-- WICHTIG: response_type Werte hier sind Interaction-Flags,
-- NICHT die pilot_employers.status DB-Werte.
-- Der bestehende CHECK-Constraint auf pilot_employers.status
-- bleibt UNBERÜHRT.

CREATE TABLE IF NOT EXISTS public.pilot_employer_interactions (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pilot_employer_id   UUID NOT NULL
                        REFERENCES public.pilot_employers(id) ON DELETE CASCADE,
  interaction_type    TEXT NOT NULL
                        CHECK (interaction_type IN (
                          'email_manual',
                          'whatsapp_manual',
                          'linkedin_manual',
                          'call',
                          'demo',
                          'note'
                        )),
  response_type       TEXT NOT NULL DEFAULT 'no_response'
                        CHECK (response_type IN (
                          'no_response',
                          'positive',
                          'neutral',
                          'objection',
                          'rejected',
                          'demo_requested',
                          'pilot_requested'
                        )),
  summary             TEXT,
  next_action         TEXT,
  next_follow_up_at   TIMESTAMPTZ,
  created_by          TEXT,           -- Admin-E-Mail optional
  demo                BOOLEAN NOT NULL DEFAULT false,
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_pilot_interactions_employer
  ON public.pilot_employer_interactions(pilot_employer_id);

CREATE INDEX IF NOT EXISTS idx_pilot_interactions_type
  ON public.pilot_employer_interactions(interaction_type);

CREATE INDEX IF NOT EXISTS idx_pilot_interactions_response
  ON public.pilot_employer_interactions(response_type);

CREATE INDEX IF NOT EXISTS idx_pilot_interactions_created
  ON public.pilot_employer_interactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pilot_interactions_follow_up
  ON public.pilot_employer_interactions(next_follow_up_at)
  WHERE next_follow_up_at IS NOT NULL;

-- RLS: Admin only (matching existing pattern from pilot_launch_engine migration)
ALTER TABLE public.pilot_employer_interactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'pilot_employer_interactions'
      AND policyname = 'Admin only pilot_employer_interactions'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admin only pilot_employer_interactions"
        ON public.pilot_employer_interactions
        FOR ALL
        USING (
          auth.jwt() ->> 'email' = ANY(
            string_to_array(current_setting('app.admin_emails', true), ',')
          )
        )
    $policy$;
  END IF;
END
$$;
