import { client } from '@/sanity/lib/client';

/**
 * AI 永續分析引擎
 * 根據現有數據自動生成市場洞察
 */
export async function runAIAnalysis() {
  console.log('🚀 AI Analysis Engine Starting...');
  
  // 1. 獲取所有啟用的專題
  const hubs = await client.fetch(`*[_type == "hub" && isActive == true]`);
  let analyzedCount = 0;

  for (const hub of hubs) {
    // 2. 獲取該專題相關的基準數據
    const benchmarks = await client.fetch(
      `*[_type == "industryBenchmark" && (hub._ref == $hubId || category == "intensity")] | order(currentValue asc)`,
      { hubId: hub._id }
    );

    // 3. 獲取最新市場情報
    const latestInsights = await client.fetch(
      `*[_type == "insight" && references($hubId)] | order(publishedAt desc)[0...3]`,
      { hubId: hub._id }
    );

    // 4. [核心邏輯] 模擬 AI 根據數據生成判斷
    // 未來這裡可以直接串接 OpenAI API: const response = await openai.chat.completions.create(...)
    const analysis = generateMockAnalysis(hub.title, benchmarks, latestInsights);

    // 5. 將分析結果寫回 Sanity
    await client
      .patch(hub._id)
      .set({
        aiInsight: {
          isActive: true,
          trendLabel: analysis.trend,
          insightText: analysis.text,
          confidenceScore: analysis.confidence,
          analysisDate: new Date().toISOString()
        }
      })
      .commit();

    analyzedCount++;
    console.log(`✅ Analyzed Hub: ${hub.title}`);
  }

  return { success: true, count: analyzedCount };
}

/**
 * 模擬 AI 生成邏輯 (Heuristic Approach)
 */
function generateMockAnalysis(title, benchmarks, insights) {
  // 簡單的邏輯判斷：如果平均強度 > 0.45，則設為警戒
  const avgIntensity = benchmarks.reduce((acc, curr) => acc + curr.currentValue, 0) / (benchmarks.length || 1);
  
  let trend = '穩定轉型 (Stable)';
  let text = '';
  let confidence = 85 + Math.floor(Math.random() * 10);

  if (avgIntensity > 0.48) {
    trend = '風險預警 (High Risk)';
    text = `偵測到 ${title} 相關供應鏈之電力碳強度處於高位（平均 ${avgIntensity.toFixed(3)} gCO2e/kWh）。隨著國際碳邊境稅 (CBAM) 的收緊，依賴傳統電力的採購成本預計將上升 12-18%。建議企業立即評估具備綠色能源轉型計劃的供應商，以降低 Scope 3 曝險。`;
  } else if (avgIntensity < 0.35) {
    trend = '看多趨勢 (Bullish/Low Carbon)';
    text = `${title} 領域在低碳製程上展現明顯優勢。目前區域電力結構正加速向可再生能源轉型，帶動相關產品之「碳競爭力」大幅提升。對於重視永續供應鏈的品牌商而言，當前是鎖定長期供應協議的最佳時機。`;
  } else {
    text = `當前 ${title} 市場受全球能源價格波動影響，碳成本表現相對穩定。最新的情報顯示，主要生產商正逐步導入分散式光伏與儲能系統。短期內建議觀察區域排碳係數的季度調整，作為供應鏈佈局的動態參考。`;
  }

  return { trend, text, confidence };
}
