import { client } from '@/sanity/lib/client';
import CatalogClient from './CatalogClient';

export const revalidate = 86400; // Cache for 24 hours (or until revalidated by webhook)

export const metadata = {
  title: '全局資源大廳 - ESG 認證供應鏈 | esg.team',
  description: '探索經過嚴格稽核的高效能低碳材料、綠色設備與專業合規服務。一站式建構您的淨零排放價值鏈。',
};

export default async function CatalogPage() {
  // Fetch all active products, sorted by newest first
  // Include the referenced hub information
  const products = await client.fetch(`
    *[_type == "product" && (!defined(isActive) || isActive == true)] | order(_createdAt desc) {
      _id,
      title,
      subtitle,
      slug,
      category,
      image,
      gradeBadge,
      description,
      specifications,
      isFeatured,
      hub->{
        title,
        slug
      }
    }
  `, {}, { useCdn: false });

  return (
    <main>
      <CatalogClient products={products} />
    </main>
  );
}
