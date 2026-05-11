export default {
  name: 'eduPage',
  title: '科普專題頁面 (Education Page)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '頁面主標題 (Main Title)',
      type: 'string',
      description: '例如：電弧爐煉鋼之火：解構石墨電極技術',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: '頁面副標題 (Subtitle)',
      type: 'string',
      description: '例如：Graphite Electrodes in EAF — The Science of Metal Production',
    },
    {
      name: 'slug',
      title: 'URL 代碼 (Slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'hub',
      title: '所屬產業專案 (Belongs to Hub)',
      type: 'reference',
      to: [{ type: 'hub' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishDate',
      title: '發布日期',
      type: 'date',
    },
    {
      name: 'gallery',
      title: '專題圖片藝廊 (Image Gallery)',
      description: '第一張圖將作為主封面圖，後續圖片將顯示為縮圖。',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    },
    
    // 側邊欄配置
    {
      name: 'sidebar',
      title: '側邊欄諮詢區配置 (Sidebar Config)',
      type: 'object',
      fields: [
        { name: 'title', title: '諮詢區標題', type: 'string', initialValue: 'Technical Inquiry' },
        { name: 'description', title: '諮詢區描述', type: 'text', initialValue: 'Request technical specifications or a quote for your facility.' },
        { name: 'buttonText', title: '按鈕文字', type: 'string', initialValue: 'Submit Inquiry / 發送' }
      ]
    },

    {
      name: 'introduction',
      title: '內容前言 (Introduction)',
      type: 'text',
      rows: 5,
    },

    // 核心特點 (兩欄位)
    {
      name: 'featureHighlights',
      title: '核心特點區塊 (Feature Highlights)',
      description: '展示在標題下方的兩個重點區塊',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: '特點名稱', type: 'string' },
            { name: 'description', title: '特點描述內容', type: 'text' },
            { 
              name: 'type', 
              title: '視覺樣式', 
              type: 'string',
              options: {
                list: [
                  { title: '專業黑 (Primary)', value: 'primary' },
                  { title: '工業藍 (Secondary)', value: 'secondary' },
                  { title: '中性灰 (Surface)', value: 'surface' }
                ]
              }
            }
          ]
        }
      ],
      validation: (Rule) => Rule.max(2),
    },

    // 技術表格配置
    {
      name: 'techTableConfig',
      title: '技術表格配置 (Technical Table)',
      type: 'object',
      fields: [
        { name: 'title', title: '表格標題', type: 'string', initialValue: 'Technical Data & Classification / 產品分類' },
        {
          name: 'headers',
          title: '表格欄位標題 (Table Headers)',
          type: 'object',
          fields: [
            { name: 'h1', title: '第 1 欄標題', type: 'string', initialValue: 'Grade (等級)' },
            { name: 'h2', title: '第 2 欄標題', type: 'string', initialValue: 'Application (應用)' },
            { name: 'h3', title: '第 3 欄標題', type: 'string', initialValue: 'Density (參數)' },
            { name: 'h4', title: '第 4 欄標題', type: 'string', initialValue: 'Material (原材料)' }
          ]
        },
        {
          name: 'rows',
          title: '表格內容行 (Table Rows)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'c1', title: '第 1 欄內容', type: 'string' },
                { name: 'c2', title: '第 2 欄內容', type: 'string' },
                { name: 'c3', title: '第 3 欄內容', type: 'string' },
                { name: 'c4', title: '第 4 欄內容', type: 'string' },
                { name: 'isHighlight', title: '是否高亮此行', type: 'boolean' }
              ]
            }
          ]
        }
      ]
    },

    // 優勢 Bento Grid
    {
      name: 'advantagesSection',
      title: '優勢矩陣配置 (Advantageous Bento Grid)',
      type: 'object',
      fields: [
        { name: 'title', title: '區塊標題', type: 'string', initialValue: 'Industrial Advantages / 技術優勢' },
        {
          name: 'items',
          title: '優勢卡片內容',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: '卡片標題', type: 'string' },
                { name: 'description', title: '描述', type: 'text' },
                { name: 'icon', title: '圖標名稱 (Google Material Icon)', type: 'string', description: '例如: bolt, eco, layers, settings' },
                { 
                  name: 'style', 
                  title: '樣式等級', 
                  type: 'string',
                  options: {
                    list: [
                      { title: '黑色強調 (Primary)', value: 'primary-container' },
                      { title: '藍色背景 (Secondary)', value: 'secondary-container' },
                      { title: '灰色背景 (Surface)', value: 'surface-high' },
                      { title: '白色卡片 (White)', value: 'white' }
                    ]
                  }
                },
                { name: 'isWide', title: '是否佔用兩倍寬度', type: 'boolean' }
              ]
            }
          ]
        }
      ]
    },

    // FAQ
    {
      name: 'faqSection',
      title: '問答區配置 (FAQ Section)',
      type: 'object',
      fields: [
        { name: 'title', title: 'FAQ 標題', type: 'string', initialValue: 'Technical FAQ / 常見問題' },
        {
          name: 'questions',
          title: '問答清單',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'question', title: '問題', type: 'string' },
                { name: 'answer', title: '回答內容', type: 'text' }
              ]
            }
          ]
        }
      ]
    }
  ]
}
