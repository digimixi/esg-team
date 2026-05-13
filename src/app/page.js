import { client } from '@/sanity/lib/client';

export const revalidate = 0; // 強制不快取，隨時抓取最新資料

export default async function Home() {
    // 1. 向 Sanity 後台要「市場即時指數」的資料，並依據您在後台設定的 order 排序
    const indices = await client.fetch('*[_type == "marketIndex"] | order(order asc)');
    // 2. 向 Sanity 後台取得「全域版面設定」
    const settings = await client.fetch(`*[_type == "siteSettings"][0] {
    ...,
    "homeHeroImageUrl": homeHeroImage.asset->url
  }`);

    // 如果後台沒填，給予預設值防呆
    const macroTitle = settings?.macroSectionTitle || '全球永續宏觀數據';
    const macroSubtitle = settings?.macroSectionSubtitle || 'Global ESG Macros';
    const homeHeroTitle = settings?.homeHeroTitle || '建構重工業與供應鏈的未來';
    const homeHeroTitleEnglish = settings?.homeHeroTitleEnglish || 'Connecting Green Materials, Circular Economy, and Sustainable Logic';
    const homeHeroDescription = settings?.homeHeroDescription || 'esg.team 是一個跨領域的永續聚合入口。我們聚焦具備戰略意義的工業板塊，為全球買家與供應商提供去碳化路徑與精準的資源配置系統。';
    const homeHeroImageUrl = settings?.homeHeroImageUrl;

    // 3. 向 Sanity 後台取得所有的 Hubs (排除被手動關閉的)
    const hubs = await client.fetch(`*[_type == "hub" && isActive != false] {
    _id,
    title,
    "slug": slug.current,
    heroSubtitle,
    heroDescription,
    heroDescriptionEnglish,
    "imageUrl": heroImage.asset->url,
    themeColor,
    isFeatured,
    tags
  } | order(isFeatured desc, _createdAt asc)`);

    // 4. 取得最新採集的情報文章 (只抓「已採用」的最新的 4 篇)
    const latestInsights = await client.fetch(`*[_type == "insight" && isActive == true] | order(publishedAt desc) [0...4] {
        _id,
        title,
        excerpt,
        summary,
        publishedAt,
        source,
        externalUrl,
        category,
        isActive,
        "hubTitle": hub->title
    }`);

    // 5. 獲取全球碳基準數據 (用於首頁展示)
    const benchmarks = await client.fetch(`*[_type == "industryBenchmark" && category == "intensity"] | order(currentValue asc)`, {}, { useCdn: false });


    return (
        <>
            {/* TopNavBar */}
            <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
                <div className="flex justify-between items-center px-4 md:px-margin h-16 max-w-container-max mx-auto">
                    <div className="flex items-center gap-2 md:gap-stack-lg min-w-0">
                        <span className="text-body-base md:text-headline-md font-headline-md text-primary flex items-center gap-1 shrink-0">
                            esg<span className="text-esg-emerald hidden sm:inline">.</span><span className="hidden sm:inline">team</span>
                        </span>
                        <nav className="hidden lg:flex gap-stack-md ml-4 xl:ml-stack-lg">
                            <a className="flex flex-col text-primary font-bold border-b-2 border-primary pb-1 group whitespace-nowrap" href="#">
                                <span className="font-body-base text-body-base">全域入口</span>
                                <span className="text-[10px] uppercase tracking-tighter opacity-70">Global Portal</span>
                            </a>
                            <a className="flex flex-col text-secondary hover:text-primary transition-colors group whitespace-nowrap" href="#">
                                <span className="font-body-base text-body-base">碳資產管理</span>
                                <span className="text-[10px] uppercase tracking-tighter opacity-70">Carbon Assets</span>
                            </a>
                            <a className="flex flex-col text-secondary hover:text-primary transition-colors group whitespace-nowrap" href="#">
                                <span className="font-body-base text-body-base">永續洞察</span>
                                <span className="text-[10px] uppercase tracking-tighter opacity-70">Insights</span>
                            </a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2 md:gap-stack-md shrink-0">
                        <button className="hidden sm:block cursor-pointer active:scale-95 duration-150 text-secondary font-label-sm text-label-sm px-2 md:px-4 py-2 whitespace-nowrap">聯繫團隊 <span className="text-[10px] ml-1 opacity-70 italic">Contact</span></button>
                        <button className="cursor-pointer active:scale-95 duration-150 bg-primary text-on-primary px-3 md:px-6 py-2 font-label-sm text-label-sm rounded whitespace-nowrap">企業登錄 <span className="hidden md:inline text-[10px] ml-1 opacity-80">Enterprise Login</span></button>
                    </div>
                </div>
            </header>

            <main className="pt-16">
                <section className="relative h-[500px] flex items-center overflow-hidden border-b border-outline-variant">
                    <div className="absolute inset-0 z-0 bg-surface-container-high">
                        {homeHeroImageUrl ? (
                            <img src={homeHeroImageUrl} className="w-full h-full object-cover opacity-60" alt="Home Hero" />
                        ) : (
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/80 to-surface"></div>
                    </div>
                    <div className="relative z-10 max-w-container-max mx-auto px-margin w-full flex flex-col items-center text-center">
                        <div className="mb-4 inline-flex items-center border border-outline-variant bg-surface-container-lowest px-3 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-esg-emerald mr-2"></span>
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">全球產業綠色轉型聚合平台</span>
                        </div>
                        <h1 className="font-display-lg text-display-lg text-primary mb-stack-md max-w-4xl mx-auto">
                            <span className="block">{homeHeroTitle}</span>
                            <span className="text-headline-md block text-secondary mt-2">{homeHeroTitleEnglish}</span>
                        </h1>
                        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto mb-stack-lg">
                            {homeHeroDescription}
                        </p>
                    </div>
                </section>

                <section className="bg-surface-container py-stack-md border-b border-outline-variant">
                    <div className="max-w-container-max mx-auto px-margin">
                        <div className="flex flex-wrap items-center justify-between gap-stack-lg">
                            <div className="flex items-center gap-stack-sm">
                                <span className="material-symbols-outlined text-secondary">public</span>
                                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{macroTitle} <span className="text-[10px] lowercase opacity-70 ml-1">{macroSubtitle}</span></span>
                            </div>
                            <div className="flex flex-1 justify-around items-center divide-x divide-outline-variant overflow-x-auto no-scrollbar">
                                {/* 2. 把剛剛要到的資料 (indices) 迴圈印出來 */}
                                {indices.map((index) => {
                                    const isUp = index.trendStatus === 'up';
                                    const isDown = index.trendStatus === 'down';
                                    const trendColor = isUp ? '#059669' : (isDown ? '#dc2626' : '#6b7280');
                                    const history = index.history || [];

                                    // 繪製簡單的 Sparkline
                                    const renderSparkline = (data, color) => {
                                      if (!data || data.length < 2) return null;
                                      const min = Math.min(...data);
                                      const max = Math.max(...data);
                                      const range = (max - min) || 1;
                                      const width = 60;
                                      const height = 16;
                                      const points = data.map((v, i) => ({
                                        x: (i / (data.length - 1)) * width,
                                        y: height - ((v - min) / range) * (height - 4) - 2
                                      }));
                                      const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
                                      return (
                                        <svg width={width} height={height} className="ml-2">
                                          <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      );
                                    };

                                    return (
                                        <div key={index._id} className="px-gutter text-center min-w-[180px] group">
                                            <div className="font-label-sm text-[10px] text-on-surface-variant mb-1 flex items-center justify-center gap-1">
                                                {index.name} {index.unit && <span className="opacity-60">{index.unit}</span>}
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="font-data-mono text-data-mono text-primary font-bold">
                                                    {index.value}
                                                </div>
                                                <div className={`flex items-center text-[11px] font-bold`} style={{ color: trendColor }}>
                                                    {isUp && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                                                    {isDown && <span className="material-symbols-outlined text-[14px]">trending_down</span>}
                                                    {index.trendPercentage}
                                                </div>
                                            </div>
                                            <div className="mt-1 flex justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                                {renderSparkline(history, trendColor)}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* 如果後台還沒建資料，顯示提示 */}
                                {indices.length === 0 && (
                                    <div className="px-gutter text-center w-full">
                                        <div className="font-label-sm text-label-sm text-outline">Sanity 尚無數據，請至後台新增</div>
                                    </div>
                                )}
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

                {/* Industry Hubs Section */}
                <section className="bg-surface py-stack-lg px-margin max-w-container-max mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="font-label-sm text-label-sm uppercase tracking-widest">Industry Verticals</span>
                            </div>
                            <h2 className="font-display-md text-display-md text-primary mb-2">產業聚合專題</h2>
                            <p className="font-body-base text-body-base text-on-surface-variant">esg.team 核心運作中的產業板塊。我們透過數位化技術整合分散的工業資源，建立可持續發展的垂直鏈條。</p>
                        </div>
                        <div className="hidden md:block">
                            <button className="text-secondary hover:text-primary transition-colors flex items-center gap-2 font-label-sm text-label-sm">
                                查看發展藍圖 <span className="material-symbols-outlined text-sm">north_east</span>
                            </button>
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                        {hubs.map((hub, index) => {
                            const isFeatured = hub.isFeatured || index === 0;
                            const imageUrl = hub.imageUrl || 'https://images.unsplash.com/photo-1565893306013-1082c976935d?q=80&w=2000&auto=format&fit=crop';
                            const displayTitle = hub.title || 'Industrial Hub';
                            const displaySubtitle = hub.heroSubtitle || '';

                            return (
                                <a
                                    key={hub._id}
                                    href={`/hubs/${hub.slug}`}
                                    className={`${isFeatured ? 'md:col-span-8 h-[400px]' : 'md:col-span-4 h-[400px]'} relative rounded-2xl overflow-hidden group border border-outline-variant transition-all hover:shadow-2xl hover:-translate-y-1`}
                                >
                                    {/* Background Image with Overlay */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            src={imageUrl}
                                            alt={displayTitle}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-20 p-stack-lg flex flex-col justify-end">
                                        <div className="flex gap-2 mb-4">
                                            {(hub.tags || ['綠色材料', '循環經濟']).map((tag, idx) => (
                                                <span key={idx} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 font-label-sm text-[10px] rounded uppercase">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className={`${isFeatured ? 'text-display-sm' : 'text-headline-md'} font-headline-md text-white mb-2 group-hover:text-esg-emerald transition-colors`}>
                                            {displayTitle}
                                            {displaySubtitle && <span className="block text-label-sm font-normal text-white/70 mt-1 uppercase tracking-widest">{displaySubtitle}</span>}
                                        </h3>

                                        <div className={`overflow-hidden transition-all duration-500 ${isFeatured ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100'}`}>
                                            <p className="text-body-base text-white/80 line-clamp-2 mb-4 text-sm leading-relaxed">
                                                {hub.heroDescription || hub.heroDescriptionEnglish || '探索該產業的去碳化解決方案與供應鏈動態。'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10">
                                            <span className="text-white/60 font-label-sm text-[10px] uppercase tracking-tighter">
                                                {isFeatured ? 'Featured Hub / 精選專題' : 'Active Hub / 運行中'}
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-on-primary transition-all">
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Theme Color Indicator */}
                                    {hub.themeColor && (
                                        <div
                                            className="absolute top-0 left-0 w-full h-1 z-30"
                                            style={{ backgroundColor: hub.themeColor }}
                                        />
                                    )}
                                </a>
                            );
                        })}

                        {/* 產業矩陣網格結束 */}

                        {/* Planning Hubs in a row below */}
                        <div className="md:col-span-12 mt-12 grid grid-cols-1 md:grid-cols-2 gap-gutter">
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-lg flex gap-6 items-center group hover:border-secondary/50 transition-all">
                                <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                    <span className="material-symbols-outlined text-3xl">solar_power</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-primary text-lg">新能源與儲能</h4>
                                        <span className="text-[10px] bg-outline-variant px-1.5 py-0.5 rounded uppercase font-bold">Planning</span>
                                    </div>
                                    <p className="text-sm text-on-surface-variant">綠電憑證交易機制與大型儲能系統整合解決方案。</p>
                                </div>
                            </div>

                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-lg flex gap-6 items-center group hover:border-secondary/50 transition-all">
                                <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                    <span className="material-symbols-outlined text-3xl">eco</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-primary text-lg">永續農業與生質能</h4>
                                        <span className="text-[10px] bg-outline-variant px-1.5 py-0.5 rounded uppercase font-bold">Planning</span>
                                    </div>
                                    <p className="text-sm text-on-surface-variant">土壤碳捕捉技術與農業廢棄物轉化生質燃料網。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest Insights Section - 採集成果展示區 */}
                <section className="bg-surface-container-lowest py-stack-lg border-t border-outline-variant">
                    <div className="max-w-container-max mx-auto px-margin">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-esg-emerald/10 text-esg-emerald rounded-full mb-3">
                                    <span className="w-1.5 h-1.5 bg-esg-emerald rounded-full animate-pulse"></span>
                                    <span className="font-label-sm text-[10px] uppercase tracking-[0.2em] font-bold">Intelligence Hub</span>
                                </div>
                                <h2 className="font-display-sm text-display-sm text-primary">全球永續情報網</h2>
                                <p className="text-secondary text-sm mt-1">由 AI 引擎全時監控、採集並摘要的產業動向。</p>
                            </div>
                            <a href="#" className="hidden md:flex items-center gap-2 text-primary font-bold text-sm border-b border-primary/20 hover:border-primary transition-all pb-1">
                                進入情報中心 <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                            {latestInsights.map((insight) => (
                                <a 
                                    key={insight._id} 
                                    href={insight.externalUrl || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex flex-col bg-surface border border-outline-variant rounded-xl p-5 hover:shadow-2xl hover:-translate-y-1 transition-all group relative cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] bg-outline-variant/30 text-secondary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                            {insight.source || 'Intelligence'}
                                        </span>
                                        <span className="text-[10px] text-outline font-mono">
                                            {new Date(insight.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-primary mb-3 line-clamp-2 group-hover:text-esg-emerald transition-colors">
                                        {insight.title}
                                    </h3>
                                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3 mb-6 opacity-80">
                                        {insight.summary || insight.excerpt || '點擊進入閱讀 AI 生成的專業摘要內容。'}
                                    </p>
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-outline-variant/50">
                                        <span className="text-[10px] text-esg-emerald font-bold">
                                            #{insight.hubTitle || '全域情報'}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                                            <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                            
                            {latestInsights.length === 0 && (
                                <div className="col-span-full py-12 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl">
                                    <div className="text-outline text-sm italic">尚無情報，請從後台啟動「全球情報採集盒」</div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-surface border-t border-outline-variant w-full py-stack-lg mt-12">
                <div className="text-center">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">© 2024 esg.team . Empowering the Green Transition.</span>
                </div>
            </footer>
        </>
    );
}
