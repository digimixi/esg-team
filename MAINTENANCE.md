# ESG Team Portal 維護與部署手冊

## 🚀 部署規範 (Google Cloud Run)

本專案採用 Next.js 16 + Docker Standalone 模式部署。由於 Next.js 在編譯階段會將環境變數固化（Inline），請務必遵循以下流程進行部署。

### 1. 部署前置作業
為了確保編譯器能讀到正確的環境變數，部署腳本會自動將 `.env.local` 的數值注入 `Dockerfile` 的 `ARG` 預設值中。

### 2. 標準部署指令 (PowerShell)
```powershell
# 1. 提取變數並注入 Dockerfile
$projectId = (Select-String -Path .env.local -Pattern "NEXT_PUBLIC_SANITY_PROJECT_ID=(.*)").Matches.Groups[1].Value.Trim()
$dataset = (Select-String -Path .env.local -Pattern "NEXT_PUBLIC_SANITY_DATASET=(.*)").Matches.Groups[1].Value.Trim()
(Get-Content Dockerfile) -replace "ARG NEXT_PUBLIC_SANITY_PROJECT_ID", "ARG NEXT_PUBLIC_SANITY_PROJECT_ID=$projectId" -replace "ARG NEXT_PUBLIC_SANITY_DATASET", "ARG NEXT_PUBLIC_SANITY_DATASET=$dataset" | Set-Content Dockerfile

# 2. 執行部署
gcloud run deploy esg-team --source . --region asia-east1 --allow-unauthenticated --set-env-vars="NEXT_PUBLIC_SANITY_PROJECT_ID=$projectId,NEXT_PUBLIC_SANITY_DATASET=$dataset,SANITY_WRITE_TOKEN=YOUR_TOKEN,GEMINI_API_KEY=YOUR_KEY"
```

## 🛠️ 開發守則 (Code Guardrails)

### 1. Sanity Client 初始化
- **禁止** 在 `client.js` 中使用字串佔位符（如 `|| 'placeholder'`），這會導致編譯時被硬編碼。
- **必須** 使用動態獲取配置，確保 Runtime 優先。

### 2. API 路由安全
- 所有涉及 `SANITY_WRITE_TOKEN` 或 `GEMINI_API_KEY` 的 API 路由，必須加上 `export const dynamic = 'force-dynamic';`。
- 嚴禁在 API 頂層初始化帶有敏感變數的實體。

### 3. Docker 規範
- `.dockerignore` **不得** 屏蔽 `next.config.mjs`。
### 4. UI 組件架構 (UI Component Architecture)
- **目錄結構**：通用解決方案組件存放於 `@/components/solutions/`。
- **組件命名**：採用大駝峰命名，如 `BentoCard.js`、`SolutionHero.js`。
- **樣式管理**：優先使用 Tailwind Utility Classes 配合 `globals.css` 的變數。禁止在組件中使用 `style={{ color: '#xxx' }}` 等硬編碼。
- **數據隔離**：組件應盡量只接收數據（Props），不應在小組件內部直接發送 API 請求。

## ⚙️ 解決方案 (Solutions) 更新流程
當需要修改解決方案詳情頁時：
1. **檢查通用組件**：先確認 `@/components/solutions/` 是否有現成組件可覆用。
2. **局部修改原則**：如果只有微小差異，請透過 Props 控制；如果差異超過 50%，應建立新組件。
3. **Dispatcher 更新**：在 `src/app/solutions/[slug]/page.js` 中按需導入與組合。

## 🌐 網域與 DNS 設定
- **網域**：`esg.team`
- **解析商**：阿里雲 (Alibaba Cloud)
- **設定**：需包含 4 條 A 記錄指向 Google 負載平衡 IP (216.239.32.21, 34.21, 36.21, 38.21)。
