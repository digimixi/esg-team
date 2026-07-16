import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

export async function POST(req) {
  try {
    const data = await req.json();
    
    // 基本驗證
    if (!data.companyName || !data.contactName || !data.email) {
      return NextResponse.json(
        { error: '公司名稱、聯絡人與 Email 為必填欄位。' },
        { status: 400 }
      );
    }

    const leadDoc = {
      _type: 'lead',
      companyName: data.companyName,
      contactName: data.contactName,
      title: data.title || '',
      email: data.email,
      phone: data.phone || '',
      location: data.location || '',
      industry: data.industry || '',
      interests: Array.isArray(data.interests) ? data.interests : [],
      volume: data.volume || '',
      currentSpec: data.currentSpec || '',
      hasExportClients: Boolean(data.hasExportClients),
      needsEsgData: Boolean(data.needsEsgData),
      wants: Array.isArray(data.wants) ? data.wants : [],
      additionalInfo: data.additionalInfo || '',
      hubSource: data.hubSource || 'unknown',
      status: 'new'
    };

    const cookieStore = await cookies();
    const partnerRefCode = cookieStore.get('esg_partner_ref')?.value;

    if (partnerRefCode) {
      console.log(`[Leads API] Found referral code: ${partnerRefCode}`);
      const partnerQuery = `*[_type == "broker" && partnerCode == $code][0]`;
      const partner = await writeClient.fetch(partnerQuery, { code: partnerRefCode });
      if (partner) {
        leadDoc.referral = {
          _type: 'reference',
          _ref: partner._id
        };
      }
    }

    console.log('[Leads API] Creating new lead document in Sanity...');
    const createdLead = await writeClient.create(leadDoc);
    console.log(`✅ [Leads API] Lead successfully saved to CRM: ${createdLead._id}`);

    // 若未來有串接 Resend 寄信，可在這裡呼叫寄信邏輯
    // await sendWelcomeEmail(data.email, data.wants);

    return NextResponse.json({
      success: true,
      message: '表單已成功送出！我們將盡快與您聯繫。',
      leadId: createdLead._id
    });

  } catch (error) {
    console.error('[Leads API] Failed to save lead:', error);
    return NextResponse.json(
      { error: '系統發生錯誤，無法送出表單。請稍後再試或直接來信。' },
      { status: 500 }
    );
  }
}
