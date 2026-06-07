/**
 * app/industries/it/page.tsx — /industries/it
 * Public SEO page — IT & Technologie
 */
import type { Metadata } from 'next'
import { IndustryPageTemplate } from '@/app/_components/IndustryPageTemplate'
import { INDUSTRY_CONFIGS } from '@/lib/seo-pages'

const cfg = INDUSTRY_CONFIGS.it

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['internationale IT Fachkräfte', 'internationale Entwickler', 'Tech Talent global', 'CorridorWork IT'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/industries/it',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/industries/it' },
}

export default function IndustriesItPage() {
  return <IndustryPageTemplate config={cfg} />
}
