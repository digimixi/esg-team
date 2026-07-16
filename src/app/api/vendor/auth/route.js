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

    // 1. 查詢 Sanity 確認供應商是否存在
    const vendorQuery = `*[_type == "vendor" && email == $email && isActive == true][0]`;
    const vendor = await client.fetch(vendorQuery, { email });

    if (!vendor) {
      // 為了安全性，即使找不到也不要明確告訴攻擊者，可以統一回覆已發送，或者回覆錯誤（依據業務需求，此處先回覆錯誤以便開發除錯）
      return NextResponse.json({ success: false, error: '找不到對應的啟用供應商帳號' }, { status: 404 });
    }

    // 2. 生成 JWT Token (設定 15 分鐘過期)
    const token = jwt.sign(
      { vendorId: vendor._id, email: vendor.email, role: 'vendor' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // 3. 建立登入連結 (Magic Link)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const magicLink = `${protocol}://${host}/api/vendor/verify?token=${token}`;

    // 4. 透過 Resend 發送驗證信
    // 若為本地開發且無 RESEND_API_KEY，則直接在 console 印出連結
    if (!process.env.RESEND_API_KEY) {
      console.log('--- MAGIC LINK (Local Dev) ---');
      console.log(magicLink);
      console.log('------------------------------');
      return NextResponse.json({ 
        success: true, 
        message: '【本地開發模式】驗證信連結已印在終端機 console 中' 
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'esg.team <noreply@esg.team>', // 這裡需替換為您在 Resend 驗證過的網域
      to: [vendor.email],
      subject: '【esg.team】供應商專區安全登入連結',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>登入您的供應商專區</h2>
          <p>您好 ${vendor.companyName}：</p>
          <p>請點擊下方按鈕以登入您的專屬供應商儀表板。此連結將於 15 分鐘後失效。</p>
          <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 4px; margin-top: 16px;">
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
