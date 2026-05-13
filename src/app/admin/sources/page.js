'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';

export default function AdminSources() {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('ESG, 鋼鐵, 減碳, 供應鏈');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [insights, setInsights] = useState([]);
  const [indices, setIndices] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // 載入資料
  const fetchData = async () => {
    const res = await fetch('/api/admin-stats');
    const data = await res.json();
    
    // 從 Sanity 抓取文章 (強制不使用 CDN 以獲取即時數據)
    const insightData = await client.fetch(`*[_type == "insight"] | order(publishedAt desc) [0...15] {
      _id,
      title,
      summary,
      publishedAt,
      source,
      externalUrl,
      isActive
    }`, {}, { useCdn: false });
    
    setInsights(insightData);
    setIndices(data.indices || []);
    fetchBookmarks();
  };

  const fetchBookmarks = async () => {
    const res = await fetch('/api/admin/bookmarks');
    const data = await res.json();
    if (data.success) setBookmarks(data.bookmarks);
  };

  const handleAddBookmark = async () => {
    if (!url) return;
    try {
      const res = await fetch('/api/admin/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title: '新收藏情報源' })
      });
      if (res.ok) fetchBookmarks();
    } catch (err) {
      console.error('Bookmark failed:', err);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await fetch('/api/admin/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchBookmarks();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0f172a] p-8 text-white">Loading Command Center...</div>;

  const toggleInsight = async (id, currentStatus) => {
    try {
      const res = await fetch('/api/admin/insight-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (res.ok) {
        // 立即更新本地狀態，讓介面反應更快
        setInsights(prev => prev.map(item => 
          item._id === id ? { ...item, isActive: !currentStatus } : item
        ));
      }
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  const deleteInsight = async (id) => {
    if (!confirm('確定要刪除這筆採集紀錄嗎？')) return;
    try {
      const res = await fetch('/api/admin/insight-status', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setInsights(prev => prev.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleIngest = async () => {
    setLoading(true);
    setStatus('🔍 正在連線並解析網頁...');
    try {
      const res = await fetch('/api/ingest-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, keywords }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ 成功採集 ${data.count} 篇相關文章！`);
        setUrl('');
        fetchData(); // 重新整理列表
      } else {
        setStatus(`❌ 錯誤: ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ 連線超時或解析失敗');
    } finally {
      setLoading(false);
    }
  };

  const clearAllInsights = async () => {
    if (!confirm('確定要清空所有採集紀錄嗎？此動作無法復原。')) return;
    try {
      const res = await fetch('/api/admin/clear-insights', { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end border-b border-slate-700 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">情報指揮中心</h1>
            <p className="text-slate-400">Intelligence Command Center | 自動化採集與監控</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">最後更新時間</div>
            <div className="text-lg font-mono text-emerald-400">{new Date().toLocaleString()}</div>
          </div>
        </header>

        {/* 🚀 萬能採集工具箱 */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-emerald-500/30 p-8 rounded-2xl mb-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <span className="material-symbols-outlined text-emerald-400">dynamic_feed</span>
            </div>
            <h2 className="text-xl font-bold text-white">全球情報採集盒 <span className="text-xs text-slate-500 font-normal ml-2">URL Ingestion Engine</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="text-xs text-slate-400 mb-1 block uppercase">來源網址 URL</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="貼上新聞列表或文章網址..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="md:col-span-4">
              <label className="text-xs text-slate-400 mb-1 block uppercase">過濾關鍵字 Keywords</label>
              <input 
                type="text" 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="用逗號分隔..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="text-xs text-slate-400 mb-1 block uppercase opacity-0">Action</label>
              <div className="flex gap-2">
                <button 
                  onClick={handleIngest}
                  disabled={loading || !url}
                  className={`flex-1 h-[50px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    loading ? 'bg-slate-700 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {loading ? '⏳' : <><span className="material-symbols-outlined">bolt</span> 採集</>}
                </button>
                <button 
                  onClick={handleAddBookmark}
                  disabled={!url}
                  className="w-[50px] h-[50px] bg-slate-700 hover:bg-amber-500/20 hover:text-amber-400 border border-slate-600 rounded-lg flex items-center justify-center transition-all group"
                  title="存為書籤"
                >
                  <span className="material-symbols-outlined group-hover:fill-current">star</span>
                </button>
              </div>
            </div>
          </div>
          {status && <div className={`mt-4 text-sm font-medium ${status.includes('✅') ? 'text-emerald-400' : 'text-amber-400'}`}>{status}</div>}

          {/* 🌟 收藏情報源橫向滾動區 */}
          {bookmarks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">bookmarks</span>
                精選情報源書籤
              </h3>
              <div className="flex flex-wrap gap-3">
                {bookmarks.map((bm) => (
                  <div key={bm._id} className="group relative bg-slate-950/50 border border-slate-800 hover:border-emerald-500/50 rounded-lg pl-4 pr-2 py-2 flex items-center gap-4 transition-all">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-300 max-w-[150px] truncate">{bm.title}</span>
                      <span className="text-[10px] text-slate-500 max-w-[150px] truncate">{bm.url}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setUrl(bm.url); handleIngest(); }}
                        className="p-1.5 hover:text-emerald-400" 
                        title="立即從此源採集"
                      >
                        <span className="material-symbols-outlined text-sm">play_circle</span>
                      </button>
                      <button 
                        onClick={() => deleteBookmark(bm._id)}
                        className="p-1.5 hover:text-rose-400" 
                        title="刪除書籤"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 數據概覽 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <div className="text-slate-400 text-sm mb-1">總抓取文章</div>
            <div className="text-3xl font-bold text-white">{insights.length}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <div className="text-slate-400 text-sm mb-1">活躍來源數</div>
            <div className="text-3xl font-bold text-emerald-400">{new Set(insights.map(i => i.source)).size}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <div className="text-slate-400 text-sm mb-1">監控數據點</div>
            <div className="text-3xl font-bold text-white">{indices.length}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <div className="text-slate-400 text-sm mb-1">AI 採集引擎</div>
            <div className="text-3xl font-bold text-blue-400">READY</div>
          </div>
        </div>

        {/* 最近接入紀錄表格 (與之前相同但改為動態) */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-600 flex justify-between items-center">
            <h2 className="font-bold">最新採集紀錄 (Recent Ingestions)</h2>
            <button 
              onClick={clearAllInsights}
              className="text-xs flex items-center gap-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1 rounded transition-all border border-rose-500/20"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              清空所有紀錄
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-500 bg-slate-900/30">
                  <th className="px-6 py-4">時間</th>
                  <th className="px-6 py-4">標題與摘要</th>
                  <th className="px-6 py-4">來源</th>
                  <th className="px-6 py-4">採用狀態</th>
                  <th className="px-6 py-4">原文連結</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {insights.map(item => (
                  <tr key={item._id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {new Date(item.publishedAt).toLocaleDateString()}<br/>
                      {new Date(item.publishedAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white mb-1">{item.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{item.summary}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{item.source || 'AI 採集'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleInsight(item._id, item.isActive)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                          item.isActive 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-slate-700/50 text-slate-500 border border-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {item.isActive ? 'check_circle' : 'visibility_off'}
                        </span>
                        {item.isActive ? '已採用' : '不採用'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <a href={item.externalUrl} target="_blank" className="text-emerald-400 hover:underline text-xs flex items-center gap-1">
                          查看原文 <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                        </a>
                        <button 
                          onClick={() => deleteInsight(item._id)}
                          className="text-slate-500 hover:text-rose-500 transition-colors"
                          title="刪除此條目"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* 📡 數據源溯源與健康監控 (Comprehensive Source Registry) */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-600 flex justify-between items-center">
            <h2 className="font-bold flex items-center gap-2 text-blue-400">
              <span className="material-symbols-outlined">hub</span>
              全系統數據溯源監控 (Data Source Registry)
            </h2>
            <div className="flex gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                AI SYNC ACTIVE
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-500 bg-slate-900/30">
                  <th className="px-6 py-4">來源 (Source)</th>
                  <th className="px-6 py-4">路徑與類型 (Type/Path)</th>
                  <th className="px-6 py-4">更新頻率</th>
                  <th className="px-6 py-4">連線狀態</th>
                  <th className="px-6 py-4">主要數據/新聞點</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {/* 1. SMM */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">SMM (上海有色網)</div>
                    <div className="text-[10px] text-blue-400">AI 自動摘要已開啟</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                    RSS: metal.com/news/price...
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">每 30 分鐘</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
                      ONLINE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">石墨電極, 針狀焦行情</td>
                </tr>

                {/* 2. MetalMiner */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">MetalMiner</div>
                    <div className="text-[10px] text-blue-400">國際行情分析源</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                    RSS: agmetalminer.com/feed/
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">每 60 分鐘</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
                      ONLINE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">Global Steel, Scrap Price</td>
                </tr>

                {/* 3. MacroMicro */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">MacroMicro (財經M平方)</div>
                    <div className="text-[10px] text-purple-400">數據驅動 AI 深度評論</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                    API/Inject: macromicro.me/charts...
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">每 24 小時</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-purple-400 font-bold px-2 py-0.5 rounded-full bg-purple-400/10">
                      STANDBY
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">鐵礦砂, 廢鋼, 鋼材指數</td>
                </tr>

                {/* 4. World Steel */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">World Steel Association</div>
                    <div className="text-[10px] text-slate-500">官方組織新聞</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                    RSS: worldsteel.org/feed/
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">每日更新</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
                      ONLINE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">全球粗鋼產量, 政策</td>
                </tr>

                {/* 5. TradingView */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">TradingView (Live)</div>
                    <div className="text-[10px] text-slate-500">金融圖表引擎</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                    Websocket/Embedded: TV Widget
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">實時 (Real-time)</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold px-2 py-0.5 rounded-full bg-blue-400/10">
                      STREAMING
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">美國鋼鐵 (X), 螺紋鋼</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
