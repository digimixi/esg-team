import { NextResponse } from 'next/server';
import { runIngestion } from '@/lib/ingestion/engine';
import { runAIAnalysis } from '@/lib/ai/analyst';

/**
 * GET /api/ingest?source=gridIntensity&ai=true
 * 用於觸發數據採集與 AI 洞察任務
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  const triggerAI = searchParams.get('ai') === 'true';

  if (!source) {
    return NextResponse.json({ error: 'Source parameter is required' }, { status: 400 });
  }

  // 1. 執行數據採集引擎
  const ingestResult = await runIngestion(source);
  
  // 2. 執行 AI 洞察分析 (如果參數 ai=true)
  let aiResult = { success: false, count: 0 };
  if (triggerAI) {
    aiResult = await runAIAnalysis();
  }

  const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ESG.team | 智能採集報告</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 24px; padding: 3rem; width: 100%; max-width: 550px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .status-icon { font-size: 3.5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.3)); }
        h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        p { color: #94a3b8; line-height: 1.6; margin-bottom: 2.5rem; }
        .stats-grid { display: grid; gap: 1rem; margin-bottom: 2.5rem; }
        .stat-card { background: #0f172a; padding: 1.25rem; border-radius: 16px; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
        .stat-value { font-size: 1.15rem; font-weight: 700; color: #38bdf8; margin-top: 0.25rem; }
        .badge { font-size: 0.65rem; padding: 0.25rem 0.6rem; rounded: 100px; background: #10b98120; color: #10b981; border: 1px solid #10b98140; border-radius: 99px; }
        .btn-group { display: flex; gap: 1rem; }
        .btn { flex: 1; text-align: center; padding: 1rem; border-radius: 12px; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-primary { background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%); color: #ffffff; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4); }
        .btn-outline { border: 1px solid #334155; color: #94a3b8; }
        .btn-outline:hover { background: #334155; color: #fff; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="status-icon">🧠</div>
        <h1>智能數據鏈路已更新</h1>
        <p>系統已完成權威數據採集，並成功啟動 ESG.AI 模型進行深度產業趨勢判斷與洞察生成。</p>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-label">數據採集狀態</div>
              <div class="stat-value">${source}</div>
            </div>
            <div class="badge">已同步 ${ingestResult.count || 0} 筆</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-label">AI 市場洞察</div>
              <div class="stat-value">已更新 ${aiResult.count || 0} 個專題</div>
            </div>
            <div class="badge" style="background: #8b5cf620; color: #a78bfa; border-color: #8b5cf640;">AI Powered</div>
          </div>
        </div>

        <div class="btn-group">
          <a href="/studio" class="btn btn-primary">進入管理後台</a>
          <a href="/" class="btn btn-outline">查看前台效果</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
