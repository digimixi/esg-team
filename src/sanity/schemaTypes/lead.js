import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'lead',
  title: '商機表單 (Leads)',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: '公司名稱',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactName',
      title: '聯絡人',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: '職稱',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: '電話 / LINE ID',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: '公司所在地',
      type: 'string',
    }),
    defineField({
      name: 'industry',
      title: '產業類型',
      type: 'string',
      options: {
        list: [
          { title: '鋼鐵', value: '鋼鐵' },
          { title: '鑄造', value: '鑄造' },
          { title: '金屬加工', value: '金屬加工' },
          { title: '模具', value: '模具' },
          { title: '建材', value: '建材' },
          { title: '貿易', value: '貿易' },
          { title: '其他', value: '其他' },
        ],
      },
    }),
    defineField({
      name: 'interests',
      title: '有興趣項目',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '增碳劑', value: '增碳劑' },
          { title: '石墨電極', value: '石墨電極' },
          { title: '石墨坩堝', value: '石墨坩堝' },
          { title: '鋼材 / 環保鋼', value: '鋼材 / 環保鋼' },
          { title: '鋼渣資源化', value: '鋼渣資源化' },
          { title: 'ESG / 碳資料', value: 'ESG / 碳資料' },
        ],
      },
    }),
    defineField({
      name: 'volume',
      title: '目前月用量或預估需求',
      type: 'string',
    }),
    defineField({
      name: 'currentSpec',
      title: '目前使用規格',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'hasExportClients',
      title: '是否有出口歐美客戶',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'needsEsgData',
      title: '是否需要產品碳足跡或 ESG 供應鏈資料',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'wants',
      title: '希望取得',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '產品規格', value: '產品規格' },
          { title: '樣品測試', value: '樣品測試' },
          { title: '報價', value: '報價' },
          { title: '技術討論', value: '技術討論' },
          { title: '供應鏈碳資料規範', value: '供應鏈碳資料規範' },
        ],
      },
    }),
    defineField({
      name: 'additionalInfo',
      title: '補充說明',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'status',
      title: '處理進度',
      type: 'string',
      options: {
        list: [
          { title: '未處理 (New)', value: 'new' },
          { title: '聯繫中 (Contacted)', value: 'contacted' },
          { title: '評估中 (Evaluating)', value: 'evaluating' },
          { title: '已結案 (Closed)', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'hubSource',
      title: '來源專題 (Hub Slug)',
      type: 'string',
      readOnly: true,
      description: '紀錄客戶是從哪個專題頁面填寫此表單的'
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      subtitle: 'industry',
      contact: 'contactName',
      status: 'status',
      createdAt: '_createdAt',
    },
    prepare({ title, subtitle, contact, status, createdAt }) {
      const statusMap = {
        new: '🔴 未處理',
        contacted: '🟡 聯繫中',
        evaluating: '🔵 評估中',
        closed: '⚪ 已結案'
      };
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : '';
      return {
        title: `${title} - ${contact}`,
        subtitle: `${statusMap[status] || status} | 產業: ${subtitle || '未填寫'} | ${date}`,
      }
    }
  }
})
