import * as cheerio from 'cheerio';

async function scrapeFengchao() {
  const url = 'https://www.fengchaocarbon.com/product';
  console.log('Fetching', url);
  const response = await fetch(url); // fetch is native in Node 22
  const html = await response.text();
  const $ = cheerio.load(html);

  const links = [];
  
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (href && text.length > 0) {
      if (!links.find(c => c.href === href)) {
        links.push({ text, href });
      }
    }
  });

  console.log('All links containing product categories:');
  const catLinks = links.filter(l => l.href.includes('product') || l.href.includes('graphite') || l.href.includes('carbon'));
  console.log(catLinks);
}

scrapeFengchao().catch(console.error);
