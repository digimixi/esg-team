# esg.team 開發日誌 (Development Log)

本文檔記錄專案的重要里程碑、功能演進與關鍵技術決策。

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
