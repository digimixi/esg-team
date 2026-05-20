"use client";

import React, { useState, useEffect, useRef } from 'react';

/**
 * @component CbamCalculator
 * @description A premium, high-density CBAM (Carbon Border Adjustment Mechanism) Tariff Simulator
 * built with Google Stitch high-contrast visual standards.
 */
const CbamCalculator = ({ initialEtsPrice = 85 }) => {
  // Input States
  const [tonnage, setTonnage] = useState(1000);
  const [intensity, setIntensity] = useState(2.1); // tCO2e/t Steel (traditional is ~2.1)
  const [etsPrice, setEtsPrice] = useState(initialEtsPrice);
  const [domesticCarbonTax, setDomesticCarbonTax] = useState(10); // EUR/t paid at origin (e.g. Taiwan/China)
  const [phaseInYear, setPhaseInYear] = useState(2028);
  const [showInstructions, setShowInstructions] = useState(false);

  // CBAM Official Phase-in Rates (2026-2034)
  const phaseInRates = {
    2026: 0.026,
    2028: 0.15,
    2030: 0.485,
    2032: 0.80,
    2034: 1.00
  };

  const exposureRate = phaseInRates[phaseInYear] || 0.15;

  // Green EAF alternative carbon intensity
  const GREEN_INTENSITY = 0.6; // tCO2e/t Steel

  // Calculations
  const netCprice = Math.max(etsPrice - domesticCarbonTax, 0);
  
  // 1. Traditional BF Steel
  const tradEmissions = tonnage * intensity;
  const tradTaxableEmissions = tradEmissions * exposureRate;
  const tradCbamCost = tradTaxableEmissions * netCprice;

  // 2. Green EAF Steel
  const greenEmissions = tonnage * GREEN_INTENSITY;
  const greenTaxableEmissions = greenEmissions * exposureRate;
  const greenCbamCost = greenTaxableEmissions * netCprice;

  const cbamSavings = Math.max(tradCbamCost - greenCbamCost, 0);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 relative group">
      {/* Dynamic glow effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-esg-emerald/5 rounded-full blur-3xl group-hover:bg-esg-emerald/10 transition-all duration-700"></div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
        
        {/* Left: Input controls */}
        <div className="flex-1 space-y-6">
          <div className="border-b border-outline-variant/60 pb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-esg-emerald/10 border border-esg-emerald/20 text-esg-emerald rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-esg-emerald animate-pulse"></span>
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase">CBAM Compliance Tool</span>
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-primary">歐盟 CBAM 碳邊境稅動態模擬器</h3>
              <button 
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  showInstructions 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'bg-surface-container-high/40 border-outline-variant/60 text-secondary hover:border-primary hover:text-primary hover:scale-105 active:scale-95'
                }`}
                title="顯示操作指南與用途說明"
              >
                <span className="material-symbols-outlined text-[15px] font-bold">help</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              根據歐盟碳邊境調整機制 (Art. 21 / 22) 規範，動態評估鋼鐵及高溫工業材料進口歐盟時的碳關稅曝險。
            </p>
          </div>

          {showInstructions && (
            <div className="bg-surface-container-high/60 border border-outline-variant rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-esg-emerald">school</span>
                  模擬器用途與操作指南 (User Guide)
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowInstructions(false)}
                  className="text-[10px] text-outline hover:text-primary font-bold font-mono tracking-tighter"
                >
                  [ 關閉 CLOSE ]
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[11px] leading-relaxed text-on-surface-variant">
                <div className="space-y-2">
                  <h4 className="font-bold text-primary">🎯 模擬器用途 (Why use this?)</h4>
                  <p>
                    歐盟碳邊境調整機制 (CBAM) 是防止「碳洩漏」的指標性關稅。自 2026 年起，進口鋼鐵、鋁、水泥等物資入歐，必須申報並購買 CBAM 憑證，碳稅額直接連動歐盟 ETS 碳價。本工具協助您在採購階段即可精確預算碳關稅曝險，引導綠色採購決策。
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-primary">⚙️ 操作指南 (How to operate?)</h4>
                  <ul className="list-decimal list-inside space-y-1">
                    <li><strong className="text-primary">進口數量</strong>：滑動調節您進口歐盟的物資總噸數。</li>
                    <li><strong className="text-primary">產品碳強度</strong>：輸入製程每噸產品碳排（高爐鋼約 2.1，綠色電爐鋼約 0.6）。</li>
                    <li><strong className="text-primary">ETS 碳價</strong>：歐盟實時或預期碳交易價格。</li>
                    <li><strong className="text-primary">原產國已付碳稅 (Art. 9)</strong>：輸入出口國已繳之碳費（如台灣碳費），申報可直接扣減碳稅額。</li>
                    <li><strong className="text-primary">過渡期階段</strong>：越靠近 2034 年，免費配額越低，關稅課徵比率越高。</li>
                  </ul>
                </div>
              </div>

              {/* Business Scenario Callout */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-[16px] text-primary">domain</span>
                  <span>💡 商業實戰情境：以「特斯拉 (Tesla)」或「風力發電機製造商」為例</span>
                </div>
                <div className="space-y-3 text-[11px] leading-relaxed text-on-surface-variant font-sans">
                  <p>
                    假設您是一家<strong>綠色風力發電機製造商（買方企業）</strong>，您的風機要出口到歐洲，歐盟要求您必須申報<strong>「整台風機的完整碳足跡」</strong>（否則會被課徵鉅額的 CBAM 碳關稅）。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant">
                      <span className="font-bold text-error block mb-1">🚨 您的核心痛點：Scope 3 供應鏈排放</span>
                      您工廠自己進行的風機組裝其實只佔了整機碳排的 <strong>10%</strong>，剩下高達 <strong>90%</strong> 的碳排放，其實都隱藏在向外部供應商採購的<strong>「鋼鐵支架」、「發電機石墨電極」和「海運物流服務」</strong>中。這在 ESG 標準中被稱為 Scope 3（範疇三）供應鏈排放。
                    </div>
                    <div className="bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant">
                      <span className="font-bold text-amber-500 block mb-1">⚠️ 傳統做法的致命漏洞與綠洗風險</span>
                      採購打電話或發 Excel 表單給 50 家供應商問：「你們鋼鐵排多少碳？」供應商通常隨便寫個數字甚至<strong>「綠洗 (Greenwashing) 偽造」</strong>。若拿著虛假數據申報，一旦被歐盟查獲，將面臨<strong>天價罰款並被取消出口資格</strong>。
                    </div>
                  </div>
                  <div className="bg-esg-emerald/10 border border-esg-emerald/20 text-esg-emerald p-3 rounded-lg flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">verified</span>
                    <div>
                      <span className="font-bold block text-primary">🛡️ 本模擬器與信任帳本的綜效價值</span>
                      使用本模擬器可以讓您在採購談判前，模擬不同供應商低碳轉型後（如廢鋼比率提升）能為您節省的<strong>數百萬歐元 CBAM 關稅</strong>。並可與<strong>「供應鏈碳排信任帳本」</strong>連動，將經過 SGS 認證的真實數據上線，取得符合歐盟邊境申報的最強合規背書！
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Imported Tonnage */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-tight">進口材料數量 (Tonnage)</label>
                <span className="font-mono text-xs font-bold text-primary">{tonnage.toLocaleString()} t</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="50000" 
                step="100"
                value={tonnage}
                onChange={(e) => setTonnage(Number(e.target.value))}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-esg-emerald"
              />
            </div>

            {/* 2. Product Carbon Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-tight">產品碳強度 (Carbon Intensity)</label>
                <span className="font-mono text-xs font-bold text-primary">{intensity.toFixed(2)} <span className="text-[9px] text-outline font-normal">tCO₂e/t</span></span>
              </div>
              <input 
                type="range" 
                min="0.4" 
                max="3.0" 
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-esg-emerald"
              />
            </div>

            {/* 3. EU ETS Carbon Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-tight">歐盟 ETS 碳交易價格</label>
                <span className="font-mono text-xs font-bold text-primary">{etsPrice} EUR/t</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="150" 
                step="1"
                value={etsPrice}
                onChange={(e) => setEtsPrice(Number(e.target.value))}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-esg-emerald"
              />
            </div>

            {/* 4. Origin Carbon Tax Paid */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-tight">原產國已付碳稅 (Art. 9 抵免)</label>
                <span className="font-mono text-xs font-bold text-primary">{domesticCarbonTax} EUR/t</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="80" 
                step="1"
                value={domesticCarbonTax}
                onChange={(e) => setDomesticCarbonTax(Number(e.target.value))}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-esg-emerald"
              />
            </div>
          </div>

          {/* Year Phase-in Selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-tight block">歐盟過渡期階段 (CBAM Year / Exposure Ratio)</span>
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(phaseInRates).map((year) => {
                const yr = Number(year);
                const isSelected = phaseInYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setPhaseInYear(yr)}
                    className={`py-2 px-1 rounded-lg border text-center transition-all duration-300 ${
                      isSelected 
                        ? 'border-esg-emerald bg-esg-emerald/10 text-primary font-bold' 
                        : 'border-outline-variant/60 bg-surface-container-high/30 text-secondary hover:border-secondary'
                    }`}
                  >
                    <div className="text-xs font-mono">{yr}</div>
                    <div className="text-[8px] text-outline font-bold">{(phaseInRates[yr] * 100).toFixed(1)}%</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Output/Results Card */}
        <div className="w-full lg:w-80 shrink-0 bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest border-b border-outline-variant/60 pb-2">
              碳關稅估算結果 (Taxes Summary)
            </h4>

            {/* 1. Traditional Cost BF */}
            <div className="space-y-1">
              <span className="text-[10px] text-secondary">高爐鋼鐵預估關稅 (Blast Furnace BF-BOF)</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-outline font-mono">{(tradTaxableEmissions).toFixed(1)} tCO₂e taxable</span>
                <span className="font-data-mono font-bold text-error text-lg">
                  €{tradCbamCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* 2. Green Steel EAF Cost */}
            <div className="space-y-1">
              <span className="text-[10px] text-secondary">低碳綠色鋼鐵預估關稅 (Green Steel EAF)</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-outline font-mono">{(greenTaxableEmissions).toFixed(1)} tCO₂e taxable</span>
                <span className="font-data-mono font-bold text-primary text-lg">
                  €{greenCbamCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Savings Display */}
            <div className="bg-esg-emerald/10 border border-esg-emerald/20 p-4 rounded-lg flex flex-col items-center text-center">
              <span className="text-[9px] font-bold text-esg-emerald uppercase tracking-wider mb-1">
                採用 EAF 綠色方案減省碳關稅
              </span>
              <span className="font-data-mono font-bold text-esg-emerald text-2xl animate-pulse">
                €{cbamSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[8px] text-secondary font-mono mt-1">
                減少 {(intensity - GREEN_INTENSITY).toFixed(1)} tCO₂e/t | 關稅降低 {((1 - GREEN_INTENSITY / intensity) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/60">
            <div className="flex items-center gap-1.5 text-[9px] text-secondary leading-normal">
              <span className="material-symbols-outlined text-xs text-esg-emerald shrink-0">info</span>
              <span>
                依據 CBAM Art. 9，可全額扣抵已於原產國繳納之碳費。
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* TradingView Chart Widget Section */}
      <div className="mt-8 pt-6 border-t border-outline-variant/60 relative z-10">
        <TradingViewWidget />
      </div>
    </div>
  );
};

/**
 * @component TradingViewWidget
 * @description Renders a premium embedded TradingView Interactive Chart for ICE EUA Futures.
 */
const TradingViewWidget = () => {
  const containerRef = useRef(null);
  const [showPriceApiHelp, setShowPriceApiHelp] = useState(false);

  useEffect(() => {
    let script = document.getElementById('tradingview-widget-script');
    
    const initWidget = () => {
      if (typeof window !== 'undefined' && window.TradingView && containerRef.current) {
        try {
          new window.TradingView.widget({
            autosize: true,
            symbol: 'ICE:ICEEUA', // tracks European Carbon Allowance Futures (EUA)
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'zh_TW',
            toolbar_bg: '#1e293b',
            enable_publishing: false,
            hide_side_toolbar: true,
            allow_symbol_change: false,
            container_id: containerRef.current.id,
          });
        } catch (e) {
          console.error('[TradingView Widget] Initialization failed:', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      if (window.TradingView) {
        initWidget();
      } else {
        script.addEventListener('load', initWidget);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initWidget);
      }
    };
  }, []);

  return (
    <div className="bg-[#121824] border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-md">
      <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-esg-emerald animate-pulse"></span>
          <span className="text-xs font-bold text-slate-100">
            歐盟碳配額 (EUA) 實時行情走勢 - ICE EUA 期貨 (TradingView)
          </span>
          <button 
            type="button"
            onClick={() => setShowPriceApiHelp(!showPriceApiHelp)}
            className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] transition-all duration-300 ${
              showPriceApiHelp 
                ? 'bg-esg-emerald text-white border-esg-emerald' 
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-esg-emerald hover:text-slate-200 hover:scale-105 active:scale-95 cursor-pointer'
            }`}
            title="顯示實時碳價 API 對接說明"
          >
            <span className="material-symbols-outlined text-[10px] font-bold">help</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Symbol: ICEEUA</span>
      </div>

      {showPriceApiHelp && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 space-y-2 text-[11px] leading-relaxed text-slate-300 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-esg-emerald">api</span>
            實時碳價 API 對接機制與目的說明
          </span>
          <div className="text-[10px] text-slate-400 space-y-1 font-sans">
            <p>
              <strong>1. 數據來源與精度：</strong> 本行情系統底層透過自動腳本定時串接 Yahoo Finance API，鎖定倫敦交易所之 <code>CO2.L</code> (SparkChange Physical Carbon EUA ETC) 作為物理歐盟碳配額追蹤標的，保證資料與真實歐洲碳市場高度同步。
            </p>
            <p>
              <strong>2. 行情與圖表對齊：</strong> 本行情面板嵌入了 TradingView 高頻即時行情圖表（Symbol: <code>ICE:ICEEUA</code>），供進口商與決策層進行技術面走勢與波動度分析。
            </p>
            <p>
              <strong>3. 動態合規計算：</strong> 系統會自動將動態抓取的實時碳價，作為上方「CBAM 碳稅模擬器」的初始計算基準，無縫打通行情走勢與合規關稅風險評估。
            </p>
          </div>
        </div>
      )}

      <div className="w-full h-[280px] rounded-lg overflow-hidden border border-outline-variant/30">
        <div id="tradingview_eua_chart" ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default CbamCalculator;
