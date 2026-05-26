const fs = require('fs');
const files = ['src/app/hubs/[hubSlug]/market/page.js', 'src/app/hubs/[hubSlug]/supply-chain/page.js'];
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('import StickyJumpNav')) {
    content = content.replace(/import HubHeader from '@\/components\/HubHeader';/, "import HubHeader from '@/components/HubHeader';\nimport StickyJumpNav from '@/components/StickyJumpNav';");
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
}
