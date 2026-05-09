import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'partner',
  title: '合作夥伴 (Partner)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '公司名稱 (Company Name)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '分類 (Category)',
      type: 'string',
      options: {
        list: [
          { title: '物流 Logistics', value: 'logistics' },
          { title: '檢驗 Inspection', value: 'inspection' },
          { title: '製造 Manufacturing', value: 'manufacturing' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: '評分 (Rating)',
      type: 'number',
      description: '例如: 4.9',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'reviewCount',
      title: '評論數 (Review Count)',
      type: 'string',
      description: '例如: 1.2k',
    }),
    defineField({
      name: 'description',
      title: '簡介 (Description)',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: '公司圖片 (Company Image)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isTopRated',
      title: '是否為頂級評價 (Top Rated)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hub',
      title: '所屬專題 (Hub)',
      type: 'reference',
      to: [{ type: 'hub' }],
      description: '選擇此夥伴屬於哪個專題生態系 (選填)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
})
