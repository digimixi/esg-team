import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export const revalidate = 60; // 每分鐘更新一次資料
import { PortableText } from '@portabletext/react';

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

  // Get the hub document - 強制不使用快取
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
      externalUrl
    }
  `, { 
    hubId: hub._id 
  }, { useCdn: false });

  // 獲取所有屬於此專題的科普頁面 (支援多對多關聯)
  const eduPages = await client.fetch(`*[_type == "eduPage" && (
    $hubId in relatedHubs[]._ref || 
    hub._ref == $hubId
  )] {
    _id,
    title,
    "slug": slug.current
  }`, { hubId: hub._id }, { useCdn: false });

  // 獲取基準數據 (優先抓取關聯此專題的，或全局通用的強度數據)
  const benchmarks = await client.fetch(`*[_type == "industryBenchmark" && (
    hub._ref == $hubId || category == "intensity"
  )] | order(currentValue asc)`, { hubId: hub._id }, { useCdn: false });

  const heroTitle = hub?.title || '卓越工業，品質至上';
  const heroTitleColor = hub?.themeColor || '#FFFFFF';
  const heroSubtitle = hub?.heroSubtitle || 'Industrial Excellence in Every Tonne';
  const heroSubtitleColor = hub?.heroSubtitleColor || '#FFFFFF';
  const heroDescription = hub?.heroDescription || '全球石墨電極、增碳劑及特種鋼鐵資源採購平台。';
  const heroDescriptionColor = hub?.heroDescriptionColor || '#FFFFFF';
  const heroDescriptionEnglish = hub?.heroDescriptionEnglish || 'Global procurement platform for specialized steel resources.';
  
  const heroImageUrl = hub?.heroImageUrl || 'https://images.unsplash.com/photo-1542244547-083ad17639a2?q=80&w=2000&auto=format&fit=crop';

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex justify-between items-center px-4 md:px-margin h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-2 md:gap-stack-lg min-w-0">
            <a href="/" className="text-body-base md:text-headline-md font-headline-md text-primary flex items-center gap-1 shrink-0">
              esg<span className="text-esg-emerald hidden sm:inline">.</span><span className="hidden sm:inline">team</span>
            </a>
            <span className="text-outline-variant shrink-0">|</span>
            <a href={`/hubs/${hubSlug}`} className="text-label-sm md:text-body-base font-bold text-secondary truncate">
              {hub?.title || 'Industrial Hub'}
            </a>
            <nav className="hidden lg:flex gap-4 xl:gap-gutter ml-2 xl:ml-stack-lg">
              <a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}`}>首頁 Home</a>
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/products`}>產品 Products</a>
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/market`}>市場 Market</a>
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/supply-chain`}>供應鏈 Supply Chain</a>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-gutter shrink-0 pl-2">
            <div className="hidden xl:flex items-center bg-surface-container-low px-stack-md py-stack-sm rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant mr-stack-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-label-sm w-48 outline-none" placeholder="Search partners..." type="text"/>
            </div>
            <div className="flex items-center gap-2 md:gap-stack-sm">
              <button className="hidden sm:block px-2 md:px-gutter py-2 md:py-stack-sm text-secondary font-label-sm whitespace-nowrap hover:underline transition-all cursor-pointer">登錄 Sign In</button>
              <button className="px-3 md:px-gutter py-2 md:py-stack-sm bg-primary text-on-primary font-label-sm rounded-lg cursor-pointer active:scale-95 duration-150 whitespace-nowrap">
                <span className="hidden sm:inline">聯絡銷售 Contact Sales</span>
                <span className="sm:hidden">Contact</span>
              </button>
            </div>
          </div>
        </div>
        <div className="lg:hidden border-t border-outline-variant bg-surface overflow-hidden">
          <nav className="flex overflow-x-auto no-scrollbar px-4 h-10 items-center gap-6">
            <a className="text-primary font-bold border-b-2 border-primary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}`}>首頁 Home</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/products`}>產品 Products</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/market`}>市場 Market</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/supply-chain`}>供應鏈 Supply Chain</a>
          </nav>
        </div>
      </header>

      <main className="pt-24 lg:pt-16">
        <section className="relative h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover" src={heroImageUrl} alt={hub?.heroImage?.alt || heroTitle} />
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 max-w-container-max mx-auto px-margin w-full">
            <div className="max-w-2xl">
              <h1 className="font-display-lg text-display-lg mb-stack-md" style={{ color: heroTitleColor }}>
                <span className="block">{heroTitle}</span>
                <span className="text-headline-md block opacity-80 mt-1" style={{ color: heroSubtitleColor }}>{heroSubtitle}</span>
              </h1>
              <p className="font-body-base text-body-base mb-stack-lg" style={{ color: heroDescriptionColor }}>
                <span className="block opacity-90 whitespace-pre-line">{heroDescription}</span>
                <span className="text-sm opacity-70 block mt-1 whitespace-normal">{heroDescriptionEnglish}</span>
              </p>
              <div className="bg-surface-container-lowest p-2 flex flex-col sm:flex-row items-center rounded-lg shadow-xl gap-2 w-full max-w-2xl">
                <div className="flex-1 flex items-center gap-3 px-4 w-full">
                  <span className="material-symbols-outlined text-secondary text-lg">search</span>
                  <input type="text" placeholder="搜索市場... Search Markets..." className="w-full bg-transparent border-none outline-none text-primary py-3 text-sm" />
                </div>
                <div className="flex flex-row gap-2 w-full sm:w-auto shrink-0">
                  <a href={hub?.contactUrl || '#'} className="flex-1 sm:flex-none bg-surface-container-high text-primary px-5 py-3 rounded font-bold text-sm hover:bg-surface-container-highest transition-colors whitespace-nowrap text-center">
                    {hub?.quoteButtonText || '獲取報價'}
                  </a>
                  <button className="flex-1 sm:flex-none bg-primary text-on-primary px-6 py-3 rounded font-bold text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:bg-primary/90 transition-colors">
                    搜尋 <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container py-stack-md border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-stack-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-stack-sm shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">monitoring</span>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">市場實時指數</span>
                </div>
                <span className="text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                  最後更新: {indices[0]?.lastSync ? new Date(indices[0].lastSync).toLocaleString('zh-TW') : 'Live'}
                </span>
              </div>
              <div className="flex flex-1 justify-around items-center divide-x divide-outline-variant overflow-x-auto no-scrollbar w-full">
                {indices.map((index) => (
                  <div key={index._id} className="px-gutter text-center min-w-[150px]">
                    <div className="font-label-sm text-[10px] text-on-surface-variant mb-1">{index.name}</div>
                    <div className="font-data-mono text-primary font-bold">{index.value} <span className="text-[10px] text-esg-emerald">{index.trendPercentage}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Global Benchmarks Section - 極簡橫向儀表板佈局 (依據用戶截圖重構) */}
        <section className="bg-surface-container-low py-4 border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            
            {/* 左側資訊群組 */}
            <div className="flex flex-col gap-2 min-w-[420px]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">fact_check</span>
                  <span className="font-bold text-primary text-[13px] tracking-tight">全球碳基準</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-primary uppercase font-bold tracking-tighter">DATA SOURCES:</span>
                  <div className="flex gap-1">
                    {['IEA 2023', 'Ember Energy', 'MOEA Admin'].map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-surface-container-high rounded text-[9px] text-secondary font-bold border border-outline-variant/50">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-primary font-medium text-[10px] italic opacity-80 leading-tight">
                展示各國電力能源之二氧化碳排放強度 (gCO2e/kWh)。選擇低碳強度地區生產，可有效降低您 Scope 3 之供應鏈碳足跡。
              </p>
            </div>

            {/* 右側數據群組 - 一字排開 */}
            <div className="flex-1 flex flex-wrap xl:flex-nowrap items-end justify-start xl:justify-end gap-x-8 gap-y-4">
              {benchmarks.map((item) => {
                const maxWidth = 0.6;
                const percentage = Math.min((item.currentValue / maxWidth) * 100, 100);
                const colorClass = item.currentValue > 0.4 ? 'bg-error' : item.currentValue > 0.3 ? 'bg-secondary' : 'bg-esg-emerald';

                return (
                  <div key={item._id} className="w-[120px] flex flex-col gap-1 shrink-0">
                    <div className="flex justify-between items-end px-0.5">
                      <span className="text-[10px] font-bold text-primary opacity-70 uppercase tracking-tighter">{item.title.split(' ')[0]}</span>
                      <span className="font-data-mono text-[11px] font-bold text-secondary leading-none">{item.currentValue}</span>
                    </div>
                    <div className="h-[3px] w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colorClass} opacity-90 transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* AI Market Insight Section - 神經網絡動態背景 */}
        {hub.aiInsight?.isActive !== false && (
          <section className="py-12 bg-surface overflow-hidden relative border-b border-outline-variant">
            {/* 神經網絡背景效果 (CSS 動態模擬) */}
            <div className="absolute inset-0 opacity-10 z-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-esg-emerald rounded-full blur-[150px] animate-pulse delay-1000"></div>
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(var(--m3-sys-color-primary-rgb), 0.1) 1px, transparent 0)',
                backgroundSize: '40px 40px' 
              }}></div>
            </div>

            <div className="max-w-container-max mx-auto px-margin relative z-10">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl relative group overflow-hidden">
                {/* 裝飾性光束 */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
                
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-xl">psychology</span>
                      </div>
                      <div>
                        <h3 className="font-display-sm text-primary flex items-center gap-2">
                          AI 即時趨勢洞察 
                          <span className="text-[10px] bg-surface-container-high text-outline px-2 py-0.5 rounded uppercase tracking-widest font-bold border border-outline-variant/50">Enterprise Edition</span>
                        </h3>
                        <p className="text-[11px] text-secondary font-mono">Last analysis: {hub.aiInsight?.analysisDate ? new Date(hub.aiInsight.analysisDate).toLocaleDateString() : 'Real-time'}</p>
                      </div>
                    </div>

                    <div className="relative mb-8 min-h-[100px]">
                      <p className="text-body-lg text-primary leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-1000">
                        {hub.aiInsight?.insightText || "當前 AI 正在解析全球碳強度波動與產業採購動向，請稍後..."}
                      </p>
                      {/* 打字機光標動畫 */}
                      <span className="inline-block w-1 h-5 bg-esg-emerald animate-pulse ml-1 align-middle"></span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-outline uppercase font-bold">市場判定:</span>
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${
                            hub.aiInsight?.trendLabel?.includes('警戒') ? 'bg-error/10 text-error border-error/20' : 
                            hub.aiInsight?.trendLabel?.includes('穩定') ? 'bg-secondary/10 text-secondary border-secondary/20' :
                            'bg-esg-emerald/10 text-esg-emerald border-esg-emerald/20 shadow-esg-emerald/10'
                          }`}>
                            {hub.aiInsight?.trendLabel || "數據演算中"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-outline uppercase font-bold">信心指數:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-data-mono text-primary font-bold">{hub.aiInsight?.confidenceScore || "98.5"}%</span>
                            <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-1000" 
                                style={{ width: `${hub.aiInsight?.confidenceScore || 98.5}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Disclaimer */}
                      <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-esg-emerald opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-esg-emerald"></span>
                        </span>
                        <span className="text-[10px] text-secondary font-medium italic">
                          本分析由 ESG.AI 模型自動生成，僅供決策參考
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-72 shrink-0 bg-surface-container-low border border-outline-variant rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="text-[11px] font-bold text-outline uppercase tracking-widest mb-4">AI 掃描參數</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Supply Chain Volatility', value: 'Low' },
                          { label: 'Carbon Pricing Trend', value: 'Rising' },
                          { label: 'Regional Compliance', value: 'Strict' }
                        ].map((param, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                            <span className="text-[10px] text-secondary">{param.label}</span>
                            <span className="text-[10px] font-bold text-primary">{param.value}</span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-6 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-2">
                        獲取完整顧問報告 <span className="material-symbols-outlined text-sm">download</span>
                      </button>
                    </div>
                    {/* 微型動態背景 */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-[0.03]" style={{ 
                      backgroundImage: 'linear-gradient(45deg, var(--m3-sys-color-primary) 1px, transparent 1px), linear-gradient(-45deg, var(--m3-sys-color-primary) 1px, transparent 1px)',
                      backgroundSize: '10px 10px'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-surface-container-lowest py-stack-lg px-margin max-w-container-max mx-auto border-b border-outline-variant">
          <div className="mb-stack-lg text-center max-w-3xl mx-auto">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 font-label-sm text-label-sm rounded-full mb-4 inline-block">Industry Primer 產業科普</span>
            <h2 className="font-display-lg text-display-lg text-primary mb-4">解碼核心資產價值</h2>
            <p className="font-body-base text-body-base text-on-surface-variant mb-8">專為供應鏈夥伴、中間商與跨領域投資者設計的快速入門指南。</p>
            <div className="flex flex-wrap justify-center gap-4">
              {eduPages.map((edu) => (
                <a key={edu._id} href={`/hubs/${hubSlug}/edu/${edu.slug}`} className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                  探索科普：{edu.title}
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg mb-16 items-center">
             <div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4">{hub?.features ? '核心技術特點' : '高性能導電體'}</h3>
                <ul className="space-y-6 mt-8">
                  {(hub?.features || []).map((feature, i) => (
                    <li key={i} className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                         <span className="material-symbols-outlined text-sm">{feature.icon || 'star'}</span>
                       </div>
                       <div>
                         <strong className="block text-primary mb-1">{feature.title}</strong>
                         <div className="text-on-surface-variant text-sm leading-relaxed">
                           <PortableText value={feature.description} components={ptComponents} />
                         </div>
                       </div>
                    </li>
                  ))}
                </ul>
             </div>
             <div className="bg-surface-variant rounded-2xl h-64 lg:h-full min-h-[400px] overflow-hidden relative shadow-inner">
                {hub?.featureImageUrl && <img src={hub.featureImageUrl} alt="Feature" className="w-full h-full object-cover"/>}
             </div>
          </div>
        </section>

        <section className="py-stack-lg px-margin max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg">{hub?.productSectionTitle || '資源目錄'}</h2>
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

        <section className="bg-surface-container-low py-stack-lg border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin">
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg">{hub?.insightSectionTitle || '供應鏈情報'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {insights.map((insight) => (
                <a key={insight._id} href={insight.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl hover:shadow-xl transition-all">
                  <span className="text-xs text-on-tertiary-container mb-2 block">{insight.category}</span>
                  <h3 className="font-bold text-primary mb-2 line-clamp-2">{insight.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-3">{insight.summary}</p>
                </a>
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
