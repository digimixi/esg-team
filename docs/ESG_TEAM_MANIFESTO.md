# ESG.TEAM MASTER MANIFESTO (v1.0)
> **Single Source of Truth (SSOT) for the esg.team platform architecture and vision.**

## 1. 核心願景與定位 (Core Vision & Positioning)
**「esg.team 是一個跨領域的永續聚合入口與產業聚落 (Aggregator Hub)。」**
我們不將 `esg.team` 與單一產業或產品劃上等號。它的終極目標是成為全球綠色轉型、碳資產管理與循環經濟的頂級入口。
網站必須時刻保持宏觀、全面且具備高度擴充性。

## 2. 發展策略：母子板塊架構 (The Hub & Spoke Strategy)
雖然願景宏大，但落地的第一步必須具體且具備商業價值。
*   **全局母入口 (esg.team 首頁)**：展示全域視野，包含宏觀碳數據、導覽列，以及所有運作中與規劃中的「產業專題 (Hubs)」。
*   **首發先鋒專題 (Active Hub - Phase 1)**：【重工業脫碳專題：鋼鐵產業與石墨電極】。
    *   **定位**：石墨電極同時具備「綠色材料（降低碳排）」與「循環經濟（電弧爐廢鋼回收）」雙重特質，是完美的切入點。
    *   **動線**：使用者從 `esg.team` 首頁的「專題入口」點擊後，才會進入具體的「石墨電極專頁」(SteelStream)。

## 3. 系統架構與技術棧 (Architecture & Tech Stack)
本專案採用 **Modern Headless Architecture (現代無頭架構)**，確保前台設計極致靈活，後台管理結構化。

### 核心技術選型與決策原因 (Tech Stack Justification)
*   **前端框架**：`Next.js` (App Router) + `React`
*   **樣式系統**：`Tailwind CSS` (繼承 SteelStream 工業級 Corporate/Modern Design System)
*   **後端與部署策略 (The Sanity.io + Google Cloud Run Combo)**：
    *   **CMS 後台大腦 - `Sanity.io` (Embedded Studio)**：
        *   **決策原因**：為了達成使用者要求的「直覺式網頁編輯」、「全域圖文集中管理」以及「未來新模組無縫擴充」。Sanity 作為無頭式 (Headless) 系統，讓資料庫的搬移、增減變得極度自由，前台網頁只負責拉取資料來展示。
    *   **部署環境 - `Google Cloud Run`**：
        *   **決策原因**：無伺服器 (Serverless) 容器化託管，支援自動擴展，完美適配 Next.js 的運行。
    *   **開發與維護優勢 (免除雙重維護負擔)**：
        *   **極簡工作流**：使用者**不需要**去管理複雜的雲端伺服器或底層資料庫。Sanity 的資料庫已經由官方雲端託管，而 Cloud Run 會自動處理流量。
        *   **本機主導開發**：使用者只需在「**本地電腦 (Local)**」透過對話與 AI 專家進行協作（撰寫程式碼、設定 Sanity 資料結構 Schema）。一旦在本機確認完成，程式碼推上雲端即可運作，實現最低維護成本。

## 4. 視覺與設計基因 (Design DNA)
*   **品牌色調**：使用高階灰階 (Surface) 搭配精準的工業藍 (Primary) 與永續綠 (ESG Emerald) 點綴。
*   **UI 原則**：1px 俐落邊框、無過度圓角、清晰的數據化排版字體 (Data Mono)、高對比度。
*   **互動性**：避免浮誇動畫，採用微小且精準的 Hover 狀態變化與毛玻璃效果 (Backdrop Blur)。

## 5. 未來擴充路徑 (Future Roadmap)
*   **Phase 2**: 碳資產管理數據儀表板 (Carbon Assets Dashboard)
*   **Phase 3**: 新能源與儲能專題 (Renewable & Storage)
*   **Phase 4**: 永續農業與生質能專題 (Agri & Bio-Energy)

## 6. 後台資料架構與擴展策略 (Sanity Content Architecture & Scalability)
隨著系統頁面與資料量增長，為確保後台管理的「直覺、結構化、可重用」，未來的開發必須遵循以下四大策略：

1. **結構化側邊欄 (Structure Builder)**：
   - 放棄扁平化列表，強制採用 `src/sanity/structure.js` 進行「資料夾分層管理」。
   - 第一層級應區分為：`全域設定 (Global Settings)`、`事業部專題 (Hubs)`、`核心資料庫 (Databases)`。未來所有新增的 Schema 必須精準歸類至對應資料夾。
2. **模塊化網頁編輯 (Page Builder Pattern)**：
   - 未來擴充新頁面時，應建立標準化的 `Page` Schema 並運用 `Array of Objects` (區塊陣列)。
   - 將「Hero 區塊」、「圖文區塊」、「數據區塊」模組化，讓管理員能像堆樂高一樣，直接在後台拖拉組合出全新的精美網頁，不再依賴前端寫死版位。
3. **資料關聯設計 (References & Tags)**：
   - 產品、情報、數據等獨立資源，必須透過建立關聯（如建立專屬的 `Category` Schema）來管理。
   - 透過關聯機制，前台可精準過濾資料，達成「後台一次建立，全站各版塊自動分發」的動態聚合效果。
4. **集中式媒體庫 (Centralized Media Asset Library)**：
   - 隨著網站擴展，為了防止檔案雜亂，未來須於後台導入 `sanity-plugin-media`。
   - 讓圖片與檔案能如同 Google Drive 般以「資料夾與標籤」進行歸檔，避免重複上傳，並提升素材取用的效率。
