import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';

const JWT_SECRET = process.env.SESSION_SECRET || 'esg-team-secure-token-secret-2026-super-key-signature-salt';
export const dynamic = 'force-dynamic';

export default async function PartnerAcademy() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('partner-session')?.value;

  if (!sessionToken) {
    redirect('/portal/partner/login');
  }

  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    if (decoded.role !== 'partner') {
      throw new Error('Invalid role');
    }
  } catch (err) {
    redirect('/portal/partner/login');
  }

  // Fetch articles targeted at partners or categories targeted at partners
  const query = `
    *[_type == "knowledgeArticle" && (
      "partner" in targetRoles || 
      (!defined(targetRoles) && "partner" in category->targetRoles)
    )] {
      _id,
      title,
      cardType,
      "categoryTitle": category->title,
      playbookWhatIsIt,
      playbookTarget,
      playbookPainPoint,
      playbookSafeScript,
      playbookBannedScript,
      playbookQuestions,
      faqQuestion,
      faqAnswer
    } | order(categoryTitle asc, _createdAt desc)
  `;
  
  const articles = await client.fetch(query);
  
  const playbooks = articles.filter(a => a.cardType === 'playbook');
  const faqs = articles.filter(a => a.cardType === 'faq');

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">📚 協作夥伴教戰手冊 (Knowledge OS)</h1>
            <p className="text-gray-600">這是您的專屬火力支援中心。請務必詳細閱讀【禁止承諾】與【安全話術】。</p>
          </div>
          <Link href="/portal/partner/dashboard" className="px-4 py-2 border bg-white hover:bg-gray-50 transition-colors font-medium">
            返回管理中心
          </Link>
        </div>

        {/* Playbook Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-indigo-200 pb-2 text-indigo-900">推廣教戰卡 (Playbooks)</h2>
          {playbooks.length === 0 ? (
            <p className="text-gray-500 bg-white p-6 border text-center">目前尚無教戰卡。</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {playbooks.map(card => (
                <div key={card._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="font-bold text-xl">{card.title}</h3>
                    <span className="bg-indigo-800 px-3 py-1 text-xs rounded-full">{card.categoryTitle || '未分類'}</span>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-bold text-gray-700 mb-2">這是什麼？</h4>
                        <p className="text-gray-600 text-sm">{card.playbookWhatIsIt || '-'}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700 mb-2">適合推廣對象</h4>
                        <p className="text-gray-600 text-sm">{card.playbookTarget || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-700 mb-2">客戶痛點 / 需求切入點</h4>
                      <p className="text-gray-600 text-sm">{card.playbookPainPoint || '-'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-bold text-green-800 mb-3 flex items-center">
                          <span className="mr-2">✅</span> 安全話術 (建議說法)
                        </h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-green-900">
                          {card.playbookSafeScript?.map((script, idx) => (
                            <li key={idx}>{script}</li>
                          )) || <li>無</li>}
                        </ul>
                      </div>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <h4 className="font-bold text-red-800 mb-3 flex items-center">
                          <span className="mr-2">❌</span> 禁止承諾 (紅線)
                        </h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-red-900">
                          {card.playbookBannedScript?.map((script, idx) => (
                            <li key={idx}>{script}</li>
                          )) || <li>無</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">常見問題安全回答 (FAQ)</h2>
          {faqs.length === 0 ? (
            <p className="text-gray-500 bg-white p-6 border text-center">目前尚無 FAQ。</p>
          ) : (
            <div className="space-y-4">
              {faqs.map(faq => (
                <div key={faq._id} className="bg-white border p-5 rounded shadow-sm">
                  <h4 className="font-bold text-lg mb-2 text-gray-800">Q: {faq.faqQuestion}</h4>
                  <div className="text-gray-600 bg-gray-50 p-4 border-l-4 border-blue-400">
                    <span className="font-bold text-blue-600 block mb-1">安全回答方式：</span>
                    {faq.faqAnswer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
