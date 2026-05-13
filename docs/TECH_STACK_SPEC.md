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
