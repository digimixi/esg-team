import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hub',
  title: 'Hub (專題樞紐)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '專題名稱 (Hub Title)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '例如：SteelStream 石墨電極專題、Hydrogen 氫能煉鋼專題',
    }),
    defineField({
      name: 'themeColor',
      title: '主標題顏色 (HEX碼)',
      type: 'string',
      initialValue: '#FFFFFF',
      description: '例如：#FFFFFF (白色) 或 #FCD34D (黃色)。這會影響大標題的顏色。',
    }),
    defineField({
      name: 'slug',
      title: '網址代號 (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: '這會決定前台的網址，例如 graphite, hydrogen 等',
    }),
    defineField({
      name: 'isActive',
      title: '啟用此專題 (Active)',
      type: 'boolean',
      initialValue: true,
      description: '若關閉，此專題將不會在首頁或選單中顯示'
    }),
    defineField({
      name: 'isFeatured',
      title: '設為精選專題 (Featured)',
      type: 'boolean',
      initialValue: false,
      description: '若開啟，此專題將在首頁以較大版位顯示'
    }),
    defineField({
      name: 'tags',
      title: '專題標籤 (Tags)',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['綠色材料', '循環經濟'],
      description: '顯示在卡片上的小標籤'
    }),
    defineField({
      name: 'searchKeywords',
      title: '搜尋關鍵字 (Search Keywords)',
      type: 'text',
      description: '用於自動關聯文章。請用逗號分隔，例如：石墨, 電極, 針狀焦, 電爐, 煉鋼',
    }),
    defineField({
      name: 'heroSubtitle',
      title: '版頭副標題 (Hero Subtitle)',
      type: 'string',
      description: '例如：Industrial Excellence in Every Tonne',
    }),
    defineField({
      name: 'heroSubtitleColor',
      title: '副標題顏色 (HEX碼)',
      type: 'string',
      initialValue: '#FFFFFF',
      description: '設定上方副標題的顏色。',
    }),
    defineField({
      name: 'heroDescription',
      title: '版頭簡介 (Hero Description)',
      type: 'text',
      description: '例如：全球石墨電極、增碳劑及特種鋼鐵資源採購平台。',
    }),
    defineField({
      name: 'heroDescriptionColor',
      title: '簡介文字顏色 (HEX碼)',
      type: 'string',
      initialValue: '#FFFFFF',
      description: '設定下方簡介文字的顏色。',
    }),
    defineField({
      name: 'heroDescriptionEnglish',
      title: '版頭簡介 (英文)',
      type: 'text',
      description: '例如：Global procurement platform for specialized steel resources.',
    }),
    defineField({
      name: 'heroImage',
      title: '版頭背景圖片 (Hero Image)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: '搜尋引擎優化關鍵字 (SEO Alt Text)',
          description: '描述圖片內容以利 Google 搜尋，例如：石墨電極生產現場、自動化鋼鐵製程',
        })
      ]
    }),
    defineField({
      name: 'features',
      title: '核心特點 (Core Features)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: '標題', type: 'string' },
            { 
              name: 'description', 
              title: '描述 (可編排文字)', 
              type: 'array',
              of: [{ 
                type: 'block',
                styles: [
                  {title: 'Normal', value: 'normal'},
                  {title: 'H3', value: 'h3'},
                  {title: 'H4', value: 'h4'},
                ],
                marks: {
                  decorators: [
                    {title: 'Strong', value: 'strong'},
                    {title: 'Emphasis', value: 'em'},
                  ]
                }
              }]
            },
            { name: 'icon', title: '圖標名稱 (Google Symbols)', type: 'string', description: '例如: shield, compress, thermostat' }
          ]
        }
      ]
    }),
    defineField({
      name: 'featureImage',
      title: '特點區塊右側圖片 (Feature Section Image)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'applicationSectionTitle',
      title: '核心特點下方區塊 - 標題 (Title Below Core Features)',
      type: 'string',
      initialValue: '關鍵應用場域'
    }),
    defineField({
      name: 'applicationSectionTitleEnglish',
      title: '核心特點下方區塊 - 英文標題 (English Title Below Core Features)',
      type: 'string',
      initialValue: 'Key Application Matrix'
    }),
    defineField({
      name: 'applications',
      title: '核心特點下方區塊 - 內容列表 (List Below Core Features)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: '標題', type: 'string' },
            { name: 'description', title: '描述', type: 'text' },
            { name: 'icon', title: '圖標名稱', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'specGroups',
      title: '規格與製程解析 (Spec Groups)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: '群組標題', type: 'string' },
            { name: 'icon', title: '群組圖標', type: 'string' },
            { name: 'description', title: '群組描述', type: 'text' },
            { 
              name: 'specs', 
              title: '具體規格項目', 
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: '標籤', type: 'string' },
                    { name: 'value', title: '數值/內容', type: 'string' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'productSectionTitle',
      title: '資源目錄區塊標題 (Product Section Title)',
      type: 'string',
      initialValue: '工業資源目錄'
    }),
    defineField({
      name: 'productSectionDescription',
      title: '資源目錄區塊描述 (Product Section Description)',
      type: 'text',
      initialValue: '為高性能鋼鐵生產提供直接採購解決方案。'
    }),
    defineField({
      name: 'productSectionDescriptionEnglish',
      title: '資源目錄區塊英文描述 (Product Section English Description)',
      type: 'text',
      initialValue: 'Direct sourcing for high-performance production materials.'
    }),
    defineField({
      name: 'quoteButtonText',
      title: '詢價按鈕文字 (Quote Button Text)',
      type: 'string',
      initialValue: '獲取報價'
    }),
    defineField({
      name: 'quoteButtonTextEnglish',
      title: '詢價按鈕英文文字 (Quote Button English Text)',
      type: 'string',
      initialValue: 'REQUEST QUOTE'
    }),
    defineField({
      name: 'contactUrl',
      title: '聯絡/詢價連結 (Contact URL)',
      type: 'string',
      description: '點擊詢價按鈕後的跳轉網址。例如 LINE@ 連結：https://line.me/R/ti/p/@yourid',
      initialValue: 'https://line.me/R/ti/p/@esg.team'
    }),
    defineField({
      name: 'insightSectionTitle',
      title: '情報區塊標題 (Insight Section Title)',
      type: 'string',
      initialValue: '供應鏈情報'
    }),
    defineField({
      name: 'insightSectionTitleEnglish',
      title: '情報區塊英文標題 (Insight Section English Title)',
      type: 'string',
      initialValue: 'Supply Chain Intelligence'
    }),
    defineField({
      name: 'aiInsight',
      title: 'AI 即時洞察 (AI Market Insight)',
      type: 'object',
      fields: [
        { name: 'isActive', title: '啟用 AI 洞察', type: 'boolean', initialValue: true },
        { name: 'trendLabel', title: '趨勢判斷', type: 'string', description: '例如：看多、警戒、穩定轉型' },
        { name: 'insightText', title: '分析文字', type: 'text', rows: 4 },
        { name: 'confidenceScore', title: '信心指數 (%)', type: 'number', validation: Rule => Rule.min(0).max(100) },
        { name: 'analysisDate', title: '分析日期', type: 'datetime', initialValue: (new Date()).toISOString() }
      ],
      description: '由 AI 根據全球數據生成的自動分析摘要'
    }),
  ],
  orderings: [
    {
      title: '按狀態排序 (預設)',
      name: 'statusDesc',
      by: [
        { field: 'isActive', direction: 'desc' },
        { field: 'title', direction: 'asc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      slug: 'slug.current',
      isActive: 'isActive',
    },
    prepare({ title, media, slug, isActive }) {
      return {
        title,
        media,
        subtitle: `${isActive !== false ? '✅ 啟用中' : '❌ 已關閉'} | /hubs/${slug || ''}`,
      }
    }
  },
})
