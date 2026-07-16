// https://www.sanity.io/docs/structure-builder-cheat-sheet
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export const structure = (S, context) =>
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

      // 2.8 SaaS 工具模組 (SaaS Tools)
      S.listItem()
        .id('saas_tool_center')
        .title('📱 SaaS 工具模組 (SaaS Tools)')
        .child(
          S.documentTypeList('saasTool')
            .id('saas_tool_list')
            .title('前台工具市集管理')
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
              // 升級版：Shopify / Odoo 風格的商品管理目錄
              S.listItem()
                .title('🏗️ 工業資源目錄 (Product Catalog)')
                .id('productCatalogRoot')
                .child(
                  S.list()
                    .title('產品過濾與歸檔')
                    .id('productFilters')
                    .items([
                      orderableDocumentListDeskItem({
                        type: 'product',
                        title: '📦 所有產品 (All Products)',
                        id: 'allProducts',
                        S,
                        context
                      }),
                      S.divider(),
                      S.listItem()
                        .title('🗃️ 依產品類別 (By Product Type)')
                        .id('byProductType')
                        .child(
                          S.list()
                            .title('實體產品分類')
                            .id('productTypeList')
                            .items([
                              orderableDocumentListDeskItem({
                                type: 'product',
                                title: '石墨電極 (Graphite Electrode)',
                                id: 'type_electrode',
                                filter: '_type == "product" && subCategory == "graphite_electrode"',
                                S,
                                context
                              }),
                              orderableDocumentListDeskItem({
                                type: 'product',
                                title: '石墨坩堝 (Graphite Crucible)',
                                id: 'type_crucible',
                                filter: '_type == "product" && subCategory == "graphite_crucible"',
                                S,
                                context
                              }),
                              orderableDocumentListDeskItem({
                                type: 'product',
                                title: '增碳劑 / 碳材 (Carbon Additive)',
                                id: 'type_additive',
                                filter: '_type == "product" && subCategory == "carbon_additive"',
                                S,
                                context
                              }),
                              orderableDocumentListDeskItem({
                                type: 'product',
                                title: '石墨材料 / 其他 (Graphite Materials)',
                                id: 'type_materials',
                                filter: '_type == "product" && subCategory == "graphite_materials"',
                                S,
                                context
                              }),
                            ])
                        ),
                      S.listItem()
                        .title('🗂️ 依價值鏈分類 (By Category)')
                        .id('byCategory')
                        .child(
                          S.list()
                            .title('工業價值鏈')
                            .id('categoryList')
                            .items([
                              S.listItem()
                                .title('關鍵原物料 Strategic Materials')
                                .id('cat_strategic')
                                .child(S.documentTypeList('product').title('關鍵原物料').filter('_type == "product" && category == "strategic_materials"').id('list_cat_strategic')),
                              S.listItem()
                                .title('循環與再生資源 Circular Resources')
                                .id('cat_circular')
                                .child(S.documentTypeList('product').title('循環與再生資源').filter('_type == "product" && category == "circular_resources"').id('list_cat_circular')),
                              S.listItem()
                                .title('特用化學與耗材 Specialty Consumables')
                                .id('cat_specialty')
                                .child(S.documentTypeList('product').title('特用化學與耗材').filter('_type == "product" && category == "specialty_consumables"').id('list_cat_specialty')),
                              S.listItem()
                                .title('節能與製程設備 Cleantech Equipment')
                                .id('cat_cleantech')
                                .child(S.documentTypeList('product').title('節能與製程設備').filter('_type == "product" && category == "cleantech_equipment"').id('list_cat_cleantech')),
                              S.listItem()
                                .title('合規與數位工具 Compliance & Digital')
                                .id('cat_compliance')
                                .child(S.documentTypeList('product').title('合規與數位工具').filter('_type == "product" && category == "compliance_digital"').id('list_cat_compliance')),
                            ])
                        ),
                      S.listItem()
                        .title('🏷️ 依 ESG 標籤 (By ESG Tags)')
                        .id('byEsgTags')
                        .child(
                          S.list()
                            .title('ESG 減碳驅動標籤')
                            .id('esgTagList')
                            .items([
                              S.listItem()
                                .title('📉 低碳替代品 (Low-Carbon)')
                                .id('tag_lowcarbon')
                                .child(S.documentTypeList('product').title('低碳替代品').filter('_type == "product" && "low_carbon" in esgTags').id('list_tag_lowcarbon')),
                              S.listItem()
                                .title('♻️ 資源再生 (Recovery)')
                                .id('tag_recovery')
                                .child(S.documentTypeList('product').title('資源再生').filter('_type == "product" && "recovery" in esgTags').id('list_tag_recovery')),
                              S.listItem()
                                .title('🔋 能源效率 (Energy Efficiency)')
                                .id('tag_energy')
                                .child(S.documentTypeList('product').title('能源效率').filter('_type == "product" && "energy_efficiency" in esgTags').id('list_tag_energy')),
                              S.listItem()
                                .title('⚖️ 碳權與合規 (Carbon Assets)')
                                .id('tag_carbon')
                                .child(S.documentTypeList('product').title('碳權與合規').filter('_type == "product" && "carbon_assets" in esgTags').id('list_tag_carbon')),
                            ])
                        ),
                    ])
                ),
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
              S.documentTypeListItem('scope3Transaction').title('🔗 供應鏈碳帳本交易 (Scope 3 Transactions)'),
              S.documentTypeListItem('supplierInvitation').title('🛡️ 安全對接邀請日誌 (Invitations)'),
              S.documentTypeListItem('vendor').title('🏭 供應商資料庫 (Vendors)'),
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
          'systemTech', 'solution', 'industryBenchmark', 'scope3Transaction',
          'supplierInvitation', 'saasTool', 'vendor'
        ].includes(listItem.getId())
      ),
    ])
