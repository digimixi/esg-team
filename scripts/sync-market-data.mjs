import { MarketDataEngine } from '../src/lib/market/engine.js';
import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 載入環境變數
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_WRITE_TOKEN, // 需要寫入權限
  useCdn: false,
});

async function syncMarketData() {
  console.log('--- [Market Data Sync Start] ---');
  
  try {
    // 1. 取得所有設定了自動抓取的指數
    const indices = await client.fetch('*[_type == "marketIndex" && sourceProvider != "manual" && defined(sourceProvider)]');
    
    console.log(`Found ${indices.length} indices to sync.`);

    for (const index of indices) {
      try {
        // 2. 確定要抓取的 Symbol (如果是 custom 則抓取自定義欄位)
        const activeSymbol = index.sourceSymbol === 'custom' ? index.customSymbol : index.sourceSymbol;
        
        if (!activeSymbol || activeSymbol.startsWith('HEADER_')) {
          console.log(`[Skip] ${index.name} has no valid symbol.`);
          continue;
        }

        // 3. 抓取最新數據
        const newData = await MarketDataEngine.fetchIndex({
          provider: index.sourceProvider,
          symbol: activeSymbol
        });

        if (!newData) continue;

        // 3. 處理歷史數據 (如果目前是空的，則嘗試抓取過去 7 天數據)
        let newHistory = index.history || [];
        
        if (newHistory.length < 2) {
          console.log(`[Engine] Initializing history for ${index.name}...`);
          newHistory = await MarketDataEngine.fetchHistory({
            provider: index.sourceProvider,
            symbol: activeSymbol
          });
        } else {
          // 正常的滾動更新
          newHistory.push(newData.value);
          if (newHistory.length > 7) {
            newHistory = newHistory.slice(-7);
          }
        }

        // 4. 回寫到 Sanity
        await client
          .patch(index._id)
          .set({
            value: newData.value,
            trendPercentage: newData.trendPercentage,
            trendStatus: newData.trendStatus,
            history: newHistory,
            lastSync: newData.updatedAt
          })
          .commit();

        console.log(`✅ Successfully synced: ${index.name} (${newData.value})`);
      } catch (err) {
        console.error(`❌ Failed to sync ${index.name}:`, err.message);
      }
    }

  } catch (error) {
    console.error('Critical sync error:', error);
  }

  console.log('--- [Market Data Sync Finished] ---');
}

syncMarketData();
