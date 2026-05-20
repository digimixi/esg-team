import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

async function test() {
  try {
    console.log('Testing Yahoo Finance fetch for CO2.L...');
    const result = await yahooFinance.quote('CO2.L');
    console.log('Full result object:', {
      regularMarketPrice: result.regularMarketPrice,
      regularMarketChangePercent: result.regularMarketChangePercent,
      currency: result.currency,
      exchangeName: result.exchangeName
    });
  } catch (error) {
    console.error('Yahoo fetch failed:', error);
  }
}

test();
