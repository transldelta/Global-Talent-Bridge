/**
 * app/industries/care/page.tsx — /industries/care
 * Public SEO page — Pflege & Gesundheit
 */
import type { Metadata } from 'next'
import { IndustryPageTemplate } from '@/app/_components/IndustryPageTemplate'
import { INDUSTRY_CONFIGS } from '@/lib/seo-pages'

const cfg = INDUSTRY_CONFIGS.care

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['internationale Pflegekräfte', 'Pflegefachkräfte international', 'Pflegebranche Fachkräftemangel', 'CorridorWork Pflege'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/industries/care',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/industries/care' },
}

export default function IndustriesCarePage() {
  return <IndustryPageTemplate config={cfg} />
}
