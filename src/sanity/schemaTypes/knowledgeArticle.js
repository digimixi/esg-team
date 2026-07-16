export const knowledgeArticle = {
  name: 'knowledgeArticle',
  title: '知識卡片 (Knowledge Article)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '卡片標題',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: '所屬分類',
      type: 'reference',
      to: [{ type: 'knowledgeCategory' }]
    },
    {
      name: 'targetRoles',
      title: '可見角色 (若不選則繼承分類設定)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '企業 (Buyer)', value: 'buyer' },
          { title: '供應商 (Vendor)', value: 'vendor' },
          { title: '技術人員 (Tech)', value: 'tech' },
          { title: '協作夥伴 (Partner)', value: 'partner' },
          { title: '業務人員 (Sales)', value: 'sales' }
        ]
      }
    },
    {
      name: 'cardType',
      title: '內容格式',
      type: 'string',
      options: {
        list: [
          { title: '教戰卡 (Playbook)', value: 'playbook' },
          { title: '問答 (FAQ)', value: 'faq' },
          { title: '標準文章 (Standard)', value: 'standard' }
        ]
      },
      initialValue: 'standard',
      validation: Rule => Rule.required()
    },
    // --- Playbook Fields ---
    {
      name: 'playbookWhatIsIt',
      title: '這是什麼？ (簡介)',
      type: 'text',
      hidden: ({ document }) => document?.cardType !== 'playbook'
    },
    {
      name: 'playbookTarget',
      title: '適合推廣對象',
      type: 'string',
      hidden: ({ document }) => document?.cardType !== 'playbook'
    },
    {
      name: 'playbookPainPoint',
      title: '客戶痛點 / 需求切入點',
      type: 'text',
      hidden: ({ document }) => document?.cardType !== 'playbook'
    },
    {
      name: 'playbookSafeScript',
      title: '✅ 安全話術 (你可以這樣說)',
      type: 'array',
      of: [{ type: 'text' }],
      hidden: ({ document }) => document?.cardType !== 'playbook'
    },
    {
      name: 'playbookBannedScript',
      title: '❌ 禁止承諾 (絕對不能說)',
      type: 'array',
      of: [{ type: 'text' }],
      hidden: ({ document }) => document?.cardType !== 'playbook'
    },
    {
      name: 'playbookQuestions',
      title: '初訪該問什麼 (五問法)',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ document }) => document?.cardType !== 'playbook'
    },
    // --- FAQ Fields ---
    {
      name: 'faqQuestion',
      title: '常見問題',
      type: 'string',
      hidden: ({ document }) => document?.cardType !== 'faq'
    },
    {
      name: 'faqAnswer',
      title: '安全回答',
      type: 'text',
      hidden: ({ document }) => document?.cardType !== 'faq'
    },
    // --- Standard Fields ---
    {
      name: 'content',
      title: '文章內容',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ document }) => document?.cardType !== 'standard'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'cardType',
    }
  }
}
