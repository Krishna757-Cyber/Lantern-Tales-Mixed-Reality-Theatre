import assert from 'node:assert';
import { app, server, shutdownServer } from '../server/server.js';

console.log('🧪 Testing Backend API...');

async function testApi() {
  let baseUrl = 'http://localhost:3001';
  let ownServer = false;

  try {
    const check = await fetch('http://localhost:3001/api/health');
    if (!check.ok) throw new Error();
  } catch (e) {
    // Port 3001 not listening yet, start on random port
    await new Promise(r => server.listen(0, r));
    baseUrl = `http://localhost:${server.address().port}`;
    ownServer = true;
  }

  // Test /api/health
  const healthRes = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(healthRes.status, 200, '/api/health status 200');
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'ok', 'health status ok');

  // Test /api/fables
  const fablesRes = await fetch(`${baseUrl}/api/fables`);
  assert.strictEqual(fablesRes.status, 200, '/api/fables status 200');
  const fablesData = await fablesRes.json();
  assert(Array.isArray(fablesData.acts), 'acts should be an array');
  assert.strictEqual(fablesData.acts[0].id, 'act-1', 'act-1 should exist');

  // Test /theatre
  const theatreRes = await fetch(`${baseUrl}/theatre`);
  assert.strictEqual(theatreRes.status, 200, '/theatre should serve 200 OK');

  // Test /api/kathputli/acts
  const actsRes = await fetch(`${baseUrl}/api/kathputli/acts`);
  assert.strictEqual(actsRes.status, 200, '/api/kathputli/acts status 200');
  const actsData = await actsRes.json();
  assert.strictEqual(actsData.count, 5, 'Should return 5 Kathputli folk acts');

  console.log('✅ All backend API tests passed successfully!');

  if (ownServer) {
    shutdownServer();
  }
}

testApi().catch(err => {
  console.error('❌ API Test failed:', err);
  process.exitCode = 1;
});
