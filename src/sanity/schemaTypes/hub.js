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
      name: 'trustSection',
      title: '為什麼可信 (Trust & Traceability Section)',
      type: 'object',
      fields: [
        { name: 'isActive', title: '啟用此區塊', type: 'boolean', initialValue: true },
        { name: 'title', title: '標題', type: 'string', initialValue: '不只供貨，更重視可追溯與可稽核' },
        { name: 'description', title: '描述文案', type: 'text' },
        {
          name: 'points',
          title: '信賴指標 (Trust Points)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: '指標標題', type: 'string', description: '例如：批次追溯' },
                { name: 'description', title: '說明', type: 'string' }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'materialFocus',
      title: '主打產品深度解析 (Material Focus)',
      type: 'array',
      description: '用於展示如「增碳劑」、「石墨電極」等特定主打產品的詳細供應方案',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: '區塊標題', type: 'string', description: '例如：以增碳劑作為低風險的供應鏈導入起點' },
            { name: 'materialName', title: '產品名稱', type: 'string', description: '例如：增碳劑 / 石墨電極' },
            { name: 'description', title: '介紹文案', type: 'text' },
            { 
              name: 'bullets', 
              title: '條列重點群組 (如：可提供資料、適用對象)', 
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'groupTitle', title: '群組標題 (例如：可提供資料)', type: 'string' },
                    { name: 'items', title: '具體項目', type: 'array', of: [{type: 'string'}] }
                  ]
                }
              ]
            },
            { name: 'ctaText', title: '按鈕文字', type: 'string', description: '例如：申請增碳劑樣品' },
            { 
              name: 'image', 
              title: '產品情境圖片', 
              type: 'image', 
              options: { hotspot: true },
              description: '展示產品或應用場景的圖片，若不上傳則會顯示預設科技底紋'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'esgSupport',
      title: 'ESG 與出口歐美支援 (ESG Support Section)',
      type: 'object',
      fields: [
        { name: 'isActive', title: '啟用此區塊', type: 'boolean', initialValue: true },
        { name: 'title', title: '標題', type: 'string', initialValue: '讓材料資料跟得上 ESG 與歐美供應鏈要求' },
        { name: 'description', title: '前言文案', type: 'text' },
        { 
          name: 'capabilities', 
          title: '可協助準備的資料項目', 
          type: 'array',
          of: [{type: 'string'}]
        },
        { name: 'footerText', title: '底部說明文字', type: 'text' }
      ]
    }),
    defineField({
      name: 'processSteps',
      title: '導入流程 (Onboarding Process Steps)',
      type: 'object',
      fields: [
        { name: 'isActive', title: '啟用此區塊', type: 'boolean', initialValue: true },
        { name: 'title', title: '標題', type: 'string', initialValue: '從資料交換到試用導入，降低替換風險' },
        {
          name: 'steps',
          title: '步驟列表',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: '步驟名稱', type: 'string' },
                { name: 'description', title: '說明', type: 'text' }
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
    defineField({
      name: 'valueChainMap',
      title: '顧問專用產業地圖 (Value Chain Map)',
      type: 'object',
      fields: [
        { name: 'isActive', title: '啟用並顯示地圖', type: 'boolean', initialValue: false },
        { name: 'mapTitle', title: '地圖大標題', type: 'string', initialValue: '台灣鋼鐵與鑄造產業鏈 ESG 互動地圖' },
        { name: 'mapSubtitle', title: '地圖副標題', type: 'string', initialValue: 'ESG 顧問專用戰略視圖：整合產業佈局、關鍵物資與循環經濟切入點' },
        {
          name: 'columns',
          title: '欄位設定 (Columns)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: '欄位標題', type: 'string' },
                { 
                  name: 'topColor', 
                  title: '頂部線條顏色', 
                  type: 'string', 
                  options: { list: [
                    { title: '工業藍 (Industrial Blue)', value: 'bg-primary' },
                    { title: '永續綠 (ESG Emerald)', value: 'bg-esg-emerald' },
                    { title: '碳灰黑 (Carbon Black)', value: 'bg-neutral-800' },
                    { title: '科技青 (Tech Cyan)', value: 'bg-cyan-600' },
                    { title: '鍛造紫 (Forge Indigo)', value: 'bg-indigo-600' },
                    { title: '工業橙 (Industrial Amber)', value: 'bg-amber-600' },
                    { title: '深海綠 (Deep Teal)', value: 'bg-teal-700' },
                    { title: '次要灰藍 (Slate Blue)', value: 'bg-secondary' }
                  ]} 
                },
                {
                  name: 'items',
                  title: '標籤項目',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        { name: 'label', title: '標籤文字', type: 'string' },
                        { name: 'type', title: '標籤顏色', type: 'string', options: { list: [{title: '綠色', value: 'green'}, {title: '藍色', value: 'blue'}], layout: 'radio' }, initialValue: 'green' }
                      ]
                    }
                  ]
                },
                { name: 'descriptionTitle', title: '底部列表標題', type: 'string', initialValue: '代表廠商：' },
                { name: 'companies', title: '底部列表內容', type: 'array', of: [{type: 'string'}] }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'prospectMap',
      title: '顧問開發客戶地圖 (Prospect Map)',
      type: 'object',
      fields: [
        { name: 'isActive', title: '啟用開發地圖', type: 'boolean', initialValue: true },
        { name: 'title', title: '區塊標題', type: 'string', initialValue: 'Taiwan Steel-Linked Prospect Map' },
        { name: 'subtitle', title: '中文大標題', type: 'string', initialValue: '台灣鋼鐵關聯產業潛在客戶地圖' },
        { name: 'description', title: '說明文字', type: 'text', initialValue: 'ESG 顧問不一定直接服務鋼鐵廠，但在碳盤查、永續報告、供應鏈盤點與客戶問卷過程中，會接觸大量使用鋼材、鑄件、扣件、金屬零件與高溫製程耗材的企業。這些企業正是 ESG Material Solutions 的導入場景。' },
        {
          name: 'rows',
          title: '客戶名單資料庫 (Database Rows)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'priority', title: '優先級 (Priority)', type: 'string', options: { list: ['S級', 'A級', 'B級'] } },
                { name: 'companyName', title: '公司名稱', type: 'string' },
                { name: 'position', title: '產業位置', type: 'string', options: { list: ['上游 (煉鋼/鋼胚)', '中游 (熱軋/冷軋/製管)', '下游 (扣件/線材)', '下游 (鑄造/鍛造/熱處理)', '下游 (鋼構/營建)'] } },
                { name: 'productType', title: '產品類型', type: 'string' },
                { name: 'painPoints', title: 'ESG 痛點', type: 'string' },
                { 
                  name: 'materials', 
                  title: '可導入材料', 
                  type: 'array',
                  of: [{ type: 'string', options: { list: ['石墨電極', '增碳劑', '石墨坩堝', '低碳鋼材', '鋼渣循環材料', 'Material Passport', '碳資料溯源'] } }]
                },
                { name: 'pitch', title: '顧問切入點 (Pitch)', type: 'string' },
                { name: 'verification', title: '可信度', type: 'string', options: { list: ['Verified', 'Estimated', 'To Verify'] }, initialValue: 'Verified' }
              ]
            }
          ]
        }
      ]
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
