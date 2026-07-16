import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // 1. Query Sanity to ensure partner exists and is active
    const partnerQuery = `*[_type == "broker" && email == $email && status == 'active'][0]`;
    const partner = await client.fetch(partnerQuery, { email });

    if (!partner) {
      return NextResponse.json({ success: false, error: '找不到對應的啟用夥伴帳號' }, { status: 404 });
    }

    // 2. Generate JWT Token (15 min expiry)
    const token = jwt.sign(
      { partnerId: partner._id, email: partner.email, role: 'partner' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // 3. Create Magic Link
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const magicLink = `${protocol}://${host}/api/partner/verify?token=${token}`;

    // 4. Send email via Resend
    if (!process.env.RESEND_API_KEY) {
      console.log('--- PARTNER MAGIC LINK (Local Dev) ---');
      console.log(magicLink);
      console.log('--------------------------------------');
      return NextResponse.json({ 
        success: true, 
        message: '【本地開發模式】驗證信連結已印在終端機 console 中' 
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'esg.team <noreply@esg.team>',
      to: [partner.email],
      subject: '【esg.team】協作夥伴專區安全登入連結',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>登入您的夥伴專區</h2>
          <p>您好 ${partner.displayName}：</p>
          <p>請點擊下方按鈕以登入您的專屬協作夥伴儀表板。此連結將於 15 分鐘後失效。</p>
          <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; margin-top: 16px;">
            安全登入
          </a>
          <p style="margin-top: 32px; font-size: 12px; color: #666;">
            若您並未請求此登入連結，請忽略此信件。
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ success: false, error: '驗證信發送失敗' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '驗證信已發送' });

  } catch (error) {
    console.error('Auth endpoint error:', error);
    return NextResponse.json({ success: false, error: '伺服器內部錯誤' }, { status: 500 });
  }
}
