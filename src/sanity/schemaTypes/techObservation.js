import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'techObservation',
  title: '技術觀察/企業採訪 (Tech Observation)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '標題 (Title)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '例如：久富如何回應農食剩餘資源的場域處理需求？',
    }),
    defineField({
      name: 'subtitle',
      title: '副標題 (Subtitle)',
      type: 'string',
      description: '例如：從設備構想到示範驗證：一項仍需以物料、能耗、排放與產出物數據回答的循環技術觀察。',
    }),
    defineField({
      name: 'slug',
      title: '網址代號 (Slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: '主視覺圖片 (Hero Image)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'relatedHubs',
      title: '關聯產業專題 (Related Hubs)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'hub' }] }],
      description: '選擇相關的母專題（如：農食循環經濟）',
    }),
    defineField({
      name: 'disclaimer',
      title: '頂部防護聲明 (Top Disclaimer)',
      type: 'text',
      initialValue: '本篇收錄代表企業願意進入產業對話與資料補強程序，不代表設備已通過 esg.team 認證。',
    }),
    defineField({
      name: 'introduction',
      title: '採訪背景/簡介 (Introduction)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    // 企業與設備背景
    defineField({
      name: 'companyBackground',
      title: '受訪企業與設備背景 (Company Background)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'item', title: '採訪項目', type: 'string' },
            { name: 'content', title: '企業待填內容', type: 'string' },
            { name: 'requirement', title: '上稿要求', type: 'string' }
          ]
        }
      ]
    }),
    // 工作原理
    defineField({
      name: 'howItWorks',
      title: '設備如何運作 (How it works)',
      type: 'object',
      fields: [
        { name: 'description', title: '運作說明', type: 'text' },
        { name: 'diagram', title: '流程圖 (Diagram)', type: 'image', options: { hotspot: true } }
      ]
    }),
    // 潛在適用物料與邊界
    defineField({
      name: 'materialApplicability',
      title: '潛在適用物料與明確邊界 (Material Applicability)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'material', title: '物料類型', type: 'string' },
            { name: 'status', title: '目前狀態', type: 'string' },
            { name: 'statement', title: '上稿說法', type: 'string' }
          ]
        }
      ]
    }),
    // 技術證據揭露表
    defineField({
      name: 'techEvidence',
      title: '技術證據揭露表 (Technical Evidence)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'item', title: '驗證項目', type: 'string' },
            { name: 'claim', title: '企業主張', type: 'string', initialValue: '待填寫' },
            { name: 'evidence', title: '已提供證據', type: 'string' },
            { name: 'status', title: '目前狀態', type: 'string', options: { list: ['待驗證', '部分確認', '已確認', '待補資料', '關鍵門檻'] } }
          ]
        }
      ]
    }),
    // esg.team 觀察
    defineField({
      name: 'esgObservation',
      title: 'esg.team 初步觀察 (ESG Observation)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    // 建議驗證流程
    defineField({
      name: 'verificationProcess',
      title: '建議示範驗證流程 (Verification Process)',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    // 採訪問答稿
    defineField({
      name: 'faq',
      title: '採訪問答稿 (FAQ)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: '問題', type: 'string' },
            { name: 'answer', title: '回答', type: 'text' }
          ]
        }
      ]
    }),
    // CTA
    defineField({
      name: 'cta',
      title: '行動表單設定 (CTA & Forms)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'action', title: 'CTA 目的', type: 'string' },
            { name: 'description', title: '說明', type: 'string' },
            { name: 'requiredFields', title: '必要欄位', type: 'string' }
          ]
        }
      ]
    })
  ]
})
