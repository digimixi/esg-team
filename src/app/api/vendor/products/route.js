import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { client } from '@/sanity/lib/client';

const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';

export async function PUT(request) {
  try {
    // 1. 驗證 Cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('vendor-session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let vendorId;
    try {
      const decoded = jwt.verify(sessionToken, JWT_SECRET);
      if (decoded.role !== 'vendor') throw new Error('Invalid role');
      vendorId = decoded.vendorId;
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Invalid Session' }, { status: 401 });
    }

    // 2. 解析請求
    const { productId, updates } = await request.json();
    if (!productId || !updates) {
      return NextResponse.json({ success: false, error: 'Bad Request' }, { status: 400 });
    }

    // 3. 安全防護：確認該產品確實在該供應商的 products 陣列中
    const vendorQuery = `*[_type == "vendor" && _id == $vendorId && $productId in products[]._ref][0]`;
    const vendorRecord = await client.fetch(vendorQuery, { vendorId, productId });

    if (!vendorRecord) {
      return NextResponse.json({ success: false, error: '無權限修改此產品或產品未綁定至您的帳號' }, { status: 403 });
    }

    // 4. 使用 Sanity Client (必須使用具有寫入權限的 Write Token) 寫入變更
    if (!process.env.SANITY_WRITE_TOKEN) {
       console.warn('開發環境警告: SANITY_WRITE_TOKEN 未設置，模擬成功回應。');
       return NextResponse.json({ success: true, message: 'Local Dev Simulation Success' });
    }

    const writeClient = client.withConfig({
      token: process.env.SANITY_WRITE_TOKEN
    });

    const result = await writeClient
      .patch(productId)
      .set({
        stock: updates.stock,
        description: updates.description
      })
      .commit();

    return NextResponse.json({ success: true, product: result });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: '內部伺服器錯誤' }, { status: 500 });
  }
}
