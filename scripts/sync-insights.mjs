import Parser from 'rss-parser';
import { createClient } from '@sanity/client';

// 設定 Sanity 連線資訊
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '2euox6d1',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

const parser = new Parser();

const FEEDS = [
  {
    url: 'https://worldsteel.org/feed/',
    hubSlug: 'graphite', 
    sourceName: 'World Steel Association'
  },
  {
    url: 'http://blog.steel-technology.com/feed',
    hubSlug: 'graphite',
    sourceName: 'Steel Technology'
  }
];

async function sync() {
  console.log('--- 開始同步產業洞察 ---');
  
  // 1. 先獲取專題 ID (Hub ID)
  const hubs = await client.fetch('*[_type == "hub"]{ _id, "slug": slug.current }');
  const hubMap = Object.fromEntries(hubs.map(h => [h.slug, h._id]));

  for (const feed of FEEDS) {
    console.log(`正在抓取來源: ${feed.sourceName}...`);
    try {
      const feedData = await parser.parseURL(feed.url);
      const targetHubId = hubMap[feed.hubSlug];
      
      if (!targetHubId) {
        console.warn(`找不到對應的專題: ${feed.hubSlug}，跳過此來源。`);
        continue;
      }

      for (const item of feedData.items.slice(0, 3)) { // 每次只抓最新的 3 則
        const docId = `insight-sync-${Buffer.from(item.link).toString('base64').substring(0, 30)}`;
        
        const insightDoc = {
          _type: 'insight',
          _id: docId,
          title: item.title,
          excerpt: item.contentSnippet?.substring(0, 200) + '...',
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          source: feed.sourceName,
          externalUrl: item.link,
          hub: {
            _type: 'reference',
            _ref: targetHubId
          }
        };

        await client.createIfNotExists(insightDoc);
        console.log(`成功同步: ${item.title}`);
      }
    } catch (error) {
      console.error(`抓取 ${feed.sourceName} 失敗:`, error.message);
    }
  }
  
  console.log('--- 同步完成 ---');
}

sync();
