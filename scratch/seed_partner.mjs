import { createClient } from '@sanity/client';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key] = rest.join('=').trim().replace(/['"]/g, '');
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: env.SANITY_WRITE_TOKEN
});

async function main() {
  console.log('Seeding MVP demo partner...');
  const partner = await client.create({
    _type: 'broker',
    partnerCode: 'ESG-MVP01',
    displayName: '王顧問 (MVP Test)',
    companyName: '大業產業諮詢',
    title: '資深產業顧問',
    email: 'demo@esg.team',
    level: 'level_3',
    status: 'active'
  });
  console.log('Partner created successfully:', partner._id);
}

main().catch(console.error);
