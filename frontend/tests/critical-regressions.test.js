import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  getResilienceApiMessage,
  normalizeApiError,
  shouldClearSessionOnUnauthorized,
} from '../src/api/apiError.js';

const storage = new Map();
global.window = { localStorage: {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
} };
const { clearStoredAuth, getStoredAuth, storeAuth } = await import('../src/utils/authStorage.js');

test('timeout and rate-limit errors normalize to safe messages', () => {
  const timeout = normalizeApiError({ code: 'ECONNABORTED' });
  const limited = normalizeApiError({ response: { status: 429, data: { message: 'Too many authentication attempts. Please try again later.' } } });

  assert.deepEqual(timeout, { status: 408, message: 'The request took too long. Please try again.', errors: [] });
  assert.equal(getResilienceApiMessage(limited), 'Too many authentication attempts. Please try again later.');
});

test('H-01 preserves the session only for incorrect current password', () => {
  const passwordError = { status: 401, message: 'Current password is incorrect.' };
  assert.equal(shouldClearSessionOnUnauthorized({ config: { method: 'patch', url: '/auth/update-password' } }, passwordError), false);
  assert.equal(shouldClearSessionOnUnauthorized({ config: { method: 'get', url: '/stores' } }, { status: 401, message: 'Authentication token has expired.' }), true);
});

test('malformed stored authentication is cleared safely', () => {
  storage.set('store-rating-auth', '{invalid');
  assert.equal(getStoredAuth(), null);
  assert.equal(storage.has('store-rating-auth'), false);

  storeAuth({ token: 'test-token', user: { role: 'NORMAL_USER' } });
  assert.equal(getStoredAuth().token, 'test-token');
  clearStoredAuth();
  assert.equal(getStoredAuth(), null);
});

test('M-01 request sequence guards remain on all list pages', () => {
  for (const page of ['AdminUsersPage.jsx', 'AdminStoresPage.jsx']) {
    const source = fs.readFileSync(path.join('src/pages/admin', page), 'utf8');
    assert.match(source, /latestRequest\.current/);
  }

  const source = fs.readFileSync('src/pages/user/UserStoresPage.jsx', 'utf8');
  assert.match(source, /latestRequest\.current/);
});
