export default {
  name: 'solution',
  title: 'ESG 解決方案 (Solutions)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '方案名稱',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'titleEnglish',
      title: '英文名稱',
      type: 'string',
    },
    {
      name: 'slug',
      title: '網址路徑 (Slug)',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: '所屬分類',
      type: 'string',
      options: {
        list: [
          { title: '數位合規 (Digital Compliance)', value: 'compliance' },
          { title: '永續實踐 (Sustainable Practices)', value: 'practices' },
          { title: '綠色材料 (Green Materials)', value: 'materials' },
          { title: '戰略金融 (Strategy & Finance)', value: 'finance' },
        ]
      }
    },
    {
      name: 'heroImage',
      title: '主視覺圖片',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'description',
      title: '方案簡介',
      type: 'text',
      rows: 3
    },
    {
      name: 'badgeText',
      title: '小標籤文字 (Badge)',
      type: 'string',
      initialValue: 'ESG Solution'
    },
    {
      name: 'badgeIcon',
      title: '標籤圖標 (Material Icon Name)',
      type: 'string',
      initialValue: 'verified'
    },
    {
      name: 'cta',
      title: '行動呼籲 (CTA)',
      type: 'object',
      fields: [
        { name: 'label', title: '按鈕文字', type: 'string' },
        { name: 'href', title: '連結路徑', type: 'string' }
      ]
    },
    {
      name: 'bentoSection',
      title: '矩陣區塊 (Bento Grid Section)',
      description: '用於展示核心數據、功能特點或儀表板模擬。',
      type: 'object',
      fields: [
        { name: 'title', title: '區塊標題', type: 'string' },
        {
          name: 'blocks',
          title: '矩陣卡片',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: '標題', type: 'string' },
                { name: 'subtitle', title: '副標題', type: 'string' },
                { name: 'description', title: '描述', type: 'text', rows: 2 },
                { name: 'icon', title: '圖標', type: 'string' },
                { 
                  name: 'size', 
                  title: '尺寸 (Col Span)', 
                  type: 'number', 
                  options: { list: [4, 8, 12] },
                  initialValue: 4
                },
                {
                  name: 'stats',
                  title: '數據展示 (可選)',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        { name: 'label', title: '標籤', type: 'string' },
                        { name: 'value', title: '數值', type: 'string' },
                        { name: 'unit', title: '單位', type: 'string' },
                        { name: 'width', title: '進度條長度 (0-100)', type: 'string' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'journeySection',
      title: '流程/路徑區塊 (Journey Steps)',
      description: '用於展示實施步驟、合規路徑或轉型路線圖。',
      type: 'object',
      fields: [
        { name: 'title', title: '區塊標題', type: 'string' },
        { name: 'subtitle', title: '區塊副標題', type: 'string' },
        {
          name: 'steps',
          title: '步驟清單',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: '步驟標題', type: 'string' },
                { name: 'description', title: '描述', type: 'text', rows: 2 },
                { name: 'icon', title: '圖標', type: 'string' },
                { name: 'tags', title: '標籤 (Tags)', type: 'array', of: [{ type: 'string' }] }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'caseStudySection',
      title: '案例展示 (Case Studies)',
      description: '（目前僅用於永續實踐方案，其他方案可選填）',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: '標題', type: 'string' },
            { name: 'description', title: '描述', type: 'text' },
            { name: 'image', title: '圖片', type: 'image' },
            { name: 'tags', title: '標籤', type: 'array', of: [{ type: 'string' }] }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'heroImage'
    }
  }
}
