import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

// 建立具備寫入權限的客戶端
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

// 初始化 Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { url, keywords } = await req.json();

    if (!url) {
      return NextResponse.json({ error: '請提供網址' }, { status: 400 });
    }

    // 1. 抓取網頁內容 (加入瀏覽器偽裝)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });
    const rawHtml = await response.text();
    
    // 預處理：保留連結資訊，同時移除無效標籤
    let processedHtml = rawHtml
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, '');
      
    // 將 <a> 標籤轉換為 "文字 (網址)" 的格式，讓 AI 能看見連結
    processedHtml = processedHtml.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gim, ' [$2]($1) ');

    const cleanContent = processedHtml
      .replace(/<[^>]*>/g, ' ') // 現在再移除剩餘的 HTML 標籤
      .replace(/\s+/g, ' ')     // 壓縮空白
      .substring(0, 25000);     // 保持足夠長度
    
    console.log(`[Ingest] Cleaned content length: ${cleanContent.length}`);
    
    // 1. 取得所有可用的專題 (Hubs) 資訊
    const activeHubs = await writeClient.fetch(`*[_type == "hub" && isActive == true] { _id, title, searchKeywords }`);
    const hubContext = activeHubs.map(h => `- ${h.title} (ID: ${h._id}, 關鍵字: ${h.searchKeywords || '無'})`).join('\n');

    // 2. 呼叫 Gemini AI 進行分析與分類
    // 強制設定為 JSON 模式
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const prompt = `
      你是一個專業的 ESG 產業情報官。請分析以下網頁文字內容，並提取出最具新聞價值的相關文章（最多 10 篇）。
      
      【現有的專題 (Hubs)】:
      ${hubContext}
      
      【分析規則】:
      1. 判斷每一篇文章是否與上述任何專題相關。
      2. 如果文章內容提及鋼鐵、電爐、石墨電極、碳素材料、減碳技術等關鍵字，請優先分類至對應的專題。
      3. 輸出格式必須是純 JSON 陣列。
      4. hubIds 欄位必須是一個陣列，包含所有匹配的專題 ID。如果不匹配任何專題，請留空陣列 []。
      
      【輸出 JSON 格式範例】:
      [
        {
          "title": "文章標題",
          "summary": "100字以內的精簡摘要",
          "category": "政策 / 產業 / 市場",
          "hubIds": ["hub-id-1", "hub-id-2"],
          "source": "媒體名稱"
        }
      ]

      網頁文字內容：
      ${cleanContent.substring(0, 15000)}
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    let text = aiResponse.text();
    
    // 清理可能的 Markdown 標記（雖然已經設定 JSON 模式，但保險起見）
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    const extractedData = JSON.parse(text);

    // 3. 將資料寫入 Sanity (加入去重機制)
    const results = [];
    for (const item of extractedData) {
      // 補全相對路徑 (例如 /news/123 -> https://udn.com/news/123)
      const targetUrl = item.externalUrl && item.externalUrl.startsWith('http') 
        ? item.externalUrl 
        : (item.externalUrl && !item.externalUrl.startsWith('#') ? new URL(item.externalUrl, url).href : url);

      // 使用 URL 生成唯一 ID，防止重複採集
      const urlHash = crypto.createHash('md5').update(targetUrl).digest('hex');
      const deterministicId = `insight-${urlHash}`;

      const doc = {
        _id: deterministicId, // 這是關鍵：有了固定 ID，重複寫入會被忽略
        _type: 'insight',
        title: item.title,
        summary: item.summary,
        externalUrl: targetUrl,
        source: item.source || '外部採集',
        publishedAt: new Date().toISOString(),
        category: item.category || 'Market Update',
        isActive: true,
        hubs: item.hubIds && item.hubIds.length > 0 
          ? item.hubIds.map(id => ({ _type: 'reference', _ref: id }))
          : []
      };
      
      // 使用 createIfNotExists 確保不重複
      const created = await writeClient.createIfNotExists(doc);
      results.push(created);
    }

    return NextResponse.json({ 
      success: true, 
      count: results.length,
      data: results 
    });

  } catch (error) {
    console.error('採集失敗:', error);
    return NextResponse.json({ error: '採集失敗: ' + error.message }, { status: 500 });
  }
}
