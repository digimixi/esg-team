'use client';

import { useState } from 'react';
import { urlFor } from '@/sanity/lib/image';

const PRODUCT_CATEGORIES = [
  { label: '全部商品 All Products', value: 'all' },
  { label: '石墨電極 Graphite Electrode', value: 'graphite_electrode' },
  { label: '石墨坩堝 Graphite Crucible', value: 'graphite_crucible' },
  { label: '增碳劑 Carbon Additive', value: 'carbon_additive' },
  { label: '石墨材料 Graphite Materials', value: 'graphite_materials' },
];

const ESG_TAGS = [
  { label: '📉 低碳替代品 Low-Carbon', value: 'low_carbon' },
  { label: '♻️ 資源再生 Recovery', value: 'recovery' },
  { label: '🔋 能源效率 Energy Efficiency', value: 'energy_efficiency' },
  { label: '⚖️ 碳權與合規 Carbon Assets', value: 'carbon_assets' },
];

export default function CatalogClient({ products }) {
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [activeEsgFilters, setActiveEsgFilters] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter Logic
  const filteredProducts = products.filter(p => {
    // 1. Filter by category
    if (activeSubCategory !== 'all' && p.subCategory !== activeSubCategory) {
      return false;
    }
    // 2. Filter by ESG tags (If any ESG tag is selected, product must contain at least one)
    if (activeEsgFilters.length > 0) {
      if (!p.esgTags || p.esgTags.length === 0) return false;
      const hasMatchingTag = activeEsgFilters.some(tag => p.esgTags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    return true;
  });

  const toggleEsgFilter = (tagValue) => {
    setActiveEsgFilters(prev => 
      prev.includes(tagValue) 
        ? prev.filter(t => t !== tagValue) 
        : [...prev, tagValue]
    );
  };

  const getProductCount = (catValue) => {
    if (catValue === 'all') return products.length;
    return products.filter(p => p.subCategory === catValue).length;
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* Hero Section */}
      <section className="bg-surface-container py-stack-xl px-margin border-b border-outline-variant">
        <div className="max-w-container-max mx-auto text-center">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm mb-4 inline-block">
            Global Partner Network
          </span>
          <h1 className="font-display-lg text-display-lg text-primary mb-4">ESG 認證供應鏈大廳</h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            探索經過嚴格稽核的高效能低碳材料、綠色設備與專業合規服務。一站式建構您的淨零排放價值鏈。
          </p>
        </div>
      </section>

      {/* Main Content Area - Two Columns */}
      <section className="py-stack-lg px-margin max-w-container-max mx-auto relative">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 bg-white border border-outline-variant px-4 py-2 rounded-full font-bold shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              篩選目錄與 ESG 標籤
            </button>
            
            {/* View Toggles (Mobile) */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-sm leading-none">grid_view</span>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-sm leading-none">view_list</span>
              </button>
            </div>
          </div>

          {/* Left Sidebar (Desktop + Mobile Drawer) */}
          <aside className={`
            fixed inset-y-0 left-0 z-[1100] w-72 bg-white border-r border-outline-variant shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 lg:relative lg:inset-auto lg:z-auto lg:w-64 lg:bg-transparent lg:border-none lg:shadow-none lg:p-0 lg:transform-none
            ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">篩選清單</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-gray-900">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Product Types */}
            <div className="mb-8">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b">產品類別 Product Types</h3>
              <ul className="space-y-2">
                {PRODUCT_CATEGORIES.map(cat => (
                  <li key={cat.value}>
                    <button
                      onClick={() => {
                        setActiveSubCategory(cat.value);
                        if (window.innerWidth < 1024) setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSubCategory === cat.value 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                        {getProductCount(cat.value)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ESG Filters */}
            <div className="mb-8">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b">ESG 永續屬性</h3>
              <div className="flex flex-col gap-2">
                {ESG_TAGS.map(tag => {
                  const isActive = activeEsgFilters.includes(tag.value);
                  return (
                    <label 
                      key={tag.value} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleEsgFilter(tag.value);
                      }}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        isActive ? 'bg-primary border-primary' : 'bg-white border-gray-300 group-hover:border-primary'
                      }`}>
                        {isActive && <span className="material-symbols-outlined text-[14px] text-white leading-none">check</span>}
                      </div>
                      <span className={`text-sm ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>{tag.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="flex-1">
            {/* Desktop Top Bar */}
            <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <div className="text-gray-500 text-sm">
                顯示 <span className="font-bold text-gray-900">{filteredProducts.length}</span> 項符合條件的產品
              </div>
              
              {/* View Toggles (Desktop) */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
                  <span className="material-symbols-outlined text-sm leading-none">grid_view</span>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
                  <span className="material-symbols-outlined text-sm leading-none">view_list</span>
                </button>
              </div>
            </div>

            {/* Product List/Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">search_off</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">找不到符合條件的產品</h3>
                <p className="text-gray-500">請嘗試更改分類或減少 ESG 篩選標籤。</p>
                <button 
                  onClick={() => { setActiveSubCategory('all'); setActiveEsgFilters([]); }}
                  className="mt-6 text-primary hover:underline font-bold"
                >
                  清除所有篩選條件
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" 
                  : "flex flex-col gap-4"
              }>
                {filteredProducts.map(product => (
                  <button 
                    key={product._id} 
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className={`group cursor-pointer bg-white border border-gray-200 rounded-3xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 text-left w-full ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row gap-6' : 'flex flex-col h-full'
                    }`}
                  >
                    {/* Image Area */}
                    <div className={`relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center flex-shrink-0 ${
                      viewMode === 'list' ? 'w-full sm:w-64 h-48' : 'w-full h-40 sm:h-48 mb-4'
                    }`}>
                      {product.image ? (
                        <img 
                          src={urlFor(product.image).width(600).url()} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-gray-300 text-6xl">inventory_2</span>
                      )}
                      {/* Badge */}
                      {product.gradeBadge && (
                        <div className="absolute top-2 right-2 bg-esg-emerald text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                          {product.gradeBadge}
                        </div>
                      )}
                    </div>
                    
                    {/* Text Area */}
                    <div className="flex flex-col flex-grow min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-primary mb-1 truncate">{product.title}</h3>
                      {product.subtitle && (
                        <p className="text-[10px] sm:text-xs text-secondary font-medium mb-2 uppercase tracking-wider truncate">{product.subtitle}</p>
                      )}
                      
                      {/* ESG Tags */}
                      {product.esgTags && product.esgTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.esgTags.map(tag => {
                            const tagMap = {
                              'low_carbon': { label: '📉 低碳替代品', bg: 'bg-green-50 text-green-700' },
                              'recovery': { label: '♻️ 資源再生', bg: 'bg-teal-50 text-teal-700' },
                              'energy_efficiency': { label: '🔋 能源效率', bg: 'bg-blue-50 text-blue-700' },
                              'carbon_assets': { label: '⚖️ 碳權與合規', bg: 'bg-purple-50 text-purple-700' }
                            };
                            const t = tagMap[tag];
                            if(!t) return null;
                            return (
                              <span key={tag} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.bg}`}>
                                {t.label}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <p className={`text-xs sm:text-sm text-gray-500 mb-4 flex-grow ${viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2'}`}>
                        {product.description}
                      </p>
                      
                      {/* Key Specs Preview */}
                      {product.specifications && product.specifications.length > 0 && (
                        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-3 mt-auto">
                          {product.specifications.slice(0, viewMode === 'list' ? 4 : 2).map((spec, i) => (
                            <div key={i} className="flex flex-col">
                              <span className="text-[9px] text-gray-400 uppercase">{spec.label}</span>
                              <span className="text-[11px] font-bold text-gray-700">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Slide-out Drawer (B2B Architecture) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedProduct(null)}
          />
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md md:max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header (Image) */}
            <div className="relative h-64 bg-gray-50 flex-shrink-0 flex items-center justify-center border-b border-gray-100">
              {selectedProduct.image ? (
                <img 
                  src={urlFor(selectedProduct.image).width(800).url()} 
                  alt={selectedProduct.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-gray-300 text-6xl">inventory_2</span>
              )}
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors z-10 backdrop-blur-md"
              >
                <span className="material-symbols-outlined text-xl leading-none">close</span>
              </button>
            </div>
            
            {/* Drawer Content */}
            <div className="p-6 md:p-8 overflow-y-auto flex-grow flex flex-col">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                {PRODUCT_CATEGORIES.find(c => c.value === selectedProduct.subCategory)?.label || selectedProduct.subCategory || 'ESG Catalog'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-1">{selectedProduct.title}</h2>
              {selectedProduct.subtitle && (
                <h3 className="text-sm font-medium text-gray-500 mb-6">{selectedProduct.subtitle}</h3>
              )}
              
              <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                <h4 className="text-sm font-bold text-gray-900 mb-2 border-b pb-2">Product Description</h4>
                <p className="whitespace-pre-wrap leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Specs Table */}
              {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Technical Specifications</h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                    {selectedProduct.specifications.map((spec, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-[10px] text-gray-500 uppercase">{spec.label}</div>
                        <div className="text-sm font-semibold text-gray-900 break-words">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* B2B Action Buttons */}
              <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
                <a 
                  href="/contact" 
                  className="w-full bg-primary hover:bg-primary/90 text-white text-center py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">science</span>
                  索取樣品與技術規格 (TDS)
                </a>
                <a 
                  href="/contact?subject=cbam" 
                  className="w-full bg-esg-emerald hover:bg-emerald-600 text-white text-center py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">energy_savings_leaf</span>
                  洽詢 CBAM / 碳足跡合規報價
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
