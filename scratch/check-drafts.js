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

async function checkDrafts() {
  const allDrafts = await client.fetch(`*[_id in path("drafts.**")] { _id, title }`);
  console.log(`Total drafts: ${allDrafts.length}`);
  
  if (allDrafts.length > 0) {
    console.log(allDrafts.slice(0, 5));
  }
}
checkDrafts();
