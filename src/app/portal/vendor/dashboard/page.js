import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { client } from '@/sanity/lib/client';
import ProductEditor from '@/components/vendor/ProductEditor';

const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';

export default async function VendorDashboard() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('vendor-session')?.value;

  if (!sessionToken) {
    redirect('/portal/vendor/login');
  }

  let vendorId;
  let vendorEmail;

  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    if (decoded.role !== 'vendor') {
      throw new Error('Invalid role');
    }
    vendorId = decoded.vendorId;
    vendorEmail = decoded.email;
  } catch (err) {
    redirect('/portal/vendor/login');
  }

  // Fetch products for this vendor (查詢 vendor 欄位為當前供應商的產品)
  const query = `*[_type == "product" && vendor._ref == $vendorId] | order(_createdAt desc) {
    _id,
    title,
    subtitle,
    stock,
    description,
    status
  }`;
  
  const products = (await client.fetch(query, { vendorId })) || [];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">供應商管理中心</h1>
            <p className="text-gray-600">登入身分：{vendorEmail}</p>
          </div>
          <a href="/portal/vendor/login" className="px-4 py-2 border hover:bg-gray-50 transition-colors">
            登出
          </a>
        </header>

        <div className="bg-white border p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">我的產品目錄 ({products.length})</h2>
            <a href="/portal/vendor/dashboard/new" className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors">
              + 上架新商品
            </a>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              目前沒有綁定任何產品，請聯繫平台管理員為您設定。
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map(product => (
                <ProductEditor key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
