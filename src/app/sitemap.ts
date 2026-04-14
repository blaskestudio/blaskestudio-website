import { MetadataRoute } from 'next';
import { getAllWorkSlugs } from '@/lib/work';

const BASE_URL = 'https://blaskestudio.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllWorkSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/work`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/about`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/studio`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/culture`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/capabilities`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/inquire`, priority: 0.8, changeFrequency: 'monthly' },
  ];

  const workRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/work/${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticRoutes, ...workRoutes];
}
