/**
 * app/corridors/tunisia-france/page.tsx — /corridors/tunisia-france
 * Static SEO page — takes priority over dynamic /corridors/[slug]
 * Public — no auth, no DB, no email, no Stripe.
 */
import type { Metadata } from 'next'
import { CorridorPageTemplate } from '@/app/_components/CorridorPageTemplate'
import { CORRIDOR_CONFIGS } from '@/lib/seo-pages'

const cfg = CORRIDOR_CONFIGS['tunisia-france']

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  keywords: ['Tunesien Frankreich Arbeit', 'tunesische Fachkräfte Deutschland', 'Talent-Korridor Tunesien', 'CorridorWork Tunesien'],
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: 'https://corridorwork.com/corridors/tunisia-france',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/corridors/tunisia-france' },
}

export default function CorridorTunisiaFrancePage() {
  return <CorridorPageTemplate config={cfg} />
}
