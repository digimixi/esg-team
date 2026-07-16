import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

const imagePaths = {
  hero: 'C:\\Users\\hence\\.gemini\\antigravity-ide\\brain\\0834df3c-639a-4e21-abb3-88a28df6c4f8\\agri_circular_hero_1784194901802.png',
  matrix: 'C:\\Users\\hence\\.gemini\\antigravity-ide\\brain\\0834df3c-639a-4e21-abb3-88a28df6c4f8\\agri_materials_matrix_1784194912094.png',
  flow: 'C:\\Users\\hence\\.gemini\\antigravity-ide\\brain\\0834df3c-639a-4e21-abb3-88a28df6c4f8\\agri_process_flow_1784194920888.png',
  card: 'C:\\Users\\hence\\.gemini\\antigravity-ide\\brain\\0834df3c-639a-4e21-abb3-88a28df6c4f8\\jiufu_tech_card_1784194932106.png',
  interviewHero: 'C:\\Users\\hence\\.gemini\\antigravity-ide\\brain\\0834df3c-639a-4e21-abb3-88a28df6c4f8\\jiufu_interview_hero_1784194950323.png',
  diagram: 'C:\\Users\\hence\\.gemini\\antigravity-ide\\brain\\0834df3c-639a-4e21-abb3-88a28df6c4f8\\jiufu_process_diagram_1784194958561.png',
  balance: 'C:\\Users\\hence\\.gemini\\antigravity-ide\\brain\\0834df3c-639a-4e21-abb3-88a28df6c4f8\\jiufu_benefit_balance_1784194966671.png',
  record: 'C:\\Users\\hence\\.gemini\\antigravity-ide\\brain\\0834df3c-639a-4e21-abb3-88a28df6c4f8\\jiufu_validation_record_1784194977407.png'
};

async function uploadImage(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(filePath)
  });
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id
    }
  };
}

async function seed() {
  console.log('Uploading images...');
  const heroImg = await uploadImage(imagePaths.hero);
  const flowImg = await uploadImage(imagePaths.flow);
  
  const interviewHeroImg = await uploadImage(imagePaths.interviewHero);
  const diagramImg = await uploadImage(imagePaths.diagram);

  console.log('Creating Hub Document...');
  const hubDoc = {
    _type: 'hub',
    _id: 'hub-agri-food-circularity',
    title: '農食循環經濟與有機剩餘資源再生',
    slug: { _type: 'slug', current: 'agri-food-circularity' },
    isActive: true,
    tags: ['循環經濟', '農食資源'],
    heroSubtitle: 'Connecting Agri-Food Residues, Resource Recovery, and Verifiable Sustainability',
    heroDescription: '從食品加工廠、農會到農產集貨場，esg.team 協助企業探索可行的剩餘資源減量與轉化路徑。',
    heroImage: heroImg,
    themeColor: '#10b981',
    heroSubtitleColor: '#10b981',
    features: [
      {
        _key: 'feat-1',
        title: '資源適配',
        description: [{ _type: 'block', children: [{ _type: 'span', text: '優先考慮較高價值、較低能耗且可合法運作的方案' }] }],
        icon: 'recycling'
      },
      {
        _key: 'feat-2',
        title: '場域評估',
        description: [{ _type: 'block', children: [{ _type: 'span', text: '考量可用空間、電力、燃料、排水及人員操作' }] }],
        icon: 'factory'
      }
    ],
    featureImage: flowImg
  };
  const createdHub = await client.createOrReplace(hubDoc);
  console.log(`Hub created: ${createdHub._id}`);

  console.log('Creating Tech Observation Document...');
  const obsDoc = {
    _type: 'techObservation',
    _id: 'techobs-jiufu-agri-food',
    title: '久富如何回應農食剩餘資源的場域處理需求？',
    subtitle: '從設備構想到示範驗證：一項仍需以物料、能耗、排放與產出物數據回答的循環技術觀察。',
    slug: { _type: 'slug', current: 'jiufu-agri-food-resource-recovery' },
    heroImage: interviewHeroImg,
    relatedHubs: [{ _type: 'reference', _ref: createdHub._id }],
    disclaimer: '本篇收錄代表企業願意進入產業對話與資料補強程序，不代表設備已通過 esg.team 認證。文中標示為「待驗證」之項目，須依特定物料與第三方檢測結果確認。',
    introduction: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '在食品加工、農會與農產集貨場域中，有機副產物的保存、清運與去化，往往同時牽涉成本、環境管理與季節性波動。久富提出場域型處理設備，希望降低部分農食剩餘物的外運需求。esg.team 透過本次採訪整理其設備構想、現有資料及仍待驗證的關鍵問題。' }]
      }
    ],
    companyBackground: [
      { _key: 'cb-1', item: '公司背景', content: '成立時間、主要業務、設備研發/製造角色', requirement: '附公司登記與團隊說明' },
      { _key: 'cb-2', item: '開發動機', content: '最初希望解決的物料與場域問題', requirement: '避免泛稱所有廢棄物' },
      { _key: 'cb-3', item: '設備名稱/型號', content: '正式商品名稱、型號與版本', requirement: '與銘牌、型錄一致' }
    ],
    howItWorks: {
      description: '久富表示，設備以熱轉化方式處理經分類與必要前處理的農食剩餘物。物料經由進料系統進入處理單元，在受控條件下完成減量或轉化，再由相關系統處理氣體、液體與固體產出。',
      diagram: diagramImg
    },
    materialApplicability: [
      { _key: 'ma-1', material: '稻殼、穀殼', status: '待驗證', statement: '潛在評估物料，待久富提供測試紀錄' },
      { _key: 'ma-2', material: '茶梗、茶渣', status: '待驗證', statement: '需確認乾濕狀態與含水率' },
      { _key: 'ma-3', material: '咖啡渣/果殼', status: '待驗證', statement: '待確認油脂、含水率及熱值' },
      { _key: 'ma-4', material: '混合廚餘', status: '不建議', statement: '暫不作為主要推廣物料' }
    ],
    techEvidence: [
      { _key: 'te-1', item: '單位時間處理量', claim: '待填寫', evidence: '型錄/操作紀錄待提供', status: '待驗證' },
      { _key: 'te-2', item: '適用物料與含水率', claim: '待填寫', evidence: '分物料測試紀錄待提供', status: '待驗證' },
      { _key: 'te-3', item: '電力/燃料消耗', claim: '待填寫', evidence: '電表、燃料及運轉時數紀錄待提供', status: '待驗證' },
      { _key: 'te-4', item: '廢氣排放', claim: '待填寫', evidence: '第三方檢測報告待提供', status: '關鍵門檻' }
    ],
    esgObservation: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '最有機會的切入場域，是具有單一、穩定物料來源且目前清運成本可被量化的食品或農產加工單位。第一階段應證明設備在特定物料下的處理能力，不應以「可處理多種廢棄物」作為主要賣點。設備成本效益不能只比較清運費，還要納入前處理、能源、操作人力、耗材、維修、檢測及產出物後端處理。' }]
      }
    ],
    faq: [
      { _key: 'fq-1', question: '久富最初為哪一種物料及場域開發此設備？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-2', question: '設備採用的正式技術名稱與處理原理是什麼？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-3', question: '物料進場前需要哪些分類、乾燥、破碎或脫水處理？', answer: '（待久富受訪回覆）' }
    ],
    cta: [
      { _key: 'ct-1', action: '提交物料進行評估', description: '取得潛在場域線索', requiredFields: '公司、場域、物料、數量、照片、現行成本' },
      { _key: 'ct-2', action: '申請示範合作', description: '尋找可測試且願意記錄數據的場域', requiredFields: '測試物料、可用空間、配合檢測及資料公開程度' }
    ]
  };

  const createdObs = await client.createOrReplace(obsDoc);
  console.log(`Tech Observation created: ${createdObs._id}`);
  
  console.log('Done!');
}

seed().catch(console.error);
