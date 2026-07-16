import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-01',
  useCdn: false
});

client.fetch(`*[_type == "product"][0...3]{title, image, "imageUrl": image.asset->url, "imagesUrl": images[0].asset->url}`).then(res => console.log(JSON.stringify(res, null, 2)));
