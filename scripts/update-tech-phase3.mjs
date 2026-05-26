import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: 'skSfdwN6ajKMSqJ2kjAoB7bfdAcdVsxy9HYxFYoGYH87ZlR9fvtL56ZHRRvdkSNKgXUOnjIFDtUXmaNkw8k4QicvOyeExTIWOtRLgUO3pqrClRdfdXVlYsG1QDJObDo6T8N4kYayw72q74M5DoKpeVLxuOMQrVKOHeM0nFuXD2va1wMjz98w',
  useCdn: false,
  apiVersion: '2026-05-07',
});

async function run() {
  console.log('📡 [Sanity Sync] Updating Phase 3 systemTech details...');
  try {
    const result = await client
      .patch('8cbbc16d-9c57-4d88-b3b3-0a3e206eb0a2')
      .set({
        benefit: `本專案採「文檔與沙盒先行，正式功能在運作中與種子客戶磨合開發」的漸進式 B2B 共同創作策略。目前已進入沙盒先行開發與對外展示階段。

升級開發步驟與實施階段：
步驟 1：【沙盒與文檔門戶先行】在後台情報指揮中心建置「B2B 整合開發者中心 (Developer Portal)」測試版，提供 OpenAPI 標準對接規格說明，並佈署輕量化 Mock 測試 API 及說明問戶，用極低的技術成本創造 Enterprise 付費商務門票與 IT 安全預審通道。
步驟 2：【種子客戶實體磨合】商業正式運轉初期，篩選 1-2 家有極強 Scope 3 自動化需求之合約品牌商加入 Early Adopter 計畫，以其真實之 SAP/Oracle ERP 輸出資料格式與系統進行小規模對接磨合，動態修正資料管道。
步驟 3：【高客單價正式上線】磨合完成後，正式啟動對外 Enterprise 企業版計費定價階梯，全面開放實時 ERP 對接與邊緣 IoT 物聯網自動排碳同步。`,
        status: 'standby' // 仍為 standby (規劃/沙盒先行中)
      })
      .commit();
    console.log('✅ Phase 3 systemTech details successfully updated in Sanity! Title:', result.title);
  } catch (err) {
    console.error('❌ Failed to update Sanity Phase 3 doc:', err.message);
  }
}

run();
