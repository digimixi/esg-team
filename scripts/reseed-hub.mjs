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

async function reseedHub() {
  console.log('Fetching existing hub document...');
  
  const existingHub = await client.fetch('*[_id == "hub-agri-food-circularity"][0]');
  
  if (!existingHub) {
    console.error('Hub doc not found.');
    return;
  }

  console.log('Patching Hub with full PDF content (A2, A3, A4, A6)...');
  
  await client.patch(existingHub._id)
    .set({
      // A2 產業問題 -> specGroups
      specGroups: [
        {
          _key: 'sg-1',
          title: '產業現況與痛點',
          icon: 'warning',
          description: '多數場域將副產物直接視為一般廢棄物付費清運，或是尋找非正式管道去化，面臨清運中斷或法規查核的風險。',
          specs: [
            { _key: 'sp-1', label: '常見痛點', value: '清運成本持續攀升' },
            { _key: 'sp-2', label: '主要困境', value: '難去化、保存不易' },
            { _key: 'sp-3', label: '專題關注', value: '在地合法減量轉化' }
          ]
        }
      ],
      // A3 從廢棄物處理轉向資源適配 -> features
      features: [
        { _key: 'ft-1', title: '資源適配', description: [{ _type: 'block', children: [{ _type: 'span', text: '優先考慮較高價值、較低能耗且可合法運作的方案' }] }], icon: 'recycling' },
        { _key: 'ft-2', title: '場域評估', description: [{ _type: 'block', children: [{ _type: 'span', text: '考量可用空間、電力、燃料、排水及人員操作' }] }], icon: 'factory' },
        { _key: 'ft-3', title: '財務與法規', description: [{ _type: 'block', children: [{ _type: 'span', text: '除比較清運費，須納入設備投資、運轉成本及污染防制' }] }], icon: 'account_balance' },
        { _key: 'ft-4', title: '減碳效益', description: [{ _type: 'block', children: [{ _type: 'span', text: '從依賴外運轉向在地處理，探討能源或材料替代' }] }], icon: 'co2' },
        { _key: 'ft-5', title: '第三方驗證', description: [{ _type: 'block', children: [{ _type: 'span', text: '設備處理量能與排放標準，交由合格機構實際驗證' }] }], icon: 'verified' },
        { _key: 'ft-6', title: '數據治理', description: [{ _type: 'block', children: [{ _type: 'span', text: '建立長期記錄，作為供應鏈 ESG 揭露憑證' }] }], icon: 'database' }
      ],
      // A4 優先探索場域 -> materialFocus
      materialFocus: [
        { 
          _key: 'mf-1', 
          materialName: '稻殼與穀殼', 
          title: '農會、碾米廠', 
          description: '熱值較高，關注氣化或裂解能源轉化潛力。',
        },
        { 
          _key: 'mf-2', 
          materialName: '咖啡渣與茶渣', 
          title: '飲料工廠、大型加工廠', 
          description: '含水率高，關注脫水乾燥與材料化（如包材、生質燃）潛力。'
        },
        { 
          _key: 'mf-3', 
          materialName: '果皮與果渣', 
          title: '果汁廠、果乾加工廠', 
          description: '關注快速腐敗問題，評估現地發酵或快速乾燥減量。'
        },
        { 
          _key: 'mf-4', 
          materialName: '蔬菜修整物', 
          title: '農產集貨場、截切廠', 
          description: '變異性大，關注堆肥轉化或生物燃氣發酵。'
        },
        { 
          _key: 'mf-5', 
          materialName: '乾燥植物纖維', 
          title: '農業副產物集中區', 
          description: '關注農業覆蓋物或材料轉化。'
        }
      ],
      // A6 合作流程 -> processSteps
      processSteps: {
        isActive: true,
        title: '示範場域驗證流程',
        steps: [
          { _key: 'ps-1', title: '初步評估', description: '提交物料與場域基本資料，由 esg.team 初步評估。' },
          { _key: 'ps-2', title: '資源媒合', description: '媒合適合的設備商或技術團隊。' },
          { _key: 'ps-3', title: '測試規劃', description: '確認設備適用性並規劃小量測試。' },
          { _key: 'ps-4', title: '實際運轉', description: '在測試場域實際運轉，記錄能耗與處理數據。' },
          { _key: 'ps-5', title: '排放驗證', description: '由第三方機構執行必要的廢氣或廢水檢測。' },
          { _key: 'ps-6', title: '發布成果', description: '建立示範案例，發布驗證報告。' }
        ]
      }
    })
    .commit();
    
  console.log('Updated hub document with full content!');
}

reseedHub().catch(console.error);
