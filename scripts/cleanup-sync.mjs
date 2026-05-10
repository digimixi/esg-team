import { createClient } from '@sanity/client';
const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: 'sks9WcmWpBPts4XS6GAauKGOZG71eQgKVZQjMApo4rPsdQrmtYcuziAz9HDsiiNOm1k5yV6jpe6MNxCUuFTRRyMwgca1snSTFHXL2sawoDT5DiiBFDkFwJ7raAXLm6rAwYrl08QVF5FIWESXV3zP45IULD2C1vzgonxlsX5aUsq2nwb7FhRq',
  useCdn: false,
  apiVersion: '2026-05-07',
});
async function cleanup() {
  console.log('正在清理舊的同步資料...');
  await client.delete({ query: '*[_type == "insight" && _id match "insight-sync-*"]' });
  console.log('清理完成！');
}
cleanup();
