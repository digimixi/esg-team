import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

export async function DELETE() {
  try {
    // 刪除所有類型為 insight 的文檔
    const query = '*[_type == "insight"]';
    const insights = await writeClient.fetch(query);
    
    const transaction = writeClient.transaction();
    insights.forEach(doc => {
      transaction.delete(doc._id);
    });
    
    await transaction.commit();
    
    return NextResponse.json({ success: true, count: insights.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
