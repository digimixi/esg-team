export const rfq = {
  name: 'rfq',
  title: '詢價單 (RFQs)',
  type: 'document',
  fields: [
    {
      name: 'buyerCompany',
      title: '買家公司 (Buyer Company)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'contactName',
      title: '聯絡人',
      type: 'string'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'productInterest',
      title: '詢價產品需求',
      type: 'text'
    },
    {
      name: 'referral',
      title: '引薦夥伴 (Referred By)',
      type: 'reference',
      to: [{ type: 'broker' }],
      description: '透過推薦網址 (ref=ESG-XXX) 自動綁定的引薦人'
    },
    {
      name: 'status',
      title: '處理狀態 (Status)',
      type: 'string',
      options: {
        list: [
          { title: '新詢價', value: 'new' },
          { title: '處理中', value: 'processing' },
          { title: '已報價', value: 'quoted' },
          { title: '結案', value: 'closed' }
        ]
      },
      initialValue: 'new'
    }
  ],
  preview: {
    select: {
      title: 'buyerCompany',
      subtitle: 'productInterest'
    }
  }
}
