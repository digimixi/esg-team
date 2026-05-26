import { client } from '@/sanity/lib/client';
import CbamCalculator from '@/components/CbamCalculator';
import Scope3TrustLedger from '@/components/Scope3TrustLedger';
import HubHeader from '@/components/HubHeader';
import StickyJumpNav from '@/components/StickyJumpNav';

export const revalidate = 86400;

export default async function SupplyChain({ params }) {
  const { hubSlug } = await params;

  // Get the hub document for dynamic title/nav
  const hub = await client.fetch('*[_type == "hub" && slug.current == $slug][0]', { slug: hubSlug });

  if (!hub || hub.isActive === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center p-stack-lg max-w-md">
          <span className="material-symbols-outlined text-outline text-6xl mb-4">construction</span>
          <h1 className="font-display-md text-display-md text-primary mb-2">專題建置中</h1>
          <p className="text-on-surface-variant mb-stack-lg">此產業專題目前尚未開放或已暫時關閉，請稍後再試。</p>
          <a href="/" className="bg-primary text-on-primary px-6 py-2 rounded font-label-sm">返回首頁</a>
        </div>
      </div>
    );
  }

  // Get partners for this hub
  const partners = await client.fetch(`*[_type == "partner" && hub->slug.current == $slug] {
    _id,
    name,
    category,
    rating,
    reviewCount,
    description,
    "imageUrl": image.asset->url,
    isTopRated
  } | order(isTopRated desc, rating desc)`, { slug: hubSlug });

  // Get dynamic EU ETS carbon price from indices
  const indices = await client.fetch('*[_type == "marketIndex"] | order(order asc)') || [];
  const euEtsIndex = indices.find(idx => idx.name?.includes('EU') || idx.name?.includes('歐盟') || idx.name?.includes('ETS') || idx.name?.includes('Carbon') || idx.name?.includes('碳價'));
  const liveEtsPrice = euEtsIndex ? parseFloat(euEtsIndex.value) || 85 : 85;

  // Map category values to display titles
  const categoryMap = {
    logistics: '物流 Logistics',
    inspection: '檢驗 Inspection',
    manufacturing: '製造 Manufacturing'
  };

  // Determine contextual defaults for tools based on the current hub
  let defaultFactorId = 'ef-steel-traditional'; // Fallback
  if (hubSlug === 'graphite' || hubSlug === 'graphite-electrode') {
    defaultFactorId = 'ef-graphite-electrode';
  } else if (hubSlug === 'aluminum') {
    defaultFactorId = 'ef-aluminum-imported';
  } else if (hubSlug === 'cement') {
    defaultFactorId = 'ef-cement-portland';
  }

  return (
    <>
      <HubHeader 
        hubSlug={hubSlug} 
        title={hub?.title} 
        contactUrl={hub?.contactUrl} 
        activeTab="supply-chain" 
      />

      {/* Sticky Secondary Navigation */}
      <StickyJumpNav links={[
        { label: '解決方案', href: `/hubs/${hubSlug}#solutions`, isPrimary: true },
        { label: '碳排試算器', href: '#cbam-calculator' },
        { label: '碳信任帳本', href: '#trust-ledger' },
        { label: '服務模組', href: '#service-modules' },
        { label: '認證夥伴', href: '#partners' }
      ]} />


      <main className="pt-[104px] lg:pt-16 pb-stack-lg">
        <div className="max-w-container-max mx-auto px-margin">
          
          {/* Hero / Value Proposition */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg mb-20 items-center">
            <div className="space-y-stack-md">
              <span className="text-label-sm font-label-sm text-secondary bg-secondary-container px-3 py-1 rounded-full uppercase tracking-wider">Industrial Network</span>
              <h1 className="text-display-lg font-display-lg text-primary">
                全球供應鏈韌性與夥伴生態系 <br/>
                <span className="text-headline-md block mt-2 opacity-80">Global Supply Chain Resilience &amp; Partner Ecosystem</span>
              </h1>
              <p className="text-body-base font-body-base text-on-surface-variant max-w-xl">
                  Streamline your procurement through our integrated supplier portal. We aggregate world-class logistics, quality inspection, and manufacturing resources into a single, high-efficiency interface designed for the steel industry's rigorous demands.
              </p>
              <div className="flex gap-stack-md pt-stack-sm">
                <div className="flex items-center gap-stack-sm">
                  <span className="material-symbols-outlined text-on-tertiary-container">verified</span>
                  <span className="text-label-sm font-label-sm">Verified Partners</span>
                </div>
                <div className="flex items-center gap-stack-sm">
                  <span className="material-symbols-outlined text-on-tertiary-container">speed</span>
                  <span className="text-label-sm font-label-sm">Real-time Settlement</span>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-sm border border-outline-variant">
              <img className="object-cover w-full h-full" alt="Logistics Hub" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHBt0ug7GxQfyuSRsQP4E-D6lFeKg7kPjqxyZ316x0lEp6_txjiyhrcQ7ij9h2X_tV4f0LOBz-TzLw5ysANPv7YOZdSbhQoEVTS7hS7debreGsj7xaKd5DK1eZY6tp7k1h-5vP2YeoAXZRldWESwuZEYRfwxzapfrDq85iTHZoj1XX4GxZgtJmlJD8bufm0EocD1xf593lO5VIWheK-Pb-3xtcOEopgIkW9urT3Ry4FX3MDmAJ4JXKbJYHS0zFQyK91SFhU2aTp8aI"/>
            </div>
          </section>

          {/* CBAM Simulator Section */}
          <section id="cbam-calculator" className="mb-20 scroll-mt-32">
            <CbamCalculator initialEtsPrice={liveEtsPrice} defaultFactorId={defaultFactorId} />
          </section>

          {/* Scope 3 Carbon Trust Ledger Section */}
          <section id="trust-ledger" className="mb-20 scroll-mt-32">
            <Scope3TrustLedger />
          </section>

          {/* Service Modules */}
          <section id="service-modules" className="mb-20 scroll-mt-32">
            <div className="flex justify-between items-end mb-stack-lg">
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">整合式服務模組 Integrated Service Modules</h2>
                <p className="text-label-sm font-label-sm text-on-surface-variant">為您供應鏈的每個階段提供可擴展的工具 Scalable tools for every stage of your supply chain.</p>
              </div>
              <button className="text-label-sm font-label-sm text-on-tertiary-container flex items-center hover:underline">
                  View All Modules <span className="material-symbols-outlined ml-1">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                </div>
                <h3 className="font-headline-md text-body-base font-bold mb-2">物流追蹤 Logistics Tracking</h3>
                <p className="text-on-surface-variant font-body-base text-label-sm leading-relaxed mb-4">針對國際鋼鐵運輸的即時 GPS 與艙單追蹤，與全球港務局整合。Real-time GPS and manifest tracking for international steel shipments.</p>
                <div className="flex items-center text-primary font-label-sm cursor-pointer hover:gap-2 transition-all">
                    Access Dashboard <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                </div>
              </div>
              
              <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-primary text-2xl">fact_check</span>
                </div>
                <h3 className="font-headline-md text-body-base font-bold mb-2">品質認證 Quality Certification</h3>
                <p className="text-on-surface-variant font-body-base text-label-sm leading-relaxed mb-4">自動化驗證 ASTM 與 ISO 標準，並提供用於審計的安全數位文件存儲。Automated verification of ASTM and ISO standards.</p>
                <div className="flex items-center text-primary font-label-sm cursor-pointer hover:gap-2 transition-all">
                    Review Standards <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
                </div>
                <h3 className="font-headline-md text-body-base font-bold mb-2">金融結算 Financial Settlement</h3>
                <p className="text-on-surface-variant font-body-base text-label-sm leading-relaxed mb-4">安全的多幣種支付網關，在驗證交付里程碑後自動釋放代管款項。Secure multi-currency payment gateway.</p>
                <div className="flex items-center text-primary font-label-sm cursor-pointer hover:gap-2 transition-all">
                    Manage Ledger <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                </div>
              </div>
            </div>
          </section>

          {/* Supplier Onboarding Form Preview */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-stack-lg mb-20">
            <div className="lg:col-span-2 space-y-stack-md">
              <h2 className="text-headline-md font-headline-md text-primary">與 SteelStream 合作 Partner with SteelStream</h2>
              <p className="text-body-base font-body-base text-on-surface-variant">
                  Our onboarding process is designed to be rigorous yet efficient. Join our network of certified industrial partners and gain access to a global client base of procurement professionals.
              </p>
              <div className="space-y-stack-sm pt-stack-md">
                <div className="flex items-center gap-stack-md">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-sm font-bold">1</span>
                  <span className="text-body-base font-medium">身分驗證 Identity Verification</span>
                </div>
                <div className="flex items-center gap-stack-md opacity-50">
                  <span className="w-8 h-8 rounded-full border-2 border-outline flex items-center justify-center text-label-sm font-bold">2</span>
                  <span className="text-body-base">合規審計 Compliance Audit</span>
                </div>
                <div className="flex items-center gap-stack-md opacity-50">
                  <span className="w-8 h-8 rounded-full border-2 border-outline flex items-center justify-center text-label-sm font-bold">3</span>
                  <span className="text-body-base">合約執行 Contract Execution</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm">
              <div className="mb-stack-lg border-b border-outline-variant pb-stack-md">
                <h3 className="text-headline-md font-headline-md text-primary">新供應商申請 New Supplier Application</h3>
                <p className="text-label-sm font-label-sm text-secondary">第一步：企業概況資訊 Step 1: Business Profile Information</p>
              </div>
              <form className="space-y-stack-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <div className="space-y-1">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">公司法律名稱 Company Legal Name</label>
                    <input className="w-full bg-surface border border-outline-variant rounded-lg p-stack-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" placeholder="e.g. Ironclad Forge Ltd." type="text"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">註冊編號 Registration Number (EIN/VAT)</label>
                    <input className="w-full bg-surface border border-outline-variant rounded-lg p-stack-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" placeholder="XX-XXXXXXX" type="text"/>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">主要行業垂直領域 Primary Industry Vertical</label>
                  <select className="w-full bg-surface border border-outline-variant rounded-lg p-stack-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none">
                    <option>Manufacturing &amp; Fabrication</option>
                    <option>Raw Material Extraction</option>
                    <option>Third-Party Logistics (3PL)</option>
                    <option>Quality Assurance &amp; Inspection</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">總部地點 Headquarters Location</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-lg p-stack-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" placeholder="City, Country" type="text"/>
                </div>
                <div className="pt-stack-md flex justify-end gap-stack-md">
                  <button className="px-gutter py-stack-sm border border-outline-variant text-secondary font-label-sm rounded-lg hover:bg-surface-container-low transition-colors" type="button">儲存草稿 Save Draft</button>
                  <button className="px-gutter py-stack-sm bg-primary text-on-primary font-label-sm rounded-lg hover:opacity-90 transition-opacity" type="button">繼續合規程序 Continue to Compliance <span className="material-symbols-outlined text-sm align-middle ml-1">arrow_forward</span></button>
                </div>
              </form>
            </div>
          </section>

          {/* Partner Directory */}
          <section id="partners" className="mb-stack-lg scroll-mt-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md mb-stack-lg">
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">已認證夥伴目錄 Verified Partner Directory</h2>
                <p className="text-label-sm font-label-sm text-on-surface-variant">與我們生態系中經過審核的服務提供商聯繫。Connect with audited service providers.</p>
              </div>
              <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant">
                <button className="px-gutter py-1 bg-surface-container-lowest shadow-sm rounded-lg text-label-sm font-bold text-primary">全部夥伴 All Partners</button>
                <button className="px-gutter py-1 text-label-sm text-secondary hover:text-primary transition-colors">物流 Logistics</button>
                <button className="px-gutter py-1 text-label-sm text-secondary hover:text-primary transition-colors">檢驗 Inspection</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {partners.map((partner) => (
                <div key={partner._id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:border-secondary transition-all group">
                  <div className="h-32 bg-surface-container-high relative overflow-hidden">
                    <img className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" alt={partner.name} src={partner.imageUrl || 'https://images.unsplash.com/photo-1565893306013-1082c976935d?q=80&w=2000&auto=format&fit=crop'}/>
                    {partner.isTopRated && (
                      <span className="absolute top-2 right-2 bg-on-tertiary-container text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">TOP RATED</span>
                    )}
                  </div>
                  <div className="p-stack-md">
                    <div className="text-[10px] text-secondary font-bold uppercase mb-1">{categoryMap[partner.category] || partner.category}</div>
                    <h4 className="font-bold text-body-base text-primary truncate">{partner.name}</h4>
                    <p className="text-label-sm text-on-surface-variant mb-stack-sm line-clamp-2 h-10">
                      {partner.description || '與我們生態系中經過審核的服務提供商聯繫。'}
                    </p>
                    <div className="flex items-center gap-1 mb-stack-md">
                      <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                      <span className="text-label-sm font-bold">{partner.rating || 'N/A'}</span>
                      <span className="text-label-sm text-outline">({partner.reviewCount || '0'} reviews)</span>
                    </div>
                    <button className="w-full py-stack-sm border border-outline-variant rounded-lg text-label-sm font-bold hover:bg-primary hover:text-on-primary transition-all">查看檔案 View Profile</button>
                  </div>
                </div>
              ))}
              
              {partners.length === 0 && (
                <div className="col-span-full py-20 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-outline text-4xl mb-4">group_off</span>
                  <p className="text-on-surface-variant">此專區尚無認證合作夥伴資料</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-stack-lg border-t border-outline-variant bg-surface-container-highest">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-container-max mx-auto space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-body-base font-bold text-on-surface">SteelStream Industrial Logistics</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">© 2024 SteelStream Industrial Logistics. All rights reserved.</span>
          </div>
          <nav className="flex gap-stack-lg">
            <a className="text-on-surface-variant hover:text-primary hover:underline transition-all font-label-sm text-label-sm" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-primary hover:underline transition-all font-label-sm text-label-sm" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-primary hover:underline transition-all font-label-sm text-label-sm" href="#">Compliance</a>
            <a className="text-on-surface-variant hover:text-primary hover:underline transition-all font-label-sm text-label-sm" href="#">Investor Relations</a>
            <a className="text-on-surface-variant hover:text-primary hover:underline transition-all font-label-sm text-label-sm" href="#">Global Support</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
