import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// 不要設定 _id，因為我們將使用 patch() 
const patchData = {
  title: 'ESG.team 轉型專題',
  slug: { _type: 'slug', current: 'esg_info' },
  isActive: true,
  themeColor: '#10B981', // ESG Emerald
  searchKeywords: '顧問, 盤查, 轉型, ESG, 減碳, 供應鏈',
  heroSubtitle: 'From Carbon Reporting to Material Transformation',
  heroDescription: '從碳揭露走向供應鏈材料轉型。企業已完成碳盤查與永續報告，但下一步更重要的是：如何找到具有碳數據、來源可追溯、符合 ESG 要求的材料與供應鏈。ESG.team 串連：ESG 顧問、製造企業、綠色材料供應商，讓 ESG 從報告走向真正改善。',
  features: [
    {
      _key: 'f1',
      title: 'Measure',
      description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '精準量測碳排' }] }],
      icon: 'straighten'
    },
    {
      _key: 'f2',
      title: 'Identify',
      description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '發現高碳熱點' }] }],
      icon: 'search'
    },
    {
      _key: 'f3',
      title: 'Replace',
      description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '導入綠色材料' }] }],
      icon: 'swap_horiz'
    },
    {
      _key: 'f4',
      title: 'Report',
      description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '成效驗證與報告' }] }],
      icon: 'description'
    }
  ],
  prospectMap: {
    isActive: true,
    title: 'Taiwan Steel-Linked Prospect Map',
    subtitle: '台灣鋼鐵關聯產業潛在客戶地圖',
    description: 'ESG 顧問不一定直接服務鋼鐵廠，但在碳盤查、永續報告、供應鏈盤點與客戶問卷過程中，會接觸大量使用鋼材、鑄件、扣件、金屬零件與高溫製程耗材的企業。這些企業正是 ESG Material Solutions 的導入場景。',
    rows: [
      { _key: 'r1', priority: 'S級', companyName: '東和鋼鐵 (TWSE: 2006)', position: '上游 (煉鋼/鋼胚)', productType: '電弧爐、鋼筋型鋼', painPoints: '廢鋼來源追溯、高爐轉電爐碳排', materials: ['石墨電極', '增碳劑'], pitch: '東和鋼鐵推動電爐製程，我們有批次追溯的石墨電極能協助穩定碳排係數。', verification: 'Verified' },
      { _key: 'r2', priority: 'S級', companyName: '豐興鋼鐵 (TWSE: 2015)', position: '上游 (煉鋼/鋼胚)', productType: '條線、型鋼', painPoints: '電爐能效管理、碳費徵收衝擊', materials: ['石墨電極', '增碳劑'], pitch: '面對碳費，高純度增碳劑與低消耗石墨電極能直接降低 Scope 1 排碳。', verification: 'Verified' },
      { _key: 'r3', priority: 'A級', companyName: '威致鋼鐵 (TWSE: 2028)', position: '上游 (煉鋼/鋼胚)', productType: '鋼筋、棒線', painPoints: '南部高碳排壓力、出口限制', materials: ['石墨電極', '增碳劑'], pitch: '南部電爐廠首當其衝，我們可以從材料源頭提供 COA 與碳盤查所需數據。', verification: 'Estimated' },
      { _key: 'r4', priority: 'A級', companyName: '海光企業 (TWSE: 2038)', position: '上游 (煉鋼/鋼胚)', productType: '鋼胚、鋼筋', painPoints: '原料碳足跡、供應鏈減碳', materials: ['石墨電極', '增碳劑'], pitch: '海光積極轉型，我們可以作為具備碳資料的備援供應商。', verification: 'Estimated' },

      { _key: 'r5', priority: 'S級', companyName: '中鴻鋼鐵 (TWSE: 2014)', position: '中游 (熱軋/冷軋/製管)', productType: '熱軋、冷軋', painPoints: '下游車廠要求低碳鋼、CBAM 申報', materials: ['低碳鋼材', 'Material Passport'], pitch: '中鴻下游多為外銷導向，導入低碳鋼材與材料護照能鞏固歐美訂單。', verification: 'Verified' },
      { _key: 'r6', priority: 'A級', companyName: '燁輝企業 (TWSE: 2023)', position: '中游 (熱軋/冷軋/製管)', productType: '鍍鋅、烤漆鋼捲', painPoints: '塗層與製程碳排、CBAM', materials: ['低碳鋼材'], pitch: '鍍鋅產品出口歐洲比例高，源頭碳足跡 (Scope 3) 管理是首要任務。', verification: 'Verified' },
      { _key: 'r7', priority: 'A級', companyName: '盛餘鋼鐵 (TWSE: 2029)', position: '中游 (熱軋/冷軋/製管)', productType: '鍍鋅、烤漆鋼板', painPoints: '日系母公司嚴格 ESG 要求', materials: ['低碳鋼材', 'Material Passport'], pitch: '配合日系母公司 JFE 減碳目標，我們能提供符合國際標準的材料履歷。', verification: 'Estimated' },
      { _key: 'r8', priority: 'B級', companyName: '允強實業 (TWSE: 2034)', position: '中游 (熱軋/冷軋/製管)', productType: '不鏽鋼管/板', painPoints: '不鏽鋼高碳排特性、出口碳稅', materials: ['碳資料溯源'], pitch: '不鏽鋼出口極易受 CBAM 影響，清晰的碳資料溯源是必備防護罩。', verification: 'Verified' },

      { _key: 'r9', priority: 'S級', companyName: '春雨 (TWSE: 2012)', position: '下游 (扣件/線材)', productType: '螺絲、螺帽、線材', painPoints: '歐美扣件客戶強力要求 Scope 3', materials: ['低碳鋼材', 'Material Passport'], pitch: '歐洲扣件買家正在轉換供應商，導入具備材料護照的低碳鋼材能搶佔轉單效應。', verification: 'Verified' },
      { _key: 'r10', priority: 'S級', companyName: '三星科技 (TWSE: 5007)', position: '下游 (扣件/線材)', productType: '螺帽、汽車扣件', painPoints: '國際車廠供應鏈稽核、碳關稅', materials: ['碳資料溯源'], pitch: '車廠對碳足跡要求極嚴，我們可以協助建立扣件材料的碳資料溯源。', verification: 'Verified' },
      { _key: 'r11', priority: 'A級', companyName: '恒耀國際 (TWSE: 8349)', position: '下游 (扣件/線材)', productType: '汽車扣件', painPoints: '全球車廠減碳目標連動', materials: ['低碳鋼材'], pitch: 'Tesla 等車廠要求供應鏈減碳，改用低碳鋼材是唯一解方。', verification: 'Verified' },

      { _key: 'r12', priority: 'S級', companyName: '和大工業 (TWSE: 1536)', position: '下游 (鑄造/鍛造/熱處理)', productType: '汽車傳動零件', painPoints: '熱處理與鍛造高耗能、車廠 ESG 要求', materials: ['低碳鋼材'], pitch: '除了製程改善，導入低碳胚料能一次性大幅降低產品碳足跡。', verification: 'Verified' },
      { _key: 'r13', priority: 'A級', companyName: '永冠-KY (TWSE: 1589)', position: '下游 (鑄造/鍛造/熱處理)', productType: '風電鑄件', painPoints: '綠能供應鏈的矛盾 (本身高碳排)', materials: ['增碳劑', '碳資料溯源'], pitch: '作為風電供應鏈，自身製程的碳管理必須無懈可擊，我們能優化碳源數據。', verification: 'Verified' },
      { _key: 'r14', priority: 'A級', companyName: '光隆精密-KY (TWSE: 3281)', position: '下游 (鑄造/鍛造/熱處理)', productType: '商用車鑄鐵件', painPoints: '商用車廠的 Scope 3 管理', materials: ['增碳劑', '石墨坩堝'], pitch: '鑄鐵製程中的增碳劑與耗材，若能取得碳數據，將是 ESG 報告的亮點。', verification: 'Estimated' },
      { _key: 'r15', priority: 'B級', companyName: '勤美 (TWSE: 1532)', position: '下游 (鑄造/鍛造/熱處理)', productType: '鑄鐵、金屬成型', painPoints: '傳統鑄造廠轉型壓力', materials: ['增碳劑', '石墨坩堝'], pitch: '傳統鑄造轉型 ESG，從材料源頭（高品質增碳劑、長壽命坩堝）建立減碳實績。', verification: 'Verified' },

      { _key: 'r16', priority: 'B級', companyName: '中鋼構 (TWSE: 2013)', position: '下游 (鋼構/營建)', productType: '鋼構工程', painPoints: '公共工程 ESG 評分、綠建築要求', materials: ['低碳鋼材', '鋼渣循環材料'], pitch: '綠建築與重大工程越來越看重減碳，採用循環材料能提高競標分數。', verification: 'Verified' },
      { _key: 'r17', priority: 'B級', companyName: '長榮鋼鐵 (TWSE: 2211)', position: '下游 (鋼構/營建)', productType: '鋼構工程、環保工程', painPoints: '雙軸轉型 (營建+環保) 的數據整合', materials: ['低碳鋼材', '鋼渣循環材料'], pitch: '將鋼渣循環材料融入環保工程，能極大化長榮鋼鐵的循環經濟論述。', verification: 'Estimated' }
    ]
  },
  materialFocus: [
    {
      _key: 'm1',
      title: '石墨電極供應鏈',
      materialName: 'Graphite Electrode',
      description: '適用於電弧爐鋼廠。提供原料來源、規格、COA、批次追溯、碳資料。',
      ctaText: '索取供應方案',
      bullets: [{ _key: 'b1', groupTitle: '核心價值', items: ['品質檢驗', '批次追溯', '碳數據'] }]
    },
    {
      _key: 'm2',
      title: '增碳劑供應鏈',
      materialName: 'Carbon Additive',
      description: '適用於鑄造與電爐。提供固定碳、灰分、硫、氮及批次資料。',
      ctaText: '預約樣品測試',
      bullets: [{ _key: 'b1', groupTitle: '核心價值', items: ['品質檢驗', '批次追溯', '碳數據'] }]
    }
  ],
  processSteps: {
    isActive: true,
    title: 'ESG 顧問如何創造改變',
    steps: [
      { _key: 's1', title: '1. 進入企業盤查', description: '進入企業進行碳盤查' },
      { _key: 's2', title: '2. 發現高碳熱點', description: '發現高碳材料與供應鏈風險' },
      { _key: 's3', title: '3. 導入方案', description: '導入 ESG Material Solutions' },
      { _key: 's4', title: '4. 建立材料履歷', description: '建立材料履歷與改善數據' },
      { _key: 's5', title: '5. 反映在報告', description: '反映在 ESG 報告與客戶供應鏈評分' }
    ]
  }
};

async function run() {
  try {
    console.log('正在更新 esg_info Hub 資料 (patching)...');
    const result = await client.patch('71b8117c-61bb-4d9e-a8ff-4fd7d866e472').set(patchData).commit();
    console.log('✅ esg_info Hub 更新成功:', result._id);
  } catch (error) {
    console.error('❌ 更新失敗:', error.message);
  }
}

run();
