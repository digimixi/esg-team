import Link from 'next/link';

export default function HubNavbar({ hubSlug, hubTitle, activeTab, contactUrl, quoteButtonText }) {
  const tabs = [
    { label: '首頁', path: `/hubs/${hubSlug}` },
    { label: '產品目錄', path: `/hubs/${hubSlug}/products` },
    { label: '市場情報', path: `/hubs/${hubSlug}/market` },
    { label: '供應鏈', path: `/hubs/${hubSlug}/supply-chain` },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center px-4 md:px-margin h-16 max-w-container-max mx-auto">
        <div className="flex items-center gap-2 md:gap-stack-lg min-w-0">
          <Link href="/" className="text-body-base md:text-headline-md font-headline-md text-primary flex items-center gap-1 shrink-0">
            esg<span className="text-esg-emerald">.</span>team
          </Link>
          <span className="text-outline-variant shrink-0">|</span>
          <Link href={`/hubs/${hubSlug}`} className="text-label-sm md:text-body-base font-bold text-secondary truncate hover:text-primary transition-colors">
            {hubTitle || 'Industrial Hub'}
          </Link>
          <nav className="hidden lg:flex gap-4 xl:gap-gutter ml-2 xl:ml-stack-lg">
            {tabs.map((tab) => (
              <Link 
                key={tab.path}
                href={tab.path}
                className={`${
                  activeTab === tab.label 
                    ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                    : 'text-secondary hover:text-primary transition-colors'
                } font-body-base text-sm whitespace-nowrap`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a href={contactUrl || '#'} className="px-4 py-2 bg-primary text-on-primary font-label-sm text-xs rounded-lg hover:shadow-lg transition-all active:scale-95">
            {quoteButtonText || '索取報價'}
          </a>
        </div>
      </div>
    </header>
  );
}
