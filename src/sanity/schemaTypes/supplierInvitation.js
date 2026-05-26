export const supplierInvitation = {
  name: 'supplierInvitation',
  title: '安全對接邀請日誌 (Supplier Invitations)',
  type: 'document',
  fields: [
    {
      name: 'supplierName',
      title: '供應商名稱',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'email',
      title: '窗口電子信箱',
      type: 'string',
      validation: Rule => Rule.required().email(),
    },
    {
      name: 'materialType',
      title: '原料品項類型',
      type: 'string',
      options: {
        list: [
          { title: '鋼鐵與金屬原料 (Steel)', value: 'steel' },
          { title: '石墨電極與焦炭 (Graphite)', value: 'graphite' },
          { title: '原物料物流運輸 (Logistics)', value: 'logistics' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'token',
      title: '安全對接金鑰 (SHA-256 Token)',
      type: 'string',
      validation: Rule => Rule.required(),
      readOnly: true,
    },
    {
      name: 'status',
      title: '對接狀態',
      type: 'string',
      options: {
        list: [
          { title: '已發送 (Sent)', value: 'sent' },
          { title: '已對接 (Accepted)', value: 'accepted' },
          { title: '已過期 (Expired)', value: 'expired' },
        ],
      },
      initialValue: 'sent',
      validation: Rule => Rule.required(),
    },
    {
      name: 'sentAt',
      title: '發送時間',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    },
    {
      name: 'expiresAt',
      title: '到期時間',
      type: 'datetime',
      validation: Rule => Rule.required(),
    },
    {
      name: 'transactionHash',
      title: '防偽對接交易 Hash',
      type: 'string',
      description: '供應商填報完成後，自動關聯的碳帳本存證交易 Hash (0x...)',
      readOnly: true,
    },
    {
      name: 'sandboxMode',
      title: '沙盒測試模式',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'supplierName',
      subtitle: 'email',
      status: 'status',
    },
    prepare(selection) {
      const { title, subtitle, status } = selection;
      const statusIcon = status === 'accepted' ? '✅' : status === 'expired' ? '❌' : '✉️';
      return {
        title: `${statusIcon} ${title}`,
        subtitle: `${subtitle} [${status.toUpperCase()}]`,
      };
    },
  },
}
