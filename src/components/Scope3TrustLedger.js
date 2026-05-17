"use client";

import React, { useState, useMemo } from 'react';

/**
 * @component Scope3TrustLedger
 * @description A premium, high-density Scope 3 Carbon Trust Ledger (供應鏈碳排信任帳本)
 * built with Google Stitch high-contrast visual standards.
 */
const Scope3TrustLedger = () => {
  // Ledger Dataset
  const initialTransactions = [
    {
      id: "TX-2026-001",
      date: "2026-05-10",
      supplier: "中鋼股份有限公司 (CSC)",
      material: "EAF 綠色廢鋼基底材料 (EAF Scrap Base)",
      category: "steel",
      volume: 12000,
      intensity: 0.62,
      emissions: 7440,
      status: "verified",
      auditor: "SGS Taiwan",
      standard: "ISO 14067:2018 Product Carbon Footprint",
      hash: "0x7a8e9b2c3d4f5e6a7f8e9a0b1c2d3e4f5a6b7c8d",
      breakdown: { extraction: 0.12, manufacturing: 0.38, logistics: 0.12 }
    },
    {
      id: "TX-2026-002",
      date: "2026-05-08",
      supplier: "Giga Carbon Corp (極碳科技)",
      material: "UHP 600mm 超高功率石墨電極 (UHP Graphite Electrode)",
      category: "graphite",
      volume: 450,
      intensity: 2.45,
      emissions: 1102.5,
      status: "verified",
      auditor: "TÜV Rheinland",
      standard: "ISO 14067 PCF Certificate",
      hash: "0x8f2c1d9b3a4f6e8b7c8d9e0f1a2b3c4d5e6f7a8b",
      breakdown: { extraction: 0.45, manufacturing: 1.80, logistics: 0.20 }
    },
    {
      id: "TX-2026-003",
      date: "2026-05-05",
      supplier: "陽明海運股份有限公司 (Yang Ming)",
      material: "低碳海運航線運輸服務 (Kaohsiung to Rotterdam)",
      category: "logistics",
      volume: 8500,
      intensity: 0.08,
      emissions: 680,
      status: "auditing",
      auditor: "DNV GL (審查中)",
      standard: "GLEC Framework v3.0 Scope 3 Category 4",
      hash: "0x9e1b2d3c4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
      breakdown: { extraction: 0.01, manufacturing: 0.00, logistics: 0.07 }
    },
    {
      id: "TX-2026-004",
      date: "2026-04-28",
      supplier: "Anglo-American Mining Group",
      material: "優質還原鐵礦石原料 (Direct Reduced Iron Ore)",
      category: "steel",
      volume: 5000,
      intensity: 1.15,
      emissions: 5750,
      status: "verified",
      auditor: "SGS United Kingdom",
      standard: "ISO 14064-1 Corporate Inventory",
      hash: "0x5d4e3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d",
      breakdown: { extraction: 0.65, manufacturing: 0.35, logistics: 0.15 }
    },
    {
      id: "TX-2026-005",
      date: "2026-04-25",
      supplier: "Tokai Carbon Co., Ltd.",
      material: "高效能針狀焦原料 (Premium Needle Coke)",
      category: "graphite",
      volume: 800,
      intensity: 3.10,
      emissions: 2480,
      status: "self-declared",
      auditor: "自主申報 (未查證)",
      standard: "GHG Protocol Corporate Standard (Self-Reported)",
      hash: "0x4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b",
      breakdown: { extraction: 0.80, manufacturing: 2.10, logistics: 0.20 }
    }
  ];

  // Component States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Request Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ supplierName: '', email: '', type: 'steel' });
  const [requestSent, setRequestSent] = useState(false);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter(tx => {
      const matchesSearch = tx.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tx.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === 'all' || tx.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalVolume = filteredTransactions.reduce((acc, tx) => acc + tx.volume, 0);
    const totalEmissions = filteredTransactions.reduce((acc, tx) => acc + tx.emissions, 0);
    const avgIntensity = totalVolume > 0 ? (totalEmissions / totalVolume) : 0;
    
    const verifiedVolume = filteredTransactions
      .filter(tx => tx.status === "verified")
      .reduce((acc, tx) => acc + tx.volume, 0);
    const verifiedPercent = totalVolume > 0 ? (verifiedVolume / totalVolume) * 100 : 0;

    return { totalVolume, totalEmissions, avgIntensity, verifiedPercent };
  }, [filteredTransactions]);

  // Handle Invitation Form Submit
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!requestForm.supplierName || !requestForm.email) return;
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setShowRequestModal(false);
      setRequestForm({ supplierName: '', email: '', type: 'steel' });
    }, 2000);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 relative">
      {/* Background Decorative Radial Gradient */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-outline-variant/60 pb-5 mb-6 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Scope 3 Connectivity Ledger</span>
          </div>
          
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-primary font-display">供應鏈碳排信任帳本 (Carbon Trust Ledger)</h3>
            <button 
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                showInstructions 
                  ? 'bg-primary text-on-primary border-primary' 
                  : 'bg-surface-container-high/40 border-outline-variant/60 text-secondary hover:border-primary hover:text-primary hover:scale-105 active:scale-95'
              }`}
              title="顯示帳本操作指南與用途說明"
            >
              <span className="material-symbols-outlined text-[15px] font-bold">help</span>
            </button>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            採用密碼學雜湊校驗與第三方認證鏈結，即時追蹤上下游 Scope 3 原物料之生命週期評估 (LCA) 數據。
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 flex items-center gap-2 self-start lg:self-center shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">share_relation</span>
          發起供應商碳排對接請求
        </button>
      </div>

      {/* ⚠️ 系統公告：未對接數據庫，暫未正式開放 */}
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in duration-300">
        <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 animate-pulse text-amber-400">warning</span>
        <div className="space-y-1">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            系統公告 / 概念驗證沙盒提示 (System Sandbox Notice)
          </div>
          <p className="text-[11px] leading-relaxed text-amber-200/80">
            本工具目前處於<strong>概念驗證 (POC) 沙盒演示階段，尚未完整對接正式生產數據庫</strong>。
            因此，本工具目前<strong>暫未開放正式生產使用</strong>（下方數據均為沙盒模擬）。如需為您的企業供應鏈對接真實 ERP 與碳信託資料庫，請聯繫 esg.team 技術團隊。
          </p>
        </div>
      </div>

      {/* Interactive Instructions Panel */}
      {showInstructions && (
        <div className="bg-surface-container-high/60 border border-outline-variant rounded-xl p-5 mb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-primary">menu_book</span>
              帳本用途與操作手冊 (Trust Ledger Manual)
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
              <h4 className="font-bold text-primary">🎯 帳本開發用途 (Why use this?)</h4>
              <p>
                碳信託帳本 (Carbon Trust Ledger) 是重工業供應鏈 Scope 3 碳治理的底座。本工具透過密碼學防偽雜湊 (Ledger Hash) 與國際第三方檢驗機構 (SGS/TÜV) 單據進行掛載驗證，將上游鋼鐵、石墨與物流運輸等供應商的真實碳足跡進行結構化儲存，消除傳統盤查中的「綠洗 (Greenwashing)」風險，提供無可篡改的安全數據鏈路，助您在面對國際大廠採購審查與歐盟 CBAM 申報時擁有最強力的合規存證。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary">⚙️ 操作教學說明 (How to operate?)</h4>
              <ul className="list-decimal list-inside space-y-1">
                <li><strong className="text-primary">實時總量監控</strong>：頂部字卡動態統計您供應鏈的「採購總量」、「Scope 3 累計排放量」、「第三方查證比例」與「平均排放強度」。</li>
                <li><strong className="text-primary">搜尋與分類篩選</strong>：使用關鍵字搜尋或點擊品項分頁（如鋼鐵、石墨、物流），即時篩選交易紀錄。</li>
                <li><strong className="text-primary">展開存證詳情</strong>：點擊交易列右側的「詳情」按鈕，可查看：
                  <ul className="list-disc list-inside pl-4 mt-0.5 space-y-0.5 text-outline">
                    <li>*數據存證與安全鏈結*：查驗證雜湊值 (Hash) 及查證標準。</li>
                    <li>*生命週期分析 (LCA Breakdown)*：細分 A1-A3 生命週期階段之碳足跡貢獻。</li>
                    <li>*數據核決與導出*：下載經過 SGS 認證的電子 PDF 足跡認證書或一鍵將數據同步至企業碳資產庫。</li>
                  </ul>
                </li>
                <li><strong className="text-primary">發起供應商對接</strong>：點擊右上角按鈕，填寫新供應商名稱與信箱，系統將發出具備密碼學安全 Token 的數據填報邀請信。</li>
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
                  採購打電話或發 Excel 表單給 50 家供應商問：「你們鋼鐵排多少碳？」供應商通常隨便寫個數字甚至<strong>「綠洗 (Greenwashing) 偽造」</strong>。若拿著虛假數據去歐洲申報，一旦被查到，會面臨<strong>天價罰款並被取消出口資格</strong>。
                </div>
              </div>
              <div className="bg-esg-emerald/10 border border-esg-emerald/20 text-esg-emerald p-3 rounded-lg flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">verified</span>
                <div>
                  <span className="font-bold block text-primary">🛡️ 本信任帳本的解決之道</span>
                  本帳本提供了一個安全防偽鏈路。透過向供應商發起對接，供應商必須上傳具備國際第三方（如 <strong>SGS / TÜV</strong>）認證之 <strong>ISO 14067 單據</strong>，且每筆申報數據均會生成<strong>防偽加密雜湊 (Ledger Hash)</strong> 存入系統。您拿著這份備受信任的帳本申報，能徹底消除綠洗隱憂，通過歐洲邊境最嚴苛的審計。
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Carbon Asset Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 1. Tonnage */}
        <div className="bg-surface-container-high/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">採購原物料總量</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-data-mono text-xl font-bold text-primary">
              {metrics.totalVolume.toLocaleString()}
            </span>
            <span className="text-[9px] text-outline">噸 (T)</span>
          </div>
          <span className="text-[8px] text-outline-variant mt-1">涵蓋鋼鐵、石墨與物流運輸</span>
        </div>

        {/* 2. Total Scope 3 */}
        <div className="bg-surface-container-high/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Scope 3 累計排放量</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-data-mono text-xl font-bold text-error">
              {metrics.totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
            <span className="text-[9px] text-outline">tCO₂e</span>
          </div>
          <span className="text-[8px] text-outline-variant mt-1">自上游原物料開採至運輸之總排</span>
        </div>

        {/* 3. Verified % */}
        <div className="bg-surface-container-high/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">第三方查證比例 (Verified)</span>
          <div className="mt-2 flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90">
                <circle className="text-outline-variant/40" strokeWidth="2.5" stroke="currentColor" fill="transparent" r="12" cx="16" cy="16"/>
                <circle className="text-esg-emerald transition-all duration-1000" strokeWidth="2.5" strokeDasharray={`${2 * Math.PI * 12}`} strokeDashoffset={`${2 * Math.PI * 12 * (1 - metrics.verifiedPercent / 100)}`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="12" cx="16" cy="16"/>
              </svg>
              <span className="absolute text-[8px] font-mono font-bold text-primary">{Math.round(metrics.verifiedPercent)}%</span>
            </div>
            <div className="flex-1">
              <span className="font-data-mono text-lg font-bold text-primary">
                {metrics.verifiedPercent.toFixed(1)}%
              </span>
            </div>
          </div>
          <span className="text-[8px] text-outline-variant mt-1">經 SGS/TÜV 等第三方機構簽證</span>
        </div>

        {/* 4. Avg Intensity */}
        <div className="bg-surface-container-high/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">平均排放強度 (Intensity)</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-data-mono text-xl font-bold text-esg-emerald">
              {metrics.avgIntensity.toFixed(3)}
            </span>
            <span className="text-[9px] text-outline">tCO₂e/t</span>
          </div>
          <span className="text-[8px] text-outline-variant mt-1">較同業重工業基準低 34%</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-outline">search</span>
          <input
            type="text"
            placeholder="搜尋供應商、交易編號或物資..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-high/40 border border-outline-variant rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-[11px] rounded-md transition-all font-bold ${activeTab === 'all' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            全部交易
          </button>
          <button
            onClick={() => setActiveTab('steel')}
            className={`px-3 py-1 text-[11px] rounded-md transition-all font-bold ${activeTab === 'steel' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            鋼鐵製品
          </button>
          <button
            onClick={() => setActiveTab('graphite')}
            className={`px-3 py-1 text-[11px] rounded-md transition-all font-bold ${activeTab === 'graphite' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            石墨電極
          </button>
          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-3 py-1 text-[11px] rounded-md transition-all font-bold ${activeTab === 'logistics' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            物流運輸
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto border border-outline-variant rounded-xl bg-surface-container-lowest">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant text-[10px] font-bold text-secondary uppercase">
              <th className="py-3 px-4 font-mono">ID / 日期</th>
              <th className="py-3 px-4">供應商名稱</th>
              <th className="py-3 px-4">物資與品項</th>
              <th className="py-3 px-4 text-right">採購量</th>
              <th className="py-3 px-4 text-right font-mono">強度 (tCO₂e/t)</th>
              <th className="py-3 px-4 text-right">碳排放量 (tCO₂e)</th>
              <th className="py-3 px-4 text-center">查證狀態</th>
              <th className="py-3 px-4 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => {
              const isSelected = selectedTx?.id === tx.id;
              return (
                <React.Fragment key={tx.id}>
                  <tr className={`border-b border-outline-variant/60 hover:bg-surface-container/30 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-primary">{tx.id}</div>
                      <div className="text-[10px] text-outline font-mono mt-0.5">{tx.date}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-primary">{tx.supplier}</td>
                    <td className="py-4 px-4">
                      <div className="text-secondary truncate max-w-xs">{tx.material}</div>
                      <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mt-1 ${
                        tx.category === 'steel' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        tx.category === 'graphite' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                      }`}>
                        {tx.category === 'steel' ? '鋼鐵製品' : tx.category === 'graphite' ? '石墨電極' : '國際運輸'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-primary">
                      {tx.volume.toLocaleString()} t
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-secondary">
                      {tx.intensity.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-error">
                      {tx.emissions.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          tx.status === 'verified' ? 'bg-esg-emerald/10 text-esg-emerald border border-esg-emerald/20' :
                          tx.status === 'auditing' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-outline-variant/60 text-secondary border border-outline-variant'
                        }`}>
                          <span className="material-symbols-outlined text-[10px]">
                            {tx.status === 'verified' ? 'check_circle' : tx.status === 'auditing' ? 'pending' : 'help_outline'}
                          </span>
                          {tx.status === 'verified' ? '已查證' : tx.status === 'auditing' ? '審核中' : '自主宣告'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedTx(isSelected ? null : tx)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-all ${
                          isSelected 
                            ? 'bg-primary text-on-primary border-primary' 
                            : 'border-outline-variant text-secondary hover:border-primary hover:text-primary'
                        }`}
                      >
                        {isSelected ? '隱藏' : '詳情'}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Details Drawer */}
                  {isSelected && (
                    <tr>
                      <td colSpan="8" className="bg-surface-container/20 p-6 border-b border-outline-variant/60">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-1 duration-200">
                          
                          {/* Evidence Hash Validation */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                              數據存證與安全鏈結 (Evidence Trust Chain)
                            </span>
                            <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant space-y-2">
                              <div>
                                <span className="text-[9px] text-outline block">查證驗證機構 Auditor</span>
                                <span className="text-xs font-bold text-primary">{tx.auditor}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-outline block">合規適用標準 ESG Standard</span>
                                <span className="text-xs font-bold text-primary leading-relaxed block">{tx.standard}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-outline block">存證防偽雜湊 Cryptographic Ledger Hash</span>
                                <div className="font-mono text-[9px] text-secondary break-all bg-surface-container-lowest/80 border border-outline-variant p-2 rounded mt-1 select-all flex items-center justify-between">
                                  <span className="truncate flex-1 mr-2">{tx.hash}</span>
                                  <span className="material-symbols-outlined text-[12px] text-esg-emerald shrink-0">verified_user</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic LCA Carbon Breakdown */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                              碳足跡生命週期分析 (LCA Breakdown - tCO₂e/t)
                            </span>
                            <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant space-y-3">
                              {/* Extraction */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-secondary">原料開採與預處理 (A1)</span>
                                  <span className="font-mono font-bold text-primary">{tx.breakdown.extraction.toFixed(2)} t</span>
                                </div>
                                <div className="w-full h-1.5 bg-outline-variant rounded overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: `${(tx.breakdown.extraction / tx.intensity) * 100}%` }}></div>
                                </div>
                              </div>
                              {/* Manufacturing */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-secondary">製程核心生產 (A2)</span>
                                  <span className="font-mono font-bold text-primary">{tx.breakdown.manufacturing.toFixed(2)} t</span>
                                </div>
                                <div className="w-full h-1.5 bg-outline-variant rounded overflow-hidden">
                                  <div className="h-full bg-amber-500" style={{ width: `${(tx.breakdown.manufacturing / tx.intensity) * 100}%` }}></div>
                                </div>
                              </div>
                              {/* Logistics */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-secondary">上游運輸與配送 (A3)</span>
                                  <span className="font-mono font-bold text-primary">{tx.breakdown.logistics.toFixed(2)} t</span>
                                </div>
                                <div className="w-full h-1.5 bg-outline-variant rounded overflow-hidden">
                                  <div className="h-full bg-purple-500" style={{ width: `${(tx.breakdown.logistics / tx.intensity) * 100}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions / Actions Drawer */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                              數據核決與導出 (Audit Action Desk)
                            </span>
                            <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant flex flex-col justify-between h-[135px]">
                              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                                您可以直接在平台上下載經過驗證的 PDF 原物料足跡認證書，此檔案內嵌有電子簽章與帳本防篡改鏈結，可用於向客戶導出合規聲明。
                              </p>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => alert(`已啟動下載 ${tx.id} 的 SGS 官方檢驗憑證！`)}
                                  className="py-2 bg-esg-emerald text-on-primary rounded text-[10px] font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">download</span>
                                  下載合規認證書
                                </button>
                                <button
                                  type="button"
                                  onClick={() => alert(`已成功將此交易數據安全同步至您的企業碳資產管理儀表板！`)}
                                  className="py-2 bg-surface-container-lowest border border-outline-variant text-secondary hover:border-primary hover:text-primary rounded text-[10px] font-bold active:scale-95 transition-all flex items-center justify-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">sync</span>
                                  同步內稽資產
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="8" className="py-12 text-center text-outline">
                  <span className="material-symbols-outlined text-3xl block mb-2 text-outline-variant">find_in_page</span>
                  查無符合當前過濾條件的信任帳本交易。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Onboarding Connect Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-primary font-bold text-xs"
            >
              [ 關閉 ]
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-esg-emerald bg-esg-emerald/10 border border-esg-emerald/20 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                Secure Invitation Flow
              </span>
              <h4 className="text-base font-bold text-primary mt-2">發起供應商 Scope 3 數據對接</h4>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                系統將會發送一封具備密碼學安全 Token 的數據填報鏈結。新供應商完成填報並掛載驗證單據後，將自動寫入此信任帳本。
              </p>
            </div>

            {requestSent ? (
              <div className="py-8 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-esg-emerald animate-bounce">mark_email_read</span>
                <h5 className="font-bold text-primary">邀請已成功安全送出！</h5>
                <p className="text-[10px] text-secondary">
                  已向該供應商發送對接金鑰，等待其上傳 ISO 14067 單據中。
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">供應商公司法律名稱</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：榮鋼材料股份有限公司"
                    value={requestForm.supplierName}
                    onChange={(e) => setRequestForm({...requestForm, supplierName: e.target.value})}
                    className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">採購對接窗口電子信箱</label>
                  <input
                    type="email"
                    required
                    placeholder="purchasing@supplier.com"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                    className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">採購原物料與服務類型</label>
                  <select
                    value={requestForm.type}
                    onChange={(e) => setRequestForm({...requestForm, type: e.target.value})}
                    className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary"
                  >
                    <option value="steel">鋼鐵與金屬原料 (Steel)</option>
                    <option value="graphite">石墨電極與焦炭 (Graphite)</option>
                    <option value="logistics">原物料物流運輸 (Logistics)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 border border-outline-variant text-secondary rounded-lg hover:bg-surface-container-low transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    發送對接邀請信
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Scope3TrustLedger;
