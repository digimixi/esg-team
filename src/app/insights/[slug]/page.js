import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';

export const revalidate = 86400;

// 自定義 PortableText 渲染樣式 (繼承 TECH_STACK_SPEC.md 規範)
const ptComponents = {
  block: {
    h3: ({children}) => <h3 className="text-primary font-bold text-base mt-6 mb-2 border-l-2 border-primary pl-2">{children}</h3>,
    h4: ({children}) => <h4 className="text-primary font-bold text-sm mt-4 mb-1">{children}</h4>,
    normal: ({children}) => <p className="mb-4 text-sm leading-relaxed text-secondary whitespace-pre-line">{children}</p>,
  },
  marks: {
    strong: ({children}) => <strong className="font-bold text-primary">{children}</strong>,
  },
};

async function getTechObservation(slug) {
  const query = `*[_type == "techObservation" && slug.current == $slug][0]{
    title,
    subtitle,
    heroImage,
    disclaimer,
    introduction,
    companyBackground,
    howItWorks,
    materialApplicability,
    techEvidence,
    esgObservation,
    verificationProcess,
    faq,
    cta,
    "relatedHub": relatedHubs[0]->{
      title,
      "slug": slug.current
    }
  }`;
  return client.fetch(query, { slug });
}

export default async function TechObservationPage({ params }) {
  const resolvedParams = await params;
  const observation = await getTechObservation(resolvedParams.slug);

  if (!observation) {
    return <div className="p-8 text-center text-primary font-mono text-sm uppercase">Observation Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-surface-container font-sans selection:bg-esg-emerald selection:text-white pb-24">
      {/* Header Navigation */}
      <header className="border-b border-surface-high bg-surface-container/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-widest text-secondary flex items-center space-x-2">
            <span className="w-2 h-2 bg-esg-emerald rounded-full animate-pulse block"></span>
            <span>esg.team | Tech Observation</span>
          </div>
          {observation.relatedHub && (
            <Link 
              href={`/hubs/${observation.relatedHub.slug}`}
              className="text-xs text-primary hover:text-esg-emerald transition-colors font-mono"
            >
              ← 返回 {observation.relatedHub.title}
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Title Section */}
        <section className="mb-12">
          <div className="inline-block bg-surface-high border border-surface text-xs font-mono px-2 py-1 mb-4 text-secondary uppercase">
            企業採訪 / 技術觀察
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-4 leading-snug">
            {observation.title}
          </h1>
          {observation.subtitle && (
            <p className="text-base text-secondary font-mono border-l-2 border-esg-emerald pl-4 py-1">
              {observation.subtitle}
            </p>
          )}
        </section>

        {/* Disclaimer Alert */}
        {observation.disclaimer && (
          <div className="bg-amber-900/10 border border-amber-600/30 p-4 mb-10 flex items-start">
            <span className="material-symbols-outlined text-amber-600 mr-3 mt-0.5">warning</span>
            <p className="text-sm text-amber-700 font-mono leading-relaxed">
              {observation.disclaimer}
            </p>
          </div>
        )}

        {/* Hero Image */}
        {observation.heroImage && (
          <div className="mb-12 border border-surface p-2 bg-white">
            <img 
              src={urlFor(observation.heroImage).url()} 
              alt={observation.title} 
              className="w-full h-auto aspect-video object-cover"
            />
          </div>
        )}

        {/* Introduction */}
        {observation.introduction && (
          <section className="mb-12 pr-0 sm:pr-12">
            <PortableText value={observation.introduction} components={ptComponents} />
          </section>
        )}

        {/* Two-Column Layout for Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          <div className="md:col-span-8 space-y-12">
            
            {/* Company Background */}
            {observation.companyBackground && observation.companyBackground.length > 0 && (
              <section id="background">
                <div className="flex items-center space-x-2 mb-4 border-b border-surface pb-2">
                  <span className="material-symbols-outlined text-primary text-xl">factory</span>
                  <h2 className="text-lg font-bold text-primary">受訪企業與設備背景</h2>
                </div>
                <div className="border border-surface divide-y divide-surface bg-white">
                  {observation.companyBackground.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-4">
                      <div className="text-xs font-bold text-secondary uppercase sm:col-span-1 mb-1 sm:mb-0">{item.item}</div>
                      <div className="text-sm text-primary sm:col-span-2 whitespace-pre-line">{item.content}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* How It Works */}
            {observation.howItWorks && (
              <section id="how-it-works">
                <div className="flex items-center space-x-2 mb-4 border-b border-surface pb-2">
                  <span className="material-symbols-outlined text-primary text-xl">settings_b_roll</span>
                  <h2 className="text-lg font-bold text-primary">設備如何運作</h2>
                </div>
                {observation.howItWorks.description && (
                  <p className="text-sm text-secondary leading-relaxed mb-4 whitespace-pre-line">
                    {observation.howItWorks.description}
                  </p>
                )}
                {observation.howItWorks.diagram && (
                  <div className="border border-surface p-1 bg-surface-container">
                    <img src={urlFor(observation.howItWorks.diagram).url()} alt="流程圖" className="w-full h-auto" />
                  </div>
                )}
              </section>
            )}

            {/* Technical Evidence */}
            {observation.techEvidence && observation.techEvidence.length > 0 && (
              <section id="evidence">
                <div className="flex items-center space-x-2 mb-4 border-b border-surface pb-2">
                  <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
                  <h2 className="text-lg font-bold text-primary">技術證據揭露表</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-surface bg-white text-sm">
                    <thead>
                      <tr className="bg-surface-high border-b border-surface">
                        <th className="p-3 font-bold text-primary whitespace-nowrap">驗證項目</th>
                        <th className="p-3 font-bold text-primary whitespace-nowrap">企業主張</th>
                        <th className="p-3 font-bold text-primary whitespace-nowrap">已提供證據</th>
                        <th className="p-3 font-bold text-primary whitespace-nowrap">目前狀態</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface">
                      {observation.techEvidence.map((row, idx) => (
                        <tr key={idx} className="hover:bg-surface-container/30 transition-colors">
                          <td className="p-3 font-medium text-primary">{row.item}</td>
                          <td className="p-3 text-secondary">{row.claim}</td>
                          <td className="p-3 text-secondary">{row.evidence}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${
                              row.status === '已確認' ? 'bg-esg-emerald/20 text-esg-emerald border border-esg-emerald/30' : 
                              row.status === '待補資料' || row.status === '待驗證' ? 'bg-amber-100 text-amber-700 border border-amber-300' : 
                              'bg-surface-high text-secondary border border-surface'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ESG Observation */}
            {observation.esgObservation && (
              <section id="observation" className="bg-primary text-white p-6 sm:p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="material-symbols-outlined text-esg-emerald text-2xl">visibility</span>
                  <h2 className="text-lg font-bold">esg.team 初步觀察</h2>
                </div>
                <div className="text-surface-container prose-invert text-sm leading-relaxed">
                  <PortableText value={observation.esgObservation} components={ptComponents} />
                </div>
              </section>
            )}

            {/* FAQ */}
            {observation.faq && observation.faq.length > 0 && (
              <section id="faq">
                <div className="flex items-center space-x-2 mb-6 border-b border-surface pb-2">
                  <span className="material-symbols-outlined text-primary text-xl">forum</span>
                  <h2 className="text-lg font-bold text-primary">採訪問答稿</h2>
                </div>
                <div className="space-y-6">
                  {observation.faq.map((item, idx) => (
                    <div key={idx} className="bg-white border border-surface p-5">
                      <h4 className="font-bold text-primary text-sm mb-2 flex">
                        <span className="text-esg-emerald mr-2">Q:</span>
                        {item.question}
                      </h4>
                      <p className="text-sm text-secondary leading-relaxed pl-6 whitespace-pre-line border-l-2 border-surface-high ml-1">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-4">
            <div className="sticky top-20 space-y-6">
              
              {/* Material Applicability */}
              {observation.materialApplicability && observation.materialApplicability.length > 0 && (
                <div className="bg-white border border-surface p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-primary mb-4 flex items-center">
                    <span className="material-symbols-outlined text-esg-emerald mr-2 text-lg">science</span>
                    潛在適用物料
                  </h3>
                  <div className="space-y-3">
                    {observation.materialApplicability.map((mat, idx) => (
                      <div key={idx} className="border-b border-surface pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-primary">{mat.material}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-surface-high text-secondary rounded">
                            {mat.status}
                          </span>
                        </div>
                        <p className="text-xs text-secondary">{mat.statement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              {observation.cta && observation.cta.length > 0 && (
                <div className="bg-primary text-white border border-primary p-5 shadow-sm">
                  <h3 className="text-sm font-bold mb-4 flex items-center">
                    <span className="material-symbols-outlined text-esg-emerald mr-2 text-lg">bolt</span>
                    採取行動
                  </h3>
                  <div className="space-y-4">
                    {observation.cta.map((actionItem, idx) => (
                      <div key={idx}>
                        <button className="w-full bg-esg-emerald hover:bg-esg-emerald/90 text-white font-bold text-xs py-3 px-4 transition-colors flex justify-between items-center group">
                          {actionItem.action}
                          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <p className="text-[10px] text-surface-container mt-2 opacity-80">{actionItem.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 pt-8 border-t border-surface">
        <p className="text-xs text-secondary/70 leading-relaxed text-justify">
          本文為 esg.team 產業專題採訪與技術觀察，內容包含受訪企業提供之資料及說明，不構成 esg.team 對設備效能、法規適用性、投資效益或環境表現之認證、保證或推薦。文中標示為「待驗證」之項目，須依特定物料、設備型號、操作條件、場域要求及第三方檢測結果確認。所有設備價格、規格、交期、安裝及售後條件，均以企業正式商務與技術文件為準。
        </p>
      </footer>
    </div>
  );
}
