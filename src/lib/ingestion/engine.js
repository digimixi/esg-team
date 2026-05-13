import { client } from '../../sanity/lib/client';

/**
 * esg.team Data Ingestion Engine
 * 負責協調不同來源的數據採集並同步至 Sanity
 */
export async function runIngestion(sourceName) {
  console.log(`[Ingestion] Starting task for: ${sourceName}`);
  
  try {
    // 1. 動態載入採集來源插件
    const source = await import(`./sources/${sourceName}.js`);
    
    // 2. 執行採集邏輯
    const data = await source.fetchData();
    
    // 3. 處理並轉換數據
    const processedData = await source.transform(data);
    
    // 4. 更新至 Sanity (採用 createOrReplace 確保不存在時會自動建立)
    for (const item of processedData) {
      await client.createOrReplace(item);
      console.log(`[Ingestion] Synced: ${item._id}`);
    }
    
    return { success: true, count: processedData.length };
  } catch (error) {
    console.error(`[Ingestion] Error during ${sourceName}:`, error);
    return { success: false, error: error.message };
  }
}
