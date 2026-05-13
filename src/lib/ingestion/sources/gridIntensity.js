/**
 * Source Plugin: Global Grid Intensity
 * 目標：獲取各國最新的電力碳排放強度基準 (tCO2e/MWh)
 */

export async function fetchData() {
  // 這裡未來會接真實 API，例如：https://api.ember-energy.org/
  // 目前我們模擬一組來自權威機構的數據
  return [
    { country: 'China', year: 2023, value: 0.55, source: 'IEA / China Electricity Council' },
    { country: 'European Union', year: 2023, value: 0.23, source: 'Ember Energy' },
    { country: 'United States', year: 2023, value: 0.37, source: 'EPA' },
    { country: 'Taiwan', year: 2023, value: 0.495, source: 'Energy Administration, MOEA' }
  ];
}

export async function transform(rawData) {
  // 將原始數據轉換為 Sanity 中的 industryBenchmark 格式
  return rawData.map(item => ({
    _id: `benchmark-grid-intensity-${item.country.toLowerCase().replace(' ', '-')}`,
    _type: 'industryBenchmark',
    title: `${item.country} 電力排放強度基準 (${item.year})`,
    category: 'intensity',
    currentValue: item.value,
    unit: 'tCO2e/MWh',
    sourceName: item.source,
    description: `自動採集自 ${item.source}。該數據代表 ${item.country} 每度電產生的平均二氧化碳排放量，是計算 Scope 2 排放的核心數據。`,
  }));
}
