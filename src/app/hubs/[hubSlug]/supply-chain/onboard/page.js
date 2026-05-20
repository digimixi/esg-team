import { verifyOnboardingToken } from '@/lib/onboarding';
import { client } from '@/sanity/lib/client';
import OnboardForm from './OnboardForm';

export const dynamic = 'force-dynamic';

export default async function OnboardPage({ params, searchParams }) {
  const { hubSlug } = await params;
  const { token } = await searchParams;

  // 1. 取得專題資訊，用於視覺呈現與返回連結
  const hub = await client.fetch('*[_type == "hub" && slug.current == $slug][0]', { slug: hubSlug });

  // 2. 驗證金鑰
  const verifiedData = verifyOnboardingToken(token);

  if (!verifiedData || verifiedData.hubSlug !== hubSlug) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6 text-center">
          <span className="material-symbols-outlined text-error text-6xl animate-pulse">lock</span>
          <h1 className="text-display-md font-display-md text-primary">憑證驗證失敗</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
            對接邀請連結無效、已過期（時效 48 小時），或是與目前所屬的專題不符。請聯繫買方企業採購人員，重新發送安全對接邀請。
          </p>
          <div className="pt-4">
            <a 
              href={`/hubs/${hubSlug}/supply-chain`} 
              className="inline-block px-6 py-2.5 bg-primary text-on-primary font-label-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              返回供應鏈專區
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { supplierName, email, type } = verifiedData;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-on-surface flex flex-col justify-between py-12 px-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-esg-emerald/5 via-transparent to-transparent pointer-events-none z-0"></div>
      
      <div className="w-full max-w-3xl mx-auto space-y-8 relative z-10">
        {/* Header Branding */}
        <div className="flex justify-between items-center border-b border-outline-variant/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-esg-emerald text-lg font-bold font-mono tracking-tighter">esg<span className="text-white">.team</span></span>
            <span className="text-[10px] bg-secondary-container px-2 py-0.5 rounded text-secondary font-mono">TRUST NETWORK</span>
          </div>
          {hub && (
            <a 
              href={`/hubs/${hubSlug}/supply-chain`} 
              className="text-xs text-outline hover:text-primary transition-colors flex items-center gap-1 font-bold"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              返回 {hub.title} 專題
            </a>
          )}
        </div>

        {/* Introduction Panel */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-esg-emerald bg-esg-emerald/10 border border-esg-emerald/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                Secure Onboarding Connection
              </span>
              <h2 className="text-headline-md font-headline-md text-primary mt-2">供應商 Scope 3 數據安全填報</h2>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-bold">
              <span className="material-symbols-outlined text-xs">verified</span>
              身分已雙重驗證 (Verified)
            </div>
          </div>
          
          <p className="text-xs text-on-surface-variant leading-relaxed">
            您好，<strong>{supplierName}</strong>！您的合作買方已發起與您的數據安全對接。本通道採用密碼學時效金鑰保護，您所提交之碳強度數據及驗證證書，在通過系統雜湊校驗（Ledger Hash）後，將會作為 Scope 3 查證憑證直接寫入企業之信任帳本。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-outline-variant/40 text-[11px] leading-relaxed">
            <div className="bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant/30 space-y-1">
              <span className="text-secondary font-bold uppercase tracking-tight block">受邀企業 (Supplier)</span>
              <span className="text-primary font-medium truncate block">{supplierName}</span>
            </div>
            <div className="bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant/30 space-y-1">
              <span className="text-secondary font-bold uppercase tracking-tight block">對接窗口 (Contact)</span>
              <span className="text-primary font-medium truncate block">{email}</span>
            </div>
            <div className="bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant/30 space-y-1">
              <span className="text-secondary font-bold uppercase tracking-tight block">品項類別 (Category)</span>
              <span className="text-primary font-medium block">
                {type === 'steel' ? '鋼鐵與金屬原料 (Steel)' : type === 'graphite' ? '石墨電極與焦炭 (Graphite)' : '原物料物流運輸 (Logistics)'}
              </span>
            </div>
          </div>
        </div>

        {/* Onboarding Form */}
        <OnboardForm token={token} type={type} supplierName={supplierName} />

      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] text-outline mt-12 pt-6 border-t border-outline-variant/40 max-w-3xl mx-auto z-10">
        <p>© 2026 esg.team Secure Onboarding Network. All rights reserved.</p>
        <p className="mt-1 opacity-60">數據傳輸採用 TLS 1.3 與 SHA-256 存證雜湊技術保護，符合歐盟 CBAM 申報安全稽核規範。</p>
      </footer>
    </div>
  );
}
