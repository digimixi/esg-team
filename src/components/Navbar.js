import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center px-4 md:px-margin h-16 max-w-container-max mx-auto">
        <div className="flex items-center gap-2 md:gap-stack-lg min-w-0">
          <Link href="/" className="text-body-base md:text-headline-md font-headline-md text-primary flex items-center gap-1 shrink-0 group">
            esg<span className="text-esg-emerald">.</span>team
          </Link>
          <nav className="hidden lg:flex gap-stack-md ml-4 xl:ml-stack-lg">
            <Link className="flex flex-col text-secondary hover:text-primary transition-colors group whitespace-nowrap" href="/">
              <span className="font-body-base text-body-base">全域入口</span>
              <span className="text-[10px] uppercase tracking-tighter opacity-70">Global Portal</span>
            </Link>
            <Link className="flex flex-col text-primary font-bold border-b-2 border-primary pb-1 group whitespace-nowrap" href="/solutions">
              <span className="font-body-base text-body-base">解決方案</span>
              <span className="text-[10px] uppercase tracking-tighter opacity-70">Solutions</span>
            </Link>
            <Link className="flex flex-col text-secondary hover:text-primary transition-colors group whitespace-nowrap" href="/hubs/graphite">
              <span className="font-body-base text-body-base">碳資產管理</span>
              <span className="text-[10px] uppercase tracking-tighter opacity-70">Carbon Assets</span>
            </Link>
            <Link className="flex flex-col text-secondary hover:text-primary transition-colors group whitespace-nowrap" href="#">
              <span className="font-body-base text-body-base">永續洞察</span>
              <span className="text-[10px] uppercase tracking-tighter opacity-70">Insights</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-stack-md shrink-0">
          <button className="hidden sm:block cursor-pointer active:scale-95 duration-150 text-secondary font-label-sm text-label-sm px-2 md:px-4 py-2 whitespace-nowrap">聯繫團隊 <span className="text-[10px] ml-1 opacity-70 italic">Contact</span></button>
          <button className="cursor-pointer active:scale-95 duration-150 bg-primary text-on-primary px-3 md:px-6 py-2 font-label-sm text-label-sm rounded whitespace-nowrap">企業登錄 <span className="hidden md:inline text-[10px] ml-1 opacity-80">Enterprise Login</span></button>
        </div>
      </div>
    </header>
  );
}
