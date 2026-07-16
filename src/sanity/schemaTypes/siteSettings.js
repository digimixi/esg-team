export const siteSettings = {
  name: 'siteSettings',
  title: '全站版面設定 (Site Settings)',
  type: 'document',
  fields: [
    {
      name: 'homeHeroTitle',
      title: '首頁主標題 (Home Hero Title)',
      type: 'string',
      initialValue: '建構重工業與供應鏈的未來',
    },
    {
      name: 'homeHeroTitleEnglish',
      title: '首頁主標題 (英文)',
      type: 'string',
      initialValue: 'Connecting Green Materials, Circular Economy, and Sustainable Logic',
    },
    {
      name: 'homeHeroDescription',
      title: '首頁簡介 (Home Hero Description)',
      type: 'text',
      initialValue: 'esg.team 是一個跨領域的永續聚合入口。我們聚焦具備戰略意義的工業板塊，為全球買家與供應商提供去碳化路徑與精準的資源配置系統。',
    },
    {
      name: 'homeHeroImage',
      title: '首頁版頭背景圖 (Home Hero Image)',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'macroSectionTitle',
      title: '宏觀數據區塊主標題',
      type: 'string',
      description: '例如：全球永續宏觀數據',
      initialValue: '全球永續宏觀數據',
    },
    {
      name: 'macroSectionSubtitle',
      title: '宏觀數據區塊副標題 (英文)',
      type: 'string',
      description: '例如：Global ESG Macros',
      initialValue: 'Global ESG Macros',
    },
    {
      name: 'visitorCount',
      title: '總瀏覽人數 (Visitor Count)',
      type: 'number',
      description: '網站上線以來的總瀏覽人數 (自動累加)',
      initialValue: 0,
      readOnly: true
    }
  ],
}
