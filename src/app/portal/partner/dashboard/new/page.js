'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPartnerCase() {
  const router = useRouter();
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    clientCompany: '',
    contactName: '',
    productInterest: '',
    customerPainPoint: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/partner/cases/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus('success');
        setTimeout(() => {
          router.push('/portal/partner/dashboard');
          router.refresh();
        }, 1500);
      } else {
        setStatus('error');
        setErrorMessage(data.error || '新增失敗');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('網路發生錯誤');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-900">手動新增引薦案件</h1>
          <Link href="/portal/partner/dashboard" className="text-gray-500 hover:text-blue-600 font-medium">
            &larr; 返回列表
          </Link>
        </div>

        <div className="bg-white p-8 border shadow-sm">
          {status === 'success' ? (
            <div className="bg-green-50 text-green-800 p-6 rounded text-center">
              <h2 className="text-xl font-bold mb-2">送出成功！</h2>
              <p>平台審核專員將盡快處理您的案件。</p>
              <p className="text-sm mt-4 text-green-600">正在返回管理中心...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-medium mb-1">潛在客戶公司名稱 *</label>
                <input
                  name="clientCompany"
                  required
                  value={formData.clientCompany}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border focus:border-blue-500 focus:outline-none"
                  placeholder="例如：台積電或某某鋼鐵"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">聯絡人姓名 (選填)</label>
                <input
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border focus:border-blue-500 focus:outline-none"
                  placeholder="例如：王經理"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">可能需求產品 (選填)</label>
                <input
                  name="productInterest"
                  value={formData.productInterest}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border focus:border-blue-500 focus:outline-none"
                  placeholder="例如：石墨電極 UHP, 或碳資產評估"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">客戶痛點與您的備註 (選填)</label>
                <textarea
                  name="customerPainPoint"
                  value={formData.customerPainPoint}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="請簡述這家公司的痛點，或是您與決策層的關係程度..."
                />
              </div>
              
              {status === 'error' && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {errorMessage}
                </div>
              )}

              <div className="pt-4 border-t">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-blue-600 text-white font-bold py-3 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? '送出中...' : '確認新增案件'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
