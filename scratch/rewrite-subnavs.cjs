const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/app/hubs/[hubSlug]');

// 1. Rewrite market/page.js
const marketFile = path.join(dir, 'market/page.js');
let marketContent = fs.readFileSync(marketFile, 'utf8');
marketContent = marketContent.replace(/<StickyJumpNav links=\{\[[\s\S]*?\]\}\s*\/>/, `<StickyJumpNav links={[
        { label: '解決方案', href: \`/hubs/\${hubSlug}#solutions\`, isPrimary: true },
        { label: '市場實時指數', href: '#indices' },
        { label: '價格走勢圖', href: '#chart' },
        { label: 'AI 專家簡報', href: '#ai-briefing' },
        { label: '市場展望', href: '#outlook' }
      ]} />`);
marketContent = marketContent.replace(/<div className="mt-\[104px\] lg:mt-16">/, '<div id="indices" className="mt-[104px] lg:mt-16 scroll-mt-32">');
marketContent = marketContent.replace(/<div className="bg-white\/5 rounded-2xl border border-white\/10 p-6 md:p-8">/, '<div id="chart" className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 scroll-mt-32">');
marketContent = marketContent.replace(/<div className="bg-primary text-on-primary p-6">/, '<div id="ai-briefing" className="bg-primary text-on-primary p-6 scroll-mt-32">');
marketContent = marketContent.replace(/<div className="bg-surface-container-highest border border-outline-variant p-6">/, '<div id="outlook" className="bg-surface-container-highest border border-outline-variant p-6 scroll-mt-32">');
fs.writeFileSync(marketFile, marketContent);

// 2. Rewrite supply-chain/page.js
const supplyChainFile = path.join(dir, 'supply-chain/page.js');
let scContent = fs.readFileSync(supplyChainFile, 'utf8');
scContent = scContent.replace(/<StickyJumpNav links=\{\[[\s\S]*?\]\}\s*\/>/, `<StickyJumpNav links={[
        { label: '解決方案', href: \`/hubs/\${hubSlug}#solutions\`, isPrimary: true },
        { label: '碳排試算器', href: '#cbam-calculator' },
        { label: '碳信任帳本', href: '#trust-ledger' },
        { label: '服務模組', href: '#service-modules' },
        { label: '認證夥伴', href: '#partners' }
      ]} />`);
scContent = scContent.replace(/\{\/\* CBAM Simulator Section \*\/\}\s*<section className="mb-20">/g, '{/* CBAM Simulator Section */}\n          <section id="cbam-calculator" className="mb-20 scroll-mt-32">');
scContent = scContent.replace(/\{\/\* Scope 3 Carbon Trust Ledger Section \*\/\}\s*<section className="mb-20">/g, '{/* Scope 3 Carbon Trust Ledger Section */}\n          <section id="trust-ledger" className="mb-20 scroll-mt-32">');
scContent = scContent.replace(/\{\/\* Service Modules \*\/\}\s*<section className="mb-20">/g, '{/* Service Modules */}\n          <section id="service-modules" className="mb-20 scroll-mt-32">');
scContent = scContent.replace(/\{\/\* Partner Directory \*\/\}\s*<section className="mb-stack-lg">/g, '{/* Partner Directory */}\n          <section id="partners" className="mb-stack-lg scroll-mt-32">');
fs.writeFileSync(supplyChainFile, scContent);

// 3. Rewrite products/page.js
const productsFile = path.join(dir, 'products/page.js');
let prodContent = fs.readFileSync(productsFile, 'utf8');
prodContent = prodContent.replace(/<StickyJumpNav links=\{\[[\s\S]*?\]\}\s*\/>/, `<StickyJumpNav links={[
        { label: '解決方案', href: \`/hubs/\${hubSlug}#solutions\`, isPrimary: true },
        { label: '資源目錄', href: '#catalog' }
      ]} />`);
prodContent = prodContent.replace(/<section className="py-12">/, '<section id="catalog" className="py-12 scroll-mt-32">');
fs.writeFileSync(productsFile, prodContent);

// 4. Rewrite page.js
const homeFile = path.join(dir, 'page.js');
let homeContent = fs.readFileSync(homeFile, 'utf8');
homeContent = homeContent.replace(/<StickyJumpNav links=\{\[[\s\S]*?\]\}\s*\/>/, `<StickyJumpNav links={[
        { label: '解決方案', href: '#solutions', isPrimary: true },
        { label: '市場實時指數', href: '#market-index' },
        { label: '解碼核心資產', href: '#education' },
        { label: '資源目錄', href: '#products' },
        { label: '供應鏈情報', href: '#intelligence' }
      ]} />`);
fs.writeFileSync(homeFile, homeContent);

console.log("All StickyJumpNavs updated with clean, specific local anchors.");
