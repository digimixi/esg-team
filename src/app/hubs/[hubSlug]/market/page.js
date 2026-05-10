import { client } from '@/sanity/lib/client';
import TradingViewChart from '@/components/TradingViewChart';

export const revalidate = 0;

export default async function Market({ params }) {
  const { hubSlug } = await params;

  // 1. 抓取專題基本資訊 (含聯繫網址)
  const hub = await client.fetch('*[_type == "hub" && slug.current == $slug][0]', { slug: hubSlug });

  // 2. 抓取市場指數 (用於跑馬燈與趨勢分析)
  const indices = await client.fetch('*[_type == "marketIndex"] | order(order asc)');

  // 3. 抓取最新產業情報 (用於專家簡報)
  const insights = await client.fetch(`*[_type == "insight" && hub->slug.current == $slug] | order(publishedAt desc)[0...3]{
    _id,
    title,
    "summary": excerpt,
    category,
    publishedAt,
    source,
    externalUrl
  }`, { slug: hubSlug });

  // 輔助函式：判斷漲跌顏色
  const getTrendColor = (trend) => {
    if (trend?.includes('▲') || trend?.includes('+')) return 'text-[#059669]';
    if (trend?.includes('▼') || trend?.includes('-')) return 'text-[#dc2626]';
    return 'text-on-surface-variant';
  };

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
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}`}>首頁 Home</a>
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/products`}>產品 Products</a>
              <a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/market`}>市場 Market</a>
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/supply-chain`}>供應鏈 Supply Chain</a>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-gutter shrink-0 pl-2">
            <div className="flex items-center gap-2 md:gap-stack-sm">
              <button className="hidden md:block px-2 md:px-gutter py-2 md:py-stack-sm text-secondary font-label-sm whitespace-nowrap hover:underline transition-all cursor-pointer">登錄 Sign In</button>
              <a 
                href={hub?.contactUrl || '#'} 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 md:px-gutter py-2 md:py-stack-sm bg-primary text-on-primary font-label-sm rounded-lg cursor-pointer active:scale-95 duration-150 whitespace-nowrap"
              >
                <span className="hidden sm:inline">聯絡銷售 Contact Sales</span>
                <span className="sm:hidden">Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-outline-variant bg-surface overflow-hidden">
          <nav className="flex overflow-x-auto no-scrollbar px-4 h-10 items-center gap-6">
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}`}>首頁 Home</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/products`}>產品 Products</a>
            <a className="text-primary font-bold border-b-2 border-primary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/market`}>市場 Market</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/supply-chain`}>供應鏈 Supply Chain</a>
          </nav>
        </div>
      </header>

      {/* 動態 Price Ticker */}
      <div className="mt-[104px] lg:mt-16 bg-surface-container-highest border-b border-outline-variant overflow-hidden">
        <div className="ticker-animate whitespace-nowrap py-2 flex">
          <div className="flex space-x-12 px-4 shrink-0">
            {indices.map((idx, i) => (
              <span key={i} className="flex items-center space-x-2">
                <span className="font-bold">{idx.name}:</span> 
                <span className="text-primary font-data-mono">{idx.value}</span> 
                <span className={`${getTrendColor(idx.trend)} text-label-sm font-data-mono`}>{idx.trend}</span>
              </span>
            ))}
          </div>
          {/* 重複一次以達成無縫滾動 */}
          <div className="flex space-x-12 px-4 shrink-0">
            {indices.map((idx, i) => (
              <span key={`dup-${i}`} className="flex items-center space-x-2">
                <span className="font-bold">{idx.name}:</span> 
                <span className="text-primary font-data-mono">{idx.value}</span> 
                <span className={`${getTrendColor(idx.trend)} text-label-sm font-data-mono`}>{idx.trend}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin py-stack-lg">
        <header className="mb-stack-lg">
          <h1 className="font-display-lg text-display-lg text-primary">
            市場洞察與採購分析<br/>
            <span className="text-headline-md font-normal block mt-1">Market Insights &amp; Procurement Analytics</span>
          </h1>
          <p className="text-on-surface-variant max-w-2xl mt-4">
            針對優質工業碳材料及鋼鐵合金的即時價格數據與戰略供應鏈分析。<br/>
            <span className="text-label-sm block mt-1">Real-time pricing data and strategic supply chain analysis for premium industrial carbon materials and steel alloys.</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* 左側：價格走勢分析 */}
          <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant p-6 flex flex-col space-y-6">
            
            {/* 價格走勢圖 Chart Section */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">價格走勢分析 <span className="text-white/40 font-normal text-lg ml-2">Price Trend Analysis</span></h3>
                  <p className="text-white/60">國際市場基準：美國鋼鐵 X 即時行情 (NYSE:X) | US Steel Corp Index</p>
                </div>
                <div className="flex gap-4">
                  <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-2 animate-pulse"></span>
                    Live Market
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full rounded-xl overflow-hidden bg-black/20">
                <TradingViewChart />
              </div>
            </div>
            
            {/* 動態數據摘要 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mt-4">
              {indices.slice(0, 3).map((idx, i) => (
                <div key={i} className="p-5 bg-surface-container border border-outline-variant hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold opacity-70">
                      {idx.name}
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                      LIVE
                    </span>
                  </div>
                  <div className="text-3xl font-headline-md text-primary mb-1">{idx.value}</div>
                  <div className="flex justify-between items-end mt-4">
                    <div className={`${getTrendColor(idx.trend)} text-label-sm flex items-center font-data-mono font-bold`}>
                      {idx.trend !== '—' && (
                        <span className="material-symbols-outlined text-sm mr-1">
                          {idx.trend.includes('▲') ? 'trending_up' : 'trending_down'}
                        </span>
                      )}
                      {idx.trend}
                    </div>
                    <div className="text-[9px] text-on-surface-variant opacity-50 text-right">
                      更新於: {idx._updatedAt ? new Date(idx._updatedAt).toLocaleDateString('zh-TW') : 'N/A'}<br/>
                      Source: MacroMicro
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右側：AI 專家簡報 (動態接通) */}
          <div className="md:col-span-4 space-y-gutter">
            <div className="bg-primary text-on-primary p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="material-symbols-outlined text-esg-emerald">psychology</span>
                <h3 className="font-headline-md text-headline-md">AI 專家簡報 <span className="text-body-base block font-normal text-esg-emerald">AI Intelligence Briefing</span></h3>
              </div>
              <div className="space-y-6">
                {insights.map((insight) => (
                  <article key={insight._id} className="border-b border-on-primary-fixed-variant pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] bg-white/10 px-1 py-0.5 rounded uppercase">{insight.source || 'Intel'}</span>
                      <span className="text-[10px] opacity-70 font-data-mono">
                        {insight.publishedAt ? new Date(insight.publishedAt).toLocaleDateString('zh-TW') : ''}
                      </span>
                    </div>
                    <h4 className="font-bold text-body-base leading-tight mb-2">{insight.title}</h4>
                    <p className="text-on-primary-container text-label-sm line-clamp-3 opacity-90">{insight.summary}</p>
                    <a 
                      href={insight.externalUrl || '#'} 
                      target="_blank"
                      className="mt-3 inline-block text-esg-emerald text-label-sm hover:underline font-bold"
                    >
                      閱讀完整分析 READ FULL SOURCE
                    </a>
                  </article>
                ))}
                {insights.length === 0 && <p className="text-label-sm opacity-70">暫無即時情報，請稍後再試。</p>}
              </div>
            </div>
            
            <div className="bg-surface-container-highest border border-outline-variant p-6">
              <h3 className="font-headline-md text-headline-md text-primary mb-4">市場展望 <span className="text-body-base font-normal text-secondary">Market Outlook</span></h3>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold shrink-0">E</div>
                <div>
                  <p className="text-body-base italic">「目前的市場波動主要受原材料能源成本影響，預計下季度供應鏈將趨於穩定。」</p>
                  <p className="text-label-sm mt-2 font-bold">— ESG Team 分析系統<br/><span className="font-normal opacity-70">AI-Powered Market Outlook</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container-highest border-t border-outline-variant w-full py-stack-lg mt-stack-lg">
        <div className="max-w-container-max mx-auto px-margin flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="text-body-base font-bold text-on-surface mb-2 md:mb-0">esg.team Industrial Portal</div>
            <div className="flex space-x-6">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">隱私政策 Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">服務條款 Terms of Service</a>
            </div>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 esg.team . Empowering the Green Transition.
          </div>
        </div>
      </footer>
    </>
  );
}
