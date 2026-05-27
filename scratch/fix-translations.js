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

function getBetterTranslation(engTitle) {
  const lower = engTitle.toLowerCase();
  
  // Specific full product translations
  if (lower.includes('graphite scrap') || lower.includes('graphite fines')) {
    return '石墨碎 / 石墨粉 - ' + engTitle;
  }
  
  if (lower.includes('calcined petroleum coke')) {
    return '煆燒石油焦 (CPC) - ' + engTitle;
  }
  
  if (lower.includes('coal carbonizer') || lower.includes('coal carbon raiser')) {
    return '煤質增碳劑 - ' + engTitle;
  }
  
  if (lower.includes('coke coal')) {
    return '冶金焦煤 - ' + engTitle;
  }
  
  if (lower.includes('electrode calcination block')) {
    return '電極焙燒塊 - ' + engTitle;
  }
  
  if (lower.includes('graphite powder')) {
    return '石墨粉 - ' + engTitle;
  }
  
  if (lower.includes('graphite cube')) {
    return '石墨方塊 / 石墨塊 - ' + engTitle;
  }
  
  if (lower.includes('graphite crucible')) {
    return '石墨坩堝 - ' + engTitle;
  }
  
  if (lower.includes('graphite electrode')) {
    return '石墨電極 - ' + engTitle;
  }
  
  if (lower.includes('carbon additive')) {
    return '增碳劑 - ' + engTitle;
  }

  // Fallback
  return engTitle;
}

async function fixTranslations() {
  console.log('Fetching all products to fix translations...');
  const products = await client.fetch(`*[_type == "product" && _id match "imported-*"]`);
  
  console.log(`Found ${products.length} products. Updating...`);
  
  const transaction = client.transaction();
  let updatedCount = 0;

  products.forEach(p => {
    // Some products don't have subtitle, use title if subtitle is missing
    const engName = p.subtitle || p.title.replace(/.*?-\s*/, ''); 
    const newTitle = getBetterTranslation(engName);
    
    if (newTitle !== p.title) {
      transaction.patch(p._id, (p) => p.set({ title: newTitle }));
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    try {
      await transaction.commit();
      console.log(`✅ Successfully updated ${updatedCount} translations!`);
    } catch (err) {
      console.error('❌ Error updating translations:', err.message);
    }
  } else {
    console.log('No translations needed updating.');
  }
}

fixTranslations();
