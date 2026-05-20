import React from 'react';

/**
 * @component LedgerMetrics
 * @description The 4 Carbon Asset Summary Cards, showing procurement tonnage, Scope 3 emissions, verified % with dynamic SVG ring, and carbon intensity.
 */
const LedgerMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Tonnage */}
      <div className="bg-surface-container-high/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between">
        <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">採購原物料總量</span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-data-mono text-xl font-bold text-primary">
            {metrics.totalVolume.toLocaleString()}
          </span>
          <span className="text-[9px] text-outline">噸 (T)</span>
        </div>
        <span className="text-[8px] text-outline-variant mt-1">涵蓋鋼鐵、石墨與物流運輸</span>
      </div>

      {/* 2. Total Scope 3 */}
      <div className="bg-surface-container-high/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between">
        <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Scope 3 累計排放量</span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-data-mono text-xl font-bold text-error">
            {metrics.totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </span>
          <span className="text-[9px] text-outline">tCO₂e</span>
        </div>
        <span className="text-[8px] text-outline-variant mt-1">自上游原物料開採至運輸之總排</span>
      </div>

      {/* 3. Verified % */}
      <div className="bg-surface-container-high/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between">
        <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">第三方查證比例 (Verified)</span>
        <div className="mt-2 flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
            <svg className="w-8 h-8 -rotate-90">
              <circle className="text-outline-variant/40" strokeWidth="2.5" stroke="currentColor" fill="transparent" r="12" cx="16" cy="16"/>
              <circle className="text-esg-emerald transition-all duration-1000" strokeWidth="2.5" strokeDasharray={`${2 * Math.PI * 12}`} strokeDashoffset={`${2 * Math.PI * 12 * (1 - metrics.verifiedPercent / 100)}`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="12" cx="16" cy="16"/>
            </svg>
            <span className="absolute text-[8px] font-mono font-bold text-primary">{Math.round(metrics.verifiedPercent)}%</span>
          </div>
          <div className="flex-1">
            <span className="font-data-mono text-lg font-bold text-primary">
              {metrics.verifiedPercent.toFixed(1)}%
            </span>
          </div>
        </div>
        <span className="text-[8px] text-outline-variant mt-1">經 SGS/TÜV 等第三方機構簽證</span>
      </div>

      {/* 4. Avg Intensity */}
      <div className="bg-surface-container-high/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between">
        <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">平均排放強度 (Intensity)</span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-data-mono text-xl font-bold text-esg-emerald">
            {metrics.avgIntensity.toFixed(3)}
          </span>
          <span className="text-[9px] text-outline">tCO₂e/t</span>
        </div>
        <span className="text-[8px] text-outline-variant mt-1">較同業重工業基準低 34%</span>
      </div>
    </div>
  );
};

export default LedgerMetrics;
