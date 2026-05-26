import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: 'skSfdwN6ajKMSqJ2kjAoB7bfdAcdVsxy9HYxFYoGYH87ZlR9fvtL56ZHRRvdkSNKgXUOnjIFDtUXmaNkw8k4QicvOyeExTIWOtRLgUO3pqrClRdfdXVlYsG1QDJObDo6T8N4kYayw72q74M5DoKpeVLxuOMQrVKOHeM0nFuXD2va1wMjz98w',
  useCdn: false,
  apiVersion: '2026-05-07',
});

async function run() {
  const docs = await client.fetch(`*[_type == "systemTech"] { _id, title, category, path, status, benefit, deployedAt }`);
  console.log(JSON.stringify(docs, null, 2));
}

run();
