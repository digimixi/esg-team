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

async function mapProducts() {
  console.log('Fetching products and hubs...');
  
  const hubs = await client.fetch(`*[_type == "hub"]{ _id, "slug": slug.current }`);
  console.log('Found hubs:', hubs.map(h => h.slug).join(', '));
  
  const products = await client.fetch(`*[_type == "product"]{ _id, title, subCategory, hub }`);
  console.log(`Found ${products.length} products.`);

  const transaction = client.transaction();
  let updates = 0;

  for (const product of products) {
    let targetHubId = null;

    if (product.subCategory === 'graphite_crucible') {
      targetHubId = 'hub-graphite-crucible';
    } else if (product.subCategory === 'carbon_additive') {
      targetHubId = 'hub-carbon-additive';
    } else if (product.subCategory === 'graphite_materials') {
      targetHubId = 'hub-specialty-graphite';
    }

    if (targetHubId) {
      // Check if it's already mapped to avoid unnecessary updates
      if (!product.hub || product.hub._ref !== targetHubId) {
        transaction.patch(product._id, (p) => p.set({
          hub: {
            _type: 'reference',
            _ref: targetHubId
          }
        }));
        updates++;
        console.log(`Mapping "${product.title}" to ${targetHubId}`);
      }
    }
  }

  if (updates > 0) {
    console.log(`Committing ${updates} updates...`);
    await transaction.commit();
    console.log('✅ Mapping complete!');
  } else {
    console.log('All products are already mapped correctly.');
  }
}

mapProducts().catch(console.error);
