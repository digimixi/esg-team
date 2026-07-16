import { ProductCheckboxList } from '../components/ProductCheckboxList'
import { VendorPreviewLink } from '../components/VendorPreviewLink'

export const vendor = {
  name: 'vendor',
  title: '供應商資料庫 (Vendors)',
  type: 'document',
  fields: [
    {
      name: 'companyName',
      title: '公司名稱 (Company Name)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: '專屬網址代號 (Slug)',
      type: 'slug',
      options: {
        source: 'companyName',
        maxLength: 96,
      },
      description: '供應商前台專屬頁面的網址路徑 (例: suppliers/green-tech)'
    },
    {
      name: 'previewLink',
      title: '前台預覽',
      type: 'string',
      components: {
        input: VendorPreviewLink
      }
    },
    {
      name: 'email',
      title: '登入用 Email (Login Email)',
      type: 'string',
      description: '供應商登入前台所使用的 Email，必須為有效信箱。\n👉 供應商登入入口：/portal/vendor/login',
      validation: Rule => Rule.required().email().error('請輸入有效的 Email 地址')
    },
    {
      name: 'contactName',
      title: '聯絡人姓名 (Contact Name)',
      type: 'string'
    },
    {
      name: 'status',
      title: '審核狀態 (Status)',
      type: 'string',
      options: {
        list: [
          { title: '待審核 (Pending)', value: 'pending' },
          { title: '已啟用 (Active)', value: 'active' },
          { title: '已拒絕 (Rejected)', value: 'rejected' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'esgCertificates',
      title: 'ESG 認證文件 (ESG Certificates)',
      type: 'array',
      description: '供應商註冊時強制上傳的 ESG 認證文件（ISO 14067 等）。',
      of: [{ type: 'file' }]
    },
    {
      name: 'isPremium',
      title: '是否為付費高級會員 (Premium Vendor)',
      type: 'boolean',
      initialValue: false,
      description: '預留收費標記，付費廠商將擁有更華麗的專屬展示頁面與置頂曝光。'
    },
    {
      name: 'isActive',
      title: '帳號啟用狀態 (Is Active)',
      type: 'boolean',
      initialValue: true,
      description: '關閉此選項可禁止該供應商登入前台'
    },
    {
      name: 'products',
      title: '負責產品 (Managed Products)',
      type: 'array',
      description: '直接勾選下方產品以指派給該供應商。支援搜尋功能。',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      components: {
        input: ProductCheckboxList
      }
    }
  ],
  preview: {
    select: {
      title: 'companyName',
      subtitle: 'email'
    }
  }
}
