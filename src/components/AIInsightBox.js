import React from 'react';

/**
 * @component AIInsightBox
 * @description A premium, AI-themed insight block with neural network background effects.
 */
const AIInsightBox = ({ insight }) => {
  if (!insight || insight.isActive === false) return null;

  const { trendLabel, insightText, confidenceScore, analysisDate } = insight;

  return (
    <section className="py-12 bg-surface overflow-hidden relative border-b border-outline-variant">
      {/* Neural Network Background Simulation */}
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
          {/* Decorative beam */}
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
                  <p className="text-[11px] text-secondary font-mono">
                    Last analysis: {analysisDate ? new Date(analysisDate).toLocaleDateString() : 'Real-time'}
                  </p>
                </div>
              </div>

              <div className="relative mb-8 min-h-[100px]">
                <p className="text-body-lg text-primary leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-1000">
                  {insightText || "當前 AI 正在解析全球碳強度波動與產業採購動向，請稍後..."}
                </p>
                <span className="inline-block w-1 h-5 bg-esg-emerald animate-pulse ml-1 align-middle"></span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-outline uppercase font-bold">市場判定:</span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${
                      trendLabel?.includes('警戒') ? 'bg-error/10 text-error border-error/20' : 
                      trendLabel?.includes('穩定') ? 'bg-secondary/10 text-secondary border-secondary/20' :
                      'bg-esg-emerald/10 text-esg-emerald border-esg-emerald/20 shadow-esg-emerald/10'
                    }`}>
                      {trendLabel || "數據演算中"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-outline uppercase font-bold">信心指數:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-data-mono text-primary font-bold">{confidenceScore || "98.5"}%</span>
                      <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${confidenceScore || 98.5}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

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
              <div className="absolute top-0 right-0 w-full h-full opacity-[0.03]" style={{ 
                backgroundImage: 'linear-gradient(45deg, var(--m3-sys-color-primary) 1px, transparent 1px), linear-gradient(-45deg, var(--m3-sys-color-primary) 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIInsightBox;
