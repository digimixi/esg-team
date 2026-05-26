import React from 'react';
import CertificateAuditor from './CertificateAuditor';

/**
 * @component LedgerTable

 * @description Encapsulated transactions list, filtering toolbar, and expandable detail drawer.
 */
const LedgerTable = ({
  filteredTransactions,
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  selectedTx,
  setSelectedTx
}) => {
  return (
    <>
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
                        {tx.status === 'erp-synced' ? (
                          <span className="group/status relative inline-flex items-center gap-1 cursor-help select-none bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[10px] animate-pulse">api</span>
                            ERP 直連
                            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 scale-90 opacity-0 group-hover/status:scale-100 group-hover/status:opacity-100 transition-all duration-200 origin-bottom bg-slate-900 border border-slate-800 rounded-lg p-2 shadow-2xl z-50 text-[10px] leading-relaxed text-slate-300 font-sans text-left normal-case tracking-normal">
                              <span className="font-bold text-slate-100 block border-b border-slate-800 pb-1 mb-1">
                                ⚡ B2B ERP 自動化直連
                              </span>
                              此筆資料為外部企業 ERP/EMS 系統透過 OpenAPI 自動推送寫入，未經人工修改，具備極高真實性。
                              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></span>
                            </span>
                          </span>
                        ) : (
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
                        )}
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
                          <CertificateAuditor tx={tx} />


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
    </>
  );
};

export default LedgerTable;
