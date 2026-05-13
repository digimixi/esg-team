import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return Response.json({ error: 'Missing image data' }, { status: 400 });
    }

    // 1. 初始化 Gemini 模型 (使用 Pro 視覺版)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // 2. 設定專業的 Prompt：要求提取鋼鐵業相關數據
    const prompt = `
      你是一個專業的 ESG 碳盤查稽核員。請分析這張單據圖片（可能是電費單、油單、或發票），
      並以 JSON 格式提取以下資訊：
      1. activityType: 'electricity', 'fuel', 'material', 或 'other'
      2. value: 數值 (例如度數、公升、公噸)
      3. period: 計費週期 (例如 2024/01-2024/02)
      4. vendor: 開立單位名稱
      5. taxId: 單據上的統一編號
      6. confidence: 0-1 信心度評分
      7. auditNote: 一句話的內稽專業註記

      請只回傳 JSON 字串。
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || 'image/jpeg'
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // 清理可能存在的 markdown code blocks
    const jsonString = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonString);

    return Response.json({
      success: true,
      analysis: data
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return Response.json({ error: 'AI 辨識失敗', details: error.message }, { status: 500 });
  }
}
