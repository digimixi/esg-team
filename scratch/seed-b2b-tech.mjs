// Using native fetch
async function seedTech() {
  const projectId = '2euox6d1';
  const dataset = 'production';
  const token = 'skSfdwN6ajKMSqJ2kjAoB7bfdAcdVsxy9HYxFYoGYH87ZlR9fvtL56ZHRRvdkSNKgXUOnjIFDtUXmaNkw8k4QicvOyeExTIWOtRLgUO3pqrClRdfdXVlYsG1QDJObDo6T8N4kYayw72q74M5DoKpeVLxuOMQrVKOHeM0nFuXD2va1wMjz98w';
  
  const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/mutate/${dataset}`;

  const mutation = {
    mutations: [
      {
        create: {
          _type: 'systemTech',
          title: 'B2B ERP 自動直連 API (OpenAPI)',
          category: 'ingest',
          path: 'src/app/api/erp/ingest/route.js',
          status: 'active',
          benefit: '允許高階企業客戶 (Enterprise) 或其工廠的 EMS/ERP 系統自動同步碳排放數據，徹底消除人工對接的時間與錯誤率。具備 API Key 驗證與 Rate-limiting 流量防禦機制。',
          deployedAt: new Date().toISOString().split('T')[0]
        }
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(mutation)
    });
    
    const data = await res.json();
    console.log('✅ Successfully seeded B2B ERP Tech:', data);
  } catch (error) {
    console.error('❌ Failed to seed:', error);
  }
}

seedTech();
