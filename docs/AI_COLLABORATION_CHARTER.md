# AI COLLABORATION & GOVERNANCE CHARTER
> **給所有未來參與開發之 AI 助理的絕對指導原則 (Directive for all future AI agents)**

## ⚠️ CRITICAL RULES FOR AI 
任何接手 `esg.team` 專案的 AI 助理，在寫下一行程式碼或提出建議之前，**必須絕對遵守以下規範**：

### 1. 閱讀並對齊 SSOT (Read the Single Source of Truth)
開發前，必須先讀取並理解 `docs/ESG_TEAM_MANIFESTO.md` 的內容。
所有的架構決策、UI 組件設計、與路由規劃，都絕對不可以偏離該文件定義的「母子板塊架構 (Hub & Spoke)」與「無頭架構 (Headless)」精神。

### 2. 禁止破壞式創新 (No Unapproved Architectural Shifts)
*   不要隨便提議更換框架或引入肥大的第三方套件（如 Bootstrap, MUI 等）。
*   本專案使用嚴謹的 Tailwind CSS Design System，新建立的 UI 必須繼承現有的變數（如 `text-primary`, `bg-surface-container`），禁止發明不協調的顏色或破壞工業風的極簡感。

### 3. 前後台分離原則 (Headless Discipline)
*   **前端負責畫面**：網頁前台元件 (`src/app` 與 `src/components`) 只負責視覺呈現與互動。
*   **後台負責資料**：所有的「會變動的內容」（如產品規格、專題文章、報價數據），都必須在 `Sanity.io` 的 Schema 中定義，讓使用者可以從 `/studio` 後台直覺式編輯。
*   **禁止硬寫死 (No Hardcoding)**：未來在整合「石墨電極專頁」時，文字介紹與圖片網址必須規劃為可從 Sanity 抓取的欄位。

### 4. 漸進式開發與確認 (Iterative & User-Approved)
*   不要一次性覆寫大量檔案或推翻先前的設計。
*   每完成一個模組的串接或設計，必須主動提供本地測試方法，並在使用者確認「視覺與操作符合預期」後，再進入下一個階段。

### 5. 防禦性修改與功能保全 (Defensive Editing)
*   **修改前盤點**：在修改任何超過 150 行的複雜檔案（如 `/admin/sources/page.js`）之前，AI 助理必須先讀取並盤點該檔案內所有已存在的 `useState` 變數、`API` 呼叫函式與視覺面板組件。
*   **禁止功能倒退 (Anti-Regression)**：新增功能時，必須確保不影響同一檔案內的既有功能。若修改後發現 UI 變動（如監控面板消失），應主動檢查是否誤刪了之前的代碼。
*   **參考 Registry**：開發前應核對 `docs/TECH_STACK_SPEC.md` 中的「Module Registry」，確保清單中的功能在修改後依然運作。

### 6. 專家監督機制 (Expert Supervision Mode)
*   當使用者提出可能影響全局架構的需求時，AI 必須扮演「架構師」的角色，主動提醒可能產生的技術債或偏離 SSOT 的風險。
*   開發過程中應保持專業、客觀且精準的溝通風格。
