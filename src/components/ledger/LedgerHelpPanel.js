import React from 'react';

/**
 * @component LedgerHelpPanel
 * @description Operational manual and real-world business scenario breakdown for the Carbon Trust Ledger.
 */
const LedgerHelpPanel = ({ onClose }) => {
  return (
    <div className="bg-surface-container-high/60 border border-outline-variant rounded-xl p-5 mb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2">
        <span className="text-xs font-bold text-primary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-primary">menu_book</span>
          帳本用途與操作手冊 (Trust Ledger Manual)
        </span>
        <button 
          type="button" 
          onClick={onClose}
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
                <li>數據存證與安全鏈結：查驗證雜湊值 (Hash) 及查證標準。</li>
                <li>生命週期分析 (LCA Breakdown)：細分 A1-A3 生命週期階段之碳足跡貢獻。</li>
                <li>數據核決與導出：下載經過 SGS 認證的電子 PDF 足跡認證書或一鍵將數據同步至企業碳資產庫。</li>
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
  );
};

export default LedgerHelpPanel;
