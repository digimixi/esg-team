import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/portal/partner/login?error=MissingToken', request.url));
  }

  try {
    // 1. Verify Token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'partner') {
      throw new Error('Invalid role');
    }

    // 2. Issue long-lived session cookie JWT
    const sessionToken = jwt.sign(
      { partnerId: decoded.partnerId, email: decoded.email, role: 'partner' },
      JWT_SECRET,
      { expiresIn: '7d' } // 7 days
    );

    // 3. Create NextResponse and redirect to Dashboard
    const response = NextResponse.redirect(new URL('/portal/partner/dashboard', request.url));

    // 4. Set HttpOnly Secure Cookie
    response.cookies.set({
      name: 'partner-session',
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
    return NextResponse.redirect(new URL('/portal/partner/login?error=InvalidOrExpiredToken', request.url));
  }
}
