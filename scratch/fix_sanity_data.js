import { createClient } from 'next-sanity';

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: 'skSfdwN6ajKMSqJ2kjAoB7bfdAcdVsxy9HYxFYoGYH87ZlR9fvtL56ZHRRvdkSNKgXUOnjIFDtUXmaNkw8k4QicvOyeExTIWOtRLgUO3pqrClRdfdXVlYsG1QDJObDo6T8N4kYayw72q74M5DoKpeVLxuOMQrVKOHeM0nFuXD2va1wMjz98w',
  useCdn: false,
  apiVersion: '2026-05-07',
});

async function fixData() {
  console.log('🚀 Final Polish: Syncing Market Indices...');

  const indices = [
    { _id: 'index-steel-rebar', name: 'HRB400 螺紋鋼', value: 3850, trendPercentage: '-0.3%', trendStatus: 'down', order: 1, unit: 'CNY/t' },
    { _id: 'index-graphite-uhp', name: 'UHP600 石墨電極', value: 18500, trendPercentage: '+0.8%', trendStatus: 'up', order: 2, unit: 'CNY/t' },
    { _id: 'index-carbon-eu', name: '歐盟碳配額 (EUA)', value: 68.4, trendPercentage: '+0.7%', trendStatus: 'up', order: 3, unit: 'EUR/t' },
    { _id: 'index-iron-ore', name: '鐵礦石 62%', value: 105.2, trendPercentage: '-1.1%', trendStatus: 'down', order: 4, unit: 'USD/t' }
  ];

  for (const idx of indices) {
    await client.createOrReplace({
      _type: 'marketIndex',
      ...idx
    });
    console.log(`✅ Synced Index: ${idx.name}`);
  }

  console.log('✨ Full spectrum data repair completed!');
}

fixData().catch(err => {
  console.error('💥 Repair failed:', err);
  process.exit(1);
});
