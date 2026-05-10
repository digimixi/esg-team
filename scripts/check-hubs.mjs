import { createClient } from '@sanity/client';
const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-05-07',
});
client.fetch('*[_type == "hub"]{ title, "slug": slug.current }').then(res => {
  console.log(JSON.stringify(res, null, 2));
});
