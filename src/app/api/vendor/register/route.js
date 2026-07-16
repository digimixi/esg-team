import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const companyName = formData.get('companyName');
    const email = formData.get('email');
    const contactName = formData.get('contactName');
    const file = formData.get('esgCertificate');

    if (!companyName || !email || !file) {
      return NextResponse.json(
        { success: false, error: '缺少必填欄位 (公司名稱、Email 或 ESG 證書)' },
        { status: 400 }
      );
    }

    // Initialize Sanity write client
    const writeClient = client.withConfig({
      token: process.env.SANITY_WRITE_TOKEN
    });
    
    // 1. Upload ESG Certificate to Sanity Assets
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await writeClient.assets.upload('file', buffer, { filename: file.name });

    // 2. Create Vendor Document with 'pending' status
    const newVendor = {
      _type: 'vendor',
      companyName,
      email,
      contactName: contactName || '',
      status: 'pending', 
      isActive: false, // Must be approved by Admin before they can use Magic Link
      isPremium: false,
      esgCertificates: [
        {
          _type: 'file',
          asset: { _type: 'reference', _ref: asset._id }
        }
      ]
    };

    const created = await writeClient.create(newVendor);

    return NextResponse.json({ success: true, id: created._id });

  } catch (error) {
    console.error('[Vendor Register API Error]', error);
    return NextResponse.json(
      { success: false, error: '內部伺服器錯誤，註冊失敗。' },
      { status: 500 }
    );
  }
}
