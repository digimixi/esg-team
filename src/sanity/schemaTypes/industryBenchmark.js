export default {
  name: 'industryBenchmark',
  title: '產業基準數據 (Industry Benchmarks)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '指標名稱',
      type: 'string',
      description: '例如：全球電爐鋼平均排放強度',
      validation: Rule => Rule.required(),
    },
    {
      name: 'hub',
      title: '關聯產業專題',
      type: 'reference',
      to: [{ type: 'hub' }],
    },
    {
      name: 'category',
      title: '數據分類',
      type: 'string',
      options: {
        list: [
          { title: '碳排放強度 (Carbon Intensity)', value: 'intensity' },
          { title: '能源消耗 (Energy Consumption)', value: 'energy' },
          { title: '循環率 (Recycling Rate)', value: 'circular' },
          { title: '市場價格參考 (Price Reference)', value: 'price' },
        ],
      },
    },
    {
      name: 'currentValue',
      title: '當前數值 (最新年分)',
      type: 'number',
    },
    {
      name: 'unit',
      title: '單位',
      type: 'string',
      description: '例如：tCO2e/t 或 kWh/t',
    },
    {
      name: 'sourceName',
      title: '來源機構名稱',
      type: 'string',
      description: '例如：IEA, World Steel Association',
    },
    {
      name: 'sourceUrl',
      title: '來源連結 (URL)',
      type: 'url',
    },
    {
      name: 'history',
      title: '歷史數據 (用於圖表)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: '年份', type: 'number' },
            { name: 'value', title: '數值', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'description',
      title: '指標說明',
      type: 'text',
      description: '簡述此指標的定義與計算基準',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sourceName',
    },
  },
}
