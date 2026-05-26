const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../src/app/hubs/[hubSlug]');
const files = [
    'page.js',
    'products/page.js',
    'market/page.js',
    'supply-chain/page.js'
];

const stickyNavCode = `
      {/* Sticky Secondary Navigation */}
      <StickyJumpNav links={[
        { label: '解決方案', href: \`/hubs/\${hubSlug}#solutions\`, isPrimary: true },
        { label: '市場實時指數', href: \`/hubs/\${hubSlug}#market-index\` },
        { label: '解碼核心資產', href: \`/hubs/\${hubSlug}#education\` },
        { label: '資源目錄', href: \`/hubs/\${hubSlug}#products\` },
        { label: '供應鏈情報', href: \`/hubs/\${hubSlug}#intelligence\` }
      ]} />
`;

const importCode = `import StickyJumpNav from '@/components/StickyJumpNav';\n`;

for (const file of files) {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) {
        console.log(`Skipping ${file} - does not exist`);
        continue;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');

    // Add import if missing
    if (!content.includes('import StickyJumpNav')) {
        content = content.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\n" + importCode);
    }

    if (file === 'page.js') {
        // Fix the home page anchors
        content = content.replace(
            /<StickyJumpNav links=\{\[\s*\{\s*label:\s*'解決方案',\s*href:\s*'#solutions',\s*isPrimary:\s*true\s*\},[\s\S]*?\]\}\s*\/>/m,
            stickyNavCode.trim()
        );
    } else {
        // Inject after HubHeader in sub-pages
        if (!content.includes('<StickyJumpNav links={')) {
            content = content.replace(
                /(<HubHeader[\s\S]*?\/>)/,
                `$1\n${stickyNavCode}`
            );
        }
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
}
