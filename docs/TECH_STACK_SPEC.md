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

### F. 全系統數據溯源監控 (Data Source Registry)
- **路徑**：`src/app/admin/sources/page.js`
- **地位**：**核心透明化組件**。列出所有前台數據（如行情、新聞）的原始來源、更新頻率與連線狀態。
- **⚠️ 警告**：修改此路徑檔案時，絕對禁止移除此視覺組件。

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
**更新日期：2026/05/10**
**由 AI 建構師與 ESG Team 共同維護**
