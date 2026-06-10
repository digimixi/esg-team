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
  useCdn: false,
});

async function run() {
  const hubs = await client.fetch(`*[_type == "hub" && slug.current == "esg_info"]`);
  console.log(`Found ${hubs.length} hubs with slug 'esg_info'`);
  hubs.forEach((hub, i) => {
    console.log(`\nHub ${i}: _id = ${hub._id}`);
    console.log(`prospectMap exists?`, !!hub.prospectMap);
  });
}
run();
