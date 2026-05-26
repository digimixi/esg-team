import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

export const revalidate = 86400; // 24-hour cache self-healing

export const metadata = {
  title: 'ESG SaaS 工具中心 | esg.team',
  description: '重工業與供應鏈的數位轉型解決方案，包含 CBAM 動態模擬器、供應鏈碳排信任帳本及企業 ERP 直連中心。'
};

export default async function ToolsHub() {
  const fetchedTools = await client.fetch(`*[_type == "saasTool" && isActive == true] | order(order asc) {
    _id,
    "id": slug.current,
    title,
    titleEnglish,
    category,
    icon,
    description,
    href,
    badge,
    badgeColor,
    isEnterprise
  }`);

  // Fallback if DB query fails or is empty
  const tools = fetchedTools?.length > 0 ? fetchedTools : [
    {
      id: 'cbam',
      title: 'CBAM 碳邊境稅模擬器',
      titleEnglish: 'CBAM Tariff Simulator',
      category: 'FREE / 基礎合規',
      icon: 'calculate',
      description: '動態對齊官方公開排放因子，一鍵預算歐盟進口碳關稅曝險。',
      href: '/tools/cbam',
      badge: '試用中',
      badgeColor: 'bg-blue-500',
      isEnterprise: false
    }
  ];

  return (
    <>
      <Navbar />
      {/* Neumorphism Background */}
      <main className="pt-[112px] min-h-screen bg-[var(--color-neu-surface)] text-[var(--color-secondary)] pb-24 font-sans">
        
        <div className="max-w-[480px] mx-auto px-6 flex flex-col gap-8">
          
          {/* Top Title Bar: ESG Hub & Download App */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-primary tracking-tight">ESG Hub</h1>
            <button className="flex items-center justify-center w-10 h-10 rounded-full shadow-neu-flat text-esg-emerald active:shadow-neu-pressed transition-all bg-[var(--color-neu-surface)]" title="Install App">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>

          {/* Header Row: User Profile & Weather/Date (Mock) */}
          <div className="flex gap-6 items-stretch">
            {/* Profile Widget (Convex) */}
            <div className="flex-1 shadow-neu-flat rounded-3xl p-5 flex flex-col items-center justify-center bg-[var(--color-neu-surface)]">
              <div className="w-16 h-16 rounded-full shadow-neu-pressed flex items-center justify-center mb-3 bg-[var(--color-neu-surface)]">
                <span className="material-symbols-outlined text-3xl text-esg-emerald">person</span>
              </div>
              <h2 className="font-bold text-lg text-primary">Welcome, Partner!</h2>
              <div className="flex gap-2 mt-2">
                <div className="px-3 py-1 rounded-full shadow-neu-pressed text-[10px] font-bold text-esg-emerald flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span> Pro
                </div>
                <div className="px-3 py-1 rounded-full shadow-neu-pressed text-[10px] font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">notifications</span> 2
                </div>
              </div>
              <p className="text-[10px] text-center mt-3 opacity-60 font-medium">All systems operational<br/>No alerts today</p>
            </div>

            {/* Date Widget (Convex) */}
            <div className="flex-1 shadow-neu-flat rounded-3xl p-5 flex flex-col justify-center bg-[var(--color-neu-surface)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-4xl text-amber-500">wb_sunny</span>
                <div>
                  <h3 className="text-3xl font-light text-primary tracking-tighter">24°C</h3>
                  <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Taipei</p>
                </div>
              </div>
              <p className="text-sm font-bold text-primary mt-2">Clear sky</p>
              <p className="text-[10px] mt-1 opacity-60 leading-relaxed">Perfect weather for carbon neutrality planning. AQI is 45.</p>
            </div>
          </div>

          {/* SaaS Tools Launchpad */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 px-2">SaaS Applications</h3>
            <div className="grid grid-cols-2 gap-6">
              {tools.map(tool => {
                const Wrapper = tool.isEnterprise ? 'div' : Link;
                return (
                  <Wrapper 
                    href={tool.isEnterprise ? undefined : tool.href}
                    key={tool.id} 
                    className={`relative group flex flex-col items-center text-center shadow-neu-flat rounded-3xl p-6 transition-all duration-300 ${tool.isEnterprise ? 'opacity-75 cursor-not-allowed' : 'active:shadow-neu-pressed hover:scale-[0.98]'} bg-[var(--color-neu-surface)]`}
                  >
                    <div className="w-14 h-14 rounded-2xl shadow-neu-pressed flex items-center justify-center mb-4 text-primary group-hover:text-esg-emerald transition-colors bg-[var(--color-neu-surface)]">
                      <span className="material-symbols-outlined text-3xl">{tool.isEnterprise ? 'lock' : tool.icon}</span>
                    </div>
                  
                  {/* Badge */}
                  <span className={`absolute top-4 right-4 text-[8px] font-bold px-2 py-0.5 rounded shadow-neu-flat uppercase tracking-wider ${tool.isEnterprise ? 'text-primary' : 'text-esg-emerald'}`}>
                    {tool.badge}
                  </span>

                  <h4 className="font-bold text-sm text-primary leading-tight mb-1">{tool.title}</h4>
                  <p className="text-[9px] font-mono opacity-60 uppercase">{tool.category}</p>
                  </Wrapper>
              );
            })}
            </div>
          </div>

          {/* Quick Stats / Music Player equivalent (Concave container with Convex items) */}
          <div className="shadow-neu-pressed rounded-3xl p-6 mt-2 bg-[var(--color-neu-surface)]">
            <h3 className="text-center font-bold text-primary text-sm mb-1">Global Carbon Index</h3>
            <p className="text-center text-[10px] opacity-60 mb-6 font-mono uppercase tracking-widest">EUA Futures (Dec 25)</p>
            
            <div className="flex items-center justify-between px-2 mb-6">
              <div className="w-10 h-10 rounded-full shadow-neu-flat flex items-center justify-center text-primary active:shadow-neu-pressed cursor-pointer bg-[var(--color-neu-surface)]">
                <span className="material-symbols-outlined text-lg">show_chart</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-light text-primary">€68.42</span>
                <span className="text-xs font-bold text-esg-emerald flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span> 1.2%
                </span>
              </div>
              <div className="w-10 h-10 rounded-full shadow-neu-flat flex items-center justify-center text-primary active:shadow-neu-pressed cursor-pointer bg-[var(--color-neu-surface)]">
                <span className="material-symbols-outlined text-lg">refresh</span>
              </div>
            </div>

            {/* Slider track equivalent */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono opacity-50">Low</span>
              <div className="flex-1 h-3 shadow-neu-pressed rounded-full relative overflow-hidden bg-[var(--color-neu-surface)]">
                <div className="absolute top-0 left-0 bottom-0 w-[65%] bg-esg-emerald/80 rounded-full shadow-neu-flat"></div>
              </div>
              <span className="text-[10px] font-mono opacity-50">High</span>
            </div>
          </div>

          {/* Bottom Dock / Navigation */}
          <div className="flex justify-between items-center px-4 py-2 mt-4">
            {['home', 'search', 'add_circle', 'chat', 'settings'].map((icon, i) => (
              <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all ${i === 2 ? 'shadow-neu-flat text-esg-emerald scale-110' : 'text-primary/40 hover:shadow-neu-flat hover:text-primary'} bg-[var(--color-neu-surface)]`}>
                <span className="material-symbols-outlined">{icon}</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
