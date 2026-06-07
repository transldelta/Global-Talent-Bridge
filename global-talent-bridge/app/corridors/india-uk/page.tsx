/**
 * app/corridors/india-uk/page.tsx — /corridors/india-uk
 * Static SEO page — takes priority over dynamic /corridors/[slug]
 * Public — no auth, no DB, no email, no Stripe.
 */
import type { Metadata } from 'next'
import { CorridorPageTemplate } from '@/app/_components/CorridorPageTemplate'
import { CORRIDOR_CONFIGS } from '@/lib/seo-pages'

const cfg = CORRIDOR_CONFIGS['india-uk']

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['Indien UK Arbeit', 'indische IT-Fachkräfte Deutschland', 'Tech-Korridor Indien', 'CorridorWork Indien'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/corridors/india-uk',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/corridors/india-uk' },
}

export default function CorridorIndiaUkPage() {
  return <CorridorPageTemplate config={cfg} />
}
