import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
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

async function reseed() {
  console.log('Fetching existing documents to preserve images...');
  
  const existingObs = await client.fetch('*[_id == "techobs-jiufu-agri-food"][0]');
  
  if (!existingObs) {
    console.error('techObservation doc not found, please run seed-agri-hub.mjs first');
    return;
  }

  console.log('Updating Tech Observation with full PDF content...');
  
  const updatedObsDoc = {
    ...existingObs,
    introduction: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'esg.team 關注的不是單一設備宣傳，而是新型循環技術如何面對真實場域問題。久富設備若要進入食品與農業場域，必須回答物料邊界、處理能力、能源投入、污染防制、產出物性質與長期維護等問題。本專題因此採用「企業說明＋文件佐證＋平台觀察＋場域驗證」四層揭露。' }]
      }
    ],
    companyBackground: [
      { _key: 'cb-1', item: '公司背景', content: '成立時間、主要業務、設備研發／製造角色', requirement: '附公司登記與團隊說明' },
      { _key: 'cb-2', item: '開發動機', content: '最初希望解決的物料與場域問題', requirement: '避免泛稱所有廢棄物' },
      { _key: 'cb-3', item: '設備名稱／型號', content: '正式商品名稱、型號與版本', requirement: '與銘牌、型錄一致' },
      { _key: 'cb-4', item: '技術來源', content: '自主研發、授權、合作或代工關係', requirement: '說明權利與責任主體' },
      { _key: 'cb-5', item: '現階段狀態', content: '概念機、測試機、示範機或商用設備', requirement: '列出已運轉地點與期間' },
      { _key: 'cb-6', item: '售後能力', content: '安裝、教育、維護、耗材、故障支援', requirement: '提供責任單位及服務範圍' }
    ],
    howItWorks: {
      ...existingObs.howItWorks,
      description: '久富表示，設備以＿＿＿＿方式處理經分類與必要前處理的農食剩餘物。物料經由＿＿＿＿進入處理單元，在＿＿＿＿條件下完成減量或轉化，再由＿＿＿＿系統處理氣體、液體與固體產出。上述流程仍須以正式流程圖、操作手冊與測試紀錄確認。\n\n(註：上稿前不可自行將設備定義為氣化爐、裂解爐、焚化爐、生物炭設備或無氧碳化設備；應以久富正式技術文件及法規認定一致的名稱為準。)',
    },
    materialApplicability: [
      { _key: 'ma-1', material: '稻殼、穀殼', status: '待久富提供測試紀錄', statement: '潛在評估物料，不宣稱已適用' },
      { _key: 'ma-2', material: '茶梗、茶渣', status: '待確認乾濕狀態與含水率', statement: '需經物料條件確認' },
      { _key: 'ma-3', material: '咖啡渣／果殼', status: '待確認油脂、含水率及熱值', statement: '建議先進行小量測試' },
      { _key: 'ma-4', material: '果皮、果渣', status: '高含水率可能影響能耗', statement: '須評估脫水或前處理' },
      { _key: 'ma-5', material: '蔬菜修整物', status: '成分與含水率變動較大', statement: '依場域批次個別評估' },
      { _key: 'ma-6', material: '混合廚餘', status: '不列為第一階段示範', statement: '暫不作為主要推廣物料' },
      { _key: 'ma-7', material: '含塑膠／金屬包材', status: '必須分離', statement: '不得以混合投入作為宣傳' }
    ],
    techEvidence: [
      { _key: 'te-1', item: '單位時間處理量', claim: '待久富填寫', evidence: '型錄／操作紀錄待提供', status: '待驗證' },
      { _key: 'te-2', item: '適用物料與含水率', claim: '待久富填寫', evidence: '分物料測試紀錄待提供', status: '待驗證' },
      { _key: 'te-3', item: '減量率', claim: '待久富填寫', evidence: '處理前後秤重紀錄待提供', status: '待驗證' },
      { _key: 'te-4', item: '電力／燃料消耗', claim: '待久富填寫', evidence: '電表、燃料及運轉時數紀錄待提供', status: '待驗證' },
      { _key: 'te-5', item: '廢氣排放', claim: '待久富填寫', evidence: '第三方檢測報告待提供', status: '關鍵門檻' },
      { _key: 'te-6', item: '廢水／冷凝液', claim: '待久富填寫', evidence: '水質或處置紀錄待提供', status: '待驗證' },
      { _key: 'te-7', item: '固體產出物', claim: '待久富填寫', evidence: '成分、重金屬及性質檢測待提供', status: '待驗證' },
      { _key: 'te-8', item: '連續運轉穩定性', claim: '待久富填寫', evidence: '累積時數、停機及故障紀錄待提供', status: '待驗證' },
      { _key: 'te-9', item: '維護與耗材', claim: '待久富填寫', evidence: '維護手冊與成本表待提供', status: '待補資料' },
      { _key: 'te-10', item: '法規與場域條件', claim: '待久富填寫', evidence: '主管機關或專業意見待提供', status: '待補資料' }
    ],
    esgObservation: [
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '• 最有機會的切入場域，是具有單一、穩定物料來源且目前清運成本可被量化的食品或農產加工單位。' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '• 第一階段應證明設備在特定物料下的處理能力，不應以「可處理多種廢棄物」作為主要賣點。' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '• 設備成本效益不能只比較清運費，還要納入前處理、能源、操作人力、耗材、維修、檢測及產出物後端處理。' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '• 減碳效益必須同時計算避免外運或替代處理的效益，以及設備本身的能源與排放。' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '• 產出物必須經檢測並確認合法用途，才能進一步討論材料化、能源化或其他資源利用。' }] }
    ],
    verificationProcess: [
      '17. 選定單一來源物料，記錄產生製程與批次。',
      '18. 進行含水率、灰分、油脂、鹽分、異物與必要成分檢測。',
      '19. 以小量測試確認進料、操作、處理時間及安全條件。',
      '20. 記錄處理前後重量、體積、能源、人工與耗材。',
      '21. 針對氣體、液體與固體產出進行必要檢測。',
      '22. 比較現行清運方案與設備方案的全成本及環境績效。',
      '23. 由場域、久富、esg.team 與第三方共同形成示範紀錄。'
    ],
    faq: [
      { _key: 'fq-24', question: '久富最初為哪一種物料及場域開發此設備？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-25', question: '設備採用的正式技術名稱與處理原理是什麼？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-26', question: '哪些物料已有實際測試，測試條件與累積運轉時數為何？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-27', question: '物料進場前需要哪些分類、乾燥、破碎或脫水處理？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-28', question: '設備每小時／每日處理量如何定義，是否包含停機、升溫及清理時間？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-29', question: '每噸物料需要多少電力、燃料、人工與耗材？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-30', question: '氣體、液體及固體產出分別如何處理？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-31', question: '現有排放檢測由誰執行，對應哪一設備型號與物料？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-32', question: '處理後固體產出物的成分及目前合法去向為何？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-33', question: '設備價格約 1,600 萬元包含哪些項目，不包含哪些土建與污染防制工程？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-34', question: '保固、維護週期、耗材、故障回應與操作教育如何安排？', answer: '（待久富受訪回覆）' },
      { _key: 'fq-35', question: '久富願意如何參與示範場域、第三方檢測及數據公開？', answer: '（待久富受訪回覆）' }
    ],
    cta: [
      { _key: 'ct-1', action: '提交物料進行評估', description: '取得潛在場域線索', requiredFields: '公司、場域、物料、數量、照片、現行成本' },
      { _key: 'ct-2', action: '申請示範合作', description: '尋找可測試且願意記錄數據的場域', requiredFields: '測試物料、可用空間、配合檢測及資料公開程度' },
      { _key: 'ct-3', action: '索取久富資料', description: '提供久富已確認可公開的文件', requiredFields: '申請單位、用途、所需資料、保密需求' },
      { _key: 'ct-4', action: '第三方驗證合作', description: '媒合檢測、顧問與研究單位', requiredFields: '機構能力、可驗證項目、服務地區' }
    ]
  };

  await client.createOrReplace(updatedObsDoc);
  console.log('Updated techObservation doc with full content!');
}

reseed().catch(console.error);
