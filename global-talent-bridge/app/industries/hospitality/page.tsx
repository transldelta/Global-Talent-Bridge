/**
 * app/industries/hospitality/page.tsx — /industries/hospitality
 * Public SEO page — Gastronomie & Hotellerie
 */
import type { Metadata } from 'next'
import { IndustryPageTemplate } from '@/app/_components/IndustryPageTemplate'
import { INDUSTRY_CONFIGS } from '@/lib/seo-pages'

const cfg = INDUSTRY_CONFIGS.hospitality

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['internationale Gastronomie Fachkräfte', 'Hotel Fachkräfte international', 'Servicepersonal international', 'CorridorWork Gastronomie'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/industries/hospitality',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/industries/hospitality' },
}

export default function IndustriesHospitalityPage() {
  return <IndustryPageTemplate config={cfg} />
}
