import { yahooProvider } from './providers/yahoo.js';

// 註冊所有可用的供應商
const providers = {
  [yahooProvider.name]: yahooProvider,
  // 未來可以在這裡新增更多供應商，例如：
  // 'investing_scraper': investingProvider,
};

/**
 * 市場數據引擎
 * 負責根據配置調度不同的供應商抓取數據
 */
export const MarketDataEngine = {
  /**
   * 抓取單個指數的數據
   * @param {Object} config - 指數配置 { provider: string, symbol: string }
   */
  async fetchIndex(config) {
    const provider = providers[config.provider];
    
    if (!provider) {
      throw new Error(`Provider "${config.provider}" not found.`);
    }
    
    console.log(`[Engine] Fetching data for ${config.symbol} using ${config.provider}...`);
    return await provider.fetchData(config.symbol);
  },

  /**
   * 抓取歷史數據
   */
  async fetchHistory(config) {
    const provider = providers[config.provider];
    if (!provider || !provider.fetchHistory) return [];
    return await provider.fetchHistory(config.symbol);
  }
};
