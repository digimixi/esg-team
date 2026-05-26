import { client } from '@/sanity/lib/client';
import crypto from 'crypto';

// In-Memory Rate Limiter Map (For Single Instance deployment)
const rateLimitMap = new Map();

// Rate limiting config
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

/**
 * 驗證 ERP API Key 並返回企業資訊
 * @param {string} apiKey 來自 Authorization Header 的金鑰
 * @returns {Promise<{isValid: boolean, company: Object|null, error: string|null}>}
 */
export async function verifyErpApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return { isValid: false, company: null, error: 'API Key 缺失或格式錯誤' };
  }

  // 避免 Sanity 查詢注入，限制長度與格式
  if (apiKey.length < 20 || apiKey.length > 100) {
    return { isValid: false, company: null, error: 'API Key 長度異常' };
  }

  try {
    // 查詢 Sanity 尋找匹配該 API Key 且具有 Enterprise 授權的企業
    const company = await client.fetch(
      `*[_type == "company" && erpApiKey == $apiKey && enterprisePlan == true][0]{
        _id,
        name,
        taxId,
        industry
      }`,
      { apiKey },
      { useCdn: false } // 必須查詢最新資料
    );

    if (!company) {
      return { isValid: false, company: null, error: '無效的 API Key 或企業未開通 Enterprise 授權' };
    }

    return { isValid: true, company, error: null };
  } catch (err) {
    console.error('[ERP Auth] Failed to verify API Key:', err);
    return { isValid: false, company: null, error: '資料庫驗證服務暫時無法使用' };
  }
}

/**
 * 簡易的 In-Memory 流量限制器
 * @param {string} companyId 企業 ID
 * @returns {boolean} true: 允許通過, false: 流量超載
 */
export function checkRateLimit(companyId) {
  const now = Date.now();
  const record = rateLimitMap.get(companyId);

  if (!record) {
    rateLimitMap.set(companyId, { count: 1, startTime: now });
    return true;
  }

  // 如果已經超過時間窗口，重置計數
  if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(companyId, { count: 1, startTime: now });
    return true;
  }

  // 若在時間窗口內且超過最大次數，則拒絕
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  // 計數加一
  record.count += 1;
  return true;
}

/**
 * 產生一組新的高強度安全 API Key (供後台工具使用)
 * 格式: esg_erp_[random_bytes_hex]
 */
export function generateErpApiKey() {
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return `esg_erp_${randomBytes}`;
}
