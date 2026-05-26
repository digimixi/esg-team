import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: 'skSfdwN6ajKMSqJ2kjAoB7bfdAcdVsxy9HYxFYoGYH87ZlR9fvtL56ZHRRvdkSNKgXUOnjIFDtUXmaNkw8k4QicvOyeExTIWOtRLgUO3pqrClRdfdXVlYsG1QDJObDo6T8N4kYayw72q74M5DoKpeVLxuOMQrVKOHeM0nFuXD2va1wMjz98w',
  useCdn: false,
  apiVersion: '2026-05-07',
});

async function run() {
  console.log('📡 [Sanity Sync] Starting systemTech update in dataset: production...');
  try {
    // 1. 🔑 JWT 簽章加密安全 Session 認證系統
    const jwtResult = await client
      .patch('94819378-1373-4f74-aaa2-30664a07e717')
      .set({
        status: 'active',
        deployedAt: '2026-05-21',
        benefit: '已完成實作 (第一階段)。後台安全校驗由純文字 Cookie 升級為內建密碼學安全 Session。採用 HttpOnly; Secure; SameSite=Strict Cookie 傳遞。底層基於內建 Web Crypto API (HMAC-SHA256 簽署校驗)，防杜任意篡改與前端越權，保障 100% 後台 API 絕對防禦力。'
      })
      .commit();
    console.log('✅ JWT Session System status successfully set to ACTIVE:', jwtResult.title);

    // 2. 🔄 Webhook 自動靜態快取刷新中樞
    const webhookResult = await client
      .patch('cae581c8-9acf-4f86-a1f3-a950bd504e3c')
      .set({
        status: 'active',
        deployedAt: '2026-05-21',
        benefit: '已完成實作 (第一階段，0 持續成本)。升級 Revalidate 快取網關支援安全密鑰驗證之 POST 接收端。對接 Sanity Groq Webhooks，當產品、專題、解決方案異動時，後台自動觸發秒級網頁快取精準重建，完全告別手動操作！'
      })
      .commit();
    console.log('✅ Webhook Auto-Revalidation System status successfully set to ACTIVE:', webhookResult.title);

  } catch (err) {
    console.error('❌ Failed to update Sanity documents:', err.message);
  }
}

run();
