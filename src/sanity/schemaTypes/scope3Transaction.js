export const scope3Transaction = {
  name: 'scope3Transaction',
  title: '供應鏈碳帳本交易 (Scope 3 Transaction)',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: '交易編號',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: '交易日期',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: Rule => Rule.required()
    },
    {
      name: 'supplier',
      title: '供應商名稱',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'material',
      title: '原物料 / 服務名稱',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: '品項分類',
      type: 'string',
      options: {
        list: [
          { title: '鋼鐵與金屬原料 (Steel)', value: 'steel' },
          { title: '石墨電極與焦炭 (Graphite)', value: 'graphite' },
          { title: '原物料物流運輸 (Logistics)', value: 'logistics' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'volume',
      title: '採購重量 (t)',
      type: 'number',
      validation: Rule => Rule.required().positive()
    },
    {
      name: 'intensity',
      title: '產品碳強度 (tCO2e/t)',
      type: 'number',
      validation: Rule => Rule.required().positive()
    },
    {
      name: 'emissions',
      title: '總碳排放量 (tCO2e)',
      type: 'number',
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: '合規審查狀態',
      type: 'string',
      initialValue: 'self-declared',
      options: {
        list: [
          { title: '自主申報 (Self-Declared)', value: 'self-declared' },
          { title: '⚡ ERP 系統直連 (ERP Synced)', value: 'erp-synced' },
          { title: '審查中 (Auditing)', value: 'auditing' },
          { title: '第三方已驗證 (Verified)', value: 'verified' }
        ]
      }
    },
    {
      name: 'auditor',
      title: '查證機構 / 說明',
      type: 'string',
      initialValue: '自主申報 (未查證)'
    },
    {
      name: 'standard',
      title: '碳排放計算標準',
      type: 'string',
      initialValue: 'GHG Protocol Corporate Standard (Self-Reported)'
    },
    {
      name: 'hash',
      title: '防偽信託憑證雜湊值 (Ledger Hash)',
      type: 'string'
    },
    {
      name: 'breakdown',
      title: '排放階段細分',
      type: 'object',
      fields: [
        { name: 'extraction', title: 'A1 開採階段排放', type: 'number' },
        { name: 'manufacturing', title: 'A2 製造階段排放', type: 'number' },
        { name: 'logistics', title: 'A3 運輸階段排放', type: 'number' }
      ]
    },
    {
      name: 'certificateFile',
      title: '第三方驗證證書 (PDF/Image)',
      type: 'file',
      description: '上傳供應商提供的 SGS/TÜV 驗證證書或其他合規證明文件'
    }
  ],
  preview: {
    select: {
      title: 'supplier',
      subtitle: 'material',
      emissions: 'emissions'
    },
    prepare({ title, subtitle, emissions }) {
      return {
        title: `${title} - ${subtitle}`,
        subtitle: `總碳排: ${emissions || 0} tCO2e`
      }
    }
  }
}
