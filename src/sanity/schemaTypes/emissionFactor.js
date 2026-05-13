export const emissionFactor = {
  name: 'emissionFactor',
  title: '排放係數庫 (Emission Factors)',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: '分類',
      type: 'string',
      options: {
        list: [
          { title: '範疇一：移動源 (燃油)', value: 'scope1-mobile' },
          { title: '範疇一：固定源 (瓦斯/煤)', value: 'scope1-stationary' },
          { title: '範疇二：電力', value: 'scope2-electricity' },
          { title: '範疇三：供應鏈/產品', value: 'scope3' }
        ]
      }
    },
    {
      name: 'name',
      title: '係數名稱',
      type: 'string',
      description: '例如: 台灣電力排碳係數 (2023)'
    },
    {
      name: 'factor',
      title: '排放係數值 (CO2e)',
      type: 'number',
      description: '單位排放量'
    },
    {
      name: 'unit',
      title: '單位',
      type: 'string',
      description: '例如: kg/kWh, t/MT'
    },
    {
      name: 'source',
      title: '來源/版本',
      type: 'string',
      description: '例如: 環境部 6.0.4 版, IPCC AR6'
    },
    {
      name: 'year',
      title: '生效年度',
      type: 'number'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'factor',
      category: 'category'
    },
    prepare({ title, subtitle, category }) {
      return {
        title: `[${category}] ${title}`,
        subtitle: `${subtitle} (${category})`
      }
    }
  }
}
