import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

// High-fidelity standard emission factors fallback (disaster recovery / offline robustness)
const FALLBACK_FACTORS = [
  {
    _id: 'ef-steel-traditional',
    category: 'scope3',
    name: '傳統高爐鋼鐵 (Blast Furnace Steel)',
    factor: 2.1,
    unit: 'tCO2e/t',
    source: '台灣環境部 6.0.4 版',
    year: 2023
  },
  {
    _id: 'ef-steel-green',
    category: 'scope3',
    name: '電爐低碳綠色鋼鐵 (Green EAF Steel)',
    factor: 0.6,
    unit: 'tCO2e/t',
    source: 'IEA Steel LCA Report',
    year: 2023
  },
  {
    _id: 'ef-aluminum-imported',
    category: 'scope3',
    name: '鋁錠進口原料 (Imported Aluminum)',
    factor: 11.2,
    unit: 'tCO2e/t',
    source: 'EU CBAM Default Values',
    year: 2023
  },
  {
    _id: 'ef-cement-portland',
    category: 'scope3',
    name: '波特蘭水泥 (Portland Cement)',
    factor: 0.82,
    unit: 'tCO2e/t',
    source: 'Ecoinvent 3.9',
    year: 2023
  },
  {
    _id: 'ef-electricity-taiwan',
    category: 'scope2-electricity',
    name: '台灣電力排碳係數 (Taiwan Grid Electricity)',
    factor: 0.495,
    unit: 'kg/kWh',
    source: '經濟部能源署 111 年度',
    year: 2022
  },
  {
    _id: 'ef-electricity-eu',
    category: 'scope2-electricity',
    name: '歐盟平均電力排碳係數 (EU Grid Electricity)',
    factor: 0.251,
    unit: 'kg/kWh',
    source: 'EEA 2023 Report',
    year: 2023
  },
  {
    _id: 'ef-gas-stationary',
    category: 'scope1-stationary',
    name: '固定瓦斯源 (Natural Gas)',
    factor: 1.879,
    unit: 'kg/m³',
    source: '台灣環境部 6.0.4 版',
    year: 2023
  },
  {
    _id: 'ef-diesel-mobile',
    category: 'scope1-mobile',
    name: '車用柴油 (Mobile Diesel Fuel)',
    factor: 2.70,
    unit: 'kg/L',
    source: '台灣環境部 6.0.4 版',
    year: 2023
  }
];

/**
 * GET /api/carbon/factors
 * 排放因子資料庫 API 
 * 
 * 優先自 Sanity 獲取最新政府及官方排放因子數據。
 * 支援無縫降級：當資料庫連線失敗或為空時，自動回傳本地官方預設數據（防崩潰），
 * 提供極高的 B2B 合規說服力與容災防禦。
 */
export async function GET() {
  try {
    const docs = await client.fetch(
      `*[_type == "emissionFactor"] | order(category asc, name asc)`,
      {},
      { useCdn: false, next: { revalidate: 0 } }
    );

    if (!docs || docs.length === 0) {
      console.warn('[Factors API] Sanity returned empty emission factors. Falling back to local values.');
      return NextResponse.json({
        factors: FALLBACK_FACTORS,
        source: 'local_fallback',
        lastUpdated: new Date().toISOString()
      });
    }

    return NextResponse.json({
      factors: docs,
      source: 'sanity_database',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Factors API] Failed to fetch factors, activating disaster recovery fallback:', error.message);
    return NextResponse.json({
      factors: FALLBACK_FACTORS,
      source: 'disaster_recovery_fallback',
      error: error.message,
      lastUpdated: new Date().toISOString()
    });
  }
}
