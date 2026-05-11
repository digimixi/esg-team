import YahooFinance from 'yahoo-finance2';

// 在 v3 版本中，default 導出的是類別，需要先 new 出實例
const yahooFinance = new YahooFinance();

/**
 * Yahoo Finance Provider
 * 負責從 Yahoo Finance 抓取期貨或指數資料
 */
export const yahooProvider = {
  name: 'yahoo_finance',
  
  async fetchData(symbol) {
    try {
      const result = await yahooFinance.quote(symbol);
      
      return {
        value: result.regularMarketPrice,
        trendPercentage: (result.regularMarketChangePercent > 0 ? '+' : '') + result.regularMarketChangePercent.toFixed(2) + '%',
        trendStatus: result.regularMarketChangePercent > 0 ? 'up' : (result.regularMarketChangePercent < 0 ? 'down' : 'neutral'),
        updatedAt: new Date().toISOString(),
        currency: result.currency,
        exchange: result.exchangeName
      };
    } catch (error) {
      console.error(`[Yahoo Provider] Error fetching ${symbol}:`, error.message);
      return null;
    }
  },

  async fetchHistory(symbol) {
    try {
      const period1 = new Date();
      period1.setDate(period1.getDate() - 10);
      
      const result = await yahooFinance.historical(symbol, { 
        period1: period1.toISOString().split('T')[0],
        interval: '1d'
      });
      
      return result.map(item => item.adjClose || item.close).slice(-7);
    } catch (error) {
      console.error(`[Yahoo Provider] Error fetching history for ${symbol}:`, error.message);
      return [];
    }
  }
};
