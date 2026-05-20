import React, { useState } from 'react';
import { useParams } from 'next/navigation';

/**
 * @component SupplierInviteModal
 * @description Encapsulated secure onboarding connection invitation modal.
 * Connects directly to Next.js API route /api/supplier/invite to generate
 * cryptographically-signed tokens and send Resend notifications.
 */
const SupplierInviteModal = ({ isOpen, onClose }) => {
  const { hubSlug } = useParams();
  const [requestForm, setRequestForm] = useState({ supplierName: '', email: '', type: 'steel' });
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [showOnboardingHelp, setShowOnboardingHelp] = useState(false);

  if (!isOpen) return null;

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestForm.supplierName || !requestForm.email || !hubSlug) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/supplier/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestForm,
          hubSlug
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setApiResponse(data);
        setRequestSent(true);
      } else {
        alert('對接邀請發送失敗：' + (data.error || '伺服器錯誤'));
      }
    } catch (err) {
      console.error('Error submitting connection invite:', err);
      alert('連線失敗，請檢查網路狀態或重試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-primary font-bold text-xs cursor-pointer disabled:opacity-50"
        >
          [ 關閉 ]
        </button>

        <div className="mb-4 space-y-2">
          <div>
            <span className="text-[10px] font-bold text-esg-emerald bg-esg-emerald/10 border border-esg-emerald/20 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Secure Onboarding Flow
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-primary">發起供應商 Scope 3 數據對接</h4>
            <button 
              type="button"
              onClick={() => setShowOnboardingHelp(!showOnboardingHelp)}
              className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] transition-all duration-300 ${
                showOnboardingHelp 
                  ? 'bg-primary text-on-primary border-primary' 
                  : 'bg-surface-container-high/40 border-outline-variant/60 text-secondary hover:border-primary hover:text-primary hover:scale-105 active:scale-95 cursor-pointer'
              }`}
              title="顯示安全對接郵件流 (Email Token) 說明"
            >
              <span className="material-symbols-outlined text-[11px] font-bold">help</span>
            </button>
          </div>
          
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            系統將會生成具備密碼學安全 Token 的數據填報鏈結。新供應商完成填報並掛載驗證單據後，將自動寫入此信任帳本。
          </p>

          {showOnboardingHelp && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-[11px] text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <span className="material-symbols-outlined text-xs text-esg-emerald">vpn_key</span>
                <span className="font-bold text-slate-100">安全對接郵件流 (Email Token) 機制</span>
              </div>
              <div className="space-y-2 text-[10px] text-slate-400 font-sans">
                <div>
                  <strong className="text-slate-200">🎯 功能目的：</strong>
                  採用密碼學安全 Token 的數據填報鏈結，透過自動化郵件流（Email Token）安全採集上游供應商的 Scope 3 碳強度數據。新供應商完成填報並上傳查證單據後，將自動寫入帳本。
                </div>
                <div>
                  <strong className="text-slate-200">⚙️ 操作方式與流程：</strong>
                  <ul className="list-decimal list-inside space-y-1 mt-1 pl-1">
                    <li>輸入供應商的公司名稱與採購窗口的電子信箱。</li>
                    <li>選擇採購的原料類型（如鋼鐵、物流）。</li>
                    <li>點擊「發送對接邀請信」，系統將透過 Resend 自動生成一個具備密碼學時效防偽安全金鑰 (Secure Token) 的電子郵件邀請。</li>
                    <li>供應商點擊信中專屬的對接連結（48 小時內有效），免密碼即可在專屬頁面填報碳排數據與上傳 PDF 證書（如 SGS / TÜV），完成自動化 A1-A3 驗算與 Hash 鏈路存證。</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {requestSent ? (
          <div className="py-4 text-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-esg-emerald animate-bounce block">mark_email_read</span>
            <h5 className="font-bold text-primary text-sm">邀請金鑰已安全生成！</h5>
            
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              {apiResponse?.sandboxMode 
                ? '系統已成功生成時效安全金鑰 (Token)。由於目前處於沙盒概念驗證模式，您可直接點擊下方鏈結進行模擬填報：'
                : '邀請信已成功發送至該供應商之採購電子信箱。'
              }
            </p>

            {apiResponse?.onboardUrl && (
              <div className="bg-surface-container border border-outline-variant/60 p-3 rounded-lg text-left mt-2 max-h-[140px] overflow-y-auto">
                <span className="text-[9px] font-bold text-secondary block mb-1 uppercase tracking-wider">模擬填報測試連結 (Sandbox Link)：</span>
                <a 
                  href={apiResponse.onboardUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-esg-emerald text-[10px] break-all underline hover:text-esg-emerald/80 font-mono block leading-relaxed"
                >
                  {apiResponse.onboardUrl}
                </a>
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setRequestSent(false);
                  onClose();
                  setRequestForm({ supplierName: '', email: '', type: 'steel' });
                }}
                className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 cursor-pointer"
              >
                關閉視窗
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">供應商公司法律名稱</label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="例如：榮鋼材料股份有限公司"
                value={requestForm.supplierName}
                onChange={(e) => setRequestForm({...requestForm, supplierName: e.target.value})}
                className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">採購對接窗口電子信箱</label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="purchasing@supplier.com"
                value={requestForm.email}
                onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-tight block">採購原物料與服務類型</label>
              <select
                value={requestForm.type}
                disabled={loading}
                onChange={(e) => setRequestForm({...requestForm, type: e.target.value})}
                className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-primary disabled:opacity-50"
              >
                <option value="steel">鋼鐵與金屬原料 (Steel)</option>
                <option value="graphite">石墨電極與焦炭 (Graphite)</option>
                <option value="logistics">原物料物流運輸 (Logistics)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="px-4 py-2 border border-outline-variant text-secondary rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading && (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-on-primary border-t-transparent animate-spin"></span>
                )}
                {loading ? '正在發送邀請...' : '發送對接邀請信'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default SupplierInviteModal;
