export const product = {
  name: 'product',
  title: '工業資源目錄 (Product Catalog)',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: '產品名稱 (Title)', 
      type: 'string' 
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
    },
    {
      name: 'hub',
      title: '所屬專題 (Hub)',
      type: 'reference',
      to: [{ type: 'hub' }],
      description: '選擇此產品屬於哪個專題生態系 (選填)',
    },
    { 
      name: 'image', 
      title: '產品圖片 (Image)', 
      type: 'image', 
      options: { hotspot: true }
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
      media: 'image' 
    }
  }
}
