'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function NewProduct() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    stock: ''
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/vendor/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(data.error || '新增失敗');
      }
    } catch (err) {
      setStatus('error');
      setMessage('網路錯誤');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">上架新商品</h1>
            <p className="text-gray-600">填寫商品資訊，送出後將由平台進行合規審查</p>
          </div>
          <Link href="/portal/vendor/dashboard" className="px-4 py-2 border hover:bg-gray-50 transition-colors">
            返回管理中心
          </Link>
        </header>

        <div className="bg-white border p-6 shadow-sm">
          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 text-green-500">✓</div>
              <h3 className="text-xl font-bold mb-2">商品已成功送審！</h3>
              <p className="text-gray-600 mb-6">您的商品狀態目前為「待審核 (Under Review)」，平台通過後即會發布至您的專屬展示頁。</p>
              <Link href="/portal/vendor/dashboard" className="inline-block px-6 py-2 bg-black text-white font-bold hover:bg-gray-800">
                返回管理中心
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-medium mb-1">產品名稱 (Title) *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border focus:border-black focus:outline-none" placeholder="例如：高效能石墨電極" disabled={status === 'loading'} />
              </div>
              
              <div>
                <label className="block font-medium mb-1">英文/副標題 (Subtitle)</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full px-4 py-2 border focus:border-black focus:outline-none" placeholder="High Performance Graphite Electrode" disabled={status === 'loading'} />
              </div>

              <div>
                <label className="block font-medium mb-1">庫存狀態 (Stock)</label>
                <input type="text" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border focus:border-black focus:outline-none" placeholder="例如：200 MT" disabled={status === 'loading'} />
              </div>

              <div>
                <label className="block font-medium mb-1">產品描述 (Description)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-4 py-2 border focus:border-black focus:outline-none resize-none" placeholder="請詳細描述您的產品特色與減碳效益..." disabled={status === 'loading'} />
              </div>

              {message && <div className="text-red-600 font-medium">{message}</div>}

              <button type="submit" disabled={status === 'loading'} className="w-full py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50">
                {status === 'loading' ? '處理中...' : '提交審查'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
