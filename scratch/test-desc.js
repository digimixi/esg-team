import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

async function testDesc() {
  const url = 'https://www.fengchaocarbon.com/product/highquality-carbon-additive-for-steelmaking-and-casting.html';
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // Look for common content wrappers
  console.log('--- .content ---');
  console.log($('.content').text().trim().substring(0, 200));
  
  console.log('--- article ---');
  console.log($('article').text().trim().substring(0, 200));

  console.log('--- .product-detail ---');
  console.log($('.product-detail').text().trim().substring(0, 200));

  console.log('--- .goods-detail ---');
  console.log($('.goods-detail').text().trim().substring(0, 200));
  
  console.log('--- table ---');
  console.log($('table').html());
}
testDesc();
