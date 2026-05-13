export const product = {
  name: 'product',
  title: '工業資源目錄 (Product Catalog)',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: '產品名稱 (Title)', 
      type: 'string',
      validation: Rule => Rule.required()
    },
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
      name: 'category',
      title: '產品分類 (Category)',
      type: 'string',
      options: {
        list: [
          { title: '原料 Raw Materials', value: 'raw_materials' },
          { title: '成品 Finished Products', value: 'finished_products' },
          { title: '化學品 Chemicals', value: 'chemicals' },
          { title: '設備 Equipment', value: 'equipment' },
          { title: '服務 Services', value: 'services' },
        ],
      },
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
