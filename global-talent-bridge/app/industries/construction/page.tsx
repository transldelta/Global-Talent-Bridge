/**
 * app/industries/construction/page.tsx — /industries/construction
 * Public SEO page — Bau & Handwerk
 */
import type { Metadata } from 'next'
import { IndustryPageTemplate } from '@/app/_components/IndustryPageTemplate'
import { INDUSTRY_CONFIGS } from '@/lib/seo-pages'

const cfg = INDUSTRY_CONFIGS.construction

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['internationale Baufachkräfte', 'Handwerker international', 'Baubranche Fachkräftemangel', 'CorridorWork Bau'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/industries/construction',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/industries/construction' },
}

export default function IndustriesConstructionPage() {
  return <IndustryPageTemplate config={cfg} />
}
