import * as cheerio from 'cheerio';
import { createClient } from '@sanity/client';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'c3k0p398',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Translation dictionary for common terms
const translateTitle = (engTitle) => {
  let title = engTitle;
  if (title.toLowerCase().includes('electrode')) title = '石墨電極 - ' + title;
  else if (title.toLowerCase().includes('crucible')) title = '石墨坩堝 - ' + title;
  else if (title.toLowerCase().includes('additive') || title.toLowerCase().includes('carburant')) title = '增碳劑 - ' + title;
  else if (title.toLowerCase().includes('scrap') || title.toLowerCase().includes('fines')) title = '石墨碎/石墨粉 - ' + title;
  else if (title.toLowerCase().includes('block')) title = '石墨塊 - ' + title;
  return title;
};

const mapCategory = (href) => {
  if (href.includes('electrode')) return 'strategic_materials';
  if (href.includes('crucible')) return 'specialty_consumables';
  if (href.includes('additive') || href.includes('carburant') || href.includes('scrap')) return 'circular_resources';
  return 'strategic_materials'; // default
};

async function uploadImageFromUrl(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop() || 'image.jpg'
    });
    return asset._id;
  } catch (err) {
    console.error('Failed to upload image:', imageUrl);
    return null;
  }
}

async function scrapeAndIngest() {
  console.log('1. Fetching product lists across all pages...');
  const baseUrl = 'https://www.fengchaocarbon.com';
  const productLinks = [];

  // Loop through pages 1 to 6
  for (let page = 1; page <= 6; page++) {
    const listRes = await fetch(`${baseUrl}/product?page=${page}`);
    const listHtml = await listRes.text();
    const $ = cheerio.load(listHtml);

    // Find all specific product pages (ending in .html)
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.endsWith('.html') && href.includes('/product/')) {
        const fullUrl = href.startsWith('http') ? href : baseUrl + href;
        if (!productLinks.includes(fullUrl)) {
          productLinks.push(fullUrl);
        }
      }
    });
  }

  console.log(`Found ${productLinks.length} products. Starting ingestion...`);

  // Process all products
  for (const url of productLinks) {
    console.log(`\n-> Scraping: ${url}`);
    try {
      const prodRes = await fetch(url);
      const prodHtml = await prodRes.text();
      const $p = cheerio.load(prodHtml);

      const engTitle = $p('h1').first().text().trim() || $p('title').text().replace('- Fengchao Carbon', '').trim();
      if (!engTitle) continue;

      const zhTitle = translateTitle(engTitle);
      
      // Get main image - fix selector to grab product img instead of logo
      let imgUrl = $p('img.small').attr('src') || $p('img.img').attr('src') || $p('.product-image img').attr('src');
      if (imgUrl) {
        if (imgUrl.startsWith('//')) {
          imgUrl = 'https:' + imgUrl;
        } else if (!imgUrl.startsWith('http')) {
          imgUrl = baseUrl + (imgUrl.startsWith('/') ? '' : '/') + imgUrl;
        }
      }

      // Upload image
      let imageAssetId = null;
      if (imgUrl) {
        // Strip out resize parameters so we get the full image if possible
        const cleanImgUrl = imgUrl.split('?')[0];
        console.log(`Uploading image: ${cleanImgUrl}`);
        imageAssetId = await uploadImageFromUrl(cleanImgUrl);
      }

      // Extract specifications from .product-base-info-list
      const specifications = [];
      $p('.product-base-info-list > div').each((i, el) => {
        const labelText = $p(el).find('span').text().trim().replace('：', '').replace(':', '');
        const fullText = $p(el).text().trim();
        // Remove label text from full text to get the value
        const valueText = fullText.replace($p(el).find('span').text(), '').trim();
        if (labelText && valueText) {
          specifications.push({
            _key: `spec-${i}`,
            label: labelText,
            value: valueText
          });
        }
      });

      // Get true description from #tab-2 or fallback to #tab-1 paragraphs
      let desc = $p('#tab-2').text().replace(/\s+/g, ' ').trim();
      if (!desc) {
        desc = $p('.ds-markdown-paragraph').text().replace(/\s+/g, ' ').trim();
      }
      if (!desc) {
        desc = engTitle; // Last resort fallback
      }

      // Create draft document
      const uniqueSlug = url.split('/').pop().replace('.html', '');
      const doc = {
        _type: 'product',
        _id: `drafts.imported-${uniqueSlug.substring(0, 50).replace(/[^a-zA-Z0-9-]/g, '')}`, // Stable unique ID based on URL slug
        title: zhTitle,
        subtitle: engTitle,
        slug: { _type: 'slug', current: uniqueSlug },
        category: mapCategory(url),
        description: desc,
        specifications: specifications,
        esgTags: url.includes('scrap') || url.includes('additive') ? ['recovery', 'low_carbon'] : ['energy_efficiency'],
      };

      if (imageAssetId) {
        doc.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } };
      }

      console.log(`Creating document for: ${zhTitle}`);
      await client.createOrReplace(doc); // Use createOrReplace to overwrite bad ones
      console.log('✅ Success!');
      
    } catch (err) {
      console.error(`❌ Error scraping ${url}:`, err.message);
    }
  }
  
  console.log('\n🎉 All pages ingestion complete! Check Sanity Studio Drafts.');
}

scrapeAndIngest();
