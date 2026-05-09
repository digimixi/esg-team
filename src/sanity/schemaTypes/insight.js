export const insight = {
  name: 'insight',
  title: '供應鏈情報 (Supply Chain Insight)',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: '情報標題 (Title)', 
      type: 'string' 
    },
    { 
      name: 'subtitle', 
      title: '英文副標題 (Subtitle)', 
      type: 'string' 
    },
    {
      name: 'hub',
      title: '所屬專題 (Hub)',
      type: 'reference',
      to: [{ type: 'hub' }],
      description: '選擇此情報屬於哪個專題生態系 (選填)',
    },
    { 
      name: 'category', 
      title: '分類標籤 (Category)', 
      type: 'string', 
      description: '例如: 市場分析, LOGISTICS UPDATE, TECH TRENDS' 
    },
    { 
      name: 'summary', 
      title: '情報摘要 (Summary)', 
      type: 'text' 
    },
    { 
      name: 'authorName', 
      title: '作者名稱 (Author Name)', 
      type: 'string' 
    },
    { 
      name: 'authorRole', 
      title: '作者職位 (Author Role)', 
      type: 'string' 
    },
    { 
      name: 'authorInitials', 
      title: '作者縮寫 (Author Initials)', 
      type: 'string',
      description: '例如: JD'
    },
    { 
      name: 'publishedAt', 
      title: '發布時間 (Published At)', 
      type: 'datetime' 
    },
    { 
      name: 'isFeatured', 
      title: '是否為大版面主推 (Featured Post)', 
      type: 'boolean', 
      initialValue: false,
      description: '勾選後將在情報網格中佔據 2x2 的大版面'
    }
  ],
  preview: {
    select: { 
      title: 'title', 
      subtitle: 'category' 
    }
  }
}
