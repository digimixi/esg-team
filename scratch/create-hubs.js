import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-05-01'
});

const hubs = [
  {
    _type: 'hub',
    _id: 'hub-graphite-crucible',
    title: '石墨坩堝專題',
    slug: { _type: 'slug', current: 'graphite-crucible' },
    isActive: true,
    themeColor: '#FFFFFF',
    tags: ['有色金屬冶煉', '壓鑄'],
    searchKeywords: '石墨坩堝, 鋁合金, 銅冶煉, 碳化矽坩堝, 黏土石墨, 壓鑄',
    heroSubtitle: '耐極端高溫的冶煉心臟',
    heroDescription: '專為有色金屬冶煉、貴金屬鑄造與高階壓鑄設計。抗熱震、高導熱，顯著節省熔爐能源，實現高效能綠色冶煉。',
    heroDescriptionEnglish: 'The Heart of High-Temp Smelting. Superior thermal shock resistance and thermal conductivity for non-ferrous metal smelting.',
    features: [
      {
        _key: 'feat-1',
        title: '極致抗熱震性',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '耐受急冷急熱，延長使用壽命，降低停機換鍋成本。' }] }],
        icon: 'thermostat'
      },
      {
        _key: 'feat-2',
        title: '卓越導熱效能',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '高導熱率大幅縮短熔煉時間，降低天然氣與電力消耗。' }] }],
        icon: 'energy_savings_leaf'
      },
      {
        _key: 'feat-3',
        title: '抗氧化釉面技術',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '特殊防氧化塗層，隔絕金屬氧化物侵蝕，保持純淨熔湯。' }] }],
        icon: 'shield'
      }
    ],
    specGroups: [
      {
        _key: 'spec-1',
        title: '碳化矽石墨坩堝 (SiC Graphite)',
        icon: 'science',
        description: '適用於鋁合金、鋅合金壓鑄及熔煉，超高導熱與耐腐蝕。',
        specs: [
          { _key: 's1', label: '體積密度', value: '1.75 - 1.85 g/cm³' },
          { _key: 's2', label: '顯氣孔率', value: '< 20%' },
          { _key: 's3', label: '抗折強度', value: '15 - 20 MPa' }
        ]
      }
    ],
    aiInsight: {
      isActive: true,
      trendLabel: '需求強勁',
      insightText: '隨著全球電動車 (EV) 銷量大增，鋁合金一體化壓鑄 (Megacasting) 需求爆發，帶動大容量、長壽命優質碳化矽石墨坩堝的市場需求穩定成長。',
      confidenceScore: 88,
      analysisDate: new Date().toISOString()
    }
  },
  {
    _type: 'hub',
    _id: 'hub-carbon-additive',
    title: '增碳劑專題',
    slug: { _type: 'slug', current: 'carbon-additive' },
    isActive: true,
    themeColor: '#FFFFFF',
    tags: ['電弧爐', '綠色煉鋼', '鑄鐵'],
    searchKeywords: '增碳劑, 煆燒石油焦, CPC, 普煆煤, 電弧爐, 鑄造, 煉鋼, 低硫',
    heroSubtitle: '高效綠色煉鋼的碳元素補給',
    heroDescription: '提供煉鋼與鑄鐵最優質的碳補給方案。高吸收率、低硫、低灰分，有效減少爐渣與能耗，推進電弧爐 (EAF) 綠色轉型。',
    heroDescriptionEnglish: 'Premium Carbon Raisers for Green Steelmaking. High absorption, low sulfur & low ash content for efficient EAF operations.',
    features: [
      {
        _key: 'feat-1',
        title: '超高碳吸收率',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '石墨化石油焦吸收率可達 95% 以上，減少添加量與時間。' }] }],
        icon: 'trending_up'
      },
      {
        _key: 'feat-2',
        title: '極低硫與低氮',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '嚴控硫氮含量，防止鋼材脆化與氣孔產生，提升金屬品質。' }] }],
        icon: 'filter_alt'
      },
      {
        _key: 'feat-3',
        title: '工業共生與循環經濟',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '採用石化副產物高價值化，降低天然資源開採碳足跡。' }] }],
        icon: 'recycling'
      }
    ],
    specGroups: [
      {
        _key: 'spec-1',
        title: '煆燒石油焦 (CPC) / 石墨化石油焦 (GPC)',
        icon: 'precision_manufacturing',
        description: '高階鑄造與煉鋼首選，碳排穩定、雜質極低。',
        specs: [
          { _key: 's1', label: '固定碳 (Fixed Carbon)', value: '98.5% - 99.5%' },
          { _key: 's2', label: '硫含量 (Sulfur)', value: '< 0.05% (GPC)' },
          { _key: 's3', label: '水分 (Moisture)', value: '< 0.5%' }
        ]
      }
    ],
    aiInsight: {
      isActive: true,
      trendLabel: '看多',
      insightText: '歐盟 CBAM 與全球減碳壓力加速了全球鋼鐵業由高爐 (BOF) 轉向電弧爐 (EAF)。EAF 廢鋼冶煉對高品質低硫增碳劑的需求正呈現結構性增長。',
      confidenceScore: 92,
      analysisDate: new Date().toISOString()
    }
  },
  {
    _type: 'hub',
    _id: 'hub-specialty-graphite',
    title: '特殊石墨產品專題',
    slug: { _type: 'slug', current: 'specialty-graphite' },
    isActive: true,
    themeColor: '#FFFFFF',
    tags: ['精密加工', '半導體', '太陽能'],
    searchKeywords: '特殊石墨, 石墨加工, 等靜壓石墨, 半導體, 太陽能熱場, 石墨轉子, 雙極板',
    heroSubtitle: '驅動次世代科技的精密石墨材料',
    heroDescription: '從等靜壓石墨配方到高精密 CNC 加工的一條龍服務。專為半導體 EDM、太陽能光電與燃料電池提供具備 ±0.01mm 極致公差的石墨零組件。',
    heroDescriptionEnglish: 'Precision Graphite for Next-Gen Technologies. From isostatic molding to ultra-precise CNC machining for semiconductor and PV industries.',
    features: [
      {
        _key: 'feat-1',
        title: '材料配方多樣性',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '提供擠壓 (Extruded)、模壓 (Molded)、等靜壓 (Isostatic) 各級石墨基材。' }] }],
        icon: 'layers'
      },
      {
        _key: 'feat-2',
        title: '高科技精密加工',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '高精度 CNC 加工中心，實現複雜幾何形狀與極致公差 (±0.01mm)。' }] }],
        icon: 'settings_b_roll'
      },
      {
        _key: 'feat-3',
        title: '賦能綠能科技',
        description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '為單晶矽生長爐熱場與氫能雙極板提供關鍵材料，具備正向碳手印。' }] }],
        icon: 'eco'
      }
    ],
    specGroups: [
      {
        _key: 'spec-1',
        title: '等靜壓石墨 (Isostatic Graphite)',
        icon: 'compress',
        description: '組織均勻、各向同性，適合 EDM 放電加工與高溫半導體應用。',
        specs: [
          { _key: 's1', label: '體積密度 (Bulk Density)', value: '1.82 - 1.90 g/cm³' },
          { _key: 's2', label: '抗壓強度 (Compressive Strength)', value: '80 - 120 MPa' },
          { _key: 's3', label: '電阻率 (Specific Resistance)', value: '10 - 15 μΩ·m' },
          { _key: 's4', label: '肖氏硬度 (Shore Hardness)', value: '50 - 70' }
        ]
      }
    ],
    aiInsight: {
      isActive: true,
      trendLabel: '穩定轉型',
      insightText: '全球半導體產能擴張與第三代半導體 (SiC) 爆發，帶動等靜壓高純石墨耗材需求；同時太陽能 N 型電池迭代也推升了高階石墨熱場元件的用量。',
      confidenceScore: 90,
      analysisDate: new Date().toISOString()
    }
  }
];

async function seedHubs() {
  console.log('Seeding Hubs into Sanity...');
  const transaction = client.transaction();
  
  for (const hub of hubs) {
    transaction.createOrReplace(hub);
  }

  try {
    await transaction.commit();
    console.log('✅ Successfully created/updated the 3 new Hubs in Sanity!');
  } catch (err) {
    console.error('❌ Error creating Hubs:', err.message);
  }
}

seedHubs();
