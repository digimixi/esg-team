import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import MarketIndexBar from '@/components/MarketIndexBar';
import AIInsightBox from '@/components/AIInsightBox';
import HubHeader from '@/components/HubHeader';
import StickyJumpNav from '@/components/StickyJumpNav';
import SolutionHero from '@/components/solutions/SolutionHero';
import InsightCard from '@/components/InsightCard';
import ValueChainMap from '@/components/solutions/ValueChainMap';
import ProspectMap from '@/components/solutions/ProspectMap';
import LeadCaptureForm from '@/components/solutions/LeadCaptureForm';

export const revalidate = 86400;

// 自定義 PortableText 渲染樣式
const ptComponents = {
  block: {
    h3: ({children}) => <h3 className="text-primary font-bold text-base mt-4 mb-1">{children}</h3>,
    h4: ({children}) => <h4 className="text-primary font-bold text-sm mt-3 mb-1">{children}</h4>,
    normal: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
  },
  marks: {
    strong: ({children}) => <strong className="font-bold text-primary">{children}</strong>,
  },
};

export async function generateMetadata({ params }) {
  const { hubSlug } = await params;
  const hub = await client.fetch(`*[_type == "hub" && slug.current == $slug][0] {
    title,
    heroDescription,
    description,
    heroImage
  }`, { slug: hubSlug });

  if (!hub) return { title: 'ESG Intelligence Hub' };

  const title = hub.title;
  const description = hub.heroDescription || hub.description || `深入分析 ${hub.title} 的全球動向、ESG 轉型趨勢與供應鏈情報。`;
  const ogImage = hub.heroImage ? urlFor(hub.heroImage).width(1200).height(630).fit('crop').url() : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function HubHome({ params }) {
  const { hubSlug } = await params;

  // Get the hub document
  const hub = await client.fetch(`*[_type == "hub" && slug.current == $slug][0] {
    ...,
    "heroImageUrl": heroImage.asset->url,
    "featureImageUrl": featureImage.asset->url,
    features,
    specGroups,
    "aiInsight": aiInsight {
      isActive,
      trendLabel,
      insightText,
      confidenceScore,
      analysisDate
    },
    valueChainMap,
    "materialFocus": materialFocus[] {
      ...,
      "imageUrl": image.asset->url
    }
  }`, { slug: hubSlug }, { useCdn: false });
  
  if (!hub) {
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
  
  const indices = await client.fetch('*[_type == "marketIndex"] | order(order asc)', {}, { useCdn: false });
  const products = await client.fetch('*[_type == "product" && hub->slug.current == $slug] | order(_createdAt desc)', { slug: hubSlug }, { useCdn: false });
  
  const keywordsArray = hub.searchKeywords 
    ? hub.searchKeywords.split(',').map(k => `*${k.trim()}*`).filter(k => k !== '**') 
    : [];

  const keywordConditions = keywordsArray.length > 0 
    ? `|| (${keywordsArray.map(k => `title match "${k}" || summary match "${k}" || excerpt match "${k}"`).join(' || ')})`
    : '';
  
  const insights = await client.fetch(`
    *[_type == "insight" && isActive == true && (
      references($hubId) 
      ${keywordConditions}
    )] | order(publishedAt desc)[0...12] {
      _id,
      title,
      summary,
      category,
      isFeatured,
      authorName,
      publishedAt,
      source,
      externalUrl,
      standards,
      "sourceRef": sourceRef->{ title, url }
    }
  `, { 
    hubId: hub._id 
  }, { useCdn: false });

  const actualHubId = hub._id.replace(/^drafts\./, '');

  const eduPages = await client.fetch(`*[_type == "eduPage" && (
    $hubId in relatedHubs[]._ref || 
    hub._ref == $hubId
  )] {
    _id,
    title,
    "slug": slug.current
  }`, { hubId: actualHubId }, { useCdn: false });

  const techObservations = await client.fetch(`*[_type == "techObservation" && (
    $hubId in relatedHubs[]._ref
  )] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    "imageUrl": heroImage.asset->url
  }`, { hubId: actualHubId }, { useCdn: false });

  const benchmarks = await client.fetch(`*[_type == "industryBenchmark" && (
    hub._ref == $hubId || category == "intensity"
  )] | order(currentValue asc)`, { hubId: actualHubId }, { useCdn: false });

  return (
    <>
      <HubHeader 
        hubSlug={hubSlug} 
        title={hub.title} 
        contactUrl={hub.contactUrl} 
        activeTab="home" 
      />

      {/* Sticky Secondary Navigation */}
      {/* Sticky Secondary Navigation */}
      <StickyJumpNav links={[
        { label: '解決方案', href: '#solutions', isPrimary: true },
        { label: '市場實時指數', href: '#market-index' },
        { label: '技術觀察', href: '#observations' },
        { label: '解碼核心資產', href: '#education' },
        { label: '資源目錄', href: '#products' },
        { label: '供應鏈情報', href: '#intelligence' }
      ]} />

      <main>
        <SolutionHero 
          title={hub.title}
          subtitle={hub.heroSubtitle}
          description={hub.heroDescription}
          imageUrl={hub.heroImageUrl}
          features={hub.features?.map(f => f.title) || ['批次追溯', '品質檢驗', '樣品測試', '碳資料準備']}
          jumpLinks={[
            { label: '申請增碳劑樣品', href: '#onboard-form' },
            { label: '索取產品資料', href: '#onboard-form' },
            { label: '預約供應鏈評估', href: '#onboard-form' }
          ]}
          isFullWidth={true}
        />

        {/* --- 新增 B2B 深度文案模組 --- */}
        
        {/* 顧問專屬開發地圖 */}
        {hub.prospectMap?.isActive && (
          <ProspectMap data={hub.prospectMap} />
        )}

        {/* Trust Section */}
        {hub.trustSection?.isActive && (
          <section className="py-stack-lg px-margin max-w-container-max mx-auto border-b border-outline-variant">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-headline-md text-headline-md text-primary mb-4">{hub.trustSection.title}</h2>
              {hub.trustSection.description && <p className="text-on-surface-variant text-body-base whitespace-pre-line">{hub.trustSection.description}</p>}
            </div>
            {hub.trustSection.points && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hub.trustSection.points.map((pt, i) => (
                  <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:border-primary/30 transition-colors">
                    <span className="material-symbols-outlined text-esg-emerald text-3xl mb-3">verified_user</span>
                    <h3 className="font-bold text-primary text-lg mb-2">{pt.title}</h3>
                    <p className="text-on-surface-variant text-sm whitespace-pre-line">{pt.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Detailed Features & Specs Section (Moved up) */}
        {(hub.features?.length > 0 || hub.specGroups?.length > 0) && (
          <section id="solutions" className="py-stack-lg px-margin max-w-container-max mx-auto scroll-mt-24">
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg text-center">核心特點與技術規格</h2>
            
            {/* Features */}
            {hub.features && hub.features.length > 0 && (
              <div className="flex flex-col gap-12 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {hub.features.map((feat) => (
                    <div key={feat._key} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                      <span className="material-symbols-outlined text-4xl text-primary mb-4">{feat.icon || 'star'}</span>
                      <h3 className="font-bold text-lg text-primary mb-3">{feat.title}</h3>
                      <div className="text-on-surface-variant text-sm">
                        <PortableText value={feat.description} components={ptComponents} />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Feature Image */}
                {hub.featureImageUrl && (
                  <div className="w-full rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant relative group">
                    <img 
                      src={hub.featureImageUrl} 
                      alt="Feature illustration" 
                      className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" 
                    />
                  </div>
                )}
              </div>
            )}

            {/* Spec Groups */}
            {hub.specGroups && hub.specGroups.length > 0 && (
              <div className="space-y-8">
                {hub.specGroups.map((group) => (
                  <div key={group._key} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-surface-container-low p-6 border-b border-outline-variant flex items-center gap-4">
                      {group.icon && <span className="material-symbols-outlined text-secondary text-2xl">{group.icon}</span>}
                      <div>
                        <h4 className="font-bold text-lg text-primary">{group.title}</h4>
                        {group.description && <p className="text-sm text-on-surface-variant mt-1">{group.description}</p>}
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {group.specs?.map((spec) => (
                          <div key={spec._key} className="flex flex-col border-l-2 border-primary/20 pl-4">
                            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">{spec.label}</span>
                            <span className="font-data-mono font-bold text-primary text-base">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Material Focus Sections */}
        {hub.materialFocus && hub.materialFocus.length > 0 && (
          <section className="py-stack-lg px-margin max-w-container-max mx-auto">
            <div className="space-y-16">
              {hub.materialFocus.map((mat, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-12 items-start ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold tracking-widest uppercase rounded-full mb-4">
                      {mat.materialName}
                    </span>
                    <h2 className="font-headline-md text-3xl text-primary mb-4 leading-tight">{mat.title}</h2>
                    {mat.description && <p className="text-on-surface-variant mb-8 leading-relaxed whitespace-pre-line">{mat.description}</p>}
                    
                    {mat.bullets && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        {mat.bullets.map((group, j) => (
                          <div key={j}>
                            <h4 className="font-bold text-primary text-sm mb-3 border-b border-outline-variant pb-2">{group.groupTitle}</h4>
                            <ul className="space-y-2">
                              {group.items?.map((item, k) => (
                                <li key={k} className="flex items-start gap-2 text-sm text-on-surface-variant">
                                  <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {mat.ctaText && (
                      <a href="#onboard-form" className="inline-flex items-center justify-center bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg">
                        {mat.ctaText}
                      </a>
                    )}
                  </div>
                  {/* Decorative placeholder or actual image */}
                  <div className="flex-1 w-full bg-surface-container-high rounded-3xl min-h-[400px] border border-outline-variant flex items-center justify-center relative overflow-hidden shadow-inner group">
                     {mat.imageUrl ? (
                       <img src={mat.imageUrl} alt={mat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     ) : (
                       <>
                         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                         <span className="material-symbols-outlined text-8xl text-outline-variant opacity-50 group-hover:scale-110 transition-transform duration-500">category</span>
                       </>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ESG Support */}
        {hub.esgSupport?.isActive && (
          <section className="bg-surface-container-lowest py-stack-lg border-y border-outline-variant">
            <div className="max-w-container-max mx-auto px-margin">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <h2 className="font-headline-md text-3xl text-primary mb-4">{hub.esgSupport.title}</h2>
                  {hub.esgSupport.description && <p className="text-on-surface-variant mb-8 whitespace-pre-line">{hub.esgSupport.description}</p>}
                  
                  {hub.esgSupport.capabilities && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {hub.esgSupport.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-outline-variant shadow-sm">
                          <span className="material-symbols-outlined text-esg-emerald">eco</span>
                          <span className="text-sm font-bold text-primary">{cap}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {hub.esgSupport.footerText && <p className="text-sm text-secondary italic border-l-4 border-secondary pl-4 whitespace-pre-line">{hub.esgSupport.footerText}</p>}
                </div>
                <div className="w-full md:w-1/3 bg-primary text-on-primary p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                   <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                   <h3 className="text-xl font-bold mb-4 relative z-10">對應出口供應鏈要求</h3>
                   <p className="text-sm text-white/80 mb-6 relative z-10">提前建立可追溯、可計算、可查證的資料機制，降低未來補件壓力。</p>
                   <span className="material-symbols-outlined text-6xl text-white/20 absolute bottom-4 right-4">public</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Process Steps */}
        {hub.processSteps?.isActive && (
          <section className="py-stack-lg px-margin max-w-container-max mx-auto">
            <h2 className="font-headline-md text-headline-md text-primary mb-12 text-center">{hub.processSteps.title}</h2>
            {hub.processSteps.steps && (
              <div className="relative">
                {/* Connecting Line for md+ */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-outline-variant -translate-x-1/2 z-0"></div>
                
                <div className="space-y-8 relative z-10">
                  {hub.processSteps.steps.map((step, i) => (
                    <div key={i} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className={`flex-1 w-full p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <h4 className="font-bold text-primary text-lg mb-2">{step.title}</h4>
                        <p className="text-sm text-on-surface-variant whitespace-pre-line">{step.description}</p>
                      </div>
                      <div className="w-12 h-12 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg border-4 border-surface relative z-10">
                        {i + 1}
                      </div>
                      <div className="flex-1 hidden md:block"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* --- 結束 B2B 深度文案模組 --- */}

        {/* 顧問專用產業地圖 (依據後台設定動態渲染) */}
        {hub.valueChainMap?.isActive && (
          <ValueChainMap data={hub.valueChainMap} />
        )}

        <div id="market-index">
          <MarketIndexBar indices={indices} lastUpdated={indices[0]?.lastSync} />
          <div className="max-w-container-max mx-auto px-margin mt-2 mb-6 text-center">
            <p className="text-[11px] text-on-surface-variant italic">
              * 市場價格僅供趨勢參考，實際採購條件仍需依規格、數量、交期、檢驗文件與供應條件確認。
            </p>
          </div>
        </div>

        {/* Global Benchmarks (Simplified for Hub) */}
        <section className="bg-surface-container-low py-4 border-b border-outline-variant overflow-hidden">
          <div className="max-w-container-max mx-auto px-4 sm:px-margin flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 w-full xl:min-w-[300px]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">fact_check</span>
                <span className="font-bold text-primary text-[13px]">全球碳基準 (gCO2e/kWh)</span>
              </div>
              <p className="text-[10px] text-on-surface-variant max-w-xs leading-relaxed">
                不同地區電力碳排係數會影響材料製造階段的碳足跡。SteelStream 可依需求協助整理能源用量與產品碳資料，支援後續 ESG 查核。
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 xl:flex xl:flex-nowrap items-end justify-items-start xl:justify-end gap-x-6 gap-y-4 w-full xl:w-auto">
              {benchmarks.slice(0, 5).map((item) => (
                <div key={item._id} className="w-full sm:w-[100px] flex flex-col gap-1 shrink-0">
                  <div className="flex justify-between items-end px-0.5">
                    <span className="text-[9px] font-bold text-primary opacity-70 uppercase">{item.title.split(' ')[0]}</span>
                    <span className="font-data-mono text-[10px] font-bold text-secondary">{item.currentValue}</span>
                  </div>
                  <div className="h-[2px] w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-esg-emerald" style={{ width: `${(item.currentValue / 0.6) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AIInsightBox insight={hub.aiInsight} />

        {/* Tech Observations Section */}
        {techObservations.length > 0 && (
          <section id="observations" className="py-stack-lg px-margin max-w-container-max mx-auto scroll-mt-24 border-b border-outline-variant">
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg text-center">技術觀察與企業採訪</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {techObservations.map((obs) => (
                <a key={obs._id} href={`/insights/${obs.slug}`} className="group block bg-surface-container-lowest border border-outline-variant hover:border-primary/50 hover:shadow-xl transition-all rounded-2xl overflow-hidden text-left">
                  <div className="h-48 w-full bg-surface-variant relative overflow-hidden border-b border-outline-variant">
                    {obs.imageUrl ? (
                      <img src={obs.imageUrl} alt={obs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline-variant">
                        <span className="material-symbols-outlined text-4xl">visibility</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-surface-container-high text-secondary text-[11px] font-bold tracking-widest uppercase mb-4 border border-outline-variant">
                      Tech Observation
                    </div>
                    <h3 className="font-bold text-lg text-primary mb-2 line-clamp-2 group-hover:text-esg-emerald transition-colors">{obs.title}</h3>
                    {obs.subtitle && <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">{obs.subtitle}</p>}
                    <div className="flex items-center text-primary font-bold text-sm">
                      <span>閱讀完整觀察</span>
                      <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        <section id="education" className="bg-surface-container-lowest py-stack-lg px-margin max-w-container-max mx-auto border-b border-outline-variant text-center scroll-mt-24">
          <div className="mb-stack-lg max-w-3xl mx-auto">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 font-label-sm text-label-sm rounded-full mb-4 inline-block">Industry Primer</span>
            <h2 className="font-display-lg text-display-lg text-primary mb-4">解碼核心資產價值</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {eduPages.map((edu) => (
                <a key={edu._id} href={`/hubs/${hubSlug}/edu/${edu.slug}`} className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:shadow-xl transition-all">
                  探索：{edu.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-stack-lg px-margin max-w-container-max mx-auto scroll-mt-24">
          <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg">資源目錄</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {products.map((product) => (
              <a key={product._id} href="#onboard-form" className="group bg-surface-container-lowest border border-outline-variant hover:shadow-2xl transition-all p-stack-md rounded-xl flex flex-col justify-between">
                <div>
                  <div className="h-48 mb-4 bg-surface-variant rounded-lg overflow-hidden relative">
                    {product.image ? (
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={urlFor(product.image).url()} alt={product.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline-variant opacity-30">
                        <span className="material-symbols-outlined text-6xl">picture_as_pdf</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-primary mb-2">{product.title}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-6">{product.description}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant flex items-center justify-between text-primary font-bold text-sm group-hover:text-esg-emerald transition-colors">
                  <span>解鎖下載 PDF</span>
                  <span className="material-symbols-outlined">lock_open</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Intelligence Section */}
        {!hub.processSteps?.isActive && insights.length > 0 && (
          <section id="intelligence" className="bg-surface-container-low py-stack-lg border-y border-outline-variant scroll-mt-24">
            <div className="max-w-container-max mx-auto px-margin">
              <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg">供應鏈情報</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {insights.map((insight) => (
                  <InsightCard key={insight._id} insight={{ ...insight, hubTitle: hub.title }} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Lead Capture Form Section */}
        <section id="onboard-form" className="py-stack-lg px-margin max-w-container-max mx-auto scroll-mt-24">
          <LeadCaptureForm hubSlug={hubSlug} />
          
          <div className="mt-8 text-center max-w-3xl mx-auto p-4 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm">
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              SteelStream 所提供之產品規格、檢驗資料與碳資料，將依實際供應商、批次、檢驗條件與客戶需求確認。所有報價、交期與供應條件，均以正式商務文件為準。
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-highest border-t border-outline-variant w-full py-stack-lg">
        <div className="text-center text-on-surface-variant text-label-sm">© 2024 esg.team</div>
      </footer>
    </>
  );
}
