import { client } from '@/sanity/lib/client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import SolutionHero from '@/components/solutions/SolutionHero';

export const revalidate = 86400;

export default async function SolutionsHub() {
  const solutions = await client.fetch(`*[_type == "solution"] | order(_createdAt asc) {
    _id,
    title,
    titleEnglish,
    "slug": slug.current,
    category,
    description,
    badgeIcon,
    "imageUrl": heroImage.asset->url
  }`);

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#F8F9FA]">
        <SolutionHero 
          title="解決方案導航"
          subtitle="Solutions Hub"
          description="esg.team 協助企業與供應鏈應對全球永續轉型挑戰，提供從合規、實踐到材料與金融的全方位支持。"
          badgeText="Our Solutions"
          imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          isFullWidth={true}
        />

        {/* Google Stitch Style Cards */}
        <section className="py-24">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(solutions.length > 0 ? solutions : [
                { _id: 'default-1', title: '數位合規', titleEnglish: 'Digital Compliance', slug: 'compliance', badgeIcon: 'verified', description: '為重工業打造的高效率數位合規解決方案。透過自動化數據採集與分析，確保您的企業符合全球供應鏈 ESG 標準與碳關稅法規。' },
                { _id: 'default-2', title: '永續實踐', titleEnglish: 'Sustainable Practices', slug: 'practices', badgeIcon: 'rebase_edit', description: '將永續理念轉化為可衡量的工業實踐。我們專注於循環經濟模型建立與智慧綠色建築系統。' },
                { _id: 'default-3', title: '綠色材料', titleEnglish: 'Green Materials', slug: 'materials', badgeIcon: 'biotech', description: '定義低碳工業的未來。我們提供高性能、低足跡的鋼鐵與石墨材料解決方案。' },
                { _id: 'default-4', title: '戰略金融', titleEnglish: 'Strategy & Finance', slug: 'finance', badgeIcon: 'trending_up', description: '連接永續戰略與金融價值。協助企業提升 ESG 評級，並對接全球綠色金融資源。' }
              ]).map((item) => {
                return (
                  <div 
                    key={item._id}
                    className="bg-white border border-[#E0E0E0] rounded-lg p-8 flex flex-col h-full hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="mb-6">
                      <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                        {item.badgeIcon || 'verified'}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-[#1A1C1E] mb-1">{item.title}</h2>
                    <p className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider mb-6">{item.titleEnglish || item.category}</p>
                    
                    <p className="text-[#44474E] text-sm leading-relaxed mb-12 flex-grow">
                      {item.description}
                    </p>
                    
                    <Link 
                      href={`/solutions/${item.slug}`}
                      className="mt-auto border border-[#1A1C1E] text-[#1A1C1E] px-4 py-2.5 rounded text-[13px] font-bold flex justify-between items-center group-hover:bg-[#1A1C1E] group-hover:text-white transition-all"
                    >
                      <span>了解更多 <span className="font-normal opacity-70 ml-1 italic">Learn More</span></span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-32 bg-primary-container text-on-primary-fixed">
          <div className="max-w-container-max mx-auto px-margin flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="font-display-sm text-display-sm mb-4">需要量身定制的方案？</h2>
              <p className="font-body-base text-on-primary-container opacity-80">我們的專業顧問團隊具備跨行業減碳經驗，能針對您的特定工藝流程提供一對一的諮詢服務。</p>
            </div>
            <button className="bg-primary-fixed text-on-primary-fixed px-12 py-5 rounded-full font-label-sm text-label-sm hover:bg-white transition-all shadow-xl">
              預約專家諮詢 <span className="material-symbols-outlined ml-2 text-sm">support_agent</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="w-full py-stack-lg bg-surface-container-highest border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-body-base font-bold text-on-surface">esg.team Solutions</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">© 2024 ESG.TEAM Matrix. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
