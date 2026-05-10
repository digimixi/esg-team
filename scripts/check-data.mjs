import { createClient } from '@sanity/client';
const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: 'sks9WcmWpBPts4XS6GAauKGOZG71eQgKVZQjMApo4rPsdQrmtYcuziAz9HDsiiNOm1k5yV6jpe6MNxCUuFTRRyMwgca1snSTFHXL2sawoDT5DiiBFDkFwJ7raAXLm6rAwYrl08QVF5FIWESXV3zP45IULD2C1vzgonxlsX5aUsq2nwb7FhRq',
  useCdn: false,
  apiVersion: '2026-05-07',
});
async function check() {
  const insights = await client.fetch('*[_type == "insight"] | order(publishedAt desc)[0...3]{_id, title, publishedAt, source}');
  const indices = await client.fetch('*[_type == "marketIndex"]{name, value, trend, _updatedAt}');
  console.log('--- 產業情報檢查 ---');
  console.log(JSON.stringify(insights, null, 2));
  console.log('--- 市場行情檢查 ---');
  console.log(JSON.stringify(indices, null, 2));
}
check();
