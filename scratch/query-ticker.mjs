// Native fetch is available globally in Node 22

async function runQuery() {
  console.log('--- [Fetching /api/carbon/ticker from running server] ---');
  // Attempt standard port 3000
  const url = 'http://localhost:3000/api/carbon/ticker';
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed to fetch from ${url}. HTTP Status: ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log('Successfully connected to Live Ticker API!');
    console.log('Response status:', res.status);
    console.log('Response content:', data);
  } catch (error) {
    console.error(`Could not connect to ${url}:`, error.message);
  }
}

runQuery();
