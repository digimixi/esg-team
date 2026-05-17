# esg.team 開發日誌 (Development Log)

本文檔記錄專案的重要里程碑、功能演進與關鍵技術決策。

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
