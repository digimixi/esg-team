import { createClient } from '@sanity/client';
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: '2euox6d1',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const parser = new Parser();

// 1. 專業行情與新聞源
const FEEDS = [
  { 
    name: 'SMM (中國行情-最新)', 
    url: 'https://rss.metal.com/news/the_latest.xml', 
    category: 'Market Price',
    hubSlug: 'graphite'
  },
  { 
    name: 'SMM (中國行情-報價)', 
    url: 'https://rss.metal.com/news/price_review_forecast.xml', 
    category: 'Market Price',
    hubSlug: 'graphite'
  },
  { 
    name: 'MetalMiner (國際行情)', 
    url: 'https://agmetalminer.com/feed/', 
    category: 'Global Analysis',
    hubSlug: 'graphite'
  },
  { 
    name: 'World Steel Association', 
    url: 'https://worldsteel.org/feed/', 
    category: 'Industry News',
    hubSlug: 'steel' 
  }
];

async function processWithAI(title, content) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      你是一位資深的鋼鐵與石墨產業分析師。請分析以下新聞內容：
      標題：${title}
      內容：${content}

      請執行以下任務：
      1. 將內容翻譯為專業的繁體中文。
      2. 撰寫一段 100 字內的專業摘要。
      3. **關鍵任務**：如果新聞中提到任何具體的「市場價格」或「漲跌幅（%）」，請以 JSON 格式提取出來。
      
      請嚴格按照以下 JSON 格式回覆：
      {
        "title": "翻譯後的標題",
        "summary": "專業摘要",
        "category": "分類(如：市場行情/供應鏈/政策)",
        "marketData": {
          "itemName": "產品名稱(如: 石墨電極)",
          "price": "提取的價格數字或區間",
          "trend": "漲跌符號與百分比(如: ▲ 1.2% 或 ▼ 0.5% 或 —)"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // 移除 markdown 區塊標記
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI Processing Error:', error);
    return null;
  }
}

async function sync() {
  console.log('--- 開始 AI 產業行情同步任務 ---');
  
  for (const feed of FEEDS) {
    console.log(`正在抓取: ${feed.name}...`);
    try {
      const feedData = await parser.parseURL(feed.url);
      
      // 獲取該 Hub 的 ID
      const hub = await client.fetch('*[_type == "hub" && slug.current == $slug][0]', { slug: feed.hubSlug });
      if (!hub) continue;

      for (const item of feedData.items.slice(0, 3)) { // 每次每個源取前 3 則
        const docId = `insight-sync-${Buffer.from(item.link).toString('base64').substring(0, 30)}`;
        
        // 檢查是否已存在
        const exists = await client.fetch('*[_id == $id][0]', { id: docId });
        if (exists) continue;

        console.log(`處理新文章: ${item.title}`);
        const aiResult = await processWithAI(item.title, item.contentSnippet || item.content);
        
        if (aiResult) {
          // A. 創建 Insight 文檔
          await client.createOrReplace({
            _id: docId,
            _type: 'insight',
            title: aiResult.title,
            excerpt: aiResult.summary,
            category: aiResult.category,
            publishedAt: item.isoDate || new Date().toISOString(),
            source: feed.name,
            externalUrl: item.link,
            hub: { _type: 'reference', _ref: hub._id },
            isActive: true, // 預設採用
            isFeatured: false
          });

          // B. 如果有提取到市場數據，更新 Market Index
          if (aiResult.marketData && aiResult.marketData.price !== "N/A") {
             console.log(`發現市場行情: ${aiResult.marketData.itemName} -> ${aiResult.marketData.price}`);
             
             // 尋找對應的 Market Index
             const indexDoc = await client.fetch('*[_type == "marketIndex" && name match $name][0]', { 
               name: `*${aiResult.marketData.itemName.substring(0,2)}*` 
             });

             if (indexDoc) {
               await client.patch(indexDoc._id)
                 .set({ 
                    value: aiResult.marketData.price, 
                    trend: aiResult.marketData.trend,
                    _updatedAt: new Date().toISOString()
                 })
                 .commit();
               console.log(`已自動更新行情指數: ${indexDoc.name}`);
             }
          }
        }
      }
    } catch (error) {
      console.error(`Feed Error (${feed.name}):`, error);
    }
  }
  console.log('--- 同步完成 ---');
}

sync();
