import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // We only accept POST requests to prevent accidental triggering
    // Read the secret write token
    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      console.warn('Visitor Tracker: SANITY_WRITE_TOKEN not configured.');
      return NextResponse.json({ error: 'Missing token' }, { status: 500 });
    }

    // Initialize an admin client with write permissions
    const writeClient = client.withConfig({
      token: token,
      useCdn: false, // Ensure we write to the live dataset immediately
    });

    // Patch the siteSettings singleton document
    // We use setIfMissing to ensure visitorCount starts at 0 if it doesn't exist
    await writeClient
      .patch('siteSettings')
      .setIfMissing({ visitorCount: 0 })
      .inc({ visitorCount: 1 })
      .commit();

    return NextResponse.json({ success: true, message: 'Visitor count incremented' });
  } catch (error) {
    console.error('Visitor Tracker API Error:', error);
    return NextResponse.json({ error: 'Failed to increment visitor count' }, { status: 500 });
  }
}
