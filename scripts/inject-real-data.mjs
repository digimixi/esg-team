import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

async function inject() {
  const dataPoints = [
    { name: '鐵礦砂 Iron Ore 62%', value: '816.50', trend: '▼ 0.1%' },
    { name: '廢鋼 Scrap HMS 1/2', value: '2,060.00', trend: '—' },
    { name: '熱軋鋼板 HRC', value: '3,473.00', trend: '▼ 0.2%' },
    { name: '冷軋鋼板 CRC', value: '4,053.00', trend: '—' },
    { name: '鋼坯 Billet (Spot)', value: '3,100.00', trend: '—' }
  ];

  console.log('--- 開始注入真實市場數據 (MacroMicro) ---');

  for (const item of dataPoints) {
    // 尋找相似名稱的指數
    const searchName = item.name.split(' ')[0];
    const docs = await client.fetch('*[_type == "marketIndex" && name match $n]', { n: `*${searchName}*` });

    if (docs.length > 0) {
      await client.patch(docs[0]._id)
        .set({ value: item.value, trend: item.trend })
        .commit();
      console.log(`✅ 已更新: ${item.name}`);
    } else {
      await client.create({
        _type: 'marketIndex',
        name: item.name,
        value: item.value,
        trend: item.trend,
        order: 20
      });
      console.log(`➕ 已創建: ${item.name}`);
    }
  }

  // 同時創建一篇深度分析新聞
  const hub = await client.fetch('*[_type == "hub" && slug.current == "graphite"][0]');
  if (hub) {
      await client.create({
        _type: 'insight',
        title: '財經M平方：鋼鐵原物料走勢深度分析 (2026-05)',
        excerpt: '當前市場顯示鐵礦砂與熱軋鋼板呈現小幅回落趨勢，而廢鋼與冷軋鋼板則維持平穩。供給端的產能調整與終端需求的波動仍是影響近期行情的主因。',
        category: '市場行情',
        publishedAt: new Date().toISOString(),
        source: 'MacroMicro 財經M平方',
        externalUrl: 'https://www.macromicro.me/charts/31626/yuan-wu-liao-gang-jia-zou-shi',
        hub: { _type: 'reference', _ref: hub._id },
        isFeatured: true
      });
      console.log('✅ 已生成深度分析文章');
  }

  console.log('--- 數據注入完成 ---');
}

inject();
