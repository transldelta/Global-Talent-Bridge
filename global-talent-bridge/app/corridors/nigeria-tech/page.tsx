/**
 * app/corridors/nigeria-tech/page.tsx — /corridors/nigeria-tech
 * Static SEO page — takes priority over dynamic /corridors/[slug]
 * Public — no auth, no DB, no email, no Stripe.
 */
import type { Metadata } from 'next'
import { CorridorPageTemplate } from '@/app/_components/CorridorPageTemplate'
import { CORRIDOR_CONFIGS } from '@/lib/seo-pages'

const cfg = CORRIDOR_CONFIGS['nigeria-tech']

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['Nigeria Tech Talent Deutschland', 'nigerianische Entwickler Europa', 'Tech-Korridor Nigeria', 'CorridorWork Nigeria'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/corridors/nigeria-tech',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/corridors/nigeria-tech' },
}

export default function CorridorNigeriaTechPage() {
  return <CorridorPageTemplate config={cfg} />
}
