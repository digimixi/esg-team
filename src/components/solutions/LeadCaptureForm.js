'use client';
import { useState } from 'react';

const industryOptions = ['鋼鐵', '鑄造', '金屬加工', '模具', '建材', '貿易', '其他'];
const interestOptions = ['增碳劑', '石墨電極', '石墨坩堝', '鋼材 / 環保鋼', '鋼渣資源化', 'ESG / 碳資料'];
const wantOptions = ['索取：增碳劑供應方案', '索取：石墨電極評估方案', '索取：碳資料與追溯規範', '預約樣品測試', '獲取正式報價', '技術細節討論'];

export default function LeadCaptureForm({ hubSlug = 'unknown' }) {
  const isConsultantMode = hubSlug === 'esg_info';
  
  const currentIndustryOptions = isConsultantMode 
    ? ['管顧/會計師事務所', '獨立 ESG 顧問', '軟體系統服務商', '第三方查驗機構', '其他'] 
    : industryOptions;

  const currentInterestOptions = isConsultantMode
    ? ['石墨電極', '增碳劑', '石墨坩堝', '低碳鋼材', '鋼渣循環材料', '顧問賦能方案']
    : interestOptions;

  const currentWantOptions = isConsultantMode
    ? ['申請成為 ESG 轉型夥伴', '索取：台灣鋼鐵產業 ESG 開發地圖', '索取：500 大企業開發名單 Excel', '預約顧問交流會議', '顧問專屬教育訓練']
    : wantOptions;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    industry: '',
    interests: [],
    volume: '',
    currentSpec: '',
    hasExportClients: false,
    needsEsgData: false,
    wants: [],
    additionalInfo: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'hasExportClients' || name === 'needsEsgData') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        // Handle array checkboxes (interests, wants)
        setFormData(prev => {
          const arr = prev[name];
          if (checked) {
            return { ...prev, [name]: [...arr, value] };
          } else {
            return { ...prev, [name]: arr.filter(item => item !== value) };
          }
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 阻擋常見的免費信箱
      const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'msn.com', 'icloud.com', 'qq.com', '163.com', 'mailinator.com'];
      const emailDomain = formData.email.split('@')[1]?.toLowerCase();
      
      if (emailDomain && freeEmailDomains.includes(emailDomain)) {
        setErrorMsg('為了提供最準確的供應鏈資訊，請填寫您的「企業專屬 Email 信箱」，謝謝配合。');
        setIsSubmitting(false);
        return;
      }

      const payload = { ...formData, hubSource: hubSlug };
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '提交失敗');

      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-sm">
        <span className="material-symbols-outlined text-esg-emerald text-6xl mb-4">task_alt</span>
        <h3 className="font-headline-md text-2xl text-primary mb-4">感謝您的聯繫</h3>
        <p className="text-on-surface-variant mb-6 text-lg">
          我們已收到您的需求。我們的供應鏈顧問將審視您的需求，並盡快將合適的評估方案、PDF 文件或報價寄送至您的信箱。
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-primary font-bold hover:underline"
        >
          返回表單
        </button>
      </div>
    );
  }

  return (
    <div id="onboard-form" className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-10 max-w-4xl mx-auto shadow-xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="text-center mb-10 relative z-10">
        <h2 className="font-headline-md text-3xl text-primary mb-3">
          {isConsultantMode ? '申請成為 ESG 轉型夥伴' : '索取產品資料或預約供應鏈評估'}
        </h2>
        <p className="text-on-surface-variant text-sm max-w-2xl mx-auto">
          {isConsultantMode 
            ? '請留下您的聯絡資訊與顧問屬性，我們將盡快與您聯繫探討合作模式或提供專屬開發資源。' 
            : '請留下您的產品需求與資料需求，我們將依情況提供規格資料、樣品測試或供應鏈評估建議。'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        {errorMsg && (
          <div className="bg-error/10 text-error p-4 rounded-lg text-sm border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {errorMsg}
          </div>
        )}

        {/* 1. 基本資料 */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/50 space-y-6">
          <h4 className="font-bold text-primary flex items-center gap-2 border-b border-outline-variant pb-2 mb-4">
            <span className="material-symbols-outlined text-secondary">business</span>
            基本聯絡資訊
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-primary mb-1">公司名稱 <span className="text-error">*</span></label>
              <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" placeholder="例如：某某鑄造股份有限公司" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-1">公司所在地</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" placeholder="例如：台灣台中市、越南同奈省" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-1">聯絡人姓名 <span className="text-error">*</span></label>
              <input type="text" name="contactName" required value={formData.contactName} onChange={handleChange} className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-1">職稱</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" placeholder="例如：採購經理、廠長" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-1">Email <span className="text-error">*</span></label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" placeholder="您的工作信箱" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-1">聯絡電話 / LINE ID</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" />
            </div>
          </div>
        </div>

        {/* 2. 需求條件 */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/50 space-y-6">
          <h4 className="font-bold text-primary flex items-center gap-2 border-b border-outline-variant pb-2 mb-4">
            <span className="material-symbols-outlined text-secondary">assignment</span>
            評估條件與產業屬性
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Industry Radio */}
            <div>
              <label className="block text-sm font-bold text-primary mb-3">{isConsultantMode ? '機構屬性' : '產業類型'}</label>
              <div className="grid grid-cols-2 gap-2">
                {currentIndustryOptions.map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer hover:text-primary">
                    <input type="radio" name="industry" value={opt} checked={formData.industry === opt} onChange={handleChange} className="w-4 h-4 text-primary focus:ring-primary border-outline" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Interests Checkbox */}
            <div>
              <label className="block text-sm font-bold text-primary mb-3">有興趣項目 (可複選)</label>
              <div className="grid grid-cols-2 gap-2">
                {currentInterestOptions.map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer hover:text-primary">
                    <input type="checkbox" name="interests" value={opt} checked={formData.interests.includes(opt)} onChange={handleChange} className="w-4 h-4 rounded text-primary focus:ring-primary border-outline" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-primary mb-1">目前月用量或預估需求</label>
              <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" placeholder="例如：增碳劑約 50 噸/月" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-primary mb-1">目前使用規格 (若有)</label>
              <textarea name="currentSpec" value={formData.currentSpec} onChange={handleChange} rows="2" className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" placeholder="例如：目前使用固定碳90%以上，硫低於0.05%..."></textarea>
            </div>
          </div>
        </div>

        {/* 3. 進階選項 */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/50 space-y-6">
          <h4 className="font-bold text-primary flex items-center gap-2 border-b border-outline-variant pb-2 mb-4">
            <span className="material-symbols-outlined text-secondary">public</span>
            ESG 與高價值支援
          </h4>

          <div className="flex flex-col gap-4 mb-6">
            <label className="flex items-center gap-3 p-3 bg-white border border-outline-variant rounded-lg cursor-pointer hover:border-primary/50 transition-colors shadow-sm">
              <input type="checkbox" name="hasExportClients" checked={formData.hasExportClients} onChange={handleChange} className="w-5 h-5 rounded text-primary focus:ring-primary border-outline" />
              <div>
                <div className="font-bold text-primary text-sm">我們有出口歐美客戶或國際買家</div>
                <div className="text-xs text-on-surface-variant mt-0.5">需要對接更嚴格的供應商查核標準</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border border-outline-variant rounded-lg cursor-pointer hover:border-primary/50 transition-colors shadow-sm">
              <input type="checkbox" name="needsEsgData" checked={formData.needsEsgData} onChange={handleChange} className="w-5 h-5 rounded text-primary focus:ring-primary border-outline" />
              <div>
                <div className="font-bold text-primary text-sm">我們需要產品碳足跡或 ESG 供應鏈資料</div>
                <div className="text-xs text-on-surface-variant mt-0.5">因應 CBAM、ISO 14067 或品牌客戶要求</div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-3">希望取得 (可複選)</label>
            <div className="flex flex-wrap gap-3">
              {currentWantOptions.map(opt => (
                <label key={opt} className={`flex items-center gap-2 text-sm px-4 py-2 border rounded-full cursor-pointer transition-colors ${formData.wants.includes(opt) ? 'bg-primary text-on-primary border-primary' : 'bg-white text-on-surface-variant border-outline-variant hover:border-primary/50'}`}>
                  <input type="checkbox" name="wants" value={opt} checked={formData.wants.includes(opt)} onChange={handleChange} className="hidden" />
                  {formData.wants.includes(opt) && <span className="material-symbols-outlined text-[16px]">check</span>}
                  {opt}
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-primary mb-1 mt-4">補充說明</label>
            <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="3" className="w-full p-3 border border-outline-variant rounded bg-white text-on-surface focus:outline-primary" placeholder="任何其他想了解的問題，或方便聯絡的時間等..."></textarea>
          </div>
        </div>

        <div className="text-center pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto min-w-[200px] bg-primary text-on-primary font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto text-lg"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                傳送中...
              </>
            ) : (
              <>
                送出評估需求
                <span className="material-symbols-outlined">send</span>
              </>
            )}
          </button>
          <p className="text-xs text-on-surface-variant mt-4">
            您的資料將會受到妥善保護，並僅用於本次評估與聯繫用途。
          </p>
        </div>
      </form>
    </div>
  );
}
