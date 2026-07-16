import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/portal/vendor/login?error=MissingToken', request.url));
  }

  try {
    // 1. 驗證 Token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'vendor') {
      throw new Error('Invalid role');
    }

    // 2. 為了保持登入狀態，我們簽發一個更長效期的 Cookie Session JWT
    const sessionToken = jwt.sign(
      { vendorId: decoded.vendorId, email: decoded.email, role: 'vendor' },
      JWT_SECRET,
      { expiresIn: '7d' } // 保持登入 7 天
    );

    // 3. 建立 NextResponse 並進行 Redirect (轉導至 Dashboard)
    const response = NextResponse.redirect(new URL('/portal/vendor/dashboard', request.url));

    // 4. 種下 HttpOnly Secure Cookie
    response.cookies.set({
      name: 'vendor-session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verify endpoint error:', error);
    return NextResponse.redirect(new URL('/portal/vendor/login?error=InvalidOrExpiredToken', request.url));
  }
}
