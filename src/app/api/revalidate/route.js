import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/revalidate
 * 按需快取重新驗證 API (On-demand ISR Revalidation Gateway)
 * 
 * 安全密鑰驗證：比對 REVALIDATE_SECRET 環境變數，防範惡意刷流量
 * 支援參數：
 *  - secret: 安全密鑰 (必填)
 *  - path: 重新整理的特定路徑，如 / 或 /solutions
 *  - hubSlug: 重新整理特定產業專區及其下屬所有子路由 (首頁, 產品, 行情, 供應鏈)
 *  - all: 設為 true 時，自動從 Sanity 動態獲取所有 active 專題與 solutions，一鍵刷新全站靜態快取
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');
    const hubSlug = searchParams.get('hubSlug');
    const all = searchParams.get('all');

    // 1. 安全密鑰驗證
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'esg-revalidate-token-2026';
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: '⚠️ 權限拒絕：安全密鑰驗證失敗 (Unauthorized: Invalid secret token)' },
        { status: 401 }
      );
    }

    const revalidatedPaths = [];

    // 2. 一鍵刷新全站快取 (動態查庫重新驗證)
    if (all === 'true') {
      console.log('[Revalidate API] Starting full-site dynamic revalidation...');
      
      // 2a. 刷新基礎靜態路由
      const basePaths = ['/', '/solutions'];
      for (const p of basePaths) {
        revalidatePath(p);
        revalidatedPaths.push(p);
      }

      // 2b. 動態查詢所有 active 的專題專區
      try {
        const activeHubs = await client.fetch(
          `*[_type == "hub" && isActive != false]{ "slug": slug.current }`,
          {},
          { useCdn: false }
        );
        
        for (const hub of activeHubs) {
          if (hub.slug) {
            const hPaths = [
              `/hubs/${hub.slug}`,
              `/hubs/${hub.slug}/products`,
              `/hubs/${hub.slug}/market`,
              `/hubs/${hub.slug}/supply-chain`
            ];
            for (const hp of hPaths) {
              revalidatePath(hp);
              revalidatedPaths.push(hp);
            }
          }
        }
      } catch (err) {
        console.error('[Revalidate API] Failed to fetch hubs for revalidation:', err.message);
      }

      // 2c. 動態查詢所有解決方案頁面
      try {
        const activeSolutions = await client.fetch(
          `*[_type == "solution"]{ "slug": slug.current }`,
          {},
          { useCdn: false }
        );
        
        for (const sol of activeSolutions) {
          if (sol.slug) {
            const sp = `/solutions/${sol.slug}`;
            revalidatePath(sp);
            revalidatedPaths.push(sp);
          }
        }
      } catch (err) {
        console.error('[Revalidate API] Failed to fetch solutions for revalidation:', err.message);
      }

    } 
    // 3. 刷新單個產業專區的所有子路徑
    else if (hubSlug) {
      const hubPaths = [
        `/hubs/${hubSlug}`,
        `/hubs/${hubSlug}/products`,
        `/hubs/${hubSlug}/market`,
        `/hubs/${hubSlug}/supply-chain`
      ];
      for (const hp of hubPaths) {
        revalidatePath(hp);
        revalidatedPaths.push(hp);
      }
    } 
    // 4. 刷新單個特定路徑
    else if (path) {
      revalidatePath(path);
      revalidatedPaths.push(path);
    } 
    // 5. 無提供有效刷新標的
    else {
      return NextResponse.json(
        { error: '⚠️ 請提供有效刷新參數 (Provide either path, hubSlug, or all=true)' },
        { status: 400 }
      );
    }

    console.log(`[Revalidate API] Successfully revalidated ${revalidatedPaths.length} paths.`);
    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      count: revalidatedPaths.length,
      paths: revalidatedPaths
    });

  } catch (error) {
    console.error('[Revalidate API] Critical execution error:', error.message);
    return NextResponse.json(
      { error: '🔥 伺服器內部錯誤，刷新失敗', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/revalidate
 * Webhook 自動快取刷新中樞 (Auto-ISR Webhook Gateway)
 * 
 * 接收並處理來自 Sanity Webhook 的變更 Payload，精準重新驗證前台受影響的靜態頁面快取。
 */
export async function POST(req) {
  try {
    // 1. 安全密鑰與標頭校驗
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret') || req.headers.get('x-revalidate-secret');
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'esg-revalidate-token-2026';
    
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: '⚠️ 權限拒絕：安全密鑰驗證失敗 (Unauthorized: Invalid secret token)' },
        { status: 401 }
      );
    }

    // 2. 解析變更 Payload
    const body = await req.json();
    const type = body._type; // Sanity 文檔類型 (如 solution, hub, product 等)
    const slug = body.slug || body.slug?.current || body._slug || body.slugValue; // 提煉 slug 值

    console.log(`[Revalidate Webhook] 📡 收到 Webhook 請求。類型: ${type}, Slug: ${slug}`);

    const revalidatedPaths = [];

    // 3. 智能解析並清除指定快取路徑
    if (type === 'solution') {
      // 解決方案變更：刷新解決方案總列表與特定解決方案分頁
      const paths = ['/solutions'];
      if (slug) {
        paths.push(`/solutions/${slug}`);
      }
      for (const p of paths) {
        revalidatePath(p);
        revalidatedPaths.push(p);
      }
    } 
    else if (type === 'hub') {
      // 產業專區變更：刷新首頁(因為有首頁展位)、該產業主頁、產品清單、市場動態與供應鏈子路徑
      revalidatePath('/');
      revalidatedPaths.push('/');
      
      if (slug) {
        const paths = [
          `/hubs/${slug}`,
          `/hubs/${slug}/products`,
          `/hubs/${slug}/market`,
          `/hubs/${slug}/supply-chain`
        ];
        for (const p of paths) {
          revalidatePath(p);
          revalidatedPaths.push(p);
        }
      }
    } 
    else if (type === 'product' || type === 'scope3Transaction' || type === 'industryBenchmark') {
      // 產品或碳交易指標變更：刷新首頁及解決方案首頁
      const paths = ['/', '/solutions'];
      for (const p of paths) {
        revalidatePath(p);
        revalidatedPaths.push(p);
      }
      
      // 若是有指定關聯的 hubSlug，同步重構該專區
      const assocHub = body.hubSlug || body.hub?.slug?.current || body.hub?.slug || body.assocHub;
      if (assocHub) {
        const hPaths = [
          `/hubs/${assocHub}`,
          `/hubs/${assocHub}/products`,
          `/hubs/${assocHub}/market`,
          `/hubs/${assocHub}/supply-chain`
        ];
        for (const hp of hPaths) {
          revalidatePath(hp);
          revalidatedPaths.push(hp);
        }
      }
    } 
    else {
      // 其他文件更新，刷新入口主頁
      revalidatePath('/');
      revalidatedPaths.push('/');
    }

    console.log(`[Revalidate Webhook] 🔄 Webhook 快取重構完成！共刷新了 ${revalidatedPaths.length} 個路徑。`);
    return NextResponse.json({
      revalidated: true,
      source: 'webhook',
      type,
      slug,
      count: revalidatedPaths.length,
      paths: revalidatedPaths,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Revalidate Webhook] 🔥 Webhook 執行錯誤:', error.message);
    return NextResponse.json(
      { error: '🔥 伺服器內部錯誤，Webhook 刷新失敗', details: error.message },
      { status: 500 }
    );
  }
}
