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

### 2. 標準部署流程
部署前，請確保 `.env.local` 內容完整，並執行以下 PowerShell 腳本注入：
```powershell
# 提取並注入實體 ID 到 Dockerfile ARG 預設值（解決變數固化最穩定的方法）
$pid = (Select-String -Path .env.local -Pattern "NEXT_PUBLIC_SANITY_PROJECT_ID=(.*)").Matches.Groups[1].Value.Trim()
$ds = (Select-String -Path .env.local -Pattern "NEXT_PUBLIC_SANITY_DATASET=(.*)").Matches.Groups[1].Value.Trim()
(Get-Content Dockerfile) -replace "ARG NEXT_PUBLIC_SANITY_PROJECT_ID", "ARG NEXT_PUBLIC_SANITY_PROJECT_ID=$pid" -replace "ARG NEXT_PUBLIC_SANITY_DATASET", "ARG NEXT_PUBLIC_SANITY_DATASET=$ds" | Set-Content Dockerfile

# 執行部署
gcloud run deploy esg-team --source . --region asia-east1 --set-env-vars="...所有密鑰..."
```

## 🌐 域名管理 (esg.team)
*   **DNS 解析商**: 阿里雲
*   **設定紀錄**: 需配置 4 條 A 記錄 (`@`) 與 1 條 CNAME (`www`) 指向 Google。
*   **證書更新**: Google Cloud 負責自動管理 SSL 證書，DNS 更新後需等待約 30 分鐘生效。

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
