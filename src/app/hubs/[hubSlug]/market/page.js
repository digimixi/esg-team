import { client } from '@/sanity/lib/client';

export const revalidate = 0;

export default async function Market({ params }) {
  const { hubSlug } = await params;

  // Get the hub document for dynamic title/nav
  const hub = await client.fetch('*[_type == "hub" && slug.current == $slug][0]', { slug: hubSlug });

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
            <div className="hidden xl:flex items-center bg-surface-container-low px-stack-md py-stack-sm rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant mr-stack-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-label-sm w-48 outline-none" placeholder="Search partners..." type="text"/>
            </div>
            <div className="flex items-center gap-2 md:gap-stack-sm">
              <button className="hidden md:block px-2 md:px-gutter py-2 md:py-stack-sm text-secondary font-label-sm whitespace-nowrap hover:underline transition-all cursor-pointer">登錄 Sign In</button>
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
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}`}>首頁 Home</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/products`}>產品 Products</a>
            <a className="text-primary font-bold border-b-2 border-primary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/market`}>市場 Market</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/supply-chain`}>供應鏈 Supply Chain</a>
          </nav>
        </div>
      </header>

      {/* Price Ticker (can be populated via Sanity later) */}
      <div className="mt-[104px] lg:mt-16 bg-surface-container-highest border-b border-outline-variant overflow-hidden">
        <div className="ticker-animate whitespace-nowrap py-2 flex">
          <div className="flex space-x-12 px-4 shrink-0">
            <span className="flex items-center space-x-2"><span className="font-bold">石墨電極 Graphite Electrode (UHP):</span> <span className="text-[#059669]">$3,420</span> <span className="text-[#dc2626] text-label-sm">▼ 1.2%</span></span>
            <span className="flex items-center space-x-2"><span className="font-bold">增碳劑 Recarburizer (98.5% C):</span> <span className="text-[#059669]">$1,150</span> <span className="text-[#059669] text-label-sm">▲ 0.8%</span></span>
            <span className="flex items-center space-x-2"><span className="font-bold">熱壓鐵塊/直接還原鐵 HBI / DRI:</span> <span className="text-[#059669]">$412</span> <span className="text-[#059669] text-label-sm">▲ 2.4%</span></span>
            <span className="flex items-center space-x-2"><span className="font-bold">鐵礦砂 Iron Ore Fine 62%:</span> <span className="text-[#059669]">$108.5</span> <span className="text-[#dc2626] text-label-sm">▼ 0.3%</span></span>
            <span className="flex items-center space-x-2"><span className="font-bold">廢鋼 Scrap HMS 1/2:</span> <span className="text-[#059669]">$385</span> <span className="font-bold">—</span></span>
          </div>
          <div className="flex space-x-12 px-4 shrink-0">
            <span className="flex items-center space-x-2"><span className="font-bold">石墨電極 Graphite Electrode (UHP):</span> <span className="text-[#059669]">$3,420</span> <span className="text-[#dc2626] text-label-sm">▼ 1.2%</span></span>
            <span className="flex items-center space-x-2"><span className="font-bold">增碳劑 Recarburizer (98.5% C):</span> <span className="text-[#059669]">$1,150</span> <span className="text-[#059669] text-label-sm">▲ 0.8%</span></span>
            <span className="flex items-center space-x-2"><span className="font-bold">熱壓鐵塊/直接還原鐵 HBI / DRI:</span> <span className="text-[#059669]">$412</span> <span className="text-[#059669] text-label-sm">▲ 2.4%</span></span>
            <span className="flex items-center space-x-2"><span className="font-bold">鐵礦砂 Iron Ore Fine 62%:</span> <span className="text-[#059669]">$108.5</span> <span className="text-[#dc2626] text-label-sm">▼ 0.3%</span></span>
            <span className="flex items-center space-x-2"><span className="font-bold">廢鋼 Scrap HMS 1/2:</span> <span className="text-[#059669]">$385</span> <span className="font-bold">—</span></span>
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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Main Interactive Chart Section */}
          <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant p-6 flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">價格走勢分析 <span className="text-body-base font-normal text-secondary ml-2">Price Trend Analysis</span></h2>
                <p className="text-label-sm text-secondary">石墨電極與增碳劑的歷史定價 | Historical pricing</p>
              </div>
              <div className="flex bg-surface-container border border-outline-variant rounded p-1">
                <button className="px-4 py-1 text-label-sm bg-primary text-on-primary rounded">3個月 (3 Months)</button>
                <button className="px-4 py-1 text-label-sm text-secondary hover:bg-surface-container-high rounded">1年 (1 Year)</button>
              </div>
            </div>
            
            <div className="relative h-[400px] w-full bg-surface-container-low border border-outline-variant flex items-end p-4">
              {/* Placeholder Chart Visualization */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-outline-variant/30 w-full h-0"></div>
                <div className="border-b border-outline-variant/30 w-full h-0"></div>
                <div className="border-b border-outline-variant/30 w-full h-0"></div>
                <div className="border-b border-outline-variant/30 w-full h-0"></div>
                <div className="border-b border-outline-variant w-full h-0"></div>
              </div>
              <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 800 300">
                {/* Trend Line 1 */}
                <path d="M0 250 Q 100 220, 200 240 T 400 180 T 600 120 T 800 150" fill="none" stroke="#131b2e" strokeWidth="3"></path>
                {/* Trend Line 2 */}
                <path d="M0 180 Q 100 190, 200 160 T 400 140 T 600 100 T 800 80" fill="none" stroke="#188ace" strokeDasharray="8 4" strokeWidth="3"></path>
              </svg>
              {/* Chart Legend */}
              <div className="absolute top-4 right-4 flex space-x-6 bg-surface-container-lowest/80 backdrop-blur-sm p-3 border border-outline-variant">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-1 bg-primary"></span>
                  <span className="text-label-sm">石墨電極 (Graphite Electrodes)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-1 bg-on-tertiary-container border-t-2 border-dashed border-on-tertiary-container"></span>
                  <span className="text-label-sm">增碳劑 (Recarburizers)</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-gutter mt-4">
              <div className="p-4 bg-surface-container">
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">平均現貨價格 Avg. Spot Price</span>
                <div className="text-headline-md font-headline-md text-primary">$3,240/t</div>
                <div className="text-[#dc2626] text-label-sm flex items-center">
                  <span className="material-symbols-outlined text-sm mr-1">trending_down</span>
                  較上月 -2.4% vs prev. month
                </div>
              </div>
              <div className="p-4 bg-surface-container">
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">庫存水平 Inventory Levels</span>
                <div className="text-headline-md font-headline-md text-primary">穩定 (Stable)</div>
                <div className="text-secondary text-label-sm">平均45天供應量 | 45 days supply avg</div>
              </div>
              <div className="p-4 bg-surface-container">
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">波動指數 Volatility Index</span>
                <div className="text-headline-md font-headline-md text-primary">中等 (Medium)</div>
                <div className="text-on-tertiary-container text-label-sm">較第三季有所降低 | Reduced vs Q3</div>
              </div>
            </div>
          </div>

          {/* Expert Analysis Sidebar */}
          <div className="md:col-span-4 space-y-gutter">
            <div className="bg-primary text-on-primary p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="material-symbols-outlined">analytics</span>
                <h3 className="font-headline-md text-headline-md">專家簡報 <span className="text-body-base block font-normal">Expert Briefing</span></h3>
              </div>
              <div className="space-y-4">
                <article className="border-b border-on-primary-fixed-variant pb-4">
                  <h4 className="font-bold text-body-base leading-tight mb-2">歐盟碳邊境調整機制 (CBAM) 的影響<br/><span className="text-label-sm font-normal opacity-80">Impact of EU Carbon Border Adjustment Mechanism</span></h4>
                  <p className="text-on-primary-container text-label-sm">第一季度生效的新申報要求正推動電極採購中的早期避險行為...</p>
                  <button className="mt-2 text-[#93ccff] text-label-sm hover:underline font-bold">閱讀分析 READ ANALYSIS</button>
                </article>
                <article className="pb-2">
                  <h4 className="font-bold text-body-base leading-tight mb-2">紅海航道運輸的脆弱性<br/><span className="text-label-sm font-normal opacity-80">Shipping Fragility in the Red Sea Corridors</span></h4>
                  <p className="text-on-primary-container text-label-sm">預計亞洲石墨出口至北美樞紐的物流溢價將上漲15-20%...</p>
                  <button className="mt-2 text-[#93ccff] text-label-sm hover:underline font-bold">閱讀分析 READ ANALYSIS</button>
                </article>
              </div>
            </div>
            
            <div className="bg-surface-container-highest border border-outline-variant p-6">
              <h3 className="font-headline-md text-headline-md text-primary mb-4">市場展望 <span className="text-body-base font-normal text-secondary">Market Outlook</span></h3>
              <div className="flex items-start space-x-4">
                <img className="w-12 h-12 rounded-full object-cover" alt="Analyst" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuiySAZQ4FkyXEsa6kJaPkesM64J1m1On5nJijbZuTK3oqmo7VHut2o09PK5YvNgB4uFv5wqn9kNJxGj8hPF67P_nEs9Tl0mN1XKNd5vNG1PPiHOTrS-UIDgLRMrRQ3L02gJtDiMXAo05M_zPtouDYPE4QiVrTYkmdxl2KNFlXhFc2gQiHidfvhpi-D575lWoxe9WTfbX6SsUW4R9wkAnsD1v8c5-ptX5iyxKFQgsVVX1FSdVe5dpE8nNq_HtUB1xJCFlYHroFABPQ"/>
                <div>
                  <p className="text-body-base italic">「現貨價格與原材料成本的脫鉤表明，庫存盈餘可能會持續到本財政年底。」</p>
                  <p className="text-label-sm mt-2 font-bold">— 首席碳素分析師 馬庫斯·索恩<br/><span className="font-normal opacity-70">Marcus Thorne, Lead Carbon Analyst</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Reports Section */}
          <div className="md:col-span-12">
            <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h2 className="text-headline-md font-headline-md text-primary">戰略市場報告 <span className="text-body-base font-normal text-secondary ml-2">Strategic Market Reports</span></h2>
                <button className="text-label-sm text-secondary hover:text-primary flex items-center">
                    查看所有存檔 View All Archive <span className="material-symbols-outlined ml-1">chevron_right</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-outline-variant">
                <div className="p-6 hover:bg-surface-container transition-colors group">
                  <span className="inline-block px-2 py-1 bg-secondary-container text-on-secondary-container text-label-sm mb-4">季度報告 QUARTERLY</span>
                  <h4 className="font-bold text-body-base mb-2 group-hover:text-primary transition-colors">2024年Q4全球石墨電極展望</h4>
                  <p className="text-on-surface-variant text-label-sm mb-6">詳細分析全球主要生產中心超高功率(UHP)和高功率(HP)等級的供需平衡。</p>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm text-outline">PDF | 4.2 MB</span>
                    <button className="material-symbols-outlined text-primary cursor-pointer">download</button>
                  </div>
                </div>
                
                <div className="p-6 hover:bg-surface-container transition-colors group">
                  <span className="inline-block px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-label-sm mb-4">每週簡報 WEEKLY BRIEF</span>
                  <h4 className="font-bold text-body-base mb-2 group-hover:text-primary transition-colors">鋼廠產能利用率與合金需求</h4>
                  <p className="text-on-surface-variant text-label-sm mb-6">每週追蹤歐洲和美國電弧爐(EAF)的運行率。</p>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm text-outline">PDF | 1.8 MB</span>
                    <button className="material-symbols-outlined text-primary cursor-pointer">download</button>
                  </div>
                </div>

                <div className="p-6 hover:bg-surface-container transition-colors group">
                  <span className="inline-block px-2 py-1 bg-secondary-container text-on-secondary-container text-label-sm mb-4">年度報告 ANNUAL</span>
                  <h4 className="font-bold text-body-base mb-2 group-hover:text-primary transition-colors">2025年碳材料採購戰略</h4>
                  <p className="text-on-surface-variant text-label-sm mb-6">針對2025年的長期價格預測與供應商風險評估框架。</p>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm text-outline">PDF | 12.5 MB</span>
                    <button className="material-symbols-outlined text-primary cursor-pointer">download</button>
                  </div>
                </div>

                <div className="p-6 hover:bg-surface-container transition-colors group">
                  <span className="inline-block px-2 py-1 bg-error-container text-on-error-container text-label-sm mb-4">關鍵報告 CRITICAL</span>
                  <h4 className="font-bold text-body-base mb-2 group-hover:text-primary transition-colors">貿易政策與關稅影響研究</h4>
                  <p className="text-on-surface-variant text-label-sm mb-6">對半成品碳素產品徵收新反傾銷稅的影響分析。</p>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm text-outline">PDF | 3.1 MB</span>
                    <button className="material-symbols-outlined text-primary cursor-pointer">download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Material Focus Grid */}
        <section className="mt-stack-lg">
          <h2 className="text-headline-md font-headline-md text-primary mb-6">關鍵材料表現 <span className="text-body-base font-normal text-secondary ml-2">Key Material Performance</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="flex bg-surface-container-low border border-outline-variant overflow-hidden">
              <div className="w-1/3">
                <img className="h-full w-full object-cover" alt="Graphite" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmWAXFbiJIqGQoylmVYXmXQA_TnukM2pfnlS8Y4wr4ZuHYQ6JIb7e04CUfMv01QjaeYZwAHVHG1EDLgTMu898iKa7NufXDln1evm0ICku5Y_wrCD23llTiFNWpqim8u3AiQH2Lgm1Q2afwlsvkdf6-vwJFEFGc8b5mlKKXMtAkr38uHsMTVdtgXbEpwBUww32amrei-0WXMAq8SclUlko4yRTt1AZBNToLpkLaRkU-Py8Lrr89cjE_sXQeSDx5JgBt28OuIRrJTyCm"/>
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-headline-md mb-2">石墨電極 (UHP) <br/><span className="text-body-base font-normal opacity-70">Graphite Electrodes</span></h3>
                  <p className="text-label-sm text-on-surface-variant mb-4">電弧爐煉鋼的關鍵組件。採用高檔針狀焦原料。</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-label-sm uppercase text-outline font-bold">目前狀態 Current Status</span>
                    <div className="text-[#059669] font-bold">供應穩定 (Stable Supply)</div>
                  </div>
                  <button className="bg-primary text-on-primary px-4 py-2 text-label-sm active:scale-95">查看規格 View Specification</button>
                </div>
              </div>
            </div>
            
            <div className="flex bg-surface-container-low border border-outline-variant overflow-hidden">
              <div className="w-1/3">
                <img className="h-full w-full object-cover" alt="Recarburizers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVgCBWoWIgVf-25Npws-H7mWx1qcY8tyCaVXDqwNi-_BOa3ZVzj4UIdG6n0CFyyVL3kxcQwbjSlzrT_tqfYoCXERhxnNhCDdpr8ZNYwqeWNq3u5oYa1LmIKk3gsgRnOZl9J9PkKBKQPztjPcdURSj2YMAsW-th4xzvKbXI8tVCKLuHlPw3gFckdylrYnJZpwOqyWDVtmBMEJkOXEGY8CF8MkbJj2usCrQRFT-5oHz6i9vMFBNl_MSraTBe8ckyEvOmVv4BBjhBjsD7"/>
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-headline-md mb-2">增碳劑 (CPC/GPC) <br/><span className="text-body-base font-normal opacity-70">Recarburizers</span></h3>
                  <p className="text-label-sm text-on-surface-variant mb-4">用於調整熔融鐵碳含量的含高碳添加劑，具低硫低氮特性。</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-label-sm uppercase text-outline font-bold">目前狀態 Current Status</span>
                    <div className="text-[#dc2626] font-bold">價格波動 (Price Volatility)</div>
                  </div>
                  <button className="bg-primary text-on-primary px-4 py-2 text-label-sm active:scale-95">查看規格 View Specification</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant w-full py-stack-lg">
        <div className="max-w-container-max mx-auto px-margin flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="text-body-base font-bold text-on-surface mb-2 md:mb-0">SteelStream Industrial Logistics</div>
            <div className="flex space-x-6">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">隱私政策 Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">服務條款 Terms of Service</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">合規性 Compliance</a>
            </div>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 SteelStream Industrial Logistics. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
