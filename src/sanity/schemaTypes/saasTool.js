import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'saasTool',
  title: 'SaaS 工具模組 (SaaS Tools)',
  description: '💡 【管理說明】此處的資料會即時同步至前台「工具中心 (esg.team/tools)」。您可以透過調整「是否上架啟用 (isActive)」來組合堆疊或隱藏工具模組。未來如有新開發的工具，也可在此新增，前台會像應用程式商店一樣自動呈現。',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '模組名稱 (Title)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '例如：CBAM 碳邊境稅模擬器'
    }),
    defineField({
      name: 'titleEnglish',
      title: '英文名稱 (English Title)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '例如：CBAM Tariff Simulator'
    }),
    defineField({
      name: 'slug',
      title: '網址代稱 (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '分類與標籤 (Category)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '例如：FREE / 基礎合規'
    }),
    defineField({
      name: 'description',
      title: '功能描述 (Description)',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Material Icon 名稱',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '填寫 Google Material Symbols 名稱，例如：calculate, api, account_balance_wallet'
    }),
    defineField({
      name: 'href',
      title: '連結路徑 (Link URL)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '工具內頁路徑，例如：/tools/cbam。若是未解鎖模組可填寫 #'
    }),
    defineField({
      name: 'badge',
      title: '角標文字 (Badge Text)',
      type: 'string',
      description: '例如：試用中, 沙盒模式, 企業版限定'
    }),
    defineField({
      name: 'badgeColor',
      title: '角標顏色 (Badge Tailwind Class)',
      type: 'string',
      description: '例如：bg-blue-500, bg-amber-500, bg-primary'
    }),
    defineField({
      name: 'isEnterprise',
      title: '是否為企業版限定 (Enterprise Only)',
      type: 'boolean',
      initialValue: false,
      description: '若開啟，前端會顯示鎖頭圖示並阻止點擊進入。'
    }),
    defineField({
      name: 'isActive',
      title: '是否上架啟用 (Is Active)',
      type: 'boolean',
      initialValue: true,
      description: '若關閉，前端工具中心將完全隱藏此模組。'
    }),
    defineField({
      name: 'order',
      title: '排序權重 (Order)',
      type: 'number',
      initialValue: 0,
      description: '數字越小排越前面'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      isActive: 'isActive'
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title: title,
        subtitle: `${isActive ? '🟢 上架中' : '🔴 已隱藏'} | ${subtitle}`
      };
    }
  }
});
