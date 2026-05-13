import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// 使用函數動態獲取配置，避免 Next.js 在編譯時將變數硬編碼
const getClientConfig = () => {
  const token = process.env.SANITY_WRITE_TOKEN;
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'build-time-placeholder',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-05-07',
    useCdn: token ? false : true, // 寫入時必須關閉 CDN 以確保數據即時性
    token: token,
  };
};

export const client = createClient(getClientConfig());
