import { client } from '@/sanity/lib/client';
import CatalogClient from './CatalogClient';
import Navbar from '@/components/Navbar';

export const revalidate = 86400; // Cache for 24 hours (or until revalidated by webhook)

export const metadata = {
  title: '供應鏈大廳 - ESG 認證供應鏈 | esg.team',
  description: '探索經過嚴格稽核的高效能低碳材料、綠色設備與專業合規服務。一站式建構您的淨零排放價值鏈。',
};

export default async function CatalogPage() {
  // Fetch all active products, sorted by newest first
  // Include the referenced hub information
  const products = await client.fetch(`
    *[_type == "product" && (!defined(isActive) || isActive == true)] | order(orderRank asc, _createdAt desc) {
      _id,
      title,
      subtitle,
      slug,
      category,
      subCategory,
      image,
      gradeBadge,
      esgTags,
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
    <>
      <Navbar />
      <main className="pt-[64px] lg:pt-[104px]">
        <CatalogClient products={products} />
      </main>
    </>
  );
}
