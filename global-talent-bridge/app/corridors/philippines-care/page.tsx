/**
 * app/corridors/philippines-care/page.tsx — /corridors/philippines-care
 * Static SEO page — takes priority over dynamic /corridors/[slug]
 * Public — no auth, no DB, no email, no Stripe.
 */
import type { Metadata } from 'next'
import { CorridorPageTemplate } from '@/app/_components/CorridorPageTemplate'
import { CORRIDOR_CONFIGS } from '@/lib/seo-pages'

const cfg = CORRIDOR_CONFIGS['philippines-care']

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['philippinische Pflegekräfte Deutschland', 'Philippinen Pflege Korridor', 'Pflegefachkräfte Philippinen', 'CorridorWork Philippinen'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/corridors/philippines-care',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/corridors/philippines-care' },
}

export default function CorridorPhilippinesCarePage() {
  return <CorridorPageTemplate config={cfg} />
}
