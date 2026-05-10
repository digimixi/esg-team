export const sourceBookmark = {
  name: 'sourceBookmark',
  title: '情報源書籤 (Source Bookmark)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '網站名稱 (Name)',
      type: 'string',
      description: '例如: 聯合新聞網-產業專欄'
    },
    {
      name: 'url',
      title: '網址 (URL)',
      type: 'url',
      description: '要持續監控的網址'
    },
    {
      name: 'description',
      title: '備註 (Note)',
      type: 'text'
    },
    {
      name: 'lastIngestedAt',
      title: '最後採集時間',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url'
    }
  }
}
