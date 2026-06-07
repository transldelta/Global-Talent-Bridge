/**
 * app/industries/logistics/page.tsx — /industries/logistics
 * Public SEO page — Logistik & Transport
 */
import type { Metadata } from 'next'
import { IndustryPageTemplate } from '@/app/_components/IndustryPageTemplate'
import { INDUSTRY_CONFIGS } from '@/lib/seo-pages'

const cfg = INDUSTRY_CONFIGS.logistics

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['internationale Logistik Fachkräfte', 'LKW-Fahrer international', 'Lagerfachkräfte international', 'CorridorWork Logistik'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/industries/logistics',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/industries/logistics' },
}

export default function IndustriesLogisticsPage() {
  return <IndustryPageTemplate config={cfg} />
}
