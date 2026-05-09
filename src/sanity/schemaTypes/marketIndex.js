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
    }
  ],
  preview: {
    select: { 
      title: 'name', 
      subtitle: 'value' 
    }
  }
}
