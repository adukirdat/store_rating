const assert = require('node:assert/strict');
const test = require('node:test');
const bcrypt = require('bcryptjs');
const { BootstrapConfigurationError, ensureProductionAdmin, getBootstrapConfiguration } = require('../src/services/adminBootstrap');

const productionEnvironment = {
  NODE_ENV: 'production',
  ADMIN_BOOTSTRAP_EMAIL: 'production-admin@example.test',
  ADMIN_BOOTSTRAP_PASSWORD: 'ValidPass@1',
};

test('production bootstrap fails safely when its password is missing', () => {
  assert.throws(() => getBootstrapConfiguration({ NODE_ENV: 'production', ADMIN_BOOTSTRAP_EMAIL: 'admin@example.test' }), (error) => error instanceof BootstrapConfigurationError && /ADMIN_BOOTSTRAP_PASSWORD/.test(error.message));
});

test('production bootstrap creates only a bcrypt-hashed ADMIN account', async () => {
  let createdUser;
  const prismaClient = { user: { findUnique: async () => null, create: async ({ data }) => { createdUser = data; return data; } } };
  const result = await ensureProductionAdmin({ environment: productionEnvironment, prismaClient });
  assert.deepEqual(result, { skipped: false, created: true });
  assert.equal(createdUser.role, 'ADMIN');
  assert.notEqual(createdUser.password, productionEnvironment.ADMIN_BOOTSTRAP_PASSWORD);
  assert.equal(await bcrypt.compare(productionEnvironment.ADMIN_BOOTSTRAP_PASSWORD, createdUser.password), true);
});

test('production bootstrap is idempotent and does not alter an existing ADMIN', async () => {
  let createCalls = 0;
  const prismaClient = { user: { findUnique: async () => ({ role: 'ADMIN' }), create: async () => { createCalls += 1; } } };
  const result = await ensureProductionAdmin({ environment: productionEnvironment, prismaClient });
  assert.deepEqual(result, { skipped: false, created: false });
  assert.equal(createCalls, 0);
});

test('production bootstrap refuses to modify a non-admin account', async () => {
  for (const role of ['NORMAL_USER', 'STORE_OWNER']) {
    const prismaClient = { user: { findUnique: async () => ({ role }), create: async () => assert.fail('must not create') } };
    await assert.rejects(ensureProductionAdmin({ environment: productionEnvironment, prismaClient }), (error) => error instanceof BootstrapConfigurationError && /non-admin/.test(error.message));
  }
});

test('bootstrap is skipped outside production without requiring bootstrap secrets', async () => {
  assert.deepEqual(await ensureProductionAdmin({ environment: { NODE_ENV: 'development' } }), { skipped: true, created: false });
});
