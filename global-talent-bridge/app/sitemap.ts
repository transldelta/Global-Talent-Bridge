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
      url: `${BASE_URL}/for-buyers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
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
      url: `${BASE_URL}/strategic-partnership`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/partners`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
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
    // Passive Distribution Pages
    {
      url: `${BASE_URL}/launch`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/buyer-snapshot`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    // Demo page
    {
      url: `${BASE_URL}/demo`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    // Solutions pages
    {
      url: `${BASE_URL}/solutions/recruiting-agencies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    // Industry SEO pages
    {
      url: `${BASE_URL}/industries/care`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    {
      url: `${BASE_URL}/industries/hospitality`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/industries/logistics`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/industries/it`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/industries/construction`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    // Static corridor SEO pages
    {
      url: `${BASE_URL}/corridors/philippines-care`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    {
      url: `${BASE_URL}/corridors/india-uk`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    {
      url: `${BASE_URL}/corridors/morocco-germany`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/corridors/nigeria-tech`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/corridors/tunisia-france`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.70,
    },
    // Global Intake pages
    {
      url: `${BASE_URL}/global/employers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${BASE_URL}/global/candidates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    // Demo Sandbox
    {
      url: `${BASE_URL}/demo/sandbox`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    // New Global Corridor pages
    { url: `${BASE_URL}/corridors/india-canada`,           lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/corridors/india-australia`,        lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/corridors/nigeria-uk`,             lastModified: now, changeFrequency: 'monthly', priority: 0.78 },
    { url: `${BASE_URL}/corridors/morocco-france`,         lastModified: now, changeFrequency: 'monthly', priority: 0.78 },
    { url: `${BASE_URL}/corridors/tunisia-germany`,        lastModified: now, changeFrequency: 'monthly', priority: 0.78 },
    { url: `${BASE_URL}/corridors/philippines-healthcare`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/corridors/brazil-portugal`,        lastModified: now, changeFrequency: 'monthly', priority: 0.76 },
    { url: `${BASE_URL}/corridors/kenya-care`,             lastModified: now, changeFrequency: 'monthly', priority: 0.76 },
    { url: `${BASE_URL}/corridors/pakistan-gulf`,          lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/corridors/indonesia-hospitality`,  lastModified: now, changeFrequency: 'monthly', priority: 0.76 },
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
