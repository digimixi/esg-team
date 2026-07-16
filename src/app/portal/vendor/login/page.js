'use client';
import { useState } from 'react';

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/vendor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || '驗證失敗，請確認您的 Email 是否正確註冊。');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('網路錯誤，請稍後再試。');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">供應商登入專區</h1>
        <p className="text-gray-600 mb-8">請輸入您的註冊 Email 取得安全登入連結</p>
        
        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 p-4 text-green-800">
            <h3 className="font-bold mb-2">驗證信已發送！</h3>
            <p className="text-sm">請檢查您的信箱，點擊信中連結即可安全登入。該連結將於 15 分鐘後失效。</p>
            <p className="text-xs mt-4 opacity-70">※ 若為開發模式，請查看終端機印出的登入連結。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-medium mb-2">
                電子郵件 (Email)
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border focus:outline-none focus:border-black transition-colors"
                placeholder="your@company.com"
                disabled={status === 'loading'}
              />
            </div>
            
            {status === 'error' && (
              <p className="text-red-600 text-sm">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '處理中...' : '發送登入連結'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
