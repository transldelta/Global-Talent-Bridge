-- Migration: Landingpage Factory
-- Branch: feature/landingpage-factory
-- Date: 2026-06-04

CREATE TABLE IF NOT EXISTS public.landingpage_factory (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id       uuid REFERENCES public.migration_corridors(id) ON DELETE SET NULL,
  title             text NOT NULL,
  slug              text NOT NULL UNIQUE,
  language          text NOT NULL DEFAULT 'en',
  target_country    text,
  source_country    text,
  profession_focus  text,
  seo_title         text,
  seo_description   text,
  opportunity_score integer NOT NULL DEFAULT 50 CHECK (opportunity_score BETWEEN 0 AND 100),
  priority_level    text CHECK (priority_level IN ('low','medium','high','critical')),
  status            text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','ready_for_review','approved','published','paused')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS landingpage_factory_slug_idx    ON public.landingpage_factory(slug);
CREATE INDEX IF NOT EXISTS landingpage_factory_status_idx  ON public.landingpage_factory(status);
CREATE INDEX IF NOT EXISTS landingpage_factory_priority_idx ON public.landingpage_factory(priority_level);

ALTER TABLE public.landingpage_factory ENABLE ROW LEVEL SECURITY;

-- Public read policy: anyone can read published landingpages
CREATE POLICY "Public can read published landingpages"
  ON public.landingpage_factory
  FOR SELECT
  USING (status = 'published');
