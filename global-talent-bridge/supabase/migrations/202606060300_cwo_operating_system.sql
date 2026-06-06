-- ============================================================
-- CWO Operating System — DB Tables
-- Migration: 202606060300_cwo_operating_system
-- Phase 1: Alle Tabellen mit Safety-Constraints
-- ============================================================

-- ── 1. cwo_agent_tasks ─────────────────────────────────────────────────────
-- Automatisch generierte Aufgaben des CWO-Systems (intern, kein Auto-Outreach)

CREATE TABLE IF NOT EXISTS cwo_agent_tasks (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT        NOT NULL,
  department        TEXT        NOT NULL,
  description       TEXT        NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'planned'
                                CHECK (status IN ('planned', 'in_progress', 'done', 'blocked')),
  priority          TEXT        NOT NULL DEFAULT 'medium'
                                CHECK (priority IN ('high', 'medium', 'low')),
  score             INTEGER     NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  risk_level        TEXT        NOT NULL DEFAULT 'low'
                                CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  compliance_status TEXT        NOT NULL DEFAULT 'safe'
                                CHECK (compliance_status IN ('safe', 'needs_review', 'blocked')),
  recommendation    TEXT        NOT NULL DEFAULT '',
  action_href       TEXT,
  -- Safety constraints (unveränderlich)
  no_email_sent     BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_email_sent = TRUE),
  no_auto_outreach  BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_auto_outreach = TRUE),
  no_scraping       BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_scraping = TRUE),
  -- Audit
  created_by        TEXT        NOT NULL DEFAULT 'cwo_system',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. corridor_opportunities ───────────────────────────────────────────────
-- Analysierte globale Talent-Korridore (kein Scraping, rein intern)

CREATE TABLE IF NOT EXISTS corridor_opportunities (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_key      TEXT        NOT NULL UNIQUE,  -- z.B. 'PH_DE_nursing'
  origin            TEXT        NOT NULL,
  origin_flag       TEXT        NOT NULL,
  destination       TEXT        NOT NULL,
  destination_flag  TEXT        NOT NULL,
  primary_sectors   TEXT[]      NOT NULL DEFAULT '{}',
  score             INTEGER     NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  demand_rationale  TEXT        NOT NULL DEFAULT '',
  legal_readiness   TEXT        NOT NULL DEFAULT '',
  priority          TEXT        NOT NULL DEFAULT 'medium'
                                CHECK (priority IN ('high', 'medium', 'low')),
  compliance_status TEXT        NOT NULL DEFAULT 'safe'
                                CHECK (compliance_status IN ('safe', 'needs_review', 'blocked')),
  -- Safety constraint
  no_scraping       BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_scraping = TRUE),
  -- Audit
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. demand_signals ───────────────────────────────────────────────────────
-- Interne Bewertungssignale (keine externen Daten, kein Scraping)

CREATE TABLE IF NOT EXISTS demand_signals (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_type       TEXT        NOT NULL CHECK (signal_type IN ('sector', 'corridor', 'employer', 'candidate')),
  name              TEXT        NOT NULL,
  score             INTEGER     NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  urgency           INTEGER     CHECK (urgency >= 0 AND urgency <= 100),
  payment_willingness INTEGER   CHECK (payment_willingness >= 0 AND payment_willingness <= 100),
  international_need  INTEGER   CHECK (international_need >= 0 AND international_need <= 100),
  pilot_readiness   INTEGER     CHECK (pilot_readiness >= 0 AND pilot_readiness <= 100),
  risk_score        INTEGER     CHECK (risk_score >= 0 AND risk_score <= 100),
  recommendation    TEXT        NOT NULL DEFAULT '',
  compliance_status TEXT        NOT NULL DEFAULT 'safe'
                                CHECK (compliance_status IN ('safe', 'needs_review', 'blocked')),
  -- Safety
  no_scraping       BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_scraping = TRUE),
  no_auto_outreach  BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_auto_outreach = TRUE),
  -- Audit
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. revenue_opportunities ────────────────────────────────────────────────
-- Bewertete Revenue-Streams (nur interne Empfehlungen, kein Auto-Billing)

CREATE TABLE IF NOT EXISTS revenue_opportunities (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id         TEXT        NOT NULL UNIQUE,  -- z.B. 'employer_saas'
  name              TEXT        NOT NULL,
  stream_type       TEXT        NOT NULL,
  income_potential  INTEGER     NOT NULL CHECK (income_potential >= 0 AND income_potential <= 100),
  legal_risk        INTEGER     NOT NULL CHECK (legal_risk >= 0 AND legal_risk <= 100),
  effort            INTEGER     NOT NULL CHECK (effort >= 0 AND effort <= 100),
  time_to_revenue   TEXT        NOT NULL DEFAULT '',
  recommendation    TEXT        NOT NULL CHECK (recommendation IN ('test_now', 'test_later', 'blocked_legal_review')),
  rationale         TEXT        NOT NULL DEFAULT '',
  compliance_status TEXT        NOT NULL DEFAULT 'safe'
                                CHECK (compliance_status IN ('safe', 'needs_review', 'blocked')),
  -- Safety (kein Auto-Billing, keine Zahlungsauslösung)
  no_auto_billing   BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_auto_billing = TRUE),
  no_email_sent     BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_email_sent = TRUE),
  -- Audit
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. inbound_growth_assets ────────────────────────────────────────────────
-- Geplante Inbound-Assets (Landingpages, SEO-Content, Korridorseiten)

CREATE TABLE IF NOT EXISTS inbound_growth_assets (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type        TEXT        NOT NULL CHECK (asset_type IN ('landing_page', 'employer_page', 'country_page', 'seo_content', 'corridor_page', 'blog')),
  title             TEXT        NOT NULL,
  description       TEXT        NOT NULL DEFAULT '',
  target_country    TEXT,
  target_sector     TEXT,
  audience          TEXT        NOT NULL DEFAULT 'both'
                                CHECK (audience IN ('employer', 'candidate', 'both')),
  priority          TEXT        NOT NULL DEFAULT 'medium'
                                CHECK (priority IN ('high', 'medium', 'low')),
  seo_keywords      TEXT[]      NOT NULL DEFAULT '{}',
  status            TEXT        NOT NULL DEFAULT 'planned'
                                CHECK (status IN ('planned', 'in_progress', 'ready', 'live')),
  compliance_note   TEXT        NOT NULL DEFAULT '',
  compliance_status TEXT        NOT NULL DEFAULT 'safe'
                                CHECK (compliance_status IN ('safe', 'needs_review', 'blocked')),
  -- Safety
  no_email_sent     BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_email_sent = TRUE),
  no_auto_outreach  BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_auto_outreach = TRUE),
  -- Audit
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. autonomous_worklog ───────────────────────────────────────────────────
-- Tagesberichte und System-Events des autonomen Systems

CREATE TABLE IF NOT EXISTS autonomous_worklog (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type       TEXT        NOT NULL DEFAULT 'daily'
                                CHECK (report_type IN ('daily', 'system_check', 'pilot_step', 'compliance_check')),
  system_health     TEXT        NOT NULL DEFAULT 'green'
                                CHECK (system_health IN ('green', 'yellow', 'red')),
  summary           TEXT        NOT NULL DEFAULT '',
  completed_items   TEXT[]      NOT NULL DEFAULT '{}',
  open_items        TEXT[]      NOT NULL DEFAULT '{}',
  next_action       TEXT        NOT NULL DEFAULT '',
  compliance_status TEXT        NOT NULL DEFAULT 'safe'
                                CHECK (compliance_status IN ('safe', 'needs_review', 'blocked')),
  -- Safety constraints (Tagesbericht darf nie eine Aktion auslösen)
  no_email_sent     BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_email_sent = TRUE),
  no_auto_outreach  BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_auto_outreach = TRUE),
  no_scraping       BOOLEAN     NOT NULL DEFAULT TRUE CHECK (no_scraping = TRUE),
  -- Audit
  created_by        TEXT        NOT NULL DEFAULT 'cwo_system',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS: Alle Tabellen absichern ────────────────────────────────────────────
-- Nur service_role darf lesen/schreiben. anon und authenticated haben keinen Zugriff.

ALTER TABLE cwo_agent_tasks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE corridor_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_signals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_opportunities  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound_growth_assets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomous_worklog     ENABLE ROW LEVEL SECURITY;

-- Keine Policies für anon/authenticated = kein Zugriff ohne service_role

-- ── Indizes für Performance ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_cwo_tasks_status     ON cwo_agent_tasks (status);
CREATE INDEX IF NOT EXISTS idx_cwo_tasks_department ON cwo_agent_tasks (department);
CREATE INDEX IF NOT EXISTS idx_cwo_tasks_priority   ON cwo_agent_tasks (priority);

CREATE INDEX IF NOT EXISTS idx_corridor_score       ON corridor_opportunities (score DESC);
CREATE INDEX IF NOT EXISTS idx_corridor_priority    ON corridor_opportunities (priority);

CREATE INDEX IF NOT EXISTS idx_demand_type_score    ON demand_signals (signal_type, score DESC);

CREATE INDEX IF NOT EXISTS idx_revenue_recommendation ON revenue_opportunities (recommendation);

CREATE INDEX IF NOT EXISTS idx_inbound_priority     ON inbound_growth_assets (priority, status);

CREATE INDEX IF NOT EXISTS idx_worklog_type_created ON autonomous_worklog (report_type, created_at DESC);

-- ── updated_at Trigger ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_cwo_tasks_updated_at
  BEFORE UPDATE ON cwo_agent_tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_corridor_updated_at
  BEFORE UPDATE ON corridor_opportunities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_revenue_updated_at
  BEFORE UPDATE ON revenue_opportunities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_inbound_updated_at
  BEFORE UPDATE ON inbound_growth_assets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Kommentar ───────────────────────────────────────────────────────────────

COMMENT ON TABLE cwo_agent_tasks IS 'CWO Operating System — automatisch generierte Aufgaben. Phase 1: kein Auto-Outreach, kein E-Mail-Versand.';
COMMENT ON TABLE corridor_opportunities IS 'Analysierte globale Talent-Korridore. Kein Scraping. Rein intern regelbasiert.';
COMMENT ON TABLE demand_signals IS 'Interne Bewertungssignale für Sektoren und Korridore. Kein Scraping.';
COMMENT ON TABLE revenue_opportunities IS 'Bewertete Revenue-Streams. Kein Auto-Billing. Nur Empfehlungen.';
COMMENT ON TABLE inbound_growth_assets IS 'Geplante Inbound-Assets. Kein Spam. Kein Cold-Outreach.';
COMMENT ON TABLE autonomous_worklog IS 'Tagesberichte und System-Events. Rein passiv — keine Auto-Aktionen.';
