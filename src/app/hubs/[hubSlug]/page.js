import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import MarketIndexBar from '@/components/MarketIndexBar';
import AIInsightBox from '@/components/AIInsightBox';
import HubHeader from '@/components/HubHeader';
import StickyJumpNav from '@/components/StickyJumpNav';
import SolutionHero from '@/components/solutions/SolutionHero';
import InsightCard from '@/components/InsightCard';

export const revalidate = 86400;

// 自定義 PortableText 渲染樣式
const ptComponents = {
  block: {
    h3: ({children}) => <h3 className="text-primary font-bold text-base mt-4 mb-1">{children}</h3>,
    h4: ({children}) => <h4 className="text-primary font-bold text-sm mt-3 mb-1">{children}</h4>,
    normal: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
  },
  marks: {
    strong: ({children}) => <strong className="font-bold text-primary">{children}</strong>,
  },
};

export async function generateMetadata({ params }) {
  const { hubSlug } = await params;
  const hub = await client.fetch(`*[_type == "hub" && slug.current == $slug][0] {
    title,
    heroDescription,
    description,
    heroImage
  }`, { slug: hubSlug });

  if (!hub) return { title: 'ESG Intelligence Hub' };

  const title = hub.title;
  const description = hub.heroDescription || hub.description || `深入分析 ${hub.title} 的全球動向、ESG 轉型趨勢與供應鏈情報。`;
  const ogImage = hub.heroImage ? urlFor(hub.heroImage).width(1200).height(630).fit('crop').url() : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function HubHome({ params }) {
  const { hubSlug } = await params;

  // Get the hub document
  const hub = await client.fetch(`*[_type == "hub" && slug.current == $slug][0] {
    ...,
    "heroImageUrl": heroImage.asset->url,
    "featureImageUrl": featureImage.asset->url,
    "aiInsight": aiInsight {
      isActive,
      trendLabel,
      insightText,
      confidenceScore,
      analysisDate
    }
  }`, { slug: hubSlug }, { useCdn: false });
  
  if (!hub || hub.isActive === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center p-stack-lg max-w-md">
          <span className="material-symbols-outlined text-outline text-6xl mb-4">construction</span>
          <h1 className="font-display-md text-display-md text-primary mb-2">專題建置中</h1>
          <p className="text-on-surface-variant mb-stack-lg">此產業專題目前尚未開放或已暫時關閉，請稍後再試。</p>
          <a href="/" className="bg-primary text-on-primary px-6 py-2 rounded font-label-sm">返回首頁</a>
        </div>
      </div>
    );
  }
  
  const indices = await client.fetch('*[_type == "marketIndex"] | order(order asc)', {}, { useCdn: false });
  const products = await client.fetch('*[_type == "product" && hub->slug.current == $slug] | order(_createdAt desc)', { slug: hubSlug }, { useCdn: false });
  
  const keywordsArray = hub.searchKeywords 
    ? hub.searchKeywords.split(',').map(k => `*${k.trim()}*`).filter(k => k !== '**') 
    : [];

  const keywordConditions = keywordsArray.length > 0 
    ? `|| (${keywordsArray.map(k => `title match "${k}" || summary match "${k}" || excerpt match "${k}"`).join(' || ')})`
    : '';
  
  const insights = await client.fetch(`
    *[_type == "insight" && isActive == true && (
      references($hubId) 
      ${keywordConditions}
    )] | order(publishedAt desc)[0...12] {
      _id,
      title,
      summary,
      category,
      isFeatured,
      authorName,
      publishedAt,
      source,
      externalUrl,
      standards,
      "sourceRef": sourceRef->{ title, url }
    }
  `, { 
    hubId: hub._id 
  }, { useCdn: false });

  const eduPages = await client.fetch(`*[_type == "eduPage" && (
    $hubId in relatedHubs[]._ref || 
    hub._ref == $hubId
  )] {
    _id,
    title,
    "slug": slug.current
  }`, { hubId: hub._id }, { useCdn: false });

  const benchmarks = await client.fetch(`*[_type == "industryBenchmark" && (
    hub._ref == $hubId || category == "intensity"
  )] | order(currentValue asc)`, { hubId: hub._id }, { useCdn: false });

  return (
    <>
      <HubHeader 
        hubSlug={hubSlug} 
        title={hub.title} 
        contactUrl={hub.contactUrl} 
        activeTab="home" 
      />

      {/* Sticky Secondary Navigation */}
      <StickyJumpNav links={[
        { label: '解決方案', href: '#solutions', isPrimary: true },
        { label: '市場實時指數', href: '#market-index' },
        { label: '解碼核心資產', href: '#education' },
        { label: '資源目錄', href: '#products' },
        { label: '供應鏈情報', href: '#intelligence' }
      ]} />

      <main>
        <SolutionHero 
          title={hub.title}
          subtitle={hub.heroSubtitle}
          description={hub.heroDescription}
          imageUrl={hub.heroImageUrl}
          features={['即時報價', '供應鏈地圖', '最新情報', '碳排試算']}
          isFullWidth={true}
        />

        <div id="market-index">
          <MarketIndexBar indices={indices} lastUpdated={indices[0]?.lastSync} />
        </div>

        {/* Global Benchmarks (Simplified for Hub) */}
        <section className="bg-surface-container-low py-4 border-b border-outline-variant overflow-hidden">
          <div className="max-w-container-max mx-auto px-4 sm:px-margin flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex flex-col gap-1 w-full xl:min-w-[300px]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">fact_check</span>
                <span className="font-bold text-primary text-[13px]">全球碳基準 (gCO2e/kWh)</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 xl:flex xl:flex-nowrap items-end justify-items-start xl:justify-end gap-x-6 gap-y-4 w-full xl:w-auto">
              {benchmarks.slice(0, 5).map((item) => (
                <div key={item._id} className="w-full sm:w-[100px] flex flex-col gap-1 shrink-0">
                  <div className="flex justify-between items-end px-0.5">
                    <span className="text-[9px] font-bold text-primary opacity-70 uppercase">{item.title.split(' ')[0]}</span>
                    <span className="font-data-mono text-[10px] font-bold text-secondary">{item.currentValue}</span>
                  </div>
                  <div className="h-[2px] w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-esg-emerald" style={{ width: `${(item.currentValue / 0.6) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AIInsightBox insight={hub.aiInsight} />

        {/* Education Section */}
        <section id="education" className="bg-surface-container-lowest py-stack-lg px-margin max-w-container-max mx-auto border-b border-outline-variant text-center scroll-mt-24">
          <div className="mb-stack-lg max-w-3xl mx-auto">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 font-label-sm text-label-sm rounded-full mb-4 inline-block">Industry Primer</span>
            <h2 className="font-display-lg text-display-lg text-primary mb-4">解碼核心資產價值</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {eduPages.map((edu) => (
                <a key={edu._id} href={`/hubs/${hubSlug}/edu/${edu.slug}`} className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:shadow-xl transition-all">
                  探索：{edu.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-stack-lg px-margin max-w-container-max mx-auto scroll-mt-24">
          <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg">資源目錄</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {products.map((product) => (
              <a key={product._id} href={`/hubs/${hubSlug}/products/${product.slug?.current}`} className="group bg-surface-container-lowest border border-outline-variant hover:shadow-2xl transition-all p-stack-md rounded-xl">
                <div className="h-48 mb-4 bg-surface-variant rounded-lg overflow-hidden">
                  {product.image && <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={urlFor(product.image).url()} alt={product.title} />}
                </div>
                <h3 className="font-bold text-primary mb-2">{product.title}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-2">{product.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Intelligence Section */}
        <section id="intelligence" className="bg-surface-container-low py-stack-lg border-y border-outline-variant scroll-mt-24">
          <div className="max-w-container-max mx-auto px-margin">
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg">供應鏈情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {insights.map((insight) => (
                <InsightCard key={insight._id} insight={{ ...insight, hubTitle: hub.title }} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-highest border-t border-outline-variant w-full py-stack-lg">
        <div className="text-center text-on-surface-variant text-label-sm">© 2024 esg.team</div>
      </footer>
    </>
  );
}
