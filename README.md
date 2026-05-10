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
