import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  try {
    console.log('正在刪除重複的 esg_info (_id: hub.esg_info)...');
    await client.delete('hub.esg_info');
    console.log('✅ 重複的文檔刪除成功！');
  } catch (error) {
    console.error('❌ 刪除失敗:', error.message);
  }
}

run();
