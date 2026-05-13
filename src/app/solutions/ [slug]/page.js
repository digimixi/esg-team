import { client } from '@/sanity/lib/client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const revalidate = 0;

export default async function SolutionDetail({ params }) {
  const { slug } = params;
  const solution = await client.fetch(`*[_type == "solution" && slug.current == $slug][0] {
    ...,
    "heroImageUrl": heroImage.asset->url,
    "features": features[] {
      ...,
      "imageUrl": image.asset->url
    }
  }`, { slug });

  if (!solution) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">方案編制中</h1>
          <p className="mb-8">此解決方案內容正在進行最終校閱。</p>
          <Link href="/solutions" className="text-primary hover:underline">返回解決方案中心</Link>
        </div>
      </div>
    );
  }

  // 智能匹配邏輯：根據板塊類別提供不同的專業內容
  const categoryDefaults = {
    compliance: {
      methodology: [
        { name: 'ISO 14064-1', icon: 'verified', description: '組織層級溫室氣體排放量化與報告規範。' },
        { name: 'GHG Protocol', icon: 'description', description: '全球最廣泛使用的溫室氣體核算與披露標準。' },
        { name: 'CBAM Compliance', icon: 'gavel', description: '應對歐盟碳邊境調整機制，自動計算嵌入排放。' },
        { name: 'Data Security', icon: 'admin_panel_settings', description: '符合國際資訊安全標準的去中心化數據存儲。' }
      ],
      scopes: [
        { label: 'Direct (S1)', percentage: 35, items: ['設施燃料', '製程排放'] },
        { label: 'Energy (S2)', percentage: 20, items: ['外購電力', '熱力消耗'] },
        { label: 'Value Chain (S3)', percentage: 45, items: ['商務差旅', '廢棄物處理'] }
      ]
    },
    practices: {
      methodology: [
        { name: 'Circular Design', icon: 'rebase', description: '從源頭設計減少廢棄物，建立材料循環鏈條。' },
        { name: 'Energy Audit', icon: 'bolt', description: '系統性診斷工廠能效，發掘節能優化空間。' },
        { name: 'LEED/WELL', icon: 'domain', description: '符合國際綠色建築認證標準的營運管理。' },
        { name: 'Waste Mgmt', icon: 'recycling', description: '工業廢棄物資源化處理與追蹤系統。' }
      ],
      scopes: [
        { label: 'Materials', percentage: 50, items: ['循環利用率', '資源損耗'] },
        { label: 'Energy', percentage: 30, items: ['能效提升', '再生能源'] },
        { label: 'Emissions', percentage: 20, items: ['污染管控', '低碳流程'] }
      ]
    },
    materials: {
      methodology: [
        { name: 'LCA Analysis', icon: 'biotech', description: '從搖籃到墳墓 (Cradle-to-Grave) 的生命週期分析。' },
        { name: 'EPD Certified', icon: 'assignment', description: '符合 ISO 14025 的環境產品宣告生成系統。' },
        { name: 'Carbon Intensity', icon: 'speed', description: '鋼鐵、石墨等材料的單位產品排放強度計算。' },
        { name: 'Supply Chain Trace', icon: 'account_tree', description: '原材料溯源與綠色供應商評級管理。' }
      ],
      scopes: [
        { label: 'Upstream', percentage: 70, items: ['開採排放', '原料運輸'] },
        { label: 'Processing', percentage: 20, items: ['冶煉能源', '添加劑'] },
        { label: 'Downstream', percentage: 10, items: ['物流配送', '回收價值'] }
      ]
    },
    finance: {
      methodology: [
        { name: 'ESG Rating', icon: 'trending_up', description: '提升 MSCI、Sustainalytics 等國際評級機構表現。' },
        { name: 'Green Finance', icon: 'payments', description: '協助企業對接綠色信貸、永續發展連結債券。' },
        { name: 'Training', icon: 'school', description: '企業內訓與永續長 (CSO) 決策支持系統。' },
        { name: 'TCFD Reporting', icon: 'leaderboard', description: '符合氣候相關財務披露工作小組框架的分析報告。' }
      ],
      scopes: [
        { label: 'Governance', percentage: 40, items: ['政策透明度', '風險管控'] },
        { label: 'Social', percentage: 30, items: ['員工權益', '社區影響'] },
        { label: 'Environment', percentage: 30, items: ['碳減量目標', '氣候韌性'] }
      ]
    }
  };

  const currentDefaults = categoryDefaults[solution.category] || categoryDefaults.compliance;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#F8F9FA]">
        {/* Google Stitch Hero Section */}
        <section className="relative h-[600px] flex items-center overflow-hidden bg-[#1A1C1E]">
          {solution.heroImageUrl && (
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
              src={solution.heroImageUrl} 
              alt={solution.title}
            />
          )}
          <div className="relative px-margin max-w-container-max mx-auto w-full">
            <div className="max-w-2xl text-white">
              <span className="text-primary font-bold text-[12px] tracking-[0.4em] mb-6 block uppercase">Solutions: {solution.category}</span>
              <h1 className="font-display-lg text-5xl md:text-6xl mb-6 leading-tight font-bold">
                {solution.title} <br />
                <span className="text-3xl opacity-60 font-normal">{solution.titleEnglish}</span>
              </h1>
              <p className="text-lg text-white/70 mb-12 leading-relaxed">
                {solution.description || '提供企業級的永續轉型路徑，橋接原始生產數據與國際合規標準。'}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-on-primary px-10 py-4 rounded-lg font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all">
                  預約方案演示 <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className="bg-white/10 text-white px-10 py-4 rounded-lg font-bold text-sm hover:bg-white/20 transition-all border border-white/20">
                  下載合規指南
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-24 bg-white border-b border-[#E0E0E0]">
          <div className="px-margin max-w-container-max mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[#1A1C1E] mb-2 uppercase tracking-tight">Methodology & Professional Standards</h2>
              <div className="w-20 h-1.5 bg-primary mb-6"></div>
              <p className="text-[#44474E] text-lg max-w-2xl">
                嚴格遵循 {solution.title} 領域的國際認證框架，確保數據的查驗深度與全球通用性。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(solution.methodology || currentDefaults.methodology).map((item, i) => (
                <div key={i} className="p-8 bg-white border border-[#E0E0E0] rounded-lg hover:shadow-xl transition-all duration-300 group">
                  <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform block">{item.icon}</span>
                  <h3 className="font-bold text-lg text-[#1A1C1E] mb-2 uppercase tracking-tight">{item.name}</h3>
                  <p className="text-[#44474E] text-[14px] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analysis Scopes Section */}
        <section className="py-24 bg-[#F8F9FA]">
          <div className="px-margin max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1A1C1E] mb-2">Multi-Dimensional Analysis</h2>
                <p className="text-[#44474E]">針對核心量化維度的權重分析與監控範圍。</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(solution.scopes || currentDefaults.scopes).map((scope, i) => {
                const isHighlight = i === 0;
                return (
                  <div key={i} className={`bg-white border border-[#E0E0E0] rounded-lg p-8 hover:shadow-xl transition-all group`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-bold text-2xl text-[#1A1C1E] mb-1">{scope.label}</h3>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-outline">Dimension Weight</p>
                      </div>
                      <span className="bg-[#F1F3F4] text-[#44474E] px-2 py-1 rounded text-label-sm font-data-mono font-bold">
                        {scope.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F1F3F4] rounded-full mb-8 overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${scope.percentage}%` }}></div>
                    </div>
                    <div className="space-y-4">
                      {(scope.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span className="text-[14px] font-medium text-[#44474E]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="py-32 bg-white">
          <div className="px-margin max-w-container-max mx-auto text-center mb-24">
            <h2 className="text-4xl font-bold text-[#1A1C1E] mb-4">核心方案模組</h2>
            <p className="text-[#5F6368] font-bold uppercase tracking-[0.2em] text-sm">Industrial Feature Modules</p>
          </div>
          
          <div className="px-margin max-w-container-max mx-auto space-y-32">
            {(solution.features || [
              { title: '全自動化數據採集', description: '透過 API 與物聯網設備，直接從生產線、ERP 與能源管理系統中自動提取數據，消除人工錄入的誤差與延遲。' },
              { title: '專業合規報告產出', description: '一鍵生成符合國際審計機構要求的 PDF 報告，支持多國語言與特定貿易框架（如 CBAM）的數據透視。' }
            ]).map((feature, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-24`}>
                <div className="lg:w-1/2">
                  <span className="text-primary font-bold text-[12px] uppercase tracking-widest mb-6 block">Module 0{i+1}</span>
                  <h3 className="font-bold text-4xl text-[#1A1C1E] mb-8 leading-tight">{feature.title}</h3>
                  <p className="text-[#44474E] text-xl leading-relaxed mb-10">
                    {feature.description}
                  </p>
                  <ul className="space-y-6">
                    {['即時數據監控 (Real-time Monitoring)', 'AI 異常值校驗系統', '完整證據鏈審計存證'].map(li => (
                      <li key={li} className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'wght' 700" }}>done</span>
                        </div>
                        <span className="text-[15px] font-bold text-[#1A1C1E]">{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2 bg-[#F1F3F4] rounded-[40px] p-2 border border-[#E0E0E0] shadow-sm aspect-[4/3] relative overflow-hidden group">
                  {feature.imageUrl ? (
                    <img src={feature.imageUrl} alt={feature.title} className="w-full h-full object-cover rounded-[32px] group-hover:scale-105 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                      <span className="material-symbols-outlined text-8xl text-primary/10">data_object</span>
                      <span className="text-xs font-bold text-outline uppercase tracking-[0.3em]">Industrial Data Layer</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-[#1A1C1E] text-white">
          <div className="max-w-4xl mx-auto px-margin text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{solution.ctaTitle || '加速您的永續轉型路徑'}</h2>
            <p className="text-white/60 text-xl mb-12">
              與 esg.team 的專家團隊合作，為您的企業量身打造具備競爭力的綠色轉型藍圖。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="bg-primary text-on-primary px-12 py-5 rounded-lg font-bold text-sm hover:bg-[#F1F3F4] hover:text-[#1A1C1E] transition-all flex items-center justify-center gap-2">
                預約演示 <span className="material-symbols-outlined">rocket_launch</span>
              </button>
              <button className="bg-transparent text-white px-12 py-5 rounded-lg font-bold text-sm border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                下載服務白皮書 <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
