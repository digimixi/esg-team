import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: 'sks9WcmWpBPts4XS6GAauKGOZG71eQgKVZQjMApo4rPsdQrmtYcuziAz9HDsiiNOm1k5yV6jpe6MNxCUuFTRRyMwgca1snSTFHXL2sawoDT5DiiBFDkFwJ7raAXLm6rAwYrl08QVF5FIWESXV3zP45IULD2C1vzgonxlsX5aUsq2nwb7FhRq',
  useCdn: false,
  apiVersion: '2026-05-07',
});

async function main() {
  console.log('Patching index-carbon-eu in Sanity...');
  try {
    const result = await client
      .patch('index-carbon-eu')
      .set({
        sourceProvider: 'yahoo_finance',
        sourceSymbol: 'CO2.L'
      })
      .commit();
    console.log('✅ Successfully patched index-carbon-eu:', result);
  } catch (error) {
    console.error('❌ Failed to patch:', error);
  }
}

main();
