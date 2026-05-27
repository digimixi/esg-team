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

function determineSubCategory(title) {
  if (title.includes('石墨電極') || title.includes('焙燒塊')) return 'graphite_electrode';
  if (title.includes('石墨坩堝')) return 'graphite_crucible';
  if (title.includes('增碳劑') || title.includes('焦') || title.includes('煤')) return 'carbon_additive';
  return 'graphite_materials'; // Fallback for things like 石墨方塊, 石墨粉
}

async function tagSubCategories() {
  console.log('Fetching products to apply subCategories...');
  const products = await client.fetch(`*[_type == "product"]`);
  
  console.log(`Found ${products.length} products. Updating...`);
  
  const transaction = client.transaction();
  let updatedCount = 0;

  products.forEach(p => {
    const newSubCat = determineSubCategory(p.title);
    if (p.subCategory !== newSubCat) {
      transaction.patch(p._id, (p) => p.set({ subCategory: newSubCat }));
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    try {
      await transaction.commit();
      console.log(`✅ Successfully assigned subCategory to ${updatedCount} products!`);
    } catch (err) {
      console.error('❌ Error updating subCategories:', err.message);
    }
  } else {
    console.log('All products already have correct subCategories.');
  }
}

tagSubCategories();
