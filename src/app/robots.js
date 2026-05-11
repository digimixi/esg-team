export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // 保護管理後台不被搜尋到
    },
    sitemap: 'https://esg.team/sitemap.xml',
  }
}
