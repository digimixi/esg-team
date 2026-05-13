export const inventoryEntry = {
  name: 'inventoryEntry',
  title: '排放分錄 (Emission Entries)',
  type: 'document',
  fields: [
    {
      name: 'company',
      title: '所屬企業',
      type: 'reference',
      to: [{ type: 'company' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'period',
      title: '盤查期間',
      type: 'string',
      description: '例如: 2024-Q1, 2024-Full'
    },
    {
      name: 'factor',
      title: '採用係數',
      type: 'reference',
      to: [{ type: 'emissionFactor' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'entryType',
      title: '分錄類型 (Input/Output)',
      type: 'string',
      options: {
        list: [
          { title: '投入 (Input - 能源/物料)', value: 'input' },
          { title: '產出 (Output - 產品/廢棄物)', value: 'output' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'activityData',
      title: '活動數據值',
      type: 'number',
      description: '實際消耗量或產出量 (如度數、公升、公噸)'
    },
    {
      name: 'dataQuality',
      title: '數據品質評分',
      type: 'string',
      initialValue: 'primary',
      options: {
        list: [
          { title: '初級數據 (實測/單據) - 品質優', value: 'primary' },
          { title: '次級數據 (推估/行業平均) - 品質中', value: 'secondary' },
          { title: '預估數據 - 品質低', value: 'estimated' }
        ]
      }
    },
    {
      name: 'evidence',
      title: '內稽證據 (Evidence)',
      type: 'image',
      options: { hotspot: true },
      description: '請上傳原始收據、發票、電表照片或出貨單'
    },
    {
      name: 'aiNote',
      title: 'AI 辨識註記',
      type: 'text',
      readOnly: true,
      description: '由 Gemini 自動生成的單據分析結果'
    },
    {
      name: 'auditStatus',
      title: '內稽審核',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: '草稿', value: 'draft' },
          { title: '已初步驗證', value: 'validated' },
          { title: '數據異常', value: 'flagged' }
        ]
      }
    }
  ],
  preview: {
    select: {
      companyName: 'company.name',
      activityData: 'activityData',
      factorName: 'factor.name',
      factorUnit: 'factor.unit',
      media: 'evidence'
    },
    prepare({ companyName, activityData, factorName, factorUnit, media }) {
      return {
        title: `${companyName || '未知企業'} - ${activityData || 0} ${factorUnit || ''}`,
        subtitle: factorName || '',
        media
      }
    }
  }
}
