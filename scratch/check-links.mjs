import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2026-05-07',
});

async function checkData() {
  const data = await client.fetch(`*[_type == "insight"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    externalUrl,
    source
  }`);
  
  console.log('--- 數據診斷結果 ---');
  data.forEach((item, i) => {
    console.log(`[${i+1}] 標題: ${item.title}`);
    console.log(`    網址: ${item.externalUrl || '❌ 遺失 (EMPTY)'}`);
    console.log(`    來源: ${item.source}`);
  });
}

checkData();
