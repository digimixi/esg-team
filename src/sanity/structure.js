// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
  S.list()
    .id('root')
    .title('ESG.TEAM 企業總署')
    .items([
      // 1. 全域設定區 (Singleton)
      S.listItem()
        .id('global_settings')
        .title('⚙️ 網站全局設定 (Global Settings)')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('全局設定與各頁面版頭')
        ),
        
      S.divider(),

      // 2. 產業入口 (Industry Portal)
      S.listItem()
        .id('portal_center')
        .title('🌐 產業門戶中心 (Portal)')
        .child(
          S.list()
            .id('portal_list')
            .title('門戶管理')
            .items([
              S.documentTypeListItem('hub').title('🎯 產業專題 (Hubs)'),
              S.documentTypeListItem('partner').title('🤝 合作夥伴 (Partners)'),
              S.documentTypeListItem('eduPage').title('📖 教育訓練頁面 (Edu Pages)'),
            ])
        ),

      S.divider(),

      // 2.5 解決方案矩陣 (Solution Matrix)
      S.listItem()
        .id('solution_matrix_center')
        .title('🏗️ 解決方案矩陣 (Solution Matrix)')
        .child(
          S.documentTypeList('solution')
            .id('solution_list')
            .title('企業服務方案')
        ),

      S.divider(),

      // 3. 工業資源與數據 (Industrial Data)
      S.listItem()
        .id('industrial_data_center')
        .title('🏭 工業資源與數據 (Industrial Data)')
        .child(
          S.list()
            .id('industrial_data_list')
            .title('資源與指數')
            .items([
              S.documentTypeListItem('product').title('🏗️ 工業資源目錄 (Product Catalog)'),
              S.documentTypeListItem('industryBenchmark').title('📊 產業基準數據 (Benchmarks)'),
              S.documentTypeListItem('marketIndex').title('📈 市場即時指數 (Market Indices)'),
              S.documentTypeListItem('sourceBookmark').title('🔗 採集來源管理 (Sources)'),
            ])
        ),

      S.divider(),

      // 4. 市場脈動 (Market Pulse)
      S.listItem()
        .id('market_pulse_center')
        .title('📡 市場脈動 (Market Pulse)')
        .child(
          S.documentTypeList('insight')
            .id('insight_list')
            .title('📰 產業最新動態 (Industry News)')
        ),

      S.divider(),

      // 5. ESG 數據治理 (ESG ERP)
      S.listItem()
        .id('esg_erp_center')
        .title('🛡️ ESG 數據治理 (ESG ERP)')
        .child(
          S.list()
            .id('esg_erp_list')
            .title('ESG 管理中心')
            .items([
              S.documentTypeListItem('company').title('🏢 企業會員 (Companies)'),
              S.documentTypeListItem('emissionFactor').title('🧬 排放係數庫 (Emission Factors)'),
              S.documentTypeListItem('inventoryEntry').title('📝 排放分錄 (Inventory Entries)'),
            ])
        ),

      S.divider(),

      // 6. 系統技術導入 (System Tech)
      S.listItem()
        .id('system_tech_center')
        .title('🛠️ 系統技術導入 (System Tech)')
        .child(
          S.documentTypeList('systemTech')
            .id('system_tech_list')
            .title('平台已導入技術與模組清單')
        ),

      S.divider(),

      // 7. 自動掃描區 (防止遺漏)
      ...S.documentTypeListItems().filter(
        (listItem) => ![
          'siteSettings', 'hub', 'partner', 'eduPage',
          'product', 'marketIndex', 'sourceBookmark',
          'insight', 'company', 'emissionFactor', 'inventoryEntry',
          'systemTech', 'solution', 'industryBenchmark'
        ].includes(listItem.getId())
      ),
    ])
