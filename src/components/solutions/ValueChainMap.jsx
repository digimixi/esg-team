import React from 'react';

export default function ValueChainMap({ data }) {
  if (!data) return null;

  const { mapTitle, mapSubtitle, columns } = data;
  
  if (!columns || columns.length === 0) return null;

  // Determine grid columns dynamically based on how many columns are provided (max 4 for nice spacing)
  const colsCount = Math.min(columns.length, 4);
  const gridClass = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${colsCount} gap-6`;

  // Tailwind purge CSS mapping for dynamic text colors
  const colorMap = {
    'bg-primary': 'text-primary',
    'bg-esg-emerald': 'text-esg-emerald',
    'bg-neutral-800': 'text-neutral-800',
    'bg-cyan-600': 'text-cyan-600',
    'bg-indigo-600': 'text-indigo-600',
    'bg-amber-600': 'text-amber-600',
    'bg-teal-700': 'text-teal-700',
    'bg-secondary': 'text-secondary'
  };

  return (
    <section className="py-12 bg-surface">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3 tracking-tight">{mapTitle || '產業鏈 ESG 互動地圖'}</h2>
          {mapSubtitle && <p className="text-on-surface-variant text-sm md:text-base">{mapSubtitle}</p>}
        </div>

        <div className={gridClass}>
          {columns.map((col, colIdx) => (
            <div 
              key={col._key || colIdx} 
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant hover:shadow-md transition-shadow flex flex-col h-full relative pt-1"
            >
              {/* Colorful Top Border Indicator */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${col.topColor || 'bg-esg-emerald'}`}></div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className={`text-lg font-bold mb-6 ${col.topColor ? (colorMap[col.topColor] || 'text-primary') : 'text-primary'}`}>
                  {col.title}
                </h3>
                
                {/* Item Tags */}
                {col.items && col.items.length > 0 && (
                  <div className="space-y-3 mb-8">
                    {col.items.map((item, itemIdx) => (
                      <div 
                        key={item._key || itemIdx} 
                        className={`px-3 py-2 rounded-md text-sm font-medium border bg-white shadow-sm ${
                          item.type === 'blue' 
                            ? 'border-blue-500 text-blue-600 hover:bg-blue-50'
                            : 'border-esg-emerald text-esg-emerald hover:bg-esg-emerald/5' 
                        } transition-colors cursor-default`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Companies List */}
                {col.companies && col.companies.length > 0 && (
                  <div className="mt-auto pt-6 border-t border-outline-variant/50">
                    {col.descriptionTitle && <p className="text-sm font-bold text-primary mb-2">{col.descriptionTitle}</p>}
                    <ul className="space-y-1.5">
                      {col.companies.map((company, idx) => (
                        <li key={idx} className="text-sm text-on-surface-variant flex items-start">
                          <span className="mr-2 mt-1 w-1 h-1 rounded-full bg-outline-variant shrink-0"></span>
                          <span className="leading-tight">{company}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
