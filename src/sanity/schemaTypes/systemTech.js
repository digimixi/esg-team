export const systemTech = {
  name: 'systemTech',
  title: '系統導入技術 (System Tech)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '技術/模組名稱',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: '技術分類',
      type: 'string',
      options: {
        list: [
          { title: 'AI 運算 / 自然語言處理 (AI / NLP)', value: 'ai' },
          { title: '數據採集 / 排程 (Data Sync / Cron)', value: 'ingest' },
          { title: '前端互動 / 金融終端 (UI / Ticker)', value: 'frontend' },
          { title: '全域架構 / 數據治理 (Arch / Governance)', value: 'core' }
        ]
      }
    },
    {
      name: 'path',
      title: '核心調度路徑與底層架構',
      type: 'string',
      description: '例如: src/app/api/ingest-url/route.js'
    },
    {
      name: 'status',
      title: '運行狀態',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: '啟用中 (Active)', value: 'active' },
          { title: '排程啟用中 (Cron Active)', value: 'cron' },
          { title: '備用待命 (Standby)', value: 'standby' }
        ]
      }
    },
    {
      name: 'benefit',
      title: '核心效益與功能說明',
      type: 'text',
      rows: 4
    },
    {
      name: 'deployedAt',
      title: '導入日期',
      type: 'date',
      initialValue: (new Date()).toISOString().split('T')[0]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      status: 'status'
    },
    prepare({ title, subtitle, status }) {
      const statusIcons = {
        active: '🟢',
        cron: '⏰',
        standby: '🟡'
      };
      return {
        title: `${statusIcons[status] || '⚪'} ${title}`,
        subtitle: `${subtitle} | ${status}`
      }
    }
  }
}
