/**
 * ESG.team 鋼鐵與重工業專屬計算引擎
 * 提供質量平衡分析、碳強度計算與異常預警
 */

export const SteelIndustryEngine = {
  // 1. 核心碳排計算 (活動數據 * 係數)
  calculateEmission: (activityData, factorValue) => {
    return Number(activityData) * Number(factorValue);
  },

  // 2. 鋼鐵生產效率指標 (KPIs)
  calculateSteelMetrics: (entries) => {
    const inputs = entries.filter(e => e.entryType === 'input');
    const outputs = entries.filter(e => e.entryType === 'output');

    // 總成品產出 (假設成品以公噸計)
    const totalSteel = outputs
      .filter(e => e.factor?.name?.includes('成品') || e.factor?.unit === 'MT')
      .reduce((sum, e) => sum + e.activityData, 0);

    // 總電極消耗
    const totalElectrodes = inputs
      .filter(e => e.factor?.name?.includes('電極'))
      .reduce((sum, e) => sum + e.activityData, 0);

    // 總電力消耗
    const totalElectricity = inputs
      .filter(e => e.factor?.category === 'scope2-electricity')
      .reduce((sum, e) => sum + e.activityData, 0);

    // 總碳排 (Scope 1 & 2)
    const totalCO2e = entries.reduce((sum, e) => {
      const emission = (e.activityData || 0) * (e.factor?.factor || 0);
      return sum + emission;
    }, 0);

    return {
      totalSteel,
      totalCO2e,
      carbonIntensity: totalSteel > 0 ? (totalCO2e / totalSteel).toFixed(4) : 0, // 每噸鋼碳強度
      electrodeRate: totalSteel > 0 ? (totalElectrodes / totalSteel).toFixed(2) : 0, // 每噸鋼電極耗損
      powerEfficiency: totalSteel > 0 ? (totalElectricity / totalSteel).toFixed(2) : 0, // 每噸鋼耗電量
    };
  },

  // 3. 內稽異常診斷 (AI 邏輯基礎)
  getAuditInsights: (metrics) => {
    const insights = [];
    
    // 行業基準值對標 (範例數據)
    if (metrics.electrodeRate > 2.5) {
      insights.push({
        level: 'warning',
        message: '電極消耗率異常偏高 ( > 2.5 kg/t)，建議檢查電爐電弧穩定性或單據錄入是否有誤。'
      });
    }

    if (metrics.carbonIntensity > 2.2) {
      insights.push({
        level: 'critical',
        message: '每噸鋼碳強度超過 2.2 tCO2e，高於行業平均，將面臨極大 CBAM 關稅壓力。'
      });
    }

    return insights;
  }
};
