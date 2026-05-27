import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-05-01'
});

async function checkHubs() {
  const hubs = await client.fetch(`*[_type == "hub" && isActive != false] { _id, title, isFeatured, _createdAt } | order(isFeatured desc, _createdAt asc)`);
  console.table(hubs);
}

checkHubs().catch(console.error);
