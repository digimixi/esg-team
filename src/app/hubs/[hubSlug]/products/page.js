import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import StickyJumpNav from '@/components/StickyJumpNav';

import SolutionHero from '@/components/solutions/SolutionHero';
import HubHeader from '@/components/HubHeader';

export const revalidate = 86400;

export default async function HubProductsPage({ params }) {
  const { hubSlug } = await params;

  // 1. 抓取專題 (Hub) 的基本資訊與主題色
  const hub = await client.fetch(`*[_type == "hub" && slug.current == $slug][0] {
    title,
    heroSubtitle,
    themeColor,
    "imageUrl": heroImage.asset->url,
    productSectionTitle,
    productSectionDescription,
    productSectionDescriptionEnglish
  }`, { slug: hubSlug });

  // 2. 抓取屬於該專題的所有產品
  const products = await client.fetch(`*[_type == "product" && hub->slug.current == $slug] | order(_createdAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    category,
    gradeBadge,
    description,
    "imageUrl": image.asset->url,
    stock
  }`, { slug: hubSlug });

  if (!hub) {
    return <div className="py-20 text-center">專題不存在</div>;
  }

  return (
    <>
      <HubHeader 
        hubSlug={hubSlug} 
        title={hub.title} 
        contactUrl={hub.contactUrl} 
        activeTab="products" 
      />

      {/* Sticky Secondary Navigation */}
      <StickyJumpNav links={[
        { label: '解決方案', href: `/hubs/${hubSlug}#solutions`, isPrimary: true },
        { label: '市場實時指數', href: `/hubs/${hubSlug}#market-index` },
        { label: '解碼核心資產', href: `/hubs/${hubSlug}#education` },
        { label: '資源目錄', href: `/hubs/${hubSlug}#products` },
        { label: '供應鏈情報', href: `/hubs/${hubSlug}#intelligence` }
      ]} />


      <main className="pt-[104px] lg:pt-16 min-h-screen bg-surface">

        <SolutionHero 
          title={hub.productSectionTitle || `${hub.title} 資源目錄`}
          subtitle="Industrial Resource Catalog"
          description={hub.productSectionDescription || "為高性能工業生產提供直接採購與規格對齊服務。"}
          badgeText="Verified Supply"
          badgeIcon="inventory_2"
          imageUrl={hub.imageUrl}
          isFullWidth={false}
        />

        <section className="py-12">
          <div className="max-w-container-max mx-auto px-margin">
            {/* Filter Bar (Placeholder for now) */}
            <div className="flex flex-wrap gap-4 mb-12 border-b border-outline-variant pb-6">
              {['全部產品', '原料', '成品', '化學品', '設備'].map(cat => (
                <button key={cat} className="px-4 py-2 rounded-full border border-outline-variant text-label-sm font-label-sm hover:bg-primary hover:text-on-primary transition-all">
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link 
                  key={product._id} 
                  href={`/hubs/${hubSlug}/products/${product.slug}`}
                  className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500"
                >
                  <div className="h-56 bg-surface-container-high relative overflow-hidden">
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Product'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={product.title} 
                    />
                    {product.gradeBadge && (
                      <div className="absolute top-4 left-4 bg-primary text-on-primary text-[9px] font-bold px-2 py-1 rounded uppercase tracking-tighter shadow-lg">
                        {product.gradeBadge}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{product.category}</div>
                    <h3 className="text-primary font-headline-sm text-lg mb-2 group-hover:text-secondary transition-colors">{product.title}</h3>
                    <p className="text-on-surface-variant text-xs line-clamp-2 mb-6 opacity-80">{product.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                      <span className="text-primary font-data-mono text-xs font-bold">{product.stock || 'Contact for stock'}</span>
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {products.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-outline-variant rounded-xl text-outline italic">
                  此專題下尚無產品，請至 Sanity 後台建立。
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
