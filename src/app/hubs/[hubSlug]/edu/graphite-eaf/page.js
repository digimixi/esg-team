import React from 'react';

export default async function GraphiteEduPage({ params }) {
  const { hubSlug } = await params;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-esg-emerald/30">
      {/* 導航回專題 */}
      <nav className="fixed top-0 w-full z-50 px-margin h-20 flex items-center justify-between bg-black/50 backdrop-blur-xl border-b border-white/5">
        <a href={`/hubs/${hubSlug}`} className="flex items-center gap-2 group transition-all">
          <span className="material-symbols-outlined text-outline group-hover:text-white transition-colors">arrow_back</span>
          <span className="font-label-sm font-bold uppercase tracking-widest text-outline group-hover:text-white">Back to Graphite Hub</span>
        </a>
        <div className="hidden md:flex items-center gap-8 font-label-sm uppercase tracking-widest text-outline">
          <a href="#intro" className="hover:text-white transition-colors">定義</a>
          <a href="#process" className="hover:text-white transition-colors">運作原理</a>
          <a href="#specs" className="hover:text-white transition-colors">物理特性</a>
          <a href="#consumption" className="hover:text-white transition-colors">消耗分析</a>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/edu/eaf_arc.png" 
              alt="EAF Arc" 
              className="w-full h-full object-cover scale-105 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-4xl px-margin">
            <span className="inline-block bg-esg-emerald/20 text-esg-emerald px-4 py-1 rounded-full font-label-sm mb-6 border border-esg-emerald/30 animate-fade-in-up">
              Industrial Science 產業科普
            </span>
            <h1 className="font-display-lg text-display-lg md:text-7xl mb-6 tracking-tighter leading-none animate-fade-in-up [animation-delay:200ms]">
              電弧爐煉鋼之火：<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">解構石墨電極</span>
            </h1>
            <p className="text-xl text-outline max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:400ms]">
              在超過 3,500°C 的極端環境中，石墨電極不僅是能源的載體，更是現代鋼鐵工業實現綠色轉型的核心組件。
            </p>
            <div className="mt-12 animate-bounce">
              <span className="material-symbols-outlined text-4xl opacity-30">south</span>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section id="intro" className="py-24 px-margin max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-stack-xl items-center">
          <div className="space-y-8">
            <h2 className="text-headline-md font-headline-md border-l-4 border-esg-emerald pl-6">
              什麼是石墨電極？<br/>
              <span className="text-outline text-body-base uppercase">The Conductive Core</span>
            </h2>
            <p className="text-lg leading-relaxed text-on-surface-variant/90">
              石墨電極是以石油焦、瀝青焦為骨料，煤瀝青為黏結劑，經過煅燒、成型、焙燒、浸漬、石墨化和機械加工而製成的一種耐高溫石墨質導電材料。
            </p>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-esg-emerald">check_circle</span>
                核心價值
              </h3>
              <ul className="space-y-4 text-outline text-sm">
                <li className="flex gap-3">
                  <span className="text-white font-bold">01.</span>
                  <span>唯一能在電弧爐內承受巨大電流及高溫衝擊的工業材料。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white font-bold">02.</span>
                  <span>具備極低的電阻率與極高的抗震性能。</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src="/images/edu/graphite_macro.png" alt="Graphite Detail" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-esg-emerald text-black p-6 rounded-2xl font-bold shadow-xl">
              <span className="text-xs uppercase block opacity-60">Sublimation Point</span>
              <span className="text-3xl font-display-md">3,650°C</span>
            </div>
          </div>
        </section>

        {/* Process Section - Bento Grid Style */}
        <section id="process" className="bg-white/[0.02] py-24 border-y border-white/5">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="text-center mb-16">
              <h2 className="text-headline-md font-headline-md mb-4 text-white">電弧爐中的運作機制</h2>
              <p className="text-outline">HOW GRAPHITE ELECTRODES TRANSFORM ENERGY</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-white/5 p-stack-lg rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-esg-emerald/20 text-esg-emerald flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <h4 className="text-xl font-bold mb-4">電路閉合</h4>
                <p className="text-sm text-outline leading-relaxed">
                  石墨電極作為電路的一環，將巨大的電流導入爐內廢鋼。由於石墨的低電阻特性，能量損耗極低。
                </p>
              </div>

              <div className="bg-white/5 p-stack-lg rounded-3xl border border-white/10 hover:bg-white/10 transition-all group md:translate-y-8">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">flare</span>
                </div>
                <h4 className="text-xl font-bold mb-4">電弧觸發</h4>
                <p className="text-sm text-outline leading-relaxed">
                  當電極尖端靠近廢鋼，強大的電壓擊穿空氣，產生劇烈的電弧（Arc），瞬間產生超過 3,500°C 的高溫。
                </p>
              </div>

              <div className="bg-white/5 p-stack-lg rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">waves</span>
                </div>
                <h4 className="text-xl font-bold mb-4">熔池形成</h4>
                <p className="text-sm text-outline leading-relaxed">
                  電弧的輻射熱與對流熱迅速熔化廢鋼，形成液態鋼水，石墨電極則在極限熱環境下保持結構穩定。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Consumption Analysis Section */}
        <section id="consumption" className="py-24 px-margin max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-xl">
             <div className="lg:col-span-4">
                <h2 className="text-headline-md font-headline-md text-white mb-8">消耗：為什麼電極會變短？</h2>
                <div className="space-y-6">
                   <div className="border-b border-white/10 pb-4">
                      <span className="text-esg-emerald font-data-mono">50-60%</span>
                      <h5 className="font-bold mt-1">側面氧化消耗 (Oxidation)</h5>
                      <p className="text-xs text-outline mt-2">在高溫下，電極表面與爐內氧氣反應生成 CO/CO2，造成直徑縮減。</p>
                   </div>
                   <div className="border-b border-white/10 pb-4">
                      <span className="text-orange-400 font-data-mono">10-20%</span>
                      <h5 className="font-bold mt-1">末端昇華與侵蝕 (Sublimation)</h5>
                      <p className="text-xs text-outline mt-2">電弧極高溫導致石墨直接昇華為氣體，以及鋼水飛濺的化學侵蝕。</p>
                   </div>
                   <div className="pb-4">
                      <span className="text-red-400 font-data-mono">殘餘%</span>
                      <h5 className="font-bold mt-1">機械損耗 (Breakage)</h5>
                      <p className="text-xs text-outline mt-2">包括斷棒、開裂以及連接處的熱應力破損。</p>
                   </div>
                </div>
             </div>
             <div className="lg:col-span-8 rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl min-h-[400px]">
                <img src="/images/edu/eaf_factory.png" alt="Factory" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                <div className="absolute inset-0 flex items-center p-12">
                   <div className="max-w-md">
                      <h3 className="text-2xl font-bold mb-4">追求零浪費：<br/>超高功率 (UHP) 的進化</h3>
                      <p className="text-outline leading-relaxed">
                        現代 UHP 石墨電極透過優化針狀焦比例與石墨化溫度，能顯著降低每噸鋼材的電極消耗係數，這不僅是技術的突破，更是碳排放降低的關鍵指標。
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-center border-t border-white/5">
           <div className="max-w-2xl mx-auto px-margin">
              <h3 className="text-headline-md font-headline-md mb-8">為您的工廠尋找頂級石墨資源？</h3>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                 <a href={`/hubs/${hubSlug}/products`} className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-esg-emerald hover:text-white transition-all shadow-xl">
                    查看產品目錄 Browse Catalog
                 </a>
                 <button className="border border-white/20 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/5 transition-all">
                    聯絡技術顧問 Consult Technical
                 </button>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-outline text-xs tracking-widest uppercase">
        © 2024 ESG.TEAM INDUSTRIAL EDUCATION SERIES
      </footer>
    </div>
  );
}
