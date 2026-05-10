import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const revalidate = 0;

export async function GET() {
  try {
    const insights = await client.fetch(`*[_type == "insight"] | order(publishedAt desc)[0...50] {
      _id,
      title,
      summary,
      source,
      externalUrl,
      publishedAt
    }`, {}, { useCdn: false });

    const indices = await client.fetch(`*[_type == "marketIndex"] | order(_updatedAt desc)`, {}, { useCdn: false });

    return NextResponse.json({ insights, indices });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
