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

// 獲取所有書籤
export async function GET() {
  try {
    const bookmarks = await writeClient.fetch('*[_type == "sourceBookmark"] | order(_createdAt desc)');
    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 建立新書籤
export async function POST(req) {
  // 後台安全攔截
  if (!isAdmin(req)) {
    return forbiddenResponse();
  }

  try {
    const { title, url } = await req.json();
    if (!url) return NextResponse.json({ error: 'Missing URL' }, { status: 400 });

    const result = await writeClient.create({
      _type: 'sourceBookmark',
      title: title || '未命名情報源',
      url,
    });

    return NextResponse.json({ success: true, bookmark: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 刪除書籤
export async function DELETE(req) {
  // 後台安全攔截
  if (!isAdmin(req)) {
    return forbiddenResponse();
  }

  try {
    const { id } = await req.json();
    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

