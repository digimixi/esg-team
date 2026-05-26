import dotenv from 'dotenv';
import { GET } from '../src/app/api/carbon/ticker/route.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Mock global Request, Response, and NextResponse if needed
global.Response = class MockResponse {
  constructor(body, init) {
    this.body = body;
    this.init = init;
  }
  static json(body, init) {
    return new MockResponse(JSON.stringify(body), init);
  }
};

async function runTest() {
  console.log('--- [Testing /api/carbon/ticker GET route] ---');
  try {
    const response = await GET();
    console.log('HTTP Status:', response.init?.status || 200);
    console.log('Response Headers:', response.init?.headers);
    console.log('Response Body:', JSON.parse(response.body));
  } catch (error) {
    console.error('Test execution failed:', error);
  }
  console.log('--- [Test Finished] ---');
}

runTest();
