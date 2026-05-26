import Navbar from '@/components/Navbar';
import Scope3TrustLedger from '@/components/Scope3TrustLedger';

export const metadata = {
  title: '供應鏈碳排信任帳本 | ESG SaaS Tools',
  description: '具備密碼學雜湊防偽與 SGS/TÜV 第三方認證掛載的跨國碳足跡追蹤系統。'
};

export default function LedgerToolPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-32 min-h-screen bg-surface">
        <div className="max-w-container-max mx-auto px-margin">
          
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <a href="/tools" className="text-xs font-bold hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined text-[14px] mr-1">arrow_back</span>
                返回工具中心
              </a>
              <span className="text-xs">/</span>
              <span className="text-xs text-outline">信任帳本</span>
            </div>
            <h1 className="font-display-md text-display-md text-primary mb-2">Scope 3 供應鏈碳排信任帳本</h1>
            <p className="text-body-base text-on-surface-variant max-w-3xl">
              此為全局統整視圖，可跨產業綜整您的所有供應商 LCA 碳足跡資料庫。
            </p>
          </div>

          {/* Standalone Ledger Injection */}
          <Scope3TrustLedger />
          
        </div>
      </main>
    </>
  );
}
