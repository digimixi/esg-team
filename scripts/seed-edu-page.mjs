import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
dotenv.config({ path: '.env.local' });

// 生成隨機 _key 的簡單函數
const generateKey = () => randomBytes(8).toString('hex');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-25',
  useCdn: false,
});

async function seed() {
  try {
    const hub = await client.fetch('*[_type == "hub" && slug.current == "graphite"][0]');
    if (!hub) return;

    const eduPageData = {
      _type: 'eduPage',
      title: '電弧爐煉鋼之火：解構石墨電極技術',
      subtitle: 'Graphite Electrodes in EAF — The Science of Metal Production',
      slug: { _type: 'slug', current: 'graphite-eaf-science' },
      hub: { _type: 'reference', _ref: hub._id },
      publishDate: '2024-10-22',
      
      sidebar: {
        title: 'Technical Inquiry',
        description: '針對您的電爐工況提供 Taiwan Spec 台灣專規定製服務。',
        buttonText: 'Submit Inquiry / 發送需求'
      },

      introduction: `石墨電極是電弧爐 (EAF) 煉鋼的核心導電組件。它負責將極大的電流導入爐內，並透過尖端與廢鋼之間產生的「電弧」將電能轉化為超過 3,500°C 的熱能。`,

      featureHighlights: [
        { _key: generateKey(), title: '電導特性 (Electrical Conduction)', description: '高純度石墨具備極低電阻，確保電力傳輸效率，極大化能源轉化率。', type: 'primary' },
        { _key: generateKey(), title: '熱穩定性 (Thermal Stability)', description: '能在不發生結構崩潰的情況下，承受 3,500°C 極限溫度。', type: 'secondary' }
      ],

      techTableConfig: {
        title: 'Technical Data & Classification / 產品分類',
        headers: {
          h1: 'Grade (等級)',
          h2: 'Application (應用)',
          h3: 'Density (參數)',
          h4: 'Material (原材料)'
        },
        rows: [
          { _key: generateKey(), c1: 'Regular Power (RP)', c2: '小型熔爐、鋼包精煉', c3: '< 17 A/cm²', c4: '普通石油焦', isHighlight: false },
          { _key: generateKey(), c1: 'High Power (HP)', c2: '標準電弧爐作業', c3: '18 - 25 A/cm²', c4: '70% 針狀焦', isHighlight: false },
          { _key: generateKey(), c1: 'Ultra High Power (UHP)', c2: '現代高產量電弧爐', c3: '> 25 A/cm²', c4: '100% 優質針狀焦', isHighlight: true }
        ]
      },

      advantagesSection: {
        title: 'Industrial Advantages / 技術優勢',
        items: [
          { _key: generateKey(), title: '顯著降低碳排放 (Low Carbon)', description: '相較於傳統高爐，電弧爐煉鋼可減少高達 75% 的溫室氣體排放。', icon: 'eco', style: 'primary-container', isWide: true },
          { _key: generateKey(), title: '超快速加熱 (Rapid Heating)', description: '極高的電流密度可大幅縮短熔煉週期，實現精確的溫度控制。', icon: 'bolt', style: 'secondary-container', isWide: false },
          { _key: generateKey(), title: '極低熱膨脹 (Low Expansion)', description: '優質針狀焦賦予了電極極低的熱膨脹係數，確保結構完整。', icon: 'precision_manufacturing', style: 'white', isWide: false },
          { _key: generateKey(), title: '殘極回購機制 (Buyback)', description: '協助鋼廠達成「工業廢棄物零填埋」，提升環保評鑑等級與 ESG 評分。', icon: 'recycling', style: 'secondary-container', isWide: true }
        ]
      },

      faqSection: {
        title: 'Technical FAQ / 常見問題',
        questions: [
          {
            _key: generateKey(),
            question: 'Q1：為什麼選擇四海碳素 UHP 600mm，而非繼續使用昂貴的日系產品？',
            answer: '關鍵在精準成本替代、品質對標不打折。四海碳素 UHP 600mm 採用四浸五焙（4I5B）工法與LWG縱向石墨化技術，實測接頭密度達 1.784 g/cm³。產品抗熱震性、導電性與結構穩定性已達日系一線品牌成熟度，可在不改變冶煉節奏、不犧牲熔煉效率的前提下，實現更低單價採購成本。'
          },
          {
            _key: generateKey(),
            question: 'Q2：700mm 大規格電極，如何避免斷棒事故？',
            answer: '大規格電極不販售通用現貨，斷棒主因多為電極指標與電爐工況不匹配。我們提供Taiwan Spec 台灣專規定製服務，由在地工程師對標客戶變壓器參數、冶煉負載、爐況環境，從源頭制定針狀焦配方。'
          },
          {
            _key: generateKey(),
            question: 'Q3：更換品牌後，電極消耗率是否會明顯上升？',
            answer: '電弧爐（EAF）電極消耗主要來自側壁氧化、端部昇華與機械折損。消耗率維持在業界頂標區間：日系約 1.5 kg/MT-steel、四海碳素約 1.52 kg/MT-steel，兩者差距極小。'
          },
          {
            _key: generateKey(),
            question: 'Q4：宣稱 TCO 總持有成本下降 15% 以上，如何計算？',
            answer: 'TCO 降幅15%以上為剛性可視收益，主要由直接採購價差、殘極回購機制、零斷棒隱形成本保障組成。'
          },
          {
            _key: generateKey(),
            question: 'Q5：為何「殘極回購」對鋼廠決策層極為重要？',
            answer: '殘極回購不只是成本節省，更是財務收益＋ESG 雙價值。協助鋼廠達成「工業廢棄物零填埋」，提升環保評鑑等級與 ESG 評分。'
          },
          {
            _key: generateKey(),
            question: 'Q6：面對歐盟 CBAM 碳關稅，你們能提供什麼協助？',
            answer: '我們可合法出具 ISO 14067 產品碳足跡證明，協助台灣鋼廠完成盤查、申報、外銷合規。'
          },
          {
            _key: generateKey(),
            question: 'Q7：國際供應鏈審查嚴格，是否具備人權與來源證明？',
            answer: '我們可提供非涉疆供應證明、勞工權益保障聲明、原料溯源證明全套文件，符合國際貿易規範。'
          },
          {
            _key: generateKey(),
            question: 'Q8：若發生批量品質問題，售後處理流程為何？',
            answer: '我們為原廠直屬官方辦事處，具備原廠直接賠償與 24 小時在地技術支援能力，無需經過代理商轉單。'
          }
        ]
      }
    };

    await client.createOrReplace({ _id: 'edu-graphite-eaf-science', ...eduPageData });
    console.log(`🚀 鍵值修正完畢，後台警告應已消除！`);

  } catch (err) {
    console.error('❌ 更新失敗:', err);
  }
}

seed();
