-- ============================================================
-- Sprint F — System Incidents Table
-- Tracks operational incidents, errors, and system health events
-- ============================================================

CREATE TABLE IF NOT EXISTS public.system_incidents (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type            TEXT NOT NULL CHECK (type IN ('error', 'warning', 'info', 'critical')),
  severity        TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'closed')),
  title           TEXT NOT NULL,
  description     TEXT,
  source          TEXT,         -- e.g. 'agent', 'api', 'db', 'build', 'cron'
  source_detail   TEXT,         -- e.g. agent name, route path
  resolved_at     TIMESTAMPTZ,
  resolved_by     TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Index for status queries (open incidents dashboard)
CREATE INDEX idx_system_incidents_status ON public.system_incidents(status);
CREATE INDEX idx_system_incidents_severity ON public.system_incidents(severity);
CREATE INDEX idx_system_incidents_created_at ON public.system_incidents(created_at DESC);

-- RLS
ALTER TABLE public.system_incidents ENABLE ROW LEVEL SECURITY;

-- Admin-only: service_role bypasses RLS
CREATE POLICY "Admin read system_incidents"
  ON public.system_incidents FOR SELECT
  TO authenticated
  USING (false); -- blocked for regular users; admin uses service_role

-- ============================================================
-- Seed: Example incidents for demonstration (status = resolved)
-- ============================================================
INSERT INTO public.system_incidents (type, severity, status, title, description, source, source_detail)
VALUES
  ('info',    'low',    'resolved', 'Agent orchestrator started',          'First agent run completed successfully after deployment',   'agent',  'agent-orchestrator'),
  ('warning', 'medium', 'resolved', 'Migration Intelligence: 0 rows updated', 'Agent ran but no corridors met update threshold (expected on fresh DB)', 'agent', 'migration-intelligence-agent'),
  ('info',    'low',    'closed',   'Revenue forecast baseline created',   '3 forecast scenarios computed and stored in revenue_events', 'agent',  'revenue-intelligence-agent')
ON CONFLICT DO NOTHING;
