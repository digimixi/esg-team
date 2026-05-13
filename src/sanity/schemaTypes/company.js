export const company = {
  name: 'company',
  title: '企業會員 (Company Members)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '企業名稱',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'taxId',
      title: '統一編號 (Tax ID)',
      type: 'string'
    },
    {
      name: 'logo',
      title: '企業 Logo',
      type: 'image'
    },
    {
      name: 'industry',
      title: '產業類別',
      type: 'string',
      options: {
        list: [
          { title: '鋼鐵製造', value: 'steel' },
          { title: '石墨/碳素', value: 'graphite' },
          { title: '供應鏈貿易', value: 'trading' },
          { title: '其他重工業', value: 'heavy-industry' }
        ]
      }
    },
    {
      name: 'verificationStatus',
      title: '認證狀態',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: '未認證', value: 'pending' },
          { title: '自盤查中', value: 'self-auditing' },
          { title: '第三方驗證完成', value: 'verified' }
        ]
      }
    },
    {
      name: 'description',
      title: '企業簡介',
      type: 'text'
    }
  ]
}
