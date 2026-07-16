export const brokerCase = {
  name: 'brokerCase',
  title: '協作引薦案件 (Partner Cases)',
  type: 'document',
  fields: [
    {
      name: 'broker',
      title: '引薦人 (Partner)',
      type: 'reference',
      to: [{ type: 'broker' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'clientCompany',
      title: '客戶公司名稱',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'contactName',
      title: '聯絡人姓名',
      type: 'string'
    },
    {
      name: 'productInterest',
      title: '可能需求產品',
      type: 'string'
    },
    {
      name: 'customerPainPoint',
      title: '客戶痛點 / 備註',
      type: 'text'
    },
    {
      name: 'status',
      title: '案件進度 (Status)',
      type: 'string',
      options: {
        list: [
          { title: '待平台審核', value: 'pending' },
          { title: '有效案件 (評估中)', value: 'evaluating' },
          { title: '商務接洽中', value: 'negotiating' },
          { title: '已成交', value: 'closed_won' },
          { title: '無效 / 重複案件', value: 'invalid' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'commissionStatus',
      title: '分潤資格 (Commission Status)',
      type: 'string',
      options: {
        list: [
          { title: '待確認', value: 'pending' },
          { title: '具分潤資格', value: 'eligible' },
          { title: '不適用', value: 'not_eligible' },
          { title: '已結算', value: 'settled' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'adminNotes',
      title: '管理員備註',
      type: 'text'
    }
  ],
  preview: {
    select: {
      title: 'clientCompany',
      partnerName: 'broker.displayName',
      status: 'status'
    },
    prepare({ title, partnerName, status }) {
      return {
        title: title,
        subtitle: `引薦人: ${partnerName || '未知'} | 狀態: ${status}`
      }
    }
  }
}
