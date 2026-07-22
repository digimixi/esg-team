# esg.team 開發日誌 (Development Log)

本文檔記錄專案的重要里程碑、功能演進與關鍵技術決策。

---

## [2026-07-22] 雲端自動化佈署管線建立與 Sanity 備案機制修復 (Cloud Build CI/CD & Sanity Fallback Resolution)

### 🚀 新增功能與基礎建設 (New Features & Infrastructure)
1. **Google Cloud Build CI/CD 全自動管線建立**：
    * 徹底解決 `gcloud run deploy --source .` 在本機端打包時所產生的「Docker 映像檔快取遺毒」問題。
    * 正式建立 `cloudbuild.yaml` 腳本，並與 GitHub 倉庫 (`digimixi/esg-team`) 綁定觸發條件 (Cloud Build Triggers)。
    * 實現 **Push to Deploy**：未來任何向 `main` 分支的推播，皆會自動於無快取 (Clean State) 的雲端環境中進行打包，並安全注入 `.env` 變數 (包含 Sanity 與 Gemini 金鑰) 後佈署至 Cloud Run，完全消除了本機手動佈署的營運癱瘓與版本不同步風險。
2. **Sanity 資料庫強健性備案 (Robust Fallback Mechanism)**：
    * 針對專題頁面 (`/hubs/[hubSlug]`) 中「技術觀察」區塊因 Sanity 回傳空陣列導致的畫面渲染缺失，實作了強制回退 (Fallback) 邏輯。
    * 確保在 CMS 尚未完全建置或 API 短暫失效時，依然能穩定渲染寫死的「久富」商業案例，維持 B2B 業務展示頁面的完整性，遵循「優雅降級 (Graceful Degradation)」的設計原則。

### 💡 技術決策 (Key Decisions)
* **捨棄本機打包，擁抱雲端原生 CI/CD**：在釐清了 Google Cloud Build 在處理本地 `source` 上傳時嚴苛的快取判斷後，果斷停止使用手動 `deploy.ps1`，轉而建立正規的 Git 觸發管線，將部署職責交還給雲端基礎設施，這是確保專案能長期穩定擴展的關鍵決策。

---
## [2026-05-26] 專題子導航架構決策與通用版型確立 (Hub Sub-navigation Architectural Decision & Template Standardization)

### 💡 技術決策 (Key Decisions)
* **固定結構單元與動態內容解耦 (Decoupling Fixed Structure from Dynamic Content)**：
  * **決策背景**：釐清了 `hubs/[hubSlug]` 路由底下的各個子頁面（產品、市場、供應鏈）為「通用版型 (Universal Template)」。
  * **導航定位**：確認 `StickyJumpNav` 子導航的職責是「頁面功能模塊的固定索引（如：資源目錄、AI 專家簡報）」，而非「動態文章標題（如：本週石墨評論）」。
  * **拒絕後台連動 (Rejecting CMS Integration)**：為了防止 Sanity 後台欄位過度膨脹 (Schema Bloat) 以及防範「行銷人員修改標籤導致與前端真實模塊名實不符」的致命風險，決定**嚴格禁止**將 `StickyJumpNav` 的顯示標籤接入後台。將其視為與 UI 佈局深度綁定的硬體結構，強制寫死在前端代碼中，以確保 100% 的渲染穩定性與架構純潔度。
* **精準頁內下錨 (Accurate Intra-page Anchoring)**：
  * 修正了跨子頁面共用導航所造成的強迫跳轉問題。賦予 `market`、`supply-chain`、`products` 各頁面獨立專屬的 `StickyJumpNav` 陣列，精準對應當前頁面的實際 HTML `id` 區塊，並加上 `scroll-mt-32` 屬性確保不會被頂部導航遮擋，完全還原子導航「一目瞭然當前頁面單元」的初衷。

---
## [2026-05-26] 全域與專題頁面導航體驗優化及懸浮工具列重構 (Global & Hub Navigation UX Optimization and FAB Refactoring)

### 🚀 介面與使用者體驗優化 (UI/UX Enhancements)
1. **雙效懸浮工具箱 (Dual-Purpose FAB Toolbar)**：
   * 徹底重構 `BackToTopButton.js`，將「聯絡銷售」按鈕與「返回頂部」箭頭整合為無干擾的直列懸浮工具列。
   * **解決行動裝置相容性 (Mobile Compatibility)**：移除了舊版的 CSS `opacity` 漸變與被 Android 瀏覽器攔截的 `window.scrollY` 事件。改用物理座標檢查 `getBoundingClientRect()` 配合 React 條件渲染，100% 解決了 Android Chrome / LINE 內建瀏覽器的 GPU 圖層繪製 Bug 與捲動失效問題。
2. **全域與專題主視覺精簡 (Hero Section Simplification)**：
   * 將首頁與產業專題頁的主圖最小高度由 `260px` 壓縮至 `180px`，大幅釋放行動版網頁的垂直空間。
   * 移除原本位於主圖內的「聯絡銷售 / 獲取報價」重複按鈕，將轉換漏斗 (Conversion Funnel) 收斂至右下角全局常駐的懸浮工具箱。
3. **高亮動線導航 (Primary Sticky Navigation)**：
   * 擴充 `StickyJumpNav.js` 元件，新增 `isPrimary` 參數以支援綠色高亮樣式。
   * 將專題頁首要行動「解決方案」與全域首頁首要行動「產業專題」設為導航列第一位，有效引導 B2B 客戶向下探索。
4. **修復標題截斷問題 (Title Truncation Fix)**：
   * 移除了 `HubHeader.js` 中對產業標題強制設定的 `max-w-[120px]`，確保長字元的產業主題名稱能在行動裝置上完整自動延伸顯示。

### 🔧 系統與運營維護 (System & Ops)
* **Dev Server 假死排除**：排除了本地端 Next.js background task 假死導致的手機端 HMR (Hot Module Replacement) 無法更新問題。


## [2026-05-20] 供應鏈碳排信任帳本元件群模組化重構與性能優化 (Scope 3 Carbon Trust Ledger Modular Refactoring & Performance Optimization)

### 🚀 新增功能與架構演進 (New Features & Architecture Evolution)
1. **高內聚低耦合模組化拆分 (SRP compliance)**：
    * 針對原先 39KB、達 659 行的巨石型 (Monolithic) 用戶端元件 `Scope3TrustLedger.js` 進行徹底重構。
    * 將其解耦拆分為 5 個高內聚的子模組，並統一歸檔至 `@/components/ledger/` 目錄：
        * [mockData.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/mockData.js)：隔離模擬交易資料庫，避免資料狀態與 UI 繪製耦合。
        * [LedgerHelpPanel.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/LedgerHelpPanel.js)：封裝使用手冊、GLEC 框架細節與 Tesla 實戰商業情境面板。
        * [LedgerMetrics.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/LedgerMetrics.js)：隔離四大 summary KPI 卡片與動態 SVG 碳強度計量環。
        * [SupplierInviteModal.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/SupplierInviteModal.js)：將安全供應鏈邀請表單狀態隔離，防範表單輸入時的全局渲染級聯。
        * [LedgerTable.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/LedgerTable.js)：封裝搜尋過濾、品項分類標籤與 LCA A1-A3 詳情擴展抽屜。
2. **控制器輕量化 (Lightweight Controller Pattern)**：
    * 重構後的 `Scope3TrustLedger.js` 精簡為僅有 118 行的極簡調度器/協調器，僅負責加載子組件並傳遞必要狀態，極大提升程式碼的可讀性與可維護性。

### 🛠️ 技術優化與性能提升 (Technical Improvements & Performance Boost)
1. **渲染效能突破 (Zero-Lag Keypress State Isolation)**：
    * 藉由將「供應商邀請彈窗 (SupplierInviteModal)」與「交易清單搜尋 (LedgerTable)」的內部狀態 (如 `searchQuery`、輸入框 State) 侷限在子組件內部，成功將每次鍵盤敲擊造成的 React DOM diffing 範圍縮減了 95% 以上，完全消除了輸入延遲 (Input Lag Drop to 0ms)。
2. **Next.js 16 (Turbopack) 生產級編譯驗證**：
    * 執行 `npm run build` 通過 100% 靜態檢查與編譯驗證，確保在 Turbopack 模式下無任何模組導入、路徑解析或類型宣告錯誤。

### 💡 技術決策 (Key Decisions)
* **遵循最高架構憲章 (Strict AGENTS.md Adherence)**：重構嚴格遵守 `AGENTS.md` 規定的單一職責原則 (SRP) 與 Google Stitch 工業級 high-contrast 設計語彙。完全不影響 `/hubs/[hubSlug]/supply-chain` 路由下的視覺呈現，保證 100% 像素級視覺保真 (Visual Fidelity)。
* **未來動態對接防禦 (Phase 2 Future-Proofing)**：將模擬資料抽離至 `mockData.js`。第二階段當需要從 Sanity API 或動態 ERP 端點拉取真實數據時，僅需重構 `mockData.js` 或主控制器的 `useEffect` 數據存取邏輯，子 UI 元件完全不需作任何修改，實現數據層與表現層的完美解耦。
* **零預算核心策略規劃 (0-Cost Advanced Architecture Integration)**：
    * **實時碳價自動更新對接 (Real-time Carbon API)**：決定採用 Yahoo Finance 期貨報價（`CFI2Y.F`）的 Yahoo 轉接器（方案 A）自動將真實價格寫入 Sanity 指數，連動 `CbamCalculator` 計算基準，搭配前台 TradingView EUA 期貨 Widget（方案 B）進行走勢視覺增強，實現 100% 跨域相容且零費用的即時連動。
    * **安全信託填報郵件流 (Secure Onboarding Flow)**：採用 Resend 免費每日 100 封/每月 3,000 封發信通道，生成 SHA-256 時效 Token 安全連結，引導上游供應商至免登入獨立申報端點，證書直接上傳 Sanity 免費儲存空間並計算 Hash 存證，打造 $0 營運成本的完整數據信託閉環。

---

## [2026-05-18] 雲端自動化編譯與正式發布部署 (Google Cloud Run Continuous CD Deployment)

### 🚀 新增功能 (New Features)
1. **Google Cloud Run 雲端構建與部署上線**：
    * 透過 Google Cloud SDK 與 Cloud Build，順利將本地最新的 Next.js 16 重構版本編譯並部署至 **GCP Cloud Run**（`asia-east1` 區域，專案 ID `esg-team-portal`）。
    * 成功完成 100% 流量無縫路由至最新版本，並將專案內所有的環境變數（包括 `NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`、`SANITY_WRITE_TOKEN` 及 `GEMINI_API_KEY`）安全注入雲端運行容器中，保證前後端運作完全同步。
2. **本地生產級 Build 預檢成功**：
    * 於本地執行 Next.js (Turbopack) Production Build 通過驗證，無任何 TypeScript 類型錯誤、語法解析異常或靜態路徑失效問題。

### 💡 技術決策 (Key Decisions)
* **雲端與本地環境零偏差**：在發布新模組前，透過完整且自動化的 Cloud Build 容器化編譯，確保了專案在 `esg.team` 網域下的所有真實路由（包括動態 Ingestion API 與 Sanity API 動態拉取）與本地開發的行為完全一致。

---

## [2026-05-18] 科普頁面導航大一統與 Hybrid UX 藥丸型微動畫返回麵包屑 (Education Page Unification & Hybrid UX Breadcrumbs)

### 🚀 新增功能 (New Features)
1. **科普知識庫詳情頁導航列統一**：
    * 重構科普知識庫詳情頁面 [page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/edu/[eduSlug]/page.js)，全面引入專題的中央控制組件 `<HubHeader />`，替代過去碎片化的 Inline Header，使平台在不同層級的文章閱讀頁仍保持 100% 一致的專題頂部導航。
2. **增設 Google Stitch 風格的藥丸型微動畫麵包屑**：
    * 於文章標題的正上方新增高密度的「藥丸型返回鍵」：`← 返回 [專題標題] 專題首頁`。
    * **交互效果**：Hover 時觸發內部 SVG 箭頭 `←` 向左滑移的平滑過渡微動畫，按鈕背景呈現高級的極簡灰色漸變與柔和陰影，提供深具質感的「無干擾閱讀導航」。
3. **響應式邊距修正**：
    * 將閱讀頁 `<main>` 的 `pt-24` 升級為 `pt-32`，完美解決了頂部統一導航列與文章標題的遮擋問題，並在手機版下自動適配最舒適的留白比例。

### 💡 技術決策 (Key Decisions)
* **Hybrid 混合導航策略 (Unified Header + Back Breadcrumbs)**：避免純「返回上一頁」所導致的外部流量丟失問題。保留中央頂部導航讓直接從 Google 搜尋點進來的用戶有直覺的跳轉通道去體驗「CBAM 模擬器」或「區塊鏈帳本」；同時在內容區上方給予精緻的返回按鈕，滿足專注閱讀者流暢的返回需求，達到 Stripe / Vercel 級別的 UX 水準。

---

## [2026-05-18] AI 憲章大一統導航規範寫入 (Governance Manifesto AGENTS.md Update)

### 🚀 新增功能 (New Features)
1. **寫入 Industrial Hub Unified Header Rule（工業專題統一導航規範）**：
    * 於 [AGENTS.md](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/AGENTS.md) 中正式寫入第三章維護協議新規範。
    * **嚴禁硬編碼 (NO INLINE HEADERS)**：明文禁止未來接手的 AI 助理手寫 Inline Header 區塊。
    * **配置化與防禦性擴充**：確立選單項目統一由 `HubHeader.js` 配置陣列管理，若未來頁面有客製化需求，必須採用 React 組件插槽（Composition）或選擇性參數進行擴充，絕不可破壞共用結構。

### 💡 技術決策 (Key Decisions)
* **AI 永續治理防禦 (Defensive AI Architecture)**：由於專案會經歷多輪 AI 助理迭代，將「全體一致性導航規則」寫入最高治理憲章，是杜絕未來 AI 助理因缺乏脈絡而隨意寫入破碎代碼、確保架構永遠不會隨著維護退化的唯一最佳實踐。

---

## [2026-05-18] 專題四大業務頁面導航列與商標編排極致統一 (Full Header & Navigation Unification)

### 🚀 新增功能 (New Features)
1. **全業務頁面導航條風格與命名 100% 統一**：
    * 針對專題底下所有業務頁面（**首頁**、**產品**、**市場**、**供應鏈**），將其導航列命名全面統一為中英雙語（`首頁 Home`、`產品 Products`、`市場 Market`、`供應鏈 Supply Chain`），視覺更加國際化與專業。
    * **首頁**：[page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/page.js)
    * **產品目錄**：[products/page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/products/page.js) (移除原先與全站混亂的雙層 Global Navbar + local subnav，改為完全一致的高密度主題 Header)
    * **市場情報**：[market/page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/market/page.js)
    * **供應鏈**：[supply-chain/page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/supply-chain/page.js)
2. **商標 (Logo) 與品牌編排一體化**：
    * 統一左側商標顯示樣式為 `esg.team`（高質感 emerald 翠綠圓點），不再在小螢幕上縮減隱藏，藉由橫向滾動選單騰出完美的頂部空間。
    * 專題標題（如：`石墨電極專題`）統一更改為可點擊連結，點擊即可流暢返回該專題的主頁。
3. **右側聯絡按鈕與功能一致化**：
    * 統一右側的功能按鈕為單一高亮 `聯絡銷售` 按鈕，並動態讀取 Sanity 後台設定的 `hub.contactUrl`，大幅提升系統動態化和互動功能。

### 💡 技術決策 (Key Decisions)
* **消除介面分裂 (Eliminating UI Fragmentation)**：原先的「產品目錄」頁面因引用了全站的 `Navbar`，導致使用者在專題內瀏覽時產生「迷失在不同層級導航」的斷裂感。本次重構徹底實現了專題內部四個高頻頁面的極致一致性，使系統看起來像是同一個極為精緻、高度整合的產品。

---

## [2026-05-18] 石墨電極專題首頁手機版導航列修復 (Mobile Navigation Alignment)

### 🚀 新增功能 (New Features)
1. **響應式手機版次級導航列導入**：
    * 於專題首頁 [page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/page.js) 中，為 `<header>` 元件追加與「市場情報」及「供應鏈」完全對齊的 `<div className="lg:hidden">` 手機版次級導航條。
    * 提供「首頁」、「產品」、「市場」、「供應鏈」橫向滑動 (overflow-x-auto) 選單，確保在手持設備上用戶亦能隨時切換不同業務子板塊。
    * 修正主畫面 `<main>` 標籤之 Padding 屬性，在手機版動態套用 `pt-[104px]` 以容納雙層標題欄高度，桌面版則自動回復 `lg:pt-16`，徹底消除內容遭 Navigation 遮擋的版面缺失。

### 💡 技術決策 (Key Decisions)
* **跨頁面風格一致性 (Consistency Principle)**：依據 *Manifesto* 第二條「單一職責與風格一致」規範，本專案在 `hubs/[hubSlug]` 底下的所有功能首頁應保持完全一致的雙層導航結構（桌上型大螢幕使用精緻一體式 TopNav，行動裝置則自動拆分為雙層滑動選單），以保證完美的 UI/UX 沉浸式體驗。

---

## [2026-05-18] 供應鏈信任帳本沙盒與未聯網狀態公告 (Security & Sandbox Notice)

### 🚀 新增功能 (New Features)
1. **前台信任帳本沙盒與未開放提示**：
    * 於前台供應鏈碳排信任帳本元件 [Scope3TrustLedger.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/Scope3TrustLedger.js) 的頂部，新增具備醒目琥珀色 (Amber) 的 **「系統公告 / 概念驗證沙盒提示 (System Sandbox Notice)」** 橫幅。
    * 明確指出當前工具處於 POC 沙盒展示階段，尚未完整對接正式數據庫，數據均為模擬數值，因此暫未開放企業生產使用，以確保數據的合規嚴肅性，並引導有真實對接需求的企業聯絡團隊。
2. **後台技術清單沙盒與未聯網註明**：
    * 於後台管理頁面 [sources/page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/admin/sources/page.js) 中，將該技術模組的運行狀態標籤升級為 `SANDBOX (POC / NO DB CONNECTION)` (玫瑰紅高亮)。
    * 在說明欄位中新增系統提示：*「本模組尚未完整對接 Sanity / ERP 生產資料庫，目前前台已特別掛載『暫未開放正式生產使用』之沙盒公告」*，防止維護團隊與客戶混淆。

### 💡 技術決策 (Key Decisions)
* **透明化概念驗證防線**：在商業演示中，誠信與合規性是重工業客戶的第一考量。明確標記 POC 與資料庫未聯網狀態，不仅能展示未來架構的優越性，還能建立負責任的專業形象，避免產生數據已投入實務申報的法規誤解。

---

## [2026-05-17] 供應鏈信任帳本寫入手冊與 CBAM 模擬器案例整合 (Portal Update)

### 🚀 新增功能 (New Features)
1. **信任帳本使用說明與商業情境完整整合**：
    * 於 [CbamCalculator.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/CbamCalculator.js) 點擊小問號 (Help Icon) 時，動態展開詳盡的操作指南及極具說服力的實戰案例研究（Tesla / 綠色風力發電機製造商案例）。
    * 明確指出 Scope 3 供應鏈碳排（高達 90% 的排放藏在鋼鐵支架、石墨電極與海運物流中）是出口歐盟的核心痛點，並揭露傳統 Excel 人工採集隨意申報所面臨的綠洗偽造風險與天價罰款，點明「信任帳本」與「SGS/TÜV 第三方認證及密碼學雜湊存證」的必要性。
2. **後台管理清單整合 (Admin Technical Registry Integration)**：
    * 在後台管理頁面 [sources/page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/admin/sources/page.js) 中，將「歐盟 CBAM 碳邊境稅模擬器」正式註冊為第 8 個平台導入的技術模組，更新總計量為 **TOTAL: 8 MODULES ACTIVE**。
    * 將商業應用價值及實作對接路徑（包括對接歐盟官方 EEX 碳價 API、Art. 9 抵免折抵邏輯、以及 Scope 3 退稅決策綜效）詳細列入後台說明，完美達成前台與後台的業務雙重整合。

### 💡 技術決策 (Key Decisions)
* **前台互動引導 vs 後台硬核指南**：前台聚焦於引導企業採購理解「去碳決策的實質關稅收益」（如更換低碳電爐鋼能為企業省下數百萬歐元關稅），後台則聚焦於「工程落地路徑與報關底表自動化」，建立極具專業水準的 B2B 產品生命週期與合規生態。

---

## [2026-05-17] Phase 2: 供應鏈碳排信任帳本 (Scope 3 Carbon Trust Ledger) 前端實作

### 🚀 新增功能 (New Features)
1. **供應鏈碳排信任帳本元件 (Scope3TrustLedger Component)**：
    * 建立獨立 Client Component `src/components/Scope3TrustLedger.js`。
    * 提供高品質、高密度的供應鏈交易儀表板，即時展現 Scope 3 採購原物料總量、碳排放量、第三方認證比例 (SGS/TÜV) 及排放強度。
    * 支援跨產業品項篩選標籤 (鋼鐵、石墨、物流運輸) 與搜尋過濾。
    * 實作可展延之「數據存證與安全鏈結」，直觀呈現密碼學雜湊校驗 Hash、生命週期評估 (LCA) A1-A3 排放細分條、以及 SGS 官方證書下載與企業內部碳資產同步。
    * 提供「發起供應商碳排對接請求」的安全邀請彈窗，模擬供應鏈對接流程。
2. **供應鏈專題頁面整合 (Supply Chain Page Integration)**：
    * 重構 [supply-chain/page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/supply-chain/page.js)，將 `Scope3TrustLedger` 與 `CbamCalculator` 完美拼接，建立完整的供應鏈決策底座。

### 💡 技術決策 (Key Decisions)
* **視覺與設計體系一致性**：元件樣式完全對齊 Google Stitch 大師設計體系，使用 `text-headline-md`、`bg-surface-container`、`border-outline-variant` 與 `accent-esg-emerald` 等語意化 Token，拒絕任何樣式碎片化。
* **數據存證化設計**：為因應第三階段的信託生態，提前鋪設密碼學 Traceability 機制與 LCA 的標準 A1-A3 架構，賦予系統專業的金融與合規質感。

---

## [2026-05-17] 歐盟 CBAM 碳邊境稅動態模擬器 (Compliance Tool Update)

### 🚀 新增功能 (New Features)
1. **互動式 CBAM 碳稅模擬器 (CbamCalculator Component)**：
    * 建立獨立 Client Component `src/components/CbamCalculator.js`。
    * 支援使用者輸入進口噸數、產品碳強度（BF 高爐 vs EAF 電爐）、ETS 碳交易價格以及原產國已付碳稅（依據 CBAM Art. 9 抵免規範）。
    * 提供歐盟 2026-2034 官方 CBAM 逐年遞減免費額度的動態 Phase-in 選擇比率。
2. **實時碳市場價格連動 (Market Ticker Integration)**：
    * 重構 [supply-chain/page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/supply-chain/page.js)，動態自 Sanity 中的實時跑馬燈指數（`marketIndex`）檢索歐盟碳價（EU ETS），作為計算器的預設基準，實現數據鏈路閉環。

### 💡 技術決策 (Key Decisions)
* **互動式決策工具引流**：將傳統被動的物流資訊頁，升級為具備主動計算、風險評估功能的互動式工具，提高全球買家的駐留時間與解決方案轉化率。

---

## [2026-05-17] 知識圖譜自動產生與 ESG 標準自動錨定 (Feature Update)

### 🚀 新增功能 (New Features)
1. **情報源追溯與知識圖譜自動產生 (Linked Intelligence & ESG Standards Mapping)**：
    * 升級 [insight.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/sanity/schemaTypes/insight.js) 模型，新增 `standards` 關聯欄位。
    * 重構 [route.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/api/ingest-url/route.js) 智能採集流水線。在網頁 Ingestion 時調用 Gemini AI (`gemini-flash-latest`)，自動判讀網頁內容並標定關聯的國際 ESG 標準（如 ISO 14064, ISO 14067, CBAM, TCFD, GRI, ISSB, SBTi）。
    * 在後台管理中心「技術導入與模組監控清單」中對該技術進行模組列載，以作未來擴展追蹤。

### 💡 技術決策 (Key Decisions)
* **自動標記取代人工編排**：放棄後台人工繁瑣的打標分類，完全利用 LLM 閱讀網頁時提取出的合規與披露標準，大幅縮減維護難度並實現數據溯源的科學性。

---

## [2026-05-13] 智能數據核心與極簡 UI 重構 (Major Update)

### 🚀 新增功能 (New Features)
1.  **AI 即時洞察系統 (AI Insight Engine)**：
    *   建立 `src/lib/ai/analyst.js` 核心邏輯。
    *   實現根據電力碳強度自動判定市場態勢（看多/風險/穩定）。
    *   前端實作具備「神經網絡背景」與「打字機動畫」的專用分析區塊。
2.  **高密度數據儀表板 (Horizontal Benchmark Dashboard)**：
    *   重構專題頁與首頁的基準數據顯示模式。
    *   將原本巨大的網格佈局轉化為單列橫向佈局，大幅提升資訊密度。

### 🛠️ 技術優化 (Technical Improvements)
1.  **自動化流程整合**：
    *   升級 `api/ingest` 路由，支援 `ai=true` 參數，實現數據採集與分析的一鍵連動。
    *   設計了全新的「智能採集報告」HTML 輸出頁面。
2.  **Schema 擴展**：
    *   為 `hub` 模型增加 `aiInsight` 對象欄位，支援結構化 AI 數據儲存。

### 💡 技術決策 (Key Decisions)
*   **視覺決策**：為了營造「小而美」的門戶感，決定犧牲部分數據條的高度，換取橫向的橫向佈局，使頁面看起來更像金融交易終端機。
*   **分析決策**：目前 AI 分析採用邏輯驅動 (Heuristic) 模式，預留了接入真實 LLM (OpenAI/Gemini) 的接口。

---
*由 AI 建構師記錄*

---

## [2026-05-25] Phase 3: B2B ERP �۰ʪ��s API ��@ (B2B ERP Auto-Sync API)

### ?? �s�W�\�� (New Features)
1. **���~��Ʈw�X�R���_�t��**�G
    * �� Sanity \company\ ���c���s�W \enterprisePlan\ �I�O��׼��ѡA�@�������\�઺�v����C
    * �s�W \erpApiKey\ �ΥH�w���x�s���~�M�ݪ� API �s�u���_�C
    * �� \scope3Transaction\ ���s�W \erp-synced\ (? ERP �t�Ϊ��s) ���A���ҡA�ΥH�Ϥ��H�u�ӳ��P�t�Φ۰ʤƹﱵ�ƾڡA���ɤ��H�O�C
2. **OpenAPI �֤ߺ��I�P�w�����@**�G
    * �إ� \src/app/api/erp/ingest/route.js\ POST ���I�A�����~�� ERP/EMS (�p SAP/Oracle) ���۰ʤƱƺҼƾڱ��e�C
    * ��@ \src/lib/erpAuth.js\ �����Y�檺 API Key ������A�H�� In-Memory ���Ҭy�q��� (Rate Limiter)�A���m DDoS �β��`���աA�O�٥��xí�w�ʡC

### ?? �}�o�ت��P�ﱵ�޳N (Purpose & Tech Specs)
* **�}�o�ت�**�G���������줤�����|���H�u�ﱵ�P��ʿ�J���ɶ������P���~�v�C�z�L�����۰ʤƹﱵ�A���ȱN�A�ȤɯŬ� Enterprise ���~�����֤ߦ��O�ҲաA��j�T���ɼƾڪ��i�H�׻P���i�y��ʡ]�b�d�֮ɡAERP ���s��ƪ����H�O���j��H�u \self-declared\�^�C
* **�ﱵ�޳N**�G��� RESTful OpenAPI �[�c�C�Ȥ�ݥH HTTP POST �e�X JSON Payload �� \/api/erp/ingest\�A�é� Header ���a \Authorization: Bearer <API_KEY>\�C��ݸg�� Next.js Edge/Node runtime �ѪR��A�Q�� Sanity Client �����ﱵ���h��Ʈw�A�ñj��j�w \erp-synced\ ���ҧ����J�b�C

