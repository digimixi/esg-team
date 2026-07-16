import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const product = {
  name: 'product',
  title: '工業資源目錄 (Product Catalog)',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    { 
      name: 'title', 
      title: '產品名稱 (Title)', 
      type: 'string',
      validation: Rule => Rule.required()
    },
    orderRankField({ type: 'product' }),
    { 
      name: 'subtitle', 
      title: '英文名稱 (Subtitle)', 
      type: 'string' 
    },
    {
      name: 'slug',
      title: '網址代號 (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'hub',
      title: '所屬專題 (Hub)',
      type: 'reference',
      to: [{ type: 'hub' }],
      description: '選擇此產品屬於哪個專題生態系',
    },
    {
      name: 'vendor',
      title: '所屬供應商 (Vendor)',
      type: 'reference',
      to: [{ type: 'vendor' }],
      description: '選擇此產品所屬的供應商（若是官方自營則留空）',
    },
    {
      name: 'status',
      title: '上架審核狀態 (Status)',
      type: 'string',
      options: {
        list: [
          { title: '草稿 (Draft)', value: 'draft' },
          { title: '待審核 (Under Review)', value: 'under_review' },
          { title: '已發布 (Published)', value: 'published' }
        ]
      },
      initialValue: 'published',
      description: '供應商前台上架的產品預設為待審核'
    },
    {
      name: 'category',
      title: '主分類：工業價值鏈 (Primary Category)',
      type: 'string',
      options: {
        list: [
          { title: '關鍵原物料 Strategic Materials', value: 'strategic_materials' },
          { title: '循環與再生資源 Circular Resources', value: 'circular_resources' },
          { title: '特用化學與耗材 Specialty Consumables', value: 'specialty_consumables' },
          { title: '節能與製程設備 Cleantech Equipment', value: 'cleantech_equipment' },
          { title: '合規與數位工具 Compliance & Digital', value: 'compliance_digital' },
        ],
      },
    },
    {
      name: 'subCategory',
      title: '實體產品分類 (Product Type)',
      type: 'string',
      options: {
        list: [
          { title: '石墨電極 (Graphite Electrode)', value: 'graphite_electrode' },
          { title: '石墨坩堝 (Graphite Crucible)', value: 'graphite_crucible' },
          { title: '增碳劑 / 碳材 (Carbon Additive)', value: 'carbon_additive' },
          { title: '石墨材料 / 其他 (Graphite Materials)', value: 'graphite_materials' },
        ],
      },
    },
    {
      name: 'esgTags',
      title: 'ESG 減碳驅動標籤 (ESG Tags)',
      type: 'array',
      description: '可複選。為此產品打上能解決什麼碳排痛點的屬性標籤。',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '📉 低碳替代品 (Low-Carbon)', value: 'low_carbon' },
          { title: '♻️ 資源再生 (Recovery)', value: 'recovery' },
          { title: '🔋 能源效率 (Energy Efficiency)', value: 'energy_efficiency' },
          { title: '⚖️ 碳權與合規 (Carbon Assets)', value: 'carbon_assets' },
        ]
      }
    },
    { 
      name: 'image', 
      title: '產品主圖 (Main Image)', 
      type: 'image', 
      options: { hotspot: true }
    },
    {
      name: 'images',
      title: '產品圖庫 (Gallery)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    },
    { 
      name: 'gradeBadge', 
      title: '等級標籤 (Grade Badge)', 
      type: 'string', 
      description: '例如: PREMIUM GRADE, CPC GRADE' 
    },
    { 
      name: 'description', 
      title: '產品描述 (Description)', 
      type: 'text' 
    },
    {
      name: 'specifications',
      title: '技術規格 (Specifications)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: '規格名稱', type: 'string' },
            { name: 'value', title: '規格數值', type: 'string' },
          ]
        }
      ]
    },
    {
      name: 'applications',
      title: '應用場景 (Applications)',
      type: 'array',
      of: [{ type: 'string' }]
    },
    { 
      name: 'stock', 
      title: '庫存量 (Stock)', 
      type: 'string', 
      description: '例如: 4,200 MT' 
    },
    { 
      name: 'isFeatured', 
      title: '是否推薦至首頁 (Featured)', 
      type: 'boolean', 
      initialValue: false 
    }
  ],
  preview: {
    select: { 
      title: 'title', 
      subtitle: 'subtitle',
      media: 'image' 
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle,
        media
      }
    }
  }
}
