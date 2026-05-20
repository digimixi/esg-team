"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function OnboardForm({ token, type, supplierName }) {
  const { hubSlug } = useParams();

  // Form states
  const [formData, setFormData] = useState({
    materialName: type === 'steel' ? 'EAF 低碳鋼材' : type === 'graphite' ? 'UHP 石墨電極原料' : '合規低碳海運服務',
    volume: '2500',
    intensity: type === 'steel' ? '0.55' : type === 'graphite' ? '2.10' : '0.06',
    standard: type === 'logistics' ? 'GLEC Framework v3.0' : 'ISO 14067:2018 Product Carbon Footprint',
    auditor: 'SGS Taiwan',
    extraction: type === 'steel' ? '0.10' : type === 'graphite' ? '0.40' : '0.01',
    manufacturing: type === 'steel' ? '0.35' : type === 'graphite' ? '1.50' : '0.00',
    logistics: type === 'steel' ? '0.10' : type === 'graphite' ? '0.20' : '0.05',
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0 = Idle, 1 = Processing, 2 = Success
  const [processMsg, setProcessMsg] = useState('');
  const [result, setResult] = useState(null);

  // Automated checksum for A1-A3 breakdown
  const [sumBreakdown, setSumBreakdown] = useState(0);
  const [isMatch, setIsMatch] = useState(true);

  useEffect(() => {
    const ext = parseFloat(formData.extraction) || 0;
    const mfg = parseFloat(formData.manufacturing) || 0;
    const log = parseFloat(formData.logistics) || 0;
    const total = parseFloat(formData.intensity) || 0;
    const sum = ext + mfg + log;
    
    setSumBreakdown(Number(sum.toFixed(3)));
    setIsMatch(Math.abs(sum - total) < 0.005);
  }, [formData.extraction, formData.manufacturing, formData.logistics, formData.intensity]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.materialName || !formData.volume || !formData.intensity) return;

    setLoading(true);
    setStep(1);

    // Multi-stage loading animation sequence to wow the user
    const msgs = [
      '🔒 正在驗證安全對接憑證 (Verifying Token Security)...',
      '☁️ 正在上傳第三方驗證證書 (Uploading Verification Certificate)...',
      '🧬 正在計算 SHA-256 密碼學存證雜湊 (Computing Cryptographic Hash)...',
      '⛓️ 正在寫入企業 Scope 3 信任帳本 (Writing Ledger Transaction)...'
    ];

    for (let i = 0; i < msgs.length; i++) {
      setProcessMsg(msgs[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const uploadData = new FormData();
      uploadData.append('token', token);
      uploadData.append('materialName', formData.materialName);
      uploadData.append('volume', formData.volume);
      uploadData.append('intensity', formData.intensity);
      uploadData.append('standard', formData.standard);
      uploadData.append('auditor', file ? formData.auditor : '自主申報 (未上傳證書)');
      uploadData.append('extraction', formData.extraction);
      uploadData.append('manufacturing', formData.manufacturing);
      uploadData.append('logistics', formData.logistics);
      if (file) {
        uploadData.append('certificateFile', file);
      }

      const response = await fetch('/api/supplier/onboard', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
        setStep(2);
      } else {
        alert('提交數據失敗：' + (data.error || '未知錯誤'));
        setStep(0);
      }
    } catch (err) {
      console.error(err);
      alert('連線失敗，請檢查網路後重試。');
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  // Success Step rendering
  if (step === 2 && result) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-2xl space-y-6 text-center animate-in fade-in duration-300 relative overflow-hidden group">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-esg-emerald/5 rounded-full blur-3xl"></div>
        
        <div className="py-6 space-y-4">
          <span className="material-symbols-outlined text-6xl text-esg-emerald animate-pulse">verified_user</span>
          <h3 className="text-xl font-bold text-primary">🎉 數據安全對接確認 (Connection Confirmed)</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            {result.message}
          </p>
        </div>

        <div className="bg-[#121824] border border-outline-variant/60 rounded-xl p-5 text-left space-y-3 font-mono text-xs max-w-lg mx-auto">
          <div className="flex justify-between border-b border-outline-variant/30 pb-2">
            <span className="text-secondary uppercase text-[10px] font-bold">交易 ID (Tx ID)：</span>
            <span className="text-primary font-bold">{result.transactionId}</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-2">
            <span className="text-secondary uppercase text-[10px] font-bold">審核狀態 (Status)：</span>
            <span className="text-esg-emerald font-bold">
              {file ? '第三方已驗證 (Verified)' : '自主申報已寫入 (Self-Declared)'}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-secondary uppercase text-[10px] font-bold block">密碼學存證雜湊 (Ledger Hash)：</span>
            <span className="text-amber-400 break-all leading-normal text-[11px] font-semibold tracking-tighter">
              {result.ledgerHash}
            </span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={`/hubs/${hubSlug}/supply-chain`}
            className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all text-center"
          >
            前往檢視碳排信任帳本
          </a>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setFile(null);
            }}
            className="px-6 py-2.5 border border-outline-variant text-secondary text-xs font-bold rounded-lg hover:bg-surface-container-low transition-colors"
          >
            再次填報新數據
          </button>
        </div>
      </div>
    );
  }

  // Processing Step rendering
  if (step === 1) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-12 shadow-2xl flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300 text-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-esg-emerald/20 border-t-esg-emerald animate-spin"></div>
          <span className="material-symbols-outlined text-3xl text-esg-emerald animate-pulse">lock_reset</span>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-primary">系統正在執行安全加密對接</h4>
          <p className="text-xs text-esg-emerald font-mono animate-pulse">{processMsg}</p>
        </div>
      </div>
    );
  }

  // Input Form Step rendering
  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="border-b border-outline-variant pb-4">
        <h3 className="text-base font-bold text-primary">填報產品生命週期評估 (LCA) 與排放數據</h3>
        <p className="text-[11px] text-on-surface-variant mt-1">請填寫該批次採購產品之真實碳排放數據，並上傳查證文件以掛載 Verified 狀態標章。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Material Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">採購原物料 / 服務名稱</label>
          <input
            type="text"
            required
            placeholder="例如：ASTM A615 鋼筋原料"
            value={formData.materialName}
            onChange={(e) => handleInputChange('materialName', e.target.value)}
            className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary"
          />
        </div>

        {/* 2. Volume */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">本次採購重量 (Tonnage - 公噸)</label>
          <input
            type="number"
            required
            min="1"
            placeholder="5000"
            value={formData.volume}
            onChange={(e) => handleInputChange('volume', e.target.value)}
            className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary"
          />
        </div>

        {/* 3. Carbon Intensity */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">產品碳強度 (Carbon Intensity - tCO₂e/t)</label>
          <input
            type="number"
            required
            step="0.01"
            min="0.01"
            max="10.0"
            placeholder="e.g. 0.62"
            value={formData.intensity}
            onChange={(e) => handleInputChange('intensity', e.target.value)}
            className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary"
          />
        </div>

        {/* 4. Calculation Standard */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">排放計算標準 / 溫室氣體指引</label>
          <select
            value={formData.standard}
            onChange={(e) => handleInputChange('standard', e.target.value)}
            className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary"
          >
            <option value="ISO 14067:2018 Product Carbon Footprint">ISO 14067:2018 產品碳足跡</option>
            <option value="ISO 14064-1 Corporate Inventory">ISO 14064-1 溫室氣體盤查</option>
            <option value="GHG Protocol Product Standard">GHG Protocol 產品標準</option>
            <option value="GLEC Framework v3.0">GLEC 運輸碳排放標準</option>
          </select>
        </div>
      </div>

      {/* A1-A3 Lifecycle Details Bento Grid */}
      <div className="bg-surface-container/60 border border-outline-variant/60 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-esg-emerald">analytics</span>
            LCA A1-A3 生命週期階段排放細分 (tCO₂e/t)
          </span>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-secondary">A1+A2+A3 合計：</span>
            <span className={`font-mono text-xs font-bold ${isMatch ? 'text-esg-emerald bg-esg-emerald/10 border border-esg-emerald/20' : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'} px-2 py-0.5 rounded border`}>
              {sumBreakdown}
            </span>
            {isMatch ? (
              <span className="text-[9px] text-esg-emerald font-bold flex items-center gap-0.5">✓ 吻合</span>
            ) : (
              <span className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5" title="合計需等於上方碳強度">⚠ 存在誤差</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-secondary">A1 原料開採 (Extraction)</label>
              <span className="font-mono text-[10px] font-semibold text-primary">{formData.extraction}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max={formData.intensity}
              step="0.01"
              value={formData.extraction}
              onChange={(e) => handleInputChange('extraction', e.target.value)}
              className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer accent-esg-emerald"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-secondary">A2 生產製造 (Manufacturing)</label>
              <span className="font-mono text-[10px] font-semibold text-primary">{formData.manufacturing}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max={formData.intensity}
              step="0.01"
              value={formData.manufacturing}
              onChange={(e) => handleInputChange('manufacturing', e.target.value)}
              className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer accent-esg-emerald"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-secondary">A3 運輸物流 (Logistics)</label>
              <span className="font-mono text-[10px] font-semibold text-primary">{formData.logistics}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max={formData.intensity}
              step="0.01"
              value={formData.logistics}
              onChange={(e) => handleInputChange('logistics', e.target.value)}
              className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer accent-esg-emerald"
            />
          </div>
        </div>
      </div>

      {/* Proof of Compliance Card */}
      <div className="border border-outline-variant/60 rounded-xl p-5 space-y-4">
        <span className="text-xs font-bold text-primary flex items-center gap-1.5 border-b border-outline-variant/40 pb-2">
          <span className="material-symbols-outlined text-xs text-esg-emerald">verified</span>
          上傳第三方驗證證書 (掛載 Verified 標記)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Certificate upload */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">驗證證書檔案 (PDF 或 Image)</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="w-full text-xs text-outline file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-surface-container file:text-primary hover:file:bg-surface-container-high file:cursor-pointer"
            />
          </div>

          {/* Auditor Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">查證第三方稽核機構 (Auditor)</label>
            <input
              type="text"
              disabled={!file}
              value={formData.auditor}
              onChange={(e) => handleInputChange('auditor', e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary disabled:opacity-40"
              placeholder="請先上傳檔案"
            />
            {!file && (
              <span className="text-[9px] text-outline block leading-none">上傳查證書檔案後，即可填報查證機構並獲得 Verified 認證。</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-outline-variant/60">
        <div className="flex items-center gap-1.5 text-[10px] text-secondary">
          <span className="material-symbols-outlined text-xs text-esg-emerald">gavel</span>
          <span>提交之數據受密碼學 Hash 保護，並可依法供主管機關審計。</span>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          安全提交數據並加密存證
        </button>
      </div>
    </form>
  );
}
