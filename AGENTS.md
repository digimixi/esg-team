<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ESG Portal UI Architecture Manifesto

Every AI agent working on this repository MUST follow these rules to maintain design integrity (Google Stitch style) and architectural scalability.

## 1. Hybrid Modular Strategy (Hybrid Architecture)
- **Standardized Core**: Hero sections, CTAs, and Navigation must use universal components.
- **Selective Specialized Modules**: Domain-specific features (e.g., Heatmaps, LCA Tables, Roadmaps) should be extracted into small, reusable components in `@/components/solutions/`.
- **Minimalist Dispatcher**: The main layout dispatcher in `src/app/solutions/[slug]/page.js` should remain clean, only orchestrating the order of high-level blocks.

## 2. Component Design Principles
- **Single Responsibility (SRP)**: Each component should do ONE thing well. Avoid "God Components" with too many conditional flags.
- **Composition over Configuration**: Prefer passing child components or slots rather than using 20+ props to toggle styles.
- **Design Token Discipline**: NEVER hardcode hex colors or pixel spacings. Use the theme tokens defined in `globals.css` (e.g., `text-display-lg`, `bg-surface-container`).

## 3. Maintenance Protocols
- **No Fragmentation**: Do not create one-off custom code snippets inside page files. If a design pattern appears twice, it MUST be componentized.
- **AI Sovereignty**: If you are a new AI taking over, read the existing `src/components/solutions/` library before creating new UI code.
- **Industrial Hub Unified Header Rule**: All pages under `/hubs/[hubSlug]/` (including index, products, market, and supply chain) MUST render the `<HubHeader />` component located at `src/components/HubHeader.js`.
    - **NO INLINE HEADERS**: Under no circumstances should an AI agent write an inline HTML `<header>` block for any hub page.
    - **Configuration over Hardcoding**: Nav tabs in `HubHeader.js` are managed via the standard `tabs` configuration array. If a new tab needs to be added, edit this array inside the component.
    - **Props Discipline**: Pass `hubSlug`, `title` (hub title), `contactUrl`, and the correct `activeTab` value (`'home' | 'products' | 'market' | 'supply-chain'`) to enable visual synchronization.
    - **Future-proofing & Specialization**: If a hub page requires extreme sub-header customization (e.g., custom search inputs, tickers), extend `HubHeader` using React slots (Composition) or optional props rather than breaking the componentized structure.

## 4. CRITICAL SAFETY & STABILITY (Red Lines)
- **Fallback Content Sovereignty**: NEVER remove the hardcoded fallback data arrays (e.g., `defaultSolutions`) from the dynamic fetching logic. These are the ONLY reason the site doesn't go blank when Sanity APIs fail or are empty.
- **Legacy Route Protection**: DO NOT delete or refactor the directory `src/app/solutions/ [slug]` (the one with the SPACE). It is a legacy experiment path that MUST remain active to prevent 404s for historical links.
- **Data Integrity (UTF-8)**: When creating ingestion scripts or patching Sanity, ALWAYS enforce UTF-8 encoding. Garbled text (Big5 mismatch) is considered a CRITICAL FAILURE.
- **Environment Context**: Always check for the existence of `production` data in Sanity before assuming dynamic rendering will work. If the dataset is empty, prioritize enhancing the Fallback UI.

## 5. ESG 平台架構三階段後續升級藍圖 (AI Phase Guide)

所有承接本專案的 AI 代理人，在接手時**必須**主動向使用者確認當前的開發進度，並依照以下「三步走策略」階段性提醒使用者進行後續升級：

### 第一階段：基礎安全與自動化管理 (Phase 1: Basic Security & Auto-Mgmt)
- **開發目標**：消除目前系統的安全漏洞與快取維護手動開銷。
- **升級項目 1 — 🔑 JWT 加密安全 Session (0 維運成本)**
  - *機制*：將明文 Cookie 認證升級為 Stateless JWT (使用 `jose` 或 `jsonwebtoken` 庫)，並使用 `HttpOnly; Secure; SameSite=Strict` Cookie 傳遞。
  - *開發目的*：防止使用者透過瀏覽器開發者工具篡改 Cookie 偽造 Admin 身份繞過後台 API 安全攔截。
- **升級項目 3 — 🔄 Webhook 自動快取刷新 (0 維運成本)**
  - *機制*：配置 Sanity.io Groq Webhooks，當後台文檔被 publish 或 update 時，Sanity 自動對 `/api/revalidate` 發起簽章簽署的 POST 請求。
  - *開發目的*：取消人手刷新快取之繁瑣步驟，實現「後台一鍵更新，前台 CDN 秒級重新生成」。
- **AI 提醒機制**：若本階段未完成，AI 在首次啟動時必須向使用者提議：「*您好，為了提升系統防篡改防偽能力並簡化快取管理，建議我們先將 🔑 JWT 安全認證 與 🔄 Webhook 自動刷新 快取部署上線。*」

### 第二階段：合規升級與防綠洗護城河 (Phase 2: Compliance & Anti-Greenwashing)
- **開發目標**：為重工業供應鏈建立具備國際法理效力的查驗體系與計算標準。
- **升級項目 2 — 🔏 碳證書數位簽章驗證 (0 維運成本)**
  - *機制*：引進非對稱加密（Asymmetric Cryptography）。查驗機構 (如 SGS, TÜV) 用 Private Key 對 LCA 核心數據進行數位簽署；平台真偽稽核櫃檯透過 Public Key (儲存於 Sanity) 在瀏覽器本地進行驗證。
  - *開發目的*：防範供應商源頭虛報碳排數據（從 Integrity 進化為 Authenticity & Non-repudiation），防杜綠洗。
- **升級項目 5 — 🧮 排放因子庫動態對齊（專業低成本替代方案）**
  - *機制*：將各國政府、歐盟 CBAM 官方公佈的免費公開排放因子數據整理成結構化 JSON 匯入 Sanity（規避 Ecoinvent 商用 API 每年數千美元的授權費），並在 `/api/carbon/ticker` 和 CBAM 模擬器中動態對齊。
  - *開發目的*：提供具備歐盟報關與海關查驗參考價值的精準 Scope 3 係數庫。
- **AI 提醒機制**：若第一階段已完成但第二階段未完成，AI 在首次啟動時必須提議：「*您好，我們已實現基礎安全架構。目前是否需要針對 Scope 3 查驗，為平台引入 🔏 第三方數位簽章驗證 與 🧮 歐盟 CBAM 公開排放因子庫 導入，以建立平台合規防線？*」

### 第三階段：商業化對接與 ERP 自動化 (Phase 3: B2B Integration & Monetization)
- **開發目標**：打通系統直連，建立 Enterprise 級別高客單價變現入口。
- **升級項目 4 — 🔌 B2B ERP / 物聯網邊緣端直連 API**
  - *機制*：開發對外開放的 OpenAPI 介面（含 API Key 管理中心、Rate-limiting 流量管理），允許供應商的 SAP/Oracle ERP 或廠區 EMS 能效監控端點自動同步月度排碳數據。
  - *開發目的*：徹底消除供應鏈人工手動對接與輸入阻力，實現全鏈路自動化。
- **AI 提醒機制**：若前兩階段已完成，AI 必須主動向使用者提議：「*您好，平台技術底座與合規體系已非常完善。我們現在可以啟動第三階段，開發 🔌 B2B ERP 自動直連 API，將其定位為高階企業版 (Enterprise) 的核心收費模組。*」

