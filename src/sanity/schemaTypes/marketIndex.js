export const marketIndex = {
  name: 'marketIndex',
  title: '市場實時指數 (Market Index)',
  type: 'document',
  fields: [
    { 
      name: 'name', 
      title: '指數名稱 (Name)', 
      type: 'string', 
      description: '例如: UHP 600, GPC (98.5% C)' 
    },
    { 
      name: 'unit', 
      title: '單位 (Unit)', 
      type: 'string', 
      description: '例如: USD/MT' 
    },
    { 
      name: 'value', 
      title: '數值 (Value)', 
      type: 'number' 
    },
    { 
      name: 'trendPercentage', 
      title: '漲跌幅度 (Trend %)', 
      type: 'string', 
      description: '例如: +1.2% 或 -0.4%' 
    },
    { 
      name: 'trendStatus', 
      title: '漲跌狀態 (Trend Status)', 
      type: 'string', 
      options: { 
        list: [
          { title: '上漲 (Up)', value: 'up' },
          { title: '下跌 (Down)', value: 'down' },
          { title: '持平 (Neutral)', value: 'neutral' }
        ] 
      } 
    },
    { 
      name: 'order', 
      title: '排序 (Order)', 
      type: 'number',
      description: '決定在前台顯示的先後順序'
    },
    {
      name: 'history',
      title: '趨勢數據 (History Data)',
      type: 'array',
      of: [{ type: 'number' }],
      description: '輸入最近 7 天的數值，用於繪製趨勢曲線'
    },
    {
      name: 'sourceProvider',
      title: '數據源模組 (Source Provider)',
      type: 'string',
      options: {
        list: [
          { title: 'Yahoo Finance', value: 'yahoo_finance' },
          { title: 'Manual (手動輸入)', value: 'manual' }
        ]
      },
      description: '選擇自動抓取的工具模組'
    },
    {
      name: 'sourceSymbol',
      title: '數據源代碼 (Source Symbol)',
      type: 'string',
      options: {
        list: [
          // 鋼鐵類
          { title: '--- 鋼鐵類 (Steel) ---', value: 'HEADER_STEEL' },
          { title: '熱軋鋼捲期貨 (CME HRC Steel)', value: 'HRC=F' },
          { title: '上海鋼筋期貨 (SHFE Rebar)', value: 'RB=F' },
          
          // 鐵礦砂
          { title: '--- 鐵礦砂 (Iron Ore) ---', value: 'HEADER_IRON' },
          { title: '新加坡 62% 鐵礦砂 (SGX Iron Ore)', value: 'TIO=F' },
          
          // 能源與煤炭
          { title: '--- 能源/煤炭 (Energy/Coal) ---', value: 'HEADER_ENERGY' },
          { title: '澳洲紐卡索煤 (Newcastle Coal)', value: 'MTF=F' },
          { title: '大連焦煤期貨 (DCE Coking Coal)', value: 'JM=F' },
          { title: '布蘭特原油 (Brent Crude Oil)', value: 'BZ=F' },
          
          // ESG 與碳排
          { title: '--- ESG/碳排 (Carbon) ---', value: 'HEADER_ESG' },
          { title: '歐盟碳配額 (EU Carbon Emission)', value: 'CFI.L' },
          
          // 其他
          { title: '--- 其他 ---', value: 'HEADER_OTHER' },
          { title: '手動輸入 (需搭配下方代碼欄)', value: 'custom' },
        ]
      },
      description: '選擇要抓取的數據標的。若選「手動輸入」，請參考 Yahoo Finance 代碼。'
    },
    {
      name: 'customSymbol',
      title: '自定義代碼 (Custom Symbol)',
      type: 'string',
      hidden: ({ document }) => document?.sourceSymbol !== 'custom',
      description: '當上方選擇「手動輸入」時，請在此填寫 Yahoo Finance 代碼（如: AAPL, BTC-USD）'
    }
  ],
  preview: {
    select: { 
      title: 'name', 
      subtitle: 'value' 
    }
  }
}
