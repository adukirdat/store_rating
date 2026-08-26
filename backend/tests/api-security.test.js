const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');
const jwt = require('jsonwebtoken');

const fakePrisma = {
  $disconnect: async () => {},
  $queryRaw: async () => [{ ready: 1 }],
  user: { findUnique: async () => null },
};

const prismaPath = require.resolve('../src/config/prisma');
require.cache[prismaPath] = { id: prismaPath, filename: prismaPath, loaded: true, exports: fakePrisma };
const { app } = require('../src/server');

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => new Promise((resolve) => server.close(resolve)));

test('startup requires JWT_SECRET before serving the API', () => {
  const script = `
    const dotenvPath = require.resolve('dotenv');
    require.cache[dotenvPath] = { exports: { config: () => ({}) } };
    process.env.DATABASE_URL = 'postgresql://test';
    delete process.env.JWT_SECRET;
    require('./src/server');
  `;
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    env: { DATABASE_URL: 'postgresql://test' },
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /JWT_SECRET must be configured/);
});

test('health, readiness, and security headers are available', async () => {
  const health = await fetch(`${baseUrl}/api/health`);
  const ready = await fetch(`${baseUrl}/api/ready`);

  assert.equal(health.status, 200);
  assert.equal(ready.status, 200);
  assert.equal(health.headers.get('x-powered-by'), null);
  assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
});

test('readiness returns a safe 503 when the database is unavailable', async () => {
  fakePrisma.$queryRaw = async () => { throw new Error('database unavailable'); };
  const response = await fetch(`${baseUrl}/api/ready`);
  fakePrisma.$queryRaw = async () => [{ ready: 1 }];

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    success: false,
    message: 'Store Rating API is not ready.',
    errors: [],
  });
});

test('malformed JSON and protected routes return safe status codes', async () => {
  const malformed = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  });
  const unauthenticated = await fetch(`${baseUrl}/api/stores`);
  const missing = await fetch(`${baseUrl}/api/missing`);

  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).message, 'Invalid JSON request body.');
  assert.equal(unauthenticated.status, 401);
  assert.equal(missing.status, 404);
});

test('wrong role is forbidden and invalid credentials are rejected', async () => {
  const token = jwt.sign({ userId: '00000000-0000-4000-8000-000000000001', role: 'NORMAL_USER' }, process.env.JWT_SECRET, { expiresIn: '1m' });
  const forbidden = await fetch(`${baseUrl}/api/admin/dashboard-stats`, { headers: { Authorization: `Bearer ${token}` } });
  const invalidLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'test@example.com', password: 'x' }),
  });

  assert.equal(forbidden.status, 403);
  assert.equal(invalidLogin.status, 401);
});

test('login rate limiting returns a safe 429 response', async () => {
  for (let attempt = 0; attempt < 9; attempt += 1) {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'limit@example.com', password: 'x' }),
    });
    assert.equal(response.status, 401);
  }

  const limited = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'limit@example.com', password: 'x' }),
  });
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).message, 'Too many authentication attempts. Please try again later.');
});
