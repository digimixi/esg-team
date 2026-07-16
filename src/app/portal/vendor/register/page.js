'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function VendorRegister() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    const formData = new FormData(formRef.current);
    const file = formData.get('esgCertificate');
    
    if (!file || file.size === 0) {
      setStatus('error');
      setErrorMessage('請務必上傳至少一份 ESG 相關證書 (如 ISO 14067)。');
      return;
    }

    try {
      const res = await fetch('/api/vendor/register', {
        method: 'POST',
        body: formData, // Send as multipart/form-data
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || '註冊失敗，請確認資料是否完整。');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('網路錯誤，請稍後再試。');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-lg bg-white border p-8 shadow-sm">
        <div className="mb-8">
          <Link href="/" className="text-esg-emerald font-bold text-xl inline-block mb-4">esg.team</Link>
          <h1 className="text-2xl font-bold mb-2">供應商註冊 (Supplier Onboarding)</h1>
          <p className="text-gray-600">加入全球頂尖的 ESG 綠色供應鏈生態系，展示您的合規實力。</p>
        </div>
        
        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 p-6 text-green-900 rounded-lg text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="font-bold text-lg mb-2">註冊申請已成功送出！</h3>
            <p className="text-sm">
              我們的稽核團隊將會驗證您所上傳的 ESG 證書。審核通過後，您將會收到一封包含魔法登入連結 (Magic Link) 的啟用信件，屆時即可登入後台管理您的專屬頁面與商品。
            </p>
            <Link href="/" className="inline-block mt-6 text-esg-emerald font-medium hover:underline">
              返回首頁
            </Link>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="companyName" className="block font-medium mb-1">企業名稱 (Company Name) <span className="text-red-500">*</span></label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="w-full px-4 py-2 border focus:outline-none focus:border-black transition-colors"
                placeholder="例如：綠能科技股份有限公司"
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-1">企業聯絡信箱 (Email) <span className="text-red-500">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border focus:outline-none focus:border-black transition-colors"
                placeholder="info@yourcompany.com"
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="contactName" className="block font-medium mb-1">聯絡人姓名 (Contact Name)</label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                className="w-full px-4 py-2 border focus:outline-none focus:border-black transition-colors"
                placeholder="例如：王小明"
                disabled={status === 'loading'}
              />
            </div>

            <div className="p-4 bg-gray-50 border border-dashed border-gray-300">
              <label htmlFor="esgCertificate" className="block font-bold mb-2">ESG 認證文件上傳 <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-3">請上傳至少一份有效的 ESG 認證（如 ISO 14067, 14064, CBAM 申報書, 綠電憑證）。審核通過前無法開通帳號。</p>
              <input
                id="esgCertificate"
                name="esgCertificate"
                type="file"
                required
                accept=".pdf,.png,.jpg,.jpeg"
                className="w-full text-sm"
                disabled={status === 'loading'}
              />
            </div>
            
            {status === 'error' && (
              <p className="text-red-600 text-sm font-medium p-2 bg-red-50 border border-red-100">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 mt-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '資料上傳中...' : '提交註冊申請'}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              已經是供應商？ <Link href="/portal/vendor/login" className="text-black font-bold hover:underline">登入後台</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
