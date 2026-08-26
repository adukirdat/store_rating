const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');
const jwt = require('jsonwebtoken');

let lastStoreFindQuery;

const fakePrisma = {
  $disconnect: async () => {},
  $queryRaw: async () => [{ ready: 1 }],
  user: {
    findUnique: async ({ where }) => {
      if (where.id === '00000000-0000-4000-8000-000000000002') {
        return { id: where.id, role: 'STORE_OWNER', ownedStore: null };
      }

      if (where.id === '00000000-0000-4000-8000-000000000007') {
        return { id: where.id, role: 'STORE_OWNER', ownedStore: { id: '00000000-0000-4000-8000-000000000012' } };
      }

      if (where.id) {
        return { id: where.id, role: 'NORMAL_USER', ownedStore: null };
      }

      return null;
    },
    create: async ({ data }) => ({ id: '00000000-0000-4000-8000-000000000099', ...data }),
  },
  store: {
    findUnique: async (query) => {
      const { where } = query;
      lastStoreFindQuery = query;
      if (where.ownerId) {
        return {
          id: '00000000-0000-4000-8000-000000000010',
          name: 'Verified Assignment Store',
          email: 'store@example.test',
          address: '123 Verified Assignment Address',
          ratings: [
            { value: 5, user: { id: 'rating-user-1', name: 'A Rater With A Valid Name', email: 'a@example.test', address: 'Rating Address' } },
          ],
        };
      }

      return null;
    },
    create: async ({ data }) => ({ id: '00000000-0000-4000-8000-000000000011', ...data }),
  },
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

test('only an administrator can create a Store Owner through the admin endpoint', async () => {
  const adminToken = jwt.sign({ userId: '00000000-0000-4000-8000-000000000003', role: 'ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1m' });
  const normalUserToken = jwt.sign({ userId: '00000000-0000-4000-8000-000000000004', role: 'NORMAL_USER' }, process.env.JWT_SECRET, { expiresIn: '1m' });
  const payload = {
    name: 'A Store Owner With Valid Name',
    email: 'new-owner@example.test',
    address: '123 Valid Assignment Address',
    password: 'ValidPass@1',
    role: 'STORE_OWNER',
  };

  const created = await fetch(`${baseUrl}/api/admin/users`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify(payload),
  });
  const forbidden = await fetch(`${baseUrl}/api/admin/users`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${normalUserToken}` }, body: JSON.stringify(payload),
  });

  assert.equal(created.status, 201);
  assert.equal((await created.json()).data.user.role, 'STORE_OWNER');
  assert.equal(forbidden.status, 403);
});

test('store creation enforces name boundaries and safe owner assignment', async () => {
  const adminToken = jwt.sign({ userId: '00000000-0000-4000-8000-000000000005', role: 'ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1m' });
  const request = async (name, ownerId = '00000000-0000-4000-8000-000000000002') => fetch(`${baseUrl}/api/admin/stores`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ name, email: 'assignment-store@example.test', address: '123 Valid Assignment Address', ownerId }),
  });

  assert.equal((await request('x'.repeat(19))).status, 400);
  assert.equal((await request('x'.repeat(20))).status, 201);
  assert.equal((await request('x'.repeat(60))).status, 201);
  assert.equal((await request('x'.repeat(61))).status, 400);
  assert.equal((await request('x'.repeat(20), '00000000-0000-4000-8000-000000000006')).status, 400);
  assert.equal((await request('x'.repeat(20), '00000000-0000-4000-8000-000000000007')).status, 409);
});

test('owner dashboard sorting is allowlisted and remains bound to the authenticated owner', async () => {
  const ownerToken = jwt.sign({ userId: '00000000-0000-4000-8000-000000000002', role: 'STORE_OWNER' }, process.env.JWT_SECRET, { expiresIn: '1m' });
  const request = (query) => fetch(`${baseUrl}/api/owner/dashboard?${query}`, { headers: { Authorization: `Bearer ${ownerToken}` } });

  assert.equal((await request('sortBy=name&order=asc')).status, 200);
  assert.equal((await request('sortBy=name&order=desc')).status, 200);
  assert.equal((await request('sortBy=email&order=asc')).status, 200);
  assert.equal((await request('sortBy=email&order=desc')).status, 200);
  assert.equal((await request('sortBy=rating&order=asc')).status, 200);
  assert.equal((await request('sortBy=rating&order=desc')).status, 200);
  assert.equal((await request('sortBy=updatedAt&order=desc')).status, 400);
  assert.equal((await request('sortBy=name&order=sideways')).status, 400);
  const manipulatedStoreId = await request('sortBy=name&order=asc&storeId=00000000-0000-4000-8000-000000000999');
  assert.equal(manipulatedStoreId.status, 200);
  assert.equal((await manipulatedStoreId.json()).data.store.id, '00000000-0000-4000-8000-000000000010');
  assert.deepEqual(lastStoreFindQuery.where, { ownerId: '00000000-0000-4000-8000-000000000002' });
  assert.deepEqual(lastStoreFindQuery.select.ratings.orderBy, { user: { name: 'asc' } });
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
