import React from 'react';

/**
 * @component MarketIndexBar
 * @description Standardized market index bar used on Home, Hubs, and Solutions.
 */
const MarketIndexBar = ({ indices, lastUpdated }) => {
  if (!indices || indices.length === 0) return null;

  return (
    <section className="bg-surface-container py-stack-md border-b border-outline-variant overflow-hidden">
      <div className="max-w-container-max mx-auto px-4 sm:px-margin">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-stack-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-stack-sm shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">monitoring</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">市場實時指數</span>
            </div>
            {lastUpdated && (
              <span className="text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                最後更新: {new Date(lastUpdated).toLocaleString('zh-TW')}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-1 justify-around items-center divide-x-0 sm:divide-x divide-outline-variant w-full overflow-hidden">
            {indices.map((index, idx) => (
              <div key={index._id} className={`px-2 sm:px-gutter text-center group cursor-default ${idx % 2 === 0 ? 'border-r sm:border-r-0' : ''} py-2 sm:py-0 border-outline-variant/30`}>
                <div className="font-label-sm text-[10px] text-on-surface-variant mb-1 group-hover:text-primary transition-colors truncate">
                  {index.name}
                </div>
                <div className="font-data-mono text-body-base sm:text-headline-sm text-primary font-bold whitespace-nowrap">
                  {index.value} 
                  <span className={`text-[10px] ml-1 ${index.trendPercentage?.includes('-') ? 'text-error' : 'text-esg-emerald'}`}>
                    {index.trendPercentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketIndexBar;
