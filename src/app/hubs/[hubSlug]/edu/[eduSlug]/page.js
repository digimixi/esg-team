import React from 'react';
import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import EduImageGallery from '@/components/EduImageGallery';
import HubHeader from '@/components/HubHeader';

export const revalidate = 60;

export default async function GenericEduPage({ params }) {
  const { hubSlug, eduSlug } = await params;

  // 抓取科普頁面內容
  const page = await client.fetch(`
    *[_type == "eduPage" && slug.current == $slug && hub->slug.current == $hubSlug][0] {
      ...,
      hub-> {
        title,
        slug
      }
    }
  `, { slug: eduSlug, hubSlug }, { useCdn: false });

  if (!page) notFound();

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] selection:bg-secondary-container font-sans min-h-screen">
      {/* 統一專題導航 Header */}
      <HubHeader 
        hubSlug={hubSlug} 
        title={page.hub?.title || 'ESG 專題'} 
        activeTab="" 
      />

      <main className="pt-32 pb-32 max-w-container-max mx-auto px-margin">
        {/* 精緻微動畫麵包屑 (Breadcrumbs) */}
        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <a 
            href={`/hubs/${hubSlug}`} 
            className="group inline-flex items-center gap-2 text-sm text-secondary hover:text-primary font-bold transition-all px-3 py-1.5 bg-white border border-[#c6c6cd]/50 rounded-full shadow-sm hover:shadow hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span>返回 {page.hub?.title || '專題首頁'}</span>
          </a>
        </div>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-12">
          <div className="lg:col-span-8">
            <h1 className="text-[36px] font-bold leading-tight mb-4 tracking-tight">
              {page.title}<br/>
              <span className="text-[#515f74] opacity-80 font-normal">{page.subtitle}</span>
            </h1>
            
            <div className="flex items-center gap-3 text-[12px] font-semibold text-[#76777d] mb-6 uppercase tracking-wider">
              <span>{page.publishDate || 'RECENT UPDATE'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">share</span>
                Knowledge Sharing
              </span>
            </div>

            <EduImageGallery images={page.gallery} title={page.title} />
          </div>

          {/* Sidebar Form */}
          <aside className="lg:col-span-4">
            <div className="bg-white p-8 rounded-2xl border border-[#c6c6cd] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] sticky top-24">
              <h3 className="text-2xl font-bold mb-2">{page.sidebar?.title || 'Technical Inquiry'}</h3>
              <p className="text-[#515f74] mb-6 text-sm">{page.sidebar?.description || 'Request technical specifications or a quote for your facility.'}</p>
              <form className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold mb-1 text-[#45464d] uppercase tracking-wide">Full Name / 姓名</label>
                  <input className="w-full bg-[#f7f9fb] border border-[#c6c6cd] rounded p-3 focus:ring-2 focus:ring-black outline-none transition-all" placeholder="Enter name" type="text"/>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-1 text-[#45464d] uppercase tracking-wide">Email / 電子郵件</label>
                  <input className="w-full bg-[#f7f9fb] border border-[#c6c6cd] rounded p-3 focus:ring-2 focus:ring-black outline-none transition-all" placeholder="corporate@email.com" type="email"/>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-1 text-[#45464d] uppercase tracking-wide">Message / 需求詳情</label>
                  <textarea className="w-full bg-[#f7f9fb] border border-[#c6c6cd] rounded p-3 focus:ring-2 focus:ring-black outline-none transition-all" placeholder="Describe your inquiry..." rows="4"></textarea>
                </div>
                <button className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-[#3f465c] transition-all cursor-pointer shadow-lg active:scale-95">
                  {page.sidebar?.buttonText || 'Submit Inquiry / 發送'}
                </button>
              </form>
            </div>
          </aside>
        </section>

        {/* Introduction Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-16">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-bold border-l-4 border-black pl-4 uppercase tracking-tight">Introduction / 前言</h2>
            <p className="text-lg leading-relaxed text-[#45464d] whitespace-pre-line">
              {page.introduction}
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter pt-4">
              {page.featureHighlights?.map((feat, idx) => (
                <div key={idx} className={`p-6 bg-[#f2f4f6] border-l-4 ${
                  feat.type === 'primary' ? 'border-black' : 
                  feat.type === 'secondary' ? 'border-[#515f74]' : 'border-[#c6c6cd]'
                }`}>
                  <h4 className={`text-[12px] font-bold uppercase mb-2 ${
                    feat.type === 'primary' ? 'text-black' : 'text-[#515f74]'
                  }`}>{feat.title}</h4>
                  <p className="text-sm leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Classification Table */}
        {page.techTableConfig?.rows && page.techTableConfig.rows.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">{page.techTableConfig.title || 'Technical Data & Classification'}</h2>
            <div className="overflow-hidden border border-[#c6c6cd] rounded-xl bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#eceef0] text-[#45464d]">
                  <tr>
                    <th className="p-6 text-[12px] font-bold uppercase tracking-widest">{page.techTableConfig.headers?.h1 || 'Column 1'}</th>
                    <th className="p-6 text-[12px] font-bold uppercase tracking-widest">{page.techTableConfig.headers?.h2 || 'Column 2'}</th>
                    <th className="p-6 text-[12px] font-bold uppercase tracking-widest">{page.techTableConfig.headers?.h3 || 'Column 3'}</th>
                    <th className="p-6 text-[12px] font-bold uppercase tracking-widest">{page.techTableConfig.headers?.h4 || 'Column 4'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6c6cd]">
                  {page.techTableConfig.rows.map((row, idx) => (
                    <tr key={idx} className={`hover:bg-[#f2f4f6] transition-colors ${row.isHighlight ? 'bg-secondary-container/20' : ''}`}>
                      <td className="p-6 font-mono text-sm font-bold text-black">{row.c1}</td>
                      <td className="p-6 text-sm">{row.c2}</td>
                      <td className="p-6 text-sm">{row.c3}</td>
                      <td className="p-6 text-sm">{row.c4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Bento Grid Advantages */}
        {page.advantagesSection?.items && page.advantagesSection.items.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">{page.advantagesSection.title || 'Technical Advantages'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {page.advantagesSection.items.map((adv, idx) => {
                const isWide = adv.isWide;
                const styleClasses = {
                  'primary-container': 'bg-black text-white',
                  'secondary-container': 'bg-[#d5e3fd] text-[#57657b]',
                  'surface-high': 'bg-[#e6e8ea] border-[#c6c6cd]',
                  'white': 'bg-white border-[#c6c6cd]'
                };
                return (
                  <div key={idx} className={`${isWide ? 'md:col-span-2' : 'col-span-1'} ${styleClasses[adv.style] || styleClasses.white} p-8 rounded-2xl border flex flex-col justify-between group hover:shadow-lg transition-all`}>
                    <div>
                      <span className="material-symbols-outlined text-4xl mb-4 opacity-80 group-hover:scale-110 transition-transform">
                        {adv.icon || 'bolt'}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{adv.title}</h3>
                      <p className="opacity-80 text-sm leading-relaxed">{adv.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {page.faqSection?.questions && page.faqSection.questions.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">{page.faqSection.title || 'Technical FAQ'}</h2>
            <div className="space-y-4">
              {page.faqSection.questions.map((item, idx) => (
                <details key={idx} className="group bg-white border border-[#c6c6cd] rounded-xl overflow-hidden shadow-sm" open={idx === 0}>
                  <summary className="flex justify-between items-center p-6 cursor-pointer font-bold list-none hover:bg-[#f7f9fb] transition-colors">
                    <span>{item.question}</span>
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-[#45464d] text-sm leading-relaxed border-t border-[#c6c6cd] pt-4 whitespace-pre-line">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#e0e3e5] border-t border-[#c6c6cd] w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-container-max mx-auto space-y-4 md:space-y-0 text-[12px]">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-black uppercase tracking-widest">esg.team Industrial Education</span>
            <p className="text-[#45464d]">© 2024 ESG Team. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-[#45464d] font-semibold uppercase tracking-wider">
            <a className="hover:text-black hover:underline transition-all" href="#">Privacy</a>
            <a className="hover:text-black hover:underline transition-all" href="#">Terms</a>
            <a className="hover:text-black hover:underline transition-all" href="#">Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
