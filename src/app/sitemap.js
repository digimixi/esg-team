import { client } from '@/sanity/lib/client';

export default async function sitemap() {
  const baseUrl = 'https://esg.team';

  // 抓取所有啟用的 Hubs
  const hubs = await client.fetch('*[_type == "hub" && isActive == true] { "slug": slug.current, _updatedAt }');

  const hubUrls = hubs.map((hub) => ({
    url: `${baseUrl}/hubs/${hub.slug}`,
    lastModified: hub._updatedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

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
