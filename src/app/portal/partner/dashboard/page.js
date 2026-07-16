import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';

const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';

export default async function PartnerDashboard() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('partner-session')?.value;

  if (!sessionToken) {
    redirect('/portal/partner/login');
  }

  let partnerId;

  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    if (decoded.role !== 'partner') {
      throw new Error('Invalid role');
    }
    partnerId = decoded.partnerId;
  } catch (err) {
    redirect('/portal/partner/login');
  }

  const partnerQuery = `*[_type == "broker" && _id == $partnerId][0]`;
  const partner = await client.fetch(partnerQuery, { partnerId });

  if (!partner) {
    redirect('/portal/partner/login');
  }

  const casesQuery = `*[_type == "brokerCase" && broker._ref == $partnerId] | order(_createdAt desc)`;
  const cases = await client.fetch(casesQuery, { partnerId });

  // Assume host is localhost or esg.team for demo
  const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://esg.team';
  const referralUrl = `${host}/?ref=${partner.partnerCode}`;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">協作夥伴管理中心</h1>
            <p className="text-gray-600">身分：{partner.displayName} ({partner.level === 'level_1' ? '引薦夥伴' : partner.level === 'level_2' ? '渠道協作' : '產業顧問'})</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/portal/partner/academy" className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-100 transition-colors rounded">
              📚 教戰手冊 (Knowledge)
            </Link>
            <a href="/portal/partner/login" className="px-4 py-2 border hover:bg-gray-50 transition-colors rounded">
              登出
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border p-6 shadow-sm col-span-1 md:col-span-2">
            <h2 className="font-bold text-lg mb-4">我的推薦連結 (Referral Link)</h2>
            <div className="flex bg-gray-100 p-3 rounded items-center justify-between">
              <code className="text-sm font-mono text-blue-700">{referralUrl}</code>
              <span className="text-xs text-gray-500 ml-4">買家透過此連結點擊後，後續詢價將自動綁定您的推薦碼</span>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <strong>我的推薦碼：</strong> <span className="font-bold">{partner.partnerCode}</span>
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-6 shadow-sm col-span-1">
            <h2 className="font-bold text-lg mb-2 text-blue-900">新增引薦案件</h2>
            <p className="text-sm text-gray-700 mb-4">若非透過連結，您也可以在此手動建立潛在客戶的引薦紀錄。</p>
            <Link href="/portal/partner/dashboard/new" className="block w-full text-center py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
              + 新增手動引薦案件
            </Link>
          </div>
        </div>

        <div className="bg-white border p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">我的案件進度 ({cases.length})</h2>
          
          {cases.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              目前尚無引薦紀錄。您可以分享推薦連結，或手動新增案件。
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b text-sm">
                    <th className="p-3 font-medium">客戶公司</th>
                    <th className="p-3 font-medium">可能需求產品</th>
                    <th className="p-3 font-medium">狀態</th>
                    <th className="p-3 font-medium">分潤資格</th>
                    <th className="p-3 font-medium">建檔日期</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-gray-50 transition-colors text-sm">
                      <td className="p-3 font-medium">{c.clientCompany}</td>
                      <td className="p-3 text-gray-600">{c.productInterest || '-'}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3">
                         <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {c.commissionStatus}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(c._createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
