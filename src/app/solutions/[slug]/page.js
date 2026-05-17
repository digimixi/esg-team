import { client } from '@/sanity/lib/client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import SolutionHero from '@/components/solutions/SolutionHero';
import { BentoGrid, BentoCard } from '@/components/solutions/BentoGrid';
import JourneySteps from '@/components/solutions/JourneySteps';

export const revalidate = 0;

export default async function SolutionDetail({ params }) {
  const { slug } = await params;

  // Fetch dynamic content from Sanity
  const solution = await client.fetch(`*[_type == "solution" && slug.current == $slug][0] {
    title,
    titleEnglish,
    description,
    badgeText,
    badgeIcon,
    "imageUrl": heroImage.asset->url,
    cta,
    bentoSection,
    journeySection,
    caseStudySection[] {
      ...,
      "imageUrl": image.asset->url
    }
  }`, { slug });

  // --------------------------------------------------------------------------
  // LEGACY FALLBACKS (Hardcoded content for original 4 solutions)
  // --------------------------------------------------------------------------

  // 1. 數位合規佈局 (Compliance)
  const renderCompliance = () => (
    <div className="space-y-12">
      <SolutionHero
        title="數位合規"
        subtitle="Digital Compliance"
        description="為重工業打造的高效率數位合規解決方案。透過自動化數據採集與分析，確保您的企業符合全球供應鏈 ESG 標準與碳關稅法規。"
        badgeText="Digital Compliance Platform"
        badgeIcon="verified_user"
        imageUrl="https://images.unsplash.com/photo-1551288049-bbda3865c170?auto=format&fit=crop&q=80&w=2070"
        cta={{ label: "開始試算合規進度", href: "#" }}
      />

      <BentoGrid>
        <BentoCard
          title="碳盤查"
          subtitle="Carbon Accounting"
          description="ISO 14064-1 / ISO 14067 國際標準自動對應"
          icon="co2"
          className="md:col-span-8"
        >
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-stack-md mt-stack-sm">
            {[
              { label: 'Scope 1', value: '1,240', unit: 'tCO2e', width: '45%' },
              { label: 'Scope 2', value: '4,820', unit: 'tCO2e', width: '75%' },
              { label: 'Scope 3', value: '12,650', unit: 'tCO2e', width: '90%' }
            ].map((stat, idx) => (
              <div key={idx} className="p-stack-md bg-surface-container border border-outline-variant">
                <div className="text-secondary text-label-sm font-label-sm mb-1">{stat.label}</div>
                <div className="text-headline-md font-headline-md text-primary">{stat.value}</div>
                <div className="text-label-sm text-on-surface-variant mb-2">{stat.unit}</div>
                <div className="w-full h-1 bg-outline-variant overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: stat.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard
          title="合規狀態"
          icon="fact_check"
          className="md:col-span-4"
          variant="highlight"
        >
          <div className="space-y-stack-sm mt-stack-sm">
            {[
              { name: 'CBAM 申報', status: '已就緒', color: 'bg-esg-emerald' },
              { name: 'SEC 披露', status: '處理中', color: 'bg-secondary' },
              { name: 'CSRD 對齊', status: '待評估', color: 'bg-outline' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white/50 border border-outline-variant">
                <span className="text-body-base font-medium">{item.name}</span>
                <span className={`px-2 py-1 rounded text-[10px] text-white ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>

      <JourneySteps
        title="合規實施路徑"
        subtitle="從基礎盤查到全球披露的完整生命週期"
        steps={[
          { title: '數據採集', description: '整合 ERP 與生產線傳感器數據，建立自動化碳資產底座。' },
          { title: '係數對齊', description: '調用全球領先的排放係數庫（如 Ecoinvent），確保數據科學性。' },
          { title: '第三方驗證', description: '對接 SGS、TÜV 等國際驗證機構，產出符合標準的查驗報告。' },
          { title: '全球披露', description: '一鍵生成符合 CDP、GRI、ISSB 標準的對外公開報告。' }
        ]}
      />

      <section className="p-stack-lg border border-outline-variant bg-surface-container-high relative overflow-hidden">
        <div className="max-w-2xl space-y-stack-md relative z-10">
          <h2 className="text-headline-lg font-headline-lg text-primary">全球供應鏈合規熱點</h2>
          <p className="text-body-base text-on-surface-variant">
            視覺化分析您在全球供應鏈中的法規風險分佈。我們目前監控超過 45 個國家的 ESG 最新法規變動。
          </p>
          <div className="aspect-video w-full bg-surface-container-highest border border-outline-variant relative group cursor-crosshair">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-display-lg text-outline opacity-20 group-hover:scale-110 transition-transform duration-500">public</span>
            </div>
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-primary rounded-full animate-pulse delay-75"></div>
            <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-tertiary rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8">
          <span className="text-[120px] font-bold text-outline opacity-5 select-none">MAP</span>
        </div>
      </section>
    </div>
  );

  // 2. 永續實踐佈局 (Practices)
  const renderPractices = () => (
    <div className="space-y-12">
      <SolutionHero
        title="永續實踐"
        subtitle="Sustainable Practices"
        description="將永續理念轉化為可衡量的工業實踐。我們專注於循環經濟模型建立與智慧綠色建築系統，協助企業實現資源價值的最大化利用。"
        badgeText="Circular Economy Excellence"
        badgeIcon="rebase_edit"
        imageUrl="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070"
        cta={{ label: "預約專家實地評估", href: "#" }}
      />

      <BentoGrid>
        <BentoCard
          title="循環經濟矩陣"
          subtitle="Circular Loop"
          icon="sync_alt"
          className="md:col-span-12 lg:col-span-7"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-sm mt-stack-sm">
            {[
              { icon: 'precision_manufacturing', label: '生產優化' },
              { icon: 'inventory_2', label: '餘熱回收' },
              { icon: 'biotech', label: '資源再生' },
              { icon: 'local_shipping', label: '逆向物流' }
            ].map((item, idx) => (
              <div key={idx} className="p-stack-sm bg-surface-container border border-outline-variant flex flex-col items-center text-center group hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary mb-2">{item.icon}</span>
                <span className="text-label-sm font-label-sm group-hover:text-on-primary">{item.label}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard
          title="智慧能效"
          subtitle="Smart Building"
          icon="hub"
          className="md:col-span-12 lg:col-span-5"
          variant="primary"
        >
          <div className="mt-stack-sm space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-label-sm">當前能耗優化率</span>
              <span className="text-display-sm font-display-sm">35% <span className="text-body-small">YoY</span></span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: '35%' }}></div>
            </div>
            <p className="text-label-sm opacity-80">
              透過 AIOT 傳感器網絡，實時監控並動態調整重型機具的能源負載。
            </p>
          </div>
        </BentoCard>
      </BentoGrid>

      <section className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
        <div className="flex flex-col lg:row-reverse lg:flex-row">
          <div className="flex-1 p-stack-lg space-y-stack-md">
            <span className="text-label-sm text-secondary font-bold uppercase tracking-widest">Featured Case Study</span>
            <h2 className="text-headline-lg font-headline-lg text-primary">鋼渣轉水泥閉環系統</h2>
            <p className="text-body-base text-on-surface-variant leading-relaxed">
              在我們最近與 A 鋼鐵集團的合作中，成功將生產過程中的副產品「鋼渣」轉化為高品質水泥原料。
              這不僅每年減少了 12 萬噸的工業廢棄物，更為企業創造了每年 800 萬美元的額外收益。
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-label-sm font-medium">
                <span className="material-symbols-outlined text-esg-emerald text-sm">check</span> 廢棄物轉向率：98%
              </li>
              <li className="flex items-center gap-2 text-label-sm font-medium">
                <span className="material-symbols-outlined text-esg-emerald text-sm">check</span> 每噸鋼材碳足跡降低：15%
              </li>
            </ul>
          </div>
          <div className="flex-1 min-h-[300px] bg-outline-variant relative">
            <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2069" alt="Case Study" />
          </div>
        </div>
      </section>
    </div>
  );

  // 3. 綠色材料佈局 (Materials)
  const renderMaterials = () => (
    <div className="space-y-12">
      <SolutionHero
        title="綠色材料"
        subtitle="Green Materials"
        description="定義低碳工業的未來。我們提供高性能、低足跡的鋼鐵與石墨材料解決方案，助力企業從源頭降低供應鏈碳強度。"
        badgeText="Sustainable Material Lab"
        badgeIcon="biotech"
        imageUrl="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=2070"
        cta={{ label: "獲取材料技術手冊", href: "#" }}
      />

      <BentoGrid>
        <BentoCard
          title="低碳鋼鐵"
          subtitle="EcoSteel™"
          description="廢鋼比 95% + 氫能冶煉工藝"
          icon="precision_manufacturing"
          className="md:col-span-6"
        >
          <div className="mt-4 p-4 bg-surface-container border-l-4 border-esg-emerald">
            <div className="text-display-sm font-bold text-primary">0.45 <span className="text-body-small">tCO2e/t</span></div>
            <p className="text-label-sm opacity-70">較傳統高爐鋼材減碳 75%</p>
          </div>
        </BentoCard>

        <BentoCard
          title="高性能石墨"
          subtitle="Graphite+"
          description="全自動化低能耗提純技術"
          icon="science"
          className="md:col-span-6"
        >
          <div className="mt-4 p-4 bg-surface-container border-l-4 border-secondary">
            <div className="text-display-sm font-bold text-primary">99.9% <span className="text-body-small">Purity</span></div>
            <p className="text-label-sm opacity-70">適用於長壽命電爐電極</p>
          </div>
        </BentoCard>
      </BentoGrid>

      <section className="py-stack-lg border-t border-outline-variant">
        <h2 className="text-headline-lg font-headline-lg text-primary mb-stack-md">材料足跡分析 <span className="text-secondary text-body-base font-normal">Footprint Analysis</span></h2>
        <div className="overflow-x-auto border border-outline-variant">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-high border-b border-outline-variant">
              <tr>
                <th className="p-4 text-label-sm font-bold">材料種類</th>
                <th className="p-4 text-label-sm font-bold">碳強度 (tCO2e/t)</th>
                <th className="p-4 text-label-sm font-bold">認證標準</th>
                <th className="p-4 text-label-sm font-bold">狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {[
                { name: 'EcoSteel™ Prime', intensity: '0.42', cert: 'EPD / ISO 14025', status: 'In Stock' },
                { name: 'Ultra-Graphite 500', intensity: '2.1', cert: 'LCA Verified', status: 'Pre-order' },
                { name: 'Recycled Aluminum', intensity: '0.8', cert: 'ASI Standard', status: 'Limited' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-medium text-primary">{row.name}</td>
                  <td className="p-4 font-mono">{row.intensity}</td>
                  <td className="p-4 text-on-surface-variant">{row.cert}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-outline-variant text-[10px] rounded">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  // 4. 轉型顧問佈局 (Finance)
  const renderFinance = () => (
    <div className="space-y-12">
      <SolutionHero
        title="轉型顧問"
        subtitle="Strategy & Finance"
        description="連接永續戰略與金融價值。我們協助企業提升 ESG 評級，並對接全球綠色金融資源，加速低碳轉型進程。"
        badgeText="Strategic Advisory"
        badgeIcon="trending_up"
        imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2026"
        cta={{ label: "開展 ESG 評級診斷", href: "#" }}
      />

      <BentoGrid>
        <BentoCard
          title="ESG 評級優化"
          subtitle="Rating Boost"
          icon="analytics"
          className="md:col-span-6"
        >
          <ul className="mt-4 space-y-2">
            <li className="flex justify-between items-center text-label-sm">
              <span>MSCI ESG Rating</span>
              <span className="font-bold text-esg-emerald text-headline-sm">AA</span>
            </li>
            <li className="flex justify-between items-center text-label-sm">
              <span>S&P Global CSA</span>
              <span className="font-bold text-secondary text-headline-sm">78</span>
            </li>
          </ul>
        </BentoCard>

        <BentoCard
          title="綠色金融對接"
          subtitle="Green Finance"
          icon="payments"
          className="md:col-span-6"
          variant="highlight"
        >
          <p className="mt-2 text-label-sm opacity-90 leading-relaxed">
            協助企業申請綠色貸款、發行綠色債券，並提供歐盟永續分類法 (EU Taxonomy) 的對齊諮詢。
          </p>
        </BentoCard>
      </BentoGrid>

      <JourneySteps
        title="四階段轉型藍圖"
        subtitle="從現狀評估到價值實現的標準化流程"
        steps={[
          { title: '基線評估', description: '全面盤點當前 ESG 表現與風險缺口。' },
          { title: '戰略制定', description: '確立 2030/2050 減碳目標與實施路徑。' },
          { title: '管理執行', description: '建立組織內部 ESG 治理委員會與考核機制。' },
          { title: '價值傳遞', description: '產出高品質披露報告，並對接資本市場。' }
        ]}
      />
    </div>
  );

  // --------------------------------------------------------------------------
  // DYNAMIC RENDERING (From Sanity Data)
  // --------------------------------------------------------------------------

  const renderDynamic = (data) => (
    <div className="space-y-12">
      <SolutionHero
        title={data.title}
        subtitle={data.titleEnglish}
        description={data.description}
        badgeText={data.badgeText}
        badgeIcon={data.badgeIcon}
        imageUrl={data.imageUrl}
        cta={data.cta}
      />

      {data.bentoSection && data.bentoSection.blocks && (
        <BentoGrid title={data.bentoSection.title}>
          {data.bentoSection.blocks.map((block, idx) => (
            <BentoCard
              key={idx}
              title={block.title}
              subtitle={block.subtitle}
              description={block.description}
              icon={block.icon}
              className={block.size ? `md:col-span-${block.size}` : 'md:col-span-4'}
            >
              {block.stats && (
                <div className="flex-1 grid grid-cols-1 gap-stack-md mt-stack-sm">
                  {block.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="p-stack-md bg-surface-container border border-outline-variant">
                      <div className="text-secondary text-label-sm font-label-sm mb-1">{stat.label}</div>
                      <div className="text-headline-md font-headline-md text-primary">{stat.value} {stat.unit}</div>
                      {stat.width && (
                        <div className="w-full h-1 bg-outline-variant overflow-hidden mt-2">
                          <div className="h-full bg-primary" style={{ width: stat.width }}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </BentoCard>
          ))}
        </BentoGrid>
      )}

      {data.journeySection && data.journeySection.steps && (
        <JourneySteps
          title={data.journeySection.title}
          subtitle={data.journeySection.subtitle}
          steps={data.journeySection.steps}
        />
      )}

      {data.caseStudySection && data.caseStudySection.map((item, idx) => (
        <section key={idx} className="bg-surface-container-lowest border border-outline-variant overflow-hidden group">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-stack-lg space-y-stack-md">
              <span className="text-label-sm text-secondary font-bold uppercase tracking-widest">Case Study</span>
              <h2 className="text-headline-lg font-headline-lg text-primary group-hover:text-secondary transition-colors">{item.title}</h2>
              <p className="text-body-base text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
              {item.tags && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 bg-surface-container-high border border-outline-variant text-[10px] rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 min-h-[350px] bg-surface-container-highest relative overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-outline opacity-20">
                  <span className="material-symbols-outlined text-display-lg">image</span>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );

  const getLayout = () => {
    // 檢查是否有動態數據，且動態數據中至少包含一個核心區塊
    const hasDynamicContent = solution && (solution.bentoSection || solution.journeySection || solution.caseStudySection);

    // 如果有動態內容，則使用動態渲染
    if (hasDynamicContent) return renderDynamic(solution);

    // 否則回退到 Hardcoded 的專業佈局
    switch (slug) {
      case 'compliance': return renderCompliance();
      case 'practices': return renderPractices();
      case 'materials': return renderMaterials();
      case 'finance': return renderFinance();
      default:
        // 如果連 Hardcoded 都沒有，且有基本的 solution 數據，至少渲染基本訊息
        if (solution) return renderDynamic(solution);

        return (
          <div className="py-32 text-center">
            <h2 className="text-display-sm text-outline mb-4">方案內容建設中</h2>
            <p className="text-body-base text-on-surface-variant mb-8">正在為您準備最精確的 ESG 解決方案資料...</p>
            <Link href="/solutions" className="text-primary hover:underline">返回解決方案總覽</Link>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24 bg-surface text-on-surface overflow-x-hidden">
        <div className="max-w-container-max mx-auto px-margin">
          {getLayout()}
        </div>
      </main>

      <footer className="w-full py-stack-lg bg-surface-container-highest border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-body-base font-bold text-on-surface">esg.team Solutions</div>
          <div className="flex gap-6">
            <Link href="/solutions" className="text-label-sm text-on-surface-variant hover:text-primary transition-colors">方案總覽</Link>
            <Link href="/" className="text-label-sm text-on-surface-variant hover:text-primary transition-colors">返回首頁</Link>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant opacity-60">© 2024 ESG.TEAM Matrix. Powered by Digital Compliance Hub.</div>
        </div>
      </footer>
    </>
  );
}
