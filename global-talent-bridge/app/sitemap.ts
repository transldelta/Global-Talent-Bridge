import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const BASE_URL = 'https://corridorwork.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/for-candidates`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/for-employers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/legal/impressum`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/datenschutz`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/agb`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/auth/register`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // Revenue Lead Pages — Inbound Pilot
    {
      url: `${BASE_URL}/pilot/employers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/pilot/agencies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/market-intelligence`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ]

  // Dynamic corridor landingpages (published + approved only)
  let corridorPages: MetadataRoute.Sitemap = []
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('landingpage_factory')
      .select('slug, updated_at, opportunity_score')
      .in('status', ['published', 'approved'])
      .order('opportunity_score', { ascending: false })

    if (data && data.length > 0) {
      corridorPages = data.map((lp: { slug: string; updated_at: string; opportunity_score: number }) => ({
        url: `${BASE_URL}/corridors/${lp.slug}`,
        lastModified: new Date(lp.updated_at),
        changeFrequency: 'weekly' as const,
        priority: lp.opportunity_score >= 85 ? 0.9 : lp.opportunity_score >= 70 ? 0.8 : 0.7,
      }))
    }
  } catch {
    // Graceful fallback — static pages still served
  }

  return [...staticPages, ...corridorPages]
}
