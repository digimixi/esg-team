import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

export const revalidate = 0; // 強制不快取，確保重新整理時立刻抓取最新資料

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

export default async function HubHome({ params }) {
  const { hubSlug } = await params;

  // Fetch data from Sanity
  // Get the hub document
  const hub = await client.fetch(`*[_type == "hub" && slug.current == $slug][0] {
    ...,
    "heroImageUrl": heroImage.asset->url,
    "featureImageUrl": featureImage.asset->url
  }`, { slug: hubSlug }, { next: { revalidate: 0 } });
  
  // 如果找不到該專題，或者該專題被明確設定為「關閉 (isActive === false)」
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
  
  const indices = await client.fetch('*[_type == "marketIndex"] | order(order asc)');
  // Fetch products that are linked to this hub
  const products = await client.fetch('*[_type == "product" && hub->slug.current == $slug] | order(_createdAt desc)', { slug: hubSlug });
  // Fetch insights that are linked to this hub
  const insights = await client.fetch('*[_type == "insight" && hub->slug.current == $slug] | order(publishedAt desc)[0...4]', { slug: hubSlug });

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
      {/* TopNavBar */}
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

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-outline-variant bg-surface overflow-hidden">
          <nav className="flex overflow-x-auto no-scrollbar px-4 h-10 items-center gap-6">
            <a className="text-primary font-bold border-b-2 border-primary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}`}>首頁 Home</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/products`}>產品 Products</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/market`}>市場 Market</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/supply-chain`}>供應鏈 Supply Chain</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href="/login">登錄 Sign In</a>
          </nav>
        </div>
      </header>

      <main className="pt-24 lg:pt-16">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover" 
              src={heroImageUrl} 
              alt={hub?.heroImage?.alt || heroTitle} 
            />
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
              
              <div className="bg-surface-container-lowest p-2 md:p-2 flex flex-col sm:flex-row items-center rounded-lg shadow-xl gap-2 w-full max-w-2xl">
                <div className="flex-1 flex items-center gap-3 px-4 w-full">
                  <span className="material-symbols-outlined text-secondary text-lg">search</span>
                  <input type="text" placeholder="搜索市場... Search Markets..." className="w-full bg-transparent border-none outline-none text-primary py-3 text-sm" />
                </div>
                <div className="flex flex-row gap-2 w-full sm:w-auto shrink-0">
                  <a 
                    href={hub?.contactUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none bg-surface-container-high text-primary px-5 py-3 rounded font-bold text-sm hover:bg-surface-container-highest transition-colors whitespace-nowrap text-center"
                  >
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

        {/* Quick Stats / Price Indices */}
        <section className="bg-surface-container py-stack-md border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-stack-lg">
              <div className="flex items-center gap-stack-sm shrink-0">
                <span className="material-symbols-outlined text-secondary">monitoring</span>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">市場實時指數 <span className="hidden sm:inline text-[10px] lowercase opacity-70 ml-1">Market Live Index</span></span>
              </div>
              <div className="flex flex-1 justify-start lg:justify-around items-center divide-x divide-outline-variant overflow-x-auto no-scrollbar w-full pb-2 lg:pb-0">
                {indices.map((index) => {
                    const isUp = index.trendStatus === 'up';
                    const isDown = index.trendStatus === 'down';
                    const trendColor = isUp ? 'text-[#059669]' : (isDown ? 'text-[#dc2626]' : 'text-on-surface-variant');
                    
                    return (
                        <div key={index._id} className="px-gutter text-center min-w-[150px]">
                            <div className="font-label-sm text-label-sm text-on-surface-variant">{index.name} {index.unit && `(${index.unit})`}</div>
                            <div className="font-data-mono text-data-mono text-primary flex items-center justify-center gap-1">
                                {index.value} <span className={trendColor}>{index.trendPercentage}</span>
                            </div>
                        </div>
                    );
                })}
                {indices.length === 0 && (
                    <div className="px-gutter text-center w-full">
                        <div className="font-label-sm text-label-sm text-outline">Sanity 尚無數據，請至後台新增</div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Industry Primer / Knowledge Base */}
        <section className="bg-surface-container-lowest py-stack-lg px-margin max-w-container-max mx-auto border-b border-outline-variant">
          <div className="mb-stack-lg text-center max-w-3xl mx-auto">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 font-label-sm text-label-sm rounded-full mb-4 inline-block">Industry Primer 產業科普</span>
            <h2 className="font-display-lg text-display-lg text-primary mb-4">解碼核心資產價值</h2>
            <p className="font-body-base text-body-base text-on-surface-variant">專為供應鏈夥伴、中間商與跨領域投資者設計的快速入門指南。</p>
          </div>

          {/* 1. Core Features (Image 3 equivalent) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg mb-16 items-center">
             <div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4">{hub?.features ? '核心技術特點' : '高性能導電體，極限環境下的工業命脈'}</h3>
                <ul className="space-y-6 mt-8">
                  {(hub?.features || [
                    {title: '抗氧化與抗剝落處理', description: '表面經過特殊塗層處理，大幅提高在高溫爐內的耐用性，降低損耗與開裂風險。', icon: 'shield'},
                    {title: '極高密度與機械強度', description: '電流密度可達 18-30 A/cm²，輕鬆抵抗煉鋼過程中的嚴酷機械衝擊與化學侵蝕。', icon: 'compress'},
                    {title: '優異的抗熱震性', description: '對反應物質引起的溫度劇烈衝擊有極強抵抗力，確保電流穩定流動。', icon: 'thermostat'}
                  ]).map((feature, i) => (
                    <li key={i} className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                         <span className="material-symbols-outlined text-sm">{feature.icon || 'star'}</span>
                       </div>
                       <div>
                         <strong className="block text-primary mb-1">{feature.title}</strong>
                         <div className="text-on-surface-variant text-sm leading-relaxed">
                           {Array.isArray(feature.description) ? (
                             <PortableText value={feature.description} components={ptComponents} />
                           ) : (
                             feature.description
                           )}
                         </div>
                       </div>
                    </li>
                  ))}
                </ul>
             </div>
             <div className="bg-surface-variant rounded-2xl h-64 lg:h-full min-h-[400px] overflow-hidden relative shadow-inner">
                {hub?.featureImageUrl ? (
                  <img src={hub.featureImageUrl} alt="Feature" className="w-full h-full object-cover"/>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary to-tertiary flex flex-col items-center justify-center text-on-secondary p-8 text-center">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50">photo_camera</span>
                    <span className="font-headline-md font-bold mb-2">特寫視覺插槽</span>
                    <span className="font-label-sm opacity-70">在此放置高解析度實物圖 (Feature Image)</span>
                  </div>
                )}
             </div>
          </div>

          {/* 2. Application Matrix (Image 1 equivalent) */}
          <div className="mb-16">
            <h3 className="font-headline-md text-headline-md text-primary mb-8 text-center">
              {hub?.applicationSectionTitle || '關鍵應用場域'}
              {hub?.applicationSectionTitleEnglish && <span className="block text-label-sm font-normal text-outline mt-1">{hub.applicationSectionTitleEnglish}</span>}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
               {(hub?.applications || [
                 {title: '鋼鐵及有色金屬熔煉', description: '高功率電極適用於爐內熔化廢鋼，是電弧爐(EAF)煉鋼不可或缺的核心耗材。', icon: 'factory'},
                 {title: '生產鐵合金', description: '適用於生產鐵合金的電熔爐，也廣泛用於黃磷、電石、純矽等高耗能冶煉。', icon: 'diamond'},
                 {title: '金屬矽製造', description: '堅韌耐熱，通過熔化石英和碳等原材料來生產矽，供應太陽能板與半導體產業。', icon: 'solar_power'},
                 {title: '化工電解加工', description: '在抗氧化和抗化學侵蝕的嚴苛電化學加工與鑿孔作業流程中發揮穩定效能。', icon: 'science'}
               ]).map((app, i) => (
                  <div key={i} className="bg-surface p-stack-md rounded-xl border border-outline-variant hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-default">
                     <div className="w-12 h-12 bg-surface-container-high text-secondary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                        <span className="material-symbols-outlined">{app.icon || 'apps'}</span>
                     </div>
                     <h4 className="font-bold text-primary mb-3 text-lg">{app.title}</h4>
                     <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{app.description || app.desc}</p>
                  </div>
               ))}
            </div>
          </div>

          {/* 3. Specs & Types (Image 2 & 4 equivalent) */}
          <div className="bg-surface-container-low rounded-2xl p-stack-lg border border-outline-variant relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="font-headline-md text-headline-md text-primary mb-8 relative z-10">規格與製程解析</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant relative z-10">
               {(hub?.specGroups || [
                 {
                   title: '功率與類型', 
                   icon: 'category', 
                   description: '依據電流承載能力與煉鋼需求，產品矩陣分為三大主流標準：',
                   specs: [
                     {label: 'RP (普通功率)', value: '適用於標準 EAF 操作與通用鋼材。'},
                     {label: 'HP (高功率)', value: '高產能煉鋼首選。'},
                     {label: 'UHP/SHP (超高功率)', value: '專為極端苛刻的煉鋼條件與最大化產出設計。'}
                   ]
                 },
                 {
                   title: '物理與電流規格', 
                   icon: 'straighten',
                   specs: [
                     {label: '直徑範圍', value: '200mm - 750mm'},
                     {label: '最大延伸長度', value: '2700mm'},
                     {label: '電流密度預期', value: '18-30 A/cm²'}
                   ]
                 },
                 {
                   title: '頂級原料與嚴格製程', 
                   icon: 'precision_manufacturing',
                   description: '採用世界一流的針狀焦 (Needle Coke) 與優質煤瀝青為核心原料。',
                   isProcess: true, // Custom flag for the horizontal steps
                   steps: ['煅燒', '混捏', '成型', '焙燒', '石墨化', '精密加工']
                 }
               ]).map((group, i) => (
                 <div key={i} className={`${i === 0 ? 'lg:pr-8' : i === 1 ? 'lg:px-8' : 'lg:pl-8'} pt-8 lg:pt-0`}>
                   <h4 className="text-primary font-bold mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-secondary">{group.icon || 'info'}</span> {group.title}
                   </h4>
                   {group.description && <p className="text-sm text-on-surface-variant mb-4 leading-relaxed whitespace-pre-line">{group.description}</p>}
                   
                   {group.isProcess ? (
                     <>
                       <div className="flex flex-wrap gap-2">
                          {group.steps?.map((step, idx) => (
                            <span key={idx} className="bg-surface-container-highest px-2 py-1 text-xs rounded border border-outline-variant text-on-surface-variant flex items-center gap-1">
                              {step} {idx !== group.steps.length - 1 && <span className="material-symbols-outlined text-[10px] opacity-50">arrow_forward_ios</span>}
                            </span>
                          ))}
                       </div>
                       <p className="text-xs text-outline mt-4 italic">註：石墨化過程需達到 3000°C 極限高溫，確保晶體結構完美轉化。</p>
                     </>
                   ) : (
                     <ul className="text-sm text-on-surface-variant space-y-4">
                       {group.specs?.map((spec, si) => (
                         <li key={si} className="flex justify-between border-b border-outline-variant/50 pb-2">
                           <span className="text-outline">{spec.label}</span>
                           <span className="font-data-mono font-medium text-primary text-right ml-4">{spec.value}</span>
                         </li>
                       ))}
                     </ul>
                   )}
                 </div>
               ))}
            </div>
          </div>
        </section>
        <section className="py-stack-lg px-margin max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-2">
                {hub?.productSectionTitle || '工業資源目錄'} 
                <span className="text-label-sm font-normal text-outline ml-2">Industrial Resource Catalog</span>
              </h2>
              <p className="font-body-base text-body-base text-on-surface-variant whitespace-pre-line">
                {hub?.productSectionDescription || '為高性能鋼鐵生產提供直接採購解決方案。'}
                <br/>
                <span className="text-xs">{hub?.productSectionDescriptionEnglish || 'Direct sourcing for high-performance production materials.'}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {products.map((product) => (
              <div key={product._id} className="bg-surface-container-lowest border border-outline-variant hover:shadow-lg transition-all flex flex-col">
                <div className="h-48 overflow-hidden bg-surface-variant">
                  {product.image ? (
                    <img 
                      className="w-full h-full object-cover" 
                      src={urlFor(product.image).width(600).height(400).url()} 
                      alt={product.name} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">No Image</div>
                  )}
                </div>
                <div className="p-stack-md flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-1 font-label-sm text-label-sm rounded">{product.gradeBadge || 'STANDARD GRADE'}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">{product.title}<br/><span className="text-label-sm font-normal text-on-surface-variant">{product.subtitle}</span></h3>
                  <p className="font-body-base text-body-base text-on-surface-variant mb-stack-md flex-1 whitespace-pre-line line-clamp-4 overflow-hidden">{product.description}</p>
                  <div className="pt-stack-md border-t border-outline-variant flex justify-between items-center">
                    <span className="font-data-mono text-data-mono text-primary">In Stock: {product.stock || 'N/A'}</span>
                    <a 
                      href={hub?.contactUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary font-bold font-label-sm text-label-sm flex items-center hover:opacity-70 transition-opacity"
                    >
                      {hub?.quoteButtonText || '獲取報價'} 
                      <span className="text-[10px] ml-1 font-normal opacity-70 uppercase">
                        {hub?.quoteButtonTextEnglish || 'REQUEST QUOTE'}
                      </span> 
                      <span className="material-symbols-outlined ml-1">chevron_right</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="col-span-3 py-12 text-center text-outline font-body-base">
                尚無產品資料，請至 Sanity 後台的「工業資源目錄 (Product Catalog)」新增。
              </div>
            )}
          </div>
        </section>

        {/* Industry News / Insights */}
        <section className="bg-surface-container-low py-stack-lg border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin">
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg">
              {hub?.insightSectionTitle || '供應鏈情報'} 
              <span className="text-label-sm font-normal text-outline ml-2">{hub?.insightSectionTitleEnglish || 'Supply Chain Intelligence'}</span>
            </h2>
            
            {insights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-gutter h-auto md:h-[500px]">
                  {insights.map((insight, index) => {
                    const isFeatured = insight.isFeatured;
                    // 若是精選，或者沒有設定精選但它是第一篇，就把它放大
                    if (isFeatured || index === 0) {
                        return (
                          <div key={insight._id} className="md:col-span-2 md:row-span-2 bg-surface-container-lowest border border-outline-variant p-stack-lg flex flex-col">
                            <span className="text-on-tertiary-container font-label-sm text-label-sm mb-2">{insight.category}</span>
                            <h3 className="text-headline-md font-headline-md mb-stack-sm">{insight.title}</h3>
                            <p className="text-body-base font-body-base text-on-surface-variant mb-stack-lg flex-1">{insight.summary}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-fixed">
                                    {insight.authorName ? insight.authorName.charAt(0) : 'E'}
                                </div>
                                <span className="font-label-sm text-label-sm">{insight.authorName || 'esg.team'}</span>
                              </div>
                            </div>
                          </div>
                        );
                    }
                    
                    // 其他小版面
                    return (
                        <div key={insight._id} className="md:col-span-1 bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col justify-center">
                            <span className="text-on-tertiary-container font-label-sm text-label-sm mb-2">{insight.category}</span>
                            <h4 className="font-body-base font-bold text-primary mb-2">{insight.title}</h4>
                            <p className="text-label-sm text-on-surface-variant line-clamp-3">{insight.summary}</p>
                        </div>
                    );
                  })}
                </div>
            ) : (
                <div className="py-12 text-center text-outline font-body-base">
                    尚無情報資料，請至 Sanity 後台的「供應鏈情報 (Supply Chain Insight)」新增。
                </div>
            )}
            
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant w-full py-stack-lg">
        <div className="text-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">© 2024 esg.team . Empowering the Green Transition.</span>
        </div>
      </footer>
    </>
  );
}
