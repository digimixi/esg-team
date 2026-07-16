import { createClient } from '@sanity/client';
import fs from 'fs';

// Read .env.local manually
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
  console.log('Seeding demo vendor...');
  
  const vendor = await client.create({
    _type: 'vendor',
    companyName: '綠能科技股份有限公司 (GreenTech Corp)',
    slug: { _type: 'slug', current: 'greentech-corp' },
    email: 'demo@greentech.esg.team',
    contactName: '王大明 永續長',
    status: 'active',
    isActive: true,
    isPremium: true
  });
  
  console.log('Vendor created:', vendor._id);
  
  const product1 = await client.create({
    _type: 'product',
    title: '超高功率石墨電極 (UHP Grade)',
    subtitle: 'UHP Graphite Electrode',
    slug: { _type: 'slug', current: 'uhp-graphite-electrode-demo' },
    stock: '5,000 MT',
    status: 'published',
    vendor: { _type: 'reference', _ref: vendor._id },
    esgTags: ['low_carbon', 'energy_efficiency'],
    description: '專為電弧爐煉鋼 (EAF) 設計的超高功率石墨電極，具備極低的電阻率。我們在生產過程中導入 100% 綠電，符合歐盟 CBAM 碳邊境稅低碳排標準。'
  });
  
  console.log('Product 1 created:', product1._id);
  
  const product2 = await client.create({
    _type: 'product',
    title: '回收碳化矽再生料',
    subtitle: 'Recycled SiC Powder',
    slug: { _type: 'slug', current: 'recycled-sic-demo' },
    stock: '850 MT',
    status: 'published',
    vendor: { _type: 'reference', _ref: vendor._id },
    esgTags: ['recovery', 'carbon_assets'],
    description: '從半導體廢料中提取並重新純化，碳足跡相較於開採原生礦減少 65%，已通過 SGS 碳足跡查證，是鑄造業降低 Scope 3 排放的絕佳選擇。'
  });
  
  console.log('Product 2 created:', product2._id);
}

main().catch(console.error);
