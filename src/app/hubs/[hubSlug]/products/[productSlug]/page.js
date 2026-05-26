import { client } from '@/sanity/lib/client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import SolutionHero from '@/components/solutions/SolutionHero';

export const revalidate = 86400;

export default async function ProductDetailPage({ params }) {
  const { hubSlug, productSlug } = await params;

  // 1. 抓取產品詳情
  const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0] {
    title,
    subtitle,
    category,
    gradeBadge,
    description,
    "imageUrl": image.asset->url,
    "gallery": images[].asset->url,
    specifications,
    applications,
    stock
  }`, { slug: productSlug });

  // 2. 抓取所屬專題資訊 (用於導航與麵包屑)
  const hub = await client.fetch(`*[_type == "hub" && slug.current == $slug][0] {
    title,
    themeColor
  }`, { slug: hubSlug });

  if (!product) {
    return <div className="py-20 text-center">產品不存在</div>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-surface">
        {/* Hub 專屬頁面導航 */}
        <div className="bg-surface-container-high border-b border-outline-variant sticky top-16 z-30">
          <div className="max-w-container-max mx-auto px-margin h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href={`/hubs/${hubSlug}`} className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-wider">
                首頁
              </Link>
              <Link href={`/hubs/${hubSlug}/products`} className="text-primary font-bold border-b-2 border-primary h-14 flex items-center font-label-sm text-label-sm uppercase tracking-wider">
                產品目錄
              </Link>
              <Link href={`/hubs/${hubSlug}/market`} className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-wider">
                市場情報
              </Link>
              <Link href={`/hubs/${hubSlug}/supply-chain`} className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-wider">
                供應鏈
              </Link>
            </div>
          </div>
        </div>

        <section className="py-12 bg-surface-container-low border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* 左側：圖片展示 */}
              <div className="flex-1 space-y-4">
                <div className="aspect-[4/3] bg-white border border-outline-variant rounded-xl overflow-hidden shadow-inner">
                  <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.title} />
                </div>
                {product.gallery && product.gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.gallery.map((url, idx) => (
                      <div key={idx} className="aspect-square bg-white border border-outline-variant rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-all">
                        <img src={url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 右側：基本資訊與詢價 */}
              <div className="flex-1 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-secondary font-bold text-xs uppercase tracking-widest px-2 py-1 bg-secondary/10 rounded">{product.category}</span>
                    {product.gradeBadge && (
                      <span className="text-primary font-bold text-xs uppercase tracking-widest px-2 py-1 bg-primary/10 rounded">{product.gradeBadge}</span>
                    )}
                  </div>
                  <h1 className="text-display-sm font-display-sm text-primary mb-2">{product.title}</h1>
                  <p className="text-headline-sm font-headline-sm text-secondary opacity-70 uppercase tracking-tight">{product.subtitle}</p>
                </div>

                <p className="text-body-base text-on-surface-variant leading-relaxed border-l-2 border-outline-variant pl-6 italic">
                  {product.description}
                </p>

                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant flex justify-between items-end">
                  <div>
                    <div className="text-label-sm text-on-surface-variant mb-1 uppercase tracking-tighter">當前庫存狀態 (Stock Status)</div>
                    <div className="text-display-sm font-data-mono font-bold text-primary">{product.stock || '詢價確認'}</div>
                  </div>
                  <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg">
                    獲取即時報價 <span className="material-symbols-outlined">request_quote</span>
                  </button>
                </div>

                {/* 應用場景標籤 */}
                {product.applications && (
                  <div className="space-y-3">
                    <h4 className="text-label-sm font-bold text-secondary uppercase tracking-widest">Key Applications</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app, idx) => (
                        <span key={idx} className="px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full text-xs font-medium">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 技術規格詳情 */}
        <section className="py-24">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-headline-lg font-headline-lg text-primary">技術規格與參數</h2>
              <div className="h-px bg-outline-variant flex-grow"></div>
              <span className="text-label-sm font-mono text-outline uppercase">Technical Specs v1.0</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {product.specifications ? product.specifications.map((spec, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-outline-variant/30 group hover:bg-surface-container-lowest px-4 transition-colors">
                  <span className="text-on-surface-variant font-medium">{spec.label}</span>
                  <span className="text-primary font-bold font-data-mono">{spec.value}</span>
                </div>
              )) : (
                <div className="col-span-full py-8 text-outline italic">尚無詳細規格數據。</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
