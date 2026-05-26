import Navbar from '@/components/Navbar';
import CbamCalculator from '@/components/CbamCalculator';

export const metadata = {
  title: 'CBAM 碳邊境稅模擬器 | ESG SaaS Tools',
  description: '動態對齊官方公開排放因子，一鍵預算歐盟進口碳關稅曝險。'
};

export default function CbamToolPage() {
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
              <span className="text-xs text-outline">CBAM 模擬器</span>
            </div>
            <h1 className="font-display-md text-display-md text-primary mb-2">CBAM 碳關稅動態模擬器</h1>
            <p className="text-body-base text-on-surface-variant max-w-3xl">
              此為全域通用版本，可供各行業跨界評估使用。如需鎖定特定產業基準，請至各產業專題內使用。
            </p>
          </div>

          {/* Standalone Calculator Injection without specific hub context */}
          <CbamCalculator />
          
        </div>
      </main>
    </>
  );
}
