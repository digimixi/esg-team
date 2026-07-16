export const knowledgeCategory = {
  name: 'knowledgeCategory',
  title: '知識分類 (Knowledge Category)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '分類名稱',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: '網址代號',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    {
      name: 'targetRoles',
      title: '可見角色',
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
    }
  ]
}
