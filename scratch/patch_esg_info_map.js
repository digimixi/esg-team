import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-05-11',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN
});

async function main() {
  try {
    console.log('Fetching esg_info hub (drafts and published)...');
    
    // Fetch all documents matching the slug, both draft and published
    const hubs = await client.fetch('*[_type == "hub" && slug.current == "esg_info"]');
    
    if (!hubs || hubs.length === 0) {
      console.error('Error: Could not find hub with slug "esg_info".');
      return;
    }

    const valueChainMapData = {
      isActive: true,
      mapTitle: '台灣鋼鐵與鑄造產業鏈 ESG 互動地圖',
      mapSubtitle: 'ESG 顧問專用戰略視圖：整合產業佈局、關鍵物資與循環經濟切入點',
      columns: [
        {
          _key: 'col1',
          title: '上游：原料與電爐煉鋼',
          topColor: 'bg-amber-600', 
          items: [
            { _key: 'item1', label: '石墨電極 (關鍵耗材)', type: 'green' },
            { _key: 'item2', label: '增碳劑 (成分控制)', type: 'green' }
          ],
          descriptionTitle: '代表廠商：',
          companies: [
            '中鋼、中龍鋼鐵 (高爐)',
            '豐興鋼鐵、東和鋼鐵 (電爐)',
            '威致、海光、台灣鋼鐵集團'
          ]
        },
        {
          _key: 'col2',
          title: '中游：軋延與鋼材加工',
          topColor: 'bg-esg-emerald',
          items: [
            { _key: 'item3', label: '鋼捲/鋼板加工', type: 'green' }
          ],
          descriptionTitle: '代表廠商：',
          companies: [
            '燁輝、盛餘 (鍍鋅/烤漆)',
            '中鴻鋼鐵 (熱軋)',
            '華新麗華 (特殊鋼)',
            '允強、彰源 (不鏽鋼)'
          ]
        },
        {
          _key: 'col3',
          title: '中游：鑄造業 (精密加工)',
          topColor: 'bg-indigo-600',
          items: [
            { _key: 'item4', label: '石墨坩堝 (熔煉必備)', type: 'green' },
            { _key: 'item5', label: '石墨電極 (感應爐/電爐)', type: 'green' },
            { _key: 'item6', label: '增碳劑 (成分精準調控)', type: 'green' },
            { _key: 'item7', label: '廢砂與爐渣循環處理', type: 'blue' }
          ],
          descriptionTitle: '指標廠商：',
          companies: [
            '永冠 (風電/鑄造)',
            '巧新 (鍛造輪圈)',
            '健信 (鋁輪圈)',
            '精華鑄造、大同鑄造',
            '美合、各類精密鑄造廠'
          ]
        },
        {
          _key: 'col4',
          title: '下游：應用與循環經濟',
          topColor: 'bg-cyan-600', 
          items: [
            { _key: 'item8', label: '鋼渣回收應用', type: 'blue' },
            { _key: 'item9', label: '石墨殘極循環', type: 'blue' }
          ],
          descriptionTitle: '代表廠商/機構：',
          companies: [
            '台灣鋼聯 (ESG指標)',
            '春雨、三星五金 (扣件)',
            '大成鋼、中鋼構'
          ]
        }
      ]
    };

    // Patch every matching document (handles both draft and published)
    for (const hub of hubs) {
      console.log(`Patching hub: ${hub.title} (${hub._id})`);
      await client.patch(hub._id)
        .set({ valueChainMap: valueChainMapData })
        .commit();
    }

    console.log('Success! Data patched in all drafts and published versions.');
  } catch (error) {
    console.error('Error patching data:', error.message);
  }
}

main();
