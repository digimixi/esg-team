import { createClient } from 'next-sanity';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: 'skSfdwN6ajKMSqJ2kjAoB7bfdAcdVsxy9HYxFYoGYH87ZlR9fvtL56ZHRRvdkSNKgXUOnjIFDtUXmaNkw8k4QicvOyeExTIWOtRLgUO3pqrClRdfdXVlYsG1QDJObDo6T8N4kYayw72q74M5DoKpeVLxuOMQrVKOHeM0nFuXD2va1wMjz98w',
  useCdn: false,
  apiVersion: '2026-05-07',
});

// Helper function to add keys to arrays
const withKeys = (arr) => arr ? arr.map(item => ({ ...item, _key: uuidv4() })) : undefined;

async function migrate() {
  console.log('🚀 Starting Solutions Migration with _key fix...');

  const solutions = [
    {
      _id: 'solution-compliance',
      _type: 'solution',
      title: '數位合規',
      titleEnglish: 'Digital Compliance',
      slug: { _type: 'slug', current: 'compliance' },
      category: 'compliance',
      description: '為重工業打造的高效率數位合規解決方案。透過自動化數據採集與分析，確保您的企業符合全球供應鏈 ESG 標準與碳關稅法規。',
      badgeText: 'Digital Compliance Platform',
      badgeIcon: 'verified_user',
      cta: { label: '開始試算合規進度', href: '#' },
      bentoSection: {
        title: '合規核心指標',
        blocks: withKeys([
          {
            title: '碳盤查',
            subtitle: 'Carbon Accounting',
            description: 'ISO 14064-1 / ISO 14067 國際標準自動對應',
            icon: 'co2',
            size: 8,
            stats: withKeys([
              { label: 'Scope 1', value: '1,240', unit: 'tCO2e', width: '45%' },
              { label: 'Scope 2', value: '4,820', unit: 'tCO2e', width: '75%' },
              { label: 'Scope 3', value: '12,650', unit: 'tCO2e', width: '90%' }
            ])
          },
          {
            title: '合規狀態',
            subtitle: 'Status',
            description: '當前法規遵從進度',
            icon: 'fact_check',
            size: 4,
            stats: withKeys([
              { label: 'CBAM 申報', value: '已就緒', unit: '', width: '100%' },
              { label: 'CSRD 對齊', value: '處理中', unit: '', width: '60%' }
            ])
          }
        ])
      },
      journeySection: {
        title: '合規實施路徑',
        subtitle: '從基礎盤查到全球披露的完整生命週期',
        steps: withKeys([
          { title: '數據採集', description: '整合 ERP 與生產線傳感器數據，建立自動化碳資產底座。', icon: 'sensors' },
          { title: '係數對齊', description: '調用全球領先的排放係數庫（如 Ecoinvent），確保數據科學性。', icon: 'analytics' },
          { title: '第三方驗證', description: '對接 SGS、TÜV 等國際驗證機構，產出符合標準的查驗報告。', icon: 'verified' },
          { title: '全球披露', description: '一鍵生成符合 CDP、GRI、ISSB 標準的對外公開報告。', icon: 'public' }
        ])
      }
    },
    {
      _id: 'solution-practices',
      _type: 'solution',
      title: '永續實踐',
      titleEnglish: 'Sustainable Practices',
      slug: { _type: 'slug', current: 'practices' },
      category: 'practices',
      description: '將永續理念轉化為可衡量的工業實踐。我們專注於循環經濟模型建立與智慧綠色建築系統，協助企業實現資源價值的最大化利用。',
      badgeText: 'Circular Economy Excellence',
      badgeIcon: 'rebase_edit',
      cta: { label: '預約專家實地評估', href: '#' },
      bentoSection: {
        title: '實踐矩陣',
        blocks: withKeys([
          {
            title: '循環經濟',
            subtitle: 'Circular Loop',
            description: '資源價值最大化路徑',
            icon: 'sync_alt',
            size: 8,
            stats: withKeys([
              { label: '生產優化', value: '98', unit: '%', width: '98%' },
              { label: '餘熱回收', value: '45', unit: '%', width: '45%' }
            ])
          },
          {
            title: '智慧能效',
            subtitle: 'Energy Efficiency',
            description: 'AIOT 負載監控',
            icon: 'bolt',
            size: 4,
            stats: withKeys([
              { label: '優化率', value: '35', unit: '%', width: '35%' }
            ])
          }
        ])
      },
      caseStudySection: withKeys([
        {
          title: '鋼渣轉水泥閉環系統',
          description: '成功將生產過程中的副產品「鋼渣」轉化為高品質水泥原料。每年減少 12 萬噸廢棄物，創造 800 萬美元收益。',
          tags: ['Waste to Value', 'Steel Industry']
        }
      ])
    },
    {
      _id: 'solution-materials',
      _type: 'solution',
      title: '綠色材料',
      titleEnglish: 'Green Materials',
      slug: { _type: 'slug', current: 'materials' },
      category: 'materials',
      description: '定義低碳工業的未來。我們提供高性能、低足跡的鋼鐵與石墨材料解決方案，助力企業從源頭降低供應鏈碳強度。',
      badgeText: 'Sustainable Material Lab',
      badgeIcon: 'biotech',
      cta: { label: '獲取材料技術手冊', href: '#' },
      bentoSection: {
        title: '高性能低碳材料',
        blocks: withKeys([
          {
            title: '低碳鋼鐵',
            subtitle: 'EcoSteel™',
            description: '廢鋼比 95% + 氫能冶煉工藝',
            icon: 'precision_manufacturing',
            size: 6,
            stats: withKeys([{ label: '碳強度', value: '0.45', unit: 'tCO2e/t', width: '25%' }])
          },
          {
            title: '高性能石墨',
            subtitle: 'Graphite+',
            description: '全自動化低能耗提純技術',
            icon: 'science',
            size: 6,
            stats: withKeys([{ label: '純度', value: '99.9', unit: '%', width: '99.9%' }])
          }
        ])
      }
    },
    {
      _id: 'solution-finance',
      _type: 'solution',
      title: '戰略金融',
      titleEnglish: 'Strategy & Finance',
      slug: { _type: 'slug', current: 'finance' },
      category: 'finance',
      description: '連接永續戰略與金融價值。我們協助企業提升 ESG 評級，並對接全球綠色金融資源，加速低碳轉型進程。',
      badgeText: 'Strategic Advisory',
      badgeIcon: 'trending_up',
      cta: { label: '開展 ESG 評級診斷', href: '#' },
      bentoSection: {
        title: '金融轉型指標',
        blocks: withKeys([
          {
            title: 'ESG 評級優化',
            subtitle: 'Rating Boost',
            description: 'MSCI / S&P 評級提升路徑',
            icon: 'analytics',
            size: 6,
            stats: withKeys([
              { label: 'MSCI Rating', value: 'AA', unit: '', width: '90%' },
              { label: 'S&P Global', value: '78', unit: '', width: '78%' }
            ])
          },
          {
            title: '綠色金融',
            subtitle: 'Green Finance',
            description: '對接歐盟永續分類法',
            icon: 'payments',
            size: 6
          }
        ])
      },
      journeySection: {
        title: '四階段轉型藍圖',
        subtitle: '從現狀評估到價值實現的標準化流程',
        steps: withKeys([
          { title: '基線評估', description: '全面盤點當前 ESG 表現與風險缺口。', icon: 'radar' },
          { title: '戰略制定', description: '確立 2030/2050 減碳目標與實施路徑。', icon: 'architecture' },
          { title: '管理執行', description: '建立組織內部 ESG 治理委員會與考核機制。', icon: 'groups' },
          { title: '價值傳遞', description: '產出高品質披露報告，並對接資本市場。', icon: 'campaign' }
        ])
      }
    }
  ];

  for (const sol of solutions) {
    try {
      await client.createOrReplace(sol);
      console.log(`✅ Fixed & Migrated Solution: ${sol.title}`);
    } catch (e) {
      console.error(`❌ Failed to migrate ${sol.title}:`, e.message);
    }
  }

  console.log('✨ Fixed migration completed!');
}

migrate().catch(err => {
  console.error('💥 Migration failed:', err);
  process.exit(1);
});
