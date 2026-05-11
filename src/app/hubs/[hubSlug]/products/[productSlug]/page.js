import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { hubSlug, productSlug } = await params;
  const product = await client.fetch(`*[_type == "product" && slug.current == $slug && hub->slug.current == $hubSlug][0]`, { 
    slug: productSlug,
    hubSlug 
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | ${product.subtitle || ''}`,
    description: product.description,
  };
}

export default async function ProductDetail({ params }) {
  const { hubSlug, productSlug } = await params;

  // 抓取產品詳情及所屬專題資料
  const product = await client.fetch(`
    *[_type == "product" && slug.current == $slug && hub->slug.current == $hubSlug][0] {
      ...,
      hub-> {
        title,
        contactUrl,
        quoteButtonText,
        quoteButtonTextEnglish
      }
    }
  `, { slug: productSlug, hubSlug }, { useCdn: false });

  if (!product) notFound();

  const hub = product.hub;

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* 導航列 */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex justify-between items-center px-margin h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-4">
            <a href={`/hubs/${hubSlug}`} className="text-secondary hover:text-primary transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-label-sm font-bold uppercase tracking-wider">{hub?.title || 'Back to Hub'}</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
             <a href={hub?.contactUrl || '#'} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-sm shadow-lg hover:shadow-primary/20 transition-all">
                {hub?.quoteButtonText || '立即詢價'}
             </a>
          </div>
        </div>
      </header>

      <main className="pt-24 max-w-container-max mx-auto px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-xl items-start">
          {/* 左側：產品大圖 */}
          <div className="space-y-gutter">
            <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant shadow-inner aspect-[4/3] relative">
              {product.image ? (
                <img 
                  src={urlFor(product.image).width(1200).url()} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-outline gap-4">
                   <span className="material-symbols-outlined text-6xl">inventory_2</span>
                   <p>暫無產品圖片 No Image Available</p>
                </div>
              )}
              <div className="absolute top-6 left-6">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm shadow-lg border border-white/20 uppercase tracking-widest">
                  {product.gradeBadge || 'Standard'}
                </span>
              </div>
            </div>

            {/* 工業屬性標籤 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-stack-md">
              <div className="bg-surface-container p-stack-md rounded-xl border border-outline-variant">
                <span className="text-[10px] text-outline uppercase block mb-1">Stock Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-esg-emerald animate-pulse"></span>
                  <span className="font-data-mono text-primary font-bold">{product.stock || 'In Stock'}</span>
                </div>
              </div>
              <div className="bg-surface-container p-stack-md rounded-xl border border-outline-variant">
                <span className="text-[10px] text-outline uppercase block mb-1">Origin</span>
                <span className="font-label-sm text-primary font-bold">Global Sourcing</span>
              </div>
              <div className="bg-surface-container p-stack-md rounded-xl border border-outline-variant">
                <span className="text-[10px] text-outline uppercase block mb-1">Compliance</span>
                <span className="font-label-sm text-primary font-bold">ISO Certified</span>
              </div>
            </div>
          </div>

          {/* 右側：文字內容 */}
          <div className="space-y-stack-lg lg:sticky lg:top-24">
            <div>
              <h1 className="font-display-lg text-display-lg text-primary mb-2 leading-tight">
                {product.title}
              </h1>
              <p className="text-headline-md font-headline-md text-secondary opacity-80 uppercase tracking-widest">
                {product.subtitle}
              </p>
            </div>

            <div className="bg-surface-container-lowest p-stack-lg rounded-2xl border border-outline-variant shadow-sm">
               <h3 className="font-bold text-primary mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
                 <span className="material-symbols-outlined text-secondary">description</span>
                 產品概覽 Product Overview
               </h3>
               <p className="text-body-base leading-relaxed text-on-surface-variant whitespace-pre-line">
                 {product.description}
               </p>
            </div>

            <div className="bg-surface-container-lowest p-stack-lg rounded-2xl border border-outline-variant shadow-sm">
               <h3 className="font-bold text-primary mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
                 <span className="material-symbols-outlined text-secondary">fact_check</span>
                 技術規範 Technical Specs
               </h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                    <span className="text-outline">Product Grade</span>
                    <span className="font-medium text-primary uppercase">{product.gradeBadge || 'Industrial'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                    <span className="text-outline">Logistics</span>
                    <span className="font-medium text-primary">Global Freight Ready</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="text-outline">Certification</span>
                    <span className="font-medium text-primary">Quality Guaranteed</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-stack-md">
               <a 
                 href={hub?.contactUrl || '#'} 
                 target="_blank" 
                 className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95"
               >
                 <span className="material-symbols-outlined">mail</span>
                 {hub?.quoteButtonText || '立即獲取報價'}
                 <span className="text-xs opacity-70 font-normal ml-1">REQUEST QUOTE</span>
               </a>
               <button className="flex-1 bg-surface border border-primary text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
                 <span className="material-symbols-outlined">download</span>
                 下載規格書
               </button>
            </div>
            
            <p className="text-[11px] text-outline text-center">
              * 產品規格及庫存可能隨市場情況波動，請聯繫銷售獲取最新確認。
            </p>
          </div>
        </div>

        {/* 底部相關提示 */}
        <section className="mt-24 border-t border-outline-variant pt-stack-lg">
           <div className="bg-secondary-container/30 p-stack-lg rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                 </div>
                 <div>
                    <h4 className="font-bold text-primary text-xl">供應鏈安全與品質承諾</h4>
                    <p className="text-on-surface-variant text-sm">我們提供的每一批工業資源均通過嚴格的第三方檢測與溯源認證。</p>
                 </div>
              </div>
              <button className="bg-secondary text-on-secondary px-8 py-3 rounded-full font-bold text-sm whitespace-nowrap">
                 了解我們的品質標準
              </button>
           </div>
        </section>
      </main>
    </div>
  );
}
