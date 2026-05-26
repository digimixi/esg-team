# ESG.TEAM 技術模組與架構規範 (v1.0)
> **本專案之技術實作標準手冊，旨在防止技術債累積與架構混亂。**

---

## 1. 核心開發規範 (Development Standards)

### A. 前後台資料對齊原則
- **所有顯示內容皆須 CMS 化**：禁止在 Next.js 前端代碼中寫死 (Hardcode) 任何商業邏輯文字。
- **欄位命名規範**：Sanity Schema 欄位應同時提供中文與英文對應（如 `title` 與 `titleEnglish`），以支援未來可能的國際化需求。

### B. 文字渲染標準
- **多行文字處理**：對於長篇描述，前端統一使用 `whitespace-pre-line` CSS 類別，以完整保留使用者在 Sanity 後台輸入的「換行符號」。
- **富文本渲染 (Portable Text)**：
    - 使用 `@portabletext/react` 進行渲染。
    - **自定義組件 (Components)**：目前已定義 `h3` (Headline-sm), `h4` (Label-lg), `strong`, `ul`, `li` 的專屬樣式，任何新增的富文本區塊應繼承 `ptComponents` 配置。

---

## 2. 已建立之功能模組 (Module Registry)

### A. 自動化產業洞察模組 (Insights Sync)
- **路徑**：`scripts/sync-insights.mjs`
- **機制**：透過 `rss-parser` 抓取國際 RSS 源，並利用 Sanity Write Token 自動建立 `insight` 文件。
- **排程**：由 `.github/workflows/daily-sync.yml` 管理，每天台灣時間 08:00 自動執行。
- **安全性**：敏感 Token 存放於 GitHub Repository Secrets (`SANITY_WRITE_TOKEN`)。

### B. 市場實時行情模組 (Live Ticker)
- **路徑**：`src/app/hubs/[hubSlug]/page.js` 
- **視覺規範**：包含「行情滾動條」、「最後更新時間戳記」與「Live 閃爍指示燈」。
- **資料來源**：目前由 Sanity `marketIndex` 文件驅動。

### C. 聯絡與轉導模組 (Contact & Routing)
- **功能**：支援「一鍵聯繫團隊」按鈕。
- **邏輯**：按鈕網址由 Sanity 專題文件中的 `contactUrl` 欄位決定，預設為 Line@ 連結。

### D. 智慧情報採集工具箱 (Intelligence Toolbox)
- **路徑**：`src/app/admin/sources/page.js` & `/api/ingest-url`
- **功能**：支援輸入網址，透過 Gemini AI 自動分析網頁並生成 ESG 摘要存入 Sanity。
- **特性**：具備「全區域點擊」與「自動去重」機制。

### E. 精選情報源書籤系統 (Bookmark System)
- **路徑**：`src/app/admin/sources/page.js` & `/api/admin/bookmarks`
- **功能**：允許情報官保存高價值網址，支援一鍵「閃電採集」。

### G. 市場數據模組化引擎 (Market Data Engine)
- **路徑**：`src/lib/market/` & `scripts/sync-market-data.mjs`
- **架構**：採用「轉接器模式 (Adapter Pattern)」。
    - **核心引擎 (Engine)**：負責讀取配置、調度不同 Provider 並統一寫入 Sanity。
    - **供應商模組 (Providers)**：獨立的數據抓取模組（如 Yahoo Finance, Investing Scraper）。
- **特性**：支援「熱插拔」，若需更換數據源，僅需修改 Provider 模組，前端與資料庫結構無需變動。

### H. 工業科普引擎 (Industry Education Engine)
- **路徑**：`src/app/hubs/[hubSlug]/edu/[eduSlug]/page.js`
- **架構特性**：
    - **共用模版 (Shared Template)**：採用動態路由架構，全站產業共用同一套高品質 UI 邏輯。
    - **數據驅動 (Data-Driven)**：內容完全由 Sanity `eduPage` Schema 定義，支援無限新增科普主題。
    - **Stitch 設計對齊**：遵循 Google Stitch 工業設計規範，整合 Bento Grid、技術參數表與互動式 FAQ。
- **核心組件**：
    - `EduImageGallery`：支援多圖切換與縮圖導航的客戶端藝廊組件。
    - **Bento Grid**：支持四種視覺樣式（Primary, Secondary, Surface, White）的優勢卡片矩陣。
- **維護指南**：若需新增產業科普，僅需在 Sanity 後台建立 `eduPage` 文檔並連結至對應的 `hub`。

### I. 高密度數據儀表板 (Compact Benchmark Dashboard)
- **路徑**：`src/app/hubs/[hubSlug]/page.js`
- **設計規範**：採用「小而美」的極簡佈局。
    - **左側資訊區**：整合標題、Data Tags 與斜體行動指引 (Call to Action)。
    - **右側數據區**：橫向單列展示所有數據條 (Single Row Layout)，數據條厚度固定為 `3px`，配備 Data-Mono 專用字體。
- **目的**：在不佔用垂直空間的前提下，提供專業級的數據對比體驗。

### J. 智能數據鏈路與 AI 洞察引擎 (Intelligent AI Pipeline)
- **核心文件**：
    - `src/app/api/ingest/route.js`：調度中心，支援同步觸發採集與分析。
    - `src/lib/ai/analyst.js`：AI 邏輯大腦，負責從數值中提取市場趨勢。
- **運作模式**：
    1. **Data Sensing**：讀取專題下的碳強度基準。
    2. **Logic Mapping**：根據預設的永續發展邏輯（如平均碳強度門檻）進行趨勢分類（看多、風險、穩定）。
    3. **Automated Synthesis**：生成帶有打字機動態效果的分析文字與信心指數。
- **視覺規範 (Neural UI Pattern)**：AI 區塊必須具備「發光神經網絡背景」與「即時處理呼吸燈」，以視覺方式強調系統的智能化特質。

### K. 情報源追溯與知識圖譜自動產生 (Linked Intelligence & ESG Standards Mapping)
- **路徑**：`src/app/api/ingest-url/route.js` & `src/sanity/schemaTypes/insight.js`
- **機制**：
    - 在情報採集時，由 Gemini AI (gemini-flash-latest) 自動分析網頁內容，判斷並自動標記直接關聯的國際/區域 ESG 合規或申報標準（例如：ISO 14064, ISO 14067, CBAM, TCFD, GRI, ISSB, SBTi）。
    - 數據存儲於 `insight` 模型的 `standards` 欄位（`array` of `string`）。
- **目的**：建立高度信賴與智慧化的情報溯源網絡，消除人工標籤成本，支撐前台知識圖譜與標準導航。

### L. 歐盟 CBAM 碳邊境稅動態模擬器 (Dynamic CBAM Simulator)
- **路徑**：`src/components/CbamCalculator.js` & `src/app/hubs/[hubSlug]/supply-chain/page.js`
- **機制**：
    - 作為一個獨立的客戶端互動式元件（Client Component），模擬歐盟 CBAM 官方規章中的碳關稅曝險。
    - 整合歐盟 2026-2034 官方逐年遞減之免費額度比率（Phase-in rate），並引進 CBAM Article 9 條款以抵免原產國已支付的碳費/碳稅。
    - **實時碳價連動**：在伺服器端抓取 Sanity 中的跑馬燈指數（`marketIndex`），若偵測到 EU ETS/歐盟碳價數據，則自動作為計算器的預設碳價基準。
    - **實時碳價自動更新對接機制 (Real-time Carbon Price Integration)**:
        - **核心數據鏈路 (方案 A - Yahoo Finance)**:
            - 利用系統已有的 [yahoo.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/lib/market/providers/yahoo.js) 轉接器，將 Sanity 中的 `index-carbon-eu` (歐盟碳配額 EUA) 的 `sourceProvider` 設為 `yahoo_finance`，`sourceSymbol` 設為 `CFI2Y.F`。
            - 執行 [sync-market-data.mjs](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/scripts/sync-market-data.mjs) 時，會定時從 Yahoo Finance 抓取 ICE 交易所之 EUA 期貨行情並更新至 Sanity。
            - 計算器 `CbamCalculator.js` 從 Sanity 拉取該 EUA 行情，作為動態預設碳價基準，打通「計算器 ➔ 資料庫 ➔ 實時行情」。
        - **前台視覺增強 (方案 B - TradingView Widget)**:
            - 前端嵌入 TradingView 免費提供的官方互動圖表元件，代號為 `EUA1!` (ICE 歐盟碳配額期貨)，免付費且無縫整合，提供高科技感金融走勢圖。
- **目的**：打通後台市場行情與前台合規計算，為全球鋼鐵與重工業買家提供直接的碳邊境稅曝險評估與綠色避險工具。

### M. 供應鏈碳排信任帳本 (Scope 3 Carbon Trust Ledger)
- **路徑**：
    - 主控調度器：[Scope3TrustLedger.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/Scope3TrustLedger.js)
    - 數據頁面：[supply-chain/page.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/app/hubs/[hubSlug]/supply-chain/page.js)
    - 核心子組件目錄：`src/components/ledger/`
        - [mockData.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/mockData.js)：隔離模擬交易數據庫
        - [LedgerHelpPanel.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/LedgerHelpPanel.js)：操作手冊與 Tesla 案例說明面板
        - [LedgerMetrics.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/LedgerMetrics.js)：碳資產統計指標卡片與動態 SVG 環
        - [SupplierInviteModal.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/SupplierInviteModal.js)：安全對接彈窗表單（狀態隔離）
        - [LedgerTable.js](file:///c:/Users/hence/.gemini/antigravity/scratch/esg-team/src/components/ledger/LedgerTable.js)：搜尋過濾工具、分頁與交易列表表格（詳情抽屜）
- **機制**：
    - 作為一個獨立的高內聚模組化元件群，用以呈現與追蹤企業 Scope 3 供應鏈採購原物料與服務之生命週期評估 (LCA) 數據與合規查證狀態。
    - **安全防偽信任鏈**：每筆交易紀錄皆內嵌國際第三方機構（如 SGS、TÜV）的查證證書，並配備不可篡改的「密碼學防偽雜湊值（Ledger Hash 0x...）」，確保 Scope 3 碳盤查數據具備無可置疑的法律審計效力。
    - **動態 LCA A1-A3 排放細分**：視覺化展示原物料在開採（A1）、生產（A2）、運輸（A3）階段之排放佔比，並支援一鍵下載證書 PDF 與同步企業內部碳資產庫。
    - **新供應商安全填報對接 (Secure Invitation Flow)**：內建發起對接彈窗，生成具備時效與防偽安全金鑰 (Token) 的表單鏈結給上游供應商，完成數據的安全封閉採集。
    - **安全供應商無密碼對接郵件流 (Secure Passwordless Onboarding Email Flow)**:
        - **發送通道 (Resend Integration)**:
            - 整合業界成熟的 `Resend` 郵件派發服務。利用其每日 100 封/每月 3,000 封之免費額度，實現 **$0 營運成本**。
        - **安全無密碼填報路徑**:
            - 買方點擊發起對接時，Next.js API 路由利用 Node.js 內建 `crypto` 模組動態生成唯一的時效安全金鑰（Secure Token），並透過 Resend 向供應商發送邀請信。
            - 供應商點擊信中連結（如 `/hubs/[hubSlug]/supply-chain/onboard?token=xxxx`）直接進入免密碼安全填報表單（Light-weight Declaring Form）。
        - **資產儲存與雜湊存證**:
            - 供應商上傳之認證證書直接利用 Sanity API 上傳至 Sanity 免費提供的 5GB 雲端空間，計算檔案 SHA-256 雜湊碼並寫入帳本作為防偽 Hash（Ledger Hash 0x...），完成 100% 零成本之合規信託鏈。
        - **瀏覽器端「零傳輸」企業機密與隱私安全審計機制 (Zero-Transmission Client-Side Cryptographic Audit Desk)**:
            - **技術精髓**：對於極度敏感的重工業 B2B 原物料採購及排碳數據，平台實作了完全基於前端網頁端的本地加密驗證。當稽核員或客戶上傳認證證書檔案（PDF 或圖檔）進行真偽驗證時，檔案**完全不經過網路傳輸、不離開使用者的本機電腦**。
            - **本地密碼學指紋計算**：前端利用 HTML5 File Reader API 直接讀取檔案位元流，並調用 Web 瀏覽器原生的 Web Cryptography API (`window.crypto.subtle.digest`) 在本地毫秒級算出其 SHA-256 特徵指紋，僅將最終指紋與資料庫中的存證雜湊比對。這保障了企業**核心商業機密、製程配方與採購價格 PDF 在驗證真偽時 100% 物理安全與數據隱私**。
            - **封套排除簽章演算法 (Envelope Exclusion Signature)**：針對沙盒模擬或無 PDF 上傳的交易，系統提供動態產生的純文字認證憑證（.txt）。為了解決「證書文件內必須展示存證 Hash，但 Hash 本身也是證書內容一部份，導致修改 Hash 就會改變檔案 SHA-256」的自指謬誤（Self-Referential Paradox），我們實作了 `canonicalizeText` 正規化引擎：
                - **規範化處理**：將所有跨作業系統換行符號（CRLFs, CRs）統一正規化為單一的 `\n`，並去除行尾空白以消除編碼差異。
                - **特徵排除**：在本地計算雜湊前，自動過濾並排除 `存證防偽雜湊` 行。這樣一來，文件內容不論如何下載與散佈，均能與資料庫中對應核心數據（原料、重量、強度等）算出的雜湊指紋完美吻合。只要核心數據遭到任何 1 位元組的綠洗篡改，驗證將瞬間失敗，具備無懈可擊的密碼學防護效力。
    - **操作導航面板 (Manual Panel)**：整合極簡互動式問號按鈕，點擊後即時展開功能目的與使用者操作指南，極大降低系統的學習成本。
- **目的**：打通重工業 Scope 3 供應鏈數據黑盒，防範綠洗風險，助企業構建穩固的碳信託邊界。


---

## 3. 性能與視覺優化規範 (Performance & UI/UX)

### A. 圖像處理
- **格式要求**：優先使用 WebP 格式。
- **處理工具**：前端已整合 `browser-image-compression`，用於預處理大尺寸圖像。

### B. 佈局對齊 (Grid Alignment)
- **產品目錄**：為了確保網格整齊，產品描述統一使用 Tailwind `line-clamp-4` 類別進行截斷，避免因文字長短不一導致卡片高度落差。

---

## 4. 維護與故障排除 (Maintenance)

- **Sanity 數據強制更新**：前端數據抓取統一使用 `export const revalidate = 0`，確保後台一改，前台立刻更新。
- **環境變數要求**：新環境部署必須配置 `.env.local` 中的 `PROJECT_ID` 與 `DATASET`。

---
**更新日期：2026/05/11**
**由 AI 建構師與 ESG Team 共同維護**
