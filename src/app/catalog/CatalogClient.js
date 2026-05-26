'use client';

import { useState } from 'react';
import { urlFor } from '@/sanity/lib/image';

const CATEGORIES = [
  { label: '全部產品', value: 'all' },
  { label: '原物料 Raw Materials', value: 'raw_materials' },
  { label: '成品 Finished Products', value: 'finished_products' },
  { label: '化學品 Chemicals', value: 'chemicals' },
  { label: '設備 Equipment', value: 'equipment' },
  { label: '認證與服務 Services', value: 'services' },
];

export default function CatalogClient({ products }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

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
            探索經過嚴格稽核的高效能低碳材料、綠色設備與專業合規服務。
            一站式建構您的淨零排放價值鏈。
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-stack-lg px-margin max-w-container-max mx-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-stack-lg justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-label-sm transition-all duration-200 border ${
                activeCategory === cat.value 
                  ? 'bg-primary text-on-primary border-primary shadow-md' 
                  : 'bg-transparent border-outline text-on-surface-variant hover:border-primary/50 hover:bg-surface-variant/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid (Soft Outlined + Modern SaaS Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant">
              此分類目前沒有相關產品。
            </div>
          ) : (
            filteredProducts.map(product => (
              <div 
                key={product._id} 
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-white border border-gray-200 rounded-3xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative h-56 bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={urlFor(product.image).width(600).url()} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-gray-300 text-6xl">inventory_2</span>
                  )}
                  {/* Category/Hub Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    {product.hub?.title || '全域資源'}
                  </div>
                  {product.gradeBadge && (
                    <div className="absolute top-3 right-3 bg-esg-emerald text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      {product.gradeBadge}
                    </div>
                  )}
                </div>
                
                {/* Text Area */}
                <div className="flex flex-col flex-grow px-2">
                  <h3 className="font-bold text-lg text-primary mb-1 line-clamp-1">{product.title}</h3>
                  {product.subtitle && (
                    <p className="text-xs text-secondary font-medium mb-3 uppercase tracking-wider">{product.subtitle}</p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                  
                  {/* Key Specs Preview */}
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="flex gap-4 border-t border-gray-100 pt-3 mt-auto">
                      {product.specifications.slice(0, 2).map((spec, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase">{spec.label}</span>
                          <span className="text-xs font-bold text-gray-700">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal Overlay (Option B - Simple Center Modal) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedProduct(null)}
          />
          
          {/* Modal Panel */}
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            {/* Modal Image */}
            <div className="md:w-1/2 bg-gray-50 relative min-h-[250px] flex items-center justify-center">
              {selectedProduct.image ? (
                <img 
                  src={urlFor(selectedProduct.image).width(800).url()} 
                  alt={selectedProduct.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-gray-300 text-6xl">inventory_2</span>
              )}
            </div>
            
            {/* Modal Content */}
            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors z-10"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                {selectedProduct.hub?.title || 'ESG Catalog'}
              </span>
              <h2 className="text-2xl font-bold text-primary mb-1">{selectedProduct.title}</h2>
              {selectedProduct.subtitle && (
                <h3 className="text-sm font-medium text-gray-500 mb-4">{selectedProduct.subtitle}</h3>
              )}
              
              <div className="prose prose-sm text-gray-600 mb-6">
                <p>{selectedProduct.description}</p>
              </div>

              {/* Specs Table */}
              {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-primary uppercase border-b border-gray-100 pb-2 mb-3">技術規格 Specifications</h4>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {selectedProduct.specifications.map((spec, i) => (
                      <div key={i}>
                        <div className="text-[10px] text-gray-400">{spec.label}</div>
                        <div className="text-sm font-semibold text-gray-800">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <a 
                  href="/contact" 
                  className="flex-1 bg-esg-emerald hover:bg-emerald-600 text-white text-center py-3 rounded-full font-bold transition-colors"
                >
                  聯絡銷售團隊
                </a>
                {selectedProduct.hub && (
                  <a 
                    href={`/hubs/${selectedProduct.hub.slug?.current}/products/${selectedProduct.slug?.current}`} 
                    className="flex-1 bg-surface-variant hover:bg-gray-200 text-primary text-center py-3 rounded-full font-bold transition-colors"
                  >
                    查看專題詳情
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
