"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { initialTransactions } from './ledger/mockData';
import { client } from '@/sanity/lib/client';
import LedgerHelpPanel from './ledger/LedgerHelpPanel';
import LedgerMetrics from './ledger/LedgerMetrics';
import SupplierInviteModal from './ledger/SupplierInviteModal';
import LedgerTable from './ledger/LedgerTable';

/**
 * @component Scope3TrustLedger
 * @description A premium, high-density Scope 3 Carbon Trust Ledger (供應鏈碳排信任帳本)
 * built with Google Stitch high-contrast visual standards.
 * Orchestrates subcomponents for metrics, transactions table, help manuals, and secure invite forms.
 */
const Scope3TrustLedger = () => {
  // Component States
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Fetch dynamic transactions from Sanity and merge with fallback data
  useEffect(() => {
    async function loadDynamicTransactions() {
      try {
        const dynamicTxs = await client.fetch('*[_type == "scope3Transaction"] | order(date desc)');
        if (dynamicTxs && dynamicTxs.length > 0) {
          const formattedTxs = dynamicTxs.map(tx => ({
            id: tx.id,
            date: tx.date,
            supplier: tx.supplier,
            material: tx.material,
            category: tx.category,
            volume: tx.volume,
            intensity: tx.intensity,
            emissions: tx.emissions,
            status: tx.status,
            auditor: tx.auditor,
            standard: tx.standard,
            hash: tx.hash,
            breakdown: tx.breakdown || { extraction: 0, manufacturing: 0, logistics: 0 }
          }));
          // Merge dynamic transactions at the top of initial mock ones
          setTransactions([...formattedTxs, ...initialTransactions]);
        }
      } catch (error) {
        console.error('[Trust Ledger] Failed to load dynamic transactions:', error);
      }
    }
    
    loadDynamicTransactions();
  }, []);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tx.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === 'all' || tx.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [transactions, searchTerm, activeTab]);

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
        <LedgerHelpPanel onClose={() => setShowInstructions(false)} />
      )}

      {/* 4 Carbon Asset Summary Cards */}
      <LedgerMetrics metrics={metrics} />

      {/* Transaction Table and filters */}
      <LedgerTable
        filteredTransactions={filteredTransactions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTx={selectedTx}
        setSelectedTx={setSelectedTx}
      />

      {/* Onboarding Connect Request Modal */}
      <SupplierInviteModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
};

export default Scope3TrustLedger;
