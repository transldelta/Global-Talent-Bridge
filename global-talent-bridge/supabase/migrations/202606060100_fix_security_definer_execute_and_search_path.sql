-- 202606060100_fix_security_definer_execute_and_search_path.sql
--
-- Security Fix: SECURITY DEFINER functions + search_path
--
-- Problem 1: Trigger functions with SECURITY DEFINER are callable
--            by anon/authenticated via /rest/v1/rpc/<name>
--            → REVOKE EXECUTE from anon, authenticated
--            (Triggers still fire normally — EXECUTE is not required
--             for the trigger mechanism itself)
--
-- Problem 2: Several SECURITY DEFINER functions lack SET search_path
--            → add SET search_path = '' to prevent search_path injection
--
-- Problem 3: Non-SECURITY-DEFINER updated_at functions also lack
--            SET search_path → fix to clear advisor WARNs
--
-- Idempotent: CREATE OR REPLACE is idempotent;
--             REVOKE is idempotent (no error if grant was not present)

-- ── 1. handle_new_user ───────────────────────────────────────
-- Already has SET search_path TO 'public', just revoke direct REST access
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- ── 2. handle_outreach_targets_updated_at ────────────────────
REVOKE EXECUTE ON FUNCTION public.handle_outreach_targets_updated_at() FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_outreach_targets_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── 3. set_agent_suggestions_updated_at ──────────────────────
REVOKE EXECUTE ON FUNCTION public.set_agent_suggestions_updated_at() FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_agent_suggestions_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── 4. get_rls_status ────────────────────────────────────────
-- Admin-only function — not callable by regular users
REVOKE EXECUTE ON FUNCTION public.get_rls_status() FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_rls_status()
  RETURNS TABLE(table_name text, rls_enabled boolean)
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = ''
AS $$
  SELECT c.relname::TEXT AS table_name, c.relrowsecurity AS rls_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname IN (
      'profiles','candidates','employers','jobs','matches',
      'onboarding_progress','system_logs','agent_departments',
      'agent_registry','agent_tasks','agent_reports','business_metrics'
    )
  ORDER BY c.relname;
$$;

-- ── 5. Non-SECURITY DEFINER updated_at functions ─────────────
-- Not SECURITY DEFINER → lower risk, but add search_path to clear WARNs

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_sales_leads_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_application_requests_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_interview_requests_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_contact_release_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
