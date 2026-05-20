import { NextResponse } from 'next/server';
import { generateOnboardingToken } from '@/lib/onboarding';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { supplierName, email, type, hubSlug } = await req.json();

    if (!supplierName || !email || !type || !hubSlug) {
      return NextResponse.json({ error: '請提供完整的供應商名稱、電子郵件、類型與專題標識。' }, { status: 400 });
    }

    // 1. 生成加密時效金鑰 (Secure Onboarding Token)
    const token = generateOnboardingToken({
      supplierName,
      email,
      type,
      hubSlug
    });

    // 2. 獲取 Request Origin，組裝無密碼填報連結
    const origin = req.headers.get('origin') || new URL(req.url).origin;
    const onboardUrl = `${origin}/hubs/${hubSlug}/supply-chain/onboard?token=${token}`;

    console.log(`[Supplier Invite] Secure token generated for ${supplierName}:`);
    console.log(`[Supplier Invite] Link: ${onboardUrl}`);

    // 3. 整合 Resend 郵件派發 API ($0 成本, REST API 直連)
    const resendApiKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    let apiError = null;

    if (resendApiKey) {
      try {
        console.log(`[Supplier Invite] Sending real onboarding email to ${email} via Resend...`);
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'esg.team <onboarding@resend.dev>', // 預設 Resend 測試發件地址，或已驗證網域
            to: email,
            subject: '【esg.team】供應商 Scope 3 碳排放數據安全填報邀請信',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                <div style="margin-bottom: 20px;">
                  <span style="font-size: 10px; font-weight: bold; color: #10b981; background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 8px; border-radius: 9999px; text-transform: uppercase;">Secure Trust Connection</span>
                </div>
                <h2 style="color: #111827; font-size: 20px; font-weight: bold; margin-top: 10px;">供應商 Scope 3 數據對接邀請</h2>
                <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                  親愛的 <strong>${supplierName}</strong> 窗口合作夥伴，您好：
                </p>
                <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                  您合作的買方企業已透過 <strong>esg.team 供應鏈碳排信任平台</strong> 發起對接請求。這是一項針對 <strong>Scope 3 (範疇三)</strong> 供應鏈減碳與歐盟 <strong>CBAM 碳邊境稅申報</strong> 的資料對接作業。
                </p>
                <div style="background-color: #f3f4f6; border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                  <p style="color: #1f2937; font-size: 13px; font-weight: bold; margin: 0 0 6px 0;">對接作業摘要：</p>
                  <ul style="color: #4b5563; font-size: 12px; margin: 0; padding-left: 20px; line-height: 1.6;">
                    <li><strong>原物料類別：</strong>${type === 'steel' ? '鋼鐵與金屬原料 (Steel)' : type === 'graphite' ? '石墨電極與焦炭 (Graphite)' : '原物料物流運輸 (Logistics)'}</li>
                    <li><strong>安全驗證：</strong>具備密碼學時效金鑰 (無密碼安全登入)</li>
                    <li><strong>提交單據：</strong>需備妥產品生命週期評估 (LCA) 或 ISO 14067 相關驗證證書文件</li>
                  </ul>
                </div>
                <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
                  請點擊下方按鈕以進入免密碼安全填報頁面：
                </p>
                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${onboardUrl}" target="_blank" style="background-color: #111827; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
                    進行安全數據申報
                  </a>
                </div>
                <p style="color: #9ca3af; font-size: 11px; line-height: 1.5; border-top: 1px solid #f3f4f6; padding-top: 15px; margin: 0;">
                  * 本連結具備 48 小時時效安全防護。請勿將此連結分享給他人。如果您並非本案之對接窗口，請忽略本信件。<br/>
                  © esg.team. All rights reserved.
                </p>
              </div>
            `
          })
        });

        if (emailResponse.ok) {
          emailSent = true;
          console.log(`✅ Real email successfully sent to ${email} via Resend.`);
        } else {
          const errData = await emailResponse.json();
          apiError = errData.message || 'Resend API returned error status';
          console.error(`❌ Resend API failed:`, errData);
        }
      } catch (err) {
        apiError = err.message;
        console.error(`❌ Email sending failed due to network error:`, err);
      }
    } else {
      console.log(`[Supplier Invite] 💡 No RESEND_API_KEY detected in environment. Running in POC Sandbox/Mock Mode.`);
    }

    return NextResponse.json({
      success: true,
      onboardUrl,
      emailSent,
      sandboxMode: !resendApiKey,
      message: resendApiKey 
        ? (emailSent ? '邀請信已成功安全送出！' : `郵件發送失敗 (${apiError})，請使用測試連結`)
        : '沙盒模式：金鑰已生成。請在下方點擊測試連結以模擬供應商進行填報。'
    });

  } catch (error) {
    console.error('[Supplier Invite API] Failed:', error);
    return NextResponse.json({ error: '發起對接失敗: ' + error.message }, { status: 500 });
  }
}
