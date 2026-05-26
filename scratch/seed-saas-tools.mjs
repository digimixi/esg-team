import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN // Requires write token
});

const toolsToSeed = [
  {
    _type: 'saasTool',
    title: 'CBAM 碳邊境稅模擬器',
    titleEnglish: 'CBAM Tariff Simulator',
    slug: { _type: 'slug', current: 'cbam' },
    category: 'FREE / 基礎合規',
    icon: 'calculate',
    description: '動態對齊官方公開排放因子，一鍵預算歐盟進口碳關稅曝險。',
    href: '/tools/cbam',
    badge: '試用中',
    badgeColor: 'bg-blue-500',
    isEnterprise: false,
    isActive: true,
    order: 1
  },
  {
    _type: 'saasTool',
    title: '供應鏈碳排信任帳本',
    titleEnglish: 'Scope 3 Carbon Trust Ledger',
    slug: { _type: 'slug', current: 'ledger' },
    category: 'FREE / 供應鏈治理',
    icon: 'account_balance_wallet',
    description: '具備密碼學雜湊防偽與 SGS/TÜV 第三方認證掛載的跨國碳足跡追蹤系統。',
    href: '/tools/ledger',
    badge: '沙盒模式',
    badgeColor: 'bg-amber-500',
    isEnterprise: false,
    isActive: true,
    order: 2
  },
  {
    _type: 'saasTool',
    title: 'B2B ERP 自動直連 API',
    titleEnglish: 'Enterprise API Gateway',
    slug: { _type: 'slug', current: 'erp-api' },
    category: 'ENTERPRISE / 頂級效能',
    icon: 'api',
    description: '透過 OpenAPI 直連您的 SAP/Oracle 或廠區 EMS，實現全供應鏈數據秒級零時差同步。',
    href: '#',
    badge: '企業版限定',
    badgeColor: 'bg-primary',
    isEnterprise: true,
    isActive: true,
    order: 3
  }
];

async function seed() {
  console.log('Seeding SaaS Tools...');
  for (const tool of toolsToSeed) {
    try {
      const res = await client.create(tool);
      console.log(`✅ Created Tool: ${res.title}`);
    } catch (err) {
      console.error(`❌ Failed to create Tool: ${tool.title}`, err.message);
    }
  }
  console.log('Seeding Complete.');
}

seed();
