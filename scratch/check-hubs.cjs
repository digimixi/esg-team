const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-10',
});

async function checkHubs() {
  const hubs = await client.fetch('*[_type == "hub"] { title, "slug": slug.current, isActive }');
  console.log('--- 目前系統中的產業專題 ---');
  console.table(hubs);
}

checkHubs().catch(console.error);
