import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export const revalidate = 0;

export default async function Products({ params }) {
  const { hubSlug } = await params;

  // Fetch hub data for navigation
  const hub = await client.fetch('*[_type == "hub" && slug.current == $slug][0]', { slug: hubSlug });

  // Fetch products associated with this hub
  const products = await client.fetch('*[_type == "product" && hub->slug.current == $slug] | order(_createdAt desc)', { slug: hubSlug });

  return (
    <>
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex justify-between items-center px-4 md:px-margin h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-2 md:gap-stack-lg min-w-0">
            <a href="/" className="text-body-base md:text-headline-md font-headline-md text-primary flex items-center gap-1 shrink-0">
              esg<span className="text-esg-emerald hidden sm:inline">.</span><span className="hidden sm:inline">team</span>
            </a>
            <span className="text-outline-variant shrink-0">|</span>
            <a href={`/hubs/${hubSlug}`} className="text-label-sm md:text-body-base font-bold text-secondary truncate">
              {hub?.title || 'Industrial Hub'}
            </a>
            <nav className="hidden lg:flex gap-4 xl:gap-gutter ml-2 xl:ml-stack-lg">
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}`}>首頁 Home</a>
              <a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/products`}>產品 Products</a>
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/market`}>市場 Market</a>
              <a className="text-secondary hover:text-primary transition-colors font-body-base text-body-base whitespace-nowrap" href={`/hubs/${hubSlug}/supply-chain`}>供應鏈 Supply Chain</a>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-gutter shrink-0 pl-2">
            <div className="hidden xl:flex items-center bg-surface-container-low px-stack-md py-stack-sm rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant mr-stack-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-label-sm w-48 outline-none" placeholder="Search partners..." type="text"/>
            </div>
            <div className="flex items-center gap-2 md:gap-stack-sm">
              <button className="hidden md:block px-2 md:px-gutter py-2 md:py-stack-sm text-secondary font-label-sm whitespace-nowrap hover:underline transition-all cursor-pointer">登錄 Sign In</button>
              <button className="px-3 md:px-gutter py-2 md:py-stack-sm bg-primary text-on-primary font-label-sm rounded-lg cursor-pointer active:scale-95 duration-150 whitespace-nowrap">
                <span className="hidden sm:inline">聯絡銷售 Contact Sales</span>
                <span className="sm:hidden">Contact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-outline-variant bg-surface overflow-hidden">
          <nav className="flex overflow-x-auto no-scrollbar px-4 h-10 items-center gap-6">
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}`}>首頁 Home</a>
            <a className="text-primary font-bold border-b-2 border-primary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/products`}>產品 Products</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/market`}>市場 Market</a>
            <a className="text-secondary h-full flex items-center whitespace-nowrap shrink-0 text-label-sm" href={`/hubs/${hubSlug}/supply-chain`}>供應鏈 Supply Chain</a>
          </nav>
        </div>
      </header>

      <main className="pt-[104px] lg:pt-24 pb-stack-lg max-w-container-max mx-auto px-margin">
        {/* Header Section */}
        <header className="mb-stack-lg border-l-4 border-primary pl-6 py-2">
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">{hub?.title} 產品目錄 <span className="block text-body-base font-normal mt-1 text-on-surface-variant uppercase tracking-wider">Industrial Product Catalog</span></h1>
          <p className="text-on-surface-variant max-w-2xl mt-unit">為關鍵工業生產和冶煉作業提供精密工程與高品質材料。</p>
        </header>

        <div className="grid grid-cols-12 gap-gutter">
          {/* Sidebar Filter */}
          <aside className="col-span-12 lg:col-span-3 space-y-stack-md">
            <div className="bg-surface-container-lowest border border-outline-variant p-stack-md sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-stack-md border-b border-outline-variant pb-stack-sm">
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">篩選 Filters</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">filter_list</span>
              </div>
              
              <div className="mb-stack-md">
                <h3 className="font-label-sm text-label-sm text-secondary mb-stack-sm">類別 Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input defaultChecked className="form-checkbox h-4 w-4 text-primary border-outline-variant rounded-none" type="checkbox"/>
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">顯示所有 (Show All)</span>
                  </label>
                </div>
              </div>

              <div className="pt-stack-md border-t border-outline-variant">
                <button className="w-full bg-primary text-on-primary py-3 font-label-sm text-label-sm uppercase tracking-widest hover:bg-on-primary-fixed-variant transition-colors">套用篩選 APPLY</button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9 space-y-stack-lg">
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {products.map((product) => (
                <div key={product._id} className="bg-surface-container-lowest border border-outline-variant group hover:shadow-md transition-shadow flex flex-col">
                  <div className="h-48 overflow-hidden relative bg-surface-variant">
                    {product.image ? (
                        <img 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          src={urlFor(product.image).url()} 
                          alt={product.name} 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">No Image</div>
                    )}
                    <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 text-label-sm font-label-sm uppercase">
                      {product.gradeBadge || 'STANDARD'}
                    </div>
                  </div>
                  <div className="p-stack-md flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-headline-md font-headline-md text-primary">{product.title}</h2>
                    </div>
                    <p className="text-on-surface-variant text-body-base mb-stack-md flex-1 whitespace-pre-line">{product.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-stack-md bg-surface-container-low p-3">
                      <div>
                        <p className="text-label-sm text-secondary uppercase mb-1">英文名稱</p>
                        <p className="font-data-mono text-data-mono text-primary">{product.subtitle}</p>
                      </div>
                      <div>
                        <p className="text-label-sm text-secondary uppercase mb-1">庫存狀態</p>
                        <p className="font-data-mono text-data-mono text-primary">{product.stock || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button className="w-full bg-primary text-on-primary py-2 font-label-sm text-label-sm uppercase hover:bg-on-primary-fixed-variant transition-all">索取報價 Request Quote</button>
                      <button className="w-full border border-outline-variant text-secondary py-2 font-label-sm text-label-sm uppercase hover:bg-surface-container transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined mr-2 text-[18px]">download</span>下載規格書
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-outline font-body-base">
                      尚無產品資料，請至 Sanity 後台新增。
                  </div>
              )}
            </div>

            {/* Specifications Table Section */}
            <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
              <div className="p-stack-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md text-primary">技術參數對比 <span className="block text-body-base font-normal mt-1 text-on-surface-variant uppercase tracking-wider">Technical Parameter Comparison</span></h3>
                <div className="flex items-center text-secondary font-label-sm text-label-sm"><span className="material-symbols-outlined mr-1 text-[18px]">compare_arrows</span> 對比模式：開啟</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high">
                      <th className="p-4 text-left font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant">產品</th>
                      <th className="p-4 text-left font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant">等級</th>
                      <th className="p-4 text-left font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant">庫存</th>
                    </tr>
                  </thead>
                  <tbody className="text-body-base divide-y divide-outline-variant">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-4 font-bold text-primary">{product.title}</td>
                        <td className="p-4 font-data-mono text-data-mono">{product.gradeBadge || 'N/A'}</td>
                        <td className="p-4 font-data-mono text-data-mono">{product.stock || 'N/A'}</td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="3" className="p-4 text-center text-on-surface-variant">暫無對比資料</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant w-full py-stack-lg">
        <div className="max-w-container-max mx-auto px-margin flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-body-base font-bold text-on-surface">esg.team</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">© 2024 esg.team Industrial Portal. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all hover:underline cursor-pointer" href="#">隱私權政策</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all hover:underline cursor-pointer" href="#">服務條款</a>
          </div>
        </div>
      </footer>
    </>
  );
}
