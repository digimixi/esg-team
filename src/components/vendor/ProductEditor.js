'use client';
import { useState } from 'react';

export default function ProductEditor({ product }) {
  const [formData, setFormData] = useState({
    stock: product.stock || '',
    description: product.description || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/vendor/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          updates: formData
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('更新成功！');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('更新失敗：' + (data.error || '未知錯誤'));
      }
    } catch (err) {
      setMessage('網路連線錯誤');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border p-5 rounded-sm hover:border-gray-400 transition-colors">
      <div className="mb-4">
        <h3 className="font-bold text-lg">{product.title}</h3>
        {product.subtitle && <p className="text-sm text-gray-500">{product.subtitle}</p>}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">庫存狀態 (Stock)</label>
          <input 
            type="text" 
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="例如: 4,200 MT 或 Out of Stock"
            className="w-full px-3 py-2 border focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">產品描述 (Description)</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border focus:outline-none focus:border-black resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className={`text-sm ${message.includes('失敗') || message.includes('錯誤') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </span>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving ? '儲存中...' : '儲存變更'}
          </button>
        </div>
      </div>
    </div>
  );
}
