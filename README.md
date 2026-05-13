# ESG.TEAM - 全球產業綠色轉型聚合平台

這是 `esg.team` 專案的核心代碼庫。採用 Next.js + Sanity.io 的現代無頭架構 (Headless Architecture) 建構。

## 🧠 知識庫與規範 (Knowledge Base) - **開發前必讀**

為確保專案架構的一致性，所有參與開發者（含 AI 助理）必須遵循以下規範：

*   **[專案主宣言 (Manifesto)](./docs/ESG_TEAM_MANIFESTO.md)**：定義核心願景與「母子板塊」發展策略。
*   **[技術架構規範 (Tech Spec)](./docs/TECH_STACK_SPEC.md)**：記錄現有模組（如 RSS 同步、富文本渲染）的實作機制。
*   **[AI 協作守則 (Charter)](./docs/AI_COLLABORATION_CHARTER.md)**：AI 助理參與開發時必須遵守的指導原則。

## 🚀 快速開始 (Getting Started)

1. **安裝依賴**：
   ```bash
   npm install
   ```

2. **設定環境變數**：
   建立 `.env.local` 並加入您的 Sanity `PROJECT_ID` 與 `DATASET`。

3. **啟動開發伺服器**：
   ```bash
   npm run dev
   ```

## 🚀 部署與維護指南 (Cloud Run Deployment)

本專案部署於 Google Cloud Run (`asia-east1`)。基於 Next.js 16 的特性，部署時需注意以下經驗總結：

### 1. 核心技術坑 (Lessons Learned)
*   **變數固化 (Inlining)**: Next.js 在編譯時會將 `process.env` 替換為常數。若編譯時變數為空，則運行時無法再動態更改。因此，**必須在構建階段注入真實環境變數**。
*   **Docker 屏蔽遺失**: 預設的 `.dockerignore` 若屏蔽 `*.mjs`，會導致 `next.config.mjs` 遺失，進而讓 `standalone` 模式失效。
*   **API 動態性**: 任何讀取 Secret 的 API 必須設定 `force-dynamic`，否則編譯器會嘗試在沒有密鑰的情況下執行靜態渲染而崩潰。

### 🔧 常見問題與排除 (Troubleshooting)

#### 1. 編譯失敗：Signal SIGSEGV (段錯誤)
*   **現象**：在 Cloud Build 執行 `npm run build` 時崩潰，報錯 `SIGSEGV`。
*   **原因**：Next.js 16 + Turbopack 在編譯大數據頁面時記憶體耗盡 (OOM)。
*   **解決**：將 `Dockerfile` 的 builder 階段從 `node:20-alpine` 換成完整的 `node:20` (Debian 基礎)，提供更穩定的記憶體管理。

#### 2. 編譯失敗：Invalid UTF-8 sequence
*   **現象**：報錯 `failed to convert rope into string`。
*   **原因**：在 Windows 環境使用 PowerShell 的 `Set-Content` 修改程式碼時，預設編碼可能被轉為 UTF-16 或帶 BOM 的格式，Linux 編譯器無法讀取。
*   **解決**：確保使用標準 UTF-8 編碼存檔。在 AI 操作時，優先使用 `replace_file_content` 或 `write_to_file` 工具，避免直接執行 Shell 命令修改代碼。

#### 3. 運行時 500 錯誤：window is not defined
*   **現象**：存取 `/studio` 時出現伺服器端報錯。
*   **原因**：Sanity Studio 依賴瀏覽器 API，無法在伺服器端渲染 (SSR)。
*   **解決**：建立 `Studio.jsx` 客戶端組件，並使用 `useState` + `useEffect` 的 `isMounted` 檢查，確保 Studio 僅在瀏覽器端掛載。

#### 4. 編譯失敗：Failed to collect page data
*   **現象**：編譯期報錯 `Failed to collect page data for /api/...` 或 `/sitemap.xml`。
*   **原因**：Next.js 嘗試在編譯時預執行動態路由，但環境中缺少 API Key 或網路權限。
*   **解決**：在所有 API 路由和動態數據頁面頂部加上 `export const dynamic = 'force-dynamic';`。

---

### 🚀 部署流程 (Deploy Process)
1.  **環境檢查**：確保 `.env.local` 具備所有 `NEXT_PUBLIC_` 變數及 `SANITY_WRITE_TOKEN`。
2.  **執行部署腳本**：
    ```powershell
    # 腳本會自動提取變數並注入 Dockerfile 進行編譯
    # 詳見上述「環境變數注入」說明
    ```

## 🌐 域名管理 (esg.team)
*   **DNS 解析商**: 阿里雲
*   **設定紀錄**: 需配置 4 條 A 記錄 (`@`) 與 1 條 CNAME (`www`) 指向 Google。
*   **證書更新**: Google Cloud 負責自動管理 SSL 證書，DNS 更新後需等待約 30 分鐘生效。

## 🤖 智能數據鏈路與 AI 洞察架構 (Intelligent Data & AI Pipeline)

本平台整合了自動化採集與 AI 分析引擎，實現了從「原始數據」到「市場洞察」的自動化生產線。這使得 `esg.team` 不僅是一個資訊聚合站，更是一個具備「思考能力」的決策門戶。

### 1. 架構組成 (Core Components)
*   **數據採集引擎 (`/src/lib/ingestion`)**：負責從外部權威接口（如 IEA, GridIntensity API）提取最新數值。
*   **AI 分析大腦 (`/src/lib/ai/analyst.js`)**：
    *   **數據感應**：讀取專題 (Hub) 下的基準數值（如電力碳強度）。
    *   **趨勢判定**：根據預設的永續發展邏輯進行「看多/風險預警」之市場判定。
    *   **自動寫入**：透過 Sanity Client 將生成內容、趨勢標籤與信心指數即時 Patch 回 CMS 文件。
*   **視覺展示層 (AI UX)**：
    *   **神經網絡背景**：使用動態 CSS 模擬 AI 運算節點，強化「數據處理中」的心理暗示。
    *   **打字機效果**：營造內容即時生成的交互感。
    *   **AI Disclaimer**：明確標註內容來源，確保專業性與合規性。

### 2. 自動化工作流 (Automated Workflow)
*   **觸發機制**：存取 `GET /api/ingest?source={SOURCE}&ai=true`。
*   **執行路徑**：數據採集 -> 資料庫寫入 -> AI 邏輯分析 -> 市場洞察發佈。

### 3. 未來演進規劃 (Roadmap)
*   **真實 LLM 接入**：串接 OpenAI / Gemini API 實現真正深度的產業報告生成。
*   **自動化排程 (Cron Jobs)**：設定每日自動同步數據並重新執行 AI 趨勢分析。
*   **付費數據牆 (Gating)**：針對 AI 生成的高價值趨勢報告實作權限控制。

## 🛠️ 技術棧 (Tech Stack)

- **Frontend**: Next.js 15+ (App Router)
- **CMS**: Sanity.io (Headless CMS)
- **Styling**: Tailwind CSS
- **Automation**: GitHub Actions (RSS Insight Sync)

## 📁 專案結構

- `/src/app`: 前端頁面與路由
- `/src/sanity`: Sanity Schema 與配置
- `/scripts`: 自動化與工具腳本
- `/docs`: 專案知識庫與規範文件
