/**
 * app/corridors/morocco-germany/page.tsx — /corridors/morocco-germany
 * Static SEO page — takes priority over dynamic /corridors/[slug]
 * Public — no auth, no DB, no email, no Stripe.
 */
import type { Metadata } from 'next'
import { CorridorPageTemplate } from '@/app/_components/CorridorPageTemplate'
import { CORRIDOR_CONFIGS } from '@/lib/seo-pages'

const cfg = CORRIDOR_CONFIGS['morocco-germany']

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['Marokko Deutschland Arbeit', 'marokkanische Fachkräfte Deutschland', 'Talent-Korridor Marokko', 'CorridorWork Marokko'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/corridors/morocco-germany',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/corridors/morocco-germany' },
}

export default function CorridorMoroccoGermanyPage() {
  return <CorridorPageTemplate config={cfg} />
}
