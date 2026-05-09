// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
  S.list()
    .title('ESG.TEAM 企業總署')
    .items([
      // 1. 全域設定區 (Singleton)
      S.listItem()
        .title('⚙️ 網站全局設定 (Global Settings)')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('全局設定與各頁面版頭')
        ),
        
      S.divider(),

      // 2. 核心資料庫區 (Folder)
      S.listItem()
        .title('📦 核心資料庫 (Databases)')
        .child(
          S.list()
            .title('資料分類庫')
            .id('databases')
            .items([
              S.documentTypeListItem('product').title('🏭 工業資源目錄 (Product Catalog)'),
              S.documentTypeListItem('insight').title('📰 供應鏈情報 (Supply Chain Insights)'),
              S.documentTypeListItem('marketIndex').title('📈 市場即時指數 (Market Indices)'),
              S.documentTypeListItem('partner').title('🤝 合作夥伴 (Partners)'),
              S.documentTypeListItem('hub')
                .title('🌐 產業專題 (Hubs)')
                .child(
                  S.documentTypeList('hub')
                    .title('產業專題清單')
                    .defaultOrdering([{field: 'isActive', direction: 'desc'}, {field: 'title', direction: 'asc'}])
                ),
            ])
        ),
        
      S.divider(),

      // 3. 未來擴充預留區 (防呆機制，若有忘記歸類的 Schema 會出現在這裡)
      ...S.documentTypeListItems().filter(
        (listItem) => !['siteSettings', 'product', 'insight', 'marketIndex', 'partner', 'hub'].includes(listItem.getId())
      ),
    ])
