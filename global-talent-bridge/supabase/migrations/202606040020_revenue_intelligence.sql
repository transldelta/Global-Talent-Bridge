-- ══════════════════════════════════════════════════════════════════════════════
-- Migration: Revenue Intelligence Engine
-- Branch: feature/revenue-intelligence-engine
-- Date: 2026-06-04
-- ══════════════════════════════════════════════════════════════════════════════

-- ── revenue_plans ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.revenue_plans (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_type  text NOT NULL CHECK (audience_type IN ('employer','candidate','partner')),
  plan_name      text NOT NULL,
  monthly_price  numeric(10,2) NOT NULL DEFAULT 0,
  yearly_price   numeric(10,2) NOT NULL DEFAULT 0,
  features       jsonb NOT NULL DEFAULT '[]'::jsonb,
  active         boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS revenue_plans_audience_idx ON public.revenue_plans(audience_type);
CREATE INDEX IF NOT EXISTS revenue_plans_active_idx   ON public.revenue_plans(active);

ALTER TABLE public.revenue_plans ENABLE ROW LEVEL SECURITY;
-- Admin-only via service_role — no public policies

-- ── revenue_events ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.revenue_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  text NOT NULL CHECK (event_type IN ('subscription','placement_fee','premium_upgrade','referral_commission','forecast')),
  amount      numeric(12,2) NOT NULL DEFAULT 0,
  currency    text NOT NULL DEFAULT 'EUR',
  source      text,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS revenue_events_type_idx ON public.revenue_events(event_type);
CREATE INDEX IF NOT EXISTS revenue_events_date_idx ON public.revenue_events(created_at DESC);

ALTER TABLE public.revenue_events ENABLE ROW LEVEL SECURITY;
-- Admin-only via service_role — no public policies
