import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { isAdmin, forbiddenResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

export async function GET() {
  try {
    const logs = await writeClient.fetch(
      `*[_type == "supplierInvitation"] | order(sentAt desc)`,
      {},
      { useCdn: false }
    );

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendStatus = {
      isConfigured: !!resendApiKey,
      mode: resendApiKey ? 'PRODUCTION' : 'SANDBOX',
      quotaMessage: resendApiKey 
        ? '已連接正式郵件伺服器 (每月 3,000 封免費額度已啟用)' 
        : '當前處於沙盒模擬模式 ($0 成本無密碼金鑰預覽中)',
    };

    return NextResponse.json({ success: true, logs, resendStatus });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  // 後台安全攔截
  if (!isAdmin(req)) {
    return forbiddenResponse();
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: '缺少識別碼 ID 或狀態值' }, { status: 400 });
    }

    const updated = await writeClient
      .patch(id)
      .set({ status })
      .commit();

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  // 後台安全攔截
  if (!isAdmin(req)) {
    return forbiddenResponse();
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: '缺少識別碼 ID' }, { status: 400 });
    }

    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

