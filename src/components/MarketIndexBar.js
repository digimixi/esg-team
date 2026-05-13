import React from 'react';

/**
 * @component MarketIndexBar
 * @description Standardized market index bar used on Home, Hubs, and Solutions.
 */
const MarketIndexBar = ({ indices, lastUpdated }) => {
  if (!indices || indices.length === 0) return null;

  return (
    <section className="bg-surface-container py-stack-md border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-stack-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-stack-sm shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">monitoring</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">市場實時指數</span>
            </div>
            {lastUpdated && (
              <span className="text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                最後更新: {new Date(lastUpdated).toLocaleString('zh-TW')}
              </span>
            )}
          </div>
          <div className="flex flex-1 justify-around items-center divide-x divide-outline-variant overflow-x-auto no-scrollbar w-full">
            {indices.map((index) => (
              <div key={index._id} className="px-gutter text-center min-w-[150px] group cursor-default">
                <div className="font-label-sm text-[10px] text-on-surface-variant mb-1 group-hover:text-primary transition-colors">
                  {index.name}
                </div>
                <div className="font-data-mono text-primary font-bold">
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
