import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

async function testDesc2() {
  const url = 'https://www.fengchaocarbon.com/product/highquality-carbon-additive-for-steelmaking-and-casting.html';
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log($('.product-detail').html());
}
testDesc2();
