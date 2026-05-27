import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

async function testImg() {
  const url = 'https://www.fengchaocarbon.com/product/highquality-carbon-additive-for-steelmaking-and-casting.html';
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // print the HTML around the "class: img"
  console.log($('img.img').parent().html());
  console.log($('img.small').parent().html());
}
testImg();
