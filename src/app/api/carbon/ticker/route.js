import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

const DEFAULT_FALLBACK_PRICE = 85.0;

/**
 * GET /api/carbon/ticker
 * 實時碳價與容災快取 API
 * 
 * 優先讀取 Sanity 資料庫快取（避免觸發外部 API rate limits 與網路延遲），
 * 支援自動化無感降級：當資料庫為空或查詢異常時，自動回傳 85 EUR 保底安全值，
 * 並回傳小時更新差 (hoursAgo)，利於前端判讀是否為離線備份數據。
 */
export async function GET() {
  try {
    // 優先查詢 Sanity 快取文件（支援 ID 鎖定及多重模糊容錯比對）
    const doc = await client.fetch(
      `*[_type == "marketIndex" && (_id == "index-carbon-eu" || name match "*EUA*" || name match "*歐盟*")][0]`,
      {},
      { useCdn: false, next: { revalidate: 0 } }
    );

    if (!doc || typeof doc.value !== 'number') {
      console.warn('[Ticker API] Sanity document not found or invalid price. Falling back to default.');
      return NextResponse.json({
        value: DEFAULT_FALLBACK_PRICE,
        trendPercentage: '—',
        trendStatus: 'neutral',
        lastSync: new Date().toISOString(),
        hoursAgo: null,
        isOfflineFallback: true,
        source: 'default_fallback'
      });
    }

    // 計算數據更新時間差（小時）
    const lastSyncStr = doc.lastSync || doc._updatedAt;
    let hoursAgo = 0;
    let isOfflineFallback = false;

    if (lastSyncStr) {
      const lastSyncTime = new Date(lastSyncStr).getTime();
      const now = Date.now();
      const diffMs = now - lastSyncTime;
      hoursAgo = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
      
      // 數據超過 24 小時未更新，標記為離線備份數據
      if (hoursAgo > 24) {
        isOfflineFallback = true;
      }
    } else {
      isOfflineFallback = true;
    }

    return NextResponse.json({
      value: parseFloat(doc.value.toFixed(2)),
      trendPercentage: doc.trendPercentage || '—',
      trendStatus: doc.trendStatus || 'neutral',
      lastSync: lastSyncStr || new Date().toISOString(),
      hoursAgo,
      isOfflineFallback,
      source: 'sanity_cache'
    });

  } catch (error) {
    console.error('[Ticker API] Critical disaster fallback activated due to fetch error:', error.message);
    
    // 當資料庫故障或斷網時，進行 100% 安全降級回傳，絕不崩潰
    return NextResponse.json({
      value: DEFAULT_FALLBACK_PRICE,
      trendPercentage: '—',
      trendStatus: 'neutral',
      lastSync: new Date().toISOString(),
      hoursAgo: null,
      isOfflineFallback: true,
      source: 'disaster_recovery_fallback',
      error: error.message
    });
  }
}
