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
  console.log('Seeding Knowledge OS Demo Data...');
  
  // 1. Create Category
  const category = await client.create({
    _type: 'knowledgeCategory',
    title: '石墨電極推廣指南',
    slug: { _type: 'slug', current: 'graphite-electrode-guide' },
    targetRoles: ['partner', 'admin']
  });
  console.log('Category created:', category._id);

  // 2. Create Playbook Card
  const playbook = await client.create({
    _type: 'knowledgeArticle',
    title: '石墨電極推廣教戰卡',
    category: { _type: 'reference', _ref: category._id },
    targetRoles: ['partner'],
    cardType: 'playbook',
    playbookWhatIsIt: '專為電弧爐煉鋼設計的石墨電極，目前市場上分為日本、印度、中國等產地。',
    playbookTarget: '電弧爐鋼廠、特殊鋼廠',
    playbookPainPoint: '斷棒率高、價格浮動大、缺乏穩定的備援供應商。',
    playbookSafeScript: [
      '我們可以協助評估是否有成本優化空間。',
      'ESG.team 可以安排規格與測試報告交流，探討備援方案。'
    ],
    playbookBannedScript: [
      '我們保證最低價',
      '我們一定比日本材料好',
      '我可以保證交期與不斷供'
    ]
  });
  console.log('Playbook created:', playbook._id);

  // 3. Create FAQ Card
  const faq = await client.create({
    _type: 'knowledgeArticle',
    title: 'FAQ - 你們是不是材料商？',
    category: { _type: 'reference', _ref: category._id },
    targetRoles: ['partner'],
    cardType: 'faq',
    faqQuestion: '你們 ESG.team 到底是不是材料商？',
    faqAnswer: '我們是「綠色供應鏈整合平台」。我們不只是賣材料，而是透過審查上游供應商的合規資料與碳足跡，協助您建立符合未來 ESG 趨勢的備援供應鏈。'
  });
  console.log('FAQ created:', faq._id);

}

main().catch(console.error);
