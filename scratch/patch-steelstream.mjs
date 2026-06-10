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
  apiVersion: '2024-03-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

async function run() {
  try {
    console.log('🔄 Fetching SteelStream hub document...');
    const hub = await client.fetch(`*[_type == "hub" && slug.current == "steelstream"][0]`);
    
    if (!hub) {
      console.error('❌ Could not find hub with slug "steelstream". Are you sure it exists?');
      return;
    }

    console.log(`✅ Found hub: ${hub._id}. Patching data...`);

    const updatedData = {
      heroSubtitle: '為鋼鐵、鑄造與金屬製造業提供增碳劑、石墨電極、石墨坩堝與鋼材供應鏈方案，支援批次追溯、品質檢驗、碳數據準備與第三方查證需求。',
      heroDescription: 'SteelStream 協助客戶從規格確認、樣品測試、批次檢驗到 ESG / 碳資料準備，建立更穩定、可查核、可長期合作的冶金材料供應來源。',
      
      // Clean old features to avoid duplication
      features: [],
      specGroups: [],

      trustSection: {
        isActive: true,
        title: '不只供貨，更重視可追溯與可稽核',
        description: '對鋼鐵、鑄造與出口型製造業而言，材料價格只是採購決策的一部分。供應來源是否穩定、檢驗資料是否完整、批次是否可追溯、碳數據是否能被客戶或第三方查核，將越來越影響供應商選擇。\n\nSteelStream 以品質文件、批次管理與碳資料準備作為供應鏈基礎，協助客戶降低導入新材料時的品質、交期與合規風險。',
        points: []
      },

      materialFocus: [
        {
          _key: 'mat1',
          title: '以增碳劑作為低風險的供應鏈導入起點',
          materialName: '增碳劑',
          description: '增碳劑是鋼鐵與鑄造製程中較容易先行測試與比較的材料。SteelStream 可依客戶需求提供不同固定碳、硫、氮、灰分、水分與粒度條件的產品，並建立批次追溯與碳資料準備機制。',
          bullets: [
            {
              _key: 'b1',
              groupTitle: '可提供資料與支援',
              items: [
                '固定碳、硫、氮、灰分、揮發分、水分與粒度檢驗',
                'COA 與批次檢驗報告',
                '原料來源與生產批次追溯',
                '每噸產品製造碳足跡資料準備',
                '產品含碳量與潛在氧化 CO2 計算',
                '樣品測試與小批量試用安排'
              ]
            }
          ],
          ctaText: '申請增碳劑樣品'
        },
        {
          _key: 'mat2',
          title: '為電弧爐與冶金製程建立第二供應來源',
          materialName: '石墨電極',
          description: '石墨電極導入需綜合評估爐況、接頭、耗損率、斷裂風險、電流負荷、操作條件與供應穩定性。SteelStream 協助客戶進行規格比對、技術資料交換、小批試用與第二供應來源評估。',
          bullets: [
            {
              _key: 'b2',
              groupTitle: '規格評估項目',
              items: [
                'UHP、HP、RP 規格需求',
                '電極直徑、長度、接頭型式',
                '電阻率、體積密度、抗折強度、熱膨脹係數',
                '既有使用品牌與耗用數據',
                '試用批次與風險控管',
                '供應期、交期與安全庫存安排'
              ]
            }
          ],
          ctaText: '預約石墨電極供應鏈討論'
        }
      ],

      aiInsight: {
        isActive: true,
        trendLabel: '警戒',
        insightText: '鋼鐵與鑄造供應鏈正同時面臨原料價格波動、供應穩定性、產品碳足跡與客戶稽核要求。對出口型製造業而言，能否取得可追溯、可計算、可查證的材料資料，將逐漸成為供應商選擇的重要條件。',
        confidenceScore: 98.5,
        analysisDate: new Date().toISOString()
      },

      processSteps: {
        isActive: true,
        title: '合作流程',
        steps: [
          { _key: 's1', title: '1. 需求確認', description: '了解產品類型、規格、月用量、應用製程與 ESG 資料需求。' },
          { _key: 's2', title: '2. 規格與文件比對', description: '提供產品規格、COA 範例、批次追溯說明與碳資料格式。' },
          { _key: 's3', title: '3. 樣品或小批測試', description: '依客戶製程安排增碳劑樣品、石墨坩堝試用或石墨電極小批導入評估。' },
          { _key: 's4', title: '4. 測試結果回饋', description: '比較品質、使用效果、成本、穩定性與文件完整度。' },
          { _key: 's5', title: '5. 供應方案建立', description: '確認價格、交期、包裝、檢驗項目、批次文件與長期供應條件。' },
          { _key: 's6', title: '6. ESG 資料補強', description: '依客戶需求逐步建立碳足跡、供應商稽核與第三方驗證資料。' }
        ]
      }
    };

    await client.patch(hub._id).set(updatedData).commit();
    console.log('✅ Successfully updated SteelStream hub data!');

    // Delete UHP600
    console.log('🔄 Checking for UHP600 to delete...');
    const uhp600 = await client.fetch(`*[_type == "marketIndex" && title match "測試UHP600"][0]`);
    if (uhp600) {
      await client.delete(uhp600._id);
      console.log(`✅ Successfully deleted UHP600 index document (${uhp600._id}).`);
    } else {
      console.log('ℹ️ No UHP600 document found. Might be already deleted.');
    }

  } catch (err) {
    console.error('❌ Error updating Sanity:', err);
  }
}

run();
