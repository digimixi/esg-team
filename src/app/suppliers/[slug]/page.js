import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import HubHeader from '@/components/HubHeader';

export const dynamic = 'force-dynamic';

export default async function SupplierShowcase(props) {
  const params = await props.params;
  const { slug } = params;
  
  const query = `*[_type == "vendor" && slug.current == $slug && status == 'active'][0]{
    _id,
    companyName,
    email,
    contactName,
    isPremium,
    esgCertificates[] {
      asset->{url}
    },
    "products": *[_type == "product" && vendor._ref == ^._id && status == 'published']{
      _id,
      title,
      subtitle,
      description,
      stock,
      esgTags
    }
  }`;

  const vendor = await client.fetch(query, { slug });

  if (!vendor) {
    notFound();
  }

  return (
    <>
      <HubHeader hubSlug="suppliers" title="合規供應商大廳" activeTab="home" contactUrl={`mailto:${vendor.email}`} />
      
      <main className="min-h-screen bg-surface-container pb-20 pt-16">
        {/* Hero Section */}
        <div className={`py-20 px-6 ${vendor.isPremium ? 'bg-black text-white' : 'bg-white text-black'} border-b`}>
          <div className="max-w-6xl mx-auto">
            {vendor.isPremium && <span className="inline-block px-3 py-1 bg-esg-emerald text-black text-xs font-bold mb-4 uppercase tracking-widest">Premium Partner</span>}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{vendor.companyName}</h1>
            <p className="text-lg opacity-80 max-w-2xl">
              致力於永續環境發展，提供符合全球高標準 ESG 合規規範的工業解決方案與原物料。
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Certs & Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border p-6">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">聯絡資訊</h3>
              <p className="text-sm text-gray-600 mb-2"><strong>聯絡人：</strong> {vendor.contactName || '企業代表'}</p>
              <p className="text-sm text-gray-600 mb-6"><strong>信箱：</strong> {vendor.email}</p>
              <a href={`mailto:${vendor.email}`} className="block w-full text-center py-2 bg-black text-white font-bold hover:bg-gray-800 transition-colors">
                發送詢價信件
              </a>
            </div>

            <div className="bg-white border p-6">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">合規與認證</h3>
              {vendor.esgCertificates && vendor.esgCertificates.length > 0 ? (
                <ul className="space-y-3">
                  {vendor.esgCertificates.map((cert, idx) => (
                    cert?.asset?.url && (
                      <li key={idx}>
                        <a href={cert.asset.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-esg-emerald hover:underline font-medium">
                          <span className="mr-2">📄</span> ESG 認證文件 {idx + 1}
                        </a>
                      </li>
                    )
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">尚無公開上傳之證書</p>
              )}
            </div>
          </div>

          {/* Right Column: Products */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">綠色原物料型錄</h2>
            {vendor.products && vendor.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendor.products.map(product => (
                  <div key={product._id} className="bg-white border p-6 hover:shadow-md transition-shadow group flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-esg-emerald transition-colors">{product.title}</h3>
                      {product.subtitle && <p className="text-sm text-gray-500 mb-4">{product.subtitle}</p>}
                      
                      {product.esgTags && product.esgTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.esgTags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-xs text-gray-700">{tag}</span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">{product.description}</p>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t flex justify-between items-center text-sm">
                      <span className="font-mono text-gray-500">庫存: {product.stock || '未提供'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border p-12 text-center text-gray-500">
                該供應商目前沒有公開發布的商品。
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
