-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 202606070400_global_intake_tables.sql
-- Global Intake Tables: global_employer_leads + candidate_interest_leads
--
-- Safety Constraints:
--   no_email_sent    BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_email_sent = TRUE)
--   no_auto_outreach BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_auto_outreach = TRUE)
--   no_payment_started BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_payment_started = TRUE)
--   no_job_guarantee BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_job_guarantee = TRUE)
--   no_visa_guarantee BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_visa_guarantee = TRUE)
--
-- RLS: aktiv auf beiden Tabellen — public hat kein SELECT/UPDATE/DELETE
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Global Employer Leads ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS global_employer_leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name     TEXT NOT NULL CHECK (length(organization_name) BETWEEN 2 AND 200),
  contact_name          TEXT NOT NULL CHECK (length(contact_name) BETWEEN 2 AND 200),
  email                 TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  country               TEXT,
  city                  TEXT,
  sector                TEXT,
  sectors               TEXT[],
  hiring_need           TEXT,
  target_candidate_regions TEXT,
  urgency               TEXT CHECK (urgency IN ('immediate', '1-3months', '3-6months', 'later', NULL)),
  qualification_level   TEXT CHECK (qualification_level IN ('entry-level', 'skilled-worker', 'certified-professional', 'senior-specialist', 'regulated-profession', NULL)),
  message               TEXT,
  consent_to_contact    BOOLEAN NOT NULL CHECK (consent_to_contact = TRUE),
  status                TEXT NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'reviewed', 'qualified', 'rejected')),
  source_page           TEXT DEFAULT '/global/employers',
  admin_note            TEXT DEFAULT '',
  lead_score            INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  -- Safety invariants
  no_email_sent         BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_email_sent = TRUE),
  no_auto_outreach      BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_auto_outreach = TRUE),
  no_payment_started    BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_payment_started = TRUE),
  no_scraping           BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_scraping = TRUE),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. Candidate Interest Leads ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS candidate_interest_leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name          TEXT NOT NULL CHECK (length(display_name) BETWEEN 2 AND 200),
  email                 TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  country_of_origin     TEXT,
  target_country        TEXT,
  target_countries      TEXT[],
  sector                TEXT,
  sectors               TEXT[],
  experience_level      TEXT CHECK (experience_level IN ('entry-level', 'junior', 'mid-level', 'senior', 'specialist', NULL)),
  languages             TEXT,
  qualifications        TEXT,
  relocation_readiness  TEXT CHECK (relocation_readiness IN ('yes', 'no', 'remote-only', 'flexible', NULL)),
  message               TEXT,
  consent_to_contact    BOOLEAN NOT NULL CHECK (consent_to_contact = TRUE),
  status                TEXT NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'reviewed', 'matched', 'archived')),
  source_page           TEXT DEFAULT '/global/candidates',
  admin_note            TEXT DEFAULT '',
  -- Safety invariants
  no_email_sent         BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_email_sent = TRUE),
  no_auto_outreach      BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_auto_outreach = TRUE),
  no_payment_started    BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_payment_started = TRUE),
  no_job_guarantee      BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_job_guarantee = TRUE),
  no_visa_guarantee     BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_visa_guarantee = TRUE),
  no_candidate_fee      BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_candidate_fee = TRUE),
  no_scraping           BOOLEAN NOT NULL DEFAULT TRUE CHECK (no_scraping = TRUE),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. Indexes ───────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_global_employer_leads_status  ON global_employer_leads (status);
CREATE INDEX IF NOT EXISTS idx_global_employer_leads_country ON global_employer_leads (country);
CREATE INDEX IF NOT EXISTS idx_global_employer_leads_sector  ON global_employer_leads (sector);
CREATE INDEX IF NOT EXISTS idx_global_employer_leads_email   ON global_employer_leads (email);

CREATE INDEX IF NOT EXISTS idx_candidate_interest_leads_status  ON candidate_interest_leads (status);
CREATE INDEX IF NOT EXISTS idx_candidate_interest_leads_country ON candidate_interest_leads (country_of_origin);
CREATE INDEX IF NOT EXISTS idx_candidate_interest_leads_sector  ON candidate_interest_leads (sector);
CREATE INDEX IF NOT EXISTS idx_candidate_interest_leads_email   ON candidate_interest_leads (email);

-- ── 4. Updated_at Trigger ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_global_employer_leads_updated_at
  BEFORE UPDATE ON global_employer_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_interest_leads_updated_at
  BEFORE UPDATE ON candidate_interest_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 5. RLS aktivieren ────────────────────────────────────────────────────────

ALTER TABLE global_employer_leads   ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_interest_leads ENABLE ROW LEVEL SECURITY;

-- Public: nur INSERT (keine Reads, kein Update/Delete)
CREATE POLICY "public_insert_global_employer_leads" ON global_employer_leads
  FOR INSERT TO anon WITH CHECK (
    consent_to_contact = TRUE
    AND no_email_sent = TRUE
    AND no_auto_outreach = TRUE
    AND no_payment_started = TRUE
  );

CREATE POLICY "public_insert_candidate_interest_leads" ON candidate_interest_leads
  FOR INSERT TO anon WITH CHECK (
    consent_to_contact = TRUE
    AND no_email_sent = TRUE
    AND no_auto_outreach = TRUE
    AND no_payment_started = TRUE
    AND no_job_guarantee = TRUE
    AND no_visa_guarantee = TRUE
  );

-- Service role (admin): alles
CREATE POLICY "service_role_all_global_employer_leads" ON global_employer_leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_candidate_interest_leads" ON candidate_interest_leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- authenticated (normale User): kein Zugriff
-- (kein Policy = kein Zugriff per RLS default)
