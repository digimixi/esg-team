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

async function deleteDuplicate() {
  console.log('Deleting duplicate hub created manually...');
  try {
    await client.delete('4b21568e-623a-4e34-983b-686abe6697b4');
    console.log('✅ Deleted successfully.');
  } catch (error) {
    console.error('Failed to delete:', error.message);
  }
}

deleteDuplicate();
