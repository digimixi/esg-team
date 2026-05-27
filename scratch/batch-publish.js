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

async function batchPublish() {
  console.log('Fetching imported drafts...');
  const drafts = await client.fetch(`*[_type == "product" && _id match "drafts.imported-*"]`);
  
  console.log(`Found ${drafts.length} drafts. Processing...`);
  
  // Group into chunks of 20 to avoid transaction limits just in case
  const chunkSize = 20;
  for (let i = 0; i < drafts.length; i += chunkSize) {
    const chunk = drafts.slice(i, i + chunkSize);
    const transaction = client.transaction();
    
    let publishedCount = 0;
    let deletedCount = 0;

    chunk.forEach(draft => {
      // Check if it's the old buggy one (the one with the base64 prefix bug)
      if (draft._id.includes('aHR0cHM')) {
        transaction.delete(draft._id);
        transaction.delete(draft._id.replace('drafts.', '')); // Also delete if accidentally published
        deletedCount++;
      } else {
        const publishedId = draft._id.replace('drafts.', '');
        const publishedDoc = { ...draft, _id: publishedId };
        
        // Create the published document
        transaction.createOrReplace(publishedDoc);
        // Delete the draft document
        transaction.delete(draft._id);
        publishedCount++;
      }
    });

    try {
      await transaction.commit();
      console.log(`Batch ${Math.floor(i/chunkSize) + 1}: Published ${publishedCount}, Deleted ${deletedCount} bad bugs.`);
    } catch (err) {
      console.error('❌ Error publishing batch:', err.message);
    }
  }
  
  console.log('✅ All done!');
}

batchPublish();
