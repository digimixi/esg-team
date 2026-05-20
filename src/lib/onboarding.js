import crypto from 'crypto';

const SECRET_KEY = process.env.SANITY_WRITE_TOKEN || 'fallback-secret-key-12345';

/**
 * Generates a cryptographically signed onboarding token (valid for 48 hours)
 */
export function generateOnboardingToken(payload, expiryHours = 48) {
  const expiresAt = Date.now() + expiryHours * 60 * 60 * 1000;
  const data = { ...payload, expiresAt };
  const payloadStr = JSON.stringify(data);
  const payloadBase64 = Buffer.from(payloadStr).toString('base64url');
  
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(payloadBase64);
  const signature = hmac.digest('hex');
  
  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies a cryptographically signed onboarding token
 */
export function verifyOnboardingToken(token) {
  try {
    if (!token) return null;
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;
    
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('[Verify Token] Signature mismatch');
      return null;
    }
    
    const payloadStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const data = JSON.parse(payloadStr);
    
    if (data.expiresAt < Date.now()) {
      console.error('[Verify Token] Token expired');
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('[Verify Token] Parse error:', err);
    return null;
  }
}
