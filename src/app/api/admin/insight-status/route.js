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

export async function PATCH(req) {
  // 後台安全攔截
  if (!isAdmin(req)) {
    return forbiddenResponse();
  }

  try {
    const { id, isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const result = await writeClient
      .patch(id)
      .set({ isActive })
      .commit();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

