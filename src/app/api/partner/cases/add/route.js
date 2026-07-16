import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('partner-session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: '未授權' }, { status: 401 });
    }

    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    if (decoded.role !== 'partner') {
      return NextResponse.json({ success: false, error: '權限不足' }, { status: 403 });
    }

    const { clientCompany, contactName, productInterest, customerPainPoint } = await req.json();

    if (!clientCompany) {
      return NextResponse.json({ success: false, error: '客戶公司名稱為必填' }, { status: 400 });
    }

    const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN });

    const newCase = {
      _type: 'brokerCase',
      clientCompany,
      contactName,
      productInterest,
      customerPainPoint,
      status: 'pending',
      commissionStatus: 'pending',
      broker: {
        _type: 'reference',
        _ref: decoded.partnerId
      }
    };

    const created = await writeClient.create(newCase);

    return NextResponse.json({ success: true, caseId: created._id });

  } catch (error) {
    console.error('[Partner Add Case Error]', error);
    return NextResponse.json({ success: false, error: '伺服器錯誤' }, { status: 500 });
  }
}
