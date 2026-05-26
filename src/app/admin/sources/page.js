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

  // 1. Resend API Health and Invite Logs State
  const [resendStatus, setResendStatus] = useState({
    isConfigured: false,
    mode: 'SANDBOX',
    quotaMessage: '載入監控數據中...'
  });
  const [inviteLogs, setInviteLogs] = useState([]);
  const [role, setRole] = useState('admin'); // 'admin' | 'staff'
  
  // CDN Cache Management State
  const [cacheLoading, setCacheLoading] = useState(false);
  const [cacheStatus, setCacheStatus] = useState('');
  const [cachePaths, setCachePaths] = useState([]);
  const [selectedHubSlug, setSelectedHubSlug] = useState('steel');

  // B2B ERP Sandbox State
  const [b2bApiKey, setB2bApiKey] = useState('');
  const [b2bInstructionsOpen, setB2bInstructionsOpen] = useState(false);
  const [b2bConsoleOutput, setB2bConsoleOutput] = useState('');
  const [b2bConsoleLoading, setB2bConsoleLoading] = useState(false);
  const [b2bConsoleInput, setB2bConsoleInput] = useState(JSON.stringify({
    supplierName: "中鋼結構 (CHSC)",
    materialType: "steel",
    volumeTons: 2500,
    carbonIntensity: 1.85,
    auditor: "SGS Taiwan",
    declarationStandard: "ISO 14067"
  }, null, 2));

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
      isActive,
      "sourceRef": sourceRef->{ title, url }
    }`, {}, { useCdn: false });
    
    setInsights(insightData);
    setIndices(data.indices || []);
    fetchBookmarks();
    fetchInviteLogs();
  };

  const fetchBookmarks = async () => {
    const res = await fetch('/api/admin/bookmarks');
    const data = await res.json();
    if (data.success) setBookmarks(data.bookmarks);
  };

  // Fetch Invite Logs
  const fetchInviteLogs = async () => {
    try {
      const res = await fetch('/api/admin/invite-logs');
      const data = await res.json();
      if (data.success) {
        setInviteLogs(data.logs || []);
        if (data.resendStatus) {
          setResendStatus(data.resendStatus);
        }
      }
    } catch (err) {
      console.error('Failed to fetch invite logs:', err);
    }
  };

  const handleRevokeToken = async (id, supplierName) => {
    if (role !== 'admin') {
      alert('⚠️ 權限不足，僅限 Super Admin 撤銷邀請金鑰。');
      return;
    }
    if (!confirm(`確定要手動撤銷與作廢對 ${supplierName} 的對接邀請金鑰嗎？作廢後該連結將失效。`)) return;
    
    try {
      const res = await fetch('/api/admin/invite-logs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'expired' })
      });
      const data = await res.json();
      if (data.success) {
        fetchInviteLogs();
      } else {
        alert(`❌ 撤銷失敗: ${data.error}`);
      }
    } catch (err) {
      console.error('Revoke failed:', err);
    }
  };

  const handleDeleteInvite = async (id) => {
    if (role !== 'admin') {
      alert('⚠️ 權限不足，僅限 Super Admin 刪除審計日誌。');
      return;
    }
    if (!confirm('確定要永久刪除此對接審計紀錄嗎？此操作無法復原。')) return;

    try {
      const res = await fetch('/api/admin/invite-logs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchInviteLogs();
      } else {
        alert(`❌ 刪除失敗: ${data.error}`);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleRoleChange = async (newRole) => {
    setRole(newRole);
    try {
      // 呼叫後端發行加密的 HttpOnly Session Token
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error('[Role Auth] Failed to sign secure role session:', data.error);
      }
    } catch (err) {
      console.error('[Role Auth] Connection failed:', err);
    }
  };

  const handleAddBookmark = async () => {
    if (!url) return;
    try {
      const res = await fetch('/api/admin/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title: '新收藏情報源' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchBookmarks();
      } else {
        alert(`❌ 新增書籤失敗: ${data.error || '未授權的操作'}`);
      }
    } catch (err) {
      console.error('Bookmark failed:', err);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      const res = await fetch('/api/admin/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchBookmarks();
      } else {
        alert(`❌ 刪除書籤失敗: ${data.error || '未授權的操作'}`);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 從 Cookie 中讀取已保存的角色狀態
    const savedRole = document.cookie
      .split('; ')
      .find(row => row.startsWith('user-role='))
      ?.split('=')[1];
    
    const activeRole = (savedRole === 'admin' || savedRole === 'staff') ? savedRole : 'admin';
    setRole(activeRole);
    
    // 初始化時異步觸發後端安全簽章，確保 user-session 同步寫入 HttpOnly cookie
    fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: activeRole })
    }).catch(err => console.error('[Role Auth] Initial sync failed:', err));

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
      const data = await res.json();
      if (res.ok && data.success) {
        // 立即更新本地狀態，讓介面反應更快
        setInsights(prev => prev.map(item => 
          item._id === id ? { ...item, isActive: !currentStatus } : item
        ));
      } else {
        alert(`❌ 變更狀態失敗: ${data.error || '未授權的操作'}`);
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
      const data = await res.json();
      if (res.ok && data.success) {
        setInsights(prev => prev.filter(item => item._id !== id));
      } else {
        alert(`❌ 刪除採集紀錄失敗: ${data.error || '未授權的操作'}`);
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
      const data = await res.json();
      if (res.ok && data.success) {
        fetchData();
      } else {
        alert(`❌ 清空紀錄失敗: ${data.error || '未授權的操作'}`);
      }
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  const handleRevalidate = async (type, value) => {
    if (role !== 'admin') {
      alert('⚠️ 權限不足，僅限 Super Admin 執行全站快取刷新。');
      return;
    }
    
    setCacheLoading(true);
    setCacheStatus('🔄 正在向 Next.js CDN 發送快取刷新指令...');
    setCachePaths([]);
    
    try {
      let url = '/api/revalidate?secret=esg-revalidate-token-2026';
      if (type === 'all') {
        url += '&all=true';
      } else if (type === 'path') {
        url += `&path=${encodeURI(value)}`;
      } else if (type === 'hub') {
        url += `&hubSlug=${encodeURIComponent(value)}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok && data.revalidated) {
        setCacheStatus(`✅ 快取刷新成功！(共重構 ${data.count} 個路徑，${new Date(data.timestamp).toLocaleTimeString()})`);
        setCachePaths(data.paths || []);
      } else {
        setCacheStatus(`❌ 刷新失敗: ${data.error || '未知錯誤'}`);
      }
    } catch (err) {
      console.error('Revalidation failed:', err);
      setCacheStatus('❌ 網路連線錯誤，無法完成快取重構');
    } finally {
      setCacheLoading(false);
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
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-sm">Resend 郵件流狀態</span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                resendStatus.isConfigured ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {resendStatus.mode}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${resendStatus.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {resendStatus.isConfigured ? 'CONNECTED' : 'SANDBOX ACTIVE'}
            </div>
            <p className="text-[10px] text-slate-400 leading-tight mt-1">{resendStatus.quotaMessage}</p>
          </div>
        </div>

        {/* ⚡ 全站 CDN 靜態快取管理 (CDN Cache Management Center) */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all"></div>
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/20 rounded-lg">
                <span className="material-symbols-outlined text-sky-400">cloud_sync</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  全站 CDN 靜態快取管理 <span className="text-xs text-slate-500 font-normal">Static CDN Cache Management</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">動態增量靜態生成 (ISR) 網關 • 一鍵全域快取同步與邊緣重建</p>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold text-slate-300">ISR 狀態: 24h 快取運作中 (ACTIVE)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-700/50 pt-6">
            
            {/* 左側：一鍵重構及狀態 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-lg flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">主動重新驗證 (On-Demand Purge)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    在 Sanity 後台修改資料後，CDN 快取會在 24 小時內自動過期。如需即時生效，Super Admin 可在此向 Next.js 邊緣伺服器發送刷新指令，秒級重構全站或特定板塊。
                  </p>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => handleRevalidate('all')}
                    disabled={cacheLoading || role !== 'admin'}
                    className={`w-full py-3.5 font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                      role !== 'admin'
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : cacheLoading
                      ? 'bg-slate-700 text-slate-400 cursor-wait'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-500/10'
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {role === 'admin' ? 'rocket_launch' : 'lock'}
                    </span>
                    🚀 刷新全站靜態快取
                  </button>
                  {role !== 'admin' && (
                    <p className="text-[10px] text-rose-400/90 text-center mt-2 font-medium flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      ⚠️ 權限不足，僅限 Super Admin 刷新全站快取
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 右側：精細化刷新與日誌 */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. 按路徑刷新 */}
                <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-sky-400">link</span>
                    指定單一路徑刷新
                  </h4>
                  <div className="flex gap-2">
                    <select
                      id="revalidate-path-select"
                      className="flex-1 bg-slate-900 border border-slate-700 text-xs rounded px-2.5 py-1.5 focus:border-sky-500 outline-none text-white font-mono"
                      defaultValue="/"
                    >
                      <option value="/">首頁 (/)</option>
                      <option value="/solutions">解決方案首頁 (/solutions)</option>
                    </select>
                    <button
                      onClick={() => {
                        const sel = document.getElementById('revalidate-path-select');
                        if (sel) handleRevalidate('path', sel.value);
                      }}
                      disabled={cacheLoading || role !== 'admin'}
                      className={`px-3 py-1.5 text-xs font-bold rounded transition-all flex items-center gap-1 ${
                        role !== 'admin'
                        ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      刷新
                    </button>
                  </div>
                </div>

                {/* 2. 按專題刷新 */}
                <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-sky-400">folder_open</span>
                    指定產業專題重構
                  </h4>
                  <div className="flex gap-2">
                    <select
                      value={selectedHubSlug}
                      onChange={(e) => setSelectedHubSlug(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 text-xs rounded px-2.5 py-1.5 focus:border-sky-500 outline-none text-white font-mono"
                    >
                      <option value="steel">鋼鐵與金屬 (steel)</option>
                      <option value="graphite">石墨與材料 (graphite)</option>
                      <option value="cement">永續水泥 (cement)</option>
                      <option value="petrochemical">去碳石化 (petrochemical)</option>
                    </select>
                    <button
                      onClick={() => handleRevalidate('hub', selectedHubSlug)}
                      disabled={cacheLoading || role !== 'admin'}
                      className={`px-3 py-1.5 text-xs font-bold rounded transition-all flex items-center gap-1 ${
                        role !== 'admin'
                        ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      重構
                    </button>
                  </div>
                </div>

              </div>

              {/* 快取刷新狀態回饋與路徑 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 font-mono">
                <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">控制台輸出日誌 (Purge Log)</span>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">Next.js Edge</span>
                </div>
                
                {/* 狀態訊息 */}
                <p className={`text-xs ${
                  cacheStatus.includes('✅') 
                  ? 'text-emerald-400' 
                  : cacheStatus.includes('❌') || cacheStatus.includes('⚠️')
                  ? 'text-rose-400' 
                  : cacheStatus.includes('🔄')
                  ? 'text-sky-400 animate-pulse'
                  : 'text-slate-500'
                }`}>
                  {cacheStatus || '💡 等待指令：請點擊「刷新全站靜態快取」或重構指定板塊。'}
                </p>

                {/* 刷新成功的路徑列表 */}
                {cachePaths.length > 0 && (
                  <div className="mt-3.5 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold mb-1">🔗 已成功重構與編譯的邊緣路徑：</p>
                    <div className="max-h-[100px] overflow-y-auto space-y-0.5 pr-2 custom-scrollbar">
                      {cachePaths.map((p, idx) => (
                        <div key={idx} className="text-[10px] text-slate-300 flex justify-between bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800/40">
                          <span className="text-emerald-400/90 font-bold">✓ {p}</span>
                          <span className="text-[8px] text-slate-500">RE-RENDERED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* 🛡️ 供應商對接安全邀請審計日誌 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden mb-12">
          <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-600 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="font-bold flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-emerald-400">admin_panel_settings</span>
                供應商對接安全邀請審計日誌 (Onboarding Audit Trail)
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">B2B 合規對接追蹤帳本 • 即時安全金鑰防偽審計</p>
            </div>
            
            {/* 🛡️ 管理權限安全切換閥 (Identity Switcher) */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
              <span className="text-[10px] text-slate-500 font-mono px-2">權限角色:</span>
              <button 
                onClick={() => handleRoleChange('admin')}
                className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                  role === 'admin' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xs">shield_person</span>
                Super Admin
              </button>
              <button 
                onClick={() => handleRoleChange('staff')}
                className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                  role === 'staff' 
                  ? 'bg-rose-950/60 text-rose-400 border border-rose-900/50 shadow-md' 
                  : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xs">lock</span>
                Staff (唯讀)
              </button>
            </div>

          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-500 bg-slate-900/30">
                  <th className="px-6 py-4">供應商名稱</th>
                  <th className="px-6 py-4">窗口 Email / 原料品項</th>
                  <th className="px-6 py-4">加密金鑰 (SHA-256 Token)</th>
                  <th className="px-6 py-4">發送與到期時間</th>
                  <th className="px-6 py-4">當前狀態</th>
                  <th className="px-6 py-4">存證交易 Hash</th>
                  <th className="px-6 py-4">操作審計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {inviteLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500 text-xs">
                      目前尚無供應商邀請發送紀錄
                    </td>
                  </tr>
                ) : (
                  inviteLogs.map((item) => {
                    const isExpired = new Date(item.expiresAt) < new Date();
                    const statusText = item.status === 'accepted' 
                      ? '已對接 (Accepted)' 
                      : item.status === 'expired' || isExpired
                      ? '已過期 (Expired)' 
                      : '已發送 (Sent)';
                    
                    const statusColor = item.status === 'accepted'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : item.status === 'expired' || isExpired
                      ? 'bg-slate-800 text-slate-500 border border-slate-700'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30';

                    return (
                      <tr key={item._id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            {item.sandboxMode && (
                              <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1 rounded border border-amber-500/20 font-mono">SANDBOX</span>
                            )}
                            {item.supplierName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-slate-300 font-mono">{item.email}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {item.materialType === 'steel' && '🏗️ 鋼鐵與金屬原料 (Steel)'}
                            {item.materialType === 'graphite' && '🧬 石墨電極與焦炭 (Graphite)'}
                            {item.materialType === 'logistics' && '📦 原物料物流運輸 (Logistics)'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[10px] text-slate-400 font-mono max-w-[120px] truncate" title={item.token}>
                            {item.token}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-[10px] text-slate-400">
                            發送: {new Date(item.sentAt).toLocaleString('zh-TW', { hour12: false })}
                          </div>
                          <div className="text-[10px] text-rose-400/80 mt-0.5">
                            到期: {new Date(item.expiresAt).toLocaleString('zh-TW', { hour12: false })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.transactionHash ? (
                            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1" title={item.transactionHash}>
                              <span className="material-symbols-outlined text-xs">verified</span>
                              <span className="underline decoration-dotted">{item.transactionHash.substring(0, 10)}...</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-mono">未生成 (N/A)</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {/* Revoke active sent token */}
                            {item.status === 'sent' && !isExpired ? (
                              <div className="relative group/btn">
                                <button
                                  onClick={() => handleRevokeToken(item._id, item.supplierName)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all border ${
                                    role === 'admin'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500 hover:text-white shadow-sm'
                                    : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-xs">
                                    {role === 'admin' ? 'block' : 'lock'}
                                  </span>
                                  作廢金鑰
                                </button>
                                {role !== 'admin' && (
                                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover/btn:block bg-slate-950 text-rose-400 border border-rose-900/60 p-2 rounded text-[9px] w-48 shadow-xl z-20 font-sans text-center leading-normal">
                                    ⚠️ 權限不足，僅限 Super Admin 撤銷
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono uppercase">
                                {item.status === 'accepted' ? '— (已對接)' : '— (已作廢)'}
                              </span>
                            )}

                            {/* Delete Log */}
                            <div className="relative group/del">
                              <button
                                onClick={() => handleDeleteInvite(item._id)}
                                className={`p-1 rounded transition-all ${
                                  role === 'admin'
                                  ? 'text-slate-500 hover:text-rose-500 hover:bg-rose-500/10'
                                  : 'text-slate-700 cursor-not-allowed'
                                }`}
                                title={role === 'admin' ? '刪除此審計紀錄' : '權限不足'}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {role === 'admin' ? 'delete' : 'lock'}
                                </span>
                              </button>
                              {role !== 'admin' && (
                                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/del:block bg-slate-950 text-rose-400 border border-rose-900/60 p-2 rounded text-[9px] w-48 shadow-xl z-20 font-sans text-center leading-normal">
                                  ⚠️ 權限不足，僅限 Super Admin 刪除
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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

        {/* 🛠️ 平台已導入技術與模組監控清單 (Technical Integration Registry) */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-600 flex justify-between items-center">
            <h2 className="font-bold flex items-center gap-2 text-emerald-400">
              <span className="material-symbols-outlined">settings_suggest</span>
              平台已導入技術與模組監控清單 (Technical Integration Registry)
            </h2>
            <div className="flex gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1 font-mono">
                TOTAL: 8 MODULES ACTIVE
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-500 bg-slate-900/30">
                  <th className="px-6 py-4">技術模組名稱</th>
                  <th className="px-6 py-4">調度路徑與底層架構</th>
                  <th className="px-6 py-4">當前運行狀態</th>
                  <th className="px-6 py-4">核心效益與功能</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {/* 1. Ingestion Box */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      萬能情報採集箱 (Ingestion Box)
                    </div>
                    <div className="text-[10px] text-emerald-400">Gemini AI / HTML Parser</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                    src/app/api/ingest-url/route.js
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    一鍵解析外部 URL，藉由 Gemini-Flash 進行自動去噪、去重及高度精煉的中文摘要提取。
                  </td>
                </tr>

                {/* 2. Linked Intelligence */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      標準關聯與知識圖譜 (ESG Standards Mapping)
                    </div>
                    <div className="text-[10px] text-emerald-400">Gemini NLP Standards Parser</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                    src/sanity/schemaTypes/insight.js (standards)
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-500/20">
                      ACTIVE (NEW)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    <strong>【2026-05-17 導入】</strong> 自動分析文章中涉及的 ISO 14064, ISO 14067, CBAM 等國際合規指標，建立結構化知識連結。
                  </td>
                </tr>

                {/* 3. Automatic Insights Sync */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      自動化產業洞察模組 (Insights Sync)
                    </div>
                    <div className="text-[10px] text-slate-500">RSS Parser + GitHub Actions</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                    scripts/sync-insights.mjs
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
                      CRON ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    每日自動透過 RSS 抓取全球最新重工業脫碳動態，並透過 Write Token 自動注入 Sanity 媒體庫。
                  </td>
                </tr>

                {/* 4. Live Ticker */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      市場實時行情模組 (Live Ticker)
                    </div>
                    <div className="text-[10px] text-slate-500">Sanity Index Adapter</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                    src/components/MarketIndexBar.js
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    前台金融終端行情跑馬燈，支援實時漲跌幅百分比計算與 "LIVE" 行情跳動顯示。
                  </td>
                </tr>

                {/* 5. Compact Benchmark Dashboard */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      高密度數據儀表板 (Benchmark Dashboard)
                    </div>
                    <div className="text-[10px] text-slate-500">Tailwind Data Mono UI</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                    src/app/hubs/[hubSlug]/page.js
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    極簡橫向單列排版，高精確度 3px 電力與產能碳強度對比基準條展示。
                  </td>
                </tr>

                {/* 6. AI Insight Engine */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      AI 永續即時洞察 (AI Insight Analyst)
                    </div>
                    <div className="text-[10px] text-blue-400">Gemini LLM / Heuristics</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                    src/lib/ai/analyst.js
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    依據產業碳排放強度大數據自動分析走勢，渲染具備「神經網絡背景」與「打字機動效」的即時洞察。
                  </td>
                </tr>

                {/* 7. Scope 3 Carbon Trust Ledger */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      供應鏈碳排信任帳本 (Scope 3 Carbon Trust Ledger)
                    </div>
                    <div className="text-[10px] text-amber-400">React Client / Crypto Proof-of-Trust</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400 leading-relaxed">
                    src/components/Scope3TrustLedger.js<br />
                    └─ src/components/ledger/<br />
                    &nbsp;&nbsp;&nbsp;├─ mockData.js<br />
                    &nbsp;&nbsp;&nbsp;├─ LedgerHelpPanel.js<br />
                    &nbsp;&nbsp;&nbsp;├─ LedgerMetrics.js<br />
                    &nbsp;&nbsp;&nbsp;├─ SupplierInviteModal.js<br />
                    &nbsp;&nbsp;&nbsp;└─ LedgerTable.js
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-bold px-2 py-0.5 rounded-full bg-rose-400/10 border border-rose-500/20">
                      SANDBOX (POC / NO DB CONNECTION)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    <strong>【落地概念驗證 - 未聯網】</strong> 用於管理上游供應商原物料之生命週期評估 (LCA) A1-A3 數據。內建第三方 (SGS/TÜV) 單據掛載與<strong>密碼學防偽雜湊存證</strong>（Ledger Hash 0x...），消除綠洗風險。
                    <div className="mt-1 text-[10px] text-rose-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] animate-pulse">warning</span>
                      ⚠️ 系統提示：本模組尚未完整對接 Sanity / ERP 生產資料庫，目前前台已特別掛載「暫未開放正式生產使用」之沙盒公告。
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 bg-slate-950/60 p-3 rounded border border-slate-800 leading-relaxed font-sans">
                      <strong className="text-white">💡 落地實作對接指南：</strong><br />
                      1. <strong>後台資料庫對接</strong>：可藉由 Sanity.io 建立 <code>trustLedger</code> schema，動態取代前端 Mock-Data 陣列。<br />
                      2. <strong>安全對接邀請 (Secure Onboarding Flow)</strong>：點擊「發起供應商對接」時，Next.js API 路由可串接 SendGrid，真的向新供應商發送具備防偽安全 Token 連結的電子郵件，供應商填寫完畢並上傳認證書後自動安全寫入帳本。<br />
                      3. <strong>雲端憑證存儲</strong>：結合 Google Cloud Storage，供應商上傳之 SGS PDF 將存儲於安全雲端中，並提供買方加密的簽名下載連結 (Signed URL)。
                    </div>
                  </td>
                </tr>

                {/* 8. EU CBAM Tariff Simulator */}
                <tr className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      歐盟 CBAM 碳邊境稅模擬器 (EU CBAM Tariff Simulator)
                    </div>
                    <div className="text-[10px] text-emerald-400">React Client / Compliance Logic</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                    src/components/CbamCalculator.js
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-500/20">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    <strong>【合規邊境稅模擬】</strong> 支援對進口鋼鐵、鋁、水泥、化肥等受管制原物料，進行 2026-2034 年過渡期與正式課稅期關稅曝險評估。
                    <div className="mt-2 text-[10px] text-slate-400 bg-slate-950/60 p-3 rounded border border-slate-800 leading-relaxed font-sans">
                      <strong className="text-white">💡 落地實作說明與商業運作架構：</strong><br />
                      1. <strong>實時歐盟碳排放價 (ETS Price Feed) 對接</strong>：當前為 Mock ETS 碳價，後續落地可以串接 <code>EEX (European Energy Exchange)</code> 或透過 Scraping/API 獲取最真實的 ETS 期貨現貨價格，隨時反映最新關稅曝險。<br />
                      2. <strong>原產國碳稅自適應折抵 (Art. 9 Deduction Route)</strong>：自動根據台灣碳費/中國碳市場交易價格折抵進口關稅，並透過 Next.js API 路由對接報關系統，自動生成 CBAM 申報底表 (Form 21/22)。<br />
                      3. <strong>風電/特斯拉 Scope 3 痛點鏈路</strong>：企業可藉由輸入上游供應商提供的 SGS 電影與物流排放強度，動態評估透過「更換電爐鋼供應商」或「縮短物流航線」能獲得的 CBAM 退稅額度，真正將去碳化決策與財務收益（省下數百萬歐元關稅）進行硬核掛鉤。
                    </div>
                  </td>
                </tr>
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
