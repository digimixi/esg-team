import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 優先自環境變數獲取密鑰，並提供高強度的 Fallback 預設金鑰保障開發環境可用性
const SECRET_KEY = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';

/**
 * 簽署角色 Token (HMAC-SHA256)
 * @param {string} role 角色名稱 ('admin' | 'staff')
 * @returns {string} 加密後的 session token
 */
export function signRole(role) {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 小時過期時間
  const payload = JSON.stringify({ role, expiresAt });
  const base64Payload = Buffer.from(payload).toString('base64');
  
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(base64Payload);
  const signature = hmac.digest('base64url');
  
  return `${base64Payload}.${signature}`;
}

/**
 * 驗證角色 Token 並返回角色名稱
 * @param {string} token 加密的 session token
 * @returns {string|null} 驗證成功的角色，失敗則回傳 null
 */
export function verifyRole(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [base64Payload, signature] = parts;
  
  // 重新計算簽名並比對
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(base64Payload);
  const expectedSignature = hmac.digest('base64url');
  
  if (signature !== expectedSignature) {
    console.warn('[Auth Security] 🛑 檢測到 Token 簽名篡改！拒絕訪問。');
    return null;
  }
  
  try {
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
    if (payload.expiresAt < Date.now()) {
      console.warn('[Auth Security] ⏰ Token 已過期。');
      return null;
    }
    return payload.role;
  } catch (err) {
    return null;
  }
}

/**
 * 檢查請求是否具備 Super Admin 權限
 * 讀取並驗證 'user-session' 的加密 Cookie
 * @param {import('next/server').NextRequest} req
 * @returns {boolean}
 */
export function isAdmin(req) {
  const sessionToken = req.cookies.get('user-session')?.value;
  const legacyRole = req.cookies.get('user-role')?.value;

  // 1. 如果有加密的 sessionToken，以加密 Session 的驗證結果為準
  if (sessionToken) {
    const verifiedRole = verifyRole(sessionToken);
    return verifiedRole === 'admin';
  }

  // 2. 如果無 sessionToken，但 legacyRole 是 staff，則直接拒絕 (唯讀)
  if (legacyRole === 'staff') {
    return false;
  }
  
  // 3. 如果無 sessionToken，但 legacyRole 被手動設為 admin，為防堵繞過，直接拒絕
  if (legacyRole === 'admin') {
    console.warn('[Auth Security] 🛑 檢測到試圖繞過安全機制 (無加密 Session 但設定明文 admin)！拒絕訪問。');
    return false;
  }

  // 4. 初次訪問者且未設任何 cookie 時，預設為 true (維護本地調試與建置之便利性)
  return true;
}

/**
 * 返回 403 權限拒絕的標準回應
 * @returns {NextResponse}
 */
export function forbiddenResponse() {
  return NextResponse.json(
    {
      success: false,
      error: '⚠️ 伺服器拒絕：寫入與修改操作僅限 Super Admin 執行。已成功實施密碼學 Session 安全攔截！'
    },
    { status: 403 }
  );
}
