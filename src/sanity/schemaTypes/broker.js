export const broker = {
  name: 'broker',
  title: '綠色供應鏈協作夥伴 (Partner)',
  type: 'document',
  fields: [
    {
      name: 'partnerCode',
      title: '專屬推薦碼 (Partner Code)',
      type: 'string',
      description: '例如：ESG-P001',
      validation: Rule => Rule.required()
    },
    {
      name: 'displayName',
      title: '顯示名稱 (Display Name)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'companyName',
      title: '所屬公司 (Company)',
      type: 'string'
    },
    {
      name: 'title',
      title: '職稱 (Title)',
      type: 'string'
    },
    {
      name: 'email',
      title: '登入 Email (Email)',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'level',
      title: '夥伴等級 (Level)',
      type: 'string',
      options: {
        list: [
          { title: 'Level 1: 引薦夥伴', value: 'level_1' },
          { title: 'Level 2: 渠道協作', value: 'level_2' },
          { title: 'Level 3: 產業顧問', value: 'level_3' }
        ]
      },
      initialValue: 'level_1'
    },
    {
      name: 'status',
      title: '帳號狀態 (Status)',
      type: 'string',
      options: {
        list: [
          { title: '待審核 (Pending)', value: 'pending' },
          { title: '已啟用 (Active)', value: 'active' },
          { title: '停權 (Suspended)', value: 'suspended' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'notes',
      title: '管理員備註 (Admin Notes)',
      type: 'text'
    }
  ],
  preview: {
    select: {
      title: 'displayName',
      subtitle: 'partnerCode'
    }
  }
}
