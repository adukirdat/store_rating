const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('seed requires an environment password and contains no fixed demo password', () => {
  const seed = fs.readFileSync(path.join(__dirname, '../prisma/seed.js'), 'utf8');
  assert.match(seed, /if \(!demoPassword\).*SEED_DEMO_PASSWORD is required/s);
  assert.doesNotMatch(seed, /DemoPassword@1/);
});

test('initial migration retains the database rating range check', () => {
  const migration = fs.readFileSync(path.join(__dirname, '../prisma/migrations/20260825172244_init/migration.sql'), 'utf8');
  assert.match(migration, /CHECK \("value" BETWEEN 1 AND 5\)/);
});
