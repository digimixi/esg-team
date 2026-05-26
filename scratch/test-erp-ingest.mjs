import fetch from 'node-fetch'; // Requires node-fetch or native fetch in Node 18+

/**
 * 模擬 B2B ERP 系統直連測試
 * 測試前，請先在 Sanity 後台：
 * 1. 勾選某個企業的 "Enterprise 企業版授權"
 * 2. 在該企業的 "ERP 直連 API Key" 欄位填入: esg_erp_test_token_1234567890abcdef
 */
const API_URL = 'http://localhost:3000/api/erp/ingest';
const API_KEY = 'esg_erp_test_token_1234567890abcdef';

const payload = {
  transactions: [
    {
      id: `EXT-SAP-${Date.now()}-A`,
      date: new Date().toISOString().split('T')[0],
      material: '高階冷軋鋼捲 (SPCC)',
      category: 'steel',
      volume: 150.5,
      intensity: 2.1,
      breakdown: {
        extraction: 1.0,
        manufacturing: 0.9,
        logistics: 0.2
      }
    },
    {
      id: `EXT-SAP-${Date.now()}-B`,
      date: new Date().toISOString().split('T')[0],
      material: '特種石墨電極 (UHP)',
      category: 'graphite',
      volume: 25.0,
      intensity: 4.5,
      breakdown: {
        extraction: 2.0,
        manufacturing: 2.0,
        logistics: 0.5
      }
    }
  ]
};

async function runTest() {
  console.log(`[Test] 發送 ERP 模擬數據至 ${API_URL}...`);
  console.log(`[Test] 使用 API Key: ${API_KEY}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 測試成功 (Success):', data);
    } else {
      console.error('❌ 測試失敗 (Failed):', response.status, data);
    }
  } catch (error) {
    console.error('💥 網路或執行錯誤 (Error):', error.message);
  }
}

runTest();
