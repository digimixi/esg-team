import { NextResponse } from 'next/server';
import { verifyErpApiKey, checkRateLimit } from '@/lib/erpAuth';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/erp/ingest
 * B2B ERP 自動直連 API 接收端點
 *
 * 接受外部 ERP 或 EMS 系統自動推送的排碳數據，將其轉換並寫入為 `scope3Transaction` 文件。
 */
export async function POST(req) {
  try {
    // 1. 從 Header 提取 API Key
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Missing or invalid Authorization header' },
        { status: 401 }
      );
    }
    const apiKey = authHeader.replace('Bearer ', '').trim();

    // 2. 驗證 API Key 與企業授權
    const { isValid, company, error } = await verifyErpApiKey(apiKey);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: `Forbidden: ${error}` },
        { status: 403 }
      );
    }

    // 3. 流量控制 (Rate Limiting)
    if (!checkRateLimit(company._id)) {
      return NextResponse.json(
        { success: false, error: 'Too Many Requests: Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // 4. 解析 Payload 數據
    const payload = await req.json();

    // 簡易 Schema 驗證
    if (!payload.transactions || !Array.isArray(payload.transactions)) {
      return NextResponse.json(
        { success: false, error: 'Bad Request: "transactions" array is required in the payload' },
        { status: 400 }
      );
    }

    // 5. 轉換與寫入 Sanity 資料庫
    const writePromises = payload.transactions.map(async (tx) => {
      // 若客戶端未提供 ID，後端自動生成一個追蹤 ID
      const txId = tx.id || `erp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newDoc = {
        _type: 'scope3Transaction',
        id: txId,
        date: tx.date || new Date().toISOString().split('T')[0],
        supplier: company.name, // 強制使用綁定企業的名稱，防偽造
        material: tx.material || 'ERP Synced Material',
        category: tx.category || 'steel', // 預設 steel 或依照 payload 傳入
        volume: Number(tx.volume) || 0,
        intensity: Number(tx.intensity) || 0,
        emissions: Number(tx.emissions) || (Number(tx.volume) * Number(tx.intensity)),
        status: 'erp-synced', // 強制標記為 ERP 系統直連，具備高可信度
        auditor: '自動化系統對接 (Auto-Synced)',
        standard: tx.standard || 'ERP/EMS Data Direct Integration',
        breakdown: tx.breakdown || {
          extraction: 0,
          manufacturing: 0,
          logistics: 0
        }
      };

      // 為了安全，應該使用設定了 token 的 client，這裡假設已經在 client 中設定了寫入權限，
      // 若尚未設定，可使用 process.env.SANITY_WRITE_TOKEN。
      const writeClient = client.withConfig({
        token: process.env.SANITY_WRITE_TOKEN
      });

      return writeClient.create(newDoc);
    });

    const results = await Promise.allSettled(writePromises);

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`[ERP Ingest] Processed batch for ${company.name}: ${successful} success, ${failed} failed.`);

    return NextResponse.json({
      success: true,
      message: `Successfully ingested data for enterprise: ${company.name}`,
      stats: {
        totalReceived: payload.transactions.length,
        successful,
        failed
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[ERP Ingest] Internal server error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
