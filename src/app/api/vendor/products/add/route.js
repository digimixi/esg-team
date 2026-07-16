import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // Authenticate the vendor
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('vendor-session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: '未授權的存取' }, { status: 401 });
    }

    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ success: false, error: '權限不足' }, { status: 403 });
    }

    const { title, subtitle, description, stock } = await req.json();

    if (!title) {
      return NextResponse.json({ success: false, error: '產品名稱為必填' }, { status: 400 });
    }

    const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN });

    // Generate a basic slug
    const slugValue = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const newProduct = {
      _type: 'product',
      title,
      subtitle,
      description,
      stock,
      slug: {
        _type: 'slug',
        current: slugValue
      },
      status: 'under_review', // Default status is under_review based on business decision
      vendor: {
        _type: 'reference',
        _ref: decoded.vendorId
      }
    };

    const created = await writeClient.create(newProduct);

    return NextResponse.json({ success: true, product: created });

  } catch (error) {
    console.error('[Vendor Add Product Error]', error);
    return NextResponse.json({ success: false, error: '伺服器錯誤' }, { status: 500 });
  }
}
