import Parser from 'rss-parser';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 設定 Sanity 連線資訊
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '2euox6d1',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

// 設定 Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const parser = new Parser();

const FEEDS = [
  {
    url: 'https://worldsteel.org/feed/',
    hubSlug: 'graphite', 
    sourceName: 'World Steel Association'
  },
  {
    url: 'http://blog.steel-technology.com/feed',
    hubSlug: 'graphite',
    sourceName: 'Steel Technology'
  }
];

async function translateWithAI(title, excerpt) {
  try {
    const prompt = `你是一位專業的工業與 ESG 產業分析師。請將以下這則產業新聞的標題與摘要翻譯成專業的「繁體中文（台灣）」。
要求：
1. 語氣必須具備權威感與專業感。
2. 標題要簡明扼要。
3. 摘要請精煉在 150 字以內，保留核心產業洞察。
4. 輸出格式必須是純 JSON，格式如下：{"title": "中文標題", "excerpt": "中文摘要"}。

原文標題：${title}
原文摘要：${excerpt}

請直接輸出 JSON 內容：`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // 移除可能存在的 Markdown 代碼塊標籤
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('AI 翻譯失敗，使用原文替代:', error.message);
    return { title, excerpt };
  }
}

async function sync() {
  console.log('--- 開始同步與 AI 智能翻譯 ---');
  
  const hubs = await client.fetch('*[_type == "hub"]{ _id, "slug": slug.current }');
  const hubMap = Object.fromEntries(hubs.map(h => [h.slug, h._id]));

  for (const feed of FEEDS) {
    console.log(`正在抓取來源: ${feed.sourceName}...`);
    try {
      const feedData = await parser.parseURL(feed.url);
      const targetHubId = hubMap[feed.hubSlug];
      
      if (!targetHubId) continue;

      for (const item of feedData.items.slice(0, 3)) {
        const docId = `insight-sync-${Buffer.from(item.link).toString('base64').substring(0, 30)}`;
        
        // 先檢查是否已經存在，避免重複調用 AI 浪費額度
        const existing = await client.fetch('*[_id == $id][0]', { id: docId });
        if (existing) {
          console.log(`跳過已存在的內容: ${item.title}`);
          continue;
        }

        console.log(`正在處理新文章: ${item.title}...`);
        
        // 呼叫 Gemini AI 進行翻譯與摘要
        const translated = await translateWithAI(item.title, item.contentSnippet || item.content);

        const insightDoc = {
          _type: 'insight',
          _id: docId,
          title: translated.title,
          excerpt: translated.excerpt,
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          source: feed.sourceName,
          externalUrl: item.link,
          hub: {
            _type: 'reference',
            _ref: targetHubId
          }
        };

        await client.createOrReplace(insightDoc);
        console.log(`成功發布 AI 編譯內容: ${translated.title}`);
      }
    } catch (error) {
      console.error(`處理 ${feed.sourceName} 失敗:`, error.message);
    }
  }
  
  console.log('--- 智能同步完成 ---');
}

sync();
