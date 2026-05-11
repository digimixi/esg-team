import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://esg.team';

  let hubUrls = [];
  try {
    // 抓取所有啟用的 Hubs
    const hubs = await client.fetch('*[_type == "hub" && isActive == true] { "slug": slug.current, _updatedAt }');
    
    hubUrls = hubs.map((hub) => ({
      url: `${baseUrl}/hubs/${hub.slug}`,
      lastModified: hub._updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap generation failed during build (this is normal if no token):', error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...hubUrls,
  ];
}
